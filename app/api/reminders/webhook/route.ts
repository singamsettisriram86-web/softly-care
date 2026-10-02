import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp-service';

export async function POST(req: NextRequest) {
  try {
    let from = '+919123456789';
    let body = 'DONE';
    let medicationId: string | undefined;
    let familyId: string | undefined;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await req.json();
      from = json.from || json.From || from;
      body = json.body || json.Body || body;
      medicationId = json.medicationId;
      familyId = json.familyId;
    } else {
      // Handles x-www-form-urlencoded from Twilio Webhooks
      const formData = await req.formData();
      from = (formData.get('From') as string) || from;
      body = (formData.get('Body') as string) || body;
    }

    const result = await whatsappService.handleInboundMessage({
      from,
      body,
      familyId,
      medicationId,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
