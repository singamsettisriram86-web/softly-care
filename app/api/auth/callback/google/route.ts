import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth-service';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const state = searchParams.get('state');

  if (error || !code) {
    return NextResponse.redirect(new URL('/?auth_error=cancelled', req.url));
  }

  try {
    const user = await authService.exchangeCodeForUser(code);

    // Target path: honor state if it's a relative path (e.g., /register)
    let target = '/dashboard';
    if (state && state.startsWith('/') && !state.startsWith('//')) {
      target = state;
    }

    const redirectUrl = new URL(target, req.url);
    redirectUrl.searchParams.set('auth', 'success');

    const response = NextResponse.redirect(redirectUrl);

    if (user) {
      // Store user profile in a secure cookie
      response.cookies.set('softly_user', JSON.stringify(user), {
        path: '/',
        httpOnly: false, // Accessible to client so UI can show user name & avatar
        maxAge: 30 * 24 * 60 * 60, // 30 days
        sameSite: 'lax',
      });
    }

    return response;
  } catch (err: any) {
    console.error('Google callback error:', err.message);
    return NextResponse.redirect(new URL('/?auth_error=failed', req.url));
  }
}
