// Poignée de main du duo (demande d'Isabelle Eimer du 8 novembre 2026) : le duo qui se serre la main ne bascule plus au
// défilement (les autres mascottes, si) ; c'est la poignée de main qui bouge, à l'accueil (bannière « Rejoindre le SLBC »,
// svg.mascotte-adhesion) comme dans l'espace adhérent (svg.mascotte-accueil). Réglage vérifié (8 novembre 2026, second
// réglage) : 4 secousses de 10° en 2 s, salut de +6° (vers la tête) à −14° (vers l'extérieur), puis tout revient à zéro ;
// elle part 300 ms après que le duo est visible à 95 % entre le haut de l'écran et le haut du bandeau des cookies, une
// fois, et ne se rejoue que s'il est sorti complètement de l'écran ; pas de doublon dans les 2 s (ouverture de l'espace
// adhérent, connexion) ; rien en animations réduites.
//  1. Accueil, bandeau des cookies déjà répondu : 1280 px, 390 px (iPhone 13), 768 px (iPad Mini) ; animations réduites
//     à 1280 et 390 px.
//  2. Accueil, bandeau des cookies affiché (première visite) : 1280, 390 et 768 px.
//  3. Espace adhérent : 1280 et 390 px (ouverture, connexion, retour après sortie complète, réouverture) ; animations
//     réduites à 390 px (1280 px : check_poignee.js).
// En plus, retour par le haut de l'écran : la poignée de main ne doit pas partir pendant que le duo est caché sous
// l'en-tête collant (contrôle « en-tête »).
// usage : node check_poignee_accueil.js <url> <polices> <dossier captures>
// Le test règle lui-même le bandeau des cookies (répondu ou non) : il marche avec ou sans preload-cookies.js.
const { chromium, devices } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, OUT] = process.argv;
if (!URL_ || !FONTDIR || !OUT) { console.log('usage : node check_poignee_accueil.js <url> <polices> <dossier captures>'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
let nOk = 0; let echecs = 0;
const ok = (c, m) => { if (c) nOk++; else echecs++; console.log((c ? 'OK   ' : 'ÉCHEC ') + m); };
const SEL = { accueil: '.view[data-view="accueil"] svg.mascotte-adhesion', espace: '.view[data-view="espace"] svg.mascotte-accueil' };
const r0 = (x) => Math.round(x);
const pc = (x) => Math.round(x * 100) + ' %';

/* Avant les scripts de la page : journal de chaque transformation posée sur le premier bras serré, le premier bras qui
   salue et les premières mains de chaque duo (une ligne par image), de chaque appel de la poignée de main (shakeHands()
   note l'heure dans svg._lastShake : on l'intercepte), et des événements utiles (hashchange, resize, envoi, clic sur
   « Tout refuser / Tout accepter »). */
function journal() {
  window.__SET = []; window.__CALLS = []; window.__EVT = [];
  const ou = (svg) => (svg.classList.contains('mascotte-adhesion') ? 'accueil' : 'espace');
  const KINDS = ['bras-poignee', 'bras-salut', 'poignee'];
  const orig = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (n, v) {
    if (n === 'transform' && this.classList) {
      const k = KINDS.find((c) => this.classList.contains(c));
      const svg = k && this.ownerSVGElement;
      if (svg && svg.querySelector('.' + k) === this) window.__SET.push([performance.now(), ou(svg), k, String(v)]);
    }
    return orig.call(this, n, v);
  };
  Object.defineProperty(SVGSVGElement.prototype, '_lastShake', { configurable: true, get() { return this.__ls; }, set(v) { this.__ls = v; window.__CALLS.push([performance.now(), ou(this)]); } });
  window.addEventListener('resize', () => window.__EVT.push([performance.now(), 'resize']));
  window.addEventListener('hashchange', () => window.__EVT.push([performance.now(), 'hashchange']), true);
  document.addEventListener('submit', () => window.__EVT.push([performance.now(), 'submit']), true);
  document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('[data-cookies-tout]')) window.__EVT.push([performance.now(), 'cookies']); }, true);
}
/* Bandeau des cookies déjà répondu (refus), ou bien affiché comme à la première visite (même si preload-cookies.js a
   répondu d'avance : la réponse est effacée au premier chargement de l'onglet). */
function repondu() { try { if (!localStorage.getItem('slbc-maquette-cookies')) localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) { /* sans stockage */ } }
function sansReponse() { try { if (!sessionStorage.getItem('test-bandeau-cookies')) { sessionStorage.setItem('test-bandeau-cookies', '1'); localStorage.removeItem('slbc-maquette-cookies'); } } catch (e) { /* sans stockage */ } }

/* Dans la page : relevé à chaque image. vu : part du duo visible entre le haut de l'écran et le haut du bandeau des
   cookies (la règle du site) ; vuReel : la même, mais sous l'en-tête collant ; transformations calculées du duo et de
   ses parents, élan, transformations des groupes du dessin et du contour, position des mains, écart entre bras et mains. */
function releve(sel) {
  const d = document.querySelector(sel);
  const out = d.querySelector('g[stroke="#FFFFFF"]');
  const inOut = (g) => !!out && out.contains(g);
  const gs = [...d.querySelectorAll('.bras-poignee,.poignee,.bras-salut')];
  const gO = gs.filter(inOut); const gD = gs.filter((g) => !inOut(g));
  const pO = gO.find((g) => g.classList.contains('poignee')); const pD = gD.find((g) => g.classList.contains('poignee'));
  const pt = (el, x, y) => { const m = el.getScreenCTM(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; };
  /* Bout de chaque bras serré, ramené dans le repère des mains serrées (l'ellipse, translation comprise) : distance au
     centre en unités du dessin, et position dans l'ellipse ((dx/rx)² + (dy/ry)², moins de 1 : le bout du bras est dans
     les mains). */
  const ecart = (grs) => {
    const p = grs.find((g) => g.classList.contains('poignee')); if (!p) return [0, 0];
    const e = p.querySelector('ellipse'); const cx = +e.getAttribute('cx'); const cy = +e.getAttribute('cy'); const rx = +e.getAttribute('rx'); const ry = +e.getAttribute('ry');
    const inv = e.getScreenCTM().inverse();
    let m = 0; let n = 0;
    grs.filter((g) => g.classList.contains('bras-poignee')).forEach((g) => g.querySelectorAll('path').forEach((pa) => {
      const q = pa.getPointAtLength(pa.getTotalLength()); const a = pt(pa, q.x, q.y);
      const x = inv.a * a[0] + inv.c * a[1] + inv.e - cx; const y = inv.b * a[0] + inv.d * a[1] + inv.f - cy;
      m = Math.max(m, Math.hypot(x, y)); n = Math.max(n, (x / rx) ** 2 + (y / ry) ** 2);
    }));
    return [m, n];
  };
  const ident = (t) => !t || t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)';
  const mag = (s) => { const n = (s.match(/-?\d+(?:\.\d+)?/g) || []).map(Number); return s.startsWith('rotate') ? Math.abs(n[0]) : s.startsWith('translate') ? Math.abs(n[1] || 0) : 0; };
  const S = window.__S = { rec: [], on: true };
  const loop = () => {
    if (!S.on) return;
    const t = performance.now();
    if (!d.getClientRects().length) { S.rec.push({ t, cache: true, own: getComputedStyle(d).transform, anc: '', sway: d.style.getPropertyValue('--sway'), magD: 0, magO: 0, sync: true, vu: 0, vuReel: 0, autres: 0 }); requestAnimationFrame(loop); return; }
    const r = d.getBoundingClientRect(); const vh = innerHeight;
    const bas = vh - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bandeau-h')) || 0);
    const haut = document.querySelector('.gnav').getBoundingClientRect().bottom;
    const vu = Math.max(0, Math.min(r.bottom, bas) - Math.max(r.top, 0)) / (r.height || 1);
    const vuReel = Math.max(0, Math.min(r.bottom, bas) - Math.max(r.top, haut)) / (r.height || 1);
    let anc = ''; for (let e = d.parentElement; e && e !== document.documentElement; e = e.parentElement) { const tr = getComputedStyle(e).transform; if (!ident(tr)) { anc = (e.getAttribute('class') || e.tagName) + ' : ' + tr; break; } }
    const trO = gO.map((g) => g.getAttribute('transform') || ''); const trD = gD.map((g) => g.getAttribute('transform') || '');
    const autres = [...document.querySelectorAll('.view:not([hidden]) svg.mascotte:not(.mascotte-adhesion):not(.mascotte-accueil)')].filter((s) => !ident(getComputedStyle(s).transform)).length;
    S.rec.push({
      t, y: scrollY, vu, vuReel, own: getComputedStyle(d).transform, anc, sway: d.style.getPropertyValue('--sway'),
      magD: Math.max(0, ...trD.map(mag)), magO: Math.max(0, ...trO.map(mag)), sync: trO.join('|') === trD.join('|'),
      autres, yO: pO ? pO.getBoundingClientRect().top - r.top : 0, yD: pD ? pD.getBoundingClientRect().top - r.top : 0,
      ...(() => { const a = ecart(gD); const b = ecart(gO); return { gapD: a[0], inD: a[1], gapO: b[0], inO: b[1] }; })(),
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

/* Poignées de main jouées : suites d'images (bras serré) sans interruption de plus de 120 ms. */
function episodes(set, ou, t0, t1) {
  const L = set.filter((s) => s[1] === ou && s[2] === 'bras-poignee' && s[0] >= t0 && (t1 === undefined || s[0] < t1));
  const eps = [];
  L.forEach((s) => { const e = eps[eps.length - 1]; if (e && s[0] - e.fin < 120) { e.fin = s[0]; e.vals.push(s[3]); } else eps.push({ debut: s[0], fin: s[0], vals: [s[3]] }); });
  eps.forEach((e) => { e.duree = e.fin - e.debut; e.dernier = e.vals[e.vals.length - 1]; });
  return eps;
}
/* Mesures d'une poignée de main : secousses (passages au-dessus de +0,5° puis au-dessous de −0,5°), amplitude, salut,
   retour à zéro des trois groupes, contour collé au dessin. */
function mesureEp(D, ou, e) {
  const A = e.vals.map((v) => parseFloat(v.slice(7)));
  let up = 0; let down = 0; let s = 0;
  A.forEach((a) => { const g = a > 0.5 ? 1 : a < -0.5 ? -1 : 0; if (g && g !== s) { if (g > 0) up++; else down++; s = g; } });
  const de = (k) => D.set.filter((x) => x[1] === ou && x[2] === k && x[0] >= e.debut - 1 && x[0] <= e.fin + 1).map((x) => x[3]);
  const sal = de('bras-salut'); const cl = de('poignee');
  const W = sal.map((v) => parseFloat(v.slice(7)));
  const fin = [e.dernier, sal[sal.length - 1] || '?', cl[cl.length - 1] || '?'];
  const zero = fin[0] === 'rotate(0.00 106 117)' && fin[1] === 'rotate(0.00 80 116)' && fin[2] === 'translate(0 0.00)';
  const pend = D.rec.filter((r) => !r.cache && r.t >= e.debut && r.t <= e.fin + 50);
  const rg = (a) => (a.length ? Math.max(...a) - Math.min(...a) : 0);
  return {
    up, down, max: Math.max(...A.map(Math.abs)), wMax: W.length ? Math.max(...W) : 0, wMin: W.length ? Math.min(...W) : 0, zero, fin: fin.join(' ; '),
    n: pend.length, sync: pend.length > 0 && pend.every((r) => r.sync), mvD: rg(pend.map((r) => r.yD)), mvO: rg(pend.map((r) => r.yO)),
    dif: rg(pend.map((r) => r.yO - r.yD)), gD: Math.max(0, ...pend.map((r) => r.gapD)), gO: Math.max(0, ...pend.map((r) => r.gapO)),
    inD: Math.max(0, ...pend.map((r) => r.inD)), inO: Math.max(0, ...pend.map((r) => r.inO)),
    vuReelDebut: (pend[0] || {}).vuReel,
  };
}
/* Une poignée de main attendue entre tA et tB, déclenchée à ref (image où le duo atteint 95 %, événement…). */
function une(tag, quoi, D, ou, tA, tB, ref, refNom, dMin, dMax, opt = {}) {
  const cs = D.calls.filter((c) => c[1] === ou && c[0] >= tA && c[0] < tB);
  const es = episodes(D.set, ou, tA, tB);
  const e = es[0];
  if (!opt.detail) {
    if (!e || cs.length !== 1 || es.length !== 1 || ref === undefined) { ok(false, tag + ' : ' + quoi + ' : une poignée de main (' + cs.length + ' appel(s), ' + es.length + ' animation(s)' + (ref === undefined ? ', moment de départ introuvable' : '') + ')'); return e; }
    const m = mesureEp(D, ou, e); const dt = e.debut - ref;
    const bon = dt >= dMin && dt <= dMax && e.duree >= 1950 && e.duree <= 2150 && m.up === 4 && m.down === 4 && m.max > 9 && m.max <= 10.01 && m.zero && m.sync && m.dif < 0.6 && m.inD < 1 && m.inO < 1;
    ok(bon, tag + ' : ' + quoi + ' : une poignée de main, ' + r0(dt) + ' ms après ' + refNom + ', ' + r0(e.duree) + ' ms, ' + m.up + ' secousses de ' + m.max.toFixed(1) + '°, ' + (m.zero ? 'revenue à zéro' : 'NON revenue à zéro (' + m.fin + ')') + ', contour ' + (m.sync ? 'synchrone' : 'NON synchrone') + ' et collé (' + m.dif.toFixed(2) + ' px), mains ' + (m.inD < 1 && m.inO < 1 ? 'jointes' : 'NON jointes') + ' (' + m.inD.toFixed(2) + ')');
    return e;
  }
  ok(cs.length === 1 && es.length === 1, tag + ' : ' + quoi + ' : une seule poignée de main (' + cs.length + ' appel(s), ' + es.length + ' animation(s))');
  if (!e || ref === undefined) { ok(false, tag + ' : ' + quoi + ' : rien à mesurer'); return e; }
  const m = mesureEp(D, ou, e); const dt = e.debut - ref;
  if (opt.decision) ok(cs[0] && cs[0][0] - ref >= -20 && cs[0][0] - ref <= 40, tag + ' : ' + quoi + ' : décidée à l’image où le duo atteint 95 % (' + (cs[0] ? r0(cs[0][0] - ref) : '?') + ' ms)');
  ok(dt >= dMin && dt <= dMax, tag + ' : ' + quoi + ' : elle commence ' + r0(dt) + ' ms après ' + refNom);
  ok(e.duree >= 1950 && e.duree <= 2150, tag + ' : ' + quoi + ' : elle dure ' + r0(e.duree) + ' ms');
  ok(m.up === 4 && m.down === 4 && m.max > 9 && m.max <= 10.01, tag + ' : ' + quoi + ' : ' + m.up + ' secousses vers le haut, ' + m.down + ' vers le bas, jusqu’à ' + m.max.toFixed(2) + '°');
  ok(m.wMax <= 0.01 && m.wMin >= -14.01 && m.wMin < -12.5, tag + ' : ' + quoi + ' : le salut ne va que vers l’extérieur (de ' + m.wMin.toFixed(2) + '° à +' + m.wMax.toFixed(2) + '°), le trait ne touche pas la tête');
  ok(m.zero, tag + ' : ' + quoi + ' : puis tout revient à zéro (' + m.fin + ')');
  ok(m.n > 60 && m.sync, tag + ' : ' + quoi + ' : le contour blanc reçoit les mêmes transformations que le dessin, à chaque image (' + m.n + ' images)');
  ok(m.mvD > 2 && m.mvO > 2, tag + ' : ' + quoi + ' : les mains bougent vraiment à l’écran (dessin ' + m.mvD.toFixed(1) + ' px, contour ' + m.mvO.toFixed(1) + ' px)');
  ok(m.dif < 0.6, tag + ' : ' + quoi + ' : le contour reste collé à la main (écart qui varie de ' + m.dif.toFixed(2) + ' px)');
  ok(m.inD < 1 && m.inO < 1, tag + ' : ' + quoi + ' : les mains restent jointes : le bout des bras reste dans les mains serrées (au plus ' + m.gD.toFixed(1) + ' unités du centre pour une demi-largeur de 8 ; ' + m.inD.toFixed(2) + ' dans l’ellipse, contour ' + m.inO.toFixed(2) + ', moins de 1)');
  const apres = D.rec.filter((r) => !r.cache && r.t > e.fin + 100 && r.t < tB);
  ok(apres.length > 0 && apres.every((r) => r.magD === 0 && r.magO === 0), tag + ' : ' + quoi + ' : ensuite plus rien ne bouge (' + apres.length + ' images)');
  return e;
}
const rien = (D, ou, tA, tB) => ({ c: D.calls.filter((c) => c[1] === ou && c[0] >= tA && c[0] < tB).length, s: D.set.filter((x) => x[1] === ou && x[0] >= tA && x[0] < tB).length });
const t95 = (D, tA, tB) => (D.rec.find((r) => !r.cache && r.t >= tA && r.t < tB && r.vu >= 0.95) || {}).t;
const evt = (D, nom, tA) => (D.evt.find((e) => e[1] === nom && e[0] >= tA) || [])[0];

/* Outils de la page */
const now = (p) => p.evaluate(() => performance.now());
async function vite(p, to, step = 140) {
  const from = await p.evaluate(() => scrollY);
  const n = Math.max(1, Math.ceil(Math.abs(to - from) / step));
  for (let i = 1; i <= n; i++) { await p.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), Math.round(from + (to - from) * i / n)); await p.waitForTimeout(16); }
}
/* Mesure du duo : vu (règle du site), vuReel (sous l'en-tête), entièrement dans l'écran, part cachée sous l'en-tête. */
const mesure = (p, ou) => p.evaluate((sel) => {
  const d = document.querySelector(sel); const r = d.getBoundingClientRect(); const vh = innerHeight;
  const bh = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bandeau-h')) || 0; const bas = vh - bh;
  const haut = document.querySelector('.gnav').getBoundingClientRect().bottom;
  return {
    y: scrollY, top: r.top, bottom: r.bottom, h: r.height, bh, haut,
    vu: Math.max(0, Math.min(r.bottom, bas) - Math.max(r.top, 0)) / r.height,
    vuReel: Math.max(0, Math.min(r.bottom, bas) - Math.max(r.top, haut)) / r.height,
    ecran: r.top >= 0 && r.bottom <= vh, sousEntete: Math.max(0, Math.min(r.bottom, haut) - Math.max(r.top, 0)) / r.height,
    ecranVu: Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0)) / r.height,
  };
}, SEL[ou]);
/* Défilement qui place le duo. centre : au milieu de la zone libre (entre l'en-tête et le bandeau) ; bas : la part f du
   duo au-dessus du bandeau (ou du bas de l'écran) ; sous / dessus : entièrement hors de l'écran ; haut : haut du duo à
   f px du haut de l'écran. */
const cible = (p, ou, mode, f) => p.evaluate(([sel, mode, f]) => {
  const d = document.querySelector(sel); const r = d.getBoundingClientRect(); const top = r.top + scrollY; const h = r.height; const vh = innerHeight;
  const bas = vh - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bandeau-h')) || 0);
  const haut = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
  let y;
  if (mode === 'centre') y = top + h / 2 - (haut + bas) / 2;
  else if (mode === 'bas') y = top - bas + f * h;
  else if (mode === 'sous') y = top - vh - 0.3 * h - 20;
  else if (mode === 'dessus') y = top + 1.3 * h + 20;
  else y = top - f;
  const max = document.documentElement.scrollHeight - vh;
  return { y: Math.max(0, Math.min(Math.round(y), max)), faisable: y >= 0 && y <= max };
}, [SEL[ou], mode, f]);
async function aller(p, ou, mode, f) { const c = await cible(p, ou, mode, f); await vite(p, c.y); await p.waitForTimeout(30); return { ...(await mesure(p, ou)), faisable: c.faisable }; }
async function donnees(p) { return p.evaluate(() => { window.__S.on = false; return { rec: window.__S.rec, set: window.__SET, calls: window.__CALLS, evt: window.__EVT }; }); }

async function contexte(b, opts, rm, bandeau) {
  const ctx = await b.newContext({ ...opts, reducedMotion: rm });
  await ctx.addInitScript(bandeau ? sansReponse : repondu);
  await ctx.addInitScript(journal);
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  return { ctx, p, errs };
}
/* Le duo ne bascule jamais, aucun bloc autour de lui ne bouge (hors entrée de page), les autres mascottes basculent. */
function bascule(tag, D, tA, tB, reduit, sansAnc) {
  const vis = D.rec.filter((r) => !r.cache);
  const tilt = vis.filter((r) => r.own !== 'none' && r.own !== 'matrix(1, 0, 0, 1, 0, 0)');
  const sway = D.rec.filter((r) => r.sway);
  ok(vis.length > 100 && tilt.length === 0 && sway.length === 0, tag + ' : le duo ne bascule jamais (' + vis.length + ' images relevées, transformation calculée ' + (tilt[0] ? tilt[0].own : 'aucune') + ', élan ' + (sway[0] ? sway[0].sway : 'aucun') + ')');
  const anc = vis.filter((r) => r.anc && !(sansAnc || []).some(([a, z]) => r.t >= a && r.t < z));
  ok(anc.length === 0, tag + ' : aucun bloc autour du duo ne bouge' + (anc[0] ? ' (' + anc[0].anc + ')' : ''));
  if (tA === undefined) return;
  const autres = Math.max(0, ...D.rec.filter((r) => r.t >= tA && r.t < tB).map((r) => r.autres));
  if (!reduit) ok(autres > 0, tag + ' : pendant le défilement, les autres mascottes basculent toujours (' + autres + ' à la fois au plus)');
  else ok(autres === 0, tag + ' : aucune autre mascotte ne bascule non plus');
}

/* 1. Accueil, bandeau des cookies déjà répondu */
async function accueil(b, tag, opts, rm, nom) {
  const { ctx, p, errs } = await contexte(b, opts, rm, false);
  const reduit = rm === 'reduce';
  await p.goto(URL_ + '#accueil'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2600);
  const dessin = await p.evaluate((sel) => { const d = document.querySelector(sel); const out = d.querySelector('g[stroke="#FFFFFF"]'); const all = [...d.querySelectorAll('.bras-poignee,.poignee,.bras-salut')]; return { o: all.filter((g) => out.contains(g)).length, d: all.filter((g) => !out.contains(g)).length, life: document.documentElement.classList.contains('js-life'), bar: !document.getElementById('cookie-bar').hidden }; }, SEL.accueil);
  ok(!dessin.bar, tag + ' : bandeau des cookies déjà répondu');
  if (!reduit) ok(dessin.o === 4 && dessin.d === 4, tag + ' : bras, bras qui salue et mains animables dans le dessin (' + dessin.d + ') et dans le contour blanc (' + dessin.o + ')');
  await p.evaluate(releve, SEL.accueil);
  const T = {};
  // 1. Défilement rapide du haut de la page jusqu'au duo
  T.a = await now(p);
  await aller(p, 'accueil', 'centre');
  await p.waitForTimeout(3200);
  T.b = await now(p);
  // 2. Sortie complète par le bas, puis retour
  const mSous = await aller(p, 'accueil', 'sous'); await p.waitForTimeout(700);
  T.c = await now(p);
  await aller(p, 'accueil', 'centre'); await p.waitForTimeout(2600);
  T.d = await now(p);
  // 3. Sortie complète, arrêt juste sous le seuil (92 %), puis juste au-dessus (97 %)
  await aller(p, 'accueil', 'sous'); await p.waitForTimeout(700);
  T.e = await now(p);
  const m92 = await aller(p, 'accueil', 'bas', 0.92); await p.waitForTimeout(2500);
  T.f = await now(p);
  const m97 = await aller(p, 'accueil', 'bas', 0.97); await p.waitForTimeout(2600);
  T.g = await now(p);
  // 4. Sortie partielle (le duo reste un peu visible), puis retour : pas de nouvelle poignée de main
  const m30 = await aller(p, 'accueil', 'bas', 0.3); await p.waitForTimeout(700);
  await aller(p, 'accueil', 'centre'); await p.waitForTimeout(2200);
  T.h = await now(p);
  // 5. Changement de taille (ordinateur) : le duo devient visible parce que la fenêtre s'agrandit
  let m80 = null; let mRz = null;
  if (!reduit && opts.viewport.width === 1280) {
    await aller(p, 'accueil', 'sous'); await p.waitForTimeout(700);
    T.i = await now(p);
    m80 = await aller(p, 'accueil', 'bas', 0.8); await p.waitForTimeout(1500);
    T.j = await now(p);
    await p.setViewportSize({ width: 1280, height: opts.viewport.height + 120 }); await p.waitForTimeout(2600);
    mRz = await mesure(p, 'accueil');
    T.k = await now(p);
    await p.setViewportSize(opts.viewport); await p.waitForTimeout(400);
  }
  // 6. Retour par le haut de l'écran (là où le duo peut en sortir par le haut)
  let haut = null;
  if (!reduit) {
    const mDessus = await aller(p, 'accueil', 'dessus'); await p.waitForTimeout(700);
    if (mDessus.ecranVu === 0) {
      haut = { mDessus };
      T.l = await now(p);
      await aller(p, 'accueil', 'centre'); await p.waitForTimeout(2600);
      T.m = await now(p);
      haut.mDessus2 = await aller(p, 'accueil', 'dessus'); await p.waitForTimeout(700);
      T.n = await now(p);
      haut.mHaut = await aller(p, 'accueil', 'haut', 2); await p.waitForTimeout(300 + 500);
      await p.screenshot({ path: path.join(OUT, 'accueil-' + nom + '-sous-entete.png') });
      await p.waitForTimeout(1800);
      T.o = await now(p);
      await aller(p, 'accueil', 'centre'); await p.waitForTimeout(2600);
      T.q = await now(p);
    }
  }
  const D = await donnees(p);
  // Captures (après les mesures, pour ne pas fausser les temps)
  if (!reduit) {
    await aller(p, 'accueil', 'sous'); await p.waitForTimeout(700); await aller(p, 'accueil', 'centre');
    await p.waitForTimeout(300 + 380); await p.locator(SEL.accueil).screenshot({ path: path.join(OUT, 'accueil-' + nom + '-poignee.png') });
    await p.waitForTimeout(2000); await p.locator(SEL.accueil).screenshot({ path: path.join(OUT, 'accueil-' + nom + '-repos.png') });
  }

  bascule(tag, D, T.a, T.b, reduit);
  if (reduit) {
    const r = rien(D, 'accueil', 0, Infinity);
    const moved = D.rec.filter((x) => x.magD > 0 || x.magO > 0);
    ok(r.c === 0 && r.s === 0 && moved.length === 0 && !dessin.life, tag + ' : la poignée de main ne se joue jamais (' + r.c + ' appel(s), ' + r.s + ' transformation(s) posée(s))');
    ok(mSous.ecranVu === 0, tag + ' : (le duo est bien sorti de l’écran puis revenu)');
    ok(errs.length === 0, tag + ' : aucune erreur ' + errs.join(' | '));
    await ctx.close(); return;
  }
  // Point 1 : rien avant 95 %, puis une seule poignée de main, détaillée
  const s1 = t95(D, T.a, T.b);
  const av = rien(D, 'accueil', T.a, s1 || T.b);
  const vuMaxAv = Math.max(0, ...D.rec.filter((r) => !r.cache && r.t >= T.a && r.t < (s1 || T.b)).map((r) => r.vu));
  ok(s1 !== undefined && av.c === 0 && av.s === 0, tag + ' : en arrivant au duo, rien ne joue tant qu’il n’est pas visible à 95 % (' + av.c + ' appel(s), ' + av.s + ' transformation(s) ; jusqu’à ' + pc(vuMaxAv) + ' visible avant)');
  une(tag, 'arrivée au duo', D, 'accueil', T.a, T.b, s1, 'l’image où il est visible à 95 %', 290, 400, { detail: true, decision: true });
  // Point 2 : sortie complète puis retour
  ok(mSous.ecranVu === 0, tag + ' : le duo est bien sorti de l’écran par le bas (visible à ' + pc(mSous.ecranVu) + ')');
  const so = rien(D, 'accueil', T.b, T.c);
  ok(so.c === 0 && so.s === 0, tag + ' : rien ne joue en sortant (' + so.c + ' appel(s))');
  une(tag, 'retour après sortie par le bas', D, 'accueil', T.c, T.d, t95(D, T.c, T.d), 'l’image où il est visible à 95 %', 290, 400);
  // Point 3 : seuil de 95 %
  const vuMax92 = Math.max(0, ...D.rec.filter((r) => !r.cache && r.t >= T.e && r.t < T.f).map((r) => r.vu));
  const r92 = rien(D, 'accueil', T.e, T.f);
  ok(vuMax92 < 0.95 && vuMax92 > 0.85 && r92.c === 0 && r92.s === 0, tag + ' : arrêté à ' + pc(m92.vu) + ' visible (au plus ' + (vuMax92 * 100).toFixed(1) + ' %), pendant 2,5 s : rien ne joue (' + r92.c + ' appel(s))');
  ok(m97.vu >= 0.95, tag + ' : (puis le duo est visible à ' + (m97.vu * 100).toFixed(1) + ' %)');
  une(tag, 'passage de ' + pc(m92.vu) + ' à ' + pc(m97.vu), D, 'accueil', T.f, T.g, t95(D, T.f, T.g), 'l’image où il passe 95 %', 290, 400);
  // Point 4 : sortie partielle
  const r30 = rien(D, 'accueil', T.g, T.h);
  ok(m30.ecranVu > 0 && r30.c === 0 && r30.s === 0, tag + ' : sortie partielle (encore visible à ' + pc(m30.ecranVu) + ') puis retour : pas de nouvelle poignée de main (' + r30.c + ' appel(s))');
  // Point 5 : changement de taille
  if (m80) {
    const r80 = rien(D, 'accueil', T.i, T.j);
    ok(m80.vu < 0.95 && r80.c === 0, tag + ' : fenêtre de ' + opts.viewport.height + ' px, duo visible à ' + pc(m80.vu) + ' : rien ne joue (' + r80.c + ' appel(s))');
    ok(mRz.vu >= 0.95, tag + ' : (fenêtre agrandie à ' + (opts.viewport.height + 120) + ' px : duo visible à ' + pc(mRz.vu) + ')');
    const rz = evt(D, 'resize', T.j);
    une(tag, 'fenêtre agrandie', D, 'accueil', T.j, T.k, rz, 'le changement de taille', 290, 420);
  }
  // Point 6 : retour par le haut
  if (haut) {
    ok(haut.mDessus.ecranVu === 0, tag + ' : le duo est bien sorti de l’écran par le haut');
    const e6 = une(tag, 'retour après sortie par le haut', D, 'accueil', T.l, T.m, t95(D, T.l, T.m), 'l’image où il est visible à 95 %', 290, 400);
    if (e6) { const m = mesureEp(D, 'accueil', e6); ok(m.vuReelDebut >= 0.95, tag + ' : au départ de cette poignée de main, le duo est dégagé de l’en-tête (visible à ' + pc(m.vuReelDebut || 0) + ' sous l’en-tête)'); }
    const sousE = rien(D, 'accueil', T.n, T.o); const apresE = rien(D, 'accueil', T.o, T.q);
    ok(sousE.c === 0 && apresE.c === 1, tag + ' : en-tête : arrêté par le haut avec ' + pc(haut.mHaut.sousEntete) + ' du duo caché sous l’en-tête collant (' + pc(haut.mHaut.vu) + ' visible selon la règle du site), la poignée de main attend qu’il soit dégagé (' + sousE.c + ' appel(s) sous l’en-tête, ' + apresE.c + ' une fois dégagé)');
  } else console.log('     ' + tag + ' : le duo ne peut pas sortir de l’écran par le haut (fin de page) : retour par le haut non testé');
  ok(errs.length === 0, tag + ' : aucune erreur ' + errs.join(' | '));
  await ctx.close();
}

/* 2. Accueil, bandeau des cookies affiché */
async function accueilBandeau(b, tag, opts, nom) {
  const { ctx, p, errs } = await contexte(b, opts, 'no-preference', true);
  await p.goto(URL_ + '#accueil'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2600);
  const bar = await p.evaluate(() => { const b = document.getElementById('cookie-bar'); const r = b.getBoundingClientRect(); return { vis: !b.hidden && r.height > 0, top: r.top, vh: innerHeight, bh: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--bandeau-h')) || 0 }; });
  ok(bar.vis && Math.abs(bar.vh - bar.top - bar.bh) <= 1, tag + ' : bandeau des cookies affiché, ' + r0(bar.bh) + ' px gardés en bas (--bandeau-h), haut du bandeau à ' + r0(bar.top) + ' px');
  await p.evaluate(releve, SEL.accueil);
  const T = {};
  T.a = await now(p);
  // 1. Le duo s'arrête sous le bandeau : entièrement dessous (si le bandeau est plus haut que le duo), à moitié, à 90 %
  const h = (await mesure(p, 'accueil')).h;
  const stops = (bar.bh >= h + 4 ? [0] : []).concat([0.5, 0.9]);
  const arrets = [];
  for (const f of stops) {
    const m = await aller(p, 'accueil', 'bas', f); const t0 = await now(p);
    if (f === stops[0]) await p.screenshot({ path: path.join(OUT, 'bandeau-' + nom + '-duo-dessous.png') });
    await p.waitForTimeout(1500); arrets.push({ f, m, t0, t1: await now(p) });
  }
  T.b = await now(p);
  // 2. Il remonte au-dessus du bandeau
  await aller(p, 'accueil', 'centre'); await p.waitForTimeout(3200);
  T.c = await now(p);
  // 3. Sortie complète, retour sous le bandeau (entièrement dans l'écran), puis « Tout refuser »
  const mSous = await aller(p, 'accueil', 'sous'); await p.waitForTimeout(700);
  T.d = await now(p);
  const mB = await aller(p, 'accueil', 'bas', stops[0]); await p.waitForTimeout(1500);
  T.e = await now(p);
  await p.click('#cookie-bar [data-cookies-tout="non"]'); await p.waitForTimeout(2600);
  const apres = await p.evaluate(() => ({ y: scrollY, cache: document.getElementById('cookie-bar').hidden, bh: getComputedStyle(document.documentElement).getPropertyValue('--bandeau-h').trim() }));
  T.f = await now(p);
  const D = await donnees(p);

  bascule(tag, D, T.a, T.c, false);
  arrets.forEach((a) => {
    const r = rien(D, 'accueil', a.t0, a.t1);
    const vuMax = Math.max(0, ...D.rec.filter((x) => !x.cache && x.t >= a.t0 && x.t < a.t1).map((x) => x.vu));
    ok(a.m.ecranVu > 0.999 && vuMax < 0.95 && r.c === 0 && r.s === 0, tag + ' : duo entièrement dans l’écran mais ' + (a.f === 0 ? 'entièrement' : pc(1 - a.m.vu)) + ' sous le bandeau (visible à ' + pc(a.m.vu) + ' au-dessus) : rien ne joue en 1,5 s (' + r.c + ' appel(s), ' + r.s + ' transformation(s))');
  });
  const avant = rien(D, 'accueil', T.a, T.b);
  ok(avant.c === 0, tag + ' : rien n’a joué pendant la descente jusque-là (' + avant.c + ' appel(s))');
  une(tag, 'il remonte au-dessus du bandeau', D, 'accueil', T.b, T.c, t95(D, T.b, T.c), 'l’image où il est visible à 95 % au-dessus du bandeau', 290, 400, { detail: true, decision: true });
  ok(mSous.ecranVu === 0, tag + ' : le duo est bien sorti de l’écran');
  const rB = rien(D, 'accueil', T.c, T.e);
  ok(mB.ecranVu > 0.999 && mB.vu < 0.95 && rB.c === 0, tag + ' : revenu sous le bandeau (entièrement dans l’écran, visible à ' + pc(mB.vu) + ' au-dessus) : rien ne joue (' + rB.c + ' appel(s))');
  ok(apres.cache && apres.bh === '0px' && Math.abs(apres.y - mB.y) < 1, tag + ' : « Tout refuser » ferme le bandeau sans faire défiler la page (--bandeau-h ' + apres.bh + ', défilement ' + r0(mB.y) + ' → ' + r0(apres.y) + ')');
  const ck = evt(D, 'cookies', T.e);
  const cs = D.calls.filter((c) => c[1] === 'accueil' && c[0] >= T.e);
  ok(ck !== undefined && cs[0] && cs[0][0] - ck >= 0 && cs[0][0] - ck < 80, tag + ' : la fermeture du bandeau la déclenche aussitôt (' + (cs[0] && ck ? r0(cs[0][0] - ck) : '?') + ' ms après le clic)');
  une(tag, 'bandeau fermé (« Tout refuser »)', D, 'accueil', T.e, T.f, ck, 'le clic', 290, 420);
  ok(errs.length === 0, tag + ' : aucune erreur ' + errs.join(' | '));
  await ctx.close();
}

/* 3. Espace adhérent */
async function espace(b, tag, opts, rm, nom) {
  const { ctx, p, errs } = await contexte(b, opts, rm, false);
  const reduit = rm === 'reduce';
  await p.goto(URL_ + '#accueil'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(2600);
  await p.evaluate(releve, SEL.espace);
  const T = {};
  // 1. Ouverture de l'espace adhérent
  T.a = await now(p);
  await p.evaluate(() => { location.hash = '#espace'; });
  await p.waitForTimeout(3200);
  const mO = await mesure(p, 'espace');
  T.b = await now(p);
  // 2. Connexion
  await p.fill('#login-email', 'demo@laboratoire.fr'); await p.fill('#login-pass', 'x');
  T.c = await now(p);
  await p.click('#login-form button[type=submit]'); await p.waitForTimeout(2800);
  T.d = await now(p);
  // 3. Sortie complète par le haut, puis retour en haut de page
  const mOut = await aller(p, 'espace', 'dessus'); await p.waitForTimeout(700);
  T.e = await now(p);
  await vite(p, 0); await p.waitForTimeout(2600);
  T.f = await now(p);
  // 4. Réouverture (accueil, puis espace adhérent)
  await p.evaluate(() => { location.hash = '#accueil'; }); await p.waitForTimeout(900);
  T.g = await now(p);
  await p.evaluate(() => { location.hash = '#espace'; }); await p.waitForTimeout(2800);
  T.h = await now(p);
  const D = await donnees(p);
  // Capture (après les mesures, pour ne pas fausser les temps)
  if (!reduit) {
    await p.evaluate(() => { location.hash = '#accueil'; }); await p.waitForTimeout(900);
    await p.evaluate(() => { location.hash = '#espace'; }); await p.waitForTimeout(350 + 380);
    await p.locator('.view[data-view="espace"] .page-hero').screenshot({ path: path.join(OUT, 'espace-' + nom + '-poignee.png') });
  }
  const entrees = D.evt.filter((e) => e[1] === 'hashchange').map((e) => [e[0], e[0] + 600]);
  bascule(tag, D, undefined, undefined, reduit, entrees);
  if (reduit) {
    const r = rien(D, 'espace', 0, Infinity);
    ok(r.c === 0 && r.s === 0, tag + ' : rien ne bouge à l’ouverture, à la connexion, au retour ni à la réouverture (' + r.c + ' appel(s), ' + r.s + ' transformation(s))');
    ok(errs.length === 0, tag + ' : aucune erreur ' + errs.join(' | '));
    await ctx.close(); return;
  }
  ok(mO.vu >= 0.95, tag + ' : à l’ouverture, le duo est entièrement visible (' + pc(mO.vu) + ')');
  une(tag, 'ouverture', D, 'espace', T.a, T.b, evt(D, 'hashchange', T.a), 'le changement de page', 340, 480, { detail: true });
  une(tag, 'connexion', D, 'espace', T.c, T.d, evt(D, 'submit', T.c), 'l’envoi du formulaire', 340, 480);
  ok(mOut.ecranVu === 0, tag + ' : le duo est bien sorti de l’écran par le haut (visible à ' + pc(mOut.ecranVu) + ')');
  const so = rien(D, 'espace', T.d, T.e);
  ok(so.c === 0, tag + ' : rien ne joue en sortant (' + so.c + ' appel(s))');
  const e3 = une(tag, 'retour en haut après sortie complète', D, 'espace', T.e, T.f, t95(D, T.e, T.f), 'l’image où il est visible à 95 %', 290, 400);
  if (e3) { const m = mesureEp(D, 'espace', e3); ok(m.vuReelDebut >= 0.95, tag + ' : au départ de cette poignée de main, le duo est dégagé de l’en-tête (' + pc(m.vuReelDebut || 0) + ')'); }
  const quitte = rien(D, 'espace', T.f, T.g);
  ok(quitte.c === 0, tag + ' : rien ne joue en quittant l’espace adhérent (' + quitte.c + ' appel(s))');
  une(tag, 'réouverture', D, 'espace', T.g, T.h, evt(D, 'hashchange', T.g), 'le changement de page', 340, 480);
  ok(errs.length === 0, tag + ' : aucune erreur ' + errs.join(' | '));
  await ctx.close();
}

(async () => {
  const b = await chromium.launch();
  const ord = { viewport: { width: 1280, height: 800 } };
  const tel = { ...devices['iPhone 13'] };
  const tab = { ...devices['iPad Mini'] };
  await accueil(b, 'accueil 1280', ord, 'no-preference', '1280');
  await accueil(b, 'accueil 390', tel, 'no-preference', '390');
  await accueil(b, 'accueil 768', tab, 'no-preference', '768');
  await accueil(b, 'accueil 1280, animations réduites', ord, 'reduce', '1280-reduit');
  await accueil(b, 'accueil 390, animations réduites', tel, 'reduce', '390-reduit');
  await accueilBandeau(b, 'bandeau des cookies 1280', ord, '1280');
  await accueilBandeau(b, 'bandeau des cookies 390', tel, '390');
  await accueilBandeau(b, 'bandeau des cookies 768', tab, '768');
  await espace(b, 'espace adhérent 1280', { viewport: { width: 1280, height: 900 } }, 'no-preference', '1280');
  await espace(b, 'espace adhérent 390', tel, 'no-preference', '390');
  await espace(b, 'espace adhérent 390, animations réduites', tel, 'reduce', '390-reduit');
  await b.close();
  console.log(nOk + ' OK, ' + (echecs ? echecs + ' échec(s)' : 'aucun échec') + (echecs ? '' : ' : tout est OK'));
})();
