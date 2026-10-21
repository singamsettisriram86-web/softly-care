import React from 'react';
import FloatingNav from '@/components/landing/FloatingNav';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { RefreshCw, CheckCircle2, Clock, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-3">
            <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
            <span>TRANSPARENT BILLING</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            Refunds &amp; Cancellations
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            Softly Care Coordinator · Cashfree Merchant Policy Guidelines
          </p>
        </div>

        {/* Highlights banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs text-center space-y-1.5">
            <span className="text-2xl font-black text-stone-900">14 Days</span>
            <h4 className="text-xs font-bold text-stone-800">Free Trial Period</h4>
            <p className="text-[11px] text-stone-500">Cancel before the trial ends and you will not be charged a single rupee.</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs text-center space-y-1.5">
            <span className="text-2xl font-black text-emerald-600">5 – 7 Days</span>
            <h4 className="text-xs font-bold text-stone-800">Refund Turnaround</h4>
            <p className="text-[11px] text-stone-500">Processed back to original payment mode (UPI / Cards / Netbanking) via Cashfree.</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs text-center space-y-1.5">
            <span className="text-2xl font-black text-stone-900">1-Tap</span>
            <h4 className="text-xs font-bold text-stone-800">Instant Cancellation</h4>
            <p className="text-[11px] text-stone-500">Cancel anytime directly from your dashboard or via our support desk.</p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200/90 shadow-soft space-y-8 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">1. Cancellation Policy</h2>
            <p>
              At Softly, our priority is supporting your parents&apos; wellbeing with complete peace of mind. We maintain a flexible, transparent cancellation policy with no locked contracts or hidden fees:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li>
                <strong>Self-Service Cancellation:</strong> You can cancel your subscription at any time by navigating to your Family Dashboard &gt; Membership settings, or by submitting a cancellation request on our <Link href="/contact" className="underline font-bold text-stone-900">Contact Us</Link> page.
              </li>
              <li>
                <strong>Billing Period Completion:</strong> Upon cancellation, your family space will continue to enjoy full Softly Premium features (unlimited WhatsApp medicine alerts, calendar sync, doctor visit logging) until the conclusion of your current paid billing cycle. No further recurring charges will occur.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">2. Refund Eligibility</h2>
            <p>
              We want you to be completely satisfied with our service. Refunds are granted under the following circumstances:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                <h4 className="font-bold text-xs text-stone-900 mb-1">A. Duplicate or Technical Payment Errors</h4>
                <p className="text-xs text-stone-600">
                  If you were charged multiple times due to a network glitch or session timeout during Cashfree checkout, 100% of the duplicate amount will be refunded immediately upon verification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                <h4 className="font-bold text-xs text-stone-900 mb-1">B. Annual Plan 7-Day Guarantee</h4>
                <p className="text-xs text-stone-600">
                  Subscribers to the Annual Plan (₹2,499/year) may request a full refund within 7 calendar days of charge if the service does not meet their family&apos;s expectations.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
                <h4 className="font-bold text-xs text-stone-900 mb-1">C. Service Outages</h4>
                <p className="text-xs text-stone-600">
                  In the rare event of verified prolonged technical downtime preventing daily medication notifications for more than 48 consecutive hours, pro-rated refunds or credit extensions are provided.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">3. How Refunds are Processed via Cashfree</h2>
            <p>
              All refunds are initiated directly through our Cashfree merchant payment gateway:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
              <li><strong>Original Payment Method:</strong> Refunds are credited strictly back to the source account used during checkout (e.g. UPI VPA ID, original bank card, or Netbanking account).</li>
              <li><strong>Processing Timeframe:</strong> Once approved by our team (typically within 24 hours), Cashfree and banking networks process the credit to your account within <strong>5 to 7 business days</strong>.</li>
              <li><strong>Notification:</strong> You will receive an email and SMS confirmation containing your Cashfree refund ARN / transaction reference code.</li>
            </ul>
          </section>

          <section className="space-y-3 border-t border-stone-100 pt-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900">4. Request a Refund or Cancellation</h2>
            <p>
              To initiate a refund or discuss your billing, please contact our support desk:
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="px-6 py-3 rounded-full font-bold text-xs text-stone-900 shadow-soft transition-transform active:scale-95 inline-flex items-center justify-center gap-2"
                style={{ background: '#FFB7B2' }}
              >
                <span>Submit Refund Request</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="mailto:support@softlycare.in?subject=Refund%20Request"
                className="px-6 py-3 rounded-full font-bold text-xs text-stone-800 border border-stone-300 hover:bg-stone-50 transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <span>Email support@softlycare.in</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
