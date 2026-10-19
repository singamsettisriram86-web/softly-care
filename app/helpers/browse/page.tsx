'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter, Sparkles, UserPlus, ArrowLeft, RefreshCw } from 'lucide-react';
import { HelperMarketplaceProfile } from '@/lib/types';
import HelperCard from '@/components/marketplace/HelperCard';
import HelperDetailModal from '@/components/marketplace/HelperDetailModal';
import ConnectLeadModal from '@/components/marketplace/ConnectLeadModal';
import FloatingNav from '@/components/landing/FloatingNav';

const SKILL_FILTERS = [
  'All',
  'Bedridden Patient Care',
  'Vitals / BP Check',
  'Mobility & Walking',
  'Diabetic Diet & Soft Cooking',
  'Dementia & Alzheimer Care',
  'Post-Surgery Bedside Care',
];

export default function BrowseHelpersPage() {
  const [helpers, setHelpers] = useState<HelperMarketplaceProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'live_in' | 'visiting'>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [detailHelper, setDetailHelper] = useState<HelperMarketplaceProfile | null>(null);
  const [connectHelper, setConnectHelper] = useState<HelperMarketplaceProfile | null>(null);

  const fetchHelpers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCity !== 'all') params.set('city', selectedCity);
      if (selectedType !== 'all') params.set('helper_type', selectedType);
      if (selectedSkill !== 'All') params.set('skill', selectedSkill);
      if (availableOnly) params.set('available_only', 'true');
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/marketplace/helpers?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setHelpers(data.helpers || []);
      }
    } catch (e) {
      console.error('Failed to load helpers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHelpers();
  }, [selectedCity, selectedType, selectedSkill, availableOnly]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHelpers();
  };

  // Extract all distinct cities from loaded helpers or defaults
  const availableCities = useMemo(() => {
    const citySet = new Set<string>();
    helpers.forEach((h) => {
      if (h.base_city) citySet.add(h.base_city);
      (h.service_cities || []).forEach((c) => citySet.add(c));
    });
    // Add common fallback cities
    ['Amalapuram', 'Hyderabad', 'Bangalore', 'Jaipur', 'Visakhapatnam', 'Kakinada'].forEach((c) => citySet.add(c));
    return Array.from(citySet).sort();
  }, [helpers]);

  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedType('all');
    setSelectedSkill('All');
    setAvailableOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        {/* Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Softly Home</span>
          </Link>

          <Link
            href="/helpers/register"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-xs font-bold text-amber-900 transition-all shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-amber-700" />
            <span>Looking for Work? Register as Helper</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>TWO-SIDED CARE NETWORK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Find Trusted Elderly Care Helpers
          </h1>
          <p className="text-sm sm:text-base text-stone-500 mt-2 max-w-2xl leading-relaxed">
            Browse verified live-in caregivers and visiting daily helpers for your aging parents across India. Filter by hometown, care skills, and budget.
          </p>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs mb-8 space-y-4">
          {/* Search + City Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="sm:col-span-7 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, skills (e.g. Bedridden), or language..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors"
              >
                Search
              </button>
            </form>

            {/* City Dropdown */}
            <div className="sm:col-span-5 relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent appearance-none"
              >
                <option value="all">📍 All Cities & Hometowns</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Living Arrangement Type Pills */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1">
                Type:
              </span>
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedType === 'all'
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Types
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('live_in')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedType === 'live_in'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🏠 Live-in Caregivers
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('visiting')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedType === 'visiting'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🚗 Visiting Helpers
              </button>
            </div>

            {/* Availability Toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded accent-emerald-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Available Now Only</span>
            </label>
          </div>

          {/* Skill Filter Chips */}
          <div className="pt-2 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Filter by Specialized Skill:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_FILTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSkill(s)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    selectedSkill === s
                      ? 'border-transparent text-stone-900 shadow-2xs font-bold'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                  style={selectedSkill === s ? { background: '#FFB7B2' } : {}}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <p className="text-xs sm:text-sm text-stone-600 font-medium">
            Showing <strong className="text-stone-900">{helpers.length}</strong> verified care assistants
            {selectedCity !== 'all' && ` for ${selectedCity}`}
          </p>

          {(selectedCity !== 'all' || selectedType !== 'all' || selectedSkill !== 'All' || availableOnly || searchQuery) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-softly-coral hover:underline font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Candidate Cards Grid */}
        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-stone-400 mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Loading verified caregivers...</p>
          </div>
        ) : helpers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {helpers.map((helper) => (
              <HelperCard
                key={helper.id}
                helper={helper}
                onViewDetails={(h) => setDetailHelper(h)}
                onConnect={(h) => setConnectHelper(h)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-xl mx-auto">
              🔍
            </div>
            <h3 className="text-base font-bold text-stone-800">
              No caregivers found matching your criteria
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try switching the city filter to &quot;All Cities&quot; or clearing skill filters to see more available helpers.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-stone-800"
              style={{ background: '#FFB7B2' }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      <HelperDetailModal
        isOpen={!!detailHelper}
        helper={detailHelper}
        onClose={() => setDetailHelper(null)}
        onConnect={(h) => {
          setDetailHelper(null);
          setConnectHelper(h);
        }}
      />

      <ConnectLeadModal
        isOpen={!!connectHelper}
        helper={connectHelper}
        onClose={() => setConnectHelper(null)}
      />
    </div>
  );
}
