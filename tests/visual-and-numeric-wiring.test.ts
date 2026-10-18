import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { defaultEvent } from '../src/lib/model';

async function source(path: string) {
  return readFile(new URL(`../${path}`, import.meta.url),'utf8');
}

test('the actual page imports the Christmas mockup stylesheet with visible falling snow', async () => {
  const [layout, css, atmosphere] = await Promise.all([
    source('src/app/layout.tsx'), source('src/app/mockup-christmas.css'),
    source('src/components/christmas-atmosphere.tsx'),
  ]);
  assert.match(layout, /import '\.\/mockup-christmas\.css';/);
  assert.match(css, /winter-snow-fall/);
  assert.match(css, /snow-crystal/);
  assert.match(css, /alem-kerk-sneeuw\.webp/);
  assert.match(atmosphere, /length: 112/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.equal(defaultEvent.startsAt,'2026-12-20T15:00:00.000Z');
});

test('all controlled number inputs preserve their raw text so a zero can be deleted', async () => {
  const [eventBoard,editor] = await Promise.all([
    source('src/components/event-board.tsx'),source('src/components/event-editor.tsx'),
  ]);
  assert.match(eventBoard, /patch\('portions',e\.target\.value\)/);
  assert.match(eventBoard, /patch\('attendees',e\.target\.value\)/);
  assert.match(editor, /\[c\.id\]:e\.target\.value/);
  assert.doesNotMatch(eventBoard, /Number\(e\.target\.value\)/);
  assert.doesNotMatch(editor, /Number\(e\.target\.value\)/);
});
