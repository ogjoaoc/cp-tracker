import { NextResponse } from 'next/server';
import { COOKIE_NAME, createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  const configuredUser = process.env.ADMIN_USER;
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredUser || !configuredPassword) {
    return NextResponse.json({ error: 'Login não configurado.' }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const username = String(body.username || '');
  const password = String(body.password || '');

  if (username !== configuredUser || password !== configuredPassword) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: await createSessionToken(configuredUser, configuredPassword),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
