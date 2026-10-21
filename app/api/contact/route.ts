import { NextRequest, NextResponse } from 'next/server';

// Server-side support recipient — never exposed to client
const SUPPORT_DESTINATION_EMAIL = process.env.SUPPORT_EMAIL || 'sriramsingamsetty00@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, category = 'General', message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const ticketId = `TICK-${Date.now().toString().slice(-6)}`;
    const timestamp = new Date().toISOString();

    // Log the inquiry on server
    console.log(`[Softly Support Ticket ${ticketId}] From: ${name} (${email}, Phone: ${phone || 'N/A'})`);
    console.log(`Category: ${category}`);
    console.log(`Message: ${message}`);
    console.log(`Forwarding target configured: ${SUPPORT_DESTINATION_EMAIL}`);

    // If an n8n webhook URL is configured, forward the ticket payload to the n8n agent workflow
    const n8nWebhook = process.env.N8N_WEBHOOK_URL;
    if (n8nWebhook) {
      try {
        fetch(n8nWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId,
            timestamp,
            name,
            email,
            phone: phone || null,
            category,
            message,
            source: 'softly_contact_form',
          }),
        }).catch((err) => console.error('[Contact] n8n dispatch error:', err));
      } catch (e) {
        // Non-blocking
      }
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: 'Thank you for reaching out. Our 24/7 care support desk has received your ticket and is processing it now.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to submit message.' },
      { status: 500 }
    );
  }
}
