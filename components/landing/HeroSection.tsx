'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import RegisterFamilyModal from '@/components/RegisterFamilyModal';
import { UserPlus, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <>
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 px-4 flex flex-col items-center text-center overflow-hidden">
        {/* Ambient Blurred Floating Background Blobs */}
        <div
          aria-hidden="true"
          className="absolute top-12 left-1/2 -translate-x-3/4 w-[380px] sm:w-[480px] h-[380px] sm:h-[480px] rounded-full bg-[#FFE4E1] opacity-60 blur-[100px] pointer-events-none animate-float-slow"
        />
        <div
          aria-hidden="true"
          className="absolute top-24 left-1/2 translate-x-1/6 w-[360px] sm:w-[460px] h-[360px] sm:h-[460px] rounded-full bg-[#E6E6FA] opacity-60 blur-[100px] pointer-events-none animate-float-reverse"
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Subtle Pill Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-stone-200/80 shadow-soft mb-6">
            <span className="w-2 h-2 rounded-full bg-softly-coral animate-ping" />
            <span className="text-xs sm:text-sm font-medium text-stone-600">
              Made for sons & daughters living in another city
            </span>
          </div>

          {/* 72px Headline with Cursive Accent */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-softly-text leading-[1.08] mb-6">
            Caring for parents from afar,{' '}
            <span className="font-cursive text-5xl sm:text-7xl md:text-8xl font-normal text-stone-700 block sm:inline">
              gently.
            </span>
          </h1>

          {/* Sub-headline in simple English */}
          <p className="max-w-[540px] text-base sm:text-lg text-softly-muted leading-relaxed mb-10 font-normal">
            Track your parents’ daily blood pressure & diabetes medicines, doctor appointments,
            and local helper support—all from your phone with WhatsApp alerts.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
            {/* 1. Register Your Family Space (Primary) */}
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <UserPlus className="w-4 h-4 text-stone-800" />
              <span>Register Your Family Space</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>

            {/* 2. Try Demo Hub */}
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-semibold text-sm sm:text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>Explore Demo Space</span>
            </Link>

            {/* 3. Helper Access */}
            <Link
              href="/helper"
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 underline px-3 py-2 transition-colors"
            >
              Helper PIN Access
            </Link>
          </div>
        </div>
      </section>

      <RegisterFamilyModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
}
