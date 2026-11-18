<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.3.0 — 2026-11-18

**Default changed for security.** The `headersSeguros` middleware sends `Strict-Transport-Security` only on secure requests (`req.secure` or a TLS socket) and never to loopback hosts (`localhost`, `*.localhost`, `127.0.0.0/8`, `::1`, with or without a port). `X-Forwarded-Proto` is not read. The new `hstsIncondicional: true` option restores sending it on every response, as in 1.2.x. `construirHeaders` is unchanged.

Documentation: HSTS applies to the host on every port; start with a short `max-age` and enable `includeSubDomains` only after checking subdomains. Example `permissions` value with `serial=()`, `usb=()` and `hid=()`, default unchanged.

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Rdraim identity, visual presentation, compatibility review and more efficient history guard. Runtime API preserved.

`cspReportOnly: true` lets you assess a policy before enforcing it. This mode does not block content; collecting reports requires your own configured endpoint. Boolean options reject ambiguous strings.

# 1.1.0 — 2026-10-07

Immutable CSP defaults, malformed configuration rejection and HSTS subdomain control.

PT-BR/EN-US documentation, optional support with no payment channel, and publication checks.
