const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findByEmail(email) {
    const res = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return res.rows[0] || null;
  }

  static async findById(id) {
    const res = await db.query('SELECT id, name, email, avatar_url, role, created_at FROM users WHERE id = $1 LIMIT 1', [id]);
    return res.rows[0] || null;
  }

  static async create({ id, name, email, password, avatar_url = null, role = 'student' }) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = id || 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const res = await db.query(
      'INSERT INTO users (id, name, email, password_hash, avatar_url, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, avatar_url, role, created_at',
      [userId, name, email, passwordHash, avatar_url, role]
    );
    return res.rows[0];
  }

  static async verifyPassword(plainPassword, passwordHash) {
    return await bcrypt.compare(plainPassword, passwordHash);
  }
}

module.exports = User;
