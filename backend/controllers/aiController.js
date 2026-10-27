const AIService = require('../services/aiService');
const db = require('../config/database');

class AIController {
  /**
   * Health and connectivity status for the AI service
   */
  static async status(req, res) {
    try {
      const statusInfo = AIService.getStatus();
      res.json({
        success: true,
        data: statusInfo
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message
      });
    }
  }

  /**
   * Primary multi-turn placement AI chat completion
   */
  static async chat(req, res, next) {
    try {
      const userId = req.user ? req.user.id : 'default_student_user';
      const { message, conversationHistory = [] } = req.body;

      if (!message || message.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Message text is required'
        });
      }

      // Generate AI response via Gemini or fallback engine
      const aiResult = await AIService.generateChatResponse(message, conversationHistory);
      const replyText = typeof aiResult === 'object' && aiResult.reply ? aiResult.reply : aiResult;

      // Record in chat_messages table if table exists (non-blocking)
      try {
        const idUser = 'msg_' + Date.now() + '_u';
        const idAi = 'msg_' + (Date.now() + 1) + '_a';
        await db.query('INSERT INTO chat_messages (id, user_id, sender, message) VALUES ($1, $2, $3, $4)', [idUser, userId, 'user', message]);
        await db.query('INSERT INTO chat_messages (id, user_id, sender, message) VALUES ($1, $2, $3, $4)', [idAi, userId, 'ai', replyText]);
      } catch (err) {
        // Non-blocking chat persistence
      }

      res.json({
        success: true,
        data: {
          reply: replyText,
          isLive: aiResult.isLive !== false,
          model: aiResult.model || 'gemini',
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AIController;
