import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  LanguageCode, 
  TranslationRequest, 
  TranslatorItem, 
  ClientItem, 
  AlertItem, 
  NotificationItem,
  RequestStatus
} from './types';
import { 
  initialAlerts, 
  initialRequests, 
  initialTranslators, 
  initialClients, 
  mockNotifications 
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { AttentionCenter } from './components/AttentionCenter';
import { PlatformKPIs } from './components/PlatformKPIs';
import { FinancialOverview } from './components/FinancialOverview';
import { JobActivityAnalytics } from './components/JobActivityAnalytics';
import { RecentRequestsTable } from './components/RecentRequestsTable';
import { TranslatorPerformance } from './components/TranslatorPerformance';
import { RequestDetailModal } from './components/RequestDetailModal';
import { TranslatorDetailModal } from './components/TranslatorDetailModal';
import { SubViewManager } from './components/SubViewManager';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<LanguageCode>('en');

  // Application State
  const [alerts, setAlerts] = useState<AlertItem[]>(initialAlerts);
  const [requests, setRequests] = useState<TranslationRequest[]>(initialRequests);
  const [translators, setTranslators] = useState<TranslatorItem[]>(initialTranslators);
  const [clients, setClients] = useState<ClientItem[]>(initialClients);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  // Modal inspection state
  const [selectedRequest, setSelectedRequest] = useState<TranslationRequest | null>(null);
  const [selectedTranslator, setSelectedTranslator] = useState<TranslatorItem | null>(null);

  // Synchronize dark mode class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle alert selection from Section 1 Attention Center
  const handleSelectAlert = (alertItem: AlertItem) => {
    setCurrentTab(alertItem.targetView);
  };

  // Handle status update or assignment change on an order
  const handleUpdateRequestStatus = (
    id: string,
    newStatus: RequestStatus,
    assignedTranslator?: string
  ) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === id) {
          return {
            ...req,
            status: newStatus,
            assignedTranslator:
              assignedTranslator !== undefined
                ? assignedTranslator
                : req.assignedTranslator,
          };
        }
        return req;
      })
    );
  };

  // Add new request demo action
  const handleAddNewRequest = () => {
    const newReq: TranslationRequest = {
      id: `TR-${Math.floor(1093 + Math.random() * 90)}`,
      clientName: 'Yassine Hamid',
      clientCompany: 'Sonelgaz Algiers',
      sourceLang: 'Arabic',
      targetLang: 'English',
      docType: 'Regulatory Filing',
      assignedTranslator: null,
      status: 'Pending',
      date: 'Just now',
      deadline: '31 Jul 2026',
      wordCount: 1600,
      amountDzd: 3200,
    };
    setRequests((prev) => [newReq, ...prev]);
    setSelectedRequest(newReq);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className={`min-h-screen bg-[#F7F8FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased flex transition-colors ${lang === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* 1. Left Vertical Fixed Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        collapsed={sidebarCollapsed}
        lang={lang}
      />

      {/* Main Content Layout Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-[72px]' : 'ml-[240px]'
        }`}
      >
        {/* Top Navigation Bar */}
        <TopBar
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentTab={currentTab}
          onNavigate={(tab) => setCurrentTab(tab)}
          lang={lang}
          onLanguageChange={(l) => setLang(l)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        {/* Main Dashboard Canvas Body */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentTab === 'dashboard' ? (
            <>
              {/* SECTION 1 — Attention Center */}
              <AttentionCenter
                alerts={alerts}
                onSelectAlert={handleSelectAlert}
                onNavigate={(tab) => setCurrentTab(tab)}
              />

              {/* SECTION 2 — Platform Overview KPIs */}
              <PlatformKPIs
                onCardClick={(type) => {
                  if (type === 'clients') setCurrentTab('clients');
                  if (type === 'translators') setCurrentTab('translators');
                  if (type === 'requests' || type === 'in-progress' || type === 'completed')
                    setCurrentTab('requests');
                  if (type === 'reviews') setCurrentTab('quality-ratings');
                }}
              />

              {/* SECTION 3 — Financial Overview */}
              <FinancialOverview
                onViewTransactions={() => setCurrentTab('finance-transactions')}
              />

              {/* SECTION 4 — Job Activity Analytics */}
              <JobActivityAnalytics />

              {/* SECTION 5 — Recent Translation Requests */}
              <RecentRequestsTable
                requests={requests}
                onSelectRequest={(req) => setSelectedRequest(req)}
                onNavigateToRequests={() => setCurrentTab('requests')}
              />

              {/* SECTION 6 — Translator Performance */}
              <TranslatorPerformance
                translators={translators}
                onSelectTranslator={(trn) => setSelectedTranslator(trn)}
                onNavigateToTranslators={() => setCurrentTab('translators')}
              />
            </>
          ) : (
            /* Sub-views for specific sidebar navigation tabs */
            <SubViewManager
              currentTab={currentTab}
              requests={requests}
              translators={translators}
              clients={clients}
              onSelectRequest={(req) => setSelectedRequest(req)}
              onSelectTranslator={(trn) => setSelectedTranslator(trn)}
              onNavigate={(tab) => setCurrentTab(tab)}
              onAddNewRequest={handleAddNewRequest}
              onUpdateRequestStatus={handleUpdateRequestStatus}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode(!darkMode)}
              lang={lang}
              onLanguageChange={(l) => setLang(l)}
            />
          )}
        </main>
      </div>

      {/* Modal Inspector Drawers */}
      <RequestDetailModal
        request={selectedRequest}
        translators={translators}
        onClose={() => setSelectedRequest(null)}
        onUpdateRequestStatus={handleUpdateRequestStatus}
      />

      <TranslatorDetailModal
        translator={selectedTranslator}
        onClose={() => setSelectedTranslator(null)}
      />
    </div>
  );
}
