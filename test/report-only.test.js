import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirHeaders } from '../src/index.js';
test('CSP pode ser avaliada em report-only antes da aplicação', () => {
  const h = construirHeaders({ cspReportOnly: true });
  assert.ok(h['Content-Security-Policy-Report-Only'].includes("default-src 'self'"));
  assert.equal(h['Content-Security-Policy'], undefined);
  assert.ok(construirHeaders()['Content-Security-Policy']);
});
test('opções ambíguas e controles de header são rejeitados', () => {
  for (const o of [{ hsts: 'false' }, { includeSubDomains: 0 }, { cspReportOnly: 'true' }, { referrer: 'no-referrer\u000b' }]) assert.throws(() => construirHeaders(o), TypeError);
});
