// Espace adhérent : la poignée de main s'anime à l'ouverture et à la connexion, les mains restent jointes, puis tout s'arrête.
// Copie mise à jour le 8 novembre 2026 pour le second réglage (4 secousses de 10° en 2 s) : « mains jointes » veut dire
// que le bout de chaque bras serré reste dans l'ellipse des mains serrées (avant : moins de 6 unités du centre, seuil
// fait pour les 7° de l'ancien réglage) ; attente finale portée de 600 à 900 ms (l'animation finit 2,35 s après
// l'ouverture au lieu de 1,75 s).
// usage : node check_poignee.js <url> <polices> <dossier captures>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, OUT] = process.argv;
const ok = (c, m) => console.log((c ? 'OK   ' : 'ÉCHEC ') + m);
const probe = () => {
  const svg = document.querySelector('.view[data-view="espace"] .mascotte-accueil');
  const pt = (el, x, y) => { const m = el.getScreenCTM(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };
  const arms = [...svg.querySelectorAll('.bras-poignee path')].map((p) => { const l = p.getTotalLength(); const q = p.getPointAtLength(l); return pt(p, q.x, q.y); });
  const e = svg.querySelector('.poignee ellipse'); const c = pt(e, +e.getAttribute('cx'), +e.getAttribute('cy'));
  const head = svg.querySelector('circle[r="35"]').getBoundingClientRect().height / 70; // px par unité du dessin
  const gap = Math.max(...arms.map((a) => Math.hypot(a[0] - c[0], a[1] - c[1]))) / head;
  /* bout de chaque bras dans le repère de l'ellipse des mains serrées : (dx/rx)² + (dy/ry)², moins de 1 = dans les mains */
  const inv = e.getScreenCTM().inverse(); const rx = +e.getAttribute('rx'); const ry = +e.getAttribute('ry');
  const inEll = Math.max(...arms.map((a) => { const x = inv.a * a[0] + inv.c * a[1] + inv.e - +e.getAttribute('cx'); const y = inv.b * a[0] + inv.d * a[1] + inv.f - +e.getAttribute('cy'); return (x / rx) ** 2 + (y / ry) ** 2; }));
  const tr = svg.querySelector('.bras-poignee').getAttribute('transform') || '';
  const a = tr ? Math.abs(parseFloat(tr.slice(7))) : 0;
  return { a, gap, inEll, tr };
};
(async () => {
  const b = await chromium.launch();
  for (const [w, rm] of [[1280, 'no-preference'], [390, 'no-preference'], [1280, 'reduce']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: rm });
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    const tag = w + (rm === 'reduce' ? ' animations réduites' : '');
    await p.goto(URL_ + '#accueil'); await p.waitForTimeout(400);
    await p.evaluate(() => { location.hash = '#espace'; });
    let maxA = 0; let maxGap = 0; let maxIn = 0; let shot = false;
    for (let t = 0; t < 2000; t += 100) {
      await p.waitForTimeout(100);
      const s = await p.evaluate(probe); maxA = Math.max(maxA, s.a); maxGap = Math.max(maxGap, s.gap); maxIn = Math.max(maxIn, s.inEll);
      if (!shot && s.a > 4 && w === 1280) { await p.locator('.view[data-view="espace"] .page-hero').screenshot({ path: path.join(OUT, 'poignee-en-mouvement.png') }); shot = true; }
    }
    await p.waitForTimeout(900);
    const end = await p.evaluate(probe);
    if (rm === 'reduce') ok(maxA === 0 && end.tr === '', tag + ' : rien ne bouge');
    else {
      ok(maxA > 3, tag + ' : à l’ouverture, les mains se serrent (jusqu’à ' + maxA.toFixed(1) + '°)');
      ok(maxIn < 1, tag + ' : les mains restent jointes : le bout des bras reste dans les mains serrées (écart maximal ' + maxGap.toFixed(1) + ' unités du dessin pour une demi-largeur de 8 ; ' + maxIn.toFixed(2) + ' dans l’ellipse, moins de 1)');
      ok(end.a === 0, tag + ' : puis tout s’arrête (' + end.tr + ')');
      await p.fill('#login-email', 'demo@laboratoire.fr'); await p.fill('#login-pass', 'x'); await p.click('#login-form button[type=submit]');
      let again = 0; for (let t = 0; t < 1500; t += 100) { await p.waitForTimeout(100); again = Math.max(again, (await p.evaluate(probe)).a); }
      ok(again > 3, tag + ' : la poignée de main se rejoue à la connexion');
    }
    ok(errs.length === 0, tag + ' : aucune erreur ' + errs.join(' | '));
    await ctx.close();
  }
  await b.close();
})();
