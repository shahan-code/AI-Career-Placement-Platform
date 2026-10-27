const db = require('../config/database');

class QuizAttempt {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM quiz_attempts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  }

  static async record(userId, { category, score, total_questions, time_taken_seconds = 0 }) {
    const id = 'qz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const percentage = total_questions > 0 ? parseFloat(((score / total_questions) * 100).toFixed(2)) : 0;
    const passed = percentage >= 60;

    const res = await db.query(
      `INSERT INTO quiz_attempts (id, user_id, category, score, total_questions, percentage, time_taken_seconds, passed)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, userId, category, score, total_questions, percentage, time_taken_seconds, passed]
    );
    return res.rows[0];
  }
}

module.exports = QuizAttempt;
