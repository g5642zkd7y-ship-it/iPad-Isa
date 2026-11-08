const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , FILE, FONTDIR, OUT] = process.argv;
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } });
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const f = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(path.join(FONTDIR, f)) }); });
  const p = await ctx.newPage();
  const doc = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>' + fs.readFileSync(FILE, 'utf8') + '</body></html>';
  const tmp = FILE.replace(/\.html$/, '-print.html'); fs.writeFileSync(tmp, doc);
  await p.goto('file://' + tmp); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }));
  await p.evaluate(async () => { await Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; }))); });
  await p.emulateMedia({ media: 'print' });
  await p.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('ok');
})();
