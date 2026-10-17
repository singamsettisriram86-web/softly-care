-- Softly Care Coordinator Database Schema for Supabase

-- 1. Families
CREATE TABLE IF NOT EXISTS public.families (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Family Members
CREATE TABLE IF NOT EXISTS public.family_members (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  user_id TEXT,
  role TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  city TEXT
);

-- 3. Medications
CREATE TABLE IF NOT EXISTS public.medications (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  schedule TEXT[] NOT NULL DEFAULT '{}',
  instructions TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Medication Logs
CREATE TABLE IF NOT EXISTS public.medication_logs (
  id TEXT PRIMARY KEY,
  medication_id TEXT,
  medication_name TEXT,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  taken_at TIMESTAMPTZ DEFAULT NOW(),
  taken_by_name TEXT,
  status TEXT NOT NULL,
  channel TEXT DEFAULT 'app'
);

-- 5. Doctor Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  clinic_address TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  helper_name TEXT,
  status TEXT DEFAULT 'scheduled',
  notes TEXT
);

-- 6. Helper Tasks
CREATE TABLE IF NOT EXISTS public.helper_tasks (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  completed BOOLEAN DEFAULT FALSE,
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Helper Payments
CREATE TABLE IF NOT EXISTS public.helper_payments (
  id TEXT PRIMARY KEY,
  family_id TEXT REFERENCES public.families(id) ON DELETE CASCADE,
  order_id TEXT NOT NULL,
  payment_session_id TEXT,
  amount_inr NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'created',
  purpose TEXT,
  helper_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. WhatsApp Messages (Simulator / Live Feed)
CREATE TABLE IF NOT EXISTS public.whatsapp_messages (
  id TEXT PRIMARY KEY,
  to_phone TEXT,
  direction TEXT,
  body TEXT,
  medication_id TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  status TEXT
);

-- 9. App Registered Users (Email / Phone + Password)
CREATE TABLE IF NOT EXISTS public.app_users (
  id TEXT PRIMARY KEY,
  identifier TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial default demo family (Sharma Family)
INSERT INTO public.families (id, name, invite_code, created_at)
VALUES ('fam-sharma', 'Sharma Family', 'CARE-7892', '2026-09-01T08:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.family_members (id, family_id, role, name, phone, city)
VALUES 
  ('mem-1', 'fam-sharma', 'caregiver', 'Aditya Sharma', '+919876543210', 'Bangalore'),
  ('mem-2', 'fam-sharma', 'elder', 'Ram Prakash Sharma (Father)', '+919123456789', 'Jaipur'),
  ('mem-3', 'fam-sharma', 'elder', 'Savitri Sharma (Mother)', '+919123456780', 'Jaipur'),
  ('mem-4', 'fam-sharma', 'helper', 'Ramesh Kumar (Local Helper)', '+919988776655', 'Jaipur')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.medications (id, family_id, name, dosage, schedule, instructions, active, created_at)
VALUES 
  ('med-1', 'fam-sharma', 'Metformin', '500mg', ARRAY['08:00', '20:00'], 'Take with or immediately after meals (Breakfast & Dinner)', true, '2026-09-10T08:00:00Z'),
  ('med-2', 'fam-sharma', 'Telmisartan (BP)', '40mg', ARRAY['08:00'], 'Take every morning before breakfast', true, '2026-09-10T08:00:00Z'),
  ('med-3', 'fam-sharma', 'Calcium + Vit D3', '1 Tab', ARRAY['14:00'], 'After lunch with a glass of water', true, '2026-09-15T08:00:00Z')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.medication_logs (id, medication_id, medication_name, family_id, taken_at, taken_by_name, status, channel)
VALUES 
  ('log-1', 'med-1', 'Metformin (500mg)', 'fam-sharma', NOW() - INTERVAL '3 hours', 'Ramesh Kumar (Helper)', 'taken', 'app'),
  ('log-2', 'med-2', 'Telmisartan (BP)', 'fam-sharma', NOW() - INTERVAL '4 hours', 'Ram Prakash Sharma', 'taken', 'whatsapp')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.appointments (id, family_id, title, doctor_name, clinic_address, scheduled_at, helper_name, status, notes)
VALUES 
  ('appt-1', 'fam-sharma', 'Quarterly Cardiology Checkup', 'Dr. Ashok Mehta (Cardiologist)', 'Apex Heart Institute, Malviya Nagar, Jaipur', NOW() + INTERVAL '2 days', 'Ramesh Kumar', 'scheduled', 'Carry fasting lipid profile and previous ECG reports.'),
  ('appt-2', 'fam-sharma', 'Ophthalmology Eye Screening', 'Dr. Sunita Kapoor', 'Drishti Eye Hospital, C-Scheme, Jaipur', NOW() + INTERVAL '7 days', 'Ramesh Kumar', 'scheduled', 'Pupil dilation required; driver needed for return journey.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.helper_tasks (id, family_id, title, description, due_date, completed, assigned_to, created_at)
VALUES 
  ('task-1', 'fam-sharma', 'Pick up monthly medication refills from Apollo Pharmacy', 'Collect 2 strips Metformin 500mg and 1 strip Telmisartan 40mg using prescription card #8821.', NOW() + INTERVAL '1 day', false, 'Ramesh Kumar', NOW()),
  ('task-2', 'fam-sharma', 'Accompany Dad to Apex Cardiology Clinic', 'Help with wheelchair entry and ensure Dr. Mehta signs the insurance claim paper.', NOW() + INTERVAL '2 days', false, 'Ramesh Kumar', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.helper_payments (id, family_id, order_id, payment_session_id, amount_inr, status, purpose, helper_name, created_at)
VALUES 
  ('pay-1', 'fam-sharma', 'CF_ORDER_98124', 'session_demo_98124', 1500.00, 'paid', 'Monthly helper stipend & clinic accompaniment', 'Ramesh Kumar', NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Disable RLS for simple application-tier API access
ALTER TABLE public.families DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.helper_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.helper_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users DISABLE ROW LEVEL SECURITY;
