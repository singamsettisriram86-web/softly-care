import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware — runs on every request.
 * If a visitor tries to open /dashboard or /helper without being signed in,
 * they are redirected to the /login page automatically.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes that require the user to be signed in
  const protectedPaths = ['/helper', '/register'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for the session cookie set by auth routes
  const userCookie = request.cookies.get('softly_user')?.value;

  if (!userCookie) {
    // Not signed in — send them to /login with next target
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie exists — let them through
  return NextResponse.next();
}

export const config = {
  matcher: ['/helper/:path*', '/register/:path*'],
};
