import { NextRequest, NextResponse } from 'next/server';
import { whatsappService } from '@/lib/whatsapp-service';

// Meta Webhook Verification (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const verifyToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'softly_care_meta_verify_2026';

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[Meta Webhook] Successfully verified webhook challenge');
    return new Response(challenge, { status: 200 });
  }

  return new Response('Verification failed', { status: 403 });
}

// Inbound Message Handler (POST)
export async function POST(req: NextRequest) {
  try {
    let from = '+919123456789';
    let body = 'DONE';
    let medicationId: string | undefined;
    let familyId: string | undefined;

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const json = await req.json();

      // Check if this is a Meta WhatsApp Cloud API Webhook payload
      if (json.object === 'whatsapp_business_account') {
        const entry = json.entry?.[0];
        const change = entry?.changes?.[0]?.value;
        const message = change?.messages?.[0];

        if (!message) {
          // Status updates (delivered, read, sent) - acknowledge with 200 OK
          return NextResponse.json({ success: true, status: 'event_acknowledged' });
        }

        from = message.from ? (message.from.startsWith('+') ? message.from : `+${message.from}`) : from;
        body = message.text?.body || message.button?.text || message.interactive?.button_reply?.title || 'DONE';
      } else {
        // Direct test JSON payload
        from = json.from || json.From || from;
        body = json.body || json.Body || body;
        medicationId = json.medicationId;
        familyId = json.familyId;
      }
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
    console.error('[Webhook Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

