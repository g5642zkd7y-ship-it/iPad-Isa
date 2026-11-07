// PDF des deux planches de mascottes de saison : node pdf_planches.js <dossier> <polices> <sortie noel.pdf> <sortie ete.pdf>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , DIR, FONTDIR, OUT_NOEL, OUT_ETE] = process.argv;
const IMPRESSION = '<style>@page{size:A4;margin:12mm 10mm}html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
  'section.mascotte-ligne{break-inside:avoid;page-break-inside:avoid}h1,h2{break-after:avoid}</style>';
(async () => {
  const b = await chromium.launch();
  for (const [nom, sortie] of [['noel', OUT_NOEL], ['ete', OUT_ETE]]) {
    const body = fs.readFileSync(path.join(DIR, 'planche-' + nom + '.html'), 'utf8');
    const doc = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;font:14px system-ui}</style>' + IMPRESSION + '</head><body>' + body + '</body></html>';
    const f = path.join(DIR, 'impression-' + nom + '.html'); fs.writeFileSync(f, doc);
    const ctx = await b.newContext({ viewport: { width: 1000, height: 1400 } });
    await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
    await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
    const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    const fonts = await p.evaluate(() => [...document.fonts].filter((x) => x.status === 'loaded').map((x) => x.family + ' ' + x.weight));
    await p.emulateMedia({ media: 'print' });
    // mise en page d'ordinateur (environ 1100 px de large), réduite à la largeur de la page A4
    await p.pdf({ path: sortie, preferCSSPageSize: true, printBackground: true, scale: 0.65 });
    console.log(nom, 'erreurs', errs.length, 'polices', [...new Set(fonts)].join(', '));
    await ctx.close();
  }
  await b.close();
})();
