import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { familyId, plan = 'monthly_299' } = body;

    const amount = plan === 'yearly_2499' ? 2499 : 299;
    const planName = plan === 'yearly_2499' ? 'Softly Care Premium (1 Year)' : 'Softly Care Premium (1 Month)';

    const appId = process.env.CASHFREE_APP_ID || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    const isProduction = process.env.CASHFREE_ENV === 'production';
    const baseUrl = isProduction ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    let customerId: string;
    let customerName: string;
    let customerPhone: string;
    let customerEmail: string;
    let orderId: string;
    let returnUrl: string;

    if (familyId) {
      // Family-linked subscription
      const family = await memoryDataRepository.getFamily(familyId);
      if (!family) {
        return NextResponse.json({ success: false, error: 'Family space not found' }, { status: 404 });
      }

      const members = await memoryDataRepository.getMembers(familyId);
      const caregiver = members.find((m) => m.role === 'caregiver');

      customerId = (caregiver?.id || familyId).replace(/[^a-zA-Z0-9_-]/g, '_');
      customerPhone = (caregiver?.phone || '+919999999999').replace(/[^0-9]/g, '').slice(-10) || '9999999999';
      customerName = caregiver?.name || 'Caregiver';
      customerEmail = 'caregiver@softlycare.in';
      orderId = `sub_${familyId}_${Date.now()}`;
      returnUrl = `${req.nextUrl.origin}/dashboard?familyId=${familyId}&sub_status=success&order_id={order_id}`;
    } else {
      // User-level subscription (no family yet — pay first, link family later)
      // Read auth from cookie
      const authCookie = req.cookies.get('softly_auth')?.value || req.cookies.get('auth_token')?.value || '';
      let userId = `user_${Date.now()}`;
      let userName = 'Softly User';
      let userEmail = '';

      if (authCookie) {
        try {
          // Try to decode the auth cookie (it may be base64 JSON or JWT-like)
          const decoded = Buffer.from(authCookie, 'base64').toString('utf-8');
          const parsed = JSON.parse(decoded);
          userId = parsed.id || parsed.userId || userId;
          userName = parsed.name || userName;
          userEmail = parsed.email || '';
        } catch {
          // Cookie not base64 JSON - use defaults
        }
      }

      customerId = userId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
      customerName = userName;
      customerPhone = '9999999999';
      customerEmail = userEmail || 'user@softlycare.in';
      orderId = `sub_user_${customerId}_${Date.now()}`;
      returnUrl = `${req.nextUrl.origin}/subscribe?pay_done=1&order_id={order_id}`;
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
