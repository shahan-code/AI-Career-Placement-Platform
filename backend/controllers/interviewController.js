const InterviewAttempt = require('../models/InterviewAttempt');
const AIService = require('../services/aiService');

const INTERVIEW_QUESTION_BANK = {
  "fullstack": [
    "Explain how the Node.js Event Loop handles asynchronous I/O operations and differentiates between microtasks and macrotasks.",
    "How does React's Virtual DOM reconciliation (Fiber architecture) optimize UI rendering, and when should you use useMemo or useCallback?",
    "Describe the difference between SQL indexing (B-Trees) and full-table scans. How do compound indexes work?",
    "How do you design a secure token-based authentication flow with JWTs, refresh tokens, and CSRF protection?"
  ],
  "backend_java": [
    "Explain the internal working of Java's ConcurrentHashMap and how it achieves thread safety without blocking the entire table.",
    "What is the difference between @Component, @Service, and @Repository in Spring Boot, and how does Spring manage bean scopes?",
    "Explain ACID properties in database transactions and how isolation levels prevent Dirty Reads, Non-Repeatable Reads, and Phantom Reads.",
    "How would you design a distributed cache invalidation strategy in a microservices ecosystem?"
  ],
  "frontend_react": [
    "Explain how React handles synthetic events and event bubbling across the component hierarchy.",
    "Compare Server-Side Rendering (SSR) vs Static Site Generation (SSG) vs Client-Side Rendering (CSR) for web performance and SEO.",
    "How do you profile and optimize memory leaks or unnecessary re-renders in a large React application?"
  ]
};

class InterviewController {
  static async getQuestions(req, res, next) {
    try {
      const { role = 'fullstack' } = req.query;
      const questions = INTERVIEW_QUESTION_BANK[role.toLowerCase()] || INTERVIEW_QUESTION_BANK['fullstack'];

      res.json({
        success: true,
        role,
        questions
      });
    } catch (err) {
      next(err);
    }
  }

  static async evaluateResponse(req, res, next) {
    try {
      const userId = req.user.id;
      const { role = 'fullstack', question, userAnswer } = req.body;

      if (!question || !userAnswer) {
        return res.status(400).json({
          success: false,
          error: 'Question and candidate answer are required for evaluation'
        });
      }

      // Call AI Service
      const evaluation = await AIService.evaluateInterview(role, question, userAnswer);

      // Record in PostgreSQL Database
      const record = await InterviewAttempt.record(userId, {
        role,
        question,
        user_answer: userAnswer,
        ai_score: evaluation.score || 75,
        feedback: evaluation.feedback || '',
        communication_rating: evaluation.communication || 'Good',
        missing_concepts: (evaluation.missingConcepts || []).join(', '),
        follow_up_question: evaluation.followUp || ''
      });

      res.json({
        success: true,
        message: 'Mock interview response evaluated and saved to database',
        data: {
          id: record.id,
          role,
          score: evaluation.score,
          communication: evaluation.communication,
          missingConcepts: evaluation.missingConcepts,
          feedback: evaluation.feedback,
          followUp: evaluation.followUp,
          evaluatedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const history = await InterviewAttempt.findByUserId(userId);
      res.json({
        success: true,
        data: history
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = InterviewController;
