import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';
import { AppError } from './model';
export async function session() {
  const jar = await cookies();
  let token = jar.get('btg_session')?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    token = randomBytes(32).toString('hex');
    jar.set('btg_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60 * 60 * 24 * 180 });
  }
  return createHash('sha256').update(token).digest('hex');
}
export async function body(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || new URL(origin).host !== new URL(process.env.URL || request.url).host) throw new AppError('Open het formulier opnieuw via de uitnodigingslink.', 403);
  if (!request.headers.get('content-type')?.includes('application/json')) throw new AppError('Ongeldig formulier.');
  const raw = await request.text();
  if (raw.length > 12000) throw new AppError('Het formulier is te groot.', 413);
  try { return JSON.parse(raw) as unknown; } catch { throw new AppError('Het formulier kon niet worden gelezen.'); }
}
export function failure(error: unknown) {
  if (error instanceof AppError) return Response.json({ error: error.message }, { status: error.status, headers: { 'Cache-Control': 'no-store' } });
  // Never expose database credentials or query parameters to clients/logs.
  console.error('BringToGo storage error', error instanceof Error ? error.name : 'UnknownError');
  return Response.json({ error: 'De gedeelde lijst is tijdelijk niet bereikbaar. Probeer het zo opnieuw.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
}
