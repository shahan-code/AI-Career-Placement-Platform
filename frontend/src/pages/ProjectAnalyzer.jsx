import React, { useState } from 'react';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';

export default function ProjectAnalyzer({ profile }) {
  const [projectTitle, setProjectTitle] = useState('AI Career & Placement Intelligence Platform');
  const [techStack, setTechStack] = useState('React, Node.js, Express, PostgreSQL, JWT, Tailwind CSS');
  const [description, setDescription] = useState('A full-stack placement portal that parses resumes, calculates composite placement readiness from real quiz results and roadmap milestones, provides AI mock interview rubrics, and optimizes engineering projects.');
  
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!projectTitle || !description) return;

    setAnalyzing(true);
    setError('');

    try {
      const res = await api.analyzeProject({
        title: projectTitle,
        techStack,
        description
      });
      setResult(res.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze project');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Project Complexity Analyzer & STAR Resume Optimizer</h2>
        <p className="text-xs text-slate-400">
          Transform your academic capstone projects into high-impact STAR framework resume bullet points and generate targeted examiner Viva defense questions.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 6 cols */}
        <form onSubmit={handleAnalyze} className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3">
            Project Architecture Details
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Title</label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Technologies & Tools</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. React, Node.js, PostgreSQL, Docker, AWS"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project Description & Core Work</label>
            <textarea
              rows="6"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the problem solved, architectural modules, database structure, and key features..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={analyzing}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {analyzing ? 'AI Optimizing Architecture...' : '⚡ Optimize with STAR Framework'}
          </button>
        </form>

        {/* Right Output: 6 cols */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">STAR Bullets & Viva Defense</h3>
            {result && (
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Complexity: {result.complexityScore}/100
              </span>
            )}
          </div>

          {result ? (
            <div className="space-y-5 animate-fade-in">
              {/* Complexity Pill */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-mono text-slate-400 font-bold">Engineering Complexity</div>
                  <div className="text-2xl font-extrabold text-indigo-400 font-mono">{result.complexityScore}%</div>
                </div>
                <div className="w-36">
                  <ProgressBar value={result.complexityScore} color="indigo" />
                </div>
              </div>

              {/* STAR Resume Bullets */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
                  ★ High-Impact STAR Resume Bullets
                </div>
                <div className="space-y-2">
                  {result.starBullets?.map((bullet, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva Defense Questions */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">
                  🎓 Examiner Viva Defense Questions
                </div>
                <div className="space-y-2">
                  {result.vivaQuestions?.map((q, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-xs text-slate-300 leading-relaxed space-y-1">
                      <div className="font-semibold text-white">Q{i + 1}: {q}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 text-xs space-y-2">
              <div className="text-3xl">📐</div>
              <div>Fill in your project details on the left and click Optimize to generate STAR bullets.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
