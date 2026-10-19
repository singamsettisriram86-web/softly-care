import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';

function resolveRequestOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get('x-forwarded-host');
  const forwardedProto = req.headers.get('x-forwarded-proto') || 'https';
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  const host = req.headers.get('host');
  if (host) {
    const proto = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
    return `${proto}://${host}`;
  }

  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const next = searchParams.get('next') || searchParams.get('state') || '/dashboard';
  const origin = resolveRequestOrigin(req);
  const isConfigured = authService.isConfigured();
  const url = authService.getGoogleAuthUrl(next, origin);

  return NextResponse.json({
    configured: isConfigured,
    url,
  });
}
