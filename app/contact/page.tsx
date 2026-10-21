'use client';

import React, { useState } from 'react';
import FloatingNav from '@/components/landing/FloatingNav';
import Footer from '@/components/Footer';
import { Mail, Clock, MessageSquare, ShieldCheck, CheckCircle2, Send, PhoneCall } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Subscription & Billing');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          category,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to submit message.');
      }
      setTicketId(data.ticketId);
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#292524] flex flex-col font-sans selection:bg-[#FFB7B2]/40">
      <FloatingNav />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-20 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-softly-coral/25 border border-softly-coral/40 text-xs font-bold text-stone-900 mb-3 shadow-2xs">
            <Mail className="w-3.5 h-3.5 text-stone-900" />
            <span>SUPPORT &amp; INQUIRIES</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
            We are Here for You and Your Family
          </h1>

          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Have questions about your subscription, helper hiring, or daily medication coordination? Our dedicated caregiver support team is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Support Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
              <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Softly Care Desk
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Reach out to us directly for billing inquiries, subscription cancellations, refund assistance, or family space setup.
              </p>

              <div className="pt-2 space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <Mail className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-stone-900">Email Address</span>
                    <a href="mailto:support@softlycare.in" className="text-stone-600 hover:text-stone-900 underline">
                      support@softlycare.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <Clock className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-stone-900">Service Availability</span>
                    <span className="text-stone-600">24/7 Continuous Caregiver &amp; Technical Support</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-stone-900">Response Turnaround</span>
                    <span className="text-stone-600">Instant ticket routing &amp; 24/7 care desk support</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#FFF5F4] to-white rounded-3xl p-6 border border-softly-coral/40 shadow-2xs">
              <h4 className="font-bold text-sm text-stone-900 mb-1 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-stone-800" />
                Priority WhatsApp Support
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                Active Softly Premium members can access real-time clinical care coordination on WhatsApp.
              </p>
              <a
                href="https://wa.me/919999999999?text=Hi%20Softly%20Team,%20I%20need%20support%20with%20my%20family%20care%20space"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-stone-900 shadow-2xs hover:opacity-90 transition-all"
                style={{ background: '#FFB7B2' }}
              >
                <span>Chat on WhatsApp</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-soft">
              {ticketId ? (
                <div className="py-8 text-center space-y-4 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mx-auto font-bold border border-emerald-200">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900">Message Received!</h3>
                  <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                    Your inquiry has been registered under reference <strong>#{ticketId}</strong>. A support coordinator will email you back within 2 to 4 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketId(null);
                      setMessage('');
                    }}
                    className="mt-4 px-6 py-2.5 rounded-full text-xs font-bold text-stone-900 border border-stone-300 hover:bg-stone-50 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-stone-900">Send Us a Message</h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Fill out the form below and we will get back to your email directly.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-2xl bg-red-50 text-red-700 border border-red-200 text-xs font-medium">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Sriram Singamsetti"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Mobile / WhatsApp Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Inquiry Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-900"
                      >
                        <option value="Subscription & Billing">Subscription &amp; Billing (INR)</option>
                        <option value="Refund & Cancellation Request">Refund &amp; Cancellation Request</option>
                        <option value="Family Space Coordination">Family Space Coordination</option>
                        <option value="Helper Hiring & Verification">Helper Hiring &amp; Marketplace</option>
                        <option value="Technical Support">Technical &amp; WhatsApp Notifications</option>
                        <option value="Other">Other Inquiries</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      placeholder="Please let us know how we can assist you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-xs outline-none focus:border-stone-400 focus:bg-white transition-all text-stone-900 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full font-bold text-xs text-stone-900 shadow-soft transition-all active:scale-95 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
                    style={{ background: '#FFB7B2' }}
                  >
                    {submitting ? (
                      <span>Sending message...</span>
                    ) : (
                      <>
                        <span>Submit Support Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
