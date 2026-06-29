import React from 'react';

const colorThemes = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/20',
    icon: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200/50 dark:border-teal-900/30'
  },
  indigo: {
    bg: 'bg-indigo-50 dark:bg-indigo-950/20',
    icon: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200/50 dark:border-indigo-900/30'
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/50 dark:border-amber-900/30'
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    icon: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/50 dark:border-rose-900/30'
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    icon: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/50 dark:border-emerald-900/30'
  },
  slate: {
    bg: 'bg-slate-50 dark:bg-slate-950/20',
    icon: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200/50 dark:border-slate-900/30'
  }
};

const StatCard = ({ icon, label, value, theme = 'teal', subtext }) => {
  const styles = colorThemes[theme] || colorThemes.teal;

  return (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border ${styles.border} shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-300`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div className={`w-10 h-10 ${styles.bg} ${styles.icon} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold font-display text-slate-800 dark:text-white">{value}</div>
        {subtext && <p className="text-[11px] text-slate-400 font-medium">{subtext}</p>}
      </div>
    </div>
  );
};

export default StatCard;
