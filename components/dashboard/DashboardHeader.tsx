'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Family } from '@/lib/types';
import { Bell, UserCheck, Share2, ChevronDown, Plus, Users } from 'lucide-react';
import ProfileDropdown from '@/components/ProfileDropdown';

interface Props {
  familyName: string;
  inviteCode: string;
  activeFamilyId?: string;
  families?: Family[];
  onSelectFamily?: (familyId: string) => void;
  onOpenRegister?: () => void;
  unreadCount?: number;
  onOpenSimulator: () => void;
}

export default function DashboardHeader({
  familyName,
  inviteCode,
  activeFamilyId,
  families = [],
  onSelectFamily,
  onOpenRegister,
  unreadCount = 2,
  onOpenSimulator,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Softly Logo"
              className="w-8 h-8 rounded-xl object-contain shadow-xs transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-bold text-lg text-softly-text hidden sm:inline tracking-tight">
              Softly
            </span>
          </Link>

          <div className="h-5 w-[1px] bg-stone-200 hidden sm:block" />

          {/* Interactive Family Dropdown Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-left p-1 rounded-xl hover:bg-stone-100 transition-colors"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="font-bold text-sm sm:text-lg text-softly-text tracking-tight truncate max-w-[120px] sm:max-w-xs md:max-w-none">
                    {familyName}
                  </h1>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-softly-sage text-stone-700">
                    Caregiver Hub
                  </span>
                  <span className="text-[10px] text-stone-400 hidden sm:inline">
                    Click to switch family
                  </span>
                </div>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-floating p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <span className="text-[10px] uppercase font-bold text-stone-400 px-3 py-1 block">
                  Your Family Spaces ({families.length})
                </span>

                {families.length === 0 ? (
                  <div className="px-3 py-3 text-center text-xs text-stone-500 bg-stone-50 rounded-xl mb-2">
                    <p className="font-semibold text-stone-700">No family space yet</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Register below to create your private family space.</p>
                  </div>
                ) : (
                  <div className="space-y-1 mb-2">
                    {families.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => {
                          if (onSelectFamily) onSelectFamily(f.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          f.id === activeFamilyId
                            ? 'bg-softly-sage/70 font-bold text-stone-900'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="truncate pr-2">{f.name}</span>
                        <span className="text-[10px] text-stone-400 font-mono shrink-0">
                          {f.invite_code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t border-stone-100 space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onOpenRegister) onOpenRegister();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Register New Family Space</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      if (onSelectFamily) onSelectFamily('fam-sharma');
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-50 flex items-center gap-1.5 transition-colors"
                  >
                    <span>🌟</span>
                    <span>Explore Sharma Family (Demo)</span>
                  </button>
                </div>
              </div>
            )}
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
            <span className="sm:hidden">{copied ? 'Copied' : inviteCode}</span>
          </button>

          {/* Quick link to Helper View */}
          <Link
            href={`/helper?pin=${inviteCode}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-300 text-stone-600 hover:text-stone-900 text-xs font-medium transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Helper View</span>
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
            <span className="hidden sm:inline">WhatsApp</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse" />
            )}
          </button>

          {/* Profile */}
          <div className="h-5 w-[1px] bg-stone-200 hidden sm:block" />
          <ProfileDropdown variant="header" />
        </div>
      </div>
    </header>
  );
}
