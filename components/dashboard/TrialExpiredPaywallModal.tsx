'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Crown, Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle, Lock } from 'lucide-react';

interface TrialExpiredPaywallModalProps {
  isOpen: boolean;
  familyId?: string;
  onClose?: () => void;
  isDismissible?: boolean;
}

export default function TrialExpiredPaywallModal({
  isOpen,
  familyId,
  onClose,
  isDismissible = false,
}: TrialExpiredPaywallModalProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly_299' | 'yearly_2499'>('yearly_2499');

  if (!isOpen) return null;

  const handleSubscribe = () => {
    const dest = familyId ? `/subscribe?familyId=${familyId}` : '/subscribe';
    router.push(dest);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-4xl max-w-lg w-full p-6 sm:p-8 border border-red-200 shadow-2xl relative animate-in zoom-in-95 duration-200 font-sans text-[#292524] max-h-[92vh] overflow-y-auto no-scrollbar">
        {/* If dismissible */}
        {isDismissible && onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        )}

        {/* Warning Icon & Badge */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto mb-3 font-bold border border-red-200 shadow-2xs">
            <Lock className="w-6 h-6 text-red-600" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 border border-red-200 text-[11px] font-extrabold text-red-900 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-red-700" />
            <span>TRIAL EXPIRED · SUBSCRIPTION REQUIRED</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            Your 3-Day Free Trial Has Ended
          </h3>

          <p className="text-xs text-stone-600 mt-2 leading-relaxed">
            Automated WhatsApp reminders and clinical coordination are currently paused. Please select a plan to unlock all features and keep your parents&apos; care on track.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {/* Monthly */}
          <div
            onClick={() => setSelectedPlan('monthly_299')}
            className={`p-4 rounded-3xl border cursor-pointer transition-all ${
              selectedPlan === 'monthly_299'
                ? 'border-stone-900 bg-stone-50 ring-2 ring-stone-900'
                : 'border-stone-200 hover:border-stone-400 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Monthly</span>
              {selectedPlan === 'monthly_299' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-900 text-white">
                  ✓ Selected
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-stone-900">₹299</span>
              <span className="text-[10px] text-stone-500">/mo</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">Flexible monthly rhythm</p>
          </div>

          {/* Yearly */}
          <div
            onClick={() => setSelectedPlan('yearly_2499')}
            className={`p-4 rounded-3xl border cursor-pointer transition-all relative ${
              selectedPlan === 'yearly_2499'
                ? 'border-transparent ring-2 ring-softly-coral bg-gradient-to-br from-[#FFF5F4] to-white shadow-soft'
                : 'border-stone-200 hover:border-stone-400 bg-white'
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-stone-900 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              Save 30%
            </span>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-softly-coral">Annual</span>
              {selectedPlan === 'yearly_2499' && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Best Value
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-stone-900">₹2,499</span>
              <span className="text-[10px] text-stone-500">/yr</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">₹208 / month billed annually</p>
          </div>
        </div>

        {/* Benefits checklist */}
        <div className="bg-stone-50/80 p-4 rounded-2xl border border-stone-100 mb-6 space-y-2 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Unlimited WhatsApp medicine alerts &amp; helper dual-confirmation</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Doctor visit calendar sync &amp; vitals logs (BP, diabetes)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>0% agency fee caregiver hiring &amp; helper accompaniment</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSubscribe}
          className="w-full py-4 rounded-full font-bold text-xs text-stone-900 shadow-soft transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95"
          style={{ background: '#FFB7B2' }}
        >
          <span>
            {selectedPlan === 'yearly_2499'
              ? 'Choose Annual Plan · ₹2,499 / yr'
              : 'Choose Monthly Plan · ₹299 / mo'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Reassurance */}
        <div className="text-center mt-3 space-y-1">
          <p className="text-[11px] text-stone-500">
            All your family members and medication records are preserved safely.
          </p>
          <p className="text-[10px] text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-stone-400" />
            <span>Secured 256-bit Cashfree Checkout · UPI &amp; Cards accepted</span>
          </p>
        </div>
      </div>
    </div>
  );
}
