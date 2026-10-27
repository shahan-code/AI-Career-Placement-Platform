import React from 'react';

export default function QuizCard({ id, title, description, icon, questionCount, timeLimit, onStart, badge }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/60 shadow-xl transition-all flex flex-col justify-between group">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
            {icon || '📝'}
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              {badge}
            </span>
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
            {title}
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono">
          <span>📊 {questionCount || '3'} Questions</span>
          <span>⏱️ {timeLimit || '3 Mins'}</span>
        </div>
      </div>

      <button
        onClick={() => onStart?.(id)}
        className="mt-4 w-full py-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-xs font-semibold text-slate-300 shadow-md transition-all flex items-center justify-center gap-1.5"
      >
        <span>Start Assessment</span>
        <span>&rarr;</span>
      </button>
    </div>
  );
}
