import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return new NextResponse('Proteção não configurada.', { status: 503 });
  }

  const authorization = request.headers.get('authorization');
  const expected = `Basic ${btoa(`${username}:${password}`)}`;

  if (authorization !== expected) {
    return new NextResponse('Autenticação necessária.', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="CP Tracker", charset="UTF-8"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
