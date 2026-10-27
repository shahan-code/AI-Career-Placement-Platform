import React from 'react';
import DashboardCard from '../components/DashboardCard';
import ProgressBar from '../components/ProgressBar';

export default function Dashboard({
  profile,
  readinessData,
  skills = [],
  quizzes = [],
  roadmapData,
  setActiveTab
}) {
  const compositeScore = readinessData?.compositeScore || 0;
  const breakdown = readinessData?.breakdown || {
    skills: { score: 70, weight: '30%' },
    quizzes: { score: 65, weight: '25%' },
    roadmap: { score: 40, weight: '20%' },
    interviews: { score: 80, weight: '15%' },
    projects: { score: 85, weight: '10%' }
  };

  const getTier = (score) => {
    if (score >= 80) return { label: 'Top Tier Placement Ready', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' };
    if (score >= 60) return { label: 'Intermediate Placement Ready', color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10' };
    return { label: 'Foundational Stage', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' };
  };

  const tier = getTier(compositeScore);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-purple-950/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              <span>🎯 Target Role:</span>
              <span className="text-white uppercase">{profile?.target_role || 'Full Stack Developer'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Candidate Readiness Hub &bull; {profile?.name || 'Candidate Student'}
            </h2>
            <p className="text-sm text-slate-300">
              {profile?.college || 'National Institute of Engineering & Technology'} &bull; {profile?.degree || 'B.Tech CSE'} ({profile?.semester || '7th Semester'})
            </p>
          </div>

          {/* Large Readiness Score Pill */}
          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-xl shrink-0">
            <div className="text-right">
              <div className="text-[11px] font-mono text-slate-400 uppercase font-bold tracking-wider">Placement Score</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">{compositeScore}%</div>
              <div className={`text-[10px] px-2 py-0.5 mt-1 rounded-md border font-semibold inline-block ${tier.color}`}>
                {tier.label}
              </div>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center bg-indigo-600/20 text-indigo-400 font-bold text-lg">
              {compositeScore >= 75 ? '⚡' : '🚀'}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Verified Skills"
          subtitle="Target Role Alignment"
          value={skills.length}
          badge="Active"
          icon="⚡"
        >
          <ProgressBar value={breakdown.skills?.score || 60} color="indigo" showLabel />
        </DashboardCard>

        <DashboardCard
          title="Quiz Assessments"
          subtitle="Aptitude & Core CS"
          value={`${quizzes.length} Tests`}
          badge="Aptitude"
          icon="📝"
        >
          <ProgressBar value={breakdown.quizzes?.score || 50} color="emerald" showLabel />
        </DashboardCard>

        <DashboardCard
          title="Roadmap Completed"
          subtitle="Personalized Milestones"
          value={`${roadmapData?.overallProgress || 0}%`}
          badge="Roadmap"
          icon="🗺️"
        >
          <ProgressBar value={roadmapData?.overallProgress || 0} color="purple" showLabel />
        </DashboardCard>

        <DashboardCard
          title="Mock Interviews"
          subtitle="AI Voice / Text Studio"
          value={`${breakdown.interviews?.attempts || 0} Evaluated`}
          badge="Interview"
          icon="🎙️"
        >
          <ProgressBar value={breakdown.interviews?.score || 70} color="rose" showLabel />
        </DashboardCard>
      </div>

      {/* 5 Readiness Pillars Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pillar Scores */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">5-Pillar Placement Readiness Breakdown</h3>
              <p className="text-xs text-slate-400">Weighted real-time algorithmic calculation across technical competencies.</p>
            </div>
            <button
              onClick={() => setActiveTab('skillgap')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Analyze Skill Gap &rarr;
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">1. Target Role Skill Match (Weight: 30%)</span>
                <span className="text-indigo-400 font-mono">{breakdown.skills?.score || 0}%</span>
              </div>
              <ProgressBar value={breakdown.skills?.score || 0} color="indigo" height="h-2.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">2. Aptitude & CS Assessment Performance (Weight: 25%)</span>
                <span className="text-emerald-400 font-mono">{breakdown.quizzes?.score || 0}%</span>
              </div>
              <ProgressBar value={breakdown.quizzes?.score || 0} color="emerald" height="h-2.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">3. Personalized Roadmap Milestones (Weight: 20%)</span>
                <span className="text-purple-400 font-mono">{breakdown.roadmap?.score || 0}%</span>
              </div>
              <ProgressBar value={breakdown.roadmap?.score || 0} color="purple" height="h-2.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">4. AI Mock Interview Performance (Weight: 15%)</span>
                <span className="text-rose-400 font-mono">{breakdown.interviews?.score || 0}%</span>
              </div>
              <ProgressBar value={breakdown.interviews?.score || 0} color="rose" height="h-2.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">5. Project Depth & Academic Metric (Weight: 10%)</span>
                <span className="text-amber-400 font-mono">{breakdown.projects?.score || 0}%</span>
              </div>
              <ProgressBar value={breakdown.projects?.score || 0} color="amber" height="h-2.5" />
            </div>
          </div>
        </div>

        {/* Actionable Next Steps */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🚀 Actionable Next Steps</span>
            </h3>
            <div className="space-y-3">
              <div
                onClick={() => setActiveTab('quiz')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-400">Take Daily Aptitude Drill</div>
                <div className="text-[11px] text-slate-400">3-min timed challenge on quantitative & DSA questions.</div>
              </div>

              <div
                onClick={() => setActiveTab('resume')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-400">Audit Resume for ATS Score</div>
                <div className="text-[11px] text-slate-400">Check keyword alignment against top tier recruiters.</div>
              </div>

              <div
                onClick={() => setActiveTab('interview')}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-400">Simulate AI Technical Interview</div>
                <div className="text-[11px] text-slate-400">Practice questions with live instant rubric critique.</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('roadmap')}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs shadow-lg shadow-indigo-600/30 transition text-center"
          >
            Open Personalized Roadmap &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
