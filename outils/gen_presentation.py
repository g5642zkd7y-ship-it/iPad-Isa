"""Planche « Menus et textes d'introduction » (10 novembre 2026, demande d'Isabelle Eimer : rendre le menu principal, les sous-menus et
les textes de présentation des onglets plus en accord avec le reste du site, et bien les distinguer ; « fais 4 propositions sur une planche »).
Le site aujourd'hui, puis quatre propositions, chacune en captures du site (iPad à l'horizontale et téléphone).
usage : python3 gen_presentation.py <dossier des captures> <fichier de sortie> <logo svg>"""
import base64, sys, pathlib
D = pathlib.Path(sys.argv[1]); OUT = sys.argv[2]
LOGO = open(sys.argv[3], encoding='utf-8').read()
NB, FINE = ' ', ' '

P = [
 ('actuel', 'Aujourd’hui sur le site', None,
  [('Menu principal', 'texte gris, onglet ouvert souligné d’un trait fin vert foncé.'),
   ('Sous-menu', 'le même texte gris, un peu plus petit : on le confond avec le menu principal.'),
   ('Texte d’introduction', 'texte courant gris ou blanc, sans rien qui le distingue.')]),
 ('p1', '1. Sobre', 'La différence vient de la typographie seule.',
  [('Menu principal', 'en gras, onglet ouvert en vert foncé, souligné d’un trait vert anis épais.'),
   ('Sous-menu', 'des étiquettes arrondies gris clair ; la rubrique où l’on se trouve passe en vert clair.'),
   ('Texte d’introduction', 'plus grand, en demi-gras, annoncé par un petit trait vert anis.')]),
 ('p2', '2. Au marqueur', 'Le trait des mascottes et des pastilles.',
  [('Menu principal', 'en gras, onglet ouvert souligné d’un trait ondulé vert anis, comme dessiné au marqueur.'),
   ('Sous-menu', 'des étiquettes cerclées d’un trait noir au marqueur ; la rubrique où l’on se trouve se remplit de vert anis.'),
   ('Texte d’introduction', 'dans une bulle, comme si la mascotte parlait, avec le décalage vert anis des pastilles et des grosses flèches.')]),
 ('p3', '3. Couleurs des onglets', 'Chaque page garde sa couleur jusque dans le menu.',
  [('Menu principal', 'l’onglet ouvert devient un pavé de la couleur de sa page (vert olive pour la Veille, gris pour les Actualités, vert clair pour la Presse, gris pâle ailleurs).'),
   ('Sous-menu', 'des petits pavés blancs bordés de gris ; la rubrique où l’on se trouve passe en vert foncé.'),
   ('Texte d’introduction', 'dans un cartouche blanc aux coins arrondis, comme le champ de recherche de la Documentation et les pavés des Actualités.')]),
 ('p4', '4. Signature', 'Les deux ronds du logo servent de repère.',
  [('Menu principal', 'l’onglet ouvert est marqué par les deux ronds du logo, en petit, sous le mot.'),
   ('Sous-menu', 'en gras, les rubriques séparées par des points vert anis ; la rubrique où l’on se trouve est marquée des deux ronds.'),
   ('Texte d’introduction', 'aligné à gauche le long d’un filet vert anis, comme les citations du site, en demi-gras.')]),
]
img = lambda p: 'data:image/jpeg;base64,' + base64.b64encode((D / p).read_bytes()).decode()
def fig(k, v, alt, cap, w, h):
    return f'<figure><img src="{img(k + "-" + v + ".jpg")}" alt="{alt}" width="{w}" height="{h}" loading="lazy"><figcaption>{cap}</figcaption></figure>'
from PIL import Image
def size(p):
    with Image.open(D / p) as i: return i.size

blocs = []
for k, nom, sous, lignes in P:
    dl = ''.join(f'<div><dt>{a}</dt><dd>{b}</dd></div>' for a, b in lignes)
    wv, hv = size(k + '-veille.jpg'); wp, hp = size(k + '-presse.jpg'); wa, ha = size(k + '-actualites.jpg'); ws, hs = size(k + '-syndicat.jpg')
    wt, ht = size(k + '-tel-veille.jpg'); wt2, ht2 = size(k + '-tel-syndicat.jpg')
    blocs.append(f'''<section class="prop{' ref' if k == 'actuel' else ''}" id="{k}" aria-labelledby="t-{k}">
  <div class="prop-head"><h2 id="t-{k}">{nom}</h2>{f'<p class="sous">{sous}</p>' if sous else ''}<dl>{dl}</dl></div>
  <div class="vues">
    <div class="ordi">
      {fig(k, 'veille', 'Haut de la page Veille réglementaire, ' + nom, 'Veille réglementaire', wv, hv)}
      {fig(k, 'presse', 'Haut de la Salle de presse, ' + nom, 'Salle de presse', wp, hp)}
      {fig(k, 'actualites', 'Haut de la page Actualités, ' + nom, 'Actualités', wa, ha)}
      {fig(k, 'syndicat', 'Menu principal et sous-menu de la page Le syndicat, ' + nom, 'Le syndicat : menu principal et sous-menu', ws, hs)}
    </div>
    <div class="tel">
      {fig(k, 'tel-veille', 'Veille réglementaire sur téléphone, ' + nom, 'Téléphone : Veille', wt, ht)}
      {fig(k, 'tel-syndicat', 'Le syndicat sur téléphone, ' + nom, 'Téléphone : Le syndicat', wt2, ht2)}
    </div>
  </div>
</section>''')

html = f'''<title>Menus et introductions</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Planche : le menu principal, les sous-menus et les textes d'introduction des onglets, aujourd'hui puis en quatre propositions,
   en captures du site. Charte du site : thème clair seulement. */
:root{{
  --vert:#5F7A2B; --anis:#A3BE3C; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD;
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1240px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:22px}}
h1,h2{{color:var(--encre);margin:0;text-wrap:balance}}
p,dl,dd{{margin:0}}
.entete{{display:flex;align-items:center;gap:12px}}
.entete svg{{width:44px;height:44px;flex:none}}
.entete .nom{{font-weight:900;font-size:28px;line-height:1;color:var(--texte)}}
.titre{{display:flex;flex-direction:column;gap:10px;max-width:54em}}
.titre h1{{font-size:clamp(30px,4.4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:18px}}
.sommaire{{display:flex;flex-wrap:wrap;gap:8px}}
.sommaire a{{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:12px;background:var(--blanc);border:1px solid var(--filet);color:var(--encre);font-weight:700;text-decoration:none}}
.sommaire a:hover{{border-color:var(--vert)}}
.sommaire a:focus-visible,figure img:focus-visible{{outline:3px solid var(--vert);outline-offset:3px}}
.prop{{display:flex;flex-direction:column;gap:18px;padding:clamp(16px,2.4vw,26px);border-radius:22px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06);scroll-margin-top:16px}}
.prop.ref{{background:transparent;box-shadow:inset 0 0 0 1.5px var(--filet)}}
.prop-head{{display:flex;flex-direction:column;gap:10px}}
.prop-head h2{{font-size:clamp(23px,2.4vw,28px);font-weight:800;letter-spacing:-.015em}}
.sous{{font-size:17px;font-weight:600;color:var(--vert)}}
dl{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px 22px}}
dl div{{padding-top:10px;border-top:3px solid var(--vert-clair)}}
dt{{font-size:15px;font-weight:800;color:var(--encre)}}
dd{{font-size:15.5px;line-height:1.5}}
.vues{{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:16px;align-items:start}}
.ordi,.tel{{display:flex;flex-direction:column;gap:14px;min-width:0}}
.deux{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}}
.tel{{display:grid;grid-template-columns:minmax(0,1fr);gap:14px}}
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;box-shadow:inset 0 0 0 1px var(--filet);border:1px solid var(--filet)}}
figcaption{{font-size:14px;font-weight:700;color:var(--encre);text-align:center}}
.pied{{font-size:14.5px;color:var(--gris);max-width:62em}}
@media (max-width:980px){{.vues{{grid-template-columns:minmax(0,1fr)}}.tel{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}
@media (max-width:760px){{dl{{grid-template-columns:minmax(0,1fr)}}.deux{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre">
    <h1>Menus et textes d’introduction</h1>
    <p>Le menu principal, le sous-menu des pages et le texte d’introduction sous chaque titre se ressemblent{NB}: le même texte gris, sans hiérarchie. Voici le site aujourd’hui, puis quatre façons de les distinguer, dans le style du reste du site. Le contenu des textes ne change pas, seule leur présentation change.</p>
  </div>
  <nav class="sommaire" aria-label="Propositions"><a href="#actuel">Aujourd’hui</a><a href="#p1">1. Sobre</a><a href="#p2">2. Au marqueur</a><a href="#p3">3. Couleurs des onglets</a><a href="#p4">4. Signature</a></nav>
  {"".join(blocs)}
  <p class="pied">Planche du 10 novembre 2026, en captures de la maquette (iPad à l’horizontale et téléphone). Sur téléphone, le menu principal s’ouvre par le bouton à trois traits{FINE}; il suivra la proposition retenue, comme le sous-menu de la page Informations légales et le texte d’introduction des pages Adhérer, Espace adhérent et Informations légales. Il est aussi possible de prendre un élément dans une proposition et un autre dans une autre.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
