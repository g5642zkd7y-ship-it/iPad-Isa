# Planche « Mascottes de Noël » (7 novembre 2026, demande d'Isabelle Eimer) : les mascottes validées du site, en tenue de Noël.
# Bonnet et écharpe posés sur chaque tête (cercle r=35 du dessin de base), en deux variantes : classique (rouge et blanc)
# et aux couleurs du SLBC (vert anis, vert foncé). usage : python3 gen_noel.py <index.html> <dossier> <joyeux-noel.txt>
import sys, re, pathlib
SRC = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(sys.argv[2]); JN = pathlib.Path(sys.argv[3]).read_text(encoding='utf-8').strip()
h = SRC.read_text(encoding='utf-8')

def after(marker):
    """Le premier dessin <svg> qui suit ce repère dans la page."""
    i = h.index(marker); st = h.index('<svg', i); e = h.index('</svg>', st) + len('</svg>')
    return h[st:e]

MASCOTTES = [
    ('defendons', 'Accueil, « Ce que nous défendons »', after('<div class="piliers-head">')),
    ('lecteurs', 'Accueil, à côté du communiqué', after('<svg class="hcp-ill"')),
    ('veille', 'Veille réglementaire', after('<h1 class="display">Veille réglementaire</h1>')),
    ('hanches', 'Actualités', after('<div class="tete-mascotte">')),
    ('bureau', 'Le syndicat', after('<svg class="bureau-ill"')),
    ('presse', 'Salle de presse', after('<h1 class="display">Salle de presse</h1>')),
    ('documentation', 'Documentation', after('<h1 class="display">Documentation</h1>')),
    ('bienvenue', 'Adhérer au SLBC', after('<svg class="mascotte mascotte-bienvenue"')),
    ('poignee', 'Espace adhérent', after('<svg class="mascotte mascotte-accueil"')),
]

HAIR = ['<path d="M89 37 C86 27 90 18 99 13"/><path d="M97 37 C98 29 103 24 110 23"/>',
        '<path d="M88 37 C86 29 92 22 99 22 C95 26 95 31 99 33"/>',
        '<path d="M80 42 L75 31"/><path d="M90 38 L89 26"/><path d="M100 38 L104 27"/><path d="M109 42 L116 33"/>']
HEAD = '<circle cx="95" cy="72" r="35" fill="#FFFFFF"/>'
VARIANTES = {
    'classique': dict(bonnet='#C62F3B', echarpe='#C62F3B', rayure='#FFFFFF'),
    'slbc': dict(bonnet='#A3BE3C', echarpe='#5F7A2B', rayure='#D6E4A6'),
}
def tenue(v):
    c = VARIANTES[v]
    # bonnet de Père Noël : la pointe monte puis retombe vers l'arrière de la tête, le pompon au bout
    bonnet = (f'<path d="M122 34 C123 18 114 4 99 2 C84 0 70 8 61 19 C68 20 72 27 70 34 Z" fill="{c["bonnet"]}"/>'
              '<rect x="64" y="29" width="62" height="12" rx="6" fill="#FFFFFF" stroke-width="3"/>'
              '<circle cx="59" cy="21" r="6.5" fill="#FFFFFF" stroke-width="3"/>')
    echarpe = (f'<path d="M78 104 Q93 112 110 103 L111 111 Q94 121 78 112 Z" fill="{c["echarpe"]}" stroke-width="3"/>'
               f'<path d="M96 113 L100 136 L91 137 L89 115 Z" fill="{c["echarpe"]}" stroke-width="3"/>'
               f'<path d="M86 108 L86 115 M94 110 L94 117 M102 107 L103 114 M90 124 L98 123 M91 130 L99 129" stroke="{c["rayure"]}" stroke-width="2.6"/>')
    return HEAD + echarpe + bonnet

def noel(key, svg, v):
    s = svg
    for hair in HAIR:
        for piece in re.findall(r'<path[^>]*/>', hair):   # chaque mèche, où qu'elle soit dans le dessin
            s = s.replace(piece, '')
    s = s.replace(HEAD, tenue(v))
    s = re.sub(r'<svg class="[^"]*"', '<svg', s, count=1)
    s = re.sub(r' style="--vb-h:\d+"', '', s, count=1)
    # un peu d'air au-dessus des têtes pour la pointe du bonnet
    m = re.search(r'viewBox="([^"]+)"', s); x, y, w, hh = [float(v) for v in m.group(1).split()]
    if key not in ('documentation', 'bureau'):
        s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y - 8, w, hh + 8), 1)
    if key == 'bureau':
        s = s.replace('>MAKE BIOLOGY</text>', '>JOYEUX NOËL</text>').replace('>GREAT AGAIN</text>', '>À TOUS !</text>').replace('>YES WE CAN</text>', '>BONNES FÊTES</text>')
    if key == 'lecteurs':
        s = s.replace('<text x="384" y="40"', '<text x="398" y="36"', 1)
    if key == 'bienvenue':
        s = re.sub(r'<path class="mot-main" d="[^"]*"', '<path class="mot-main" d="' + JN + '"', s, count=1)
    if key == 'documentation':
        # le nuage et les bulles montent un peu pour laisser la place au bonnet
        i = s.index('<circle cx="120" cy="33"')
        s = s[:i] + '<g transform="translate(16 -16)">' + s[i:s.rindex('</svg>')] + '</g></svg>'
        s = s.replace('viewBox="52 -60 112 272"', 'viewBox="52 -78 128 290"', 1)
    return s

def clean(svg):
    s = re.sub(r'<svg class="[^"]*"', '<svg', svg, count=1)
    return re.sub(r' style="--vb-h:\d+"', '', s, count=1)

rows = []
for key, titre, svg in MASCOTTES:
    vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', svg).group(1).split()]
    large = vb[2] / vb[3] > 1.4
    cells = [('Aujourd’hui sur le site', clean(svg)), ('Noël classique', noel(key, svg, 'classique')), ('Noël aux couleurs du SLBC', noel(key, svg, 'slbc'))]
    rows.append((key, titre, large, cells, vb[2] / vb[3]))
    for v in ('classique', 'slbc'):
        (OUT / f'{key}-{v}.svg').write_text(noel(key, svg, v), encoding='utf-8')

NOTES = {
    'bureau': 'Pour les fêtes, les drapeaux disent « JOYEUX NOËL À TOUS ! » et « BONNES FÊTES ».',
    'bienvenue': 'Pour les fêtes, la banderole dit « Joyeux Noël », écrit à la main comme « Bienvenue ».',
    'documentation': 'Le nuage monte un peu pour laisser la place au bonnet.',
}
parts = []
for key, titre, large, cells, ar in rows:
    note = NOTES.get(key)
    parts.append(f'<section class="mascotte-ligne{" large" if large else ""}" id="m-{key}"><h2>{titre}</h2>'
                 + (f'<p class="note">{note}</p>' if note else '') + '<div class="cases">'
                 + ''.join(f'<figure class="case{" actuelle" if i == 0 else ""}"><div class="dessin"{f' style="--ar:{ar:.2f}"' if large else ''}>{svg.replace("<svg", "<svg aria-hidden=\"true\" focusable=\"false\"", 1)}</div><figcaption>{lab}</figcaption></figure>' for i, (lab, svg) in enumerate(cells))
                 + '</div></section>')
tpl = (OUT / 'planche-noel-modele.html').read_text(encoding='utf-8')
html = tpl.replace('{{LIGNES}}', '\n'.join(parts))
(OUT / 'planche-noel.html').write_text(html, encoding='utf-8')
print('ok', len(html), [r[0] for r in rows])
