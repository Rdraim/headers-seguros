import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirHeaders, CSP_PADRAO } from '../src/index.js';
test('rejeita configurações malformadas e injeção de header/CSP', () => {
  for (const o of [{ csp: { 'img-src': 'https:' } }, { csp: { 'img-src': ["'self'; script-src *"] } }, { referrer: 'x\r\nX-Test: yes' }, { hstsMaxAge: -1 }]) assert.throws(() => construirHeaders(o));
  assert.throws(() => CSP_PADRAO['script-src'].push('*'));
  assert.equal(construirHeaders({ includeSubDomains: false })['Strict-Transport-Security'], 'max-age=15552000');
  assert.ok(construirHeaders({ csp: { 'upgrade-insecure-requests': [] } })['Content-Security-Policy'].includes('upgrade-insecure-requests'));
});
