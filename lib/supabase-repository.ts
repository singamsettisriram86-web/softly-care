import { supabase } from './supabase';
import {
  Family,
  FamilyMember,
  UserRole,
  Medication,
  MedicationLog,
  Appointment,
  HelperTask,
  HelperPayment,
  WhatsAppMessage,
} from './types';

export class SupabaseDataRepository {
  // Users
  async findUserByIdentifier(identifier: string) {
    const { data, error } = await supabase
      .from('app_users')
      .select('*')
      .ilike('identifier', identifier.trim())
      .maybeSingle();

    if (error || !data) return undefined;
    return {
      id: data.id,
      identifier: data.identifier,
      name: data.name,
      passwordHash: data.password_hash,
    };
  }

  async createUser(params: { name: string; identifier: string; passwordHash: string }) {
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      identifier: params.identifier.trim(),
      name: params.name.trim(),
      password_hash: params.passwordHash,
    };

    const { error } = await supabase.from('app_users').insert([newUser]);
    if (error) {
      console.error('[Supabase] createUser error:', error);
    }
    return {
      id: newUser.id,
      identifier: newUser.identifier,
      name: newUser.name,
      passwordHash: newUser.password_hash,
    };
  }

  // Families
  async getAllFamilies(): Promise<Family[]> {
    const { data, error } = await supabase.from('families').select('*').order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  }

  async getFamily(id: string): Promise<Family | undefined> {
    const { data, error } = await supabase.from('families').select('*').eq('id', id).maybeSingle();
    if (error || !data) return undefined;
    return data;
  }

  async findFamilyByCode(inviteCode: string): Promise<Family | undefined> {
    const { data, error } = await supabase
      .from('families')
      .select('*')
      .ilike('invite_code', inviteCode.trim())
      .maybeSingle();
    if (error || !data) return undefined;
    return data;
  }

  async updateFamilySubscription(familyId: string, updates: Partial<Family>): Promise<boolean> {
    const { error } = await supabase.from('families').update(updates).eq('id', familyId);
    return !error;
  }

  async incrementWhatsappQuota(familyId: string): Promise<boolean> {
    const fam = await this.getFamily(familyId);
    if (!fam) return false;
    const used = (fam.whatsapp_quota_used || 0) + 1;
    const { error } = await supabase.from('families').update({ whatsapp_quota_used: used }).eq('id', familyId);
    return !error;
  }

  // Members
  async getMembers(familyId: string): Promise<FamilyMember[]> {
    const { data, error } = await supabase.from('family_members').select('*').eq('family_id', familyId);
    if (error || !data) return [];
    return data.map((m: any) => ({
      ...m,
      relation_type: m.relation_type || (m.role === 'elder' ? 'Elder' : undefined),
      helper_type: m.helper_type || (m.role === 'helper' ? 'visiting' : undefined),
    }));
  }

  async findMemberByPhone(phone: string): Promise<FamilyMember | undefined> {
    const cleanDigits = phone.replace(/[^\d]/g, '');
    const last10 = cleanDigits.slice(-10);
    if (!last10) return undefined;

    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .ilike('phone', `%${last10}%`)
      .limit(1)
      .maybeSingle();

    if (error || !data) return undefined;
    return {
      ...data,
      relation_type: data.relation_type || (data.role === 'elder' ? 'Elder' : undefined),
      helper_type: data.helper_type || (data.role === 'helper' ? 'visiting' : undefined),
    };
  }

  async getUserFamily(user: { id?: string; name?: string; email?: string }): Promise<Family | undefined> {
    if (!user) return undefined;
    try {
      if (user.id) {
        const { data: byUserId } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('role', 'caregiver')
          .eq('user_id', user.id)
          .order('id', { ascending: false })
          .limit(1);
        if (byUserId && byUserId.length > 0 && byUserId[0]?.family_id) {
          const fam = await this.getFamily(byUserId[0].family_id);
          if (fam) return fam;
        }
      }

      if (user.name) {
        const { data: byName } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('role', 'caregiver')
          .ilike('name', user.name.trim())
          .order('id', { ascending: false })
          .limit(1);
        if (byName && byName.length > 0 && byName[0]?.family_id) {
          const fam = await this.getFamily(byName[0].family_id);
          if (fam) return fam;
        }
      }
    } catch (e) {
      console.warn('[Supabase] getUserFamily error:', e);
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
    helperType?: 'live_in' | 'visiting';
  }): Promise<{ family: Family; members: FamilyMember[] }> {
    const familyId = `fam-${Date.now()}`;
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const inviteCode = `CARE-${codeNum}`;

    const createdAt = new Date();
    const trialEndsAt = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);

    const newFamily: Family = {
      id: familyId,
      name: params.familyName.trim(),
      invite_code: inviteCode,
      created_at: createdAt.toISOString(),
      trial_ends_at: trialEndsAt.toISOString(),
      subscription_status: 'trial',
      whatsapp_quota_used: 0,
      whatsapp_quota_limit: 150,
    };

    await supabase.from('families').insert([newFamily]);

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
    const careMembers = params.careMembers || [];
    careMembers.forEach((cm, i) => {
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
      newMembers.push({
        id: `mem-${Date.now()}-hp`,
        family_id: familyId,
        role: 'helper',
        name: params.helperName.trim(),
        phone: params.helperPhone || '+919888877777',
        city: params.caregiverCity || 'Hometown',
        upi_id: params.helperUpi?.trim() || undefined,
        helper_type: params.helperType || 'visiting',
      });
    }

    await supabase.from('family_members').insert(newMembers);
    return { family: newFamily, members: newMembers };
  }

  async addCareMember(params: {
    familyId: string;
    relation: string;
    name: string;
    city: string;
    phone?: string;
    role?: UserRole;
    helper_type?: 'live_in' | 'visiting';
  }): Promise<FamilyMember> {
    const role = params.role || 'elder';
    const member: FamilyMember = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      family_id: params.familyId,
      role,
      name: params.name.trim(),
      phone: params.phone?.trim() || '',
      city: params.city || 'Hometown',
      relation_type: role === 'elder' ? params.relation : undefined,
      helper_type: role === 'helper' ? (params.helper_type || 'visiting') : undefined,
    };
    await supabase.from('family_members').insert([{
      id: member.id,
      family_id: member.family_id,
      role: member.role,
      name: member.name,
      phone: member.phone,
      city: member.city,
      relation_type: member.relation_type,
      helper_type: member.helper_type,
    }]);
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
      helper_type?: 'live_in' | 'visiting';
    }
  ): Promise<FamilyMember | undefined> {
    const payload: any = {};
    if (updates.name !== undefined) payload.name = updates.name.trim();
    if (updates.relation !== undefined) payload.relation_type = updates.relation.trim();
    if (updates.city !== undefined) payload.city = updates.city.trim();
    if (updates.phone !== undefined) payload.phone = updates.phone.trim();
    if (updates.upi_id !== undefined) payload.upi_id = updates.upi_id.trim() || null;
    if (updates.helper_type !== undefined) payload.helper_type = updates.helper_type;

    const { data, error } = await supabase
      .from('family_members')
      .update(payload)
      .eq('id', memberId)
      .select()
      .maybeSingle();

    if (error || !data) return undefined;

    return {
      ...data,
      relation_type: data.relation_type || (data.role === 'elder' ? 'Elder' : undefined),
    };
  }

  async deleteMember(memberId: string): Promise<boolean> {
    const { error } = await supabase.from('family_members').delete().eq('id', memberId);
    return !error;
  }

  // Medications
  async getMedications(familyId: string): Promise<Medication[]> {
    const { data, error } = await supabase.from('medications').select('*').eq('family_id', familyId);
    if (error || !data) return [];
    return data.map((m: any) => ({ ...m }));
  }

  async addMedication(med: Omit<Medication, 'id' | 'created_at'>): Promise<Medication> {
    const newMed: Medication = {
      ...med,
      id: `med-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    await supabase.from('medications').insert([newMed]);

    return newMed;
  }

  // Medication Logs
  async getMedicationLogs(familyId: string): Promise<MedicationLog[]> {
    const { data, error } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('family_id', familyId)
      .order('taken_at', { ascending: false });
    if (error || !data) return [];
    return data;
  }

  async logMedication(log: Omit<MedicationLog, 'id'>): Promise<MedicationLog> {
    const newLog: MedicationLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    await supabase.from('medication_logs').insert([newLog]);
    return newLog;
  }

  // Appointments
  async getAppointments(familyId: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('family_id', familyId)
      .order('scheduled_at', { ascending: true });
    if (error || !data) return [];
    return data;
  }

  async addAppointment(appt: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newAppt: Appointment = {
      ...appt,
      id: `appt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    await supabase.from('appointments').insert([newAppt]);
    return newAppt;
  }

  // Helper Tasks
  async getTasks(familyId: string): Promise<HelperTask[]> {
    const { data, error } = await supabase.from('helper_tasks').select('*').eq('family_id', familyId);
    if (error || !data) return [];
    return data;
  }

  async addTask(task: Omit<HelperTask, 'id' | 'created_at'>): Promise<HelperTask> {
    const newTask: HelperTask = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    await supabase.from('helper_tasks').insert([newTask]);
    return newTask;
  }

  async updateTaskStatus(taskId: string, completed: boolean): Promise<HelperTask | undefined> {
    const { data, error } = await supabase
      .from('helper_tasks')
      .update({ completed })
      .eq('id', taskId)
      .select()
      .maybeSingle();
    if (error || !data) return undefined;
    return data;
  }

  // Payments
  async getPayments(familyId: string): Promise<HelperPayment[]> {
    const { data, error } = await supabase
      .from('helper_payments')
      .select('*')
      .eq('family_id', familyId)
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data;
  }

  async createPaymentRecord(payment: Omit<HelperPayment, 'id' | 'created_at'>): Promise<HelperPayment> {
    const newPay: HelperPayment = {
      ...payment,
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString(),
    };
    await supabase.from('helper_payments').insert([newPay]);
    return newPay;
  }

  async updatePaymentStatus(orderId: string, status: 'paid' | 'failed'): Promise<HelperPayment | undefined> {
    const { data, error } = await supabase
      .from('helper_payments')
      .update({ status })
      .eq('order_id', orderId)
      .select()
      .maybeSingle();
    if (error || !data) return undefined;
    return data;
  }

  // WhatsApp Messages
  async getMessages(): Promise<WhatsAppMessage[]> {
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .select('*')
      .order('timestamp', { ascending: true });
    if (error || !data) return [];
    return data;
  }

  async addMessage(msg: Omit<WhatsAppMessage, 'id' | 'timestamp'>): Promise<WhatsAppMessage> {
    const newMsg: WhatsAppMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    await supabase.from('whatsapp_messages').insert([newMsg]);
    return newMsg;
  }
}

export const supabaseDataRepository = new SupabaseDataRepository();
