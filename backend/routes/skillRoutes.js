const express = require('express');
const router = express.Router();
const SkillController = require('../controllers/skillController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, SkillController.getSkills);
router.post('/', authenticateToken, SkillController.addSkill);
router.delete('/:id', authenticateToken, SkillController.deleteSkill);

module.exports = router;
