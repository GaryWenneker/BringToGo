'use client';
import Link from 'next/link';
import { ShoppingBasket, ArrowUpRight, Heart, UserRound } from 'lucide-react';
export function Header() {
  return <header className="site-header"><Link href="/" className="brand" aria-label="BringToGo startpagina"><span className="brand-mark"><ShoppingBasket size={25}/></span>Bring<span>ToGo</span><span className="brand-dot">.</span></Link><nav aria-label="Hoofdnavigatie"><a href="/#zo-werkt-het" className="how-link">Hoe werkt het?</a><Link href="/mijn" className="my-overview-link" aria-label="Mijn bijeenkomsten"><UserRound size={16}/><span>Mijn overzicht</span></Link><Link href="/nieuw" className="button button-outline">Nieuwe bijeenkomst <ArrowUpRight size={16}/></Link></nav></header>;
}
export function Footer() { return <footer className="site-footer"><span className="footer-brand">BringToGo.</span><span>Spreek af wie wat meeneemt.</span><Heart size={16}/></footer>; }
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
