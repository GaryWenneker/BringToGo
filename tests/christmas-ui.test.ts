import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const file = (name: string) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');

test('numeric form controls preserve empty strings instead of coercing them to zero', async () => {
  const [board, editor] = await Promise.all([
    file('src/components/event-board.tsx'),
    file('src/components/event-editor.tsx'),
  ]);
  assert.match(board, /patch\('portions',e\.target\.value\)/);
  assert.match(board, /patch\('attendees',e\.target\.value\)/);
  assert.match(editor, /\[c\.id\]:e\.target\.value/);
  assert.doesNotMatch(editor, /Number\(e\.target\.value\)/);
});

test('festive design is native layout with distinct images, not one static screenshot', async () => {
  const [layout, board, css] = await Promise.all([
    file('src/app/layout.tsx'),
    file('src/components/event-board.tsx'),
    file('src/app/mockup-christmas.css'),
  ]);
  assert.match(layout, /mockup-christmas\.css/);
  assert.match(board, /alem-winter-photo/);
  assert.match(board, /step-illustration-list/);
  assert.match(board, /step-illustration-food/);
  assert.match(board, /step-illustration-party/);
  assert.match(css, /kerst-guirlande\.svg/);
  assert.match(css, /kerst-stap-hapje\.svg/);
  assert.match(css, /@media\(max-width:520px\)/);
});
