'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Search, Briefcase, UserCheck } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on helper PIN screen or login screen if desired, or keep everywhere
  const isHelperPin = pathname === '/helper';

  if (isHelperPin) return null;

  const triggerHaptic = () => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }
    } catch (e) {
      // Ignore
    }
  };

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/',
    },
    {
      label: 'Care Hub',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: pathname.startsWith('/dashboard'),
    },
    {
      label: 'Find Helper',
      href: '/helpers/browse',
      icon: Search,
      isActive: pathname === '/helpers/browse',
    },
    {
      label: 'Care Jobs',
      href: '/helpers/jobs',
      icon: Briefcase,
      isActive: pathname === '/helpers/jobs' || pathname === '/helpers/register',
    },
    {
      label: 'Helper Hub',
      href: '/helpers/profile',
      icon: UserCheck,
      isActive: pathname.startsWith('/helpers/profile'),
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="flex items-center justify-around h-14 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={triggerHaptic}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 ${
                item.isActive ? 'text-stone-900 font-bold' : 'text-stone-400 font-medium hover:text-stone-700'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  item.isActive ? 'bg-[#FFB7B2]/40 text-stone-900' : 'text-stone-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${item.isActive ? 'text-stone-900 font-bold' : 'text-stone-500'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
