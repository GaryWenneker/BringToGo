import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireCurrentEvent } from '../src/lib/single-event';
import { defaultEvent } from '../src/lib/model';

test('the sole neighborhood gathering remains reachable under its permanent invitation ID', () => {
  assert.equal(requireCurrentEvent(defaultEvent.id), 'buurtborrel-alem-2026');
});

test('other or malformed event IDs are denied', () => {
  for (const id of ['another-event', '', '../buurtborrel-alem-2026', 'buurtborrel-alem-2025']) {
    assert.throws(() => requireCurrentEvent(id), { status: 404 });
  }
});

test('the original event date and location remain unchanged', () => {
  assert.equal(defaultEvent.location, 'Hart van Alem');
  assert.equal(defaultEvent.startsAt, '2026-12-20T15:00:00.000Z');
});
