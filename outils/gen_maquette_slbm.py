"""Variante de la maquette au nom SLBM, Syndicat des Laboratoires de Biologie Médicale (11 novembre 2026, demande d'Isabelle Eimer :
« Prépare un artefact avec le logo SLBM syndicat des laboratoires de biologie médicale. Change SLBC partout par SLBM »).
Part de la page unique publiée de la maquette SLBC et change le nom partout où il est écrit :
- « SLBC » (en capitales) devient « SLBM » ;
- « Biologie Clinique » (avec capitales, le nom du syndicat) devient « Biologie Médicale » ;
- le bandeau « Maquette de travail » précise qu'il s'agit de la variante au nom SLBM ;
- les adresses e-mail en @slbc.fr passent en @slbm.fr (contact@slbm.fr, bureau@slbm.fr ; demande d'Isabelle Eimer du 11 novembre 2026 :
  « Remplace les @slbc.fr par @slbm.fr aussi »).
Ne changent pas : l'adresse slbc.fr du site actuel (bandeau), le lien LinkedIn, les noms de
fichiers et les clés de stockage du navigateur (tout en minuscules), la « Société française de biologie clinique » (SFBC, un partenaire),
et le contenu des documents PDF lus dans la liseuse.
La maquette SLBC, la charte SLBC et la charte du site ne changent pas.
usage : python3 gen_maquette_slbm.py <page unique SLBC> <page unique SLBM>"""
import re, sys
src, out = sys.argv[1], sys.argv[2]
t = open(src, encoding='utf-8').read()
n_sigle = len(re.findall(r'\bSLBC\b', t)); n_nom = t.count('Biologie Clinique'); n_mail = t.count('@slbc.fr')
t = re.sub(r'\bSLBC\b', 'SLBM', t)
t = t.replace('Biologie Clinique', 'Biologie Médicale')
t = t.replace('@slbc.fr', '@slbm.fr')
ancien = 'Maquette de travail\u00a0: proposition de refonte du site slbc.fr'
assert t.count(ancien) == 1, t.count(ancien)
t = t.replace(ancien, 'Maquette de travail, variante au nom SLBM\u00a0: proposition de refonte du site slbc.fr')
# Contrôles : plus aucun « SLBC », le partenaire SFBC garde son nom, les adresses restent
assert not re.search(r'\bSLBC\b', t)
assert 'Société française de biologie clinique' in t and 'contact@slbm.fr' in t and '@slbc.fr' not in t
open(out, 'w', encoding='utf-8').write(t)
print('ok', n_sigle, 'SLBC changés,', n_nom, '« Biologie Clinique » changés,', n_mail, 'adresses @slbc.fr changées')
