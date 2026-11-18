<p align="right">
  <a href="COMPATIBILITY.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="COMPATIBILITY.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="COMPATIBILITY.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# Compatibilidad

Núcleo sin dependencias de ejecución. CI con Node.js 22 y 24. Instalación desde Git; este proyecto no está publicado en npm. Revisá Releases y fijá una tag/commit al integrar. Actualizaciones requieren revisar licencia, engines y pruebas del consumidor. Un badge de CI no certifica seguridad.

Revisión: 2026-11-18. ESM · MIT · Node.js >=22.

## Cambio de valor predeterminado en la 1.3.0

Por seguridad, el middleware `headersSeguros` dejó de enviar `Strict-Transport-Security` en toda respuesta: ahora solo lo envía con `req.secure === true` o socket TLS y nunca a `localhost`, `*.localhost`, `127.0.0.0/8` ni `::1` (con o sin puerto). No se lee ninguna cabecera `X-Forwarded-*`. Detrás de un proxy que termina el TLS sin `trust proxy` de Express, la app deja de enviar HSTS: configurá `trust proxy`, enviá el HSTS desde el proxy o pasá `hstsIncondicional: true` para volver al comportamiento de la 1.2.x. `construirHeaders` y las demás opciones no cambiaron.

[Node.js releases](https://nodejs.org/en/about/previous-releases) · [GitHub Releases](https://github.com/Rdraim/headers-seguros/releases)

Los paquetes opcionales pertenecen a adaptadores, no al núcleo obligatorio. Verificá versión fijada, licencia y soporte antes de integrar.

[README](README.es-AR.md)

| Paquete | Versión (2026-10-07) | Requisito Node | Licencia |
|---|---|---|---|
| [express](https://www.npmjs.com/package/express/v/5.2.1) | 5.2.1 | >= 18 | MIT |

Versiones consultadas en el registro oficial npm; sin engines declarado no hay garantía de compatibilidad. Adaptadores opcionales no instalados ni validados con servicios reales. Núcleo probado por separado.

## Indicadores condicionales

Los badges usan SVG locales generados desde la API oficial de GitHub. Stars
y Forks aparecen de forma independiente solo por encima de cero. Una release
ausente o CI pendiente/fallido no genera badge; los resultados siguen en Actions.
badges.yml actualiza tras CI, release, estrella/fork y cada seis horas, o a mano.
La página abierta no cambia al instante: recargar tras el commit automático.
GitHub puede demorar la agenda o desactivarla por inactividad; revisar Actions.
Errores transitorios de API frenan la actualización y conservan el último bloque
válido. El token temporal publica solo README y SVG, nunca datos privados.
