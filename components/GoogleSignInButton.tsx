'use client';

import React, { useState, useEffect } from 'react';
import { GoogleUser } from '@/lib/auth-service';
import { CheckCircle2, LogOut, Sparkles } from 'lucide-react';

interface Props {
  onUserAuthenticated?: (user: GoogleUser) => void;
  className?: string;
}

export default function GoogleSignInButton({ onUserAuthenticated, className = '' }: Props) {
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [authUrl, setAuthUrl] = useState('');
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const [meRes, googleRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/auth/google?next=/register'),
      ]);
      const meData = await meRes.json();
      const googleData = await googleRes.json();

      setIsConfigured(googleData.configured);
      setAuthUrl(googleData.url);

      if (meData.authenticated && meData.user) {
        setCurrentUser(meData.user);
        if (onUserAuthenticated) {
          onUserAuthenticated(meData.user);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleGoogleClick = () => {
    if (isConfigured && authUrl && !authUrl.includes('/mock')) {
      // Redirect to actual Google OAuth login page
      window.location.href = authUrl;
    } else {
      // Show setup helper / 1-tap simulator
      setShowHelperModal(true);
    }
  };

  const handleSimulateGoogleLogin = async (name: string, email: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        if (onUserAuthenticated) {
          onUserAuthenticated(data.user);
        }
        setShowHelperModal(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (currentUser) {
    return (
      <div className={`p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-700 shadow-xs">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-stone-800">{currentUser.name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] text-stone-500">{currentUser.email}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            document.cookie = 'softly_user=; Max-Age=0; path=/;';
            setCurrentUser(null);
          }}
          className="p-1.5 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors"
          title="Sign out from Google"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleClick}
        className={`w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 shadow-xs active:scale-98 transition-all flex items-center justify-center gap-3 text-stone-700 font-semibold text-xs sm:text-sm ${className}`}
      >
        {/* Official Google 'G' SVG Logo */}
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>

      {/* Helper Modal if live Google API keys are needed */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl relative text-left">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔐</span>
              <h3 className="font-bold text-base text-stone-800">
                Google Authentication Setup
              </h3>
            </div>

            <p className="text-xs text-softly-muted leading-relaxed mb-4">
              To connect your <strong>real Google accounts</strong> live on the web, Google requires your free <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code> from Google Cloud Console.
            </p>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 mb-5 space-y-3">
              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                Instant 1-Tap Google Sign-In (For Testing)
              </span>
              <p className="text-xs text-stone-500">
                Enter your real name and Gmail to test the Google sign-in experience immediately:
              </p>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Full Name (e.g. Sriram Singamsetti)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800"
                />
                <input
                  type="email"
                  placeholder="Your Gmail (e.g. sriram@gmail.com)"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-800"
                />
              </div>

              <button
                type="button"
                disabled={loading || !customName.trim() || !customEmail.trim()}
                onClick={() => handleSimulateGoogleLogin(customName.trim(), customEmail.trim())}
                className="w-full py-2.5 rounded-xl bg-[#292524] text-white text-xs font-semibold hover:bg-stone-800 active:scale-98 transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in as this Google User →'}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowHelperModal(false)}
                className="px-4 py-2 rounded-full text-xs font-medium text-stone-500 hover:bg-stone-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
