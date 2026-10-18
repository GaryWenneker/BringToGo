'use client';
import Link from 'next/link';
import { ShoppingBasket, Heart, UserRound } from 'lucide-react';
export function Header() {
  return <header className="site-header"><Link href="/" className="brand" aria-label="Buurtjes tussen de Kerken, 20 december, startpagina"><span className="brand-mark"><ShoppingBasket size={25}/></span><span className="brand-label"><strong className="brand-main">Buurtjes tussen de Kerken</strong><span className="brand-sub">20 december · Alem</span></span></Link><nav aria-label="Hoofdnavigatie"><a href="/#zo-werkt-het" className="how-link">Hoe werkt het?</a><Link href="/mijn" className="my-overview-link" aria-label="Mijn hapjes en persoonlijke toegang"><UserRound size={16}/><span>Mijn hapjes</span></Link></nav></header>;
}
export function Footer() { return <footer className="site-footer"><span className="footer-brand">Buurtjes tussen de Kerken</span><span>20 december · Hart van Alem · Vanaf 16.00 uur</span><Heart size={16}/></footer>; }
export async function api(url:string, method='GET', data?:unknown) {
  const result = await fetch(url, { method, cache:'no-store', credentials:'same-origin', headers: data === undefined ? {} : {'Content-Type':'application/json'}, body: data === undefined ? undefined : JSON.stringify(data) });
  const json = await result.json();
  if (!result.ok) throw new Error(json.error || 'Dat lukte niet. Probeer het opnieuw.');
  return json;
}
export function download(name:string, text:string, type:string) {
  const url = URL.createObjectURL(new Blob([text], {type}));
  const link = document.createElement('a'); link.href=url; link.download=name; link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
