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
      scheduled_at: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), // in 2 days
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

  // Family & Members
  async getAllFamilies(): Promise<Family[]> {
    return this.families;
  }

  async getFamily(id: string): Promise<Family | undefined> {
    return this.families.find((f) => f.id === id);
  }

  async findFamilyByCode(inviteCode: string): Promise<Family | undefined> {
    return this.families.find(
      (f) => f.invite_code.toUpperCase() === inviteCode.trim().toUpperCase()
    );
  }

  async getMembers(familyId: string): Promise<FamilyMember[]> {
    return this.members.filter((m) => m.family_id === familyId);
  }

  async registerFamily(params: {
    familyName: string;
    caregiverName: string;
    caregiverPhone?: string;
    caregiverCity?: string;
    fatherName?: string;
    motherName?: string;
    parentsCity?: string;
    helperName?: string;
    helperPhone?: string;
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
      role: 'caregiver',
      name: params.caregiverName.trim(),
      phone: params.caregiverPhone || '+919999999999',
      city: params.caregiverCity || 'Bangalore',
    });

    // Father
    if (params.fatherName?.trim()) {
      newMembers.push({
        id: `mem-${Date.now()}-fa`,
        family_id: familyId,
        role: 'elder',
        name: `${params.fatherName.trim()} (Father)`,
        phone: '+919123456789',
        city: params.parentsCity || 'Hometown',
      });
    }

    // Mother
    if (params.motherName?.trim()) {
      newMembers.push({
        id: `mem-${Date.now()}-mo`,
        family_id: familyId,
        role: 'elder',
        name: `${params.motherName.trim()} (Mother)`,
        phone: '+919123456788',
        city: params.parentsCity || 'Hometown',
      });
    }

    // Helper
    if (params.helperName?.trim()) {
      newMembers.push({
        id: `mem-${Date.now()}-hp`,
        family_id: familyId,
        role: 'helper',
        name: `${params.helperName.trim()} (Local Helper)`,
        phone: params.helperPhone || '+919888877777',
        city: params.parentsCity || 'Hometown',
      });
    }

    this.members.push(...newMembers);
    return { family: newFamily, members: newMembers };
  }

  // Medications
  async getMedications(familyId: string): Promise<Medication[]> {
    return this.medications.filter((m) => m.family_id === familyId);
  }

  async addMedication(med: Omit<Medication, 'id' | 'created_at'>): Promise<Medication> {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.medications.push(newMed);
    return newMed;
  }

  // Logs
  async getMedicationLogs(familyId: string): Promise<MedicationLog[]> {
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
    return newLog;
  }

  // Appointments
  async getAppointments(familyId: string): Promise<Appointment[]> {
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
    return newAppt;
  }

  // Helper Tasks
  async getTasks(familyId: string): Promise<HelperTask[]> {
    return this.helperTasks.filter((t) => t.family_id === familyId);
  }

  async addTask(task: Omit<HelperTask, 'id' | 'created_at'>): Promise<HelperTask> {
    const newTask: HelperTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    this.helperTasks.push(newTask);
    return newTask;
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<HelperTask | undefined> {
    const task = this.helperTasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = completed;
    }
    return task;
  }

  // Payments
  async getPayments(familyId: string): Promise<HelperPayment[]> {
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
    return newPay;
  }

  async updatePaymentStatus(orderId: string, status: 'paid' | 'failed'): Promise<HelperPayment | undefined> {
    const p = this.payments.find((x) => x.order_id === orderId);
    if (p) {
      p.status = status;
    }
    return p;
  }

  // WhatsApp Messages (Simulator feed)
  async getMessages(): Promise<WhatsAppMessage[]> {
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
    return newMsg;
  }
}

// Global singleton instance for local runtime and development
export const memoryDataRepository = new MemoryDataRepository();
