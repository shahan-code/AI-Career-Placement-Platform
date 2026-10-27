const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { JWT_SECRET } = require('../middleware/authMiddleware');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password, role = 'student' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
      }

      const existing = await User.findByEmail(email.toLowerCase().trim());
      if (existing) {
        return res.status(409).json({ success: false, error: 'An account with this email already exists' });
      }

      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        role
      });

      // Initialize default candidate profile
      await Profile.upsert(user.id, {
        college: 'National Institute of Engineering & Technology',
        degree: 'B.Tech Computer Science & Engineering',
        semester: '7th Semester',
        gpa: 8.4,
        target_role: 'fullstack',
        daily_study_hours: 4.0
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required' });
      }

      const user = await User.findByEmail(email.toLowerCase().trim());
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const isMatch = await User.verifyPassword(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.json({
          success: true,
          user: req.user
        });
      }
      res.json({
        success: true,
        user
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
