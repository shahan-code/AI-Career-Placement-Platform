const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/analyze', authenticateToken, ProjectController.analyzeProject);
router.get('/history', authenticateToken, ProjectController.getHistory);

module.exports = router;
