const QuizAttempt = require('../models/QuizAttempt');
const RoadmapProgress = require('../models/RoadmapProgress');
const InterviewAttempt = require('../models/InterviewAttempt');
const Skill = require('../models/Skill');
const Profile = require('../models/Profile');

class ProgressController {
  static async getOverallProgress(req, res, next) {
    try {
      const userId = req.user.id;

      const profile = await Profile.findByUserId(userId);
      const skills = await Skill.findByUserId(userId);
      const quizzes = await QuizAttempt.findByUserId(userId);
      const milestones = await RoadmapProgress.findByUserId(userId);
      const interviews = await InterviewAttempt.findByUserId(userId);

      const completedMilestones = milestones.filter(m => m.completed).length;
      const averageQuizScore = quizzes.length > 0 
        ? Math.round(quizzes.reduce((acc, q) => acc + parseFloat(q.percentage || 0), 0) / quizzes.length)
        : 0;

      res.json({
        success: true,
        data: {
          candidateName: profile.name || 'Candidate Student',
          targetRole: profile.target_role || 'fullstack',
          skillsCount: skills.length,
          quizzesTaken: quizzes.length,
          averageQuizScore,
          roadmapMilestonesCompleted: completedMilestones,
          interviewAttempts: interviews.length,
          dailyCommitmentHours: profile.daily_study_hours || 4.0,
          lastActive: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProgressController;
