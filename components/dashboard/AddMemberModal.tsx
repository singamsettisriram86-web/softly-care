'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

const RELATION_OPTIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Helper', 'Others'];

interface Props {
  isOpen: boolean;
  familyId: string;
  onClose: () => void;
  onAdded: () => void; // refresh dashboard after adding
}

export default function AddMemberModal({ isOpen, familyId, onClose, onAdded }: Props) {
  const [relation, setRelation] = useState('Father');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [helperType, setHelperType] = useState<'live_in' | 'visiting'>('visiting');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const reset = () => {
    setRelation('Father');
    setName('');
    setPhone('');
    setCity('');
    setHelperType('visiting');
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter the person\'s name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const isHelper = relation === 'Helper';
      const res = await fetch('/api/families', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          familyId,
          relation,
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          role: isHelper ? 'helper' : 'elder',
          helper_type: isHelper ? helperType : undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to add member');
      reset();
      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-stone-200 shadow-2xl relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">Care Circle</span>
          <h2 className="text-xl font-bold text-stone-900 mt-0.5">Add a Family Member</h2>
          <p className="text-xs text-stone-500 mt-1">Add your mother, brother, or anyone you're caring for.</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Relation pills */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-2">Relation Type</label>
            <div className="flex flex-wrap gap-1.5">
              {RELATION_OPTIONS.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setRelation(rel)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    relation === rel
                      ? 'border-transparent text-stone-800'
                      : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                  style={relation === rel ? { background: '#FFB7B2', borderColor: '#FFB7B2' } : {}}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              {relation}&apos;s Full Name *
            </label>
            <input
              type="text"
              required
              placeholder={`e.g. ${relation === 'Father' ? 'Rajesh Kumar' : relation === 'Mother' ? 'Sunita Devi' : 'Full name'}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              Phone / WhatsApp Number (optional)
            </label>
            <input
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
            />
          </div>

          {relation === 'Helper' && (
            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                Helper Living Arrangement
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHelperType('visiting')}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    helperType === 'visiting'
                      ? 'border-stone-800 bg-stone-900 text-white shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🚗</span>
                  <span className="text-xs font-bold block">Visiting Helper</span>
                  <span className={`text-[10px] block mt-0.5 leading-tight ${
                    helperType === 'visiting' ? 'text-stone-300' : 'text-stone-400'
                  }`}>
                    Tasks & chores only
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setHelperType('live_in')}
                  className={`p-2.5 rounded-2xl text-left border transition-all ${
                    helperType === 'live_in'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-sm'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span className="text-base block mb-0.5">🏠</span>
                  <span className="text-xs font-bold block">Live-in Caregiver</span>
                  <span className="text-[10px] block mt-0.5 leading-tight text-emerald-700">
                    Receives WhatsApp meds alerts & can reply DONE
                  </span>
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              Their City / Town
            </label>
            <input
              type="text"
              placeholder="e.g. Hyderabad, Jaipur"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
            />
          </div>

          <div className="pt-1 flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 rounded-full text-stone-600 text-xs font-medium hover:bg-stone-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: '#FFB7B2', color: '#292524' }}
            >
              <Plus className="w-3.5 h-3.5" />
              {loading ? 'Adding...' : `Add ${relation}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
