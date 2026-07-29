export type NavigationTab = 
  | 'dashboard'
  | 'requests'
  | 'translators'
  | 'clients'
  | 'finance'
  | 'finance-transactions'
  | 'finance-payments'
  | 'finance-payouts'
  | 'quality'
  | 'quality-ratings'
  | 'quality-reports'
  | 'quality-feedback'
  | 'settings';

export type AlertType = 'urgent' | 'warning' | 'info';

export interface AlertItem {
  id: string;
  title: string;
  count: number;
  type: AlertType;
  description: string;
  targetView: NavigationTab;
  filterKey?: string;
}

export type RequestStatus = 
  | 'Pending'
  | 'Assigned'
  | 'In Progress'
  | 'Review'
  | 'Completed'
  | 'Cancelled';

export type UrgencyLevel = 'Normal' | 'Rush' | 'Urgent';

export interface TranslationRequest {
  id: string;
  title?: string;
  clientName: string;
  clientCompany: string;
  sourceLang: string;
  targetLang: string;
  docType: string;
  assignedTranslator: string | null;
  status: RequestStatus;
  urgency?: UrgencyLevel;
  date: string;
  deadline: string;
  wordCount: number;
  amountDzd: number;
  urgent?: boolean;
  internalNotes?: string[];
  documentName?: string;
}

export type VerificationStatus = 'Verified' | 'Pending' | 'Certified Sworn' | 'Suspended';
export type MarketplaceVisibility = 'Public' | 'Hidden' | 'Invite-Only';
export type TranslatorType = 'Sworn Legal' | 'Technical Specialist' | 'General Freelancer' | 'Agency Partner';

export interface TranslatorItem {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  completedJobs: number;
  rating: number;
  completionRate: number; // percentage, e.g., 98
  status: 'Available' | 'Busy' | 'Offline';
  verificationStatus?: VerificationStatus;
  marketplaceVisibility?: MarketplaceVisibility;
  translatorType?: TranslatorType;
  languages: string[];
  totalEarnedDzd: number;
  onTimeRate: number;
  joinedDate?: string;
}

export type ClientAccountType = 'Enterprise Corporate' | 'SME' | 'Individual' | 'Government / NGO';
export type ClientAccountStatus = 'Active' | 'Pending' | 'Suspended';

export interface ClientItem {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  avatar?: string;
  accountType?: ClientAccountType;
  verificationStatus?: 'Submitted' | 'Not Submitted';
  totalRequests: number;
  totalSpentDzd: number;
  joinedDate: string;
  lastActivity?: string;
  status: ClientAccountStatus;
}

export interface ActivityDataPoint {
  date: string;
  created: number;
  completed: number;
  cancelled: number;
  rawDate: string;
}

// ================= FINANCE TYPES =================

export type TransactionType = 'Client Payment' | 'Translator Payout' | 'Refund' | 'Commission' | 'Adjustment';
export type FinancialStatus = 'Completed' | 'Pending' | 'Failed' | 'Refunded';

export interface TransactionRecord {
  id: string; // e.g., 'TXN-8821'
  type: TransactionType;
  clientName: string;
  clientCompany?: string;
  translatorName?: string;
  requestId: string; // e.g., 'TR-1092'
  grossAmountDzd: number;
  platformFeeDzd: number;
  translatorAmountDzd: number;
  status: FinancialStatus;
  paymentMethod: string; // 'BaridiMob', 'CIB / EDAHABIA', 'CCP Transfer', 'Bank Wire', 'PayPal'
  createdDate: string;
  receiptUrl?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string; // e.g., 'PAY-4019'
  clientName: string;
  clientCompany: string;
  clientAvatar?: string;
  requestId: string;
  translatorAssigned: string;
  totalAmountDzd: number;
  platformCommissionDzd: number;
  translatorAmountDzd: number;
  paymentMethod: string; // 'BaridiMob', 'CIB Card', 'Bank Wire', 'EDAHABIA', 'PayPal'
  status: FinancialStatus;
  paymentDate: string;
  invoiceId: string; // e.g., 'INV-2026-042'
  createdDate: string;
  hasIssue?: boolean;
  issueDescription?: string;
}

export type PayoutStatus = 'Pending' | 'Approved' | 'Processing' | 'Paid' | 'Rejected';

export interface PayoutJobItem {
  requestId: string;
  docTitle: string;
  clientName: string;
  grossAmountDzd: number;
  completionDate: string;
}

export interface PayoutRecord {
  id: string; // e.g., 'PO-3081'
  invoiceNumber: string; // e.g., 'PO-INV-992'
  translatorId: string;
  translatorName: string;
  translatorEmail: string;
  translatorAvatar: string;
  paymentMethod: string; // 'BaridiMob (RIP)', 'CCP Account', 'Bank Wire (RIB)'
  paymentAccountDetails: string; // e.g., 'RIP: 00799999000123456789'
  completedJobsCount: number;
  grossAmountDzd: number;
  commissionDzd: number;
  taxesFeesDzd: number;
  netAmountDzd: number;
  status: PayoutStatus;
  requestedDate: string;
  paidDate?: string;
  relatedJobs: PayoutJobItem[];
  timeline: {
    jobCompleted: string;
    earningsCalculated: string;
    payoutRequested: string;
    approved?: string;
    paid?: string;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'urgent' | 'warning' | 'info' | 'success';
}

export type LanguageCode = 'en' | 'fr' | 'ar';

// ================= QUALITY TYPES =================

export type RatingVisibility = 'Public' | 'Hidden' | 'Featured';

export interface TranslatorRatingRecord {
  id: string; // matches translator id e.g. 'trn-1'
  translatorName: string;
  translatorEmail: string;
  translatorAvatar: string;
  translatorType: TranslatorType;
  verificationStatus: VerificationStatus;
  languages: string[];
  overallRating: number;
  totalReviews: number;
  subRatings: {
    accuracy: number;
    speed: number;
    communication: number;
    formatting: number;
  };
  completedJobs: number;
  onTimeRate: number;
  visibility: RatingVisibility;
  lastUpdated: string;
  adminNote?: string;
}

export type ReportSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type ReportStatus = 'Pending Review' | 'Investigating' | 'Resolved' | 'Dismissed';
export type ReportCategory = 'Accuracy & Errors' | 'Deadline Delay' | 'Formatting Issue' | 'Unprofessional Behavior' | 'Certification Missing';

export interface QualityReportRecord {
  id: string; // e.g., 'REP-101'
  translatorId: string;
  translatorName: string;
  translatorAvatar: string;
  translatorEmail: string;
  clientName: string;
  clientCompany: string;
  requestId: string; // e.g. 'TR-1088'
  category: ReportCategory;
  severity: ReportSeverity;
  status: ReportStatus;
  reportDate: string;
  summary: string;
  description: string;
  clientEvidenceUrl?: string;
  translatorResponse?: string;
  adminActionTaken?: string;
  resolvedDate?: string;
}
