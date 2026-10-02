import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId') || 'fam-sharma';
  const medications = await memoryDataRepository.getMedications(familyId);
  return NextResponse.json({ success: true, medications });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { family_id = 'fam-sharma', name, dosage, schedule, instructions } = body;

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
    });

    return NextResponse.json({ success: true, medication: newMed }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
