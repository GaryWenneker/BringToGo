'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';
import { Header,Footer,api } from '@/components/shared';
import { defaultEvent } from '@/lib/model';
export default function Access() {
  const [error,setError]=useState('');
  useEffect(()=>{ const params=new URLSearchParams(window.location.hash.slice(1)),token=params.get('token'),event=params.get('event');
    // The bearer token lives in the fragment, never in a server log or referrer.
    history.replaceState(null,'',window.location.pathname);
    if(!token||!event||!/^[a-zA-Z0-9-]{1,80}$/.test(event)){setError('Open de persoonlijke link die je eerder hebt bewaard. Voor een nieuwe bijdrage heb je alleen de gewone uitnodigingslink nodig.');return;}
    if(event !== defaultEvent.id){setError('Deze persoonlijke link hoort niet bij deze buurtborrel.');return;}
    void api('/api/access','POST',{action:'restore',token}).then(()=>window.location.replace('/')).catch(e=>setError((e as Error).message));
  },[]);
  return <><Header/><main className="access-page"><div className="eyebrow">WELKOM TERUG</div><h1>We zetten je stoel klaar.</h1><p role={error?'alert':'status'}>{error||'Je persoonlijke link wordt geopend…'}</p>{error&&<Link href="/" className="button button-primary">Naar de buurtborrel</Link>}</main><Footer/></>;
}
