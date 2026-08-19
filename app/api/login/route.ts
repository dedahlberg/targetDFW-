import { NextResponse } from 'next/server';

async function digest(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: Request) {
  const sitePassword = process.env.SITE_PASSWORD;
  const authSecret = process.env.AUTH_SECRET;

  if (!sitePassword || !authSecret) {
    return NextResponse.json({ error: 'Site access is not configured yet.' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === 'string' ? body.password : '';

  if (password !== sitePassword) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await digest(`${sitePassword}:${authSecret}`);
  const response = NextResponse.json({ ok: true });
  response.cookies.set('targetdfw_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 14,
    path: '/',
  });
  return response;
}
