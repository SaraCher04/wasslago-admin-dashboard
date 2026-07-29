import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  ArrowRight, 
  Eye, 
  UserPlus, 
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { TranslationRequest, RequestStatus, NavigationTab } from '../types';

interface RecentRequestsTableProps {
  requests: TranslationRequest[];
  onSelectRequest: (request: TranslationRequest) => void;
  onNavigateToRequests: () => void;
  filterStatus?: string;
}

export const RecentRequestsTable: React.FC<RecentRequestsTableProps> = ({
  requests,
  onSelectRequest,
  onNavigateToRequests,
  filterStatus: initialFilterStatus = 'All',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterStatus);

  const statuses: (RequestStatus | 'All')[] = [
    'All',
    'Pending',
    'Assigned',
    'In Progress',
    'Review',
    'Completed',
    'Cancelled',
  ];

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

  const filteredRequests = requests.filter((req) => {
    const matchesStatus =
      statusFilter === 'All' || req.status === statusFilter;
    const matchesSearch =
      req.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.docType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.assignedTranslator &&
        req.assignedTranslator.toLowerCase().includes(searchTerm.toLowerCase())) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 rounded-lg">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'Assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 rounded-lg">
            <UserPlus className="w-3 h-3" />
            Assigned
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 rounded-lg">
            <Clock className="w-3 h-3 animate-spin" />
            In Progress
          </span>
        );
      case 'Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 rounded-lg">
            <AlertCircle className="w-3 h-3" />
            Review
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-lg">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 rounded-lg">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="recent-requests-section" className="mb-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Header Bar */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white tracking-tight">
                Recent Requests
              </h2>
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-md">
                {filteredRequests.length} orders
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor active document translation workflow and status changes
            </p>
          </div>

          <button
            onClick={onNavigateToRequests}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 self-start md:self-auto hover:underline"
          >
            <span>View All Requests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-4 md:px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search client, doc type, translator..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs font-medium">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800 uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Language Pair</th>
                <th className="py-3 px-4">Document Type</th>
                <th className="py-3 px-4">Assigned Translator</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No translation requests found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Client */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {req.clientName}
                    </td>

                    {/* Language Pair */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-xs font-semibold tracking-wide text-slate-700 dark:text-slate-300">
                        {getLangCode(req.sourceLang)} → {getLangCode(req.targetLang)}
                      </span>
                    </td>

                    {/* Document Type */}
                    <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {req.docType}
                    </td>

                    {/* Assigned Translator */}
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-200">
                      {req.assignedTranslator ? (
                        <span>{req.assignedTranslator}</span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 italic text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md">
                          Unassigned
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap min-w-[100px]">
                      {req.date}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onSelectRequest(req)}
                        className="px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1 font-semibold text-xs border border-slate-200 dark:border-slate-700"
                        title="Inspect & Manage Request"
                      >
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
