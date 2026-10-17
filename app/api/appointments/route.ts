import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

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

    return NextResponse.json({ success: true, appointment: newAppt }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
