import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Eye, 
  EyeOff, 
  Lock, 
  Star, 
  ArrowUpDown, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  SlidersHorizontal, 
  Download, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Award, 
  Globe2, 
  Briefcase, 
  X, 
  TrendingUp, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  DollarSign
} from 'lucide-react';
import { 
  TranslatorItem, 
  VerificationStatus, 
  MarketplaceVisibility, 
  TranslatorType,
  TranslationRequest
} from '../types';

interface TranslatorsWorkflowManagerProps {
  translators: TranslatorItem[];
  requests?: TranslationRequest[];
  onSelectTranslator?: (translator: TranslatorItem) => void;
  onUpdateTranslator?: (updatedTranslator: TranslatorItem) => void;
}

type SortField = 'name' | 'completedJobs' | 'rating' | 'completionRate' | 'totalEarnedDzd' | 'joinedDate';
type SortOrder = 'asc' | 'desc';

export const TranslatorsWorkflowManager: React.FC<TranslatorsWorkflowManagerProps> = ({
  translators: initialTranslatorsList,
  requests = [],
  onSelectTranslator,
  onUpdateTranslator,
}) => {
  // Local state for translators list to allow live updates (verification, visibility, etc.)
  const [translatorsList, setTranslatorsList] = useState<TranslatorItem[]>(initialTranslatorsList);

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('completedJobs');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Selection & Bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Column customization state
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    avatarName: true,
    contact: true,
    languages: true,
    verification: true,
    visibility: true,
    type: true,
    performance: true,
    earnings: true,
    joinedDate: true,
    actions: true,
  });

  // Workspace Detail Drawer state
  const [activeWorkspaceTranslator, setActiveWorkspaceTranslator] = useState<TranslatorItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'jobs' | 'certifications' | 'notes'>('overview');
  const [adminNote, setAdminNote] = useState('');
  const [notesList, setNotesList] = useState<{ id: string; date: string; text: string; author: string }[]>([
    { id: '1', date: '2026-07-20 14:30', text: 'Identity document & sworn translation license verified against Ministry records.', author: 'Admin Lead' },
    { id: '2', date: '2026-07-15 10:15', text: 'Promoted to Sworn Certified status after receiving 10 consecutive 5-star ratings.', author: 'Quality Manager' }
  ]);

  // Action Menu Popover per row
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sync state if props change
  React.useEffect(() => {
    setTranslatorsList(initialTranslatorsList);
  }, [initialTranslatorsList]);

  // Helper for language initials
  const getLangCode = (lang: string) => {
    if (!lang) return '';
    const langUpper = lang.trim().toUpperCase();
    if (langUpper.includes('→') || langUpper.includes('->')) {
      const parts = langUpper.split(/→|->/);
      return `${getLangCode(parts[0])} → ${getLangCode(parts[1])}`;
    }
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

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter & Sort translators
  const filteredTranslators = useMemo(() => {
    return translatorsList
      .filter((trn) => {
        // Search
        const term = searchTerm.toLowerCase();
        const matchesSearch = 
          !term ||
          trn.name.toLowerCase().includes(term) ||
          trn.id.toLowerCase().includes(term) ||
          (trn.email && trn.email.toLowerCase().includes(term)) ||
          (trn.phone && trn.phone.includes(term)) ||
          trn.languages.some((l) => l.toLowerCase().includes(term));

        // Filters
        const matchesStatus = statusFilter === 'ALL' || trn.status === statusFilter;
        const matchesVerification = verificationFilter === 'ALL' || trn.verificationStatus === verificationFilter;
        const matchesVisibility = visibilityFilter === 'ALL' || trn.marketplaceVisibility === visibilityFilter;
        const matchesType = typeFilter === 'ALL' || trn.translatorType === typeFilter;

        return matchesSearch && matchesStatus && matchesVerification && matchesVisibility && matchesType;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (sortField === 'joinedDate') {
          valA = a.joinedDate || '';
          valB = b.joinedDate || '';
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [translatorsList, searchTerm, statusFilter, verificationFilter, visibilityFilter, typeFilter, sortField, sortOrder]);

  // Paginated Results
  const totalPages = Math.ceil(filteredTranslators.length / itemsPerPage) || 1;
  const paginatedTranslators = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTranslators.slice(start, start + itemsPerPage);
  }, [filteredTranslators, currentPage, itemsPerPage]);

  // Select Row handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedTranslators.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Single Translator updates
  const updateSingleTranslator = (id: string, fields: Partial<TranslatorItem>) => {
    setTranslatorsList((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...fields };
          if (onUpdateTranslator) onUpdateTranslator(updated);
          if (activeWorkspaceTranslator?.id === id) {
            setActiveWorkspaceTranslator(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  // Bulk Action Executions
  const handleBulkAction = (action: 'verify' | 'sworn' | 'hide' | 'public' | 'suspend') => {
    if (selectedIds.length === 0) return;

    setTranslatorsList((prev) =>
      prev.map((t) => {
        if (!selectedIds.includes(t.id)) return t;
        let patch: Partial<TranslatorItem> = {};
        if (action === 'verify') patch = { verificationStatus: 'Verified' };
        if (action === 'sworn') patch = { verificationStatus: 'Certified Sworn', translatorType: 'Sworn Legal' };
        if (action === 'hide') patch = { marketplaceVisibility: 'Hidden' };
        if (action === 'public') patch = { marketplaceVisibility: 'Public' };
        if (action === 'suspend') patch = { verificationStatus: 'Suspended', marketplaceVisibility: 'Hidden', status: 'Offline' };
        
        const updated = { ...t, ...patch };
        if (onUpdateTranslator) onUpdateTranslator(updated);
        return updated;
      })
    );

    setSelectedIds([]);
  };

  // Export CSV helper
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Type', 'Verification', 'Visibility', 'Jobs', 'Rating', 'Earnings DZD'];
    const rows = filteredTranslators.map((t) => [
      t.id,
      `"${t.name}"`,
      t.email || '',
      t.phone || '',
      t.translatorType || 'General',
      t.verificationStatus || 'Verified',
      t.marketplaceVisibility || 'Public',
      t.completedJobs,
      t.rating,
      t.totalEarnedDzd
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Translators_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // KPI Calculations
  const totalCount = translatorsList.length;
  const certifiedSwornCount = translatorsList.filter((t) => t.verificationStatus === 'Certified Sworn').length;
  const pendingCount = translatorsList.filter((t) => t.verificationStatus === 'Pending').length;
  const availableCount = translatorsList.filter((t) => t.status === 'Available').length;
  const avgCompletionRate = Math.round(
    translatorsList.reduce((acc, curr) => acc + (curr.completionRate || 0), 0) / (totalCount || 1)
  );

  return (
    <div className="space-y-4">
      {/* KPI Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            Total Translators
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">Platform Total</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-500" />
            Sworn Certified
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{certifiedSwornCount}</span>
            <span className="text-[10px] text-indigo-500 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 rounded font-semibold">
              Legal
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending Review
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/80 px-1.5 py-0.5 rounded font-semibold">
              Needs Action
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Ready for Jobs
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{availableCount}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded font-semibold">
              Online
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            Avg. Quality
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{avgCompletionRate}%</span>
            <span className="text-[10px] text-slate-400 font-medium">On-Time</span>
          </div>
        </div>
      </div>

      {/* Control Bar & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Header Title */}
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Translator Marketplace Management</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">
                {filteredTranslators.length} total
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage sworn certifications, marketplace visibility, contact directory, and work history.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowColumnMenu(!showColumnMenu)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Columns</span>
              </button>

              {showColumnMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-3 text-xs space-y-2 animate-in fade-in duration-150">
                  <span className="font-bold text-slate-900 dark:text-white block border-b border-slate-100 dark:border-slate-800 pb-1.5">
                    Customize Columns
                  </span>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto">
                    {Object.entries({
                      avatarName: 'Translator Profile',
                      contact: 'Email & Phone',
                      languages: 'Languages',
                      verification: 'Verification Status',
                      visibility: 'Marketplace Visibility',
                      type: 'Translator Type',
                      performance: 'Performance Metrics',
                      earnings: 'Total Earnings',
                      joinedDate: 'Joined Date',
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-900 dark:hover:text-white">
                        <input
                          type="checkbox"
                          checked={visibleColumns[key as keyof typeof visibleColumns]}
                          onChange={(e) =>
                            setVisibleColumns((prev) => ({ ...prev, [key]: e.target.checked }))
                          }
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search & Multi-Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Search box */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, ID, email, phone, languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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

          {/* Verification Filter */}
          <div>
            <select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Verification: All</option>
              <option value="Certified Sworn">Certified Sworn Legal</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending Verification</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Type: All</option>
              <option value="Sworn Legal">Sworn Legal</option>
              <option value="Technical Specialist">Technical Specialist</option>
              <option value="General Freelancer">General Freelancer</option>
              <option value="Agency Partner">Agency Partner</option>
            </select>
          </div>

          {/* Sorting Control */}
          <div>
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
                setSortField(field);
                setSortOrder(order);
              }}
              className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="completedJobs-desc">Sort: Most Jobs</option>
              <option value="rating-desc">Sort: Highest Rated</option>
              <option value="totalEarnedDzd-desc">Sort: Top Earners</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="joinedDate-desc">Sort: Newest Joined</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Strip if selected */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-150">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>{selectedIds.length} translator(s) selected</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-2.5 py-1 font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Mark Verified
              </button>
              <button
                onClick={() => handleBulkAction('sworn')}
                className="px-2.5 py-1 font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Set Sworn
              </button>
              <button
                onClick={() => handleBulkAction('public')}
                className="px-2.5 py-1 font-semibold bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 rounded-lg transition-colors"
              >
                Set Public
              </button>
              <button
                onClick={() => handleBulkAction('hide')}
                className="px-2.5 py-1 font-semibold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Hide
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="px-2.5 py-1 font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Suspend
              </button>
              <button
                onClick={() => setSelectedIds([])}
                className="p-1 hover:text-slate-500 ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main CRM Compact Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200/80 dark:border-slate-800">
                {visibleColumns.avatarName && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Translator</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.contact && <th className="p-3">Contact</th>}

                {visibleColumns.languages && <th className="p-3">Supported Languages</th>}

                {visibleColumns.verification && <th className="p-3">Verification</th>}

                {visibleColumns.visibility && <th className="p-3">Visibility</th>}

                {visibleColumns.type && <th className="p-3">Type</th>}

                {visibleColumns.performance && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('completedJobs')}>
                    <div className="flex items-center gap-1">
                      <span>Performance</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.earnings && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('totalEarnedDzd')}>
                    <div className="flex items-center gap-1">
                      <span>Total Earnings (DZD)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.joinedDate && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('joinedDate')}>
                    <div className="flex items-center gap-1">
                      <span>Joined</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.actions && <th className="p-3 text-right">Action</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedTranslators.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <UserX className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No translators match your filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                        setVerificationFilter('ALL');
                        setVisibilityFilter('ALL');
                        setTypeFilter('ALL');
                      }}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                      Reset all filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedTranslators.map((t) => {
                  const isSelected = selectedIds.includes(t.id);
                  const isMenuOpen = openActionMenuId === t.id;

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Avatar & Name */}
                      {visibleColumns.avatarName && (
                        <td className="p-3 whitespace-nowrap min-w-[220px]">
                          <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                              setActiveWorkspaceTranslator(t);
                              if (onSelectTranslator) onSelectTranslator(t);
                            }}
                          >
                            <div className="relative shrink-0">
                              <img
                                src={t.avatar}
                                alt={t.name}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-400 transition-all"
                              />
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                                  t.status === 'Available'
                                    ? 'bg-emerald-500'
                                    : t.status === 'Busy'
                                    ? 'bg-amber-500'
                                    : 'bg-slate-400'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1 whitespace-nowrap">
                                <span>{t.name}</span>
                                {t.verificationStatus === 'Certified Sworn' && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Contact Info */}
                      {visibleColumns.contact && (
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <a
                              href={`mailto:${t.email || `${t.name.toLowerCase().replace(/\s+/g, '')}@wasslago.dz`}`}
                              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 text-[11px]"
                            >
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[140px]">{t.email || `${t.name.toLowerCase().replace(/\s+/g, '')}@wasslago.dz`}</span>
                            </a>
                            <a
                              href={`tel:${t.phone || '+213 550 00 00 00'}`}
                              className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px]"
                            >
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{t.phone || '+213 550 00 00 00'}</span>
                            </a>
                          </div>
                        </td>
                      )}

                      {/* Languages */}
                      {visibleColumns.languages && (
                        <td className="p-3 whitespace-nowrap">
                          <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                            {t.languages.map(getLangCode).join(' · ')}
                          </span>
                        </td>
                      )}

                      {/* Verification Status */}
                      {visibleColumns.verification && (
                        <td className="p-3">
                          {t.verificationStatus === 'Certified Sworn' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/70 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-900">
                              <ShieldCheck className="w-3 h-3" />
                              Sworn Certified
                            </span>
                          ) : t.verificationStatus === 'Pending' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-900">
                              <Clock className="w-3 h-3" />
                              Pending Review
                            </span>
                          ) : t.verificationStatus === 'Suspended' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900">
                              <AlertTriangle className="w-3 h-3" />
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-900">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified
                            </span>
                          )}
                        </td>
                      )}

                      {/* Marketplace Visibility */}
                      {visibleColumns.visibility && (
                        <td className="p-3">
                          {t.marketplaceVisibility === 'Public' || !t.marketplaceVisibility ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <Eye className="w-3.5 h-3.5" />
                              Public
                            </span>
                          ) : t.marketplaceVisibility === 'Invite-Only' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                              <Lock className="w-3.5 h-3.5" />
                              Invite-Only
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                              <EyeOff className="w-3.5 h-3.5" />
                              Hidden
                            </span>
                          )}
                        </td>
                      )}

                      {/* Translator Type */}
                      {visibleColumns.type && (
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                          {t.translatorType || 'General Freelancer'}
                        </td>
                      )}

                      {/* Performance Metrics */}
                      {visibleColumns.performance && (
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block text-xs">
                                {t.completedJobs} jobs
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <span className="text-amber-500 flex items-center font-bold">
                                  ★ {t.rating}
                                </span>
                                <span>• {t.completionRate}% rate</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Earnings */}
                      {visibleColumns.earnings && (
                        <td className="p-3 font-bold text-slate-900 dark:text-white text-xs whitespace-nowrap">
                          {t.totalEarnedDzd.toLocaleString()}
                        </td>
                      )}

                      {/* Joined Date */}
                      {visibleColumns.joinedDate && (
                        <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap min-w-[90px]">
                          {t.joinedDate || '15 Jan 2025'}
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.actions && (
                        <td className="p-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <div className="relative">
                              <button
                                onClick={() => setOpenActionMenuId(isMenuOpen ? null : t.id)}
                                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {isMenuOpen && (
                                <div
                                  className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 p-1.5 text-xs text-left space-y-0.5 animate-in fade-in duration-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      setActiveWorkspaceTranslator(t);
                                      if (onSelectTranslator) onSelectTranslator(t);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2"
                                  >
                                    <Briefcase className="w-3.5 h-3.5" />
                                    <span>View Profile / Workspace</span>
                                  </button>

                                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                  <button
                                    onClick={() => {
                                      updateSingleTranslator(t.id, { verificationStatus: 'Verified' });
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Mark Verified</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      updateSingleTranslator(t.id, {
                                        verificationStatus: 'Certified Sworn',
                                        translatorType: 'Sworn Legal'
                                      });
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                                    <span>Promote Sworn Certified</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      const newVis = t.marketplaceVisibility === 'Public' ? 'Hidden' : 'Public';
                                      updateSingleTranslator(t.id, { marketplaceVisibility: newVis });
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                  >
                                    {t.marketplaceVisibility === 'Public' ? (
                                      <>
                                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Hide from Marketplace</span>
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Publish to Marketplace</span>
                                      </>
                                    )}
                                  </button>

                                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                  <button
                                    onClick={() => {
                                      updateSingleTranslator(t.id, {
                                        verificationStatus: 'Suspended',
                                        marketplaceVisibility: 'Hidden',
                                        status: 'Offline'
                                      });
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-rose-600 dark:text-rose-400 flex items-center gap-2"
                                  >
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Suspend Account</span>
                                  </button>
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

        {/* Footer Pagination controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span>Showing {filteredTranslators.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTranslators.length)} of {filteredTranslators.length} translators</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="ml-2 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED TRANSLATOR WORKSPACE SLIDE-OVER DRAWER */}
      {activeWorkspaceTranslator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <img
                  src={activeWorkspaceTranslator.avatar}
                  alt={activeWorkspaceTranslator.name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeWorkspaceTranslator.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">({activeWorkspaceTranslator.id})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeWorkspaceTranslator.email || `${activeWorkspaceTranslator.name.toLowerCase().replace(/\s+/g, '')}@wasslago.dz`}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {activeWorkspaceTranslator.translatorType || 'General Freelancer'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {activeWorkspaceTranslator.verificationStatus || 'Verified'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveWorkspaceTranslator(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Workspace Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 gap-6 text-xs font-bold text-slate-500 bg-white dark:bg-slate-900">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Profile & Controls
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'performance'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Performance Metrics
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'jobs'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Assigned Jobs
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'certifications'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Sworn Credentials
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Admin Notes
              </button>
            </div>

            {/* Workspace Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
              {/* Tab 1: Overview & Controls */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Quick Workflow Controls Card */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>Marketplace Workflow Controls</span>
                      <span className="text-[10px] text-slate-400">Live Status Sync</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Verification Status
                        </label>
                        <select
                          value={activeWorkspaceTranslator.verificationStatus || 'Verified'}
                          onChange={(e) =>
                            updateSingleTranslator(activeWorkspaceTranslator.id, {
                              verificationStatus: e.target.value as VerificationStatus,
                            })
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Verified">Verified Professional</option>
                          <option value="Certified Sworn">Certified Sworn Legal</option>
                          <option value="Pending">Pending Verification</option>
                          <option value="Suspended">Suspended</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Marketplace Visibility
                        </label>
                        <select
                          value={activeWorkspaceTranslator.marketplaceVisibility || 'Public'}
                          onChange={(e) =>
                            updateSingleTranslator(activeWorkspaceTranslator.id, {
                              marketplaceVisibility: e.target.value as MarketplaceVisibility,
                            })
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Public">Public (Visible to Clients)</option>
                          <option value="Hidden">Hidden (Internal Only)</option>
                          <option value="Invite-Only">Invite-Only (VIP Jobs)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Translator Classification
                        </label>
                        <select
                          value={activeWorkspaceTranslator.translatorType || 'General Freelancer'}
                          onChange={(e) =>
                            updateSingleTranslator(activeWorkspaceTranslator.id, {
                              translatorType: e.target.value as TranslatorType,
                            })
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Sworn Legal">Sworn Legal</option>
                          <option value="Technical Specialist">Technical Specialist</option>
                          <option value="General Freelancer">General Freelancer</option>
                          <option value="Agency Partner">Agency Partner</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Platform Status
                        </label>
                        <select
                          value={activeWorkspaceTranslator.status}
                          onChange={(e) =>
                            updateSingleTranslator(activeWorkspaceTranslator.id, {
                              status: e.target.value as any,
                            })
                          }
                          className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="Available">Available</option>
                          <option value="Busy">Busy</option>
                          <option value="Offline">Offline</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info Details */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">Contact & Bio</h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Email Address:</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {activeWorkspaceTranslator.email || `${activeWorkspaceTranslator.name.toLowerCase().replace(/\s+/g, '')}@wasslago.dz`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Phone Number:</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {activeWorkspaceTranslator.phone || '+213 550 12 34 56'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Joined Platform:</span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {activeWorkspaceTranslator.joinedDate || '15 Jan 2025'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Earnings:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {activeWorkspaceTranslator.totalEarnedDzd.toLocaleString()} DZD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white">Verified Language Pairs</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeWorkspaceTranslator.languages.map((l, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-900"
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Performance */}
              {activeTab === 'performance' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center border border-slate-200/60 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Completed Jobs</span>
                      <span className="text-xl font-bold text-slate-900 dark:text-white">
                        {activeWorkspaceTranslator.completedJobs}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center border border-slate-200/60 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Rating</span>
                      <span className="text-xl font-bold text-amber-500">
                        ★ {activeWorkspaceTranslator.rating}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-center border border-slate-200/60 dark:border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Completion Rate</span>
                      <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {activeWorkspaceTranslator.completionRate}%
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">Delivery SLA & Quality Breakdown</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-600 dark:text-slate-400">On-Time Deadline Compliance</span>
                          <span className="font-bold text-slate-900 dark:text-white">{activeWorkspaceTranslator.onTimeRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${activeWorkspaceTranslator.onTimeRate}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-600 dark:text-slate-400">Client Approval Rate</span>
                          <span className="font-bold text-slate-900 dark:text-white">{activeWorkspaceTranslator.completionRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${activeWorkspaceTranslator.completionRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Assigned Jobs */}
              {activeTab === 'jobs' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white">Assigned Translation Orders</h4>
                  {requests.filter((r) => r.assignedTranslator === activeWorkspaceTranslator.name).length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                      <Briefcase className="w-6 h-6 mx-auto mb-1 text-slate-300" />
                      <span>No active or recent orders assigned to this translator.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {requests
                        .filter((r) => r.assignedTranslator === activeWorkspaceTranslator.name)
                        .map((r) => (
                          <div
                            key={r.id}
                            className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700 flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{r.id} - {r.docType}</span>
                              <span className="text-[11px] text-slate-500">{r.clientCompany} • {r.sourceLang} → {r.targetLang}</span>
                            </div>
                            <div className="text-right">
                              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                                {r.status}
                              </span>
                              <span className="block text-[11px] font-bold text-slate-900 dark:text-white mt-0.5">
                                {r.amountDzd} DZD
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Certifications */}
              {activeTab === 'certifications' && (
                <div className="space-y-3">
                  <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-xl flex items-start gap-3">
                    <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-indigo-900 dark:text-indigo-200">Official Sworn Seal & Registration</h4>
                      <p className="text-slate-600 dark:text-indigo-300 text-[11px] mt-0.5">
                        Verified against the Algerian Ministry of Justice sworn translators directory.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">License Number:</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">DZ-SWORN-2025-0849</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-slate-500">Issuing Court Jurisdiction:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Cour d'Alger (Algeria)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Document Expiration / Renewal:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Valid through Dec 2028</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Admin Notes */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="block font-bold text-slate-900 dark:text-white">Add Internal Note</label>
                    <textarea
                      rows={2}
                      placeholder="Type internal management note..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => {
                        if (!adminNote.trim()) return;
                        setNotesList((prev) => [
                          {
                            id: Date.now().toString(),
                            date: new Date().toISOString().replace('T', ' ').slice(0, 16),
                            text: adminNote,
                            author: 'Admin User'
                          },
                          ...prev
                        ]);
                        setAdminNote('');
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Internal Note
                    </button>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <h5 className="font-bold text-slate-700 dark:text-slate-300">Audit & Management Log</h5>
                    {notesList.map((n) => (
                      <div key={n.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700">
                        <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{n.author}</span>
                          <span>{n.date}</span>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Workspace Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between">
              <button
                onClick={() => {
                  updateSingleTranslator(activeWorkspaceTranslator.id, {
                    verificationStatus: activeWorkspaceTranslator.verificationStatus === 'Suspended' ? 'Verified' : 'Suspended'
                  });
                }}
                className={`px-3 py-1.5 font-bold rounded-xl text-xs ${
                  activeWorkspaceTranslator.verificationStatus === 'Suspended'
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200 dark:bg-rose-950 dark:text-rose-300'
                }`}
              >
                {activeWorkspaceTranslator.verificationStatus === 'Suspended' ? 'Unsuspend Account' : 'Suspend Account'}
              </button>

              <button
                onClick={() => setActiveWorkspaceTranslator(null)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold rounded-xl text-xs hover:opacity-90 transition-opacity"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
