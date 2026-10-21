import React from 'react';
import FloatingNav from '@/components/landing/FloatingNav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 mb-3">
            <Lock className="w-3.5 h-3.5 text-stone-700" />
            <span>DATA PRIVACY &amp; SECURITY</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Last Updated: October 21, 2026 · Digital Personal Data Protection (DPDP) Act Compliant
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-soft space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">1. Commitment to Family Privacy</h2>
            <p>
              Softly Care Coordinator (&quot;Softly&quot;, &quot;we&quot;, &quot;our&quot;) is committed to protecting the privacy and personal health information of you, your aging parents, and local caregivers. We treat caregiving data with the highest sensitivity and do <strong>not</strong> sell, rent, or trade personal data to third-party advertisers or insurance brokers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Account Information:</strong> Caregiver name, verified mobile number or email address, city of residence.</li>
              <li><strong>Family Member Profiles:</strong> Parents&apos; names, relation, medication schedules (dosages, timings, meal relations), and clinical appointments.</li>
              <li><strong>Helper Information:</strong> Name, phone number, and voluntary identity/skill verifications submitted for marketplace listings.</li>
              <li><strong>Payment &amp; Transaction Details:</strong> Subscription plan selected and Cashfree order reference identifiers. We do <strong>not</strong> store credit/debit card numbers or UPI PINs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">3. How Information is Used</h2>
            <p>Your data is used solely to deliver proactive family care coordination services:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Triggering automated daily WhatsApp medication reminders to parents and helpers.</li>
              <li>Generating doctor appointment reminders and calendar synchronization.</li>
              <li>Maintaining medication adherence logs and vital logs (BP, diabetes) for export.</li>
              <li>Processing Cashfree payments, invoices, renewals, and refunds.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">4. Payment Security &amp; Cashfree Processing</h2>
            <p>
              All online payments on Softly are processed through <strong>Cashfree Payments India Pvt. Ltd.</strong>, a Reserve Bank of India (RBI) authorized Payment Aggregator and Level 1 PCI-DSS certified payment platform. Sensitive financial data transmission is secured using industry-standard 256-bit SSL encryption.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">5. WhatsApp Messaging Consent</h2>
            <p>
              By registering family members or caregivers and enabling daily alerts, you provide explicit consent to receive informational care reminders and adherence check messages via WhatsApp and SMS. You can toggle or update reminder frequencies anytime from your family space settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">6. Data Rights &amp; Deletion</h2>
            <p>
              In compliance with the Digital Personal Data Protection (DPDP) Act, 2023, you have the right to review, update, or request the permanent deletion of your account and all associated family space records. To request data deletion, contact our privacy officer at <a href="mailto:support@softlycare.in" className="underline font-bold text-stone-900">support@softlycare.in</a> or through our <Link href="/contact" className="underline font-bold text-stone-900">Contact Us</Link> portal.
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-100 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">7. Contact the Privacy Team</h2>
            <p>
              For questions regarding our privacy practices or security standards, please write to us at <a href="mailto:support@softlycare.in" className="underline">support@softlycare.in</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
