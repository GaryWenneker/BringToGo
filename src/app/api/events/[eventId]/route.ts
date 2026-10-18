import { parseEvent } from '@/lib/model';
import { getRepository } from '@/lib/db';
import { body, failure, session } from '@/lib/http';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
type Context = { params: Promise<{eventId:string}> };
export async function GET(_request: Request, context: Context) {
  try { return Response.json(await getRepository().state((await context.params).eventId, await session()), { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } }); }
  catch (e) { return failure(e); }
}
export async function PATCH(request: Request, context: Context) {
  try {
    const data = parseEvent(await body(request));
    await getRepository().update((await context.params).eventId, await session(), data);
    return Response.json({ ok: true });
  } catch(e) { return failure(e); }
}
