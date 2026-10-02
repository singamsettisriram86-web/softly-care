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
  private isConfigured(): boolean {
    return Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_WHATSAPP_NUMBER
    );
  }

  async sendMedicationReminder(params: SendReminderParams) {
    const { to, medicationName, dosage, time, medicationId, familyId = 'fam-sharma' } = params;
    const body = `💊 Reminder: Time for *${medicationName}* (${dosage}) at ${time}.\nReply *DONE* once taken.`;

    if (this.isConfigured()) {
      try {
        // Dynamic import to avoid crash if twilio credentials are empty
        const twilio = (await import('twilio')).default;
        const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
        const message = await client.messages.create({
          from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${to}`,
          body,
        });

        await memoryDataRepository.addMessage({
          to,
          direction: 'outbound',
          body,
          medication_id: medicationId,
          status: 'sent',
        });

        return { success: true, sid: message.sid, simulated: false };
      } catch (err: any) {
        console.warn('Twilio delivery failed, falling back to local simulation:', err.message);
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
