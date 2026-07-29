import React from 'react';
import { AlertTriangle, AlertCircle, Info, ChevronRight, ShieldAlert } from 'lucide-react';
import { AlertItem, NavigationTab } from '../types';

interface AttentionCenterProps {
  alerts: AlertItem[];
  onSelectAlert: (alert: AlertItem) => void;
  onNavigate: (tab: NavigationTab) => void;
}

export const AttentionCenter: React.FC<AttentionCenterProps> = ({
  alerts,
  onSelectAlert,
}) => {
  return (
    <section id="attention-center-section" className="mb-6">
      <div className="bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl p-4 md:p-5 shadow-xs transition-all">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Needs Attention
                <span className="px-2 py-0.5 text-[11px] font-medium bg-amber-500 text-white rounded-full">
                  {alerts.reduce((acc, a) => acc + a.count, 0)} items
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Operational issues requiring administrator action today
              </p>
            </div>
          </div>
        </div>

        {/* Horizontal Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map((alert) => {
            let bgStyle = '';
            let borderStyle = '';
            let textStyle = '';
            let iconComponent = null;

            if (alert.type === 'urgent') {
              bgStyle = 'bg-red-50/70 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50';
              borderStyle = 'border-red-200 dark:border-red-900/50';
              textStyle = 'text-red-700 dark:text-red-300';
              iconComponent = <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />;
            } else if (alert.type === 'warning') {
              bgStyle = 'bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-950/50';
              borderStyle = 'border-amber-200 dark:border-amber-900/50';
              textStyle = 'text-amber-800 dark:text-amber-300';
              iconComponent = <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
            } else {
              bgStyle = 'bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-950/30 dark:hover:bg-blue-950/50';
              borderStyle = 'border-blue-200 dark:border-blue-900/50';
              textStyle = 'text-blue-800 dark:text-blue-300';
              iconComponent = <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />;
            }

            return (
              <button
                key={alert.id}
                onClick={() => onSelectAlert(alert)}
                className={`p-3.5 rounded-xl border ${borderStyle} ${bgStyle} transition-all text-left flex items-start justify-between group cursor-pointer`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {iconComponent}
                    <span className={`text-sm font-medium ${textStyle}`}>
                      ⚠ {alert.count} {alert.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 pl-6">
                    {alert.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0 mt-0.5" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
