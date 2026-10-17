'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Family, FamilyMember, Medication, MedicationLog, Appointment, HelperTask, HelperPayment } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MedicationAdherence from '@/components/dashboard/MedicationAdherence';
import MedicationCard from '@/components/dashboard/MedicationCard';
import AddMedicationModal from '@/components/dashboard/AddMedicationModal';
import AppointmentCard from '@/components/dashboard/AppointmentCard';
import AddAppointmentModal from '@/components/dashboard/AddAppointmentModal';
import AddMemberModal from '@/components/dashboard/AddMemberModal';
import EditMemberModal from '@/components/dashboard/EditMemberModal';
import HelperTaskList from '@/components/dashboard/HelperTaskList';
import CashfreePayModal from '@/components/dashboard/CashfreePayModal';
import SubscriptionUpgradeModal from '@/components/dashboard/SubscriptionUpgradeModal';
import WhatsAppSimulatorDrawer from '@/components/dashboard/WhatsAppSimulatorDrawer';
import RegisterFamilyModal from '@/components/RegisterFamilyModal';
import { Plus, Pill, Calendar, HeartHandshake, UserPlus, Pencil, Sparkles } from 'lucide-react';

const getRelationEmoji = (relation?: string) => {
  const r = (relation || '').toLowerCase();
  if (r.includes('father') || r.includes('dad')) return '👨';
  if (r.includes('mother') || r.includes('mom')) return '👩';
  if (r.includes('sister')) return '👧';
  if (r.includes('brother')) return '👦';
  if (r.includes('grandfather') || r.includes('grandpa')) return '👴';
  if (r.includes('grandmother') || r.includes('grandma')) return '👵';
  return '👤';
};

function CaregiverDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryFamilyId = searchParams?.get('familyId');

  const [families, setFamilies] = useState<Family[]>([]);
  const [activeFamilyId, setActiveFamilyId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('familyId');
      if (q) return q;
      const stored = localStorage.getItem('softly_active_family_id');
      if (stored) return stored;
    }
    return '';
  });

  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<HelperTask[]>([]);
  const [payments, setPayments] = useState<HelperPayment[]>([]);

  const [members, setMembers] = useState<FamilyMember[]>([]);

  // Modals state
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddApptOpen, setIsAddApptOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [payHelperName, setPayHelperName] = useState('Local Helper');
  const [payHelperUpi, setPayHelperUpi] = useState('');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'all' | 'medications' | 'appointments' | 'helper'>('all');

  const fetchAllData = async (familyIdToUse?: string) => {
    try {
      // 1. Fetch all families
      const famsRes = await fetch('/api/families');
      const famsData = await famsRes.json();
      const availableFamilies: Family[] = famsData.success && famsData.families ? famsData.families : [];
      setFamilies(availableFamilies);

      // Determine which family ID to use
      let targetFamilyId = familyIdToUse;
      if (!targetFamilyId && typeof window !== 'undefined') {
        const stored = localStorage.getItem('softly_active_family_id');
        if (stored && availableFamilies.some((f) => f.id === stored)) {
          targetFamilyId = stored;
        }
      }
      if (!targetFamilyId && activeFamilyId && availableFamilies.some((f) => f.id === activeFamilyId)) {
        targetFamilyId = activeFamilyId;
      }
      if (!targetFamilyId) {
        // Pick first available family
        targetFamilyId = availableFamilies[0]?.id || '';
      }

      setActiveFamilyId(targetFamilyId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('softly_active_family_id', targetFamilyId);
      }

      // 2. Fetch this specific family's details, members, meds, logs, appointments, tasks, payments
      const [memsRes, medsRes, logsRes, apptsRes, tasksRes, payRes] = await Promise.all([
        fetch(`/api/families?familyId=${targetFamilyId}`),
        fetch(`/api/medications?familyId=${targetFamilyId}`),
        fetch(`/api/medications/logs?familyId=${targetFamilyId}`),
        fetch(`/api/appointments?familyId=${targetFamilyId}`),
        fetch(`/api/tasks?familyId=${targetFamilyId}`),
        fetch(`/api/payments?familyId=${targetFamilyId}`),
      ]);

      const [memsData, medsData, logsData, apptsData, tasksData, payData] = await Promise.all([
        memsRes.json(),
        medsRes.json(),
        logsRes.json(),
        apptsRes.json(),
        tasksRes.json(),
        payRes.json(),
      ]);

      setMembers(memsData.success && memsData.members ? memsData.members : []);
      setMedications(medsData.success && medsData.medications ? medsData.medications : []);
      setLogs(logsData.success && logsData.logs ? logsData.logs : []);
      setAppointments(apptsData.success && apptsData.appointments ? apptsData.appointments : []);
      setTasks(tasksData.success && tasksData.tasks ? tasksData.tasks : []);
      setPayments(payData.success && payData.payments ? payData.payments : []);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useEffect(() => {
    if (queryFamilyId) {
      setActiveFamilyId(queryFamilyId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('softly_active_family_id', queryFamilyId);
      }
      fetchAllData(queryFamilyId);
    } else {
      fetchAllData();
    }
  }, [queryFamilyId]);

  const handleSelectFamily = (id: string) => {
    setActiveFamilyId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('softly_active_family_id', id);
    }
    fetchAllData(id);
  };

  // Handlers
  const handleLogTaken = async (medId: string) => {
    try {
      const res = await fetch('/api/medications/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication_id: medId,
          family_id: activeFamilyId,
          taken_by_name: 'Caregiver',
          status: 'taken',
          channel: 'app',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData(activeFamilyId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerWhatsApp = async (med: Medication) => {
    try {
      await fetch('/api/reminders/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medicationId: med.id,
          to: '+919123456789',
          familyId: activeFamilyId,
        }),
      });
      setIsSimulatorOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMedication = async (data: {
    name: string;
    dosage: string;
    schedule: string[];
    instructions: string;
    for_member_id?: string;
    for_member_name?: string;
  }) => {
    const res = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, family_id: activeFamilyId }),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData(activeFamilyId);
    }
  };

  const handleAddAppointment = async (data: {
    title: string;
    doctor_name: string;
    clinic_address: string;
    scheduled_at: string;
    helper_name: string;
    notes: string;
    for_member_id?: string;
    for_member_name?: string;
  }) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, family_id: activeFamilyId }),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData(activeFamilyId);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    const res = await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, completed }),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData(activeFamilyId);
    }
  };

  const handleAddTask = async (title: string, description?: string, forMemberId?: string, forMemberName?: string) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        family_id: activeFamilyId,
        assigned_to: 'Local Helper',
        for_member_id: forMemberId,
        for_member_name: forMemberName,
      }),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData(activeFamilyId);
    }
  };

  const caregiverMember = members.find((m) => m.role === 'caregiver');
  const parentMembers = members.filter((m) => m.role === 'elder');
  const activeHelper = members.find((m) => m.role === 'helper');
  const helperDisplayName = activeHelper
    ? activeHelper.name.replace(/\s*\(.*\)/, '').trim()
    : 'Local Helper';
  const helperCity = activeHelper?.city || '';
  const helperUpi = activeHelper?.upi_id || '';

  const handleOpenPay = (name?: string, upi?: string) => {
    setPayHelperName(name || helperDisplayName);
    setPayHelperUpi(upi || helperUpi);
    setIsPayModalOpen(true);
  };

  const activeFamily = families.find((f) => f.id === activeFamilyId) || families[0] || null;

  // Person-focused space state
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  useEffect(() => {
    if (!selectedMemberId && parentMembers.length > 0) {
      setSelectedMemberId(parentMembers[0].id);
    }
  }, [parentMembers, selectedMemberId]);

  const selectedMember = parentMembers.find((m) => m.id === selectedMemberId);
  const selectedCleanName = selectedMember
    ? selectedMember.name.replace(/\s*\(.*?\)\s*$/, '').trim()
    : '';
  const selectedRelation = selectedMember
    ? selectedMember.relation_type || selectedMember.name.match(/\(([^)]+)\)/)?.[1] || 'Loved One'
    : '';
  const selectedMemberEmoji = selectedMember ? getRelationEmoji(selectedRelation) : '🏡';

  // Compute displayed medications based on selected person
  const displayedMedications = React.useMemo(() => {
    if (!selectedMember) return medications;
    const memberClean = selectedCleanName.toLowerCase();
    const relLower = selectedRelation.toLowerCase();

    return medications.filter((m) => {
      if (m.for_member_id) {
        return m.for_member_id === selectedMember.id;
      }
      if (m.for_member_name) {
        const forLower = m.for_member_name.toLowerCase();
        if (forLower.includes(memberClean) || memberClean.includes(forLower)) return true;
        if (relLower && forLower.includes(relLower)) return true;
        return false;
      }
      if (parentMembers.length === 1) return true;
      return false;
    });
  }, [medications, selectedMember, selectedCleanName, selectedRelation, parentMembers.length]);

  const displayedLogs = React.useMemo(() => {
    if (!selectedMember) return logs;
    const medIds = new Set(displayedMedications.map((m) => m.id));
    return logs.filter((l) => medIds.has(l.medication_id));
  }, [logs, displayedMedications, selectedMember]);

  const displayedTakenTodayCount = displayedLogs.filter((l) => l.status === 'taken').length;

  const getMemberMedCount = (member: FamilyMember) => {
    const memberClean = member.name.replace(/\s*\(.*?\)\s*$/, '').trim().toLowerCase();
    const rel = (member.relation_type || member.name.match(/\(([^)]+)\)/)?.[1] || '').toLowerCase();
    return medications.filter((m) => {
      if (m.for_member_id) return m.for_member_id === member.id;
      if (m.for_member_name) {
        const forLower = m.for_member_name.toLowerCase();
        return forLower.includes(memberClean) || (rel && forLower.includes(rel));
      }
      if (parentMembers.length === 1) return true;
      return false;
    }).length;
  };

  return (
    <div className="min-h-screen bg-softly-bg text-softly-text pb-20">
      {/* Sticky Caregiver Header with Family Switcher */}
      <DashboardHeader
        familyName={activeFamily?.name || 'My Family'}
        inviteCode={activeFamily?.invite_code || ''}
        activeFamilyId={activeFamily?.id || ''}
        families={families}
        onSelectFamily={handleSelectFamily}
        onOpenRegister={() => router.push('/register')}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Banner with Registration Shortcut & Trial Status */}
        <div className="bg-white/80 border border-stone-200/80 rounded-3xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-softly-coral/40 flex items-center justify-center text-sm">
              🏡
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-xs font-bold text-stone-800">
                  Viewing Space for: <span className="underline">{activeFamily?.name || 'Your Family'}</span>
                </p>
                {/* Subscription Status Pill */}
                {activeFamily?.subscription_status === 'active' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Premium Active
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFE4E1] text-[#8C3330] text-[10px] font-bold border border-[#FFB7B2]/40">
                    {(() => {
                      if (!activeFamily?.trial_ends_at) return '3-Day Free Trial';
                      const msLeft = new Date(activeFamily.trial_ends_at).getTime() - Date.now();
                      if (msLeft <= 0) return 'Trial Ended (WhatsApp Paused)';
                      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
                      return `${daysLeft} Day${daysLeft > 1 ? 's' : ''} Left in Trial`;
                    })()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Helper Access Code: <strong>{activeFamily?.invite_code || 'Register first'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFamily?.subscription_status !== 'active' && (
              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-softly-coral hover:bg-[#ffa8a2] text-softly-text text-xs font-bold shadow-soft active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Upgrade (₹299/mo)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-soft active:scale-95 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Member</span>
            </button>
          </div>
        </div>

        {/* Care Circle & Member Space Switcher */}
        <div className="bg-white/90 backdrop-blur-sm border border-stone-200/80 rounded-3xl p-5 sm:p-6 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🌿</span>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-stone-900">
                  {activeFamily?.name || 'Your Family'} — Loved Ones & Spaces
                </h3>
                <p className="text-xs text-stone-500">
                  Click any family member below to switch into their individual dashboard
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddMemberOpen(true)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-900 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Family Member</span>
              </button>
            </div>
          </div>

          {/* Member Spaces Switcher Cards */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Select Person&apos;s Dashboard
              </span>
              {selectedMember && (
                <span className="text-xs font-semibold text-stone-600">
                  Currently Viewing: <strong className="text-stone-900">{selectedMemberEmoji} {selectedCleanName} ({selectedRelation})</strong>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {parentMembers.map((p) => {
                const cleanName = p.name.replace(/\s*\(.*?\)\s*$/, '').trim();
                const relationBadge = p.relation_type || (p.name.match(/\(([^)]+)\)/)?.[1] || 'Family');
                const emoji = getRelationEmoji(relationBadge);
                const isSelected = selectedMemberId === p.id;
                const medCount = getMemberMedCount(p);

                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#FFF0EE] border-[#FFB7B2] shadow-sm ring-2 ring-[#FFB7B2]'
                        : 'bg-stone-50/90 border-stone-200 hover:bg-white hover:border-stone-300 shadow-xs'
                    }`}
                  >
                    {/* Edit button top-right */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setEditingMember(p); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 shadow-xs transition-all z-10"
                      title="Edit member"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>

                    {/* Card body — clicking selects */}
                    <button
                      type="button"
                      onClick={() => setSelectedMemberId(p.id)}
                      className="text-left p-4 flex flex-col flex-1 w-full"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{emoji}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isSelected
                                ? 'bg-[#FFB7B2] text-stone-900'
                                : 'bg-stone-200/70 text-stone-600'
                            }`}
                          >
                            {relationBadge}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-stone-900 tracking-tight leading-snug pr-6">
                          {cleanName}
                        </h4>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {p.city ? `Hometown: ${p.city}` : 'Family Member'}
                          {p.phone ? ` • ${p.phone.split('#upi:')[0]}` : ''}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                        <span className="text-xs font-semibold text-stone-600">
                          💊 {medCount} {medCount === 1 ? 'Med' : 'Meds'}
                        </span>
                        <span
                          className={`text-[11px] font-bold ${
                            isSelected ? 'text-[#C94D48]' : 'text-stone-400 group-hover:text-stone-700'
                          }`}
                        >
                          {isSelected ? '● Active' : 'Open →'}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}

              {/* All Members Combined Option */}
              <button
                type="button"
                onClick={() => setSelectedMemberId('all')}
                className={`text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group ${
                  selectedMemberId === 'all'
                    ? 'bg-[#FFF0EE] border-[#FFB7B2] shadow-sm ring-2 ring-[#FFB7B2]'
                    : 'bg-stone-50/90 border-stone-200 hover:bg-white hover:border-stone-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🏡</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200/70 text-stone-600 uppercase tracking-wider">
                      All
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-stone-900 tracking-tight leading-snug">
                    All Family Combined
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Combined view of all members
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600">
                    💊 {medications.length} Total Meds
                  </span>
                  <span
                    className={`text-[11px] font-bold ${
                      selectedMemberId === 'all' ? 'text-[#C94D48]' : 'text-stone-400 group-hover:text-stone-700'
                    }`}
                  >
                    {selectedMemberId === 'all' ? '● Active Space' : 'Open Space →'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Caregiver & Local Helper summary strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
            {/* Caregiver Info */}
            <div className="bg-stone-50/70 rounded-2xl p-3 border border-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">📱</span>
                <div className="text-xs">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Remote Caregiver
                  </span>
                  <p className="font-bold text-stone-800">{caregiverMember?.name || 'Caregiver'}</p>
                  <p className="text-[11px] text-stone-500">
                    {caregiverMember?.city} {caregiverMember?.phone ? `• ${caregiverMember.phone.split('#upi:')[0]}` : ''}
                  </p>
                </div>
              </div>
              {caregiverMember && (
                <button
                  type="button"
                  onClick={() => setEditingMember(caregiverMember)}
                  className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all shrink-0"
                  title="Edit caregiver details"
                >
                  <Pencil className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Helper Info */}
            <div className="bg-stone-50/70 rounded-2xl p-3 border border-stone-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl shrink-0">
                  {activeHelper?.helper_type === 'live_in' ? '🏠' : '🤝'}
                </span>
                <div className="text-xs min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      {activeHelper?.helper_type === 'live_in' ? 'Live-in Caregiver' : 'Visiting Helper'}
                    </span>
                    {activeHelper?.helper_type === 'live_in' ? (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        Receives Meds Alerts
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-stone-200/70 text-stone-600 font-semibold">
                        Tasks & Chores
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-stone-800 truncate mt-0.5">{helperDisplayName}</p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {activeHelper?.phone?.split('#upi:')[0] || 'On call'}
                    {activeHelper?.upi_id ? ` • UPI: ${activeHelper.upi_id}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {activeHelper && (
                  <>
                    <button
                      type="button"
                      onClick={() => setEditingMember(activeHelper)}
                      className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all"
                      title="Edit helper details"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenPay(helperDisplayName, helperUpi)}
                      className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold"
                    >
                      Pay via UPI →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Adherence Index Progress Banner */}
        <MedicationAdherence
          totalMeds={displayedMedications.length}
          takenTodayCount={displayedTakenTodayCount}
          title={
            selectedMember
              ? `${selectedCleanName}’s Medication Adherence`
              : 'Today’s Medication Adherence'
          }
        />

        {/* View Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar border-b border-stone-200 pb-2 text-xs font-semibold text-stone-500">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'all'
                ? 'bg-softly-text text-white shadow-sm'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            All Sanctuary Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('medications')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'medications'
                ? 'bg-softly-text text-white shadow-sm'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Medications ({displayedMedications.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'bg-softly-text text-white shadow-sm'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Appointments ({appointments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('helper')}
            className={`px-4 py-2 rounded-full transition-all flex items-center gap-1.5 ${
              activeTab === 'helper'
                ? 'bg-softly-text text-white shadow-sm'
                : 'hover:bg-stone-100 text-stone-600'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Helper Tasks & Cashfree</span>
          </button>
        </div>

        {/* 1. Medications Section */}
        {(activeTab === 'all' || activeTab === 'medications') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
                  {selectedMember ? `${selectedMemberEmoji} Personal Health Rhythm` : 'Daily Rhythm'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-softly-text tracking-tight flex items-center gap-2">
                  <span>
                    {selectedMember
                      ? `${selectedCleanName}’s Medication Routine`
                      : 'Medication Routine'}
                  </span>
                  {selectedMember && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-softly-coral/30 text-stone-800">
                      {selectedRelation}
                    </span>
                  )}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddMedOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-95 text-softly-text text-xs font-semibold shadow-soft transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {selectedMember ? `Add Medication for ${selectedCleanName}` : 'Add Medication'}
                </span>
              </button>
            </div>

            {displayedMedications.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-soft">
                <p className="text-stone-500 text-sm mb-3">
                  {selectedMember
                    ? `No medications added yet for ${selectedCleanName} (${selectedRelation}).`
                    : `No medications added yet for ${activeFamily?.name || 'your family'}.`}
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddMedOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-softly-coral text-softly-text text-xs font-bold shadow-soft hover:bg-[#ffa8a2]"
                >
                  {selectedMember
                    ? `+ Add ${selectedCleanName}’s First Medication`
                    : '+ Add First Medication'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedMedications.map((med) => {
                  const latestLog = logs.find((l) => l.medication_id === med.id);
                  return (
                    <MedicationCard
                      key={med.id}
                      medication={med}
                      latestLog={latestLog}
                      onLogTaken={handleLogTaken}
                      onTriggerAlert={handleTriggerWhatsApp}
                    />
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* 2. Doctor Appointments Section */}
        {(activeTab === 'all' || activeTab === 'appointments') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
                  Clinical Visits
                </span>
                <h2 className="text-xl font-bold text-softly-text tracking-tight">
                  Doctor Appointments
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddApptOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule Visit</span>
              </button>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200/80 shadow-soft">
                <p className="text-stone-500 text-sm mb-3">No upcoming doctor appointments scheduled.</p>
                <button
                  type="button"
                  onClick={() => setIsAddApptOpen(true)}
                  className="px-5 py-2.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold hover:bg-stone-200"
                >
                  + Schedule a Doctor Visit
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* 3. Helper Tasks & Cashfree Section */}
        {(activeTab === 'all' || activeTab === 'helper') && (
          <section className="space-y-6">
            <HelperTaskList
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onOpenPayModal={handleOpenPay}
              helperName={helperDisplayName}
              helperCity={helperCity}
              helperUpi={helperUpi}
              elderMembers={parentMembers}
            />

            {/* Payment History Card */}
            {payments.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft">
                <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block mb-1">
                  Cashfree Ledger
                </span>
                <h3 className="font-bold text-base text-stone-800 mb-3">
                  Recent Helper Payouts
                </h3>
                <div className="divide-y divide-stone-100">
                  {payments.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-stone-800">{p.purpose}</p>
                        <p className="text-[11px] text-stone-400">
                          {p.helper_name} • Order: {p.order_id}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-sm text-stone-900">₹{p.amount_inr}</span>
                        <span className="block text-[10px] uppercase font-bold text-emerald-600">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modals & Slide-out Drawers */}
      <RegisterFamilyModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(newFamilyId) => {
          handleSelectFamily(newFamilyId);
        }}
      />

      <EditMemberModal
        isOpen={!!editingMember}
        member={editingMember}
        onClose={() => setEditingMember(null)}
        onSaved={() => {
          fetchAllData(activeFamilyId);
          setEditingMember(null);
        }}
        onDeleted={() => {
          // If the deleted member was the one being viewed, reset selection
          if (editingMember?.id === selectedMemberId) {
            setSelectedMemberId('');
          }
          fetchAllData(activeFamilyId);
          setEditingMember(null);
        }}
      />

      <AddMedicationModal
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        careMembers={members}
        defaultMemberId={selectedMember?.id}
        onAdd={handleAddMedication}
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        familyId={activeFamily?.id || ''}
        onClose={() => setIsAddMemberOpen(false)}
        onAdded={() => fetchAllData(activeFamilyId)}
      />

      <AddAppointmentModal
        isOpen={isAddApptOpen}
        onClose={() => setIsAddApptOpen(false)}
        defaultHelperName={helperDisplayName}
        elderMembers={parentMembers}
        onAdd={handleAddAppointment}
      />

      <CashfreePayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        helperName={payHelperName}
        helperUpi={payHelperUpi}
        familyId={activeFamily?.id || ''}
        onPaymentSuccess={() => fetchAllData(activeFamilyId)}
      />

      <SubscriptionUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        familyId={activeFamily?.id || ''}
        familyName={activeFamily?.name}
        currentTrialEndsAt={activeFamily?.trial_ends_at}
        subscriptionStatus={activeFamily?.subscription_status}
        onSubscribed={() => fetchAllData(activeFamilyId)}
      />

      <WhatsAppSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onWebhookTriggered={() => fetchAllData(activeFamilyId)}
        familyId={activeFamily?.id || ''}
        parentName={(parentMembers[0]?.name || activeFamily?.name || 'Parent').replace(/\s*\(.*?\)\s*$/, '').trim()}
        parentPhone={parentMembers[0]?.phone || ''}
      />
    </div>
  );
}

export default function CaregiverDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-softly-bg flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-softly-coral animate-ping mx-auto" />
            <p className="text-xs font-semibold text-stone-600">Opening Your Care Sanctuary...</p>
          </div>
        </div>
      }
    >
      <CaregiverDashboardContent />
    </Suspense>
  );
}
