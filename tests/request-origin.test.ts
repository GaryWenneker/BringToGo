import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateWriteOrigin } from '../src/lib/request-origin';

function writeRequest(origin: string | undefined, url = 'https://bringtogo.netlify.app/api/events/test/contributions', extra: Record<string,string> = {}) {
  return new Request(url, {
    method: 'POST',
    headers: {
      ...(origin ? { origin } : {}),
      'content-type': 'application/json',
      ...extra,
    },
    body: '{}',
  });
}

test('allows the actual origin for ordinary same-origin writes', () => {
  assert.doesNotThrow(() => validateWriteOrigin(writeRequest('https://bringtogo.netlify.app'), []));
});
test('accepts a public Netlify origin even when the adapter Request.url uses an internal hostname', () => {
  const request = writeRequest('https://bringtogo.netlify.app', 'https://internal.netlify/api/events/test/contributions', {
    host: 'internal.netlify',
    'sec-fetch-site': 'same-origin',
  });
  assert.doesNotThrow(() => validateWriteOrigin(request, ['https://bringtogo.netlify.app']));
});
test('accepts a public forwarded host when Netlify is behind a proxy', () => {
  const request = writeRequest('https://bringtogo.netlify.app', 'https://internal.netlify/api/events/test/contributions', {
    host: 'internal.netlify', 'x-forwarded-host': 'bringtogo.netlify.app', 'sec-fetch-site': 'same-origin',
  });
  assert.doesNotThrow(() => validateWriteOrigin(request, []));
});
test('accepts Netlify deploy previews when their own trusted deployment address is configured', () => {
  const origin = 'https://deploy-preview-7--bringtogo.netlify.app';
  const request = writeRequest(origin, 'https://internal.netlify/api/test', { host: 'internal.netlify' });
  assert.doesNotThrow(() => validateWriteOrigin(request, [origin]));
});
test('blocks requests from a foreign site even when it matches one of our URLs in a spoofed proxy header', () => {
  const request = writeRequest('https://attacker.example', 'https://internal.netlify/api/test', {
    host: 'internal.netlify', 'x-forwarded-host': 'attacker.example', 'sec-fetch-site': 'cross-site',
  });
  assert.throws(() => validateWriteOrigin(request, ['https://bringtogo.netlify.app']), { status: 403 });
});
test('blocks requests without a browser origin, malformed origins and same-site cross-origin requests', () => {
  assert.throws(() => validateWriteOrigin(writeRequest(undefined), []), { status: 403 });
  assert.throws(() => validateWriteOrigin(writeRequest('not-an-origin'), []), { status: 403 });
  assert.throws(() => validateWriteOrigin(writeRequest('https://bringtogo.netlify.app/path'), []), { status: 403 });
  assert.throws(() => validateWriteOrigin(writeRequest('https://bringtogo.netlify.app', undefined, { 'sec-fetch-site': 'same-site' }), []), { status: 403 });
});
test('does not accept unrelated public hosts or comma-separated forwarded host chains', () => {
  const wrongSite = writeRequest('https://attacker.example', 'https://internal.netlify/api/test', {
    host: 'internal.netlify', 'x-forwarded-host': 'attacker.example, bringsite.netlify.app',
  });
  assert.throws(() => validateWriteOrigin(wrongSite, ['https://bringtogo.netlify.app']), { status: 403 });
});
