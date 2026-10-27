const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const QuizAttempt = require('../models/QuizAttempt');
const RoadmapProgress = require('../models/RoadmapProgress');
const UserRoadmap = require('../models/UserRoadmap');
const InterviewAttempt = require('../models/InterviewAttempt');
const ProjectAnalysis = require('../models/ProjectAnalysis');

class ProfileController {
  static async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await Profile.findByUserId(userId);
      const skills = await Skill.findByUserId(userId);

      res.json({
        success: true,
        data: {
          ...profile,
          skills
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      const updated = await Profile.upsert(userId, profileData);
      res.json({
        success: true,
        message: 'Candidate profile updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async getReadiness(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await Profile.findByUserId(userId);
      const skills = await Skill.findByUserId(userId);
      const quizzes = await QuizAttempt.findByUserId(userId);
      const milestones = await RoadmapProgress.findByUserId(userId);
      const interviews = await InterviewAttempt.findByUserId(userId);
      const projects = await ProjectAnalysis.findByUserId(userId);

      // 1. Skill Match Score (30% weight)
      // Benchmark expects ~8 core skills for target role
      const skillCount = skills.length;
      const skillScore = Math.min(100, Math.round((skillCount / 8) * 100));

      // 2. Quiz Performance (25% weight)
      let quizScore = 0;
      if (quizzes.length > 0) {
        const avgQuiz = quizzes.reduce((acc, q) => acc + parseFloat(q.percentage || 0), 0) / quizzes.length;
        const countBonus = Math.min(20, quizzes.length * 4);
        quizScore = Math.min(100, Math.round((avgQuiz * 0.8) + countBonus));
      }

      // 3. Roadmap Milestone Completion (20% weight)
      const completedMilestones = milestones.filter(m => m.completed).length;
      let totalRoadmapExpected = 16;
      try {
        const userRoadmap = await UserRoadmap.findByUserId(userId);
        if (userRoadmap && Array.isArray(userRoadmap.generated_plan) && userRoadmap.generated_plan.length > 0) {
          let count = 0;
          userRoadmap.generated_plan.forEach(ph => {
            count += (ph.weeks || []).length;
          });
          if (count > 0) totalRoadmapExpected = count;
        }
      } catch (e) {
        totalRoadmapExpected = 16;
      }
      const roadmapScore = Math.min(100, Math.round((completedMilestones / totalRoadmapExpected) * 100));

      // 4. Mock Interview Readiness (15% weight)
      let interviewScore = 0;
      if (interviews.length > 0) {
        const avgInt = interviews.reduce((acc, i) => acc + (i.ai_score || 0), 0) / interviews.length;
        interviewScore = Math.min(100, Math.round(avgInt));
      }

      // 5. Project & Academic Depth (10% weight)
      const gpaScore = Math.min(100, Math.round(((profile.gpa || 8.0) / 10) * 100));
      const projectBonus = Math.min(30, projects.length * 15);
      const projectScore = Math.min(100, Math.round((gpaScore * 0.7) + projectBonus));

      // Composite Weighted Score
      const compositeScore = Math.round(
        (skillScore * 0.30) +
        (quizScore * 0.25) +
        (roadmapScore * 0.20) +
        (interviewScore * 0.15) +
        (projectScore * 0.10)
      );

      res.json({
        success: true,
        data: {
          compositeScore: Math.min(100, Math.max(0, compositeScore)),
          breakdown: {
            skills: { score: skillScore, weight: '30%', count: skillCount },
            quizzes: { score: quizScore, weight: '25%', count: quizzes.length },
            roadmap: { score: roadmapScore, weight: '20%', completed: completedMilestones },
            interviews: { score: interviewScore, weight: '15%', attempts: interviews.length },
            projects: { score: projectScore, weight: '10%', count: projects.length }
          },
          targetRole: profile.target_role || 'fullstack',
          lastEvaluated: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ProfileController;
