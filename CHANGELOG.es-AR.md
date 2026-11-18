<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.3.0 — 2026-11-18

**Cambio de valor predeterminado por seguridad.** El middleware `headersSeguros` solo envía `Strict-Transport-Security` en solicitudes seguras (`req.secure` o socket TLS) y nunca a hosts de loopback (`localhost`, `*.localhost`, `127.0.0.0/8`, `::1`, con o sin puerto). `X-Forwarded-Proto` no se lee. La nueva opción `hstsIncondicional: true` restaura el envío en toda respuesta, como en la 1.2.x. `construirHeaders` no cambia.

Documentación: el HSTS vale para el host en todos los puertos; empezá con un `max-age` corto y activá `includeSubDomains` recién después de revisar los subdominios. Ejemplo de `permissions` con `serial=()`, `usb=()` y `hid=()`, sin cambiar el valor predeterminado.

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Identidad Rdraim, presentación gráfica, revisión de compatibilidad y control de historial más eficiente. API de ejecución conservada.

`cspReportOnly: true` permite evaluar una política antes de aplicarla. Este modo no bloquea contenido; recopilar informes requiere un endpoint propio configurado. Las opciones booleanas rechazan cadenas ambiguas.

# 1.1.0 — 2026-10-07

CSP predeterminada inmutable, rechazo de configuraciones mal formadas y control de subdominios HSTS.

Documentación en portugués brasileño e inglés de Estados Unidos, apoyo voluntario todavía sin canal de pago en esa versión y verificaciones de publicación.
