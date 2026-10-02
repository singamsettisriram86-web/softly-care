'use client';

import React, { useState } from 'react';
import { X, IndianRupee, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  helperName: string;
  onPaymentSuccess: () => void;
}

export default function CashfreePayModal({
  isOpen,
  onClose,
  helperName,
  onPaymentSuccess,
}: Props) {
  const [amount, setAmount] = useState('500');
  const [purpose, setPurpose] = useState('Clinic accompaniment & medicine pickup');
  const [step, setStep] = useState<'form' | 'checkout' | 'success'>('form');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const presets = ['300', '500', '1500', '3000'];

  const handleInitiateCashfree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/payments/cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountINR: Number(amount),
          purpose,
          helperName,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create Cashfree order');

      setOrderData(data);
      setStep('checkout');
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatePaymentSuccess = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payments/cashfree-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: orderData?.orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('success');
        onPaymentSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep('form');
    setOrderData(null);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-4xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'form' && (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase font-bold text-softly-muted tracking-wider">
                Cashfree Payments
              </span>
              <h2 className="text-2xl font-bold text-softly-text tracking-tight flex items-center gap-1.5">
                Pay Helper: {helperName}
              </h2>
              <p className="text-xs text-softly-muted mt-1">
                Disburse verified compensation, medicine expenses, or monthly care stipends.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleInitiateCashfree} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Amount in INR (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-lg font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-2 mt-2">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        amount === val
                          ? 'bg-softly-coral text-softly-text border-softly-coral'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Payment Purpose / Note
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/60 text-[11px] text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Powered by Cashfree Payments Gateway (Sandbox ready).</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-full text-stone-600 text-xs font-medium hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full bg-softly-coral text-softly-text text-xs font-bold shadow-soft hover:bg-[#ffa8a2] active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>{loading ? 'Creating Order...' : `Proceed to Pay ₹${amount}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'checkout' && (
          <div className="text-center py-2 animate-in fade-in">
            {/* Cashfree Simulated Checkout Dialog */}
            <div className="w-12 h-12 rounded-2xl bg-[#0F2942] mx-auto mb-4 flex items-center justify-center text-white font-bold text-sm">
              CF
            </div>
            <h3 className="font-bold text-lg text-stone-900 mb-1">Cashfree Checkout Simulator</h3>
            <p className="text-xs text-stone-500 mb-4">
              Order ID: <code className="text-[11px] bg-stone-100 px-1.5 py-0.5 rounded">{orderData?.orderId}</code>
            </p>

            <div className="bg-stone-50 rounded-2xl p-4 text-left border border-stone-200 mb-5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Payee:</span>
                <span className="font-semibold text-stone-800">{helperName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Purpose:</span>
                <span className="font-semibold text-stone-800">{purpose}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200 text-sm">
                <span className="font-bold text-stone-700">Total Amount:</span>
                <span className="font-extrabold text-stone-900">₹{orderData?.amount}</span>
              </div>
            </div>

            <div className="space-y-2 mb-6 text-left">
              <div className="p-3 rounded-xl border border-emerald-300 bg-emerald-50/50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📱</span>
                  <div>
                    <p className="text-xs font-bold text-stone-800">Instant UPI Payment</p>
                    <p className="text-[10px] text-stone-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleSimulatePaymentSuccess}
              className="w-full py-3.5 rounded-full bg-[#0F2942] hover:bg-[#1b3d5e] text-white font-semibold text-xs shadow-soft active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <span>Confirm Test Payment of ₹{orderData?.amount}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-4 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-stone-900 mb-1">Payment Successful!</h3>
            <p className="text-xs text-softly-muted mb-6">
              ₹{amount} has been paid to <strong>{helperName}</strong> for {purpose}.
            </p>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-8 py-3 rounded-full bg-softly-coral text-softly-text text-xs font-bold shadow-soft hover:bg-[#ffa8a2] transition-colors"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
