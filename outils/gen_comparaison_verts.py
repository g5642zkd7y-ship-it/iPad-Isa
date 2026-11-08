"""Planche « Olive adouci ou sauge » : les deux propositions côte à côte, avec toutes les autres couleurs du site
(nuancier, bandeaux des pages dans l'ordre du menu, accueil complet, haut de l'espace adhérent).

python3 gen_comparaison_verts.py <captures olive> <captures sauge> <sortie.html> <logo.svg>"""
import base64, io, sys
from PIL import Image

DO, DS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
LOGO = open(sys.argv[4], encoding='utf-8').read()
OLIVE, SAUGE = '#657B3D', '#9BAF68'

def img(path, largeur, q=80):
    im = Image.open(path).convert('RGB')
    if im.width > largeur: im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    b = io.BytesIO(); im.save(b, 'JPEG', quality=q, optimize=True, progressive=True)
    return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), im.width, im.height

def fig(path, alt, legende, largeur, classe):
    src, w, h = img(path, largeur)
    return f'<figure class="{classe}"><img src="{src}" alt="{alt}" width="{w}" height="{h}" loading="lazy"><figcaption>{legende}</figcaption></figure>'

PAGES = [('syndicat', 'Le syndicat'), ('veille', 'Veille réglementaire'), ('presse', 'Salle de presse'),
         ('actualites', 'Actualités'), ('documentation', 'Documentation'), ('adherer', 'Adhérer'), ('espace', 'Espace adhérent')]
NOUVELLES = {'veille', 'espace'}
FONDS = {'syndicat': '#FFFFFF', 'presse': '#D6E4A6', 'actualites': '#74777A', 'documentation': '#ECEEE8', 'adherer': '#FFFFFF'}

def bande(c):
    return ''.join(f'<li><span class="c" style="background:{c if k in NOUVELLES else FONDS[k]}"></span><span class="n">{t}</span></li>' for k, t in PAGES)

def ligne(k, n):
    fo = OLIVE if k in NOUVELLES else FONDS[k]; fs = SAUGE if k in NOUVELLES else FONDS[k]
    return (f'<div class="tp-l{" tp-new" if k in NOUVELLES else ""}"><span class="tp-n">{n}</span>'
            f'<span class="tp-c" style="background:{fo}"></span><span class="tp-c" style="background:{fs}"></span></div>')
tableau = ''.join(ligne(k, n) for k, n in PAGES)

AUTRES = [('Vert clair', '#D6E4A6', 'Salle de presse, Flash Info'), ('Gris Nardo éclairci', '#74777A', 'Actualités, Nos représentants'),
          ('Gris pâle', '#ECEEE8', 'Documentation'), ('Fond clair', '#F7F8F4', 'Sections alternées, pied de page'),
          ('Blanc', '#FFFFFF', 'Fond des pages'), ('Vert anis', '#A3BE3C', 'Logo, pastilles'),
          ('Vert foncé du logo', '#5F7A2B', 'Boutons, liens'), ('Encre', '#2E3236', 'Titres, textes, traits des dessins')]
autres = ''.join(f'<li class="nu"><span class="nu-c" style="background:{h}"></span><span class="nu-t"><strong>{n}</strong><span class="nu-h">{h}</span><span class="nu-u">{u}</span></span></li>' for n, h, u in AUTRES)

bandeaux = ''.join(
    fig(f'{DO}/hero-{k}.png', f'Bandeau {t}, olive adouci', t + ' · olive adouci', 900, 'o' + (' nouv' if k in NOUVELLES else '')) +
    fig(f'{DS}/hero-{k}.png', f'Bandeau {t}, sauge', t + ' · sauge', 900, 's' + (' nouv' if k in NOUVELLES else ''))
    for k, t in PAGES)
accueil = fig(f'{DO}/accueil.png', 'Accueil complet, olive adouci', 'Olive adouci', 760, 'o nouv') + fig(f'{DS}/accueil.png', 'Accueil complet, sauge', 'Sauge', 760, 's nouv')
espace = fig(f'{DO}/espace-haut.png', 'Haut de l’espace adhérent, olive adouci', 'Olive adouci', 900, 'o nouv') + fig(f'{DS}/espace-haut.png', 'Haut de l’espace adhérent, sauge', 'Sauge', 900, 's nouv')

html = f'''<title>Olive adouci ou sauge</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Comparaison de deux propositions de vert pour les zones veille et espace adhérent, en captures du site.
   Colonne de gauche : olive adouci ; colonne de droite : sauge. Charte du site : thème clair seulement. */
:root{{
  --vert:#5F7A2B; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD; --olive:{OLIVE}; --sauge:{SAUGE};
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1180px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:22px}}
h1,h2,h3{{color:var(--encre);margin:0;text-wrap:balance}}
p,ul{{margin:0}}
.entete{{display:flex;align-items:center;gap:12px}}
.entete svg{{width:44px;height:44px;flex:none}}
.entete .nom{{font-weight:900;font-size:28px;line-height:1;color:var(--texte)}}
.titre{{display:flex;flex-direction:column;gap:10px;max-width:52em}}
.titre h1{{font-size:clamp(30px,4.4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:17.5px}}
.bloc{{display:flex;flex-direction:column;gap:16px;padding:22px;border-radius:22px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06)}}
.bloc h2{{font-size:22px;font-weight:800}}
.bloc > p{{font-size:15.5px;max-width:52em}}
.duo{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px 14px;align-items:start}}
.carte{{display:flex;flex-direction:column;gap:12px;padding:16px;border-radius:16px;box-shadow:inset 0 0 0 2px var(--c)}}
.carte.o{{--c:var(--olive)}}.carte.s{{--c:var(--sauge)}}
.carte-t{{display:flex;gap:14px;align-items:center}}
.carte-t .rond{{flex:none;width:64px;height:64px;border-radius:50%;background:var(--c)}}
.carte-t h3{{font-size:20px;font-weight:800}}
.carte-t .hexa{{display:block;font-size:14px;font-weight:600;color:var(--gris);font-variant-numeric:tabular-nums}}
.carte p{{font-size:15px}}
.carte ul{{padding-left:1.1em;font-size:14.5px;display:flex;flex-direction:column;gap:4px}}
.carte .bande{{list-style:none;padding:0;display:grid;flex-direction:row;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}}
.carte .bande li{{display:flex;flex-direction:column;gap:5px;min-width:0}}
.carte .bande .c{{height:44px;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(46,50,54,.14)}}
.carte .bande .n{{font-size:11.5px;line-height:1.2;color:var(--encre);text-align:center;overflow-wrap:anywhere}}
.nuancier{{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}}
.nu{{display:flex;gap:12px;align-items:center;padding:9px;border-radius:14px;box-shadow:inset 0 0 0 1px var(--filet)}}
.nu-c{{flex:none;width:48px;height:48px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.1)}}
.nu-t{{display:flex;flex-direction:column;min-width:0;line-height:1.35}}
.nu-t strong{{color:var(--encre);font-size:15px}}
.nu-h,.nu-u{{font-size:13.5px}}.nu-h{{color:var(--gris);font-variant-numeric:tabular-nums}}
.colonnes{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;padding:4px 0}}
.colonnes span{{display:flex;align-items:center;gap:8px;justify-content:center;font-weight:800;color:var(--encre);font-size:17px}}
.colonnes i{{width:18px;height:18px;border-radius:50%}}
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px var(--filet)}}
figure.o.nouv img{{box-shadow:0 0 0 3px var(--olive)}}
figure.s.nouv img{{box-shadow:0 0 0 3px var(--sauge)}}
figcaption{{font-size:14px;font-weight:600;color:var(--encre);text-align:center}}
.pied{{font-size:14px;color:var(--gris);max-width:62em}}
.tp{{display:flex;flex-direction:column;gap:6px;max-width:760px}}
.tp-l{{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:center}}
.tp-h span{{font-size:14px;font-weight:800;color:var(--encre);text-align:center}}
.tp-n{{font-size:15px;color:var(--encre)}}
.tp-new .tp-n{{font-weight:800}}
.tp-c{{height:40px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(46,50,54,.14)}}
@media (max-width:560px){{.duo-cartes{{grid-template-columns:minmax(0,1fr)}}.tp-n{{font-size:14px}}.tp-c{{height:34px}}.duo{{gap:12px 8px}}.carte{{padding:12px}}.carte-t .rond{{width:44px;height:44px}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre">
    <h1>Olive adouci ou sauge</h1>
    <p>Les deux propositions côte à côte pour les zones de la veille et de l’espace adhérent : l’olive adouci à gauche, la sauge à droite. Chacune est montrée avec toutes les autres couleurs du site.</p>
  </div>

  <section class="bloc" aria-labelledby="t-deux">
    <h2 id="t-deux">Les deux verts</h2>
    <div class="duo duo-cartes">
      <div class="carte o"><div class="carte-t"><span class="rond" aria-hidden="true"></span><h3>Olive adouci<span class="hexa">{OLIVE}</span></h3></div>
        <p>Le même vert que le logo, en plus calme : un tiers de couleur en moins, un fond à peine plus clair.</p>
        <ul><li>Textes blancs, comme aujourd’hui.</li><li>Seul ajout : un fin liseré vert clair autour du bouton « Demander mon adhésion ».</li></ul>
</div>
      <div class="carte s"><div class="carte-t"><span class="rond" aria-hidden="true"></span><h3>Sauge<span class="hexa">{SAUGE}</span></h3></div>
        <p>Un vert nettement plus clair, à mi-chemin entre le vert foncé et le vert clair du logo.</p>
        <ul><li>Textes en gris très foncé ; bouton d’adhésion vert foncé ; boutons cernés d’un liseré foncé.</li><li>Ronds des pastilles en vert foncé ; petit logo des titres posé dans un rond blanc.</li></ul>
</div>
    </div>
    <h3 style="font-size:17px">La couleur du haut de chaque page, dans l’ordre du menu</h3>
    <div class="tp" role="img" aria-label="Couleur du haut de chaque page, avec l’olive adouci puis avec la sauge : seules Veille réglementaire et Espace adhérent changent.">
      <div class="tp-l tp-h"><span class="tp-n"></span><span>Olive adouci</span><span>Sauge</span></div>{tableau}</div>
    <h3 style="font-size:17px">Les autres couleurs du site, qui ne changent pas</h3>
    <ul class="nuancier">{autres}</ul>
  </section>

  <section class="bloc" aria-labelledby="t-bandeaux">
    <h2 id="t-bandeaux">Le haut des pages, dans l’ordre du menu</h2>
    <p>Seuls les bandeaux Veille réglementaire et Espace adhérent, entourés, changent de couleur.</p>
    <div class="colonnes" aria-hidden="true"><span><i style="background:var(--olive)"></i>Olive adouci</span><span><i style="background:var(--sauge)"></i>Sauge</span></div>
    <div class="duo">{bandeaux}</div>
  </section>

  <section class="bloc" aria-labelledby="t-accueil">
    <h2 id="t-accueil">L’accueil de haut en bas</h2>
    <p>Les bannières « Chaque lundi » et « Rejoindre le SLBC » changent de couleur ; le Flash Info, « Ce que nous défendons » et les Actualités ne changent pas.</p>
    <div class="duo">{accueil}</div>
  </section>

  <section class="bloc" aria-labelledby="t-espace">
    <h2 id="t-espace">Le haut de l’espace adhérent</h2>
    <p>Le bandeau et, dessous, les quatre portes, qui gardent leurs couleurs (la porte « Lettre d’information » reste en vert foncé).</p>
    <div class="duo">{espace}</div>
  </section>

  <p class="pied">Planche de test du 8 novembre 2026, faite à partir de captures du site. Le site n’est pas modifié. Les mascottes ne changent pas. Les boutons d’adhésion restent verts.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
