import { memoryDataRepository } from '../lib/data-repository';

describe('MemoryDataRepository', () => {
  it('retrieves default seed family and members', async () => {
    const family = await memoryDataRepository.getFamily('fam-sharma');
    expect(family).toBeDefined();
    expect(family?.name).toBe('Sharma Family');

    const members = await memoryDataRepository.getMembers('fam-sharma');
    expect(members.length).toBeGreaterThanOrEqual(3);
    expect(members.some((m) => m.role === 'caregiver')).toBe(true);
    expect(members.some((m) => m.role === 'helper')).toBe(true);
  });

  it('can add and retrieve medications and logs', async () => {
    const newMed = await memoryDataRepository.addMedication({
      family_id: 'fam-sharma',
      name: 'Atorvastatin',
      dosage: '10mg',
      schedule: ['21:00'],
      instructions: 'Take before bed',
      active: true,
    });
    expect(newMed.id).toBeDefined();

    const meds = await memoryDataRepository.getMedications('fam-sharma');
    expect(meds.some((m) => m.name === 'Atorvastatin')).toBe(true);

    const log = await memoryDataRepository.logMedication({
      medication_id: newMed.id,
      family_id: 'fam-sharma',
      taken_at: new Date().toISOString(),
      taken_by_name: 'Aditya (Caregiver)',
      status: 'taken',
      channel: 'app',
    });
    expect(log.id).toBeDefined();

    const logs = await memoryDataRepository.getMedicationLogs('fam-sharma');
    expect(logs.some((l) => l.medication_id === newMed.id)).toBe(true);
  });

  it('can add appointments and helper tasks', async () => {
    const appt = await memoryDataRepository.addAppointment({
      family_id: 'fam-sharma',
      title: 'Blood Pressure Check',
      doctor_name: 'Dr. Verma',
      clinic_address: 'City Clinic, Jaipur',
      scheduled_at: new Date().toISOString(),
      status: 'scheduled',
    });
    expect(appt.id).toBeDefined();

    const task = await memoryDataRepository.addTask({
      family_id: 'fam-sharma',
      title: 'Bring home glucose monitor strips',
      assigned_to: 'Ramesh Kumar',
      completed: false,
    });
    expect(task.id).toBeDefined();

    const updated = await memoryDataRepository.updateTaskStatus(task.id, true);
    expect(updated?.completed).toBe(true);
  });

  it('manages helper payments and WhatsApp messages', async () => {
    const payment = await memoryDataRepository.createPaymentRecord({
      family_id: 'fam-sharma',
      order_id: 'CF_TEST_101',
      amount_inr: 500,
      status: 'created',
      purpose: 'Medicine delivery tip',
      helper_name: 'Ramesh Kumar',
    });
    expect(payment.status).toBe('created');

    const updatedPay = await memoryDataRepository.updatePaymentStatus('CF_TEST_101', 'paid');
    expect(updatedPay?.status).toBe('paid');

    const msg = await memoryDataRepository.addMessage({
      to: '+919876543210',
      direction: 'outbound',
      body: 'Test WhatsApp notification',
      status: 'sent',
    });
    expect(msg.id).toBeDefined();

    const messages = await memoryDataRepository.getMessages();
    expect(messages.some((m) => m.id === msg.id)).toBe(true);
  });
});
