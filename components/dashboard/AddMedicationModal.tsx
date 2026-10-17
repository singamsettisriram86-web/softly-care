'use client';

import React, { useState } from 'react';
import { X, Plus, Clock } from 'lucide-react';
import { FamilyMember } from '@/lib/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  careMembers?: FamilyMember[]; // elder members to assign medication to
  defaultMemberId?: string;
  defaultHelperName?: string;
  onAdd: (data: {
    name: string;
    dosage: string;
    schedule: string[];
    instructions: string;
    for_member_id?: string;
    for_member_name?: string;
  }) => Promise<void>;
}

export default function AddMedicationModal({
  isOpen,
  onClose,
  onAdd,
  careMembers = [],
  defaultMemberId,
  defaultHelperName,
}: Props) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['08:00']);
  const [customTime, setCustomTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [forMemberId, setForMemberId] = useState<string>(defaultMemberId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync default member when modal opens
  React.useEffect(() => {
    if (isOpen && defaultMemberId) {
      setForMemberId(defaultMemberId);
    }
  }, [isOpen, defaultMemberId]);

  // Only show elder (care) members in the selector
  const elderMembers = careMembers.filter((m) => m.role === 'elder');

  if (!isOpen) return null;

  const presetTimes = [
    { label: 'Morning (08:00 AM)', time: '08:00' },
    { label: 'Afternoon (02:00 PM)', time: '14:00' },
    { label: 'Evening (08:00 PM)', time: '20:00' },
    { label: 'Bedtime (10:00 PM)', time: '22:00' },
  ];

  const formatTimeDisplay = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length < 2) return timeStr;
    const h = parseInt(parts[0], 10);
    const m = parts[1];
    if (isNaN(h)) return timeStr;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 || 12;
    return `${displayHour}:${m} ${period}`;
  };

  const togglePreset = (t: string) => {
    if (selectedTimes.includes(t)) {
      if (selectedTimes.length > 1) {
        setSelectedTimes(selectedTimes.filter((x) => x !== t));
      }
    } else {
      setSelectedTimes([...selectedTimes, t].sort());
    }
  };

  const addCustomTime = () => {
    if (customTime && !selectedTimes.includes(customTime)) {
      setSelectedTimes([...selectedTimes, customTime].sort());
      setCustomTime('');
    }
  };

  const removeTime = (t: string) => {
    if (selectedTimes.length > 1) {
      setSelectedTimes(selectedTimes.filter((x) => x !== t));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || selectedTimes.length === 0) {
      setError('Please provide medicine name, dosage, and at least one time');
      return;
    }

    const selectedMember = elderMembers.find((m) => m.id === forMemberId);

    setLoading(true);
    setError('');
    try {
      await onAdd({
        name: name.trim(),
        dosage: dosage.trim(),
        schedule: selectedTimes,
        instructions: instructions.trim(),
        for_member_id: selectedMember?.id,
        for_member_name: selectedMember?.name,
      });
      // reset form
      setName('');
      setDosage('');
      setSelectedTimes(['08:00']);
      setCustomTime('');
      setInstructions('');
      setForMemberId('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add medication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-4xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase font-bold text-softly-muted tracking-wider">
            Daily Routine
          </span>
          <h2 className="text-2xl font-bold text-softly-text tracking-tight">
            Add New Medication
          </h2>
          <p className="text-xs text-softly-muted mt-1">
            Care schedule will sync to WhatsApp reminders and Helper checklist.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Medication Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metformin or Telmisartan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Dosage & Unit
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 500mg or 1 Tablet"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          {/* Who is this for? */}
          {elderMembers.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Who is this for?
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setForMemberId('')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    forMemberId === ''
                      ? 'border-transparent text-stone-800'
                      : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                  style={forMemberId === '' ? { background: '#E8EFE8', borderColor: '#D6E4D6' } : {}}
                >
                  Everyone / General
                </button>
                {elderMembers.map((m) => {
                  const label = m.relation_type ? `${m.name} (${m.relation_type})` : m.name;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setForMemberId(m.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        forMemberId === m.id
                          ? 'border-transparent text-stone-800'
                          : 'bg-white border-stone-200 text-stone-500 hover:border-stone-300'
                      }`}
                      style={forMemberId === m.id ? { background: '#FFB7B2', borderColor: '#FFB7B2' } : {}}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Daily Schedule
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {presetTimes.map((preset) => {
                const active = selectedTimes.includes(preset.time);
                return (
                  <button
                    key={preset.time}
                    type="button"
                    onClick={() => togglePreset(preset.time)}
                    className={`px-3 py-2 rounded-2xl text-xs font-medium text-left border transition-all ${
                      active
                        ? 'bg-softly-coral text-softly-text border-softly-coral shadow-sm'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Time Input */}
            <div className="p-3 bg-stone-50/80 rounded-2xl border border-stone-200/80 mb-3 space-y-2">
              <span className="text-[11px] font-semibold text-stone-600 block">
                Add Any Specific Time:
              </span>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-medium"
                />
                <button
                  type="button"
                  onClick={addCustomTime}
                  disabled={!customTime}
                  className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all disabled:opacity-40"
                >
                  + Add This Time
                </button>
              </div>
            </div>

            {/* Active Schedule Badges Display */}
            <div>
              <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                Scheduled Reminder Times ({selectedTimes.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTimes.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    <Clock className="w-3 h-3 text-emerald-600" />
                    <span>{formatTimeDisplay(t)}</span>
                    {selectedTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTime(t)}
                        className="w-3.5 h-3.5 rounded-full hover:bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold"
                        title="Remove time"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Take immediately after breakfast with warm water"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-stone-600 text-xs font-medium hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-full bg-softly-text text-white text-xs font-semibold shadow-soft hover:bg-stone-800 active:scale-95 transition-all"
            >
              {loading ? 'Adding...' : 'Save Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
