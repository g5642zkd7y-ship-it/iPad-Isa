"""Charte graphique du site SLBC : logo, couleurs, typographie, onglets, mascottes, éléments, mouvement, règles.
Page visuelle (captures du site et dessins des mascottes), aussi imprimable en A4.

python3 gen_charte_site.py <dossier charte-site (captures/, mascottes/)> <sortie.html>"""
import base64, io, re, sys
from pathlib import Path
from PIL import Image

D = Path(sys.argv[1]); OUT = sys.argv[2]
CAP, MASC = D / 'captures', D / 'mascottes'

def img(path, largeur, fmt='JPEG', q=80):
    im = Image.open(path)
    if fmt == 'JPEG':
        im = im.convert('RGB')
    if im.width > largeur:
        im = im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS)
    b = io.BytesIO()
    if fmt == 'JPEG': im.save(b, 'JPEG', quality=q, optimize=True, progressive=True)
    else: im.save(b, 'PNG', optimize=True)
    mime = 'image/jpeg' if fmt == 'JPEG' else 'image/png'
    return f'data:{mime};base64,' + base64.b64encode(b.getvalue()).decode(), im.width, im.height

def fig(nom, legende, largeur=1400, classe='', alt=None, dossier=None, fmt='JPEG'):
    src, w, h = img((dossier or CAP) / nom, largeur, fmt)
    return (f'<figure class="{classe}"><img src="{src}" alt="{alt or legende}" width="{w}" height="{h}" loading="lazy">'
            f'<figcaption>{legende}</figcaption></figure>')

# ---------- Logo en SVG (couleurs écrites directement sur chaque cercle) ----------
_n = [0]
def symbole(taille, gris='#5E6266', anis='#A3BE3C', commun='#5F7A2B'):
    _n[0] += 1; i = _n[0]
    return (f'<svg viewBox="0 0 120 120" width="{taille}" height="{taille}" aria-hidden="true">'
            f'<defs><clipPath id="cl{i}"><circle cx="44" cy="44" r="36"/></clipPath></defs>'
            f'<circle cx="44" cy="44" r="36" fill="{gris}"/><circle cx="76" cy="76" r="36" fill="{anis}"/>'
            f'<circle cx="76" cy="76" r="36" fill="{commun}" clip-path="url(#cl{i})"/></svg>')

def logo_h(taille=96, fonce=False):
    s = symbole(taille, '#FFFFFF', '#A3BE3C', '#D6E4A6') if fonce else symbole(taille)
    c1 = '#FFFFFF' if fonce else '#3F4347'; c2 = '#D6E4A6' if fonce else '#5F7A2B'
    return (f'<div class="logo-h" style="--t:{taille}px">{s}<div class="logo-txt"><span class="logo-nom" style="color:{c1}">SLBC</span>'
            f'<span class="logo-sig" style="color:{c1}">Syndicat des Laboratoires<br><span style="color:{c2}">de Biologie Clinique</span></span></div></div>')

# ---------- Couleurs ----------
def nuance(nom, hexa, rvb, role, dessus, clair_txt=False, grand=False):
    t = '#2E3236' if clair_txt else '#FFFFFF'
    return (f'<li class="nu{" nu-grand" if grand else ""}"><div class="nu-c" style="background:{hexa};color:{t}"><span>{hexa}</span></div>'
            f'<div class="nu-t"><strong>{nom}</strong><span class="nu-rvb">RVB {rvb}</span><p>{role}</p><p class="nu-d">{dessus}</p></div></li>')

LOGO_C = [
    ('Vert anis', '#A3BE3C', '163 190 60', 'Couleur signature, reprise de l’ancien logo et conservée : rond vert du logo, filets, pastilles, bouton d’adhésion sur l’olive.', 'Texte encre seulement (6,1 : 1). Jamais de texte vert anis sur fond clair (2,1 : 1).', True),
    ('Vert foncé', '#5F7A2B', '95 122 43', 'Zone commune des deux ronds, seconde ligne de la signature. Sur le site : liens, boutons, onglet en cours.', 'Texte blanc (4,9 : 1). En texte sur blanc : 4,9 : 1.', False),
    ('Gris cellule', '#5E6266', '94 98 102', 'Rond gris du logo, toujours en haut à gauche. Sur le site : textes secondaires (introductions, dates).', 'En texte sur blanc : 6,2 : 1.', False),
]
FONDS_C = [
    ('Olive adouci', '#657B3D', '101 123 61', 'Veille réglementaire, Espace adhérent, bannières « Chaque lundi » et « Rejoindre le SLBC ». Le vert du logo avec un tiers de couleur en moins (8 novembre 2026).', 'Texte blanc (4,7 : 1). Focus clavier en vert clair.', False),
    ('Gris Nardo éclairci', '#74777A', '116 119 122', 'Actualités, « Nos représentants », formulaire de la lettre d’information, une porte de l’espace adhérent (8 novembre 2026).', 'Texte blanc au seuil exact (4,5 : 1) : ne pas l’éclaircir.', False),
    ('Vert clair', '#D6E4A6', '214 228 166', 'Salle de presse, « Flash Info », bloc du bureau exécutif, une porte de l’espace adhérent.', 'Texte encre (9,5 : 1). Liens « Lire… » en encre.', True),
    ('Gris pâle', '#ECEEE8', '236 238 232', 'Documentation, barres de filtres, boutons discrets.', 'Texte encre (11,1 : 1).', True),
    ('Fond clair', '#F7F8F4', '247 248 244', 'Sections qui alternent avec le blanc, pied de page, bandeau « Maquette de travail ».', 'Texte encre (12,1 : 1), liens vert foncé (4,6 : 1).', True),
    ('Blanc', '#FFFFFF', '255 255 255', 'Fond principal des pages, cartes, en-tête translucide.', 'Texte encre (12,9 : 1), gris texte (10 : 1).', True),
]
TEXTES_C = [
    ('Encre', '#2E3236', '46 50 54', 'Titres, onglet en cours, libellés, traits des dessins. Plus de fond de zone depuis le 8 novembre 2026.', 'Sur blanc : 12,9 : 1.', False),
    ('Gris texte', '#3F4347', '63 67 71', 'Texte courant de tout le site, onglets du menu, nom « SLBC » de l’en-tête.', 'Sur blanc : 10 : 1.', False),
]
DETAILS_C = [('Vert de survol', '#4E6623', 'survol des boutons verts, rubrique en cours du sous-menu'),
             ('Filet', '#E3E5E0', 'filets fins de 1 px'), ('Filet fort', '#CFD2CB', 'bords des champs'),
             ('Rouge d’erreur', '#B42318', 'messages d’erreur seulement'), ('Ombre au sol', '#E6E9DF', 'sous les mascottes, sur fond clair')]

def liste_nu(L, grand=False):
    return '<ul class="nuancier">' + ''.join(nuance(n, h, r, ro, d, c, grand) for n, h, r, ro, d, c in L) + '</ul>'

details = '<ul class="details">' + ''.join(f'<li><span style="background:{h}"></span><strong>{n}</strong> {h}<em>{u}</em></li>' for n, h, u in DETAILS_C) + '</ul>'

# ---------- Typographie : échantillons au vrai corps du site (ordinateur) ----------
TYPO = [
    ('Grand titre, titre de page', '48 px · 800', 'font-size:48px;font-weight:800;letter-spacing:-.025em;line-height:1.08', 'Défendre la biologie, défendre les patients.'),
    ('Titre de section', '36 px · 800', 'font-size:36px;font-weight:800;letter-spacing:-.02em;line-height:1.12', 'Ce que nous défendons'),
    ('Étiquette « Flash Info »', '28 px · 700', 'font-size:28px;font-weight:700', 'Flash Info'),
    ('Titre de rubrique', '24 px · 700', 'font-size:24px;font-weight:700;letter-spacing:-.015em', 'Le bureau exécutif'),
    ('Sous-titre', '20 px · 700', 'font-size:20px;font-weight:700;letter-spacing:-.01em', 'Une biologie de qualité accessible à tous'),
    ('Texte d’introduction', '19 px · 400 · gris', 'font-size:19.2px;font-weight:400;color:#5E6266;line-height:1.5', 'Une décision de santé se fonde sur des données, pas sur des opinions.'),
    ('Onglets du menu', '18 px · 500', 'font-size:18px;font-weight:500;color:#3F4347', 'Le syndicat  Veille  Presse  Actualités  Documentation'),
    ('Texte courant', '17 px · 400', 'font-size:17px;font-weight:400;color:#3F4347;line-height:1.55', 'Le SLBC représente les biologistes médicaux libéraux et défend une biologie de qualité, accessible à tous.'),
    ('Liens « Lire… »', '17 px · 600 · vert foncé', 'font-size:17px;font-weight:600;color:#5F7A2B', 'Lire le communiqué'),
    ('Boutons', '17 px · 600', 'font-size:17px;font-weight:600', 'Demander mon adhésion'),
    ('Dates, rubriques', '15 px · 600', 'font-size:15px;font-weight:600;color:#5E6266', '4 novembre 2026 · Communiqué du SLBC'),
    ('Petit texte, mentions', '14 px · 400', 'font-size:14px;font-weight:400;color:#5E6266', 'Vos données ne servent qu’à traiter votre demande.'),
]
typo = ''.join(f'<div class="ty"><div class="ty-l"><strong>{n}</strong><span>{t}</span></div><div class="ty-e" style="{s}">{e}</div></div>' for n, t, s, e in TYPO)
graisses = ''.join(f'<div class="gr"><span style="font-weight:{g}">Biologie</span><em>{g} · {nom}</em></div>' for g, nom in
                   [(400, 'texte courant'), (500, 'onglets, filtres'), (600, 'liens, boutons, dates'), (700, 'sous-titres'), (800, 'grands titres'), (900, 'nom « SLBC » du logo')])

# ---------- Onglets ----------
ONGLETS = [
    ('Accueil', 'accueil-haut.png', '#FFFFFF', 'Blanc', 'Grands ronds du logo, devise en encre', 'Aucune en haut ; une mascotte dans chaque bannière'),
    ('Le syndicat', 'bandeau-syndicat.png', '#FFFFFF', 'Blanc', 'Titre en encre', 'Les cinq biologistes du syndicat, sous le titre'),
    ('Veille réglementaire', 'bandeau-veille.png', '#657B3D', 'Olive adouci', 'Titre et texte blancs, signature pour fond foncé', 'Le biologiste aux jumelles, contour blanc'),
    ('Salle de presse', 'bandeau-presse.png', '#D6E4A6', 'Vert clair', 'Titre en encre, texte en gris texte', 'Le lecteur du communiqué'),
    ('Actualités', 'bandeau-actualites.png', '#74777A', 'Gris Nardo éclairci', 'Titre et texte blancs, signature pour fond foncé', 'Le biologiste aux mains sur les hanches, contour blanc'),
    ('Documentation', 'bandeau-documentation.png', '#ECEEE8', 'Gris pâle', 'Titre en encre, champ de recherche blanc', 'Le biologiste qui réfléchit'),
    ('Adhérer', 'bandeau-adherer.png', '#FFFFFF', 'Blanc', 'Titre en encre', 'Les trois biologistes à la banderole « Bienvenue »'),
    ('Espace adhérent', 'bandeau-espace.png', '#657B3D', 'Olive adouci', 'Titre et texte blancs, signature pour fond foncé', 'Les deux biologistes qui se serrent la main, contour blanc'),
    ('Informations légales', 'bandeau-mentions.png', '#FFFFFF', 'Blanc', 'Titre en encre', 'Aucune'),
]
onglets = ''.join(
    f'<article class="og"><div class="og-t"><span class="puce" style="background:{h}"></span><h3>{n}</h3><span class="og-h">{c} · {h}</span></div>'
    f'{fig(f, "Bandeau " + n, 1400)}<dl><div><dt>Texte</dt><dd>{t}</dd></div><div><dt>Mascotte</dt><dd>{m}</dd></div></dl></article>'
    for n, f, h, c, t, m in ONGLETS)
COURTS = ['Accueil', 'Le syndicat', 'Veille', 'Presse', 'Actualités', 'Documentation', 'Adhérer', 'Espace adhérent']
ordre = ''.join(f'<li><span style="background:{h}"></span>{c2}</li>' for (n, f, h, c, t, m), c2 in zip(ONGLETS[:8], COURTS))

BANNIERES = [
    ('accueil-flash-info.png', '« Flash Info » : dernier communiqué, en vert clair comme la Salle de presse'),
    ('accueil-ce-que-nous-defendons.png', '« Ce que nous défendons » : fond clair (aucun onglet)'),
    ('accueil-chaque-lundi.png', '« Chaque lundi » : olive adouci, comme la Veille et l’Espace adhérent'),
    ('accueil-actualites.png', 'Actualités : gris Nardo éclairci, comme l’onglet Actualités'),
    ('accueil-rejoindre.png', '« Rejoindre le SLBC » : olive adouci, comme l’adhésion'),
]
bannieres = ''.join(fig(f, l, 1200) for f, l in BANNIERES)

# ---------- Mascottes ----------
MASCOTTES = [
    ('pilier-porte-voix-sur-fond.png', 'Le biologiste au porte-voix', 'La mascotte d’origine (modèle 1) : lunettes rondes, tube à essai levé, il parle dans un porte-voix.', 'Accueil, « Ce que nous défendons »', 'Fond clair, ombre au sol'),
    ('trois-lecteurs-sur-fond.png', 'Les trois lecteurs du journal', 'Un lecteur mécontent derrière le journal « PROTOCOLE », un lecteur étonné, la biologiste au chignon perplexe qui se gratte la tête.', 'Accueil, « Flash Info », à côté du dernier communiqué', 'Fond vert clair, ombre au sol'),
    ('cinq-syndicat-sur-fond.png', 'Les cinq biologistes du syndicat', 'Ils discutent ; deux drapeaux : « MAKE BIOLOGY GREAT AGAIN ! » et « YES WE CAN ! » (slogans à valider par le bureau).', 'Page Le syndicat, sous le titre', 'Fond blanc, ombres au sol'),
    ('jumelles-contour-veille.png', 'Le biologiste aux jumelles', 'De grandes jumelles vues de face, aux verres vert clair : il surveille les textes.', 'Page Veille réglementaire et bannière « Chaque lundi »', 'Fond olive, contour blanc'),
    ('lecteur-communique-sur-fond.png', 'Le lecteur du communiqué', 'Un biologiste à lunettes lit un grand journal titré « COMMUNIQUÉ ».', 'Page Salle de presse', 'Fond vert clair, ombre au sol'),
    ('hanches-contour-actualites.png', 'Le biologiste aux mains sur les hanches', 'Cheveux en épis, sourcil levé, grand sourire, les deux mains sur les hanches.', 'Page Actualités et bannière Actualités de l’accueil', 'Fond gris Nardo, contour blanc'),
    ('engrenages-documentation-sur-fond.png', 'Le biologiste qui réfléchit', 'Yeux plissés, main sur la tempe, un livre sous le bras ; au-dessus, un nuage où tournent deux engrenages.', 'Page Documentation', 'Fond gris pâle, ombre au sol'),
    ('duo-contour-espace.png', 'Les deux biologistes qui se serrent la main', 'L’un accueille l’autre d’un petit signe ; la biologiste au chignon sourit.', 'Espace adhérent (poignée de main animée) et bannière « Rejoindre le SLBC »', 'Fond olive, contour blanc'),
    ('trio-bienvenue-sur-fond.png', 'La banderole « Bienvenue »', 'Trois biologistes tiennent une grande banderole écrite à la main ; celui du milieu fait un signe.', 'Page Adhérer, sous le titre', 'Fond blanc, ombres au sol'),
]
FONDS_M = {'pilier-porte-voix-sur-fond.png': '#F7F8F4', 'trois-lecteurs-sur-fond.png': '#D6E4A6', 'cinq-syndicat-sur-fond.png': '#FFFFFF', 'jumelles-contour-veille.png': '#657B3D', 'lecteur-communique-sur-fond.png': '#D6E4A6', 'hanches-contour-actualites.png': '#74777A', 'engrenages-documentation-sur-fond.png': '#ECEEE8', 'duo-contour-espace.png': '#657B3D', 'trio-bienvenue-sur-fond.png': '#FFFFFF'}
def fig_m(f, n):
    src, w, h = img(MASC / f, 900)
    return f'<figure class="ma-i"><img src="{src}" alt="{n}" width="{w}" height="{h}" loading="lazy" style="background:{FONDS_M[f]}"></figure>'
mascottes = ''.join(
    f'<article class="ma">{fig_m(f, n)}<div class="ma-t"><h3>{n}</h3><p>{d}</p>'
    f'<p class="ma-m"><strong>Où</strong> {o}</p><p class="ma-m"><strong>Fond</strong> {fo}</p></div></article>'
    for f, n, d, o, fo in MASCOTTES)

# ---------- Éléments ----------
def duo(*figs): return '<div class="grille">' + ''.join(figs) + '</div>'
elements = f'''
<h3 class="st">Pastilles dessinées</h3>
<p>Dessinées au marqueur comme les mascottes : un rond blanc posé sur le rond vert anis du logo, avec de petits traits de joie. Un chiffre pour les missions et les trois piliers de l’accueil ; un petit dessin pour les avantages de l’adhésion (jumelles, deux biologistes, porte-voix).</p>
{duo(fig('syndicat-missions.png', 'Les quatre missions, page Le syndicat', 1400), fig('adherer-trois-cases.png', 'Les trois avantages, page Adhérer', 1400))}
<div class="rang">{fig('pastille-avantage-1-veille.png', 'La veille', 300, 'petit')}{fig('pastille-avantage-2-groupes.png', 'Les groupes de travail', 300, 'petit')}{fig('pastille-avantage-3-instances.png', 'Une voix dans les instances', 300, 'petit')}</div>
<h3 class="st">Liens « Lire… » et leur flèche</h3>
<p>Une petite flèche dessinée au marqueur, de la couleur du lien, collée au dernier mot. Vert foncé sur fond clair, encre sur le vert clair, blanc sur l’olive et le gris Nardo.</p>
{duo(fig('lien-lire-gros-plan.png', 'Sur fond clair, en vert foncé', 1000), fig('lien-lire-sur-olive-gros-plan.png', 'Sur l’olive, en blanc', 700))}
<h3 class="st">Séparateur</h3>
<p>Au début de chaque page, sous le bandeau : les deux ronds du logo se rejoignent, puis un trait vert anis de 2 px se déploie de chaque côté.</p>
{fig('separateur-fin.png', 'Le séparateur, à la fin de son animation', 1400)}
<h3 class="st">Boutons</h3>
<p>Tous en forme de pilule, 17 px, demi-gras, 48 px de haut. Les boutons d’adhésion sont toujours verts.</p>
<div class="rang boutons">{fig('bouton-adherer-entete.png', 'Adhérer (en-tête) : vert foncé, texte blanc', 300, 'petit')}{fig('bouton-principal-vert-fonce.png', 'Bouton principal : vert foncé', 360, 'petit')}{fig('bouton-anis-sur-olive.png', 'Sur l’olive : vert anis, liseré vert clair', 560, 'petit')}{fig('bouton-blanc-espace-adherent.png', 'Bouton blanc sur l’olive', 440, 'petit')}{fig('bouton-discret.png', 'Bouton discret : gris pâle', 440, 'petit')}</div>
<h3 class="st">Les portes de l’espace adhérent</h3>
<p>Quatre portes de couleurs différentes : gris Nardo (veille), vert clair (commission), vert anis (suggestion), vert foncé (lettre d’information).</p>
{fig('portes-espace-adherent.png', 'Les quatre portes, avant la connexion', 1300)}
<h3 class="st">Sous-menu et cartes de veille</h3>
{fig('sous-menu-syndicat.png', 'Sous-menu d’une page : rubrique en cours soulignée de vert anis', 1400)}
{fig('carte-veille.png', 'Une carte de veille (adhérent connecté), sur l’olive', 760, 'carte-veille')}
<h3 class="st">Focus clavier</h3>
<p>Toujours visible : contour plein de 3 px, vert foncé sur fond clair, vert clair sur l’olive, blanc sur le gris Nardo.</p>
<div class="rang">{fig('focus-bouton-sur-blanc.png', 'Sur fond clair', 500, 'petit')}{fig('focus-bouton-anis-sur-olive.png', 'Sur l’olive', 600, 'petit')}{fig('focus-lien-sur-nardo.png', 'Sur le gris Nardo', 600, 'petit')}</div>
<h3 class="st">Bandeau des cookies</h3>
<p>En bas de l’écran, sans bloquer la page. « Tout refuser » et « Tout accepter » sont exactement le même bouton.</p>
{fig('bandeau-cookies-1280.png', 'Sur ordinateur', 1400)}
{duo(fig('bandeau-cookies-390.png', 'Sur téléphone', 780), fig('fenetre-cookies.png', 'La fenêtre « Voir et choisir »', 900))}
<h3 class="st">Pied de page</h3>
{fig('pied-de-page.png', 'Pied de page sur fond clair, logo complet', 1400)}
'''

# ---------- Page ----------
html = f'''<title>Charte du site SLBC</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap">
<style>
/* Charte graphique du site SLBC. Un seul thème, clair, comme le site (thème clair pour garder le logo dans ses couleurs validées).
   Mise en page : une colonne de 1120 px, des chapitres numérotés, les vraies captures du site. */
:root{{
  --anis:#A3BE3C; --vert:#5F7A2B; --vert-clair:#D6E4A6; --olive:#657B3D; --nardo:#74777A; --neutre:#ECEEE8;
  --gris:#5E6266; --texte:#3F4347; --encre:#2E3236; --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E5E0; --filet-fort:#CFD2CB;
  --font:"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
html{{background:var(--fond)}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 17px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1120px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:28px}}
h1,h2,h3{{color:var(--encre);margin:0;text-wrap:balance}}
p{{margin:0}}
ul{{margin:0}}
/* Couverture */
.couv{{display:flex;flex-direction:column;gap:28px;padding:clamp(28px,5vw,56px);border-radius:28px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06)}}
.couv h1{{font-size:clamp(36px,5.4vw,60px);line-height:1.04;font-weight:800;letter-spacing:-.03em}}
.couv .sous{{font-size:clamp(18px,1.8vw,21px);color:var(--gris);max-width:40em}}
.couv .meta{{font-size:15px;color:var(--gris)}}
.couv .bande{{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px;padding:0;list-style:none}}
.couv .bande li{{display:flex;flex-direction:column;gap:6px;font-size:12.5px;line-height:1.2;color:var(--encre);text-align:center;min-width:0;overflow-wrap:anywhere}}
.couv .bande span{{height:46px;border-radius:10px;box-shadow:inset 0 0 0 1px rgba(46,50,54,.14)}}
.sommaire{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,auto);grid-auto-flow:column;gap:6px 28px;padding:0;list-style:none}}
.sommaire li{{display:flex;gap:10px;align-items:baseline}}
.sommaire a{{color:var(--encre);text-decoration:none;font-weight:600}}
.sommaire a:hover{{text-decoration:underline}}
.sommaire b{{color:var(--vert);min-width:1.4em;font-variant-numeric:tabular-nums}}
/* Logo */
.logo-h{{display:flex;align-items:center;gap:calc(var(--t)*.2)}}
.logo-h svg{{flex:none}}
.logo-txt{{display:flex;flex-direction:column;gap:calc(var(--t)*.05)}}
.logo-nom{{font-weight:900;font-size:calc(var(--t)*.62);line-height:.9;letter-spacing:.02em}}
.logo-sig{{font-weight:700;font-size:calc(var(--t)*.19);line-height:1.25}}
.logo-sig{{white-space:nowrap}}
/* Chapitres */
.ch{{display:flex;flex-direction:column;gap:20px;padding:clamp(22px,3.4vw,40px);border-radius:28px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06)}}
.ch-t{{display:flex;gap:16px;align-items:center}}
.num{{flex:none;position:relative;width:54px;height:54px}}
.num::before{{content:"";position:absolute;right:0;bottom:0;width:42px;height:42px;border-radius:50%;background:var(--anis)}}
.num span{{position:absolute;left:0;top:0;width:42px;height:42px;border-radius:50%;background:var(--blanc);border:3px solid var(--encre);display:grid;place-items:center;font-weight:800;font-size:19px;color:var(--encre)}}
.ch-t h2{{font-size:clamp(26px,3vw,34px);font-weight:800;letter-spacing:-.02em;line-height:1.1}}
.ch > p,.ch .txt{{max-width:44em}}
.st{{font-size:21px;font-weight:800;margin-top:10px}}
.regles{{padding-left:1.15em;display:flex;flex-direction:column;gap:6px;max-width:48em}}
.regles li::marker{{color:var(--anis)}}
.cols2{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px}}
.encadre{{padding:16px 18px;border-radius:16px;background:var(--fond);display:flex;flex-direction:column;gap:8px}}
.encadre.non{{background:#F9EFEE}}
.encadre h3{{font-size:17px}}
/* Figures */
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px var(--filet)}}
figcaption{{font-size:14px;font-weight:600;color:var(--encre)}}
.grille{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}}
.rang{{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-end}}
.rang figure.petit{{flex:0 0 auto;max-width:100%;align-items:flex-start}}
.rang figure.petit img{{height:96px;width:auto;max-width:none}}
.rang.boutons figure.petit img{{height:56px}}
.rang figure.petit figcaption{{max-width:230px}}
.carte-veille{{max-width:380px}}
/* Logo : versions */
.versions{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}
.ver{{display:flex;flex-direction:column;gap:10px;padding:22px;border-radius:18px;background:var(--fond);min-width:0}}
.ver .zone{{display:flex;align-items:center;justify-content:center;min-height:150px;border-radius:12px;padding:18px}}
.ver h3{{font-size:17px}}
.ver p{{font-size:15px}}
.anim{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}}
.anim figure img{{background:var(--blanc)}}
/* Couleurs */
.nuancier{{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}}
.nu{{display:flex;flex-direction:column;border-radius:18px;overflow:hidden;box-shadow:0 0 0 1px var(--filet);background:var(--blanc)}}
.nu-c{{height:112px;display:flex;align-items:flex-end;padding:12px 14px;font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;box-shadow:inset 0 -1px 0 rgba(46,50,54,.08)}}
.nu-grand .nu-c{{height:150px}}
.nu-t{{display:flex;flex-direction:column;gap:4px;padding:12px 14px 14px}}
.nu-t strong{{color:var(--encre);font-size:17px}}
.nu-rvb{{font-size:13px;color:var(--gris);font-variant-numeric:tabular-nums}}
.nu-t p{{font-size:14.5px;line-height:1.45}}
.nu-t .nu-d{{color:var(--encre);font-weight:600}}
.details{{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px 22px;font-size:14.5px}}
.details li{{display:flex;align-items:center;gap:8px}}
.details span{{width:22px;height:22px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(46,50,54,.14)}}
.details em{{font-style:normal;color:var(--gris)}}
.proportions{{display:flex;height:40px;border-radius:12px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(46,50,54,.1)}}
/* Typographie */
.specimen{{display:flex;gap:28px;align-items:center;flex-wrap:wrap}}
.specimen .aa{{font-size:clamp(96px,14vw,150px);font-weight:900;line-height:.9;color:var(--encre);letter-spacing:-.02em}}
.graisses{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 24px;flex:1;min-width:260px}}
.gr{{display:flex;flex-direction:column}}
.gr span{{font-size:30px;color:var(--encre);line-height:1.1}}
.gr em{{font-style:normal;font-size:13.5px;color:var(--gris)}}
.ty{{display:grid;grid-template-columns:200px minmax(0,1fr);gap:20px;align-items:baseline;padding:14px 0;border-top:1px solid var(--filet)}}
.ty-l{{display:flex;flex-direction:column;font-size:14px}}
.ty-l strong{{color:var(--encre)}}
.ty-l span{{color:var(--gris);font-variant-numeric:tabular-nums}}
.ty-e{{color:var(--encre);min-width:0;overflow-wrap:anywhere;white-space:pre-wrap}}
/* Onglets */
.ordre{{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px 18px;font-weight:600;color:var(--encre)}}
.ordre li{{display:flex;align-items:center;gap:8px}}
.ordre span{{width:18px;height:18px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(46,50,54,.2)}}
.onglets{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px 18px}}
.og{{display:flex;flex-direction:column;gap:10px;min-width:0}}
.og-t{{display:flex;align-items:center;gap:10px;flex-wrap:wrap}}
.og-t h3{{font-size:19px}}
.og-h{{font-size:14px;color:var(--gris);font-variant-numeric:tabular-nums}}
.puce{{width:22px;height:22px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(46,50,54,.2)}}
.og figcaption{{display:none}}
.og dl{{margin:0;display:flex;flex-direction:column;gap:4px;font-size:14.5px}}
.og dl div{{display:grid;grid-template-columns:76px minmax(0,1fr);gap:8px}}
.og dt{{font-weight:700;color:var(--encre)}}
.og dd{{margin:0}}
.bannieres{{display:flex;flex-direction:column;gap:16px}}
/* Mascottes */
.mascottes{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}}
.ma{{display:flex;flex-direction:column;gap:10px;min-width:0}}
.ma-i img{{height:230px;object-fit:contain;padding:14px;border-radius:14px}}
.ma-i figcaption{{display:none}}
.ma-t{{display:flex;flex-direction:column;gap:6px}}
.ma-t h3{{font-size:18px}}
.ma-t p{{font-size:15px;line-height:1.45}}
.ma-m strong{{color:var(--encre);margin-right:4px}}
.sig{{font-weight:800;color:var(--encre);padding:0 2px}}
.pied{{font-size:14px;color:var(--gris);max-width:62em}}
a{{color:var(--vert)}}
:focus-visible{{outline:3px solid var(--vert);outline-offset:3px;border-radius:6px}}
@media (max-width:900px){{.nuancier,.mascottes{{grid-template-columns:repeat(2,minmax(0,1fr))}}.couv .bande{{grid-template-columns:repeat(4,minmax(0,1fr))}}}}
@media (max-width:640px){{.sommaire{{grid-template-rows:none;grid-auto-flow:row}}.couv .logo-h{{--t:62px!important}}.couv .bande li{{font-size:11.5px;overflow-wrap:normal}}.nuancier,.mascottes,.onglets,.grille,.versions,.cols2,.sommaire{{grid-template-columns:minmax(0,1fr)}}.ty{{grid-template-columns:minmax(0,1fr);gap:4px}}.graisses{{grid-template-columns:repeat(2,minmax(0,1fr))}}.anim{{gap:6px}}}}
@media print{{
  @page{{size:A4;margin:12mm}}
  html,body{{background:#fff}}
  .page{{max-width:none;padding:0;gap:0}}
  .couv,.ch{{box-shadow:none;border-radius:0;padding:0 0 8mm}}
  .ch{{break-before:page}}
  figure,.nu,.og,.ma,.ver,.ty,.encadre{{break-inside:avoid}}
  .ch-t,.st{{break-after:avoid}}
  *{{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
}}
</style>
<div class="page">

<header class="couv">
  {logo_h(88)}
  <div style="display:flex;flex-direction:column;gap:12px">
    <h1>Charte graphique du site</h1>
    <p class="sous">Les règles visuelles du nouveau site du SLBC : le logo, les couleurs, la typographie, les onglets, les mascottes et les éléments des pages, montrés tels qu’ils sont sur le site.</p>
    <p class="meta">Version de travail du 8 novembre 2026, à valider par le bureau. Elle complète la <a href="https://claude.ai/artifact/EhTqyWrkSQibEFKKZiydUK">charte graphique du SLBC</a> (logo, couleurs, documents).</p>
  </div>
  <ul class="bande" aria-label="Couleur du haut de chaque page, dans l’ordre du menu">{ordre}</ul>
  <nav aria-label="Sommaire"><ol class="sommaire">
    <li><b>1</b><a href="#logo">Le logo sur le site</a></li><li><b>2</b><a href="#couleurs">Les couleurs</a></li>
    <li><b>3</b><a href="#typo">La typographie</a></li><li><b>4</b><a href="#onglets">Les onglets</a></li>
    <li><b>5</b><a href="#mascottes">Les mascottes</a></li><li><b>6</b><a href="#elements">Les éléments des pages</a></li>
    <li><b>7</b><a href="#mouvement">Le mouvement</a></li><li><b>8</b><a href="#regles">Les règles à respecter</a></li>
  </ol></nav>
</header>

<section class="ch" id="logo" aria-labelledby="t-logo">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>1</span></span><h2 id="t-logo">Le logo sur le site</h2></div>
  <p>Deux ronds qui se chevauchent : le gris en haut à gauche, le vert anis en bas à droite, la zone commune en vert foncé. « SLBC » en Nunito Black, la signature en Nunito Bold, sa seconde ligne en vert foncé. Sur le site, le logo apparaît sous quatre formes.</p>
  <div class="versions">
    <div class="ver"><div class="zone" style="background:#fff">{logo_h(64)}</div><h3>Version complète</h3><p>Pied de page (symbole de 64 px). C’est la version de référence.</p></div>
    <div class="ver"><div class="zone" style="background:#fff"><div class="logo-h" style="--t:52px">{symbole(52)}<div class="logo-txt"><span class="logo-nom" style="color:#3F4347">SLBC</span></div></div></div><h3>En-tête</h3><p>Symbole et nom « SLBC », sans la signature : 36 px dans l’en-tête de chaque page.</p></div>
    <div class="ver"><div class="zone" style="background:#fff">{symbole(110)}</div><h3>Symbole seul</h3><p>Grand logo animé de l’accueil (240 px), petite signature à côté du titre des pages (52 px), centre des séparateurs (34 px), icône de l’onglet du navigateur.</p></div>
    <div class="ver"><div class="zone" style="background:var(--olive);gap:22px;flex-wrap:wrap">{symbole(84, '#FFFFFF', '#A3BE3C', '#D6E4A6')}<span style="display:inline-flex;padding:16px;border-radius:12px;background:var(--nardo)">{symbole(60, '#FFFFFF', '#A3BE3C', '#D6E4A6')}</span></div><h3>Sur fond foncé</h3><p>Sur l’olive et le gris Nardo : rond blanc, rond vert anis, zone commune vert clair. Sur le vert clair et le gris pâle, le logo garde ses couleurs.</p></div>
  </div>
  <h3 class="st">La signature animée</h3>
  <p>À l’ouverture de chaque page, les deux ronds du logo se rapprochent jusqu’à former le symbole (1,1 seconde). C’est l’animation qui signe le site.</p>
  <div class="anim">{fig('signature-1-debut-gros-plan.png', 'Début', 380, fmt='PNG')}{fig('signature-2-milieu-gros-plan.png', 'Milieu', 380, fmt='PNG')}{fig('signature-3-fin-gros-plan.png', 'Fin : le symbole', 380, fmt='PNG')}</div>
  {fig('accueil-haut.png', 'Le haut de l’accueil : grand symbole, nom du syndicat, devise, séparateur', 1400)}
  <ul class="regles">
    <li>Les couleurs du logo sont écrites directement sur chaque rond, jamais par un symbole réutilisé (les ronds sont déjà apparus en noir).</li>
    <li>Ne pas déformer le logo, ne pas changer l’ordre ni les couleurs des ronds, ne lui ajouter ni ombre, ni contour, ni dégradé.</li>
    <li>Le vert anis du logo, repris de l’ancien logo, reste la couleur signature.</li>
  </ul>
</section>

<section class="ch" id="couleurs" aria-labelledby="t-couleurs">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>2</span></span><h2 id="t-couleurs">Les couleurs</h2></div>
  <p>Les couleurs du logo, puis les fonds qui donnent à chaque page sa couleur, puis les couleurs des textes. Pour chacune : son rôle sur le site et le texte qu’on peut écrire dessus, avec son contraste (au moins 4,5 pour 1).</p>
  <h3 class="st">Les couleurs du logo</h3>
  {liste_nu(LOGO_C, True)}
  <h3 class="st">Les fonds des pages et des zones</h3>
  {liste_nu(FONDS_C)}
  <h3 class="st">Les textes</h3>
  {liste_nu(TEXTES_C)}
  <h3 class="st">Petits détails</h3>
  {details}
  <div class="cols2">
    <div class="encadre"><h3>À faire</h3><ul class="regles"><li>Liens et boutons en vert foncé ; l’olive adouci seulement pour les grands fonds.</li><li>Sur l’olive et le gris Nardo : textes, liens et focus clairs (blanc ou vert clair).</li><li>Alterner fond blanc, fond clair et zones de couleur, une idée par section.</li></ul></div>
    <div class="encadre non"><h3>À ne pas faire</h3><ul class="regles"><li>Écrire en vert anis sur un fond clair (2,1 pour 1, illisible).</li><li>Utiliser l’encre comme fond de zone.</li><li>Éclaircir le gris Nardo : le texte blanc ne serait plus lisible.</li><li>Passer le site en thème sombre : le logo doit rester dans ses couleurs.</li></ul></div>
  </div>
</section>

<section class="ch" id="typo" aria-labelledby="t-typo">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>3</span></span><h2 id="t-typo">La typographie</h2></div>
  <p>Une seule police, Nunito, pour le logo et pour tous les textes du site, y compris ceux des dessins (drapeaux, journaux). Ronde et chaleureuse, elle est gratuite (Google Fonts, licence libre). Choix d’Isabelle Eimer du 7 novembre 2026.</p>
  <div class="specimen"><div class="aa" aria-hidden="true">Aa</div><div class="graisses">{graisses}</div></div>
  <h3 class="st">Les tailles, au vrai corps du site sur ordinateur</h3>
  <div>{typo}</div>
  <p class="txt">Sur téléphone, les grands titres rétrécissent (48 px deviennent 34 px) ; le texte courant reste à 17 px.</p>
  <ul class="regles">
    <li>Mettre en valeur par la graisse ou la couleur, pas par la taille ; pas de capitales forcées.</li>
    <li>Une espace fine insécable avant les signes <span class="sig">;</span> <span class="sig">!</span> <span class="sig">?</span> et le guillemet fermant <span class="sig">»</span>, après le guillemet ouvrant <span class="sig">«</span>, et une espace insécable avant les deux-points. Apostrophe typographique <span class="sig">’</span>.</li>
    <li>Numéros et mots à trait d’union gardés sur une ligne (2026-2030, covid-19, e-mail).</li>
    <li>Italique seulement pour les citations et les mentions « à compléter ».</li>
    <li>« Bienvenue », sur la banderole de la page Adhérer, est écrit à la main (police Kalam, transformée en dessin).</li>
  </ul>
</section>

<section class="ch" id="onglets" aria-labelledby="t-onglets">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>4</span></span><h2 id="t-onglets">Les onglets</h2></div>
  <p>Chaque onglet a sa couleur, dans le bandeau en haut de la page, et sa mascotte à côté du titre. Le menu complet s’affiche au-dessus de 1 100 px de large ; en dessous, un menu compact.</p>
  <ul class="ordre" aria-label="Ordre du menu et couleur de chaque onglet">{ordre}</ul>
  {fig('entete-1280.png', 'L’en-tête : bandeau « Maquette de travail », logo, onglets, recherche, Espace adhérent, bouton Adhérer', 1400)}
  <div class="onglets">{onglets}</div>
  <h3 class="st">Sur l’accueil, chaque bannière prend la couleur de l’onglet où elle mène</h3>
  <div class="bannieres">{bannieres}</div>
</section>

<section class="ch" id="mascottes" aria-labelledby="t-mascottes">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>5</span></span><h2 id="t-mascottes">Les mascottes</h2></div>
  <p>De petits biologistes dessinés au marqueur : trait noir épais aux bouts arrondis, grosse tête ronde, blouse blanche avec un simple trait vert anis sur le côté (modèle 1, choisi par Isabelle Eimer le 6 novembre 2026). Neuf dessins, à douze endroits du site.</p>
  <div class="mascottes">{mascottes}</div>
  <ul class="regles">
    <li>Les mascottes ne se modifient pas : dessins, couleurs, trait vert de la blouse et contours restent tels quels.</li>
    <li>Toutes à la même échelle : un personnage mesure environ 180 px de haut sur ordinateur, 112 px sur téléphone.</li>
    <li>Sur fond clair : une ombre au sol. Sur fond foncé (olive, gris Nardo) : un contour blanc et pas d’ombre.</li>
    <li>À côté du grand titre des pages ; à gauche du titre dans les bannières de l’accueil ; les groupes sont centrés sous le titre.</li>
    <li>Elles sont décoratives : les lecteurs d’écran les ignorent.</li>
    <li>Mascottes de saison (Noël, été) : dessins prêts, pas encore sur le site, en attente du choix du bureau.</li>
  </ul>
</section>

<section class="ch" id="elements" aria-labelledby="t-elements">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>6</span></span><h2 id="t-elements">Les éléments des pages</h2></div>
  <p>Les éléments qui reviennent d’une page à l’autre, dessinés dans le même esprit que les mascottes.</p>
  {elements}
</section>

<section class="ch" id="mouvement" aria-labelledby="t-mouvement">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>7</span></span><h2 id="t-mouvement">Le mouvement</h2></div>
  <p>Des animations rares et qui ont un sens : « attractif mais professionnel ». Rien ne bouge quand la page est immobile.</p>
  <div class="cols2">
    <div class="encadre"><h3>Ce qui bouge</h3><ul class="regles">
      <li>Les deux ronds du logo se rapprochent à l’ouverture de chaque page.</li>
      <li>Le séparateur se dessine ; le filet vert des trois piliers se trace ; les pastilles des missions se dessinent.</li>
      <li>L’onglet de la page en cours se souligne en vert ; l’en-tête prend une légère ombre au défilement.</li>
      <li>Au défilement, les mascottes réagissent comme montées sur ressort puis reviennent en place ; les drapeaux flottent, les engrenages tournent.</li>
      <li>Les deux biologistes de l’espace adhérent se serrent la main à l’ouverture de la page.</li>
    </ul></div>
    <div class="encadre non"><h3>Ce qu’on ne fait pas</h3><ul class="regles">
      <li>Faire apparaître chaque bloc en fondu au défilement.</li>
      <li>Des cascades, des cartes qui se soulèvent au survol.</li>
      <li>Des halos, des pulsations, un mouvement continu.</li>
    </ul><p style="font-size:15px">Ces effets font « site généré par une IA » ou modèle tout fait.</p></div>
  </div>
  <p class="txt">Si le visiteur a demandé moins d’animations dans les réglages de son appareil, tout s’affiche directement.</p>
</section>

<section class="ch" id="regles" aria-labelledby="t-regles">
  <div class="ch-t"><span class="num" aria-hidden="true"><span>8</span></span><h2 id="t-regles">Les règles à respecter</h2></div>
  <div class="cols2">
    <div class="encadre"><h3>Le ton</h3><ul class="regles">
      <li>Rendu professionnel, inspiré des grandes marques, jamais « généré par IA ».</li>
      <li>Pas de pictogrammes décoratifs, pas de listes à coches, pas de titres-slogans.</li>
      <li>Phrases courtes, voix active, titres qui décrivent, faits vérifiables.</li>
      <li>Ne rien inventer : ce qui manque reste marqué « à compléter ».</li>
    </ul></div>
    <div class="encadre"><h3>L’accessibilité</h3><ul class="regles">
      <li>Contraste d’au moins 4,5 pour 1 pour tout texte.</li>
      <li>Focus clavier toujours visible ; vrais boutons et vrais liens ; un libellé sur chaque champ.</li>
      <li>Le site fonctionne à 390 px de large sans défilement de côté ; cibles à toucher de 44 px.</li>
    </ul></div>
    <div class="encadre"><h3>Les couleurs</h3><ul class="regles">
      <li>Boutons d’adhésion toujours verts.</li>
      <li>Thème clair uniquement.</li>
      <li>Liens et boutons en vert foncé ; grands fonds en olive adouci, gris Nardo, vert clair ou gris pâle.</li>
    </ul></div>
    <div class="encadre"><h3>La page Le syndicat</h3><ul class="regles">
      <li>Personne n’est classé : noms par ordre alphabétique, fiches identiques.</li>
      <li>Rien ne montre les manques : seulement des chiffres positifs.</li>
    </ul></div>
  </div>
</section>

<p class="pied">Charte graphique du site SLBC, version de travail du 8 novembre 2026, faite à partir de captures du site. À valider par le bureau. Les captures montrent la maquette ; le site final reprendra ces règles.</p>
</div>
'''

# Typographie française dans le texte seulement (pas dans les styles ni les attributs)
tete, corps = html.split('</style>', 1)
def fr(m):
    t = m.group(1)
    t = t.replace('« ', '« ').replace(' »', ' »').replace(' ;', ' ;').replace(' !', ' !').replace(' ?', ' ?').replace(' :', ' :')
    return '>' + t + '<'
corps = re.sub(r'>([^<]+)<', fr, corps)
html = tete + '</style>' + corps
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
