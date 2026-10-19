'use client';

import React from 'react';
import Link from 'next/link';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function FloatingNav() {
  return (
    <>
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4">
        <nav
          aria-label="Main Navigation"
          className="w-[calc(100%-32px)] max-w-4xl h-14 bg-white/70 backdrop-blur-[20px] border border-stone-200/60 rounded-full px-4 sm:px-6 flex items-center justify-between shadow-soft transition-all duration-300"
        >
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Softly Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-xs transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-semibold text-lg tracking-tight text-softly-text">
              Softly
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-softly-sage text-stone-700 font-medium hidden sm:inline-block">
              Care Coordinator
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-5 text-[14px] font-medium text-stone-600">
            <Link
              href="/helpers/browse"
              className="text-stone-900 hover:text-softly-coral font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Find a Helper</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                Marketplace
              </span>
            </Link>
            <Link
              href="/helpers/register"
              className="hover:text-softly-text transition-colors"
            >
              Helper Jobs
            </Link>
            <Link href="#scenarios" className="hover:text-softly-text transition-colors">
              How It Works
            </Link>
            <Link href="#faq" className="hover:text-softly-text transition-colors">
              FAQ
            </Link>
          </div>

          {/* Action CTAs */}
          <ProfileDropdown variant="nav" />
        </nav>
      </header>
    </>
  );
}
