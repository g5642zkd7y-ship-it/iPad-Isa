"""Variante de la maquette au nom SLBM, Syndicat des Laboratoires de Biologie Médicale.
Demandes d'Isabelle Eimer :
- 11 novembre 2026 : « Prépare un artefact avec le logo SLBM syndicat des laboratoires de biologie médicale. Change SLBC partout par SLBM »,
  puis « Remplace les @slbc.fr par @slbm.fr aussi » ;
- 12 novembre 2026 : « On ne change que dans les titres, c'est bien le slbc qui a signé le protocole et tout ce qui est antérieur à
  aujourd'hui en terme de communiqué ou article doit garder le nom slbc », puis, après plusieurs changements ponctuels :
  « Il faut faire comme si le syndicat venait de changer de nom. Donc on garde les antériorités en slbc et on passe le reste en slbm ».
Part de la page unique de la maquette SLBC :
- garde « SLBC » dans tout ce qui est antérieur au changement de nom (liste ANTERIEUR ci-dessous : communiqué du 4 novembre 2026 et sa
  citation, fiches de veille sur la signature du protocole et sur la proposition de loi, actualité de la recommandation patronale,
  recommandations « dont le SLBC », statuts de 2013, programme de campagne, journal « SLBC » de la mascotte qui lit le communiqué) ;
- passe tout le reste en « SLBM » (« Biologie Clinique » en « Biologie Médicale ») : logo, titres, textes des pages, informations
  légales, formulaires, e-mails d'exemple, recherche ;
- passe les adresses e-mail en @slbm.fr ; le bandeau « Maquette de travail » précise qu'il s'agit de la variante au nom SLBM.
Ne changent pas : le lien LinkedIn, les noms de fichiers et les clés du navigateur (en minuscules), la « Société française de biologie
clinique » (SFBC), le contenu des documents PDF lus dans la liseuse.
La maquette SLBC, la charte SLBC et la charte du site ne changent pas.
usage : python3 gen_maquette_slbm.py <page unique SLBC> <page unique SLBM>"""
import re, sys
src, out = sys.argv[1], sys.argv[2]
t = open(src, encoding='utf-8').read()
NB = ' '

# Ce qui est antérieur au changement de nom garde « SLBC » (texte exact, nombre attendu)
ANTERIEUR = [
    ("Programme de campagne du SLBC", 1),                                    # titre du document (actualité du 5 février 2026)
    ("['Statuts du SLBC'", 1),                                               # titre du PDF des statuts de 2013 dans la liseuse
    ("Les statuts du SLBC", 2),                                              # statuts de 2013 (page Le syndicat, recherche)
    ("le signent, dont le SLBC.", 1),                                        # fiche de veille : signature du protocole
    ("biologistes médicaux, dont le SLBC, ont signé le 2 novembre 2026", 1),
    ("SDBIO, SLBC et SNMB", 1),
    ("Le SLBC suit chaque étape de son examen.", 1),                         # fiche de veille du 23 juin 2026
    ("Le SLBC signe et alerte sur la pression tarifaire", 1),                # communiqué du 4 novembre 2026
    ("with: 'Communiqué du SLBC',\n", 1),
    ("Le Syndicat des Laboratoires de Biologie Clinique (SLBC) a signé", 1),
    ("by: 'Thierry Bouchet, président du SLBC'", 1),
    ("Pour le SLBC, cette trajectoire", 1),
    ("Le SLBC sera vigilant", 1),
    ("Les organisations patronales, dont le SLBC, ont émis", 1),             # actualité du 1er juillet 2026
    ("'Recommandation des organisations patronales, dont le SLBC'", 3),      # recommandations signées (Documentation)
    ('stroke="none">SLBC</text>', 1),                                        # journal de la mascotte, à côté du communiqué
]
gardes = []
for texte, n in ANTERIEUR:
    assert t.count(texte) == n, (texte, t.count(texte), n)
    gardes.append(texte)
    t = t.replace(texte, '\u0000%d\u0000' % (len(gardes) - 1))

n_sigle = len(re.findall(r'\bSLBC\b', t)); n_nom = t.count('Biologie Clinique'); n_mail = t.count('@slbc.fr')
t = re.sub(r'\bSLBC\b', 'SLBM', t)
t = t.replace('Biologie Clinique', 'Biologie Médicale').replace('@slbc.fr', '@slbm.fr')
t = re.sub('\u0000(\\d+)\u0000', lambda m: gardes[int(m.group(1))], t)

ancien = 'Maquette de travail' + NB + ': proposition de refonte du site slbc.fr'
assert t.count(ancien) == 1
t = t.replace(ancien, 'Maquette de travail, variante au nom SLBM' + NB + ': proposition de refonte du site slbc.fr')
assert t.startswith('<title>SLBM – maquette du site</title>')
assert 'Société française de biologie clinique' in t and '@slbc.fr' not in t
assert len(re.findall(r'\bSLBC\b', t)) == sum(n * len(re.findall(r'\bSLBC\b', g)) for g, n in ANTERIEUR)
open(out, 'w', encoding='utf-8').write(t)
print('ok :', n_sigle, '« SLBC » passés en SLBM,', n_nom, '« Biologie Clinique » changés,', n_mail, 'adresses @slbc.fr changées ;',
      len(re.findall(r'\bSLBC\b', t)), '« SLBC » gardés (antériorités)')
