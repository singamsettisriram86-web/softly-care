import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { familyId, plan = 'monthly_299', phone: inputPhone } = body;

    const amount = plan === 'yearly_2499' ? 2499 : 299;
    const planName = plan === 'yearly_2499' ? 'Softly Care Premium (1 Year)' : 'Softly Care Premium (1 Month)';

    const appId = process.env.CASHFREE_APP_ID || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    const isProduction = process.env.CASHFREE_ENV === 'production';
    const baseUrl = isProduction ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    let customerId: string;
    let customerName: string;
    let customerPhone = '';
    let customerEmail: string;
    let orderId: string;
    let returnUrl: string;

    // Check user cookie first
    const softlyUserCookie = req.cookies.get('softly_user')?.value;
    let loggedInUser: { id?: string; name?: string; email?: string } | null = null;
    if (softlyUserCookie) {
      try {
        loggedInUser = JSON.parse(softlyUserCookie);
      } catch {}
    }

    if (familyId) {
      // Family-linked subscription
      const family = await memoryDataRepository.getFamily(familyId);
      if (!family) {
        return NextResponse.json({ success: false, error: 'Family space not found' }, { status: 404 });
      }

      const members = await memoryDataRepository.getMembers(familyId);
      const caregiver = members.find((m) => m.role === 'caregiver');

      customerId = (caregiver?.id || familyId).replace(/[^a-zA-Z0-9_-]/g, '_');
      customerName = caregiver?.name || loggedInUser?.name || 'Softly Member';
      customerEmail = loggedInUser?.email || 'caregiver@softlycare.in';

      const candidatePhone = (inputPhone || caregiver?.phone || '').replace(/[^0-9]/g, '').slice(-10);
      if (candidatePhone && candidatePhone.length === 10) {
        customerPhone = candidatePhone;
      }

      orderId = `sub_${familyId}_${Date.now()}`;
      returnUrl = `${req.nextUrl.origin}/dashboard?familyId=${familyId}&sub_status=success&order_id={order_id}`;
    } else {
      // User-level subscription (no family yet — pay first, link family later)
      const userId = loggedInUser?.id || `user_${Date.now()}`;
      customerId = userId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
      customerName = loggedInUser?.name || 'Softly Member';
      customerEmail = loggedInUser?.email || 'user@softlycare.in';

      const candidatePhone = (inputPhone || '').replace(/[^0-9]/g, '').slice(-10);
      if (candidatePhone && candidatePhone.length === 10) {
        customerPhone = candidatePhone;
      }

      orderId = `sub_user_${customerId}_${Date.now()}`;
      returnUrl = `${req.nextUrl.origin}/subscribe?pay_done=1&order_id={order_id}`;
    }

    // Strict validation: Require a valid 10-digit phone number so Cashfree displays the customer's actual number
    if (!customerPhone || customerPhone.length !== 10 || /^(\d)\1{9}$/.test(customerPhone)) {
      return NextResponse.json({
        success: false,
        error: 'Please enter a valid 10-digit mobile number so Cashfree can load your UPI apps.',
      }, { status: 400 });
    }

    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: customerId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
      },
      order_meta: {
        return_url: returnUrl,
        notify_url: `${req.nextUrl.origin}/api/subscriptions/webhook`,
      },
      order_note: `${planName} - Automated WhatsApp reminders & clinical coordinator`,
      order_tags: {
        family_id: familyId || 'pending',
        plan: plan,
      },
    };

    const res = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderPayload),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Cashfree subscription order creation failed' }, { status: res.status });
    }

    return NextResponse.json({
      success: true,
      orderId,
      paymentSessionId: data.payment_session_id,
      amount,
      plan,
      isProduction,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
