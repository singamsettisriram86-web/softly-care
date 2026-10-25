'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Plus, X } from 'lucide-react';
import PostRegistrationTrialModal from '@/components/dashboard/PostRegistrationTrialModal';

const RELATION_OPTIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Others'];

interface CareMember {
  relation: string;
  name: string;
  city: string;
  phone?: string;
}

const emptyMember = (): CareMember => ({ relation: 'Father', name: '', city: '', phone: '' });

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [caregiverName, setCaregiverName] = useState('');
  const [caregiverCity, setCaregiverCity] = useState('');
  const [caregiverPhone, setCaregiverPhone] = useState('');
  const [familyName, setFamilyName] = useState('');

  // Dynamic care members
  const [careMembers, setCareMembers] = useState<CareMember[]>([emptyMember()]);

  // Helper
  const [helperName, setHelperName] = useState('');
  const [helperPhone, setHelperPhone] = useState('');
  const [helperUpi, setHelperUpi] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdFamily, setCreatedFamily] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.authenticated) {
          router.replace('/login?next=/register');
          return;
        }
        if (data.user?.name && !caregiverName) {
          setCaregiverName(data.user.name);
          const surname = data.user.name.split(' ').slice(-1)[0] || data.user.name;
          setFamilyName(`${surname} Family`);
        }
      } catch (_) {}
    })();
  }, [router]);

  const addMember = () => setCareMembers((prev) => [...prev, emptyMember()]);

  const removeMember = (idx: number) =>
    setCareMembers((prev) => prev.filter((_, i) => i !== idx));

  const updateMember = (idx: number, field: keyof CareMember, value: string) =>
    setCareMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caregiverName.trim()) {
      setError('Please fill in your name.');
      return;
    }
    const validMembers = careMembers.filter((m) => m.name.trim());
    const calculatedFamilyName = familyName.trim() || `${caregiverName.trim()} Family`;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/families', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyName: calculatedFamilyName,
          caregiverName: caregiverName.trim(),
          caregiverCity: caregiverCity.trim() || 'Bangalore',
          caregiverPhone: caregiverPhone.trim() || '+919999999999',
          careMembers: validMembers,
          helperName: helperName.trim(),
          helperPhone: helperPhone.trim(),
          helperUpi: helperUpi.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to create family space');
      if (typeof window !== 'undefined') {
        localStorage.setItem('softly_active_family_id', data.family.id);
      }
      const nextDest = searchParams.get('next');
      if (nextDest === '/subscribe') {
        router.push('/subscribe?pay=1');
      } else {
        // Show the 3-day trial & subscription option modal
        setCreatedFamily({
          id: data.family.id,
          name: data.family.name || calculatedFamilyName,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-16 flex flex-col items-center justify-center"
      style={{ background: '#FDFCF8', fontFamily: "'Outfit', sans-serif", color: '#292524' }}
    >
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-40 blur-3xl" style={{ background: '#FFE4E1' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: '#E8EFE8' }} />
      </div>

      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md border border-stone-200/80 shadow-xl rounded-3xl px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-stone-700 mb-3"
            style={{ background: '#E8EFE8', border: '1px solid #D6E4D6' }}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>SETUP IN 1 MINUTE</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: '#292524' }}>
            Register Your Family Space
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#78716C' }}>
            Add your loved ones, your local helper, and your dashboard will be ready.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Section 1 — Caregiver */}
          <div className="p-5 rounded-2xl space-y-4" style={{ background: '#FAF8F5', border: '1px solid #E7E5E4' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#A8A29E' }}>
              1. Your Details (Remote Caregiver)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Your Full Name *</label>
                <input type="text" required placeholder="e.g. Priya Sharma"
                  value={caregiverName} onChange={(e) => setCaregiverName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400 transition-colors"
                  style={{ color: '#292524' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>City You Live In</label>
                <input type="text" placeholder="e.g. Bangalore, Pune"
                  value={caregiverCity} onChange={(e) => setCaregiverCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400 transition-colors"
                  style={{ color: '#292524' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Your Mobile Number</label>
              <input type="tel" placeholder="+91 98765 43210"
                value={caregiverPhone} onChange={(e) => setCaregiverPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400 transition-colors"
                style={{ color: '#292524' }} />
            </div>
          </div>

          {/* Section 2 — Care Members (dynamic) */}
          <div className="p-5 rounded-2xl space-y-4" style={{ background: '#FAF8F5', border: '1px solid #E7E5E4' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#A8A29E' }}>
              2. People Being Cared For
            </span>
            <p className="text-xs text-stone-500 -mt-2">Add your father, mother, or anyone else you're caring for.</p>

            {careMembers.map((member, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 border border-stone-200 space-y-3 relative">
                {careMembers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(idx)}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-stone-100 hover:bg-red-100 flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Relation type pills */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: '#78716C' }}>Relation</label>
                  <div className="flex flex-wrap gap-1.5">
                    {RELATION_OPTIONS.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => updateMember(idx, 'relation', rel)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          member.relation === rel
                            ? 'border-transparent text-stone-800'
                            : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                        }`}
                        style={member.relation === rel ? { background: '#FFB7B2', borderColor: '#FFB7B2' } : {}}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>
                      {member.relation}&apos;s Full Name
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. ${member.relation === 'Father' ? 'Rajesh Kumar' : member.relation === 'Mother' ? 'Sunita Devi' : 'Full name'}`}
                      value={member.name}
                      onChange={(e) => updateMember(idx, 'name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
                      style={{ color: '#292524' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Their City / Town</label>
                    <input
                      type="text"
                      placeholder="e.g. Hyderabad"
                      value={member.city}
                      onChange={(e) => updateMember(idx, 'city', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
                      style={{ color: '#292524' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>
                    {member.relation}&apos;s WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210 (For automated reminders)"
                    value={member.phone || ''}
                    onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
                    style={{ color: '#292524' }}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addMember}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-stone-300 hover:border-stone-400 text-stone-500 hover:text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Another Person
            </button>
          </div>

          {/* Section 3 — Helper */}
          <div className="p-5 rounded-2xl space-y-4" style={{ background: '#FAF8F5', border: '1px solid #E7E5E4' }}>
            <span className="text-[11px] font-bold uppercase tracking-wider block" style={{ color: '#A8A29E' }}>
              3. Local Helper or Neighbour (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Helper / Driver Name</label>
                <input type="text" placeholder="e.g. Suresh Kumar"
                  value={helperName} onChange={(e) => setHelperName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400 transition-colors"
                  style={{ color: '#292524' }} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Helper Mobile Number</label>
                <input type="tel" placeholder="+91 98888 77777"
                  value={helperPhone} onChange={(e) => setHelperPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400 transition-colors"
                  style={{ color: '#292524' }} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Helper UPI ID (for instant direct payments)</label>
              <input type="text" placeholder="e.g. suresh@upi or 9888877777@paytm"
                value={helperUpi} onChange={(e) => setHelperUpi(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400 transition-colors"
                style={{ color: '#292524' }} />
              <p className="text-[11px] text-stone-400 mt-1">This UPI ID will appear automatically when paying the helper.</p>
            </div>
          </div>

          {/* Family name */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: '#78716C' }}>Family Display Name</label>
            <input type="text"
              placeholder={caregiverName ? `${caregiverName} Family` : 'e.g. Sharma Family'}
              value={familyName} onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-sm outline-none focus:border-stone-400 transition-colors"
              style={{ color: '#292524' }} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
            style={{ background: '#FFB7B2', color: '#292524' }}
          >
            <span>{loading ? 'Creating your family space...' : 'Create Family Space & Open Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <a href="/" className="text-xs font-medium hover:underline" style={{ color: '#A8A29E' }}>
              ← Back to home
            </a>
          </div>
        </form>
      </div>

      {/* Post-Registration Subscription & Trial Choice Modal */}
      <PostRegistrationTrialModal
        isOpen={!!createdFamily}
        familyName={createdFamily?.name || ''}
        onProceedToPlans={() => {
          if (createdFamily?.id) {
            router.push(`/subscribe?familyId=${createdFamily.id}`);
          } else {
            router.push('/subscribe');
          }
        }}
        onContinueTrial={() => {
          if (createdFamily?.id) {
            router.push(`/dashboard?familyId=${createdFamily.id}&welcome=1`);
          } else {
            router.push('/dashboard?welcome=1');
          }
        }}
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FDFCF8' }}>
        <div className="w-8 h-8 rounded-full animate-ping" style={{ background: '#FFB7B2' }} />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
