"""Planche des liens proposés pour la Documentation (10 novembre 2026). Lit verifies.json (relecture), écrit planche-liens.html et numeros.json."""
import json, re, html, os
D = os.path.dirname(os.path.abspath(__file__))
V = json.load(open(D + '/verifies.json', encoding='utf-8'))['relu']['items']
NB, FI = ' ', ' '

ORDRE_RUB = ['Études et rapports', 'Nomenclature', 'Textes réglementaires']
garde = [x for x in V if x['avis'] != 'à écarter']
ecart = [x for x in V if x['avis'] == 'à écarter']
# ordre : rubrique (ordre de la page), puis ordre de la relecture (groupes, recommandés d'abord)
garde.sort(key=lambda x: (ORDRE_RUB.index(x['rubrique']), V.index(x)))
NUM = {x['k']: i + 1 for i, x in enumerate(garde)}

EDITEUR = [('legifrance', 'Légifrance'), ('ameli.fr', 'Assurance maladie'), ('codage.ext.cnamts', 'Assurance maladie'), ('ansm.sante', 'ANSM'),
           ('has-sante', 'Haute Autorité de santé'), ('santepubliquefrance', 'Santé publique France'), ('cofrac', 'Cofrac'),
           ('ordre.pharmacien', 'Ordre des pharmaciens'), ('medecin.fr', 'Ordre des médecins'), ('senat.fr', 'Sénat'),
           ('eur-lex', 'EUR-Lex (Union européenne)'), ('health.ec.europa', 'Commission européenne')]
DATE = {38: 'Avril 2026', 37: '5 novembre 2026', 13: 'Données 2014 à 2025', 14: 'Données de 2012 à avril 2026', 23: '10 avril 2025',
        24: 'Situation au 1er janvier 2026', 30: '25 septembre 2024', 8: 'Tenue à jour par l’Assurance maladie', 9: '3 mars 2026', 10: '14 novembre 2025',
        0: 'Version en vigueur', 1: 'Version en vigueur', 50: 'Mise à jour le 4 décembre 2024', 3: '4 février 2026, JO du 7 février 2026',
        6: '4 avril 2025, JO du 6 avril 2025', 21: 'Mise à jour le 10 février 2026', 54: 'Non datée', 7: '28 novembre 2025, JO du 30 novembre 2025',
        2: '13 janvier 2010', 11: 'Date non relevée', 35: 'Dispositif en place depuis le 1er septembre 2024', 36: '8 juillet 2024, JO du 9 juillet 2024',
        16: 'Révision 08, applicable depuis le 1er octobre 2023', 18: 'Mise à jour le 25 juin 2021', 40: 'Mise à jour le 22 avril 2026',
        22: 'Mise à jour le 23 juin 2026', 41: 'Mise à jour le 29 septembre 2026', 39: 'Octobre 2023', 25: 'Édition de juillet 2026',
        49: '24 juillet 2026', 53: 'Mise à jour le 4 septembre 2025', 28: '12 mars 2026', 29: '7 septembre 2022, prolongé jusqu’en 2027',
        26: '26 février 2026, JO du 27 février 2026', 27: '26 décembre 2025, JO du 27 décembre 2025', 5: 'Mise à jour le 19 septembre 2025',
        17: '17 avril 2026, JO du 21 avril 2026', 4: '5 avril 2017, avec ses versions à jour', 45: 'Janvier 2023', 42: '8 août 2023', 51: 'Non datée'}
TITRE = {0: 'Code de la santé publique, livre II : biologie médicale (partie législative, articles L6211-1 à L6242-5)',
         1: 'Code de la santé publique, livre II : biologie médicale (partie réglementaire, articles D6211-1 à R6241-4)',
         8: 'Table nationale de biologie (NABM) : téléchargement de la version en vigueur',
         16: 'Exigences pour l’accréditation selon la norme NF EN ISO 15189 : 2022 (SH REF 02, révision 08)',
         38: 'Surveillance de la résistance bactérienne aux antibiotiques en soins de ville et en Ehpad, mission PRIMO : résultats 2024',
         4: 'Règlement (UE) 2017/746 relatif aux dispositifs médicaux de diagnostic in vitro'}
RESERVE = {
    37: 'Bulletin d’épidémiologie remplacé chaque année : il vaut surtout pour le chiffre du dépistage en laboratoire.',
    13: 'Fichiers de données à ouvrir avec un tableur : utile surtout aux groupes de travail.',
    14: 'Tableaux de données à ouvrir avec un tableur : utile surtout aux groupes de travail.',
    23: 'Document de position de l’Ordre. Une partie porte sur la financiarisation, thème retiré des missions du site : à relire par le bureau.',
    24: 'PDF de 268 pages (10,7 Mo), lent à ouvrir sur téléphone, pour 5 pages sur la biologie médicale (pages 29 à 33).',
    30: 'Rapport de 2024 sur la financiarisation, thème retiré des missions du site. Le rapport IGAS-IGF de 2025, plus récent, est déjà dans la Documentation.',
    9: 'Une décision parmi d’autres : la table à jour (n° {8}) suffit. À ajouter seulement avec toutes les décisions parues depuis 2024.',
    10: 'Une décision parmi d’autres : la table à jour (n° {8}) suffit. À ajouter seulement avec toutes les décisions parues depuis 2024.',
    54: 'Page non datée, écrite pour les pharmaciens biologistes : les médecins biologistes relèvent de l’Ordre des médecins.',
    7: 'Ne concerne que les laboratoires qui recrutent par l’intérim.',
    2: 'Texte historique : ses règles sont aujourd’hui dans le Code (n° {0} et n° {1}).',
    41: 'Page d’un outil que les laboratoires concernés utilisent déjà ; la liste des maladies (n° {40}) y renvoie.',
    53: 'Écrite surtout pour les entreprises, et mise à jour avant le nouveau code de déontologie (un numéro d’article a changé).',
    29: 'Long arrêté pour toutes les professions de santé : la biologie n’y occupe que quelques lignes.',
    26: 'La page ne contient pas le référentiel lui-même ; la page de l’Ordre (n° {28}) l’explique mieux.',
    27: 'Texte de procédure, utile surtout quand la plateforme de suivi sera ouverte.',
    17: 'Décret technique, écrit d’abord pour les fabricants ; pour la réactovigilance, la page de l’ANSM (n° {22}) suffit.',
    4: 'Texte européen long et juridique ; la page de l’ANSM (n° {5}) en donne l’essentiel en français.',
    45: 'En anglais, et ne concerne que les tests mis au point au laboratoire, rares en ville.',
    42: 'Texte de 2023 modifié en décembre 2024 : mieux vaudrait relier l’article à jour du Code.',
    51: 'Page non datée ; certains passages semblent anciens.',
}
NOTE = {3: 'Je proposerais d’ajouter aussi la version à jour de l’arrêté du 13 août 2014, qu’il modifie.',
        8: 'Le site de codage de l’Assurance maladie ne répondait pas d’ici : à ouvrir une fois pour contrôle.',
        28: 'Écrite pour les pharmaciens biologistes : à vérifier pour les médecins biologistes.'}
ECART = {33: 'Doublon : même jeu de données que l’Assurance maladie, sur data.gouv.fr.',
         34: 'Rapport de l’Assemblée nationale sur les fonds d’investissement : quelques pages sur la biologie, titre polémique.',
         32: 'Actualité de la DREES : page injoignable, date non confirmée, données de 2022.',
         31: 'Fiche de la DREES édition 2025 : une édition plus récente est parue.',
         47: 'Base de données de l’EFLM : en anglais, source non officielle.',
         12: 'Page générale de l’Assurance maladie sur la facturation ; le prix de la lettre B affiché n’y est pas à jour.',
         19: 'Avis de la HAS sur les tests IGRA : pas encore inscrit à la NABM, il relève plutôt de la veille.',
         52: 'Fiche de l’Ordre sur la qualité : trop générale.',
         46: 'Norme ISO 15189 : page de vente, en anglais, norme payante.',
         20: 'Doublon de la liste des maladies à signalement obligatoire.',
         44: 'Projet européen de simplification : en anglais, encore en discussion, plutôt pour la veille.',
         43: 'Doublon du règlement européen, version d’origine.',
         48: 'Espace européen des données de santé : page injoignable, effet lointain pour les laboratoires.',
         15: 'Communiqué de l’Assurance maladie sur le protocole : fait doublon avec la salle de presse.'}

def typo(s):
    s = re.sub(r'\s+([;!?])', FI + r'\1', s)
    s = re.sub(r'\s+:', NB + ':', s)
    s = re.sub(r'«\s*', '«' + FI, s); s = re.sub(r'\s*»', FI + '»', s)
    return s

def refs(s):
    def r(m):
        k = int(m.group(1))
        return ('n°' + NB + str(NUM[k])) if k in NUM else ''
    s = re.sub(r'\bk\s*=?\s*(\d+)\b', r, s)
    return s.replace('propositions n°', 'n°')

def clean(s):
    s = re.sub(r'^D’après la recherche initiale \([^)]*\)\s*:\s*', '', s)
    s = re.sub(r'D’après la recherche initiale \([^)]*\),\s*', '', s)
    return typo(refs(s)).strip()

def e(s): return html.escape(s, quote=True)

def editeur(x):
    for h, n in EDITEUR:
        if h in x['url']: return n
    return x['editeur']

def statut(x):
    if x['statut_page'] == 'ouverte': return ('lue', 'Page lue')
    return ('protegee', 'Site protégé contre les robots : titre et date vérifiés par recherche')

cartes = []; rub = None; grp = None
for x in garde:
    n = NUM[x['k']]
    if x['rubrique'] != rub:
        if rub: cartes.append('</section>')
        rub = x['rubrique']; grp = None
        nb = sum(1 for y in garde if y['rubrique'] == rub)
        cartes.append('<section class="rub"><h2>' + e(rub) + ' <span class="cpt">' + str(nb) + ' lien' + ('s' if nb > 1 else '') + '</span></h2>')
    g = re.sub(r'\s*\(.*$', '', x['groupe']).strip()
    nouveau = 'nouveau' in x['groupe'].lower()
    if g != grp:
        grp = g
        cartes.append('<h3>' + e(typo(g)) + (' <span class="neuf">nouveau groupe</span>' if nouveau else '') + '</h3>')
    rec = x['avis'] == 'recommandé'
    cls, st = statut(x)
    res = RESERVE.get(x['k'], '')
    res = re.sub(r'\{(\d+)\}', lambda m: str(NUM.get(int(m.group(1)), '?')), res)
    note = NOTE.get(x['k'], '')
    cartes.append(
        '<article class="lien' + (' rec' if rec else '') + '" id="n' + str(n) + '">'
        '<div class="num" aria-hidden="true">' + str(n) + '</div><div class="corps">'
        '<p class="tete"><span class="avis ' + ('a-rec' if rec else 'a-pos') + '">' + ('Recommandé' if rec else 'Possible') + '</span>'
        '<span class="src">' + e(editeur(x)) + ' · ' + e(typo(DATE[x['k']])) + '</span></p>'
        '<h4><span class="vh">N° ' + str(n) + ' : </span><a href="' + e(x['url']) + '" target="_blank" rel="noopener">' + e(typo(TITRE.get(x['k'], x['titre_exact']))) + '</a></h4>'
        '<p class="desc">' + e(clean(x['description'])) + '</p>'
        '<p class="int"><strong>Pour les adhérents' + NB + ':</strong> ' + e(clean(x['interet'])) + '</p>'
        + ('<p class="res"><strong>Réserve' + NB + ':</strong> ' + e(typo(res)) + '</p>' if res else '')
        + ('<p class="res"><strong>À noter' + NB + ':</strong> ' + e(typo(note)) + '</p>' if note else '')
        + '<p class="st st-' + cls + '">' + e(st) + '</p></div></article>')
cartes.append('</section>')

ecarts = ''.join('<li><a href="' + e(x['url']) + '" target="_blank" rel="noopener">' + e(typo(re.sub(r'\s*\(.*$', '', x['titre_exact']))) + '</a><span>' + e(typo(ECART[x['k']])) + '</span></li>' for x in ecart)
nrec = sum(1 for x in garde if x['avis'] == 'recommandé'); npos = len(garde) - nrec
recs = [NUM[x['k']] for x in garde if x['avis'] == 'recommandé']

LOGO = ('<svg class="logo" viewBox="0 0 120 120" width="44" height="44" aria-hidden="true"><defs><clipPath id="c1"><circle cx="44" cy="44" r="36"/></clipPath></defs>'
        '<circle cx="44" cy="44" r="36" fill="#5E6266"/><circle cx="76" cy="76" r="36" fill="#A3BE3C"/>'
        '<circle cx="76" cy="76" r="36" fill="#5F7A2B" clip-path="url(#c1)"/></svg>')

page = '''<title>Liens pour la Documentation</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Palette de la charte SLBC, thème clair uniquement (choix de la charte) ; une colonne de lecture, liste à filets fins. */
:root { --encre:#2E3236; --texte:#3F4347; --gris:#5E6266; --nardo:#74777A; --vert:#5F7A2B; --anis:#A3BE3C; --vert-clair:#D6E4A6;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E5E0; --police:"Nunito","Arial Rounded MT Bold",Arial,sans-serif; color-scheme:light }
body { background:var(--blanc); color:var(--texte); font-family:var(--police); font-size:17px; line-height:1.55; }
.wrap { max-width:820px; margin:0 auto; padding-left:max(16px, env(safe-area-inset-left, 0px)); padding-right:max(16px, env(safe-area-inset-right, 0px)); padding-block:32px 64px; }
header { display:flex; gap:16px; align-items:center; }
.logo { flex:none; }
h1 { margin:0; font-weight:900; font-size:clamp(28px, 5vw, 38px); line-height:1.15; color:var(--encre); text-wrap:balance; }
.lede { margin:18px 0 0; font-size:19px; color:var(--texte); max-width:62ch; }
.mode { margin:24px 0 8px; padding:18px 20px; background:var(--fond); border-radius:14px; display:grid; gap:10px; }
.mode p { margin:0; }
.mode .ex { color:var(--gris); }
.leg { display:flex; flex-wrap:wrap; gap:10px 18px; align-items:center; margin:18px 0 0; font-size:15px; color:var(--gris); }
.avis { display:inline-block; padding:2px 10px; border-radius:999px; font-size:13px; font-weight:800; letter-spacing:.02em; }
.a-rec { background:var(--vert); color:var(--blanc); }
.a-pos { background:var(--vert-clair); color:var(--encre); }
.rub { margin-top:44px; }
h2 { margin:0; padding-bottom:10px; border-bottom:2px solid var(--anis); font-size:26px; font-weight:900; color:var(--encre); display:flex; justify-content:space-between; align-items:baseline; gap:12px; flex-wrap:wrap; }
.cpt { font-size:15px; font-weight:700; color:var(--gris); }
h3 { margin:26px 0 0; font-size:15px; font-weight:800; letter-spacing:.03em; text-transform:uppercase; color:var(--gris); }
.neuf { margin-left:6px; font-size:12px; font-weight:700; text-transform:none; letter-spacing:0; color:var(--vert); border:1px solid var(--vert); border-radius:999px; padding:1px 8px; }
.lien { display:grid; grid-template-columns:52px minmax(0,1fr); gap:14px; padding:18px 0; border-bottom:1px solid var(--filet); }
.num { font-weight:900; font-size:22px; color:var(--encre); font-variant-numeric:tabular-nums; width:44px; height:44px; border-radius:50%; display:grid; place-items:center; background:var(--fond); }
.rec .num { background:var(--vert-clair); }
.corps { min-width:0; display:grid; gap:6px; }
.corps p { margin:0; }
.tete { display:flex; flex-wrap:wrap; gap:6px 12px; align-items:center; }
.src { font-size:14px; color:var(--gris); }
h4 { margin:2px 0 0; font-size:19px; line-height:1.35; font-weight:800; text-wrap:pretty; }
h4 a { color:var(--vert); text-decoration:underline; text-decoration-thickness:1px; text-underline-offset:3px; overflow-wrap:anywhere; }
h4 a:hover { text-decoration-thickness:2px; }
a:focus-visible { outline:3px solid var(--vert); outline-offset:3px; border-radius:4px; }
.vh { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
.desc { color:var(--texte); }
.int, .res { font-size:16px; }
.int strong, .res strong { color:var(--encre); }
.res { color:var(--gris); }
.st { font-size:13px; color:var(--nardo); }
.st-lue::before, .st-protegee::before { content:""; display:inline-block; width:8px; height:8px; border-radius:50%; margin-right:7px; vertical-align:1px; }
.st-lue::before { background:var(--anis); }
.st-protegee::before { background:var(--blanc); box-shadow:inset 0 0 0 2px var(--nardo); }
details { margin-top:48px; border-top:2px solid var(--filet); padding-top:16px; }
summary { cursor:pointer; font-size:20px; font-weight:800; color:var(--encre); padding:6px 0; }
summary:focus-visible { outline:3px solid var(--vert); outline-offset:3px; }
.ecarts { list-style:none; margin:10px 0 0; padding:0; }
.ecarts li { display:grid; gap:2px; padding:12px 0; border-bottom:1px solid var(--filet); }
.ecarts a { color:var(--vert); font-weight:700; overflow-wrap:anywhere; }
.ecarts span { font-size:15px; color:var(--gris); }
.pied { margin-top:40px; font-size:14px; color:var(--nardo); }
@media (max-width:520px) { body { font-size:16px; } .lien { grid-template-columns:40px minmax(0,1fr); gap:10px; } .num { width:36px; height:36px; font-size:18px; } h4 { font-size:18px; } }
</style>
<div class="wrap">
<header>''' + LOGO + '''<h1>Liens pour la Documentation</h1></header>
<p class="lede">''' + e(typo(str(len(garde)) + ' liens officiels proposés pour la page Documentation de la maquette, classés par rubrique. Rien n’est encore ajouté au site : vous choisissez.')) + '''</p>
<div class="mode">
<p><strong>''' + e(typo('Pour répondre :')) + '''</strong> ''' + e(typo('donnez-moi simplement les numéros à ajouter dans la conversation.')) + '''</p>
<p class="ex">''' + e(typo('Par exemple : « tous les recommandés », « tous les recommandés sauf 3 », ou « 1, 5, 9 et 12 ».')) + '''</p>
</div>
<p class="leg"><span><span class="avis a-rec">Recommandé</span> ''' + str(nrec) + ''' liens</span><span><span class="avis a-pos">Possible</span> ''' + str(npos) + ''' liens</span>
<span class="st st-lue">Page lue</span><span class="st st-protegee">''' + e('Site protégé : vérifié par recherche') + '''</span></p>
''' + '\n'.join(cartes) + '''
<details><summary>''' + e(typo(str(len(ecart)) + ' liens écartés, et pourquoi')) + '''</summary><ul class="ecarts">''' + ecarts + '''</ul></details>
<p class="pied">''' + e(typo('Recherche et vérification du 10 novembre 2026, sur des sites officiels uniquement (aucun site de syndicat, de fédération ou de groupe de laboratoires). Légifrance, ameli et EUR-Lex bloquent les lectures automatiques : pour ces liens, le titre et la date ont été vérifiés par une recherche sur le site officiel ; le contenu sera relu à l’ajout.')) + '''</p>
</div>
'''
open(D + '/planche-liens.html', 'w', encoding='utf-8').write(page)
json.dump({'numeros': {str(NUM[x['k']]): x['k'] for x in garde}, 'recommandes': recs}, open(D + '/numeros.json', 'w', encoding='utf-8'), indent=1)
print(len(garde), nrec, npos, len(ecart), 'recommandés :', recs)
leftover = re.findall(r'k\s*=\s*\d+|\{\d+\}|recherche initiale|Relecture', page)
print('restes :', leftover[:10])
