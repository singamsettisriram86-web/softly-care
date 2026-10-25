'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Check, X, ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function VisitorTrialModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only check in browser
    if (typeof window === 'undefined') return;

    // Check if dismissed before
    const isDismissed = localStorage.getItem('softly_visitor_trial_popup_dismissed');
    if (isDismissed) return;

    // Check if already logged in
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated) {
          return; // Already registered/logged in — do not show
        }

        // Show popup after 3.5 seconds of viewing
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3500);

        return () => clearTimeout(timer);
      } catch {
        // Guest user fallback
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 3500);
        return () => clearTimeout(timer);
      }
    })();
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('softly_visitor_trial_popup_dismissed', 'true');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative animate-in zoom-in-95 duration-200 font-sans text-[#292524]">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFE4E1] border border-[#FFB7B2]/60 text-[11px] font-extrabold text-stone-900 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-stone-900" />
          <span>START YOUR 3-DAY FREE TRIAL</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight leading-snug">
          Peace of Mind for Your Parents Starts Here
        </h3>

        <p className="text-xs text-stone-600 mt-2 leading-relaxed">
          Sign up in 30 seconds to coordinate daily heart &amp; diabetes medications with gentle WhatsApp reminders and trusted helper accompaniment.
        </p>

        {/* Benefits List */}
        <ul className="my-5 space-y-2.5 text-xs text-stone-700 bg-stone-50/80 p-4 rounded-2xl border border-stone-100">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Full 3-Day Free Access</strong> · No credit card required</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Automated WhatsApp Alerts</strong> to parents &amp; local helpers</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Verified Helper Marketplace</strong> with 0% agency fees</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span><strong>Doctor Calendar Sync</strong> (.ics &amp; Google Calendar)</span>
          </li>
        </ul>

        {/* CTAs */}
        <div className="space-y-2.5">
          <Link
            href="/login?tab=signup&next=/register"
            onClick={handleDismiss}
            className="w-full py-3.5 rounded-full font-bold text-xs text-stone-900 shadow-soft transition-transform active:scale-95 flex items-center justify-center gap-2 hover:opacity-95"
            style={{ background: '#FFB7B2' }}
          >
            <span>Sign Up for 3-Day Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-full text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            Explore Platform First
          </button>
        </div>

        {/* Footnote */}
        <p className="text-[10px] text-stone-400 text-center mt-3 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>No payment needed for trial · Cancel anytime</span>
        </p>
      </div>
    </div>
  );
}
