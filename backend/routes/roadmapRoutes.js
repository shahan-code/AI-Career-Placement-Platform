const express = require('express');
const router = express.Router();
const RoadmapController = require('../controllers/roadmapController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/presets', RoadmapController.getPresets);
router.get('/', authenticateToken, RoadmapController.getRoadmap);
router.post('/generate', authenticateToken, RoadmapController.generateRoadmap);
router.post('/toggle', authenticateToken, RoadmapController.toggleMilestone);
router.post('/reset', authenticateToken, RoadmapController.resetRoadmap);

module.exports = router;
