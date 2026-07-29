import React from 'react';
import { Award, Star, CheckCircle, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';
import { TranslatorItem } from '../types';

interface TranslatorPerformanceProps {
  translators: TranslatorItem[];
  onSelectTranslator: (translator: TranslatorItem) => void;
  onNavigateToTranslators: () => void;
}

export const TranslatorPerformance: React.FC<TranslatorPerformanceProps> = ({
  translators,
  onSelectTranslator,
  onNavigateToTranslators,
}) => {
  return (
    <section id="translator-performance-section" className="mb-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                Top Translators
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Marketplace performance leaderboard & quality compliance
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToTranslators}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 hover:underline"
          >
            <span>View All Translators</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table Leaderboard */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Rank & Translator</th>
                <th className="py-3 px-4">Specialization</th>
                <th className="py-3 px-4">Completed Jobs</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Completion Rate</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {translators.map((trn, idx) => (
                <tr
                  key={trn.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => onSelectTranslator(trn)}
                >
                  {/* Rank & Translator */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-[11px] flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <img
                        src={trn.avatar}
                        alt={trn.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {trn.name}
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                          ● {trn.status}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Specialization */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                    <div className="flex flex-wrap gap-1">
                      {trn.languages.slice(0, 2).map((lang, lIdx) => (
                        <span
                          key={lIdx}
                          className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Completed Jobs */}
                  <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {trn.completedJobs} jobs
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-900/40">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {trn.rating} ★
                    </span>
                  </td>

                  {/* Completion Rate */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${trn.completionRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {trn.completionRate}%
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTranslator(trn);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600 dark:hover:text-white rounded-lg transition-colors"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
