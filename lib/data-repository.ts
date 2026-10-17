import {
  Family,
  FamilyMember,
  Medication,
  MedicationLog,
  Appointment,
  HelperTask,
  HelperPayment,
  WhatsAppMessage,
} from './types';
import { supabaseDataRepository } from './supabase-repository';

export class MemoryDataRepository {
  private families: Family[] = [
    {
      id: 'fam-sharma',
      name: 'Sharma Family',
      invite_code: 'CARE-7892',
      created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
    },
  ];

  private members: FamilyMember[] = [
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
  ];

  private medications: Medication[] = [
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
  ];

  private medicationLogs: MedicationLog[] = [
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
  ];

  private appointments: Appointment[] = [
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
  ];

  private helperTasks: HelperTask[] = [
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
  ];

  private payments: HelperPayment[] = [
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
  ];

  private messages: WhatsAppMessage[] = [
    {
      id: 'msg-1',
      to: '+919123456789',
      direction: 'outbound',
      body: '💊 Reminder: Time for *Metformin* (500mg) at 08:00 AM. Please reply *DONE* once taken.',
      medication_id: 'med-1',
      timestamp: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      status: 'read',
    },
    {
      id: 'msg-2',
      to: '+919123456789',
      direction: 'inbound',
      body: 'DONE',
      medication_id: 'med-1',
      timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
      status: 'received',
    },
  ];

  // ----------------------------------------------------------------
  // Local Users (Email / Phone + Password sign-ups)
  // ----------------------------------------------------------------
  private users: Array<{ id: string; identifier: string; name: string; passwordHash: string }> = [];

  private isSupabaseEnabled(): boolean {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    );
  }

  async findUserByIdentifier(identifier: string): Promise<{ id: string; identifier: string; name: string; passwordHash: string } | undefined> {
    if (this.isSupabaseEnabled()) {
      try {
        const u = await supabaseDataRepository.findUserByIdentifier(identifier);
        if (u) return u;
      } catch (e) {
        // Fallback to memory
      }
    }
    return this.users.find((u) => u.identifier.toLowerCase() === identifier.toLowerCase());
  }

  async createUser(params: { name: string; identifier: string; passwordHash: string }): Promise<{ id: string; identifier: string; name: string; passwordHash: string }> {
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...params,
    };
    this.users.push(newUser);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.createUser(params);
      } catch (e) {
        // Fallback to memory
      }
    }
    return newUser;
  }

  // Family & Members
  async getAllFamilies(): Promise<Family[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const sbFamilies = await supabaseDataRepository.getAllFamilies();
        if (sbFamilies && sbFamilies.length > 0) return sbFamilies;
      } catch (e) {
        // Fallback
      }
    }
    return this.families;
  }

  async getFamily(id: string): Promise<Family | undefined> {
    if (this.isSupabaseEnabled()) {
      try {
        const f = await supabaseDataRepository.getFamily(id);
        if (f) return f;
      } catch (e) {
        // Fallback
      }
    }
    return this.families.find((f) => f.id === id);
  }

  async updateFamilySubscription(familyId: string, updates: Partial<Family>): Promise<boolean> {
    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.updateFamilySubscription(familyId, updates);
      } catch (e) {
        // Fallback
      }
    }
    const idx = this.families.findIndex((f) => f.id === familyId);
    if (idx !== -1) {
      this.families[idx] = { ...this.families[idx], ...updates };
      return true;
    }
    return false;
  }

  async incrementWhatsappQuota(familyId: string): Promise<boolean> {
    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.incrementWhatsappQuota(familyId);
      } catch (e) {
        // Fallback
      }
    }
    const fam = this.families.find((f) => f.id === familyId);
    if (fam) {
      fam.whatsapp_quota_used = (fam.whatsapp_quota_used || 0) + 1;
      return true;
    }
    return false;
  }

  async findFamilyByCode(inviteCode: string): Promise<Family | undefined> {
    if (this.isSupabaseEnabled()) {
      try {
        const f = await supabaseDataRepository.findFamilyByCode(inviteCode);
        if (f) return f;
      } catch (e) {
        // Fallback
      }
    }
    return this.families.find(
      (f) => f.invite_code.toUpperCase() === inviteCode.trim().toUpperCase()
    );
  }

  async getMembers(familyId: string): Promise<FamilyMember[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const members = await supabaseDataRepository.getMembers(familyId);
        if (members && members.length > 0) return members;
      } catch (e) {
        // Fallback
      }
    }
    return this.members.filter((m) => m.family_id === familyId);
  }

  async getUserFamily(user: { id?: string; name?: string; email?: string }): Promise<Family | undefined> {
    if (this.isSupabaseEnabled()) {
      try {
        const fam = await supabaseDataRepository.getUserFamily(user);
        if (fam) return fam;
      } catch (e) {
        // Fallback
      }
    }

    if (!user) return undefined;
    const member = this.members.find(
      (m) =>
        m.role === 'caregiver' &&
        ((user.id && m.user_id === user.id) ||
          (user.name && m.name.toLowerCase() === user.name.toLowerCase()))
    );
    if (member) {
      return this.families.find((f) => f.id === member.family_id);
    }
    return undefined;
  }

  async registerFamily(params: {
    familyName: string;
    caregiverName: string;
    caregiverPhone?: string;
    caregiverCity?: string;
    userId?: string;
    careMembers?: { relation: string; name: string; city: string }[];
    helperName?: string;
    helperPhone?: string;
    helperUpi?: string;
  }): Promise<{ family: Family; members: FamilyMember[] }> {
    const familyId = `fam-${Date.now()}`;
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const inviteCode = `CARE-${codeNum}`;

    const newFamily: Family = {
      id: familyId,
      name: params.familyName.trim(),
      invite_code: inviteCode,
      created_at: new Date().toISOString(),
    };
    this.families.push(newFamily);

    const newMembers: FamilyMember[] = [];

    // Caregiver
    newMembers.push({
      id: `mem-${Date.now()}-cg`,
      family_id: familyId,
      user_id: params.userId,
      role: 'caregiver',
      name: params.caregiverName.trim(),
      phone: params.caregiverPhone || '+919999999999',
      city: params.caregiverCity || 'Bangalore',
    });

    // Dynamic care members
    (params.careMembers || []).forEach((cm, i) => {
      if (!cm.name?.trim()) return;
      newMembers.push({
        id: `mem-${Date.now()}-${i}`,
        family_id: familyId,
        role: 'elder',
        name: cm.name.trim(),
        phone: '',
        city: cm.city?.trim() || 'Hometown',
        relation_type: cm.relation,
      });
    });

    // Helper
    if (params.helperName?.trim()) {
      const basePhone = params.helperPhone || '+919888877777';
      const encodedPhone = params.helperUpi?.trim()
        ? `${basePhone}#upi:${params.helperUpi.trim()}`
        : basePhone;
      newMembers.push({
        id: `mem-${Date.now()}-hp`,
        family_id: familyId,
        role: 'helper',
        name: `${params.helperName.trim()} (Local Helper)`,
        phone: encodedPhone,
        city: params.caregiverCity || 'Hometown',
        upi_id: params.helperUpi?.trim(),
      });
    }

    this.members.push(...newMembers);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.registerFamily(params);
      } catch (e) {
        console.warn('[DataRepository] Supabase registerFamily write error:', e);
      }
    }

    return { family: newFamily, members: newMembers };
  }

  async addCareMember(params: {
    familyId: string;
    relation: string;
    name: string;
    city: string;
    phone?: string;
  }): Promise<FamilyMember> {
    const member: FamilyMember = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      family_id: params.familyId,
      role: 'elder',
      name: params.name,
      phone: params.phone?.trim() || '',
      city: params.city || 'Hometown',
      relation_type: params.relation,
    };
    this.members.push(member);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.addCareMember(params);
      } catch (e) {
        console.warn('[DataRepository] Supabase addCareMember error:', e);
      }
    }
    return member;
  }

  async updateMember(
    memberId: string,
    updates: {
      name?: string;
      relation?: string;
      city?: string;
      phone?: string;
      upi_id?: string;
    }
  ): Promise<FamilyMember | undefined> {
    const idx = this.members.findIndex((m) => m.id === memberId);
    if (idx !== -1) {
      const existing = this.members[idx];
      const newName = updates.name !== undefined
        ? (updates.relation ? `${updates.name.trim()} (${updates.relation.trim()})` : updates.name.trim())
        : existing.name;

      this.members[idx] = {
        ...existing,
        name: newName,
        city: updates.city !== undefined ? updates.city.trim() : existing.city,
        phone: updates.phone !== undefined ? updates.phone.trim() : existing.phone,
        upi_id: updates.upi_id !== undefined ? updates.upi_id.trim() : existing.upi_id,
        relation_type: updates.relation !== undefined ? updates.relation : existing.relation_type,
      };
    }

    if (this.isSupabaseEnabled()) {
      try {
        const sbUpdated = await supabaseDataRepository.updateMember(memberId, updates);
        if (sbUpdated) return sbUpdated;
      } catch (e) {
        console.warn('[DataRepository] Supabase updateMember error:', e);
      }
    }
    return this.members.find((m) => m.id === memberId);
  }

  async deleteMember(memberId: string): Promise<boolean> {
    this.members = this.members.filter((m) => m.id !== memberId);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.deleteMember(memberId);
      } catch (e) {
        console.warn('[DataRepository] Supabase deleteMember error:', e);
      }
    }
    return true;
  }

  // Medications
  async getMedications(familyId: string): Promise<Medication[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const meds = await supabaseDataRepository.getMedications(familyId);
        if (meds && meds.length > 0) return meds;
      } catch (e) {
        // Fallback
      }
    }
    return this.medications.filter((m) => m.family_id === familyId);
  }

  async addMedication(med: Omit<Medication, 'id' | 'created_at'>): Promise<Medication> {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.medications.push(newMed);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.addMedication(med);
      } catch (e) {
        // Fallback
      }
    }
    return newMed;
  }

  // Logs
  async getMedicationLogs(familyId: string): Promise<MedicationLog[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const logs = await supabaseDataRepository.getMedicationLogs(familyId);
        if (logs && logs.length > 0) return logs;
      } catch (e) {
        // Fallback
      }
    }
    return this.medicationLogs
      .filter((l) => l.family_id === familyId)
      .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime());
  }

  async logMedication(log: Omit<MedicationLog, 'id'>): Promise<MedicationLog> {
    const med = this.medications.find((m) => m.id === log.medication_id);
    const newLog: MedicationLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      medication_name: med ? `${med.name} (${med.dosage})` : log.medication_name || 'Medication',
    };
    this.medicationLogs.unshift(newLog);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.logMedication(log);
      } catch (e) {
        // Fallback
      }
    }
    return newLog;
  }

  // Appointments
  async getAppointments(familyId: string): Promise<Appointment[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const appts = await supabaseDataRepository.getAppointments(familyId);
        if (appts && appts.length > 0) return appts;
      } catch (e) {
        // Fallback
      }
    }
    return this.appointments
      .filter((a) => a.family_id === familyId)
      .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime());
  }

  async addAppointment(appt: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    this.appointments.push(newAppt);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.addAppointment(appt);
      } catch (e) {
        // Fallback
      }
    }
    return newAppt;
  }

  // Helper Tasks
  async getTasks(familyId: string): Promise<HelperTask[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const tasks = await supabaseDataRepository.getTasks(familyId);
        if (tasks && tasks.length > 0) return tasks;
      } catch (e) {
        // Fallback
      }
    }
    return this.helperTasks.filter((t) => t.family_id === familyId);
  }

  async addTask(task: Omit<HelperTask, 'id' | 'created_at'>): Promise<HelperTask> {
    const newTask: HelperTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.helperTasks.push(newTask);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.addTask(task);
      } catch (e) {
        // Fallback
      }
    }
    return newTask;
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<HelperTask | undefined> {
    const task = this.helperTasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = completed;
    }

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.updateTaskStatus(taskId, completed);
      } catch (e) {
        // Fallback
      }
    }
    return task;
  }

  // Payments
  async getPayments(familyId: string): Promise<HelperPayment[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const pays = await supabaseDataRepository.getPayments(familyId);
        if (pays && pays.length > 0) return pays;
      } catch (e) {
        // Fallback
      }
    }
    return this.payments
      .filter((p) => p.family_id === familyId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async createPaymentRecord(payment: Omit<HelperPayment, 'id' | 'created_at'>): Promise<HelperPayment> {
    const newPay: HelperPayment = {
      ...payment,
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.payments.unshift(newPay);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.createPaymentRecord(payment);
      } catch (e) {
        // Fallback
      }
    }
    return newPay;
  }

  async updatePaymentStatus(orderId: string, status: 'paid' | 'failed'): Promise<HelperPayment | undefined> {
    const p = this.payments.find((x) => x.order_id === orderId);
    if (p) {
      p.status = status;
    }

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.updatePaymentStatus(orderId, status);
      } catch (e) {
        // Fallback
      }
    }
    return p;
  }

  // WhatsApp Messages (Simulator feed)
  async getMessages(): Promise<WhatsAppMessage[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const msgs = await supabaseDataRepository.getMessages();
        if (msgs && msgs.length > 0) return msgs;
      } catch (e) {
        // Fallback
      }
    }
    return [...this.messages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  async addMessage(msg: Omit<WhatsAppMessage, 'id' | 'timestamp'>): Promise<WhatsAppMessage> {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    this.messages.push(newMsg);

    if (this.isSupabaseEnabled()) {
      try {
        await supabaseDataRepository.addMessage(msg);
      } catch (e) {
        // Fallback
      }
    }
    return newMsg;
  }
}

// Global singleton instance for local runtime and development
export const memoryDataRepository = new MemoryDataRepository();
