import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');
  if (!familyId) {
    return NextResponse.json({ success: false, error: 'familyId is required' }, { status: 400 });
  }
  const logs = await memoryDataRepository.getMedicationLogs(familyId);
  return NextResponse.json({ success: true, logs });
}
