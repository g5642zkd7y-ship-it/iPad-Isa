// Proposition « Pages réservées aux adhérents » (11 novembre 2026) : rubrique « La veille réglementaire » (#ea-veille).
// Ajoutée après base.js. Titre de rubrique à la pastille aux jumelles ; sources de la synthèse en pavés (nombre de textes compté
// dans la page) ; liste en sommaire de journal (colonne de gauche : date en vert foncé, source, impact ; titre à droite) ;
// bouton d'ouverture dessiné au marqueur, avec son double vert anis quand le texte est ouvert ; textes suivis en frise
// aux points dessinés (étape franchie : point vert foncé et son double vert anis ; à venir : rond blanc, trait en pointillé) ;
// contrôle de couverture en note de bas de liste. Ordinateur seulement (1280 px) : téléphones et tablettes après le choix.

// Dessins au marqueur (même tracé que le rond blanc des pastilles du site, réduit) : bouton d'ouverture fermé, puis ouvert
// (double vert anis), point d'étape franchie, rond d'étape à venir.
const ROND = 'M42 11 C59.5 10.5 71 23.5 71 40 C71 57.5 58.5 69.5 42 69.5 C25 69.5 13 57 13 40 C13 23.5 25.5 11.8 39.5 11.2';
const svg = (s) => 'url("data:image/svg+xml,' + s.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'") + '")';
const BTN = (anis) => svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><g transform="translate(16 16) scale(.43) translate(-42 -40)">' +
  (anis ? '<circle cx="50" cy="47" r="29" fill="#A3BE3C"/>' : '') +
  '<path d="' + ROND + '" fill="#FFFFFF" stroke="#2E3236" stroke-width="4.4" stroke-linecap="round"/></g></svg>');
const POINT_FAIT = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22"><circle cx="12.4" cy="12.1" r="7.2" fill="#A3BE3C"/>' +
  '<g transform="translate(9.2 9) scale(.245) translate(-42 -40)"><path d="' + ROND + '" fill="#5F7A2B" stroke="#2E3236" stroke-width="6.4" stroke-linecap="round"/></g></svg>');
const POINT_AVENIR = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">' +
  '<g transform="translate(9.2 9) scale(.245) translate(-42 -40)"><path d="' + ROND + '" fill="#FFFFFF" stroke="#5E6266" stroke-width="6.8" stroke-linecap="round"/></g></svg>');

const css = `
/* ---------- Veille réglementaire (#ea-veille) ---------- */
#ea-veille .veille-layout{grid-template-columns:minmax(0,1fr) 310px !important;gap:52px !important}

/* Sous-titre de la synthèse (le titre de la rubrique est au-dessus, avec la pastille aux jumelles) */
#ea-veille .sec-head{display:block !important;margin-bottom:22px !important}
#ea-veille .ea-edition{margin:0 0 16px}

/* Sources en pavés, dans l'esprit des rubriques des Actualités (le pavé choisi prend le gris de la porte) */
#ea-veille #veille-seg.ea-vs{display:flex !important;flex-wrap:wrap;justify-content:flex-start;gap:10px;max-width:none;padding:0;border-radius:0;background:none}
#ea-veille #veille-seg.ea-vs button{flex:1 1 0;min-width:0;max-width:none;min-height:62px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:10px 18px 10px 16px;border:1px solid var(--filet);border-radius:var(--ea-r-pave);background:var(--fond);color:var(--encre);font:inherit;text-align:left;white-space:nowrap;box-shadow:none;transition:background-color .2s,border-color .2s}
#ea-veille #veille-seg.ea-vs button:first-child{flex-grow:.62}
#ea-veille .vs-nom{display:inline-flex;align-items:center;gap:9px}
#ea-veille .vs-nom .dot{width:10px;height:10px}
@media (hover:hover){#ea-veille #veille-seg.ea-vs button:not([aria-pressed="true"]):hover{background:#fff;border-color:var(--vert)}#ea-veille #veille-seg.ea-vs button:not([aria-pressed="true"]):hover .vs-nom{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}}
#ea-veille #veille-seg.ea-vs button[aria-pressed="true"]{background:var(--nardo);border-color:var(--nardo);color:#fff;font-weight:inherit}
#ea-veille #veille-seg.ea-vs button[aria-pressed="true"] .vs-n{color:#fff}
#ea-veille #veille-seg.ea-vs button[aria-pressed="true"] .dot{box-shadow:0 0 0 2px #fff}
#ea-veille #veille-seg.ea-vs button:focus-visible{outline:3px solid var(--vert);outline-offset:3px}
@media (forced-colors:active){#ea-veille #veille-seg.ea-vs button[aria-pressed="true"]{background:SelectedItem;color:SelectedItemText}#ea-veille #veille-seg.ea-vs button[aria-pressed="true"] .vs-n{color:SelectedItemText}}

/* Liste en sommaire : à gauche la date (vert foncé, gras), la source et l'impact ; à droite le titre */
#ea-veille .vlist{border-top:2px solid var(--encre) !important}
#ea-veille .vitem{border-bottom:1px solid var(--filet)}
#ea-veille .vitem summary{gap:24px !important;padding:22px 6px 22px 0 !important;border-radius:0}
#ea-veille .v-sum{display:grid !important;grid-template-columns:196px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:28px;row-gap:5px;flex:1 1 auto}
#ea-veille .v-top{display:contents !important}
#ea-veille .v-top > span:nth-child(2){grid-column:1;grid-row:1;font-size:14.5px;font-weight:800;line-height:1.35;color:var(--vert)}
#ea-veille .v-top .src{grid-column:1;grid-row:2;font-size:14px;font-weight:600;color:var(--gris);line-height:1.35}
#ea-veille .v-top .impact{grid-column:1;grid-row:3;justify-self:start;align-self:start;margin-top:6px;padding:2px 9px;font-size:13px;font-weight:700}
#ea-veille .impact-fort{background:var(--vert-clair);color:var(--encre)}
#ea-veille .impact-suivre{background:#fff;color:var(--encre);box-shadow:inset 0 0 0 1px var(--filet-fort)}
#ea-veille .impact-faible{background:transparent;color:var(--gris);box-shadow:none;padding-left:0 !important}
#ea-veille .v-title{grid-column:2;grid-row:1 / span 3;font-size:19.5px !important;line-height:1.35 !important}
@media (hover:hover){#ea-veille .vitem summary:hover .v-title{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px;text-decoration-color:var(--vert)}}
/* Bouton d'ouverture : rond blanc dessiné au marqueur ; ouvert, il prend son double vert anis et le plus devient un moins */
#ea-veille .v-plus{width:36px !important;height:36px !important;margin-top:-2px !important;border-radius:0 !important;background:${BTN(false)} center / 36px 36px no-repeat !important;transform:none !important;transition:none !important}
#ea-veille .v-plus::before,#ea-veille .v-plus::after{top:16px !important;left:16px !important;width:12px;height:2.2px;margin:-1.1px 0 0 -6px !important;background:var(--encre)}
@media (hover:hover){#ea-veille .vitem summary:hover .v-plus{background-image:${BTN(true)} !important}}
#ea-veille .vitem[open] .v-plus{background-image:${BTN(true)} !important}
#ea-veille .vitem[open] .v-plus::after{transform:rotate(90deg) scaleX(0) !important}
#ea-veille .vitem summary:focus-visible{outline-offset:-3px}
/* Texte ouvert : le résumé et les repères alignés sur le titre, sur un fond clair */
#ea-veille .vitem[open]{background:var(--fond);border-bottom-color:var(--filet-fort)}
#ea-veille .vitem[open] summary{padding-left:14px !important;padding-right:14px !important}
#ea-veille .vitem[open] .v-sum{grid-template-columns:182px minmax(0,1fr)}
#ea-veille .v-body{max-width:none !important;padding:0 64px 26px 224px !important;gap:18px !important}
#ea-veille .v-body > p{font-size:17px;line-height:1.6;color:var(--texte);max-width:40em}
#ea-veille .v-facts{gap:0 !important;grid-template-columns:max-content minmax(0,1fr) !important;border-top:1px solid var(--filet-fort);font-size:15px}
#ea-veille .v-facts dt,#ea-veille .v-facts dd{padding:9px 0;border-bottom:1px solid var(--filet)}
#ea-veille .v-facts dt{padding-right:22px;font-weight:600;color:var(--gris)}
#ea-veille .v-facts dd{color:var(--encre)}
#ea-veille .vlist .empty{padding:26px 0}

/* Contrôle de couverture : note discrète en bas de la liste */
#ea-veille .coverage-light{max-width:none !important;margin-top:18px !important;padding-left:224px;font-size:14px !important;line-height:1.55 !important;color:var(--gris)}
#ea-veille .coverage-light strong{display:block;font-size:14px;font-weight:700;color:var(--encre)}

/* Textes suivis : carte claire, frise aux points dessinés au marqueur */
#ea-veille .side-block{gap:0 !important}
#ea-veille .ea-suivis-tete{display:flex;align-items:center;gap:12px;margin:0 0 2px}
#ea-veille .ea-suivis-tete .ea-pastille{flex:none;width:48px;height:auto;margin:-6px 0 -6px -4px}
#ea-veille .side-block .ea-suivis-h{margin:0}
#ea-veille .track-title{margin:18px 0 12px !important;padding-top:16px;border-top:1px solid var(--filet-fort);font-size:16.5px !important;font-weight:800 !important;line-height:1.3;color:var(--encre)}
#ea-veille #trackers > .track-title:first-child{margin-top:14px !important;padding-top:0;border-top:0}
#ea-veille .track li{padding:0 0 14px 34px !important}
#ea-veille .track li:last-child{padding-bottom:0 !important}
#ea-veille .track li::after{top:0 !important;left:0 !important;width:22px !important;height:22px !important;border-radius:0 !important;box-shadow:none !important;background:${POINT_AVENIR} center / 22px 22px no-repeat !important}
#ea-veille .track li.done::after{background-image:${POINT_FAIT} !important}
#ea-veille .track li::before{top:22px !important;bottom:0 !important;left:8.2px !important;width:0 !important;background:none !important;border-left:2px dotted var(--filet-fort)}
#ea-veille .track li.done::before{border-left:2px solid var(--vert)}
#ea-veille .track li.done:has(+ li:not(.done))::before{border-left:2px dotted var(--vert)}
#ea-veille .step-name{font-size:15px !important;font-weight:700 !important;line-height:1.35;color:var(--encre)}
#ea-veille .track li:not(.done) .step-name{font-weight:600 !important;color:var(--texte)}
#ea-veille .step-when{font-size:14px;line-height:1.4;color:var(--gris)}
`;

const script = `(function(){
  var panel = document.getElementById('ea-veille'); if (!panel) return;
  /* Titre de la rubrique (pastille aux jumelles), phrase reprise de la page Veille (« Dans l'espace adhérent ») */
  if (window.EA_TITRE) window.EA_TITRE('ea-veille', 'veille', 'La veille réglementaire', 'La synthèse de la semaine et le suivi des textes en cours.');
  /* Les deux titres de la rubrique passent sous son titre (h3), sans changer leur texte ni l'identifiant de « Textes suivis » */
  function enH3(el, cls){
    if (!el || el.tagName === 'H3') return;
    var h = document.createElement('h3');
    Array.prototype.forEach.call(el.attributes, function(a){ h.setAttribute(a.name, a.value); });
    h.className = cls; while (el.firstChild) h.appendChild(el.firstChild);
    el.parentNode.replaceChild(h, el);
  }
  enH3(panel.querySelector('.veille-main .sec-head h2'), 'ea-edition ea-sous-titre');
  enH3(document.getElementById('h-suivis'), 'ea-suivis-h ea-sous-titre');
  /* « Textes suivis » : la carte claire commune aux rubriques */
  var sb = panel.querySelector('.side-block'); if (sb) sb.classList.add('ea-carte-claire');
  /* « Textes suivis » : la pastille des textes législatifs et réglementaires de la Documentation (code relié), reprise telle quelle */
  var hs = document.getElementById('h-suivis');
  if (hs && !hs.parentNode.classList.contains('ea-suivis-tete')) {
    var src = document.querySelector('#doc-textes .doc-h svg'); var tete = document.createElement('div'); tete.className = 'ea-suivis-tete';
    hs.parentNode.insertBefore(tete, hs);
    if (src) { var c = src.cloneNode(true); c.classList.add('drawn', 'ea-pastille'); c.classList.remove('mnum-doc'); c.removeAttribute('style'); tete.appendChild(c); }
    tete.appendChild(hs);
  }

  /* Sources en pavés : nom, point de la source (le même que dans la liste) et nombre de textes, compté dans la page */
  var seg = document.getElementById('veille-seg'); if (!seg) return;
  seg.classList.add('ea-vs');
  var CLE = { 'Journal officiel': 'jo', 'Parlement': 'parl', 'Hors JO': 'hors' };
  function compte(cle){
    /* Le bandeau de l'accueil reprend toute la veille ; à défaut, la liste quand « Tout » est choisi */
    var tout = document.querySelectorAll('#home-shelf .vcard');
    if (tout.length) return cle ? document.querySelectorAll('#home-shelf .vcard .dot-' + cle).length : tout.length;
    var pressed = seg.querySelector('[aria-pressed="true"]');
    if (pressed && pressed.dataset.nom === 'Tout') return cle ? document.querySelectorAll('#veille-list .vitem .dot-' + cle).length : document.querySelectorAll('#veille-list .vitem').length;
    return null;
  }
  function decorer(){
    seg.querySelectorAll('button').forEach(function(b){
      if (b.querySelector('.vs-nom')) return;
      var nom = b.textContent.trim(); b.dataset.nom = nom;
      var cle = CLE[nom] || '';
      var n = compte(cle);
      var esc = function(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); };
      b.innerHTML = '<span class="vs-nom ea-pave-n">' + (cle ? '<span class="dot dot-' + cle + '" aria-hidden="true"></span>' : '') + esc(nom) + '</span>' +
        (n === null ? '' : '<span class="sr-only">, </span><span class="vs-n ea-pave-d">' + n + (n > 1 ? ' textes' : ' texte') + '</span>');
    });
  }
  decorer();
  if (!seg.__eaVeilleObs) { seg.__eaVeilleObs = new MutationObserver(decorer); seg.__eaVeilleObs.observe(seg, { childList: true }); }
})();`;

module.exports = { css, script };
