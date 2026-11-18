import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirHeaders, headersSeguros } from '../src/index.js';

// Requisições e respostas sintéticas; nenhum servidor é aberto.
function rodar(opcoes, req) {
  const headers = {};
  const res = { setHeader: (k, v) => (headers[k] = v), removeHeader: (k) => delete headers[k] };
  let chamouNext = false;
  headersSeguros(opcoes)(req, res, () => (chamouNext = true));
  assert.equal(chamouNext, true);
  return headers;
}
const HSTS = 'Strict-Transport-Security';
const segura = (host, extra = {}) => ({ secure: true, headers: host === undefined ? {} : { host }, ...extra });

test('HSTS sai em requisição segura para host público, com e sem porta', () => {
  for (const host of ['app.example.com', 'app.example.com:8443', 'example.org', '203.0.113.10:443', '[2001:db8::1]:443', undefined]) {
    assert.equal(rodar({}, segura(host))[HSTS], 'max-age=15552000; includeSubDomains', String(host));
  }
});

test('socket TLS sem req.secure também conta como seguro', () => {
  const h = rodar({}, { headers: { host: 'app.example.com' }, socket: { encrypted: true } });
  assert.equal(h[HSTS], 'max-age=15552000; includeSubDomains');
});

test('HSTS não sai sobre HTTP puro', () => {
  assert.equal(rodar({}, { headers: { host: 'app.example.com' } })[HSTS], undefined);
  assert.equal(rodar({}, { secure: false, headers: { host: 'app.example.com:8080' }, socket: { encrypted: false } })[HSTS], undefined);
  assert.equal(rodar({}, {})[HSTS], undefined);
  assert.equal(rodar({}, undefined)[HSTS], undefined);
});

test('X-Forwarded-Proto sozinho não liga o HSTS', () => {
  const h = rodar({}, { headers: { host: 'app.example.com', 'x-forwarded-proto': 'https' } });
  assert.equal(h[HSTS], undefined);
});

test('HSTS nunca sai para loopback, mesmo em HTTPS e com porta', () => {
  const hosts = ['localhost', 'LOCALHOST:3000', 'localhost.', 'dev.localhost:5173', '127.0.0.1', '127.0.0.1:8443',
    '127.1.2.3', '[::1]', '[::1]:8443', '::1', '[0:0:0:0:0:0:0:1]:443', '[::ffff:127.0.0.1]:443'];
  for (const host of hosts) assert.equal(rodar({}, segura(host))[HSTS], undefined, host);
  assert.equal(rodar({}, segura(undefined, { headers: { ':authority': 'localhost:8443' } }))[HSTS], undefined);
});

test('nomes parecidos com loopback não são tratados como loopback', () => {
  for (const host of ['localhost.example.com', 'meulocalhost', '127.0.0.1.example.com', '1270.0.0.1']) {
    assert.ok(rodar({}, segura(host))[HSTS], host);
  }
});

test('hstsIncondicional: true restaura o envio em toda resposta', () => {
  for (const req of [{}, { headers: { host: 'app.example.com' } }, segura('localhost:3000'), segura('[::1]:8443')]) {
    assert.equal(rodar({ hstsIncondicional: true }, req)[HSTS], 'max-age=15552000; includeSubDomains');
  }
});

test('hsts: false continua desligando, mesmo com hstsIncondicional', () => {
  assert.equal(rodar({ hsts: false }, segura('app.example.com'))[HSTS], undefined);
  assert.equal(rodar({ hsts: false, hstsIncondicional: true }, {})[HSTS], undefined);
});

test('hstsMaxAge e includeSubDomains seguem valendo no middleware', () => {
  const h = rodar({ hstsMaxAge: 300, includeSubDomains: false }, segura('app.example.com'));
  assert.equal(h[HSTS], 'max-age=300');
});

test('demais cabeçalhos saem em HTTP e em loopback', () => {
  for (const req of [{}, segura('localhost')]) {
    const h = rodar({}, req);
    assert.equal(h['X-Content-Type-Options'], 'nosniff');
    assert.ok(h['Content-Security-Policy']);
  }
});

test('hstsIncondicional rejeita valores ambíguos', () => {
  for (const v of ['true', 1, null]) assert.throws(() => headersSeguros({ hstsIncondicional: v }), TypeError);
});

test('construirHeaders mantém o HSTS estático (não conhece a requisição)', () => {
  assert.equal(construirHeaders()[HSTS], 'max-age=15552000; includeSubDomains');
  assert.equal(construirHeaders({ hstsIncondicional: false })[HSTS], 'max-age=15552000; includeSubDomains');
});

test('Permissions-Policy padrão não muda; serial/usb/hid entram por permissions', () => {
  assert.equal(construirHeaders()['Permissions-Policy'], 'camera=(), microphone=(), geolocation=()');
  const p = 'camera=(), microphone=(), geolocation=(), serial=(), usb=(), hid=()';
  assert.equal(rodar({ permissions: p }, {})['Permissions-Policy'], p);
});
