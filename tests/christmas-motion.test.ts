import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const file = (path: string) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('animation stylesheets never force all snowfall or bulb motion to stop', async () => {
  const cssFiles = await Promise.all([
    file('src/app/christmas-experience.css'),
    file('src/app/mockup-christmas.css'),
  ]);
  for (const css of cssFiles) {
    assert.doesNotMatch(css, /\.snow-particle[^\{]*\{[^}]*animation\s*:\s*none\s*!important/i);
    assert.doesNotMatch(css, /\.light-drop i[^\{]*\{[^}]*animation\s*:\s*none\s*!important/i);
    assert.doesNotMatch(css, /\.christmas-lights i[^\{]*,\s*\.snow-particle[^\{]*\{[^}]*animation\s*:\s*none/i);
  }
});

test('real falling snow and glowing bulbs run in normal and reduced-motion modes', async () => {
  const css = await file('src/app/mockup-christmas.css');
  const jsx = await file('src/components/christmas-atmosphere.tsx');
  const layout = await file('src/app/layout.tsx');
  assert.match(layout, /import '\.\/mockup-christmas\.css';/);
  assert.match(css, /@keyframes winter-snow-fall\s*\{/);
  assert.match(css, /@keyframes christmas-bulb-twinkle\s*\{/);
  assert.match(css, /animation-name:\s*winter-snow-fall;/);
  assert.match(css, /animation-name:\s*christmas-bulb-twinkle;/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/);
  assert.match(css, /animation-duration:\s*var\(--calm-duration,\s*32s\)\s*!important;/);
  assert.match(css, /animation-duration:\s*6\.5s\s*!important;/);
  assert.match(jsx, /--twinkle-duration/);
  assert.match(jsx, /--twinkle-delay/);
  assert.match(jsx, /--calm-duration/);
  assert.match(jsx, /length:\s*112/);
});
