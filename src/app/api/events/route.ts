import { parseEvent } from '@/lib/model';
import { getRepository } from '@/lib/db';
import { body, failure, session } from '@/lib/http';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    const data = parseEvent(await body(request));
    const id = await getRepository().create(await session(), data);
    return Response.json({ id }, { status: 201 });
  } catch (e) { return failure(e); }
}
