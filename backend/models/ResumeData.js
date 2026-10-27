const db = require('../config/database');

class ResumeData {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM resume_analyses WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  }

  static async record(userId, { file_name, target_role, extracted_text, ats_score, parsed_skills = [], missing_keywords = [], suggestions = [] }) {
    const id = 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const res = await db.query(
      `INSERT INTO resume_analyses (id, user_id, file_name, target_role, extracted_text, ats_score, parsed_skills, missing_keywords, suggestions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, userId, file_name, target_role, extracted_text, ats_score, JSON.stringify(parsed_skills), JSON.stringify(missing_keywords), JSON.stringify(suggestions)]
    );
    return res.rows[0];
  }
}

module.exports = ResumeData;
