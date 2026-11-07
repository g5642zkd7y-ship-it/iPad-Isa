"""Planche « Flèches des liens » : quatre propositions dessinées dans le style des mascottes et des pastilles,
chacune montrée sur les fonds du site (blanc, vert clair, vert foncé, gris foncé) avec de vrais liens."""
import sys
OUT = sys.argv[1]
LOGO = open(sys.argv[2], encoding='utf-8').read() if len(sys.argv) > 2 else ''

# Chaque flèche : (lettre, nom, description, svg) ; le svg prend la couleur du lien (currentColor).
F = [
 ('A', 'Flèche au marqueur',
  'Tige un peu courbe, pointe ouverte, bouts arrondis : la flèche actuellement sur la maquette.',
  '<svg class="fl" viewBox="0 0 20 14" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
  '<path d="M2.2 7.9 Q8.5 6.1 16.4 7.1"/><path d="M11.6 2.6 Q14.6 4.9 16.8 7.2 Q14.4 9.3 11.9 11.7"/></svg>'),
 ('B', 'Flèche en arc',
  'La tige monte puis redescend vers la pointe, comme un petit bond : plus vivante, dans l’esprit des mascottes.',
  '<svg class="fl fl-b" viewBox="0 0 20 13" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'
  '<path d="M2 11 Q8 2.6 16.6 6.7"/><path d="M13.4 1.6 L16.9 6.8 L10.9 8.3"/></svg>'),
 ('C', 'Mini-pastille',
  'La flèche dans un petit rond blanc posé sur le rond vert anis, comme les pastilles des missions, en miniature.',
  '<svg class="fl fl-c" viewBox="0 0 26 26" aria-hidden="true" fill="none" stroke="#2E3236" stroke-linecap="round" stroke-linejoin="round">'
  '<circle cx="14.6" cy="14.6" r="10" fill="#A3BE3C" stroke="none"/>'
  '<circle cx="12" cy="12" r="10" fill="#FFFFFF" stroke-width="1.8"/>'
  '<path d="M7.4 12.3 Q11 11.4 15.6 11.9" stroke-width="2"/><path d="M12.6 8.8 Q14.7 10.4 16.1 12 Q14.5 13.6 12.8 15.2" stroke-width="2"/></svg>'),
 ('D', 'Flèche pleine',
  'Une flèche courte et épaisse, remplie, aux angles arrondis : bien visible, même en petit.',
  '<svg class="fl fl-d" viewBox="0 0 18 14" aria-hidden="true" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">'
  '<path d="M2 5.4 L9.6 5.4 L9.6 1.8 L16.2 7 L9.6 12.2 L9.6 8.6 L2 8.6 Z"/></svg>'),
]

FONDS = [
 ('blanc', 'Sur fond blanc', 'Toutes les actualités'),
 ('vert-clair', 'Flash Info (vert clair)', 'Lire le protocole signé (13 pages)'),
 ('vert', 'Bandeau de la veille (vert foncé)', 'En savoir plus'),
 ('encre', 'Actualités (gris foncé)', 'Toutes les actualités'),
]

lignes = []
for k, nom, desc, svg in F:
    cases = ''.join(f'<div class="fond f-{c}"><span class="fond-n">{t}</span><a class="lien" href="#prop-{k.lower()}">{l.rsplit(" ", 1)[0]} <span class="fin">{l.rsplit(" ", 1)[1]}{svg}</span></a></div>' for c, t, l in FONDS)
    lignes.append(f'''<section class="prop" id="prop-{k.lower()}" aria-labelledby="t-{k.lower()}">
  <div class="prop-head"><span class="lettre">{k}</span><div><h2 id="t-{k.lower()}">{nom}</h2><p>{desc}</p></div><div class="grand" aria-hidden="true">{svg}</div></div>
  <div class="fonds">{cases}</div>
</section>''')

html = f'''<title>Flèches des liens SLBC</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Quatre propositions de flèches pour les liens « Lire… » du site SLBC, montrées sur les fonds du site.
   Charte du site : thème clair seulement, palette du logo. Une ligne par proposition. */
:root{{
  --anis:#A3BE3C; --vert:#5F7A2B; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD;
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1180px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:24px}}
h1,h2{{color:var(--encre);margin:0;text-wrap:balance}}
p{{margin:0}}
.entete{{display:flex;align-items:center;gap:12px}}
.entete svg{{width:44px;height:44px;flex:none}}
.entete .nom{{font-weight:900;font-size:28px;line-height:1;color:var(--texte)}}
.titre{{display:flex;flex-direction:column;gap:10px;max-width:50em}}
.titre h1{{font-size:clamp(30px,4.4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:18px}}
.prop{{display:flex;flex-direction:column;gap:16px;padding:22px;border-radius:22px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06)}}
.prop-head{{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:16px;align-items:center}}
.lettre{{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--vert-clair);color:var(--encre);font-weight:900;font-size:22px}}
.prop-head h2{{font-size:21px;font-weight:800}}
.prop-head p{{font-size:15.5px;color:var(--gris);max-width:44em}}
.grand{{color:var(--vert);padding:6px 10px}}
.grand .fl{{width:64px;height:auto}}
.grand .fl-c{{width:52px}}
.fonds{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}}
.fond{{display:flex;flex-direction:column;gap:10px;justify-content:space-between;min-width:0;min-height:112px;padding:16px;border-radius:14px}}
.fond-n{{font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}}
.f-blanc{{background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}.f-blanc .fond-n{{color:var(--gris)}}.f-blanc .lien{{color:var(--vert)}}
.f-vert-clair{{background:var(--vert-clair)}}.f-vert-clair .fond-n{{color:var(--encre)}}.f-vert-clair .lien{{color:var(--encre)}}
.f-vert{{background:var(--vert)}}.f-vert .fond-n{{color:#fff}}.f-vert .lien{{color:#fff}}
.f-encre{{background:var(--encre)}}.f-encre .fond-n{{color:#D3D6D8}}.f-encre .lien{{color:var(--vert-clair)}}
.lien{{font-size:17px;font-weight:600;line-height:1.35;text-decoration:none}}
.lien:hover{{text-decoration:underline;text-underline-offset:3px}}
.fin{{white-space:nowrap}}
.lien .fl{{display:inline-block;width:1.05em;height:.74em;margin-left:.36em;vertical-align:-.02em;overflow:visible}}
.lien .fl-b{{width:1.2em;height:.8em;vertical-align:-.04em}}
.lien .fl-c{{width:1.3em;height:1.3em;vertical-align:-.32em;margin-left:.3em}}
.lien .fl-d{{width:.95em}}
.pied{{font-size:14px;color:var(--gris)}}
@media (max-width:900px){{.fonds{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}
@media (max-width:520px){{.fonds{{grid-template-columns:minmax(0,1fr)}}.prop-head{{grid-template-columns:auto minmax(0,1fr)}}.grand{{display:none}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre">
    <h1>Flèches des liens</h1>
    <p>Quatre propositions pour la petite flèche des liens « Lire… », « En savoir plus » et « Toutes les actualités ». Chacune est montrée en grand, puis à sa vraie taille sur les quatre fonds du site.</p>
  </div>
  {"".join(lignes)}
  <p class="pied">Propositions du 7 novembre 2026. Toutes sont de vrais dessins dans le lien : elles s’affichent de la même façon sur iPad, iPhone et ordinateur.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
