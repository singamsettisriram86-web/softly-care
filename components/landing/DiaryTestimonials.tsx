'use client';

import React from 'react';

interface DiaryEntry {
  title: string;
  excerpt: string;
  signature: string;
  rotationClass: string;
}

const entries: DiaryEntry[] = [
  {
    title: 'October 12th · Thursday in Indiranagar',
    excerpt:
      'I used to call Dad four times a morning while rushing into engineering standups. Half the time he would forget if he took his BP pill or if Mom had already given it. Now Ramesh checks in at 8:30 AM, taps one button, and my dashboard turns green before my morning coffee is done.',
    signature: 'Aditya, Software Lead (Bangalore to Jaipur)',
    rotationClass: '-rotate-1',
  },
  {
    title: 'September 28th · Sunday Reflections',
    excerpt:
      'My parents refused to install any new app on their phones—they always forgot their passwords. With Softly, they get their reminders directly on WhatsApp where they already chat with family. And when Dr. Verma requested ECG reports, I sent them straight to Ramesh to print.',
    signature: 'Pooja, Product Designer (Pune to Lucknow)',
    rotationClass: 'rotate-1',
  },
];

export default function DiaryTestimonials() {
  return (
    <section id="diary" className="py-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="text-xs uppercase tracking-widest text-softly-muted font-semibold mb-2">
          From the Digital Living Room
        </h2>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-softly-text">
          Letters from sons & daughters across cities
        </p>
      </div>

      {/* Two-column grid for desktop, single for mobile. Cards have ±1 deg rotation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-8 border border-stone-200/70 shadow-soft transition-all duration-300 hover:rotate-0 hover:shadow-floating ${entry.rotationClass}`}
          >
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider block mb-3">
              {entry.title}
            </span>
            <p className="text-base text-stone-700 leading-relaxed font-normal mb-8">
              &ldquo;{entry.excerpt}&rdquo;
            </p>

            {/* Signature style: 32px horizontal line followed by Reenie Beanie cursive text in 24px stone-500 */}
            <div className="flex items-center gap-3">
              <div className="w-[32px] h-[1px] bg-stone-300" />
              <span className="font-cursive text-[24px] text-stone-500 leading-none">
                {entry.signature}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
