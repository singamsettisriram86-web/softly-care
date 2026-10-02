'use client';

import React, { useState } from 'react';
import { X, Calendar, MapPin, User, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    title: string;
    doctor_name: string;
    clinic_address: string;
    scheduled_at: string;
    helper_name: string;
    notes: string;
  }) => Promise<void>;
}

export default function AddAppointmentModal({ isOpen, onClose, onAdd }: Props) {
  const [title, setTitle] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00');
  const [helperName, setHelperName] = useState('Ramesh Kumar');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !doctorName.trim() || !date) {
      setError('Please provide appointment title, doctor name, and date');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      await onAdd({
        title: title.trim(),
        doctor_name: doctorName.trim(),
        clinic_address: clinicAddress.trim(),
        scheduled_at: scheduledAt,
        helper_name: helperName.trim(),
        notes: notes.trim(),
      });
      // reset
      setTitle('');
      setDoctorName('');
      setClinicAddress('');
      setDate('');
      setNotes('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add appointment');
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
      <div className="bg-white rounded-4xl max-w-md w-full p-6 sm:p-8 border border-stone-200 shadow-2xl relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <span className="text-xs uppercase font-bold text-softly-muted tracking-wider">
            Clinical Care
          </span>
          <h2 className="text-2xl font-bold text-softly-text tracking-tight">
            Schedule Doctor Appointment
          </h2>
          <p className="text-xs text-softly-muted mt-1">
            Generates Google Calendar invite and helper accompaniment checklist.
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
              Visit Purpose / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Monthly Cardiology Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Doctor Name & Specialization
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dr. Ashok Mehta (Cardiologist)"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Clinic Address / Hospital Name
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Hospital, Malviya Nagar, Jaipur"
              value={clinicAddress}
              onChange={(e) => setClinicAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Assigned Accompanying Helper
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Kumar"
              value={helperName}
              onChange={(e) => setHelperName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Medical Notes / Reports to Bring
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Take fasting blood sugar & previous lipid profile reports"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-softly-coral/60"
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
              {loading ? 'Scheduling...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
