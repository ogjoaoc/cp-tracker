import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, isValidSession } from '@/lib/auth';

export default async function middleware(request: NextRequest) {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  const pathname = request.nextUrl.pathname;

  if (pathname === '/login' || pathname === '/api/auth/login' || pathname === '/api/auth/logout') {
    return NextResponse.next();
  }

  if (!username || !password) {
    return new NextResponse('Autenticação não configurada.', { status: 503 });
  }

  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;
  const authenticated = await isValidSession(sessionToken, username, password);

  if (!authenticated) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
};