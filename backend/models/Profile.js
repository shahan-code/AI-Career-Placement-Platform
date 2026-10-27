const db = require('../config/database');

class Profile {
  static async findByUserId(userId) {
    const res = await db.query('SELECT * FROM profiles WHERE user_id = $1 LIMIT 1', [userId]);
    if (res.rows.length === 0) {
      // Default profile skeleton
      return {
        user_id: userId,
        college: 'National Institute of Engineering & Technology',
        degree: 'B.Tech Computer Science & Engineering',
        semester: '7th Semester',
        gpa: 8.4,
        target_role: 'fullstack',
        daily_study_hours: 4.0,
        bio: 'B.Tech Final Year CSE Student specializing in Full Stack Engineering and Distributed Systems.',
        github_url: 'https://github.com/candidate-dev',
        linkedin_url: 'https://linkedin.com/in/candidate-dev',
        portfolio_url: ''
      };
    }
    return res.rows[0];
  }

  static async upsert(userId, data) {
    const existing = await this.findByUserId(userId);
    const profileId = existing.id || 'prof_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const {
      college = 'National Institute of Engineering & Technology',
      degree = 'B.Tech Computer Science & Engineering',
      semester = '7th Semester',
      gpa = 8.4,
      target_role = 'fullstack',
      daily_study_hours = 4.0,
      bio = '',
      github_url = '',
      linkedin_url = '',
      portfolio_url = ''
    } = data;

    const res = await db.query(
      `INSERT INTO profiles (id, user_id, college, degree, semester, gpa, target_role, daily_study_hours, bio, github_url, linkedin_url, portfolio_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [profileId, userId, college, degree, semester, gpa, target_role, daily_study_hours, bio, github_url, linkedin_url, portfolio_url]
    );

    return res.rows[0];
  }
}

module.exports = Profile;
