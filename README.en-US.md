# headers-seguros

[Brazilian Portuguese](README.md) · [Voluntary support](SUPPORT.md)

Configurable HTTP security headers for Node.js and Express/Connect, without runtime dependencies.

## Start here

Requires Git and Node.js 22+ for tests. No runtime dependencies. Download the actual repository rather than an unverified same-name npm package.

```sh
git clone https://github.com/techrodrigo21-ux/headers-seguros.git
cd headers-seguros
npm test
node tools/check-public-content.mjs
```

These imports work from the cloned repository root. To use the module in another project, install a pinned Git tag or copy the module while retaining the MIT license. This documentation does not claim an npm registry release.

```js
import { construirHeaders, headersSeguros } from './src/index.js';
const headers = construirHeaders({ hsts: false }); // local HTTP
// app.use(headersSeguros({ hsts: true, includeSubDomains: false }));
```

## API

`construirHeaders(opcoes)`; `headersSeguros(opcoes)`; `CSP_PADRAO`.

Public function and option names remain in Portuguese for compatibility.

## Behavior and limits

Options: `csp` (true, false, or a directive map containing source arrays; null/false removes a directive), `hsts`, `hstsMaxAge`, `includeSubDomains`, `frame`, `referrer`, `permissions`. HSTS defaults to 15552000 seconds and includes subdomains. Use it on HTTPS only and confirm subdomain readiness. `frame: SAMEORIGIN` also requires an appropriate CSP `frame-ancestors` value. COOP/CORP can affect external integrations. These headers do not replace authorization, CSRF defenses or a security review.

## Maintenance

These standalone modules are inspired by work on Nexus, Rodrigo Rodrigues's independent project. They contain no private database, deployment configuration, logs, credentials or user records. Coordinated maintenance means reviewing related changes in the same release cycle, not automatically copying private source files.

## Version 1.1.0

Immutable CSP defaults, malformed configuration rejection and HSTS subdomain control.

[Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Voluntary support](SUPPORT.md)

MIT © Rodrigo Rodrigues

Official reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy


## Practical use — 1.2.0

`cspReportOnly: true` lets you assess a policy before enforcing it. This mode does not block content; collecting reports requires your own configured endpoint. Boolean options reject ambiguous strings.

Runnable example with synthetic data: `node examples/uso.mjs`.
