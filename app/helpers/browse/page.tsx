'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Filter, Sparkles, UserPlus, ArrowLeft, RefreshCw, X, Check, ChevronDown } from 'lucide-react';
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

interface IndianCity {
  name: string;
  state: string;
  popular?: boolean;
}

const INDIAN_CITIES: IndianCity[] = [
  // Andhra Pradesh & Telangana
  { name: 'Amalapuram', state: 'Andhra Pradesh', popular: true },
  { name: 'Hyderabad', state: 'Telangana', popular: true },
  { name: 'Kakinada', state: 'Andhra Pradesh', popular: true },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', popular: true },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', popular: true },
  { name: 'Vijayawada', state: 'Andhra Pradesh', popular: true },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Nellore', state: 'Andhra Pradesh' },
  { name: 'Kurnool', state: 'Andhra Pradesh' },
  { name: 'Eluru', state: 'Andhra Pradesh' },
  { name: 'Anantapur', state: 'Andhra Pradesh' },
  { name: 'Secunderabad', state: 'Telangana' },
  { name: 'Warangal', state: 'Telangana' },
  { name: 'Nizamabad', state: 'Telangana' },
  { name: 'Karimnagar', state: 'Telangana' },
  { name: 'Khammam', state: 'Telangana' },

  // Karnataka
  { name: 'Bangalore', state: 'Karnataka', popular: true },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Mangalore', state: 'Karnataka' },
  { name: 'Hubli-Dharwad', state: 'Karnataka' },
  { name: 'Belgaum', state: 'Karnataka' },
  { name: 'Hosur', state: 'Tamil Nadu / KA border' },

  // Tamil Nadu & Kerala
  { name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { name: 'Coimbatore', state: 'Tamil Nadu' },
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Trichy', state: 'Tamil Nadu' },
  { name: 'Salem', state: 'Tamil Nadu' },
  { name: 'Kochi', state: 'Kerala', popular: true },
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Kozhikode', state: 'Kerala' },
  { name: 'Thrissur', state: 'Kerala' },

  // Maharashtra & Gujarat
  { name: 'Mumbai', state: 'Maharashtra', popular: true },
  { name: 'Pune', state: 'Maharashtra', popular: true },
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Navi Mumbai', state: 'Maharashtra' },
  { name: 'Ahmedabad', state: 'Gujarat', popular: true },
  { name: 'Surat', state: 'Gujarat' },
  { name: 'Vadodara', state: 'Gujarat' },
  { name: 'Rajkot', state: 'Gujarat' },

  // North & Central India
  { name: 'Delhi NCR', state: 'Delhi & NCR', popular: true },
  { name: 'Noida', state: 'Uttar Pradesh' },
  { name: 'Gurgaon', state: 'Haryana' },
  { name: 'Faridabad', state: 'Haryana' },
  { name: 'Ghaziabad', state: 'Uttar Pradesh' },
  { name: 'Jaipur', state: 'Rajasthan', popular: true },
  { name: 'Chandigarh', state: 'Punjab / Haryana', popular: true },
  { name: 'Lucknow', state: 'Uttar Pradesh' },
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Indore', state: 'Madhya Pradesh' },
  { name: 'Bhopal', state: 'Madhya Pradesh' },
  { name: 'Jabalpur', state: 'Madhya Pradesh' },

  // East & North East
  { name: 'Kolkata', state: 'West Bengal', popular: true },
  { name: 'Howrah', state: 'West Bengal' },
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Cuttack', state: 'Odisha' },
  { name: 'Patna', state: 'Bihar' },
  { name: 'Ranchi', state: 'Jharkhand' },
  { name: 'Jamshedpur', state: 'Jharkhand' },
  { name: 'Guwahati', state: 'Assam' },
];

export default function BrowseHelpersPage() {
  const router = useRouter();
  const [helpers, setHelpers] = useState<HelperMarketplaceProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication check: users must sign up or log in to find / browse helpers
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/login?next=/helpers/browse&tab=signup');
        }
      } catch (_) {}
    })();
  }, [router]);

  // Filters
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'live_in' | 'visiting'>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dropdown & Search state
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Modals
  const [detailHelper, setDetailHelper] = useState<HelperMarketplaceProfile | null>(null);
  const [connectHelper, setConnectHelper] = useState<HelperMarketplaceProfile | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsCityDropdownOpen(false);
    fetchHelpers();
  };

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setIsCityDropdownOpen(false);
  };

  // Find which cities have registered helpers
  const activeHelperCities = useMemo(() => {
    const s = new Set<string>();
    helpers.forEach((h) => {
      if (h.base_city) s.add(h.base_city.toLowerCase());
      (h.service_cities || []).forEach((c) => s.add(c.toLowerCase()));
    });
    return s;
  }, [helpers]);

  // Filtered Indian cities based on search bar text
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return INDIAN_CITIES;
    const q = searchQuery.toLowerCase().trim();
    return INDIAN_CITIES.filter(
      (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const popularCities = useMemo(() => {
    return INDIAN_CITIES.filter((c) => c.popular);
  }, []);

  const clearFilters = () => {
    setSelectedCity('all');
    setSelectedType('all');
    setSelectedSkill('All');
    setAvailableOnly(false);
    setSearchQuery('');
    setIsCityDropdownOpen(false);
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
            {/* Interactive Search Bar with Indian Cities Dropdown */}
            <div ref={searchRef} className="sm:col-span-7 relative">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={
                      selectedCity !== 'all'
                        ? `City: ${selectedCity} (Click to change city or search...)`
                        : "Click to select city in India, or type skills..."
                    }
                    value={searchQuery}
                    onFocus={() => setIsCityDropdownOpen(true)}
                    onClick={() => setIsCityDropdownOpen(true)}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsCityDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsCityDropdownOpen(false);
                    }}
                    className="w-full pl-9 pr-16 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent transition-all"
                  />

                  {/* Inside Input Action Indicators */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          fetchHelpers();
                        }}
                        className="p-1 text-stone-400 hover:text-stone-700 rounded"
                        title="Clear search text"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                      className="p-1 text-stone-400 hover:text-stone-700 rounded"
                      title="Open cities list"
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isCityDropdownOpen ? 'rotate-180 text-stone-800' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-2xs"
                >
                  Search
                </button>
              </form>

              {/* DROPDOWN OF CITIES IN INDIA */}
              {isCityDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 z-40 bg-white/98 backdrop-blur-md rounded-2xl border border-stone-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown Header */}
                  <div className="px-3.5 py-2.5 bg-stone-50/90 border-b border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      Select City / Hometown in India
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsCityDropdownOpen(false)}
                      className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* All Cities Option */}
                  <button
                    type="button"
                    onClick={() => handleSelectCity('all')}
                    className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-stone-100 transition-colors border-b border-stone-100 ${
                      selectedCity === 'all' ? 'bg-[#FFB7B2]/20 text-stone-900 font-bold' : 'text-stone-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">🌏</span>
                      <span>All Cities Across India (Show All Helpers)</span>
                    </span>
                    {selectedCity === 'all' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  {/* Quick Popular Cities Pills */}
                  <div className="px-3.5 py-2.5 bg-amber-50/40 border-b border-stone-100">
                    <span className="text-[10px] font-bold text-amber-900/80 uppercase tracking-wider block mb-1.5">
                      Popular Caregiver Hubs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularCities.slice(0, 10).map((c) => (
                        <button
                          key={`pop-${c.name}`}
                          type="button"
                          onClick={() => handleSelectCity(c.name)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            selectedCity.toLowerCase() === c.name.toLowerCase()
                              ? 'bg-stone-900 text-white shadow-2xs'
                              : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* If user typed a search term, allow searching keyword as skill/name */}
                  {searchQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-semibold bg-blue-50/60 hover:bg-blue-100/70 border-b border-blue-100 flex items-center justify-between text-blue-900 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Search className="w-3.5 h-3.5 text-blue-600" />
                        <span>
                          Search caregivers for keyword: <strong>&quot;{searchQuery}&quot;</strong>
                        </span>
                      </span>
                      <span className="text-[10px] text-blue-600/70">Press Search ↵</span>
                    </button>
                  )}

                  {/* Scrollable Indian Cities List */}
                  <div className="max-h-56 overflow-y-auto divide-y divide-stone-100">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => {
                        const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
                        const hasHelpers = activeHelperCities.has(city.name.toLowerCase());

                        return (
                          <button
                            key={city.name}
                            type="button"
                            onClick={() => handleSelectCity(city.name)}
                            className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between hover:bg-stone-100 transition-colors ${
                              isSelected ? 'bg-[#FFB7B2]/20 font-bold text-stone-900' : 'text-stone-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <MapPin
                                className={`w-3.5 h-3.5 ${
                                  isSelected ? 'text-stone-900' : 'text-stone-400'
                                }`}
                              />
                              <div>
                                <span className="font-semibold text-stone-900">{city.name}</span>
                                <span className="text-[10px] text-stone-400 ml-1.5">
                                  {city.state}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {hasHelpers && (
                                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full">
                                  Active Helpers
                                </span>
                              )}
                              {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-stone-500">
                        No Indian city found matching &quot;{searchQuery}&quot;.
                        <br />
                        <button
                          type="button"
                          onClick={() => handleSearchSubmit()}
                          className="mt-2 text-softly-coral font-bold hover:underline"
                        >
                          Search as helper skill or name instead ➔
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* City Selector Dropdown (Desktop & Mobile complement) */}
            <div className="sm:col-span-5 relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 font-medium outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="all">📍 All Cities &amp; Hometowns (India)</option>
                <optgroup label="🌟 Popular Caregiver Locations">
                  {popularCities.map((c) => (
                    <option key={`opt-pop-${c.name}`} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🏙️ All Cities in India">
                  {INDIAN_CITIES.map((c) => (
                    <option key={`opt-all-${c.name}`} value={c.name}>
                      {c.name}, {c.state}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Active City Filter Chip (if city is selected) */}
          {selectedCity !== 'all' && (
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                Selected Location:
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{selectedCity}</span>
                <button
                  type="button"
                  onClick={() => setSelectedCity('all')}
                  className="hover:bg-emerald-200/60 rounded-full p-0.5 ml-0.5 text-emerald-700"
                  title="Clear city filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
              <button
                type="button"
                onClick={() => setIsCityDropdownOpen(true)}
                className="text-stone-500 hover:text-stone-900 text-xs font-medium underline"
              >
                Change city
              </button>
            </div>
          )}

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
