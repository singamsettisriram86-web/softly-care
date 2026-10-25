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
  HelperMarketplaceProfile,
  HelperLead,
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

  async getUserFamilies(user: { id?: string; name?: string; email?: string }): Promise<Family[]> {
    if (!user) return [];
    try {
      const cleanEmail = user.email ? user.email.trim().toLowerCase() : '';
      const userId = user.id ? user.id.trim() : '';

      const familiesMap = new Map<string, Family>();

      // 1. Query families by owner_email
      if (cleanEmail) {
        const { data: byEmail, error: errEmail } = await supabase
          .from('families')
          .select('*')
          .ilike('owner_email', cleanEmail)
          .order('created_at', { ascending: false });
        if (!errEmail && byEmail) {
          byEmail.forEach((f: Family) => familiesMap.set(f.id, f));
        }
      }

      // 2. Query families by user_id
      if (userId) {
        const { data: byUserId, error: errUid } = await supabase
          .from('families')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (!errUid && byUserId) {
          byUserId.forEach((f: Family) => familiesMap.set(f.id, f));
        }

        // 3. Query family_members for caregiver role with user_id
        const { data: memberRows } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('role', 'caregiver')
          .eq('user_id', userId);

        if (memberRows && memberRows.length > 0) {
          const missingIds = memberRows
            .map((m: any) => m.family_id)
            .filter((fid: string) => fid && !familiesMap.has(fid));
          if (missingIds.length > 0) {
            const { data: memberFams } = await supabase
              .from('families')
              .select('*')
              .in('id', missingIds);
            if (memberFams) {
              memberFams.forEach((f: Family) => familiesMap.set(f.id, f));
            }
          }
        }
      }

      return Array.from(familiesMap.values());
    } catch (e) {
      console.warn('[Supabase] getUserFamilies error:', e);
      return [];
    }
  }

  async getUserFamily(user: { id?: string; name?: string; email?: string }): Promise<Family | undefined> {
    const fams = await this.getUserFamilies(user);
    return fams[0];
  }

  async registerFamily(params: {
    familyName: string;
    caregiverName: string;
    caregiverPhone?: string;
    caregiverCity?: string;
    userId?: string;
    userEmail?: string;
    careMembers?: { relation: string; name: string; city: string; phone?: string }[];
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
      user_id: params.userId || undefined,
      owner_email: params.userEmail ? params.userEmail.trim().toLowerCase() : undefined,
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
        phone: cm.phone?.trim() || '',
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

  // Helper Marketplace
  async getMarketplaceHelpers(filters?: {
    city?: string;
    helper_type?: string;
    skill?: string;
    available_only?: boolean;
    search?: string;
  }): Promise<HelperMarketplaceProfile[]> {
    let query = supabase
      .from('helper_marketplace_profiles')
      .select('*')
      .order('is_available', { ascending: false })
      .order('experience_years', { ascending: false });

    if (filters?.available_only) {
      query = query.eq('is_available', true);
    }

    if (filters?.helper_type && filters.helper_type !== 'all') {
      if (filters.helper_type === 'live_in') {
        query = query.in('helper_type', ['live_in', 'both']);
      } else if (filters.helper_type === 'visiting') {
        query = query.in('helper_type', ['visiting', 'both']);
      }
    }

    const { data, error } = await query;
    if (error || !data) return [];

    let results = data as HelperMarketplaceProfile[];

    // City filter (matches either base_city or within service_cities array)
    if (filters?.city && filters.city !== 'all') {
      const cityLower = filters.city.trim().toLowerCase();
      results = results.filter((h) => {
        const inBase = h.base_city?.toLowerCase().includes(cityLower);
        const inService = (h.service_cities || []).some((sc) => sc.toLowerCase().includes(cityLower));
        return inBase || inService;
      });
    }

    // Skill filter
    if (filters?.skill && filters.skill !== 'all') {
      const skillLower = filters.skill.trim().toLowerCase();
      results = results.filter((h) =>
        (h.skills || []).some((s) => s.toLowerCase().includes(skillLower))
      );
    }

    // Text search query
    if (filters?.search && filters.search.trim()) {
      const term = filters.search.trim().toLowerCase();
      results = results.filter((h) =>
        h.name.toLowerCase().includes(term) ||
        h.base_city.toLowerCase().includes(term) ||
        (h.bio && h.bio.toLowerCase().includes(term)) ||
        (h.skills || []).some((s) => s.toLowerCase().includes(term)) ||
        (h.languages || []).some((l) => l.toLowerCase().includes(term))
      );
    }

    return results;
  }

  async getMarketplaceHelperById(id: string): Promise<HelperMarketplaceProfile | undefined> {
    const { data, error } = await supabase
      .from('helper_marketplace_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as HelperMarketplaceProfile;
  }

  async getMarketplaceHelperByUserId(userId: string): Promise<HelperMarketplaceProfile | undefined> {
    if (!userId) return undefined;
    const { data, error } = await supabase
      .from('helper_marketplace_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) return undefined;
    return data as HelperMarketplaceProfile;
  }

  async createMarketplaceHelper(
    profile: Omit<HelperMarketplaceProfile, 'id' | 'created_at' | 'updated_at'>
  ): Promise<HelperMarketplaceProfile> {
    const id = `hlp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newHelper: HelperMarketplaceProfile = {
      ...profile,
      id,
      user_id: profile.user_id,
      is_verified: true,
      is_available: profile.is_available !== undefined ? profile.is_available : true,
      availability_note: profile.availability_note || 'Available immediately',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await supabase.from('helper_marketplace_profiles').insert([newHelper]);
    return newHelper;
  }

  async updateMarketplaceHelper(
    id: string,
    updates: Partial<HelperMarketplaceProfile>
  ): Promise<HelperMarketplaceProfile | undefined> {
    const { data, error } = await supabase
      .from('helper_marketplace_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error || !data) return undefined;
    return data as HelperMarketplaceProfile;
  }

  async deleteMarketplaceHelper(id: string): Promise<boolean> {
    try {
      // First remove any captured leads for this helper
      await supabase.from('helper_leads').delete().eq('helper_id', id);
      // Remove the profile
      const { error } = await supabase
        .from('helper_marketplace_profiles')
        .delete()
        .eq('id', id);
      return !error;
    } catch (e) {
      console.error('[SupabaseRepository] deleteMarketplaceHelper error:', e);
      return false;
    }
  }

  async createHelperLead(lead: {
    helper_id: string;
    seeker_name: string;
    seeker_phone: string;
    seeker_city?: string;
  }): Promise<HelperLead> {
    const newLead: HelperLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      helper_id: lead.helper_id,
      seeker_name: lead.seeker_name.trim(),
      seeker_phone: lead.seeker_phone.trim(),
      seeker_city: lead.seeker_city ? lead.seeker_city.trim() : undefined,
      created_at: new Date().toISOString(),
    };

    await supabase.from('helper_leads').insert([newLead]);
    return newLead;
  }

  async getHelperLeads(helperId: string): Promise<HelperLead[]> {
    const { data, error } = await supabase
      .from('helper_leads')
      .select('*')
      .eq('helper_id', helperId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return data as HelperLead[];
  }
}

export const supabaseDataRepository = new SupabaseDataRepository();

