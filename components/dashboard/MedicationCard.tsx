'use client';

import React, { useState } from 'react';
import { Medication, MedicationLog } from '@/lib/types';
import { Check, Clock, AlertCircle, Pill } from 'lucide-react';

interface Props {
  medication: Medication;
  latestLog?: MedicationLog;
  onLogTaken: (medId: string) => Promise<void>;
  onTriggerAlert: (med: Medication) => void;
}

export default function MedicationCard({
  medication,
  latestLog,
  onLogTaken,
  onTriggerAlert,
}: Props) {
  const [loading, setLoading] = useState(false);

  const isTakenToday = latestLog && latestLog.status === 'taken';

  const handleMarkTaken = async () => {
    setLoading(true);
    try {
      await onLogTaken(medication.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft hover:shadow-floating transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-softly-sage/70 flex items-center justify-center text-stone-700">
              <Pill className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-softly-text tracking-tight">
                {medication.name}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                  {medication.dosage}
                </span>
                {medication.for_member_name && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE4E1] text-[#8C3330] border border-[#FFB7B2]/40">
                    For: {medication.for_member_name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Badges */}
          <div className="flex flex-wrap gap-1.5 justify-end">
            {medication.schedule.map((time, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-softly-lavender text-stone-700 border border-stone-200/50 flex items-center gap-1"
              >
                <Clock className="w-3 h-3 text-stone-500" />
                {time}
              </span>
            ))}
          </div>
        </div>

        {medication.instructions && (
          <p className="text-xs text-softly-muted leading-relaxed mb-4 pl-1">
            {medication.instructions}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2.5">
        {/* Status Indicator */}
        <div className="text-xs">
          {isTakenToday ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5" /> Taken today
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-stone-500">
              <Clock className="w-3.5 h-3.5" /> Due today
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Test WhatsApp trigger button */}
          <button
            type="button"
            onClick={() => onTriggerAlert(medication)}
            className="text-[11px] font-medium px-2.5 py-1.5 rounded-full bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 transition-colors"
            title="Trigger test WhatsApp alert for this medication"
          >
            💬 Trigger WhatsApp
          </button>

          {/* 1-tap Mark Taken */}
          <button
            type="button"
            disabled={loading || isTakenToday}
            onClick={handleMarkTaken}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm ${
              isTakenToday
                ? 'bg-stone-100 text-stone-400 cursor-default'
                : 'bg-softly-coral hover:bg-[#ffa8a2] active:scale-95 text-softly-text'
            }`}
          >
            {loading ? 'Saving...' : isTakenToday ? 'Completed' : 'Mark Taken'}
          </button>
        </div>
      </div>
    </div>
  );
}
