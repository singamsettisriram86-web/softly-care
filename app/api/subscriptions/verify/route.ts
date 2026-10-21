import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, familyId, plan = 'monthly_299' } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'orderId is required' }, { status: 400 });
    }

    const appId = process.env.CASHFREE_APP_ID || '';
    const secretKey = process.env.CASHFREE_SECRET_KEY || '';
    const isProduction = process.env.CASHFREE_ENV === 'production';
    const baseUrl = isProduction ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg';

    const res = await fetch(`${baseUrl}/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': appId,
        'x-client-secret': secretKey,
        'x-api-version': '2023-08-01',
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ success: false, error: data.message || 'Could not verify order with Cashfree' }, { status: res.status });
    }

    if (data.order_status === 'PAID') {
      if (familyId) {
        await memoryDataRepository.updateFamilySubscription(familyId, {
          subscription_status: 'active',
          subscription_plan: plan,
          subscription_id: orderId,
          whatsapp_quota_used: 0,
          whatsapp_quota_limit: 150,
        });
      }

      return NextResponse.json({
        success: true,
        status: 'PAID',
        message: 'Subscription successfully activated!',
      });
    }

    return NextResponse.json({
      success: false,
      status: data.order_status,
      message: `Order status is ${data.order_status}`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
