'use client';

import React from 'react';
import { X, Users, Search, Briefcase, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
}

export default function FirstTimeChoiceModal({ isOpen, onClose, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="first-time-modal-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-6 sm:p-7 space-y-5 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button ("Wrong" / Dismiss button) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-all"
          title="Skip and go to full dashboard"
          aria-label="Close popup and go to full dashboard"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>WELCOME TO SOFTLY</span>
          </div>

          <h2
            id="first-time-modal-title"
            className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight"
          >
            How would you like to get started?
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Choose where you&apos;d like to begin, or simply close this plate to explore your full dashboard.
          </p>
        </div>

        {/* 3 Choice Cards */}
        <div className="space-y-3 pt-1">
          {/* Card 1: Register Family Space */}
          <button
            type="button"
            onClick={() => onSelect('/register')}
            className="w-full text-left p-4 rounded-2xl border-2 border-stone-200/80 hover:border-softly-coral bg-stone-50/70 hover:bg-[#FFB7B2]/10 transition-all group flex items-start gap-3.5 active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFB7B2]/40 text-stone-900 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5 text-stone-800" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-stone-900 group-hover:text-stone-950">
                  1. Register Your Family Space
                </span>
                <span className="text-[10px] font-bold bg-[#FFB7B2]/50 text-stone-900 px-2 py-0.5 rounded-full shrink-0">
                  Families
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Set up medication schedules, daily WhatsApp reminders for aging parents, and link family members.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors shrink-0 mt-3" />
          </button>

          {/* Card 2: Find a Helper */}
          <button
            type="button"
            onClick={() => onSelect('/helpers/browse')}
            className="w-full text-left p-4 rounded-2xl border-2 border-stone-200/80 hover:border-amber-400 bg-stone-50/70 hover:bg-amber-50/50 transition-all group flex items-start gap-3.5 active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 text-amber-800" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-stone-900 group-hover:text-stone-950">
                  2. Find an Elder Helper
                </span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full shrink-0">
                  Marketplace
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Browse verified live-in caregivers, daytime attendants, and bedridden care specialists with direct payouts.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors shrink-0 mt-3" />
          </button>

          {/* Card 3: Care Jobs & Register Helper */}
          <button
            type="button"
            onClick={() => onSelect('/helpers/jobs')}
            className="w-full text-left p-4 rounded-2xl border-2 border-stone-200/80 hover:border-emerald-500 bg-stone-50/70 hover:bg-emerald-50/50 transition-all group flex items-start gap-3.5 active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-emerald-800" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-stone-900 group-hover:text-stone-950">
                  3. Helper Jobs &amp; Roles
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full shrink-0">
                  Caregivers
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Explore the 4 caregiver job categories, salary ranges, or publish your verified helper profile for free.
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-800 transition-colors shrink-0 mt-3" />
          </button>
        </div>

        {/* Footer / Skip action */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[11px] text-stone-400">
            Optional setup — everything is also available anytime from your main dashboard.
          </p>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold text-stone-700 hover:text-stone-950 px-3 py-1.5 rounded-xl hover:bg-stone-100 transition-colors shrink-0 flex items-center gap-1"
          >
            <span>Skip to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
