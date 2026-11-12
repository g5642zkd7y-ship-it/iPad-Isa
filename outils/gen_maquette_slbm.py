"""Variante de la maquette au nom SLBM, Syndicat des Laboratoires de Biologie Médicale.
Demandes d'Isabelle Eimer :
- 11 novembre 2026 : « Prépare un artefact avec le logo SLBM syndicat des laboratoires de biologie médicale. Change SLBC partout par SLBM »,
  puis « Remplace les @slbc.fr par @slbm.fr aussi » ;
- 12 novembre 2026 : « On ne change que dans les titres, c'est bien le slbc qui a signé le protocole et tout ce qui est antérieur à
  aujourd'hui en terme de communiqué ou article doit garder le nom slbc ».
Part de la page unique de la maquette SLBC et ne change le nom que dans les titres :
- le logo (en-tête, pied de page, signature sous les deux ronds de l'accueil, logo des aperçus d'e-mails) et le titre de l'onglet ;
- les titres des pages et des rubriques qui portent le nom (« Adhérer au SLBM », « Rejoindre le SLBM »), et ce même nom de page partout
  où il sert de lien (menu, boutons, recherche), ainsi que « Contacter le SLBM » dans la recherche ;
- le copyright du pied de page (« Copyright © 2026 SLBM », demande du 12 novembre 2026 : « Change le copyright en slbm ») ;
- la phrase d'introduction de « Nos représentants » (« Les instances où le SLBM est représenté, et ses représentants. », même jour) ;
- sur la page Veille, « La veille est réservée aux adhérents du SLBM. » (même jour) ;
- le texte d'introduction de la Salle de presse (« Les communiqués que le SLBM publie seul ou avec les autres syndicats de biologistes. », même jour) ;
- les adresses e-mail en @slbc.fr passent en @slbm.fr (demande du 11 novembre) ;
- le bandeau « Maquette de travail » précise qu'il s'agit de la variante au nom SLBM.
Tout le reste garde « SLBC » : communiqués, actualités, fiche de veille, citations, signatures (protocole, recommandations, accords),
statuts, comptes, informations légales, textes des pages, e-mails d'exemple, le journal « SLBC » d'une mascotte, documents PDF.
La maquette SLBC, la charte SLBC et la charte du site ne changent pas.
usage : python3 gen_maquette_slbm.py <page unique SLBC> <page unique SLBM>"""
import sys
src, out = sys.argv[1], sys.argv[2]
t = open(src, encoding='utf-8').read()
NB = ' '

def remplacer(old, new, n=1):
    global t
    assert t.count(old) == n, (old, t.count(old), n)
    t = t.replace(old, new)

# Titre de l'onglet
assert t.startswith('<title>SLBC – maquette du site</title>')
remplacer('<title>SLBC – maquette du site</title>', '<title>SLBM – maquette du site</title>')
# Logo : en-tête, signature de l'accueil, pied de page, aperçus d'e-mails
remplacer('aria-label="SLBC, accueil"', 'aria-label="SLBM, accueil"')
remplacer('<span class="brand-word">SLBC</span>', '<span class="brand-word">SLBM</span>')
remplacer('<p class="hero-name">Syndicat des Laboratoires de Biologie Clinique</p>', '<p class="hero-name">Syndicat des Laboratoires de Biologie Médicale</p>')
remplacer('aria-label="SLBC, Syndicat des Laboratoires de Biologie Clinique"', 'aria-label="SLBM, Syndicat des Laboratoires de Biologie Médicale"')
remplacer('<span class="lockup-word">SLBC</span>', '<span class="lockup-word">SLBM</span>')
remplacer('<span>de Biologie Clinique</span></span></span>', '<span>de Biologie Médicale</span></span></span>')
remplacer('<span class="mp-brand">SLBC</span>', '<span class="mp-brand">SLBM</span>', 3)
# Titres des pages et des rubriques, et noms de pages repris dans les liens et la recherche
remplacer('id="h-join">Rejoindre le SLBC</h2>', 'id="h-join">Rejoindre le SLBM</h2>')
remplacer('Adhérer au SLBC', 'Adhérer au SLBM', 7)
remplacer("title: 'Contacter le SLBC'", "title: 'Contacter le SLBM'")
# Copyright du pied de page (12 novembre 2026, demande d'Isabelle Eimer : « Change le copyright en slbm »)
remplacer('Copyright © 2026 SLBC.', 'Copyright © 2026 SLBM.')
# Phrase d'introduction de « Nos représentants » (12 novembre 2026, demande d'Isabelle Eimer : « Change les instances ou le SLBM est représenté »)
remplacer('Les instances où le SLBC est représenté', 'Les instances où le SLBM est représenté')
# Page Veille (12 novembre 2026, demande d'Isabelle Eimer : « Change la veille et réservée aux adhérents du SLB M »)
remplacer('La veille est réservée aux adhérents du SLBC.', 'La veille est réservée aux adhérents du SLBM.')
# Salle de presse, texte d'introduction (12 novembre 2026, demande d'Isabelle Eimer : « Modifie les communiqué que le SLBM publie seul etc. »)
remplacer('Les communiqués que le SLBC publie seul', 'Les communiqués que le SLBM publie seul')
# Adresses e-mail (demande du 11 novembre 2026) et bandeau de la maquette
n_mail = t.count('@slbc.fr')
t = t.replace('@slbc.fr', '@slbm.fr')
remplacer('Maquette de travail' + NB + ': proposition de refonte du site slbc.fr',
          'Maquette de travail, variante au nom SLBM' + NB + ': proposition de refonte du site slbc.fr')
# Contrôles : les faits passés gardent « SLBC »
for garde in ('Le SLBC signe et alerte sur la pression tarifaire', 'Le Syndicat des Laboratoires de Biologie Clinique (SLBC) a signé le 2 novembre 2026',
              'président du SLBC', 'dont le SLBC', 'Statuts du SLBC', 'Syndicat des Laboratoires de Biologie Clinique (SLBC), syndicat professionnel'):
    assert garde in t, garde
assert 'Société française de biologie clinique' in t and '@slbc.fr' not in t
open(out, 'w', encoding='utf-8').write(t)
print('ok :', n_mail, 'adresses @slbc.fr changées ;', t.count('SLBM'), '« SLBM » ;', t.count('SLBC'), '« SLBC » gardés')
