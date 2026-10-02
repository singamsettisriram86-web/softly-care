'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WaitlistSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative py-28 px-4 overflow-hidden bg-gradient-to-b from-[#FDFCF8] via-[#FAF6F0] to-[#F5EFE6]">
      {/* High-blur floating gradients in background */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#FFE4E1] opacity-50 blur-[120px] pointer-events-none animate-float-slow"
      />
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-[#E6E6FA] opacity-50 blur-[120px] pointer-events-none animate-float-reverse"
      />

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Dark stone #292524 rounded-square icon at the top with a coral dot */}
        <div className="w-14 h-14 rounded-2xl bg-[#292524] flex items-center justify-center shadow-soft mb-8">
          <span className="w-3.5 h-3.5 rounded-full bg-softly-coral" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-softly-text mb-4">
          Bring peace to your family rhythm
        </h2>
        <p className="text-softly-muted text-base sm:text-lg mb-10 max-w-md">
          Join hundreds of sons and daughters coordinating care for parents in other cities with tactile simplicity.
        </p>

        {submitted ? (
          <div className="p-6 rounded-3xl bg-white/90 border border-emerald-100 shadow-soft max-w-md w-full text-center">
            <span className="text-2xl mb-2 block">🌿</span>
            <h3 className="font-bold text-stone-800 text-lg mb-1">You’re on the priority list</h3>
            <p className="text-sm text-stone-600 mb-4">
              We’ve reserved your family space. You can launch your interactive Care Hub right now!
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2.5 rounded-full bg-softly-coral text-softly-text font-semibold text-sm shadow-soft hover:bg-[#ffa8a2] transition-colors"
            >
              Open Caregiver Hub →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            {/* Email input (rounded-full, bg-stone-50) */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email..."
              className="flex-1 px-6 py-4 rounded-full bg-stone-50 border border-stone-200/80 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60 shadow-sm text-sm"
            />
            {/* Black submit button that scales up on hover */}
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-[#292524] text-white font-medium text-sm transition-transform duration-300 hover:scale-105 active:scale-95 shadow-soft whitespace-nowrap"
            >
              Get Early Access
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center gap-6 text-xs text-stone-400">
          <span>✓ Works with WhatsApp</span>
          <span>✓ Cashfree payments</span>
          <span>✓ PWA offline support</span>
        </div>
      </div>
    </section>
  );
}
