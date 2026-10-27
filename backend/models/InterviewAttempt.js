const db = require('../config/database');

class InterviewAttempt {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM interview_attempts WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  }

  static async record(userId, { role, question, user_answer, ai_score, feedback, communication_rating, missing_concepts, follow_up_question }) {
    const id = 'int_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const res = await db.query(
      `INSERT INTO interview_attempts (id, user_id, role, question, user_answer, ai_score, feedback, communication_rating, missing_concepts, follow_up_question)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, userId, role, question, user_answer, ai_score, feedback, communication_rating, missing_concepts, follow_up_question]
    );
    return res.rows[0];
  }
}

module.exports = InterviewAttempt;
