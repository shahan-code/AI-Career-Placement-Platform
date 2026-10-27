const express = require('express');
const router = express.Router();
const InterviewController = require('../controllers/interviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/questions', authenticateToken, InterviewController.getQuestions);
router.post('/evaluate', authenticateToken, InterviewController.evaluateResponse);
router.get('/history', authenticateToken, InterviewController.getHistory);

module.exports = router;
