import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('next') || searchParams.get('state') || '/dashboard';
  const isConfigured = authService.isConfigured();
  const url = authService.getGoogleAuthUrl(next);

  return NextResponse.json({
    configured: isConfigured,
    url,
  });
}
