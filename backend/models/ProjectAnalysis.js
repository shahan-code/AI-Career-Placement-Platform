const db = require('../config/database');

class ProjectAnalysis {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM project_analyses WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return res.rows;
  }

  static async record(userId, { title, description, tech_stack = '', complexity_score = 80, star_bullets = [], viva_questions = [] }) {
    const id = 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const res = await db.query(
      `INSERT INTO project_analyses (id, user_id, title, description, tech_stack, complexity_score, star_bullets, viva_questions)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [id, userId, title, description, tech_stack, complexity_score, JSON.stringify(star_bullets), JSON.stringify(viva_questions)]
    );
    return res.rows[0];
  }
}

module.exports = ProjectAnalysis;
