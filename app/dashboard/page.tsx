'use client';

import React, { useState, useEffect } from 'react';
import { Medication, MedicationLog, Appointment, HelperTask, HelperPayment } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import MedicationAdherence from '@/components/dashboard/MedicationAdherence';
import MedicationCard from '@/components/dashboard/MedicationCard';
import AddMedicationModal from '@/components/dashboard/AddMedicationModal';
import AppointmentCard from '@/components/dashboard/AppointmentCard';
import AddAppointmentModal from '@/components/dashboard/AddAppointmentModal';
import HelperTaskList from '@/components/dashboard/HelperTaskList';
import CashfreePayModal from '@/components/dashboard/CashfreePayModal';
import WhatsAppSimulatorDrawer from '@/components/dashboard/WhatsAppSimulatorDrawer';
import { Plus, Pill, Calendar, HeartHandshake, IndianRupee } from 'lucide-react';

export default function CaregiverDashboard() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<HelperTask[]>([]);
  const [payments, setPayments] = useState<HelperPayment[]>([]);

  // Modals state
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);
  const [isAddApptOpen, setIsAddApptOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [payHelperName, setPayHelperName] = useState('Ramesh Kumar');

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'all' | 'medications' | 'appointments' | 'helper'>('all');

  const fetchAllData = async () => {
    try {
      const [medsRes, logsRes, apptsRes, tasksRes, payRes] = await Promise.all([
        fetch('/api/medications'),
        fetch('/api/medications/logs'),
        fetch('/api/appointments'),
        fetch('/api/tasks'),
        fetch('/api/payments'),
      ]);

      const [medsData, logsData, apptsData, tasksData, payData] = await Promise.all([
        medsRes.json(),
        logsRes.json(),
        apptsRes.json(),
        tasksRes.json(),
        payRes.json(),
      ]);

      if (medsData.success) setMedications(medsData.medications);
      if (logsData.success) setLogs(logsData.logs);
      if (apptsData.success) setAppointments(apptsData.appointments);
      if (tasksData.success) setTasks(tasksData.tasks);
      if (payData.success) setPayments(payData.payments);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Handlers
  const handleLogTaken = async (medId: string) => {
    try {
      const res = await fetch('/api/medications/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medication_id: medId,
          taken_by_name: 'Aditya (Caregiver)',
          status: 'taken',
          channel: 'app',
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAllData();
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
  }) => {
    const res = await fetch('/api/medications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData();
    }
  };

  const handleAddAppointment = async (data: {
    title: string;
    doctor_name: string;
    clinic_address: string;
    scheduled_at: string;
    helper_name: string;
    notes: string;
  }) => {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData();
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
      fetchAllData();
    }
  };

  const handleAddTask = async (title: string, description?: string) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, assigned_to: 'Ramesh Kumar' }),
    });
    const result = await res.json();
    if (result.success) {
      fetchAllData();
    }
  };

  const handleOpenPay = (name: string) => {
    setPayHelperName(name);
    setIsPayModalOpen(true);
  };

  // Metrics
  const todayTakenCount = logs.filter((l) => l.status === 'taken').length;

  return (
    <div className="min-h-screen bg-softly-bg text-softly-text pb-20">
      {/* Sticky Caregiver Header */}
      <DashboardHeader
        familyName="Sharma Family"
        inviteCode="CARE-7892"
        onOpenSimulator={() => setIsSimulatorOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-8">
        {/* Adherence Index Progress Banner */}
        <MedicationAdherence
          totalMeds={medications.length}
          takenTodayCount={todayTakenCount}
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
            <span>Medications ({medications.length})</span>
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
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-softly-muted uppercase tracking-wider block">
                  Daily Rhythm
                </span>
                <h2 className="text-xl font-bold text-softly-text tracking-tight">
                  Medication Routine
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddMedOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-softly-coral hover:bg-[#ffa8a2] active:scale-95 text-softly-text text-xs font-semibold shadow-soft transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Medication</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {medications.map((med) => {
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
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
      <AddMedicationModal
        isOpen={isAddMedOpen}
        onClose={() => setIsAddMedOpen(false)}
        onAdd={handleAddMedication}
      />

      <AddAppointmentModal
        isOpen={isAddApptOpen}
        onClose={() => setIsAddApptOpen(false)}
        onAdd={handleAddAppointment}
      />

      <CashfreePayModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        helperName={payHelperName}
        onPaymentSuccess={fetchAllData}
      />

      <WhatsAppSimulatorDrawer
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onWebhookTriggered={fetchAllData}
      />
    </div>
  );
}
