// Planche « Menus et textes d'introduction » (10 novembre 2026, demande d'Isabelle Eimer : « Les textes entourés en rouge : il faut les
// rendre plus en adéquation avec l'ensemble du site en terme de présentation, fais 4 propositions sur une planche. Il faut certainement
// différencier ce qui est au menu principal et ce qui est en texte de présentation dans chaque onglet du menu. »)
// Captures du site tel qu'il est, puis avec chacune des quatre propositions (styles ajoutés à la page, le site n'est pas modifié).
// usage : node capture_presentation.js <url du site> <dossier des polices> <dossier de sortie>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , URL_, FONTDIR, OUT] = process.argv;

// Petits dessins en image de fond (couleurs écrites en attributs fill / stroke)
const svg = (s) => 'url("data:image/svg+xml;utf8,' + encodeURIComponent(s) + '")';
const VAGUE = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M2 6 C14 2 22 9 34 5 S56 2 68 6 S88 8 98 4" fill="none" stroke="#A3BE3C" stroke-width="3.6" stroke-linecap="round"/></svg>');
const RONDS = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><circle cx="10.5" cy="8.5" r="7" fill="#5E6266"/><circle cx="18.5" cy="12" r="7" fill="#A3BE3C"/><path d="M15.2 6.6 A7 7 0 0 1 17.5 15.3 A7 7 0 0 1 12.2 10.6 A7 7 0 0 1 15.2 6.6 Z" fill="#5F7A2B"/></svg>');

const P = {
  actuel: '',
  // 1. Sobre : la hiérarchie par la typographie seule
  p1: `
  .gnav-links a,.gnav-member{font-weight:700!important;font-size:17px!important;color:var(--encre)!important;letter-spacing:-.005em}
  .gnav-links a[aria-current="page"]{color:var(--vert)!important}
  .gnav-links a::after{height:4px!important;bottom:11px!important;border-radius:4px!important;background:var(--anis)!important}
  .lnav-links{gap:8px!important}
  .lnav-links a{margin-block:9px;padding:8px 16px!important;border-radius:999px;background:var(--neutre);font-size:15.5px!important;font-weight:700;color:var(--texte)!important}
  .lnav-links a[aria-current="true"]{background:var(--vert-clair);color:var(--encre)!important;box-shadow:none!important}
  .page-hero .lead{max-width:32em!important;font-size:clamp(20px,1.9vw,23px)!important;line-height:1.42!important;font-weight:600!important;color:var(--encre)!important}
  .page-hero.bg-vert .lead,.page-hero.bg-nardo .lead{color:#fff!important}
  .page-hero .lead::before{content:"";display:block;width:48px;height:4px;margin:0 auto 18px;border-radius:4px;background:var(--anis)}
  .page-hero.bg-vert-clair .lead::before{background:var(--vert)}`,
  // 2. Au marqueur : le trait des mascottes et des pastilles
  p2: `
  .gnav-links a,.gnav-member{font-weight:700!important;font-size:17.5px!important;color:var(--encre)!important}
  .gnav-links a::after{height:9px!important;bottom:8px!important;left:-3px!important;right:-3px!important;border-radius:0!important;background:${VAGUE} center/100% 100% no-repeat!important}
  .lnav-links{gap:10px!important}
  .lnav-links a{margin-block:10px;padding:6px 15px!important;border:2px solid var(--encre);border-radius:999px;background:#fff;font-size:15.5px!important;font-weight:700;color:var(--encre)!important}
  .lnav-links a[aria-current="true"]{background:var(--anis);box-shadow:none!important}
  .page-hero .lead{position:relative;max-width:36em!important;margin-top:8px;padding:18px 26px!important;border:2.5px solid var(--encre);border-radius:26px;background:#fff;box-shadow:5px 5px 0 var(--anis);font-size:clamp(18px,1.6vw,20px)!important;line-height:1.45!important;font-weight:600!important;color:var(--encre)!important}
  .page-hero .lead::before{content:"";position:absolute;top:-12px;right:22%;width:20px;height:20px;background:#fff;border-top:2.5px solid var(--encre);border-left:2.5px solid var(--encre);transform:rotate(45deg)}
  .page-hero.bg-vert-clair .lead{box-shadow:5px 5px 0 var(--vert)}
  @media (max-width:899px){.page-hero .lead::before{right:auto;left:50%;margin-left:-10px}}`,
  // 3. Couleurs des onglets : chaque onglet ouvert prend la couleur de sa page ; pavés et cartouche comme le reste du site
  p3: `
  .gnav-links{gap:6px!important}
  .gnav-links a{line-height:1.2!important;padding:9px 14px;border-radius:12px;font-weight:600!important;font-size:17px!important;color:var(--encre)!important}
  .gnav-links a::after{display:none}
  .gnav-links a[aria-current="page"]{background:var(--neutre)}
  .gnav-links a[data-nav="veille"][aria-current="page"]{background:var(--olive);color:#fff!important}
  .gnav-links a[data-nav="actualites"][aria-current="page"]{background:var(--nardo);color:#fff!important}
  .gnav-links a[data-nav="presse"][aria-current="page"]{background:var(--vert-clair)}
  .gnav-member{font-weight:600!important;font-size:17px!important;color:var(--encre)!important}
  .lnav-links{gap:8px!important}
  .lnav-links a{margin-block:9px;padding:7px 14px!important;border:1.5px solid var(--filet);border-radius:12px;background:#fff;font-size:15.5px!important;font-weight:700;color:var(--encre)!important}
  .lnav-links a[aria-current="true"]{border-color:var(--vert);background:var(--vert);color:#fff!important;box-shadow:none!important}
  .page-hero .lead{max-width:40em!important;padding:18px 26px!important;border-radius:16px;background:#fff;font-size:clamp(18px,1.55vw,20px)!important;line-height:1.5!important;font-weight:500!important;color:var(--encre)!important}
  .page-hero:not([class*="bg-"]) .lead{background:var(--fond)}`,
  // 4. Signature : les deux ronds du logo marquent l'onglet ouvert ; texte d'introduction le long d'un filet, comme les citations
  p4: `
  .gnav-links a,.gnav-member{font-weight:600!important;font-size:17.5px!important;color:var(--encre)!important}
  .gnav-links a::after{left:50%!important;right:auto!important;width:28px!important;height:19px!important;bottom:1px!important;margin-left:-14px;border-radius:0!important;background:${RONDS} center/contain no-repeat!important}
  .lnav-links{gap:0!important}
  .lnav-links a{position:relative;padding:16px 14px!important;font-size:15.5px!important;font-weight:700;color:var(--texte)!important}
  .lnav-links a + a::before{content:"";position:absolute;left:-3px;top:50%;width:6px;height:6px;margin-top:-3px;border-radius:50%;background:var(--anis)}
  .lnav-links a[aria-current="true"]{color:var(--vert-fonce)!important;box-shadow:none!important}
  .lnav-links a[aria-current="true"]::after{content:"";position:absolute;left:50%;bottom:3px;width:18px;height:12px;margin-left:-9px;background:${RONDS} center/contain no-repeat}
  .page-hero .lead{max-width:34em!important;padding:4px 0 4px 22px!important;border-left:5px solid var(--anis);text-align:left;font-size:clamp(19px,1.75vw,22px)!important;line-height:1.45!important;font-weight:600!important;color:var(--encre)!important}
  .page-hero.bg-vert .lead,.page-hero.bg-nardo .lead{color:#fff!important}
  .page-hero.bg-vert-clair .lead{border-left-color:var(--vert)}`,
};

const fonts = async (ctx) => {
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
};
const cookies = () => { try { localStorage.setItem('slbc-maquette-cookies', JSON.stringify({ v: 1, mesure: false, date: new Date().toISOString() })); } catch (e) {} };

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch();
  for (const [k, css] of Object.entries(P)) {
    // iPad à l'horizontale (menu complet)
    const ctx = await b.newContext({ viewport: { width: 1180, height: 820 }, deviceScaleFactor: 1 }); await fonts(ctx); await ctx.addInitScript(cookies);
    const p = await ctx.newPage(); await p.emulateMedia({ reducedMotion: 'reduce' });
    const vue = async (hash) => {
      await p.goto(URL_ + '#' + hash); await p.evaluate(() => document.fonts.ready);
      if (css) await p.addStyleTag({ content: css });
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(450);
    };
    for (const v of ['veille', 'presse', 'actualites']) {
      await vue(v);
      const bas = await p.evaluate((x) => Math.ceil(document.querySelector('.view[data-view="' + x + '"] .page-hero').getBoundingClientRect().bottom), v);
      await p.screenshot({ path: path.join(OUT, `${k}-${v}.jpg`), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1180, height: Math.min(bas, 820) } });
    }
    await vue('syndicat');
    await p.screenshot({ path: path.join(OUT, `${k}-syndicat.jpg`), type: 'jpeg', quality: 82, clip: { x: 0, y: 0, width: 1180, height: 300 } });
    await ctx.close();
    // Téléphone
    const t = await b.newContext({ viewport: { width: 390, height: 760 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); await fonts(t); await t.addInitScript(cookies);
    const q = await t.newPage(); await q.emulateMedia({ reducedMotion: 'reduce' });
    for (const v of ['veille', 'syndicat']) {
      await q.goto(URL_ + '#' + v); await q.evaluate(() => document.fonts.ready);
      if (css) await q.addStyleTag({ content: css });
      await q.evaluate(() => window.scrollTo(0, 0)); await q.waitForTimeout(450);
      await q.screenshot({ path: path.join(OUT, `${k}-tel-${v}.jpg`), type: 'jpeg', quality: 80 });
    }
    await t.close();
    console.log(k, 'ok');
  }
  await b.close();
})();
