'use client';

import React, { useState } from 'react';
import { X, Plus, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    dosage: string;
    schedule: string[];
    instructions: string;
  }) => Promise<void>;
}

export default function AddMedicationModal({ isOpen, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedTimes, setSelectedTimes] = useState<string[]>(['08:00']);
  const [customTime, setCustomTime] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const presetTimes = [
    { label: 'Morning (08:00 AM)', time: '08:00' },
    { label: 'Afternoon (02:00 PM)', time: '14:00' },
    { label: 'Evening (08:00 PM)', time: '20:00' },
    { label: 'Bedtime (10:00 PM)', time: '22:00' },
  ];

  const togglePreset = (t: string) => {
    if (selectedTimes.includes(t)) {
      if (selectedTimes.length > 1) {
        setSelectedTimes(selectedTimes.filter((x) => x !== t));
      }
    } else {
      setSelectedTimes([...selectedTimes, t]);
    }
  };

  const addCustomTime = () => {
    if (customTime && !selectedTimes.includes(customTime)) {
      setSelectedTimes([...selectedTimes, customTime]);
      setCustomTime('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || selectedTimes.length === 0) {
      setError('Please provide medicine name, dosage, and at least one time');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await onAdd({
        name: name.trim(),
        dosage: dosage.trim(),
        schedule: selectedTimes,
        instructions: instructions.trim(),
      });
      // reset form
      setName('');
      setDosage('');
      setSelectedTimes(['08:00']);
      setInstructions('');
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
              placeholder="e.g. Metformin or Amlodipine"
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

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Daily Schedule
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2">
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
            <div className="flex gap-2">
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="px-3 py-1.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
              />
              <button
                type="button"
                onClick={addCustomTime}
                className="px-3 py-1.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
              >
                + Add Custom Time
              </button>
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
