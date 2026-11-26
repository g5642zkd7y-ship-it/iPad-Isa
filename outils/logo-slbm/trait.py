"""Outils de dessin pour les signes « au geste » : traits pleins et déliés (largeur variable), courbes lissées.
Tout sort en chemins SVG faits de courbes de Bézier (quelques dizaines de segments au plus), jamais de centaines de petits segments.

    from trait import ruban, profil, lisse, cercle
    d = ruban([((14, 80), (40, 96), (78, 80), (108, 30))], profil([(0, 3), (.35, 20), (1, 0)]))
    # -> chemin fermé d'un trait dont la ligne médiane suit la courbe de Bézier donnée et dont l'épaisseur
    #    passe de 3 à 20 puis à 0 (pointe) ; plusieurs courbes à la suite = [(p0,p1,p2,p3), (p3,p4,p5,p6), ...]

    ruban(segments, largeur, n=28, bouts=('rond', 'pointe'))   # bouts : 'rond', 'pointe' ou 'plat' (début, fin)
    profil([(u, largeur), ...])                                  # largeur en fonction de u (0 = début, 1 = fin), interpolation douce
    lisse(points, ferme=True)                                    # courbe lisse passant par des points (Catmull-Rom -> Bézier)
"""
import math


def _pt(seg, t):
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = seg
    a, b, c, d = (1 - t) ** 3, 3 * (1 - t) ** 2 * t, 3 * (1 - t) * t * t, t ** 3
    return a * x0 + b * x1 + c * x2 + d * x3, a * y0 + b * y1 + c * y2 + d * y3


def _der(seg, t):
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = seg
    a, b, c = 3 * (1 - t) ** 2, 6 * (1 - t) * t, 3 * t * t
    return a * (x1 - x0) + b * (x2 - x1) + c * (x3 - x2), a * (y1 - y0) + b * (y2 - y1) + c * (y3 - y2)


def profil(pts):
    """Largeur en fonction de u (0..1) : interpolation douce (cosinus) entre les points donnés."""
    pts = sorted(pts)

    def f(u):
        if u <= pts[0][0]:
            return pts[0][1]
        for (a, wa), (b, wb) in zip(pts, pts[1:]):
            if u <= b:
                k = (u - a) / (b - a) if b > a else 1
                k = (1 - math.cos(math.pi * k)) / 2
                return wa + (wb - wa) * k
        return pts[-1][1]
    return f


def lisse(points, ferme=True, r=2):
    """Chemin SVG lisse passant par les points (Catmull-Rom converti en courbes de Bézier)."""
    n = len(points)
    P = lambda i: points[i % n] if ferme else points[max(0, min(n - 1, i))]
    f = lambda v: f'{round(v, r):g}'
    d = f'M{f(points[0][0])} {f(points[0][1])}'
    for i in range(n if ferme else n - 1):
        p0, p1, p2, p3 = P(i - 1), P(i), P(i + 1), P(i + 2)
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}'
    return d + (' Z' if ferme else '')


def ruban(segments, largeur, n=28, bouts=('rond', 'pointe')):
    """Contour fermé d'un trait à largeur variable le long d'une ou plusieurs courbes de Bézier cubiques."""
    if callable(largeur) is False:
        w0 = largeur
        largeur = lambda u: w0
    m = len(segments)
    centre, norm, larg = [], [], []
    for i in range(n + 1):
        u = i / n
        s = min(m - 1, int(u * m))
        t = u * m - s
        x, y = _pt(segments[s], t)
        dx, dy = _der(segments[s], t)
        if abs(dx) + abs(dy) < 1e-9:
            dx, dy = _der(segments[s], min(1, max(0, t + (1e-3 if t < .5 else -1e-3))))
        L = math.hypot(dx, dy) or 1
        centre.append((x, y)); norm.append((-dy / L, dx / L)); larg.append(largeur(u) / 2)
    g = [(c[0] + nn[0] * w, c[1] + nn[1] * w) for c, nn, w in zip(centre, norm, larg)]
    dr = [(c[0] - nn[0] * w, c[1] - nn[1] * w) for c, nn, w in zip(centre, norm, larg)]

    def cap(i, sens):
        """Demi-rond au bout i (0 ou n) ; sens = +1 à la fin, -1 au début."""
        c, nn, w = centre[i], norm[i], larg[i]
        tx, ty = nn[1] * sens, -nn[0] * sens
        return [(c[0] + w * (math.cos(a) * nn[0] * sens + math.sin(a) * tx), c[1] + w * (math.cos(a) * nn[1] * sens + math.sin(a) * ty))
                for a in (math.pi * k / 6 for k in range(1, 6))]
    pts = list(g)
    if bouts[1] == 'rond' and larg[-1] > .5:
        pts += cap(n, 1)
    pts += dr[::-1]
    if bouts[0] == 'rond' and larg[0] > .5:
        pts += cap(0, -1)
    # retire les doublons (pointes)
    net = []
    for p in pts:
        if not net or math.hypot(p[0] - net[-1][0], p[1] - net[-1][1]) > .05:
            net.append(p)
    if math.hypot(net[0][0] - net[-1][0], net[0][1] - net[-1][1]) < .05:
        net.pop()
    return lisse(net, True)


def cercle(cx, cy, r):
    return f'M{cx - r} {cy} A{r} {r} 0 1 0 {cx + r} {cy} A{r} {r} 0 1 0 {cx - r} {cy} Z'


if __name__ == '__main__':
    d = ruban([((12, 70), (34, 100), (74, 92), (110, 26))], profil([(0, 4), (.3, 24), (1, 0)]))
    open('essai-trait.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><path d="{d}" fill="#5F7A2B"/></svg>')
    print(len(d), 'caractères')
