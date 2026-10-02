'use client';

import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
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
            A digital living room for cross-city care
          </span>
        </div>

        {/* 72px Headline with Cursive Accent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-softly-text leading-[1.08] mb-6">
          Caring for parents from afar,{' '}
          <span className="font-cursive text-5xl sm:text-7xl md:text-8xl font-normal text-stone-700 block sm:inline">
            gently.
          </span>
        </h1>

        {/* Sub-headline max-width 500px */}
        <p className="max-w-[500px] text-base sm:text-lg text-softly-muted leading-relaxed mb-10 font-normal">
          A calm coordination space for sole earners. Medication rhythms, doctor appointments,
          WhatsApp alerts, and trusted local helpers—without the panic.
        </p>

        {/* Dual CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-medium text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>Launch Care Hub</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </Link>
          <Link
            href="/helper"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-softly-text font-medium text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center"
          >
            Helper Access Portal
          </Link>
        </div>
      </div>
    </section>
  );
}
