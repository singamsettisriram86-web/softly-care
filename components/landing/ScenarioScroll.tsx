'use client';

import React, { useRef } from 'react';
import {
  Pill,
  Calendar,
  IndianRupee,
  Moon,
  PhoneCall,
  MessageSquare,
  Search,
  Activity,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Scenario {
  time: string;
  title: string;
  text: string;
  icon: React.ReactNode;
  accentClass: string;
  tagColor: string;
}

const scenarios: Scenario[] = [
  {
    time: '08:00 AM · Morning',
    title: 'Morning Medicine on WhatsApp',
    text: 'Your parents receive a friendly WhatsApp reminder. Once they take their tablets, your phone dashboard updates so you never have to worry during your morning work calls.',
    icon: <Pill className="w-4 h-4 text-amber-700" />,
    accentClass: 'group-hover:border-amber-200',
    tagColor: 'bg-amber-50 text-amber-800 border-amber-200/60',
  },
  {
    time: '09:15 AM · Bedridden Care',
    title: 'Dual WhatsApp Confirmation',
    text: 'If your parent is bedridden, the WhatsApp reminder alert goes to both your parent and helper. Either can reply "DONE" from their phone to immediately log the medicine.',
    icon: <MessageSquare className="w-4 h-4 text-emerald-700" />,
    accentClass: 'group-hover:border-emerald-200',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
  },
  {
    time: '11:30 AM · Clinic Visit',
    title: 'Doctor Visits on Your Calendar',
    text: 'Schedule doctor consultations from your phone. The doctor’s clinic address, time, and medical reports to carry automatically save to your Google Calendar.',
    icon: <Calendar className="w-4 h-4 text-blue-700" />,
    accentClass: 'group-hover:border-blue-200',
    tagColor: 'bg-blue-50 text-blue-800 border-blue-200/60',
  },
  {
    time: '01:30 PM · Helper Network',
    title: 'Find & Hire Verified Helpers',
    text: 'Need someone caring for parents? Browse verified live-in or visiting helpers in your hometown with zero agency fees and contact them directly on WhatsApp.',
    icon: <Search className="w-4 h-4 text-amber-700" />,
    accentClass: 'group-hover:border-amber-200',
    tagColor: 'bg-amber-50 text-amber-800 border-amber-200/60',
  },
  {
    time: '03:15 PM · Local Pharmacy',
    title: 'Local Helper & Quick Payment',
    text: 'A trusted local helper (like your family neighbor or driver) buys fresh medicines. You can send them money directly via Cashfree UPI or card with one tap.',
    icon: <IndianRupee className="w-4 h-4 text-rose-700" />,
    accentClass: 'group-hover:border-rose-200',
    tagColor: 'bg-rose-50 text-rose-800 border-rose-200/60',
  },
  {
    time: '05:30 PM · Daily Vitals',
    title: 'BP & Blood Sugar Health Logs',
    text: 'Track daily blood pressure, pulse, and glucose readings. Spot sudden spikes early and share monthly health trend reports with their consulting doctor.',
    icon: <Activity className="w-4 h-4 text-violet-700" />,
    accentClass: 'group-hover:border-violet-200',
    tagColor: 'bg-violet-50 text-violet-800 border-violet-200/60',
  },
  {
    time: '07:00 PM · Chores Checklist',
    title: '1-Tap Helper PIN Checklist',
    text: 'Your helper opens a lightweight web checklist with a simple 4-digit PIN on their phone—no app download required. Chores, meals, and tasks sync live.',
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
    accentClass: 'group-hover:border-emerald-200',
    tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
  },
  {
    time: '08:30 PM · Bedtime',
    title: 'Night Medicine Confirmation',
    text: 'Your parents take their evening tablets after dinner. The checklist turns green, giving you complete peace of mind before you go to sleep.',
    icon: <Moon className="w-4 h-4 text-indigo-700" />,
    accentClass: 'group-hover:border-indigo-200',
    tagColor: 'bg-indigo-50 text-indigo-800 border-indigo-200/60',
  },
  {
    time: 'Always On · 24/7',
    title: 'Emergency Numbers Ready',
    text: 'Doctor phone numbers, nearest hospital contacts, and your local helper’s phone are saved in one emergency card for instant 1-tap calling.',
    icon: <PhoneCall className="w-4 h-4 text-teal-700" />,
    accentClass: 'group-hover:border-teal-200',
    tagColor: 'bg-teal-50 text-teal-800 border-teal-200/60',
  },
];

export default function ScenarioScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };
  return (
    <section id="how-it-works" className="py-16 sm:py-24 overflow-hidden scroll-mt-20">
      <div id="scenarios" className="scroll-mt-20" />
      <div className="max-w-5xl mx-auto px-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {/* Simple, clear badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-softly-sage/80 border border-stone-200/60 text-xs font-semibold text-stone-700 mb-3">
            <span>📅</span>
            <span>HOW IT WORKS EVERY DAY</span>
          </div>

          {/* Clear headline in simple English */}
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-softly-text">
            A typical day caring for your parents from afar
          </h2>

          {/* Helpful explanation */}
          <p className="mt-2 text-softly-muted text-sm sm:text-base max-w-2xl">
            Everything happens step-by-step so you can focus on your job while knowing your parents take their medicines and visit doctors on time.
          </p>
        </div>

        {/* Desktop Scroll Arrow Controls */}
        <div className="hidden sm:flex items-center gap-2 self-end pb-1">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors shadow-2xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 text-stone-700" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:bg-stone-100 transition-colors shadow-2xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 text-stone-700" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto no-scrollbar px-4 sm:px-8 pb-6 scroll-smooth"
      >
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className={`group flex-shrink-0 w-[300px] sm:w-[320px] min-h-[190px] bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-floating ${scenario.accentClass}`}
          >
            <div>
              {/* Top tag & icon */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${scenario.tagColor}`}
                >
                  {scenario.time}
                </span>
                <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                  {scenario.icon}
                </div>
              </div>

              {/* Bold Title */}
              <h3 className="text-base font-bold text-stone-800 tracking-tight mb-2">
                {scenario.title}
              </h3>

              {/* Plain English, detailed description */}
              <p className="text-xs text-softly-muted leading-relaxed">
                {scenario.text}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
              <span>Automatic sync</span>
              <span className="group-hover:translate-x-1 transition-transform text-stone-600">
                Learn more →
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
