import { cookies } from 'next/headers';
import { AppError } from '@/lib/model';
import { body, failure, session } from '@/lib/http';
export const runtime='nodejs';
export async function POST(request:Request) {
  try {
    const data=await body(request) as {action?:string;token?:string};
    if(data.action==='restore') {
      if(typeof data.token!=='string'||!/^[a-f0-9]{64}$/.test(data.token))throw new AppError('Deze persoonlijke link is ongeldig.');
      const jar=await cookies();
      jar.set('btg_session',data.token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*180});
      return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
    }
    if(data.action!=='export')throw new AppError('Ongeldige aanvraag.');
    await session();
    return Response.json({token:(await cookies()).get('btg_session')!.value},{headers:{'Cache-Control':'no-store'}});
  }catch(e){return failure(e);}
}
