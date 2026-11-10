// Charte SLBM en PDF A4 (mêmes marges que la charte SLBC), polices Nunito servies depuis les copies locales.
// node pdf.js <charte-slbm.html> <dossier polices> <sortie.pdf> <capture.png>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , IN, FONTDIR, OUT, SHOT] = process.argv;
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ colorScheme: 'light', viewport: { width: 1000, height: 900 } });
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const f = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(path.join(FONTDIR, f)) }); });
  const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + IN); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(800);
  const nunito = await p.evaluate(() => document.fonts.check('900 56px Nunito'));
  if (SHOT) await p.screenshot({ path: SHOT, clip: { x: 0, y: 0, width: 1000, height: 900 } });
  await p.emulateMedia({ media: 'print', colorScheme: 'light' });
  await p.pdf({ path: OUT, format: 'A4', printBackground: true, margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' } });
  console.log('erreurs', errs.length, errs.slice(0, 2), 'nunito', nunito); await b.close();
})();
