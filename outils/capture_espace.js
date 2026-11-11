// Planche « Pages réservées aux adhérents » (11 novembre 2026, demande d'Isabelle Eimer : « On va passer aux pages réservées aux
// adhérents. Propose une mise en page selon ce que l'on a défini ensemble, et qui soit plus attractive qu'actuellement. […] Attention
// à rester sobre. Fais une proposition avec une planche d'abord. »)
// Captures de l'espace adhérent une fois connecté, tel qu'il est, ou avec une proposition : styles (css) et, si besoin, un script
// (script) ajoutés à la page ouverte ; le site n'est pas modifié. Proposition : module.exports = { css: '…', script: '…' }.
// Ordinateur seulement (1280 px de large) : les téléphones et tablettes seront vérifiés après le choix.
// usage : node capture_espace.js <url du site> <dossier des polices> <fichier de la proposition | actuel> <dossier de sortie> <préfixe>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, PROP, OUT, K] = process.argv;
// Plusieurs fichiers possibles, séparés par des virgules (partie commune puis page) : styles mis bout à bout, scripts lancés dans l'ordre.
const prop = PROP === 'actuel' ? { css: '', script: '' } : PROP.split(',').map((f) => require(path.resolve(f))).reduce((a, x) => ({ css: a.css + '\n' + (x.css || ''), script: a.script + '\n;' + (x.script || '') }), { css: '', script: '' });

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const errs = [];
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
  await ctx.addInitScript(() => { try { localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) {} });
  const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.emulateMedia({ reducedMotion: 'reduce' });
  await p.goto(URL_ + '#espace'); await p.evaluate(() => document.fonts.ready);
  // Connexion de démonstration (tout identifiant est accepté)
  await p.fill('#login-email', 'adherent@laboratoire.fr'); await p.fill('#login-pass', 'demonstration'); await p.click('#login-form button[type="submit"]');
  await p.waitForTimeout(700);
  if (prop.css) await p.addStyleTag({ content: prop.css });
  if (prop.script) await p.addScriptTag({ content: prop.script });
  await p.evaluate(async () => { await document.fonts.ready; }); await p.waitForTimeout(400);
  const pleine = async (nom, max) => {
    await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    // la page entière jusqu'au pied de page (exclu), limitée à max px de haut
    const pied = await p.evaluate(() => { const f = document.querySelector('footer'); return f ? Math.floor(f.getBoundingClientRect().top + scrollY) : document.documentElement.scrollHeight; });
    await p.screenshot({ path: path.join(OUT, K + '-' + nom + '.jpg'), type: 'jpeg', quality: 82, fullPage: true, clip: { x: 0, y: 0, width: 1280, height: Math.min(pied, max || 3200, h) } });
  };
  const ouvrir = async (panel) => {
    const ok = await p.evaluate((panel) => {
      const btn = [...document.querySelectorAll('#ea-tabs [data-panel], #ea-tabs button, #ea-tabs a')].find((x) => (x.dataset.panel || '') === panel || (x.getAttribute('aria-controls') || '') === 'ea-' + panel);
      if (btn) { btn.click(); return true; }
      return false;
    }, panel);
    if (!ok) await p.evaluate((panel) => { document.querySelectorAll('.ea-panel').forEach((x) => { x.hidden = x.id !== 'ea-' + panel; }); }, panel);
    await p.waitForTimeout(500);
  };
  await ouvrir('veille'); await pleine('veille', 2600);
  await ouvrir('ecrire'); await pleine('ecrire', 2400);
  await ouvrir('lettre'); await pleine('lettre', 1800);
  await ouvrir('publier'); await pleine('publier', 3200);
  await b.close();
  console.log(K, 'ok', errs.length ? 'ERREURS ' + errs.join(' | ') : 'aucune erreur');
})();
