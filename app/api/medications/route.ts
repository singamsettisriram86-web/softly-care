import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');
  if (!familyId) {
    return NextResponse.json({ success: false, error: 'familyId is required' }, { status: 400 });
  }
  const medications = await memoryDataRepository.getMedications(familyId);
  return NextResponse.json({ success: true, medications });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { family_id, name, dosage, schedule, instructions, for_member_id, for_member_name } = body;
    if (!family_id) {
      return NextResponse.json({ success: false, error: 'family_id is required' }, { status: 400 });
    }

    if (!name || !dosage || !schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Name, dosage, and at least one schedule time are required' },
        { status: 400 }
      );
    }

    const newMed = await memoryDataRepository.addMedication({
      family_id,
      name,
      dosage,
      schedule,
      instructions: instructions || '',
      active: true,
      for_member_id,
      for_member_name,
    });

    return NextResponse.json({ success: true, medication: newMed }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
