'use client';

import React from 'react';
import { ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

interface Props {
  totalMeds: number;
  takenTodayCount: number;
}

export default function MedicationAdherence({ totalMeds, takenTodayCount }: Props) {
  const percentage = totalMeds > 0 ? Math.round((takenTodayCount / totalMeds) * 100) : 100;

  return (
    <div className="bg-gradient-to-br from-white to-[#FAF8F5] rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-soft">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-softly-sage flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-800" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider">
              Peace of Mind Index
            </span>
            <h3 className="text-xl font-bold text-softly-text tracking-tight">
              Today’s Medication Adherence
            </h3>
          </div>
        </div>

        <div className="text-right flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-stone-800 tracking-tight">
            {percentage}%
          </span>
          <span className="text-xs text-softly-muted">
            ({takenTodayCount}/{totalMeds} logged)
          </span>
        </div>
      </div>

      {/* Progress Bar with Softly Colors */}
      <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-softly-coral transition-all duration-700 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-softly-muted">
        <span className="flex items-center gap-1 text-emerald-800 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          {percentage === 100
            ? 'All scheduled tablets confirmed today!'
            : `${totalMeds - takenTodayCount} remaining for today’s schedule`}
        </span>
        <span className="hidden sm:inline">WhatsApp sync enabled</span>
      </div>
    </div>
  );
}
