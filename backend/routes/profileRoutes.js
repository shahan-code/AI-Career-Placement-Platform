const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profileController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, ProfileController.getProfile);
router.put('/', authenticateToken, ProfileController.updateProfile);
router.get('/readiness', authenticateToken, ProfileController.getReadiness);

module.exports = router;
