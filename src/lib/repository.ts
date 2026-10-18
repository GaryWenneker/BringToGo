import { randomUUID } from 'node:crypto';
import { AppError, normalizeDish, type ContributionInput, type EventInput, type EventState, type Targets } from './model';
export interface Queryable { query<T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params?: unknown[]): Promise<{ rows: T[] }> }
export class Repository {
  constructor(private db: Queryable) {}
  async overview(owner: string) {
    const {rows}=await this.db.query(`SELECT e.id,e.title,e.location,e.starts_at,e.closed,e.owner_hash=$1 AS organizer
      FROM events e WHERE e.owner_hash=$1 OR EXISTS (SELECT 1 FROM parties p JOIN contributions c ON c.party_id=p.id WHERE p.event_id=e.id AND p.owner_hash=$1)
      ORDER BY e.starts_at`,[owner]);
    return rows.map(e=>({id:String(e.id),title:String(e.title),location:String(e.location),startsAt:new Date(String(e.starts_at)).toISOString(),closed:Boolean(e.closed),isOrganizer:Boolean(e.organizer)}));
  }
  async state(eventId: string, owner: string): Promise<EventState> {
    const { rows: [e] } = await this.db.query('SELECT * FROM events WHERE id=$1', [eventId]);
    if (!e) throw new AppError('Deze uitnodiging bestaat niet (meer).', 404);
    const { rows } = await this.db.query(`SELECT c.*, p.name, p.attendees, p.dietary_needs, p.owner_hash FROM contributions c JOIN parties p ON p.id=c.party_id WHERE c.event_id=$1 ORDER BY c.created_at`, [eventId]);
    const { rows: parties } = await this.db.query('SELECT id, attendees FROM parties WHERE event_id=$1 AND EXISTS (SELECT 1 FROM contributions c WHERE c.party_id=parties.id)', [eventId]);
    return { event: { id: String(e.id), title: String(e.title), location: String(e.location), startsAt: new Date(String(e.starts_at)).toISOString(), description: String(e.description), drinksNote: String(e.drinks_note), targets: e.targets as Targets, closed: Boolean(e.closed), isOrganizer: e.owner_hash === owner },
      contributions: rows.map(c => ({ id: String(c.id), partyId: String(c.party_id), name: String(c.name), dish: String(c.dish), category: c.category as ContributionInput['category'], portions: Number(c.portions), attendees: Number(c.attendees), diets: c.diets as ContributionInput['diets'], notes: String(c.notes), dietaryNeeds: String(c.dietary_needs), mine: c.owner_hash === owner })),
      households: parties.length, guests: parties.reduce((sum, p) => sum + Number(p.attendees), 0) };
  }
  async save(eventId: string, owner: string, data: ContributionInput, id?: string) {
    const values = [owner, eventId, data.name, data.attendees, data.dietaryNeeds, data.dish, normalizeDish(data.dish), data.category, data.portions, JSON.stringify(data.diets), data.notes];
    try {
      // Lock the event for this statement so closing it and signing up serialize.
      const { rows } = id ? await this.db.query(`WITH open_event AS (SELECT id FROM events WHERE id=$2 AND NOT closed FOR SHARE), participant AS (
        UPDATE parties SET name=$3, attendees=$4, dietary_needs=$5 WHERE owner_hash=$1 AND event_id=(SELECT id FROM open_event)
        AND EXISTS (SELECT 1 FROM contributions WHERE id=$12 AND party_id=parties.id) RETURNING id)
        UPDATE contributions SET dish=$6, dish_key=$7, category=$8, portions=$9, diets=$10::jsonb, notes=$11
        WHERE id=$12 AND party_id=(SELECT id FROM participant) RETURNING id`, [...values, id]) :
        await this.db.query(`WITH open_event AS (SELECT id FROM events WHERE id=$2 AND NOT closed FOR SHARE), participant AS (
        INSERT INTO parties(id, event_id, owner_hash, name, attendees, dietary_needs)
        SELECT $12, id, $1, $3, $4, $5 FROM open_event
        ON CONFLICT(event_id, owner_hash) DO UPDATE SET name=EXCLUDED.name, attendees=EXCLUDED.attendees, dietary_needs=EXCLUDED.dietary_needs RETURNING id)
        INSERT INTO contributions(id,event_id,party_id,dish,dish_key,category,portions,diets,notes)
        SELECT $13, $2, id, $6, $7, $8, $9, $10::jsonb, $11 FROM participant RETURNING id`, [...values, randomUUID(), randomUUID()]);
      if (!rows.length) throw new AppError('Aanmelden is gesloten, of deze bijdrage kan niet door jou worden gewijzigd.', 403);
      return String(rows[0].id);
    } catch (e) {
      if ((e as {code?:string}).code === '23505') throw new AppError('Dit gerecht staat al op de lijst. Kies iets anders voor een gevarieerd buffet.', 409);
      throw e;
    }
  }
  async remove(eventId: string, owner: string, id: string) {
    const { rows } = await this.db.query(`DELETE FROM contributions c USING parties p WHERE c.id=$1 AND c.event_id=$2 AND c.party_id=p.id AND p.owner_hash=$3 RETURNING c.id`, [id, eventId, owner]);
    if (!rows.length) throw new AppError('Je kunt alleen je eigen bijdrage verwijderen.', 403);
  }
  async create(owner: string, data: EventInput) {
    const id = randomUUID();
    await this.db.query(`INSERT INTO events(id,owner_hash,title,location,starts_at,description,drinks_note,targets,closed) VALUES($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9)`, [id, owner, data.title, data.location, data.startsAt, data.description, data.drinksNote, JSON.stringify(data.targets), data.closed]);
    return id;
  }
  async update(eventId: string, owner: string, data: EventInput) {
    const { rows } = await this.db.query(`UPDATE events SET title=$3, location=$4, starts_at=$5, description=$6, drinks_note=$7, targets=$8::jsonb, closed=$9 WHERE id=$1 AND owner_hash=$2 RETURNING id`, [eventId, owner, data.title, data.location, data.startsAt, data.description, data.drinksNote, JSON.stringify(data.targets), data.closed]);
    if (!rows.length) throw new AppError('Alleen de organisator kan de bijeenkomst wijzigen.', 403);
  }
}
