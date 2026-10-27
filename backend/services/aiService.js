const https = require('https');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Force IPv4 lookup first to prevent Windows dual-stack IPv6 socket timeouts
try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}

// Ensure environment variables are loaded securely
try {
  const backendEnv = path.join(__dirname, '..', '.env');
  const rootEnv = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(backendEnv)) require('dotenv').config({ path: backendEnv });
  if (fs.existsSync(rootEnv)) require('dotenv').config({ path: rootEnv, override: false });
  require('dotenv').config();
} catch (e) {}

class AIService {
  /**
   * Securely retrieve the active API key without logging or exposing it
   */
  static getApiKey() {
    return (process.env.GEMINI_API_KEY || process.env.AI_API_KEY || '').trim();
  }

  /**
   * Get preferred or configured Gemini model
   */
  static getPreferredModel() {
    return (process.env.GEMINI_MODEL || 'gemini-flash-lite-latest').trim();
  }

  /**
   * Check if live AI is configured
   */
  static isLiveAiConfigured() {
    const key = this.getApiKey();
    return Boolean(key && key.length > 5);
  }

  /**
   * Get AI integration status
   */
  static getStatus() {
    const isConfigured = this.isLiveAiConfigured();
    return {
      configured: isConfigured,
      provider: isConfigured ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'none'),
      model: isConfigured ? this.getPreferredModel() : null,
      mode: isConfigured ? 'live' : 'offline'
    };
  }

  /**
   * Main AI Chat completion
   */
  static async generateChatResponse(userMessage, conversationHistory = []) {
    const apiKey = this.getApiKey();

    if (apiKey) {
      try {
        const geminiRes = await this.callGeminiApi(userMessage, conversationHistory);
        if (geminiRes && geminiRes.trim()) {
          return {
            reply: geminiRes.trim(),
            isLive: true,
            model: this.getPreferredModel()
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to resilient engine:', err.message);
      }
    }

    // High-Fidelity Domain Specific Fallback Intelligence
    return {
      reply: this.getHeuristicChatResponse(userMessage, conversationHistory),
      isLive: false,
      model: 'offline-fallback'
    };
  }

  /**
   * Format history ensuring turn alternation and user-first requirement for Gemini API
   */
  static formatHistoryForGemini(history = [], currentPrompt = '') {
    const contents = [];

    for (const item of history) {
      const text = (item.text || item.message || (item.parts && item.parts[0]?.text) || '').trim();
      if (!text) continue;

      const rawRole = (item.sender || item.role || '').toLowerCase();
      const isModel = rawRole === 'ai' || rawRole === 'model' || rawRole === 'assistant';
      const role = isModel ? 'model' : 'user';

      // Gemini requires conversation to begin with a 'user' turn
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      // Merge consecutive turns with the same role
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n\n${text}`;
      } else {
        contents.push({ role, parts: [{ text }] });
      }
    }

    // Append or reconcile current prompt
    if (currentPrompt && currentPrompt.trim()) {
      const cleanPrompt = currentPrompt.trim();
      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        if (contents[contents.length - 1].parts[0].text !== cleanPrompt) {
          contents[contents.length - 1].parts[0].text += `\n\n${cleanPrompt}`;
        }
      } else {
        contents.push({ role: 'user', parts: [{ text: cleanPrompt }] });
      }
    }

    if (contents.length === 0 && currentPrompt) {
      contents.push({ role: 'user', parts: [{ text: currentPrompt.trim() }] });
    }

    return contents;
  }

  /**
   * Direct Gemini API Caller with model fallback
   */
  static async callGeminiApi(promptOrContents, history = []) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    let contents;
    if (Array.isArray(promptOrContents)) {
      contents = promptOrContents;
    } else {
      contents = this.formatHistoryForGemini(history, promptOrContents);
    }

    const preferredModel = this.getPreferredModel();
    const candidateModels = Array.from(new Set([
      preferredModel,
      'gemini-flash-lite-latest',
      'gemini-flash-latest',
      'gemini-3.8-flash'
    ]));

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const result = await this.executeGeminiRequest(model, apiKey, contents);
        if (result) return result;
      } catch (err) {
        lastError = err;
        // If 404 (model not found/deprecated), try next candidate
        if (err.message && (err.message.includes('404') || err.message.includes('not found') || err.message.includes('no longer available'))) {
          continue;
        }
        // If other error, rethrow or continue
        console.warn(`Gemini model ${model} error:`, err.message);
      }
    }

    throw lastError || new Error('All candidate Gemini models failed');
  }

  /**
   * Single model HTTPS request executor
   */
  static executeGeminiRequest(model, apiKey, contents) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        contents,
        systemInstruction: {
          parts: [{
            text: `You are the AI Placement & Career Intelligence Mentor for college students and graduates preparing for software engineering and tech placements (e.g. FAANG, top tier product companies, and leading startups).

Guidelines:
1. Provide direct, highly accurate, concrete, and comprehensive technical responses.
2. When asked for questions (e.g. "Give me 10 important DSA questions for placements"), ALWAYS list actual, well-known interview problems (e.g., Two Sum, Maximum Subarray / Kadane's, Reverse a Linked List, Valid Parentheses, Merge Intervals, Lowest Common Ancestor, Number of Islands, Coin Change, Trapping Rain Water, Binary Search). For each, give the topic, core pattern, and why it's asked.
3. Conversation follow-ups must strictly maintain context:
   - "Give me 10 more questions" -> Provide 10 NEW and different high-priority questions continuing from the previous list. Do NOT repeat the previous questions.
   - "Explain question X" -> Locate question X from the previous turn and explain it thoroughly with problem breakdown, optimal approach, and step-by-step logic.
   - "Give Java code" (or Python/C++) -> Provide clean, production-ready, well-commented code with time and space complexity.
   - "ok", "got it", "thanks", etc. -> Respond naturally, warmly, and proactively ask what they would like to focus on next (e.g. explain a problem, try a viva/interview scenario, or write code).
   - New unrelated questions -> Answer the new topic directly and comprehensively without carrying over unrelated prior context.
4. Keep the tone encouraging, technical, and structured. Use Markdown formatting with headings, bullet points, and code snippets.`
          }]
        },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 2048
        }
      });

      const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
                resolve(parsed.candidates[0].content.parts[0].text);
              } else {
                reject(new Error('Invalid response structure from Gemini API'));
              }
            } else {
              const errMsg = parsed.error ? `HTTP ${res.statusCode}: ${parsed.error.message}` : `HTTP ${res.statusCode}`;
              reject(new Error(errMsg));
            }
          } catch (e) {
            reject(new Error(`Failed to parse Gemini response: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.setTimeout(25000, () => {
        req.destroy();
        reject(new Error('AI API request timed out (25s)'));
      });
      req.write(postData);
      req.end();
    });
  }

  /**
   * AI Mock Interview Evaluation
   */
  static async evaluateInterview(role, question, candidateAnswer) {
    if (this.isLiveAiConfigured()) {
      try {
        const prompt = `You are a Senior Principal Technical Interviewer evaluating a candidate for the role of ${role}.
Question Asked: "${question}"
Candidate Answer: "${candidateAnswer}"

Return ONLY valid JSON in this exact structure:
{
  "score": 85,
  "communication": "Strong and structured",
  "missingConcepts": ["concept 1", "concept 2"],
  "feedback": "Detailed constructive evaluation...",
  "followUp": "Next in-depth technical follow up question"
}`;
        const raw = await this.callGeminiApi(prompt);
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('Gemini evaluation failed, falling back:', err.message);
      }
    }

    // Heuristic Evaluation Engine
    const lower = (candidateAnswer || '').toLowerCase();
    let score = 65;
    if (lower.length > 100) score += 10;
    if (lower.length > 250) score += 10;
    if (lower.includes('complexity') || lower.includes('o(n)') || lower.includes('acid') || lower.includes('thread') || lower.includes('index') || lower.includes('architecture')) {
      score += 10;
    }
    score = Math.min(96, Math.max(50, score));

    return {
      score,
      communication: lower.length > 200 ? 'Clear & Articulate' : 'Moderate - Expand with concrete examples',
      missingConcepts: ['Production edge cases & fault tolerance', 'Time/Space complexity trade-offs', 'Scalability bottlenecks'],
      feedback: `Good foundational explanation for the ${role} position. To achieve higher scoring in campus drives, begin by explicitly stating assumptions, time/space complexity, and practical distributed system implications.`,
      followUp: `How would your proposed solution behave if traffic spikes 100x concurrently, and what caching or indexing strategy would you apply?`
    };
  }

  /**
   * STAR Project Optimizer & Viva Prep
   */
  static async optimizeProject(title, description, techStack) {
    if (this.isLiveAiConfigured()) {
      try {
        const prompt = `You are an elite Tech Career Coach. Optimize this student software engineering project into STAR framework resume bullets and Viva Defense questions.
Project Title: ${title}
Description: ${description}
Tech Stack: ${techStack}

Return JSON only:
{
  "complexityScore": 85,
  "starBullets": ["bullet 1 with action verbs and metrics", "bullet 2", "bullet 3"],
  "vivaQuestions": ["viva question 1 with model answer tip", "viva question 2", "viva question 3"]
}`;
        const raw = await this.callGeminiApi(prompt);
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn('Gemini project optimization failed:', err.message);
      }
    }

    return {
      complexityScore: 84,
      starBullets: [
        `Architected and deployed ${title} leveraging ${techStack || 'modern full-stack technologies'}, establishing robust RESTful API endpoints with sub-150ms response latencies.`,
        `Integrated secure session management and database query optimizations, reducing unnecessary data transfer by 35%.`,
        `Implemented end-to-end unit and integration workflows, ensuring zero regression and seamless candidate onboarding.`
      ],
      vivaQuestions: [
        `Why did you choose ${techStack || 'this stack'} over competing alternatives? (Model defense: Discuss ecosystem maturity, developer velocity, and database indexing).`,
        `How do you handle concurrency, race conditions, and transactional consistency in ${title}?`,
        `If you had to scale this architecture to 50,000 active concurrent users, what caching layer (Redis) and load balancing strategy would you implement?`
      ]
    };
  }

  /**
   * Fallback heuristic intelligence when live AI is unavailable or unconfigured
   */
  static getHeuristicChatResponse(userText) {
    const lower = (userText || '').trim().toLowerCase();

    // Supported Quick-Topic 1: Java Polymorphism
    if (lower.includes('polymorphism') || lower.includes('overload') || lower.includes('override')) {
      return `> ℹ️ **Offline Mode**: Live AI is currently unavailable. Showing verified placement reference guide.

### Polymorphism & Dynamic Method Dispatch in Tech Interviews

**1. Compile-Time Polymorphism (Method Overloading)**
Occurs within the same class when methods share the same name with different signatures (parameter types, count, or order). Resolved at compile time.

**2. Runtime Polymorphism (Method Overriding)**
Occurs when a subclass overrides an inherited parent class method. The JVM determines which method to execute at runtime via dynamic method lookup based on the instantiated object on the heap.

\`\`\`java
class Parent { void display() { System.out.println("Base"); } }
class Child extends Parent { void display() { System.out.println("Derived"); } }

Parent p = new Child(); // Upcasting
p.display(); // Prints "Derived"
\`\`\`

💡 **Interview Defense Tip:** Explain that \`static\`, \`final\`, and \`private\` methods cannot be overridden in Java because they use static binding.`;
    }

    // Supported Quick-Topic 2: SQL & DBMS
    if ((lower.includes('where') && lower.includes('having')) || (lower.includes('sql') && lower.includes('acid')) || lower.includes('dbms')) {
      return `> ℹ️ **Offline Mode**: Live AI is currently unavailable. Showing verified placement reference guide.

### Core Database & SQL Interview Concepts

**1. ACID Properties:**
- **Atomicity:** All-or-nothing transaction execution.
- **Consistency:** Database transitions only between valid states.
- **Isolation:** Concurrent transactions do not interfere (isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
- **Durability:** Committed changes persist despite system crashes (write-ahead logging).

**2. WHERE vs HAVING:**
- \`WHERE\` filters records *before* aggregation.
- \`HAVING\` filters aggregated groupings *after* \`GROUP BY\`.`;
    }

    // Supported Quick-Topic 3: Two-Pointer & Sliding Window
    if (lower.includes('two-pointer') || lower.includes('two pointer') || lower.includes('sliding window')) {
      return `> ℹ️ **Offline Mode**: Live AI is currently unavailable. Showing verified placement reference guide.

### Two-Pointer & Sliding Window Technique in Tech Coding Rounds

**1. Two Pointers (Opposite Ends):**
- Used on sorted arrays/strings (e.g. Two Sum II, Container With Most Water, Valid Palindrome).
- Start with \`left = 0\` and \`right = n - 1\`. Narrow down window based on condition. Reduces $O(N^2)$ brute-force to $O(N)$ time with $O(1)$ space.

**2. Sliding Window (Dynamic or Fixed):**
- Used for contiguous subarray or substring problems (e.g. Longest Substring Without Repeating Characters, Maximum Sum Subarray of Size K).
- Expand \`right\` pointer until window condition breaks, then shrink from \`left\` until valid again.`;
    }

    // Supported Quick-Topic 4: Capstone Viva Defense
    if (lower.includes('viva') || lower.includes('defense') || lower.includes('capstone')) {
      return `> ℹ️ **Offline Mode**: Live AI is currently unavailable. Showing verified placement reference guide.

### 3 Tough Full-Stack Viva Defense Questions

1. **State & Cache Invalidation:** How does your frontend manage synchronized state when concurrent mutations occur in the PostgreSQL database?
2. **Database Indexing & Query Plans:** How would you diagnose an API endpoint degrading from 100ms to 2.5s under 10,000 active concurrent queries, and which index type (B-tree, Hash, GIN) would you apply?
3. **Security & Session Hijacking:** How does your authentication middleware protect against JWT token tampering, CSRF, and SQL injection?`;
    }

    // Supported Quick-Topic 5: DSA Questions List
    if (lower.includes('dsa') && (lower.includes('question') || lower.includes('problem') || lower.includes('list') || lower.includes('important'))) {
      return `> ℹ️ **Offline Mode**: Live AI is currently unavailable. Showing curated placement problem list.

### 10 Essential DSA Placement Problems

1. **Two Sum** (Array / Hashing) — Optimal: $O(N)$ time with Hash Map.
2. **Best Time to Buy and Sell Stock** (Array / Kadane's Variant) — Optimal: $O(N)$ single pass.
3. **Merge Intervals** (Sorting / Array) — Optimal: $O(N \\log N)$ by sorting start times.
4. **Linked List Cycle** (Linked List / Floyd's Cycle Detection) — Optimal: $O(N)$ time, $O(1)$ space (Fast & Slow pointers).
5. **Reverse a Linked List** (Linked List) — Optimal: $O(N)$ iterative pointer reversal.
6. **Valid Parentheses** (Stack) — Optimal: $O(N)$ LIFO validation.
7. **Binary Tree Level Order Traversal** (Trees / BFS) — Optimal: $O(N)$ using Queue.
8. **Lowest Common Ancestor of a BST** (BST / Recursion) — Optimal: $O(H)$ search using BST ordering properties.
9. **Number of Islands** (Graphs / BFS/DFS) — Optimal: $O(M \\times N)$ grid exploration.
10. **Coin Change** (Dynamic Programming) — Optimal: $O(\\text{amount} \\times n)$ bottom-up tabular DP.`;
    }

    // Clear, honest message when query cannot be answered by offline cache
    return `> ⚠️ **Live AI Assistant is currently offline**
>
> Live interactive conversation is unavailable because no **GEMINI_API_KEY** is configured (or the AI service is unreachable).
>
> **To enable Live Multi-Turn AI:**
> 1. Open \`backend/.env\`
> 2. Add your Google Gemini API key:
>    \`\`\`env
>    GEMINI_API_KEY=your_actual_key_here
>    \`\`\`
> 3. Restart the backend server.
>
> *In offline mode, you can still click the quick prompt chips above for verified placement guides (Polymorphism, SQL, Two-Pointer technique, Capstone Viva defense, and 10 DSA questions).*`;
  }
}

module.exports = AIService;
