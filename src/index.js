/* ============================================================================
   headers-seguros — cabeçalhos de segurança para HTTP, sem dependência.

   Núcleo agnóstico: `construirHeaders(opcoes)` devolve um objeto de cabeçalhos.
   Adaptador Express: `headersSeguros(opcoes)` devolve um middleware.

   Padrões sensatos e restritivos; cada um ajustável. Não substitui uma análise
   de ameaças — é a base que quase todo serviço web deveria ter ligada.
   ============================================================================ */

const CSP_PADRAO = {
  'default-src': ["'self'"],
  'base-uri': ["'self'"],
  'frame-ancestors': ["'none'"],
  'object-src': ["'none'"],
  'img-src': ["'self'", 'data:'],
  'script-src': ["'self'"],
  'style-src': ["'self'"],
  'connect-src': ["'self'"],
  'form-action': ["'self'"],
};

const montarCSP = (diretivas) => Object.entries(diretivas)
  .filter(([, v]) => v && v.length)
  .map(([k, v]) => `${k} ${v.join(' ')}`)
  .join('; ');

/**
 * Monta o objeto de cabeçalhos de segurança.
 * @param {object} [o]
 * @param {boolean|object} [o.csp=true]   false desliga; objeto substitui diretivas
 * @param {boolean} [o.hsts=true]         Strict-Transport-Security (só faz sentido em HTTPS)
 * @param {number}  [o.hstsMaxAge=15552000]
 * @param {string}  [o.frame='DENY']      X-Frame-Options (DENY | SAMEORIGIN)
 * @param {string}  [o.referrer='no-referrer']
 * @param {string}  [o.permissions='camera=(), microphone=(), geolocation=()']
 * @returns {Record<string,string>}
 */
export function construirHeaders(o = {}) {
  const {
    csp = true, hsts = true, hstsMaxAge = 15552000,
    frame = 'DENY', referrer = 'no-referrer',
    permissions = 'camera=(), microphone=(), geolocation=()',
  } = o;
  const h = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': frame,
    'Referrer-Policy': referrer,
    'X-DNS-Prefetch-Control': 'off',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy': permissions,
    'Origin-Agent-Cluster': '?1',
  };
  if (csp) h['Content-Security-Policy'] = montarCSP(csp === true ? CSP_PADRAO : { ...CSP_PADRAO, ...csp });
  if (hsts) h['Strict-Transport-Security'] = `max-age=${hstsMaxAge}; includeSubDomains`;
  return h;
}

/**
 * Middleware Express/Connect que aplica os cabeçalhos e remove o X-Powered-By.
 * @param {object} [opcoes] mesmas de construirHeaders
 */
export function headersSeguros(opcoes = {}) {
  const headers = construirHeaders(opcoes);
  return function headersSegurosMiddleware(req, res, next) {
    res.removeHeader && res.removeHeader('X-Powered-By');
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    next();
  };
}

export { CSP_PADRAO };
export default headersSeguros;
