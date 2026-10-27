const db = require('../config/database');

class Skill {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM skills WHERE user_id = $1 ORDER BY created_at ASC', [userId]);
    if (res.rows.length === 0) {
      // Seed default skills for fresh candidates
      const defaultSkills = [
        { name: 'JavaScript', category: 'Languages', proficiency_level: 'Advanced', verified: true },
        { name: 'React', category: 'Frontend', proficiency_level: 'Intermediate', verified: true },
        { name: 'Node.js', category: 'Backend', proficiency_level: 'Intermediate', verified: true },
        { name: 'PostgreSQL', category: 'Databases', proficiency_level: 'Intermediate', verified: false },
        { name: 'DSA & Algorithms', category: 'Core CS', proficiency_level: 'Intermediate', verified: true },
        { name: 'Git & GitHub', category: 'DevOps & Tools', proficiency_level: 'Advanced', verified: true }
      ];
      return defaultSkills.map((s, idx) => ({ id: `skl_seed_${idx}`, user_id: userId, ...s }));
    }
    return res.rows;
  }

  static async add(userId, { name, category = 'Technical', proficiency_level = 'Intermediate', verified = false }) {
    const id = 'skl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const res = await db.query(
      'INSERT INTO skills (id, user_id, name, category, proficiency_level, verified) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, userId, name, category, proficiency_level, verified]
    );
    return res.rows[0];
  }

  static async delete(id, userId) {
    await db.query('DELETE FROM skills WHERE id = $1 AND user_id = $2', [id, userId]);
    return { success: true };
  }
}

module.exports = Skill;
