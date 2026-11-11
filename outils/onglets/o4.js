// Proposition 4 « Sommaire illustré » (planche des onglets du menu et des sous-onglets du syndicat, 11 novembre 2026).
// Page Le syndicat : sous les cinq mascottes, un sommaire de six pavés, un par rubrique (Missions, Bureau, Conseil, Représentants,
// URPS, Statuts et comptes), chacun avec sa pastille dessinée (même dessin que les pastilles du site : rond blanc au marqueur sur le
// rond vert anis, traits de joie), son nom, une ligne reprise de ce que la page dit de la rubrique et la petite flèche au marqueur
// des liens « Lire… ». Comme les pavés des Actualités et les sommaires de la Documentation. Un clic mène à la rubrique.
// Tant que le sommaire est à l'écran, la barre des sous-onglets ne se montre pas (elle le répéterait : « c'est redondant », avait dit
// Isabelle Eimer de la Documentation) ; dès qu'il est dépassé, elle apparaît sous le menu et suit la lecture.
// Onglet ouvert (menu principal, barre des sous-onglets) : en vert foncé, avec, juste dessous, la petite flèche au marqueur tournée
// vers le haut, qui le montre (un seul trait, net, comme dans les liens « Lire… »).
// Menu compact (téléphone, tablette en vertical) : la même flèche, tournée vers la droite, devant le nom de la page ouverte.
// Au survol, la flèche apparaît en vert anis. Les noms ne bougent jamais d'un onglet à l'autre (le menu tient toujours sur une ligne).
// Essai écarté : la flèche avec un double vert anis décalé, comme les grosses flèches ; à cette taille, le trait paraissait flou.
// Le site n'est pas modifié : ces styles et ce script sont ajoutés à la page ouverte, pour les captures de la planche.

const css = `
/* ---------- La petite flèche qui montre l'onglet ouvert ---------- */
.gnav-links a,.gnav-member,.lnav-links a[data-section]{position:relative!important}
.o4-fl{position:absolute;left:50%;top:calc(50% + 11px);display:block;width:13px;height:18px;margin-left:-6.5px;overflow:visible;pointer-events:none;
  opacity:0;transform:translateY(3px)}
.o4-fl path{fill:none;stroke-width:2.7px;stroke-linecap:round;stroke-linejoin:round}
.o4-fl .o4-trait{stroke:#5F7A2B}
a[aria-current] > .o4-fl{opacity:1;transform:none}
@media (hover:hover){
  a:not([aria-current]):hover > .o4-fl{opacity:1;transform:none}
  a:not([aria-current]):hover > .o4-fl .o4-trait{stroke:#A3BE3C}
}
@media (prefers-reduced-motion:no-preference){.o4-fl{transition:opacity .18s,transform .22s cubic-bezier(.2,.7,.2,1)}}
@media (forced-colors:active){.o4-fl .o4-trait{stroke:CanvasText}}

/* Menu principal : noms en encre, onglet ouvert en vert foncé (inchangé) */
.gnav-links a[aria-current="page"],.gnav-member[aria-current="page"]{color:#5F7A2B!important}

/* Barre des sous-onglets (Le syndicat, Informations légales) : texte en Nunito gras, la flèche sous la rubrique en cours de lecture */
.lnav-links a[data-section]{padding:10px 8px 22px!important}
.lnav-links a[data-section] > .o4-fl{top:auto;bottom:3px}
.lnav-links a[aria-current="true"]{color:#5F7A2B!important;box-shadow:none!important}
.lnav-links a[data-section]:hover{color:#5F7A2B!important}
@media (max-width:640px){.lnav-links a[data-section]{padding:10px 7px 22px!important}}

/* Menu compact : la flèche, tournée vers la droite, devant le nom de la page ouverte */
.mmenu-link{position:relative}
.mmenu-link[aria-current="page"]{padding-left:38px!important}
.o4-fld{position:absolute;left:1px;top:50%;display:none;width:25px;height:18px;margin-top:-8px;overflow:visible;pointer-events:none}
.o4-fld path{fill:none;stroke-width:2.6px;stroke-linecap:round;stroke-linejoin:round}
.o4-fld .o4-trait{stroke:#5F7A2B}
.mmenu-link[aria-current="page"] > .o4-fld{display:block}
@media (forced-colors:active){.o4-fld .o4-trait{stroke:CanvasText}}

/* ---------- Le sommaire illustré de la page Le syndicat ---------- */
.o4-sommaire{width:100%;max-width:1040px;margin:clamp(10px,1.6vw,22px) auto 0;text-align:left}
.o4-paves{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.o4-paves li{display:flex;min-width:0}
.o4-pave{flex:1 1 auto;display:flex;align-items:center;gap:12px;min-width:0;min-height:44px;padding:12px 16px 12px 10px;border:1px solid var(--filet);border-radius:14px;
  background:var(--fond);color:var(--encre);text-decoration:none}
.o4-pave .mnum{flex:none;width:58px!important;height:auto;margin:-6px 0 -6px 0}
.o4-txt{flex:1 1 auto;display:flex;flex-direction:column;gap:3px;min-width:0}
.o4-nom{font-size:18px;line-height:1.2;font-weight:800;letter-spacing:-.01em;color:var(--encre)}
.o4-k{font-size:15px;line-height:1.38;font-weight:500;color:var(--texte);text-wrap:pretty}
.o4-go{flex:none;align-self:center;color:#5F7A2B}
.o4-go svg{display:block;width:19px;height:13px;overflow:visible}
@media (prefers-reduced-motion:no-preference){.o4-pave{transition:background-color .2s,border-color .2s}.o4-go svg{transition:transform .2s cubic-bezier(.2,.7,.2,1)}}
@media (hover:hover){
  .o4-pave:hover{background:#fff;border-color:#5F7A2B}
  .o4-pave:hover .o4-nom{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}
  .o4-pave:hover .o4-go svg{transform:translateX(3px)}
}
.o4-pave:focus-visible{outline:3px solid #5F7A2B;outline-offset:3px;border-radius:14px}
/* Pastilles qui se dessinent à l'arrivée à l'écran, l'une après l'autre (comme les sommaires de la Documentation) */
.o4-paves li:nth-child(2) .mnum{--d:.1s}.o4-paves li:nth-child(3) .mnum{--d:.2s}.o4-paves li:nth-child(4) .mnum{--d:.3s}
.o4-paves li:nth-child(5) .mnum{--d:.4s}.o4-paves li:nth-child(6) .mnum{--d:.5s}
@media (max-width:899px){.o4-paves{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:599px){
  .o4-paves{grid-template-columns:minmax(0,1fr);gap:8px}
  .o4-pave{gap:10px;padding:8px 14px 8px 8px}
  .o4-pave .mnum{width:46px!important;margin:-4px 0 -4px 0}
  .o4-nom{font-size:17px}.o4-k{font-size:14.5px;line-height:1.35}
}

/* Tant que le sommaire est à l'écran, la barre des sous-onglets attend (elle le répéterait) ; elle apparaît une fois le sommaire
   dépassé. Elle se pose alors par-dessus le haut de la page, pour que rien ne bouge. Écrans bas (téléphone à l'horizontale) :
   la barre reste à sa place, comme aujourd'hui. */
@media (min-height:501px){
  .view[data-view="syndicat"] > .lnav{margin-bottom:calc(-1 * var(--lnav-h))}
  .view[data-view="syndicat"] > .lnav.o4-cache{opacity:0;visibility:hidden;transform:translateY(-8px)}
}
@media (min-height:501px) and (prefers-reduced-motion:no-preference){
  .view[data-view="syndicat"] > .lnav{transition:opacity .22s,transform .22s cubic-bezier(.2,.7,.2,1),visibility 0s}
  .view[data-view="syndicat"] > .lnav.o4-cache{transition:opacity .18s,transform .18s,visibility 0s .18s}
}
`;

const script = `(() => {
  /* La petite flèche des liens « Lire… » (app.js, FLECHE), d'un seul trait au marqueur :
     tournée vers le haut sous les onglets, vers la droite devant le nom dans le menu compact. */
  const HAUT = ['M7.9 17.8 Q6.1 11.5 7.1 3.6', 'M2.6 8.4 Q4.9 5.4 7.2 3.2 Q9.3 5.6 11.7 8.1'];
  const DROITE = ['M2.2 7.9 Q8.5 6.1 16.4 7.1', 'M11.6 2.6 Q14.6 4.9 16.8 7.2 Q14.4 9.3 11.9 11.7'];
  const fl = (cls, vb, d) => '<svg class="' + cls + '" viewBox="' + vb + '" aria-hidden="true" focusable="false">' +
    '<g class="o4-trait">' + d.map((p) => '<path d="' + p + '"/>').join('') + '</g></svg>';
  document.querySelectorAll('.gnav-links a, .gnav-member, .lnav-links a[data-section]').forEach((a) => {
    if (!a.querySelector('.o4-fl')) a.insertAdjacentHTML('beforeend', fl('o4-fl', '0 0 14 20', HAUT));
  });
  document.querySelectorAll('.mmenu-link').forEach((a) => {
    if (!a.querySelector('.o4-fld')) a.insertAdjacentHTML('afterbegin', fl('o4-fld', '0 0 20 14', DROITE));
  });

  /* Pastilles : même dessin que pastille() dans app.js ; petits dessins repris de JOIN_ICONS (deux biologistes, porte-voix)
     ou dessinés dans le même style (drapeau des mascottes, bulle de la discussion, repère, feuille et graphique). */
  const ICONES = {
    missions: '<path class="mnum-digit" pathLength="1" d="M29 22 L29 61" stroke-width="3.4"/><circle class="mnum-fill" cx="29" cy="20" r="2.6" fill="#2E3236" stroke="none"/>' +
      '<path class="mnum-digit" pathLength="1" d="M30 24 Q37.5 20.5 44.5 24 Q51.5 27.5 58.5 24 L58.5 41.5 Q51.5 45 44.5 41.5 Q37.5 38 30 41.5 Z" fill="#A3BE3C" stroke-width="3.2"/>' +
      '<path class="mnum-digit" pathLength="1" d="M23.5 61 L34.5 61" stroke-width="3.2"/>',
    bureau: '<path class="mnum-digit" pathLength="1" d="M19.5 61 Q20 47.5 31 47.5 Q41 47.5 42.5 61" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<path class="mnum-digit" pathLength="1" d="M41.5 61 Q43 47.5 53 47.5 Q64 47.5 64.5 61" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<circle class="mnum-digit" pathLength="1" cx="31" cy="34.5" r="8.5" fill="#FFFFFF" stroke-width="3.4"/><circle class="mnum-digit" pathLength="1" cx="53" cy="34.5" r="8.5" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<g class="mnum-fill"><circle cx="28.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/><circle cx="33.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/>' +
      '<circle cx="50.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/><circle cx="55.5" cy="33.5" r="1.4" fill="#2E3236" stroke="none"/>' +
      '<path d="M28 37.5 Q31 40 34 37.5 M50 37.5 Q53 40 56 37.5" stroke-width="2"/>' +
      '<path d="M31 47.5 L31 60" stroke="#A3BE3C" stroke-width="3"/><path d="M53 47.5 L53 60" stroke="#A3BE3C" stroke-width="3"/></g>',
    conseil: '<path class="mnum-fill" d="M44 43 L60 43 Q63.5 43 63.5 46.5 L63.5 54 Q63.5 57.5 60 57.5 L59 57.5 L60.5 62.5 L54.5 57.5 L47.5 57.5 Q44 57.5 44 54 Z" fill="#D6E4A6" stroke-width="2.8"/>' +
      '<path class="mnum-digit" pathLength="1" d="M26 23 L52 23 Q56.5 23 56.5 27.5 L56.5 41 Q56.5 45.5 52 45.5 L38 45.5 L29.5 52.5 L31 45.5 L26 45.5 Q21.5 45.5 21.5 41 L21.5 27.5 Q21.5 23 26 23 Z" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<g class="mnum-fill"><circle cx="31" cy="34.2" r="2.5" fill="#2E3236" stroke="none"/><circle cx="39" cy="34.2" r="2.5" fill="#2E3236" stroke="none"/><circle cx="47" cy="34.2" r="2.5" fill="#2E3236" stroke="none"/></g>',
    representants: '<path class="mnum-digit" pathLength="1" d="M20 35.5 L27 35.5 L27 46.5 L20 46.5 Z" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<path class="mnum-digit" pathLength="1" d="M27 35.5 L48 25.5 L48 56.5 L27 46.5 Z" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<ellipse class="mnum-fill" cx="48" cy="41" rx="3.6" ry="14.5" fill="#D6E4A6" stroke="none"/>' +
      '<ellipse class="mnum-digit" pathLength="1" cx="48" cy="41" rx="3.6" ry="14.5" stroke-width="3.2"/>' +
      '<path class="mnum-digit" pathLength="1" d="M33 48.5 L36 57" stroke-width="3.4"/>' +
      '<g class="mnum-fill" stroke-width="3"><path d="M57 32.5 L62.5 29"/><path d="M58 41 L64.5 41"/><path d="M57 49.5 L62.5 53"/></g>',
    urps: '<path class="mnum-fill" d="M32 60.5 Q42 64 52 60.5" stroke-width="2.6"/>' +
      '<path class="mnum-digit" pathLength="1" d="M42 59 C36.5 51.5 28 44.5 28 35 C28 26.8 34.3 20.5 42 20.5 C49.7 20.5 56 26.8 56 35 C56 44.5 47.5 51.5 42 59 Z" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<circle class="mnum-fill" cx="42" cy="34.5" r="6" fill="#D6E4A6" stroke-width="2.8"/>',
    comptes: '<path class="mnum-digit" pathLength="1" d="M27.5 21.5 L47 21.5 L56.5 31 L56.5 60 L27.5 60 Z" fill="#FFFFFF" stroke-width="3.4"/>' +
      '<path class="mnum-digit" pathLength="1" d="M46.5 22 L46.5 31.5 L56 31.5" stroke-width="2.6"/>' +
      '<g class="mnum-fill" stroke-width="2.4"><path d="M33 29.5 L41 29.5"/><path d="M33 35.5 L44 35.5"/></g>' +
      '<path class="mnum-fill" d="M33.5 54.5 L33.5 47.5 L38.5 47.5 L38.5 54.5" fill="#D6E4A6" stroke-width="2.4"/>' +
      '<path class="mnum-fill" d="M41.5 54.5 L41.5 42.5 L46.5 42.5 L46.5 54.5" fill="#5F7A2B" stroke-width="2.4"/>' +
      '<path class="mnum-fill" d="M31 54.5 L52 54.5" stroke-width="2.4"/>'
  };
  const pastille = (icon) => '<svg class="mnum mnum-join o4-past" viewBox="8 0 74 76" aria-hidden="true" focusable="false" fill="none" stroke="#2E3236" stroke-linecap="round" stroke-linejoin="round">' +
    '<g class="perso"><circle class="mnum-anis" cx="50" cy="47" r="29" fill="#A3BE3C" stroke="none"/>' +
    '<path class="mnum-head" pathLength="1" d="M42 11 C59.5 10.5 71 23.5 71 40 C71 57.5 58.5 69.5 42 69.5 C25 69.5 13 57 13 40 C13 23.5 25.5 11.8 39.5 11.2" fill="#FFFFFF" stroke-width="2.8"/>' +
    icon + '<g class="mnum-eclats" stroke-width="2.6"><path d="M67 13 L72.5 7.5"/><path d="M71.5 21.5 L79 19.5"/><path d="M60.5 8 L62 2"/></g></g></svg>';
  const FLECHE = '<svg viewBox="0 0 20 14" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M2.2 7.9 Q8.5 6.1 16.4 7.1"/><path d="M11.6 2.6 Q14.6 4.9 16.8 7.2 Q14.4 9.3 11.9 11.7"/></svg>';

  const vue = document.querySelector('.view[data-view="syndicat"]');
  if (!vue) return;
  const hero = vue.querySelector('.syndicat-hero .container');
  if (hero && !vue.querySelector('.o4-sommaire')) {
    /* Une ligne par rubrique, reprise de ce que la page dit de chacune (titres et introductions des sections) */
    const nb = (document.getElementById('bureau-count') || {}).textContent || 'sept';
    const LIGNES = {
      missions: 'Représenter, défendre et préparer l’avenir du métier',
      bureau: 'Le bureau exécutif réunit ' + nb.trim() + ' membres du conseil',
      conseil: 'Les administrateurs du syndicat, région par région',
      representants: 'Les instances où le SLBC est représenté',
      urps: 'Les unions régionales des professionnels de santé',
      comptes: 'Les statuts du syndicat et ses comptes publiés'
    };
    const liens = [...vue.querySelectorAll('.lnav-links a[data-section]')];
    hero.insertAdjacentHTML('beforeend', '<nav class="o4-sommaire" aria-label="Sommaire de la page Le syndicat"><ul class="o4-paves">' +
      liens.map((a) => { const s = a.dataset.section; const nom = a.textContent.trim();
        return '<li><a class="o4-pave" href="#syndicat" data-section="' + s + '">' + pastille(ICONES[s] || '') +
          '<span class="o4-txt"><span class="o4-nom">' + nom + '</span><span class="sr-only">, </span><span class="o4-k">' + (LIGNES[s] || '') + '</span></span>' +
          '<span class="o4-go" aria-hidden="true">' + FLECHE + '</span></a></li>'; }).join('') + '</ul></nav>');
    /* Après le clic (le site fait défiler jusqu'à la rubrique), le focus va sur le titre de la rubrique, pour que Tab reparte de là */
    vue.querySelectorAll('.o4-pave').forEach((a) => a.addEventListener('click', () => {
      setTimeout(() => { const t = document.getElementById(a.dataset.section); const h = t && t.querySelector('h2');
        if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }, 0);
    }));
    /* Les pastilles se dessinent à leur arrivée à l'écran, comme partout sur le site (animations réduites : dessinées d'emblée) */
    const past = [...vue.querySelectorAll('.o4-past')];
    if (document.documentElement.classList.contains('js-motion') && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); e.target.classList.add('drawn'); } }), { rootMargin: '0px 0px -10% 0px' });
      past.forEach((p) => io.observe(p));
    } else past.forEach((p) => p.classList.add('drawn'));
  }

  /* La barre des sous-onglets n'apparaît qu'une fois le sommaire dépassé */
  const barre = vue.querySelector(':scope > .lnav');
  const bas = window.matchMedia('(max-height:500px)');
  const maj = () => {
    const s = vue.querySelector('.o4-sommaire'); const nav = document.querySelector('.gnav');
    if (!s || !barre || vue.hidden) return;
    const passe = s.getBoundingClientRect().bottom <= nav.getBoundingClientRect().bottom + 1;
    barre.classList.toggle('o4-cache', !passe && !bas.matches);
  };
  if (!window.__o4Barre) {
    window.__o4Barre = true;
    let attente = false;
    const plusTard = () => { if (attente) return; attente = true; requestAnimationFrame(() => { attente = false; maj(); }); };
    window.addEventListener('scroll', plusTard, { passive: true });
    window.addEventListener('resize', plusTard);
    window.addEventListener('hashchange', () => requestAnimationFrame(plusTard));
  }
  maj();
})();`;

module.exports = { css, script };
