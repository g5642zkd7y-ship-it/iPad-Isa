"""Variante de la charte graphique avec le nom SLBM, Syndicat des Laboratoires de Biologie Médicale (10 novembre 2026).
Le logo, les couleurs et les règles ne changent pas : seul le nom change. La charte SLBC reste la référence.

python3 gen_slbm.py <charte.html source> <CHARTE.md source> <sortie.html> <sortie.md>"""
import sys
SRC_HTML, SRC_MD, OUT_HTML, OUT_MD = sys.argv[1:5]

def un(t, old, new):
    assert t.count(old) == 1, (old[:80], t.count(old))
    return t.replace(old, new)

def renomme(t):
    # Mentions historiques : elles parlent du syndicat, pas du nouveau nom
    t = un(t, 'couleurs historiques du SLBC', 'couleurs historiques du syndicat')
    t = un(t, 'ancien logo du SLBC', 'ancien logo du syndicat')
    t = t.replace('de Biologie Clinique', 'de Biologie Médicale')
    t = t.replace('SLBC', 'SLBM').replace('slbc', 'slbm')
    assert 'SLBC' not in t and 'Clinique' not in t and 'slbc' not in t
    return t

NOTE = ('Variante du 10 novembre 2026 : la même charte avec le nom SLBM, Syndicat des Laboratoires de Biologie Médicale, '
        'demandée par Isabelle Eimer. Le logo, les couleurs, les polices et les règles ne changent pas : seuls le nom et la signature changent. '
        'Le nom actuel reste SLBC tant que le bureau n’a pas décidé. Le M est plus large que le C : proportions et tailles minimales '
        'du logo (§ 2.4 et 2.6) à revérifier sur le logo dessiné.')

LOGO = ('<div class="logo-variante" role="img" aria-label="Logo SLBM, Syndicat des Laboratoires de Biologie Médicale">'
        '<svg viewBox="0 0 120 120" width="92" height="92" aria-hidden="true"><defs><clipPath id="variante-commun"><circle cx="44" cy="44" r="36"/></clipPath></defs>'
        '<circle cx="44" cy="44" r="36" fill="#5E6266"/><circle cx="76" cy="76" r="36" fill="#A3BE3C"/>'
        '<circle cx="76" cy="76" r="36" fill="#5F7A2B" clip-path="url(#variante-commun)"/></svg>'
        '<span class="lv-txt" aria-hidden="true"><span class="lv-nom">SLBM</span><span class="lv-sig">Syndicat des Laboratoires<br>'
        '<span class="lv-sig2">de Biologie Médicale</span></span></span></div>')

CSS = ('  .logo-variante { display: inline-flex; align-items: center; gap: 18px; padding: 20px 26px; border-radius: 16px; background: #FFFFFF; box-shadow: inset 0 0 0 1px #E3E5E0; align-self: flex-start; max-width: 100%; }\n'
       '  .logo-variante svg { flex: none; }\n'
       '  .lv-txt { display: flex; flex-direction: column; gap: 4px; font-family: "Nunito", "Arial Rounded MT Bold", Arial, sans-serif; }\n'
       '  .lv-nom { font-weight: 900; font-size: 56px; line-height: .9; letter-spacing: .02em; color: #3F4347; }\n'
       '  .lv-sig { font-weight: 700; font-size: 17.5px; line-height: 1.25; color: #5E6266; white-space: nowrap; }\n'
       '  .lv-sig2 { color: #5F7A2B; }\n'
       '  @media (max-width: 420px) { .logo-variante { gap: 12px; padding: 16px; } .logo-variante svg { width: 64px; height: 64px; } .lv-nom { font-size: 40px; } .lv-sig { font-size: 12.5px; } }\n')

# ---------- Page HTML (même mise en page que la charte SLBC) ----------
h = renomme(open(SRC_HTML, encoding='utf-8').read())
h = un(h, '<title>DESIGN.md</title>', '<title>Charte graphique SLBM</title>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap">')
h = un(h, '<p class="lede"></p>', '<p class="lede"></p>\n    ' + LOGO)
h = un(h, '<blockquote><p>Mise à jour du 4 novembre 2026', '<blockquote><p><strong>' + NOTE + '</strong><br>Mise à jour du 4 novembre 2026')
h = un(h, '  hr { border: none; border-top: 1px solid var(--border); margin: 0; }\n</style>',
       '  hr { border: none; border-top: 1px solid var(--border); margin: 0; }\n' + CSS + '</style>')
assert h.count('SLBC') == 1 and 'Clinique' not in h
open(OUT_HTML, 'w', encoding='utf-8').write(h)

# ---------- Version texte (Markdown) ----------
m = renomme(open(SRC_MD, encoding='utf-8').read())
m = un(m, '> **État de ce fichier** : copie de la charte publiée le 4 novembre 2026 (https://claude.ai/artifact/EhTqyWrkSQibEFKKZiydUK).',
       '> **' + NOTE + '** Charte de référence, au nom SLBC : `marque/CHARTE.md` (https://claude.ai/artifact/EhTqyWrkSQibEFKKZiydUK).')
assert m.count('SLBC') == 2 and 'Clinique' not in m
open(OUT_MD, 'w', encoding='utf-8').write(m)
print('ok', len(h), len(m))
