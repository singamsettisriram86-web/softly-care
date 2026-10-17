import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, picture } = body;

    const user = {
      id: `google_${Date.now()}`,
      name: name || 'Google User',
      email: email || 'user@gmail.com',
      picture: picture || 'https://lh3.googleusercontent.com/a/default-user',
    };

    const response = NextResponse.json({ success: true, user });
    response.cookies.set('softly_user', JSON.stringify(user), {
      path: '/',
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
