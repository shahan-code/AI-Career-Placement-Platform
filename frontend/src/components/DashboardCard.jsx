import React from 'react';

export default function DashboardCard({ title, subtitle, icon, value, change, badge, children, className = '' }) {
  return (
    <div className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800/90 shadow-xl backdrop-blur-md transition-all hover:border-slate-700/80 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              {icon}
            </div>
          )}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
          </div>
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {badge}
          </span>
        )}
      </div>

      {value !== undefined && (
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-extrabold text-white font-mono tracking-tight">{value}</span>
          {change && <span className="text-xs font-semibold text-emerald-400">{change}</span>}
        </div>
      )}

      {children}
    </div>
  );
}
