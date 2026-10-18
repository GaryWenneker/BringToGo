import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readRememberedDetails, writeRememberedDetails } from '../src/lib/participant-details';
import type { ContributionInput } from '../src/lib/model';

const input = (overrides: Partial<ContributionInput> = {}): ContributionInput => ({
  name: 'Buurtbewoner', dish: 'Gevulde eitjes', category: 'hartig',
  portions: 24, attendees: 3, dietaryNeeds: 'Zonder pinda’s',
  diets: ['Vegetarisch'], notes: 'Met bieslook', ...overrides,
});

function fakeStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem(key: string) { return data.get(key) ?? null; },
    setItem(key: string, value: string) { data.set(key, value); },
  };
}

test('remembers name, household size, dietary needs and usual portions between visits', () => {
  const storage = fakeStorage();
  writeRememberedDetails(storage, input());
  assert.deepEqual(readRememberedDetails(storage), {
    name: 'Buurtbewoner', attendees: 3, dietaryNeeds: 'Zonder pinda’s', portions: 24,
  });
});

test('does not carry over dish-specific allergens, labels, dish names or notes', () => {
  const storage = fakeStorage();
  writeRememberedDetails(storage, input());
  const raw = JSON.stringify([...storage.data.values()]);
  assert.equal(raw.includes('Gevulde eitjes'), false);
  assert.equal(raw.includes('Vegetarisch'), false);
  assert.equal(raw.includes('Met bieslook'), false);
});

test('loads older data defensively and ignores corrupt or oversized values', () => {
  const storage = fakeStorage();
  storage.setItem('bringtogo:participant:v1', '{broken');
  assert.equal(readRememberedDetails(storage), null);
  storage.setItem('bringtogo:participant:v1', JSON.stringify({name: 'a'.repeat(61), attendees: 3, dietaryNeeds: '', portions: 12}));
  assert.equal(readRememberedDetails(storage), null);
  writeRememberedDetails(storage, input({attendees: 999}));
  assert.equal(readRememberedDetails(storage), null);
});

test('disabled browser storage does not break the signup flow', () => {
  const unavailable = {
    getItem(): string | null { throw new Error('Private browsing blocked'); },
    setItem(): void { throw new Error('Storage full'); },
  };
  assert.equal(readRememberedDetails(unavailable), null);
  assert.doesNotThrow(() => writeRememberedDetails(unavailable, input()));
});
