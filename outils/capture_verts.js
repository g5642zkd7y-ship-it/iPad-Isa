// Captures des quatre zones vertes avec chaque proposition (CSS injecté, site non modifié).
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, JUGE, OUT] = process.argv;
const choix = JSON.parse(fs.readFileSync(JUGE, 'utf8')).choix;
(async () => {
  const b = await chromium.launch();
  for (const c of choix) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) {} });
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
    const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: 'reduce' });
    const go = async (h) => { await p.goto(URL_ + h); await p.evaluate(() => document.fonts.ready); await p.addStyleTag({ content: c.css }); await p.waitForTimeout(600); };
    await go('#veille'); await (await p.$('.view[data-view="veille"] .page-hero')).screenshot({ path: path.join(OUT, c.cle + '-veille.png') });
    await go('#espace'); await (await p.$('.view[data-view="espace"] .page-hero')).screenshot({ path: path.join(OUT, c.cle + '-espace.png') });
    await go('#accueil'); await p.addStyleTag({ content: '.gnav,.proto-strip,header{visibility:hidden!important}' });
    for (const [id, nom] of [['h-veille', 'accueil_veille'], ['h-join', 'accueil_join']]) {
      const s = await p.$(`section[aria-labelledby="${id}"]`); await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
      await s.screenshot({ path: path.join(OUT, c.cle + '-' + nom + '.png') });
    }
    await ctx.close();
  }
  await b.close(); console.log('ok');
})();
