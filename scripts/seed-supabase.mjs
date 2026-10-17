import { createClient } from '@supabase/supabase-js';

const url = 'https://tvhfborktuqtavuxaied.supabase.co';
const key = 'sb_publishable_VOuxUDTGV-Pq8FASL9L4Bw_-0C292Pv';

const client = createClient(url, key);

async function seed() {
  console.log('Seeding initial data into Supabase...');

  // 1. Families
  await client.from('families').upsert([
    {
      id: 'fam-sharma',
      name: 'Sharma Family',
      invite_code: 'CARE-7892',
      created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
    },
  ]);

  // 2. Family Members
  await client.from('family_members').upsert([
    {
      id: 'mem-1',
      family_id: 'fam-sharma',
      role: 'caregiver',
      name: 'Aditya Sharma',
      phone: '+919876543210',
      city: 'Bangalore',
    },
    {
      id: 'mem-2',
      family_id: 'fam-sharma',
      role: 'elder',
      name: 'Ram Prakash Sharma (Father)',
      phone: '+919123456789',
      city: 'Jaipur',
    },
    {
      id: 'mem-3',
      family_id: 'fam-sharma',
      role: 'elder',
      name: 'Savitri Sharma (Mother)',
      phone: '+919123456780',
      city: 'Jaipur',
    },
    {
      id: 'mem-4',
      family_id: 'fam-sharma',
      role: 'helper',
      name: 'Ramesh Kumar (Local Helper)',
      phone: '+919988776655',
      city: 'Jaipur',
    },
  ]);

  // 3. Medications
  await client.from('medications').upsert([
    {
      id: 'med-1',
      family_id: 'fam-sharma',
      name: 'Metformin',
      dosage: '500mg',
      schedule: ['08:00', '20:00'],
      instructions: 'Take with or immediately after meals (Breakfast & Dinner)',
      active: true,
      created_at: new Date('2026-09-10T08:00:00Z').toISOString(),
    },
    {
      id: 'med-2',
      family_id: 'fam-sharma',
      name: 'Telmisartan (BP)',
      dosage: '40mg',
      schedule: ['08:00'],
      instructions: 'Take every morning before breakfast',
      active: true,
      created_at: new Date('2026-09-10T08:00:00Z').toISOString(),
    },
    {
      id: 'med-3',
      family_id: 'fam-sharma',
      name: 'Calcium + Vit D3',
      dosage: '1 Tab',
      schedule: ['14:00'],
      instructions: 'After lunch with a glass of water',
      active: true,
      created_at: new Date('2026-09-15T08:00:00Z').toISOString(),
    },
  ]);

  // 4. Medication Logs
  await client.from('medication_logs').upsert([
    {
      id: 'log-1',
      medication_id: 'med-1',
      medication_name: 'Metformin (500mg)',
      family_id: 'fam-sharma',
      taken_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      taken_by_name: 'Ramesh Kumar (Helper)',
      status: 'taken',
      channel: 'app',
    },
    {
      id: 'log-2',
      medication_id: 'med-2',
      medication_name: 'Telmisartan (BP)',
      family_id: 'fam-sharma',
      taken_at: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
      taken_by_name: 'Ram Prakash Sharma',
      status: 'taken',
      channel: 'whatsapp',
    },
  ]);

  // 5. Appointments
  await client.from('appointments').upsert([
    {
      id: 'appt-1',
      family_id: 'fam-sharma',
      title: 'Quarterly Cardiology Checkup',
      doctor_name: 'Dr. Ashok Mehta (Cardiologist)',
      clinic_address: 'Apex Heart Institute, Malviya Nagar, Jaipur',
      scheduled_at: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      helper_name: 'Ramesh Kumar',
      status: 'scheduled',
      notes: 'Carry fasting lipid profile and previous ECG reports.',
    },
    {
      id: 'appt-2',
      family_id: 'fam-sharma',
      title: 'Ophthalmology Eye Screening',
      doctor_name: 'Dr. Sunita Kapoor',
      clinic_address: 'Drishti Eye Hospital, C-Scheme, Jaipur',
      scheduled_at: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      helper_name: 'Ramesh Kumar',
      status: 'scheduled',
      notes: 'Pupil dilation required; driver needed for return journey.',
    },
  ]);

  // 6. Helper Tasks
  await client.from('helper_tasks').upsert([
    {
      id: 'task-1',
      family_id: 'fam-sharma',
      title: 'Pick up monthly medication refills from Apollo Pharmacy',
      description: 'Collect 2 strips Metformin 500mg and 1 strip Telmisartan 40mg using prescription card #8821.',
      due_date: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
      completed: false,
      assigned_to: 'Ramesh Kumar',
      created_at: new Date().toISOString(),
    },
    {
      id: 'task-2',
      family_id: 'fam-sharma',
      title: 'Accompany Dad to Apex Cardiology Clinic',
      description: 'Help with wheelchair entry and ensure Dr. Mehta signs the insurance claim paper.',
      due_date: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      completed: false,
      assigned_to: 'Ramesh Kumar',
      created_at: new Date().toISOString(),
    },
  ]);

  // 7. Payments
  await client.from('helper_payments').upsert([
    {
      id: 'pay-1',
      family_id: 'fam-sharma',
      order_id: 'CF_ORDER_98124',
      payment_session_id: 'session_demo_98124',
      amount_inr: 1500,
      status: 'paid',
      purpose: 'Monthly helper stipend & clinic accompaniment',
      helper_name: 'Ramesh Kumar',
      created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    },
  ]);

  console.log('✅ Supabase seeded successfully!');
}

seed().catch(console.error);
