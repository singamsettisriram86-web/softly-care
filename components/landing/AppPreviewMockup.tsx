'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Bell, Calendar, CheckCircle2, ShieldCheck, IndianRupee } from 'lucide-react';

export default function AppPreviewMockup() {
  return (
    <section id="preview" className="py-20 px-4 overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-softly-muted font-semibold mb-2">
          Experience Preview
        </h2>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-softly-text">
          Designed like a warm, tactile living room
        </p>
        <p className="mt-3 text-softly-muted text-base max-w-md mx-auto">
          Deliberately slow, reassuringly clear, and readable on every phone screen.
        </p>
      </div>

      {/* 3-Mockup Stacked Cascading Layout */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-8 max-w-6xl mx-auto pb-8">
        {/* Left Phone: 280x580px, 80% opacity, translated vertically +48px, Sage background */}
        <div
          className="w-[280px] h-[580px] bg-softly-sage rounded-[44px] p-4 border-[6px] border-white shadow-floating opacity-90 md:opacity-80 md:translate-y-[48px] flex flex-col transition-transform duration-500 hover:opacity-100 hover:scale-[1.02]"
        >
          {/* Phone Speaker Notch */}
          <div className="w-24 h-4 bg-stone-300/40 rounded-full mx-auto mb-4" />

          {/* Screen Content: Helper Checklist */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold uppercase text-stone-600 tracking-wider">
                  Helper Checklist
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/70 font-medium text-stone-700">
                  Jaipur Local
                </span>
              </div>
              <h3 className="font-bold text-lg text-stone-800 mb-1">Ramesh Kumar</h3>
              <p className="text-xs text-stone-500 mb-4">Assigned tasks for today</p>

              <div className="space-y-2.5">
                <div className="bg-white/80 rounded-2xl p-3 shadow-sm border border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700">Apollo Meds Pick-up</span>
                    <span className="text-amber-700 font-semibold">Pending</span>
                  </div>
                  <p className="text-[11px] text-stone-500">Collect 2 strips Metformin</p>
                </div>
                <div className="bg-white/90 rounded-2xl p-3 shadow-sm border border-emerald-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-stone-800">Morning Tablets</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 inline" /> Given
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">Given with breakfast at 08:30 AM</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/60 rounded-2xl text-center">
              <span className="text-xs font-medium text-stone-600">Local helper sync active</span>
            </div>
          </div>
        </div>

        {/* Center Phone: 300x620px, fully opaque, pulsing Coral button */}
        <div
          className="w-[300px] h-[620px] bg-white rounded-[48px] p-5 border-[8px] border-stone-800 shadow-2xl relative z-20 flex flex-col justify-between"
        >
          {/* Phone Dynamic Island / Camera */}
          <div>
            <div className="w-28 h-5 bg-stone-800 rounded-full mx-auto mb-6 flex items-center justify-end px-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            {/* Caregiver Main Dashboard Screen */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-softly-muted tracking-wider">
                    Parent Sanctuary
                  </span>
                  <h3 className="text-xl font-bold text-softly-text">Sharma Family</h3>
                </div>
                <div className="w-9 h-9 rounded-full bg-softly-coral/40 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-stone-800" />
                </div>
              </div>

              {/* Status Pill */}
              <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-800">All morning tablets taken</p>
                  <p className="text-[10px] text-stone-500">Last confirmed 8:30 AM via WhatsApp</p>
                </div>
              </div>

              {/* Next upcoming appointment */}
              <div className="bg-softly-lavender/60 border border-stone-200/50 rounded-2xl p-3">
                <span className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider block mb-0.5">
                  Next Clinic Visit
                </span>
                <p className="text-xs font-bold text-stone-800">Dr. Ashok Mehta (Cardio)</p>
                <p className="text-[10px] text-stone-500">Thursday, 11:30 AM · Apex Hospital</p>
              </div>
            </div>
          </div>

          {/* Pulsing Coral 'Breathe' / Check-in Button */}
          <div className="space-y-3 pt-4">
            <Link
              href="/dashboard"
              className="w-full py-3.5 rounded-full bg-softly-coral text-softly-text font-semibold text-sm shadow-soft animate-pulse-gentle flex items-center justify-center gap-2 hover:bg-[#ffa8a2] transition-colors"
            >
              <span>🌿 Take a Deep Breath</span>
            </Link>
            <p className="text-center text-[10px] text-stone-400">
              Tap to enter Caregiver Command Center
            </p>
          </div>
        </div>

        {/* Right Phone: 280x580px, 80% opacity, translated vertically +96px, Lavender background */}
        <div
          className="w-[280px] h-[580px] bg-softly-lavender rounded-[44px] p-4 border-[6px] border-white shadow-floating opacity-90 md:opacity-80 md:translate-y-[96px] flex flex-col justify-between transition-transform duration-500 hover:opacity-100 hover:scale-[1.02]"
        >
          {/* Phone Speaker Notch */}
          <div>
            <div className="w-24 h-4 bg-stone-300/40 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase text-stone-600 tracking-wider">
                WhatsApp Live Loop
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/70 font-medium text-stone-700">
                Two-way
              </span>
            </div>

            <div className="space-y-3">
              <div className="bg-white/90 rounded-2xl rounded-tl-sm p-3 shadow-sm border border-stone-100 text-xs">
                <span className="text-[10px] text-stone-400 block mb-0.5">Care Coordinator · 08:00 AM</span>
                <p className="text-stone-800">
                  💊 Reminder: Time for <strong>Metformin (500mg)</strong>. Reply <em>DONE</em> once taken.
                </p>
              </div>

              <div className="bg-emerald-100/90 rounded-2xl rounded-tr-sm p-3 shadow-sm ml-auto max-w-[200px] text-xs">
                <span className="text-[10px] text-stone-500 block mb-0.5">Dad’s Phone · 08:30 AM</span>
                <p className="font-semibold text-emerald-900">DONE</p>
              </div>

              <div className="bg-white/80 rounded-2xl p-2.5 flex items-center gap-2 text-[11px] text-stone-600">
                <Bell className="w-3.5 h-3.5 text-stone-400" />
                <span>Dashboard status auto-updated to Taken</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-white/60 rounded-2xl text-center">
            <span className="text-xs font-medium text-stone-600">No new app for parents to learn</span>
          </div>
        </div>
      </div>
    </section>
  );
}
