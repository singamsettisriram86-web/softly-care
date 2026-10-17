import { NextRequest, NextResponse } from 'next/server';
import { cashfreeService } from '@/lib/cashfree-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      amountINR,
      purpose = 'Helper Caregiving Fee',
      helperName = 'Local Helper',
      helperUpi,
      familyId,
    } = body;

    if (!amountINR || isNaN(amountINR) || Number(amountINR) <= 0) {
      return NextResponse.json(
        { success: false, error: 'A valid amount in INR is required' },
        { status: 400 }
      );
    }

    const orderResult = await cashfreeService.createOrder({
      amountINR: Number(amountINR),
      purpose,
      helperName,
      helperUpi,
      familyId,
    });

    return NextResponse.json(orderResult, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
