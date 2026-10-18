import { parseContribution } from '@/lib/model';
import { getRepository } from '@/lib/db';
import { requireCurrentEvent } from '@/lib/single-event';
import { body, failure, session } from '@/lib/http';
export const runtime = 'nodejs';
type Context = { params: Promise<{eventId:string;id:string}> };
export async function PATCH(request: Request, context: Context) {
  try {
    const { eventId, id } = await context.params;
    requireCurrentEvent(eventId);
    const data = parseContribution(await body(request));
    await getRepository().save(eventId, await session(), data, id);
    return Response.json({ ok: true });
  } catch(e) { return failure(e); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    const {eventId,id} = await context.params;
    requireCurrentEvent(eventId);
    await body(request);
    await getRepository().remove(eventId, await session(), id);
    return Response.json({ ok:true });
  } catch(e) { return failure(e); }
}
