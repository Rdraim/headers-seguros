# headers-seguros

Cabeçalhos de segurança para serviços HTTP em Node.js — **sem dependências**.
Núcleo agnóstico (`construirHeaders`) + middleware para Express/Connect
(`headersSeguros`). Padrões restritivos e sensatos, cada um ajustável.

## Por quê

A maioria dos ataques de navegador (clickjacting, sniffing de MIME, injeção de
script, vazamento de referer) é mitigada por cabeçalhos que quase todo serviço
deveria enviar e muitos esquecem. Este módulo liga a base certa numa linha.

Define: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`,
`X-Frame-Options`, `Referrer-Policy`, `Strict-Transport-Security`,
`Permissions-Policy`, `Cross-Origin-Opener-Policy`,
`Cross-Origin-Resource-Policy`, `Origin-Agent-Cluster` — e remove `X-Powered-By`.

## Instalação

```bash
npm install headers-seguros
```

## Uso

```js
import express from 'express';
import { headersSeguros } from 'headers-seguros';

const app = express();
app.use(headersSeguros());               // padrões seguros
// ou ajustando a CSP:
app.use(headersSeguros({ csp: { 'img-src': ["'self'", 'https:', 'data:'] } }));
```

Sem framework:

```js
import { construirHeaders } from 'headers-seguros';
for (const [k, v] of Object.entries(construirHeaders())) res.setHeader(k, v);
```

## Opções

| opção | padrão | descrição |
|---|---|---|
| `csp` | `true` | `false` desliga; um objeto estende/sobrescreve as diretivas |
| `hsts` | `true` | `Strict-Transport-Security` (só use em HTTPS) |
| `hstsMaxAge` | `15552000` | validade do HSTS (segundos) |
| `frame` | `'DENY'` | `X-Frame-Options` (`DENY` ou `SAMEORIGIN`) |
| `referrer` | `'no-referrer'` | `Referrer-Policy` |
| `permissions` | `camera=(), microphone=(), geolocation=()` | `Permissions-Policy` |

> Ajuste a CSP ao seu app — uma política boa é restritiva por padrão e abre só o
> necessário. Teste em homologação antes de produção.

## Testes

```bash
npm test
```

## Licença

MIT © Rodrigo Rodrigues
