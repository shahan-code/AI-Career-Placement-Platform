const RoadmapProgress = require('../models/RoadmapProgress');
const UserRoadmap = require('../models/UserRoadmap');
const Profile = require('../models/Profile');
const { RoadmapGenerator } = require('../services/roadmapGenerator');

class RoadmapController {
  /**
   * Get career preset catalogs and suggested subjects
   */
  static async getPresets(req, res, next) {
    try {
      const catalog = RoadmapGenerator.getCatalog();
      res.json({
        success: true,
        data: catalog
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get student's active personalized roadmap
   */
  static async getRoadmap(req, res, next) {
    try {
      const userId = req.user.id;

      // 1. Fetch saved user roadmap config and plan
      let userRoadmapDoc = await UserRoadmap.findByUserId(userId);
      const profile = await Profile.findByUserId(userId);

      // If no roadmap exists yet, generate initial personalized roadmap from profile
      if (!userRoadmapDoc || !userRoadmapDoc.generated_plan || userRoadmapDoc.generated_plan.length === 0) {
        const generated = RoadmapGenerator.generatePlan({
          careerGoal: profile?.target_role || 'Full Stack Development',
          durationValue: 6,
          durationUnit: 'months',
          dailyStudyHours: profile?.daily_study_hours || 4.0,
          currentLevel: 'Beginner',
          targetLevel: 'Job/Placement Ready'
        });

        userRoadmapDoc = await UserRoadmap.upsert(userId, {
          career_goal: generated.config.careerGoal,
          duration_value: generated.config.durationValue,
          duration_unit: generated.config.durationUnit,
          daily_study_hours: generated.config.dailyStudyHours,
          current_level: generated.config.currentLevel,
          target_level: generated.config.targetLevel,
          selected_subjects: generated.config.selectedSubjects,
          custom_subjects: generated.config.customSubjects,
          generated_plan: generated.roadmap
        });
      }

      // 2. Fetch milestone progress from database
      const savedMilestones = await RoadmapProgress.findByUserId(userId);
      const milestoneMap = {};
      savedMilestones.forEach(m => {
        milestoneMap[m.milestone_key] = m.completed;
      });

      // 3. Enrich roadmap items with saved completions
      const plan = Array.isArray(userRoadmapDoc.generated_plan) ? userRoadmapDoc.generated_plan : [];
      let totalTasks = 0;
      let completedTasks = 0;
      let totalHours = 0;
      let completedHours = 0;

      const enrichedPlan = plan.map(phaseObj => {
        const enrichedWeeks = (phaseObj.weeks || []).map(w => {
          totalTasks++;
          const targetHours = w.targetHours || Math.round((userRoadmapDoc.daily_study_hours || 4.0) * 7);
          totalHours += targetHours;

          const isDone = Boolean(milestoneMap[w.key]);
          if (isDone) {
            completedTasks++;
            completedHours += targetHours;
          }

          return {
            ...w,
            targetHours,
            completed: isDone
          };
        });

        return {
          ...phaseObj,
          weeks: enrichedWeeks
        };
      });

      const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const remainingHours = Math.max(0, totalHours - completedHours);

      const stats = {
        careerGoal: userRoadmapDoc.career_goal || 'Full Stack Development',
        durationValue: userRoadmapDoc.duration_value || 6,
        durationUnit: userRoadmapDoc.duration_unit || 'months',
        dailyStudyHours: userRoadmapDoc.daily_study_hours || 4.0,
        weeklyHours: Math.round((userRoadmapDoc.daily_study_hours || 4.0) * 7),
        currentLevel: userRoadmapDoc.current_level || 'Beginner',
        targetLevel: userRoadmapDoc.target_level || 'Job/Placement Ready',
        totalTasks,
        completedTasks,
        overallProgress,
        totalHours,
        completedHours,
        remainingHours,
        durationLabel: `${userRoadmapDoc.duration_value || 6} ${(userRoadmapDoc.duration_unit || 'months').toUpperCase()}`
      };

      res.json({
        success: true,
        data: {
          config: {
            careerGoal: userRoadmapDoc.career_goal,
            durationValue: userRoadmapDoc.duration_value,
            durationUnit: userRoadmapDoc.duration_unit,
            dailyStudyHours: userRoadmapDoc.daily_study_hours,
            currentLevel: userRoadmapDoc.current_level,
            targetLevel: userRoadmapDoc.target_level,
            selectedSubjects: userRoadmapDoc.selected_subjects || [],
            customSubjects: userRoadmapDoc.custom_subjects || []
          },
          stats,
          roadmap: enrichedPlan,
          totalTasks,
          completedTasks,
          overallProgress
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Generate and persist a new personalized roadmap
   */
  static async generateRoadmap(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        career_goal,
        duration_value,
        duration_unit,
        daily_study_hours,
        selected_subjects,
        custom_subjects,
        current_level,
        target_level
      } = req.body;

      const generated = RoadmapGenerator.generatePlan({
        careerGoal: career_goal || 'Full Stack Development',
        durationValue: duration_value || 6,
        durationUnit: duration_unit || 'months',
        dailyStudyHours: daily_study_hours || 4.0,
        selectedSubjects: selected_subjects || [],
        customSubjects: custom_subjects || [],
        currentLevel: current_level || 'Beginner',
        targetLevel: target_level || 'Job/Placement Ready'
      });

      // Save to database
      const savedDoc = await UserRoadmap.upsert(userId, {
        career_goal: generated.config.careerGoal,
        duration_value: generated.config.durationValue,
        duration_unit: generated.config.durationUnit,
        daily_study_hours: generated.config.dailyStudyHours,
        current_level: generated.config.currentLevel,
        target_level: generated.config.targetLevel,
        selected_subjects: generated.config.selectedSubjects,
        custom_subjects: generated.config.customSubjects,
        generated_plan: generated.roadmap
      });

      // Enrich with any existing milestone completions
      const savedMilestones = await RoadmapProgress.findByUserId(userId);
      const milestoneMap = {};
      savedMilestones.forEach(m => {
        milestoneMap[m.milestone_key] = m.completed;
      });

      let totalTasks = 0;
      let completedTasks = 0;
      let totalHours = 0;
      let completedHours = 0;

      const enrichedPlan = generated.roadmap.map(phaseObj => {
        const enrichedWeeks = (phaseObj.weeks || []).map(w => {
          totalTasks++;
          const targetHours = w.targetHours || Math.round((savedDoc.daily_study_hours || 4.0) * 7);
          totalHours += targetHours;

          const isDone = Boolean(milestoneMap[w.key]);
          if (isDone) {
            completedTasks++;
            completedHours += targetHours;
          }

          return {
            ...w,
            targetHours,
            completed: isDone
          };
        });

        return {
          ...phaseObj,
          weeks: enrichedWeeks
        };
      });

      const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      const remainingHours = Math.max(0, totalHours - completedHours);

      res.json({
        success: true,
        message: 'Personalized roadmap dynamically generated and saved.',
        data: {
          config: generated.config,
          stats: {
            ...generated.stats,
            totalTasks,
            completedTasks,
            overallProgress,
            totalHours,
            completedHours,
            remainingHours
          },
          roadmap: enrichedPlan,
          totalTasks,
          completedTasks,
          overallProgress
        }
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Toggle completion state of a roadmap milestone
   */
  static async toggleMilestone(req, res, next) {
    try {
      const userId = req.user.id;
      const { milestone_key, month_index, week_index, title, completed, notes } = req.body;

      if (!milestone_key) {
        return res.status(400).json({ success: false, error: 'Milestone key is required' });
      }

      const updated = await RoadmapProgress.toggleMilestone(userId, {
        milestone_key,
        month_index: month_index || 1,
        week_index: week_index || 1,
        title: title || milestone_key,
        completed: completed === true,
        notes: notes || ''
      });

      res.json({
        success: true,
        message: 'Roadmap milestone updated in database',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Reset roadmap to default recommended for profile
   */
  static async resetRoadmap(req, res, next) {
    try {
      const userId = req.user.id;
      const profile = await Profile.findByUserId(userId);

      const generated = RoadmapGenerator.generatePlan({
        careerGoal: profile?.target_role || 'Full Stack Development',
        durationValue: 6,
        durationUnit: 'months',
        dailyStudyHours: profile?.daily_study_hours || 4.0,
        currentLevel: 'Beginner',
        targetLevel: 'Job/Placement Ready'
      });

      await UserRoadmap.upsert(userId, {
        career_goal: generated.config.careerGoal,
        duration_value: generated.config.durationValue,
        duration_unit: generated.config.durationUnit,
        daily_study_hours: generated.config.dailyStudyHours,
        current_level: generated.config.currentLevel,
        target_level: generated.config.targetLevel,
        selected_subjects: generated.config.selectedSubjects,
        custom_subjects: generated.config.customSubjects,
        generated_plan: generated.roadmap
      });

      res.json({
        success: true,
        message: 'Roadmap reset to recommended default',
        data: generated
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = RoadmapController;
