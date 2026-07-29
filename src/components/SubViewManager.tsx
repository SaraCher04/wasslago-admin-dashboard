import React, { useState } from 'react';
import { 
  NavigationTab, 
  TranslationRequest, 
  TranslatorItem, 
  ClientItem, 
  RequestStatus,
  LanguageCode
} from '../types';
import { RequestsWorkflowManager } from './RequestsWorkflowManager';
import { TranslatorsWorkflowManager } from './TranslatorsWorkflowManager';
import { ClientsWorkflowManager } from './ClientsWorkflowManager';
import { TransactionsView } from './finance/TransactionsView';
import { PaymentsView } from './finance/PaymentsView';
import { PayoutsView } from './finance/PayoutsView';
import { RatingsView } from './quality/RatingsView';
import { ReportsView } from './quality/ReportsView';
import { FeedbackView } from './quality/FeedbackView';
import { SettingsView } from './settings/SettingsView';
import { 
  FileText, 
  Users, 
  UserCheck, 
  CreditCard, 
  Star, 
  Flag, 
  Settings as SettingsIcon, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Save,
  MessageSquare,
  Building,
  DollarSign
} from 'lucide-react';

interface SubViewManagerProps {
  currentTab: NavigationTab;
  requests: TranslationRequest[];
  translators: TranslatorItem[];
  clients: ClientItem[];
  onSelectRequest: (req: TranslationRequest) => void;
  onSelectTranslator: (trn: TranslatorItem) => void;
  onNavigate: (tab: NavigationTab) => void;
  onAddNewRequest: () => void;
  onUpdateRequestStatus?: (id: string, newStatus: RequestStatus, assignedTranslator?: string) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  lang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

export const SubViewManager: React.FC<SubViewManagerProps> = ({
  currentTab,
  requests,
  translators,
  clients,
  onSelectRequest,
  onSelectTranslator,
  onNavigate,
  onAddNewRequest,
  onUpdateRequestStatus,
  darkMode,
  onToggleDarkMode,
  lang,
  onLanguageChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Requests Full View
  if (currentTab === 'requests') {
    return (
      <RequestsWorkflowManager
        requests={requests}
        translators={translators}
        onSelectRequest={onSelectRequest}
        onUpdateRequestStatus={onUpdateRequestStatus || (() => {})}
      />
    );
  }

  // 2. Translators View
  if (currentTab === 'translators') {
    return (
      <TranslatorsWorkflowManager
        translators={translators}
        requests={requests}
        onSelectTranslator={onSelectTranslator}
      />
    );
  }

  // 3. Clients View
  if (currentTab === 'clients') {
    return (
      <ClientsWorkflowManager
        clients={clients}
        requests={requests}
        onSelectRequest={onSelectRequest}
      />
    );
  }

  // 4. Finance Views
  if (currentTab === 'finance-payments') {
    return (
      <PaymentsView
        requests={requests}
        clients={clients}
        onSelectRequest={onSelectRequest}
      />
    );
  }

  if (currentTab === 'finance-payouts') {
    return (
      <PayoutsView
        translators={translators}
        onSelectTranslator={onSelectTranslator}
      />
    );
  }

  if (currentTab === 'finance' || currentTab === 'finance-transactions') {
    return (
      <TransactionsView
        requests={requests}
        clients={clients}
        translators={translators}
        onSelectRequest={onSelectRequest}
      />
    );
  }

  // Helper to handle translator selection by name
  const handleSelectTranslatorByName = (translatorName: string) => {
    const found = translators.find(
      (t) => t.name.toLowerCase() === translatorName.toLowerCase()
    );
    if (found) {
      onSelectTranslator(found);
    } else {
      onNavigate('translators');
    }
  };

  // Helper to handle request selection by ID
  const handleSelectRequestById = (requestId: string) => {
    const found = requests.find((r) => r.id === requestId);
    if (found) {
      onSelectRequest(found);
    } else {
      onNavigate('requests');
    }
  };

  // 5. Quality Views
  if (currentTab === 'quality-reports') {
    return (
      <ReportsView
        onSelectTranslator={handleSelectTranslatorByName}
        onSelectRequest={handleSelectRequestById}
      />
    );
  }

  if (currentTab === 'quality-feedback') {
    return <FeedbackView />;
  }

  if (currentTab === 'quality-ratings' || currentTab === 'quality') {
    return (
      <RatingsView
        onSelectTranslator={handleSelectTranslatorByName}
      />
    );
  }

  // 6. Settings View
  if (currentTab === 'settings') {
    return (
      <SettingsView
        darkMode={darkMode}
        onToggleDarkMode={onToggleDarkMode}
        lang={lang}
        onLanguageChange={onLanguageChange}
      />
    );
  }

  return null;
};
