"""Planche « Gris de l'onglet Actualités » : le gris actuel et quatre gris plus clairs, proches du gris Nardo,
montrés sur le bandeau de la page Actualités et la bannière Actualités de l'accueil (captures du site)."""
import base64, sys, pathlib
D = pathlib.Path(sys.argv[1]); OUT = sys.argv[2]
LOGO = open(sys.argv[3], encoding='utf-8').read()

def lum(h):
    h = h.lstrip('#'); r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def cr(a, b):
    x, y = lum(a), lum(b); return (max(x, y) + .05) / (min(x, y) + .05)

G = [
 ('actuel', 'Aujourd’hui sur le site', '#2E3236', 'Le gris encre de la palette, presque noir.', None),
 ('g1', '1. Gris du logo', '#5E6266', 'Le gris du rond du logo : déjà dans la charte, il relie l’onglet au logo.', None),
 ('g2', '2. Gris Nardo', '#686A6C', 'Le gris Nardo : un gris moyen, neutre, légèrement froid.', None),
 ('g3', '3. Nardo éclairci', '#6E7174', 'Un cran plus clair que le gris Nardo.', None),
 ('g4', '4. Le plus clair possible', '#74777A', 'Le gris le plus clair qui garde le texte blanc lisible (au seuil d’accessibilité).', None),
]
img = lambda p: 'data:image/jpeg;base64,' + base64.b64encode((D / p).read_bytes()).decode()
fr = lambda x: ('%.1f' % x).replace('.', ',')
rows = []
for k, nom, hexa, desc, _ in G:
    c = cr(hexa, '#FFFFFF')
    note = 'Texte blanc : contraste ' + fr(c) + ' pour 1' + ('' if k != 'actuel' else '') + (' (au minimum de 4,5 pour 1 exigé)' if c < 4.6 else '')
    rows.append(f'''<section class="prop{' ref' if k == 'actuel' else ''}" id="{k}">
  <div class="prop-head"><span class="pastille" style="background:{hexa}" aria-hidden="true"></span><div><h2>{nom} <span class="hexa">{hexa}</span></h2><p>{desc}</p><p class="note">{note}</p></div></div>
  <div class="vues">
    <figure><img src="{img(k + '-page.jpg')}" alt="Bandeau de la page Actualités sur le gris {hexa}" width="1280" height="404"><figcaption>Page Actualités</figcaption></figure>
    <figure><img src="{img(k + '-accueil.jpg')}" alt="Bannière Actualités de l’accueil sur le gris {hexa}" width="1280" height="850"><figcaption>Accueil, bannière Actualités</figcaption></figure>
  </div>
</section>''')

html = f'''<title>Gris des Actualités SLBC</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Planche de test : le gris actuel de l’onglet Actualités et quatre gris plus clairs proches du gris Nardo,
   chacun en capture du site. Charte du site : thème clair seulement. Une ligne par gris. */
:root{{
  --vert:#5F7A2B; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD;
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1180px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:22px}}
h1,h2{{color:var(--encre);margin:0;text-wrap:balance}}
p{{margin:0}}
.entete{{display:flex;align-items:center;gap:12px}}
.entete svg{{width:44px;height:44px;flex:none}}
.entete .nom{{font-weight:900;font-size:28px;line-height:1;color:var(--texte)}}
.titre{{display:flex;flex-direction:column;gap:10px;max-width:52em}}
.titre h1{{font-size:clamp(30px,4.4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:18px}}
.prop{{display:flex;flex-direction:column;gap:16px;padding:22px;border-radius:22px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06)}}
.prop.ref{{background:transparent;box-shadow:inset 0 0 0 1.5px var(--filet)}}
.prop-head{{display:flex;gap:16px;align-items:flex-start}}
.pastille{{flex:none;width:56px;height:56px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}}
.prop-head h2{{font-size:21px;font-weight:800}}
.hexa{{margin-left:8px;font-size:15px;font-weight:600;color:var(--gris);font-variant-numeric:tabular-nums}}
.prop-head p{{font-size:15.5px;max-width:46em}}
.prop-head .note{{margin-top:2px;font-size:14px;color:var(--gris)}}
.vues{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}}
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px}}
figcaption{{font-size:14px;font-weight:600;color:var(--encre);text-align:center}}
.pied{{font-size:14px;color:var(--gris);max-width:62em}}
@media (max-width:760px){{.vues{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre">
    <h1>Gris des Actualités</h1>
    <p>Le gris actuel de l’onglet Actualités, puis quatre gris plus clairs, proches du gris Nardo. Chaque gris est montré sur le bandeau de la page Actualités et sur la bannière Actualités de l’accueil. Sur ces gris, tous les textes passent en blanc pour rester lisibles.</p>
  </div>
  {"".join(rows)}
  <p class="pied">Planche de test du 8 novembre 2026. Plus le gris est clair, moins le texte blanc ressort : au-delà du gris 4, il ne serait plus assez lisible pour tout le monde. Le gris encre actuel reste utilisé ailleurs (première porte de l’espace adhérent, case « veille » de la page Adhérer).</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
