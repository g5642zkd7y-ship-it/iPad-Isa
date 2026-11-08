// Captures de l'onglet Actualités (bandeau de la page et bannière de l'accueil) avec plusieurs gris de fond.
// node capture.js <url> <polices> <dossier>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, OUT] = process.argv;
const GRIS = { actuel: null, g1: '#5E6266', g2: '#686A6C', g3: '#6E7174', g4: '#74777A' };
const css = (g) => g ? `
  .view[data-view="actualites"] .page-hero.bg-encre, section[aria-labelledby="h-actus"].bg-encre{background:${g}!important;color:#fff!important}
  .view[data-view="actualites"] .page-hero.bg-encre .lead, section[aria-labelledby="h-actus"] .lead{color:#fff!important}
  section[aria-labelledby="h-actus"] .row-date, section[aria-labelledby="h-actus"] .row-sub, section[aria-labelledby="h-actus"] .row-cat{color:#fff!important}
  section[aria-labelledby="h-actus"] .more{color:#fff!important}
  section[aria-labelledby="h-actus"] .rows, section[aria-labelledby="h-actus"] .row-link{border-color:rgba(255,255,255,.32)!important}` : '';
(async () => {
  const b = await chromium.launch();
  for (const [k, g] of Object.entries(GRIS)) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
    const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: 'reduce' });
    await p.goto(URL_ + '#actualites'); await p.evaluate(() => document.fonts.ready);
    if (g) await p.addStyleTag({ content: css(g) });
    await p.waitForTimeout(600);
    await (await p.$('.view[data-view="actualites"] .page-hero')).screenshot({ path: path.join(OUT, `${k}-page.jpg`), type: 'jpeg', quality: 84 });
    await p.goto(URL_ + '#accueil'); await p.waitForTimeout(500);
    if (g) await p.addStyleTag({ content: css(g) });
    await p.addStyleTag({ content: '.gnav,.proto-strip,header{visibility:hidden!important}' });
    const s = await p.$('section[aria-labelledby="h-actus"]'); await s.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
    await s.screenshot({ path: path.join(OUT, `${k}-accueil.jpg`), type: 'jpeg', quality: 84 });
    await ctx.close();
  }
  await b.close();
  console.log('ok');
})();
