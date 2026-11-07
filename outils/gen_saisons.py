# Planches « Mascottes de saison » (7 novembre 2026, demandes d'Isabelle Eimer) : les mascottes validées du site
# - à Noël : bonnet de Père Noël rouge (modèle B : bandeau et gros pompon en fourrure), écharpe rouge et blanche, moufles rouges pour certaines ;
# - en été : lunettes de soleil, casquette ou chapeau de paille, et une bouée gonflable posée à côté
#   (en alternance, le canard jaune et la bouée ronde rayée bleu ciel et blanc).
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

def sans_sourcils_sous_bonnet(s):
    """Noël : retire les sourcils qui passeraient sous le bord blanc du bonnet (ou le toucheraient)."""
    def bas(x):
        pts = BORD_BAS
        if x <= pts[0][0]: return pts[0][1]
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            if x0 <= x <= x1:
                return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
        return pts[-1][1]
    def cache(m):
        nums = [float(x) for x in re.findall(r'-?\d+(?:\.\d+)?', m.group(1))]
        xs, ys = nums[0::2], nums[1::2]
        if not ys or min(xs) < 84 or max(xs) > 136 or min(ys) < 38:
            return m.group(0)
        return '' if any(y <= bas(x) + 3 for x, y in zip(xs, ys)) else m.group(0)
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
def tenue_noel(**reglages):
    echarpe = (f'<path d="M78 104 Q93 112 110 103 L111 111 Q94 121 78 112 Z" fill="{ROUGE}" stroke-width="3"/>'
               f'<path d="M96 113 L100 136 L91 137 L89 115 Z" fill="{ROUGE}" stroke-width="3"/>'
               '<path d="M86 108 L86 115 M94 110 L94 117 M102 107 L103 114 M90 124 L98 123 M91 130 L99 129" stroke="#FFFFFF" stroke-width="2.6"/>')
    return HEAD + echarpe + bonnet_noel(**reglages)

BORD_BAS = []   # bas du bandeau du bonnet (coordonnées de la tête), rempli par bonnet_noel()

def bandeau_bonnet(L=57, Rr=133, T=37, th=17, s=2):
    """Bandeau du bonnet, d'après les exemples envoyés par Isabelle Eimer : épais, un peu plus large que la tête, aux
    bouts bien arrondis, presque droit (le milieu à peine plus bas), posé juste au-dessus des yeux."""
    w = th / 2
    Lc, Rc, C = (L + w, T + w), (Rr - w, T + w), (95, T + w + 2 * s)
    q = lambda t: tuple((1 - t) ** 2 * Lc[k] + 2 * t * (1 - t) * C[k] + t * t * Rc[k] for k in (0, 1))
    dq = lambda t: tuple(2 * (1 - t) * (C[k] - Lc[k]) + 2 * t * (Rc[k] - C[k]) for k in (0, 1))
    haut, bas = [], []
    for i in range(41):
        p, d = q(i / 40), dq(i / 40)
        l = math.hypot(*d); n = (d[1] / l, -d[0] / l)
        haut.append((p[0] + w * n[0], p[1] + w * n[1])); bas.append((p[0] - w * n[0], p[1] - w * n[1]))
    def bout(c, depart):
        a = math.atan2(depart[1] - c[1], depart[0] - c[0])
        return [(c[0] + w * math.cos(a + math.pi * k / 16), c[1] + w * math.sin(a + math.pi * k / 16)) for k in range(1, 16)]
    return haut + bout(Rc, haut[-1]) + bas[::-1] + bout(Lc, bas[0]), haut, bas

def fourrure(pts, pas=5.2, bosse=1.9):
    """Contour à petites bosses régulières (fourrure), comme sur la planche d'exemples."""
    f = lambda p: '%.2f %.2f' % p
    aire = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    sens = 1 if aire > 0 else -1
    seg = [math.dist(pts[i], pts[(i + 1) % len(pts)]) for i in range(len(pts))]
    total = sum(seg); n = max(8, int(total / pas)); pas = total / n
    res, acc, i = [], 0.0, 0
    for k in range(n):
        cible = k * pas
        while acc + seg[i] < cible:
            acc += seg[i]; i += 1
        t = (cible - acc) / seg[i]
        a, b = pts[i], pts[(i + 1) % len(pts)]
        res.append((a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t))
    d = 'M' + f(res[0])
    for k in range(n):
        a, b = res[k], res[(k + 1) % n]
        m = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        tx, ty = b[0] - a[0], b[1] - a[1]; l = math.hypot(tx, ty) or 1
        nx, ny = ty / l * sens, -tx / l * sens
        d += ' Q' + f((m[0] + nx * bosse * 2, m[1] + ny * bosse * 2)) + ' ' + f(b)
    return d + 'Z'

def bonnet_noel(pointe=(46, 22), retour=(55, 26), pompon=(42, 23, 14.5)):
    """Bonnet de Père Noël, modèle B choisi par Isabelle Eimer le 7 novembre 2026 : bandeau blanc en fourrure (voir
    bandeau_bonnet), partie rouge posée dessus à partir du début des bouts arrondis, un pli, la pointe qui retombe en
    arrière, gros pompon en fourrure. `pointe`, `retour`, `pompon` : bout de la pointe et pompon (cx, cy, r), plus bas
    pour deux voisins dos à dos."""
    f = lambda p: '%.2f %.2f' % p
    contour, haut, bas = bandeau_bonnet()
    BORD_BAS[:] = bas
    G, D = haut[0], haut[-1]
    rouge = (f'M{f(D)} C{f((D[0] + 4, D[1] - 24))} {f((114, -5))} {f((90, -5))} '
             f'C{f((70, -5))} {f((56, 6))} {f(pointe)} '
             f'C{f(retour)} {f((G[0] - 2, G[1] - 12))} {f(G)} ' + ' '.join('L' + f(p) for p in haut[1:]) + ' Z')
    cx, cy, r = pompon
    rond = [(cx + r * .86 * math.cos(2 * math.pi * k / 48), cy + r * .86 * math.sin(2 * math.pi * k / 48)) for k in range(48)]
    return (f'<path d="{rouge}" fill="{ROUGE}"/>'
            f'<path d="M102 4 Q84 8 68 24" stroke="{INK}" stroke-width="2.2" fill="none"/>'
            f'<path d="{fourrure(contour)}" fill="#FFFFFF"/>'
            f'<path d="{fourrure(rond, pas=4.6, bosse=1.6)}" fill="#FFFFFF"/>')

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

def descendre_bureau(s, d=22):
    """Le syndicat à Noël : les cinq personnages descendent de `d` (leur bonnet, plus haut, ne touche plus les
    drapeaux ni la bulle) ; les hampes s'allongent d'autant et le dessin aussi."""
    s, n = re.subn(r'<g transform="translate\((\d+) 70\)', lambda m: f'<g transform="translate({m.group(1)} {70 + d})', s)
    assert n == 5, n
    s = s.replace('<path d="M50 8 L50 246"', f'<path d="M50 8 L50 {246 + d}"', 1).replace('<path d="M612 12 L612 246"', f'<path d="M612 12 L612 {246 + d}"', 1)
    m, (x, y, w, hh) = viewbox(s)
    return s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x, y, w, hh + d), 1)

def noel(key, svg):
    tenue = tenue_noel()
    s = clean(sans_sourcils_sous_bonnet(sans_meches(svg)))
    if key == 'bureau':
        # les 3e et 4e personnages sont dos à dos : la pointe du 4e retombe plus bas, près de son oreille, pour que les
        # deux pompons ne se touchent pas
        tombe = tenue_noel(pointe=(58, 36), retour=(63, 38), pompon=(58, 46, 11.5))
        parts = s.split(HEAD)
        s = parts[0] + ''.join((tombe if k == 3 else tenue) + p for k, p in enumerate(parts[1:]))
    else:
        s = s.replace(HEAD, tenue)
    if key in MOUFLES:
        s = moufles(s)
    s = air_dessus(s, key, dy=20)
    m, (x, y, w, hh) = viewbox(s)
    s = s.replace(m.group(0), 'viewBox="%g %g %g %g"' % (x - 26, y, w + 52, hh), 1)
    if key == 'bureau':
        s = descendre_bureau(s)
        s = s.replace('>MAKE BIOLOGY</text>', '>JOYEUX NOËL</text>').replace('>GREAT AGAIN</text>', '>À TOUS !</text>').replace('>YES WE CAN</text>', '>BONNES FÊTES</text>')
    if key == 'lecteurs':
        s = s.replace('<text x="384" y="40"', '<text x="418" y="20"', 1)
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

TEINTES_BOUEE = {'bleu': ('#9FD3EC', '#7DB5D2'), 'blanc': ('#FFFFFF', '#D5E1E8')}   # couleur, et un ton plus foncé dessous

def bouee_tore(bx, sol, R=24.0, r=9.0, k=0.6, elev=38, rayures=8, decal=math.pi / 8, trait=3.0, ombre_deg=8,
               teintes=None, decor=None, reflet_a=(168, 200)):
    """Anneau gonflable vu de trois quarts. `teintes` : couleurs des rayures en alternance (couleur, ton foncé) ;
    `decor(P)` rend (svg derrière, svg posé sur le dessus du boudin arrière), P(a, t) en degrés donnant un point de
    l'anneau à l'écran (a : tour de l'anneau, 90 = au fond ; t : tour du boudin, 90 = sur le dessus)."""
    teintes = teintes or [TEINTES_BOUEE['bleu'], TEINTES_BOUEE['blanc']]
    E = math.radians(elev); rz = r * k
    def pos(a, t):
        ca, sa, ct, st = math.cos(a), math.sin(a), math.cos(t), math.sin(t)
        X, Y, Z = (R + r * ct) * ca, (R + r * ct) * sa, rz * st
        return (X, -(Y * math.sin(E) + Z * math.cos(E)))
    t0 = lambda a: math.atan(k * math.sin(a) / math.tan(E))     # bord visible extérieur ; + pi : bord du trou
    th = math.radians(ombre_deg)
    bandes = [  # (bas, haut, foncé ?) en fonction de a
        (lambda a: t0(a), lambda a: max(t0(a), -th), True),
        (lambda a: max(t0(a), -th), lambda a: min(t0(a) + math.pi, math.pi + th), False),
        (lambda a: min(t0(a) + math.pi, math.pi + th), lambda a: t0(a) + math.pi, True),
    ]
    def zone(a1, a2, lo, hi):
        n = max(3, int(abs(a2 - a1) / math.radians(3)) + 1)
        As = [a1 + (a2 - a1) * i / n for i in range(n + 1)]
        if max(hi(a) - lo(a) for a in As) < 1e-3:
            return None
        pts = [pos(a, lo(a)) for a in As]
        pts += [pos(a2, lo(a2) + (hi(a2) - lo(a2)) * j / 16) for j in range(1, 17)]
        pts += [pos(a, hi(a)) for a in As[::-1][1:]]
        pts += [pos(a1, hi(a1) - (hi(a1) - lo(a1)) * j / 16) for j in range(1, 16)]
        return pts
    pas = 2 * math.pi / rayures
    bornes = sorted({(i * pas - decal) % (2 * math.pi) for i in range(rayures)} | {0.0, math.pi, 2 * math.pi})
    formes = []
    for a1, a2 in zip(bornes, bornes[1:]):
        if a2 - a1 < 1e-6:
            continue
        am = (a1 + a2) / 2
        teinte = teintes[int(math.floor(((am + decal) % (2 * math.pi)) / pas)) % len(teintes)]
        arriere = am < math.pi
        for lo, hi, fonce in bandes:
            # à l'arrière, le boudin est coupé sur son dessus : ce qui est posé dessus (cou, queue) passe entre les deux
            morceaux = ([(lo, lambda a, hi=hi: min(hi(a), math.pi / 2), 0), (lambda a, lo=lo: max(lo(a), math.pi / 2), hi, 1)]
                        if arriere else [(lo, hi, 2)])
            for l2, h2, ordre in morceaux:
                pts = zone(a1, a2, l2, h2)
                if pts:
                    formes.append((ordre, pts, teinte[1] if fonce else teinte[0]))
    formes.sort(key=lambda f: f[0])
    tous = [p for _, pts, _ in formes for p in pts]
    ox, oy = bx, sol - 2 - max(p[1] for p in tous)
    f = lambda p: '%.1f %.1f' % (p[0] + ox, p[1] + oy)
    chemin = lambda pts: 'M' + ' L'.join(f(p) for p in pts) + 'Z'
    sous = ''.join(chemin(pts) for _, pts, _ in formes)
    peint = lambda o: ''.join(f'<path d="{chemin(pts)}" fill="{c}" stroke="{c}" stroke-width=".8" stroke-linejoin="round"/>'
                              for ordre, pts, c in formes if ordre == o)
    derriere, dessus = decor(lambda a, t: (pos(math.radians(a), math.radians(t))[0] + ox, pos(math.radians(a), math.radians(t))[1] + oy)) if decor else ('', '')
    ref = [pos(math.radians(a), math.radians(65)) for a in range(reflet_a[0], reflet_a[1] + 1, 4)]   # reflet clair
    reflet = f'<path d="M{" L".join(f(p) for p in ref)}" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="4" stroke-linecap="round" fill="none"/>'
    return ('<g class="bouee">'
            f'<ellipse cx="{bx:g}" cy="{sol + 1:g}" rx="{(R + r) * 1.08:.1f}" ry="4.5" fill="#E6E9DF" stroke="none"/>'
            + derriere +
            f'<path d="{sous}" fill="{INK}" stroke="{INK}" stroke-width="{trait * 2:g}" stroke-linejoin="round"/>'
            + peint(0) + dessus + peint(1) + peint(2) + reflet + '</g>')

BOUEE_GEO = dict(R=24, r=10, k=.8, elev=44)   # forme de la bouée rayée : anneau bien gonflé vu de trois quarts,
                                              # d'après les exemples de bouée canard envoyés par Isabelle Eimer

def bouee_rayee(bx, sol):
    """Bouée ronde rayée bleu ciel et blanc, d'après les exemples envoyés par Isabelle Eimer : anneau bien gonflé vu
    de trois quarts, rayures sans trait entre elles ; dessous du boudin et intérieur du trou un ton plus foncés,
    reflet clair sur la gauche."""
    return bouee_tore(bx, sol, ombre_deg=0, **BOUEE_GEO)

CANARD_OMBRE = '#E0A92B'

def bouee_canard(bx, sol):
    """Bouée canard jaune, version choisie par Isabelle Eimer le 7 novembre 2026 sur capture (anneau plus fin et cou
    étroit que la version gonflée), d'après les deux exemples qu'elle avait envoyés : le même anneau que la bouée rayée ;
    le cou et la tête sortent du boudin à l'arrière droite (bec orange vers la droite, œil, reflets), une petite queue
    pointe à l'arrière gauche ; le cou et la queue font corps avec l'anneau (pas de trait à la jonction)."""
    def decor(P):
        f = lambda p: '%.1f %.1f' % p
        # queue : posée sur le dessus du boudin, à l'arrière gauche ; l'anneau en cache le pied
        q1, q2 = P(160, 90), P(136, 90)
        pointe = (q1[0] - 9, q1[1] - 13)
        queue = (f'<path d="M{f(q2)} Q{f((q2[0] - 3, q2[1] - 10))} {f(pointe)} Q{f((q1[0] - 2, q1[1] - 4))} {f(q1)} '
                 f'L{f(P(160, 120))} L{f(P(136, 120))} Z" fill="{CANARD}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>')
        # cou et tête : sortent du dessus du boudin, à l'arrière droite ; le devant du boudin en cache le pied
        b1, b2 = P(66, 90), P(28, 90)
        m = ((b1[0] + b2[0]) / 2, (b1[1] + b2[1]) / 2)
        H = (m[0] + 4, m[1] - 25)                                   # centre de la tête
        h = lambda dx, dy: (H[0] + dx, H[1] + dy)
        cou = (f'M{f(b1)} C{f((b1[0] - 2, b1[1] - 9))} {f(h(-12, 7))} {f(h(-10, 0))} '
               f'C{f(h(-10, -8))} {f(h(-4, -11))} {f(h(1, -11))} '
               f'C{f(h(8, -11))} {f(h(11, -5))} {f(h(10, 1))} '
               f'C{f(h(7, 8))} {f((b2[0] + 1, b2[1] - 12))} {f(b2)} '
               f'L{f(P(28, 120))} L{f(P(66, 120))} Z')
        tete = (f'<path d="{cou}" fill="{CANARD}" stroke="{INK}" stroke-width="3" stroke-linejoin="round"/>'
                f'<path d="M{f(h(8, -3))} Q{f(h(20, -4))} {f(h(20, 1))} Q{f(h(18, 5))} {f(h(8, 4))} Z" fill="{BEC}" stroke="{INK}" stroke-width="2.6" stroke-linejoin="round"/>'
                f'<path d="M{f(h(12, -1.5))} Q{f(h(16, -2.5))} {f(h(18, -1))}" stroke="#FFFFFF" stroke-opacity=".7" stroke-width="1.6" stroke-linecap="round" fill="none"/>'
                f'<circle cx="{H[0] + 3:.1f}" cy="{H[1] - 3:.1f}" r="2.4" fill="{INK}" stroke="none"/>'
                f'<circle cx="{H[0] + 3.7:.1f}" cy="{H[1] - 3.8:.1f}" r=".8" fill="#FFFFFF" stroke="none"/>'
                f'<path d="M{f(h(-6.5, -5))} Q{f(h(-5.5, -8.5))} {f(h(-2, -9.5))}" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="1.8" stroke-linecap="round" fill="none"/>')
        return queue, tete
    return bouee_tore(bx, sol, R=24, r=9, k=.6, elev=34, ombre_deg=0, teintes=[(CANARD, CANARD_OMBRE)], decor=decor,
                      reflet_a=(200, 236))

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
    # bouée canard d'après les exemples, anneau gonflé (choix d'Isabelle Eimer du 7 novembre 2026, capture à l'appui)
    bouee = bouee_canard(bx, sol).replace('<g class="bouee">', f'<g class="bouee" transform="translate({bx:g} {sol:g}) scale(1.3) translate({-bx:g} {-sol:g})">', 1)
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
