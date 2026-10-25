import React from 'react';
import FloatingNav from '@/components/landing/FloatingNav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { FileText, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 mb-3">
            <FileText className="w-3.5 h-3.5 text-stone-700" />
            <span>LEGAL AGREEMENT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Last Updated: October 21, 2026 · Softly Care Coordinator
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-soft space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          {/* Medical Disclaimer Banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>Medical Disclaimer:</strong> Softly Care Coordinator is a digital communication, medication reminder, and non-clinical care coordination platform. It is <strong>not</strong> an emergency healthcare service, ambulance dispatch, or licensed medical practitioner. In case of an acute medical emergency, immediately dial 112 or your nearest hospital ambulance services.
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Softly website (<strong>softly-care.vercel.app</strong>), family dashboards, mobile web portals, and WhatsApp notification services (collectively, the &quot;Platform&quot;), you agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use our Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">2. Description of Services</h2>
            <p>
              Softly provides family coordination tools specifically crafted for adult children living across cities or abroad to stay actively involved in their aging parents&apos; daily wellness. Services include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>Daily automated medication reminders via WhatsApp and interactive dashboards.</li>
              <li>Dual-confirmation logging with local caregivers and domestic helpers.</li>
              <li>Doctor appointment calendar synchronization (.ics / Google Calendar).</li>
              <li>Caregiver directory and direct helper contact marketplace.</li>
              <li>Clinical vitals logs (Blood Pressure, Blood Sugar, Heart Rate exports).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">3. User Accounts &amp; Family Spaces</h2>
            <p>
              To create a private family space, you must register an account with accurate and verifiable details. You are responsible for safeguarding your login credentials and for all activities that occur within your family space. You confirm that you have obtained appropriate consent from your family members to register their contact details for medication reminders.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">4. Subscriptions, Pricing &amp; Payments in INR</h2>
            <p>
              Softly offers both free access features (dashboard browsing, public helper directory) and premium membership tiers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Monthly Plan:</strong> ₹299 per month (inclusive of all applicable taxes).</li>
              <li><strong>Annual Plan:</strong> ₹2,499 per year (inclusive of all applicable taxes).</li>
            </ul>
            <p>
              All prices are denominated in <strong>Indian Rupees (INR)</strong>. Payments are processed securely via our certified payment gateway partner, <strong>Cashfree Payments India Pvt. Ltd.</strong> We do not store or process your complete credit/debit card numbers or UPI PINs on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">5. Free Trial &amp; Renewal</h2>
            <p>
              New subscribers are eligible for a 3-day free trial. You may cancel your subscription at any time during or after the trial period through the dashboard or by contacting support. Unless cancelled, subscriptions renew automatically according to the selected billing rhythm.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">6. Cancellations &amp; Refunds</h2>
            <p>
              Please refer to our detailed <Link href="/refunds" className="text-stone-900 font-bold underline">Refunds &amp; Cancellations Policy</Link> for comprehensive details on eligibility, processing timelines (5-7 business days via Cashfree), and cancellation procedures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">7. Helper Marketplace Disclaimer</h2>
            <p>
              Softly provides a discovery platform connecting independent elder helpers with families with zero agency commission. While helper profiles include verified identity documents and skill checklists, families are strongly advised to conduct standard independent background verification and references before engaging a live-in or day helper.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">8. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India.
            </p>
          </section>

          <section className="space-y-3 border-t border-stone-100 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">9. Contact Us</h2>
            <p>
              If you have any questions, legal notices, or feedback regarding these Terms, please reach out via our <Link href="/contact" className="text-stone-900 font-bold underline">Contact Us Page</Link> or email our legal desk at <a href="mailto:support@softlycare.in" className="underline">support@softlycare.in</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
