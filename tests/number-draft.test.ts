import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveNumberDraft } from '../src/lib/number-draft';

test('empty numeric edit stays empty until the user types a replacement', () => {
  assert.throws(() => resolveNumberDraft('', 0, 100, 'Richtaantal'), {status: 400});
  assert.equal(resolveNumberDraft('7', 0, 100, 'Richtaantal'), 7);
  assert.equal(resolveNumberDraft('0', 0, 100, 'Richtaantal'), 0);
  assert.equal(resolveNumberDraft('24', 1, 500, 'Hapjes'), 24);
});

test('numeric input only accepts valid whole numbers at submission', () => {
  for (const raw of ['  ', '-', '3.5', '-3', 'Infinity', 'NaN']) {
    assert.throws(() => resolveNumberDraft(raw, 0, 100, 'Richtaantal'));
  }
  assert.throws(() => resolveNumberDraft('101', 0, 100, 'Richtaantal'));
  assert.throws(() => resolveNumberDraft('0', 1, 30, 'Personen'));
  assert.equal(resolveNumberDraft('12', 1, 30, 'Personen'), 12);
});
