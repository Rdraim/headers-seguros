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

for (const fontes of Object.values(CSP_PADRAO)) Object.freeze(fontes);
Object.freeze(CSP_PADRAO);
const montarCSP = (diretivas) => Object.entries(diretivas)
  .filter(([, v]) => v !== null && v !== false)
    .map(([k, v]) => {
      if (!/^[a-z][a-z0-9-]*$/.test(k) || !Array.isArray(v) || v.some((s) => typeof s !== 'string' || /[\s;,\r\n]/.test(s))) throw new TypeError('diretiva CSP inválida');
      return `${k} ${v.join(' ')}`;
    })
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
    permissions = 'camera=(), microphone=(), geolocation=()', includeSubDomains = true, cspReportOnly = false,
  } = o;
  if (csp !== false && csp !== true && (!csp || typeof csp !== 'object' || Array.isArray(csp))) throw new TypeError('csp inválida');
  if (!['DENY', 'SAMEORIGIN'].includes(frame)) throw new TypeError('frame inválido');
  for (const v of [hsts, includeSubDomains, cspReportOnly]) if (typeof v !== 'boolean') throw new TypeError('opção booleana inválida');
  if (!Number.isSafeInteger(hstsMaxAge) || hstsMaxAge < 0) throw new TypeError('hstsMaxAge inválido');
  for (const v of [referrer, permissions]) if (typeof v !== 'string' || /[\u0000-\u001f\u007f]/.test(v)) throw new TypeError('valor de header inválido');
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
  if (csp) h[cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy'] = montarCSP(csp === true ? CSP_PADRAO : { ...CSP_PADRAO, ...csp });
  if (hsts) h['Strict-Transport-Security'] = `max-age=${hstsMaxAge}${includeSubDomains ? '; includeSubDomains' : ''}`;
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
