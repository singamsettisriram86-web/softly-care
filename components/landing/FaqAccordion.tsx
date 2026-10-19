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
    question: 'What types of Caregiver Jobs can helpers register for on Softly?',
    answer:
      'Softly supports all major elderly care job types across Indian cities: 1) Live-in 24x7 Caregivers (stays with parents, handles night care and meals, avg ₹16,000–₹25,000/mo), 2) Visiting Daily Attendants (4–8 hr day shifts for bath, mobility, clinic visits, avg ₹8,000–₹15,000/mo or ₹400–₹700/day), 3) Post-Surgery & Bedridden Care (catheter care, diapers, sterile wound cleaning, avg ₹18,000–₹28,000/mo), and 4) Dementia & Memory Care Companions (specialized communication and safety monitoring, avg ₹15,000–₹22,000/mo).',
  },
  {
    question: 'Does Softly charge an agency fee or commission from helpers?',
    answer:
      'No, 0% commission! Unlike traditional nursing bureaus that take 30% to 50% cuts from the helper’s hard-earned salary, Softly is a direct connection network. Families pay the helper directly via UPI, cash, or bank transfer with zero middleman deductions.',
  },
  {
    question: 'How does the Helper Marketplace work for families seeking care?',
    answer:
      'Families can browse verified caregivers filtered by city (e.g. Amalapuram, Hyderabad, Bangalore, Jaipur), living arrangement (Live-in vs Visiting), and specialized medical skills (bedridden care, vitals, dementia, diabetic cooking). After a quick name and phone check, you unlock the caregiver’s direct phone number and WhatsApp chat link.',
  },
  {
    question: 'How does dual WhatsApp confirmation work for bedridden parents and helpers?',
    answer:
      'If your parent is bedridden or unwell, the scheduled WhatsApp medication reminder is delivered to both your parent and the local helper. Either of them can reply "DONE" from their own phone, which immediately updates your family dashboard so you always have verified peace of mind.',
  },
  {
    question: 'How do helper job seekers find clients after registering?',
    answer:
      'Once registered on /helpers/register, your profile is listed in your base city and selected service cities. Whenever a family unlocks your profile, you receive an instant WhatsApp alert with the family’s name and phone number so you can connect and finalize terms immediately.',
  },
  {
    question: 'Can helpers manage their live availability status?',
    answer:
      'Yes. Through the Caregiver Work Portal (/helpers/profile), helpers can switch between "🟢 Available Now" and "🔴 Employed / Off-market" with one click. When you take a full-time job, you can hide your listing, and toggle it back on when looking for your next family.',
  },
  {
    question: 'How do helper payments work with Cashfree and UPI?',
    answer:
      'You can pay your local helper directly from your dashboard using Cashfree or direct UPI. You enter the stipend or errand fee in INR (₹) and initiate a secure payment session via UPI, debit card, or net banking with instant receipts.',
  },
  {
    question: 'Does Softly work if mobile internet connection is poor?',
    answer:
      'Yes! Softly is a Progressive Web App (PWA). It caches critical medicine schedules and clinic addresses directly onto the device, so you or your helper can open the dashboard even in hospital basements or intermittent network areas.',
  },
  {
    question: 'Can I add multiple doctors and family members under one space?',
    answer:
      'Yes. You can manage multiple family members (both mother and father), schedule appointments with various medical specialists, and coordinate with multiple trusted local helpers under one private family space.',
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
