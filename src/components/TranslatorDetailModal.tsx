import React from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Globe2, 
  ShieldCheck, 
  Award, 
  Wallet, 
  Clock, 
  Mail, 
  Phone 
} from 'lucide-react';
import { TranslatorItem } from '../types';

interface TranslatorDetailModalProps {
  translator: TranslatorItem | null;
  onClose: () => void;
}

export const TranslatorDetailModal: React.FC<TranslatorDetailModalProps> = ({
  translator,
  onClose,
}) => {
  if (!translator) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <img
              src={translator.avatar}
              alt={translator.name}
              className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/20"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  {translator.name}
                </h3>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Verified Professional Translator
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md">
                ● {translator.status}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Stats */}
        <div className="p-5 space-y-4 text-xs">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px] font-medium">Completed Jobs</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">
                {translator.completedJobs}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px] font-medium">Rating</span>
              <span className="text-lg font-semibold text-amber-500 flex items-center justify-center gap-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                {translator.rating}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-center">
              <span className="text-slate-400 block text-[10px] font-medium">Completion Rate</span>
              <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                {translator.completionRate}%
              </span>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-2">
              Language Specializations
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {translator.languages.map((lang, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 rounded-lg border border-blue-200/60 dark:border-blue-900"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Additional details */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-500" />
                <span>Total Earned (DZD):</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {translator.totalEarnedDzd.toLocaleString()} DZD
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>On-Time Delivery Rate:</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {translator.onTimeRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
