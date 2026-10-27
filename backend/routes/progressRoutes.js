const express = require('express');
const router = express.Router();
const ProgressController = require('../controllers/progressController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, ProgressController.getOverallProgress);

module.exports = router;
