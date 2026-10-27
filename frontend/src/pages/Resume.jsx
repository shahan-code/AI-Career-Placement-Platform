import React, { useState } from 'react';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';

export default function Resume({ profile, targetRole = 'fullstack' }) {
  const [resumeText, setResumeText] = useState(`ALEX JOHNSON
Email: alex.johnson@btech.edu | GitHub: github.com/alex-dev | LinkedIn: linkedin.com/in/alex-dev
B.Tech Computer Science & Engineering (GPA: 8.6/10)

TECHNICAL SKILLS:
- Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
- Frontend: React, Redux, Tailwind CSS, Next.js
- Backend: Node.js, Express.js, RESTful APIs
- Databases: PostgreSQL, MongoDB, Redis
- Tools: Git, GitHub, Docker, Postman, Linux

PROJECTS:
1. AI Placement & Career Intelligence Platform:
- Built a full-stack platform using React, Node.js, Express, and PostgreSQL.
- Implemented JWT authentication and role-based access control.
- Designed ATS resume parser scoring algorithm reducing candidate manual review time.

EDUCATION:
- B.Tech in CSE (2022 - 2026), GPA: 8.6 / 10.0`);

  const [selectedRole, setSelectedRole] = useState(profile?.target_role || targetRole);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    setAnalyzing(true);
    setError('');

    try {
      const res = await api.analyzeResume({
        text: resumeText,
        fileName: 'student_resume.pdf',
        targetRole: selectedRole
      });
      setAnalysisResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Resume Intelligence & ATS Audit</h2>
        <p className="text-xs text-slate-400">
          Upload or paste your technical resume. The system extracts keywords, checks alignment against the recruiter ATS benchmark, and calculates your placement matching score.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 7 cols */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Resume Content & Role Target</h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Word Count: {resumeText.trim().split(/\s+/).length}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Placement Benchmark Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="fullstack">Junior Full Stack Developer</option>
              <option value="backend_java">Backend Java / Spring Boot Developer</option>
              <option value="frontend_react">Frontend React Developer</option>
              <option value="data_science">Data Scientist / AI Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Paste Resume Text or Load Candidate Profile</label>
            <textarea
              rows="12"
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste complete resume text here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {analyzing ? 'Running ATS Keyword Parser...' : '⚡ Analyze Resume for ATS Match'}
          </button>
        </div>

        {/* Right Audit Results: 5 cols */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">ATS Audit Report</h3>
              {analysisResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Calculated
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="space-y-5 mt-4">
                {/* Score Gauge */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">ATS Match Score</div>
                  <div className="text-4xl font-extrabold text-indigo-400 font-mono">
                    {analysisResult.atsScore}%
                  </div>
                  <ProgressBar value={analysisResult.atsScore} color="indigo" height="h-2.5" />
                  <div className="text-xs text-slate-400">
                    {analysisResult.atsScore >= 75 ? 'Strong candidate alignment with recruiter filters.' : 'Moderate alignment. Recommend adding missing keywords.'}
                  </div>
                </div>

                {/* Matched Keywords */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Found Keywords ({analysisResult.matchedSkills?.length || 0}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysisResult.matchedSkills || []).map((skill, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">
                    Missing Target Keywords:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysisResult.missingKeywords || []).map((kw, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg text-[11px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">Optimization Suggestions:</div>
                  <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
                    {(analysisResult.suggestions || []).map((sug, idx) => (
                      <li key={idx}>{sug}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                <div className="text-3xl">📄</div>
                <div>Click "Analyze Resume" to trigger live ATS keyword parsing and score generation.</div>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300">
            💡 <strong>Recruiter Tip:</strong> ATS scanners prioritize standard section headers (Technical Skills, Projects, Education) and measurable metrics.
          </div>
        </div>
      </div>
    </div>
  );
}
