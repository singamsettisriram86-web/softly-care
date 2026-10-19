'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus, ArrowRight, LayoutDashboard, Search, Briefcase } from 'lucide-react';

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
        {/* Action Buttons — smart based on auth + family state */}
        <div className="flex flex-col items-center gap-4 w-full">
          {heroState === 'loading' && (
            <div className="w-56 h-12 rounded-full bg-stone-100 animate-pulse" />
          )}

          {/* CASE 1: User already has a registered family */}
          {heroState === 'has-family' && (
            <div className="flex flex-col items-center gap-3.5 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <Link
                  href={dashboardHref}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <LayoutDashboard className="w-4 h-4 text-stone-800" />
                  <span>Go to Your Family Dashboard</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/helpers/browse"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-bold text-sm sm:text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4 text-stone-700" />
                  <span>Find a Helper</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                    Marketplace
                  </span>
                </Link>
                <Link
                  href="/helpers/jobs"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#E8EFE8] hover:bg-[#d8e5d8] active:scale-98 text-stone-900 font-bold text-sm sm:text-base border border-[#C5D8C5] shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Briefcase className="w-4 h-4 text-emerald-800" />
                  <span>Helper Jobs</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <span className="text-xs text-stone-400 font-medium">
                {familyName} is all set 🌿
              </span>
            </div>
          )}

          {/* CASE 2: Logged in but no family yet */}
          {heroState === 'no-family' && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <UserPlus className="w-4 h-4 text-stone-800" />
                  <span>Register Your Family Space</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/helpers/browse"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-bold text-sm sm:text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4 text-stone-700" />
                  <span>Find a Helper</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                    Marketplace
                  </span>
                </Link>
                <Link
                  href="/helpers/jobs"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#E8EFE8] hover:bg-[#d8e5d8] active:scale-98 text-stone-900 font-bold text-sm sm:text-base border border-[#C5D8C5] shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Briefcase className="w-4 h-4 text-emerald-800" />
                  <span>Helper Jobs</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-500 pt-1">
                <Link href="/dashboard" className="hover:text-stone-900 underline transition-colors">
                  Explore Demo Space
                </Link>
                <span>•</span>
                <Link href="/helper" className="hover:text-stone-900 underline transition-colors">
                  Helper PIN Access
                </Link>
              </div>
            </div>
          )}

          {/* CASE 3: Not logged in (guest) */}
          {heroState === 'guest' && (
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                <Link
                  href="/login?next=/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-sm sm:text-base shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <UserPlus className="w-4 h-4 text-stone-800" />
                  <span>Register Your Family Space</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/helpers/browse"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 active:scale-98 text-stone-800 font-bold text-sm sm:text-base border border-stone-200 shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Search className="w-4 h-4 text-stone-700" />
                  <span>Find a Helper</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                    Marketplace
                  </span>
                </Link>
                <Link
                  href="/helpers/jobs"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#E8EFE8] hover:bg-[#d8e5d8] active:scale-98 text-stone-900 font-bold text-sm sm:text-base border border-[#C5D8C5] shadow-soft transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <Briefcase className="w-4 h-4 text-emerald-800" />
                  <span>Helper Jobs</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-stone-500 pt-1">
                <Link href="/dashboard" className="hover:text-stone-900 underline transition-colors">
                  Explore Demo Space
                </Link>
                <span>•</span>
                <Link href="/helper" className="hover:text-stone-900 underline transition-colors">
                  Helper PIN Access
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Marketplace 2-World Discovery Banner */}
        <div className="mt-12 w-full max-w-2xl bg-white/85 backdrop-blur-md border border-stone-200/90 rounded-3xl p-5 sm:p-6 shadow-soft text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-stone-100 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight">
                  Softly Caregiver Marketplace
                </h3>
                <p className="text-[11px] sm:text-xs text-stone-500">
                  India's direct network connecting elderly caregivers &amp; families
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              0% Commission · Direct WhatsApp
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* World 1: For Families */}
            <Link
              href="/helpers/browse"
              className="group p-5 rounded-3xl bg-white/90 hover:bg-[#FFF5F4] border border-stone-200/90 hover:border-softly-coral/60 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-soft"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="text-lg">🏡</span> Looking for a Caregiver?
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    50+ Cities
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Find verified live-in &amp; visiting helpers for bedridden care, dementia, mobility &amp; vitals in Amalapuram, Hyderabad, Bangalore &amp; more.
                </p>
              </div>

              {/* Big Pill Button Styled Similar to Register Family */}
              <div className="w-full py-3 sm:py-3.5 px-5 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text font-bold text-xs sm:text-sm shadow-soft transition-all duration-200 flex items-center justify-center gap-2 mt-2 group-hover:shadow-md">
                <Search className="w-4 h-4 text-stone-800" />
                <span>Browse Verified Helpers</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>

            {/* World 2: For Helpers */}
            <Link
              href="/helpers/register"
              className="group p-5 rounded-3xl bg-white/90 hover:bg-[#F2F8F5] border border-stone-200/90 hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-soft"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <span className="text-lg">🩺</span> Looking for Caregiver Jobs?
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    0% Fee
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Create your profile in 2 mins. Set your daily/monthly pay, service cities, and receive direct calls &amp; WhatsApp chats from seekers.
                </p>
              </div>

              {/* Big Pill Button Styled Similar to Register Family */}
              <div className="w-full py-3 sm:py-3.5 px-5 rounded-full bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-soft transition-all duration-200 flex items-center justify-center gap-2 mt-2 group-hover:shadow-md">
                <Briefcase className="w-4 h-4 text-white" />
                <span>Register as a Helper</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
