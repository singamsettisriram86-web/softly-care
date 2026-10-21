'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/* ------------------------------------------------------------------ */
/*  Google G Logo                                                        */
/* ------------------------------------------------------------------ */
function GoogleG() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Background blobs + grain                                             */
/* ------------------------------------------------------------------ */
function Blobs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-50 blur-3xl"
        style={{ background: '#FFE4E1', animation: 'blobFloat 7s ease-in-out infinite' }} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-40 blur-3xl"
        style={{ background: '#E6E6FA', animation: 'blobFloat 9s ease-in-out infinite reverse' }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner page — uses useSearchParams so must be inside Suspense        */
/* ------------------------------------------------------------------ */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Where to redirect after successful login
  const nextPath = searchParams.get('next') || searchParams.get('from') || '/dashboard';
  const queryTab = searchParams.get('tab');

  const [tab, setTab] = useState<'signin' | 'signup'>(
    queryTab === 'signup' || nextPath === '/register' || nextPath.includes('/helpers/register') || nextPath.includes('/helpers/browse')
      ? 'signup'
      : 'signin'
  );
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const [googleConfigured, setGoogleConfigured] = useState(false);
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');

  // Check if already signed in, and if Google OAuth is configured
  useEffect(() => {
    (async () => {
      try {
        const [meRes, googleRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch(`/api/auth/google?next=${encodeURIComponent(nextPath)}`),
        ]);
        const me = await meRes.json();
        const google = await googleRes.json();
        setGoogleConfigured(google.configured);
        setGoogleAuthUrl(google.url || '');
        if (me.authenticated) {
          router.replace(nextPath);
        }
      } catch (_) { /* ignore */ }
    })();
  }, [router, nextPath]);

  const handleGoogleClick = () => {
    if (googleConfigured && googleAuthUrl && !googleAuthUrl.includes('/mock')) {
      window.location.href = googleAuthUrl;
    } else {
      setShowGoogleModal(true);
    }
  };

  const handleGoogleSimulate = async () => {
    if (!googleName.trim() || !googleEmail.trim()) return;
    setGoogleLoading(true);
    try {
      const res = await fetch('/api/auth/mock-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: googleName.trim(), email: googleEmail.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('softly_marketplace_helper_id');
          if (tab === 'signup') {
            localStorage.setItem('softly_first_time_signup', 'true');
            localStorage.removeItem('softly_first_time_popup_seen');
          }
        }
        const destination = tab === 'signup' && nextPath === '/dashboard' ? '/dashboard?welcome=1' : nextPath;
        router.push(destination);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!identifier.trim() || !password.trim()) { setFormError('Please fill in all fields.'); return; }
    if (tab === 'signup' && !name.trim()) { setFormError('Please enter your full name.'); return; }
    if (password.length < 6) { setFormError('Password must be at least 6 characters.'); return; }
    setFormLoading(true);
    try {
      const endpoint = tab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = tab === 'signup'
        ? { name: name.trim(), identifier: identifier.trim(), password }
        : { identifier: identifier.trim(), password };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('softly_marketplace_helper_id');
          if (tab === 'signup') {
            localStorage.setItem('softly_first_time_signup', 'true');
            localStorage.removeItem('softly_first_time_popup_seen');
          }
        }
        const destination = tab === 'signup' && nextPath === '/dashboard' ? '/dashboard?welcome=1' : nextPath;
        router.push(destination);
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (_) {
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#FDFCF8', fontFamily: "'Outfit', sans-serif", color: '#292524' }}>
      <Blobs />

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-xl rounded-3xl px-8 py-10 relative z-10">

        {/* Logo + Brand */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <a href="/" className="flex flex-col items-center gap-2 group">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
              style={{ background: '#FFB7B2' }}>
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#292524' }}>Welcome to Softly</h1>
          </a>
          <p className="text-sm text-center leading-relaxed" style={{ color: '#78716C' }}>
            {nextPath === '/register'
              ? "Create your account first — then we'll set up your family space."
              : nextPath.startsWith('/helpers/browse')
              ? 'Sign up or sign in to browse and connect with verified elder caregivers.'
              : nextPath.startsWith('/helpers/register')
              ? 'Sign up or sign in to publish your caregiver job profile.'
              : nextPath.startsWith('/helpers/profile')
              ? 'Sign in to access your caregiver work portal.'
              : "Your family's care starts here — sign in or create an account to continue."}
          </p>
        </div>

        {/* Google Button */}
        <button type="button" onClick={handleGoogleClick}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white border border-stone-300 shadow-sm font-semibold text-sm hover:bg-stone-50 active:scale-95 transition-all"
          style={{ color: '#292524' }}>
          <GoogleG />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ background: '#E7E5E4' }} />
          <span className="text-xs font-medium" style={{ color: '#A8A29E' }}>or</span>
          <div className="flex-1 h-px" style={{ background: '#E7E5E4' }} />
        </div>

        {/* Tabs */}
        <div className="flex rounded-2xl overflow-hidden border border-stone-200 mb-6">
          {(['signin', 'signup'] as const).map((t) => (
            <button key={t} type="button"
              onClick={() => { setTab(t); setFormError(''); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{ background: tab === t ? '#292524' : 'transparent', color: tab === t ? '#FDFCF8' : '#78716C' }}>
              {t === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#78716C' }}>Your Full Name</label>
              <input type="text" placeholder="e.g. Aditya Sharma" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
                style={{ color: '#292524' }} />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#78716C' }}>Email address or Phone number</label>
            <input type="text" placeholder="name@gmail.com  or  +91 98765 43210" value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
              style={{ color: '#292524' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#78716C' }}>Password</label>
            <input type="password" placeholder="Minimum 6 characters" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
              style={{ color: '#292524' }} />
          </div>
          {formError && (
            <div className="px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">{formError}</div>
          )}
          <button type="submit" disabled={formLoading}
            className="w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: '#292524', color: '#FDFCF8' }}>
            {formLoading
              ? (tab === 'signup' ? 'Creating account...' : 'Signing in...')
              : (tab === 'signup' ? 'Create My Account →' : 'Sign In →')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-xs font-medium hover:underline" style={{ color: '#A8A29E' }}>
            ← Back to home
          </a>
        </div>
      </div>

      {/* Google simulation modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-7 border border-stone-200 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <GoogleG />
              <h3 className="font-bold text-base" style={{ color: '#292524' }}>Sign in with Google</h3>
            </div>
            <p className="text-xs mb-5 leading-relaxed" style={{ color: '#78716C' }}>
              Live Google login needs Google API keys which are not configured yet.
              You can still test everything by entering your name and Gmail below.
            </p>
            <div className="space-y-3">
              <input type="text" placeholder="Your Full Name" value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm outline-none"
                style={{ color: '#292524' }} />
              <input type="email" placeholder="Your Gmail address" value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-stone-200 bg-stone-50 text-sm outline-none"
                style={{ color: '#292524' }} />
              <button type="button" disabled={googleLoading || !googleName.trim() || !googleEmail.trim()}
                onClick={handleGoogleSimulate}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                style={{ background: '#292524', color: '#FDFCF8' }}>
                {googleLoading ? 'Signing in...' : 'Continue as this Google User →'}
              </button>
            </div>
            <div className="mt-4 flex justify-end">
              <button type="button" onClick={() => setShowGoogleModal(false)}
                className="text-xs font-medium hover:underline" style={{ color: '#A8A29E' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Export — wrapped in Suspense (required for useSearchParams)         */
/* ------------------------------------------------------------------ */
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFCF8' }}>
        <div className="w-8 h-8 rounded-full animate-ping" style={{ background: '#FFB7B2' }} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
