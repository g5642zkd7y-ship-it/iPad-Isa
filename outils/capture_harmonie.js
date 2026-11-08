// Captures pour les planches d'harmonie des couleurs : bandeaux de toutes les pages (ordre du menu),
// accueil complet, haut de l'espace adhérent. Une proposition de couleur est injectée en CSS (le site n'est pas modifié).
// node capture_harmonie.js <url> <dossier polices> <fichier css ou -> <dossier de sortie>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, CSSFILE, OUT] = process.argv;
const css = CSSFILE && CSSFILE !== '-' ? fs.readFileSync(CSSFILE, 'utf8') : '';
const PAGES = ['syndicat', 'veille', 'presse', 'actualites', 'documentation', 'adherer', 'espace'];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) {} });
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
  const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: 'reduce' });
  const go = async (h) => {
    await p.goto(URL_ + '#' + h); await p.evaluate(() => document.fonts.ready);
    if (css) await p.addStyleTag({ content: css });
    await p.waitForTimeout(700);
  };
  for (const v of PAGES) {
    await go(v);
    await (await p.$(`.view[data-view="${v}"] .page-hero`)).screenshot({ path: path.join(OUT, `hero-${v}.png`) });
  }
  // Haut de l'espace adhérent : bandeau, carte de connexion et portes (visiteur non connecté)
  await go('espace');
  const box = await p.evaluate(() => {
    const h = document.querySelector('.view[data-view="espace"] .page-hero').getBoundingClientRect();
    const l = document.querySelector('#login').getBoundingClientRect();
    return { y: h.top + scrollY, h: l.bottom - h.top };
  });
  await p.addStyleTag({ content: '.gnav,.proto-strip,header{visibility:hidden!important}' });
  await p.screenshot({ path: path.join(OUT, 'espace-haut.png'), fullPage: true, clip: { x: 0, y: box.y, width: 1280, height: box.h } });
  // Accueil complet, de haut en bas
  await go('accueil');
  for (let y = 0; y < 12000; y += 700) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(60); }
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(OUT, 'accueil.png'), fullPage: true });
  await b.close(); console.log('ok', OUT);
})();
