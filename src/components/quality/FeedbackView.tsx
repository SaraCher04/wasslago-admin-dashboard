import React, { useState } from 'react';
import { MessageSquare, Sparkles, Bell, CheckCircle2, Star, ThumbsUp, Heart, Send, BarChart3, ShieldCheck } from 'lucide-react';

export const FeedbackView: React.FC = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BANNER */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Quality & Feedback Portal
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-blue-600" /> Module 3.0 Preview
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            End-to-end post-job client satisfaction surveys, Net Promoter Score (NPS), and translator feedback loops
          </p>
        </div>
      </div>

      {/* MAIN COMING SOON ILLUSTRATION CARD */}
      <div className="bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950/80 rounded-3xl border border-blue-100 dark:border-slate-800 p-8 md:p-12 text-center relative overflow-hidden shadow-sm">
        {/* Background decorative ambient glow circles */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          {/* Beautiful Vector Illustration Composite */}
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-300/60 dark:border-blue-700/50 animate-[spin_20s_linear_infinite]" />

            {/* Central Glow Box */}
            <div className="w-32 h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-transform">
              <MessageSquare className="w-16 h-16 text-white" />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-2 left-0 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center gap-1.5 animate-bounce">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">4.9 CSAT</span>
            </div>

            <div className="absolute bottom-2 right-0 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">NPS +78</span>
            </div>

            <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            </div>
          </div>

          {/* Title & Badge */}
          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-full uppercase tracking-widest shadow-xs">
              Coming Soon
            </span>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Automated Feedback & Sentiment Intelligence
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
              We are finalizing our direct feedback loop module for WasslaGo. Soon you will track client satisfaction scores in real-time, collect structured review forms, and monitor translator platform sentiment.
            </p>
          </div>

          {/* Interactive Subscription Form */}
          <div className="pt-4 max-w-md mx-auto">
            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter admin email for beta launch alert..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                >
                  <Bell className="w-3.5 h-3.5" /> Notify Me
                </button>
              </form>
            ) : (
              <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-2xl text-xs font-bold inline-flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You are registered for the Feedback Hub early access release!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FEATURE ROADMAP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Post-Delivery CSAT Surveys</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Automated email & WhatsApp satisfaction surveys sent 2 hours after document delivery to capture client ratings on accuracy, formatting, and speed.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ThumbsUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Net Promoter Score (NPS)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Quarterly corporate client NPS benchmarks tracking retention, likelihood to recommend WasslaGo, and corporate contract satisfaction.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Translator Worklife Pulse</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
            Anonymous monthly translator sentiment surveys regarding payout speed, deadline fairness, and platform tools usability.
          </p>
        </div>
      </div>
    </div>
  );
};
