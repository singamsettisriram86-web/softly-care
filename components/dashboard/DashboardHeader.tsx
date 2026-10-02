'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Bell, UserCheck, Share2, Sparkles } from 'lucide-react';

interface Props {
  familyName: string;
  inviteCode: string;
  unreadCount?: number;
  onOpenSimulator: () => void;
}

export default function DashboardHeader({
  familyName,
  inviteCode,
  unreadCount = 2,
  onOpenSimulator,
}: Props) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const helperUrl = `${window.location.origin}/helper?pin=${inviteCode}`;
      navigator.clipboard.writeText(helperUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-stone-200/70 sticky top-0 z-30 px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Brand & Family Switcher */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-softly-coral flex items-center justify-center shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
            </div>
            <span className="font-bold text-lg text-softly-text hidden sm:inline tracking-tight">
              Softly
            </span>
          </Link>

          <div className="h-5 w-[1px] bg-stone-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg text-softly-text tracking-tight">
                {familyName}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-softly-sage text-stone-700">
                Caregiver Hub
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Connected: Bangalore ↔ Jaipur
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Share Helper Link / PIN */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
            title="Copy Helper direct access link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {copied ? 'Link Copied!' : `Helper PIN: ${inviteCode}`}
            </span>
            <span className="sm:hidden">{copied ? 'Copied' : 'PIN'}</span>
          </button>

          {/* Quick link to Helper View */}
          <Link
            href="/helper"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Switch to Helper View</span>
            <span className="sm:hidden">Helper</span>
          </Link>

          {/* WhatsApp Simulator Drawer Trigger Button */}
          <button
            type="button"
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-medium shadow-sm transition-all"
            title="Open Live WhatsApp & Reminders Simulator"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp Simulator</span>
            <span className="sm:hidden">WhatsApp</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
