const db = require('../config/database');

class RoadmapProgress {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM roadmap_milestones WHERE user_id = $1', [userId]);
    return res.rows;
  }

  static async toggleMilestone(userId, { milestone_key, month_index = 1, week_index = 1, title = '', completed = true, notes = '' }) {
    const id = 'ms_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const res = await db.query(
      `INSERT INTO roadmap_milestones (id, user_id, milestone_key, month_index, week_index, title, completed, completed_at, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, userId, milestone_key, month_index, week_index, title, completed, completed ? new Date() : null, notes]
    );
    return res.rows[0];
  }
}

module.exports = RoadmapProgress;
