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

// O navegador ignora HSTS recebido sobre HTTP puro, e HSTS em loopback prende o
// ambiente de desenvolvimento em HTTPS (o HSTS vale para o host em todas as portas).
const IPV4_LOOPBACK = /^(?:::ffff:)?127(?:\.\d{1,3}){3}$/;
function hostSemPorta(valor) {
  let h = String(valor).trim().toLowerCase();
  if (h.startsWith('[')) {
    const fim = h.indexOf(']');
    if (fim > 0) h = h.slice(1, fim);
  } else if (h.indexOf(':') === h.lastIndexOf(':')) {
    // nome:porta ou IPv4:porta; IPv6 sem colchetes tem mais de um ':' e fica como está
    const p = h.indexOf(':');
    if (p >= 0) h = h.slice(0, p);
  }
  return h.endsWith('.') ? h.slice(0, -1) : h;
}
function ehLoopback(host) {
  if (!host) return false;
  const h = hostSemPorta(host);
  return h === 'localhost' || h.endsWith('.localhost') || h === '::1' || h === '0:0:0:0:0:0:0:1' || IPV4_LOOPBACK.test(h);
}
// Só sinais da própria conexão: req.secure (Express calcula conforme o "trust proxy"
// configurado no app) ou o socket TLS. Nenhum cabeçalho X-Forwarded-* é lido aqui.
function requisicaoSegura(req) {
  return req?.secure === true || req?.socket?.encrypted === true;
}
function hostDaRequisicao(req) {
  const hs = req?.headers || {};
  const v = hs.host ?? hs[':authority'];
  return typeof v === 'string' ? v : '';
}

/**
 * Middleware Express/Connect que aplica os cabeçalhos e remove o X-Powered-By.
 * Por padrão o Strict-Transport-Security só sai em requisição segura e nunca para
 * hosts de loopback (localhost, *.localhost, 127.0.0.0/8, ::1), com ou sem porta.
 * @param {object} [opcoes] mesmas de construirHeaders, mais:
 * @param {boolean} [opcoes.hstsIncondicional=false] true restaura o envio do HSTS
 *   em toda resposta (comportamento até a 1.2.x)
 */
export function headersSeguros(opcoes = {}) {
  const { hstsIncondicional = false } = opcoes;
  if (typeof hstsIncondicional !== 'boolean') throw new TypeError('opção booleana inválida');
  const { 'Strict-Transport-Security': hsts, ...headers } = construirHeaders(opcoes);
  return function headersSegurosMiddleware(req, res, next) {
    res.removeHeader && res.removeHeader('X-Powered-By');
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
    if (hsts && (hstsIncondicional || (requisicaoSegura(req) && !ehLoopback(hostDaRequisicao(req))))) {
      res.setHeader('Strict-Transport-Security', hsts);
    }
    next();
  };
}

export { CSP_PADRAO };
export default headersSeguros;
