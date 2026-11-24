"""Planche « Propositions de logo » : nouvelles pistes pour le symbole du SLBC, à côté du logo actuel.
Demande d'Isabelle Eimer (24 novembre 2026) : « Fais plusieurs propositions de logos qui soient un peu moins simples
et plus impactants, les deux ronds ressemblent à Mastercard ».
Chaque piste est dans un dossier <logos>/<clé>/ : symbole.svg, symbole-sombre.svg, symbole-mono.svg, logo-slbc.svg,
logo-slbc-sombre.svg, logo-slbm.svg, description.json (titre, idee, plus_fort, mastercard, animation, a_verifier).
Le logo actuel est dans <logos>/actuel/. Le site et le logo validé ne changent pas.
usage : python3 gen_logos.py <dossier logos> <sortie.html> <clé1> <clé2> ..."""
import html, json, os, re, sys

DOS, OUT, CLES = sys.argv[1], sys.argv[2], sys.argv[3:]
NB, FINE = ' ', ' '
compteur = [0]


def svg(cle, nom, cls=''):
    """SVG en ligne, id rendus uniques (plusieurs copies du même dessin dans la page), caché aux lecteurs d'écran."""
    t = open(f'{DOS}/{cle}/{nom}', encoding='utf-8').read()
    t = re.sub(r'<\?xml[^>]*\?>', '', t).strip()
    compteur[0] += 1
    suf = f'-u{compteur[0]}'
    for i in set(re.findall(r'\bid="([^"]+)"', t)):
        t = t.replace(f'id="{i}"', f'id="{i}{suf}"').replace(f'url(#{i})', f'url(#{i}{suf})').replace(f'href="#{i}"', f'href="#{i}{suf}"')
    t = re.sub(r'\s(role|aria-label|aria-labelledby)="[^"]*"', '', t, count=0)
    t = t.replace('<svg', f'<svg aria-hidden="true" focusable="false"{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}', 1)
    return t


def e(s):
    return html.escape(s, quote=False)


def entete(cle):
    return f'''<div class="site-tete" aria-hidden="true"><span class="st-logo">{svg(cle, "symbole.svg", "st-mark")}<span class="st-mot">SLBC</span></span>
<span class="st-onglets"><span class="st-on">Accueil</span><span>Le syndicat</span><span>Veille</span><span>Presse</span></span><span class="st-btn">Adhérer</span></div>'''


def petits(cle):
    tailles = ''.join(f'<span class="taille"><span class="t-img" style="--t:{px}px">{svg(cle, "symbole.svg")}</span><span class="t-n">{px}{NB}px</span></span>' for px in (64, 32, 16))
    return f'''<div class="petits">
  <div class="bloc"><p class="bloc-t">En petit</p><div class="tailles">{tailles}</div></div>
  <div class="bloc"><p class="bloc-t">Onglet du navigateur</p><div class="onglet"><span class="o-fav">{svg(cle, "symbole.svg")}</span><span>SLBC{NB}– Accueil</span></div></div>
  <div class="bloc"><p class="bloc-t">Une couleur</p><div class="mono">{svg(cle, "symbole-mono.svg")}</div></div>
  <div class="bloc"><p class="bloc-t">Réseaux sociaux</p><div class="avatar">{svg(cle, "symbole.svg")}</div></div>
</div>'''


def note(d):
    return f'<p class="note">{e(d["note"])}</p>' if d.get('note') else ''


def variante(cle):
    """Variante facultative : variante.json (titre, texte), symbole-variante.svg, logo-slbc-variante.svg."""
    if not os.path.exists(f'{DOS}/{cle}/variante.json'):
        return ''
    v = json.load(open(f'{DOS}/{cle}/variante.json', encoding='utf-8'))
    return f'''<div class="variante"><div class="var-txt"><h3>{e(v["titre"])}</h3><p>{e(v["texte"])}</p></div>
  <div class="var-img">{svg(cle, "symbole-variante.svg", "var-sym")}{svg(cle, "logo-slbc-variante.svg", "lockup var-lock")}</div></div>'''


def proposition(n, cle):
    d = json.load(open(f'{DOS}/{cle}/description.json', encoding='utf-8'))
    return f'''<section class="prop" id="p{n}" aria-labelledby="t{n}">
  <header class="prop-tete"><span class="num" aria-hidden="true">{n}</span><div><h2 id="t{n}"><span class="lu">Proposition {n}{NB}: </span>{e(d["titre"])}</h2><p class="idee">{e(d["idee"])}</p></div></header>
  <div class="vues">
    <figure class="vue v-blanc">{svg(cle, "logo-slbc.svg", "lockup")}<figcaption>Sur fond blanc</figcaption></figure>
    <figure class="vue v-olive">{svg(cle, "logo-slbc-sombre.svg", "lockup")}<figcaption>Sur le vert du site</figcaption></figure>
  </div>
  {note(d)}
  {variante(cle)}
  {entete(cle)}
  {petits(cle)}
  <div class="textes">
    <div><h3>Pourquoi plus fort</h3><p>{e(d["plus_fort"])}</p></div>
    <div><h3>Et Mastercard{FINE}?</h3><p>{e(d["mastercard"])}</p></div>
    <div><h3>À l’ouverture des pages</h3><p>{e(d["animation"])}</p></div>
    <div><h3>À vérifier</h3><p>{e(d["a_verifier"])}</p></div>
  </div>
  <figure class="vue v-slbm">{svg(cle, "logo-slbm.svg", "lockup lockup-slbm")}<figcaption>Au nom SLBM, si le bureau retient ce nom</figcaption></figure>
</section>'''


props = [proposition(i + 1, c) for i, c in enumerate(CLES)]
apercu = f'<div class="ap ap-actuel"><span class="ap-img">{svg("actuel", "symbole.svg")}</span><span class="ap-n">Aujourd’hui</span></div>' + ''.join(f'<a class="ap" href="#p{i + 1}"><span class="ap-img">{svg(c, "symbole.svg")}</span><span class="ap-n">{i + 1}. {e(json.load(open(f"{DOS}/{c}/description.json", encoding="utf-8"))["titre"])}</span></a>' for i, c in enumerate(CLES))

page = f'''<title>Propositions de logo SLBC</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Propositions de logo pour le SLBC, à côté du logo actuel. Charte du site : thème clair seulement, palette du logo, Nunito.
   Une carte par proposition : le logo en grand sur blanc et sur le vert du site, dans l'en-tête, en petit, puis les explications. */
:root{{
  --anis:#A3BE3C; --vert:#5F7A2B; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --olive:#657B3D; --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD;
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1180px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:28px}}
h1,h2,h3{{color:var(--encre);margin:0;text-wrap:balance}}
p,figure{{margin:0}}
a{{color:var(--vert)}}
a:focus-visible{{outline:3px solid var(--vert);outline-offset:3px;border-radius:6px}}
.lu{{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
.titre{{display:flex;flex-direction:column;gap:10px;max-width:52em}}
.titre h1{{font-size:clamp(30px,4.4vw,42px);line-height:1.1;font-weight:800;letter-spacing:-.02em}}
.titre p{{font-size:18px}}
.citation{{font-weight:700;color:var(--encre)}}
.actuel{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:24px;align-items:center;padding:22px;border-radius:22px;background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}
.actuel .lockup{{width:100%;max-width:420px;height:auto;display:block}}
.actuel h2{{font-size:20px;font-weight:800;margin-bottom:6px}}
.actuel ul{{margin:8px 0 0;padding-left:1.2em;display:flex;flex-direction:column;gap:4px}}
.apercus{{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}}
.ap{{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 10px 14px;border-radius:16px;background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet);text-decoration:none;color:var(--encre);font-weight:700;font-size:15px;text-align:center;line-height:1.3}}
a.ap:hover{{box-shadow:inset 0 0 0 2px var(--vert)}}
.ap-actuel{{background:transparent;box-shadow:inset 0 0 0 1px var(--filet);color:var(--gris)}}
.ap-img svg{{width:84px;height:84px;display:block}}
.prop{{display:flex;flex-direction:column;gap:18px;padding:clamp(16px,2.4vw,26px);border-radius:24px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06);scroll-margin-top:16px}}
.prop-tete{{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:start}}
.num{{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--vert-clair);color:var(--encre);font-weight:900;font-size:23px}}
.prop-tete h2{{font-size:24px;font-weight:800;line-height:1.2}}
.idee{{font-size:17px;margin-top:4px;max-width:52em}}
.vues{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
.vue{{display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;padding:clamp(20px,3.4vw,40px) 18px 14px;border-radius:18px;min-width:0}}
.vue figcaption{{font-size:13.5px;font-weight:700;letter-spacing:.03em;align-self:flex-start}}
.v-blanc{{background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}
.v-blanc figcaption{{color:var(--gris)}}
.v-olive{{background:var(--olive)}}
.v-olive figcaption{{color:var(--blanc)}}
.lockup{{width:100%;max-width:400px;height:auto;display:block}}
.v-slbm{{background:var(--fond);padding-top:22px;align-items:flex-start}}
.v-slbm .lockup{{max-width:300px}}
.v-slbm figcaption{{color:var(--gris)}}
.note{{font-size:15.5px;color:var(--gris);margin-top:-6px}}
.variante{{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:18px;align-items:center;padding:16px 18px;border-radius:16px;background:var(--fond)}}
.var-txt h3{{font-size:16px;font-weight:800;margin-bottom:4px}}
.var-txt p{{font-size:15.5px}}
.var-img{{display:flex;align-items:center;gap:22px;min-width:0}}
.var-sym{{width:64px;height:64px;flex:none;display:block}}
.var-lock{{max-width:300px}}
.site-tete{{display:flex;align-items:center;gap:22px;padding:12px 18px;border-radius:14px;background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet),0 6px 16px -10px rgba(46,50,54,.25);overflow:hidden;min-width:0}}
.st-logo{{display:inline-flex;align-items:center;gap:10px;flex:none}}
.st-mark{{width:36px;height:36px;display:block}}
.st-mot{{font-weight:900;font-size:27px;line-height:1;letter-spacing:.02em;color:var(--texte)}}
.st-onglets{{display:flex;gap:22px;font-weight:700;font-size:17px;color:var(--encre);min-width:0;overflow:hidden;white-space:nowrap}}
.st-on{{color:var(--vert)}}
.st-btn{{margin-left:auto;flex:none;background:var(--vert);color:var(--blanc);font-weight:800;font-size:16px;padding:8px 18px;border-radius:999px}}
.petits{{display:grid;grid-template-columns:1.3fr 1.3fr .8fr .8fr;gap:10px}}
.bloc{{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:14px;background:var(--fond);min-width:0}}
.bloc-t{{font-size:13.5px;font-weight:700;letter-spacing:.03em;color:var(--gris)}}
.tailles{{display:flex;align-items:flex-end;gap:18px;flex-wrap:wrap}}
.taille{{display:flex;flex-direction:column;align-items:center;gap:6px}}
.t-img svg{{width:var(--t);height:var(--t);display:block}}
.t-n{{font-size:12.5px;color:var(--gris);font-variant-numeric:tabular-nums}}
.onglet{{display:flex;align-items:center;gap:8px;align-self:flex-start;max-width:100%;padding:8px 14px;border-radius:10px 10px 0 0;background:var(--blanc);box-shadow:0 -1px 0 var(--filet);font-size:13px;color:var(--encre);white-space:nowrap;overflow:hidden}}
.o-fav svg{{width:16px;height:16px;display:block}}
.mono svg,.avatar svg{{width:64px;height:64px;display:block}}
.avatar{{align-self:flex-start;display:grid;place-items:center;width:84px;height:84px;border-radius:12px;background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}
.textes{{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px;padding-top:4px}}
.textes h3{{font-size:16px;font-weight:800;padding-bottom:6px;margin-bottom:6px;border-bottom:2px solid var(--anis)}}
.textes p{{font-size:15.5px}}
.suite{{padding:22px;border-radius:22px;background:var(--vert-clair);color:var(--encre)}}
.suite h2{{font-size:21px;font-weight:800;margin-bottom:8px}}
.suite ul{{margin:0;padding-left:1.2em;display:flex;flex-direction:column;gap:6px}}
@media (max-width:900px){{.petits{{grid-template-columns:repeat(2,minmax(0,1fr))}}.textes{{grid-template-columns:repeat(2,minmax(0,1fr))}}.actuel{{grid-template-columns:minmax(0,1fr)}}}}
@media (max-width:700px){{.st-onglets{{display:none}}}}
@media (max-width:560px){{.variante{{grid-template-columns:minmax(0,1fr)}}.var-sym{{display:none}}.vues,.textes{{grid-template-columns:minmax(0,1fr)}}.prop-tete h2{{font-size:21px}}.num{{width:40px;height:40px;font-size:20px}}.st-btn{{padding:6px 14px;font-size:15px}}}}
</style>
<main class="page">
  <header class="titre">
    <h1>Propositions de logo</h1>
    <p>Vous avez écrit{NB}: <span class="citation">«{FINE}les deux ronds ressemblent à Mastercard{FINE}»</span>, et demandé des logos un peu moins simples et plus impactants. Voici {len(CLES)} pistes. Toutes gardent les couleurs du SLBC et la police Nunito{FINE}; seul le symbole change. Le site n’est pas modifié.</p>
  </header>
  <section class="actuel" aria-labelledby="t-actuel">
    <div>{svg("actuel", "logo-slbc.svg", "lockup")}</div>
    <div><h2 id="t-actuel">Le logo d’aujourd’hui</h2>
    <p>Deux ronds qui se chevauchent, le gris et le vert anis, la zone commune en vert foncé.</p>
    <ul><li>Ce qui reste dans toutes les pistes{NB}: le vert anis de l’ancien logo, le gris, le vert foncé, le nom en Nunito très gras et la signature sur deux lignes.</li>
    <li>Ce qui change{NB}: le symbole, pour qu’il ait plus de caractère et qu’on ne pense plus à une carte bancaire.</li></ul></div>
  </section>
  <nav aria-label="Les {len(CLES)} propositions, à côté du logo d’aujourd’hui"><div class="apercus">{apercu}</div></nav>
  {"".join(props)}
  <section class="suite" aria-labelledby="t-suite">
    <h2 id="t-suite">Et ensuite</h2>
    <ul>
      <li>Dites-moi la ou les propositions qui vous plaisent, et ce qu’il faudrait changer.</li>
      <li>Le logo choisi remplacera les deux ronds partout{NB}: en-tête, pied de page, petites signatures animées au-dessus des titres, séparateurs entre les rubriques, charte graphique.</li>
      <li>Avant de l’adopter, faire vérifier par un graphiste ou un conseil en propriété industrielle qu’il ne ressemble pas à une marque déjà déposée, puis le faire valider par le bureau.</li>
    </ul>
  </section>
</main>
'''
open(OUT, 'w', encoding='utf-8').write(page)
print('ok :', OUT, len(CLES), 'propositions,', compteur[0], 'dessins')
