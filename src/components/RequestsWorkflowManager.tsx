import React, { useState, useMemo } from 'react';
import { 
  TranslationRequest, 
  TranslatorItem, 
  RequestStatus, 
  UrgencyLevel 
} from '../types';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Columns3, 
  Download, 
  Printer, 
  MoreHorizontal, 
  CheckSquare, 
  Square, 
  UserPlus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  FileText, 
  ChevronDown, 
  Eye, 
  MessageSquare, 
  Paperclip, 
  X, 
  ShieldAlert,
  ArrowUpRight,
  Layers
} from 'lucide-react';

interface RequestsWorkflowManagerProps {
  requests: TranslationRequest[];
  translators: TranslatorItem[];
  onSelectRequest: (request: TranslationRequest) => void;
  onUpdateRequestStatus: (id: string, newStatus: RequestStatus, assignedTranslator?: string) => void;
}

type SortField = 'id' | 'title' | 'clientCompany' | 'assignedTranslator' | 'status' | 'urgency' | 'amountDzd' | 'deadline' | 'date';
type SortOrder = 'asc' | 'desc';

interface ColumnConfig {
  key: string;
  label: string;
  visible: boolean;
}

export const RequestsWorkflowManager: React.FC<RequestsWorkflowManagerProps> = ({
  requests,
  translators,
  onSelectRequest,
  onUpdateRequestStatus,
}) => {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [langFilter, setLangFilter] = useState<string>('All');
  const [translatorFilter, setTranslatorFilter] = useState<string>('All');

  // Sorting state
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Column Visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'id', label: 'Request ID', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'client', label: 'Client', visible: true },
    { key: 'translator', label: 'Translator', visible: true },
    { key: 'langPair', label: 'Language Pair', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'urgency', label: 'Urgency', visible: true },
    { key: 'amount', label: 'Amount (DZD)', visible: true },
    { key: 'deadline', label: 'Deadline', visible: true },
    { key: 'creationDate', label: 'Creation Date', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Action Menu dropdown state for individual row
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);

  // Inline Translator Assignment Modal / Quick Dropdown
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null);

  // Internal note quick modal
  const [noteModalRequest, setNoteModalRequest] = useState<TranslationRequest | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Extract unique language pairs for filter dropdown
  const uniqueLangPairs = useMemo(() => {
    const pairs = new Set<string>();
    requests.forEach((r) => {
      pairs.add(`${r.sourceLang} → ${r.targetLang}`);
    });
    return Array.from(pairs);
  }, [requests]);

  // Helper for 2-letter language initials
  const getLangCode = (lang: string) => {
    if (!lang) return '';
    const langUpper = lang.trim().toUpperCase();
    if (langUpper.startsWith('ENG')) return 'EN';
    if (langUpper.startsWith('FRE') || langUpper.startsWith('FRA')) return 'FR';
    if (langUpper.startsWith('ARA')) return 'AR';
    if (langUpper.startsWith('GER') || langUpper.startsWith('DEU')) return 'DE';
    if (langUpper.startsWith('SPA') || langUpper.startsWith('ESP')) return 'ES';
    if (langUpper.startsWith('ITA')) return 'IT';
    if (langUpper.startsWith('RUS')) return 'RU';
    if (langUpper.startsWith('CHI') || langUpper.startsWith('ZHO')) return 'ZH';
    if (langUpper.startsWith('TUR')) return 'TR';
    return lang.slice(0, 2).toUpperCase();
  };

  // Column visibility lookup map
  const isColVisible = (key: string) => columns.find((c) => c.key === key)?.visible ?? true;

  const toggleColumn = (key: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.key === key ? { ...c, visible: !c.visible } : c))
    );
  };

  // Filtered and Sorted requests
  const processedRequests = useMemo(() => {
    return requests
      .filter((r) => {
        // Search matching
        const searchLower = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !searchLower ||
          r.id.toLowerCase().includes(searchLower) ||
          (r.title && r.title.toLowerCase().includes(searchLower)) ||
          r.clientName.toLowerCase().includes(searchLower) ||
          r.clientCompany.toLowerCase().includes(searchLower) ||
          r.docType.toLowerCase().includes(searchLower) ||
          (r.documentName && r.documentName.toLowerCase().includes(searchLower)) ||
          (r.assignedTranslator && r.assignedTranslator.toLowerCase().includes(searchLower)) ||
          `${r.sourceLang} ${r.targetLang}`.toLowerCase().includes(searchLower);

        // Status filter matching
        const matchesStatus =
          statusFilter === 'All' || r.status === statusFilter;

        // Urgency filter matching
        const matchesUrgency =
          urgencyFilter === 'All' ||
          (urgencyFilter === 'Urgent' && (r.urgency === 'Urgent' || r.urgent)) ||
          (urgencyFilter === 'Rush' && r.urgency === 'Rush') ||
          (urgencyFilter === 'Normal' && (!r.urgency || r.urgency === 'Normal'));

        // Language Pair filter matching
        const pairStr = `${r.sourceLang} → ${r.targetLang}`;
        const matchesLang = langFilter === 'All' || pairStr === langFilter;

        // Translator filter matching
        const matchesTranslator =
          translatorFilter === 'All' ||
          (translatorFilter === 'Unassigned' && !r.assignedTranslator) ||
          r.assignedTranslator === translatorFilter;

        return matchesSearch && matchesStatus && matchesUrgency && matchesLang && matchesTranslator;
      })
      .sort((a, b) => {
        let valA: any = a[sortField] || '';
        let valB: any = b[sortField] || '';

        if (sortField === 'title') {
          valA = a.title || a.docType;
          valB = b.title || b.docType;
        } else if (sortField === 'urgency') {
          const urgencyOrder: Record<string, number> = { Urgent: 3, Rush: 2, Normal: 1 };
          valA = urgencyOrder[a.urgency || (a.urgent ? 'Urgent' : 'Normal')];
          valB = urgencyOrder[b.urgency || (b.urgent ? 'Urgent' : 'Normal')];
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    requests,
    searchTerm,
    statusFilter,
    urgencyFilter,
    langFilter,
    translatorFilter,
    sortField,
    sortOrder,
  ]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Multi-selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === processedRequests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedRequests.map((r) => r.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Batch actions
  const handleBatchStatusChange = (newStatus: RequestStatus) => {
    selectedIds.forEach((id) => {
      onUpdateRequestStatus(id, newStatus);
    });
    setSelectedIds([]);
  };

  const handleBatchAssignTranslator = (translatorName: string) => {
    selectedIds.forEach((id) => {
      onUpdateRequestStatus(id, 'Assigned', translatorName);
    });
    setSelectedIds([]);
  };

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Request ID', 'Title', 'Client', 'Company', 'Source Lang', 'Target Lang', 'Doc Type', 'Translator', 'Status', 'Urgency', 'Amount (DZD)', 'Deadline', 'Date'];
    const rows = processedRequests.map((r) => [
      r.id,
      `"${(r.title || r.docType).replace(/"/g, '""')}"`,
      `"${r.clientName.replace(/"/g, '""')}"`,
      `"${r.clientCompany.replace(/"/g, '""')}"`,
      r.sourceLang,
      r.targetLang,
      r.docType,
      r.assignedTranslator || 'Unassigned',
      r.status,
      r.urgency || (r.urgent ? 'Urgent' : 'Normal'),
      r.amountDzd,
      `"${r.deadline}"`,
      `"${r.date}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Requests_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Export JSON
  const exportToJSON = () => {
    const jsonStr = JSON.stringify(processedRequests, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WasslaGo_Requests_Export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  // Stats calculation
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const inProgressCount = requests.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length;
  const reviewCount = requests.filter((r) => r.status === 'Review').length;
  const urgentCount = requests.filter((r) => r.urgent || r.urgency === 'Urgent' || r.urgency === 'Rush').length;
  const totalValue = requests.reduce((acc, r) => acc + r.amountDzd, 0);

  // Status Badge styling helper
  const renderStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 rounded-md border border-amber-200/60 dark:border-amber-900/60">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 rounded-md border border-sky-200/60 dark:border-sky-900/60">
            <UserPlus className="w-3 h-3" />
            Assigned
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded-md border border-blue-200/60 dark:border-blue-900/60">
            <Clock className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'Review':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 rounded-md border border-purple-200/60 dark:border-purple-900/60">
            <AlertCircle className="w-3 h-3" />
            Review
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-md border border-emerald-200/60 dark:border-emerald-900/60">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded-md border border-rose-200/60 dark:border-rose-900/60">
            Cancelled
          </span>
        );
    }
  };

  // Urgency Badge styling helper
  const renderUrgencyBadge = (request: TranslationRequest) => {
    const level: UrgencyLevel = request.urgency || (request.urgent ? 'Urgent' : 'Normal');
    switch (level) {
      case 'Urgent':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Urgent
          </span>
        );
      case 'Rush':
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-md">
            <Zap className="w-3 h-3 text-amber-600" />
            Rush
          </span>
        );
      case 'Normal':
      default:
        return (
          <span className="inline-flex whitespace-nowrap items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md">
            Normal
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Context Header (NO Create Button) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
              Translation Requests Workflow
            </h2>
            <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 rounded-md border border-blue-200/60 dark:border-blue-900">
              Live Client Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage incoming client job orders, translator assignments, QA reviews, and delivery deadlines.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start lg:self-auto text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Requests originate automatically from client submissions</span>
        </div>
      </div>

      {/* Workflow Operational KPI Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400 block uppercase">Total Queue Value</span>
          <div className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">
            {totalValue.toLocaleString()} <span className="text-xs text-slate-400">DZD</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">{totalCount} total orders</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 block uppercase">Needs Assignment</span>
          <div className="text-lg font-semibold text-amber-700 dark:text-amber-300 mt-0.5">
            {pendingCount} <span className="text-xs font-normal text-slate-400">pending</span>
          </div>
          <span className="text-[10px] text-amber-600/80 font-medium">Awaiting translator pickup</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 block uppercase">In Progress</span>
          <div className="text-lg font-semibold text-blue-700 dark:text-blue-300 mt-0.5">
            {inProgressCount} <span className="text-xs font-normal text-slate-400">active</span>
          </div>
          <span className="text-[10px] text-blue-600/80 font-medium">Translators working</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 block uppercase">Awaiting QA Review</span>
          <div className="text-lg font-semibold text-purple-700 dark:text-purple-300 mt-0.5">
            {reviewCount} <span className="text-xs font-normal text-slate-400">in review</span>
          </div>
          <span className="text-[10px] text-purple-600/80 font-medium">Drafts uploaded by translator</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs col-span-2 md:col-span-1">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 block uppercase">Rush & Urgent</span>
          <div className="text-lg font-semibold text-rose-700 dark:text-rose-300 mt-0.5">
            {urgentCount} <span className="text-xs font-normal text-slate-400">priority</span>
          </div>
          <span className="text-[10px] text-rose-600/80 font-medium">High priority turnaround</span>
        </div>
      </div>

      {/* Advanced Toolbar: Search, Filters, Column Selection, Export */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        {/* Row 1: Search + Main Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, title, client, translator, language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Columns, Export, Reset */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Column Selection Popover Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Columns3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Columns</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showColumnSelector && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-3 z-30 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                    Toggle Table Columns
                  </div>
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {columns.map((col) => (
                      <label
                        key={col.key}
                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 p-1.5 rounded-lg cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={col.visible}
                          onChange={() => toggleColumn(col.key)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{col.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Export Controls Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg p-1.5 z-30 space-y-1">
                  <button
                    onClick={exportToCSV}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={exportToJSON}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 font-medium"
                  >
                    <Printer className="w-3.5 h-3.5 text-purple-600" />
                    <span>Print Summary</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Status Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Urgency</label>
            <select
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="Normal">Normal</option>
              <option value="Rush">Rush</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          {/* Language Pair Filter */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Language Pair</label>
            <select
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="All">All Pairs</option>
              {uniqueLangPairs.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>

          {/* Sorting Control */}
          <div>
            <label className="text-[10px] font-medium text-slate-400 block mb-1">Sort By</label>
            <div className="flex items-center gap-1">
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value as SortField)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="date">Creation Date</option>
                <option value="deadline">Deadline</option>
                <option value="amountDzd">Amount</option>
                <option value="urgency">Urgency</option>
                <option value="status">Status</option>
                <option value="title">Title</option>
                <option value="id">Request ID</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300"
                title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Select Batch Actions Bar (when rows checked) */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-600 text-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="font-semibold bg-white/20 px-2 py-0.5 rounded-md text-[11px]">
              {selectedIds.length} selected
            </span>
            <span>Batch Workflow Operations:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Batch Status dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) handleBatchStatusChange(e.target.value as RequestStatus);
              }}
              defaultValue=""
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer"
            >
              <option value="" disabled className="text-slate-900">
                Change Status to...
              </option>
              <option value="Assigned" className="text-slate-900">Assigned</option>
              <option value="In Progress" className="text-slate-900">In Progress</option>
              <option value="Review" className="text-slate-900">Review</option>
              <option value="Completed" className="text-slate-900">Completed</option>
              <option value="Cancelled" className="text-slate-900">Cancelled</option>
            </select>

            {/* Batch Assign Translator dropdown */}
            <select
              onChange={(e) => {
                if (e.target.value) handleBatchAssignTranslator(e.target.value);
              }}
              defaultValue=""
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-2.5 py-1 text-xs font-medium cursor-pointer"
            >
              <option value="" disabled className="text-slate-900">
                Assign Translator...
              </option>
              {translators.map((t) => (
                <option key={t.id} value={t.name} className="text-slate-900">
                  {t.name} ({t.status})
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Customizable Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                {isColVisible('id') && (
                  <th
                    onClick={() => handleSort('id')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Request ID</span>
                      {sortField === 'id' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('title') && (
                  <th
                    onClick={() => handleSort('title')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Title</span>
                      {sortField === 'title' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('client') && (
                  <th
                    onClick={() => handleSort('clientCompany')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Client</span>
                      {sortField === 'clientCompany' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('translator') && (
                  <th
                    onClick={() => handleSort('assignedTranslator')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Translator</span>
                      {sortField === 'assignedTranslator' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('langPair') && <th className="p-3.5">Language Pair</th>}

                {isColVisible('status') && (
                  <th
                    onClick={() => handleSort('status')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      {sortField === 'status' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('urgency') && (
                  <th
                    onClick={() => handleSort('urgency')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Urgency</span>
                      {sortField === 'urgency' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('amount') && (
                  <th
                    onClick={() => handleSort('amountDzd')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Amount (DZD)</span>
                      {sortField === 'amountDzd' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('deadline') && (
                  <th
                    onClick={() => handleSort('deadline')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Deadline</span>
                      {sortField === 'deadline' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('creationDate') && (
                  <th
                    onClick={() => handleSort('date')}
                    className="p-3.5 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <div className="flex items-center gap-1">
                      <span>Creation Date</span>
                      {sortField === 'date' && <ArrowUpDown className="w-3 h-3 text-blue-600" />}
                    </div>
                  </th>
                )}

                {isColVisible('actions') && <th className="p-3.5 text-right">Action</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {processedRequests.length === 0 ? (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-medium">No matching translation requests found</p>
                      <p className="text-xs text-slate-400">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              ) : (
                processedRequests.map((req) => {
                  const isSelected = selectedIds.includes(req.id);
                  return (
                    <tr
                      key={req.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Request ID */}
                      {isColVisible('id') && (
                        <td className="p-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                          <button
                            onClick={() => onSelectRequest(req)}
                            className="font-mono text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 whitespace-nowrap font-semibold"
                          >
                            <span>{req.id}</span>
                            <ArrowUpRight className="w-3 h-3 shrink-0" />
                          </button>
                        </td>
                      )}

                      {/* Title */}
                      {isColVisible('title') && (
                        <td className="p-3.5 max-w-[200px]">
                          <div className="font-semibold text-slate-900 dark:text-white truncate">
                            {req.title || req.docType}
                          </div>
                        </td>
                      )}

                      {/* Client */}
                      {isColVisible('client') && (
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block whitespace-nowrap">
                            {req.clientName}
                          </span>
                        </td>
                      )}

                      {/* Translator */}
                      {isColVisible('translator') && (
                        <td className="p-3.5 whitespace-nowrap">
                          {req.assignedTranslator ? (
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block whitespace-nowrap">
                              {req.assignedTranslator}
                            </span>
                          ) : (
                            <button
                              onClick={() => setAssigningRequestId(req.id)}
                              className="px-2 py-1 text-[11px] font-medium bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 rounded-md border border-amber-200/80 dark:border-amber-900/80 inline-flex items-center gap-1 whitespace-nowrap"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>Assign Translator</span>
                            </button>
                          )}
                        </td>
                      )}

                      {/* Language Pair */}
                      {isColVisible('langPair') && (
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                            {getLangCode(req.sourceLang)} → {getLangCode(req.targetLang)}
                          </span>
                        </td>
                      )}

                      {/* Status */}
                      {isColVisible('status') && (
                        <td className="p-3.5 whitespace-nowrap">{renderStatusBadge(req.status)}</td>
                      )}

                      {/* Urgency */}
                      {isColVisible('urgency') && (
                        <td className="p-3.5 whitespace-nowrap">{renderUrgencyBadge(req)}</td>
                      )}

                      {/* Amount */}
                      {isColVisible('amount') && (
                        <td className="p-3.5 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {req.amountDzd.toLocaleString()}
                        </td>
                      )}

                      {/* Deadline */}
                      {isColVisible('deadline') && (
                        <td className="p-3.5 whitespace-nowrap min-w-[100px]">
                          <div className="font-medium text-slate-800 dark:text-slate-200">
                            {req.deadline}
                          </div>
                        </td>
                      )}

                      {/* Creation Date */}
                      {isColVisible('creationDate') && (
                        <td className="p-3.5 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap min-w-[100px]">
                          {req.date}
                        </td>
                      )}

                      {/* Actions Column */}
                      {isColVisible('actions') && (
                        <td className="p-3.5 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            {/* Dropdown Action Toggle */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveActionMenuId(
                                    activeActionMenuId === req.id ? null : req.id
                                  )
                                }
                                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {activeActionMenuId === req.id && (
                                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-40 space-y-0.5 text-left text-xs">
                                  <button
                                    onClick={() => {
                                      onSelectRequest(req);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Workflow Detail</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setAssigningRequestId(req.id);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                  >
                                    <UserPlus className="w-3.5 h-3.5 text-amber-600" />
                                    <span>
                                      {req.assignedTranslator ? 'Reassign Translator' : 'Assign Translator'}
                                    </span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setNoteModalRequest(req);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full px-2.5 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md font-medium flex items-center gap-2 text-slate-700 dark:text-slate-200"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Add Internal Note</span>
                                  </button>

                                  <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />

                                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase">
                                    Quick Change Status
                                  </div>

                                  {(['Pending', 'Assigned', 'In Progress', 'Review', 'Completed', 'Cancelled'] as RequestStatus[]).map(
                                    (st) => (
                                      <button
                                        key={st}
                                        onClick={() => {
                                          onUpdateRequestStatus(req.id, st);
                                          setActiveActionMenuId(null);
                                        }}
                                        className={`w-full px-2.5 py-1 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md font-medium text-[11px] flex items-center gap-1.5 ${
                                          req.status === st ? 'text-blue-600 font-semibold' : 'text-slate-600 dark:text-slate-300'
                                        }`}
                                      >
                                        <span className={`w-1.5 h-1.5 rounded-full ${req.status === st ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                        <span>{st}</span>
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with counts and pagination info */}
        <div className="p-3.5 bg-slate-50/60 dark:bg-slate-800/50 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-800 dark:text-slate-200">{processedRequests.length}</span> of{' '}
            <span className="font-semibold text-slate-800 dark:text-slate-200">{requests.length}</span> translation orders
          </div>
          <div className="text-[11px] text-slate-400">
            WasslaGo Operational Matrix • Real-time Sync
          </div>
        </div>
      </div>

      {/* Translator Quick Assignment Modal */}
      {assigningRequestId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Assign Translator
                </h3>
                <p className="text-xs text-slate-500">Order #{assigningRequestId}</p>
              </div>
              <button
                onClick={() => setAssigningRequestId(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {translators.map((trn) => (
                <div
                  key={trn.id}
                  onClick={() => {
                    onUpdateRequestStatus(assigningRequestId, 'Assigned', trn.name);
                    setAssigningRequestId(null);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={trn.avatar}
                      alt={trn.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                        {trn.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {trn.languages[0]} • ★ {trn.rating}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                      trn.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {trn.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setAssigningRequestId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Internal Note Modal */}
      {noteModalRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Internal Workflow Notes
                </h3>
                <p className="text-xs text-slate-500">Order #{noteModalRequest.id} - {noteModalRequest.docType}</p>
              </div>
              <button
                onClick={() => setNoteModalRequest(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing notes */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase block">Existing Notes</span>
              {noteModalRequest.internalNotes && noteModalRequest.internalNotes.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {noteModalRequest.internalNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No notes added yet.</p>
              )}
            </div>

            {/* Add new note input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400 uppercase block">Add Note</label>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type internal operational instruction or comment..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setNoteModalRequest(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (newNoteText.trim()) {
                    noteModalRequest.internalNotes = [
                      ...(noteModalRequest.internalNotes || []),
                      newNoteText.trim(),
                    ];
                    setNewNoteText('');
                  }
                  setNoteModalRequest(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-medium"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
