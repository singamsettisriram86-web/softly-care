import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';
import { getGoogleCalendarUrl } from '@/lib/calendar';
import { whatsappService } from '@/lib/whatsapp-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');
  if (!familyId) {
    return NextResponse.json({ success: false, error: 'familyId is required' }, { status: 400 });
  }
  const appointments = await memoryDataRepository.getAppointments(familyId);
  return NextResponse.json({ success: true, appointments });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      family_id,
      title,
      doctor_name,
      clinic_address,
      scheduled_at,
      helper_name,
      notes,
      for_member_id,
      for_member_name,
    } = body;
    if (!family_id) {
      return NextResponse.json({ success: false, error: 'family_id is required' }, { status: 400 });
    }

    if (!title || !doctor_name || !scheduled_at) {
      return NextResponse.json(
        { success: false, error: 'Title, doctor name, and scheduled date/time are required' },
        { status: 400 }
      );
    }

    const newAppt = await memoryDataRepository.addAppointment({
      family_id,
      title,
      doctor_name,
      clinic_address: clinic_address || '',
      scheduled_at,
      helper_name,
      status: 'scheduled',
      notes,
      for_member_id,
      for_member_name,
    });

    // Notify Caregiver on WhatsApp with Google Calendar 1-click sync link
    try {
      const members = await memoryDataRepository.getMembers(family_id);
      const caregiver = members.find((m) => m.role === 'caregiver' && m.phone && m.phone.trim() !== '');
      if (caregiver && caregiver.phone) {
        const gCal = getGoogleCalendarUrl(newAppt);
        const apptDate = new Date(scheduled_at).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        });
        const apptTime = new Date(scheduled_at).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const msg = `🏥 *Softly Doctor Appointment Scheduled*\n\n` +
          `• *For:* ${for_member_name || 'Family Member'}\n` +
          `• *Doctor:* ${doctor_name}\n` +
          `• *Date & Time:* ${apptDate} at ${apptTime}\n` +
          (clinic_address ? `• *Clinic:* ${clinic_address}\n` : '') +
          (helper_name ? `• *Accompanied by:* ${helper_name}\n` : '') +
          `\n📅 *Add to your Google Calendar (1-tap):*\n${gCal}`;

        whatsappService.sendRawMessage(caregiver.phone, msg, undefined, family_id)
          .catch((err) => console.warn('[Appointment WhatsApp] Dispatch error:', err?.message));
      }
    } catch (e: any) {
      console.warn('[Appointment WhatsApp] Calendar alert error:', e?.message);
    }

    return NextResponse.json({ success: true, appointment: newAppt }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
