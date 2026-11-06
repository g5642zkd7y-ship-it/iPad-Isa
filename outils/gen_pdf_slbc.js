// PDF aux couleurs du SLBC : actualités de l'ancien site et statuts, recopiés mot pour mot (contenu.json).
// usage : node gen_pdf_slbc.js <contenu.json> <polices> <dossier site/documents>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const [, , SRC, FONTDIR, OUT] = process.argv;
const C = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const paras = (x, cls) => x.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean).map((t, i) => '<p' + (/^– /.test(t) ? ' class="li"' : (cls && i === 0 ? ' class="' + cls + '"' : '')) + '>' + esc(t) + '</p>').join('\n');
// Statuts, article 7 : la liste « Régions Départements » devient un tableau à deux colonnes.
const REG = /^(.+?) ((?:\d{2}|2A|2B)(?:\.(?:\d{2}|2A|2B))*)$/;
const statPara = (x) => {
  const parts = x.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
  let html = ''; let rows = null;
  parts.forEach((t) => {
    if (t === 'Régions Départements') { rows = []; return; }
    const m = rows && t.match(REG);
    if (m) { rows.push('<tr><td>' + esc(m[1]) + '</td><td>' + esc(m[2].split('.').join(', ')) + '</td></tr>'); return; }
    if (rows) { html += '<table><thead><tr><th>Régions</th><th>Départements</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>'; rows = null; }
    html += '<p' + (/^– /.test(t) ? ' class="li"' : '') + '>' + esc(t) + '</p>';
  });
  if (rows) html += '<table><thead><tr><th>Régions</th><th>Départements</th></tr></thead><tbody>' + rows.join('') + '</tbody></table>';
  return html;
};
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const longDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return (d === 1 ? '1er' : d) + ' ' + MOIS[m - 1] + ' ' + y; };

const ARTS = [
  { k: 'strategie-nationale-de-sante-sexuelle-2026-2030-le-texte-integral-du-ministere', date: '2026-09-07', cat: 'Santé publique', title: 'Stratégie nationale de santé sexuelle 2026-2030 : le texte intégral du ministère', out: 'actualites/2026-09-07-strategie-sante-sexuelle-texte-integral.pdf', joint: 'la feuille de route 2026-2030 (ministère de la Santé, 72 pages)' },
  { k: 'feuille-de-route-2026-2030-de-la-strategie-nationale-de-sante-sexuelle', date: '2026-09-07', cat: 'Santé publique', title: 'Feuille de route 2026-2030 de la stratégie nationale de santé sexuelle', out: 'actualites/2026-09-07-feuille-de-route-sante-sexuelle.pdf', joint: 'la dépêche APMnews du 7 septembre 2026 (2 pages)' },
  { k: 'rapport-beaudeux-bouvier-biologistes-medicaux-et-assistance-medicale-a-la-procreation', date: '2026-08-31', cat: 'Exercice', title: 'Rapport Beaudeux-Bouvier : biologistes médicaux et assistance médicale à la procréation', out: 'actualites/2026-08-31-rapport-beaudeux-bouvier.pdf', joint: 'le rapport de la mission (19 pages)' },
  { k: 'deces-du-docteur-jean-francois-perotto', date: '2026-08-31', cat: 'Vie du syndicat', title: 'Décès du Docteur Jean-François Perotto', out: 'actualites/2026-08-31-deces-jean-francois-perotto.pdf' },
  { k: 'negociations-salariales-recommandation-patronale-et-grille-2026', date: '2026-07-01', cat: 'Social', title: 'Négociations salariales : recommandation patronale et grille 2026', out: 'actualites/2026-07-01-negociations-salariales-grille-2026.pdf' },
  { k: 'appel-a-candidatures-pnmr4-pour-les-tests-fonctionnels', date: '2026-06-09', cat: 'Appels à projets', title: 'Appel à candidatures PNMR4 pour les tests fonctionnels', out: 'actualites/2026-06-09-appel-candidatures-pnmr4.pdf' },
  { k: 'greve-nationale-historique-des-salaries-des-laboratoires', date: '2026-05-04', cat: 'Social', title: 'Grève nationale historique des salariés des laboratoires', out: 'actualites/2026-05-04-greve-nationale-salaries-laboratoires.pdf' },
  { k: 'innovation-diagnostique-deploiement-du-rihn-2-0', date: '2026-04-16', cat: 'Nomenclature', title: 'Innovation diagnostique : déploiement du RIHN 2.0', out: 'actualites/2026-04-16-deploiement-rihn-2-0.pdf' },
  { k: 'radiation-de-la-vitesse-de-sedimentation-vs-de-la-nabm', date: '2026-02-04', cat: 'Nomenclature', title: 'Radiation de la vitesse de sédimentation (VS) de la NABM', out: 'actualites/2026-02-04-radiation-vs-nabm.pdf' }
];

const LOGO = '<svg class="mark" viewBox="0 0 120 120"><defs><clipPath id="c"><circle cx="44" cy="44" r="36"/></clipPath></defs><circle cx="44" cy="44" r="36" fill="#5E6266"/><circle cx="76" cy="76" r="36" fill="#A3BE3C"/><circle cx="76" cy="76" r="36" fill="#5F7A2B" clip-path="url(#c)"/></svg>';
const CSS = `
@page{size:A4;margin:18mm 20mm 20mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Figtree,sans-serif;color:#3F4347;font-size:11pt;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.head{display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid #DADDD6}
.mark{width:40px;height:40px;flex:0 0 auto}
.word{font-family:Nunito,sans-serif;font-weight:900;font-size:25px;letter-spacing:.01em;color:#2E3236;line-height:1}
.sig{font-family:Nunito,sans-serif;font-weight:700;font-size:9.5pt;line-height:1.2;color:#5E6266}
.sig span{display:block;color:#5F7A2B}
.kind{margin-left:auto;font-size:9.5pt;font-weight:600;color:#5E6266;text-transform:none}
.rule{position:relative;height:2px;width:56px;background:#A3BE3C;margin:-1px 0 26px}
.meta{font-size:10pt;font-weight:600;color:#5F7A2B;margin-bottom:8px}
.meta i{font-style:normal;color:#5E6266;font-weight:500}
h1{font-size:21pt;line-height:1.2;font-weight:700;color:#2E3236;margin-bottom:18px;letter-spacing:-.005em}
p{margin-bottom:11px;white-space:pre-line;orphans:3;widows:3}
p.li{margin-bottom:5px;padding-left:14px;text-indent:-14px}
p+p.li{margin-top:-4px}
p.li+p:not(.li){margin-top:10px}
table{width:100%;border-collapse:collapse;margin:4px 0 14px;font-size:10pt}
th{text-align:left;font-weight:700;color:#2E3236;border-bottom:1px solid #A3BE3C;padding:4px 8px 4px 0}
td{border-bottom:1px solid #E6E8E3;padding:3px 8px 3px 0;vertical-align:top}
td:last-child{font-variant-numeric:tabular-nums;color:#5E6266}
p.chapo{font-size:12.5pt;line-height:1.5;color:#2E3236;font-weight:500;margin-bottom:14px}
h2{font-size:13pt;font-weight:700;color:#2E3236;margin:20px 0 8px;break-after:avoid}
h3{font-size:11pt;font-weight:700;color:#5F7A2B;margin:16px 0 4px;break-after:avoid}
.date{color:#5E6266;margin-bottom:6px}
.joint{margin-top:18px;padding:10px 14px;border-left:3px solid #A3BE3C;background:#F7F8F4;font-size:10.5pt;color:#2E3236}
.foot{margin-top:28px;padding-top:10px;border-top:1px solid #DADDD6;font-size:9pt;color:#5E6266}
`;
const page = (kind, title, body) => `<!doctype html><html lang="fr"><head><meta charset="utf-8"><title>${esc(title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=Nunito:wght@700;900&display=swap">
<style>${CSS}</style></head><body>
<div class="head">${LOGO}<span class="word">SLBC</span><span class="sig">Syndicat des Laboratoires<span>de Biologie Clinique</span></span><span class="kind">${esc(kind)}</span></div>
<div class="rule"></div>
${body}
<p class="foot">SLBC, Syndicat des Laboratoires de Biologie Clinique · 6 place de la Madeleine, 75008 Paris</p>
</body></html>`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext();
  await ctx.route('https://fonts.googleapis.com/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, 'google.css'), 'utf8') }));
  await ctx.route('https://fonts.gstatic.com/**', (r) => { const n = fs.readdirSync(FONTDIR).find((x) => x.endsWith(path.basename(r.request().url()))); r.fulfill({ status: 200, contentType: 'font/woff2', headers: { 'Access-Control-Allow-Origin': '*' }, body: fs.readFileSync(path.join(FONTDIR, n)) }); });
  const p = await ctx.newPage();
  const make = async (html, out) => {
    await p.setContent(html, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
    const ok = await p.evaluate(() => document.fonts.check('700 16px Figtree') && document.fonts.check('900 16px Nunito'));
    if (!ok) throw new Error('polices absentes : ' + out);
    fs.mkdirSync(path.dirname(path.join(OUT, out)), { recursive: true });
    await p.pdf({ path: path.join(OUT, out), format: 'A4', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: '<div style="width:100%;font-size:8px;color:#5E6266;text-align:right;padding:0 20mm 0 0;font-family:sans-serif"><span class="pageNumber"></span> / <span class="totalPages"></span></div>' });
    console.log('ok', out);
  };
  for (const a of ARTS) {
    const blocks = C[a.k].blocks.filter((x) => x.t !== 'img' && !/^Télécharger/.test(x.x));
    let body = '<p class="meta">' + esc(a.cat) + ' <i>· ' + esc(longDate(a.date)) + '</i></p><h1>' + esc(a.title) + '</h1>';
    body += blocks.map((x, i) => (x.t === 'p' ? paras(x.x, i === 0 && blocks.length > 1 ? 'chapo' : '') : '<h2>' + esc(x.x) + '</h2>')).join('\n');
    if (a.joint) body += '<p class="joint">Document joint : ' + esc(a.joint) + '. Il s’ouvre depuis la page Actualités du site du SLBC.</p>';
    await make(page('Actualité', a.title, body), a.out);
  }
  // Statuts : seulement le texte des statuts (à partir de « Paris, le 16 novembre 2013 »)
  const st = C['le-syndicat_les-statuts-du-slbc'].blocks;
  const i0 = st.findIndex((x) => /^Paris, le 16 novembre 2013/.test(x.x || ''));
  let sb = '<h1>Statuts du Syndicat des Laboratoires de Biologie Clinique</h1><p class="date">' + esc(st[i0].x) + '</p>';
  sb += st.slice(i0 + 1).filter((x) => x.t !== 'img').map((x) => (x.t === 'h3' ? '<h3>' + esc(x.x.replace(/\s*:\s*$/, '')) + '</h3>' : statPara(x.x))).join('\n');
  await make(page('Statuts', 'Statuts du SLBC', sb), 'syndicat/statuts-slbc.pdf');
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
