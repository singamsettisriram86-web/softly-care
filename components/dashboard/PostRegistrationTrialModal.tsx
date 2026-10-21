'use client';

import React from 'react';
import { Crown, Sparkles, Check, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

interface PostRegistrationTrialModalProps {
  isOpen: boolean;
  familyName: string;
  onProceedToPlans: () => void;
  onContinueTrial: () => void;
}

export default function PostRegistrationTrialModal({
  isOpen,
  familyName,
  onProceedToPlans,
  onContinueTrial,
}: PostRegistrationTrialModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-4xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative animate-in zoom-in-95 duration-200 font-sans text-[#292524]">
        {/* Celebration Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto mb-3 font-bold border border-emerald-200 shadow-2xs">
            🌿
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E1] border border-[#FFB7B2]/60 text-[11px] font-bold text-stone-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-stone-900" />
            <span>14-DAY COMPLIMENTARY TRIAL ACTIVE</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {familyName || 'Your Family Space'} is Ready!
          </h3>

          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Your 14-day free trial has started. All automated WhatsApp medication reminders, helper accompaniment, and clinical appointments are unlocked.
          </p>
        </div>

        {/* Premium Upgrade Highlight Card */}
        <div className="bg-gradient-to-br from-[#FFF5F4] to-white rounded-3xl p-5 border border-softly-coral/50 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-stone-900" />
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                Softly Premium Membership
              </span>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Starts at ₹208/mo
            </span>
          </div>

          <ul className="space-y-2 text-xs text-stone-700">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Unlimited WhatsApp daily medicine alerts to parents &amp; helpers</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Doctor visit calendar sync &amp; vital logs (BP, diabetes)</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>0% agency fee caregiver hiring forever</span>
            </li>
          </ul>
        </div>

        {/* 2 Choice Actions */}
        <div className="space-y-3">
          {/* Option A: Proceed to Plans */}
          <button
            type="button"
            onClick={onProceedToPlans}
            className="w-full py-4 rounded-full font-bold text-xs text-stone-900 shadow-soft transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95"
            style={{ background: '#FFB7B2' }}
          >
            <span>Explore Premium Plans &amp; Subscribe</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Option B: Skip & Continue Trial */}
          <button
            type="button"
            onClick={onContinueTrial}
            className="w-full py-3.5 rounded-full text-xs font-bold text-stone-700 border border-stone-300 hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
          >
            <span>Skip for Now &amp; Continue 14-Day Trial →</span>
          </button>
        </div>

        {/* Reassurance */}
        <p className="text-[11px] text-stone-400 text-center mt-4 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Full trial access for 14 days · You can upgrade anytime</span>
        </p>
      </div>
    </div>
  );
}
