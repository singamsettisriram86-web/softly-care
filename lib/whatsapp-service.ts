import { memoryDataRepository } from './data-repository';

export interface SendReminderParams {
  to: string;
  medicationName: string;
  dosage: string;
  time: string;
  medicationId?: string;
  familyId?: string;
  forMemberName?: string;
}

export class WhatsAppService {
  private isMetaConfigured(): boolean {
    return Boolean(
      process.env.META_ACCESS_TOKEN &&
        process.env.META_PHONE_NUMBER_ID
    );
  }

  private isTwilioConfigured(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_WHATSAPP_NUMBER
    );
  }

  private formatPhoneForMeta(phone: string): string {
    let clean = phone.replace(/[^\d]/g, '');
    // If it's a 10-digit Indian number without country code, prefix 91
    if (clean.length === 10 && /^[6-9]/.test(clean)) {
      clean = '91' + clean;
    }
    return clean;
  }

  async sendRawMessage(to: string, body: string, medicationId?: string, familyId?: string) {
    if (!to || !to.trim()) return { success: false, error: 'Recipient phone missing' };

    // 1. Meta WhatsApp Cloud API
    if (this.isMetaConfigured()) {
      try {
        const metaRecipient = this.formatPhoneForMeta(to);
        const endpoint = `https://graph.facebook.com/v20.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: metaRecipient,
            type: 'text',
            text: {
              preview_url: false,
              body,
            },
          }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          console.error('[Meta Cloud API Error]', data.error);
          return { success: false, error: data.error?.message, code: data.error?.code };
        }

        const messageId = data.messages?.[0]?.id;

        if (familyId) {
          await memoryDataRepository.incrementWhatsappQuota(familyId);
        }

        await memoryDataRepository.addMessage({
          to,
          direction: 'outbound',
          body,
          medication_id: medicationId,
          status: 'sent',
        });

        return { success: true, messageId, channel: 'meta_cloud' };
      } catch (err: any) {
        console.error('[Meta WhatsApp] Dispatch failed:', err.message);
        return { success: false, error: err.message };
      }
    }

    // 2. Twilio Fallback
    if (this.isTwilioConfigured()) {
      try {
        const twilio = (await import('twilio')).default;
        const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
        const message = await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${to}`,
          body,
        });

        if (familyId) {
          await memoryDataRepository.incrementWhatsappQuota(familyId);
        }

        await memoryDataRepository.addMessage({
          to,
          direction: 'outbound',
          body,
          medication_id: medicationId,
          status: 'sent',
        });

        return { success: true, sid: message.sid, channel: 'twilio' };
      } catch (err: any) {
        console.error('[Twilio] Delivery failed:', err.message);
        return { success: false, error: err.message };
      }
    }

    // 3. Local Simulation Mode
    const simulatedMsg = await memoryDataRepository.addMessage({
      to,
      direction: 'outbound',
      body,
      medication_id: medicationId,
      status: 'sent',
    });

    return {
      success: true,
      sid: `sim_${simulatedMsg.id}`,
      simulated: true,
      message: simulatedMsg,
    };
  }

  async sendMedicationReminder(params: SendReminderParams) {
    const { to, medicationName, dosage, time, medicationId, familyId = 'fam-sharma', forMemberName } = params;

    // Check trial & subscription firewall
    if (familyId) {
      const fam = await memoryDataRepository.getFamily(familyId);
      if (fam) {
        const now = new Date();
        const trialEnd = fam.trial_ends_at ? new Date(fam.trial_ends_at) : null;
        const isTrialValid = trialEnd && now < trialEnd;
        const isSubscribed = fam.subscription_status === 'active';

        if (!isTrialValid && !isSubscribed) {
          return {
            success: false,
            simulated: false,
            error: 'Subscription required. Free 3-day trial has concluded for this family space.',
            code: 'TRIAL_EXPIRED',
          };
        }

        const quotaUsed = fam.whatsapp_quota_used || 0;
        const quotaLimit = fam.whatsapp_quota_limit || 150;
        if (quotaUsed >= quotaLimit) {
          return {
            success: false,
            simulated: false,
            error: `Monthly WhatsApp reminder quota of ${quotaLimit} reached. Upgrade or add top-up pack to continue.`,
            code: 'QUOTA_EXCEEDED',
          };
        }
      }
    }

    const elderDisplayName = forMemberName || 'Parent';
    const elderBody = `💊 Softly Reminder: Time for *${medicationName}* (${dosage}) at ${time}.\n\nReply *DONE* once taken so your family knows you are safe. 🌿`;

    // 1. Dispatch primary reminder to Elder
    const primaryResult = await this.sendRawMessage(to, elderBody, medicationId, familyId);

    // 2. Check for Live-in Helper (Dual Notification)
    let helperResult: any = null;
    if (familyId) {
      try {
        const members = await memoryDataRepository.getMembers(familyId);
        const liveInHelper = members.find(
          (m) => m.role === 'helper' && m.helper_type === 'live_in' && m.phone && m.phone.trim() !== ''
        );

        if (liveInHelper && liveInHelper.phone) {
          const helperPhoneClean = this.formatPhoneForMeta(liveInHelper.phone);
          const elderPhoneClean = this.formatPhoneForMeta(to);

          // Only send if helper phone is distinct from elder phone
          if (helperPhoneClean !== elderPhoneClean) {
            const helperBody = `💊 Softly Care: Time to give *${medicationName}* (${dosage}) to *${elderDisplayName}* at ${time}.\n\nPlease reply *DONE* once administered so the family knows they are safe. 🌿`;
            helperResult = await this.sendRawMessage(liveInHelper.phone, helperBody, medicationId, familyId);
          }
        }
      } catch (err: any) {
        console.warn('[WhatsAppService] Helper companion dispatch skipped:', err.message);
      }
    }

    return {
      success: primaryResult.success || (helperResult && helperResult.success),
      primary: primaryResult,
      helperNotified: !!helperResult?.success,
    };
  }

  async handleInboundMessage(params: {
    from: string;
    body: string;
    familyId?: string;
    medicationId?: string;
  }) {
    const { from, body, familyId: fallbackFamilyId = 'fam-sharma', medicationId } = params;
    const cleanBody = body.trim();

    // 1. Match sender against registered family members by phone
    let senderMember: any = null;
    try {
      senderMember = await memoryDataRepository.findMemberByPhone(from);
    } catch (e) {
      console.warn('[WhatsAppService] findMemberByPhone error:', e);
    }

    const targetFamilyId = senderMember?.family_id || fallbackFamilyId;

    let takenByName = 'Parent (via WhatsApp)';
    if (senderMember) {
      if (senderMember.role === 'helper') {
        const helperKind = senderMember.helper_type === 'live_in' ? 'Live-in Helper' : 'Helper';
        takenByName = `${senderMember.name} (${helperKind} via WhatsApp)`;
      } else if (senderMember.role === 'elder') {
        takenByName = `${senderMember.name} (Parent via WhatsApp)`;
      } else if (senderMember.role === 'caregiver') {
        takenByName = `${senderMember.name} (Caregiver via WhatsApp)`;
      }
    }

    // Record incoming message in simulator / message log
    const inboundMsg = await memoryDataRepository.addMessage({
      to: from,
      direction: 'inbound',
      body: cleanBody,
      medication_id: medicationId,
      status: 'received',
    });

    // Check for affirmative confirmation (e.g. "DONE", "TAKEN", "YES", "HA", "AYIPOYINDHI", "HO GAYA")
    const isAffirmative = /^(done|taken|yes|ha|haan|completed|ho gaya|hogaya|ayindi|ayipoyindhi|khatam)$/i.test(cleanBody);

    if (isAffirmative) {
      const meds = await memoryDataRepository.getMedications(targetFamilyId);
      const targetMed = medicationId
        ? meds.find((m) => m.id === medicationId)
        : (meds.find((m) => m.active) || meds[0]);

      if (targetMed) {
        const log = await memoryDataRepository.logMedication({
          medication_id: targetMed.id,
          family_id: targetFamilyId,
          taken_at: new Date().toISOString(),
          taken_by_name: takenByName,
          status: 'taken',
          channel: 'whatsapp',
        });

        // Send confirmation back to sender on WhatsApp
        try {
          const ackBody = `✅ Softly Care: Thank you! Recorded that *${targetMed.name}* was taken.\n\nUpdated by ${takenByName} at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Family space is updated. 🌿`;
          await this.sendRawMessage(from, ackBody, targetMed.id, targetFamilyId);
        } catch (e) {
          console.warn('[WhatsAppService] Ack message send failed:', e);
        }

        return {
          success: true,
          action: 'medication_logged',
          log,
          inboundMsg,
          takenByName,
        };
      }
    } else {
      // Friendly auto-reply for greeting / general message to confirm connection
      try {
        const welcomeBody = `👋 Hello! Welcome to *Softly — Elderly Care Coordinator*.\n\nYour automated medication reminders and care coordinator are live! Reply *DONE* or *TAKEN* whenever you take your scheduled medications. 🌿`;
        await this.sendRawMessage(from, welcomeBody, undefined, targetFamilyId);
      } catch (e) {
        console.warn('[WhatsAppService] Welcome reply skipped:', e);
      }
    }

    return {
      success: true,
      action: 'message_recorded',
      inboundMsg,
      takenByName,
    };
  }

  async sendTemplateMessage(params: {
    to: string;
    templateName: string;
    languageCode?: string;
    bodyParameters?: string[];
  }) {
    if (!this.isMetaConfigured()) return { success: false, error: 'Meta not configured' };
    const { to, templateName, languageCode = 'en_US', bodyParameters = [] } = params;
    try {
      const metaRecipient = this.formatPhoneForMeta(to);
      const endpoint = `https://graph.facebook.com/v21.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

      const components: any[] = [];
      if (bodyParameters.length > 0) {
        components.push({
          type: 'body',
          parameters: bodyParameters.map((p) => ({ type: 'text', text: p })),
        });
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: metaRecipient,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            ...(components.length > 0 ? { components } : {}),
          },
        }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        console.warn(`[WhatsApp Template Error - ${templateName}]:`, data.error?.message);
        return { success: false, error: data.error?.message, code: data.error?.code };
      }
      return { success: true, messageId: data.messages?.[0]?.id };
    } catch (e: any) {
      console.warn('[WhatsApp Template Exception]:', e.message);
      return { success: false, error: e.message };
    }
  }

  async sendRegistrationWelcome(params: {
    familyName: string;
    caregiverName: string;
    caregiverPhone?: string;
    careMembers?: { name: string; relation: string; phone?: string }[];
  }) {
    const { familyName, caregiverName, caregiverPhone, careMembers = [] } = params;

    // 1. Send to Caregiver (Son/Daughter)
    if (caregiverPhone && caregiverPhone.trim()) {
      const eldersSummary = careMembers.length > 0
        ? careMembers.map((m) => `${m.relation} (${m.name})`).join(', ')
        : 'your family';

      let res = await this.sendTemplateMessage({
        to: caregiverPhone,
        templateName: 'softly_caregiver_welcome',
        bodyParameters: [caregiverName, eldersSummary],
      });

      if (!res.success) {
        res = await this.sendTemplateMessage({
          to: caregiverPhone,
          templateName: 'softly_welcome',
        });
      }

      if (!res.success) {
        const textBody = `👋 Hello ${caregiverName}! Welcome to *Softly — Elderly Care Coordinator*.\n\nYour family space for *${eldersSummary}* has been successfully registered. You will receive real-time care updates and medication tracking here. 🌿`;
        await this.sendRawMessage(caregiverPhone, textBody);
      }
    }

    // 2. Send to each registered Parent/Elder who has a WhatsApp number
    for (const member of careMembers) {
      if (member.phone && member.phone.trim()) {
        const registeredBy = caregiverName ? `your family (${caregiverName})` : 'your family';

        let res = await this.sendTemplateMessage({
          to: member.phone,
          templateName: 'softly_elder_welcome',
          bodyParameters: [member.name, registeredBy],
        });

        if (!res.success) {
          res = await this.sendTemplateMessage({
            to: member.phone,
            templateName: 'softly_welcome',
          });
        }

        if (!res.success) {
          const textBody = `👋 Hello ${member.name}! You have been registered on *Softly Care* by ${registeredBy}.\n\nYour automated medication reminders and care coordinator are active. Reply *TAKEN* whenever you take your medicines. 🌿`;
          await this.sendRawMessage(member.phone, textBody);
        }
      }
    }
  }
}

export const whatsappService = new WhatsAppService();
