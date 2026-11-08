// Bandeau des cookies : affichage à la première visite, refuser aussi simple qu'accepter, choix gardé, détail, changement d'avis.
// SLBC_BANDEAU_COOKIES=1 node check_cookies.js <url> <polices> <dossier captures>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, OUT] = process.argv;
let ok = 0, ko = 0;
const verifie = (c, m) => { if (c) { ok++; console.log('OK   ' + m); } else { ko++; console.log('ÉCHEC ' + m); } };
const KEY = 'slbc-maquette-cookies';
(async () => {
  const b = await chromium.launch();
  for (const w of [1280, 390]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w > 500 ? 900 : 760 } });
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(URL_ + '#accueil'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    // 1. première visite : bandeau visible, sans choix enregistré
    const bar = await p.evaluate(() => { const b = document.getElementById('cookie-bar'); const r = b.getBoundingClientRect(); return { vis: !b.hidden && r.height > 0, bas: Math.round(innerHeight - r.bottom), h: Math.round(r.height), pad: getComputedStyle(document.body).paddingBottom, mesure: document.documentElement.dataset.cookiesMesure }; });
    verifie(bar.vis && bar.bas === 0, w + ' : première visite, le bandeau est affiché en bas de l’écran (' + bar.h + ' px)');
    verifie(Math.abs(parseFloat(bar.pad) - bar.h) <= 1, w + ' : la page garde en bas la place du bandeau (' + bar.pad + ')');
    verifie(bar.mesure === 'non', w + ' : sans choix, la mesure d’audience reste coupée');
    // 2. refuser aussi simple qu'accepter : mêmes boutons
    const bt = await p.evaluate(() => [...document.querySelectorAll('#cookie-bar [data-cookies-tout]')].map((x) => { const s = getComputedStyle(x); const r = x.getBoundingClientRect(); return { t: x.textContent, w: Math.round(r.width), h: Math.round(r.height), bg: s.backgroundColor, c: s.color, f: s.fontSize + s.fontWeight }; }));
    verifie(bt.length === 2 && bt[0].t === 'Tout refuser' && bt[1].t === 'Tout accepter', w + ' : boutons « Tout refuser » et « Tout accepter »');
    verifie(bt.length === 2 && bt[0].w === bt[1].w && bt[0].h === bt[1].h && bt[0].bg === bt[1].bg && bt[0].c === bt[1].c && bt[0].f === bt[1].f && bt[0].h >= 44, w + ' : les deux boutons sont identiques (' + JSON.stringify(bt.map((x) => [x.w, x.h])) + ')');
    verifie(await p.evaluate(() => !!document.querySelector('#cookie-bar [data-cookies-voir]')), w + ' : bouton « Voir et choisir »');
    verifie(await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth) <= 0, w + ' : pas de débord horizontal');
    // 3. le bandeau est atteint en premier au clavier
    await p.keyboard.press('Tab');
    verifie(await p.evaluate(() => !!document.activeElement.closest('#cookie-bar')), w + ' : la première touche Tab arrive dans le bandeau');
    if (w === 1280) await p.locator('#cookie-bar').screenshot({ path: path.join(OUT, 'cookies-bandeau-1280.png') }); else await p.screenshot({ path: path.join(OUT, 'cookies-bandeau-390.png') });
    // 4. Tout refuser
    await p.click('#cookie-bar [data-cookies-tout="non"]'); await p.waitForTimeout(200);
    const apres = await p.evaluate((k) => ({ cache: document.getElementById('cookie-bar').hidden, v: JSON.parse(localStorage.getItem(k) || 'null'), m: document.documentElement.dataset.cookiesMesure, pad: getComputedStyle(document.body).paddingBottom, toast: document.getElementById('toast-msg').textContent }), KEY);
    verifie(apres.cache && apres.v && apres.v.mesure === false && apres.m === 'non' && apres.pad === '0px', w + ' : « Tout refuser » ferme le bandeau et enregistre le refus');
    verifie(/refusés/.test(apres.toast), w + ' : message de confirmation (' + apres.toast + ')');
    await p.reload(); await p.waitForTimeout(400);
    verifie(await p.evaluate(() => document.getElementById('cookie-bar').hidden), w + ' : après rechargement, le bandeau ne revient pas');
    // 5. Gérer les cookies (pied de page) : détail, choix, enregistrement
    await p.evaluate(() => document.querySelector('footer [data-cookies-voir]').scrollIntoView());
    await p.click('footer [data-cookies-voir]'); await p.waitForTimeout(200);
    const dlg = await p.evaluate(() => ({ open: document.getElementById('cookie-dialog').open, sw: document.getElementById('ck-mesure').checked, focus: document.activeElement.id, cats: [...document.querySelectorAll('.cookie-cat-t')].map((x) => x.textContent) }));
    verifie(dlg.open && dlg.sw === false && dlg.focus === 'cookie-dlg-title', w + ' : « Gérer les cookies » ouvre le détail, focus sur le titre, choix actuel affiché');
    verifie(dlg.cats.join(' | ') === 'Nécessaires au fonctionnement | Mesure d’audience', w + ' : deux catégories (' + dlg.cats.join(' | ') + ')');
    if (w === 1280) await p.locator('#cookie-dialog').screenshot({ path: path.join(OUT, 'cookies-detail-1280.png') }); else await p.screenshot({ path: path.join(OUT, 'cookies-detail-390.png') });
    await p.click('label[for="ck-mesure"]'); await p.click('#cookie-form button[type="submit"]'); await p.waitForTimeout(200);
    const choisi = await p.evaluate((k) => ({ open: document.getElementById('cookie-dialog').open, v: JSON.parse(localStorage.getItem(k) || 'null'), m: document.documentElement.dataset.cookiesMesure, focus: document.activeElement.closest('footer') ? 'pied' : document.activeElement.tagName }), KEY);
    verifie(!choisi.open && choisi.v.mesure === true && choisi.m === 'oui', w + ' : « Enregistrer mes choix » garde la mesure d’audience acceptée');
    verifie(choisi.focus === 'pied', w + ' : le focus revient sur « Gérer les cookies » (' + choisi.focus + ')');
    // 6. Échap ferme sans rien changer
    await p.click('footer [data-cookies-voir]'); await p.waitForTimeout(150); await p.click('label[for="ck-mesure"]'); await p.keyboard.press('Escape'); await p.waitForTimeout(150);
    verifie(await p.evaluate((k) => !document.getElementById('cookie-dialog').open && JSON.parse(localStorage.getItem(k)).mesure === true, KEY), w + ' : Échap ferme le détail sans changer le choix');
    // 7. choix de plus de 6 mois : redemandé
    await p.evaluate((k) => localStorage.setItem(k, JSON.stringify({ v: 1, mesure: true, date: new Date(Date.now() - 190 * 864e5).toISOString() })), KEY);
    await p.reload(); await p.waitForTimeout(400);
    verifie(await p.evaluate(() => !document.getElementById('cookie-bar').hidden && document.documentElement.dataset.cookiesMesure === 'non'), w + ' : un choix de plus de 6 mois est redemandé (et la mesure reste coupée en attendant)');
    // 8. Tout accepter depuis le bandeau
    await p.click('#cookie-bar [data-cookies-tout="oui"]'); await p.waitForTimeout(150);
    verifie(await p.evaluate((k) => JSON.parse(localStorage.getItem(k)).mesure === true && document.documentElement.dataset.cookiesMesure === 'oui', KEY), w + ' : « Tout accepter » enregistre l’accord');
    // 9. page Cookies des informations légales
    await p.goto(URL_ + '#mentions'); await p.waitForTimeout(300);
    const txt = await p.evaluate(() => document.getElementById('cookies').textContent);
    verifie(!/aucun bandeau/.test(txt) && /6\s*mois/.test(txt), w + ' : la partie « Cookies » décrit le bandeau et la durée de 6 mois');
    verifie(await p.evaluate(() => !!document.querySelector('#cookies [data-cookies-voir]')), w + ' : bouton « Gérer les cookies » dans la partie « Cookies »');
    verifie(errs.length === 0, w + ' : aucune erreur JavaScript ' + errs.join(' | '));
    await ctx.close();
  }
  // 10. Petits écrans et écrans bas : bandeau pas trop haut, menu compact entièrement atteignable, focus après le choix
  for (const [vw, vh] of [[320, 568], [375, 667], [390, 664], [667, 375], [750, 342], [810, 1080]]) {
    const ctx = await b.newContext({ viewport: { width: vw, height: vh }, hasTouch: true, isMobile: vw < 800 });
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(URL_ + '#accueil'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    const t = await p.evaluate(() => { const r = document.getElementById('cookie-bar').getBoundingClientRect(); return { h: Math.round(r.height), part: r.height / innerHeight, pad: parseFloat(getComputedStyle(document.body).paddingBottom), lignes: [...document.querySelectorAll('#cookie-bar .btn')].map((x) => Math.round(x.getBoundingClientRect().height)) }; });
    const max = vh <= 500 ? 0.45 : vw <= 400 ? 0.42 : 0.3;
    verifie(t.part <= max, `${vw}×${vh} : le bandeau occupe ${Math.round(t.part * 100)} % de l’écran (au plus ${Math.round(max * 100)} %)`);
    verifie(Math.abs(t.pad - t.h) <= 1, `${vw}×${vh} : la place gardée en bas suit la hauteur du bandeau (${Math.round(t.pad)} / ${t.h})`);
    verifie(t.lignes.every((x) => x <= 50), `${vw}×${vh} : libellés des boutons sur une ligne (${t.lignes.join(', ')} px)`);
    const btnMenu = await p.$('button[aria-controls="mmenu"]');
    if (btnMenu && await btnMenu.isVisible()) {
      await btnMenu.click(); await p.waitForTimeout(450);
      const caches = await p.evaluate(async () => { const out = []; for (const a of [...document.querySelectorAll('#mmenu a')].filter((x) => x.getClientRects().length)) { a.scrollIntoView({ block: 'nearest' }); await new Promise((r) => setTimeout(r, 60)); const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); if (!(e && a.contains(e))) out.push(a.textContent.trim()); } return out; });
      verifie(caches.length === 0, `${vw}×${vh} : menu compact entièrement atteignable avec le bandeau (${caches.join(', ') || 'rien de caché'})`);
      await btnMenu.click(); await p.waitForTimeout(300);
    }
    await p.click('#cookie-bar [data-cookies-tout="non"]'); await p.waitForTimeout(150);
    verifie(await p.evaluate(() => getComputedStyle(document.body).paddingBottom === '0px' && document.getElementById('cookie-bar').hidden), `${vw}×${vh} : après le refus, plus de bandeau ni de place gardée`);
    verifie(errs.length === 0, `${vw}×${vh} : aucune erreur JavaScript ${errs.join(' | ')}`);
    await ctx.close();
  }
  // 11. Clavier : après « Tout refuser », le focus va sur le titre de la page ; stockage indisponible : le choix vaut pour la visite
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(URL_ + '#presse'); await p.waitForTimeout(400);
    await p.keyboard.press('Tab'); await p.keyboard.press('Enter'); await p.waitForTimeout(200);
    verifie(await p.evaluate(() => document.activeElement.tagName === 'H1' && !!document.activeElement.closest('.view:not([hidden])')), 'clavier : après « Tout refuser », le focus va sur le titre de la page');
    await ctx.close();
    const c2 = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await c2.addInitScript(() => { const k = Storage.prototype; const g = k.getItem, st = k.setItem; k.getItem = function (x) { if (x === 'slbc-maquette-cookies') throw new Error('bloqué'); return g.apply(this, arguments); }; k.setItem = function (x) { if (x === 'slbc-maquette-cookies') throw new Error('bloqué'); return st.apply(this, arguments); }; });
    const q = await c2.newPage(); const errs = []; q.on('pageerror', (e) => errs.push(e.message));
    await q.goto(URL_ + '#accueil'); await q.waitForTimeout(400);
    await q.click('#cookie-bar [data-cookies-tout="oui"]'); await q.waitForTimeout(150);
    await q.evaluate(() => document.querySelector('footer [data-cookies-voir]').click()); await q.waitForTimeout(150);
    verifie(await q.evaluate(() => document.getElementById('ck-mesure').checked && document.documentElement.dataset.cookiesMesure === 'oui') && errs.length === 0, 'stockage indisponible : le choix de la visite est gardé et la fenêtre affiche le bon état');
    await c2.close();
  }
  await b.close();
  console.log(`Bilan : ${ok} contrôles bons, ${ko} en échec`);
})();
