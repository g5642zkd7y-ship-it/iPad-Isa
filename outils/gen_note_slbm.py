"""Note « Mise en service du site » au nom SLBM (11 novembre 2026, demande d'Isabelle Eimer : « Fais une autre note SLBM et rajoute les
éléments à prendre en compte pour la mise en ligne du site sous le nom SLBM »).
Part du modèle de la note SLBC (outils/note-modele.html, note du 7 novembre 2026 mise à jour le 8) et :
- change le nom (SLBC → SLBM, « de Biologie Clinique » → « de Biologie Médicale », adresses @slbc.fr → @slbm.fr, domaine du nouveau
  site et de ses e-mails slbc.fr → slbm.fr ; le site actuel reste « slbc.fr ») ;
- passe la note en Nunito, la police de la charte (la note SLBC, antérieure au 7 novembre, reste en Figtree) ;
- ajoute la partie 2 « Mettre le site en ligne sous le nom SLBM » (outils/note-slbm-partie.html) et renumérote les suivantes ;
- ajoute les étapes du changement de nom (note-slbm-etapes.html au début, note-slbm-etape-google.html après la mise en ligne,
  note-slbm-etapes-fin.html à la fin) ;
- met à jour les points devenus inexacts depuis le 8 novembre (comptes publiés, polices) ;
- applique la typographie française au texte (insécables avant « : », fines avant « ; ! ? » et dans les guillemets, « 1er », n°,
  jour et mois, numéros à trait d'union gardés sur une ligne).
Dans les fragments, ce qui est écrit entre [[ et ]] est gardé tel quel (« [[SLBC]] » pour les faits passés, « [[@slbc.fr]] »…).
usage : python3 gen_note_slbm.py <note-modele.html> <mascotte.svg> <dossier des fragments> <sortie.html>"""
import re, sys, pathlib
MODELE, MASC, FRAG, OUT = sys.argv[1:5]
html = pathlib.Path(MODELE).read_text(encoding='utf-8')
F = pathlib.Path(FRAG)
NB, FINE = '\u00a0', '\u202f'
lire = lambda nom: (F / nom).read_text(encoding='utf-8').strip()

def un(old, new):
    """Remplace un passage qui doit figurer une seule fois ; les espaces du modèle (ordinaire, insécable, fine) sont équivalentes."""
    global html
    motif = re.sub(r'(\\ |\u00a0|\u202f)', '[ \u00a0\u202f]', re.escape(old))
    n = len(re.findall(motif, html))
    assert n == 1, (old[:90], n)
    html = re.sub(motif, lambda m: new, html)

# 1. Points propres à la variante, avant le changement de nom général
un('<title>Mise en service du site SLBC</title>', '<title>Mise en service du site SLBM</title>')
un('family=Figtree:wght@400;500;600;700;800&family=Nunito:wght@700;900', 'family=Nunito:wght@400;500;600;700;800;900')
un('--font:"Figtree",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;', '--font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;')
un('--font-marque:"Nunito","Figtree",system-ui,sans-serif;', '--font-marque:"Nunito",system-ui,sans-serif;')
un('<p class="date">Note de travail du 7 novembre 2026, mise à jour le 8 novembre 2026, à valider par le bureau.</p>',
   '<p class="date">Note de travail du 11 novembre 2026, à valider par le bureau. Elle reprend au nom SLBM la note du 7 novembre 2026, '
   'mise à jour le 8 novembre, ajoute la partie 2 sur le passage au nouveau nom et met à jour quelques points (polices, comptes publiés). '
   'Tant que l’assemblée n’a pas voté le changement, le syndicat s’appelle toujours [[SLBC]].</p>')
un('<span>Note de travail, 7 novembre 2026, mise à jour le 8 novembre 2026</span>', '<span>Note de travail au nom SLBM, 11 novembre 2026</span>')
# Partie 1 : l'adresse de la maquette SLBM n'existe pas encore
un('Part par la messagerie du visiteur vers bureau@slbc.fr</td>',
   'Part par la messagerie du visiteur vers bureau@slbc.fr, une adresse qui n’existe pas encore</td>')
# Partie 3 : noms de domaine ; le site actuel reste slbc.fr, le nouveau site et ses e-mails passent sur slbm.fr
un('<li><strong>Hébergeur</strong> : son nom, son adresse et son téléphone sont à fournir pour les mentions légales.</li>',
   '<li><strong>Hébergeur</strong> : son nom, son adresse et son téléphone sont à fournir pour les mentions légales.</li>\n'
   '    <li><strong>Noms de domaine</strong> : garder slbc.fr, et réserver slbm.fr au nom du syndicat (partie 2). Kstudio indique chez qui et au nom de qui slbc.fr est enregistré aujourd’hui.</li>')
un('À la mise en ligne, les anciennes adresses doivent renvoyer vers les nouvelles pages.',
   'À la mise en ligne, les anciennes adresses de slbc.fr doivent renvoyer vers les nouvelles pages de slbm.fr (partie 2).')
# Partie 5 : envoi des e-mails, mêmes réglages que dans la partie 2
un('les e-mails partent par la messagerie du domaine slbc.fr, avec les réglages d’authentification du domaine (SPF, DKIM), pour ne pas arriver dans les indésirables.',
   'les e-mails partent par la messagerie du domaine slbm.fr, avec les réglages qui prouvent qu’ils viennent bien du syndicat (SPF et DKIM, et DMARC recommandé ; partie 2), pour ne pas arriver dans les indésirables.')
un('doivent être créées sur la messagerie du domaine slbc.fr avant la mise en ligne.',
   'doivent être créées sur la messagerie du domaine slbm.fr avant la mise en ligne, une fois ce domaine réservé (partie 2).')
un('<td>Une adresse du domaine slbc.fr, authentifiée', '<td>Une adresse du domaine slbm.fr, authentifiée')
# Partie 9 : c'est le site qui n'affiche pas de téléphone (le SLBM n'existe pas encore)
un('Téléphone de l’éditeur : le SLBC n’en affiche pas', 'Téléphone de l’éditeur : le site n’en affiche pas')
un('Police Nunito hébergée sur le serveur du site ;', 'Polices Nunito et Kalam hébergées sur le serveur du site ;')
un('<td>Cession écrite des droits sur le logo au SLBC ; dépôt de marque à envisager</td>',
   '<td>Cession écrite des droits sur le logo au syndicat ; dépôt de la marque SLBM à envisager, après la recherche d’antériorité (partie 2)</td>')
# Partie 11 : points devenus inexacts depuis le 8 novembre 2026
un('<li><strong>Police des textes</strong> : Nunito, retenue le 7 novembre 2026 ; la charte graphique est à jour.</li>',
   '<li><strong>Polices</strong> : Nunito, retenue le 7 novembre 2026 ; les textes d’introduction des pages sont écrits à la main (Kalam), depuis le 10 novembre 2026.</li>\n'
   '    <li><strong>Charte graphique</strong> : une variante au nom SLBM existe depuis le 10 novembre 2026 ; le logo SLBM reste à finaliser (partie 2).</li>')
un('<li><strong>Comptes publiés</strong> : exercices 2021 à 2023 ; ajouter les suivants si le SLBC publie ses comptes sur son site.</li>',
   '<li><strong>Comptes publiés</strong> : exercices 2022 à 2025, établis au nom du [[SLBC]] (partie 2).</li>')
# Partie 12 : étapes
un('Avec Kstudio ou l’hébergeur du domaine slbc.fr : créer les adresses contact@slbc.fr et bureau@slbc.fr, et décider qui lit chacune.',
   'Avec Kstudio ou l’hébergeur du domaine slbm.fr : créer les adresses contact@slbm.fr et bureau@slbm.fr, et décider qui lit chacune.')
un('Donner les informations sur l’hébergeur, proposer',
   'Donner les informations sur l’hébergeur et sur l’enregistrement de slbc.fr (chez qui, au nom de qui), proposer')
un('Mettre le site en ligne sur slbc.fr et faire renvoyer les anciennes adresses vers les nouvelles pages.</span></li>',
   'Mettre le site en ligne sur slbm.fr et faire renvoyer slbc.fr et ses anciennes adresses vers les nouvelles pages.</span></li>\n    '
   + lire('note-slbm-etape-google.html'))
un('<p>Dans l’ordre, avec qui s’en charge.</p>\n  <ul class="taches">',
   '<p>Dans l’ordre, avec qui s’en charge. Les étapes liées au nouveau nom avancent en même temps que la préparation du site avec Kstudio : '
   'seule la mise en ligne sur slbm.fr attend le vote de l’assemblée.</p>\n  <ul class="taches">\n    ' + lire('note-slbm-etapes.html'))
un('  </ul>\n</section>\n</div>\n\n<footer', '    ' + lire('note-slbm-etapes-fin.html') + '\n  </ul>\n</section>\n</div>\n\n<footer')

# 2. Nouvelle partie 2 et renumérotation des suivantes (renvois « partie 9 » du modèle compris)
assert html.count('(partie 9)') == 2
html = html.replace('(partie 9)', '(partie 10)')
for n in range(11, 1, -1):
    un('{{P%d}}' % n, '{{P%d}}' % (n + 1))
somm = re.search(r'<ol class="sommaire">(.*?)</ol>', html, re.S).group(1)
items = re.findall(r'<li><span class="n">(\d+)</span>(.*?)</li>', somm)
assert len(items) == 11
neuf = [items[0][1], '<a href="#slbm">Mise en ligne sous le nom SLBM</a>'] + [x[1] for x in items[1:]]
html = html.replace(somm, '\n' + ''.join(f'    <li><span class="n">{i + 1}</span>{t}</li>\n' for i, t in enumerate(neuf)) + '  ')
un('<section class="partie" id="hebergement">', lire('note-slbm-partie.html') + '\n\n<section class="partie" id="hebergement">')
un('/* Pied */', '/* Partie 2 : intertitres et sources */\n.partie h3{font-size:19.5px;line-height:1.3;font-weight:800;letter-spacing:-.01em;margin-top:10px;color:var(--encre)}\n'
   '.sources{font-size:14px;line-height:1.55;color:var(--gris)}\n@media print{.partie h3{break-after:avoid}}\n\n/* Pied */')

# 3. Le nom, partout ailleurs ; ce qui est entre [[ ]] est gardé tel quel
gardes = []
def garder(m):
    gardes.append(m.group(1)); return '\u0000%d\u0000' % (len(gardes) - 1)
html = re.sub(r'\[\[(.*?)\]\]', garder, html)
html = re.sub(r'\bSLBC\b', 'SLBM', html)
html = html.replace('Biologie Clinique', 'Biologie Médicale').replace('@slbc.fr', '@slbm.fr')
html = re.sub('\u0000(\\d+)\u0000', lambda m: gardes[int(m.group(1))], html)

# 4. Pastilles, mascotte, schéma (comme gen_note.py, en Nunito)
def pastille(n):
    fs = 20 if n < 10 else 17
    return ('<svg class="pastille" viewBox="0 0 60 60" aria-hidden="true">'
            '<circle cx="35" cy="35" r="21" fill="#A3BE3C"/>'
            '<circle cx="27" cy="27" r="21" fill="#FFFFFF" stroke="#2E3236" stroke-width="3"/>'
            f'<text x="27" y="{27 + fs * 0.36:.1f}" text-anchor="middle" font-family="Nunito, sans-serif" font-weight="800" font-size="{fs}" fill="#2E3236">{n}</text></svg>')
for n in range(12, 0, -1):
    html = html.replace('{{P%d}}' % n, pastille(n))
masc = pathlib.Path(MASC).read_text(encoding='utf-8').strip()
masc = masc.replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg class="mascotte" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" ', 1)
html = html.replace('{{MASCOTTE}}', masc)
# Schéma du parcours d'un compte : repris de gen_note.py
src = pathlib.Path(__file__).with_name('gen_note.py').read_text(encoding='utf-8')
debut = src.index('# Parcours d'); fin = src.index("html = html.replace('{{SCHEMA}}'")
ns = {}
exec(src[debut:fin], ns)
html = html.replace('{{SCHEMA}}', ''.join(ns['svg']).replace('Figtree, sans-serif', 'Nunito, sans-serif'))
assert '{{' not in html and '[[' not in html

# 5. Typographie française, dans le texte seulement (pas dans les balises ni dans les styles)
MOIS = 'janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre'
tete, corps = html.split('</style>', 1)
morceaux = re.split(r'(<[^>]+>)', corps)
for i, m in enumerate(morceaux):
    if m.startswith('<'):
        continue
    m = m.replace('e-mail', 'e\u2011mail').replace('E-mail', 'E\u2011mail')
    m = re.sub('«[ \u00a0\u202f]?', '«' + FINE, m)
    m = re.sub('[ \u00a0\u202f]?»', FINE + '»', m)
    m = re.sub('[ \u00a0\u202f]:', NB + ':', m)
    m = re.sub('[ \u00a0\u202f]([;!?])', FINE + r'\1', m)
    m = re.sub(r'(\d) (%s)\b' % MOIS, r'\1' + NB + r'\2', m)
    m = re.sub(r'\b(articles?|n°) (?=[LRD]?\d)', r'\1' + NB, m)
    m = re.sub(r'(\d)-(?=\d)', '\\1\u2011', m)
    morceaux[i] = m
html = tete + '</style>' + ''.join(morceaux)
# « 1er » écrit en exposant, suivi d'une insécable : « 1<sup>er</sup> octobre »
html = re.sub(r'<sup>er</sup> ', '<sup>er</sup>' + NB, html)
pathlib.Path(OUT).write_text(html, encoding='utf-8')
print('ok', len(html), '; « SLBC » gardés :', len(re.findall(r'\bSLBC\b', html.split('</style>', 1)[1])))
