export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export class AuthService {
  private clientId: string;
  private clientSecret: string;
  private appUrl: string;

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    this.appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  }

  isConfigured(): boolean {
    return Boolean(this.clientId && this.clientSecret);
  }

  getGoogleAuthUrl(state?: string): string {
    if (!this.isConfigured()) {
      return `/api/auth/google/mock`;
    }

    const redirectUri = `${this.appUrl}/api/auth/callback/google`;
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });

    if (state) {
      params.set('state', state);
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  async exchangeCodeForUser(code: string): Promise<GoogleUser | null> {
    const redirectUri = `${this.appUrl}/api/auth/callback/google`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      throw new Error(`Google token exchange failed: ${err}`);
    }

    const tokenData = await tokenRes.json();
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      throw new Error('Failed to fetch Google user profile');
    }

    const userData = await userRes.json();
    return {
      id: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    };
  }
}

export const authService = new AuthService();
