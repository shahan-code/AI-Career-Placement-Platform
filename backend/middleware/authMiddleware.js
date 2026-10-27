const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ai_career_placement_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token, assign default candidate user context so app works seamlessly out of the box
    req.user = {
      id: 'default_student_user',
      email: 'student@btech.edu',
      name: 'Candidate Student',
      role: 'student'
    };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // If token is invalid or expired, gracefully fallback to default user context
      req.user = {
        id: 'default_student_user',
        email: 'student@btech.edu',
        name: 'Candidate Student',
        role: 'student'
      };
      return next();
    }
    req.user = user;
    next();
  });
}

function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token required. Please sign in.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        error: 'Invalid or expired session token.'
      });
    }
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
  requireAuth,
  JWT_SECRET
};
