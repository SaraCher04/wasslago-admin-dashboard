import React, { useState, useMemo } from 'react';
import { PayoutRecord, PayoutStatus, TranslatorItem } from '../../types';
import { initialPayouts } from '../../data/mockFinanceData';
import { PayoutDetailModal } from './PayoutDetailModal';
import { 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Download, 
  MoreVertical, 
  Eye, 
  SlidersHorizontal, 
  CreditCard, 
  DollarSign, 
  Send,
  Building2,
  FileCheck2,
  UserCheck
} from 'lucide-react';

interface PayoutsViewProps {
  translators?: TranslatorItem[];
  onSelectTranslator?: (t: TranslatorItem) => void;
}

export const PayoutsView: React.FC<PayoutsViewProps> = ({
  translators = [],
  onSelectTranslator,
}) => {
  const [payouts, setPayouts] = useState<PayoutRecord[]>(initialPayouts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  // Modal State
  const [selectedPayout, setSelectedPayout] = useState<PayoutRecord | null>(null);

  // Column visibility
  const [showColsModal, setShowColsModal] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    payoutId: true,
    invoiceNo: true,
    translator: true,
    completedJobs: true,
    grossAmount: true,
    commission: true,
    taxes: true,
    netAmount: true,
    method: true,
    status: true,
    requestedDate: true,
    paidDate: true,
    actions: true,
  });

  // Action Menu Dropdown state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Pending Payout Queue
  const pendingQueue = useMemo(() => {
    return payouts.filter((p) => p.status === 'Pending');
  }, [payouts]);

  // Filtered Payouts
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.translatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.translatorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchMethod = selectedMethod === 'ALL' || p.paymentMethod.includes(selectedMethod);

      return matchSearch && matchStatus && matchMethod;
    });
  }, [payouts, searchTerm, selectedStatus, selectedMethod]);

  // Status Badge Helper
  const getStatusBadge = (status: PayoutStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Approved
          </span>
        );
      case 'Processing':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 rounded-full inline-flex items-center gap-1">
            <Send className="w-3 h-3 text-purple-600" /> Processing
          </span>
        );
      case 'Paid':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Paid Out
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const handleApprovePayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: 'Approved', 
      timeline: { ...p.timeline, approved: 'Just now' } 
    } : p));
  };

  const handleMarkAsPaid = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { 
      ...p, 
      status: 'Paid', 
      paidDate: 'Just now',
      timeline: { ...p.timeline, paid: 'Just now' } 
    } : p));
  };

  const handleRejectPayout = (id: string) => {
    setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: 'Rejected' } : p));
  };

  const handleExportCSV = () => {
    const headers = ['Payout ID', 'Invoice No', 'Translator', 'Email', 'Completed Jobs', 'Gross DZD', 'Commission DZD', 'Net Payout DZD', 'Method', 'Status', 'Requested Date', 'Paid Date'];
    const rows = filteredPayouts.map(p => [
      p.id,
      p.invoiceNumber,
      `"${p.translatorName}"`,
      `"${p.translatorEmail}"`,
      p.completedJobsCount,
      p.grossAmountDzd,
      p.commissionDzd,
      p.netAmountDzd,
      `"${p.paymentMethod}"`,
      p.status,
      `"${p.requestedDate}"`,
      `"${p.paidDate || '—'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Translator_Payouts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Translator Payouts & Earnings Management
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full">
              Translator Outgoing Cash
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage translator earnings, pending withdrawal queues, BaridiMob / CCP approvals, and payout history
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 1. PENDING PAYOUT QUEUE SECTION */}
      {pendingQueue.length > 0 && (
        <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Pending Payout Queue ({pendingQueue.length} Translators Waiting for Withdrawal Approval)
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Total Pending: {pendingQueue.reduce((acc, curr) => acc + curr.netAmountDzd, 0).toLocaleString()} DZD
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingQueue.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/50 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.translatorAvatar}
                      alt={item.translatorName}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-500/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs">{item.translatorName}</h3>
                      <p className="text-[11px] text-slate-400">{item.translatorEmail}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono text-[10px] font-bold rounded-md">
                    {item.id}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Completed Jobs</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.completedJobsCount} tasks</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gross Earned</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.grossAmountDzd.toLocaleString()} DZD</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-600 font-semibold block">Net Payout</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.netAmountDzd.toLocaleString()} DZD</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Method & Account</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.paymentMethod}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSelectedPayout(item)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors"
                    >
                      Review
                    </button>
                    <button
                      onClick={() => handleApprovePayout(item.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. PAYOUT KPI SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Pending Payout Amount</span>
          <div className="text-lg font-bold text-amber-600 mt-1">
            25,160 <span className="text-xs text-slate-400 font-normal">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-amber-600 block mt-1">Awaiting admin action</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Pending Translators</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            2 <span className="text-xs text-slate-400 font-normal">translators</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-1">Queue volume</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Completed Payouts</span>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            31,705 <span className="text-xs text-slate-400 font-normal">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-600 block mt-1">Cleared & Paid Out</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Average Payout Value</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            15,852 <span className="text-xs text-slate-400 font-normal">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-1">Per transaction average</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">Total Translator Earnings</span>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-1">
            113,250 <span className="text-xs font-normal">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-blue-600 block mt-1">Lifetime generated</span>
        </div>
      </div>

      {/* 3 & 4. PAYOUTS TABLE & TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Translator, Email, Payout ID, Invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Processing">Processing</option>
                <option value="Paid">Paid Out</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="BaridiMob">BaridiMob (RIP)</option>
                <option value="CCP">CCP Account</option>
                <option value="Bank Wire">Bank Wire (RIB)</option>
              </select>

              <button
                onClick={() => setShowColsModal(!showColsModal)}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Columns</span>
              </button>
            </div>
          </div>

          {/* Columns Toggle */}
          {showColsModal && (
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

        {/* Payout History Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                {visibleCols.payoutId && <th className="p-3">Payout ID</th>}
                {visibleCols.invoiceNo && <th className="p-3">Invoice No</th>}
                {visibleCols.translator && <th className="p-3">Translator</th>}
                {visibleCols.completedJobs && <th className="p-3 text-center">Jobs</th>}
                {visibleCols.grossAmount && <th className="p-3 text-right">Gross Amount</th>}
                {visibleCols.commission && <th className="p-3 text-right">Commission</th>}
                {visibleCols.netAmount && <th className="p-3 text-right">Net Amount</th>}
                {visibleCols.method && <th className="p-3">Method</th>}
                {visibleCols.status && <th className="p-3">Status</th>}
                {visibleCols.requestedDate && <th className="p-3">Requested</th>}
                {visibleCols.paidDate && <th className="p-3">Paid Date</th>}
                {visibleCols.actions && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {visibleCols.payoutId && (
                    <td className="p-3 font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap font-mono">
                      {p.id}
                    </td>
                  )}
                  {visibleCols.invoiceNo && (
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                      {p.invoiceNumber}
                    </td>
                  )}
                  {visibleCols.translator && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img src={p.translatorAvatar} alt={p.translatorName} className="w-6 h-6 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{p.translatorName}</div>
                          <div className="text-[10px] text-slate-400">{p.translatorEmail}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleCols.completedJobs && (
                    <td className="p-3 text-center whitespace-nowrap font-bold text-slate-700 dark:text-slate-300">
                      {p.completedJobsCount}
                    </td>
                  )}
                  {visibleCols.grossAmount && (
                    <td className="p-3 text-right whitespace-nowrap text-slate-900 dark:text-white font-bold">
                      {p.grossAmountDzd.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span>
                    </td>
                  )}
                  {visibleCols.commission && (
                    <td className="p-3 text-right whitespace-nowrap text-rose-600 font-medium">
                      -{p.commissionDzd.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span>
                    </td>
                  )}
                  {visibleCols.netAmount && (
                    <td className="p-3 text-right whitespace-nowrap font-bold text-emerald-600 dark:text-emerald-400">
                      {p.netAmountDzd.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span>
                    </td>
                  )}
                  {visibleCols.method && (
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[11px] border border-slate-200 dark:border-slate-700 font-medium">
                        {p.paymentMethod}
                      </span>
                    </td>
                  )}
                  {visibleCols.status && (
                    <td className="p-3 whitespace-nowrap">
                      {getStatusBadge(p.status)}
                    </td>
                  )}
                  {visibleCols.requestedDate && (
                    <td className="p-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {p.requestedDate}
                    </td>
                  )}
                  {visibleCols.paidDate && (
                    <td className="p-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {p.paidDate || '—'}
                    </td>
                  )}
                  {visibleCols.actions && (
                    <td className="p-3 text-right relative whitespace-nowrap">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === p.id && (
                        <div className="absolute right-3 top-10 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 p-1 text-left text-xs font-medium space-y-0.5">
                          <button
                            onClick={() => {
                              setSelectedPayout(p);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Payout Details</span>
                          </button>

                          {p.status === 'Pending' && (
                            <button
                              onClick={() => {
                                handleApprovePayout(p.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-blue-600 font-semibold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Payout</span>
                            </button>
                          )}

                          {(p.status === 'Approved' || p.status === 'Processing' || p.status === 'Pending') && (
                            <button
                              onClick={() => {
                                handleMarkAsPaid(p.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-emerald-600 font-semibold"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>Mark as Paid</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              alert(`Invoice ${p.invoiceNumber} statement downloaded`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Invoice</span>
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

        {/* Footer */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredPayouts.length} payout records</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">WasslaGo Translator Payout Engine</span>
        </div>
      </div>

      {/* PAYOUT DETAIL MODAL */}
      <PayoutDetailModal
        payout={selectedPayout}
        onClose={() => setSelectedPayout(null)}
        onApprovePayout={handleApprovePayout}
        onMarkAsPaid={handleMarkAsPaid}
        onRejectPayout={handleRejectPayout}
      />
    </div>
  );
};
