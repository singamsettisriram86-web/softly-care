import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const { name, identifier, password } = await req.json();

    if (!name?.trim() || !identifier?.trim() || !password) {
      return NextResponse.json({ success: false, error: 'Name, email/phone, and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await memoryDataRepository.findUserByIdentifier(identifier.trim());
    if (existing) {
      return NextResponse.json({ success: false, error: 'An account with this email or phone already exists. Please sign in instead.' }, { status: 409 });
    }

    // Create user (password stored as base64 — demo only; use bcrypt in production)
    const user = await memoryDataRepository.createUser({
      name: name.trim(),
      identifier: identifier.trim(),
      passwordHash: Buffer.from(password).toString('base64'),
    });

    // Set session cookie
    const cookieUser = JSON.stringify({ id: user.id, email: user.identifier, name: user.name, picture: null });
    const res = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.identifier } });
    res.cookies.set('softly_user', cookieUser, {
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      sameSite: 'lax',
    });
    return res;
  } catch (err) {
    console.error('[/api/auth/signup]', err);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
