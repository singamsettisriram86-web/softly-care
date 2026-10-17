'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, AlertTriangle } from 'lucide-react';
import { FamilyMember } from '@/lib/types';

const RELATION_OPTIONS = ['Father', 'Mother', 'Brother', 'Sister', 'Grandfather', 'Grandmother', 'Others'];

interface Props {
  isOpen: boolean;
  member: FamilyMember | null;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

export default function EditMemberModal({ isOpen, member, onClose, onSaved, onDeleted }: Props) {
  const isHelper = member?.role === 'helper';
  const isCaregiver = member?.role === 'caregiver';

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Father');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [upiId, setUpiId] = useState('');
  const [helperType, setHelperType] = useState<'live_in' | 'visiting'>('visiting');
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  // Populate form when modal opens or member changes
  useEffect(() => {
    if (member && isOpen) {
      const cleanName = member.name.replace(/\s*\(.*?\)\s*$/, '').trim();
      setName(cleanName);
      setRelation(member.relation_type || 'Father');
      setCity(member.city || '');
      setPhone(member.phone ? member.phone.split('#upi:')[0] : '');
      setUpiId(member.upi_id || '');
      setHelperType(member.helper_type || 'visiting');
      setError('');
      setConfirmDelete(false);
    }
  }, [member, isOpen]);

  if (!isOpen || !member) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload: any = {
        action: 'update',
        memberId: member.id,
        name: name.trim(),
        city: city.trim(),
        phone: phone.trim(),
      };
      if (!isCaregiver && !isHelper) {
        payload.relation = relation;
      }
      if (isHelper) {
        payload.upi_id = upiId.trim();
        payload.helper_type = helperType;
      }

      const res = await fetch('/api/families', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to update');
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/families?memberId=${member.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to delete');
      onDeleted();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Could not delete member.');
    } finally {
      setDeleting(false);
    }
  };

  const displayRelation = member.relation_type
    || member.name.match(/\(([^)]+)\)/)?.[1]
    || (isHelper ? 'Helper' : isCaregiver ? 'Caregiver' : 'Member');

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 border border-stone-200 shadow-2xl relative">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
            {isHelper ? '🤝 Edit Local Helper' : isCaregiver ? '📱 Edit Caregiver' : '❤️ Edit Care Member'}
          </span>
          <h2 className="text-xl font-bold text-stone-900 mt-0.5">
            {member.name.replace(/\s*\(.*?\)\s*$/, '').trim()}
          </h2>
          <span className="text-xs font-semibold text-stone-500">Current role: {displayRelation}</span>
        </div>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* Relation pills — only for elder members */}
          {!isHelper && !isCaregiver && (
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
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
            />
          </div>

          {/* Phone Number for all roles */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">
              {isCaregiver
                ? 'Mobile Number *'
                : isHelper
                ? 'Mobile Number *'
                : 'Phone / WhatsApp Number'}
            </label>
            <input
              type="tel"
              placeholder="+91 98888 77777"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
            />
            {isCaregiver && (
              <p className="text-[11px] text-stone-400 mt-1">Used for caregiver alerts and updates.</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1.5">City / Town</label>
            <input
              type="text"
              placeholder="e.g. Hyderabad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
            />
          </div>

          {/* Helper-specific: Living Arrangement & UPI */}
          {isHelper && (
            <>
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

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">UPI ID (for payments)</label>
                <input
                  type="text"
                  placeholder="e.g. suresh@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-[#FFB7B2]/60 focus:border-transparent"
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="pt-1 space-y-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full text-sm font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              style={{ background: '#FFB7B2', color: '#292524' }}
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Delete — not for caregiver */}
            {!isCaregiver && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className={`w-full py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  confirmDelete
                    ? 'bg-red-600 text-white border-red-600 hover:bg-red-700'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                }`}
              >
                {confirmDelete ? (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {deleting ? 'Removing...' : 'Tap again to confirm removal'}
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove {isHelper ? 'Helper' : 'Member'}
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => { setConfirmDelete(false); onClose(); }}
              className="w-full py-2 text-stone-500 text-xs font-medium hover:text-stone-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
