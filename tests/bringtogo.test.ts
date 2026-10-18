import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import { Repository, type Queryable } from '../src/lib/repository';
import { normalizeDish, parseContribution, parseEvent, defaultEvent, defaultTargets, csvCell, calendar, similarDishes, type ContributionInput, type Contribution } from '../src/lib/model';
let db: PGlite, repo: Repository;
const input = (overrides: Partial<ContributionInput> = {}):ContributionInput => ({name:'Gary & Nathalie',dish:'Mini-quiches',category:'hartig',portions:20,attendees:2,diets:['Vegetarisch'],notes:'Met kaas',dietaryNeeds:'',...overrides});
before(async()=>{
  db=new PGlite();
  await db.exec(await readFile(new URL('../netlify/database/migrations/20261018093000_initial.sql',import.meta.url),'utf8'));
  repo=new Repository(db as unknown as Queryable);
});
after(async()=>{await db?.close();});
test('seed invitation uses 20 December 2026, 16:00 Dutch time and starts empty',async()=>{
  const state=await repo.state(defaultEvent.id,'guest');
  assert.equal(state.event.location,'Hart van Alem');
  assert.equal(new Intl.DateTimeFormat('nl-NL',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Amsterdam'}).format(new Date(state.event.startsAt)),'16:00');
  assert.equal(state.guests,0);assert.equal(state.contributions.length,0);assert.equal(state.event.isOrganizer,false);
});
test('signup works with name and dish, saves labels and returns own edit capability',async()=>{
  const event=await repo.create('host',{...defaultEvent,startsAt:defaultEvent.startsAt});
  const id=await repo.save(event,'gary',input());
  const own=await repo.state(event,'gary'),other=await repo.state(event,'other');
  assert.equal(own.contributions[0].id,id);assert.equal(own.contributions[0].mine,true);assert.equal(other.contributions[0].mine,false);
  assert.equal(own.guests,2);assert.deepEqual(own.contributions[0].diets,['Vegetarisch']);
  assert.equal('owner_hash' in own.contributions[0],false);assert.equal('owner_hash' in own.event,false);
});
test('a household bringing two dishes is counted once; changing headcount updates both',async()=>{
  const event=await repo.create('host',{...defaultEvent});
  const first=await repo.save(event,'a',input());
  await repo.save(event,'a',input({dish:'Olijven',category:'kaas',attendees:3}));
  let state=await repo.state(event,'a');assert.equal(state.households,1);assert.equal(state.guests,3);assert.equal(state.contributions.length,2);
  await repo.save(event,'a',input({attendees:4}),first);state=await repo.state(event,'a');
  assert.equal(state.guests,4);assert.ok(state.contributions.every(c=>c.attendees===4));
});
test('database atomically rejects simultaneous duplicate dish signups',async()=>{
  const event=await repo.create('host',{...defaultEvent});
  const result=await Promise.allSettled([repo.save(event,'a',input()),repo.save(event,'b',input({dish:'  MÍNI-QUICHES!!  '}))]);
  assert.equal(result.filter(r=>r.status==='fulfilled').length,1);
  const rejected=result.find(r=>r.status==='rejected');assert.equal(rejected?.status==='rejected'&&rejected.reason.status,409);
  const state=await repo.state(event,'a');assert.equal(state.households,1);assert.equal(state.contributions.length,1);
});
test('participants cannot edit or delete each other’s contributions',async()=>{
  const event=await repo.create('host',{...defaultEvent}),id=await repo.save(event,'a',input());
  await assert.rejects(repo.save(event,'b',input({dish:'Stolen'}),id),{status:403});
  await assert.rejects(repo.remove(event,'b',id),{status:403});
  assert.equal((await repo.state(event,'a')).contributions[0].dish,'Mini-quiches');
});
test('editing to an existing dish rolls back participant changes too',async()=>{
  const event=await repo.create('host',{...defaultEvent});
  const id=await repo.save(event,'a',input());await repo.save(event,'b',input({dish:'Hummus'}));
  await assert.rejects(repo.save(event,'a',input({dish:'Hummus',attendees:12}),id),{status:409});
  const state=await repo.state(event,'a');assert.equal(state.contributions.find(c=>c.id===id)?.attendees,2);
});
test('deleting last dish removes household from counts; signup can be restored',async()=>{
  const event=await repo.create('host',{...defaultEvent}),id=await repo.save(event,'a',input());
  await repo.remove(event,'a',id);assert.equal((await repo.state(event,'a')).guests,0);
  await repo.save(event,'a',input());assert.equal((await repo.state(event,'a')).households,1);
});
test('only organizer can manage an event; closing prevents signup and editing',async()=>{
  const event=await repo.create('host',{...defaultEvent}),id=await repo.save(event,'a',input());
  await assert.rejects(repo.update(event,'stranger',{...defaultEvent,title:'Changed'}),{status:403});
  await repo.update(event,'host',{...defaultEvent,closed:true});
  assert.equal((await repo.state(event,'host')).event.isOrganizer,true);
  await assert.rejects(repo.save(event,'b',input({dish:'Hummus'})),{status:403});
  await assert.rejects(repo.save(event,'a',input({dish:'Hummus'}),id),{status:403});
  await repo.remove(event,'a',id);assert.equal((await repo.state(event,'a')).contributions.length,0);
});
test('events are isolated and unknown invitations return 404',async()=>{
  const a=await repo.create('host',{...defaultEvent}),b=await repo.create('host',{...defaultEvent});
  await repo.save(a,'a',input());await repo.save(b,'b',input());
  assert.equal((await repo.state(b,'a')).contributions[0].mine,false);
  await assert.rejects(repo.state('missing','a'),{status:404});
  await assert.rejects(repo.save(b,'a',input({dish:'Different'}),(await repo.state(a,'a')).contributions[0].id),{status:403});
});
test('personal overview contains only events owned or joined by the current session',async()=>{
  const a=await repo.create('overview-host',{...defaultEvent}),b=await repo.create('other-host',{...defaultEvent});
  await repo.save(b,'overview-host',input());
  const events=await repo.overview('overview-host');
  assert.ok(events.some(e=>e.id===a&&e.isOrganizer));assert.ok(events.some(e=>e.id===b&&!e.isOrganizer));
  assert.equal((await repo.overview('never-joined')).length,0);
});
test('organizer cannot edit or delete another participant’s dish, even though they manage the event',async()=>{
  const event=await repo.create('organizer',{...defaultEvent});
  const id=await repo.save(event,'guest',input());
  await assert.rejects(repo.save(event,'organizer',input({dish:'Wijziging door beheerder'}),id),{status:403});
  await assert.rejects(repo.remove(event,'organizer',id),{status:403});
  const state=await repo.state(event,'guest');
  assert.equal(state.contributions[0].dish,'Mini-quiches');
  assert.equal(state.contributions[0].mine,true);
  assert.equal((await repo.state(event,'organizer')).contributions[0].mine,false);
  // Editing and removing by the original contributor still work.
  await repo.save(event,'guest',input({dish:'Nieuwe mini-quiches'}),id);
  assert.equal((await repo.state(event,'guest')).contributions[0].dish,'Nieuwe mini-quiches');
  await repo.remove(event,'guest',id);
  assert.equal((await repo.state(event,'guest')).contributions.length,0);
});
test('SQL-like input is stored literally, never executed',async()=>{
  const event=await repo.create('host',{...defaultEvent});
  await repo.save(event,'a',input({name:"Robert'); DROP TABLE events;--"}));
  assert.equal((await repo.state(event,'a')).contributions[0].name,"Robert'); DROP TABLE events;--");
});
test('validation rejects invalid portions, categories, diets, dates and oversized fields',()=>{
  for(const v of [input({portions:0}),input({attendees:1.5}),input({name:' '}),input({dish:'!!!'}),{...input(),category:'bad'},{...input(),diets:['Unknown']},input({notes:'a'.repeat(501)})])assert.throws(()=>parseContribution(v));
  for(const v of [{...defaultEvent,startsAt:'nonsense'},{...defaultEvent,startsAt:'2026-12-20T16:00'},{...defaultEvent,targets:{...defaultTargets,hartig:-1}}])assert.throws(()=>parseEvent(v));
  assert.equal(parseContribution(input({name:' Gary '})).name,'Gary');
  assert.equal(parseEvent({...defaultEvent}).startsAt,defaultEvent.startsAt);
});
test('normalization catches case, accents, punctuation and whitespace; similar recipes get a warning',()=>{
  assert.equal(normalizeDish('  Crème---BRÛLÉE!! '),'creme brulee');
  const dish={id:'1',dish:'Mini-quiches met kaas'} as Contribution;
  assert.equal(similarDishes('Mini-quiches',[dish]).length,1);assert.equal(similarDishes('Mini-quiches',[dish],'1').length,0);
});
test('CSV export neutralizes formulas and preserves quotes',()=>{
  assert.equal(csvCell('=SUM(A1:A2)'), '"\'=SUM(A1:A2)"');
  assert.equal(csvCell('Een "hapje"'), '"Een ""hapje"""');
});
test('agenda contains the correct timezone-independent start and one-day reminder; long lines fold',()=>{
  const ics=calendar({...defaultEvent,isOrganizer:false,description:'Heel gezellig 🍽️ '.repeat(30)});
  assert.ok(ics.includes('DTSTART:20261220T150000Z'));assert.ok(ics.includes('TRIGGER:-P1D'));
  assert.ok(ics.includes('\r\n '));for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);
});
