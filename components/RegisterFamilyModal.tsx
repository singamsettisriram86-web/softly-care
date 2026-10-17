'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Heart, Sparkles, User, MapPin, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (familyId: string) => void;
}

export default function RegisterFamilyModal({ isOpen, onClose, onSuccess }: Props) {
  const router = useRouter();
  const [familyName, setFamilyName] = useState('');
  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverCity, setCaregiverCity] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');

  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [parentsCity, setParentsCity] = useState('');

  const [helperName, setHelperName] = useState('');
  const [helperPhone, setHelperPhone] = useState('');
  const [helperUpi, setHelperUpi] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName.trim() || !parentsCity.trim()) {
      setError('Please provide your name and your parents’ city');
      return;
    }

    const calculatedFamilyName =
      familyName.trim() || `${caregiverName.trim()} Family`;

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyName: calculatedFamilyName,
          caregiverName: caregiverName.trim(),
          caregiverCity: caregiverCity.trim() || 'Bangalore',
          caregiverPhone: caregiverPhone.trim() || '+919999999999',
          fatherName: fatherName.trim(),
          motherName: motherName.trim(),
          parentsCity: parentsCity.trim(),
          helperName: helperName.trim(),
          helperPhone: helperPhone.trim(),
          helperUpi: helperUpi.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create family space');

      // Save chosen familyId to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('softly_active_family_id', data.family.id);
      }

      onClose();

      if (onSuccess) {
        onSuccess(data.family.id);
      } else {
        router.push(`/dashboard?familyId=${data.family.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-4xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softly-sage/80 border border-stone-200/60 text-xs font-semibold text-stone-700 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-stone-700" />
            <span>SETUP IN 1 MINUTE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-softly-text tracking-tight">
            Register Your Family Space
          </h2>
          <p className="text-xs sm:text-sm text-softly-muted mt-1 leading-relaxed">
            Enter your parents’ details so the dashboard, WhatsApp alerts, and helper checklist show your family’s real names.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Sign in with Google */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
                1. Sign in with Google
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                One-Click
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Sign in with your Google account to link your caregiver profile.
            </p>
            <GoogleSignInButton
              onUserAuthenticated={(u) => {
                setCaregiverName(u.name);
                if (!familyName) {
                  const surname = u.name.split(' ').slice(-1)[0] || u.name;
                  setFamilyName(`${surname} Family`);
                }
              }}
            />
          </div>

          {/* Section 2: Caregiver Details */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/60 space-y-3">
            <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
              2. Caregiver Contact & Location
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={caregiverName}
                  onChange={(e) => setCaregiverName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City You Live In
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, Pune, Mumbai"
                  value={caregiverCity}
                  onChange={(e) => setCaregiverCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Mobile Number (for login & updates)
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={caregiverPhone}
                onChange={(e) => setCaregiverPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
              />
            </div>
          </div>

          {/* Section 2: Your Parents */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/60 space-y-3">
            <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
              2. Your Parents (Who We Are Caring For)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Father’s Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mother’s Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sunita Sharma"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Parents’ Hometown City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hyderabad, Jaipur, Lucknow, Patna"
                value={parentsCity}
                onChange={(e) => setParentsCity(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
              />
            </div>
          </div>

          {/* Section 3: Trusted Local Helper (Optional) */}
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200/60 space-y-3">
            <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
              3. Local Helper or Neighbor (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Helper / Driver Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Suresh Kumar"
                  value={helperName}
                  onChange={(e) => setHelperName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Helper Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98888 77777"
                  value={helperPhone}
                  onChange={(e) => setHelperPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Helper UPI ID (for instant direct payments)
              </label>
              <input
                type="text"
                placeholder="e.g. suresh@upi or 9888877777@paytm"
                value={helperUpi}
                onChange={(e) => setHelperUpi(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-softly-coral"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Will be prefilled automatically when sending helper payments.
              </p>
            </div>
            <p className="text-[11px] text-stone-400">
              You can also add or change helpers anytime later from the dashboard.
            </p>
          </div>

          {/* Section 4: Family Space Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Family Display Name
            </label>
            <input
              type="text"
              placeholder={
                caregiverName ? `${caregiverName} Family` : 'e.g. Sharma Family'
              }
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-stone-500 text-xs font-medium hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-full bg-softly-coral text-softly-text text-xs font-bold shadow-soft hover:bg-[#ffa8a2] active:scale-95 transition-all flex items-center gap-2"
            >
              <span>{loading ? 'Creating Family Space...' : 'Create Family Space & Open Hub'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
