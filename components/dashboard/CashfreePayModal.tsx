'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  QrCode,
  Smartphone,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  helperName: string;
  helperUpi?: string;
  familyId?: string;
  onPaymentSuccess: () => void;
}

export default function CashfreePayModal({
  isOpen,
  onClose,
  helperName,
  helperUpi: initialHelperUpi,
  familyId,
  onPaymentSuccess,
}: Props) {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cashfree'>('upi');
  const [amount, setAmount] = useState('500');
  const [purpose, setPurpose] = useState('Weekly Caregiving & Medicine Pickup');
  const [helperUpi, setHelperUpi] = useState(initialHelperUpi || '');
  const [step, setStep] = useState<'form' | 'pay' | 'success'>('form');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialHelperUpi) {
        setHelperUpi(initialHelperUpi);
      }
      setStep('form');
      setOrderData(null);
      setError('');
    }
  }, [isOpen, initialHelperUpi]);

  // Load Cashfree JS SDK
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

  const presets = ['300', '500', '1500', '3000'];

  const handleInitiate = async (e: React.FormEvent) => {
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
          helperUpi,
          familyId,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to initiate payment');

      setOrderData(data);
      setStep('pay');
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmUpiPaid = async () => {
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

  const handleLaunchCashfreeCheckout = () => {
    if (typeof window !== 'undefined' && (window as any).Cashfree && orderData?.paymentSessionId) {
      try {
        const cashfree = (window as any).Cashfree({
          mode: orderData.isProduction ? 'production' : 'sandbox',
        });
        cashfree.checkout({
          paymentSessionId: orderData.paymentSessionId,
          redirectTarget: '_modal',
        }).then(() => {
          handleConfirmUpiPaid();
        });
      } catch (err) {
        console.warn('Cashfree SDK launch fallback to verification:', err);
        handleConfirmUpiPaid();
      }
    } else {
      // Direct completion verification
      handleConfirmUpiPaid();
    }
  };

  const copyUpiId = () => {
    if (orderData?.directUpi?.upiId) {
      navigator.clipboard.writeText(orderData.directUpi.upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-stone-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <div>
            <div className="mb-5">
              <span className="text-[11px] uppercase font-bold text-softly-muted tracking-wider block mb-1">
                Helper Compensation
              </span>
              <h2 className="text-xl font-bold text-stone-800 tracking-tight">
                Pay Helper: {helperName}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Choose direct instant UPI to helper&apos;s bank, or card/netbanking via Cashfree.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-stone-100/80 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct UPI (0% Fee)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cashfree')}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentMethod === 'cashfree'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                <span>Cashfree Gateway</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleInitiate} className="space-y-4">
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
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-lg font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        amount === val
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helper UPI ID field if UPI mode is selected */}
              {paymentMethod === 'upi' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Helper&apos;s UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    required
                    value={helperUpi}
                    onChange={(e) => setHelperUpi(e.target.value)}
                    placeholder="e.g. 9988776655@upi or name@okaxis"
                    className="w-full px-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Direct transfer from your GPay / PhonePe to helper&apos;s bank. Zero intermediary.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Purpose / Note
                </label>
                <input
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  {paymentMethod === 'upi'
                    ? '100% direct bank-to-bank via NPCI UPI protocol.'
                    : 'Powered by Cashfree Payments Gateway (Live Production).'}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-full text-stone-600 text-xs font-medium hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full bg-[#292524] text-white text-xs font-bold hover:bg-stone-800 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>{loading ? 'Setting up...' : `Proceed to Pay ₹${amount}`}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: PAY (UPI OR CASHFREE) */}
        {step === 'pay' && orderData && (
          <div className="text-center py-2 animate-in fade-in">
            {paymentMethod === 'upi' ? (
              /* --- DIRECT UPI VIEW --- */
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">
                  Scan or Pay via UPI App
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Paying ₹{orderData.amount} directly to <strong className="text-stone-800 font-semibold">{helperName}</strong>
                </p>

                {/* QR Code */}
                <div className="inline-block p-3 bg-white border border-stone-200 rounded-2xl shadow-xs mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={orderData.directUpi.qrCodeUrl}
                    alt={`UPI QR Code for ${helperName}`}
                    className="w-44 h-44 mx-auto rounded-lg"
                  />
                  <span className="text-[11px] font-semibold text-stone-700 block mt-2">
                    Scan with any UPI app to pay {helperName}
                  </span>
                </div>

                {/* UPI ID copy */}
                <div className="flex flex-col items-center justify-center gap-1 mb-5">
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                    {helperName}&apos;s UPI ID
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <code className="text-xs px-2.5 py-1 bg-stone-100 rounded-lg text-stone-800 font-mono font-medium">
                      {orderData.directUpi.upiId}
                    </code>
                    <button
                      type="button"
                      onClick={copyUpiId}
                      className="p-1 rounded-md hover:bg-stone-100 text-stone-500 text-xs flex items-center gap-1"
                      title="Copy UPI ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <a
                    href={orderData.directUpi.upiUri}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open UPI App on Phone</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleConfirmUpiPaid}
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{loading ? 'Recording...' : '✓ I Have Sent Payment via UPI'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* --- CASHFREE PRODUCTION GATEWAY VIEW --- */
              <div>
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="text-lg font-bold text-stone-800">
                  Cashfree Gateway Checkout
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  Pay ₹{orderData.amount} securely via Cards, NetBanking, or Wallet
                </p>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs mb-5 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Order ID:</span>
                    <span className="font-mono text-stone-800 font-semibold">{orderData.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Gateway Mode:</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold uppercase">
                      {orderData.isProduction ? 'Live Production' : 'Sandbox Test'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Beneficiary:</span>
                    <span className="font-semibold text-stone-800">{helperName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Amount:</span>
                    <span className="font-bold text-stone-900">₹{orderData.amount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleLaunchCashfreeCheckout}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>{loading ? 'Processing...' : 'Open Cashfree Live Payment →'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-1">
              Payment Confirmed!
            </h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
              ₹{amount} has been successfully recorded for {helperName}. A confirmation has been logged in Supabase.
            </p>

            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-full bg-[#292524] text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Done &amp; Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
