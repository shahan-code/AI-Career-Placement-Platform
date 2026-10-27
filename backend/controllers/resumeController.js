const ResumeData = require('../models/ResumeData');

const ROLE_BENCHMARK_KEYWORDS = {
  "fullstack": [
    "javascript", "typescript", "react", "node.js", "express", "postgresql", "mongodb", 
    "rest api", "html5", "css3", "git", "github", "docker", "ci/cd", "redux", "tailwind"
  ],
  "backend_java": [
    "java", "spring boot", "hibernate", "jpa", "microservices", "postgresql", "mysql", 
    "docker", "restful api", "dsa", "multithreading", "jvm", "maven", "kafka"
  ],
  "frontend_react": [
    "javascript", "react", "redux", "tailwind css", "html5", "css3", "next.js", 
    "typescript", "webpack", "vite", "responsive design", "jest", "git"
  ],
  "data_science": [
    "python", "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "sql", 
    "data visualization", "machine learning", "deep learning", "tableau", "jupyter"
  ]
};

class ResumeController {
  static async analyzeResume(req, res, next) {
    try {
      const userId = req.user.id;
      const { text = '', fileName = 'candidate_resume.pdf', targetRole = 'fullstack' } = req.body;

      if (!text || text.trim().length < 20) {
        return res.status(400).json({
          success: false,
          error: 'Resume text or extracted content is required for ATS analysis'
        });
      }

      const lowerText = text.toLowerCase();
      const expectedKeywords = ROLE_BENCHMARK_KEYWORDS[targetRole] || ROLE_BENCHMARK_KEYWORDS['fullstack'];

      const matchedSkills = [];
      const missingKeywords = [];

      expectedKeywords.forEach(kw => {
        if (lowerText.includes(kw)) {
          matchedSkills.push(kw);
        } else {
          missingKeywords.push(kw);
        }
      });

      // Calculate ATS Score
      let baseScore = Math.round((matchedSkills.length / expectedKeywords.length) * 75);
      
      // Formatting & Structure Heuristics
      if (lowerText.includes('education') || lowerText.includes('b.tech') || lowerText.includes('university')) baseScore += 8;
      if (lowerText.includes('project') || lowerText.includes('experience')) baseScore += 10;
      if (lowerText.includes('gpa') || lowerText.includes('cgpa')) baseScore += 4;
      if (lowerText.includes('github.com') || lowerText.includes('linkedin.com')) baseScore += 5;

      const atsScore = Math.min(98, Math.max(35, baseScore));

      const suggestions = [
        `Incorporate missing high-impact technical keywords: ${missingKeywords.slice(0, 4).join(', ')}.`,
        'Quantify achievements in project descriptions using metrics (e.g., "Reduced latency by 25%", "Supported 5,000 users").',
        'Ensure contact information contains clickable GitHub and LinkedIn profile links.',
        'Use standard section headers: Summary, Technical Skills, Projects, Experience, Education.'
      ];

      const record = await ResumeData.record(userId, {
        file_name: fileName,
        target_role: targetRole,
        extracted_text: text.substring(0, 2000), // Preview length
        ats_score: atsScore,
        parsed_skills: matchedSkills,
        missing_keywords: missingKeywords,
        suggestions
      });

      res.json({
        success: true,
        message: 'Resume ATS analysis complete',
        data: {
          id: record.id,
          fileName,
          targetRole,
          atsScore,
          matchedSkills,
          missingKeywords,
          suggestions,
          wordCount: text.split(/\s+/).length,
          analyzedAt: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getHistory(req, res, next) {
    try {
      const userId = req.user.id;
      const history = await ResumeData.findByUserId(userId);
      res.json({
        success: true,
        data: history
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ResumeController;
