import React from 'react';

export default function ProgressBar({ value = 0, max = 100, color = 'indigo', showLabel = false, height = 'h-2' }) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorClasses = {
    indigo: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    amber: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    purple: 'bg-gradient-to-r from-purple-500 to-indigo-500',
    rose: 'bg-gradient-to-r from-rose-500 to-pink-500'
  };

  const bgBar = colorClasses[color] || colorClasses.indigo;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-semibold mb-1">
          <span className="text-slate-400">Progress</span>
          <span className="text-slate-200 font-mono">{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/40`}>
        <div
          className={`${height} ${bgBar} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
