"""Présentation « Logo du SLBM » : les pistes de l'agence, chacune en grand, en petit et en situation.
Demande d'Isabelle Eimer (26 novembre 2026) : « Je viens te voir au nom du SLBM et je te demande de logoter ce syndicat.
Ce qui est important pour ce syndicat, c'est l'image de la défense de la profession, que l'union fait la force, au-delà de la
défense de la biologie médicale. Mais effectivement ce syndicat défend en même temps la santé des Français. »
Chaque piste est dans <dossier>/<clé>/ : symbole.svg, symbole-sombre.svg, symbole-mono.svg, logo-slbm.svg,
logo-slbm-sombre.svg, logo-slbm-vertical.svg, description.json (titre, idee, seconde_lecture, defense, union, sante,
couleurs, palette [{nom, hex, role}], fond_sombre, couleur_action, animation, a_verifier).
Compléments du brief (27 novembre 2026) : « On travaille sur le SLBM et les couleurs », six propositions ; la porteuse du projet
trouve le logo actuel « hyper pertinent car simple et impactant, et il signifie quelque chose », ses collaborateurs le trouvent
trop proche de Mastercard.
Le logo actuel au nom SLBM est dans <dossier>/ref/ (symbole-actuel.svg, logo-slbm-actuel.svg).
Facultatif : <dossier>/presentation.json {"recommandation": "...", "etat": ["...", ...]} (textes écrits par nous).
usage : python3 gen_presentation_logo.py <dossier> <sortie.html> <clé1> <clé2> ..."""
import html, json, os, re, sys

DOS, OUT, CLES = sys.argv[1], sys.argv[2], sys.argv[3:]
NB, FINE = ' ', ' '
PRES = json.load(open(f'{DOS}/presentation.json', encoding='utf-8')) if os.path.exists(f'{DOS}/presentation.json') else {}
n_svg = [0]


def svg(chemin, cls=''):
    """SVG en ligne, id rendus uniques, caché aux lecteurs d'écran (le texte voisin dit ce qu'il montre)."""
    t = open(f'{DOS}/{chemin}', encoding='utf-8').read()
    t = re.sub(r'<\?xml[^>]*\?>', '', t).strip()
    n_svg[0] += 1
    suf = f'-u{n_svg[0]}'
    for i in set(re.findall(r'\bid="([^"]+)"', t)):
        t = t.replace(f'id="{i}"', f'id="{i}{suf}"').replace(f'url(#{i})', f'url(#{i}{suf})').replace(f'href="#{i}"', f'href="#{i}{suf}"')
    t = re.sub(r'\s(role|aria-label|aria-labelledby)="[^"]*"', '', t)
    return t.replace('<svg', f'<svg aria-hidden="true" focusable="false"{f" class={chr(34)}{cls}{chr(34)}" if cls else ""}', 1)


def e(s):
    return html.escape(s, quote=False)


def situations(c):
    """Le logo comme le bureau le verrait : site, lettre, carte de visite, badge, réseaux sociaux, onglet."""
    return f'''<div class="situ">
  <figure class="s-site"><div class="site-tete" aria-hidden="true"><span class="st-logo">{svg(f"{c}/symbole.svg", "st-mark")}<span class="st-mot">SLBM</span></span>
    <span class="st-onglets"><span class="st-on">Accueil</span><span>Le syndicat</span><span>Veille</span><span>Presse</span></span><span class="st-btn">Adhérer</span></div>
    <figcaption>Le site</figcaption></figure>
  <figure class="s-lettre"><div class="lettre" aria-hidden="true">{svg(f"{c}/logo-slbm.svg", "l-logo")}<span class="l-adr">6 place de la Madeleine{NB}· 75008 Paris</span>
    <span class="l-ligne l1"></span><span class="l-ligne"></span><span class="l-ligne"></span><span class="l-ligne l4"></span><span class="l-ligne"></span><span class="l-ligne l6"></span></div>
    <figcaption>Le papier à en-tête</figcaption></figure>
  <figure class="s-carte"><div class="carte" aria-hidden="true">{svg(f"{c}/symbole.svg", "c-sym")}<span class="c-nom">Prénom Nom</span><span class="c-fn">Fonction au bureau</span><span class="c-pied">SLBM{NB}· Syndicat des Laboratoires de Biologie Médicale</span></div>
    <figcaption>La carte de visite</figcaption></figure>
  <figure class="s-badge"><div class="badge" aria-hidden="true"><span class="b-tete">{svg(f"{c}/symbole-sombre.svg", "b-sym")}</span><span class="b-nom">Prénom Nom</span><span class="b-fn">Biologiste médical</span><span class="b-pied">SLBM</span></div>
    <figcaption>Le badge de congrès</figcaption></figure>
  <figure class="s-reseau"><div class="reseau" aria-hidden="true"><span class="r-bandeau"></span><span class="r-av">{svg(f"{c}/symbole.svg")}</span><span class="r-nom">SLBM{NB}– Syndicat des Laboratoires de Biologie Médicale</span><span class="r-txt">Syndicat professionnel{NB}· Paris</span></div>
    <figcaption>Les réseaux sociaux</figcaption></figure>
  <figure class="s-petit"><div class="petit" aria-hidden="true">
    <span class="tailles">{"".join(f'<span class="taille"><span class="t-img" style="--t:{px}px">{svg(f"{c}/symbole.svg")}</span><span class="t-n">{px}{NB}px</span></span>' for px in (64, 32, 16))}</span>
    <span class="onglet"><span class="o-fav">{svg(f"{c}/symbole.svg")}</span>SLBM{NB}– Accueil</span>
    <span class="mono">{svg(f"{c}/symbole-mono.svg")}<span class="t-n">En une couleur</span></span></div>
    <figcaption>En petit et en une couleur</figcaption></figure>
</div>'''


HEX = re.compile(r'^#[0-9A-Fa-f]{6}$')


def couleur(d, champ, defaut):
    v = d.get(champ, '')
    return v if HEX.match(v or '') else defaut


def nuancier(d):
    """Les couleurs de la piste : pastilles, nom, code et rôle."""
    pal = [x for x in d.get('palette', []) if HEX.match(x.get('hex', ''))]
    if not pal:
        return ''
    cases = ''.join(f'<li><span class="pastille" style="background:{x["hex"]}"></span><span class="pal-n">{e(x.get("nom", ""))}</span><span class="pal-h">{x["hex"].upper()}{(" · " + e(x["role"])) if x.get("role") else ""}</span></li>' for x in pal)
    return f'<div class="couleurs"><h3>Les couleurs de la charte dans le signe</h3><ul class="nuancier">{cases}</ul><p>{e(d.get("couleurs", ""))}</p></div>'


def piste(n, c):
    d = json.load(open(f'{DOS}/{c}/description.json', encoding='utf-8'))
    sombre, action = couleur(d, 'fond_sombre', '#657B3D'), couleur(d, 'couleur_action', '#5F7A2B')
    seconde = f'<p class="seconde"><strong>En regardant mieux{NB}:</strong> {e(d["seconde_lecture"])}</p>' if d.get('seconde_lecture') else ''
    return f'''<section class="piste" id="piste-{n}" aria-labelledby="t{n}" style="--p-sombre:{sombre};--p-action:{action}">
  <header class="p-tete"><span class="num" aria-hidden="true">{n}</span><div><h2 id="t{n}"><span class="lu">Piste {n}{NB}: </span>{e(d["titre"])}</h2><p class="idee">{e(d["idee"])}</p>{seconde}</div></header>
  <div class="vues">
    <figure class="vue v-blanc">{svg(f"{c}/logo-slbm.svg", "lockup")}<figcaption>Sur fond blanc</figcaption></figure>
    <figure class="vue v-olive">{svg(f"{c}/logo-slbm-sombre.svg", "lockup")}<figcaption>Sur le vert du site</figcaption></figure>
    <figure class="vue v-vert">{svg(f"{c}/logo-slbm-vertical.svg", "lockup-v")}<figcaption>En hauteur</figcaption></figure>
  </div>
  <div class="dit">
    <div><h3>La défense de la profession</h3><p>{e(d["defense"])}</p></div>
    <div><h3>L’union fait la force</h3><p>{e(d["union"])}</p></div>
    <div><h3>La santé des Français</h3><p>{e(d["sante"])}</p></div>
  </div>
  {nuancier(d)}
  {situations(c)}
  <div class="bas">
    <p><strong>L’animation sur le site{NB}:</strong> {e(d["animation"])}</p>
    <p><strong>À vérifier{NB}:</strong> {e(d["a_verifier"])}</p>
  </div>
</section>'''


titres = [json.load(open(f'{DOS}/{c}/description.json', encoding='utf-8'))['titre'] for c in CLES]
apercu = (f'<div class="ap ap-actuel"><span class="ap-img">{svg("ref/symbole-actuel.svg")}</span><span class="ap-n">Aujourd’hui</span></div>'
          + ''.join(f'<a class="ap" href="#piste-{i + 1}"><span class="ap-img">{svg(f"{c}/symbole.svg")}</span><span class="ap-n">{i + 1}. {e(t)}</span></a>' for i, (c, t) in enumerate(zip(CLES, titres))))
reco = f'''<section class="reco" aria-labelledby="t-reco"><h2 id="t-reco">Notre recommandation</h2><p>{e(PRES["recommandation"])}</p></section>''' if PRES.get('recommandation') else ''
etat = f'''<section class="etat" aria-labelledby="t-etat"><h2 id="t-etat">Ce que nous avons regardé avant de dessiner</h2><ul>{"".join(f"<li>{e(x)}</li>" for x in PRES["etat"])}</ul></section>''' if PRES.get('etat') else ''

page = f'''<title>Logo du SLBM</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Présentation d'agence : le brief, puis chaque piste en grand, ce qu'elle dit du brief, et en situation (site, lettre,
   carte de visite, badge, réseaux sociaux, petites tailles). Couleurs et police du syndicat, thème clair seulement. */
:root{{
  --anis:#A3BE3C; --vert:#5F7A2B; --vert-clair:#D6E4A6; --gris:#5E6266; --texte:#3F4347; --encre:#2E3236;
  --olive:#657B3D; --fond:#F7F8F4; --blanc:#FFFFFF; --filet:#E3E6DD; --papier:#EEF0EA;
  --font:"Nunito",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
  color-scheme:light;
}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--fond);color:var(--texte);font:400 16px/1.55 var(--font);-webkit-font-smoothing:antialiased}}
.page{{max-width:1180px;margin:0 auto;padding-block:clamp(20px,4vw,48px) 64px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:30px}}
h1,h2,h3{{color:var(--encre);margin:0;text-wrap:balance}}
p,figure,ul{{margin:0}}
a{{color:var(--vert)}}
a:focus-visible{{outline:3px solid var(--vert);outline-offset:3px;border-radius:8px}}
.lu{{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}}
.titre{{display:flex;flex-direction:column;gap:8px}}
.surtitre{{font-size:14px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--vert)}}
.titre h1{{font-size:clamp(32px,4.8vw,46px);line-height:1.08;font-weight:900;letter-spacing:-.02em}}
.brief{{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:28px;padding:clamp(20px,3vw,32px);border-radius:24px;background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}
.brief h2{{font-size:15px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--gris);margin-bottom:10px}}
.brief blockquote{{margin:0;font-size:clamp(18px,2vw,21px);line-height:1.5;color:var(--encre);font-weight:600;padding-left:18px;border-left:4px solid var(--anis)}}
.complement{{margin-top:16px;font-size:15.5px;color:var(--texte)}}
.brief .qui{{display:block;margin-top:10px;font-size:15px;font-weight:600;color:var(--gris)}}
.lecture{{display:flex;flex-direction:column;gap:12px}}
.lecture li{{list-style:none;display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;align-items:baseline}}
.lecture ul{{padding:0;display:flex;flex-direction:column;gap:12px}}
.lecture b{{display:inline-grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--vert-clair);color:var(--encre);font-weight:900;font-size:15px}}
.lecture strong{{color:var(--encre)}}
.lecture .note{{font-size:15px;color:var(--gris)}}
.etat,.reco{{padding:22px clamp(18px,3vw,28px);border-radius:20px}}
.etat{{background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}
.etat h2,.reco h2{{font-size:20px;font-weight:800;margin-bottom:8px}}
.etat ul{{padding-left:1.2em;display:flex;flex-direction:column;gap:6px}}
.reco{{background:var(--olive);color:var(--blanc)}}
.reco h2{{color:var(--blanc)}}
.reco p{{font-size:18px;max-width:60em}}
.apercus{{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}}
.ap{{display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 10px 14px;border-radius:16px;background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet);text-decoration:none;color:var(--encre);font-weight:700;font-size:15px;text-align:center;line-height:1.3}}
a.ap:hover{{box-shadow:inset 0 0 0 2px var(--vert)}}
.ap-actuel{{background:transparent;color:var(--gris)}}
.ap-img svg{{width:84px;height:84px;display:block}}
.piste{{display:flex;flex-direction:column;gap:20px;padding:clamp(16px,2.6vw,28px);border-radius:26px;background:var(--blanc);box-shadow:0 1px 2px rgba(46,50,54,.06);scroll-margin-top:16px}}
.p-tete{{display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:start}}
.num{{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:var(--vert-clair);color:var(--encre);font-weight:900;font-size:24px}}
.p-tete h2{{font-size:26px;font-weight:900;line-height:1.15}}
.idee{{font-size:17px;margin-top:4px;max-width:54em}}
.vues{{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1.25fr) minmax(0,.8fr);gap:12px}}
.vue{{display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center;padding:clamp(20px,3.2vw,38px) 16px 14px;border-radius:18px;min-width:0}}
.vue figcaption{{font-size:13.5px;font-weight:700;letter-spacing:.03em;align-self:flex-start;margin-top:auto}}
.v-blanc,.v-vert{{background:var(--blanc);box-shadow:inset 0 0 0 1px var(--filet)}}
.v-blanc figcaption,.v-vert figcaption{{color:var(--gris)}}
.v-olive{{background:var(--p-sombre,var(--olive))}}
.v-olive figcaption{{color:var(--blanc)}}
.lockup{{width:100%;max-width:380px;height:auto;display:block}}
.lockup-v{{width:100%;max-width:200px;height:auto;display:block}}
.seconde{{font-size:15.5px;margin-top:6px;color:var(--gris)}}
.seconde strong{{color:var(--encre)}}
.couleurs{{display:grid;grid-template-columns:auto minmax(0,1fr);gap:8px 22px;align-items:center;padding:14px 16px;border-radius:16px;box-shadow:inset 0 0 0 1px var(--filet)}}
.couleurs h3{{font-size:16px;font-weight:800;grid-column:1 / -1}}
.couleurs p{{font-size:15.5px}}
.nuancier{{display:flex;flex-wrap:wrap;gap:12px 18px;padding:0;list-style:none}}
.nuancier li{{display:grid;grid-template-columns:auto auto;grid-template-rows:auto auto;column-gap:8px;align-items:center}}
.pastille{{grid-row:span 2;width:34px;height:34px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(46,50,54,.15)}}
.pal-n{{font-size:14px;font-weight:700;color:var(--encre);line-height:1.2}}
.pal-h{{font-size:12px;color:var(--gris);font-variant-numeric:tabular-nums;line-height:1.2}}
.dit{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}}
.dit h3{{font-size:16px;font-weight:800;padding-bottom:6px;margin-bottom:6px;border-bottom:3px solid var(--anis)}}
.dit p{{font-size:15.5px}}
.situ{{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;padding:16px;border-radius:20px;background:var(--papier)}}
.situ figure{{display:flex;flex-direction:column;gap:8px;min-width:0}}
.situ figcaption{{font-size:13px;font-weight:700;color:var(--gris);letter-spacing:.02em}}
.s-site{{grid-column:1 / -1}}
.s-lettre{{grid-column:span 2;grid-row:span 2}}
.s-carte,.s-badge,.s-reseau,.s-petit{{grid-column:span 2}}
.site-tete{{display:flex;align-items:center;gap:22px;padding:12px 18px;border-radius:12px;background:var(--blanc);box-shadow:0 6px 16px -10px rgba(46,50,54,.25);overflow:hidden;min-width:0}}
.st-logo{{display:inline-flex;align-items:center;gap:10px;flex:none}}
.st-mark{{width:36px;height:36px;display:block}}
.st-mot{{font-weight:900;font-size:27px;line-height:1;letter-spacing:.02em;color:var(--texte)}}
.st-onglets{{display:flex;gap:22px;font-weight:700;font-size:17px;color:var(--encre);min-width:0;overflow:hidden;white-space:nowrap}}
.st-on{{color:var(--p-action,var(--vert))}}
.st-btn{{margin-left:auto;flex:none;background:var(--p-action,var(--vert));color:var(--blanc);font-weight:800;font-size:16px;padding:8px 18px;border-radius:999px}}
.lettre{{display:flex;flex-direction:column;gap:9px;aspect-ratio:210/297;max-width:100%;padding:9% 10%;background:var(--blanc);border-radius:4px;box-shadow:0 10px 24px -14px rgba(46,50,54,.45)}}
.l-logo{{width:58%;height:auto;display:block;margin-bottom:6%}}
.l-adr{{font-size:10px;font-weight:700;color:var(--gris);margin-bottom:10%}}
.l-ligne{{display:block;height:5px;border-radius:3px;background:var(--papier)}}
.l1{{width:40%;margin-bottom:6%}}.l4{{width:86%}}.l6{{width:55%}}
.carte{{position:relative;display:flex;flex-direction:column;justify-content:flex-end;gap:2px;aspect-ratio:85/55;padding:9% 9% 8%;background:var(--blanc);border-radius:6px;box-shadow:0 10px 22px -14px rgba(46,50,54,.45);overflow:hidden}}
.c-sym{{position:absolute;top:10%;left:9%;width:24%;height:auto}}
.c-nom{{font-weight:900;font-size:15px;color:var(--encre)}}
.c-fn{{font-size:12px;color:var(--gris);font-weight:600}}
.c-pied{{margin-top:6px;font-size:9.5px;font-weight:700;color:var(--vert)}}
.badge{{display:flex;flex-direction:column;align-items:center;gap:2px;max-width:200px;padding-bottom:12px;background:var(--blanc);border-radius:10px;overflow:hidden;box-shadow:0 10px 22px -14px rgba(46,50,54,.45);text-align:center}}
.b-tete{{display:grid;place-items:center;width:100%;padding:14px 0;background:var(--p-sombre,var(--olive));margin-bottom:10px}}
.b-sym{{width:54px;height:54px;display:block}}
.b-nom{{font-weight:900;font-size:16px;color:var(--encre)}}
.b-fn{{font-size:12.5px;color:var(--gris);font-weight:600}}
.b-pied{{margin-top:8px;font-weight:900;font-size:13px;letter-spacing:.06em;color:var(--vert)}}
.reseau{{display:flex;flex-direction:column;background:var(--blanc);border-radius:10px;overflow:hidden;box-shadow:0 10px 22px -14px rgba(46,50,54,.45);padding-bottom:12px}}
.r-bandeau{{height:46px;background:var(--vert-clair)}}
.r-av{{display:grid;place-items:center;width:64px;height:64px;margin:-30px 0 6px 14px;background:var(--blanc);border-radius:10px;box-shadow:0 0 0 3px var(--blanc),0 2px 8px rgba(46,50,54,.18)}}
.r-av svg{{width:50px;height:50px;display:block}}
.r-nom{{padding:0 14px;font-weight:800;font-size:13.5px;line-height:1.3;color:var(--encre)}}
.r-txt{{padding:2px 14px 0;font-size:12px;color:var(--gris)}}
.petit{{display:flex;flex-direction:column;gap:12px;padding:14px;background:var(--blanc);border-radius:10px}}
.tailles{{display:flex;align-items:flex-end;gap:16px;flex-wrap:wrap}}
.taille,.mono{{display:inline-flex;flex-direction:column;align-items:center;gap:5px}}
.t-img svg{{width:var(--t);height:var(--t);display:block}}
.t-n{{font-size:12px;color:var(--gris);font-variant-numeric:tabular-nums}}
.onglet{{display:inline-flex;align-items:center;gap:8px;align-self:flex-start;max-width:100%;padding:7px 12px;border-radius:9px 9px 0 0;background:var(--fond);box-shadow:0 -1px 0 var(--filet);font-size:12.5px;color:var(--encre);white-space:nowrap;overflow:hidden}}
.o-fav svg{{width:16px;height:16px;display:block}}
.mono{{flex-direction:row;gap:10px;align-items:center}}
.mono svg{{width:40px;height:40px;display:block}}
.bas{{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;font-size:15.5px}}
.bas strong{{color:var(--encre)}}
.suite{{padding:22px clamp(18px,3vw,28px);border-radius:20px;background:var(--vert-clair);color:var(--encre)}}
.suite h2{{font-size:20px;font-weight:800;margin-bottom:8px}}
.suite ul{{padding-left:1.2em;display:flex;flex-direction:column;gap:6px}}
@media (max-width:980px){{.vues{{grid-template-columns:repeat(2,minmax(0,1fr))}}.v-vert{{grid-column:1 / -1}}.situ{{grid-template-columns:repeat(4,minmax(0,1fr))}}.s-lettre{{grid-row:auto}}.brief{{grid-template-columns:minmax(0,1fr)}}}}
@media (max-width:700px){{.couleurs{{grid-template-columns:minmax(0,1fr)}}.st-onglets{{display:none}}.dit,.bas{{grid-template-columns:minmax(0,1fr)}}.situ{{grid-template-columns:repeat(2,minmax(0,1fr))}}.s-lettre,.s-carte,.s-badge,.s-reseau,.s-petit{{grid-column:span 1}}.s-petit{{grid-column:1 / -1}}}}
@media (max-width:560px){{.vues{{grid-template-columns:minmax(0,1fr)}}.p-tete h2{{font-size:22px}}.num{{width:40px;height:40px;font-size:20px}}.st-btn{{padding:6px 14px;font-size:15px}}.situ{{padding:12px;gap:14px}}.s-lettre,.s-carte,.s-badge,.s-reseau{{grid-column:1 / -1}}.lettre{{max-width:260px}}.carte{{max-width:320px}}}}
</style>
<main class="page">
  <header class="titre">
    <p class="surtitre">Proposition de l’agence</p>
    <h1>Logo du SLBM</h1>
  </header>
  <section class="brief" aria-labelledby="t-brief">
    <div><h2 id="t-brief">Votre brief</h2>
      <blockquote>«{FINE}Ce qui est important pour ce syndicat, c’est l’image de la défense de la profession, que l’union fait la force, au-delà de la défense de la biologie médicale. Mais effectivement ce syndicat défend en même temps la santé des Français.{FINE}»<span class="qui">Isabelle Eimer, pour le SLBM</span></blockquote>
      <p class="complement">Vous nous avez aussi dit{NB}: on travaille sur le nom SLBM{FINE}; on garde les couleurs de la charte{FINE}; le logo doit rester simple{FINE}; vous voulez six propositions. Vous trouvez le logo actuel «{FINE}hyper pertinent car simple et impactant, et il signifie quelque chose{FINE}»{FINE}; vos collaborateurs le trouvent trop proche de Mastercard.</p></div>
    <div class="lecture"><h2>Ce que le logo doit dire</h2>
      <ul><li><b aria-hidden="true">1</b><span><strong>La défense de la profession.</strong> Un syndicat qui protège et qui se bat.</span></li>
      <li><b aria-hidden="true">2</b><span><strong>L’union fait la force.</strong> Des laboratoires de partout, ensemble.</span></li>
      <li><b aria-hidden="true">3</b><span><strong>La santé des Français.</strong> Ce que la profession défend, au-delà d’elle-même.</span></li></ul>
      <p class="note">Et comme le logo actuel{NB}: simple, fort, et qui signifie quelque chose. Les six pistes gardent les couleurs de la charte et restent aussi simples que le logo actuel{NB}: quatre formes au plus, un dessin qu’on refait de mémoire. Toutes ont été vérifiées en tout petit, en une couleur et sur le vert du site.</p></div>
  </section>
  {etat}
  <nav aria-label="Les {len(CLES)} pistes, à côté du logo d’aujourd’hui"><div class="apercus">{apercu}</div></nav>
  {"".join(piste(i + 1, c) for i, c in enumerate(CLES))}
  {reco}
  <section class="suite" aria-labelledby="t-suite">
    <h2 id="t-suite">Et ensuite</h2>
    <ul>
      <li>Vous choisissez une piste, ou deux à pousser plus loin, et vous nous dites ce qu’il faut changer.</li>
      <li>Nous affinons la piste retenue, puis nous l’essayons sur le site complet{NB}: en-tête, pied de page, animations des pages.</li>
      <li>Avant toute adoption{NB}: recherche d’antériorité de marque par un conseil en propriété industrielle, puis validation par le bureau.</li>
    </ul>
  </section>
</main>
'''
open(OUT, 'w', encoding='utf-8').write(page)
print('ok :', OUT, len(CLES), 'pistes,', n_svg[0], 'dessins')
