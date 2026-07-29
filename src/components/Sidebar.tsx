import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  UserCheck, 
  Wallet, 
  Award, 
  Settings, 
  ChevronDown, 
  Globe2,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  Star,
  Flag,
  MessageSquare
} from 'lucide-react';
import { NavigationTab, LanguageCode } from '../types';
import { i18nDict } from '../data/mockData';

interface SidebarProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  collapsed: boolean;
  lang: LanguageCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  collapsed,
  lang,
}) => {
  const [financeOpen, setFinanceOpen] = useState(
    currentTab.startsWith('finance')
  );
  const [qualityOpen, setQualityOpen] = useState(
    currentTab.startsWith('quality')
  );

  const t = i18nDict[lang];

  const isActive = (tab: NavigationTab) => currentTab === tab;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 transition-all duration-300 z-30 flex flex-col ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-[64px] border-b border-slate-200/80 dark:border-slate-800 flex items-center px-4 gap-3 select-none">
        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
          <Globe2 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              Wassla<span className="text-blue-600">Go</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase -mt-1">
              Translation Admin
            </span>
          </div>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {/* Dashboard */}
        <button
          onClick={() => onNavigate('dashboard')}
          title={collapsed ? t.dashboard : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive('dashboard')
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t.dashboard}</span>}
        </button>

        {/* Requests */}
        <button
          onClick={() => onNavigate('requests')}
          title={collapsed ? t.requests : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive('requests')
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-5 h-5 shrink-0" />
          {!collapsed && (
            <div className="flex-1 flex items-center justify-between">
              <span>{t.requests}</span>
              <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 rounded-md">
                12
              </span>
            </div>
          )}
        </button>

        {/* Translators */}
        <button
          onClick={() => onNavigate('translators')}
          title={collapsed ? t.translators : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive('translators')
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
          }`}
        >
          <UserCheck className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t.translators}</span>}
        </button>

        {/* Clients */}
        <button
          onClick={() => onNavigate('clients')}
          title={collapsed ? t.clients : undefined}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            isActive('clients')
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t.clients}</span>}
        </button>

        {/* Finance Category */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (collapsed) {
                onNavigate('finance-transactions');
              } else {
                setFinanceOpen(!financeOpen);
              }
            }}
            title={collapsed ? t.finance : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentTab.startsWith('finance')
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>{t.finance}</span>
                {financeOpen ? (
                  <ChevronDown className="w-4 h-4 opacity-70" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-70" />
                )}
              </div>
            )}
          </button>

          {!collapsed && financeOpen && (
            <div className="pl-8 pr-1 py-1 space-y-1 text-xs">
              <button
                onClick={() => onNavigate('finance-transactions')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isActive('finance-transactions')
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{t.transactions}</span>
              </button>
              <button
                onClick={() => onNavigate('finance-payments')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isActive('finance-payments')
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.payments}</span>
              </button>
              <button
                onClick={() => onNavigate('finance-payouts')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isActive('finance-payouts')
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{t.payouts}</span>
              </button>
            </div>
          )}
        </div>

        {/* Quality Category */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (collapsed) {
                onNavigate('quality-ratings');
              } else {
                setQualityOpen(!qualityOpen);
              }
            }}
            title={collapsed ? t.quality : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentTab.startsWith('quality')
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
            }`}
          >
            <Award className="w-5 h-5 shrink-0" />
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>{t.quality}</span>
                {qualityOpen ? (
                  <ChevronDown className="w-4 h-4 opacity-70" />
                ) : (
                  <ChevronRight className="w-4 h-4 opacity-70" />
                )}
              </div>
            )}
          </button>

          {!collapsed && qualityOpen && (
            <div className="pl-8 pr-1 py-1 space-y-1 text-xs">
              <button
                onClick={() => onNavigate('quality-ratings')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isActive('quality-ratings')
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Star className="w-3.5 h-3.5" />
                <span>{t.ratings}</span>
              </button>
              <button
                onClick={() => onNavigate('quality-reports')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isActive('quality-reports')
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{t.reports}</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              <button
                onClick={() => onNavigate('quality-feedback')}
                className={`w-full text-left px-3 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  isActive('quality-feedback')
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t.feedback}</span>
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('settings')}
            title={collapsed ? t.settings : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive('settings')
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{t.settings}</span>}
          </button>
        </div>
      </div>

      {/* Footer Info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>System Status</span>
          <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Operational
          </span>
        </div>
      )}
    </aside>
  );
};
