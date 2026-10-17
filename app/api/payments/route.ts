import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const familyId = searchParams.get('familyId');
  if (!familyId) {
    return NextResponse.json({ success: false, error: 'familyId is required' }, { status: 400 });
  }
  const payments = await memoryDataRepository.getPayments(familyId);
  return NextResponse.json({ success: true, payments });
}
