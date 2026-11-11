// Partie commune de la proposition « Pages réservées aux adhérents » (11 novembre 2026) : haut de l'espace une fois connecté,
// quatre portes et barre « Publier sur le site », modèle de titre de rubrique. Les pages (veille, écrire, lettre, publier)
// ajoutent leurs propres styles par-dessus.
// Repères définis avec Isabelle Eimer : pastilles dessinées (rond blanc au marqueur sur le rond vert anis), pavés, trait au marqueur
// sous ce qui est ouvert, texte d'introduction écrit à la main (Kalam) sous le titre de la page, couleurs des portes gardées
// (gris Nardo éclairci, vert clair, vert anis, vert foncé), sobriété.
const css = `
/* Haut de l'espace : une phrase d'introduction écrite à la main, comme sur les autres pages */
.ea-bienvenue{margin:0 auto;max-width:32em;font-family:var(--font-main);font-weight:400;font-size:clamp(22px,2.1vw,25px);line-height:1.4;color:#fff;text-align:center}
/* Ligne « Connecté » : discrète, à droite, au-dessus des portes */
#member .member-head{display:flex;align-items:center;justify-content:flex-end;gap:16px;margin-bottom:18px}
#member .member-id{font-size:15.5px;color:var(--gris)}
#member .member-id #member-who{font-weight:700;color:var(--encre)}
#member #logout{min-height:40px;padding:0 16px;font-size:15px}
/* Portes en pavés : même couleurs, une pastille dessinée par porte, la porte ouverte soulignée du trait au marqueur */
.portes-menu .portes{gap:14px}
.portes-menu .porte{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:14px;row-gap:6px;align-items:start;padding:18px 18px 18px 14px;border-radius:16px}
.portes-menu .porte .ea-pastille{grid-row:1 / span 3;width:54px;height:auto;margin:-4px 0 0 -4px}
.portes-menu .porte .porte-t{grid-column:2;position:relative;align-self:end;font-size:18.5px;font-weight:800;letter-spacing:-.01em}
.portes-menu .porte .porte-d{grid-column:2;font-size:15px;line-height:1.45}
.portes-menu .porte .porte-cta{grid-column:2;margin-top:4px}
.portes-menu .porte.c0 .mnum-eclats,.portes-menu .porte.c3 .mnum-eclats{stroke:#fff}
/* Trait au marqueur sous le nom de la porte ouverte (couleurs selon le fond) */
.porte .ea-trait{position:absolute;left:-1px;right:-4px;top:100%;height:10px;margin-top:1px;display:block;overflow:visible;pointer-events:none}
.porte .ea-trait path{fill:none;stroke-linecap:round;vector-effect:non-scaling-stroke}
.porte .ea-trait .tm-survol{display:none}
.porte .ea-trait .tm-double,.porte .ea-trait .tm-marqueur{opacity:1}
.porte .ea-trait .tm-double{stroke:var(--anis);stroke-width:6px}
.porte .ea-trait .tm-marqueur{stroke:var(--vert);stroke-width:1.8px}
.porte.c0 .ea-trait .tm-marqueur,.porte.c3 .ea-trait .tm-marqueur{stroke:#fff}
.porte.c2 .ea-trait .tm-double{stroke:#fff}.porte.c2 .ea-trait .tm-marqueur{stroke:var(--encre)}
.porte.c3 .ea-trait .tm-double{stroke:var(--anis)}
.porte[aria-pressed="false"] .ea-trait{display:none}
.portes-menu .porte[aria-pressed="true"] .porte-t{margin-bottom:6px}
/* Barre « Publier sur le site » : pavé clair à pastille, outils du bureau (titre et description sur la même ligne, centrés) */
.portes-menu .porte-bureau{display:grid;grid-template-columns:44px auto minmax(0,1fr);grid-template-rows:auto;align-items:center;column-gap:14px;margin-top:14px;padding:12px 18px 12px 12px;border:1px solid var(--filet);border-left:1px solid var(--filet);border-top:1px solid var(--filet);border-radius:14px;background:var(--fond)}
.portes-menu .porte-bureau .ea-pastille{grid-column:1;grid-row:1;width:46px;height:auto;margin:-4px 0 -4px 0}
.portes-menu .porte-bureau .porte-t,.portes-menu .porte-bureau .porte-d{grid-row:1;align-self:center;margin:0!important}
.portes-menu .porte-bureau .porte-t{grid-column:2}.portes-menu .porte-bureau .porte-d{grid-column:3}
.portes-menu .porte-bureau .porte-t{font-size:17px}
.portes-menu .porte-bureau .porte-d{font-size:14.5px;color:var(--gris)}
.portes-menu .porte-bureau[aria-pressed="true"]{border-color:var(--vert);background:#fff}
/* Modèle de titre de rubrique : pastille, titre, filet épais de la couleur de la porte (comme les rubriques de la Documentation) */
.ea-h{display:flex;align-items:center;gap:16px;padding-top:20px;border-top:4px solid var(--ea-c,var(--vert));margin-bottom:24px}
.ea-h .ea-pastille{flex:none;width:60px;height:auto;margin:-6px 0 -6px -6px}
.ea-h h2{font-size:clamp(24px,2.3vw,30px);line-height:1.15;font-weight:800;letter-spacing:-.015em;color:var(--encre)}
.ea-h p{margin-top:4px;font-size:16px;line-height:1.5;color:var(--gris);max-width:46em;text-wrap:balance}
#ea-veille{--ea-c:var(--nardo)}#ea-ecrire{--ea-c:var(--vert-clair)}#ea-lettre{--ea-c:var(--vert)}#ea-publier{--ea-c:var(--vert)}
#member .ea-panel{margin-top:44px}

/* Repères communs aux quatre rubriques (mêmes rayons, mêmes cartes, mêmes pavés) */
#member{--ea-r-pave:14px;--ea-pad-carte:28px 32px 30px}
/* Sous-titres des rubriques : même taille partout */
#member .ea-panel .ea-sous-titre{font-size:21px!important;line-height:1.25!important;font-weight:800!important;letter-spacing:-.01em}
#member .ea-panel .ea-sous-titre:not(.h-block-blanc){color:var(--encre)}
/* Carte claire (fond clair, sans filet ni ombre) et carte blanche (filet fin) */
#member .ea-carte-claire{padding:var(--ea-pad-carte)!important;border:0!important;border-radius:var(--r-card)!important;background:var(--fond)!important;box-shadow:none!important}
#member .ea-carte-blanche{padding:var(--ea-pad-carte)!important;border:1px solid var(--filet-fort)!important;border-radius:var(--r-card)!important;background:#fff!important;box-shadow:none!important}
/* État vide : cadre en pointillés, sans dessin */
#member .ea-vide{display:block;margin:0;padding:18px 22px!important;border:1.5px dashed var(--filet-fort)!important;border-radius:var(--ea-r-pave)!important;background:#fff;color:var(--gris);font-size:16px;line-height:1.5}
/* Pavés de choix (sources de la veille, objet du message, type de publication) : nom en gras, précision en gris ;
   le pavé choisi prend une couleur pleine, comme les rubriques des Actualités. Le trait au marqueur reste réservé aux portes. */
#member .ea-pave-n{font-size:17px;line-height:1.25;font-weight:800;letter-spacing:-.01em}
#member .ea-pave-d{font-size:14.5px;line-height:1.3;font-weight:500;letter-spacing:0;color:var(--gris)}
`;
const script = `(function(){
  /* Dessins repris tels quels du site (pastilles déjà présentes dans la page) */
  function pastille(sel){ var s = document.querySelector(sel); if (!s) return ''; var c = s.cloneNode(true); c.classList.add('drawn','ea-pastille'); c.classList.remove('mnum-cat'); c.removeAttribute('style'); return c.outerHTML; }
  var P = window.EA_PASTILLES = window.EA_PASTILLES || {
    veille: pastille('#home-benefits li:nth-child(1) svg'),
    commission: pastille('#home-benefits li:nth-child(2) svg'),
    suggestion: pastille('#actu-seg .cat-pave[data-cat="Appels à projets"] svg'),
    lettre: pastille('#actu-seg .cat-pave[data-cat="Toutes"] svg'),
    voix: pastille('#home-benefits li:nth-child(3) svg'),
    bureau: pastille('#doc-fiches .doc-h svg')
  };
  /* Cadre des pastilles (rond blanc au marqueur sur le rond vert anis, traits de joie), pour un dessin qui n'existe pas encore sur le site */
  window.EA_CADRE = window.EA_CADRE || function(icone){ return '<svg class="mnum mnum-join drawn ea-pastille" viewBox="8 0 74 76" aria-hidden="true" focusable="false" fill="none" stroke="#2E3236" stroke-linecap="round" stroke-linejoin="round"><g class="perso"><circle class="mnum-anis" cx="50" cy="47" r="29" fill="#A3BE3C" stroke="none"/><path class="mnum-head" pathLength="1" d="M42 11 C59.5 10.5 71 23.5 71 40 C71 57.5 58.5 69.5 42 69.5 C25 69.5 13 57 13 40 C13 23.5 25.5 11.8 39.5 11.2" fill="#FFFFFF" stroke-width="2.8"/>' + icone + '<g class="mnum-eclats" stroke-width="2.6"><path d="M67 13 L72.5 7.5"/><path d="M71.5 21.5 L79 19.5"/><path d="M60.5 8 L62 2"/></g></g></svg>'; };
  var TRAIT = window.EA_TRAIT = window.EA_TRAIT || (function(){ var t = document.querySelector('.gnav-links .trait-marqueur'); if (!t) return ''; var c = t.cloneNode(true); c.setAttribute('class','ea-trait'); return c.outerHTML; })();
  var ORDRE = ['veille','commission','suggestion','lettre'];
  /* Chaque porte dit quelle rubrique elle ouvre (aria-controls) */
  var CIBLE = { '0': 'ea-veille', '1': 'ea-ecrire', '2': 'ea-ecrire', '3': 'ea-lettre', 'bureau': 'ea-publier' };
  function decorer(){
    document.querySelectorAll('#ea-tabs .porte').forEach(function(b){
      if (CIBLE[b.dataset.porte] && b.getAttribute('aria-controls') !== CIBLE[b.dataset.porte]) b.setAttribute('aria-controls', CIBLE[b.dataset.porte]);
      if (b.querySelector('.ea-pastille')) return;
      var k = b.dataset.porte === 'bureau' ? 'bureau' : ORDRE[+b.dataset.porte];
      b.insertAdjacentHTML('afterbegin', P[k] || '');
      var t = b.querySelector('.porte-t'); if (t && TRAIT) t.insertAdjacentHTML('beforeend', TRAIT);
    });
  }
  decorer();
  var tabs = document.getElementById('ea-tabs');
  if (tabs && !tabs.__eaObs) { tabs.__eaObs = new MutationObserver(decorer); tabs.__eaObs.observe(tabs, { childList: true, subtree: true }); }
  /* Phrase d'introduction, écrite à la main, sous le titre de l'espace une fois connecté */
  var hero = document.querySelector('.view[data-view="espace"] .page-hero .container');
  /* Seulement une fois connecté (data-member : le site l'affiche et le cache avec le reste de l'espace) */
  if (hero && !hero.querySelector('.ea-bienvenue')) {
    hero.insertAdjacentHTML('beforeend', '<p class="ea-bienvenue" data-member>La veille de la semaine, vos messages au bureau et la lettre d’information.</p>');
    hero.querySelector('.ea-bienvenue').hidden = !document.documentElement.classList.contains('is-member');
  }
  /* Titres de rubrique : utilitaire pour les pages (pastille + titre + phrase) */
  window.EA_TITRE = function(panel, cle, titre, phrase){
    var el = document.getElementById(panel); if (!el || el.querySelector(':scope > .ea-h')) return;
    el.insertAdjacentHTML('afterbegin', '<div class="ea-h">' + (P[cle] || '') + '<div><h2>' + titre + '</h2>' + (phrase ? '<p>' + phrase + '</p>' : '') + '</div></div>');
  };
})();`;
module.exports = { css, script };
