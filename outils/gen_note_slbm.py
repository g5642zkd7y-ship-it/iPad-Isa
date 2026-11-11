"""Note « Mise en service du site » au nom SLBM (11 novembre 2026, demande d'Isabelle Eimer : « Fais une autre note SLBM et rajoute les
éléments à prendre en compte pour la mise en ligne du site sous le nom SLBM »).
Part du modèle de la note SLBC (outils/note-modele.html, note du 7 novembre 2026 mise à jour le 8) et :
- change le nom (SLBC → SLBM, « de Biologie Clinique » → « de Biologie Médicale », adresses @slbc.fr → @slbm.fr, domaine du site et
  des e-mails slbc.fr → slbm.fr ; le site actuel reste « slbc.fr ») ;
- passe la note en Nunito, la police de la charte (la note SLBC, antérieure au 7 novembre, reste en Figtree) ;
- ajoute la partie 2 « Mettre le site en ligne sous le nom SLBM » (fragment outils/note-slbm-partie.html) et renumérote les suivantes ;
- ajoute les étapes du changement de nom aux prochaines étapes (fragment outils/note-slbm-etapes.html) ;
- met à jour deux points devenus inexacts depuis le 8 novembre (comptes publiés, polices).
usage : python3 gen_note_slbm.py <note-modele.html> <mascotte.svg> <dossier des fragments> <sortie.html>"""
import re, sys, pathlib
MODELE, MASC, FRAG, OUT = sys.argv[1:5]
html = pathlib.Path(MODELE).read_text(encoding='utf-8')
F = pathlib.Path(FRAG)
NB, FINE = ' ', ' '

def un(old, new):
    global html
    if html.count(old) == 0 and NB in old:      # le modèle n'a pas partout l'espace insécable avant « : » et « ; »
        old = old.replace(NB, ' ')
    assert html.count(old) == 1, (old[:80], html.count(old))
    html = html.replace(old, new)

# 1. Points propres à la variante, avant le changement de nom général
un('<title>Mise en service du site SLBC</title>', '<title>Mise en service du site SLBM</title>')
un('family=Figtree:wght@400;500;600;700;800&family=Nunito:wght@700;900', 'family=Nunito:wght@400;500;600;700;800;900')
un('--font:"Figtree",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;', '--font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;')
un('--font-marque:"Nunito","Figtree",system-ui,sans-serif;', '--font-marque:"Nunito",system-ui,sans-serif;')
un('<p class="date">Note de travail du 7 novembre 2026, mise à jour le 8 novembre 2026, à valider par le bureau.</p>',
   '<p class="date">Note de travail du 11 novembre 2026, à valider par le bureau. Elle reprend la note du 7 novembre 2026 (mise à jour le 8 novembre) '
   'sous le nom SLBM et ajoute la partie 2, «' + FINE + 'Mettre le site en ligne sous le nom SLBM' + FINE + '». Le nom du syndicat reste [[SLBC]] tant qu’il n’a pas été changé.</p>')
un('<span>Note de travail, 7 novembre 2026, mise à jour le 8 novembre 2026</span>', '<span>Note de travail au nom SLBM, 11 novembre 2026</span>')
# Domaine : le site actuel reste slbc.fr ; le nouveau site et ses e-mails passent sur slbm.fr
un('À la mise en ligne, les anciennes adresses doivent renvoyer vers les nouvelles pages.',
   'À la mise en ligne, les anciennes adresses de slbc.fr doivent renvoyer vers les nouvelles pages de slbm.fr (partie 2).')
un('les e-mails partent par la messagerie du domaine slbc.fr,', 'les e-mails partent par la messagerie du domaine slbm.fr,')
un('doivent être créées sur la messagerie du domaine slbc.fr avant la mise en ligne.',
   'doivent être créées sur la messagerie du domaine slbm.fr avant la mise en ligne, une fois ce domaine réservé (partie 2).')
un('<td>Une adresse du domaine slbc.fr, authentifiée', '<td>Une adresse du domaine slbm.fr, authentifiée')
un('Avec Kstudio ou l’hébergeur du domaine slbc.fr' + NB + ': créer les adresses contact@slbc.fr et bureau@slbc.fr, et décider qui lit chacune.',
   'Avec Kstudio ou l’hébergeur du domaine slbm.fr' + NB + ': créer les adresses contact@slbm.fr et bureau@slbm.fr, et décider qui lit chacune.')
un('Mettre le site en ligne sur slbc.fr et faire renvoyer les anciennes adresses vers les nouvelles pages.',
   'Mettre le site en ligne sur slbm.fr et faire renvoyer slbc.fr et ses anciennes adresses vers les nouvelles pages.')
# Points devenus inexacts depuis le 8 novembre 2026
un('<li><strong>Police des textes</strong>' + NB + ': Nunito, retenue le 7 novembre 2026' + NB + '; la charte graphique est à jour.</li>',
   '<li><strong>Polices</strong>' + NB + ': Nunito, retenue le 7 novembre 2026' + NB + '; les textes d’introduction des pages sont écrits à la main (Kalam), depuis le 10 novembre 2026. '
   'La charte graphique existe au nom SLBM (variante du 10 novembre 2026)' + NB + '; les proportions du logo SLBM sont à revérifier, le M étant plus large que le C.</li>')
un('<li><strong>Comptes publiés</strong>' + NB + ': exercices 2021 à 2023' + NB + '; ajouter les suivants si le SLBC publie ses comptes sur son site.</li>',
   '<li><strong>Comptes publiés</strong>' + NB + ': exercices 2022 à 2025, établis au nom du [[SLBC]] (partie 2).</li>')
un('<td>Police Nunito hébergée sur le serveur du site' + NB + ';', '<td>Polices Nunito et Kalam hébergées sur le serveur du site' + NB + ';')
un('<td>Cession écrite des droits sur le logo au SLBC' + NB + '; dépôt de marque à envisager</td>',
   '<td>Cession écrite des droits sur le logo au syndicat' + NB + '; dépôt de la marque SLBM à envisager, après la recherche d’antériorité (partie 2)</td>')

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
partie = (F / 'note-slbm-partie.html').read_text(encoding='utf-8').strip()
un('<section class="partie" id="hebergement">', partie + '\n\n<section class="partie" id="hebergement">')
etapes = (F / 'note-slbm-etapes.html').read_text(encoding='utf-8').strip()
un('<p>Dans l’ordre, avec qui s’en charge.</p>\n  <ul class="taches">', '<p>Dans l’ordre, avec qui s’en charge.</p>\n  <ul class="taches">\n    ' + etapes)
fin = (F / 'note-slbm-etapes-fin.html').read_text(encoding='utf-8').strip()
un('  </ul>\n</section>\n</div>\n\n<footer', '    ' + fin + '\n  </ul>\n</section>\n</div>\n\n<footer')
# Intertitres et sources de la partie 2
un('/* Pied */', '/* Partie 2 : intertitres et sources */\n.partie h3{font-size:19.5px;line-height:1.3;font-weight:800;letter-spacing:-.01em;margin-top:10px;color:var(--encre)}\n'
   '.sources{font-size:14px;line-height:1.55;color:var(--gris)}\n@media print{.partie h3{break-after:avoid}}\n\n/* Pied */')

# 3. Le nom, partout ailleurs
garde = '\u0000GARDE\u0000'
# Les mentions « SLBC » voulues dans la partie 2 sont écrites [[SLBC]] dans le fragment : elles restent telles quelles.
html = html.replace('[[SLBC]]', garde)
html = re.sub(r'\bSLBC\b', 'SLBM', html)
html = html.replace(garde, 'SLBC')
html = html.replace('Biologie Clinique', 'Biologie Médicale').replace('@slbc.fr', '@slbm.fr')

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
# « e-mail » ne se coupe pas ; guillemets collés à leur mot, dans le texte seulement
html = html.replace('e-mail', 'e‑mail').replace('E-mail', 'E‑mail')
tete, corps = html.split('</style>', 1)
corps = corps.replace('« ', '« ').replace(' »', ' »')
# Typographie française dans le texte seulement (pas dans les balises) : espace insécable avant « : », fine avant « ; ! ? »
morceaux = re.split(r'(<[^>]+>)', corps)
for i, m in enumerate(morceaux):
    if not m.startswith('<'):
        m = re.sub(r' :', NB + ':', m)
        m = re.sub(r' ([;!?])', FINE + r'\1', m)
        morceaux[i] = m
html = tete + '</style>' + ''.join(morceaux)
pathlib.Path(OUT).write_text(html, encoding='utf-8')
print('ok', len(html), 'SLBC gardés :', html.count('SLBC'))
