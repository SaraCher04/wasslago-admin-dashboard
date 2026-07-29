import React from 'react';
import { PayoutRecord, TranslatorItem } from '../../types';
import { 
  UserCheck, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileText, 
  Download, 
  ArrowRight,
  Building2,
  Calendar,
  DollarSign
} from 'lucide-react';

interface PayoutDetailModalProps {
  payout: PayoutRecord | null;
  onClose: () => void;
  onApprovePayout?: (id: string) => void;
  onMarkAsPaid?: (id: string) => void;
  onRejectPayout?: (id: string) => void;
  onSelectTranslator?: (translatorName: string) => void;
}

export const PayoutDetailModal: React.FC<PayoutDetailModalProps> = ({
  payout,
  onClose,
  onApprovePayout,
  onMarkAsPaid,
  onRejectPayout,
  onSelectTranslator,
}) => {
  if (!payout) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-2xl w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">{payout.id}</span>
              <span className="text-xs text-slate-400">({payout.invoiceNumber})</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Translator Payout Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* 1. Translator Info Section */}
        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={payout.translatorAvatar}
              alt={payout.translatorName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20 shrink-0"
            />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <span>{payout.translatorName}</span>
                {onSelectTranslator && (
                  <button
                    onClick={() => onSelectTranslator(payout.translatorName)}
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Profile
                  </button>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{payout.translatorEmail}</p>
            </div>
          </div>

          <div className="text-right border-l border-slate-200 dark:border-slate-700 pl-4">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Payment Destination</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 text-xs block">{payout.paymentMethod}</span>
            <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 block mt-0.5">{payout.paymentAccountDetails}</span>
          </div>
        </div>

        {/* 2. Earnings Breakdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Completed Jobs</span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{payout.completedJobsCount} tasks</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Gross Earnings</span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">{payout.grossAmountDzd.toLocaleString()} DZD</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-semibold text-slate-400 uppercase block">Platform Fee (15%)</span>
            <span className="text-base font-bold text-rose-600 mt-0.5 block">-{payout.commissionDzd.toLocaleString()} DZD</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase block">Final Net Payout</span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300 mt-0.5 block">{payout.netAmountDzd.toLocaleString()} DZD</span>
          </div>
        </div>

        {/* 3. Related Translation Jobs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Related Translation Tasks Included in Payout
          </h4>

          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5">Request ID</th>
                  <th className="p-2.5">Document Title</th>
                  <th className="p-2.5">Client</th>
                  <th className="p-2.5 text-right">Task Amount</th>
                  <th className="p-2.5 text-right">Completion Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {payout.relatedJobs.map((job) => (
                  <tr key={job.requestId}>
                    <td className="p-2.5 font-mono text-blue-600 font-bold">{job.requestId}</td>
                    <td className="p-2.5 font-semibold text-slate-900 dark:text-white">{job.docTitle}</td>
                    <td className="p-2.5 text-slate-500">{job.clientName}</td>
                    <td className="p-2.5 text-right font-bold">{job.grossAmountDzd.toLocaleString()} DZD</td>
                    <td className="p-2.5 text-right text-slate-400">{job.completionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Payout Timeline Step Workflow */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Payout Workflow Timeline
          </h4>

          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-semibold">
            {/* Step 1 */}
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
              <span>Jobs Completed</span>
              <div className="text-[9px] text-slate-400 mt-0.5">{payout.timeline.jobCompleted}</div>
            </div>

            {/* Step 2 */}
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
              <span>Earnings Calculated</span>
              <div className="text-[9px] text-slate-400 mt-0.5">{payout.timeline.earningsCalculated}</div>
            </div>

            {/* Step 3 */}
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 mx-auto mb-1 text-emerald-600" />
              <span>Requested</span>
              <div className="text-[9px] text-slate-400 mt-0.5">{payout.timeline.payoutRequested}</div>
            </div>

            {/* Step 4 */}
            <div className={`p-2 rounded-xl border text-[10px] ${
              payout.status === 'Approved' || payout.status === 'Paid' || payout.status === 'Processing'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              <Clock className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Admin Approved</span>
              <div className="text-[9px] text-slate-400 mt-0.5">{payout.timeline.approved || 'Pending Approval'}</div>
            </div>

            {/* Step 5 */}
            <div className={`p-2 rounded-xl border text-[10px] ${
              payout.status === 'Paid'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
            }`}>
              <DollarSign className="w-3.5 h-3.5 mx-auto mb-1" />
              <span>Paid Out</span>
              <div className="text-[9px] text-slate-400 mt-0.5">{payout.paidDate || 'Awaiting Payment'}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => alert(`Downloaded Payout Statement PDF for ${payout.id}`)}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Download Statement
          </button>

          <div className="flex items-center gap-2">
            {payout.status === 'Pending' && onApprovePayout && (
              <button
                onClick={() => {
                  onApprovePayout(payout.id);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve Payout
              </button>
            )}

            {(payout.status === 'Approved' || payout.status === 'Processing' || payout.status === 'Pending') && onMarkAsPaid && (
              <button
                onClick={() => {
                  onMarkAsPaid(payout.id);
                  onClose();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <DollarSign className="w-4 h-4" /> Mark as Paid
              </button>
            )}

            {payout.status === 'Pending' && onRejectPayout && (
              <button
                onClick={() => {
                  if (confirm('Reject this payout request?')) {
                    onRejectPayout(payout.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold rounded-xl"
              >
                Reject Request
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
