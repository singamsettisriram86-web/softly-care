'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus, ArrowRight, LayoutDashboard } from 'lucide-react';

type HeroState = 'loading' | 'guest' | 'no-family' | 'has-family';

export default function HeroSection() {
  const [heroState, setHeroState] = useState<HeroState>('loading');
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyName, setFamilyName] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        // Step 1: Check if logged in
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();

        if (!meData.authenticated) {
          setHeroState('guest');
          return;
        }

        // Step 2: Check if user already has a registered family
        const famRes = await fetch('/api/families?check=mine');
        const famData = await famRes.json();

        if (famData.hasFamily && famData.family) {
          setFamilyId(famData.family.id);
          setFamilyName(famData.family.name || 'Your Family');
          setHeroState('has-family');
        } else {
          setHeroState('no-family');
        }
      } catch {
        setHeroState('guest');
      }
    })();
  }, []);

  const dashboardHref = familyId ? `/dashboard?familyId=${familyId}` : '/dashboard';

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
            Made for sons &amp; daughters living in another city
          </span>
        </div>

        {/* 72px Headline with Cursive Accent */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-softly-text leading-[1.08] mb-6">
          Caring for parents from afar,{' '}
          <span className="font-cursive text-5xl sm:text-7xl md:text-8xl font-normal text-stone-700 block sm:inline">
            gently.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="max-w-[540px] text-base sm:text-lg text-softly-muted leading-relaxed mb-10 font-normal">
          Track your parents' daily blood pressure &amp; diabetes medicines, doctor appointments,
          and local helper support — all from your phone with WhatsApp alerts.
        </p>

        {/* Action Buttons — smart based on auth + family state */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">

          {heroState === 'loading' && (
            <div className="w-56 h-12 rounded-full bg-stone-100 animate-pulse" />
          )}

          {/* CASE 1: User already has a registered family */}
          {heroState === 'has-family' && (
            <>
              <Link
                href={dashboardHref}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <LayoutDashboard className="w-4 h-4 text-stone-800" />
                <span>Go to Your Family Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <span className="text-xs text-stone-400 font-medium">
                {familyName} is all set 🌿
              </span>
            </>
          )}

          {/* CASE 2: Logged in but no family yet */}
          {heroState === 'no-family' && (
            <>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <UserPlus className="w-4 h-4 text-stone-800" />
                <span>Register Your Family Space</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-semibold text-sm sm:text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>Explore Demo Space</span>
              </Link>
            </>
          )}

          {/* CASE 3: Not logged in (guest) */}
          {heroState === 'guest' && (
            <>
              <Link
                href="/login?next=/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <UserPlus className="w-4 h-4 text-stone-800" />
                <span>Register Your Family Space</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-semibold text-sm sm:text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span>Explore Demo Space</span>
              </Link>
            </>
          )}

          {/* Helper PIN link — always visible */}
          {heroState !== 'loading' && (
            <Link
              href="/helper"
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 underline px-3 py-2 transition-colors"
            >
              Helper PIN Access
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
