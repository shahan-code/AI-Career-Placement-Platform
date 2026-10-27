const express = require('express');
const router = express.Router();
const JobMatchingController = require('../controllers/jobMatchingController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/match', authenticateToken, JobMatchingController.matchJobDescription);

module.exports = router;
