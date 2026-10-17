'use client';

import React, { useState, useEffect } from 'react';
import { Family, FamilyMember, Medication, MedicationLog, HelperTask } from '@/lib/types';
import { Check, CheckCircle2, Circle, Clock, Phone, AlertTriangle, Pill } from 'lucide-react';
import Link from 'next/link';

interface Props {
  pin?: string;
}

export default function HelperDailyChecklist({ pin }: Props) {
  const [family, setFamily] = useState<Family | null>(null);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [tasks, setTasks] = useState<HelperTask[]>([]);
  const [loadingMedId, setLoadingMedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      // 1. Fetch family and its members by PIN
      const effectivePin = pin || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('pin') : null) || 'CARE-7892';
      const famRes = await fetch(`/api/families?pin=${encodeURIComponent(effectivePin)}`);
      const famData = await famRes.json();

      if (famData.success && famData.family) {
        setFamily(famData.family);
        const familyMembers: FamilyMember[] = famData.members || [];
        setMembers(familyMembers);

        const famId = famData.family.id;
        // 2. Fetch medications, logs, tasks for this exact family
        const [medsRes, logsRes, tasksRes] = await Promise.all([
          fetch(`/api/medications?familyId=${famId}`),
          fetch(`/api/medications/logs?familyId=${famId}`),
          fetch(`/api/tasks?familyId=${famId}`),
        ]);
        const [medsData, logsData, tasksData] = await Promise.all([
          medsRes.json(),
          logsRes.json(),
          tasksRes.json(),
        ]);

        if (medsData.success && medsData.medications) setMedications(medsData.medications);
        if (logsData.success && logsData.logs) setLogs(logsData.logs);
        if (tasksData.success && tasksData.tasks) setTasks(tasksData.tasks);
      }
    } catch (e) {
      console.error('Error fetching helper portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pin]);

  const activeHelper = members.find((m) => m.role === 'helper');
  const caregiver = members.find((m) => m.role === 'caregiver');
  const parents = members.filter((m) => m.role === 'elder');

  const helperDisplayName = activeHelper
    ? activeHelper.name.replace(/\s*\(.*\)/, '').trim()
    : 'Local Helper';
  const helperInitial = helperDisplayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HP';

  const parentsDisplay = parents.length > 0
    ? parents.map((p) => p.name.replace(/\s*\(.*\)/, '').trim()).join(parents.length === 2 ? ' & ' : ', ')
    : 'Loved Ones';

  const caregiverName = caregiver?.name ? caregiver.name.split(' ')[0] : 'Caregiver';
  const caregiverPhone = caregiver?.phone || '+919999999999';
  const caregiverCity = caregiver?.city || '';

  const handleMarkGiven = async (medId: string) => {
    setLoadingMedId(medId);
    try {
      const res = await fetch('/api/medications/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication_id: medId,
          family_id: family?.id,
          taken_by_name: `${helperDisplayName} (Helper)`,
          status: 'taken',
          channel: 'app',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } finally {
      setLoadingMedId(null);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, completed }),
    });
    const data = await res.json();
    if (data.success) {
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto p-6 text-center text-xs text-stone-400">
        Loading helper space...
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 space-y-6">
      {/* Helper Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-softly-sage flex items-center justify-center font-bold text-lg text-stone-800">
              {helperInitial}
            </div>
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Local Care Partner
              </span>
              <h1 className="text-xl font-bold text-softly-text tracking-tight">
                {helperDisplayName}
              </h1>
              <p className="text-xs text-stone-500">
                {family?.name || 'Family Space'} {activeHelper?.city ? `· ${activeHelper.city}` : ''}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
            Active
          </span>
        </div>

        <div className="text-xs text-stone-600 bg-stone-50 rounded-2xl p-3 border border-stone-100 flex items-center justify-between">
          <span>Assisting: <strong>{parentsDisplay}</strong></span>
          <Link href={family ? `/dashboard?familyId=${family.id}` : '/dashboard'} className="text-stone-500 hover:text-stone-900 underline text-[11px]">
            Caregiver Hub
          </Link>
        </div>
      </div>

      {/* Emergency Quick Dial */}
      <div className="bg-rose-50 border border-rose-200/70 rounded-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-800">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-rose-900">Caregiver Contact ({caregiverName})</p>
            <p className="text-[11px] text-rose-700">
              {caregiverPhone} {caregiverCity ? `(${caregiverCity})` : ''}
            </p>
          </div>
        </div>
        <a
          href={`tel:${caregiverPhone}`}
          className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-sm hover:bg-rose-700 transition-colors"
        >
          Call
        </a>
      </div>

      {/* 1. Today's Medicine Checklist */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-softly-text flex items-center gap-2">
            <Pill className="w-4 h-4 text-stone-600" />
            <span>Today’s Tablet Checklist</span>
          </h2>
          <span className="text-xs text-stone-400">1-Tap Confirmation</span>
        </div>

        {medications.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
            No scheduled tablets for {family?.name || 'this family'} today.
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => {
              const isTaken = logs.some(
                (l) => l.medication_id === med.id && l.status === 'taken'
              );
              const isLoading = loadingMedId === med.id;

              return (
                <div
                  key={med.id}
                  className={`p-4 rounded-3xl border transition-all duration-300 ${
                    isTaken
                      ? 'bg-emerald-50/70 border-emerald-200 shadow-xs'
                      : 'bg-white border-stone-200/90 shadow-soft'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="font-bold text-base text-stone-800 tracking-tight">
                        {med.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-stone-500 font-medium">
                          Dosage: {med.dosage}
                        </span>
                        {med.for_member_name && (
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE4E1] text-[#8C3330] border border-[#FFB7B2]/40">
                            Give to: {med.for_member_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-softly-lavender font-semibold text-stone-700">
                      {med.schedule.join(', ')}
                    </span>
                  </div>

                  {med.instructions && (
                    <p className="text-xs text-stone-600 mb-3 bg-stone-50/80 p-2 rounded-xl">
                      👉 {med.instructions}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={isTaken || isLoading}
                    onClick={() => handleMarkGiven(med.id)}
                    className={`w-full py-3 rounded-2xl font-bold text-xs shadow-soft transition-all duration-200 flex items-center justify-center gap-2 ${
                      isTaken
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-softly-coral hover:bg-[#ffa8a2] active:scale-98 text-softly-text'
                    }`}
                  >
                    {isLoading ? (
                      'Recording...'
                    ) : isTaken ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Confirmed Given Today</span>
                      </>
                    ) : (
                      <span>Tap to Confirm Tablet Given</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Errands and Local Helper Tasks */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-softly-text">
          Assigned Errands & Accompaniment
        </h2>

        {tasks.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
            No errands assigned for {helperDisplayName} today.
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id, !task.completed)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-start gap-3 transition-colors ${
                  task.completed
                    ? 'bg-stone-100 border-stone-200 opacity-60'
                    : 'bg-white border-stone-200/90 shadow-xs hover:border-stone-300'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-stone-400 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${
                        task.completed ? 'line-through text-stone-400' : 'text-stone-800'
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.for_member_name && (
                      <span className="shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFE4E1] text-[#8C3330] border border-[#FFB7B2]/40">
                        For: {task.for_member_name}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-stone-500 mt-0.5">{task.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
