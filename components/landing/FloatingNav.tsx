'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Home,
  Car,
  Stethoscope,
  Brain,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function FloatingNav() {
  const [jobsMenuOpen, setJobsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const jobsRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (jobsRef.current && !jobsRef.current.contains(e.target as Node)) {
        setJobsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Mobile Drawer Dimmed Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <header
        className={`fixed top-4 left-0 right-0 flex justify-center px-4 transition-all duration-200 ${
          mobileMenuOpen ? 'z-50' : 'z-40'
        }`}
      >
        <nav
          aria-label="Main Navigation"
          className="w-[calc(100%-32px)] max-w-5xl h-14 bg-white/95 backdrop-blur-[20px] border border-stone-200/90 rounded-full px-4 sm:px-6 flex items-center justify-between shadow-soft transition-all duration-300 relative z-50"
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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-[14px] font-medium text-stone-600">
            <Link
              href="/helpers/browse"
              className="text-stone-900 hover:text-softly-coral font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>Find a Helper</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">
                Marketplace
              </span>
            </Link>

            {/* Helper Jobs Dropdown */}
            <div
              ref={jobsRef}
              className="relative"
              onMouseEnter={() => setJobsMenuOpen(true)}
              onMouseLeave={() => setJobsMenuOpen(false)}
            >
              <Link
                href="/helpers/jobs"
                onClick={() => setJobsMenuOpen(false)}
                className="hover:text-softly-text transition-colors flex items-center gap-1 py-2 font-medium"
              >
                <span>Helper Jobs</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    jobsMenuOpen ? 'rotate-180 text-stone-900' : 'text-stone-400'
                  }`}
                />
              </Link>

              {/* Types of Jobs Dropdown Menu */}
              {jobsMenuOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/90 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100 mb-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Types of Caregiver Jobs in India
                    </p>
                    <p className="text-xs font-semibold text-stone-800">
                      Zero agency fee · Direct family payouts
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/helpers/jobs"
                      onClick={() => setJobsMenuOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Home className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-emerald-800">
                            Live-in Caregiver (24×7)
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">Stays with parents · ₹16k–₹25k/mo</p>
                      </div>
                    </Link>

                    <Link
                      href="/helpers/jobs"
                      onClick={() => setJobsMenuOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Car className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-blue-800">
                            Visiting Attendant (Day Shift)
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">4-8 hr shifts · ₹8k–₹15k/mo</p>
                      </div>
                    </Link>

                    <Link
                      href="/helpers/jobs"
                      onClick={() => setJobsMenuOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Stethoscope className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-rose-800">
                            Post-Surgery &amp; Bedridden
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">Catheter, vitals, therapy · ₹18k–₹28k</p>
                      </div>
                    </Link>

                    <Link
                      href="/helpers/jobs"
                      onClick={() => setJobsMenuOpen(false)}
                      className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-stone-50 transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <Brain className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-900 group-hover:text-purple-800">
                            Dementia &amp; Memory Care
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">Patience &amp; safety · ₹15k–₹22k/mo</p>
                      </div>
                    </Link>
                  </div>

                  <div className="pt-2 mt-1.5 border-t border-stone-100 flex items-center justify-between px-1">
                    <Link
                      href="/helpers/register"
                      onClick={() => setJobsMenuOpen(false)}
                      className="text-[11px] font-bold text-stone-900 hover:text-softly-coral flex items-center gap-1"
                    >
                      <span>+ Register as Helper</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/helpers/profile"
                      onClick={() => setJobsMenuOpen(false)}
                      className="text-[11px] font-semibold text-stone-500 hover:text-stone-800"
                    >
                      Caregiver Portal
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/#how-it-works" className="hover:text-softly-text transition-colors">
              How It Works
            </Link>
            <Link href="/#faq" className="hover:text-softly-text transition-colors">
              FAQ
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <ProfileDropdown variant="nav" />

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 active:scale-95 flex items-center justify-center text-stone-700 transition-all"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl border border-stone-200/90 shadow-2xl p-3.5 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <Link
                href="/helpers/browse"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-900 transition-colors"
              >
                <span>🔍 Find an Elder Caregiver</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  Marketplace
                </span>
              </Link>

              <Link
                href="/helpers/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-900 transition-colors"
              >
                <span>🩺 Helper Jobs &amp; Roles</span>
                <span className="text-[10px] text-stone-500 font-medium">4 Types</span>
              </Link>

              <Link
                href="/helpers/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#FFB7B2]/30 hover:bg-[#FFB7B2]/50 text-xs font-bold text-stone-900 transition-colors"
              >
                <span>📝 Register as a Helper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/helpers/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-stone-50 hover:bg-stone-100 text-xs font-bold text-stone-900 transition-colors"
              >
                <span>👤 Caregiver Portal &amp; Profile</span>
                <span className="text-[10px] text-stone-400">Portal</span>
              </Link>

              <div className="pt-2 border-t border-stone-100 space-y-1">
                <Link
                  href="/#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>How It Works</span>
                </Link>

                <Link
                  href="/#faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-stone-400" />
                  <span>FAQ</span>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
