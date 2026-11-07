# Planches « Mascottes de saison » (7 novembre 2026, demandes d'Isabelle Eimer) : les mascottes validées du site
# - à Noël : bonnet de Père Noël rouge (descendu sur la tête, gros pompon), écharpe rouge et blanche, moufles rouges pour certaines ;
# - en été : lunettes de soleil, casquette ou chapeau de paille, et une bouée gonflable en forme de canard à côté.
# usage : python3 gen_saisons.py <index.html> <dossier> <joyeux-noel.txt> <bonnes-vacances.txt>
import sys, re, pathlib
SRC = pathlib.Path(sys.argv[1]); OUT = pathlib.Path(sys.argv[2])
TXT_NOEL = pathlib.Path(sys.argv[3]).read_text(encoding='utf-8').strip()
TXT_ETE = pathlib.Path(sys.argv[4]).read_text(encoding='utf-8').strip()
h = SRC.read_text(encoding='utf-8')
INK = '#2E3236'

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
MOUFLES = {'defendons', 'hanches', 'bureau', 'bienvenue', 'poignee'}   # « pour certains » : les mains bien visibles

HEAD = '<circle cx="95" cy="72" r="35" fill="#FFFFFF"/>'
HAIR = ['<path d="M89 37 C86 27 90 18 99 13"/>', '<path d="M97 37 C98 29 103 24 110 23"/>',
        '<path d="M88 37 C86 29 92 22 99 22 C95 26 95 31 99 33"/>',
        '<path d="M80 42 L75 31"/>', '<path d="M90 38 L89 26"/>', '<path d="M100 38 L104 27"/>', '<path d="M109 42 L116 33"/>']
ROUGE = '#C62F3B'

def sans_meches(s):
    for piece in HAIR:
        s = s.replace(piece, '')
    return s

def sans_sourcils_caches(s, bas=49):
    """Retire les sourcils entièrement cachés sous le bord du bonnet ou du chapeau (y ≤ bas, au-dessus des yeux)."""
    def cache(m):
        nums = [float(x) for x in re.findall(r'-?\d+(?:\.\d+)?', m.group(1))]
        xs, ys = nums[0::2], nums[1::2]
        if ys and max(ys) <= bas and min(xs) >= 84 and max(xs) <= 136 and min(ys) >= 38:
            return ''
        return m.group(0)
    return re.sub(r'<path d="([^"]*)" stroke-width="3(?:\.2)?"/>', cache, s)

def clean(svg):
    s = re.sub(r'<svg class="[^"]*"', '<svg', svg, count=1)
    return re.sub(r' style="--vb-h:\d+"', '', s, count=1)

def viewbox(s):
    m = re.search(r'viewBox="([^"]+)"', s)
    return m, [float(v) for v in m.group(1).split()]

def air_dessus(s, key, dy=8):
    if key in ('documentation', 'bureau'):
        return s
    m, (x, y, w, hh) = viewbox(s)
    return s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y - dy, w, hh + dy), 1)

def nuage_plus_haut(s):
    i = s.index('<circle cx="120" cy="33"')
    s = s[:i] + '<g transform="translate(16 -16)">' + s[i:s.rindex('</svg>')] + '</g></svg>'
    return s.replace('viewBox="52 -60 112 272"', 'viewBox="52 -78 128 290"', 1)

# ---------------- Noël ----------------
def tenue_noel():
    echarpe = (f'<path d="M78 104 Q93 112 110 103 L111 111 Q94 121 78 112 Z" fill="{ROUGE}" stroke-width="3"/>'
               f'<path d="M96 113 L100 136 L91 137 L89 115 Z" fill="{ROUGE}" stroke-width="3"/>'
               '<path d="M86 108 L86 115 M94 110 L94 117 M102 107 L103 114 M90 124 L98 123 M91 130 L99 129" stroke="#FFFFFF" stroke-width="2.6"/>')
    # bonnet enfoncé sur la tête (le bord blanc descend jusqu'au front), la pointe retombe vers l'arrière, gros pompon
    bonnet = (f'<path d="M124 42 C126 24 116 8 99 6 C82 4 68 14 60 28 C68 29 72 35 69 42 Z" fill="{ROUGE}"/>'
              '<rect x="61" y="36" width="68" height="13" rx="6.5" fill="#FFFFFF" stroke-width="3"/>'
              '<circle cx="56" cy="29" r="9.5" fill="#FFFFFF" stroke-width="3"/>')
    return HEAD + echarpe + bonnet

def moufles(s):
    """Les mains deviennent des moufles rouges, un peu plus grandes, avec leur pouce."""
    def circ(m):
        cx, cy, r = float(m.group(1)), float(m.group(2)), float(m.group(3))
        if r < 4.5:
            return m.group(0)
        return (f'<ellipse cx="{cx:g}" cy="{cy:g}" rx="{r + 2.2:g}" ry="{r + 3:g}" fill="{ROUGE}" stroke="{INK}" stroke-width="2.4"/>'
                f'<ellipse cx="{cx - r - 1.2:g}" cy="{cy + 0.5:g}" rx="2.6" ry="3.4" fill="{ROUGE}" stroke="{INK}" stroke-width="2"/>')
    def ell(m):
        rx = float(m.group(3))
        if rx < 5:
            return m.group(0)
        tr = m.group(5) or ''
        return f'<ellipse cx="{m.group(1)}" cy="{m.group(2)}" rx="{rx + 2:g}" ry="{float(m.group(4)) + 2:g}" fill="{ROUGE}" stroke="{INK}" stroke-width="2.4"{tr}/>'
    s = re.sub(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)" fill="#2E3236" stroke="none"/>', circ, s)
    return re.sub(r'<ellipse cx="([\d.]+)" cy="([\d.]+)" rx="([\d.]+)" ry="([\d.]+)" fill="#2E3236" stroke="none"( transform="[^"]*")?/>', ell, s)

def noel(key, svg):
    s = clean(sans_sourcils_caches(sans_meches(svg)))
    s = s.replace(HEAD, tenue_noel())
    if key in MOUFLES:
        s = moufles(s)
    s = air_dessus(s, key)
    if key == 'bureau':
        s = s.replace('>MAKE BIOLOGY</text>', '>JOYEUX NOËL</text>').replace('>GREAT AGAIN</text>', '>À TOUS !</text>').replace('>YES WE CAN</text>', '>BONNES FÊTES</text>')
    if key == 'lecteurs':
        s = s.replace('<text x="384" y="40"', '<text x="400" y="34"', 1)
    if key == 'bienvenue':
        s = re.sub(r'<path class="mot-main" d="[^"]*"', '<path class="mot-main" d="' + TXT_NOEL + '"', s, count=1)
    if key == 'documentation':
        s = nuage_plus_haut(s)
    return s

# ---------------- Été ----------------
VERT_ANIS, VERT, PAILLE, CANARD, BEC = '#A3BE3C', '#5F7A2B', '#E9C46A', '#F6C945', '#F08A24'
LUNETTES = ('<path d="M60 64 L88 64" stroke-width="2.5"/>'
            f'<ellipse cx="100" cy="65" rx="10.5" ry="9" fill="{INK}" stroke-width="3"/>'
            f'<ellipse cx="123" cy="63" rx="10.5" ry="9" fill="{INK}" stroke-width="3"/>'
            '<path d="M110 64 Q112 61.5 114 63" stroke-width="2.5"/>')
REFLETS = ('<path d="M94 61 Q97 58 101 59" stroke="#FFFFFF" stroke-width="2" fill="none"/>'
           '<path d="M117 59 Q120 56 124 57" stroke="#FFFFFF" stroke-width="2" fill="none"/>')
def casquette():
    return (f'<path d="M64 46 C63 24 78 12 96 12 C114 12 128 24 128 44 Z" fill="{VERT_ANIS}"/>'
            f'<path d="M120 42 Q142 39 156 46 Q140 51 120 48 Z" fill="{VERT}"/>'
            f'<path d="M96 13 L96 44" stroke="{VERT}" stroke-width="2"/>'
            f'<circle cx="96" cy="12" r="3.5" fill="{VERT}"/>')
def chapeau():
    return (f'<ellipse cx="95" cy="42" rx="47" ry="9" fill="{PAILLE}"/>'
            f'<path d="M70 42 C70 22 82 13 95 13 C108 13 120 22 120 42 Z" fill="{PAILLE}"/>'
            f'<path d="M71 34 L119 34 L120 41 L70 41 Z" fill="{VERT}" stroke="none"/>'
            f'<path d="M78 24 Q95 20 112 24" stroke="#C9A24A" stroke-width="1.6"/>')

def ete(key, svg):
    s = clean(sans_sourcils_caches(sans_meches(svg)))
    # chaque personnage : lunettes de soleil, et à tour de rôle une casquette ou un chapeau de paille
    n = [0]
    def tete(m):
        k = n[0]; n[0] += 1
        return HEAD + LUNETTES + (casquette() if k % 2 == 0 else chapeau())
    s = s.replace(HEAD, '\0')
    s = re.sub('\0', tete, s)
    # les lunettes de vue deviennent des lunettes de soleil (verres foncés, reflet)
    s = s.replace('r="10.5" fill="#FFFFFF" stroke-width="3"/>', f'r="10.5" fill="{INK}" stroke-width="3"/>')
    s = air_dessus(s, key)
    if key == 'documentation':
        s = nuage_plus_haut(s)
    if key == 'bureau':
        s = s.replace('>MAKE BIOLOGY</text>', '>BONNES</text>').replace('>GREAT AGAIN</text>', '>VACANCES !</text>').replace('>YES WE CAN</text>', '>BEL ÉTÉ</text>')
    if key == 'lecteurs':
        s = s.replace('<text x="384" y="40"', '<text x="398" y="32"', 1)
    if key == 'bienvenue':
        s = re.sub(r'<path class="mot-main" d="[^"]*"', '<path class="mot-main" d="' + TXT_ETE + '"', s, count=1)
    # la bouée canard, posée au sol à droite du dessin
    m, (x, y, w, hh) = viewbox(s)
    sol = y + hh - 6
    bx = x + w + 54
    bouee = (f'<g class="bouee" transform="translate({bx:g} {sol:g}) scale(1.3) translate({-bx:g} {-sol:g})"><ellipse cx="{bx:g}" cy="{sol + 1:g}" rx="34" ry="4" fill="#E6E9DF" stroke="none"/>'
             f'<ellipse cx="{bx:g}" cy="{sol - 14:g}" rx="32" ry="14" fill="{CANARD}" stroke="{INK}" stroke-width="3"/>'
             f'<ellipse cx="{bx:g}" cy="{sol - 16:g}" rx="14" ry="5.5" fill="#FFFFFF" stroke="{INK}" stroke-width="2.6"/>'
             f'<path d="M{bx - 24:g} {sol - 22:g} Q{bx - 30:g} {sol - 14:g} {bx - 24:g} {sol - 6:g}" stroke="#FFFFFF" stroke-width="2.4" fill="none"/>'
             f'<path d="M{bx + 18:g} {sol - 24:g} C{bx + 16:g} {sol - 36:g} {bx + 20:g} {sol - 44:g} {bx + 26:g} {sol - 46:g}" stroke="{INK}" stroke-width="3" fill="none"/>'
             f'<path d="M{bx + 18:g} {sol - 24:g} C{bx + 14:g} {sol - 36:g} {bx + 16:g} {sol - 50:g} {bx + 26:g} {sol - 50:g} C{bx + 36:g} {sol - 50:g} {bx + 40:g} {sol - 40:g} {bx + 34:g} {sol - 32:g} C{bx + 32:g} {sol - 28:g} {bx + 30:g} {sol - 24:g} {bx + 30:g} {sol - 20:g} Z" fill="{CANARD}" stroke="{INK}" stroke-width="3"/>'
             f'<path d="M{bx + 36:g} {sol - 42:g} Q{bx + 48:g} {sol - 42:g} {bx + 47:g} {sol - 37:g} Q{bx + 44:g} {sol - 34:g} {bx + 36:g} {sol - 36:g} Z" fill="{BEC}" stroke="{INK}" stroke-width="2.4"/>'
             f'<circle cx="{bx + 29:g}" cy="{sol - 42:g}" r="2.4" fill="{INK}" stroke="none"/></g>')
    s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y - 4, w + 114, hh + 4), 1)
    return s[:s.rindex('</svg>')] + bouee + '</svg>'

# ---------------- Planches ----------------
def planche(saison, fn, modele, sortie, notes):
    parts = []
    for key, titre, svg in MASCOTTES:
        avant = clean(svg); apres = fn(key, svg)
        (OUT / f'{key}-{saison}.svg').write_text(apres, encoding='utf-8')
        cells = [('Aujourd’hui sur le site', avant, True), ('Noël' if saison == 'noel' else 'Été', apres, False)]
        _, (x, y, w, hh) = viewbox(apres)
        large = w / hh > 1.4
        note = notes.get(key)
        parts.append(f'<section class="mascotte-ligne{" large" if large else ""}" id="m-{key}"><h2>{titre}</h2>'
                     + (f'<p class="note">{note}</p>' if note else '') + '<div class="cases">'
                     + ''.join(f'<figure class="case{" actuelle" if cur else ""}"><div class="dessin">{sv.replace("<svg", "<svg aria-hidden=\"true\" focusable=\"false\"", 1)}</div><figcaption>{lab}</figcaption></figure>' for lab, sv, cur in cells)
                     + '</div></section>')
    html = (OUT / modele).read_text(encoding='utf-8').replace('{{LIGNES}}', '\n'.join(parts))
    (OUT / sortie).write_text(html, encoding='utf-8')
    return len(html)

print('noël', planche('noel', noel, 'planche-noel-modele.html', 'planche-noel.html', {
    'bureau': 'Pour les fêtes, les drapeaux disent « JOYEUX NOËL À TOUS ! » et « BONNES FÊTES ».',
    'bienvenue': 'Pour les fêtes, la banderole dit « Joyeux Noël », écrit à la main comme « Bienvenue ».',
    'documentation': 'Le nuage monte un peu pour laisser la place au bonnet.'}))
print('été', planche('ete', ete, 'planche-ete-modele.html', 'planche-ete.html', {
    'bureau': 'Pour l’été, les drapeaux disent « BONNES VACANCES ! » et « BEL ÉTÉ ».',
    'bienvenue': 'Pour l’été, la banderole dit « Bonnes vacances », écrit à la main comme « Bienvenue ».',
    'documentation': 'Le nuage monte un peu pour laisser la place à la casquette.'}))
