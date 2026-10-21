import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Mail, Phone, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-200/80 pt-16 pb-12 text-[#292524] font-sans selection:bg-[#FFB7B2]/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-xs"
                style={{ background: '#FFB7B2' }}
              >
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-stone-900">Softly</span>
            </Link>
            <p className="text-xs text-stone-500 leading-relaxed">
              Mindful elder care coordination for adult sons and daughters living away from aging parents in India.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cashfree Verified Merchant</span>
            </div>
          </div>

          {/* Product & Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/dashboard" className="hover:text-stone-900 transition-colors">
                  Family Dashboard
                </Link>
              </li>
              <li>
                <Link href="/helpers/browse" className="hover:text-stone-900 transition-colors">
                  Find a Helper Marketplace
                </Link>
              </li>
              <li>
                <Link href="/helpers/jobs" className="hover:text-stone-900 transition-colors">
                  Helper Job Portal
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="hover:text-stone-900 transition-colors font-medium text-stone-900">
                  Premium Membership (INR)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">Policies &amp; Legal</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/terms" className="hover:text-stone-900 transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-stone-900 transition-colors">
                  Refunds &amp; Cancellations
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-stone-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-stone-900 transition-colors font-medium text-stone-900">
                  Contact Us &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Desk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">Caregiver Support</h4>
            <ul className="space-y-2.5 text-xs text-stone-600">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <a href="mailto:support@softlycare.in" className="hover:underline">
                  support@softlycare.in
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold text-stone-800">24/7 Caregiver Support Service</span>
              </li>
              <li className="pt-1">
                <Link
                  href="/contact"
                  className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-900 border border-stone-300 hover:bg-stone-50 transition-colors"
                >
                  Open Support Ticket →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing notice & security badge */}
        <div className="border-t border-stone-100 pt-6 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>
            All subscription prices are listed in <strong>Indian Rupees (INR)</strong> and include all applicable taxes.
          </p>
          <div className="flex items-center gap-2 font-medium text-stone-600">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>256-bit Encrypted Payments via Cashfree</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-stone-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-400 text-center sm:text-left">
          <p>© 2026 Softly Care Coordinator. All rights reserved.</p>
          <p>Bengaluru, Karnataka, India</p>
        </div>
      </div>
    </footer>
  );
}
