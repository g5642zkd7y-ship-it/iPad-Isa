"""Planche « harmonie » : une proposition de couleur pour les zones veille et espace adhérent, montrée avec toutes les
autres couleurs du site (nuancier, bandeaux de toutes les pages dans l'ordre du menu, accueil complet, haut de
l'espace adhérent), à côté de l'état actuel.

python3 gen_harmonie.py <proposition.json> <captures proposition> <captures actuelles> <sortie.html> <logo.svg>
proposition.json : {nom, titre, fond, texte, description}"""
import base64, io, json, sys
from PIL import Image

P = json.load(open(sys.argv[1], encoding='utf-8'))
DP, DA, OUT = sys.argv[2], sys.argv[3], sys.argv[4]
LOGO = open(sys.argv[5], encoding='utf-8').read()

def img(path, largeur=1280, q=80):
    im = Image.open(path).convert('RGB')
    if im.width > largeur: im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), im.width, im.height

def fig(path, alt, legende, largeur=1280, classe=''):
    src, w, h = img(path, largeur)
    return f'<figure class="{classe}"><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy"><figcaption>{legende}</figcaption></figure>'

NOM = P['nom']
COULEURS = [
    (NOM, P['fond'], 'Veille réglementaire, Espace adhérent, bannières « Chaque lundi » et « Rejoindre le SLBC »', True),
    ('Vert clair', '#D6E4A6', 'Salle de presse, Flash Info, une porte de l’espace adhérent', False),
    ('Gris Nardo éclairci', '#74777A', 'Actualités, Nos représentants, une porte de l’espace adhérent', False),
    ('Gris pâle', '#ECEEE8', 'Documentation', False),
    ('Fond clair', '#F7F8F4', 'Sections alternées, pied de page', False),
    ('Blanc', '#FFFFFF', 'Fond des pages', False),
    ('Vert anis', '#A3BE3C', 'Logo, pastilles, une porte de l’espace adhérent', False),
    ('Vert foncé du logo', '#5F7A2B', 'Boutons, liens, une porte de l’espace adhérent', False),
    ('Encre', '#2E3236', 'Titres, textes, traits des dessins', False),
]
nuancier = ''.join(
    f'<li class="nu{" nu-new" if new else ""}"><span class="nu-c" style="background:{h}"></span>'
    f'<span class="nu-t"><strong>{n}</strong><span class="nu-h">{h}</span><span class="nu-u">{u}</span></span></li>'
    for n, h, u, new in COULEURS)

PAGES = [('syndicat', 'Le syndicat'), ('veille', 'Veille réglementaire'), ('presse', 'Salle de presse'),
         ('actualites', 'Actualités'), ('documentation', 'Documentation'), ('adherer', 'Adhérer'), ('espace', 'Espace adhérent')]
NOUVELLES = {'veille', 'espace'}
FONDS = {'syndicat': '#FFFFFF', 'veille': 'var(--prop)', 'presse': '#D6E4A6', 'actualites': '#74777A', 'documentation': '#ECEEE8', 'adherer': '#FFFFFF', 'espace': 'var(--prop)'}
bande = ''.join(f'<li><span class="c" style="background:{FONDS[k]}"></span><span class="n">{t}</span></li>' for k, t in PAGES)
bandeaux = ''.join(fig(f'{DP}/hero-{k}.png', f'Bandeau de la page {t}', f'{t}{" · " + NOM.lower() if k in NOUVELLES else ""}', 1280,
                       'nouv' if k in NOUVELLES else '') for k, t in PAGES)

accueil = (fig(f'{DA}/accueil.png', 'Accueil complet aujourd’hui', 'Aujourd’hui', 760) +
           fig(f'{DP}/accueil.png', f'Accueil complet avec {NOM.lower()}', f'Avec {NOM.lower()}', 760, 'nouv'))
espace = (fig(f'{DA}/espace-haut.png', 'Haut de l’espace adhérent aujourd’hui', 'Aujourd’hui', 900) +
          fig(f'{DP}/espace-haut.png', f'Haut de l’espace adhérent avec {NOM.lower()}', f'Avec {NOM.lower()}', 900, 'nouv'))

html = f'''<title>{P["titre"]}</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Planche d'harmonie : une proposition de couleur avec toutes les couleurs du site, en captures du site.
   Charte du site : thème clair seulement. */
:root{{
  --vert:#5F7A2B; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD; --prop:{P["fond"]};
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
.titre{{display:flex;gap:20px;align-items:center}}
.titre .grosse{{flex:none;width:84px;height:84px;border-radius:50%;background:var(--prop);box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}}
.titre div{{display:flex;flex-direction:column;gap:8px;max-width:52em}}
.titre h1{{font-size:clamp(28px,4.2vw,40px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:17.5px}}
.bloc{{display:flex;flex-direction:column;gap:16px;padding:22px;border-radius:22px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06)}}
.bloc h2{{font-size:22px;font-weight:800}}
.bloc > p{{font-size:15.5px;max-width:52em}}
.nuancier{{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}}
.nu{{display:flex;gap:12px;align-items:center;padding:10px;border-radius:14px;box-shadow:inset 0 0 0 1px var(--filet)}}
.nu-new{{box-shadow:inset 0 0 0 2px var(--prop)}}
.nu-c{{flex:none;width:58px;height:58px;border-radius:12px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}}
.nu-t{{display:flex;flex-direction:column;min-width:0;line-height:1.35}}
.nu-t strong{{color:var(--encre);font-size:15.5px}}
.nu-h{{font-size:13.5px;color:var(--gris);font-variant-numeric:tabular-nums}}
.nu-u{{font-size:13.5px;color:var(--texte)}}
.bande{{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}}
.bande li{{display:flex;flex-direction:column;gap:6px;min-width:0}}
.bande .c{{height:64px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(46,50,54,.14)}}
.bande .n{{font-size:13px;line-height:1.25;color:var(--encre);text-align:center;overflow-wrap:anywhere}}
@media (max-width:560px){{.bande{{grid-template-columns:repeat(4,minmax(0,1fr))}}}}
.grille{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px 14px;align-items:start}}
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px var(--filet)}}
figure.nouv img{{box-shadow:0 0 0 3px var(--prop)}}
figcaption{{font-size:14px;font-weight:600;color:var(--encre);text-align:center}}
.pied{{font-size:14px;color:var(--gris);max-width:62em}}
@media (max-width:760px){{.grille{{grid-template-columns:minmax(0,1fr)}}.titre .grosse{{width:60px;height:60px}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre"><span class="grosse" aria-hidden="true"></span><div>
    <h1>{NOM} avec les couleurs du site</h1>
    <p>{P["description"]}</p>
  </div></div>

  <section class="bloc" aria-labelledby="t-nuancier">
    <h2 id="t-nuancier">Les couleurs du site</h2>
    <p>La nouvelle couleur, entourée, à côté de toutes les autres couleurs du site. La bande dessous les montre côte à côte, dans l’ordre des onglets du menu.</p>
    <ul class="nuancier">{nuancier}</ul>
    <ul class="bande" aria-label="Couleur du bandeau de chaque onglet">{bande}</ul>
  </section>

  <section class="bloc" aria-labelledby="t-bandeaux">
    <h2 id="t-bandeaux">Les bandeaux des pages, dans l’ordre du menu</h2>
    <p>Le haut de chaque page du site. Les deux bandeaux entourés prennent la nouvelle couleur ; les autres ne changent pas.</p>
    <div class="grille">{bandeaux}</div>
  </section>

  <section class="bloc" aria-labelledby="t-accueil">
    <h2 id="t-accueil">L’accueil de haut en bas</h2>
    <p>Toute la page d’accueil, aujourd’hui et avec {NOM.lower()} : les bannières « Chaque lundi » et « Rejoindre le SLBC » changent de couleur ; le Flash Info, « Ce que nous défendons » et les Actualités restent comme aujourd’hui.</p>
    <div class="grille">{accueil}</div>
  </section>

  <section class="bloc" aria-labelledby="t-espace">
    <h2 id="t-espace">Le haut de l’espace adhérent</h2>
    <p>Le bandeau et, dessous, les quatre portes de l’espace adhérent, qui gardent leurs couleurs.</p>
    <div class="grille">{espace}</div>
  </section>

  <p class="pied">Planche de test du 8 novembre 2026, faite à partir de captures du site. Le site n’est pas modifié. Les mascottes ne changent pas. Les boutons d’adhésion restent verts.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
