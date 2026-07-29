import React, { useState } from 'react';
import { 
  User, 
  Sliders, 
  Palette, 
  Shield, 
  Upload, 
  Check, 
  Save, 
  X, 
  HelpCircle, 
  DollarSign, 
  Truck, 
  Zap, 
  Clock, 
  Receipt, 
  Sun, 
  Moon, 
  Monitor, 
  Globe, 
  Lock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { LanguageCode } from '../../types';

interface SettingsViewProps {
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  lang?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
}

type SettingsSection = 'profile' | 'platform' | 'preferences' | 'security';

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode = false,
  onToggleDarkMode,
  lang = 'en',
  onLanguageChange,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // ================= 1. PROFILE STATE =================
  const initialProfile = {
    firstName: 'Sami',
    lastName: 'Cheraitia',
    email: 'ms_cheraitia@esi.dz',
    phone: '+213 550 12 34 56',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  };
  const [profile, setProfile] = useState(initialProfile);

  // ================= 2. PLATFORM STATE =================
  const initialPlatform = {
    freelanceCommission: 40,
    certifiedCommission: 20,
    fixedServiceFee: 300,
    paypartFeePercent: 1,
    paypartFixedFee: 60,
    deliveryFee: 500,
    // Urgency Pricing
    urgencyPrices: {
      standard: 800,
      express: 1000,
      urgent: 1200,
    },
    // Deadline Constraints
    deadlineConstraints: {
      standard: { min: 7, max: 20 },
      express: { min: 3, max: 10 },
      urgent: { min: 1, max: 5 },
    },
    // Payout Configuration
    minPayoutThreshold: 500,
    invoicePrefix: 'FAC',
    payoutSchedule: '1st of month' as '1st of month' | '15th of month',
  };
  const [platform, setPlatform] = useState(initialPlatform);

  // ================= 3. PREFERENCES STATE =================
  const [themePreference, setThemePreference] = useState<'Light' | 'Dark' | 'System'>(
    darkMode ? 'Dark' : 'Light'
  );
  const [languagePreference, setLanguagePreference] = useState<LanguageCode>(lang);

  // Handlers
  const handleTriggerSave = (message: string) => {
    setSaveSuccessMessage(message);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  const handleProfileCancel = () => {
    setProfile(initialProfile);
  };

  const handlePlatformCancel = () => {
    setPlatform(initialPlatform);
  };

  // Dynamic calculations for Commission Preview
  const basePrice = 10000;
  
  // Freelance Calculation
  const freelanceCommissionAmt = (basePrice * platform.freelanceCommission) / 100;
  const freelanceServiceFee = (platform.fixedServiceFee * platform.freelanceCommission) / 100;
  const freelanceTranslatorReceives = basePrice - freelanceCommissionAmt - freelanceServiceFee;
  const fixedServiceFeeAmt = platform.fixedServiceFee;
  const paypartFeeAmt = Math.round(
    ((basePrice + fixedServiceFeeAmt) * platform.paypartFeePercent) / 100 + platform.paypartFixedFee
  );
  const freelanceFinalClientPayment = basePrice + fixedServiceFeeAmt + paypartFeeAmt;

  // Certified Calculation
  const certifiedCommissionAmt = (basePrice * platform.certifiedCommission) / 100;
  const certifiedServiceFee = (platform.fixedServiceFee * platform.certifiedCommission) / 100;
  const certifiedTranslatorReceives = basePrice - certifiedCommissionAmt - certifiedServiceFee;
  const certifiedFinalClientPayment = basePrice + fixedServiceFeeAmt + paypartFeeAmt;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* PAGE HEADER */}
      <div className="bg-white dark:bg-slate-900 px-5 py-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            System Settings & Platform Preferences
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage personal credentials, platform commission models, pricing thresholds, and display preferences
          </p>
        </div>

        {saveSuccessMessage && (
          <div className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{saveSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* SETTINGS NAVIGATION TABS */}
      <div className="flex w-full border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex-1 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap border-b-2 -mb-px ${
            activeSection === 'profile'
              ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile</span>
        </button>

        <button
          onClick={() => setActiveSection('platform')}
          className={`flex-1 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap border-b-2 -mb-px ${
            activeSection === 'platform'
              ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Platform Settings</span>
        </button>

        <button
          onClick={() => setActiveSection('preferences')}
          className={`flex-1 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap border-b-2 -mb-px ${
            activeSection === 'preferences'
              ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Preferences</span>
        </button>

        <button
          onClick={() => setActiveSection('security')}
          className={`flex-1 px-3.5 py-2 text-xs font-bold rounded-t-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap border-b-2 -mb-px ${
            activeSection === 'security'
              ? 'border-blue-600 text-blue-600 bg-white dark:bg-slate-900 dark:text-blue-400 shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security</span>
          <span className="px-1.5 py-0.2 text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded font-bold">
            Soon
          </span>
        </button>
      </div>

      {/* SECTION CONTENT CANVAS */}
      <div className="space-y-4">
        {/* =========================================================
            1. PROFILE SETTINGS
           ========================================================= */}
        {activeSection === 'profile' && (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Profile Information
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your personal account photo, name, and contact details
              </p>
            </div>

            {/* Profile Picture Management */}
            <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-700/60 flex items-center gap-4">
              <img
                src={profile.photoUrl}
                alt="User Profile"
                className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-600/30 shadow-2xs"
              />

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3 h-3" />
                    <span>Upload Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const newUrl = URL.createObjectURL(file);
                          setProfile({ ...profile, photoUrl: newUrl });
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setProfile({
                        ...profile,
                        photoUrl:
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
                      })
                    }
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Supported formats: <strong>JPG, PNG, WEBP</strong> (Max: 5MB)
                </p>
              </div>
            </div>

            {/* Personal Information Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={profile.phone}
                  placeholder="+213 550 00 00 00"
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={handleProfileCancel}
                className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel Changes
              </button>
              <button
                type="button"
                onClick={() => handleTriggerSave('Profile settings updated successfully!')}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            2. PLATFORM SETTINGS
           ========================================================= */}
        {activeSection === 'platform' && (
          <div className="space-y-4">
            {/* Section 2.1: Commission & Fee Configuration */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Commission & Fee Configuration
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure how the platform calculates commissions and additional processing fees
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                {/* Freelance Commission */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white block">
                      Freelance Commission
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Deducted from freelance earnings.
                  </p>
                  <input
                    type="number"
                    value={platform.freelanceCommission}
                    onChange={(e) =>
                      setPlatform({ ...platform, freelanceCommission: Number(e.target.value) })
                    }
                    className="w-full mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Certified Commission */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white block">
                      Certified Commission
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Deducted from certified earnings.
                  </p>
                  <input
                    type="number"
                    value={platform.certifiedCommission}
                    onChange={(e) =>
                      setPlatform({ ...platform, certifiedCommission: Number(e.target.value) })
                    }
                    className="w-full mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Fixed Service Fee */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white block">
                      Fixed Service Fee
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">DZD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Added to client translation price.
                  </p>
                  <input
                    type="number"
                    value={platform.fixedServiceFee}
                    onChange={(e) =>
                      setPlatform({ ...platform, fixedServiceFee: Number(e.target.value) })
                    }
                    className="w-full mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* PayPart Fee (%) */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white block">
                      PayPart Fee (%)
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">%</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Percentage processing fee.
                  </p>
                  <input
                    type="number"
                    step="0.1"
                    value={platform.paypartFeePercent}
                    onChange={(e) =>
                      setPlatform({ ...platform, paypartFeePercent: Number(e.target.value) })
                    }
                    className="w-full mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* PayPart Fixed Fee */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white block">
                      PayPart Fixed Fee
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">DZD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Fixed payment processing fee.
                  </p>
                  <input
                    type="number"
                    value={platform.paypartFixedFee}
                    onChange={(e) =>
                      setPlatform({ ...platform, paypartFixedFee: Number(e.target.value) })
                    }
                    className="w-full mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {/* Delivery Fee */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-900 dark:text-white block flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-blue-600" /> Delivery Fee
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">DZD</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Courier delivery for certified jobs.
                  </p>
                  <input
                    type="number"
                    value={platform.deliveryFee}
                    onChange={(e) => setPlatform({ ...platform, deliveryFee: Number(e.target.value) })}
                    className="w-full mt-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Section 2.2: Commission Preview - LIGHT & SIMPLE STYLE (SELECTED ELEMENT) */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Commission Preview Calculation
                  </h2>
                  <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 rounded text-[10px] font-bold">
                    Live Formula
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Demonstrating how fee logic processes a baseline job of 10,000 DZD
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Freelance Translation Example */}
                <div className="bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Freelance Translation</span>
                    <span className="text-[10px] bg-slate-200/70 dark:bg-slate-700/80 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono font-medium">
                      10,000 DZD Base
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300 pt-0.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>Base translation price:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{basePrice.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>Commission ({platform.freelanceCommission}%):</span>
                      <span>-{freelanceCommissionAmt.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>Translator service fee:</span>
                      <span>-{freelanceServiceFee.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Translator receives:</span>
                      <span>{freelanceTranslatorReceives.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                      <span>Fixed service fee:</span>
                      <span>+{fixedServiceFeeAmt.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400">
                      <span>PayPart fee:</span>
                      <span>+{paypartFeeAmt.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-600 font-bold text-xs text-slate-900 dark:text-white">
                      <span>Final client payment:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{freelanceFinalClientPayment.toLocaleString()} DZD</span>
                    </div>
                  </div>
                </div>

                {/* Certified Translation Example */}
                <div className="bg-slate-50/80 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/70 space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700/80 pb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">Certified Translation</span>
                    <span className="text-[10px] bg-slate-200/70 dark:bg-slate-700/80 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-mono font-medium">
                      10,000 DZD Base
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300 pt-0.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span>Base translation price:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{basePrice.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>Commission ({platform.certifiedCommission}%):</span>
                      <span>-{certifiedCommissionAmt.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-rose-600 dark:text-rose-400">
                      <span>Translator service fee:</span>
                      <span>-{certifiedServiceFee.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">
                      <span>Translator receives:</span>
                      <span>{certifiedTranslatorReceives.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400 pt-1.5 border-t border-slate-200 dark:border-slate-700">
                      <span>Fixed service fee:</span>
                      <span>+{fixedServiceFeeAmt.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between text-blue-600 dark:text-blue-400">
                      <span>PayPart fee:</span>
                      <span>+{paypartFeeAmt.toLocaleString()} DZD</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-600 font-bold text-xs text-slate-900 dark:text-white">
                      <span>Final client payment:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{certifiedFinalClientPayment.toLocaleString()} DZD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2.3: Urgency Pricing & Deadline Constraints */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Urgency Pricing */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Urgency Minimum Pricing
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Define minimum prices depending on delivery urgency
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Standard */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Standard</span>
                      <span className="text-[10px] text-slate-500">Regular delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={platform.urgencyPrices.standard}
                        onChange={(e) =>
                          setPlatform({
                            ...platform,
                            urgencyPrices: { ...platform.urgencyPrices, standard: Number(e.target.value) },
                          })
                        }
                        className="w-24 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white text-right"
                      />
                      <span className="font-bold text-slate-500 text-[11px]">DZD</span>
                    </div>
                  </div>

                  {/* Express */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 block">Express</span>
                      <span className="text-[10px] text-slate-500">Faster delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={platform.urgencyPrices.express}
                        onChange={(e) =>
                          setPlatform({
                            ...platform,
                            urgencyPrices: { ...platform.urgencyPrices, express: Number(e.target.value) },
                          })
                        }
                        className="w-24 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white text-right"
                      />
                      <span className="font-bold text-slate-500 text-[11px]">DZD</span>
                    </div>
                  </div>

                  {/* Urgent */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-amber-600 dark:text-amber-400 block">Urgent</span>
                      <span className="text-[10px] text-slate-500">Immediate delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        value={platform.urgencyPrices.urgent}
                        onChange={(e) =>
                          setPlatform({
                            ...platform,
                            urgencyPrices: { ...platform.urgencyPrices, urgent: Number(e.target.value) },
                          })
                        }
                        className="w-24 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white text-right"
                      />
                      <span className="font-bold text-slate-500 text-[11px]">DZD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline Constraints */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" /> Deadline Range Limits
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Define allowed deadline ranges (in days) per urgency level
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Standard Days */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">Standard Range</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">Min:</span>
                        <input
                          type="number"
                          value={platform.deadlineConstraints.standard.min}
                          onChange={(e) =>
                            setPlatform({
                              ...platform,
                              deadlineConstraints: {
                                ...platform.deadlineConstraints,
                                standard: { ...platform.deadlineConstraints.standard, min: Number(e.target.value) },
                              },
                            })
                          }
                          className="w-14 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">Max:</span>
                        <input
                          type="number"
                          value={platform.deadlineConstraints.standard.max}
                          onChange={(e) =>
                            setPlatform({
                              ...platform,
                              deadlineConstraints: {
                                ...platform.deadlineConstraints,
                                standard: { ...platform.deadlineConstraints.standard, max: Number(e.target.value) },
                              },
                            })
                          }
                          className="w-14 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Express Days */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Express Range</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">Min:</span>
                        <input
                          type="number"
                          value={platform.deadlineConstraints.express.min}
                          onChange={(e) =>
                            setPlatform({
                              ...platform,
                              deadlineConstraints: {
                                ...platform.deadlineConstraints,
                                express: { ...platform.deadlineConstraints.express, min: Number(e.target.value) },
                              },
                            })
                          }
                          className="w-14 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">Max:</span>
                        <input
                          type="number"
                          value={platform.deadlineConstraints.express.max}
                          onChange={(e) =>
                            setPlatform({
                              ...platform,
                              deadlineConstraints: {
                                ...platform.deadlineConstraints,
                                express: { ...platform.deadlineConstraints.express, max: Number(e.target.value) },
                              },
                            })
                          }
                          className="w-14 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Urgent Days */}
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200/70 dark:border-slate-700 flex items-center justify-between">
                    <span className="font-bold text-amber-600 dark:text-amber-400">Urgent Range</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">Min:</span>
                        <input
                          type="number"
                          value={platform.deadlineConstraints.urgent.min}
                          onChange={(e) =>
                            setPlatform({
                              ...platform,
                              deadlineConstraints: {
                                ...platform.deadlineConstraints,
                                urgent: { ...platform.deadlineConstraints.urgent, min: Number(e.target.value) },
                              },
                            })
                          }
                          className="w-14 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-center"
                        />
                      </div>
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="text-slate-400">Max:</span>
                        <input
                          type="number"
                          value={platform.deadlineConstraints.urgent.max}
                          onChange={(e) =>
                            setPlatform({
                              ...platform,
                              deadlineConstraints: {
                                ...platform.deadlineConstraints,
                                urgent: { ...platform.deadlineConstraints.urgent, max: Number(e.target.value) },
                              },
                            })
                          }
                          className="w-14 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2.4: Payout Configuration */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" /> Payout & Invoicing Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure translator payout rules and invoice settings
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Minimum Payout Threshold */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white block">
                    Minimum Threshold (DZD)
                  </label>
                  <input
                    type="number"
                    value={platform.minPayoutThreshold}
                    onChange={(e) =>
                      setPlatform({ ...platform, minPayoutThreshold: Number(e.target.value) })
                    }
                    className="w-full mt-1 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400 block">Min payout balance</span>
                </div>

                {/* Invoice Prefix */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white block">
                    Invoice Prefix
                  </label>
                  <input
                    type="text"
                    value={platform.invoicePrefix}
                    onChange={(e) => setPlatform({ ...platform, invoicePrefix: e.target.value })}
                    className="w-full mt-1 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white uppercase"
                  />
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Ex: {platform.invoicePrefix}-2026-0001
                  </span>
                </div>

                {/* Payout Schedule */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700/80 space-y-1">
                  <label className="font-bold text-slate-900 dark:text-white block">
                    Payout Cadence
                  </label>
                  <select
                    value={platform.payoutSchedule}
                    onChange={(e) =>
                      setPlatform({
                        ...platform,
                        payoutSchedule: e.target.value as '1st of month' | '15th of month',
                      })
                    }
                    className="w-full mt-1 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md font-bold text-slate-900 dark:text-white"
                  >
                    <option value="1st of month">1st of month</option>
                    <option value="15th of month">15th of month</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block">Automated transfer date</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={handlePlatformCancel}
                  className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => handleTriggerSave('Platform parameters & marketplace fees saved!')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save Configuration
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            3. PREFERENCES SETTINGS
           ========================================================= */}
        {activeSection === 'preferences' && (
          <div className="space-y-4">
            {/* Section: Theme Preferences */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600" /> Theme & Appearance
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your preferred dashboard color appearance and dark mode style
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Light */}
                <button
                  type="button"
                  onClick={() => {
                    setThemePreference('Light');
                    if (darkMode && onToggleDarkMode) onToggleDarkMode();
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    themePreference === 'Light'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      <Sun className="w-4 h-4" />
                    </div>
                    {themePreference === 'Light' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">Light</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                      Clean light mode canvas.
                    </p>
                  </div>
                </button>

                {/* Dark */}
                <button
                  type="button"
                  onClick={() => {
                    setThemePreference('Dark');
                    if (!darkMode && onToggleDarkMode) onToggleDarkMode();
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    themePreference === 'Dark'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center font-bold">
                      <Moon className="w-4 h-4" />
                    </div>
                    {themePreference === 'Dark' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">Dark</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                      Eye-safe slate dark mode.
                    </p>
                  </div>
                </button>

                {/* System */}
                <button
                  type="button"
                  onClick={() => {
                    setThemePreference('System');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 ${
                    themePreference === 'System'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center font-bold">
                      <Monitor className="w-4 h-4" />
                    </div>
                    {themePreference === 'System' && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">System</span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
                      Follow OS preference.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Section: Language Preferences */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-3.5">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" /> Interface Language
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select your primary administration interface language
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* English */}
                <button
                  type="button"
                  onClick={() => {
                    setLanguagePreference('en');
                    if (onLanguageChange) onLanguageChange('en');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    languagePreference === 'en'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🇬🇧</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">English</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Default interface language.</span>
                    </div>
                  </div>
                  {languagePreference === 'en' && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>

                {/* Français */}
                <button
                  type="button"
                  onClick={() => {
                    setLanguagePreference('fr');
                    if (onLanguageChange) onLanguageChange('fr');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    languagePreference === 'fr'
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🇫🇷</span>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">Français</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Langue d'interface française.</span>
                    </div>
                  </div>
                  {languagePreference === 'fr' && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              </div>

              {/* Action Save Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => handleTriggerSave('User preferences saved!')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" /> Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            4. SECURITY SETTINGS (PLACEHOLDER)
           ========================================================= */}
        {activeSection === 'security' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-6 md:p-8 text-center max-w-xl mx-auto shadow-2xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] rounded-full inline-block">
                Future Roadmap Feature
              </span>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Security Settings Coming Soon
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Advanced security controls to keep system access and platform operations secure.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs text-left space-y-2">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" /> Planned Security Controls:
              </span>
              <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside text-[11px]">
                <li>Two-Factor Authentication (2FA)</li>
                <li>Role-Based Access Control (RBAC)</li>
                <li>Session Management & Audit Logs</li>
                <li>IP Address Whitelisting</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
