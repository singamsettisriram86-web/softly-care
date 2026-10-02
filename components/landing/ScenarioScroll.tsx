'use client';

import React from 'react';

interface Scenario {
  time: string;
  text: string;
  accentClass: string;
}

const scenarios: Scenario[] = [
  {
    time: '08:00 AM · Bangalore to Jaipur',
    text: 'Metformin reminder sent to Dad’s WhatsApp. Helper Ramesh taps confirmed.',
    accentClass: 'group-hover:text-amber-700',
  },
  {
    time: '11:30 AM · Clinic Visit',
    text: 'Dr. Mehta’s cardiology consultation syncs automatically to Google Calendar.',
    accentClass: 'group-hover:text-emerald-700',
  },
  {
    time: '03:15 PM · Hometown Pharmacy',
    text: 'Ramesh picks up blood pressure refills. Instant ₹500 stipend via Cashfree.',
    accentClass: 'group-hover:text-rose-700',
  },
  {
    time: '08:30 PM · Evening Routine',
    text: 'Savitri’s evening calcium logged. Peace of mind before going to sleep.',
    accentClass: 'group-hover:text-indigo-700',
  },
  {
    time: 'Emergency Ready',
    text: 'Local helper phone and neighborhood doctor contacts one tap away.',
    accentClass: 'group-hover:text-teal-700',
  },
];

export default function ScenarioScroll() {
  return (
    <section id="scenarios" className="py-14 sm:py-20 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 mb-8 text-center sm:text-left">
        <h2 className="text-xs uppercase tracking-widest text-softly-muted font-semibold mb-2">
          Daily Living Room Rhythm
        </h2>
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-softly-text">
          How cross-city care breathes throughout the day
        </p>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="flex gap-5 overflow-x-auto no-scrollbar px-4 sm:px-8 pb-4 scroll-smooth">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className="group flex-shrink-0 w-[288px] h-[160px] bg-white rounded-3xl p-5 border border-stone-100 shadow-soft flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-floating"
          >
            {/* Top-left timestamp in 14px stone-400 */}
            <span className="text-[14px] text-stone-400 font-medium tracking-tight">
              {scenario.time}
            </span>

            {/* Bottom text in 20px stone-800, hover color shifts to pastel accent */}
            <p
              className={`text-[19px] leading-tight font-medium text-stone-800 transition-colors duration-200 ${scenario.accentClass}`}
            >
              {scenario.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
