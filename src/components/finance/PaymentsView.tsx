import React, { useState, useMemo } from 'react';
import { PaymentRecord, FinancialStatus, TranslationRequest, ClientItem } from '../../types';
import { initialPayments } from '../../data/mockFinanceData';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Search, 
  Download, 
  MoreVertical, 
  Eye, 
  FileText, 
  SlidersHorizontal, 
  AlertTriangle, 
  Building2, 
  User, 
  ArrowUpRight,
  Receipt,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

interface PaymentsViewProps {
  requests?: TranslationRequest[];
  clients?: ClientItem[];
  onSelectRequest?: (req: TranslationRequest) => void;
  onSelectClient?: (c: ClientItem) => void;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  requests = [],
  clients = [],
  onSelectRequest,
  onSelectClient,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');

  // Column customization
  const [showColsModal, setShowColsModal] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    paymentId: true,
    client: true,
    requestId: true,
    translator: true,
    amountBreakdown: true,
    method: true,
    status: true,
    paymentDate: true,
    invoiceId: true,
    createdDate: true,
    actions: true,
  });

  // Active Menu ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Selected payment for detail viewing
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
      const matchMethod = selectedMethod === 'ALL' || p.paymentMethod.includes(selectedMethod);

      return matchSearch && matchStatus && matchMethod;
    });
  }, [payments, searchTerm, selectedStatus, selectedMethod]);

  // Payment Issue Alert Items
  const issuePayments = useMemo(() => {
    return payments.filter((p) => p.hasIssue || p.status === 'Failed' || p.status === 'Pending');
  }, [payments]);

  // Status Badge Helper
  const getStatusBadge = (status: FinancialStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Verify
          </span>
        );
      case 'Failed':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-rose-600" /> Failed
          </span>
        );
      case 'Refunded':
        return (
          <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 rounded-full inline-flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-purple-600" /> Refunded
          </span>
        );
      default:
        return null;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Payment ID', 'Client Name', 'Company', 'Request ID', 'Translator', 'Total DZD', 'Commission DZD', 'Status', 'Method', 'Invoice ID', 'Date'];
    const rows = filteredPayments.map(p => [
      p.id,
      `"${p.clientName}"`,
      `"${p.clientCompany}"`,
      p.requestId,
      `"${p.translatorAssigned}"`,
      p.totalAmountDzd,
      p.platformCommissionDzd,
      p.status,
      `"${p.paymentMethod}"`,
      p.invoiceId,
      `"${p.createdDate}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Client_Payments_${new Date().toISOString().slice(0, 10)}.csv`);
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
              Client Payments & Invoicing
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
              Client Cash-In
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor client billing success, gateway transactions, invoices, and bank transfer receipts
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

      {/* 1. PAYMENT KPI SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Payments</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            96 <span className="text-xs text-slate-400 font-normal">(128,400 DZD)</span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="w-2.5 h-2.5" /> +12.4% vs prev
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Completed</span>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            88 <span className="text-xs text-slate-400 font-normal">(118,200 DZD)</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-600 block mt-1">
            91.6% completion rate
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Pending Verify</span>
          <div className="text-lg font-bold text-amber-600 mt-1">
            5 <span className="text-xs text-slate-400 font-normal">(7,100 DZD)</span>
          </div>
          <span className="text-[10px] font-medium text-amber-600 block mt-1">
            Bank wire proof attached
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Failed Payments</span>
          <div className="text-lg font-bold text-rose-600 mt-1">
            2 <span className="text-xs text-slate-400 font-normal">(1,900 DZD)</span>
          </div>
          <span className="text-[10px] font-medium text-rose-500 block mt-1">
            Gateway 3DS timeout
          </span>
        </div>

        {/* KPI 5 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Refunded</span>
          <div className="text-lg font-bold text-purple-600 mt-1">
            1 <span className="text-xs text-slate-400 font-normal">(1,200 DZD)</span>
          </div>
          <span className="text-[10px] font-medium text-purple-500 block mt-1">
            Client cancellation
          </span>
        </div>

        {/* KPI 6 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">Total Collected</span>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-1">
            118,200 <span className="text-xs font-normal">DZD</span>
          </div>
          <span className="text-[10px] font-medium text-blue-600 block mt-1">
            Cleared & Settled
          </span>
        </div>
      </div>

      {/* 4. PAYMENT ISSUES SECTION (ATTENTION BANNER) */}
      {issuePayments.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Payment Attention Area ({issuePayments.length} Items Require Review)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {issuePayments.map((p) => (
              <div key={p.id} className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/40 text-xs flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">{p.id}</span>
                    <span className="text-[10px] font-bold text-blue-600 font-mono">{p.requestId}</span>
                  </div>
                  <div className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                    {p.clientName} ({p.clientCompany}) — <span className="font-bold">{p.totalAmountDzd} DZD</span>
                  </div>
                  <p className="text-amber-800 dark:text-amber-300 text-[11px] mt-1">
                    {p.issueDescription || `Payment status is currently ${p.status}`}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPayment(p)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded-lg shrink-0 transition-colors"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2 & 3. PAYMENTS MANAGEMENT TABLE & TOOLBAR */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Payment ID, Client, Request ID, Invoice..."
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
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Refunded">Refunded</option>
              </select>

              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Methods</option>
                <option value="BaridiMob">BaridiMob</option>
                <option value="CIB">CIB Card</option>
                <option value="Bank">Bank Transfer</option>
                <option value="CCP">CCP Transfer</option>
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

        {/* Payments Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                {visibleCols.paymentId && <th className="p-3">Payment ID</th>}
                {visibleCols.client && <th className="p-3">Client</th>}
                {visibleCols.requestId && <th className="p-3">Request ID</th>}
                {visibleCols.translator && <th className="p-3">Translator</th>}
                {visibleCols.amountBreakdown && <th className="p-3 text-right">Amount (Gross / Commission / Translator)</th>}
                {visibleCols.method && <th className="p-3">Method</th>}
                {visibleCols.status && <th className="p-3">Status</th>}
                {visibleCols.paymentDate && <th className="p-3">Payment Date</th>}
                {visibleCols.invoiceId && <th className="p-3">Invoice ID</th>}
                {visibleCols.createdDate && <th className="p-3">Created</th>}
                {visibleCols.actions && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {visibleCols.paymentId && (
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {p.id}
                    </td>
                  )}
                  {visibleCols.client && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {p.clientAvatar ? (
                          <img src={p.clientAvatar} alt={p.clientName} className="w-6 h-6 rounded-full object-cover" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px]">
                            {p.clientName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{p.clientName}</div>
                          <div className="text-[10px] text-slate-400">{p.clientCompany}</div>
                        </div>
                      </div>
                    </td>
                  )}
                  {visibleCols.requestId && (
                    <td className="p-3 whitespace-nowrap font-mono text-blue-600 dark:text-blue-400 font-bold">
                      {p.requestId}
                    </td>
                  )}
                  {visibleCols.translator && (
                    <td className="p-3 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {p.translatorAssigned}
                    </td>
                  )}
                  {visibleCols.amountBreakdown && (
                    <td className="p-3 text-right whitespace-nowrap">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {p.totalAmountDzd.toLocaleString()} <span className="text-[10px] text-slate-400">DZD</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Comm: <span className="text-emerald-600 font-semibold">+{p.platformCommissionDzd} DZD</span> | Net: {p.translatorAmountDzd} DZD
                      </div>
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
                  {visibleCols.paymentDate && (
                    <td className="p-3 whitespace-nowrap text-[11px] text-slate-500">
                      {p.paymentDate}
                    </td>
                  )}
                  {visibleCols.invoiceId && (
                    <td className="p-3 whitespace-nowrap font-mono text-slate-600 dark:text-slate-400 text-[11px]">
                      {p.invoiceId}
                    </td>
                  )}
                  {visibleCols.createdDate && (
                    <td className="p-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {p.createdDate}
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

                      {/* Action Menu */}
                      {activeMenuId === p.id && (
                        <div className="absolute right-3 top-10 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 p-1 text-left text-xs font-medium space-y-0.5">
                          <button
                            onClick={() => {
                              setSelectedPayment(p);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Payment</span>
                          </button>
                          <button
                            onClick={() => {
                              alert(`Invoice ${p.invoiceId} downloaded`);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Download Invoice</span>
                          </button>
                          {p.status === 'Completed' && (
                            <button
                              onClick={() => {
                                if (confirm(`Issue refund for Payment ${p.id}?`)) {
                                  setPayments(prev => prev.map(item => item.id === p.id ? { ...item, status: 'Refunded' } : item));
                                }
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-rose-600"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Refund Payment</span>
                            </button>
                          )}
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
          <span>Showing {filteredPayments.length} client payments</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">WasslaGo Payment Engine</span>
        </div>
      </div>

      {/* PAYMENT DETAIL MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-600 block">{selectedPayment.id} ({selectedPayment.invoiceId})</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Client Payment Audit</h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedPayment.clientName}</div>
                <div className="text-slate-500">{selectedPayment.clientCompany}</div>
                <div className="text-blue-600 font-mono font-semibold pt-1">Request: {selectedPayment.requestId}</div>
              </div>

              <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                  <span>Total Paid by Client:</span>
                  <span>{selectedPayment.totalAmountDzd.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400 font-medium">
                  <span>WasslaGo Platform Fee (15%):</span>
                  <span>+{selectedPayment.platformCommissionDzd.toLocaleString()} DZD</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300 font-medium">
                  <span>Assigned Translator Earnings:</span>
                  <span>{selectedPayment.translatorAmountDzd.toLocaleString()} DZD</span>
                </div>
              </div>

              {selectedPayment.issueDescription && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-amber-900 dark:text-amber-200">
                  <span className="font-bold block mb-0.5">Admin Review Required:</span>
                  {selectedPayment.issueDescription}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-2">
              {selectedPayment.status === 'Pending' && (
                <button
                  onClick={() => {
                    setPayments(prev => prev.map(p => p.id === selectedPayment.id ? { ...p, status: 'Completed', hasIssue: false } : p));
                    setSelectedPayment(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Verify & Approve
                </button>
              )}
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs ml-auto"
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
