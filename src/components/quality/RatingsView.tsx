import React, { useState, useMemo } from 'react';
import { TranslatorRatingRecord, RatingVisibility, TranslatorType, VerificationStatus } from '../../types';
import { initialRatingsData } from '../../data/mockQualityData';
import { 
  Star, 
  Eye, 
  EyeOff, 
  SlidersHorizontal, 
  Search, 
  Download, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical, 
  Edit3, 
  ShieldCheck, 
  Sparkles, 
  ArrowUpRight,
  TrendingUp,
  X,
  Save,
  HelpCircle
} from 'lucide-react';

interface RatingsViewProps {
  onSelectTranslator?: (translatorName: string) => void;
}

export const RatingsView: React.FC<RatingsViewProps> = ({ onSelectTranslator }) => {
  const [ratings, setRatings] = useState<TranslatorRatingRecord[]>(initialRatingsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRatingTier, setSelectedRatingTier] = useState<string>('ALL');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Edit Rating Modal state
  const [editingTranslator, setEditingTranslator] = useState<TranslatorRatingRecord | null>(null);
  const [editScore, setEditScore] = useState<number>(5.0);
  const [editAccuracy, setEditAccuracy] = useState<number>(5.0);
  const [editSpeed, setEditSpeed] = useState<number>(5.0);
  const [editCommunication, setEditCommunication] = useState<number>(5.0);
  const [editFormatting, setEditFormatting] = useState<number>(5.0);
  const [editAdminNote, setEditAdminNote] = useState<string>('');

  // Column visibility
  const [showColsModal, setShowColsModal] = useState(false);
  const [visibleCols, setVisibleCols] = useState({
    translator: true,
    type: true,
    overallRating: true,
    subRatings: true,
    jobsCount: true,
    onTimeRate: true,
    visibility: true,
    lastUpdated: true,
    actions: true,
  });

  // Action Menu Dropdown ID
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered Translators
  const filteredRatings = useMemo(() => {
    return ratings.filter((item) => {
      const matchSearch =
        item.translatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.translatorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.languages.some((l) => l.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      let matchTier = true;
      if (selectedRatingTier === '4.8_PLUS') matchTier = item.overallRating >= 4.8;
      else if (selectedRatingTier === '4.5_4.7') matchTier = item.overallRating >= 4.5 && item.overallRating < 4.8;
      else if (selectedRatingTier === 'BELOW_4.5') matchTier = item.overallRating < 4.5;

      const matchVisibility = selectedVisibility === 'ALL' || item.visibility === selectedVisibility;
      const matchType = selectedType === 'ALL' || item.translatorType === selectedType;

      return matchSearch && matchTier && matchVisibility && matchType;
    });
  }, [ratings, searchTerm, selectedRatingTier, selectedVisibility, selectedType]);

  // Average Network Rating
  const avgNetworkRating = useMemo(() => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.overallRating, 0);
    return (sum / ratings.length).toFixed(2);
  }, [ratings]);

  // Handler to toggle visibility
  const handleToggleVisibility = (id: string, newVis: RatingVisibility) => {
    setRatings((prev) =>
      prev.map((r) => (r.id === id ? { ...r, visibility: newVis, lastUpdated: 'Just now' } : r))
    );
  };

  // Handler to open Edit Modal
  const handleOpenEditModal = (translator: TranslatorRatingRecord) => {
    setEditingTranslator(translator);
    setEditScore(translator.overallRating);
    setEditAccuracy(translator.subRatings.accuracy);
    setEditSpeed(translator.subRatings.speed);
    setEditCommunication(translator.subRatings.communication);
    setEditFormatting(translator.subRatings.formatting);
    setEditAdminNote(translator.adminNote || '');
    setActiveMenuId(null);
  };

  // Handler to save updated rating
  const handleSaveRating = () => {
    if (!editingTranslator) return;
    setRatings((prev) =>
      prev.map((r) =>
        r.id === editingTranslator.id
          ? {
              ...r,
              overallRating: parseFloat(editScore.toFixed(1)),
              subRatings: {
                accuracy: parseFloat(editAccuracy.toFixed(1)),
                speed: parseFloat(editSpeed.toFixed(1)),
                communication: parseFloat(editCommunication.toFixed(1)),
                formatting: parseFloat(editFormatting.toFixed(1)),
              },
              adminNote: editAdminNote,
              lastUpdated: 'Just now',
            }
          : r
      )
    );
    setEditingTranslator(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Translator ID', 'Name', 'Email', 'Type', 'Verification', 'Overall Rating', 'Reviews Count', 'Accuracy', 'Speed', 'Communication', 'Formatting', 'Completed Jobs', 'On-Time %', 'Visibility', 'Last Updated'];
    const rows = filteredRatings.map((r) => [
      r.id,
      `"${r.translatorName}"`,
      `"${r.translatorEmail}"`,
      `"${r.translatorType}"`,
      `"${r.verificationStatus}"`,
      r.overallRating,
      r.totalReviews,
      r.subRatings.accuracy,
      r.subRatings.speed,
      r.subRatings.communication,
      r.subRatings.formatting,
      r.completedJobs,
      `${r.onTimeRate}%`,
      r.visibility,
      `"${r.lastUpdated}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `WasslaGo_Translator_Ratings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render Stars Helper
  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= Math.floor(score)
                ? 'text-amber-400 fill-amber-400'
                : star - score < 1
                ? 'text-amber-400 fill-amber-200 dark:fill-amber-900'
                : 'text-slate-300 dark:text-slate-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Translator Ratings & Marketplace Quality
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-600" /> QA Governance
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit translator review scores, modify admin overrides, and manage client-facing marketplace visibility
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ratings CSV</span>
        </button>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Average Platform Score</span>
          <div className="text-lg font-bold text-amber-500 mt-1 flex items-center gap-1">
            <span>{avgNetworkRating}</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
            <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </div>
          <span className="text-[10px] font-medium text-emerald-600 block mt-1">
            Top 5% quality network
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Publicly Visible</span>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            {ratings.filter((r) => r.visibility === 'Public' || r.visibility === 'Featured').length}
            <span className="text-xs text-slate-400 font-normal"> / {ratings.length}</span>
          </div>
          <span className="text-[10px] font-medium text-slate-400 block mt-1">
            Active on client search
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Hidden from Search</span>
          <div className="text-lg font-bold text-rose-600 mt-1">
            {ratings.filter((r) => r.visibility === 'Hidden').length}
            <span className="text-xs text-slate-400 font-normal"> translators</span>
          </div>
          <span className="text-[10px] font-medium text-rose-500 block mt-1">
            Under quality audit
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block">Featured Translators</span>
          <div className="text-lg font-bold text-purple-600 mt-1">
            {ratings.filter((r) => r.visibility === 'Featured').length}
          </div>
          <span className="text-[10px] font-medium text-purple-500 block mt-1">
            Promoted on homepage
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/20 dark:bg-blue-950/10 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 block">Sworn Legal Average</span>
          <div className="text-lg font-bold text-blue-700 dark:text-blue-400 mt-1">
            4.88 <span className="text-xs font-normal">/ 5.0</span>
          </div>
          <span className="text-[10px] font-medium text-blue-600 block mt-1">
            Court certified pool
          </span>
        </div>
      </div>

      {/* TABLE & FILTER TOOLBAR CONTAINER */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search translator by name, email, language, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedRatingTier}
                onChange={(e) => setSelectedRatingTier(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Rating Tiers</option>
                <option value="4.8_PLUS">4.8+ Top Rated</option>
                <option value="4.5_4.7">4.5 - 4.7 Stars</option>
                <option value="BELOW_4.5">Below 4.5 Stars</option>
              </select>

              <select
                value={selectedVisibility}
                onChange={(e) => setSelectedVisibility(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Visibilities</option>
                <option value="Public">Public</option>
                <option value="Featured">Featured</option>
                <option value="Hidden">Hidden</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Specializations</option>
                <option value="Sworn Legal">Sworn Legal</option>
                <option value="Technical Specialist">Technical Specialist</option>
                <option value="General Freelancer">General Freelancer</option>
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

          {/* Columns Selector Panel */}
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

        {/* Ratings Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                {visibleCols.translator && <th className="p-3">Translator</th>}
                {visibleCols.type && <th className="p-3">Type & Verification</th>}
                {visibleCols.overallRating && <th className="p-3">Overall Rating</th>}
                {visibleCols.subRatings && <th className="p-3">Category Breakdown</th>}
                {visibleCols.jobsCount && <th className="p-3 text-center">Jobs</th>}
                {visibleCols.onTimeRate && <th className="p-3 text-center">On-Time %</th>}
                {visibleCols.visibility && <th className="p-3">Visibility</th>}
                {visibleCols.lastUpdated && <th className="p-3">Last Audit</th>}
                {visibleCols.actions && <th className="p-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {filteredRatings.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  {/* Translator */}
                  {visibleCols.translator && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.translatorAvatar}
                          alt={item.translatorName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{item.translatorName}</span>
                            {onSelectTranslator && (
                              <button
                                onClick={() => onSelectTranslator(item.translatorName)}
                                className="text-[10px] text-blue-600 hover:underline font-normal"
                              >
                                View Profile
                              </button>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{item.translatorEmail}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.languages.join(' | ')}</div>
                        </div>
                      </div>
                    </td>
                  )}

                  {/* Type & Verification */}
                  {visibleCols.type && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-[11px] font-semibold block w-fit">
                          {item.translatorType}
                        </span>
                        {item.verificationStatus === 'Certified Sworn' && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md text-[10px] font-bold inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Sworn Certified
                          </span>
                        )}
                      </div>
                    </td>
                  )}

                  {/* Overall Rating */}
                  {visibleCols.overallRating && (
                    <td className="p-3 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-base text-slate-900 dark:text-white">
                            {item.overallRating.toFixed(1)}
                          </span>
                          {renderStars(item.overallRating)}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Based on {item.totalReviews} client reviews
                        </span>
                      </div>
                    </td>
                  )}

                  {/* Sub-Ratings */}
                  {visibleCols.subRatings && (
                    <td className="p-3 whitespace-nowrap text-[10px] space-y-0.5">
                      <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-400">
                        <span>Accuracy:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.subRatings.accuracy} ★</span>
                      </div>
                      <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-400">
                        <span>Speed:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.subRatings.speed} ★</span>
                      </div>
                      <div className="flex justify-between gap-3 text-slate-600 dark:text-slate-400">
                        <span>Formatting:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.subRatings.formatting} ★</span>
                      </div>
                    </td>
                  )}

                  {/* Jobs Count */}
                  {visibleCols.jobsCount && (
                    <td className="p-3 text-center whitespace-nowrap font-bold text-slate-800 dark:text-slate-200">
                      {item.completedJobs}
                    </td>
                  )}

                  {/* On-Time Rate */}
                  {visibleCols.onTimeRate && (
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className={`font-bold ${item.onTimeRate >= 95 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {item.onTimeRate}%
                      </span>
                    </td>
                  )}

                  {/* Visibility */}
                  {visibleCols.visibility && (
                    <td className="p-3 whitespace-nowrap">
                      {item.visibility === 'Public' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                          <Eye className="w-3 h-3 text-emerald-600" /> Public
                        </span>
                      )}
                      {item.visibility === 'Featured' && (
                        <span className="px-2.5 py-1 bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" /> Featured
                        </span>
                      )}
                      {item.visibility === 'Hidden' && (
                        <span className="px-2.5 py-1 bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                          <EyeOff className="w-3 h-3 text-rose-600" /> Hidden
                        </span>
                      )}
                    </td>
                  )}

                  {/* Last Updated */}
                  {visibleCols.lastUpdated && (
                    <td className="p-3 whitespace-nowrap text-[11px] text-slate-400">
                      {item.lastUpdated}
                    </td>
                  )}

                  {/* Actions */}
                  {visibleCols.actions && (
                    <td className="p-3 text-right relative whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:hover:bg-blue-900/60 dark:text-blue-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                          title="Change Rating Score"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Change Rate</span>
                        </button>

                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Action Menu */}
                      {activeMenuId === item.id && (
                        <div className="absolute right-3 top-10 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 p-1 text-left text-xs font-medium space-y-0.5">
                          <button
                            onClick={() => {
                              handleOpenEditModal(item);
                            }}
                            className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-200"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit Rating Breakdown</span>
                          </button>

                          {item.visibility !== 'Public' && (
                            <button
                              onClick={() => {
                                handleToggleVisibility(item.id, 'Public');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-emerald-600 font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Make Visible</span>
                            </button>
                          )}

                          {item.visibility !== 'Hidden' && (
                            <button
                              onClick={() => {
                                handleToggleVisibility(item.id, 'Hidden');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-rose-600 font-semibold"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide from Marketplace</span>
                            </button>
                          )}

                          {item.visibility !== 'Featured' && (
                            <button
                              onClick={() => {
                                handleToggleVisibility(item.id, 'Featured');
                                setActiveMenuId(null);
                              }}
                              className="w-full px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-2 text-purple-600 font-semibold"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Set as Featured</span>
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
          <span>Showing {filteredRatings.length} rated translators</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">WasslaGo Rating Governance</span>
        </div>
      </div>

      {/* EDIT RATING MODAL */}
      {editingTranslator && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={editingTranslator.translatorAvatar}
                  alt={editingTranslator.translatorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Change Rating: {editingTranslator.translatorName}
                  </h3>
                  <span className="text-xs text-slate-400">{editingTranslator.translatorType}</span>
                </div>
              </div>

              <button
                onClick={() => setEditingTranslator(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Overall Rating Slider */}
              <div className="bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-900 dark:text-white">
                  <span>Overall Rating Score</span>
                  <span className="text-base text-amber-600">{editScore.toFixed(1)} / 5.0</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.1"
                  value={editScore}
                  onChange={(e) => setEditScore(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Sub-Ratings Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Accuracy Score</label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={editAccuracy}
                    onChange={(e) => setEditAccuracy(parseFloat(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Speed Score</label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={editSpeed}
                    onChange={(e) => setEditSpeed(parseFloat(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Communication</label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={editCommunication}
                    onChange={(e) => setEditCommunication(parseFloat(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Formatting</label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={editFormatting}
                    onChange={(e) => setEditFormatting(parseFloat(e.target.value))}
                    className="w-full p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Admin Override Reason */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Admin Audit Reason / Note
                </label>
                <textarea
                  rows={2}
                  value={editAdminNote}
                  onChange={(e) => setEditAdminNote(e.target.value)}
                  placeholder="Explain why rating was adjusted (e.g. Sworn Court QA Audit or Client dispute review)..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => setEditingTranslator(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Save Rating Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
