// Suite de tests de la maquette SLBC : le bandeau des cookies est déjà répondu (refus) dans chaque navigateur ouvert,
// pour qu'il ne recouvre pas le bas des pages testées. check_cookies.js le teste à part (SLBC_BANDEAU_COOKIES=1).
// Chargé par suite.sh avec NODE_OPTIONS="--require …/preload-cookies.js".
if (process.env.SLBC_BANDEAU_COOKIES !== '1') {
  const pw = require('playwright');
  const repondu = () => {
    try { if (!localStorage.getItem('slbc-maquette-cookies')) localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) { /* page sans stockage */ }
  };
  for (const bt of [pw.chromium, pw.webkit, pw.firefox]) {
    if (!bt) continue;
    const launch = bt.launch.bind(bt);
    bt.launch = async (...a) => {
      const b = await launch(...a);
      const nc = b.newContext.bind(b);
      b.newContext = async (...o) => { const c = await nc(...o); await c.addInitScript(repondu); return c; };
      const np = b.newPage.bind(b);
      b.newPage = async (...o) => { const p = await np(...o); await p.context().addInitScript(repondu); return p; };
      return b;
    };
  }
}
