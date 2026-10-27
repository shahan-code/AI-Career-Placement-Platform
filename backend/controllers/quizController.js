const QuizAttempt = require('../models/QuizAttempt');

const QUESTION_BANK = {
  "aptitude": [
    {
      id: "apt_1",
      question: "A train running at 72 km/h crosses a 200m long platform in 22 seconds. What is the length of the train?",
      options: ["240 meters", "200 meters", "250 meters", "180 meters"],
      correctIndex: 0,
      explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Total distance in 22s = 20 * 22 = 440m. Train length = 440 - 200 = 240m."
    },
    {
      id: "apt_2",
      question: "If 12 men or 18 women can do a work in 14 days, in how many days can 8 men and 16 women do the same work?",
      options: ["9 days", "10 days", "12 days", "8 days"],
      correctIndex: 0,
      explanation: "12 Men = 18 Women => 1 Man = 1.5 Women. 8 Men + 16 Women = 8(1.5) + 16 = 28 Women. (18 * 14) / 28 = 9 days."
    },
    {
      id: "apt_3",
      question: "A vendor buys lemons at 6 for $10 and sells them at 4 for $8. What is his profit percentage?",
      options: ["20%", "25%", "15%", "30%"],
      correctIndex: 0,
      explanation: "CP of 1 = 10/6 = 1.666. SP of 1 = 8/4 = 2.0. Profit = 0.333 / 1.666 = 20%."
    }
  ],
  "dsa": [
    {
      id: "dsa_1",
      question: "What is the worst-case time complexity of QuickSort when the pivot is always chosen as the smallest or largest element?",
      options: ["O(N log N)", "O(N²)", "O(N)", "O(log N)"],
      correctIndex: 1,
      explanation: "When partitions are maximally unbalanced (size 0 and N-1), recursion depth is N, resulting in O(N²) comparisons."
    },
    {
      id: "dsa_2",
      question: "Which data structure is optimal for implementing LRU (Least Recently Used) Cache with O(1) get and put operations?",
      options: ["Array + Stack", "Hash Map + Doubly Linked List", "Binary Search Tree + Queue", "Min-Heap + Array"],
      correctIndex: 1,
      explanation: "Hash Map offers O(1) key lookup, and Doubly Linked List allows O(1) node detachment and insertion at the head."
    },
    {
      id: "dsa_3",
      question: "What is the time complexity to detect a cycle in a Directed Graph using Kahn's Algorithm (BFS)?",
      options: ["O(V + E)", "O(V * E)", "O(V²)", "O(E log V)"],
      correctIndex: 0,
      explanation: "Kahn's Topological Sort visits every vertex and directed edge exactly once: O(V + E)."
    }
  ],
  "dbms": [
    {
      id: "dbms_1",
      question: "Which SQL clause is used to filter records AFTER an aggregation function has been applied with GROUP BY?",
      options: ["WHERE", "HAVING", "FILTER", "ORDER BY"],
      correctIndex: 1,
      explanation: "WHERE filters rows prior to grouping, while HAVING filters aggregated group results."
    },
    {
      id: "dbms_2",
      question: "What does the 'I' stand for in ACID properties of relational databases?",
      options: ["Integrity", "Indexing", "Isolation", "Iterability"],
      correctIndex: 2,
      explanation: "Isolation ensures concurrent transaction executions yield the same state as if executed serially."
    }
  ],
  "os": [
    {
      id: "os_1",
      question: "Which CPU scheduling algorithm is completely free from starvation of lower priority processes?",
      options: ["Shortest Job First (SJF)", "Priority Scheduling", "Round Robin (RR)", "Shortest Remaining Time First (SRTF)"],
      correctIndex: 2,
      explanation: "Round Robin assigns a fixed time quantum cyclically to all ready processes, guaranteeing starvation-free execution."
    },
    {
      id: "os_2",
      question: "Which condition is NOT one of Coffman's 4 necessary conditions for Deadlock?",
      options: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"],
      correctIndex: 2,
      explanation: "The condition is NO Preemption (resources cannot be forcibly reclaimed)."
    }
  ]
};

class QuizController {
  static async getQuestions(req, res, next) {
    try {
      const { category = 'aptitude' } = req.query;
      const questions = QUESTION_BANK[category.toLowerCase()] || QUESTION_BANK['aptitude'];
      
      // Strip correct answers if in active test mode
      const clientQuestions = questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        category: category.toLowerCase()
      }));

      res.json({
        success: true,
        category,
        total: clientQuestions.length,
        questions: clientQuestions
      });
    } catch (err) {
      next(err);
    }
  }

  static async submitAttempt(req, res, next) {
    try {
      const userId = req.user.id;
      const { category = 'aptitude', answers = {}, time_taken_seconds = 0 } = req.body;

      const bank = QUESTION_BANK[category.toLowerCase()] || QUESTION_BANK['aptitude'];
      let score = 0;
      const detailedResults = [];

      bank.forEach((q, index) => {
        const userAnswer = answers[q.id] !== undefined ? answers[q.id] : answers[index];
        const isCorrect = userAnswer === q.correctIndex;
        if (isCorrect) score++;

        detailedResults.push({
          id: q.id,
          question: q.question,
          options: q.options,
          userAnswer,
          correctIndex: q.correctIndex,
          isCorrect,
          explanation: q.explanation
        });
      });

      const attempt = await QuizAttempt.record(userId, {
        category,
        score,
        total_questions: bank.length,
        time_taken_seconds
      });

      res.json({
        success: true,
        message: 'Quiz attempt saved to database',
        data: {
          attemptId: attempt.id,
          category,
          score,
          totalQuestions: bank.length,
          percentage: attempt.percentage,
          passed: attempt.passed,
          detailedResults
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const history = await QuizAttempt.findByUserId(userId);
      res.json({
        success: true,
        data: history,
        totalAttempts: history.length
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = QuizController;
