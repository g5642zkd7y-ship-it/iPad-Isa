// Planche « Textes d'introduction écrits à la main » (10 novembre 2026, demande d'Isabelle Eimer, après la première planche des menus :
// « Aucune proposition ne me plait. Peut-être avec la police de « bienvenue » de la mascotte ? »).
// L'écriture de la banderole « Bienvenue » (Kalam gras, Google Fonts, licence SIL OFL) sert aux textes qui présentent chaque page ;
// le menu principal reste en Nunito, en gras : la navigation d'un côté, la voix des mascottes de l'autre.
// Captures du site tel qu'il est, puis avec chacune des quatre propositions (styles ajoutés à la page, le site n'est pas modifié).
// usage : node capture_ecriture.js <url du site> <dossier des polices Nunito> <dossier des fichiers Kalam (woff2)> <dossier de sortie>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, KALAM, OUT] = process.argv;

const b64 = (f) => fs.readFileSync(path.join(KALAM, f)).toString('base64');
const FONTES = `
  @font-face{font-family:"Kalam";font-weight:400;font-display:block;src:url(data:font/woff2;base64,${b64('kalam-latin-400-normal.woff2')}) format("woff2")}
  @font-face{font-family:"Kalam";font-weight:700;font-display:block;src:url(data:font/woff2;base64,${b64('kalam-latin-700-normal.woff2')}) format("woff2")}`;
const svg = (s) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")';
const VAGUE = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M2 6 C14 2 22 9 34 5 S56 2 68 6 S88 8 98 4" fill="none" stroke="#A3BE3C" stroke-width="3.6" stroke-linecap="round"/></svg>');
// Commun aux quatre : le menu principal reste en Nunito, en gras, encre ; l'onglet ouvert garde son trait vert, un peu plus épais
const MENU = `
  .gnav-links a,.gnav-member{font-weight:700!important;font-size:17.5px!important;color:var(--encre)!important}
  .gnav-links a::after{height:3px!important;bottom:12px!important;border-radius:3px!important}
  .lnav-links a{font-weight:700!important;color:var(--encre)!important}`;
const MAIN = '"Kalam","Nunito",cursive';

const P = {
  actuel: '',
  // 1. L'écriture seule : le texte d'introduction écrit à la main, plus grand, sans cadre
  e1: FONTES + MENU + `
  .page-hero .lead{max-width:30em!important;font-family:${MAIN}!important;font-weight:700!important;font-size:clamp(22px,2.15vw,26px)!important;line-height:1.38!important;color:var(--encre)!important}
  .page-hero.bg-vert .lead,.page-hero.bg-nardo .lead{color:#fff!important}`,
  // 2. Dans la bulle de la mascotte : la mascotte « dit » le texte d'introduction
  e2: FONTES + MENU + `
  .page-hero .lead{position:relative;max-width:34em!important;margin-top:8px;padding:16px 28px 18px!important;border:2.5px solid var(--encre);border-radius:26px;background:#fff;box-shadow:5px 5px 0 var(--anis);font-family:${MAIN}!important;font-weight:700!important;font-size:clamp(20px,1.9vw,23px)!important;line-height:1.38!important;color:var(--encre)!important}
  .page-hero .lead::before{content:"";position:absolute;top:-12px;right:22%;width:20px;height:20px;background:#fff;border-top:2.5px solid var(--encre);border-left:2.5px solid var(--encre);transform:rotate(45deg)}
  .page-hero.bg-vert-clair .lead{box-shadow:5px 5px 0 var(--vert)}
  @media (max-width:899px){.page-hero .lead::before{right:auto;left:50%;margin-left:-10px}}`,
  // 3. Surligné : écrit à la main sur des bandes vert clair, comme un passage au surligneur (bandes blanches sur le vert clair de la Presse)
  e3: FONTES + MENU + `
  .page-hero .lead{max-width:30em!important;font-family:${MAIN}!important;font-weight:700!important;font-size:clamp(21px,2vw,25px)!important;line-height:1.62!important;color:var(--encre)!important}
  .page-hero .lead .surligne{padding:1px 8px 2px;border-radius:6px 10px 7px 9px;background:var(--vert-clair);-webkit-box-decoration-break:clone;box-decoration-break:clone}
  .page-hero.bg-vert-clair .lead .surligne{background:#fff}`,
  // 4. Toute la présentation à la main : le sous-menu des pages et le texte d'introduction ; le menu principal seul reste en Nunito
  e4: FONTES + MENU + `
  .page-hero .lead{max-width:32em!important;font-family:${MAIN}!important;font-weight:400!important;font-size:clamp(22px,2.1vw,25px)!important;line-height:1.4!important;color:var(--encre)!important}
  .page-hero.bg-vert .lead,.page-hero.bg-nardo .lead{color:#fff!important}
  .lnav-links{gap:14px!important}
  .lnav-links a{position:relative;padding:12px 8px 14px!important;font-family:${MAIN}!important;font-weight:700!important;font-size:20px!important;letter-spacing:0;color:var(--encre)!important}
  .lnav-links a[aria-current="true"]{box-shadow:none!important}
  .lnav-links a[aria-current="true"]::after{content:"";position:absolute;left:2px;right:2px;bottom:6px;height:8px;background:${VAGUE} center/100% 100% no-repeat}`,
};

const fonts = async (ctx) => {
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
};
const cookies = () => { try { localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) {} };
const habiller = async (p, k, css) => {
  if (!css) return;
  await p.addStyleTag({ content: css });
  if (k === 'e3') await p.evaluate(() => document.querySelectorAll('.page-hero .lead').forEach((l) => { if (!l.querySelector('.surligne')) l.innerHTML = '<span class="surligne">' + l.innerHTML + '</span>'; }));
  await p.evaluate(async () => { await document.fonts.load('700 24px Kalam'); await document.fonts.load('400 24px Kalam'); await document.fonts.ready; });
};
// Ligne en cours du sous-menu de la page Le syndicat : on descend jusqu'au bureau, puis on remonte pour la capture
const sousMenuEnCours = async (p) => {
  await p.evaluate(() => { const b = document.getElementById('bureau'); window.scrollTo(0, b.getBoundingClientRect().top + scrollY - 140); }); await p.waitForTimeout(400);
  const cur = await p.evaluate(() => { const a = document.querySelector('.view[data-view="syndicat"] .lnav a[aria-current="true"]'); return a ? a.textContent : ''; });
  await p.evaluate(() => { const a = [...document.querySelectorAll('.view[data-view="syndicat"] .lnav a')].find((x) => x.dataset.section === 'bureau'); document.querySelectorAll('.view[data-view="syndicat"] .lnav a').forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); window.__gele = true; });
  return cur;
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [k, css] of Object.entries(P)) {
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1 }); await fonts(ctx); await ctx.addInitScript(cookies);
    const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: 'reduce' });
    for (const v of ['veille', 'presse', 'actualites']) {
      await p.goto(URL_ + '#' + v); await p.evaluate(() => document.fonts.ready); await habiller(p, k, css);
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(450);
      const bas = await p.evaluate((x) => Math.ceil(document.querySelector('.view[data-view="' + x + '"] .page-hero').getBoundingClientRect().bottom), v);
      await p.screenshot({ path: path.join(OUT, `${k}-${v}.jpg`), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1180, height: Math.min(bas, 820) } });
    }
    // Le syndicat : menu principal et sous-menu, avec la rubrique « Bureau » en cours (page descendue jusqu'au bureau)
    await p.goto(URL_ + '#syndicat'); await p.evaluate(() => document.fonts.ready); await habiller(p, k, css);
    await p.evaluate(() => { const b = document.getElementById('bureau'); window.scrollTo(0, b.getBoundingClientRect().top + scrollY - 200); }); await p.waitForTimeout(700);
    const hautBarres = await p.evaluate(() => Math.ceil(document.querySelector('.view[data-view="syndicat"] .lnav').getBoundingClientRect().bottom));
    await p.screenshot({ path: path.join(OUT, `${k}-syndicat.jpg`), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1180, height: hautBarres + 6 } });
    await ctx.close();
    const t = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await fonts(t); await t.addInitScript(cookies);
    const q = await t.newPage(); await q.emulateMedia({ reducedMotion: 'reduce' });
    for (const v of ['veille', 'presse']) {
      await q.goto(URL_ + '#' + v); await q.evaluate(() => document.fonts.ready); await habiller(q, k, css);
      await q.evaluate(() => window.scrollTo(0, 0)); await q.waitForTimeout(450);
      await q.screenshot({ path: path.join(OUT, `${k}-tel-${v}.jpg`), type: 'jpeg', quality: 80 });
    }
    await t.close();
    console.log(k, 'ok');
  }
  await b.close();
})();
