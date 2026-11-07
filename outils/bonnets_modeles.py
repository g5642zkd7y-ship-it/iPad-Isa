"""Bonnets de Noël d'après les exemples envoyés par Isabelle Eimer (planche Freepik, illustrations Getty) :
un bandeau blanc épais, un peu plus large que la tête, aux bouts bien arrondis, presque droit ; la partie rouge posée
dessus, qui part du début des bouts arrondis ; une pointe et un pompon.
Coordonnées de la tête des mascottes : centre (95, 72), rayon 35, visage tourné vers la droite."""
import math

INK = '#2E3236'; ROUGE = '#C62F3B'


def f(p):
    return '%.2f %.2f' % p


def bande(L=57, Rr=133, T=37, th=17, s=2):
    """Bandeau : axe en arc très léger (le milieu un peu plus bas), épaisseur constante, bouts en demi-cercle."""
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
    contour = haut + bout(Rc, haut[-1]) + bas[::-1] + bout(Lc, bas[0])
    return contour, haut, bas


def chemin(pts):
    return 'M' + ' L'.join(f(p) for p in pts) + 'Z'


def fourrure(pts, pas=5.2, bosse=1.9):
    """Contour à petites bosses (fourrure), comme sur la planche d'exemples."""
    aire = sum(pts[i][0] * pts[(i + 1) % len(pts)][1] - pts[(i + 1) % len(pts)][0] * pts[i][1] for i in range(len(pts)))
    sens = 1 if aire > 0 else -1
    # rééchantillonnage régulier
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
        nx, ny = -ty / l * sens * -1, tx / l * sens * -1
        d += ' Q' + f((m[0] + nx * bosse * 2, m[1] + ny * bosse * 2)) + ' ' + f(b)
    return d + 'Z'


def pompon(cx, cy, r, poilu=False):
    if not poilu:
        return f'<circle cx="{cx:g}" cy="{cy:g}" r="{r:g}" fill="#FFFFFF"/>'
    pts = [(cx + r * .86 * math.cos(2 * math.pi * k / 40), cy + r * .86 * math.sin(2 * math.pi * k / 40)) for k in range(40)]
    return f'<path d="{fourrure(pts, pas=4.6, bosse=1.6)}" fill="#FFFFFF"/>'


def pli(d):
    return f'<path d="{d}" stroke="{INK}" stroke-width="2.2" fill="none"/>'


def bonnet(style, **_):
    """Rend (svg du bonnet, bas du bandeau) pour un des modèles : 'A' lisse, 'B' fourrure, 'C' pointu, 'D' tombant."""
    contour, haut, bas = bande()
    G, D = haut[0], haut[-1]                    # le rouge part du début des bouts arrondis
    retour_bande = ' '.join('L' + f(p) for p in haut[1:]) + ' Z'
    if style in ('A', 'B'):
        rouge = (f'M{f(D)} C{f((D[0] + 4, D[1] - 24))} {f((114, -5))} {f((90, -5))} '
                 f'C{f((70, -5))} {f((56, 6))} {f((46, 22))} '
                 f'C{f((55, 26))} {f((G[0] - 2, G[1] - 12))} {f(G)} ' + retour_bande)
        plis = pli('M102 4 Q84 8 68 24')
        pp = pompon(43, 24, 11.5, poilu=(style == 'B'))
    elif style == 'C':
        rouge = (f'M{f(D)} C{f((D[0] - 1, D[1] - 16))} {f((104, 6))} {f((84, -6))} '
                 f'C{f((80, 6))} {f((G[0] + 2, G[1] - 16))} {f(G)} ' + retour_bande)
        plis = pli('M92 6 Q90 18 96 30')
        pp = pompon(83, -7, 10.5)
    else:  # 'D' : la pointe passe par-dessus et retombe sur le côté, le pompon pend près de l'oreille
        rouge = (f'M{f(D)} C{f((D[0] + 4, D[1] - 24))} {f((114, -4))} {f((90, -4))} '
                 f'C{f((66, -4))} {f((50, 8))} {f((45, 30))} '
                 f'C{f((42, 40))} {f((43, 50))} {f((45, 57))} '
                 f'C{f((50, 52))} {f((53, 42))} {f((G[0] - 1, G[1] - 6))} L{f(G)} ' + retour_bande)
        plis = pli('M100 4 Q78 8 60 24')
        pp = pompon(45, 60, 9.5)
    if style == 'B':
        bord = f'<path d="{fourrure(contour)}" fill="#FFFFFF"/>'
    else:
        bord = f'<path d="{chemin(contour)}" fill="#FFFFFF"/>'
    # ordre : rouge, pli, bandeau, pompon (pour D, le pompon pend devant le bandeau)
    return f'<path d="{rouge}" fill="{ROUGE}"/>' + plis + bord + pp, bas
