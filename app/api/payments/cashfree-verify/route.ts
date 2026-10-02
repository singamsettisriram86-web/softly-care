import { NextRequest, NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/cashfree-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'orderId is required' },
        { status: 400 }
      );
    }

    const verifyResult = await cashfreeService.verifyPayment(orderId);
    return NextResponse.json(verifyResult);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
