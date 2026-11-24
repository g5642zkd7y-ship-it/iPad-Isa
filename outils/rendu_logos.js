// Rendu d'un ou plusieurs SVG en PNG, avec Nunito servie en local.
// usage : NODE_PATH=$(npm root -g) node render.js <sortie.png> <fond:#hex> <hauteur_px> <fichier.svg> [<fichier.svg> ...]
// Chaque SVG est affiché à la hauteur demandée, côte à côte, sur le fond donné, avec une marge.
const fs = require('fs'), path = require('path'), { chromium } = require('playwright');
const FONTDIR = '/tmp/claude-0/-home-user-iPad-Isa/71cc45ac-0de8-5a6b-bc8e-69b83e7a49ed/scratchpad/revue2/fonts';
(async () => {
  const [out, bg, h, ...files] = process.argv.slice(2);
  const H = parseInt(h, 10);
  const svgs = files.map((f) => fs.readFileSync(f, 'utf8').replace(/<\?xml[^>]*>/, ''));
  const html = `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800;900">
<style>body{margin:0;background:${bg};display:inline-flex;gap:${Math.max(16, H / 3)}px;padding:${Math.max(12, H / 4)}px;align-items:center}
.c svg{height:${H}px;width:auto;display:block}</style>${svgs.map((s) => `<div class="c">${s}</div>`).join('')}`;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 2400, height: 1200 }, deviceScaleFactor: 1 });
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
  const p = await ctx.newPage();
  await p.setContent(html); await p.evaluate(async () => { await document.fonts.load('900 20px Nunito'); await document.fonts.load('700 20px Nunito'); await document.fonts.ready; });
  await p.waitForTimeout(150);
  const box = await p.evaluate(() => { const r = document.body.getBoundingClientRect(); return { w: Math.ceil(r.width), h: Math.ceil(r.height) }; });
  await p.screenshot({ path: out, clip: { x: 0, y: 0, width: box.w, height: box.h } });
  await b.close();
  console.log('ok', out, box.w + 'x' + box.h);
})();
