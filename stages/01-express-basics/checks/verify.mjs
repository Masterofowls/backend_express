/**
 * Run while practice server is up on port 9001:
 *   node checks/verify.mjs
 */

const BASE = process.env.BASE_URL ?? 'http://localhost:9001';

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });
  const text = await res.text();
  let body = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* plain */
  }
  return { status: res.status, body };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const results = [];

try {
  let r = await req('/');
  assert(r.status === 200, `GET / expected 200, got ${r.status}`);
  assert(r.body?.message?.includes('Stage 01'), 'GET / message mismatch');
  results.push('✓ GET /');

  r = await req('/health');
  assert(r.status === 200 && r.body?.ok === true, 'GET /health failed');
  results.push('✓ GET /health');

  r = await req('/products');
  assert(r.status === 200 && Array.isArray(r.body) && r.body.length >= 2, 'GET /products failed');
  results.push('✓ GET /products');

  r = await req('/products/1');
  assert(r.status === 200 && r.body?.id === 1, 'GET /products/1 failed');
  results.push('✓ GET /products/1');

  r = await req('/products/999');
  assert(r.status === 404, `GET /products/999 expected 404, got ${r.status}`);
  results.push('✓ GET /products/999 → 404');

  r = await req('/products', {
    method: 'POST',
    body: JSON.stringify({ name: 'Headset', price: 59 }),
  });
  assert(r.status === 201, `POST /products expected 201, got ${r.status}`);
  assert(r.body?.name === 'Headset' && r.body?.id, 'POST /products body mismatch');
  results.push('✓ POST /products → 201');

  r = await req('/products', {
    method: 'POST',
    body: JSON.stringify({ name: 'Broken' }),
  });
  assert(r.status === 400, `POST incomplete expected 400, got ${r.status}`);
  results.push('✓ POST /products incomplete → 400');

  r = await req('/nope');
  assert(r.status === 404, `GET /nope expected 404, got ${r.status}`);
  results.push('✓ GET /nope → 404');

  console.log(results.join('\n'));
  console.log('\nStage 01 PASSED. Mark docs/PROGRESS.md and say "stage 01 done".');
} catch (err) {
  console.error('FAILED:', err.message);
  console.error('Is the server running?  cd practice && npm start');
  process.exit(1);
}
