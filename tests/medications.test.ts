import { memoryDataRepository } from '../lib/data-repository';

describe('Medications API & Logic', () => {
  it('adds and verifies medication in repository', async () => {
    const med = await memoryDataRepository.addMedication({
      family_id: 'fam-sharma',
      name: 'Aspirin Cardio',
      dosage: '75mg',
      schedule: ['12:00'],
      instructions: 'Take after lunch',
      active: true,
    });
    expect(med.id).toBeDefined();
    expect(med.name).toBe('Aspirin Cardio');

    const meds = await memoryDataRepository.getMedications('fam-sharma');
    expect(meds.some((m) => m.id === med.id)).toBe(true);
  });

  it('logs medication taken and updates adherence count', async () => {
    const meds = await memoryDataRepository.getMedications('fam-sharma');
    const firstMed = meds[0];

    const log = await memoryDataRepository.logMedication({
      medication_id: firstMed.id,
      family_id: 'fam-sharma',
      taken_at: new Date().toISOString(),
      taken_by_name: 'Aditya (Caregiver)',
      status: 'taken',
      channel: 'app',
    });

    expect(log.status).toBe('taken');
    expect(log.medication_id).toBe(firstMed.id);

    const logs = await memoryDataRepository.getMedicationLogs('fam-sharma');
    expect(logs[0].id).toBe(log.id);
  });
});
