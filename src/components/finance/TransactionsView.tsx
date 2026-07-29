import React, { useState, useMemo } from 'react';
import { 
  TransactionRecord, 
  TransactionType, 
  FinancialStatus, 
  TranslationRequest, 
  ClientItem, 
  TranslatorItem 
} from '../../types';
import { initialTransactions, financeAnalyticsRangeData, transactionDistributionData } from '../../data/mockFinanceData';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  UserCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Eye, 
  FileText, 
  SlidersHorizontal, 
  CreditCard,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
  Building2,
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

interface TransactionsViewProps {
  requests?: TranslationRequest[];
  clients?: ClientItem[];
  translators?: TranslatorItem[];
  onSelectRequest?: (req: TranslationRequest) => void;
  onSelectClient?: (c: ClientItem) => void;
  onSelectTranslator?: (t: TranslatorItem) => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  requests = [],
  clients = [],
  translators = [],
  onSelectRequest,
  onSelectClient,
  onSelectTranslator,
}) => {
  const [transactions, setTransactions] = useState<TransactionRecord[]>(initialTransactions);
  
  // Filters & Controls state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  
  // Column visibility customization
  const [showColumnsModal, setShowColumnsModal] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    id: true,
    type: true,
    client: true,
    translator: true,
    requestId: true,
    amount: true,
    fee: true,
    translatorAmount: true,
    status: true,
    method: true,
    date: true,
    actions: true,
  });

  // Action Menu dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Detail Modal state
  const [selectedTxn, setSelectedTxn] = useState<TransactionRecord | null>(null);

  // Filtered transactions computation
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = 
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.translatorName && t.translatorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        t.requestId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = selectedType === 'ALL' || t.type === selectedType;
      const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
      const matchMethod = selectedMethod === 'ALL' || t.paymentMethod.includes(selectedMethod);

      return matchSearch && matchType && matchStatus && matchMethod;
    });
  }, [transactions, searchTerm, selectedType, selectedStatus, selectedMethod]);

  // Status Badge Helper
  const getStatusBadge = (status: FinancialStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Failed
          </span>
        );
      case 'Refunded':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 rounded-full inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-purple-600" /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Type', 'Client', 'Translator', 'Request ID', 'Gross DZD', 'Platform Fee DZD', 'Status', 'Method', 'Date'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.type,
      `"${t.clientName}"`,
      `"${t.translatorName || 'N/A'}"`,
      t.requestId,
      t.grossAmountDzd,
      t.platformFeeDzd,
      t.status,
      `"${t.paymentMethod}"`,
      `"${t.createdDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* SECTION HEADER */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Financial Monitoring & Transactions
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full">
              DZD Ledger
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete financial activity, revenue margin, translator earnings, and ledger operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* 1. FINANCIAL KPI SECTION (8 Compact Metric Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Metric 1 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Gross Cash-In
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            142,500 <span className="text-[10px] text-slate-400">DZD</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> +14.2%
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block truncate">
            Platform Revenue
          </span>
          <div className="text-base font-bold text-blue-700 dark:text-blue-400 mt-1">
            21,375 <span className="text-[10px] text-blue-400">DZD</span>
          </div>
          <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block mt-0.5">
            15.0% margin
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Translator Earnings
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            121,125 <span className="text-[10px] text-slate-400">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
            85.0% payout share
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Net Revenue
          </span>
          <div className="text-base font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            20,175 <span className="text-[10px] text-slate-400">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
            Post deductions
          </span>
        </div>

        {/* Metric 5 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Total Txns
          </span>
          <div className="text-base font-bold text-slate-900 dark:text-white mt-1">
            148 <span className="text-[10px] text-slate-400">ops</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-0.5">
            Volume logs
          </span>
        </div>

        {/* Metric 6 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Successful
          </span>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            142 <span className="text-[10px] text-slate-400">ops</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">
            95.9% rate
          </span>
        </div>

        {/* Metric 7 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Pending Txns
          </span>
          <div className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
            4 <span className="text-[10px] text-slate-400">ops</span>
          </div>
          <span className="text-[10px] font-medium text-amber-600 block mt-0.5 truncate">
            6,800 DZD pending
          </span>
        </div>

        {/* Metric 8 */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
            Failed / Refunded
          </span>
          <div className="text-base font-bold text-rose-600 dark:text-rose-400 mt-1">
            1,950 <span className="text-[10px] text-slate-400">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-rose-500 block mt-0.5">
            2 operations
          </span>
        </div>
      </div>

      {/* 2. FINANCIAL ANALYTICS SECTION (3 Interactive Charts) */}
      <div className="space-y-4">
        {/* Controls Bar for Time Range */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-blue-600" /> Financial Analytics & Cash Flow
          </h2>

          <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === '7d' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === '30d' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${timeRange === '90d' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
              Last 90 Days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chart 1: Financial Performance Trend */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Financial Performance Trend
                </h3>
                <p className="text-[11px] text-slate-500">
                  Client payments, platform revenue, translator earnings, and net balance
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financeAnalyticsRangeData[timeRange]}>
                  <defs>
                    <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTranslator" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(val: number) => [`${val.toLocaleString()} DZD`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="clientPayments" name="Client Payments" stroke="#2563eb" fillOpacity={1} fill="url(#colorClient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="translatorEarnings" name="Translator Earnings" stroke="#10b981" fillOpacity={1} fill="url(#colorTranslator)" strokeWidth={2} />
                  <Area type="monotone" dataKey="platformRevenue" name="Platform Revenue" stroke="#8b5cf6" fill="#8b5cf6" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Transaction Distribution */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Transaction Distribution
              </h3>
              <p className="text-[11px] text-slate-500 mb-2">
                Revenue & fee allocations breakdown
              </p>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transactionDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {transactionDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`${val.toLocaleString()} DZD`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
              {transactionDistributionData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-slate-600 dark:text-slate-300 truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Cash Flow Analysis */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Cash Flow Analysis (Money In vs Money Out)
              </h3>
              <p className="text-[11px] text-slate-500">
                Incoming client payments vs outgoing payouts & net platform buffer
              </p>
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeAnalyticsRangeData[timeRange]}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val: number) => [`${val.toLocaleString()} DZD`, '']} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="incoming" name="Incoming Payments" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" name="Outgoing Payouts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netBalance" name="Net Platform Buffer" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. TRANSACTIONS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Transaction ID, Client, Translator, Request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Dropdowns & Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Types</option>
                <option value="Client Payment">Client Payment</option>
                <option value="Translator Payout">Translator Payout</option>
                <option value="Refund">Refund</option>
                <option value="Commission">Commission</option>
                <option value="Adjustment">Adjustment</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>

              {/* Method Filter */}
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="BaridiMob">BaridiMob</option>
                <option value="CCP">CCP Transfer</option>
                <option value="CIB">CIB / EDAHABIA</option>
                <option value="Bank">Bank Wire</option>
              </select>

              {/* Columns Customization Button */}
              <button
                onClick={() => setShowColumnsModal(!showColumnsModal)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Columns</span>
              </button>
            </div>
          </div>

          {/* Columns Toggle Popover */}
          {showColumnsModal && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
              {Object.keys(visibleCols).map((colKey) => (
                <label key={colKey} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300 capitalize">
                  <input
                    type="checkbox"
                    checked={(visibleCols as any)[colKey]}
                    onChange={(e) => setVisibleCols({ ...visibleCols, [colKey]: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  {colKey}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Financial Ledger Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                {visibleCols.id && <th className="p-3">Transaction ID</th>}
                {visibleCols.type && <th className="p-3">Type</th>}
                {visibleCols.client && <th className="p-3">Client</th>}
                {visibleCols.translator && <th className="p-3">Translator</th>}
                {visibleCols.requestId && <th className="p-3">Request ID</th>}
                {visibleCols.amount && <th className="p-3 text-right">Gross Amount</th>}
                {visibleCols.fee && <th className="p-3 text-right">Fee</th>}
                {visibleCols.translatorAmount && <th className="p-3 text-right">Translator Net</th>}
                {visibleCols.status && <th className="p-3">Status</th>}
                {visibleCols.method && <th className="p-3">Payment Method</th>}
                {visibleCols.date && <th className="p-3">Created Date</th>}
                {visibleCols.actions && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {visibleCols.id && (
                    <td className="p-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {t.id}
                    </td>
                  )}
                  {visibleCols.type && (
                    <td className="p-3 whitespace-nowrap font-semibold">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] ${
                        t.type === 'Client Payment' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        t.type === 'Translator Payout' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                        t.type === 'Refund' ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                  )}
                  {visibleCols.client && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-900 dark:text-white">{t.clientName}</div>
                      {t.clientCompany && <div className="text-[10px] text-slate-400">{t.clientCompany}</div>}
                    </td>
                  )}
                  {visibleCols.translator && (
                    <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {t.translatorName || '—'}
                    </td>
                  )}
                  {visibleCols.requestId && (
                    <td className="p-3 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400">
                      {t.requestId}
                    </td>
                  )}
                  {visibleCols.amount && (
                    <td className="p-3 text-right font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {t.grossAmountDzd.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span>
                    </td>
                  )}
                  {visibleCols.fee && (
                    <td className="p-3 text-right font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      +{t.platformFeeDzd.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span>
                    </td>
                  )}
                  {visibleCols.translatorAmount && (
                    <td className="p-3 text-right font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {t.translatorAmountDzd ? `${t.translatorAmountDzd.toLocaleString()} DZD` : '—'}
                    </td>
                  )}
                  {visibleCols.status && (
                    <td className="p-3 whitespace-nowrap">
                      {getStatusBadge(t.status)}
                    </td>
                  )}
                  {visibleCols.method && (
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-medium border border-slate-200 dark:border-slate-700">
                        {t.paymentMethod}
                      </span>
                    </td>
                  )}
                  {visibleCols.date && (
                    <td className="p-3 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                      {t.createdDate}
                    </td>
                  )}
                  {visibleCols.actions && (
                    <td className="p-3 text-right relative whitespace-nowrap">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === t.id && (
                        <div className="absolute right-3 top-10 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 p-1 text-left text-xs font-medium space-y-0.5">
                          <button
                            onClick={() => {
                              setSelectedTxn(t);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Transaction Details</span>
                          </button>
                          <button
                            onClick={() => {
                              alert(`Receipt downloaded for ${t.id}`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Download Receipt</span>
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredTransactions.length} of {transactions.length} ledger operations</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">WasslaGo Financial Ledger v2.4</span>
        </div>
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block">{selectedTxn.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Transaction Breakdown</h3>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Operation Type:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedTxn.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedTxn.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Translator:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedTxn.translatorName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Request ID:</span>
                  <span className="font-mono text-slate-900 dark:text-white">{selectedTxn.requestId}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl space-y-1.5 border border-blue-100 dark:border-blue-900/40">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Gross Amount:</span>
                  <span className="font-bold">{selectedTxn.grossAmountDzd.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Platform Commission (15%):</span>
                  <span className="font-bold">+{selectedTxn.platformFeeDzd.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Translator Allocation:</span>
                  <span className="font-bold">{selectedTxn.translatorAmountDzd ? `${selectedTxn.translatorAmountDzd.toLocaleString()} DZD` : '—'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTxn.paymentMethod}</span>
              </div>

              {selectedTxn.notes && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-0.5">Admin Note:</span>
                  {selectedTxn.notes}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedTxn(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
