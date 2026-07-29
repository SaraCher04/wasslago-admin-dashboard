import React from 'react';
import { Wallet, DollarSign, ArrowUpRight, CheckCircle2, Clock, ShieldCheck, CreditCard } from 'lucide-react';

interface FinancialOverviewProps {
  onViewTransactions?: () => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({ onViewTransactions }) => {
  return (
    <section id="financial-overview-section" className="mb-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
              Financial Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Platform revenues, translator payouts, and transaction health (in Algerian Dinar)
            </p>
          </div>
        </div>

        {onViewTransactions && (
          <button
            onClick={onViewTransactions}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 hover:underline"
          >
            <span>View All Transactions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Financial Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue (Large primary focus) */}
        <div className="bg-white dark:bg-slate-900 bg-gradient-to-br from-blue-50/50 via-white to-white dark:from-slate-900 dark:to-slate-900 rounded-2xl p-5 shadow-xs border border-blue-200/80 dark:border-slate-800 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-3 top-3 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform pointer-events-none" />
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                DZD
              </span>
            </div>
            
            <div className="text-3xl font-semibold tracking-tight text-blue-700 dark:text-blue-400 my-1">
              17,822 <span className="text-lg font-medium text-slate-500 dark:text-slate-400">DZD</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Lifetime platform revenue</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">+18% YoY</span>
          </div>
        </div>

        {/* Card 2: Today's Revenue */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Today's Revenue
              </span>
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight my-1">
              0 <span className="text-lg font-medium text-slate-400">DZD</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Revenue generated today</span>
            <span className="text-amber-600 dark:text-amber-400 font-medium">Pending daytime orders</span>
          </div>
        </div>

        {/* Card 3: Pending Translator Payments */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Pending Translator Payments
              </span>
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight my-1">
              3,450 <span className="text-lg font-medium text-slate-400">DZD</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Awaiting admin payout approval</span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-md">
              2 Payouts
            </span>
          </div>
        </div>

        {/* Card 4: Completed Payments */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Completed Payments
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="text-3xl font-semibold text-slate-900 dark:text-white tracking-tight my-1">
              14,372 <span className="text-lg font-medium text-slate-400">DZD</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Successfully processed & cleared</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
