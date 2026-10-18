import { parseContribution } from '@/lib/model';
import { getRepository } from '@/lib/db';
import { requireCurrentEvent } from '@/lib/single-event';
import { body, failure, session } from '@/lib/http';
export const runtime = 'nodejs';
export async function POST(request: Request, context: { params: Promise<{eventId:string}> }) {
  try {
    const eventId = requireCurrentEvent((await context.params).eventId);
    const data = parseContribution(await body(request));
    const id = await getRepository().save(eventId, await session(), data);
    return Response.json({ id }, { status: 201 });
  } catch(e) { return failure(e); }
}
