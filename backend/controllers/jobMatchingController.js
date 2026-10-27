const Profile = require('../models/Profile');
const Skill = require('../models/Skill');

const ROLE_PROFILES = {
  "fullstack": {
    title: "Junior Full Stack Engineer",
    skills: ["javascript", "react", "node.js", "express", "postgresql", "rest apis", "git"],
    minGpa: 7.0
  },
  "backend_java": {
    title: "Backend Java / Spring Boot Engineer",
    skills: ["java", "spring boot", "postgresql", "restful web services", "dsa", "oop"],
    minGpa: 7.5
  },
  "frontend_react": {
    title: "Frontend React Developer",
    skills: ["javascript", "react", "typescript", "html5", "css3", "tailwind css", "git"],
    minGpa: 7.0
  }
};

class JobMatchingController {
  static async matchJobDescription(req, res, next) {
    try {
      const userId = req.user.id;
      const { jobTitle = '', jobDescription = '', targetRole = 'fullstack' } = req.body;

      if (!jobDescription || jobDescription.trim().length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Job description text is required'
        });
      }

      const userSkills = await Skill.findByUserId(userId);
      const userSkillNames = userSkills.map(s => s.name.toLowerCase());
      const lowerJD = jobDescription.toLowerCase();

      // Extract skills required in JD
      const benchmark = ROLE_PROFILES[targetRole] || ROLE_PROFILES['fullstack'];
      const matched = [];
      const missing = [];

      benchmark.skills.forEach(skill => {
        const jdContains = lowerJD.includes(skill);
        const userHas = userSkillNames.includes(skill);

        if (jdContains) {
          if (userHas) {
            matched.push(skill);
          } else {
            missing.push(skill);
          }
        }
      });

      const totalFoundInJD = matched.length + missing.length;
      const matchScore = totalFoundInJD > 0 ? Math.round((matched.length / totalFoundInJD) * 100) : 70;

      res.json({
        success: true,
        data: {
          jobTitle: jobTitle || benchmark.title,
          matchScore,
          matchedSkills: matched,
          missingSkills: missing,
          verdict: matchScore >= 75 ? 'Strong Fit - High Probability of Shortlisting' : 'Moderate Fit - Skill Preparation Recommended',
          analyzedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = JobMatchingController;
