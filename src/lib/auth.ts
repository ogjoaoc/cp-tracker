const COOKIE_NAME = 'cp_tracker_session';

async function signSession(username: string, password: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(`${username}:cp-tracker`));
  return Array.from(new Uint8Array(signature))
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('');
}

export async function createSessionToken(username: string, password: string) {
  return signSession(username, password);
}

export async function isValidSession(token: string | undefined, username: string, password: string) {
  if (!token || !username || !password) return false;
  const expected = await signSession(username, password);
  return token === expected;
}

export { COOKIE_NAME };
