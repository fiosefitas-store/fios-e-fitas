import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Diagnostic: log presence of important env vars (no secrets)
console.log('ENV CHECK:', {
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  hasSupabaseAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasSupabaseService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
});

async function findAdminInSupabase(supabaseClient: any, username: string) {
  const tableCandidates = ['Admin', 'admin', 'admins'];

  for (const table of tableCandidates) {
    try {
      // @ts-ignore
      const { data, error } = await supabaseClient.from(table).select('*').eq('username', username).maybeSingle();

      if (error) continue;

      if (data) return data;
    } catch (e) {
      continue;
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    let admin: any = null;

    // try to import prisma dynamically to avoid top-level crashes when DATABASE_URL missing
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const prismaMod = await import('@/lib/prisma');
      const prisma = prismaMod.default;

      try {
        admin = await prisma.admin.findUnique({ where: { username } });
        // console.log("ADMIN PRISMA:", admin);
      } catch (e) {
        admin = null;
      }
    } catch (e) {
      console.warn('Prisma import failed or no local admin. Will try Supabase fallback.', e);
    }

    // try supabase if still not found
    if (!admin) {
      try {
        const supabaseMod = await import('@/lib/supabase');

        let supabaseClient: any = undefined;

        if (typeof supabaseMod.createServiceSupabase === 'function') {
          try {
            supabaseClient = supabaseMod.createServiceSupabase();
          } catch (e) {
            console.warn('createServiceSupabase failed', e);
          }
        }

        if (!supabaseClient && supabaseMod.supabase) supabaseClient = supabaseMod.supabase;

        if (!supabaseClient) {
          console.warn('No Supabase client available (check env vars)');
        } else {
          admin = await findAdminInSupabase(supabaseClient, username);
        }
      } catch (e) {
        console.warn('Supabase import/lookup failed.', e);
      }
    }

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials or user not found' }, { status: 401 });
    }

    if (admin.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true, admin: { id: admin.id, username: admin.username } });
    res.cookies.set('adminAuth', 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 });

    return res;
  } catch (err: any) {
    console.error('LOGIN ERROR:', err?.message ?? err);
    return NextResponse.json({ error: `Server error: ${err?.message ?? 'unknown'}` }, { status: 500 });
  }
}