const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/quizController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/questions', authenticateToken, QuizController.getQuestions);
router.post('/submit', authenticateToken, QuizController.submitAttempt);
router.get('/history', authenticateToken, QuizController.getHistory);

module.exports = router;
