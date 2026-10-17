export type UserRole = 'caregiver' | 'elder' | 'helper';

export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  created_at: string;
  trial_ends_at?: string;
  subscription_status?: SubscriptionStatus;
  subscription_plan?: 'monthly_299' | 'yearly_2499' | null;
  subscription_id?: string;
  whatsapp_quota_used?: number;
  whatsapp_quota_limit?: number;
}

export interface FamilyMember {
  id: string;
  family_id: string;
  user_id?: string;
  role: UserRole;
  name: string;
  phone: string;
  city: string;
  upi_id?: string;
  relation_type?: string; // e.g. 'Father', 'Mother', 'Brother', 'Sister', 'Others'
  helper_type?: 'live_in' | 'visiting'; // Live-in Caregiver or Visiting Task Helper
}

export interface Medication {
  id: string;
  family_id: string;
  name: string;
  dosage: string;
  schedule: string[]; // e.g. ['08:00', '20:00']
  instructions?: string;
  active: boolean;
  created_at: string;
  for_member_id?: string;   // which family member this is for
  for_member_name?: string; // display name (denormalized for speed)
}

export type MedicationStatus = 'taken' | 'missed' | 'skipped';

export interface MedicationLog {
  id: string;
  medication_id: string;
  medication_name?: string;
  family_id: string;
  taken_at: string;
  taken_by_name: string;
  status: MedicationStatus;
  channel: 'app' | 'whatsapp';
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  family_id: string;
  title: string;
  doctor_name: string;
  clinic_address: string;
  scheduled_at: string; // ISO string
  helper_name?: string;
  status: AppointmentStatus;
  notes?: string;
  for_member_id?: string;   // which family member this appointment is for
  for_member_name?: string; // display name (denormalized for speed)
}

export interface HelperTask {
  id: string;
  family_id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  assigned_to: string;
  created_at: string;
  for_member_id?: string;   // which family member this task is for
  for_member_name?: string; // display name (denormalized for speed)
}

export type PaymentStatus = 'created' | 'paid' | 'failed';

export interface HelperPayment {
  id: string;
  family_id: string;
  order_id: string;
  payment_session_id?: string;
  amount_inr: number;
  status: PaymentStatus;
  purpose: string;
  helper_name: string;
  created_at: string;
}

export interface WhatsAppMessage {
  id: string;
  to: string;
  direction: 'outbound' | 'inbound';
  body: string;
  medication_id?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'received';
}
