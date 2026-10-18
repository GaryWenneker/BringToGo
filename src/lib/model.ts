export const categories = [
  { id: 'hartig', label: 'Hartige hapjes', emoji: '🥐', hint: 'Bladerdeeghapjes, wraps, mini-quiches' },
  { id: 'groente', label: 'Groente & dips', emoji: '🥕', hint: 'Groentespiesjes, hummus, gevulde paprika' },
  { id: 'kaas', label: 'Kaas & borrel', emoji: '🧀', hint: 'Een kaasplankje, olijven of nootjes' },
  { id: 'zoet', label: 'Iets zoets', emoji: '🍪', hint: 'Brownies, koekjes of fruitspiesjes' },
  { id: 'overig', label: 'Overig', emoji: '🧺', hint: 'Brood, servetten of iets verrassends' },
] as const;
export type Category = typeof categories[number]['id'];
export const dietLabels = ['Vegetarisch', 'Vegan', 'Glutenvrij', 'Lactosevrij'] as const;
export type Diet = typeof dietLabels[number];
export type Targets = Record<Category, number>;
export const defaultTargets: Targets = { hartig: 6, groente: 4, kaas: 3, zoet: 3, overig: 2 };
export const defaultEvent = {
  id: 'buurtborrel-alem-2026', title: 'Pré-kerst buurtborrel',
  location: 'Hart van Alem', startsAt: '2026-12-20T15:00:00.000Z',
  description: 'Beste buurtjes, gezellig dat jullie erbij zijn! Neem een schaaltje kleine hapjes mee, dan maken we samen een heerlijk tapasbuffet. Bekijk even wat er al op tafel komt en kies iets dat er mooi bij past.',
  drinksNote: 'Drankjes worden ter plekke genoteerd en afgerekend tegen inkoopprijs.',
  targets: defaultTargets, closed: false,
};
export interface EventData { id: string; title: string; location: string; startsAt: string; description: string; drinksNote: string; targets: Targets; closed: boolean; isOrganizer: boolean }
export interface Contribution { id: string; name: string; dish: string; category: Category; portions: number; attendees: number; diets: Diet[]; notes: string; dietaryNeeds: string; mine: boolean; partyId: string }
export interface EventState { event: EventData; contributions: Contribution[]; guests: number; households: number }
export interface ContributionInput { name: string; dish: string; category: Category; portions: number; attendees: number; diets: Diet[]; notes: string; dietaryNeeds: string }
export interface EventInput { title: string; location: string; startsAt: string; description: string; drinksNote: string; targets: Targets; closed: boolean }
export class AppError extends Error { constructor(message: string, public status = 400) { super(message); } }
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new AppError('Controleer de ingevulde gegevens.');
  return value as Record<string, unknown>;
}
function string(value: unknown, label: string, max: number, required = true) {
  if (typeof value !== 'string') throw new AppError(`Vul ${label} in.`);
  const result = value.trim().replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  if ((required && !result) || result.length > max) throw new AppError(`Vul ${label} in (maximaal ${max} tekens).`);
  return result;
}
function integer(value: unknown, label: string, min: number, max: number) {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) throw new AppError(`${label} moet tussen ${min} en ${max} liggen.`);
  return value;
}
export function normalizeDish(dish: string): string {
  return dish.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
export function similarDishes(dish: string, contributions: Contribution[], exclude?: string) {
  const name = normalizeDish(dish);
  if (name.length < 3) return [];
  const words = new Set(name.split(' ').filter(w => w.length > 3));
  return contributions.filter(c => {
    if (c.id === exclude) return false;
    const other = normalizeDish(c.dish);
    return name === other || name.includes(other) || other.includes(name) || other.split(' ').some(w => words.has(w));
  });
}
export function parseContribution(value: unknown): ContributionInput {
  const v = record(value);
  const dish = string(v.dish, 'een gerecht', 100);
  if (normalizeDish(dish).length < 2) throw new AppError('Geef je gerecht een herkenbare naam.');
  if (!categories.some(c => c.id === v.category)) throw new AppError('Kies een categorie.');
  if (!Array.isArray(v.diets) || v.diets.some(d => !dietLabels.includes(d as Diet))) throw new AppError('Controleer de dieetlabels.');
  return { name: string(v.name, 'je naam of huishouden', 60), dish, category: v.category as Category,
    portions: integer(v.portions, 'Het aantal hapjes', 1, 500), attendees: integer(v.attendees, 'Het aantal personen', 1, 30),
    diets: [...new Set(v.diets)] as Diet[], notes: string(v.notes, 'een toelichting', 500, false), dietaryNeeds: string(v.dietaryNeeds, 'dieetwensen', 300, false) };
}
export function parseEvent(value: unknown): EventInput {
  const v = record(value), target = record(v.targets);
  const startsAt = string(v.startsAt, 'een datum en tijd', 40);
  if (!/T.*(?:Z|[+-]\d{2}:\d{2})$/.test(startsAt) || !Number.isFinite(Date.parse(startsAt))) throw new AppError('Kies een geldige datum en tijd.');
  const targets = Object.fromEntries(categories.map(c => [c.id, integer(target[c.id], 'Het gewenste aantal schaaltjes', 0, 100)])) as Targets;
  return { title: string(v.title, 'een titel', 100), location: string(v.location, 'een locatie', 150), startsAt: new Date(startsAt).toISOString(),
    description: string(v.description, 'een uitnodiging', 2000), drinksNote: string(v.drinksNote, 'drankinformatie', 500, false), targets, closed: v.closed === true };
}
export function csvCell(value: unknown) { return '"' + String(value ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""') + '"'; }
export function calendar(event: EventData) {
  const escape = (s: string) => s.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
  const stamp = (date: string) => new Date(date).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//BringToGo//NL','BEGIN:VEVENT',`UID:${event.id}@bringtogo`, `DTSTAMP:${stamp(new Date().toISOString())}`,`DTSTART:${stamp(event.startsAt)}`,`SUMMARY:${escape(event.title)}`,`LOCATION:${escape(event.location)}`,`DESCRIPTION:${escape(event.description + '\n' + event.drinksNote)}`,'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY','DESCRIPTION:Vergeet je hapjes niet!','END:VALARM','END:VEVENT','END:VCALENDAR'];
  // RFC 5545 lines are folded at 75 UTF-8 octets, without splitting a code point.
  return lines.map(line => { let out = '', size = 0; for (const c of line) { const n = new TextEncoder().encode(c).length; if (size + n > 75) { out += '\r\n '; size = 1; } out += c; size += n; } return out; }).join('\r\n') + '\r\n';
}
