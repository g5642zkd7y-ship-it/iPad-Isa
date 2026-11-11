// Proposition 3 « Signature du logo » (planche des onglets du menu et des sous-onglets du syndicat, 11 novembre 2026).
// Devant le nom de l'onglet ouvert, en petit, les deux ronds du logo qui se chevauchent (gris en haut à gauche, vert anis en bas
// à droite, zone commune vert foncé, couleurs écrites en attributs fill) ; le nom reste en vert foncé. Au survol (et au focus
// clavier), seul le rond gris apparaît : la moitié du logo ; à l'ouverture, le rond vert vient le rejoindre, comme la signature
// au-dessus du titre de chaque page (court glissement, absent si le visiteur a demandé moins d'animations).
// Les ronds se placent dans l'espace qui précède le nom : les noms ne bougent pas quand on change de page.
// Menu compact (téléphone, tablette en vertical) : les mêmes ronds, en plus grand, dans une marge à gauche des noms.
// Sous-onglets (Le syndicat, Informations légales) : une bande fond clair, les rubriques séparées par de fins filets verticaux,
// les deux ronds devant la rubrique en cours de lecture.
const css = `
/* ---------- Le petit logo : commun à tous les menus ---------- */
.gnav-links a,.gnav-member,.mmenu-link,.lnav-links a[data-section]{position:relative!important}
.o3-mark{position:absolute;left:0;top:50%;display:block;max-width:none!important;overflow:visible;pointer-events:none}
.o3-mark .o3-gris{opacity:0}
.o3-mark .o3-vert{opacity:0;transform:translateX(34px)}
a[aria-current] > .o3-mark .o3-gris,a[aria-current] > .o3-mark .o3-vert{opacity:1;transform:none}
/* Survol (souris) et focus clavier : le rond gris seul */
@media (hover:hover){a:not([aria-current]):hover > .o3-mark .o3-gris{opacity:1}}
a:not([aria-current]):focus-visible > .o3-mark .o3-gris{opacity:1}
@media (prefers-reduced-motion:no-preference){
  .o3-mark .o3-gris{transition:opacity .2s ease}
  .o3-mark .o3-vert{transition:transform .55s cubic-bezier(.16,1,.3,1),opacity .2s ease}
}
@media (forced-colors:active){.o3-mark circle{fill:CanvasText}}

/* ---------- Menu principal (au-dessus de 1100 px) ----------
   Le fond de l'en-tête devient presque opaque : le nom en vert foncé garde 4,6:1 même au-dessus des zones grises ou vertes. */
.gnav{background:rgba(255,255,255,.96)!important}
.gnav-in{gap:16px!important}
/* Ronds de 14 px, à 5 px du nom ; 10 px d'air avant eux (18 px après le logo), plus que l'écart qui les sépare du nom qu'ils désignent */
.gnav-links{gap:29px!important;padding-left:21px!important}
.gnav-links a{padding-left:19px!important;margin-left:-19px!important}
/* Le lien ne prend plus toute la hauteur de l'en-tête : le cadre du focus clavier reste dans l'en-tête (cible de 45 px) */
.gnav-links a{line-height:1.3!important;padding-top:11px!important;padding-bottom:11px!important}
.gnav-links a:focus-visible,.gnav-member:focus-visible{outline-offset:1px!important}
.gnav-links a,.gnav-member{color:#2E3236!important}
.gnav-links a[aria-current="page"],.gnav-member[aria-current="page"]{color:#5F7A2B!important}
.gnav-links .o3-mark,.gnav-member .o3-mark{width:14px;height:14px;margin-top:-7px}
.gnav-member{padding-left:19px!important}
/* De 1101 à 1179 px (iPad mini à l'horizontale, petits ordinateurs), le menu complet n'a pas la place : noms en 17 px, ronds de 12 px */
@media (max-width:1179px){
  .gnav-links{gap:24px!important;padding-left:14px!important}
  .gnav-links a,.gnav-member{font-size:17px!important}
  .gnav-links a{padding-left:16px!important;margin-left:-16px!important}
  .gnav-member{padding-left:16px!important;padding-right:8px!important}
  .gnav-links .o3-mark,.gnav-member .o3-mark{width:12px;height:12px;margin-top:-6px}
}

/* ---------- Menu compact ----------
   Les noms s'alignent sur le mot « SLBC » de l'en-tête ; les ronds de la page ouverte, sous le logo. */
.mmenu-link{padding-left:40px!important}
.mmenu-link[aria-current="page"]{color:#5F7A2B!important}
.mmenu-link .o3-mark{width:22px;height:22px;margin-top:-11px;left:3px}
@media (min-width:421px){.mmenu-link{padding-left:46px!important}.mmenu-link .o3-mark{width:24px;height:24px;margin-top:-12px;left:3px}}
@media (max-width:340px){.mmenu-link{padding-left:36px!important}.mmenu-link .o3-mark{width:20px;height:20px;margin-top:-10px;left:2px}}

/* ---------- Sous-onglets : bande fond clair, filets fins, petit logo devant la rubrique en cours ---------- */
.lnav{background:#F7F8F4!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;border-bottom:1px solid #E3E5E0!important}
/* L'en-tête et la bande forment un seul bloc : la légère ombre du défilement passe sous la bande, pas sur elle */
html:has(.view:not([hidden]) > .lnav) .gnav.is-scrolled{box-shadow:none!important}
html:has(.gnav.is-scrolled) .lnav{box-shadow:0 6px 24px rgba(46,50,54,.07)!important}
.lnav-links{gap:0!important}
.lnav-links a[data-section]{padding:16px 30px!important;color:#2E3236!important;box-shadow:none!important}
.lnav-links a[data-section] + a[data-section]::before{content:"";position:absolute;left:0;top:50%;width:1px;height:20px;margin-top:-10px;background:#CFD2CB}
.lnav-links a[data-section] .o3-mark{left:11px;width:14px;height:14px;margin-top:-7px}
.lnav-links a[data-section][aria-current="true"]{color:#5F7A2B!important}
.lnav-links a[data-section]:hover{color:#2E3236!important}
.lnav-links a[data-section][aria-current="true"]:hover{color:#5F7A2B!important}
@media (max-width:640px){
  .lnav-links a[data-section]{padding:16px 26px!important}
  .lnav-links a[data-section] .o3-mark{left:10px;width:12px;height:12px;margin-top:-6px}
  /* Cales du début et de la fin : les ronds d'une rubrique en cours placée au bord restent hors du fondu de 24 px */
  .lnav-links::before,.lnav-links::after{flex-basis:calc(max(16px,env(safe-area-inset-left,0px)) - 2px)!important}
}
`;

const script = `
(function () {
  var n = document.querySelectorAll('.o3-mark').length;
  var mark = function () {
    n += 1;
    var id = 'o3c-' + n;
    return '<svg class="o3-mark" viewBox="8 8 104 104" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="' + id + '"><circle cx="44" cy="44" r="36"/></clipPath></defs>' +
      '<circle class="o3-gris" cx="44" cy="44" r="36" fill="#5E6266"/>' +
      '<g class="o3-vert"><circle cx="76" cy="76" r="36" fill="#A3BE3C"/></g>' +
      '<g clip-path="url(#' + id + ')"><g class="o3-vert"><circle cx="76" cy="76" r="36" fill="#5F7A2B"/></g></g>' +
      '</svg>';
  };
  document.querySelectorAll('.gnav-links a, .gnav-member, .mmenu-link, .lnav-links a[data-section]').forEach(function (a) {
    if (a.querySelector(':scope > .o3-mark')) return;
    a.insertAdjacentHTML('afterbegin', mark());
  });
})();
`;

module.exports = { css, script };
