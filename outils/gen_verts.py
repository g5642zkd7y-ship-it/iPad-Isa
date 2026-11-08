"""Planche « Couleur de la veille et de l'espace adhérent » : le vert foncé actuel et quatre propositions plus claires,
montrées en captures du site sur les quatre grandes zones (page Veille, Espace adhérent, bannières « Chaque lundi »
et « Rejoindre le SLBC » de l'accueil).

python3 gen_verts.py <propositions.json> <sortie.html> <logo.svg>
propositions.json : liste de {cle, nom, fond, texte, description, captures: {veille, espace, accueil_veille, accueil_join}}
(la première entrée est l'état actuel)."""
import base64, io, json, sys
from PIL import Image

P = json.load(open(sys.argv[1], encoding='utf-8')); OUT = sys.argv[2]
LOGO = open(sys.argv[3], encoding='utf-8').read()

def lum(h):
    h = h.lstrip('#'); r, g, b = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    f = lambda v: v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
def cr(a, b):
    x, y = lum(a), lum(b); return (max(x, y) + .05) / (min(x, y) + .05)
fr = lambda x: ('%.1f' % x).replace('.', ',')

def img(path):
    im = Image.open(path).convert('RGB')
    if im.width > 1280: im = im.resize((1280, round(im.height * 1280 / im.width)))
    b = io.BytesIO(); im.save(b, 'JPEG', quality=82, optimize=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), im.width, im.height

VUES = [('veille', 'Page Veille réglementaire'), ('espace', 'Espace adhérent'),
        ('accueil_veille', 'Accueil, « Chaque lundi »'), ('accueil_join', 'Accueil, « Rejoindre le SLBC »')]
rows = []
for i, p in enumerate(P):
    ref = i == 0
    nom_texte = 'blanc' if p['texte'].upper() in ('#FFF', '#FFFFFF') else 'foncé'
    note = f'Texte {nom_texte} : contraste {fr(cr(p["fond"], p["texte"]))} pour 1 (4,5 pour 1 au minimum)'
    figs = []
    for k, legende in VUES:
        src, w, h = img(p['captures'][k])
        figs.append(f'<figure><img src="{src}" alt="{legende}, {p["nom"]}" width="{w}" height="{h}" loading="lazy"><figcaption>{legende}</figcaption></figure>')
    titre = p['nom'] if ref else f'{i}. {p["nom"]}'
    rows.append(f'''<section class="prop{' ref' if ref else ''}" id="{p['cle']}">
  <div class="prop-head"><span class="pastille" style="background:{p['fond']}" aria-hidden="true"></span><div><h2>{titre} <span class="hexa">{p['fond']}</span></h2><p>{p['description']}</p><p class="note">{note}</p></div></div>
  <div class="vues">{''.join(figs)}</div>
</section>''')

html = f'''<title>Vert de la veille</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Planche de test : le vert foncé actuel des zones veille, espace adhérent et adhésion, et quatre propositions
   plus claires, chacune en captures du site. Charte du site : thème clair seulement. Une ligne par couleur. */
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
    <h1>Couleur de la veille et de l’espace adhérent</h1>
    <p>Le vert foncé actuel, puis quatre propositions plus claires. Chaque couleur est montrée sur les quatre grandes zones qui l’utilisent : le bandeau de la page Veille réglementaire, celui de l’Espace adhérent, et les bannières « Chaque lundi » et « Rejoindre le SLBC » de l’accueil.</p>
  </div>
  {"".join(rows)}
  <p class="pied">Planche de test du 8 novembre 2026, faite à partir de captures du site. Les boutons d’adhésion restent verts dans toutes les propositions. Le vert foncé reste la couleur des boutons et des liens du site.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
