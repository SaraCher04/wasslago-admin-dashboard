import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  CreditCard, 
  FileText, 
  Crown, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  SlidersHorizontal, 
  Download, 
  ArrowUpDown, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  UserPlus, 
  DollarSign, 
  TrendingUp, 
  Send, 
  Calendar,
  Layers
} from 'lucide-react';
import { 
  ClientItem, 
  ClientAccountType, 
  ClientAccountStatus, 
  TranslationRequest 
} from '../types';

interface ClientsWorkflowManagerProps {
  clients: ClientItem[];
  requests?: TranslationRequest[];
  onSelectClient?: (client: ClientItem) => void;
  onUpdateClient?: (updatedClient: ClientItem) => void;
  onSelectRequest?: (request: TranslationRequest) => void;
}

type SortField = 'name' | 'company' | 'totalRequests' | 'totalSpentDzd' | 'joinedDate' | 'lastActivity';
type SortOrder = 'asc' | 'desc';

export const ClientsWorkflowManager: React.FC<ClientsWorkflowManagerProps> = ({
  clients: initialClientsList,
  requests = [],
  onSelectClient,
  onUpdateClient,
  onSelectRequest,
}) => {
  // Local state for live updates
  const [clientsList, setClientsList] = useState<ClientItem[]>(initialClientsList);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<SortField>('totalSpentDzd');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Column visibility
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    profile: true,
    company: true,
    contact: true,
    verification: true,
    requests: true,
    spending: true,
    status: true,
    joinedDate: true,
    lastActivity: true,
    actions: true,
  });

  // Action Menu per row
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  // Workspace Drawer state
  const [activeWorkspaceClient, setActiveWorkspaceClient] = useState<ClientItem | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'payments' | 'notes'>('overview');
  const [newNoteText, setNewNoteText] = useState('');
  const [clientNotes, setClientNotes] = useState<{ [clientId: string]: { id: string; date: string; text: string; author: string }[] }>({
    'cli-1': [
      { id: '1', date: '2026-07-22 11:30', text: 'Enterprise account review complete. Added tax ID details for invoice generation.', author: 'Admin Lead' },
    ],
    'cli-2': [
      { id: '2', date: '2026-07-25 15:40', text: 'Sonatrach Tech Services requested expedited turnarounds for official oilfield safety documentation.', author: 'Account Manager' },
    ]
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sync state if props change
  React.useEffect(() => {
    setClientsList(initialClientsList);
  }, [initialClientsList]);

  // Handle Sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Filter & Sort clients
  const filteredClients = useMemo(() => {
    return clientsList
      .filter((cli) => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !term ||
          cli.name.toLowerCase().includes(term) ||
          cli.company.toLowerCase().includes(term) ||
          cli.id.toLowerCase().includes(term) ||
          cli.email.toLowerCase().includes(term) ||
          (cli.phone && cli.phone.includes(term));

        const matchesStatus = statusFilter === 'ALL' || cli.status === statusFilter;
        const matchesType = accountTypeFilter === 'ALL' || cli.accountType === accountTypeFilter;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === 'name') {
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
        } else if (sortField === 'company') {
          valA = a.company.toLowerCase();
          valB = b.company.toLowerCase();
        } else if (sortField === 'joinedDate') {
          valA = a.joinedDate || '';
          valB = b.joinedDate || '';
        } else if (sortField === 'lastActivity') {
          valA = a.lastActivity || '';
          valB = b.lastActivity || '';
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [clientsList, searchTerm, statusFilter, accountTypeFilter, sortField, sortOrder]);

  // Paginated Results
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  // Row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedClients.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // Single Client Updates
  const updateSingleClient = (id: string, fields: Partial<ClientItem>) => {
    setClientsList((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...fields };
          if (onUpdateClient) onUpdateClient(updated);
          if (activeWorkspaceClient?.id === id) {
            setActiveWorkspaceClient(updated);
          }
          return updated;
        }
        return c;
      })
    );
  };

  // Bulk Actions
  const handleBulkAction = (action: 'active' | 'suspend') => {
    if (selectedIds.length === 0) return;

    setClientsList((prev) =>
      prev.map((c) => {
        if (!selectedIds.includes(c.id)) return c;
        let patch: Partial<ClientItem> = {};
        if (action === 'active') patch = { status: 'Active' };
        if (action === 'suspend') patch = { status: 'Suspended' };

        const updated = { ...c, ...patch };
        if (onUpdateClient) onUpdateClient(updated);
        return updated;
      })
    );

    setSelectedIds([]);
  };

  // Export CSV
  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Verification Status', 'Total Requests', 'Total Spent DZD', 'Status', 'Joined Date'];
    const rows = filteredClients.map((c) => [
      c.id,
      `"${c.name}"`,
      `"${c.company}"`,
      c.email,
      c.phone || '',
      c.verificationStatus || 'Not Submitted',
      c.totalRequests,
      c.totalSpentDzd,
      c.status,
      c.joinedDate
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Clients_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Internal Note handler
  const handleAddNote = (clientId: string) => {
    if (!newNoteText.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      text: newNoteText,
      author: 'Admin'
    };
    setClientNotes((prev) => ({
      ...prev,
      [clientId]: [newEntry, ...(prev[clientId] || [])]
    }));
    setNewNoteText('');
  };

  // KPI Calculations
  const totalCount = clientsList.length;
  const submittedCount = clientsList.filter((c) => c.verificationStatus === 'Submitted' || c.status === 'Active').length;
  const activeCount = clientsList.filter((c) => c.status === 'Active').length;
  const pendingCount = clientsList.filter((c) => c.status === 'Pending').length;
  const totalLtv = clientsList.reduce((acc, curr) => acc + curr.totalSpentDzd, 0);

  // Client requests calculation for workspace drawer
  const getRequestsForClient = (clientName: string, company: string) => {
    return requests.filter(
      (r) =>
        r.clientName.toLowerCase() === clientName.toLowerCase() ||
        r.clientCompany.toLowerCase() === company.toLowerCase()
    );
  };

  return (
    <div className="space-y-4">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
            Total Clients
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{totalCount}</span>
            <span className="text-[10px] text-slate-400 font-medium">Registered</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
            Verification Submitted
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{submittedCount}</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded font-semibold">
              Submitted
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Active Accounts
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded font-semibold">
              Verified
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            Pending Onboarding
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{pendingCount}</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded font-semibold">
              Review
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            Total Client Spending
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalLtv.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">DZD</span>
          </div>
        </div>
      </div>

      {/* CRM Filter & Control Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Client Relationship Management</span>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full">
                {filteredClients.length} accounts
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage client companies, account status tiers, lifetime order value, and customer support.
            </p>
          </div>

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
                      profile: 'Client Profile',
                      company: 'Company Name',
                      contact: 'Contact Email & Phone',
                      verification: 'Verification Status',
                      requests: 'Translation Jobs',
                      spending: 'Total Spent (DZD)',
                      status: 'Account Status',
                      joinedDate: 'Joined Date',
                      lastActivity: 'Last Activity',
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

        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative lg:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by client name, company, email, phone, ID..."
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
              <option value="totalSpentDzd-desc">Sort: Highest Spending</option>
              <option value="totalRequests-desc">Sort: Most Jobs Placed</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="company-asc">Sort: Company (A-Z)</option>
              <option value="joinedDate-desc">Sort: Newest Joined</option>
              <option value="lastActivity-desc">Sort: Recent Activity</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Strip */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-150">
            <span className="font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>{selectedIds.length} client account(s) selected</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction('active')}
                className="px-2.5 py-1 font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Set Active
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

      {/* Main Compact Data Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200/80 dark:border-slate-800">
                {visibleColumns.profile && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('name')}>
                    <div className="flex items-center gap-1">
                      <span>Client Name</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.company && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('company')}>
                    <div className="flex items-center gap-1">
                      <span>Company</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.contact && <th className="p-3">Contact Info</th>}

                {visibleColumns.verification && <th className="p-3">Verification</th>}

                {visibleColumns.requests && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('totalRequests')}>
                    <div className="flex items-center gap-1">
                      <span>Jobs Placed</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.spending && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('totalSpentDzd')}>
                    <div className="flex items-center gap-1">
                      <span>Total Spent (DZD)</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.status && <th className="p-3">Status</th>}

                {visibleColumns.joinedDate && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('joinedDate')}>
                    <div className="flex items-center gap-1">
                      <span>Joined</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.lastActivity && (
                  <th className="p-3 cursor-pointer select-none" onClick={() => handleSort('lastActivity')}>
                    <div className="flex items-center gap-1">
                      <span>Last Activity</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                )}

                {visibleColumns.actions && <th className="p-3 text-right">Action</th>}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 dark:text-slate-400">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">No clients match your filter criteria.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('ALL');
                        setAccountTypeFilter('ALL');
                      }}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 underline font-medium"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedClients.map((c) => {
                  const isSelected = selectedIds.includes(c.id);
                  const isMenuOpen = openActionMenuId === c.id;

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Profile Name & Avatar */}
                      {visibleColumns.profile && (
                        <td className="p-3 whitespace-nowrap min-w-[200px]">
                          <div
                            className="flex items-center gap-3 cursor-pointer group"
                            onClick={() => {
                              setActiveWorkspaceClient(c);
                              if (onSelectClient) onSelectClient(c);
                            }}
                          >
                            <img
                              src={
                                c.avatar ||
                                `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80`
                              }
                              alt={c.name}
                              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-blue-400 transition-all shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1 whitespace-nowrap">
                                <span>{c.name}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Company Name */}
                      {visibleColumns.company && (
                        <td className="p-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                            <span className="truncate max-w-[180px] block">{c.company}</span>
                          </div>
                        </td>
                      )}

                      {/* Contact Info */}
                      {visibleColumns.contact && (
                        <td className="p-3">
                          <div className="space-y-0.5">
                            <a
                              href={`mailto:${c.email}`}
                              className="text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 text-[11px]"
                            >
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[150px]">{c.email}</span>
                            </a>
                            <a
                              href={`tel:${c.phone || '+213 550 00 00 00'}`}
                              className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[10px]"
                            >
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{c.phone || '+213 550 00 00 00'}</span>
                            </a>
                          </div>
                        </td>
                      )}

                      {/* Verification Status */}
                      {visibleColumns.verification && (
                        <td className="p-3 whitespace-nowrap">
                          {c.verificationStatus === 'Submitted' || c.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-900">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              Submitted
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-700 border border-amber-200/70 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-900">
                              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              Not Submitted
                            </span>
                          )}
                        </td>
                      )}

                      {/* Requests count */}
                      {visibleColumns.requests && (
                        <td className="p-3 font-bold text-slate-900 dark:text-white text-xs">
                          {c.totalRequests} jobs
                        </td>
                      )}

                      {/* Total Spent */}
                      {visibleColumns.spending && (
                        <td className="p-3">
                          <span className="font-bold text-slate-900 dark:text-white text-xs block whitespace-nowrap">
                            {c.totalSpentDzd.toLocaleString()} DZD
                          </span>
                        </td>
                      )}

                      {/* Account Status */}
                      {visibleColumns.status && (
                        <td className="p-3 whitespace-nowrap">
                          {c.status === 'Active' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/70 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-900">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          ) : c.status === 'Pending' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200/70 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-900">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200/70 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-900">
                              <AlertTriangle className="w-3 h-3" />
                              Suspended
                            </span>
                          )}
                        </td>
                      )}

                      {/* Joined Date */}
                      {visibleColumns.joinedDate && (
                        <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap min-w-[90px]">{c.joinedDate}</td>
                      )}

                      {/* Last Activity */}
                      {visibleColumns.lastActivity && (
                        <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap min-w-[90px]">
                          {c.lastActivity || 'Today at 12:00'}
                        </td>
                      )}

                      {/* Actions */}
                      {visibleColumns.actions && (
                        <td className="p-3 text-right relative">
                          <div className="flex items-center justify-end gap-1">
                            <div className="relative">
                              <button
                                onClick={() => setOpenActionMenuId(isMenuOpen ? null : c.id)}
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
                                      setActiveWorkspaceClient(c);
                                      if (onSelectClient) onSelectClient(c);
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2"
                                  >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>View Profile / Workspace</span>
                                  </button>

                                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                  <button
                                    onClick={() => {
                                      updateSingleClient(c.id, { status: 'Active' });
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    <span>Set Active</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setActiveWorkspaceClient(c);
                                      setActiveTab('requests');
                                      setOpenActionMenuId(null);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-2"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                                    <span>View Translation Orders</span>
                                  </button>

                                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                                  <button
                                    onClick={() => {
                                      updateSingleClient(c.id, { status: 'Suspended' });
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

        {/* Pagination Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <span>Showing {filteredClients.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClients.length)} of {filteredClients.length} clients</span>
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

      {/* DETAILED CUSTOMER WORKSPACE DRAWER */}
      {activeWorkspaceClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <img
                  src={
                    activeWorkspaceClient.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={activeWorkspaceClient.name}
                  className="w-14 h-14 rounded-full object-cover ring-4 ring-blue-500/20"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {activeWorkspaceClient.name}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">({activeWorkspaceClient.id})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeWorkspaceClient.company}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {activeWorkspaceClient.accountType || 'SME'}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        activeWorkspaceClient.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : activeWorkspaceClient.status === 'Pending'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {activeWorkspaceClient.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveWorkspaceClient(null)}
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
                Account Overview
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'requests'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Order History ({getRequestsForClient(activeWorkspaceClient.name, activeWorkspaceClient.company).length})
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'payments'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Invoicing & Payments
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`py-3 border-b-2 transition-colors ${
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent hover:text-slate-800'
                }`}
              >
                Internal Admin Notes
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Total Orders</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
                        {activeWorkspaceClient.totalRequests} jobs
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Total Spent</span>
                      <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-1 block">
                        {activeWorkspaceClient.totalSpentDzd.toLocaleString()} DZD
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block font-semibold">Member Since</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white mt-1 block">
                        {activeWorkspaceClient.joinedDate}
                      </span>
                    </div>
                  </div>

                  {/* Contact Details Card */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span>Company Profile & Contact Information</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Email Address</span>
                        <a href={`mailto:${activeWorkspaceClient.email}`} className="font-semibold text-blue-600 dark:text-blue-400">
                          {activeWorkspaceClient.email}
                        </a>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Phone Contact</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {activeWorkspaceClient.phone || '+213 550 00 00 00'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Account Tier</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {activeWorkspaceClient.accountType || 'SME Business'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px]">Last Platform Activity</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {activeWorkspaceClient.lastActivity || 'Today'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Actions Bar */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">Administrative Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateSingleClient(activeWorkspaceClient.id, { status: 'Active' })}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Set Active</span>
                      </button>

                      <button
                        onClick={() => updateSingleClient(activeWorkspaceClient.id, { status: 'Suspended' })}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Suspend Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REQUEST HISTORY */}
              {activeTab === 'requests' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                    Translation Requests Placed by {activeWorkspaceClient.name}
                  </h4>

                  {getRequestsForClient(activeWorkspaceClient.name, activeWorkspaceClient.company).length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500">
                      <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold">No recent requests registered for this client name.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {getRequestsForClient(activeWorkspaceClient.name, activeWorkspaceClient.company).map((req) => (
                        <div
                          key={req.id}
                          className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between hover:border-blue-400 transition-colors cursor-pointer"
                          onClick={() => {
                            if (onSelectRequest) onSelectRequest(req);
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white">{req.id}</span>
                              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                {req.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {req.sourceLang} → {req.targetLang} • {req.docType} ({req.wordCount} words)
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {req.amountDzd.toLocaleString()} DZD
                            </span>
                            <span className="text-[10px] text-slate-400">Deadline: {req.deadline}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PAYMENTS */}
              {activeTab === 'payments' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Lifetime Value</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {activeWorkspaceClient.totalSpentDzd.toLocaleString()} DZD
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Preferred Payment Method</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        Algérie Poste (CCP) / BaridiMob
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-xs pt-2">Billing History & Receipts</h4>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Receipt #</th>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Amount</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr>
                          <td className="p-2.5 font-bold font-mono">INV-2026-881</td>
                          <td className="p-2.5 text-slate-500">20 Jul 2026</td>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">8,500 DZD</td>
                          <td className="p-2.5 text-emerald-600 font-semibold">Paid</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold font-mono">INV-2026-620</td>
                          <td className="p-2.5 text-slate-500">12 Jun 2026</td>
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">10,000 DZD</td>
                          <td className="p-2.5 text-emerald-600 font-semibold">Paid</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: INTERNAL NOTES */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs">Admin Internal Notes Log</h4>

                  {/* Add note input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal note about this client..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNote(activeWorkspaceClient.id);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                    <button
                      onClick={() => handleAddNote(activeWorkspaceClient.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-xl font-semibold text-xs hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {!(clientNotes[activeWorkspaceClient.id] && clientNotes[activeWorkspaceClient.id].length > 0) ? (
                      <p className="text-slate-400 italic text-center py-4">No internal notes logged yet.</p>
                    ) : (
                      clientNotes[activeWorkspaceClient.id].map((note) => (
                        <div key={note.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{note.author}</span>
                            <span>{note.date}</span>
                          </div>
                          <p className="text-slate-800 dark:text-slate-200 text-xs">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
