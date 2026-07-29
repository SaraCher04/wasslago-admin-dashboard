import React from 'react';
import { 
  Users, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Star,
  TrendingUp
} from 'lucide-react';

interface PlatformKPIsProps {
  onCardClick?: (type: string) => void;
}

export const PlatformKPIs: React.FC<PlatformKPIsProps> = ({ onCardClick }) => {
  const kpis = [
    {
      id: 'clients',
      title: 'Total Clients',
      value: '44',
      subtext: '+5 this month',
      badge: 'Active Base',
      icon: Users,
      iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    },
    {
      id: 'translators',
      title: 'Active Translators',
      value: '21',
      subtext: '18 currently available',
      badge: 'Verified',
      icon: UserCheck,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'requests',
      title: 'Active Requests',
      value: '12',
      subtext: '4 new today',
      badge: 'Action Needed',
      icon: FileText,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    },
    {
      id: 'completed',
      title: 'Completed Jobs',
      value: '245',
      subtext: '+12% this month',
      badge: '+12%',
      icon: CheckCircle2,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    },
    {
      id: 'in-progress',
      title: 'Jobs In Progress',
      value: '6',
      subtext: 'Currently being translated',
      badge: 'Live',
      icon: Clock,
      iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
    },
    {
      id: 'reviews',
      title: 'Client Reviews',
      value: '5',
      subtext: 'Average rating: 4.8',
      badge: '4.8 ★',
      icon: Star,
      iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-500',
    },
  ];

  return (
    <section id="platform-overview-section" className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            Platform Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time marketplace operational metrics (excluding financial metrics)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onCardClick?.(kpi.id)}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-800 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {kpi.title}
                </span>
                <div className={`p-2 rounded-xl ${kpi.iconBg} transition-transform group-hover:scale-105`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-semibold text-slate-900 dark:text-white tracking-tight my-1">
                  {kpi.value}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span className="truncate">{kpi.subtext}</span>
                  {kpi.badge && (
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md shrink-0">
                      {kpi.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
