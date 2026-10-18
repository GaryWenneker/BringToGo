'use client';
import { useEffect,useState,type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight,CalendarDays,Link2,MapPin,Plus,Users } from 'lucide-react';
import { Header,Footer,api } from '@/components/shared';
type EventSummary={id:string;title:string;location:string;startsAt:string;closed:boolean;isOrganizer:boolean};
export default function MyEvents() {
  const [events,setEvents]=useState<EventSummary[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[link,setLink]=useState('');
  useEffect(()=>{void api('/api/me').then(data=>setEvents(data.events)).catch(e=>setError((e as Error).message)).finally(()=>setLoading(false));},[]);
  function restore(e:FormEvent) {
    e.preventDefault();
    try {
      const url=new URL(link);
      if(url.origin!==window.location.origin||url.pathname!=='/toegang'||!new URLSearchParams(url.hash.slice(1)).get('token'))throw new Error('Plak je volledige persoonlijke BringToGo-link.');
      window.location.assign(url.href);
    }catch(e){setError((e as Error).message);}
  }
  return <><Header/><main className="my-events-shell"><div className="eyebrow">JOUW PLEK AAN TAFEL</div><h1>Welkom terug.</h1><p className="my-intro">Je bijeenkomsten en hapjes, op één plek. Dit apparaat herkent je vanzelf.</p>{error&&<p role="alert" className="form-error">{error}</p>}{loading?<p role="status">Je bijeenkomsten ophalen…</p>:events.length?<div className="my-events-list">{events.map(e=><Link className="my-event-card" key={e.id} href={`/e/${e.id}`}><div><span className="my-event-label">{e.isOrganizer?'Jij organiseert':'Jij schuift aan'}{e.closed?' · Aanmelden gesloten':''}</span><h2>{e.title}</h2><p><CalendarDays size={14}/>{new Intl.DateTimeFormat('nl-NL',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'}).format(new Date(e.startsAt))}<MapPin size={14}/>{e.location}</p></div><ArrowRight size={21}/></Link>)}</div>:<div className="empty-state"><Users size={33}/><h3>Jouw tafel wacht nog.</h3><p>Open een uitnodiging en voeg je hapje toe. Of organiseer zelf iets gezelligs.</p><Link href="/nieuw" className="button button-primary"><Plus size={16}/> Nieuwe bijeenkomst</Link></div>}<section className="restore-card"><Link2 size={21}/><div><h2>Op een ander apparaat aangemeld?</h2><p>Open je bewaarde persoonlijke link, of plak hem hieronder. Daarmee kom je direct terug bij je eigen bijdragen.</p><form onSubmit={restore}><label className="sr-only" htmlFor="personal-link">Je persoonlijke toegangskoppeling</label><input id="personal-link" required type="url" placeholder="Plak je persoonlijke BringToGo-link" autoComplete="off" value={link} onChange={e=>setLink(e.target.value)}/><button className="button button-primary" type="submit">Open mijn overzicht <ArrowRight size={16}/></button></form></div></section></main><Footer/></>;
}
