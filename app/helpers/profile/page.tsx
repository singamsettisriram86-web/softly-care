'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  Phone,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Edit3,
  Trash2,
  Search,
  UserPlus,
} from 'lucide-react';
import { HelperMarketplaceProfile, HelperLead } from '@/lib/types';
import FloatingNav from '@/components/landing/FloatingNav';
import EditHelperProfileModal from '@/components/marketplace/EditHelperProfileModal';
import DeleteHelperConfirmModal from '@/components/marketplace/DeleteHelperConfirmModal';

export default function HelperProfileDashboard() {
  const [helper, setHelper] = useState<HelperMarketplaceProfile | null>(null);
  const [leads, setLeads] = useState<HelperLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupError, setLookupError] = useState('');

  // Modals & Notifications
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [deletedNotice, setDeletedNotice] = useState(false);

  const loadHelper = async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/marketplace/helpers?id=${id}`);
      const data = await res.json();
      if (data.success && data.helper) {
        setHelper(data.helper);

        // Also fetch leads
        const leadsRes = await fetch(`/api/marketplace/leads?helperId=${id}`);
        const leadsData = await leadsRes.json();
        if (leadsData.success) {
          setLeads(leadsData.leads || []);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to load helper profile:', e);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initProfile = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const idFromUrl = params.get('id');

        // 1. If explicit ?id= is given in the URL, load it
        if (idFromUrl) {
          await loadHelper(idFromUrl);
          return;
        }

        // 2. Check if the currently logged-in user has their own caregiver profile
        try {
          const mineRes = await fetch('/api/marketplace/helpers?check=mine');
          const mineData = await mineRes.json();
          if (mineData.success && mineData.helper) {
            setHelper(mineData.helper);
            if (typeof window !== 'undefined') {
              localStorage.setItem('softly_marketplace_helper_id', mineData.helper.id);
            }
            const leadsRes = await fetch(`/api/marketplace/leads?helperId=${mineData.helper.id}`);
            const leadsData = await leadsRes.json();
            if (leadsData.success) {
              setLeads(leadsData.leads || []);
            }
            setLoading(false);
            return;
          }
        } catch {
          // Proceed to next fallback
        }

        // 3. Check if an ID was previously registered in this browser session
        const storedId = typeof window !== 'undefined' ? localStorage.getItem('softly_marketplace_helper_id') : null;
        if (storedId) {
          const loaded = await loadHelper(storedId);
          if (loaded) return;
          // Stale ID, clear it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('softly_marketplace_helper_id');
          }
        }

        // 4. No profile found for this user/session -> show empty state (NO hardcoded demo fallback!)
        setHelper(null);
      } catch (err) {
        console.error('Error initializing helper profile:', err);
        setHelper(null);
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, []);

  const handleToggleAvailability = async () => {
    if (!helper) return;
    setUpdatingAvailability(true);
    const newStatus = !helper.is_available;
    try {
      const res = await fetch('/api/marketplace/helpers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: helper.id,
          is_available: newStatus,
          availability_note: newStatus ? 'Available immediately' : 'Currently employed with a family',
        }),
      });
      const data = await res.json();
      if (data.success && data.helper) {
        setHelper(data.helper);
      }
    } catch (e) {
      console.error('Failed to toggle availability:', e);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const handlePhoneLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupPhone.trim()) return;
    setLoading(true);
    setLookupError('');
    try {
      const clean = lookupPhone.trim().slice(-10);
      const res = await fetch(`/api/marketplace/helpers?search=${clean}`);
      const data = await res.json();
      if (data.success && data.helpers && data.helpers.length > 0) {
        const found = data.helpers[0];
        setHelper(found);
        localStorage.setItem('softly_marketplace_helper_id', found.id);
        const leadsRes = await fetch(`/api/marketplace/leads?helperId=${found.id}`);
        const leadsData = await leadsRes.json();
        if (leadsData.success) setLeads(leadsData.leads || []);
      } else {
        setLookupError('No caregiver profile found matching this mobile number.');
      }
    } catch {
      setLookupError('Lookup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 w-full">
        {/* Top Link */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <Link
            href="/helpers/browse"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse All Helpers Directory</span>
          </Link>

          <Link
            href="/helpers/register"
            className="text-xs font-bold text-stone-600 hover:text-stone-900 hover:underline"
          >
            + Register Another Profile
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin text-stone-400 mx-auto" />
            <p className="text-xs text-stone-500 font-medium">Loading your caregiver dashboard...</p>
          </div>
        ) : deletedNotice ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 text-center max-w-md mx-auto space-y-4 shadow-sm animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto font-bold border border-emerald-100">
              ✓
            </div>
            <h2 className="text-xl font-bold text-stone-900">Profile Successfully Deleted</h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Your helper profile and listings have been permanently removed from the Softly Marketplace. Families will no longer see your contact details.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Link
                href="/helpers/browse"
                className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors"
              >
                Browse Marketplace Directory
              </Link>
              <Link
                href="/helpers/register"
                className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
              >
                Register as a Helper
              </Link>
            </div>
          </div>
        ) : !helper ? (
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 text-center max-w-lg mx-auto space-y-6 shadow-xs animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl mx-auto border border-amber-100 shadow-2xs">
              🩺
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
                Caregiver Work Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
                No Caregiver Profile Registered Yet
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                You haven&apos;t created a public caregiver profile on this account yet. If you are an elder caregiver, nursing attendant, or cook looking for jobs, register your profile to get direct family inquiries with zero commission.
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link
                href="/helpers/register"
                className="px-6 py-3 rounded-full bg-softly-text hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>📝 Register as a Helper</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/helpers/browse"
                className="px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-stone-500" />
                <span>Browse Caregivers</span>
              </Link>
            </div>

            {/* Phone Lookup for Existing Helpers */}
            <div className="pt-6 border-t border-stone-100 space-y-3">
              <p className="text-xs font-semibold text-stone-600">
                Already registered previously with a mobile number?
              </p>

              {lookupError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 text-center">
                  {lookupError}
                </div>
              )}

              <form onSubmit={handlePhoneLookup} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={lookupPhone}
                  onChange={(e) => setLookupPhone(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-transform active:scale-95 shadow-2xs"
                  style={{ background: '#FFB7B2', color: '#292524' }}
                >
                  Look Up
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Toast Notification */}
            {toastMsg && (
              <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in">
                <span className="flex items-center gap-2">
                  <span>✨</span>
                  <span>{toastMsg}</span>
                </span>
                <button
                  onClick={() => setToastMsg('')}
                  className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Header Greeting & Actions */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                  Caregiver Work Portal
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 mt-0.5">
                  Welcome, {helper.name}!
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Your profile is listed in <strong className="text-stone-800">{helper.base_city}</strong> and {helper.service_cities?.length || 1} service cities.
                </p>
              </div>

              {/* Action Buttons: Edit, Delete, View */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-stone-300" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-bold transition-all shadow-2xs active:scale-95"
                  title="Permanently remove your helper profile"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Profile</span>
                </button>

                <Link
                  href="/helpers/browse"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-700 transition-colors shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Public Directory</span>
                </Link>
              </div>
            </div>

            {/* Big Availability Switch Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              helper.is_available
                ? 'bg-gradient-to-br from-emerald-50/80 to-white border-emerald-200/90 shadow-sm'
                : 'bg-gradient-to-br from-stone-100 to-white border-stone-200'
            }`}>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${helper.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-stone-400'}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                      Live Availability Status
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                    {helper.is_available
                      ? '🟢 Currently Open for Work (Visible to Families)'
                      : '🔴 Currently Employed / Busy (Hidden from Search)'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {helper.is_available
                      ? 'Families can find you and click to call or chat on WhatsApp.'
                      : 'You are temporarily off the marketplace. Toggle back on when ready for new clients.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleAvailability}
                  disabled={updatingAvailability}
                  className={`px-5 py-3 rounded-full text-xs font-bold shadow-xs transition-all active:scale-95 flex items-center gap-2 ${
                    helper.is_available
                      ? 'bg-stone-900 text-white hover:bg-stone-800'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {updatingAvailability ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : helper.is_available ? (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      <span>Set as Employed (Hide)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      <span>Set as Available Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2-Column: Live Profile Preview & Inquiries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card Preview */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Your Public Listing Preview
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-700 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-xl transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3 h-3 text-stone-500" />
                      <span>Edit</span>
                    </button>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-stone-800 flex items-center justify-center font-bold text-lg shrink-0">
                    {helper.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900">{helper.name}</h4>
                    <p className="text-xs text-stone-500">
                      {helper.base_city} • {helper.experience_years}+ Yrs Exp
                    </p>
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-semibold">
                      {helper.helper_type === 'live_in' ? '🏠 Live-in Caregiver' : '🚗 Visiting Helper'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-1.5 pt-2 border-t border-stone-100">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Monthly Pay:</span>
                    <span className="font-bold text-stone-900">{helper.expected_salary || '₹15,000/mo'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Daily Pay:</span>
                    <span className="font-semibold text-stone-800">{helper.daily_rate || '₹600/day'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Service Cities:</span>
                    <span className="font-medium text-stone-800">{helper.service_cities?.join(', ') || helper.base_city}</span>
                  </div>
                  {helper.upi_id && (
                    <div className="flex justify-between">
                      <span className="text-stone-400">UPI ID:</span>
                      <span className="font-mono text-stone-700">{helper.upi_id}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Skills Showcased:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(helper.skills || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Family Inquiries / Leads */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                      Interested Families ({leads.length})
                    </span>
                    <span className="text-xs text-stone-400">Recent Inquiries</span>
                  </div>

                  {leads.length > 0 ? (
                    <div className="space-y-3">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900">{lead.seeker_name}</span>
                            <span className="text-[10px] text-stone-400">
                              {lead.created_at ? new Date(lead.created_at).toLocaleDateString('en-IN') : 'Recent'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-stone-600">
                            <span>Phone: +91 {lead.seeker_phone}</span>
                            {lead.seeker_city && <span className="text-stone-500 font-medium">{lead.seeker_city}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-stone-400 space-y-2">
                      <Clock className="w-6 h-6 mx-auto text-stone-300" />
                      <p className="text-xs">No family inquiries yet.</p>
                      <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                        Make sure your status is set to &quot;Available Now&quot; so families searching in {helper.base_city} can discover you.
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 text-center">
                  <p className="text-[11px] text-stone-400">
                    💡 Tip: When families call you, mention that you are a verified Softly caregiver.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      <EditHelperProfileModal
        isOpen={isEditModalOpen}
        helper={helper}
        onClose={() => setIsEditModalOpen(false)}
        onUpdated={(updated) => {
          setHelper(updated);
          setToastMsg('Caregiver profile updated successfully!');
          setTimeout(() => setToastMsg(''), 5000);
        }}
      />

      {/* Delete Profile Confirmation Modal */}
      <DeleteHelperConfirmModal
        isOpen={isDeleteModalOpen}
        helper={helper}
        onClose={() => setIsDeleteModalOpen(false)}
        onDeleted={() => {
          setIsDeleteModalOpen(false);
          setHelper(null);
          setDeletedNotice(true);
        }}
      />
    </div>
  );
}
