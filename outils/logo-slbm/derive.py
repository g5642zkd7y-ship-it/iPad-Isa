"""Dérive le jeu de fichiers d'une piste à partir du signe (120 x 120) et du logo horizontal rendus par l'atelier.
usage : python3 derive.py <signe.svg> <logo.svg> <dossier de sortie> <clé>
Produit : symbole.svg, symbole-sombre.svg, symbole-mono.svg, symbole-blanc.svg, logo-slbm.svg, logo-slbm-sombre.svg, logo-slbm-vertical.svg.
Sur le fond olive : gris et encre -> blanc, vert foncé -> vert clair, vert anis gardé, réserves blanches -> olive."""
import os, re, sys
SIG, LOGO, OUT, CLE = sys.argv[1:5]
OLIVE = '#657B3D'
SOMBRE = {'#5E6266': '#FFFFFF', '#5F7A2B': '#D6E4A6', '#2E3236': '#FFFFFF', '#3F4347': '#FFFFFF', '#FFFFFF': OLIVE, '#FFF': OLIVE, '#A3BE3C': '#A3BE3C', '#D6E4A6': '#D6E4A6'}
def carte(t, f):
    def r(m):
        c = m.group(2).upper()
        c = {'#FFF': '#FFFFFF'}.get(c, c)
        return f'{m.group(1)}="{f(c)}"'
    return re.sub(r'\b(fill|stroke)="(#[0-9A-Fa-f]{3,6})"', r, t)
def ids(t, suf):
    for i in set(re.findall(r'\bid="([^"]+)"', t)):
        t = t.replace(f'id="{i}"', f'id="{CLE}-{suf}-{i}"').replace(f'url(#{i})', f'url(#{CLE}-{suf}-{i})').replace(f'href="#{i}"', f'href="#{CLE}-{suf}-{i}"')
    return t
def ecrit(nom, t):
    open(os.path.join(OUT, nom), 'w', encoding='utf-8').write(t)
os.makedirs(OUT, exist_ok=True)
sig, logo = open(SIG, encoding='utf-8').read(), open(LOGO, encoding='utf-8').read()
ecrit('symbole.svg', ids(sig, 'symbole'))
ecrit('symbole-sombre.svg', ids(carte(sig, lambda c: SOMBRE.get(c, c)), 'sombre'))
ecrit('symbole-mono.svg', ids(carte(sig, lambda c: c if c == '#FFFFFF' else '#2E3236'), 'mono'))
ecrit('symbole-blanc.svg', ids(carte(sig, lambda c: OLIVE if c == '#FFFFFF' else '#FFFFFF'), 'blanc'))
ecrit('logo-slbm.svg', ids(logo, 'logo'))
ecrit('logo-slbm-sombre.svg', ids(carte(logo, lambda c: SOMBRE.get(c, c)), 'logo-sombre'))
# logo en hauteur : le signe au-dessus, le nom et la signature centrés dessous
corps = re.sub(r'^.*?<svg[^>]*>', '', sig, flags=re.S).rsplit('</svg>', 1)[0]
vb = [float(x) for x in re.search(r'viewBox="([^"]+)"', sig).group(1).split()]
W = 400
ech = 112 / vb[3]
tx = (W - vb[2] * ech) / 2 - vb[0] * ech
vert = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 222" role="img" aria-label="SLBM, Syndicat des Laboratoires de Biologie Médicale">
  <g transform="translate({tx:.2f} {8 - vb[1] * ech:.2f}) scale({ech:.4f})">{corps}</g>
  <text x="{W / 2 + .75}" y="182" text-anchor="middle" font-family="Nunito" font-weight="900" font-size="74" letter-spacing="1.5" fill="#2E3236">SLBM</text>
  <text x="{W / 2}" y="208" text-anchor="middle" font-family="Nunito" font-weight="700" font-size="17.5" fill="#3F4347">Syndicat des Laboratoires <tspan fill="#5F7A2B">de Biologie Médicale</tspan></text>
</svg>'''
ecrit('logo-slbm-vertical.svg', ids(vert, 'logo-vertical'))
print('ok', CLE)
