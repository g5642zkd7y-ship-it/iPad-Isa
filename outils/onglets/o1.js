// Proposition 1 « Trait au marqueur » (planche des onglets du menu et des sous-onglets du syndicat, 11 novembre 2026).
// L'onglet ouvert (menu principal et menu compact du téléphone) et la rubrique en cours du sous-menu sont soulignés d'un trait
// tracé à la main, comme la tige des petites flèches des liens « Lire… » : un trait vert foncé au marqueur, un peu penché, aux bouts
// arrondis, avec son double vert anis décalé en bas à droite (comme les pastilles et les grosses flèches). Au survol, un trait vert
// clair, plus léger (aussi au focus clavier). Le sous-menu du syndicat (et celui des Informations légales) passe sur une bande fond clair à filet fin.
// Le dessin est un vrai SVG dans le lien (pas de masque CSS sur un élément en ligne), étiré à la largeur du mot ; l'épaisseur du
// trait ne change pas (vector-effect: non-scaling-stroke).
const css = `
/* Le dessin, commun à tous les menus */
.gnav-links a,.gnav-member,.lnav-links a[data-section]{position:relative!important}
.o1-mot{position:relative;display:inline-block}
.o1-trait{position:absolute;display:block;max-width:none!important;height:10px;overflow:visible;pointer-events:none;
  clip-path:inset(-8px 100% -8px -8px)}
.o1-trait path{fill:none;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}
.o1-survol{stroke:#D6E4A6;stroke-width:6px;opacity:0}
.o1-double{stroke:#A3BE3C;stroke-width:6px;opacity:0}
.o1-marqueur{stroke:#5F7A2B;stroke-width:1.8px;opacity:0}
/* Survol à la souris (et focus clavier) : un trait vert clair, plus léger, sans le trait au marqueur.
   Survol seulement là où il existe vraiment (souris, pavé tactile) : sur un écran tactile, le survol reste « collé » au lien touché
   et laisserait un second trait sous une rubrique qui n'est plus celle en cours de lecture. */
@media (hover:hover){
  a:not([aria-current]):hover .o1-trait{clip-path:inset(-8px -8px -8px -8px)}
  a:not([aria-current]):hover .o1-survol{opacity:1}
}
a:not([aria-current]):focus-visible .o1-trait{clip-path:inset(-8px -8px -8px -8px)}
a:not([aria-current]):focus-visible .o1-survol{opacity:1}
/* Onglet ouvert, rubrique en cours : le trait au marqueur et son double vert anis */
a[aria-current] .o1-trait{clip-path:inset(-8px -8px -8px -8px)}
a[aria-current] .o1-double,a[aria-current] .o1-marqueur{opacity:1}
@media (prefers-reduced-motion:no-preference){
  a[aria-current] .o1-trait{transition:clip-path .45s cubic-bezier(.16,1,.3,1)}
  a:not([aria-current]):focus-visible .o1-trait{transition:clip-path .3s cubic-bezier(.16,1,.3,1)}
}
@media (prefers-reduced-motion:no-preference) and (hover:hover){
  a:not([aria-current]):hover .o1-trait{transition:clip-path .3s cubic-bezier(.16,1,.3,1)}
}
@media (forced-colors:active){.o1-double,.o1-survol{display:none}.o1-marqueur{stroke:CanvasText}}

/* Menu principal : nom de l'onglet ouvert en vert foncé, trait sous le mot */
.gnav-links a[aria-current="page"],.gnav-member[aria-current="page"]{color:#5F7A2B!important}
.gnav-links a:not([aria-current]):hover,.gnav-member:not([aria-current]):hover{color:#2E3236!important}
.gnav-links a > .o1-trait,.gnav-member > .o1-trait{left:0;width:calc(100% + 2px);top:calc(50% + 10px)}
.gnav-member > .o1-trait{left:10px;width:calc(100% - 18px)}

/* Menu compact du téléphone : même trait, plus large, sous le nom de la page ouverte */
.mmenu-link[aria-current="page"]{color:#5F7A2B!important}
.mmenu-link .o1-trait{left:-2px;width:calc(100% + 8px);top:calc(100% - 3px);height:12px}
.mmenu-link .o1-double,.mmenu-link .o1-survol{stroke-width:7px}
.mmenu-link .o1-marqueur{stroke-width:2.2px}

/* Sous-menu des pages (Le syndicat, Informations légales) : bande fond clair, filet fin */
.lnav{background:#F7F8F4!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;
  border-bottom:1px solid var(--filet-fort,#CFD2CB)!important}
.lnav-links a[data-section]{color:#2E3236!important}
.lnav-links a[data-section]:not([aria-current]):hover{color:#2E3236!important}
.lnav-links a[data-section][aria-current]{color:#5F7A2B!important;box-shadow:none!important}
.lnav-links a[data-section] > .o1-trait{left:6px;width:calc(100% - 10px);top:calc(50% + 11px)}
@media (max-width:640px){.lnav-links a[data-section] > .o1-trait{left:4px;width:calc(100% - 6px)}}
`;
const script = `(function(){
  var SVG = '<svg class="o1-trait" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true" focusable="false" fill="none">' +
    '<path class="o1-survol" vector-effect="non-scaling-stroke" d="M2.5 7.6 Q37.5 3.8 98.5 5.2"/>' +
    '<path class="o1-double" vector-effect="non-scaling-stroke" d="M4 8.6 Q39 4.8 99.5 6.2"/>' +
    '<path class="o1-marqueur" vector-effect="non-scaling-stroke" d="M1 6.2 Q36 2.4 96 3.8"/></svg>';
  document.querySelectorAll('.gnav-links a, .gnav-member, .lnav-links a[data-section]').forEach(function(a){
    if (!a.querySelector('.o1-trait')) a.insertAdjacentHTML('beforeend', SVG);
  });
  document.querySelectorAll('.mmenu-link').forEach(function(a){
    if (a.querySelector('.o1-mot')) return;
    var s = document.createElement('span'); s.className = 'o1-mot';
    while (a.firstChild) s.appendChild(a.firstChild);
    s.insertAdjacentHTML('beforeend', SVG); a.appendChild(s);
  });
})();`;
module.exports = { css, script };
