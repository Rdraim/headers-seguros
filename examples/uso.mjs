// Exemplo sintético / Synthetic example. No production access.
import { construirHeaders } from '../src/index.js';
console.log(construirHeaders({ cspReportOnly: true, hsts: false }));
