import { NextRequest, NextResponse } from 'next/server';

const PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'tvhfborktuqtavuxaied';
const PAT = process.env.SUPABASE_PAT;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${PROJECT_REF}.supabase.co`;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Optional: protect with a secret so random people can't spam this route
const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: NextRequest) {
  // If CRON_SECRET is set, require it in the Authorization header
  if (CRON_SECRET) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    project: PROJECT_REF,
  };

  // ── Step 1: Check project status via Management API ──────────────────────
  let projectStatus = 'UNKNOWN';
  if (PAT) {
    try {
      const statusRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}`, {
        headers: { Authorization: `Bearer ${PAT}` },
      });
      if (statusRes.ok) {
        const data = await statusRes.json();
        projectStatus = data.status || 'UNKNOWN';
        results.status = projectStatus;
      }
    } catch (e: any) {
      results.statusError = e.message;
    }
  }

  // ── Step 2: Auto-restore if paused ───────────────────────────────────────
  if (PAT && (projectStatus === 'INACTIVE' || projectStatus === 'PAUSED')) {
    try {
      const restoreRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/restore`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${PAT}`,
          'Content-Type': 'application/json',
        },
      });
      results.restored = restoreRes.ok;
      results.restoreStatus = restoreRes.status;
    } catch (e: any) {
      results.restoreError = e.message;
    }
    // Return early — DB is waking up, skip the ping
    return NextResponse.json({ success: true, action: 'restore_triggered', ...results });
  }

  // ── Step 3: Lightweight DB ping to register "activity" with Supabase ─────
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const pingRes = await fetch(`${SUPABASE_URL}/rest/v1/families?select=id&limit=1`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      results.dbPing = pingRes.ok ? 'ok' : `error_${pingRes.status}`;
      results.dbStatus = pingRes.status;
    } catch (e: any) {
      results.dbPingError = e.message;
    }
  }

  return NextResponse.json({ success: true, action: 'ping_sent', ...results });
}
