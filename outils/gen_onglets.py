"""Planche « Onglets du menu et sous-onglets du syndicat » (11 novembre 2026, demande d'Isabelle Eimer : quatre propositions pour rendre
les onglets du menu et les sous-onglets du syndicat plus attractifs, plus en rapport avec la charte et le style du site, tout en restant
professionnels ; « Ne touche pas au site en lui-même »). Le site aujourd'hui, puis quatre propositions, en captures de la maquette
(outils/capture_onglets.js : iPad à l'horizontale et téléphone).
usage : python3 gen_onglets.py <dossier des captures> <propositions.json> <fichier de sortie> <logo svg>
propositions.json : liste de { "cle", "nom", "sous_titre", "menu", "telephone", "sous_onglets" }."""
import base64, json, sys, pathlib, html as H
from PIL import Image
D = pathlib.Path(sys.argv[1]); PROPS = json.load(open(sys.argv[2], encoding='utf-8')); OUT = sys.argv[3]
LOGO = open(sys.argv[4], encoding='utf-8').read()
NB, FINE = ' ', ' '

ACTUEL = {'cle': 'actuel', 'nom': 'Aujourd’hui sur le site', 'sous_titre': '',
          'menu': 'Les onglets en gras, couleur encre ; l’onglet ouvert en vert foncé.',
          'telephone': 'La même liste en grand ; la page ouverte en vert foncé.',
          'sous_onglets': 'Les rubriques en gras, couleur encre ; celle que l’on lit est soulignée de vert anis.'}

img = lambda p: 'data:image/jpeg;base64,' + base64.b64encode((D / p).read_bytes()).decode()
def taille(p):
    with Image.open(D / p) as i: return i.size
def fig(k, v, alt, cap):
    w, h = taille(f'{k}-{v}.jpg')
    return f'<figure><img src="{img(f"{k}-{v}.jpg")}" alt="{H.escape(alt)}" width="{w}" height="{h}" loading="lazy"><figcaption>{cap}</figcaption></figure>'

blocs = []
for i, p in enumerate([ACTUEL] + PROPS):
    k = p['cle']; nom = p['nom'] if k == 'actuel' else f'{i}. {p["nom"]}'
    dl = ''.join(f'<div><dt>{a}</dt><dd>{H.escape(b)}</dd></div>' for a, b in (('Menu principal', p['menu']), ('Menu du téléphone', p['telephone']), ('Sous-onglets du syndicat', p['sous_onglets'])))
    blocs.append(f'''<section class="prop{' ref' if k == 'actuel' else ''}" id="{k}" aria-labelledby="t-{k}">
  <div class="prop-head"><h2 id="t-{k}">{H.escape(nom)}</h2>{f'<p class="sous">{H.escape(p["sous_titre"])}</p>' if p.get('sous_titre') else ''}<dl>{dl}</dl></div>
  <div class="vues">
    <div class="ordi">
      {fig(k, 'menu', 'Menu principal sur la page d’accueil, ' + nom, 'Menu principal, page d’accueil ouverte')}
      {fig(k, 'survol', 'Menu principal, pointeur sur Presse, ' + nom, 'Le pointeur passe sur «' + FINE + 'Presse' + FINE + '»')}
      {fig(k, 'syndicat', 'Haut de la page Le syndicat, ' + nom, 'Page Le syndicat')}
      {fig(k, 'syndicat-bureau', 'Page Le syndicat en cours de lecture, rubrique Bureau, ' + nom, 'En cours de lecture{NB}: rubrique «{FINE}Bureau{FINE}»'.format(NB=NB, FINE=FINE))}
    </div>
    <div class="tel">
      {fig(k, 'tel-menu', 'Menu ouvert sur téléphone, ' + nom, 'Téléphone' + NB + ': menu ouvert')}
      {fig(k, 'tel-syndicat', 'Le syndicat sur téléphone, ' + nom, 'Téléphone' + NB + ': Le syndicat')}
      {fig(k, 'tel-bureau', 'Sous-onglets sur téléphone en cours de lecture, ' + nom, 'Téléphone' + NB + ': en cours de lecture')}
    </div>
  </div>
</section>''')

som = ''.join(f'<a href="#{p["cle"]}">{H.escape(p["nom"]) if p["cle"] == "actuel" else str(i) + ". " + H.escape(p["nom"])}</a>' for i, p in enumerate([dict(ACTUEL, nom='Aujourd’hui')] + PROPS))
page = f'''<title>Onglets du menu</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Planche : les onglets du menu principal et les sous-onglets de la page Le syndicat, aujourd'hui puis en quatre propositions,
   en captures de la maquette. Charte du site : thème clair seulement. */
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
.sommaire a:focus-visible{{outline:3px solid var(--vert);outline-offset:3px}}
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
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;border:1px solid var(--filet)}}
figcaption{{font-size:14px;font-weight:700;color:var(--encre);text-align:center}}
.pied{{font-size:14.5px;color:var(--gris);max-width:62em}}
@media (max-width:980px){{.vues{{grid-template-columns:minmax(0,1fr)}}.tel{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}}}}
@media (max-width:760px){{dl{{grid-template-columns:minmax(0,1fr)}}.tel{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre">
    <h1>Onglets du menu et sous-onglets du syndicat</h1>
    <p>Quatre façons de rendre les onglets du menu et les sous-onglets de la page Le syndicat plus attrayants, dans le style du site, en restant sobres. Dans les quatre, l’onglet de la page ouverte reste en vert foncé, sur ordinateur comme sur téléphone. Le site n’est pas modifié{FINE}: ce sont des captures de la maquette avec chaque proposition.</p>
  </div>
  <nav class="sommaire" aria-label="Propositions">{som}</nav>
  {"".join(blocs)}
  <p class="pied">Planche du 11 novembre 2026, en captures de la maquette (iPad à l’horizontale et téléphone). La proposition retenue s’appliquera aussi au sous-menu de la page Informations légales. Il est possible de prendre un élément dans une proposition et un autre dans une autre.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(page)
print('ok', len(page))
