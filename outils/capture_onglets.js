// Planche « Onglets du menu et sous-onglets du syndicat » (11 novembre 2026, demande d'Isabelle Eimer : « Fais-moi 4 propositions pour ces
// onglets et les sous-onglets du syndicat pour les rendre plus attractifs et plus en rapport avec la charte et le style du site tout en
// restant professionnel. Propose-moi sur une planche. Ne touche pas au site en lui-même. »)
// Captures du site tel qu'il est, ou avec une proposition : styles (css) et, si besoin, un script (script) ajoutés à la page ouverte,
// le site n'est pas modifié. Une proposition est un fichier JavaScript : module.exports = { css: '…', script: '…' (facultatif) }.
// usage : node capture_onglets.js <url du site> <dossier des polices> <fichier de la proposition | actuel> <dossier de sortie> <préfixe>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, PROP, OUT, K] = process.argv;
const prop = PROP === 'actuel' ? { css: '', script: '' } : require(path.resolve(PROP));

const fonts = async (ctx) => {
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
};
const cookies = () => { try { localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) {} };
const ouvrir = async (p, hash) => {
  await p.goto(URL_ + '#' + hash); await p.evaluate(() => document.fonts.ready);
  if (prop.css) await p.addStyleTag({ content: prop.css });
  if (prop.script) await p.addScriptTag({ content: prop.script });
  await p.evaluate(async () => { await document.fonts.ready; window.scrollTo(0, 0); }); await p.waitForTimeout(500);
};
const bas = (p, sel) => p.evaluate((s) => { const e = document.querySelector(s); return e ? Math.ceil(e.getBoundingClientRect().bottom) : 0; }, sel);
const jusquAuBureau = async (p) => {
  await p.evaluate(() => { const b = document.getElementById('bureau'); window.scrollTo(0, b.getBoundingClientRect().top + scrollY - 150); }); await p.waitForTimeout(800);
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const errs = [];
  const b = await chromium.launch();
  // iPad à l'horizontale : menu complet
  const ctx = await b.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1 }); await fonts(ctx); await ctx.addInitScript(cookies);
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.emulateMedia({ reducedMotion: 'reduce' });
  await ouvrir(p, 'accueil');
  await p.screenshot({ path: path.join(OUT, K + '-menu.jpg'), type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1180, height: (await bas(p, '.gnav')) + 2 } });
  await p.hover('.gnav-links a[data-nav="presse"]'); await p.waitForTimeout(350);
  await p.screenshot({ path: path.join(OUT, K + '-survol.jpg'), type: 'jpeg', quality: 88, clip: { x: 0, y: 0, width: 1180, height: (await bas(p, '.gnav')) + 2 } });
  await p.mouse.move(5, 600);
  await ouvrir(p, 'syndicat');
  await p.screenshot({ path: path.join(OUT, K + '-syndicat.jpg'), type: 'jpeg', quality: 84 });
  await jusquAuBureau(p);
  const enCours = await p.evaluate(() => { const a = document.querySelector('.view[data-view="syndicat"] .lnav a[aria-current="true"]'); return a ? a.textContent.trim() : ''; });
  await p.screenshot({ path: path.join(OUT, K + '-syndicat-bureau.jpg'), type: 'jpeg', quality: 84, clip: { x: 0, y: 0, width: 1180, height: Math.min(820, (await bas(p, '.view[data-view="syndicat"] .lnav')) + 120) } });
  await ctx.close();
  // Téléphone : menu compact ouvert, haut de la page Le syndicat, sous-onglets en cours de lecture
  const t = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await fonts(t); await t.addInitScript(cookies);
  const q = await t.newPage(); q.on('pageerror', (e) => errs.push(e.message)); await q.emulateMedia({ reducedMotion: 'reduce' });
  await ouvrir(q, 'syndicat');
  await q.screenshot({ path: path.join(OUT, K + '-tel-syndicat.jpg'), type: 'jpeg', quality: 80 });
  await jusquAuBureau(q);
  await q.screenshot({ path: path.join(OUT, K + '-tel-bureau.jpg'), type: 'jpeg', quality: 80, clip: { x: 0, y: 0, width: 390, height: 300 } });
  await q.evaluate(() => window.scrollTo(0, 0)); await q.waitForTimeout(300);
  await q.click('.menu-btn'); await q.waitForTimeout(500);
  await q.screenshot({ path: path.join(OUT, K + '-tel-menu.jpg'), type: 'jpeg', quality: 80 });
  const debord = await q.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await t.close();
  await b.close();
  console.log(K, 'ok', 'sous-onglet en cours : « ' + enCours + ' »', 'débord téléphone ' + debord, errs.length ? 'ERREURS ' + errs.join(' | ') : 'aucune erreur');
})();
