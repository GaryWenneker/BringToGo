import { getRepository } from '@/lib/db';
import { failure,session } from '@/lib/http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET() {
  try {return Response.json({events:await getRepository().overview(await session())},{headers:{'Cache-Control':'private, no-store',Vary:'Cookie'}});}
  catch(e){return failure(e);}
}
