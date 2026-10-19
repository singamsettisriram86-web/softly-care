import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';
import { whatsappService } from '@/lib/whatsapp-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { helper_id, seeker_name, seeker_phone, seeker_city } = body;

    if (!helper_id || !seeker_name || !seeker_phone) {
      return NextResponse.json(
        { success: false, error: 'Helper ID, your name, and phone number are required.' },
        { status: 400 }
      );
    }

    const lead = await memoryDataRepository.createHelperLead({
      helper_id,
      seeker_name,
      seeker_phone,
      seeker_city,
    });

    // Optionally notify helper on WhatsApp
    try {
      const helper = await memoryDataRepository.getMarketplaceHelperById(helper_id);
      if (helper && helper.phone) {
        const leadMsg = `🔔 *Softly Caregiver Lead Alert*\n\nNamaste *${helper.name}*!\n\nA family seeking elderly care just unlocked your profile:\n• *Name*: ${seeker_name}\n• *Phone*: +91 ${seeker_phone}\n${seeker_city ? `• *Location*: ${seeker_city}\n` : ''}\nThey may call or message you on WhatsApp shortly. Please be responsive! 🌿`;
        await whatsappService.sendRawMessage(helper.phone, leadMsg);
      }
    } catch (e) {
      console.warn('[Marketplace Lead] Helper WhatsApp notify skipped:', e);
    }

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error: any) {
    console.error('[API Marketplace Leads POST Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const helperId = searchParams.get('helperId') || searchParams.get('helper_id');

    if (!helperId) {
      return NextResponse.json({ success: false, error: 'helperId query param required' }, { status: 400 });
    }

    const leads = await memoryDataRepository.getHelperLeads(helperId);
    return NextResponse.json({ success: true, leads });
  } catch (error: any) {
    console.error('[API Marketplace Leads GET Error]:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
