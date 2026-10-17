import { NextRequest, NextResponse } from 'next/server';
import { memoryDataRepository } from '@/lib/data-repository';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier?.trim() || !password) {
      return NextResponse.json({ success: false, error: 'Email/phone and password are required.' }, { status: 400 });
    }

    const user = await memoryDataRepository.findUserByIdentifier(identifier.trim());
    if (!user) {
      return NextResponse.json({ success: false, error: 'No account found with this email or phone. Please create an account first.' }, { status: 404 });
    }

    // Verify password (base64 comparison — demo only; use bcrypt in production)
    const expectedHash = Buffer.from(password).toString('base64');
    if (user.passwordHash !== expectedHash) {
      return NextResponse.json({ success: false, error: 'Incorrect password. Please try again.' }, { status: 401 });
    }

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
    console.error('[/api/auth/login]', err);
    return NextResponse.json({ success: false, error: 'Server error. Please try again.' }, { status: 500 });
  }
}
