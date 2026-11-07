# Note « Mise en service du site SLBC », aux couleurs de la charte du nouveau site : remplit le modèle (pastilles numérotées,
# mascotte de la Documentation, parcours d'un compte). usage : python3 gen_note.py <dossier>
import sys, pathlib
D = pathlib.Path(sys.argv[1])
html = (D / 'note-modele.html').read_text(encoding='utf-8')

def pastille(n):
    fs = 20 if n < 10 else 17
    return ('<svg class="pastille" viewBox="0 0 60 60" aria-hidden="true">'
            '<circle cx="35" cy="35" r="21" fill="#A3BE3C"/>'
            '<circle cx="27" cy="27" r="21" fill="#FFFFFF" stroke="#2E3236" stroke-width="3"/>'
            f'<text x="27" y="{27 + fs * 0.36:.1f}" text-anchor="middle" font-family="Figtree, sans-serif" font-weight="800" font-size="{fs}" fill="#2E3236">{n}</text></svg>')
for n in range(10, 0, -1):
    html = html.replace('{{P%d}}' % n, pastille(n))

masc = (D / 'mascotte.svg').read_text(encoding='utf-8').strip()
masc = masc.replace('<svg xmlns="http://www.w3.org/2000/svg" ', '<svg class="mascotte" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" ', 1)
html = html.replace('{{MASCOTTE}}', masc)

# Parcours d'un compte : flux principal en ligne, « mot de passe oublié » au-dessus, désactivation en dessous
W, H = 160, 56
A = 170          # ligne du flux principal
T = 50           # ligne du dessus (oubli)
B = 290          # ligne du dessous (désactivé)
cx = [90, 270, 450, 630]
ox = 630         # boîte « Mot de passe oublié », au-dessus de « Compte actif »
ink, gris, vert, vclair = '#2E3236', '#5E6266', '#5F7A2B', '#D6E4A6'
def box(x, y, nom, detail, accent=False):
    fill = vclair if accent else '#FFFFFF'; stroke = vert if accent else ink
    return (f'<rect x="{x - W/2:g}" y="{y - H/2:g}" width="{W}" height="{H}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="2"/>'
            f'<text x="{x}" y="{y - 4}" text-anchor="middle" font-size="13.5" font-weight="700" fill="{ink}">{nom}</text>'
            f'<text x="{x}" y="{y + 15}" text-anchor="middle" font-size="12" fill="{ink if accent else gris}">{detail}</text>')
def arrow(d):
    return f'<path d="{d}" fill="none" stroke="{gris}" stroke-width="1.6" marker-end="url(#fl)"/>'
svg = [f'<svg viewBox="0 0 760 330" role="img" aria-labelledby="schema-titre" font-family="Figtree, sans-serif">',
       '<title id="schema-titre">Parcours d’un compte : le bureau crée le compte, l’adhérent reçoit une invitation et choisit son mot de passe ; en cas d’oubli, un nouveau lien ; à la fin de l’adhésion, le compte est désactivé.</title>',
       f'<defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="{gris}"/></marker></defs>']
for i in range(3):
    svg.append(arrow(f'M{cx[i] + W/2:g} {A}H{cx[i + 1] - W/2 - 2:g}'))
svg.append(arrow(f'M{cx[3]} {A - H/2}V{T + H/2 + 2:g}'))           # actif → oubli
svg.append(arrow(f'M{ox - W/2:g} {T}H{cx[2]}V{A - H/2 - 2:g}'))         # oubli → choix du mot de passe
svg.append(arrow(f'M{cx[3] - 20} {A + H/2}V{B - H/2 - 2:g}'))           # actif → désactivé
svg.append(arrow(f'M{cx[3] + 15} {B - H/2}V{A + H/2 + 2:g}'))           # désactivé → actif
svg.append(box(cx[0], A, 'Création du compte', 'par le bureau'))
svg.append(box(cx[1], A, 'Invitation', 'lien à usage unique'))
svg.append(box(cx[2], A, 'Mot de passe', 'choisi par l’adhérent'))
svg.append(box(cx[3], A, 'Compte actif', 'espace adhérent ouvert', accent=True))
svg.append(box(ox, T, 'Mot de passe oublié', 'nouveau lien envoyé'))
svg.append(box(cx[3], B, 'Compte désactivé', 'par le bureau'))
lab = lambda x, y, t, anchor='start': f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="12" fill="{gris}">{t}</text>'
svg.append(lab(cx[3] + 8, 114, 'oubli'))
svg.append(lab(cx[2] - 8, 100, 'nouveau mot de passe', 'end'))
svg.append(lab(cx[3] - 28, 236, 'fin d’adhésion', 'end'))
svg.append(lab(cx[3] + 23, 236, 'renouvellement'))
svg.append('</svg>')
html = html.replace('{{SCHEMA}}', ''.join(svg))
assert '{{' not in html
# « e-mail » ne se coupe pas en fin de ligne (trait d'union insécable dans le texte)
html = html.replace('e-mail', 'e\u2011mail').replace('E-mail', 'E\u2011mail')
(D / 'note-mise-en-service.html').write_text(html, encoding='utf-8')
print('ok', len(html))
