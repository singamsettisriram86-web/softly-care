import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp-service';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      medicationId,
      to = '+919123456789',
      familyId,
    } = body;
    if (!familyId) {
      return NextResponse.json({ success: false, error: 'familyId is required' }, { status: 400 });
    }

    let medName = 'Prescribed Medication';
    let dosage = 'As advised';
    let time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    let forMemberName: string | undefined;

    if (medicationId) {
      const meds = await memoryDataRepository.getMedications(familyId);
      const found = meds.find((m) => m.id === medicationId);
      if (found) {
        medName = found.name;
        dosage = found.dosage;
        time = found.schedule[0] || time;
        forMemberName = found.for_member_name;
      }
    }

    const result = await whatsappService.sendMedicationReminder({
      to,
      medicationName: medName,
      dosage,
      time,
      medicationId,
      familyId,
      forMemberName,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
