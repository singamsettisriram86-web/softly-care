'use client';

import React from 'react';
import Link from 'next/link';

export default function FloatingNav() {
  return (
    <header className="fixed top-4 left-0 right-0 z-40 flex justify-center px-4">
      <nav
        aria-label="Main Navigation"
        className="w-[calc(100%-32px)] max-w-4xl h-14 bg-white/70 backdrop-blur-[20px] border border-stone-200/60 rounded-full px-4 sm:px-6 flex items-center justify-between shadow-soft transition-all duration-300"
      >
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-full bg-softly-coral flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-softly-text">
            Softly
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-softly-sage text-stone-700 font-medium hidden sm:inline-block">
            Care Coordinator
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-stone-600">
          <Link href="#scenarios" className="hover:text-softly-text transition-colors">
            How It Works
          </Link>
          <Link href="#preview" className="hover:text-softly-text transition-colors">
            Experience
          </Link>
          <Link href="#diary" className="hover:text-softly-text transition-colors">
            Notes
          </Link>
          <Link href="#faq" className="hover:text-softly-text transition-colors">
            FAQ
          </Link>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/helper"
            className="text-[13px] font-medium text-stone-600 hover:text-softly-text px-2 py-1 transition-colors hidden sm:block"
          >
            Helper PIN
          </Link>
          <Link
            href="/dashboard"
            className="bg-softly-text text-white hover:bg-stone-700 active:scale-95 text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-2 rounded-full transition-all duration-200 shadow-sm"
          >
            Launch Care Hub
          </Link>
        </div>
      </nav>
    </header>
  );
}
