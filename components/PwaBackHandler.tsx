'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Smartphone } from 'lucide-react';

export default function PwaBackHandler() {
  const pathname = usePathname();
  const router = useRouter();
  const [showExitToast, setShowExitToast] = useState(false);
  const lastBackPressRef = useRef<number>(0);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // Always maintain a history safety state so pressing Android hardware back doesn't terminate the PWA process
    const pushSafetyState = () => {
      try {
        window.history.pushState({ pwaGuard: true, path: pathname }, '', window.location.href);
      } catch (e) {
        // Ignore cross-origin or security restrictions
      }
    };

    pushSafetyState();

    const handlePopState = (event: PopStateEvent) => {
      // 1. Check if any modal / dialog is open
      const openDialog = document.querySelector<HTMLElement>('[role="dialog"], [aria-modal="true"]');
      if (openDialog) {
        // Find close button inside dialog (usually button with X or SVG)
        const closeBtn = openDialog.querySelector<HTMLButtonElement>(
          'button:has(svg), button[aria-label*="close" i], button.close'
        );
        if (closeBtn) {
          closeBtn.click();
          pushSafetyState();
          return;
        }

        // Dispatch general event
        window.dispatchEvent(new CustomEvent('softly:close-all-modals'));
        pushSafetyState();
        return;
      }

      // 2. Check if on Root / Main Landing screens (/ or /dashboard)
      const isRootPage = pathname === '/' || pathname === '/dashboard';

      if (isRootPage) {
        const now = Date.now();
        if (now - lastBackPressRef.current < 2000) {
          // User pressed back twice within 2 seconds: allow exit
          return;
        }

        // First press: Show gentle "Press back again to exit" toast and keep user in app
        lastBackPressRef.current = now;
        setShowExitToast(true);

        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => {
          setShowExitToast(false);
        }, 2000);

        // Re-push safety state to prevent immediate OS kill
        pushSafetyState();
      } else {
        // 3. User is on a sub-page (e.g. /helpers/browse, /helpers/register, /helpers/jobs, /helpers/profile)
        // Instead of quitting the app, navigate safely back to Home or Dashboard
        if (document.referrer && document.referrer.includes(window.location.host)) {
          router.back();
        } else {
          router.push('/dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [pathname, router]);

  if (!showExitToast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900/90 text-white text-xs font-semibold shadow-2xl backdrop-blur-md border border-stone-800">
        <Smartphone className="w-3.5 h-3.5 text-softly-coral" />
        <span>Press back again to exit Softly</span>
      </div>
    </div>
  );
}
