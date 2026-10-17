'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, ShieldCheck, Sparkles, MessageCircle, HeartHandshake, Zap, Calendar } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  familyId: string;
  familyName?: string;
  currentTrialEndsAt?: string;
  subscriptionStatus?: string;
  onSubscribed: () => void;
}

export default function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  familyId,
  familyName = 'Family',
  currentTrialEndsAt,
  subscriptionStatus,
  onSubscribed,
}: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly_299' | 'yearly_2499'>('monthly_299');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Load Cashfree JS SDK v3
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('cashfree-js')) {
      const script = document.createElement('script');
      script.id = 'cashfree-js';
      script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subscriptions/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId,
          plan: selectedPlan,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.paymentSessionId) {
        throw new Error(data.error || 'Failed to initiate subscription order');
      }

      // Initialize Cashfree Checkout
      if (!(window as any).Cashfree) {
        throw new Error('Cashfree payment SDK loading. Please try again in a few seconds.');
      }

      const cashfree = (window as any).Cashfree({
        mode: data.isProduction ? 'production' : 'sandbox',
      });

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_modal',
      }).then(async () => {
        // Verify payment
        const verifyRes = await fetch('/api/subscriptions/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.orderId,
            familyId,
            plan: selectedPlan,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setSuccess(true);
          setTimeout(() => {
            onSubscribed();
            onClose();
          }, 1500);
        } else {
          setError(verifyData.message || 'Payment not completed.');
        }
      });
    } catch (err: any) {
      setError(err.message || 'Unable to open checkout');
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
      <div className="bg-white rounded-4xl max-w-lg w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative max-h-[92vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-softly-text">Welcome to Softly Premium!</h3>
            <p className="text-xs text-softly-muted">
              WhatsApp reminders are now activated with your monthly quota. Thank you for protecting your family with Softly.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softly-coral/20 text-[#8C3330] text-[11px] font-bold tracking-wide uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5 text-softly-coral" />
                Softly Care Premium
              </span>
              <h2 className="text-2xl font-bold text-softly-text tracking-tight">
                Keep Your Parents Protected
              </h2>
              <p className="text-xs text-softly-muted mt-1 leading-relaxed">
                Automated WhatsApp reminders ensure your parents take their medications on time, every time — even when you are busy or miles away.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
                {error}
              </div>
            )}

            {/* Plan Selector */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {/* Monthly */}
              <button
                type="button"
                onClick={() => setSelectedPlan('monthly_299')}
                className={`p-4 rounded-3xl border text-left transition-all relative ${
                  selectedPlan === 'monthly_299'
                    ? 'border-softly-coral bg-[#FFF8F6] shadow-soft'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Monthly</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-softly-text">₹299</span>
                  <span className="text-xs text-stone-400">/mo</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Flexible, cancel anytime.</p>
              </button>

              {/* Annual */}
              <button
                type="button"
                onClick={() => setSelectedPlan('yearly_2499')}
                className={`p-4 rounded-3xl border text-left transition-all relative ${
                  selectedPlan === 'yearly_2499'
                    ? 'border-softly-coral bg-[#FFF8F6] shadow-soft'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                  Save 30%
                </span>
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Annual</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-softly-text">₹2,499</span>
                  <span className="text-xs text-stone-400">/yr</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1">Just ₹208/month.</p>
              </button>
            </div>

            {/* Benefits Included */}
            <div className="bg-stone-50 rounded-3xl p-4 border border-stone-200/80 mb-6 space-y-2.5">
              <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block mb-1">
                Everything in Premium:
              </span>
              <div className="flex items-center gap-2.5 text-xs text-stone-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span><strong>150 Automated WhatsApp alerts</strong> to parents &amp; helpers each month</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>1-Tap WhatsApp "DONE" confirmation syncs to dashboard</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Doctor appointment accompaniment &amp; calendar invites</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-stone-700">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Local helper task checklist &amp; direct UPI payouts</span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleSubscribe}
              className="w-full py-3.5 rounded-full bg-softly-text hover:bg-stone-800 text-white font-bold text-sm shadow-soft active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Connecting Cashfree...'
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    Subscribe Now · {selectedPlan === 'yearly_2499' ? '₹2,499 / Year' : '₹299 / Month'}
                  </span>
                </>
              )}
            </button>

            <p className="text-[11px] text-stone-400 text-center mt-3 flex items-center justify-center gap-1.5">
              <span>Secured by Cashfree Payments · UPI, Cards &amp; Netbanking</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
