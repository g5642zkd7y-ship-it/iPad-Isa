"""Charte graphique du site SLBC : logo, couleurs, typographie, onglets, mascottes, éléments, mouvement, règles.
Page visuelle (captures du site et dessins des mascottes), aussi imprimable en A4 (outils/pdf_charte_site.js).
Les captures sont à 2 fois la taille réelle (gros plans à 4 fois) : chacune est affichée au plus à sa taille réelle.

python3 gen_charte_site.py <dossier charte-site (captures/, mascottes/)> <sortie.html>"""
import base64, io, re, sys
from pathlib import Path
from PIL import Image

D = Path(sys.argv[1]); OUT = sys.argv[2]
CAP, MASC = D / 'captures', D / 'mascottes'
NB, NN = ' ', ' '  # espace insécable, espace fine insécable

def img(path, largeur, fmt='JPEG', q=78):
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

def fig(nom, legende, largeur=2016, classe='', alt=None, fmt='JPEG', echelle=2, tel=None, reel=True):
    """Une capture du site, affichée au plus à sa taille réelle ; tel = capture du téléphone pour les petits écrans."""
    chemin = CAP / nom
    nat = Image.open(chemin).width
    src, w, h = img(chemin, largeur, fmt)
    style = f' style="max-width:{nat // echelle}px"' if reel else ''
    balise = f'<img src="{src}" alt="{alt or legende}" width="{w}" height="{h}" loading="lazy"{style}>'
    if tel:
        s2, w2, h2 = img(CAP / tel, 780)
        balise = f'<picture><source media="(max-width:640px)" srcset="{s2}" width="{w2}" height="{h2}">{balise}</picture>'
    cap = f'<figcaption>{legende}</figcaption>' if legende else ''
    return f'<figure class="{classe}">{balise}{cap}</figure>'

# ---------- Logo en SVG (couleurs écrites directement sur chaque cercle) ----------
_n = [0]
def symbole(taille, gris='#5E6266', anis='#A3BE3C', commun='#5F7A2B'):
    _n[0] += 1; i = _n[0]
    return (f'<svg viewBox="0 0 120 120" width="{taille}" height="{taille}" aria-hidden="true">'
            f'<defs><clipPath id="cl{i}"><circle cx="44" cy="44" r="36"/></clipPath></defs>'
            f'<circle cx="44" cy="44" r="36" fill="{gris}"/><circle cx="76" cy="76" r="36" fill="{anis}"/>'
            f'<circle cx="76" cy="76" r="36" fill="{commun}" clip-path="url(#cl{i})"/></svg>')

def logo_h(taille=96):
    # Comme le pied de page du site : « SLBC » en gris texte, première ligne de la signature en gris cellule, seconde en vert foncé
    return (f'<div class="logo-h" style="--t:{taille}px">{symbole(taille)}<div class="logo-txt"><span class="logo-nom" style="color:#3F4347">SLBC</span>'
            f'<span class="logo-sig" style="color:#5E6266">Syndicat des Laboratoires<br><span style="color:#5F7A2B">de Biologie Clinique</span></span></div></div>')

# ---------- Couleurs ----------
def nuance(nom, hexa, rvb, role, dessus, clair_txt=False, grand=False, code=''):
    t = '#2E3236' if clair_txt else '#FFFFFF'
    c = f'<span class="nu-code">dans le code : {code}</span>' if code else ''
    return (f'<li class="nu{" nu-grand" if grand else ""}"><div class="nu-c" style="background:{hexa};color:{t}"><span>{hexa}</span></div>'
            f'<div class="nu-t"><strong>{nom}</strong><span class="nu-rvb">RVB {rvb}</span>{c}<p>{role}</p><p class="nu-d">{dessus}</p></div></li>')

LOGO_C = [
    ('Vert anis', '#A3BE3C', '163 190 60', 'Couleur signature, reprise de l’ancien logo et conservée : rond vert du logo, filets, pastilles, bouton d’adhésion sur l’olive.', 'Texte encre seulement (6,1 pour 1). Jamais de texte vert anis sur fond clair (2,1 pour 1).', True, '--anis'),
    ('Vert foncé', '#5F7A2B', '95 122 43', 'Zone commune des deux ronds, seconde ligne de la signature. Sur le site : liens, boutons, onglet en cours, et les petits fonds verts (porte « La lettre d’information », case « Une voix dans les instances » de la page Adhérer, bandeaux des régions du conseil et des URPS).', 'Texte blanc (4,9 pour 1). En texte : 4,9 pour 1 sur blanc, 4,6 pour 1 sur le fond clair.', False, '--vert'),
    ('Gris cellule', '#5E6266', '94 98 102', 'Rond gris du logo, toujours en haut à gauche. Sur le site : textes secondaires (introductions, dates des listes, première ligne de la signature).', 'En texte sur blanc : 6,1 pour 1.', False, '--gris'),
]
FONDS_C = [
    ('Olive adouci', '#657B3D', '101 123 61', 'Veille réglementaire, Espace adhérent, bannières « Chaque lundi » et « Rejoindre le SLBC ». Le vert foncé du logo avec un tiers de couleur en moins, un peu plus clair (choix d’Isabelle Eimer, 8 novembre 2026).', 'Texte blanc (4,7 pour 1). Focus clavier en vert clair.', False, '--olive'),
    ('Gris Nardo éclairci', '#74777A', '116 119 122', 'Actualités, « Nos représentants », formulaire de la lettre d’information, une porte de l’espace adhérent, la première case de la page Adhérer (choix d’Isabelle Eimer, 8 novembre 2026).', 'Texte blanc au seuil exact (4,5 pour 1) : ne pas l’éclaircir. Vert clair seulement en grand (3,3 pour 1) : sigles et grands chiffres de « Nos représentants ».', False, '--nardo'),
    ('Vert clair', '#D6E4A6', '214 228 166', 'Salle de presse, « Flash Info », bloc du bureau exécutif, une porte de l’espace adhérent, la deuxième case de la page Adhérer.', 'Texte encre (9,5 pour 1). Liens « Lire… » en encre.', True, '--vert-clair'),
    ('Gris pâle', '#ECEEE8', '236 238 232', 'Documentation, barres de filtres, boutons discrets.', 'Texte encre (11 pour 1).', True, '--neutre'),
    ('Fond clair', '#F7F8F4', '247 248 244', 'Sections qui alternent avec le blanc, pied de page, bandeau « Maquette de travail ».', 'Texte encre (12,1 pour 1), liens vert foncé (4,6 pour 1).', True, '--fond'),
    ('Blanc', '#FFFFFF', '255 255 255', 'Fond principal des pages, cartes, en-tête translucide.', 'Texte encre (12,9 pour 1), gris texte (10 pour 1).', True, '--blanc'),
]
TEXTES_C = [
    ('Encre', '#2E3236', '46 50 54', 'Titres, onglet en cours, libellés, traits des dessins. Plus de fond de zone depuis le 8 novembre 2026.', 'Sur blanc : 12,9 pour 1.', False, '--encre'),
    ('Gris texte', '#3F4347', '63 67 71', 'Texte courant de tout le site, onglets du menu, nom « SLBC » de l’en-tête et du pied de page.', 'Sur blanc : 10 pour 1.', False, '--texte'),
]
DETAILS_C = [('Vert de survol', '#4E6623', 'survol des boutons verts, rubrique en cours du sous-menu (dans le code : --vert-fonce)'),
             ('Filet', '#E3E5E0', 'filets fins de 1 px'), ('Filet fort', '#CFD2CB', 'bords des champs'),
             ('Rouge d’erreur', '#B42318', 'messages d’erreur seulement'), ('Ombre au sol', '#E6E9DF', 'sous les mascottes, sur fond clair')]

def liste_nu(L, grand=False):
    return '<ul class="nuancier">' + ''.join(nuance(n, h, r, ro, d, c, grand, code) for n, h, r, ro, d, c, code in L) + '</ul>'

details = '<ul class="details">' + ''.join(f'<li><span class="pt" style="background:{h}"></span><strong>{n}</strong><span class="hx">{h}</span><em>{u}</em></li>' for n, h, u in DETAILS_C) + '</ul>'

# ---------- Typographie : vrais textes du site, au vrai corps sur ordinateur ----------
TYPO = [
    ('Grand titre, titre de page', '48 px · 800', 'font-size:48px;font-weight:800;letter-spacing:-.025em;line-height:1.08', 'Défendre la biologie,<br>défendre les patients.'),
    ('Titre de section', '36 px · 800', 'font-size:36px;font-weight:800;letter-spacing:-.02em;line-height:1.12', 'Ce que nous défendons'),
    ('Étiquette « Flash Info »', '28 px · 700', 'font-size:28px;font-weight:700', 'Flash Info'),
    ('Titre de rubrique', '24 px · 700', 'font-size:24px;font-weight:700;letter-spacing:-.015em', 'Ce à quoi les adhérents ont accès'),
    ('Sous-titre', '20 px · 700', 'font-size:20px;font-weight:700;letter-spacing:-.01em', 'La fierté d’un métier essentiel'),
    ('Texte d’introduction', '19 px · 400 · gris', 'font-size:19.2px;font-weight:400;color:#5E6266;line-height:1.5', 'Une décision de santé se fonde sur des données, pas sur des opinions.'),
    ('Onglets du menu', '18 px · 500', 'font-size:18px;font-weight:500;color:#3F4347;word-spacing:.6em', 'Accueil Le syndicat Veille Presse Actualités Documentation'),
    ('Texte courant', '17 px · 400', 'font-size:17px;font-weight:400;color:#3F4347;line-height:1.55', 'Nous sommes fiers de notre métier, et lucides sur son avenir. Défendre notre métier, c’est le faire évoluer.'),
    ('Liens « Lire… »', '17 px · 600 · vert foncé', 'font-size:17px;font-weight:600;color:#5F7A2B', 'Lire le communiqué'),
    ('Boutons', '17 px · 600', 'font-size:17px;font-weight:600', 'Demander mon adhésion'),
    ('Date et rubrique d’un article', '15 px · date en 600 encre, rubrique en 400 gris', 'font-size:15px', '<span style="font-weight:600;color:#2E3236">4 novembre 2026</span>&emsp;<span style="color:#5E6266">Communiqué du SLBC</span>'),
    ('Petit texte, mentions', '14 px · 400', 'font-size:14px;font-weight:400;color:#5E6266', 'Vos informations servent seulement à traiter votre message.'),
]
typo = ''.join(f'<div class="ty"><div class="ty-l"><strong>{n}</strong><span>{t}</span></div><div class="ty-e" style="{s}">{e}</div></div>' for n, t, s, e in TYPO)
graisses = ''.join(f'<div class="gr"><span style="font-weight:{g}">Biologie</span><em>{g} · {nom}</em></div>' for g, nom in
                   [(400, 'texte courant'), (500, 'onglets, filtres'), (600, 'liens, boutons, dates'), (700, 'sous-titres'), (800, 'grands titres'), (900, 'nom « SLBC » du logo')])

# ---------- Onglets (ordre du menu : Espace adhérent puis le bouton Adhérer) ----------
ONGLETS = [
    ('Accueil', 'accueil-haut.png', 'accueil-haut-390.png', '#FFFFFF', 'Blanc', 'Grands ronds du logo, devise en encre', 'Aucune en haut ; une mascotte dans chaque bannière'),
    ('Le syndicat', 'bandeau-syndicat.png', 'bandeau-syndicat-390.png', '#FFFFFF', 'Blanc', 'Titre en encre', 'Les cinq biologistes du syndicat, sous le titre'),
    ('Veille réglementaire', 'bandeau-veille.png', 'bandeau-veille-390.png', '#657B3D', 'Olive adouci', 'Titre et texte blancs, signature pour fond foncé', 'Le biologiste aux jumelles, contour blanc, à droite du titre'),
    ('Salle de presse', 'bandeau-presse.png', 'bandeau-presse-390.png', '#D6E4A6', 'Vert clair', 'Titre en encre, texte en gris texte', 'Le lecteur du communiqué, à droite du titre'),
    ('Actualités', 'bandeau-actualites.png', 'bandeau-actualites-390.png', '#74777A', 'Gris Nardo éclairci', 'Titre et texte blancs, signature pour fond foncé', 'Le biologiste aux mains sur les hanches, contour blanc, à droite du titre'),
    ('Documentation', 'bandeau-documentation.png', 'bandeau-documentation-390.png', '#ECEEE8', 'Gris pâle', 'Titre en encre, champ de recherche blanc', 'Le biologiste qui réfléchit, à droite du titre'),
    ('Espace adhérent', 'bandeau-espace.png', 'bandeau-espace-390.png', '#657B3D', 'Olive adouci', 'Titre et texte blancs, signature pour fond foncé', 'Les deux biologistes qui se serrent la main, contour blanc, à droite du titre'),
    ('Adhérer', 'bandeau-adherer.png', 'bandeau-adherer-390.png', '#FFFFFF', 'Blanc', 'Titre en encre', 'Les trois biologistes à la banderole « Bienvenue », sous le titre'),
    ('Informations légales', 'bandeau-mentions.png', 'bandeau-mentions-390.png', '#FFFFFF', 'Blanc', 'Titre en encre ; page reliée au pied de page, hors du menu', 'Aucune'),
]
onglets = ''.join(
    f'<article class="og"><div class="og-t"><span class="puce" style="background:{h}"></span><div><h3>{n}</h3><span class="og-h">{c} · {h}</span></div></div>'
    f'{fig(f, "", alt="Bandeau de la page " + n, tel=tf)}<dl><div><dt>Texte</dt><dd>{t}</dd></div><div><dt>Mascotte</dt><dd>{m}</dd></div></dl></article>'
    for n, f, tf, h, c, t, m in ONGLETS)
COURTS = ['Accueil', 'Le syndicat', 'Veille', 'Presse', 'Actualités', 'Documentation', 'Espace adhérent', 'Adhérer']
ordre = ''.join(f'<li><span style="background:{o[3]}"></span>{c2}</li>' for o, c2 in zip(ONGLETS[:8], COURTS))

BANNIERES = [
    ('accueil-flash-info.png', '« Flash Info » : le dernier communiqué, en vert clair comme la Salle de presse'),
    ('accueil-ce-que-nous-defendons.png', '« Ce que nous défendons » : fond clair (ne mène à aucun onglet)'),
    ('accueil-chaque-lundi.png', '« Chaque lundi » : olive adouci, comme la Veille et l’Espace adhérent'),
    ('accueil-actualites.png', 'Actualités : gris Nardo éclairci, comme l’onglet Actualités'),
    ('accueil-rejoindre.png', '« Rejoindre le SLBC » : olive adouci, le vert de l’adhésion (la page Adhérer garde un bandeau blanc)'),
]
bannieres = ''.join(fig(f, l) for f, l in BANNIERES)

# ---------- Mascottes ----------
MASCOTTES = [
    ('pilier-porte-voix-sur-fond.png', '#F7F8F4', 'Le biologiste au porte-voix', 'La mascotte d’origine (modèle 1) : lunettes rondes, tube à essai levé, il parle dans un porte-voix.', 'Accueil, « Ce que nous défendons »', 'Fond clair, ombre au sol'),
    ('trois-lecteurs-sur-fond.png', '#D6E4A6', 'Les trois lecteurs du journal', 'Un lecteur mécontent derrière le journal « PROTOCOLE », un lecteur étonné, la biologiste au chignon perplexe qui se gratte la tête.', 'Accueil, « Flash Info », dans la colonne de droite', 'Fond vert clair, ombre au sol'),
    ('cinq-syndicat-sur-fond.png', '#FFFFFF', 'Les cinq biologistes du syndicat', 'Ils discutent ; deux drapeaux : « MAKE BIOLOGY GREAT AGAIN ! » et « YES WE CAN ! » (slogans à valider par le bureau).', 'Page Le syndicat, sous le titre', 'Fond blanc, ombres au sol'),
    ('jumelles-contour-veille.png', '#657B3D', 'Le biologiste aux jumelles', 'De grandes jumelles vues de face, aux verres vert clair : il surveille les textes.', 'Page Veille réglementaire et bannière « Chaque lundi »', 'Fond olive, contour blanc'),
    ('lecteur-communique-sur-fond.png', '#D6E4A6', 'Le lecteur du communiqué', 'Un biologiste à lunettes lit un grand journal titré « COMMUNIQUÉ ».', 'Page Salle de presse', 'Fond vert clair, ombre au sol'),
    ('hanches-contour-actualites.png', '#74777A', 'Le biologiste aux mains sur les hanches', 'Cheveux en épis, sourcil levé, grand sourire, les deux mains sur les hanches.', 'Page Actualités et bannière Actualités de l’accueil', 'Fond gris Nardo, contour blanc'),
    ('engrenages-documentation-sur-fond.png', '#ECEEE8', 'Le biologiste qui réfléchit', 'Yeux plissés, main sur la tempe, un livre sous le bras ; au-dessus, un nuage où tournent deux engrenages.', 'Page Documentation', 'Fond gris pâle, ombre au sol'),
    ('duo-contour-espace.png', '#657B3D', 'Les deux biologistes qui se serrent la main', 'L’un accueille l’autre d’un petit signe ; la biologiste au chignon sourit.', 'Espace adhérent et bannière « Rejoindre le SLBC » ; aux deux endroits, la poignée de main s’anime', 'Fond olive, contour blanc'),
    ('trio-bienvenue-sur-fond.png', '#FFFFFF', 'La banderole « Bienvenue »', 'Trois biologistes tiennent une grande banderole écrite à la main ; celui du milieu fait un signe.', 'Page Adhérer, sous le titre', 'Fond blanc, ombres au sol'),
]
def fig_m(f, bg, n):
    src, w, h = img(MASC / f, 900)
    return f'<figure class="ma-i"><img src="{src}" alt="{n}" width="{w}" height="{h}" loading="lazy" style="background:{bg}"></figure>'
mascottes = ''.join(
    f'<article class="ma">{fig_m(f, bg, n)}<div class="ma-t"><h3>{n}</h3><p>{d}</p>'
    f'<p class="ma-m"><strong>Où</strong> {o}</p><p class="ma-m"><strong>Fond</strong> {fo}</p></div></article>'
    for f, bg, n, d, o, fo in MASCOTTES)

# ---------- Éléments ----------
def grille(*figs, cls='grille'): return f'<div class="{cls}">' + ''.join(figs) + '</div>'
def petit(nom, leg, echelle=2): return fig(nom, leg, 1000, 'petit', echelle=echelle)
elements = f'''
<div class="bloc"><h3 class="st">Pastilles dessinées</h3>
<p>Dessinées au marqueur comme les mascottes : un rond blanc posé sur le rond vert anis du logo, avec de petits traits de joie. Un chiffre pour les missions et les trois piliers de l’accueil ; un petit dessin pour les avantages de l’adhésion (jumelles, deux biologistes, porte-voix).</p></div>
{grille(fig('syndicat-missions.png', 'Les quatre missions, page Le syndicat'), '<div class="pile">' + fig('adherer-trois-cases.png', 'Les trois avantages, page Adhérer') + '<div class="rang pastilles">' + petit('pastille-mission-1.png', 'Un chiffre : mission 1') + petit('pastille-avantage-1-veille.png', 'La veille') + petit('pastille-avantage-2-groupes.png', 'Les groupes') + petit('pastille-avantage-3-instances.png', 'Les instances') + '</div></div>')}
<div class="bloc"><h3 class="st">Liens « Lire… » et leur flèche</h3>
<p>Une petite flèche dessinée au marqueur, de la couleur du lien, collée au dernier mot : vert foncé sur fond clair, blanc sur l’olive et le gris Nardo, encre sur le vert clair (voir la bannière « Flash Info » au chapitre 4). Ici, en gros plan.</p></div>
<div class="rang">{fig('lien-lire-gros-plan.png', 'Sur fond clair, en vert foncé', 1300, 'petit', echelle=2)}{fig('lien-lire-sur-olive-gros-plan.png', 'Sur l’olive, en blanc', 700, 'petit', echelle=2)}</div>
<div class="bloc"><h3 class="st">Séparateur</h3>
<p>Au début de chaque page, sous le bandeau : les deux ronds du logo se rejoignent, puis un trait vert anis de 2 px se déploie de chaque côté.</p>
{fig('separateur-fin.png', 'Le séparateur, à la fin de son animation')}</div>
<div class="bloc"><h3 class="st">Boutons</h3>
<p>Tous en forme de pilule, demi-gras : 17 px et 48 px de haut ; 44 px de haut pour le bouton « Adhérer » de l’en-tête et pour les boutons des cookies sur téléphone. Les boutons d’adhésion sont toujours verts. À taille réelle :</p>
<div class="rang boutons">{petit('bouton-adherer-entete.png', 'Adhérer, en-tête')}{petit('bouton-principal-vert-fonce.png', 'Bouton principal')}{petit('bouton-anis-sur-olive.png', 'Sur l’olive : vert anis, liseré vert clair')}{petit('bouton-blanc-espace-adherent.png', 'Bouton blanc, sur l’olive')}{petit('bouton-discret.png', 'Bouton discret')}</div></div>
<div class="bloc"><h3 class="st">Les portes de l’espace adhérent</h3>
<p>Quatre portes de couleurs différentes : gris Nardo (veille), vert clair (commission), vert anis (suggestion), vert foncé (lettre d’information).</p>
{fig('portes-espace-adherent.png', 'Les quatre portes, avant la connexion')}</div>
<div class="bloc"><h3 class="st">Sous-menu</h3>
{fig('sous-menu-syndicat.png', 'Sous-menu des pages Le syndicat, Documentation et Informations légales : rubrique en cours soulignée de vert anis')}</div>
<div class="bloc"><h3 class="st">Cartes de veille</h3>
<div class="grille centre">{fig('carte-veille.png', 'Une carte de veille, sur l’olive', 760)}<p>Pour les adhérents connectés, la bannière « Chaque lundi » montre une carte par texte suivi : la rubrique, le titre, un résumé, la date et le niveau d’impact. Les cartes sont un peu plus sombres que l’olive ; le titre est blanc, le texte gris très clair.</p></div></div>
<div class="bloc"><h3 class="st">Focus clavier</h3>
<p>Toujours visible : contour plein de 3 px sur les boutons et les liens, vert foncé sur fond clair, vert clair sur l’olive, blanc sur le gris Nardo ; dans les champs de saisie, bord vert foncé et halo vert pâle.</p>
<div class="rang">{petit('focus-bouton-sur-blanc.png', 'Sur fond clair')}{petit('focus-bouton-anis-sur-olive.png', 'Sur l’olive')}{petit('focus-lien-sur-nardo.png', 'Sur le gris Nardo')}</div></div>
<div class="bloc"><h3 class="st">Bandeau des cookies</h3>
<p>En bas de l’écran, sans bloquer la page. « Tout refuser » et « Tout accepter » sont exactement le même bouton.</p>
{fig('bandeau-cookies-1280.png', 'Sur ordinateur')}</div>
<div class="grille centre">{fig('bandeau-cookies-390.png', 'Sur téléphone', 780)}{fig('fenetre-cookies.png', 'La fenêtre « Voir et choisir »', 900)}</div>
<div class="bloc"><h3 class="st">Pied de page</h3>
{fig('pied-de-page.png', 'Pied de page sur fond clair, avec le logo complet')}</div>
'''

def chap(n, ident, titre):
    return f'<div class="ch-t"><span class="num" aria-hidden="true">{n}</span><h2 id="t-{ident}">{titre}</h2></div>'

# ---------- Page ----------
html = f'''<title>Charte du site SLBC</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap">
<style>
/* Charte graphique du site SLBC. Un seul thème, clair, comme le site (pour garder le logo dans ses couleurs validées).
   Mise en page comme sur le site : une colonne, des chapitres séparés par des filets fins, les vraies captures du site. */
:root{{
  --anis:#A3BE3C; --vert:#5F7A2B; --vert-clair:#D6E4A6; --olive:#657B3D; --nardo:#74777A; --neutre:#ECEEE8;
  --gris:#5E6266; --texte:#3F4347; --encre:#2E3236; --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E5E0; --filet-fort:#CFD2CB; --erreur:#B42318;
  --font:"Nunito",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
html{{background:var(--blanc)}}
body{{margin:0;background:var(--blanc);color:var(--texte);font:400 17px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1080px;margin:0 auto;padding-block:clamp(24px,5vw,64px) 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column}}
h1,h2,h3{{color:var(--encre);margin:0;text-wrap:balance}}
p{{margin:0}}
ul,ol{{margin:0}}
.nw{{white-space:nowrap}}
/* Couverture */
.couv{{display:flex;flex-direction:column;gap:28px;padding-bottom:clamp(36px,5vw,56px)}}
.couv h1{{font-size:clamp(36px,5.4vw,60px);line-height:1.04;font-weight:800;letter-spacing:-.03em}}
.couv .sous{{font-size:clamp(18px,1.8vw,21px);color:var(--gris);max-width:40em}}
.couv .meta{{font-size:15px;color:var(--gris)}}
.couv .bande{{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:6px;padding:0;list-style:none}}
.couv .bande li{{display:flex;flex-direction:column;gap:6px;font-size:12.5px;line-height:1.2;color:var(--encre);text-align:center;min-width:0}}
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
.logo-sig{{font-weight:700;font-size:calc(var(--t)*.19);line-height:1.25;white-space:nowrap}}
/* Chapitres, séparés par un filet fin */
.ch{{display:flex;flex-direction:column;gap:20px;padding-block:clamp(36px,5vw,56px);border-top:1px solid var(--filet)}}
.ch-t{{display:flex;gap:14px;align-items:baseline}}
.num{{flex:none;font-size:clamp(26px,3vw,34px);font-weight:800;color:var(--vert);font-variant-numeric:tabular-nums}}
.ch-t h2{{font-size:clamp(26px,3vw,34px);font-weight:800;letter-spacing:-.02em;line-height:1.1}}
.ch > p,.ch .txt,.bloc > p{{max-width:44em}}
.bloc{{display:flex;flex-direction:column;gap:12px}}
.st{{font-size:21px;font-weight:800;margin-top:12px}}
.regles{{padding-left:1.15em;display:flex;flex-direction:column;gap:6px;max-width:48em}}
.regles li::marker{{color:var(--anis)}}
.cols2{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:start}}
.encadre{{padding:16px 18px;border-radius:16px;background:var(--fond);display:flex;flex-direction:column;gap:8px}}
.encadre.non{{box-shadow:inset 3px 0 0 var(--erreur)}}
.encadre.non h3{{color:var(--erreur)}}
.encadre h3{{font-size:17px}}
/* Figures : au plus à leur taille réelle */
figure{{margin:0;display:flex;flex-direction:column;gap:6px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 0 0 1px var(--filet)}}
picture{{display:block}}
figcaption{{font-size:14px;font-weight:600;color:var(--encre)}}
.grille{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start}}
.grille.centre{{align-items:center}}
.pile{{display:flex;flex-direction:column;gap:16px;min-width:0}}
.rang{{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start}}
.rang figure.petit{{flex:0 1 auto;max-width:100%;align-items:flex-start}}
.rang figure.petit img{{width:auto;max-width:100%}}
.rang.pastilles figure.petit{{width:104px;align-items:center;text-align:center}}
.rang figure.petit figcaption{{max-width:220px}}
/* Logo : versions */
.versions{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}
.ver{{display:flex;flex-direction:column;gap:10px;padding:20px;border-radius:16px;background:var(--fond);min-width:0}}
.ver .zone{{display:flex;align-items:center;justify-content:center;min-height:140px;border-radius:12px;padding:18px}}
.ver h3{{font-size:17px}}
.ver p{{font-size:15px}}
.anim{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:560px}}
.anim figure img{{background:var(--blanc)}}
/* Couleurs */
.nuancier{{list-style:none;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}}
.nu{{display:flex;flex-direction:column;border-radius:16px;overflow:hidden;box-shadow:inset 0 0 0 1px var(--filet);background:var(--blanc)}}
.nu-c{{height:112px;display:flex;align-items:flex-end;padding:12px 14px;font-weight:700;font-size:15px;font-variant-numeric:tabular-nums}}
.nu-grand .nu-c{{height:150px}}
.nu-t{{display:flex;flex-direction:column;gap:4px;padding:12px 14px 14px}}
.nu-t strong{{color:var(--encre);font-size:17px}}
.nu-rvb,.nu-code{{font-size:13px;color:var(--gris);font-variant-numeric:tabular-nums}}
.nu-t p{{font-size:14.5px;line-height:1.45}}
.nu-t .nu-d{{color:var(--encre);font-weight:600}}
.details{{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px 24px;font-size:14.5px}}
.details li{{display:flex;align-items:center;gap:8px}}
.details .pt{{flex:none;width:22px;height:22px;border-radius:6px;box-shadow:inset 0 0 0 1px rgba(46,50,54,.14)}}
.details strong{{white-space:nowrap}}
.details .hx{{color:var(--gris);font-variant-numeric:tabular-nums}}
.details em{{font-style:normal;color:var(--gris)}}
/* Typographie */
.specimen{{display:flex;gap:28px;align-items:center;flex-wrap:wrap}}
.specimen .aa{{font-size:clamp(96px,14vw,150px);font-weight:900;line-height:.9;color:var(--encre);letter-spacing:-.02em}}
.graisses{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px 24px;flex:1;min-width:260px}}
.gr{{display:flex;flex-direction:column}}
.gr span{{font-size:30px;color:var(--encre);line-height:1.1}}
.gr em{{font-style:normal;font-size:13.5px;color:var(--gris)}}
.ty{{display:grid;grid-template-columns:210px minmax(0,1fr);gap:20px;align-items:baseline;padding:14px 0;border-top:1px solid var(--filet)}}
.ty-l{{display:flex;flex-direction:column;font-size:14px}}
.ty-l strong{{color:var(--encre)}}
.ty-l span{{color:var(--gris);font-variant-numeric:tabular-nums}}
.ty-e{{color:var(--encre);min-width:0;overflow-wrap:break-word;text-wrap:balance}}
.sig{{font-weight:800;color:var(--encre);padding:0 2px}}
/* Onglets : un par ligne, la capture lisible */
.ordre{{list-style:none;padding:0;display:flex;flex-wrap:wrap;gap:8px 18px;font-weight:600;color:var(--encre)}}
.ordre li{{display:flex;align-items:center;gap:8px}}
.ordre span{{width:18px;height:18px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(46,50,54,.2)}}
.onglets{{display:flex;flex-direction:column;gap:30px}}
.og{{display:flex;flex-direction:column;gap:10px;min-width:0}}
.og-t{{display:flex;align-items:center;gap:12px}}
.og-t h3{{font-size:20px}}
.og-h{{font-size:14px;color:var(--gris);font-variant-numeric:tabular-nums}}
.puce{{flex:none;width:26px;height:26px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(46,50,54,.2)}}
.og dl{{margin:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:4px 24px;font-size:15px}}
.og dl div{{display:grid;grid-template-columns:78px minmax(0,1fr);gap:8px}}
.og dt{{font-weight:700;color:var(--encre)}}
.og dd{{margin:0}}
.bannieres{{display:flex;flex-direction:column;gap:20px}}
/* Mascottes */
.mascottes{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px 18px}}
.ma{{display:flex;flex-direction:column;gap:10px;min-width:0}}
.ma-i img{{height:230px;object-fit:contain;padding:14px;border-radius:14px}}
.ma-t{{display:flex;flex-direction:column;gap:6px}}
.ma-t h3{{font-size:18px}}
.ma-t p{{font-size:15px;line-height:1.45}}
.ma-m strong{{color:var(--encre);margin-right:4px}}
.pied{{font-size:14px;color:var(--gris);max-width:62em;padding-top:24px;border-top:1px solid var(--filet)}}
a{{color:var(--vert)}}
:focus-visible{{outline:3px solid var(--vert);outline-offset:3px;border-radius:6px}}
@media (max-width:900px){{.nuancier,.mascottes{{grid-template-columns:repeat(2,minmax(0,1fr))}}.couv .bande{{grid-template-columns:repeat(4,minmax(0,1fr))}}}}
@media (max-width:640px){{
  .sommaire{{grid-template-rows:none;grid-auto-flow:row}}.couv .logo-h{{--t:62px!important}}.couv .bande li{{font-size:11.5px}}
  .nuancier,.mascottes,.grille,.versions,.cols2,.sommaire,.og dl{{grid-template-columns:minmax(0,1fr)}}
  .ty{{grid-template-columns:minmax(0,1fr);gap:4px}}.graisses{{grid-template-columns:repeat(2,minmax(0,1fr))}}.anim{{gap:6px}}
  .details{{flex-direction:column;gap:10px}}.details li{{flex-wrap:wrap;gap:2px 8px}}.details em{{flex-basis:100%;padding-left:30px}}
}}
@media print{{
  @page{{size:A4;margin:12mm 12mm 16mm}}
  html,body{{background:#fff}}
  .page{{max-width:none;padding:0}}
  .ch{{break-before:page;border-top:0;padding-block:0 6mm}}
  .couv{{padding-bottom:0}}
  figure img{{box-shadow:none!important;border:1px solid var(--filet)}}
  figure,.nu,.og,.ma,.ver,.ty,.encadre,.bloc,.grille{{break-inside:avoid}}
  .ch-t,.st,.st + p{{break-after:avoid}}
  .bannieres figure img{{width:86%}}
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
  <div style="display:flex;flex-direction:column;gap:10px">
    <p class="meta">La couleur du haut de chaque page, dans l’ordre du menu :</p>
    <ul class="bande" aria-label="Couleur du haut de chaque page, dans l’ordre du menu">{ordre}</ul>
  </div>
  <nav aria-label="Sommaire"><ol class="sommaire">
    <li><b>1</b><a href="#logo">Le logo sur le site</a></li><li><b>2</b><a href="#couleurs">Les couleurs</a></li>
    <li><b>3</b><a href="#typo">La typographie</a></li><li><b>4</b><a href="#onglets">Les onglets</a></li>
    <li><b>5</b><a href="#mascottes">Les mascottes</a></li><li><b>6</b><a href="#elements">Les éléments des pages</a></li>
    <li><b>7</b><a href="#mouvement">Le mouvement</a></li><li><b>8</b><a href="#regles">Les règles à respecter</a></li>
  </ol></nav>
</header>

<section class="ch" id="logo" aria-labelledby="t-logo">
  {chap(1, 'logo', 'Le logo sur le site')}
  <p>Deux ronds qui se chevauchent : le gris en haut à gauche, le vert anis en bas à droite, la zone commune en vert foncé. « SLBC » en Nunito Black, la signature en Nunito Bold, sa seconde ligne en vert foncé. Sur le site, le logo apparaît sous quatre formes.</p>
  <div class="versions">
    <div class="ver"><div class="zone" style="background:#fff">{logo_h(64)}</div><h3>Version complète</h3><p>Pied de page (symbole de 64 px). C’est la version de référence.</p></div>
    <div class="ver"><div class="zone" style="background:#fff"><div class="logo-h" style="--t:52px">{symbole(52)}<div class="logo-txt"><span class="logo-nom" style="color:#3F4347">SLBC</span></div></div></div><h3>En-tête</h3><p>Symbole et nom « SLBC », sans la signature : symbole de 36 px dans l’en-tête de chaque page.</p></div>
    <div class="ver"><div class="zone" style="background:#fff">{symbole(110)}</div><h3>Symbole seul</h3><p>Grand logo animé de l’accueil (144 px de haut sur ordinateur, 108 px sur téléphone), petite signature à côté du titre des pages (52 px), centre des séparateurs (34 px), icône de l’onglet du navigateur.</p></div>
    <div class="ver"><div class="zone" style="background:var(--olive);gap:22px;flex-wrap:wrap">{symbole(84, '#FFFFFF', '#A3BE3C', '#D6E4A6')}<span style="display:inline-flex;padding:16px;border-radius:12px;background:var(--nardo)">{symbole(60, '#FFFFFF', '#A3BE3C', '#D6E4A6')}</span></div><h3>Sur fond foncé</h3><p>Sur l’olive et le gris Nardo : rond blanc, rond vert anis, zone commune vert clair. Sur le vert clair et le gris pâle, le logo garde ses couleurs.</p></div>
  </div>
  <div class="bloc"><h3 class="st">La signature animée</h3>
  <p>À l’ouverture de chaque page, les deux ronds du logo se rapprochent jusqu’à former le symbole : 1,1 seconde à côté du titre des pages, 1,5 seconde pour le grand logo de l’accueil. C’est l’animation qui signe le site.</p>
  <div class="anim">{fig('signature-1-debut-gros-plan.png', 'Début', 380, fmt='PNG', reel=False)}{fig('signature-2-milieu-gros-plan.png', 'Milieu', 380, fmt='PNG', reel=False)}{fig('signature-3-fin-gros-plan.png', 'Fin : le symbole', 380, fmt='PNG', reel=False)}</div></div>
  {fig('accueil-haut.png', 'Le haut de l’accueil : grand symbole, nom du syndicat, devise, séparateur', tel='accueil-haut-390.png')}
  <ul class="regles">
    <li>Les couleurs du logo sont écrites directement sur chaque rond, jamais par un symbole réutilisé (les ronds sont déjà apparus en noir).</li>
    <li>Ne pas déformer le logo, ne pas changer l’ordre ni les couleurs des ronds, ne lui ajouter ni ombre, ni contour, ni dégradé.</li>
    <li>Le vert anis du logo, repris de l’ancien logo, reste la couleur signature.</li>
  </ul>
</section>

<section class="ch" id="couleurs" aria-labelledby="t-couleurs">
  {chap(2, 'couleurs', 'Les couleurs')}
  <p>Les couleurs du logo, puis les fonds qui donnent à chaque page sa couleur, puis les couleurs des textes. Pour chacune : son rôle sur le site et le texte qu’on peut écrire dessus, avec son contraste (au moins 4,5 pour 1, ou 3 pour 1 pour les grands textes).</p>
  <h3 class="st">Les couleurs du logo</h3>
  {liste_nu(LOGO_C, True)}
  <h3 class="st">Les fonds des pages et des zones</h3>
  {liste_nu(FONDS_C)}
  <h3 class="st">Les textes</h3>
  {liste_nu(TEXTES_C)}
  <h3 class="st">Petits détails</h3>
  {details}
  <div class="cols2">
    <div class="encadre"><h3>À faire</h3><ul class="regles"><li>Liens et boutons en vert foncé ; l’olive adouci seulement pour les grands fonds.</li><li>Sur l’olive et le gris Nardo : textes, liens et focus en blanc ; le vert clair seulement pour les grands titres et les grands chiffres.</li><li>Alterner fond blanc, fond clair et zones de couleur, une idée par section.</li></ul></div>
    <div class="encadre non"><h3>À ne pas faire</h3><ul class="regles"><li>Écrire en vert anis sur un fond clair (2,1 pour 1, illisible).</li><li>Utiliser l’encre comme fond de zone.</li><li>Éclaircir le gris Nardo : le texte blanc ne serait plus lisible.</li><li>Passer le site en thème sombre : le logo doit rester dans ses couleurs.</li></ul></div>
  </div>
</section>

<section class="ch" id="typo" aria-labelledby="t-typo">
  {chap(3, 'typo', 'La typographie')}
  <p>Une seule police, Nunito : celle du logo (validée le 4 novembre 2026), retenue aussi pour tous les textes du site, y compris ceux des dessins (drapeaux, journaux), par Isabelle Eimer le 7 novembre 2026, après comparaison avec Figtree. Ronde et chaleureuse, elle est gratuite (Google Fonts, licence libre).</p>
  <div class="specimen"><div class="aa" aria-hidden="true">Aa</div><div class="graisses">{graisses}</div></div>
  <h3 class="st">Les tailles, avec de vrais textes du site, au vrai corps sur ordinateur</h3>
  <div>{typo}</div>
  <p class="txt">Sur téléphone, les grands titres rétrécissent (48 px deviennent 34 px) ; le texte courant reste à 17 px. Dans les listes, la date est en gris et en graisse normale.</p>
  <ul class="regles">
    <li>Mettre en valeur par la graisse ou la couleur, pas par la taille ; pas de capitales forcées.</li>
    <li>Une espace fine insécable avant les signes <span class="sig">;</span> <span class="sig">!</span> <span class="sig">?</span> et le guillemet fermant <span class="sig">»</span>, après le guillemet ouvrant <span class="sig">«</span>, et une espace insécable avant les deux-points. Apostrophe typographique <span class="sig">’</span>.</li>
    <li>Numéros et mots à trait d’union gardés sur une ligne (2026-2030, covid-19, e-mail).</li>
    <li>Italique seulement pour les citations, les mentions « à compléter » et les remarques sur la maquette, entre parenthèses.</li>
    <li>« Bienvenue », sur la banderole de la page Adhérer, est écrit à la main (police Kalam, transformée en dessin).</li>
  </ul>
</section>

<section class="ch" id="onglets" aria-labelledby="t-onglets">
  {chap(4, 'onglets', 'Les onglets')}
  <p>Les pages Veille, Presse, Actualités, Documentation et Espace adhérent ont chacune la couleur de leur bandeau et une mascotte à droite du titre ; l’accueil, Le syndicat, Adhérer et Informations légales restent sur fond blanc. Le menu complet s’affiche au-dessus de 1{NN}100{NB}px de large ; en dessous, un menu compact.</p>
  <ul class="ordre" aria-label="Ordre du menu et couleur de chaque onglet">{ordre}</ul>
  {fig('entete-1280.png', 'L’en-tête : bandeau « Maquette de travail », logo, onglets, recherche, Espace adhérent, bouton Adhérer', tel='menu-390-entete.png')}
  <div class="onglets">{onglets}</div>
  <div class="bloc"><h3 class="st">Sur l’accueil, les bannières reprennent la couleur de l’onglet où elles mènent</h3></div>
  <div class="bannieres">{bannieres}</div>
</section>

<section class="ch" id="mascottes" aria-labelledby="t-mascottes">
  {chap(5, 'mascottes', 'Les mascottes')}
  <p>De petits biologistes dessinés au marqueur : trait noir épais aux bouts arrondis, grosse tête ronde, blouse blanche avec un simple trait vert anis sur le côté (modèle 1, choisi par Isabelle Eimer le 6 novembre 2026). Neuf dessins, à douze endroits du site. Ici, chaque dessin est agrandi ou réduit pour remplir sa vignette ; sur le site, tous les personnages ont la même taille.</p>
  <div class="mascottes">{mascottes}</div>
  <ul class="regles">
    <li>Les mascottes ne se modifient pas : dessins, couleurs, trait vert de la blouse et contours restent tels quels.</li>
    <li>Toutes à la même échelle : un personnage mesure de 130 à 190 px de haut selon la largeur de l’écran (179 px sur un écran de 1{NN}280{NB}px), 112 px sur téléphone.</li>
    <li>Sur fond clair : une ombre au sol. Sur fond foncé (olive, gris Nardo) : un contour blanc et pas d’ombre.</li>
    <li>À droite du grand titre des pages ; à gauche du titre dans les bannières de l’accueil, sauf les trois lecteurs, dans la colonne de droite du « Flash Info » ; les groupes sont centrés sous le titre.</li>
    <li>Elles sont décoratives : les lecteurs d’écran les ignorent.</li>
    <li>Mascottes de saison (Noël, été) : dessins prêts, pas encore sur le site, en attente du choix du bureau.</li>
  </ul>
</section>

<section class="ch" id="elements" aria-labelledby="t-elements">
  {chap(6, 'elements', 'Les éléments des pages')}
  <p>Les éléments qui reviennent d’une page à l’autre, dessinés dans le même esprit que les mascottes.</p>
  {elements}
</section>

<section class="ch" id="mouvement" aria-labelledby="t-mouvement">
  {chap(7, 'mouvement', 'Le mouvement')}
  <p>Des animations rares et qui ont un sens (« attractif mais professionnel », Isabelle Eimer, 6 novembre 2026). Rien ne bouge en continu : après l’ouverture de la page, tout s’arrête dès qu’on ne fait plus défiler.</p>
  <div class="cols2">
    <div class="encadre"><h3>Ce qui bouge</h3><ul class="regles">
      <li>Les deux ronds du logo se rapprochent à l’ouverture de chaque page.</li>
      <li>Le séparateur se dessine ; le filet vert des trois piliers se trace ; les pastilles des missions se dessinent.</li>
      <li>L’onglet de la page en cours se souligne en vert ; l’en-tête prend une légère ombre au défilement.</li>
      <li>Au défilement, les mascottes réagissent comme montées sur ressort puis reviennent en place ; les drapeaux flottent, les engrenages tournent. Seul le duo qui se serre la main ne bascule pas.</li>
      <li>Au défilement, les blocs (piliers, missions, fiches, avantages, cartes de veille) se posent à mesure qu’ils entrent dans l’écran, sans fondu ; le sous-menu souligne la rubrique en cours de lecture.</li>
      <li>Les deux biologistes qui se serrent la main (Espace adhérent, bannière « Rejoindre le SLBC ») : quatre secousses amorties et un signe de bienvenue, en deux secondes, quand ils arrivent entièrement à l’écran, à l’ouverture de l’espace adhérent et à la connexion.</li>
    </ul></div>
    <div class="encadre non"><h3>Ce qu’on ne fait pas</h3><ul class="regles">
      <li>Faire apparaître chaque bloc en fondu au défilement.</li>
      <li>Des cascades, des cartes qui se soulèvent au survol.</li>
      <li>Des halos, des pulsations, un mouvement continu.</li>
    </ul><p style="font-size:15px">Ces effets font penser à un site généré par une IA ou à un modèle tout fait.</p></div>
  </div>
  <p class="txt">Si le visiteur a demandé moins d’animations dans les réglages de son appareil, tout s’affiche directement.</p>
</section>

<section class="ch" id="regles" aria-labelledby="t-regles">
  {chap(8, 'regles', 'Les règles à respecter')}
  <div class="cols2">
    <div class="encadre"><h3>Le ton</h3><ul class="regles">
      <li>Rendu professionnel, inspiré des grandes marques, jamais « généré par IA ».</li>
      <li>Pas de pictogrammes décoratifs, pas de listes à coches, pas de titres-slogans.</li>
      <li>Phrases courtes, voix active, titres qui décrivent, faits vérifiables.</li>
      <li>Ne rien inventer : ce qui manque reste marqué « à compléter ».</li>
    </ul></div>
    <div class="encadre"><h3>L’accessibilité</h3><ul class="regles">
      <li>Contraste d’au moins 4,5 pour 1 pour le texte courant, 3 pour 1 pour les grands textes (24 px, ou 18,7 px en gras).</li>
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

<p class="pied">Charte graphique du site SLBC, version de travail du 8 novembre 2026, faite à partir de captures du site. À valider par le bureau. Les captures montrent la maquette ; une fois validées par le bureau, ces règles serviront de référence pour le site définitif.</p>
</div>
'''

# ---------- Typographie française : texte et attributs lus par les lecteurs d’écran (pas les styles) ----------
MOT = r"[0-9A-Za-zÀ-ÖØ-öø-ÿŒœ’]+"
def fr_txt(t):
    t = t.replace('« ', '«' + NN).replace(' »', NN + '»').replace(' ;', NN + ';').replace(' !', NN + '!').replace(' ?', NN + '?').replace(' :', NB + ':')
    t = re.sub(r'(\d) (px|%|unités)', '\\1' + NN + '\\2', t)          # nombre et unité sur une ligne
    t = re.sub(r'(\d) pour (\d)', '\\1' + NB + 'pour' + NB + '\\2', t)  # « 4,5 pour 1 » sur une ligne
    return t
def fr(m):
    t = fr_txt(m.group(1))
    t = re.sub(f'({MOT}(?:-{MOT})+)', r'<span class="nw">\1</span>', t)  # mots à trait d’union sur une ligne
    return '>' + t + '<'
tete, corps = html.split('</style>', 1)
corps = re.sub(r'>([^<]+)<', fr, corps)
corps = re.sub(r'(alt|aria-label)="([^"]*)"', lambda m: m.group(1) + '="' + fr_txt(m.group(2)) + '"', corps)
html = tete + '</style>' + corps
open(OUT, 'w', encoding='utf-8').write(html)
print('ok', len(html))
