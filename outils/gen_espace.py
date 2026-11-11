"""Planche « Pages réservées aux adhérents » (11 novembre 2026, demande d'Isabelle Eimer : une mise en page plus attractive et sobre des
pages de l'espace adhérent, « selon ce que l'on a défini ensemble » ; « Fais une proposition avec une planche d'abord »).
Une proposition, montrée page par page à côté du site d'aujourd'hui (captures à 1280 px de large, outils/capture_espace.js).
usage : python3 gen_espace.py <dossier des captures> <descriptions.json> <fichier de sortie> <logo svg>
descriptions.json : { "ensemble": "…", "veille": "…", "ecrire": "…", "lettre": "…", "publier": "…" }"""
import base64, json, sys, pathlib, html as H
from PIL import Image
D = pathlib.Path(sys.argv[1]); TXT = json.load(open(sys.argv[2], encoding='utf-8')); OUT = sys.argv[3]
LOGO = open(sys.argv[4], encoding='utf-8').read()
NB, FINE = ' ', ' '
PAGES = [('veille', 'La veille réglementaire'), ('ecrire', 'Écrire au bureau'), ('lettre', 'La lettre d’information'), ('publier', 'Publier sur le site')]

def img(p, largeur=900):
    """Image en JPEG réduite pour la planche (les captures sont longues)."""
    with Image.open(D / p) as i:
        i = i.convert('RGB'); w, h = i.size
        if w > largeur:
            i = i.resize((largeur, round(h * largeur / w)), Image.LANCZOS)
        import io
        b = io.BytesIO(); i.save(b, 'JPEG', quality=80); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode(), i.size

blocs = []
for k, nom in PAGES:
    a, (wa, ha) = img(f'actuel-{k}.jpg'); n, (wn, hn) = img(f'final-{k}.jpg')
    blocs.append(f'''<section class="page-bloc" id="{k}" aria-labelledby="t-{k}">
  <div class="tete"><h2 id="t-{k}">{H.escape(nom)}</h2><p>{H.escape(TXT.get(k, ''))}</p></div>
  <div class="duo">
    <figure class="avant"><figcaption>Aujourd’hui</figcaption><img src="{a}" alt="{H.escape(nom)}, aujourd’hui" width="{wa}" height="{ha}" loading="lazy"></figure>
    <figure class="apres"><figcaption>Proposition</figcaption><img src="{n}" alt="{H.escape(nom)}, proposition" width="{wn}" height="{hn}" loading="lazy"></figure>
  </div>
</section>''')

som = ''.join(f'<a href="#{k}">{H.escape(nom)}</a>' for k, nom in PAGES)
page = f'''<title>Espace adhérent</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Planche : les pages réservées aux adhérents, aujourd'hui et en proposition, page par page. Charte du site : thème clair seulement. */
:root{{
  --vert:#5F7A2B; --anis:#A3BE3C; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD;
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1240px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 56px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:22px}}
h1,h2{{color:var(--encre);margin:0;text-wrap:balance}}
p{{margin:0}}
.entete{{display:flex;align-items:center;gap:12px}}
.entete svg{{width:44px;height:44px;flex:none}}
.entete .nom{{font-weight:900;font-size:28px;line-height:1;color:var(--texte)}}
.titre{{display:flex;flex-direction:column;gap:10px;max-width:56em}}
.titre h1{{font-size:clamp(30px,4.4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:18px}}
.ensemble{{padding:18px 22px;border-radius:18px;background:var(--blanc);border-top:4px solid var(--anis)}}
.ensemble h2{{font-size:20px;font-weight:800;margin-bottom:6px}}
.sommaire{{display:flex;flex-wrap:wrap;gap:8px}}
.sommaire a{{display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:12px;background:var(--blanc);border:1px solid var(--filet);color:var(--encre);font-weight:700;text-decoration:none}}
.sommaire a:hover{{border-color:var(--vert)}}
.sommaire a:focus-visible{{outline:3px solid var(--vert);outline-offset:3px}}
.page-bloc{{display:flex;flex-direction:column;gap:16px;padding:clamp(16px,2.4vw,26px);border-radius:22px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06);scroll-margin-top:16px}}
.tete h2{{font-size:clamp(23px,2.4vw,28px);font-weight:800;letter-spacing:-.015em}}
.tete p{{margin-top:6px;font-size:16px;max-width:60em}}
.duo{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start}}
figure{{margin:0;display:flex;flex-direction:column;gap:8px;min-width:0}}
figure img{{display:block;width:100%;height:auto;border-radius:12px;border:1px solid var(--filet)}}
figcaption{{font-size:15px;font-weight:800;color:var(--encre)}}
.apres figcaption{{color:var(--vert)}}
.pied{{font-size:14.5px;color:var(--gris);max-width:62em}}
@media (max-width:760px){{.duo{{grid-template-columns:minmax(0,1fr)}}}}
</style>
<div class="page">
  <div class="entete" aria-label="SLBC">{LOGO}<span class="nom">SLBC</span></div>
  <div class="titre">
    <h1>Pages réservées aux adhérents</h1>
    <p>Une proposition pour les quatre pages de l’espace adhérent, une fois connecté{NB}: la veille réglementaire, écrire au bureau, la lettre d’information et les outils du bureau. Chaque page est montrée telle qu’elle est aujourd’hui, puis avec la proposition. Le site n’est pas modifié.</p>
  </div>
  <div class="ensemble"><h2>Ce qui est commun aux quatre pages</h2><p>{H.escape(TXT.get('ensemble', ''))}</p></div>
  <nav class="sommaire" aria-label="Pages">{som}</nav>
  {"".join(blocs)}
  <p class="pied">Planche du 11 novembre 2026, en captures de la maquette sur ordinateur. L’affichage sur iPad et sur téléphone sera vérifié une fois la proposition validée. Il est possible de garder une page telle qu’elle est aujourd’hui ou de ne reprendre qu’une partie de la proposition.</p>
</div>
'''
open(OUT, 'w', encoding='utf-8').write(page)
print('ok', len(page))
