'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  UserPlus,
  Briefcase,
  IndianRupee,
  Clock,
  HeartHandshake,
  Sparkles,
  Home,
  Car,
  Stethoscope,
  Brain,
  ChevronDown,
} from 'lucide-react';
import FloatingNav from '@/components/landing/FloatingNav';

const JOB_TYPES = [
  {
    id: 'live_in',
    title: 'Live-in Caregiver (24×7 Stay)',
    badge: 'High Demand · Highest Pay',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: <Home className="w-6 h-6 text-emerald-700" />,
    salary: '₹16,000 – ₹25,000 / month',
    daily: 'Plus free room & meals provided by family',
    description:
      'Reside with the elderly parent in their home. Ideal for seniors living alone whose adult children work in another city or abroad.',
    responsibilities: [
      'Overnight monitoring and emergency safety',
      'Timely blood pressure, heart & diabetes medication reminders',
      'Preparation of fresh diabetic or soft diet meals',
      'Assisting with morning bath, dressing, and toilet routines',
      'Gentle companion walking and emotional support',
    ],
    idealFor: 'Compassionate attendants willing to stay full-time with elderly seniors.',
  },
  {
    id: 'visiting',
    title: 'Visiting Attendant (Day Shifts)',
    badge: 'Flexible Hours · Work Near Home',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: <Car className="w-6 h-6 text-blue-700" />,
    salary: '₹8,000 – ₹15,000 / month',
    daily: 'Or ₹400 – ₹700 / day shift',
    description:
      'Visit the parent’s house for 4 to 8 hours daily (morning or evening slots). Maintain your own household while earning steady income.',
    responsibilities: [
      'Morning sponge bath, grooming, and medicine checking',
      'Accompanying parents to specialist doctor clinics (Apollo, KIMS, local clinics)',
      'Collecting fresh pharmacy prescriptions and fresh fruits/groceries',
      'Evening park walks and light exercise support',
    ],
    idealFor: 'Local community members, trusted drivers, or homemakers with caregiving experience.',
  },
  {
    id: 'bedridden',
    title: 'Post-Surgery & Bedridden Patient Care',
    badge: 'Specialized Clinical Support',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: <Stethoscope className="w-6 h-6 text-rose-700" />,
    salary: '₹18,000 – ₹28,000 / month',
    daily: 'Or ₹700 – ₹1,000 / day',
    description:
      'Advanced bedside care for seniors recovering from hip/knee replacements, stroke paralysis, or chronic bedridden conditions.',
    responsibilities: [
      'Urine bag / catheter monitoring and sterile hygiene',
      'Adult diaper changing and bed-sore prevention turning routines',
      'Wheelchair transfers and gentle passive physiotherapy',
      'Monitoring oxygen levels (SpO2), BP, and blood sugar logs',
    ],
    idealFor: 'Trained General Duty Assistants (GDA), hospital ward attendants, and nursing aides.',
  },
  {
    id: 'dementia',
    title: 'Dementia & Alzheimer Memory Companion',
    badge: 'Patience & Compassion',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: <Brain className="w-6 h-6 text-purple-700" />,
    salary: '₹15,000 – ₹22,000 / month',
    daily: 'Day or Live-in shifts available',
    description:
      'Specialized patience for parents experiencing memory loss, confusion, or Alzheimer’s, ensuring emotional calm and dignity.',
    responsibilities: [
      'Calm, respectful communication without frustration',
      'Preventing unsupervised wandering or kitchen accidents',
      'Engaging seniors in cognitive puzzles, old music, and family photo memories',
      'Gentle supervision of meal adherence and hygiene',
    ],
    idealFor: 'Soft-spoken, deeply patient caregivers with memory care experience.',
  },
];

const JOB_FAQS = [
  {
    q: 'Does Softly charge any fee or commission from caregivers?',
    a: 'Absolutely ZERO. Unlike agencies that deduct 30% to 50% from your salary, Softly is 100% free for helpers. You keep every single rupee you earn.',
  },
  {
    q: 'How do families contact me after I register?',
    a: 'Once your profile is published, verified families in your city view your skills and unlock your contact info. You will receive direct phone calls and WhatsApp messages directly from the family.',
  },
  {
    q: 'How do I receive my salary payments?',
    a: 'Directly from the family to your UPI (Google Pay, PhonePe, Paytm) or bank account. You agree on payment terms (monthly advance, bi-weekly, or daily) directly with the family.',
  },
  {
    q: 'Can I choose my own working cities and rates?',
    a: 'Yes! When registering, you set your base city, any additional service cities, and your expected monthly salary and daily rate. You can edit these anytime.',
  },
  {
    q: 'What if I am currently working and not looking for new jobs?',
    a: 'You have a 1-click toggle in your profile: "Set as Employed". This hides your profile from search so you are not disturbed. When your job ends, toggle it back to "Available Now" with one tap.',
  },
];

export default function HelperJobsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>CAREGIVER CAREER NETWORK</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Elderly Caregiver Jobs in India
          </h1>

          <p className="text-sm sm:text-base text-stone-600 mt-3 max-w-xl mx-auto leading-relaxed">
            Get hired directly by loving families for their aging parents. Choose live-in or day shifts, set your own pay, and pay <strong className="text-stone-900">0% agency commission</strong>.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/helpers/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-stone-900 shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{ background: '#FFB7B2' }}
            >
              <UserPlus className="w-4 h-4 text-stone-900" />
              <span>Register for Jobs (2 Minutes)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/helpers/browse"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs sm:text-sm shadow-2xs transition-colors"
            >
              Browse Public Helper Directory
            </Link>
          </div>
        </div>

        {/* Benefits Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
            <span className="text-2xl block mb-1">💸</span>
            <h4 className="text-xs font-bold text-stone-900">0% Commission</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">Keep 100% of your earnings</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
            <span className="text-2xl block mb-1">📱</span>
            <h4 className="text-xs font-bold text-stone-900">Direct WhatsApp</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">Families contact you directly</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
            <span className="text-2xl block mb-1">⚡</span>
            <h4 className="text-xs font-bold text-stone-900">Live Availability</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">Toggle visible or hidden anytime</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 text-center shadow-2xs">
            <span className="text-2xl block mb-1">🇮🇳</span>
            <h4 className="text-xs font-bold text-stone-900">Pan-India Cities</h4>
            <p className="text-[11px] text-stone-500 mt-0.5">Amalapuram, Hyd, Blr &amp; more</p>
          </div>
        </div>

        {/* 4 Job Types Cards */}
        <div className="mb-16">
          <div className="text-center sm:text-left mb-6">
            <h2 className="text-2xl font-bold text-stone-900">Available Caregiver Job Categories</h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Select the type of caregiving you specialize in when creating your profile.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {JOB_TYPES.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-soft flex flex-col justify-between hover:border-softly-coral/60 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center">
                      {job.icon}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${job.badgeColor}`}>
                      {job.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900">{job.title}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-stone-900">{job.salary}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-3">{job.daily}</p>

                  <p className="text-xs text-stone-600 leading-relaxed mb-4">{job.description}</p>

                  <div className="pt-3 border-t border-stone-100 space-y-2 mb-4">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Typical Daily Responsibilities:
                    </span>
                    <ul className="space-y-1.5 text-xs text-stone-700">
                      {job.responsibilities.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 italic max-w-[220px]">
                    {job.idealFor}
                  </span>
                  <Link
                    href={`/helpers/register?type=${job.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-stone-900 hover:opacity-90 transition-opacity flex items-center gap-1 shadow-2xs"
                    style={{ background: '#FFB7B2' }}
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Caregiver FAQs Section */}
        <section id="faq" className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft">
          <div className="text-center mb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-softly-muted block mb-1">
              Got Questions?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              Caregiver Job &amp; Registration FAQs
            </h3>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            {JOB_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-stone-100 bg-stone-50/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-stone-800 flex items-center justify-between gap-3 hover:text-stone-950"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-stone-400 transition-transform ${
                        isOpen ? 'rotate-180 text-stone-800' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100/80 pt-2">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-stone-100">
            <Link
              href="/helpers/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-stone-900 shadow-soft transition-transform active:scale-95"
              style={{ background: '#FFB7B2' }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Your Helper Profile Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
