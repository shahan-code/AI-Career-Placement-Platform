const express = require('express');
const router = express.Router();
const ResumeController = require('../controllers/resumeController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/analyze', authenticateToken, ResumeController.analyzeResume);
router.get('/history', authenticateToken, ResumeController.getHistory);

module.exports = router;
