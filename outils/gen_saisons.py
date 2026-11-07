# Planches « Mascottes de saison » (7 novembre 2026, demandes d'Isabelle Eimer) : les mascottes validées du site
# - à Noël : bonnet de Père Noël rouge (descendu sur la tête, gros pompon), écharpe rouge et blanche, moufles rouges pour certaines ;
# - en été : lunettes de soleil, casquette ou chapeau de paille, et une bouée gonflable posée à côté
#   (en alternance, le canard jaune et la bouée ronde rayée bleu ciel et blanc, très gonflée).
# usage : python3 gen_saisons.py <index.html> <dossier> <joyeux-noel.txt> <bonnes-vacances.txt>
import math, sys, re, pathlib
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
HAIR = ['<path d="M63 60 C61 48 66 40 73 37"/>', '<path d="M67 70 C64 62 66 54 70 50"/>', '<path d="M89 37 C86 27 90 18 99 13"/>', '<path d="M97 37 C98 29 103 24 110 23"/>',
        '<path d="M88 37 C86 29 92 22 99 22 C95 26 95 31 99 33"/>',
        '<path d="M80 42 L75 31"/>', '<path d="M90 38 L89 26"/>', '<path d="M100 38 L104 27"/>', '<path d="M109 42 L116 33"/>']
ROUGE = '#C62F3B'

def sans_meches(s):
    for piece in HAIR:
        s = s.replace(piece, '')
    return s

def sans_sourcils_caches(s, bas=52):
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
    # bonnet basculé vers l'arrière : le bord blanc descend sur l'arrière du crâne, la pointe retombe derrière la tête,
    # très gros pompon au bout
    # bonnet à la taille de la tête : le bord blanc est un arc régulier, bombé vers le haut, qui suit le crâne d'une tempe
    # à l'autre ; tracé deux fois (contour encre, puis blanc) pour garder la même épaisseur partout ; la pointe retombe
    # vers l'arrière avec un gros pompon
    bord = 'M65 60 Q95 30 125 53'
    bonnet = (f'<path d="M124 50 C127 24 113 6 95 6 C77 6 63 18 53 34 C59 38 63 46 66 56 Z" fill="{ROUGE}"/>'
              f'<path d="{bord}" stroke="{INK}" stroke-width="18" stroke-linecap="round" fill="none"/>'
              f'<path d="{bord}" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round" fill="none"/>'
              '<circle cx="48" cy="34" r="13" fill="#FFFFFF" stroke-width="3"/>')
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
    s = clean(sans_sourcils_caches(sans_meches(svg), bas=52))
    s = s.replace(HEAD, tenue_noel())
    if key in MOUFLES:
        s = moufles(s)
    s = air_dessus(s, key)
    m, (x, y, w, hh) = viewbox(s)
    s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x - 20, y, w + 40, hh), 1)
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
CASQUETTES = [('#F6C945', '#E0A21B'), ('#9FD3EC', '#4F9CC4')]   # jaune, bleu ciel (calotte, visière)
def casquette(k=0):
    calotte, visiere = CASQUETTES[k % 2]
    # basculée vers l'arrière : le bas de la calotte descend sur l'arrière du crâne, la visière reste au-dessus des yeux
    return (f'<path d="M57 62 C52 32 72 9 98 9 C119 9 132 24 131 45 Q99 49 60 66 Z" fill="{calotte}"/>'
            f'<path d="M118 48 Q139 40 159 47 Q152 56 121 55 Z" fill="{visiere}"/>'
            f'<path d="M98 10 Q95 34 86 56" stroke="{visiere}" stroke-width="2" fill="none"/>'
            f'<circle cx="98" cy="9" r="3.5" fill="{visiere}"/>')
def chapeau():
    return (f'<path d="M48 44 Q95 30 142 44 Q146 50 138 52 Q95 62 52 52 Q44 50 48 44 Z" fill="{PAILLE}"/>'
            f'<path d="M70 45 C70 22 82 13 95 13 C108 13 120 22 120 45 Q95 52 70 45 Z" fill="{PAILLE}"/>'
            f'<path d="M71 36 Q95 42 119 36 L120 44 Q95 51 70 44 Z" fill="{VERT}" stroke="none"/>'
            f'<path d="M78 24 Q95 20 112 24" stroke="#C9A24A" stroke-width="1.6"/>')

BOUEE_TAILLE = {}   # bouée portée à la taille : essayée puis abandonnée (demande d'Isabelle Eimer : la bouée est posée à côté)
BOUEE_MODELE = {'defendons': 'canard', 'lecteurs': 'rayee', 'veille': 'canard', 'hanches': 'rayee', 'bureau': 'canard',
                'presse': 'rayee', 'documentation': 'canard', 'bienvenue': 'rayee', 'poignee': 'canard'}   # les deux bouées alternent (la baleine a été écartée)
BLEU_CIEL = '#9FD3EC'
def bouee_baleine(bx, sol):
    """Bouée en forme de baleine bleu ciel : la tête à l'avant avec son jet d'eau, la queue à l'arrière."""
    B = BLEU_CIEL; F = '#4F9CC4'; c = sol - 14
    p = lambda dx, dy: '%g %g' % (bx + dx, sol + dy)
    return ('<g class="bouee">'
            f'<ellipse cx="{bx:g}" cy="{sol + 1:g}" rx="36" ry="4" fill="#E6E9DF" stroke="none"/>'
            f'<path d="M{p(-24, -20)} Q{p(-34, -34)} {p(-47, -35)} Q{p(-41, -27)} {p(-31, -25)} Q{p(-40, -39)} {p(-35, -48)} Q{p(-25, -36)} {p(-20, -24)} Z" fill="{B}" stroke="{INK}" stroke-width="2.8"/>'
            f'<ellipse cx="{bx:g}" cy="{c:g}" rx="32" ry="14" fill="{B}" stroke="{INK}" stroke-width="3"/>'
            f'<ellipse cx="{bx:g}" cy="{c - 2:g}" rx="13" ry="5.5" fill="#FFFFFF" stroke="{INK}" stroke-width="2.6"/>'
            f'<path d="M{p(-26, -20)} Q{p(-31, -14)} {p(-26, -8)}" stroke="#FFFFFF" stroke-width="2.4" fill="none"/>'
            f'<path d="M{p(12, -24)} C{p(12, -40)} {p(24, -49)} {p(35, -47)} C{p(46, -45)} {p(50, -35)} {p(46, -26)} C{p(42, -19)} {p(31, -17)} {p(20, -19)} Z" fill="{B}" stroke="{INK}" stroke-width="3"/>'
            f'<path d="M{p(30, -26)} Q{p(39, -22)} {p(46, -29)}" stroke="{INK}" stroke-width="2.4" fill="none"/>'
            f'<circle cx="{bx + 34:g}" cy="{sol - 37:g}" r="2.4" fill="{INK}" stroke="none"/>'
            f'<path d="M{p(30, -50)} Q{p(26, -58)} {p(21, -59)} M{p(33, -50)} Q{p(34, -60)} {p(38, -63)} M{p(31, -51)} L{p(31, -61)}" stroke="{F}" stroke-width="2.6" fill="none"/>'
            '</g>')

def bouee_tore(bx, sol, R=23.0, r=10.0, elev=42, rayures=8, decal=math.pi / 8, trait=3.0, ombre=True):
    E = math.radians(elev)
    cotE = 1 / math.tan(E)

    def pos(a, t):
        ca, sa, ct, st = math.cos(a), math.sin(a), math.cos(t), math.sin(t)
        X, Y, Z = (R + r * ct) * ca, (R + r * ct) * sa, r * st
        return (X, -(Y * math.sin(E) + Z * math.cos(E)))

    t_ext = lambda a: math.atan(math.sin(a) * cotE)          # contour extérieur
    t_int = lambda a: math.atan(math.sin(a) * cotE) + math.pi  # contour intérieur (bord du trou)

    def zone(a1, a2):
        n = max(3, int(abs(a2 - a1) / math.radians(3)) + 1)
        pts = [pos(a1 + (a2 - a1) * i / n, t_ext(a1 + (a2 - a1) * i / n)) for i in range(n + 1)]
        pts += [pos(a2, t_ext(a2) + math.pi * j / 30) for j in range(1, 31)]
        pts += [pos(a2 + (a1 - a2) * i / n, t_int(a2 + (a1 - a2) * i / n)) for i in range(1, n + 1)]
        pts += [pos(a1, t_int(a1) - math.pi * j / 30) for j in range(1, 30)]
        return pts

    pas = 2 * math.pi / rayures
    bornes = sorted({(k * pas - decal) % (2 * math.pi) for k in range(rayures)} | {0.0, math.pi, 2 * math.pi})
    formes = []  # (moitié, points, couleur) : arrière (0 à pi) d'abord, avant ensuite
    for a1, a2 in zip(bornes, bornes[1:]):
        if a2 - a1 < 1e-6:
            continue
        am = (a1 + a2) / 2
        k = int(math.floor(((am + decal) % (2 * math.pi)) / pas))
        formes.append((0 if am < math.pi else 1, zone(a1, a2), '#FFFFFF' if k % 2 else BLEU_CIEL))
    formes.sort(key=lambda f: f[0])

    tous = [p for _, pts, _ in formes for p in pts]
    ox, oy = bx, sol - 2 - max(p[1] for p in tous)
    f = lambda p: '%.1f %.1f' % (p[0] + ox, p[1] + oy)
    chemin = lambda pts: 'M' + ' L'.join(f(p) for p in pts) + 'Z'

    sous = ''.join(chemin(pts) for _, pts, _ in formes)
    peint = lambda m: ''.join(f'<path d="{chemin(pts)}" fill="{c}" stroke="{c}" stroke-width=".8" stroke-linejoin="round"/>'
                              for h, pts, c in formes if h == m)
    # le bord du trou vient du contour noir tracé dessous : aucun trait ne déborde du trou
    # ombre douce sur le bas du boudin, à l'avant
    om = ''
    if ombre:
        pts = [pos(math.radians(a), t_ext(math.radians(a)) + math.radians(22)) for a in range(196, 345, 4)]
        om = f'<path d="M{" L".join(f(p) for p in pts)}" stroke="{INK}" stroke-opacity=".08" stroke-width="6" stroke-linecap="round" fill="none"/>'
    # reflet sur le dessus du boudin, à gauche
    ref = [pos(math.radians(a), math.radians(62)) for a in range(166, 200, 4)]
    reflet = f'<path d="M{" L".join(f(p) for p in ref)}" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" fill="none"/>'

    largeur = (R + r) * 1.1
    return ('<g class="bouee">'
            f'<ellipse cx="{bx:g}" cy="{sol + 1:g}" rx="{largeur:.1f}" ry="4.5" fill="#E6E9DF" stroke="none"/>'
            f'<path d="{sous}" fill="{INK}" stroke="{INK}" stroke-width="{trait * 2:g}" stroke-linejoin="round"/>'
            + peint(0) + peint(1) + om + reflet + '</g>')

def bouee_rayee(bx, sol):
    """Bouée ronde rayée bleu ciel et blanc, très gonflée : dessinée comme un vrai anneau (tore) vu de trois quarts,
    chaque rayure d'une seule couleur, aux bords courbes qui suivent la rondeur du boudin, sans trait entre les rayures."""
    return bouee_tore(bx, sol, R=23, r=9.5, elev=44)

def bouee_taille():
    return (f'<ellipse cx="96" cy="151" rx="37" ry="12.5" fill="{CANARD}" stroke="{INK}" stroke-width="3"/>'
            f'<ellipse cx="96" cy="148" rx="21" ry="5.5" fill="#FFFFFF" stroke="{INK}" stroke-width="2.6"/>'
            '<path d="M65 146 Q60 152 66 158" stroke="#FFFFFF" stroke-width="2.4" fill="none"/>'
            f'<path d="M126 147 C121 137 123 122 134 120 C145 118 151 127 146 135 C144 139 142 143 142 147 Z" fill="{CANARD}" stroke="{INK}" stroke-width="3"/>'
            f'<path d="M147 125 Q158 125 157 130 Q154 133 146 131 Z" fill="{BEC}" stroke="{INK}" stroke-width="2.4"/>'
            f'<circle cx="139" cy="126" r="2.4" fill="{INK}" stroke="none"/>')

def ete(key, svg):
    s = clean(sans_sourcils_caches(sans_meches(svg)))
    # chaque personnage : lunettes de soleil, et à tour de rôle une casquette ou un chapeau de paille
    n = [0]
    def tete(m):
        k = n[0]; n[0] += 1
        extra = bouee_taille() if BOUEE_TAILLE.get(key) == k else ''
        return HEAD + LUNETTES + (casquette(k // 2) if k % 2 == 0 else chapeau()) + extra
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
    if key in BOUEE_TAILLE:
        return s
    # la bouée canard, posée au sol à droite du dessin
    m, (x, y, w, hh) = viewbox(s)
    sol = y + hh - 6
    bx = x + w + 54
    if BOUEE_MODELE.get(key) == 'rayee':
        bouee = bouee_rayee(bx, sol).replace('<g class="bouee">', f'<g class="bouee" transform="translate({bx:g} {sol:g}) scale(1.3) translate({-bx:g} {-sol:g})">', 1)
        s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y - 4, w + 128, hh + 4), 1)
        return s[:s.rindex('</svg>')] + bouee + '</svg>'
    bouee = (f'<g class="bouee" transform="translate({bx:g} {sol:g}) scale(1.3) translate({-bx:g} {-sol:g})"><ellipse cx="{bx:g}" cy="{sol + 1:g}" rx="34" ry="4" fill="#E6E9DF" stroke="none"/>'
             f'<ellipse cx="{bx:g}" cy="{sol - 14:g}" rx="32" ry="14" fill="{CANARD}" stroke="{INK}" stroke-width="3"/>'
             f'<ellipse cx="{bx:g}" cy="{sol - 16:g}" rx="14" ry="5.5" fill="#FFFFFF" stroke="{INK}" stroke-width="2.6"/>'
             f'<path d="M{bx - 24:g} {sol - 22:g} Q{bx - 30:g} {sol - 14:g} {bx - 24:g} {sol - 6:g}" stroke="#FFFFFF" stroke-width="2.4" fill="none"/>'
             f'<path d="M{bx + 18:g} {sol - 24:g} C{bx + 16:g} {sol - 36:g} {bx + 20:g} {sol - 44:g} {bx + 26:g} {sol - 46:g}" stroke="{INK}" stroke-width="3" fill="none"/>'
             f'<path d="M{bx + 18:g} {sol - 24:g} C{bx + 14:g} {sol - 36:g} {bx + 16:g} {sol - 50:g} {bx + 26:g} {sol - 50:g} C{bx + 36:g} {sol - 50:g} {bx + 40:g} {sol - 40:g} {bx + 34:g} {sol - 32:g} C{bx + 32:g} {sol - 28:g} {bx + 30:g} {sol - 24:g} {bx + 30:g} {sol - 20:g} Z" fill="{CANARD}" stroke="{INK}" stroke-width="3"/>'
             f'<path d="M{bx + 36:g} {sol - 42:g} Q{bx + 48:g} {sol - 42:g} {bx + 47:g} {sol - 37:g} Q{bx + 44:g} {sol - 34:g} {bx + 36:g} {sol - 36:g} Z" fill="{BEC}" stroke="{INK}" stroke-width="2.4"/>'
             f'<circle cx="{bx + 29:g}" cy="{sol - 42:g}" r="2.4" fill="{INK}" stroke="none"/></g>')
    s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y - 4, w + 128, hh + 4), 1)
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
