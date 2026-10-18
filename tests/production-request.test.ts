import { test } from 'node:test';
import assert from 'node:assert/strict';
import { body } from '../src/lib/http';

function request(origin: string | undefined, data: unknown = { dish: 'Mini-quiches' }) {
  return new Request('https://netlify-internal-runtime.example/api/events/fixture/contributions', {
    method: 'POST',
    headers: {
      ...(origin ? { origin } : {}),
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

test('same-origin Netlify POST is accepted despite the internal request URL', async () => {
  const previous = process.env.URL;
  process.env.URL = 'https://bringtogo.netlify.app';
  try {
    assert.deepEqual(await body(request('https://bringtogo.netlify.app')), { dish: 'Mini-quiches' });
  } finally {
    if (previous === undefined) delete process.env.URL;
    else process.env.URL = previous;
  }
});

test('Netlify origin validation still rejects foreign sites', async () => {
  const previous = process.env.URL;
  process.env.URL = 'https://bringtogo.netlify.app';
  try {
    await assert.rejects(body(request('https://other-example.invalid')), { status: 403 });
    await assert.rejects(body(request(undefined)), { status: 403 });
  } finally {
    if (previous === undefined) delete process.env.URL;
    else process.env.URL = previous;
  }
});
