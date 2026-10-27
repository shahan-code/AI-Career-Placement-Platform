const ProjectAnalysis = require('../models/ProjectAnalysis');
const AIService = require('../services/aiService');

class ProjectController {
  static async analyzeProject(req, res, next) {
    try {
      const userId = req.user.id;
      const { title, description, techStack } = req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: 'Project title and description are required'
        });
      }

      // Call AI Service for STAR optimization & Viva generator
      const result = await AIService.optimizeProject(title, description, techStack);

      // Record in PostgreSQL Database
      const record = await ProjectAnalysis.record(userId, {
        title,
        description,
        tech_stack: techStack,
        complexity_score: result.complexityScore || 85,
        star_bullets: result.starBullets || [],
        viva_questions: result.vivaQuestions || []
      });

      res.json({
        success: true,
        message: 'Project analyzed and saved to database',
        data: {
          id: record.id,
          title,
          complexityScore: result.complexityScore,
          starBullets: result.starBullets,
          vivaQuestions: result.vivaQuestions
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const history = await ProjectAnalysis.findByUserId(userId);
      res.json({
        success: true,
        data: history
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProjectController;
