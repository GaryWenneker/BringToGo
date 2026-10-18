'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';
import { Header, Footer } from '@/components/shared';

export default function MyDishes() {
  const [personalLink, setPersonalLink] = useState('');
  const [error, setError] = useState('');

  function restoreAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const url = new URL(personalLink.trim());
      if (url.origin !== window.location.origin || url.pathname !== '/toegang') {
        throw new Error('Gebruik je persoonlijke link van deze buurtborrel.');
      }
      const params = new URLSearchParams(url.hash.slice(1));
      if (!/^[a-f0-9]{64}$/.test(params.get('token') || '') || params.get('event') !== 'buurtborrel-alem-2026') {
        throw new Error('Deze persoonlijke link is niet geldig voor de buurtborrel.');
      }
      window.location.assign(url.href);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return <>
    <Header />
    <main className="my-events-shell">
      <div className="eyebrow">BUURTBORREL IN ALEM</div>
      <h1>Mijn hapjes.</h1>
      <p className="my-intro">Bekijk de hapjes die je meeneemt op de gezamenlijke lijst. Kies daar <strong>Mijn hapjes</strong> om alleen jouw bijdragen te zien, aan te passen of te verwijderen.</p>
      <Link href="/#mijn-hapjes" className="button button-primary">
        Naar mijn hapjes <ArrowRight size={17}/>
      </Link>
      <section className="restore-card">
        <Link2 size={21}/>
        <div>
          <h2>Gebruik je een ander apparaat?</h2>
          <p>Plak je persoonlijke toegangskoppeling hieronder. Zo kun je je eigen hapjes ook op dit apparaat terugvinden.</p>
          <form onSubmit={restoreAccess}>
            <label className="sr-only" htmlFor="personal-link">Persoonlijke toegangskoppeling</label>
            <input id="personal-link" required type="url" autoComplete="off" placeholder="Plak je persoonlijke link" value={personalLink} onChange={e=>setPersonalLink(e.target.value)}/>
            <button className="button button-primary" type="submit">Herstel mijn toegang</button>
          </form>
          {error && <p role="alert" className="form-error">{error}</p>}
        </div>
      </section>
    </main>
    <Footer/>
  </>;
}
