const Skill = require('../models/Skill');

class SkillController {
  static async getSkills(req, res, next) {
    try {
      const userId = req.user.id;
      const skills = await Skill.findByUserId(userId);
      res.json({
        success: true,
        data: skills
      });
    } catch (err) {
      next(err);
    }
  }

  static async addSkill(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, category, proficiency_level, verified } = req.body;

      if (!name) {
        return res.status(400).json({ success: false, error: 'Skill name is required' });
      }

      const newSkill = await Skill.add(userId, {
        name: name.trim(),
        category: category || 'Technical',
        proficiency_level: proficiency_level || 'Intermediate',
        verified: verified === true
      });

      res.status(201).json({
        success: true,
        message: 'Skill added successfully',
        data: newSkill
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSkill(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await Skill.delete(id, userId);
      res.json({
        success: true,
        message: 'Skill removed successfully'
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SkillController;
