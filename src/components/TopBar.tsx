import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  Globe, 
  Sun, 
  Moon, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { LanguageCode, NotificationItem, NavigationTab } from '../types';
import { i18nDict } from '../data/mockData';

interface TopBarProps {
  onToggleSidebar: () => void;
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  lang: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleSidebar,
  currentTab,
  onNavigate,
  lang,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  notifications,
  onMarkNotificationRead,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const t = i18nDict[lang];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return t.dashboard;
      case 'requests':
        return t.requests;
      case 'translators':
        return t.translators;
      case 'clients':
        return t.clients;
      case 'finance':
      case 'finance-transactions':
        return `${t.finance} — ${t.transactions}`;
      case 'finance-payments':
        return `${t.finance} — ${t.payments}`;
      case 'finance-payouts':
        return `${t.finance} — ${t.payouts}`;
      case 'quality':
      case 'quality-ratings':
        return `${t.quality} — ${t.ratings}`;
      case 'quality-reports':
        return `${t.quality} — ${t.reports}`;
      case 'quality-feedback':
        return `${t.quality} — ${t.feedback}`;
      case 'settings':
        return t.settings;
      default:
        return t.dashboard;
    }
  };

  return (
    <header className="h-[64px] bg-white dark:bg-slate-900 border-b border-slate-200/90 dark:border-slate-800 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
            {getTitle()}
          </h1>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700 transition-colors"
            title="Select Language"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="uppercase">{lang}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50 text-xs">
              <button
                onClick={() => {
                  onLanguageChange('en');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                  lang === 'en' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>English</span>
                {lang === 'en' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  onLanguageChange('fr');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                  lang === 'fr' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Français</span>
                {lang === 'fr' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  onLanguageChange('ar');
                  setShowLangMenu(false);
                }}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                  lang === 'ar' ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>العربية</span>
                {lang === 'ar' && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
        </button>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#2563EB] text-white rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 transition-colors cursor-pointer flex gap-3 ${
                        !n.read
                          ? 'bg-blue-50/40 dark:bg-blue-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {n.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="flex-1 text-xs space-y-0.5">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                          <span>{n.title}</span>
                          <span className="text-[10px] font-normal text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/60 dark:border-slate-800"
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Admin Profile"
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-600/20"
            />
            <div className="hidden md:flex flex-col text-left text-xs">
              <span className="font-bold text-slate-900 dark:text-white leading-none">
                Amine Rahmani
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                Super Admin
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">Amine Rahmani</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">admin@wasslago.dz</p>
              </div>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Profile</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-200 flex items-center gap-2"
              >
                <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

              <button
                onClick={() => {
                  alert('Logged out safely');
                  setShowProfileMenu(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
