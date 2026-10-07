import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirHeaders, headersSeguros } from '../src/index.js';

test('padrões essenciais estão presentes', () => {
  const h = construirHeaders();
  assert.equal(h['X-Content-Type-Options'], 'nosniff');
  assert.equal(h['X-Frame-Options'], 'DENY');
  assert.ok(h['Content-Security-Policy'].includes("default-src 'self'"));
  assert.ok(h['Content-Security-Policy'].includes("frame-ancestors 'none'"));
  assert.ok(h['Strict-Transport-Security'].startsWith('max-age='));
});

test('csp:false desliga; hsts:false desliga', () => {
  const h = construirHeaders({ csp: false, hsts: false });
  assert.equal(h['Content-Security-Policy'], undefined);
  assert.equal(h['Strict-Transport-Security'], undefined);
});

test('csp como objeto estende/sobrescreve diretivas', () => {
  const h = construirHeaders({ csp: { 'img-src': ["'self'", 'https:'] } });
  assert.ok(h['Content-Security-Policy'].includes("img-src 'self' https:"));
  assert.ok(h['Content-Security-Policy'].includes("default-src 'self'")); // mantém o resto
});

test('middleware aplica headers e remove X-Powered-By', () => {
  const headers = {};
  const res = { setHeader: (k, v) => (headers[k] = v), removeHeader: (k) => (headers[k] = undefined) };
  let chamouNext = false;
  headersSeguros()({}, res, () => (chamouNext = true));
  assert.equal(chamouNext, true);
  assert.equal(headers['X-Powered-By'], undefined);
  assert.equal(headers['X-Content-Type-Options'], 'nosniff');
});
