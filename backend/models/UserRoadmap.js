const db = require('../config/database');

class UserRoadmap {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM user_roadmaps WHERE user_id = $1 LIMIT 1', [userId]);
    if (!res.rows || res.rows.length === 0) {
      return null;
    }
    const row = res.rows[0];
    return {
      ...row,
      selected_subjects: typeof row.selected_subjects === 'string' ? JSON.parse(row.selected_subjects) : (row.selected_subjects || []),
      custom_subjects: typeof row.custom_subjects === 'string' ? JSON.parse(row.custom_subjects) : (row.custom_subjects || []),
      generated_plan: typeof row.generated_plan === 'string' ? JSON.parse(row.generated_plan) : (row.generated_plan || [])
    };
  }

  static async upsert(userId, data) {
    const existing = await this.findByUserId(userId);
    const id = existing?.id || 'roadmap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const {
      career_goal = 'Full Stack Development',
      duration_value = 6,
      duration_unit = 'months',
      daily_study_hours = 4.0,
      current_level = 'Beginner',
      target_level = 'Job/Placement Ready',
      selected_subjects = [],
      custom_subjects = [],
      generated_plan = []
    } = data;

    const res = await db.query(
      `INSERT INTO user_roadmaps (id, user_id, career_goal, duration_value, duration_unit, daily_study_hours, current_level, target_level, selected_subjects, custom_subjects, generated_plan)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        id,
        userId,
        career_goal,
        parseInt(duration_value, 10) || 6,
        duration_unit,
        parseFloat(daily_study_hours) || 4.0,
        current_level,
        target_level,
        JSON.stringify(selected_subjects),
        JSON.stringify(custom_subjects),
        JSON.stringify(generated_plan)
      ]
    );

    const row = res.rows[0] || {};
    return {
      ...row,
      selected_subjects: typeof row.selected_subjects === 'string' ? JSON.parse(row.selected_subjects) : (row.selected_subjects || []),
      custom_subjects: typeof row.custom_subjects === 'string' ? JSON.parse(row.custom_subjects) : (row.custom_subjects || []),
      generated_plan: typeof row.generated_plan === 'string' ? JSON.parse(row.generated_plan) : (row.generated_plan || [])
    };
  }

  static async deleteByUserId(userId) {
    await db.query('DELETE FROM user_roadmaps WHERE user_id = $1', [userId]);
    return true;
  }
}

module.exports = UserRoadmap;
