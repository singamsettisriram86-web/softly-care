'use client';

import React, { useState } from 'react';
import { X, Phone, MessageSquare, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { HelperMarketplaceProfile } from '@/lib/types';

interface Props {
  isOpen: boolean;
  helper: HelperMarketplaceProfile | null;
  onClose: () => void;
}

export default function ConnectLeadModal({ isOpen, helper, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !helper) return null;

  const handleClose = () => {
    setIsUnlocked(false);
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/marketplace/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          helper_id: helper.id,
          seeker_name: name.trim(),
          seeker_phone: phone.trim(),
          seeker_city: city.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit inquiry');

      setIsUnlocked(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const cleanPhone = helper.phone.replace(/[^\d]/g, '').slice(-10);
  const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `Hello ${helper.name}, I found your caregiver profile on Softly Care and I would like to discuss elderly care assistance.`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-stone-200 shadow-2xl relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {!isUnlocked ? (
          <div>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-bold text-emerald-800 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>VERIFIED CAREGIVER DIRECT CONTACT</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900">
                Connect with {helper.name}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter your contact info so {helper.name} knows which family is reaching out. You will instantly get direct phone and WhatsApp buttons.
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sriram Singamsetti"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Mobile Number (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 94412 30144"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  City / Location Where Care is Needed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, Amalapuram, Bangalore"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/70 focus:border-transparent"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: '#FFB7B2', color: '#292524' }}
                >
                  <span>{loading ? 'Unlocking Contact...' : 'Unlock Contact & Call Now'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[10px] text-stone-400 text-center mt-2">
                  🔒 Zero spam guarantee. Your details are only shared with {helper.name}.
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-2 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Contact Unlocked for {helper.name}!
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                You can now call directly or chat with {helper.name} on WhatsApp.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 text-left space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Phone Number:</span>
                <span className="font-bold text-stone-900 font-mono">+91 {cleanPhone}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Availability:</span>
                <span className="font-bold text-emerald-700">{helper.availability_note || 'Available immediately'}</span>
              </div>
              {helper.upi_id && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500">UPI ID:</span>
                  <span className="font-semibold text-stone-700 font-mono">{helper.upi_id}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                href={`tel:+91${cleanPhone}`}
                className="py-3 px-4 rounded-2xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-stone-800 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Now</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="text-xs font-semibold text-stone-400 hover:text-stone-600 pt-1"
            >
              Done / Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
