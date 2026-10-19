'use client';

import React from 'react';
import { X, ShieldCheck, MapPin, Briefcase, Phone, MessageSquare, Check, Sparkles, Clock, Globe } from 'lucide-react';
import { HelperMarketplaceProfile } from '@/lib/types';

interface Props {
  isOpen: boolean;
  helper: HelperMarketplaceProfile | null;
  onClose: () => void;
  onConnect: (helper: HelperMarketplaceProfile) => void;
}

export default function HelperDetailModal({ isOpen, helper, onClose, onConnect }: Props) {
  if (!isOpen || !helper) return null;

  const isLiveIn = helper.helper_type === 'live_in';
  const isVisiting = helper.helper_type === 'visiting';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-7 border border-stone-200 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Card */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 text-stone-800 flex items-center justify-center text-xl font-bold shrink-0 shadow-sm">
            {helper.name.charAt(0)}
          </div>

          <div className="min-w-0 pr-6">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h2 className="text-xl font-bold text-stone-900 leading-tight">
                {helper.name}
              </h2>
              {helper.is_verified && (
                <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verified</span>
                </span>
              )}
            </div>

            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2 flex-wrap">
              <span>{helper.age || 35} yrs, {helper.gender || 'Caregiver'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-stone-700 font-medium">
                <MapPin className="w-3 h-3 text-stone-400" />
                {helper.base_city}
              </span>
              <span>•</span>
              <span className="font-semibold text-emerald-700">
                {helper.experience_years}+ Yrs Experience
              </span>
            </p>
          </div>
        </div>

        {/* Status & Rate Bar */}
        <div className="grid grid-cols-2 gap-3 mb-5 p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/70">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              Expected Compensation
            </span>
            <p className="text-sm font-bold text-stone-900 mt-0.5">
              {helper.expected_salary || '₹15,000 / mo'}
            </p>
            {helper.daily_rate && (
              <p className="text-[10px] text-stone-500">or {helper.daily_rate}</p>
            )}
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
              Living Arrangement
            </span>
            <div className="mt-0.5 flex items-center gap-1 text-xs font-bold text-stone-800">
              <span>{isLiveIn ? '🏠 Live-in Caregiver' : isVisiting ? '🚗 Visiting Helper' : '🤝 Live-in or Visiting'}</span>
            </div>
            <p className="text-[10px] text-emerald-700 font-medium">
              {helper.availability_note || 'Available immediately'}
            </p>
          </div>
        </div>

        {/* Service Cities */}
        <div className="mb-5">
          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5 flex items-center gap-1">
            <Globe className="w-3 h-3 text-stone-400" />
            <span>Available to Serve In</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {helper.service_cities && helper.service_cities.length > 0 ? (
              helper.service_cities.map((city) => (
                <span
                  key={city}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-stone-400" />
                  {city}
                </span>
              ))
            ) : (
              <span className="text-xs text-stone-500">{helper.base_city}</span>
            )}
          </div>
        </div>

        {/* Core Care Skills */}
        <div className="mb-5">
          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider block mb-2 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-stone-400" />
            <span>Specialized Care Skills</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(helper.skills || []).map((skill) => (
              <div
                key={skill}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200/80 text-xs text-stone-800 font-medium flex items-center gap-2 shadow-xs"
              >
                <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Spoken */}
        <div className="mb-5">
          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
            Languages Spoken
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(helper.languages || ['Telugu', 'Hindi']).map((lang) => (
              <span
                key={lang}
                className="px-3 py-0.5 rounded-full bg-stone-50 border border-stone-200 text-xs font-medium text-stone-600"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        {/* Bio / About */}
        {helper.bio && (
          <div className="mb-6">
            <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
              Caregiver Experience & Background
            </span>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200/70">
              {helper.bio}
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-full text-xs font-semibold text-stone-500 hover:bg-stone-100 transition-colors"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onConnect(helper);
            }}
            className="flex-1 py-3 px-5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: '#FFB7B2', color: '#292524' }}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Connect with {helper.name.split(' ')[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
