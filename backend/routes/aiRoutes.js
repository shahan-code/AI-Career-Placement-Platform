const express = require('express');
const router = express.Router();
const AIController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/status', AIController.status);
router.post('/chat', authenticateToken, AIController.chat);

module.exports = router;
