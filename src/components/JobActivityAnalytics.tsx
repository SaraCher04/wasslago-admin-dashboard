import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { TrendingUp, Calendar, Filter, Sparkles, Activity } from 'lucide-react';
import { ActivityDataPoint } from '../types';
import { mockActivityData30Days } from '../data/mockData';

interface JobActivityAnalyticsProps {
  data?: ActivityDataPoint[];
}

export const JobActivityAnalytics: React.FC<JobActivityAnalyticsProps> = ({
  data = mockActivityData30Days,
}) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90' | 'custom'>('30');
  const [showCreated, setShowCreated] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [showCancelled, setShowCancelled] = useState(true);

  // Filter dataset according to selected range
  const filteredData = React.useMemo(() => {
    if (timeRange === '7') {
      return data.slice(-4);
    }
    if (timeRange === '90') {
      // Simulate extended dataset
      return [
        { date: '01 May', created: 2, completed: 2, cancelled: 0, rawDate: '2026-05-01' },
        { date: '15 May', created: 5, completed: 4, cancelled: 0, rawDate: '2026-05-15' },
        { date: '01 Jun', created: 8, completed: 7, cancelled: 1, rawDate: '2026-06-01' },
        { date: '15 Jun', created: 11, completed: 9, cancelled: 0, rawDate: '2026-06-15' },
        ...data,
      ];
    }
    return data;
  }, [timeRange, data]);

  const totalCreated = filteredData.reduce((acc, curr) => acc + curr.created, 0);
  const totalCompleted = filteredData.reduce((acc, curr) => acc + curr.completed, 0);
  const totalCancelled = filteredData.reduce((acc, curr) => acc + curr.cancelled, 0);

  return (
    <section id="translation-activity-section" className="mb-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
        {/* Card Header & Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                Translation Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track job creation and completion trends
              </p>
            </div>
          </div>

          {/* Time Range Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center text-xs font-semibold">
              <button
                onClick={() => setTimeRange('7')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === '7'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                7 days
              </button>
              <button
                onClick={() => setTimeRange('30')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === '30'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                30 days
              </button>
              <button
                onClick={() => setTimeRange('90')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === '90'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                90 days
              </button>
              <button
                onClick={() => setTimeRange('custom')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === 'custom'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Custom range
              </button>
            </div>
          </div>
        </div>

        {/* Top Summary KPI Banner + Metric Checkboxes */}
        <div className="my-4 p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Jobs This Month
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {totalCreated}
                </span>
                <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md">
                  <TrendingUp className="w-3 h-3" />
                  ↑ 12%
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Compared to previous month
              </span>
            </div>

            <div className="hidden sm:block h-8 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="hidden sm:flex items-center gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Completed</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalCompleted}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Cancelled</span>
                <span className="font-bold text-red-500">{totalCancelled}</span>
              </div>
            </div>
          </div>

          {/* Toggles for Chart Series */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30">
              <input
                type="checkbox"
                checked={showCreated}
                onChange={(e) => setShowCreated(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
              <span className="text-slate-800 dark:text-slate-200">Created Requests</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-slate-800 dark:text-slate-200">Completed Jobs</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/30">
              <input
                type="checkbox"
                checked={showCancelled}
                onChange={(e) => setShowCancelled(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-red-600 focus:ring-red-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className="text-slate-800 dark:text-slate-200">Cancelled Jobs</span>
            </label>
          </div>
        </div>

        {/* Insights Callout Box */}
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 rounded-xl border border-blue-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white">July Activity Insight: </span>
            <span>Peak activity occurred on <strong className="text-blue-600 dark:text-blue-400">25 July</strong> with 18 requests processed — representing a <strong className="text-emerald-600 dark:text-emerald-400">+30% increase</strong> compared to the previous period.</span>
          </div>
        </div>

        {/* Chart Visualization */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCancelled" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.5} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                }}
              />
              {showCreated && (
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Created Requests"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                />
              )}
              {showCompleted && (
                <Area
                  type="monotone"
                  dataKey="completed"
                  name="Completed Jobs"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
              )}
              {showCancelled && (
                <Area
                  type="monotone"
                  dataKey="cancelled"
                  name="Cancelled Jobs"
                  stroke="#EF4444"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCancelled)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};
