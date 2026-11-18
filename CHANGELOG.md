<p align="right">
  <a href="CHANGELOG.md"><img src="assets/support/flag-pt-br.svg" width="36" height="24" alt="Português brasileiro" title="Português brasileiro"></a>
  <a href="CHANGELOG.en-US.md"><img src="assets/support/flag-en-us.svg" width="36" height="24" alt="English (United States)" title="English (United States)"></a>
  <a href="CHANGELOG.es-AR.md"><img src="assets/support/flag-es-ar.svg" width="36" height="24" alt="Español (Argentina)" title="Español (Argentina)"></a>
</p>

# 1.3.0 — 2026-11-18

**Mudança de padrão por segurança.** O middleware `headersSeguros` só envia `Strict-Transport-Security` em requisição segura (`req.secure` ou socket TLS) e nunca para hosts de loopback (`localhost`, `*.localhost`, `127.0.0.0/8`, `::1`, com ou sem porta). `X-Forwarded-Proto` não é lido. A nova opção `hstsIncondicional: true` restaura o envio em toda resposta, como na 1.2.x. `construirHeaders` não muda.

Documentação: o HSTS vale para o host em todas as portas; comece com `max-age` curto e só ligue `includeSubDomains` depois de conferir os subdomínios. Exemplo de `permissions` com `serial=()`, `usb=()` e `hid=()`, sem mudar o padrão.

# 1.2.0 — 2026-10-07

## 1.2.1 — 2026-10-07

Identidade Rdraim, apresentação gráfica, revisão de compatibilidade e guarda do histórico mais eficiente. API de runtime preservada.

`cspReportOnly: true` permite avaliar a política antes de aplicá-la. Esse modo não bloqueia conteúdo; recebimento de relatórios exige configurar endpoint próprio. Opções booleanas rejeitam strings ambíguas.

# 1.1.0 — 2026-10-07

CSP imutável, rejeição de configuração malformada e controle de subdomínios HSTS.

Documentação PT-BR/EN-US, apoio voluntário ainda sem canal de pagamento e verificações de publicação.
