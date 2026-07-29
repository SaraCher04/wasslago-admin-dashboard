import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  UserCheck, 
  Building, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  Send,
  Languages
} from 'lucide-react';
import { TranslationRequest, RequestStatus, TranslatorItem } from '../types';

interface RequestDetailModalProps {
  request: TranslationRequest | null;
  translators: TranslatorItem[];
  onClose: () => void;
  onUpdateRequestStatus: (id: string, newStatus: RequestStatus, assignedTranslator?: string) => void;
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  translators,
  onClose,
  onUpdateRequestStatus,
}) => {
  if (!request) return null;

  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>(request.status);
  const [selectedTranslator, setSelectedTranslator] = useState<string>(
    request.assignedTranslator || ''
  );
  const [adminNote, setAdminNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateRequestStatus(request.id, selectedStatus, selectedTranslator || undefined);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Order {request.id}
                </h3>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-md">
                  {request.docType}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created: {request.date} • Deadline: {request.deadline}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 text-xs">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Client</span>
              <span className="font-bold text-slate-900 dark:text-white">{request.clientCompany}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Language Pair</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {request.sourceLang} → {request.targetLang}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Word Count</span>
              <span className="font-bold text-slate-900 dark:text-white">{request.wordCount} words</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Order Price</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {request.amountDzd} DZD
              </span>
            </div>
          </div>

          {/* Workflow Action Form */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1 text-sm">
              Admin Workflow Controls
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Assign Translator */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Assigned Translator
                </label>
                <select
                  value={selectedTranslator}
                  onChange={(e) => setSelectedTranslator(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned (Open Marketplace Pool)</option>
                  {translators.map((trn) => (
                    <option key={trn.id} value={trn.name}>
                      {trn.name} ({trn.rating}★ - {trn.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Status */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Workflow Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as RequestStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review (Client Review)</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Admin Internal Note */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Admin Audit Note (Optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Log internal note, document verification notes, or translation quality audit..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs h-20 focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            {isSaved ? (
              <>
                <CheckCircle className="w-4 h-4 text-white" />
                <span>Updated!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
