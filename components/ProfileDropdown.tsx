'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, LayoutDashboard, UserPlus, ChevronDown, Search, Briefcase, Crown } from 'lucide-react';

interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  identifier?: string;
  picture?: string;
}

interface Props {
  variant?: 'nav' | 'header';
}

export default function ProfileDropdown({ variant = 'nav' }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsOpen(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('softly_user');
        localStorage.removeItem('softly_active_family_id');
        localStorage.removeItem('softly_marketplace_helper_id');
      }
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-stone-100 animate-pulse" />;
  }

  // If user is not logged in
  if (!user) {
    if (variant === 'header') {
      return (
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </Link>
      );
    }

    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/subscribe"
          className="text-[13px] font-semibold text-stone-700 hover:text-stone-950 px-3 py-1.5 rounded-full hover:bg-stone-100 transition-colors flex items-center gap-1.5"
        >
          <span>Subscribe</span>
          <span className="text-[10px] bg-[#FFB7B2]/40 text-stone-900 font-bold px-1.5 py-0.2 rounded-full">
            Premium
          </span>
        </Link>
        <Link
          href="/login?next=/dashboard"
          className="bg-softly-text text-white hover:bg-stone-700 active:scale-95 text-[13px] sm:text-[14px] font-medium px-4 sm:px-5 py-2 rounded-full transition-all duration-200 shadow-sm"
        >
          + Register
        </Link>
      </div>
    );
  }

  // If logged in
  const displayName = user.name || 'User';
  const displayEmail = user.email || user.identifier || 'Signed in';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white/90 hover:bg-stone-100 border border-stone-200 shadow-xs transition-all active:scale-95"
        title="View Profile & Account"
      >
        {user.picture ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.picture}
            alt={displayName}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full object-cover border border-stone-200"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#FFB7B2] flex items-center justify-center text-xs font-bold text-stone-800 shadow-xs">
            {initial}
          </div>
        )}
        <span className="text-xs font-semibold text-stone-800 max-w-[100px] truncate hidden sm:inline-block">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* User Details Header */}
          <div className="px-3 py-2.5 bg-stone-50/80 rounded-xl mb-1.5 border border-stone-100">
            <p className="text-xs font-bold text-stone-900 truncate">{displayName}</p>
            <p className="text-[11px] text-stone-500 truncate mt-0.5">{displayEmail}</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Active Session
            </span>
          </div>

          <div className="space-y-0.5">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
              <span>Go to Care Dashboard</span>
            </Link>

            <Link
              href="/helpers/browse"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span>Find a Helper (Marketplace)</span>
            </Link>

            <Link
              href="/helpers/profile"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5 text-stone-500" />
              <span>Caregiver Hub &amp; Jobs</span>
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-stone-500" />
              <span>Register New Family Space</span>
            </Link>

            <Link
              href="/subscribe"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Premium Membership</span>
            </Link>
          </div>

          <div className="my-1.5 border-t border-stone-100" />

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors text-left"
          >
            <LogOut className="w-3.5 h-3.5 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
