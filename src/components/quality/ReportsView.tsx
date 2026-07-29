import React, { useState, useMemo } from 'react';
import { QualityReportRecord, ReportSeverity, ReportStatus, ReportCategory } from '../../types';
import { initialReportsData } from '../../data/mockQualityData';
import { 
  Flag, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Download, 
  MoreVertical, 
  Eye, 
  SlidersHorizontal, 
  ShieldAlert, 
  FileText, 
  User, 
  Check, 
  X, 
  HelpCircle,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';

interface ReportsViewProps {
  onSelectTranslator?: (translatorName: string) => void;
  onSelectRequest?: (requestId: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  onSelectTranslator,
  onSelectRequest,
}) => {
  const [reports, setReports] = useState<QualityReportRecord[]>(initialReportsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Selected Report Detail Modal
  const [selectedReport, setSelectedReport] = useState<QualityReportRecord | null>(null);

  // Column visibility
  const [showColsModal, setShowColsModal] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    reportId: true,
    translator: true,
    reportedBy: true,
    requestId: true,
    category: true,
    severity: true,
    status: true,
    reportDate: true,
    actions: true,
  });

  // Action Menu Dropdown ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchSeverity = selectedSeverity === 'ALL' || item.severity === selectedSeverity;
      const matchCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      return matchSearch && matchStatus && matchSeverity && matchCategory;
    });
  }, [reports, searchTerm, selectedStatus, selectedSeverity, selectedCategory]);

  // Pending reports requiring review
  const pendingReports = useMemo(() => {
    return reports.filter((r) => r.status === 'Pending Review' || r.status === 'Investigating');
  }, [reports]);

  // Status Badge Helper
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Pending Review':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-full inline-flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Review
          </span>
        );
      case 'Investigating':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 rounded-full inline-flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-blue-600" /> Investigating
          </span>
        );
      case 'Resolved':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full inline-flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
          </span>
        );
      case 'Dismissed':
        return (
          <span className="px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-full inline-flex items-center gap-1">
            <XCircle className="w-3 h-3 text-slate-400" /> Dismissed
          </span>
        );
      default:
        return null;
    }
  };

  // Severity Badge Helper
  const getSeverityBadge = (severity: ReportSeverity) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-md uppercase">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-md uppercase">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-md uppercase">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md uppercase">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ReportStatus, note?: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: newStatus,
              adminActionTaken: note || r.adminActionTaken,
              resolvedDate: newStatus === 'Resolved' || newStatus === 'Dismissed' ? 'Just now' : r.resolvedDate,
            }
          : r
      )
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Report ID', 'Translator', 'Translator Email', 'Client Name', 'Company', 'Request ID', 'Category', 'Severity', 'Status', 'Report Date', 'Summary'];
    const rows = filteredReports.map((r) => [
      r.id,
      `"${r.translatorName}"`,
      `"${r.translatorEmail}"`,
      `"${r.clientName}"`,
      `"${r.clientCompany}"`,
      r.requestId,
      `"${r.category}"`,
      r.severity,
      r.status,
      `"${r.reportDate}"`,
      `"${r.summary}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Translator_Reports_${new Date().toISOString().slice(0, 10)}.csv`);
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
              Translator Quality Reports & Incident Audits
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-full flex items-center gap-1">
              <Flag className="w-3 h-3 text-rose-600" /> Incident Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Review client complaints, formatting issues, late delivery reports, and resolution logs
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Reports CSV</span>
        </button>
      </div>

      {/* ACTIVE INCIDENT BANNER */}
      {pendingReports.length > 0 && (
        <div className="bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Action Required: {pendingReports.length} Active Incident Reports Awaiting Admin Resolution
              </h2>
            </div>
            <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
              High Priority QA
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingReports.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 shadow-xs flex flex-col justify-between space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-rose-600">{p.id}</span>
                    <span className="font-mono font-bold text-blue-600">{p.requestId}</span>
                    {getSeverityBadge(p.severity)}
                  </div>
                  <span className="text-[10px] text-slate-400">{p.reportDate}</span>
                </div>

                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{p.summary}</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Translator: <span className="font-semibold text-slate-700 dark:text-slate-300">{p.translatorName}</span> | Client: <span className="font-semibold text-slate-700 dark:text-slate-300">{p.clientName} ({p.clientCompany})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold rounded">
                    Category: {p.category}
                  </span>

                  <button
                    onClick={() => setSelectedReport(p)}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Audit Incident
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Reports Filed</span>
          <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">{reports.length}</div>
          <span className="text-[10px] font-medium text-slate-400 block mt-1">Lifetime platform logs</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Pending Review</span>
          <div className="text-lg font-bold text-amber-600 mt-1">
            {reports.filter((r) => r.status === 'Pending Review' || r.status === 'Investigating').length}
          </div>
          <span className="text-[10px] font-medium text-amber-600 block mt-1">Active investigations</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Resolved Cases</span>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            {reports.filter((r) => r.status === 'Resolved').length}
          </div>
          <span className="text-[10px] font-medium text-emerald-600 block mt-1">Successfully remediated</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Dismissed Claims</span>
          <div className="text-lg font-bold text-slate-600 dark:text-slate-400 mt-1">
            {reports.filter((r) => r.status === 'Dismissed').length}
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-1">Non-compliant client claims</span>
        </div>
      </div>

      {/* REPORTS TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Report ID, Translator, Client, Request ID..."
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
                <option value="Pending Review">Pending Review</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
                <option value="Dismissed">Dismissed</option>
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Accuracy & Errors">Accuracy & Errors</option>
                <option value="Deadline Delay">Deadline Delay</option>
                <option value="Formatting Issue">Formatting Issue</option>
                <option value="Unprofessional Behavior">Unprofessional Behavior</option>
                <option value="Certification Missing">Certification Missing</option>
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

          {/* Columns selector */}
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

        {/* Reports Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                {visibleCols.reportId && <th className="p-3">Report ID</th>}
                {visibleCols.translator && <th className="p-3">Translator Reported</th>}
                {visibleCols.reportedBy && <th className="p-3">Reported By Client</th>}
                {visibleCols.requestId && <th className="p-3">Request ID</th>}
                {visibleCols.category && <th className="p-3">Issue Category</th>}
                {visibleCols.severity && <th className="p-3">Severity</th>}
                {visibleCols.status && <th className="p-3">Status</th>}
                {visibleCols.reportDate && <th className="p-3">Report Date</th>}
                {visibleCols.actions && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filteredReports.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Report ID */}
                  {visibleCols.reportId && (
                    <td className="p-3 font-bold text-rose-600 dark:text-rose-400 whitespace-nowrap font-mono">
                      {item.id}
                    </td>
                  )}

                  {/* Translator */}
                  {visibleCols.translator && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.translatorAvatar}
                          alt={item.translatorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                            <span>{item.translatorName}</span>
                            {onSelectTranslator && (
                              <button
                                onClick={() => onSelectTranslator(item.translatorName)}
                                className="text-[10px] text-blue-600 hover:underline"
                              >
                                View
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{item.translatorEmail}</div>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Reported By Client */}
                  {visibleCols.reportedBy && (
                    <td className="p-3 whitespace-nowrap">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{item.clientName}</div>
                        <div className="text-[10px] text-slate-400">{item.clientCompany}</div>
                      </div>
                    </td>
                  )}

                  {/* Request ID */}
                  {visibleCols.requestId && (
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                        {item.requestId}
                      </span>
                    </td>
                  )}

                  {/* Category */}
                  {visibleCols.category && (
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md font-medium text-[11px]">
                        {item.category}
                      </span>
                    </td>
                  )}

                  {/* Severity */}
                  {visibleCols.severity && (
                    <td className="p-3 whitespace-nowrap">
                      {getSeverityBadge(item.severity)}
                    </td>
                  )}

                  {/* Status */}
                  {visibleCols.status && (
                    <td className="p-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                  )}

                  {/* Report Date */}
                  {visibleCols.reportDate && (
                    <td className="p-3 whitespace-nowrap text-slate-500 text-[11px]">
                      {item.reportDate}
                    </td>
                  )}

                  {/* Actions */}
                  {visibleCols.actions && (
                    <td className="p-3 text-right relative whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedReport(item)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-3 top-10 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 p-1 text-left text-xs font-medium space-y-0.5">
                          <button
                            onClick={() => {
                              setSelectedReport(item);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>View Full Case Details</span>
                          </button>

                          {item.status !== 'Resolved' && (
                            <button
                              onClick={() => {
                                handleUpdateStatus(item.id, 'Resolved', 'Marked resolved by Admin audit.');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-emerald-600 font-semibold"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark as Resolved</span>
                            </button>
                          )}

                          {item.status !== 'Dismissed' && (
                            <button
                              onClick={() => {
                                handleUpdateStatus(item.id, 'Dismissed', 'Dismissed as non-compliant client claim.');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-300"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Dismiss Case</span>
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
          <span>Showing {filteredReports.length} incident reports</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">WasslaGo Quality Control Engine</span>
        </div>
      </div>

      {/* REPORT DETAIL MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 max-w-xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-rose-600">{selectedReport.id}</span>
                  <span className="text-xs font-mono text-blue-600 font-semibold">({selectedReport.requestId})</span>
                  {getSeverityBadge(selectedReport.severity)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  Translator Incident Audit & Dispute Review
                </h3>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Translator & Client Section */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Reported Translator</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedReport.translatorName}</div>
                  <div className="text-[11px] text-slate-500">{selectedReport.translatorEmail}</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase block">Filing Client</span>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedReport.clientName}</div>
                  <div className="text-[11px] text-slate-500">{selectedReport.clientCompany}</div>
                </div>
              </div>

              {/* Summary & Description */}
              <div className="p-3 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 rounded-xl space-y-1">
                <span className="font-bold text-rose-900 dark:text-rose-200 block">Incident Summary:</span>
                <p className="text-slate-800 dark:text-slate-200">{selectedReport.summary}</p>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] pt-1">{selectedReport.description}</p>
              </div>

              {/* Translator Response */}
              {selectedReport.translatorResponse && (
                <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 rounded-xl space-y-1">
                  <span className="font-bold text-blue-900 dark:text-blue-200 block">Translator Explanation / Defense:</span>
                  <p className="text-slate-700 dark:text-slate-300 text-[11px]">{selectedReport.translatorResponse}</p>
                </div>
              )}

              {/* Admin Action Taken */}
              {selectedReport.adminActionTaken && (
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Admin Remediation Log:</span>
                  <p className="text-emerald-800 dark:text-emerald-300 text-[11px]">{selectedReport.adminActionTaken}</p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedReport.status !== 'Resolved' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedReport.id, 'Resolved', 'Resolved via Admin Review.');
                      setSelectedReport(null);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Resolve Incident
                  </button>
                )}

                {selectedReport.status !== 'Dismissed' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedReport.id, 'Dismissed', 'Dismissed by Admin.');
                      setSelectedReport(null);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs"
                  >
                    Dismiss Claim
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs ml-auto"
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
