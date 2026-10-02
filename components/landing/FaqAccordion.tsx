'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Do my aging parents need to install or learn an app?',
    answer:
      'No. Parents only receive simple, friendly reminders on WhatsApp, exactly where they already chat with family. They simply read the medicine reminder and reply "DONE" to confirm.',
  },
  {
    question: 'How does the local helper use the system?',
    answer:
      'Your trusted neighbor, driver, or caregiver assistant opens a clean, mobile checklist via a direct PIN link on their phone. They can check off morning medicines, view doctor clinic timings, and confirm completed tasks with one tap.',
  },
  {
    question: 'How do helper payments work with Cashfree?',
    answer:
      'You can pay your local helper directly from your dashboard using Cashfree. You enter the stipend or errand fee in INR (₹) and initiate a secure payment session via UPI, debit card, or net banking.',
  },
  {
    question: 'Does Softly work if mobile internet connection is poor?',
    answer:
      'Yes! Softly is a Progressive Web App (PWA). It caches critical medicine schedules and clinic addresses directly onto the device, so you or your helper can open the dashboard even in hospital basements or intermittent network areas.',
  },
  {
    question: 'Can I add multiple doctors and family members?',
    answer:
      'Yes. You can manage multiple family members (both mother and father), schedule appointments with various medical specialists, and coordinate with multiple trusted local helpers under one family space.',
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-xs uppercase tracking-widest text-softly-muted font-semibold mb-2">
          Clear Answers
        </h2>
        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-softly-text">
          Frequently asked questions
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-[16px] border border-stone-100 shadow-soft overflow-hidden transition-all duration-300"
            >
              {/* Header: 24px padding, 500 weight text, 'plus' icon that rotates 45 degrees */}
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-lg text-stone-800 hover:text-stone-950 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <span
                  className={`w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 transition-transform duration-500 ease-in-out ${
                    isOpen ? 'rotate-45 bg-softly-coral/30' : 'rotate-0'
                  }`}
                >
                  <Plus className="w-4 h-4 text-stone-700" />
                </span>
              </button>

              {/* Content: Transition height and reveal text with bottom padding 24px */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6 pt-0 text-softly-muted text-sm sm:text-base leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
