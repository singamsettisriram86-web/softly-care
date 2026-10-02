import { NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function GET() {
  const messages = await memoryDataRepository.getMessages();
  return NextResponse.json({ success: true, messages });
}
