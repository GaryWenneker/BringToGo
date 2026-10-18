import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { defaultEvent } from '../src/lib/model';

const file = async (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('website identifies the neighbourhood and the 20 December event', async () => {
  const [header, layout] = await Promise.all([
    file('src/components/shared.tsx'),
    file('src/app/layout.tsx'),
  ]);
  assert.match(header, /Buurtjes tussen de Kerken/);
  assert.match(header, /20 december · Alem/);
  assert.match(layout, /Buurtjes tussen de Kerken · 20 december · Alem/);
  assert.equal(defaultEvent.location, 'Hart van Alem');
  assert.equal(defaultEvent.startsAt, '2026-12-20T15:00:00.000Z');
});

test('the rebrand preserves the existing personal access and database identifiers', async () => {
  const [participant, board] = await Promise.all([
    file('src/lib/participant-details.ts'),
    file('src/components/event-board.tsx'),
  ]);
  assert.match(participant, /bringtogo:participant:v1/);
  assert.match(board, /\/toegang#token=/);
  assert.match(board, /Buurtjes tussen de Kerken/);
  assert.equal(defaultEvent.id, 'buurtborrel-alem-2026');
});
