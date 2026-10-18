import { parseContribution } from '@/lib/model';
import { getRepository } from '@/lib/db';
import { body, failure, session } from '@/lib/http';
export const runtime = 'nodejs';
export async function POST(request: Request, context: { params: Promise<{eventId:string}> }) {
  try {
    const data = parseContribution(await body(request));
    const id = await getRepository().save((await context.params).eventId, await session(), data);
    return Response.json({ id }, { status: 201 });
  } catch(e) { return failure(e); }
}
