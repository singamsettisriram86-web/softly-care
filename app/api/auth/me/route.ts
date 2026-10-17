import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const userCookie = req.cookies.get('softly_user')?.value;

  if (!userCookie) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  try {
    const user = JSON.parse(userCookie);
    return NextResponse.json({ authenticated: true, user });
  } catch {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
