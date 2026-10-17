import { memoryDataRepository } from './data-repository';

export interface SendReminderParams {
  to: string;
  medicationName: string;
  dosage: string;
  time: string;
  medicationId?: string;
  familyId?: string;
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

  async sendMedicationReminder(params: SendReminderParams) {
    const { to, medicationName, dosage, time, medicationId, familyId = 'fam-sharma' } = params;

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

    const body = `💊 Softly Reminder: Time for *${medicationName}* (${dosage}) at ${time}.\n\nReply *DONE* once taken so your family knows you are safe.`;

    // 1. Prioritize Meta WhatsApp Cloud API (Zero cost tier / official)
    if (this.isMetaConfigured()) {
      try {
        const metaRecipient = this.formatPhoneForMeta(to);
        const endpoint = `https://graph.facebook.com/v20.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

        // Send text message payload
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
          const errCode = data.error?.code;
          const errMsg = data.error?.message || 'Meta WhatsApp dispatch failed';
          console.error('[Meta Cloud API Error]', data.error);

          // If message failed because outside 24h window (code 131047), attempt template fallback
          if (errCode === 131047) {
            const templateRes = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                messaging_product: 'whatsapp',
                to: metaRecipient,
                type: 'template',
                template: {
                  name: 'hello_world',
                  language: { code: 'en_US' },
                },
              }),
            });
            const templateData = await templateRes.json();
            if (templateRes.ok && templateData.messages?.[0]?.id) {
              return { success: true, messageId: templateData.messages[0].id, channel: 'meta_cloud_template' };
            }
          }

          return { success: false, simulated: false, error: errMsg, code: errCode };
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

        return { success: true, messageId, simulated: false, channel: 'meta_cloud' };
      } catch (err: any) {
        console.error('[Meta WhatsApp] Delivery failed:', err.message);
        return { success: false, simulated: false, error: err.message };
      }
    }

    // 2. Fallback to Twilio if Meta is not configured
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

        return { success: true, sid: message.sid, simulated: false, channel: 'twilio' };
      } catch (err: any) {
        console.error('[Twilio] Delivery failed:', err.message, err.code);
        return { success: false, simulated: false, error: err.message, twilioCode: err.code };
      }
    }

    // Local / Dev Simulation Mode
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

  async handleInboundMessage(params: {
    from: string;
    body: string;
    familyId?: string;
    medicationId?: string;
  }) {
    const { from, body, familyId = 'fam-sharma', medicationId } = params;
    const cleanBody = body.trim();

    // Record incoming message in simulator feed
    const inboundMsg = await memoryDataRepository.addMessage({
      to: from,
      direction: 'inbound',
      body: cleanBody,
      medication_id: medicationId,
      status: 'received',
    });

    // Check for affirmative confirmation (e.g. "DONE", "TAKEN", "YES")
    const isAffirmative = /^(done|taken|yes|ha|haan)$/i.test(cleanBody);

    if (isAffirmative) {
      const meds = await memoryDataRepository.getMedications(familyId);
      const targetMed = medicationId
        ? meds.find((m) => m.id === medicationId)
        : meds[0];

      if (targetMed) {
        const log = await memoryDataRepository.logMedication({
          medication_id: targetMed.id,
          family_id: familyId,
          taken_at: new Date().toISOString(),
          taken_by_name: 'Parent (via WhatsApp)',
          status: 'taken',
          channel: 'whatsapp',
        });

        return {
          success: true,
          action: 'medication_logged',
          log,
          inboundMsg,
        };
      }
    }

    return {
      success: true,
      action: 'message_recorded',
      inboundMsg,
    };
  }
}

export const whatsappService = new WhatsAppService();
