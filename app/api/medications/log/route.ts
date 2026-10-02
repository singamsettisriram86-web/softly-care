import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      medication_id,
      family_id = 'fam-sharma',
      status = 'taken',
      taken_by_name = 'Aditya (Caregiver)',
      channel = 'app',
    } = body;

    if (!medication_id) {
      return NextResponse.json(
        { success: false, error: 'medication_id is required' },
        { status: 400 }
      );
    }

    const log = await memoryDataRepository.logMedication({
      medication_id,
      family_id,
      taken_at: new Date().toISOString(),
      taken_by_name,
      status,
      channel,
    });

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
