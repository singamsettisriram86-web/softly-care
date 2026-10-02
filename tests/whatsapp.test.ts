import { whatsappService } from '../lib/whatsapp-service';
import { memoryDataRepository } from '../lib/data-repository';

describe('WhatsApp Reminders & Webhook Service', () => {
  it('sends reminder and stores message in repository', async () => {
    const result = await whatsappService.sendMedicationReminder({
      to: '+919123456789',
      medicationName: 'Metformin',
      dosage: '500mg',
      time: '08:00 AM',
      familyId: 'fam-sharma',
    });

    expect(result.success).toBe(true);
    expect(result.sid).toBeDefined();

    const messages = await memoryDataRepository.getMessages();
    const lastMsg = messages[messages.length - 1];
    expect(lastMsg.direction).toBe('outbound');
    expect(lastMsg.body).toContain('Metformin');
  });

  it('handles inbound "DONE" reply and logs medication intake', async () => {
    const result = await whatsappService.handleInboundMessage({
      from: '+919123456789',
      body: 'DONE',
      familyId: 'fam-sharma',
    });

    expect(result.success).toBe(true);
    expect(result.action).toBe('medication_logged');

    const logs = await memoryDataRepository.getMedicationLogs('fam-sharma');
    expect(logs[0].status).toBe('taken');
    expect(logs[0].channel).toBe('whatsapp');
  });
});
