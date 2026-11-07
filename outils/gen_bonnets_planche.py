"""Planche « Bonnets de Noël : quatre modèles » d'après les exemples envoyés par Isabelle Eimer.
usage : python3 gen_bonnets_planche.py <gen_saisons.py> <index.html> <dossier> <planche-noel-modele.html> <sortie.html>"""
import sys, re, importlib.util
GEN, INDEX, DIR, MODELE, OUT = sys.argv[1:6]
src = open(GEN, encoding='utf-8').read()
src = src[:src.index('# ---------------- Planches ----------------')]
sys.argv = ['gen', INDEX, DIR, DIR + '/joyeux-noel.txt', DIR + '/bonnes-vacances.txt']
ns = {'__name__': 'gen'}
exec(src, ns)
spec = importlib.util.spec_from_file_location('bm', DIR + '/bonnets_modeles.py'); bm = importlib.util.module_from_spec(spec); spec.loader.exec_module(bm)

CLES = [('defendons', 'Accueil'), ('lecteurs', 'À côté du communiqué'), ('poignee', 'Espace adhérent')]
svgs = {k: svg for k, _, svg in ns['MASCOTTES']}
MODELES = [
    ('A', 'Modèle A : bandeau lisse, pointe en arrière',
     'Bandeau blanc épais et lisse, un peu plus large que la tête, aux bouts arrondis. Le rouge est posé dessus et sa pointe retombe en arrière, avec le pompon.'),
    ('B', 'Modèle B : bandeau en fourrure',
     'La même forme, avec un bandeau et un pompon en fourrure (petites bosses tout autour), comme sur la planche d’exemples.'),
    ('C', 'Modèle C : bonnet pointu',
     'Le même bandeau, un bonnet haut et pointu, le pompon au sommet.'),
    ('D', 'Modèle D : pointe tombante',
     'Le même bandeau, la pointe passe par-dessus la tête et retombe sur le côté, le pompon près de l’oreille.'),
]
lignes = []
for style, titre, texte in MODELES:
    def variante(st=style, **kw):
        svg, bas = bm.bonnet(st)
        ns['BORD_BAS'][:] = bas
        return svg
    ns['bonnet_noel'] = variante
    cases = []
    for k, lieu in CLES:
        s = ns['noel'](k, svgs[k])
        m, (x, y, w, hh) = ns['viewbox'](s)
        s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y - 16, w, hh + 16), 1)
        s = re.sub(r'<svg', '<svg aria-hidden="true" focusable="false"', s, count=1)
        cases.append(f'<figure class="case"><div class="dessin">{s}</div><figcaption>{lieu}</figcaption></figure>')
    lignes.append(f'<section class="mascotte-ligne" id="modele-{style.lower()}"><h2>{titre}</h2><p class="note">{texte}</p>'
                  f'<div class="cases trois">{"".join(cases)}</div></section>')

h = open(MODELE, encoding='utf-8').read()
h = h.replace('<title>Mascottes de Noël SLBC</title>', '<title>Bonnets de Noël SLBC</title>', 1)
h = re.sub(r'<h1>[^<]*</h1>', '<h1>Bonnets de Noël : quatre modèles</h1>', h, count=1)
h = re.sub(r'(<div class="titre">\s*<h1>[^<]*</h1>\s*)<p>.*?</p>',
           r'\1<p>D’après les exemples envoyés. Pour les quatre modèles, la base est la même : un bandeau blanc épais, un peu plus large que la tête, aux bouts bien arrondis, presque droit, posé juste au-dessus des yeux. Le rouge est posé sur le bandeau et part du début de ses bouts arrondis. Chaque modèle est montré sur trois dessins du site.</p>',
           h, count=1, flags=re.S)
h = h.replace('</style>', '.cases.trois{grid-template-columns:repeat(3,minmax(0,1fr))}'
              '@media (max-width:900px){.cases.trois{grid-template-columns:minmax(0,1fr)}}</style>', 1)
h = h.replace('{{LIGNES}}', '\n'.join(lignes))
h = re.sub(r'<p class="pied">.*?</p>', '<p class="pied">Propositions du 7 novembre 2026. Une fois le modèle choisi, il sera posé sur les neuf dessins de la planche de Noël.</p>', h, count=1, flags=re.S)
open(OUT, 'w', encoding='utf-8').write(h)
print('ok', len(h))
