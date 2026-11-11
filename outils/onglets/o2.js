// Proposition 2 « Pavés » : les onglets reprennent les pavés de la page Actualités (rubriques), déjà validés.
// Menu principal : l'onglet ouvert est posé sur un pavé vert clair aux coins arrondis, cerclé d'un filet vert foncé, nom en vert foncé ;
// au survol, un pavé fond clair à filet gris, comme les pavés des Actualités au repos.
// Menu compact (téléphone, tablette en vertical) : la ligne de la page ouverte sur la même bande vert clair cerclée.
// Sous-onglets (Le syndicat, Informations légales) : une rangée de pavés blancs à filet fin sur une bande fond clair, chacun avec sa petite
// pastille dessinée, comme les pavés des Actualités ; la rubrique en cours en vert clair, cerclée de 2 px de vert foncé.
// Texte des onglets ouverts : #4E6623 (jeton --vert-fonce du site) : #5F7A2B sur vert clair ne ferait que 3,6:1.
// Pastilles : même dessin que celles du site (rond blanc au marqueur sur le rond vert anis, traits de joie), sans animation ni balancement.

// Petits dessins (repris de app.js : JOIN_ICONS, DOC_ICONS ; nouveaux : drapeau, bulle, repère, cadenas, biscuit)
const ICONS = {
  // Missions : le drapeau des mascottes
  missions: '<path d="M30 21 L30 61" stroke-width="3.4"/><path d="M30.5 24 Q38 20.5 45 24.5 Q52 28.5 59 25 L59 42 Q52 45.5 45 41.5 Q38 37.5 30.5 41 Z" fill="#A3BE3C" stroke-width="3.2"/><path d="M25 61 L35 61" stroke-width="3.2"/>',
  // Bureau : deux biologistes (JOIN_ICONS[1])
  bureau: '<path d="M19.5 61 Q20 47.5 31 47.5 Q41 47.5 42.5 61" fill="#FFFFFF" stroke-width="3.4"/><path d="M41.5 61 Q43 47.5 53 47.5 Q64 47.5 64.5 61" fill="#FFFFFF" stroke-width="3.4"/><circle cx="31" cy="34.5" r="8.5" fill="#FFFFFF" stroke-width="3.4"/><circle cx="53" cy="34.5" r="8.5" fill="#FFFFFF" stroke-width="3.4"/><circle cx="28.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/><circle cx="33.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/><circle cx="50.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/><circle cx="55.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/><path d="M28 37.5 Q31 40 34 37.5 M50 37.5 Q53 40 56 37.5" stroke-width="2"/><path d="M31 47.5 L31 60" stroke="#A3BE3C" stroke-width="3"/><path d="M53 47.5 L53 60" stroke="#A3BE3C" stroke-width="3"/>',
  // Conseil : la bulle de discussion du dessin des cinq mascottes
  conseil: '<path d="M27 25 L57 25 Q61 25 61 29 L61 46 Q61 50 57 50 L41 50 L32.5 57.5 L34 50 L27 50 Q23 50 23 46 L23 29 Q23 25 27 25 Z" fill="#FFFFFF" stroke-width="3.4"/><circle cx="33.5" cy="37.5" r="2.6" fill="#2E3236" stroke="none"/><circle cx="42" cy="37.5" r="2.6" fill="#2E3236" stroke="none"/><circle cx="50.5" cy="37.5" r="2.6" fill="#2E3236" stroke="none"/>',
  // Représentants : le porte-voix (JOIN_ICONS[2])
  representants: '<path d="M20 35.5 L27 35.5 L27 46.5 L20 46.5 Z" fill="#FFFFFF" stroke-width="3.4"/><path d="M27 35.5 L48 25.5 L48 56.5 L27 46.5 Z" fill="#FFFFFF" stroke-width="3.4"/><ellipse cx="48" cy="41" rx="3.6" ry="14.5" fill="#D6E4A6" stroke="none"/><ellipse cx="48" cy="41" rx="3.6" ry="14.5" stroke-width="3.2"/><path d="M33 48.5 L36 57" stroke-width="3.4"/><g stroke-width="3"><path d="M57 32.5 L62.5 29"/><path d="M58 41 L64.5 41"/><path d="M57 49.5 L62.5 53"/></g>',
  // URPS : un repère sur la carte (les unions régionales)
  urps: '<path d="M42 60 C36.5 52 28.5 45.5 28.5 35.5 C28.5 27.5 34.5 21.5 42 21.5 C49.5 21.5 55.5 27.5 55.5 35.5 C55.5 45.5 47.5 52 42 60 Z" fill="#FFFFFF" stroke-width="3.4"/><circle cx="42" cy="35.5" r="5.8" fill="#D6E4A6" stroke-width="2.6"/>',
  // Statuts et comptes : le code relié (DOC_ICONS['doc-textes'])
  comptes: '<path d="M28 25 L54 25 Q57 25 57 28 L57 57 L31 57 Q28 57 28 54 Z" fill="#FFFFFF" stroke-width="3.4"/><path d="M29.7 26.7 L34 26.7 L34 55.3 L31 55.3 Q29.7 55.3 29.7 54 Z" fill="#D6E4A6" stroke="none"/><path d="M34 25 L34 57" stroke-width="2.6"/><g stroke-width="2.4"><path d="M39 34 L51 34"/><path d="M39 40 L49 40"/></g><path d="M46 57 L46 63 L49 60.5 L52 63 L52 57" fill="#5F7A2B" stroke-width="2.2"/>',
  // Informations légales : la balance (DOC_ICONS['doc-deonto']), un cadenas, un biscuit
  'mentions-legales': '<path d="M42 25 L42 56" stroke-width="3.4"/><path d="M34 57 L50 57" stroke-width="3.4"/><path d="M25 31 Q42 27 59 31" stroke-width="3.2"/><g stroke-width="2.2"><path d="M25 31 L20 43 M25 31 L30 43 M59 31 L54 43 M59 31 L64 43"/></g><path d="M19 43 Q25 50 31 43 Z" fill="#D6E4A6" stroke-width="2.6"/><path d="M53 43 Q59 50 65 43 Z" fill="#D6E4A6" stroke-width="2.6"/><circle cx="42" cy="25" r="2.6" fill="#FFFFFF" stroke-width="2.4"/>',
  donnees: '<path d="M34 38 L34 31 Q34 23 42 23 Q50 23 50 31 L50 38" stroke-width="3.4"/><rect x="28" y="37.5" width="28" height="21" rx="3.5" fill="#D6E4A6" stroke-width="3.4"/><circle cx="42" cy="46" r="2.6" fill="#2E3236" stroke="none"/><path d="M42 47 L42 52.5" stroke-width="2.8"/>',
  cookies: '<path d="M58 40 C58 50 50.5 57.5 41.5 57.5 C32 57.5 25 50 25 41 C25 32 32 24.5 41 24.5 C41 29 44 31.5 47.5 31.5 C47.5 35.5 51.5 38.5 58 40 Z" fill="#D6E4A6" stroke-width="3.4"/><circle cx="35" cy="37" r="2.3" fill="#2E3236" stroke="none"/><circle cx="44" cy="45" r="2.3" fill="#2E3236" stroke="none"/><circle cx="34.5" cy="48" r="2" fill="#2E3236" stroke="none"/><circle cx="50.5" cy="49" r="1.8" fill="#2E3236" stroke="none"/>'
};
const pastille = (icon) => '<svg class="o2-pas" viewBox="8 0 74 76" aria-hidden="true" focusable="false" fill="none" stroke="#2E3236" stroke-linecap="round" stroke-linejoin="round">' +
  '<circle cx="50" cy="47" r="29" fill="#A3BE3C" stroke="none"/>' +
  '<path d="M42 11 C59.5 10.5 71 23.5 71 40 C71 57.5 58.5 69.5 42 69.5 C25 69.5 13 57 13 40 C13 23.5 25.5 11.8 39.5 11.2" fill="#FFFFFF" stroke-width="2.8"/>' +
  icon +
  '<g class="o2-eclats" stroke-width="2.6"><path d="M67 13 L72.5 7.5"/><path d="M71.5 21.5 L79 19.5"/><path d="M60.5 8 L62 2"/></g></svg>';

module.exports = {
  css: `
/* ---------- Menu principal ----------
   Même place que le menu d'aujourd'hui : le pavé déborde de sa marge intérieure aux deux bouts de la rangée ; cette marge passe
   de 8 px (écran de 1101 px) à 12 px (1197 px et plus), pour garder au moins 16 px avant la loupe. */
:root{--o2-p:clamp(8px,calc(8px + (100vw - 1101px) / 24),12px)}
.gnav-links{gap:0!important}
.gnav-links a{display:inline-flex}
.gnav-links a,.gnav-member{align-items:center;min-height:44px;padding:0 var(--o2-p)!important;line-height:1.2!important;border:1px solid transparent;border-radius:12px;font-size:18px!important;font-weight:700!important;color:var(--encre)!important}
.gnav-links a:first-child{margin-left:calc(-1 * var(--o2-p))}
.gnav-links a:last-child{margin-right:calc(-1 * var(--o2-p))}
.gnav-member{padding:0 9px!important}
@media (min-width:1201px){.gnav-member{padding:0 10px!important}}
@media (hover:hover){
  .gnav-links a:not([aria-current]):hover,.gnav-member:not([aria-current]):hover{background:var(--fond);border-color:var(--filet-fort)}
}
.gnav-links a[aria-current="page"],.gnav-member[aria-current="page"]{background:var(--vert-clair);border-color:var(--vert);color:var(--vert-fonce)!important}
.gnav-links a:focus-visible,.gnav-member:focus-visible{outline-offset:2px;border-radius:12px}
@media (prefers-reduced-motion:no-preference){.gnav-links a,.gnav-member,.lnav-links a,.mmenu-link{transition:background-color .2s,border-color .2s,box-shadow .2s}}

/* ---------- Menu compact (téléphone, tablette en vertical) ---------- */
.mmenu-link{margin-inline:-10px;padding:12px 10px!important;border:1.5px solid transparent;border-bottom:1px solid var(--filet);border-radius:0;color:var(--encre)!important}
.mmenu-link[aria-current="page"]{border:1.5px solid var(--vert);border-radius:12px;background:var(--vert-clair);color:var(--vert-fonce)!important}
.mmenu-link:has(+ .mmenu-link[aria-current="page"]){border-bottom-color:transparent}
@media (hover:hover){.mmenu-link:not([aria-current]):hover{background:var(--fond);border-radius:12px}}
.mmenu-link:focus-visible{outline-offset:-3px;border-radius:12px}

/* ---------- Sous-onglets (Le syndicat, Informations légales) ---------- */
:root{--lnav-h:57px;--o2-gl:max(32px,env(safe-area-inset-left,0px));--o2-gr:max(32px,env(safe-area-inset-right,0px))}
.lnav{background:rgba(247,248,244,.92)!important;border-bottom:1px solid var(--filet)!important}
.lnav-in{min-height:0!important}
.lnav-links,.lnav-centre .lnav-links{flex:1 1 auto;justify-content:center;gap:8px!important;margin-inline:0;padding-block:8px}
.lnav-links a{flex:1 1 0;min-width:max-content;max-width:200px;display:inline-flex!important;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:0 14px 0 8px!important;border:1px solid var(--filet-fort);border-radius:12px;background:#fff;font-size:16px!important;font-weight:700!important;line-height:1.2;color:var(--encre)!important}
.lnav-links a .o2-pas{flex:none;display:block;width:33px;height:auto;margin:-4px 0 -4px -1px;overflow:visible}
@media (hover:hover){.lnav-links a:not([aria-current]):hover{border-color:var(--vert)}}
.lnav-links a[aria-current="true"]{background:var(--vert-clair)!important;border-color:var(--vert)!important;box-shadow:inset 0 0 0 1px var(--vert)!important;color:var(--vert-fonce)!important}
.lnav-links a:focus-visible{outline-offset:2px!important;border-radius:12px}
@media (pointer:coarse){.lnav-links a{min-height:44px}:root{--lnav-h:61px}}
/* Tablette en vertical et téléphone : la rangée défile d'un bord à l'autre de l'écran, en fondu aux bords, comme aujourd'hui sur téléphone */
@media (max-width:1100px){
  .lnav-links,.lnav-centre .lnav-links{justify-content:flex-start;margin-left:calc(-1 * var(--o2-gl))!important;margin-right:calc(-1 * var(--o2-gr))!important;-webkit-mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,transparent,#000 24px,#000 calc(100% - 24px),transparent)}
  .lnav-links::before{content:"";flex:0 0 calc(max(var(--o2-gl),24px) - 8px)!important}
  .lnav-links::after{content:"";flex:0 0 calc(max(var(--o2-gr),24px) - 8px)!important}
  .lnav-links a{flex:0 0 auto}
  .lnav-links a:first-of-type{margin-left:auto}
  .lnav-links a:last-of-type{margin-right:auto}
}
@media (max-width:719px){:root{--o2-gl:max(16px,env(safe-area-inset-left,0px));--o2-gr:max(16px,env(safe-area-inset-right,0px))}}
@media (max-width:640px){
  :root{--lnav-h:61px}
  .lnav-links a{min-height:44px;padding:0 14px 0 8px!important;font-size:16px!important}
}
@media (forced-colors:active){
  .gnav-links a[aria-current="page"],.gnav-member[aria-current="page"],.mmenu-link[aria-current="page"]{border-color:Highlight}
  .lnav-links a[aria-current="true"]{border:3px solid Highlight}
}
`,
  script: `(() => {
  const ICONS = ${JSON.stringify(ICONS)};
  const pastille = ${pastille.toString()};
  document.querySelectorAll('.lnav-links a[data-section]').forEach((a) => {
    if (a.querySelector('.o2-pas')) return;
    const icon = ICONS[a.dataset.section];
    if (icon) a.insertAdjacentHTML('afterbegin', pastille(icon));
  });
})();`,
};
