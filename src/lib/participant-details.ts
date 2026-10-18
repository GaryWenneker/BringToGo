import type { ContributionInput } from './model';

const STORAGE_KEY = 'bringtogo:participant:v1';
export type RememberedDetails = Pick<ContributionInput, 'name' | 'attendees' | 'dietaryNeeds' | 'portions'>;
type StorageAccess = Pick<Storage, 'getItem' | 'setItem'>;

function valid(value: unknown): value is RememberedDetails {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.name === 'string' && item.name.length <= 60 &&
    typeof item.dietaryNeeds === 'string' && item.dietaryNeeds.length <= 300 &&
    Number.isInteger(item.attendees) && Number(item.attendees) >= 1 && Number(item.attendees) <= 30 &&
    Number.isInteger(item.portions) && Number(item.portions) >= 1 && Number(item.portions) <= 500;
}

/** Remember only household-level details. Dish and allergens belong to each individual dish. */
export function readRememberedDetails(storage?: StorageAccess): RememberedDetails | null {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!valid(parsed)) return null;
    return {
      name: parsed.name,
      attendees: parsed.attendees,
      dietaryNeeds: parsed.dietaryNeeds,
      portions: parsed.portions,
    };
  } catch {
    // Private browsing or storage permission changes should not prevent signup.
    return null;
  }
}

export function writeRememberedDetails(storage: StorageAccess | undefined, input: ContributionInput): void {
  if (!storage) return;
  const details: RememberedDetails = {
    name: input.name.trim(),
    attendees: input.attendees,
    dietaryNeeds: input.dietaryNeeds.trim(),
    portions: input.portions,
  };
  if (!valid(details)) return;
  try { storage.setItem(STORAGE_KEY, JSON.stringify(details)); }
  catch { /* Storage disabled or full: contribution submission must still work. */ }
}
