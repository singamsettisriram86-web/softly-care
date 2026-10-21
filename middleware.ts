import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — runs on every request.
 * If a visitor tries to open /dashboard or /helper without being signed in,
 * they are redirected to the /login page automatically.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes that require the user to be signed in
  // Note: /dashboard is deliberately NOT in this list — visitors can freely explore the dashboard.
  const protectedPaths = [
    '/register',
    '/helpers/browse',
    '/helpers/register',
    '/helpers/profile',
    '/helper',
  ];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for the session cookie set by auth routes
  const userCookie = request.cookies.get('softly_user')?.value;

  if (!userCookie) {
    // Not signed in — send them to /login with next target and default to signup
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('tab', 'signup');
    return NextResponse.redirect(loginUrl);
  }

  // Cookie exists — let them through
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/register/:path*',
    '/helpers/browse/:path*',
    '/helpers/register/:path*',
    '/helpers/profile/:path*',
    '/helper/:path*',
  ],
};
