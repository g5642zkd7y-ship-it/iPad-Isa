// Proposition « Pages réservées aux adhérents » (11 novembre 2026) : rubrique « Publier sur le site » (#ea-publier), outils du bureau.
// Ajoutée après la partie commune (base.js). Le site n'est pas modifié : mêmes champs, mêmes identifiants, même fonctionnement.
// - titre de rubrique commun (pastille au porte-documents, titre, la phrase déjà présente sur la page) ;
// - juste dessous, un sommaire en quatre pavés qui mènent aux quatre parties, chacun avec sa pastille et, lu sur la page, le nombre
//   de messages, de comptes ou d'abonnés ;
// - chaque partie dans un bloc fond clair, ouverte par sa pastille, son titre et sa phrase : porte-voix pour les messages (comme
//   « Écrire au bureau »), crayon pour les publications, deux biologistes pour les comptes, journal pour la lettre (comme sa porte) ;
// - le type de publication en trois pavés : le pavé choisi prend la couleur de l'onglet où la publication paraîtra (vert clair pour
//   la Salle de presse, olive pour la Veille, gris Nardo éclairci pour les Actualités) ; le trait au marqueur reste réservé aux portes ;
// - formulaires, aperçus et listes dans des cartes blanches calmes, sans ombre ; états vides en cadre pointillé.
const css = `
/* L'ancienne introduction est reprise par le titre de rubrique commun */
#ea-publier .pub-masque{display:none!important}

/* Sommaire : quatre pavés vers les quatre parties, dessinés comme les pavés des rubriques des Actualités */
#ea-publier .pub-sommaire{margin:0 0 4px}
#ea-publier .pub-sommaire ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
#ea-publier .pub-sommaire a{display:flex;align-items:center;gap:12px;height:100%;min-height:80px;padding:12px 16px 12px 12px;border:1px solid var(--filet);border-radius:var(--ea-r-pave);background:var(--fond);color:var(--encre);text-decoration:none;transition:background-color .2s,border-color .2s}
#ea-publier .pub-sommaire .ea-pastille{flex:none;width:52px;height:auto;margin:-4px 0 -4px -2px}
#ea-publier .pub-s{display:flex;flex-direction:column;gap:3px;min-width:0}
#ea-publier .pub-s-t,#ea-publier .pub-s-n{text-wrap:balance}
@media (hover:hover){#ea-publier .pub-sommaire a:hover{background:#fff;border-color:var(--vert)}#ea-publier .pub-sommaire a:hover .pub-s-t{text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:4px}}
#ea-publier .pub-sommaire a:focus-visible{outline:3px solid var(--vert);outline-offset:3px}

/* Les quatre parties : un bloc fond clair chacune, sans ombre */
#ea-publier .pub-sec{display:flex!important;flex-direction:column;gap:0!important;margin:20px 0 0!important}
#ea-publier .pub-h{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:14px;align-items:center;margin-bottom:22px}
#ea-publier .pub-h .ea-pastille{grid-row:1 / span 2;align-self:start;width:58px;height:auto;margin:-14px 0 -6px -6px}
#ea-publier .pub-h h2{align-self:end;font-size:21px!important;line-height:1.25;font-weight:800!important;letter-spacing:-.01em;color:var(--encre)}
#ea-publier .pub-h h2 > span{font-weight:600;color:var(--gris)}
#ea-publier .pub-h > p{align-self:start;margin-top:4px!important;font-size:15.5px;line-height:1.5;color:var(--gris);max-width:54em}
#ea-publier .pub-h:not(:has(> p)) h2{align-self:center}
#ea-publier .pub-h:not(:has(> p)) .ea-pastille{align-self:center;margin-top:-6px}

/* Petits titres des colonnes */
#ea-publier .g-title{padding:0 2px 8px!important;font-size:15px!important;font-weight:700!important;color:var(--encre)!important}

/* Cartes blanches : filet fin, pas d'ombre */
#ea-publier .group,#ea-publier .recent,#ea-publier .preview,#ea-publier .mail-preview{border-radius:var(--ea-r-pave)!important;box-shadow:0 0 0 1px var(--filet-fort)!important}

/* États vides : cadre pointillé, net, sans dessin */
#ea-publier .pub-vide,#ea-publier .msg-list .nl-empty{display:block;margin:0;padding:18px 22px!important;border:1.5px dashed var(--filet-fort);border-radius:var(--ea-r-pave);background:#fff;color:var(--gris);font-size:16px;line-height:1.5}

/* Messages des adhérents : cartes blanches sur deux colonnes */
#ea-publier #msg-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;border-top:0}
#ea-publier #msg-list .nl-empty{grid-column:1 / -1}
#ea-publier #msg-list .msg{gap:6px;padding:16px 20px 18px;border:1px solid var(--filet-fort);border-radius:var(--ea-r-pave);background:#fff}
#ea-publier #msg-list .msg-meta{align-items:center}
#ea-publier #msg-list .msg-sujet{display:inline-block;padding:2px 10px;border-radius:999px;background:var(--vert-clair);color:var(--encre);font-size:14px}
#ea-publier #msg-clear{margin-top:10px}

/* Type de publication : trois pavés, le pavé choisi aux couleurs de l'onglet où la publication paraîtra */
#ea-publier #pub-type{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:none;margin:0 0 26px;padding:0;border-radius:0;background:none}
#ea-publier #pub-type button{position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:3px;max-width:none;min-height:70px;padding:12px 20px;border:1px solid var(--filet-fort);border-radius:var(--ea-r-pave);background:#fff;box-shadow:none;color:var(--encre);font:inherit;text-align:left;white-space:normal;transition:background-color .2s,border-color .2s,color .2s}
#ea-publier #pub-type .pub-type-t{display:block}
@media (hover:hover){#ea-publier #pub-type button[aria-pressed="false"]:hover{border-color:var(--vert)}}
#ea-publier #pub-type button[data-pub="cp"][aria-pressed="true"]{background:var(--vert-clair);border-color:var(--vert);box-shadow:inset 0 0 0 1px var(--vert)}
#ea-publier #pub-type button[data-pub="veille"][aria-pressed="true"]{background:var(--olive);border-color:var(--olive);color:#fff}
#ea-publier #pub-type button[data-pub="actu"][aria-pressed="true"]{background:var(--nardo);border-color:var(--nardo);color:#fff}
#ea-publier #pub-type button[data-pub="cp"][aria-pressed="true"] .pub-type-d{color:var(--encre)}
#ea-publier #pub-type button[data-pub="veille"][aria-pressed="true"] .pub-type-d,#ea-publier #pub-type button[data-pub="actu"][aria-pressed="true"] .pub-type-d{color:#fff}
#ea-publier #pub-type button:focus-visible{outline:3px solid var(--vert);outline-offset:3px}
@media (forced-colors:active){#ea-publier #pub-type button[aria-pressed="true"]{border:3px solid Highlight}}

/* Formulaire et aperçus : deux colonnes, l'aperçu à droite */
#ea-publier .admin-grid{gap:32px!important}
#ea-publier .admin-form{gap:22px!important}
#ea-publier .admin-side{gap:10px!important}
#ea-publier .admin-side .g-title[style]{margin-top:14px!important}
#ea-publier #preview-where{margin:2px 2px 0;font-size:14px!important;line-height:1.5}
#ea-publier .form-actions{padding-top:4px}

/* Comptes et lettre : mêmes cartes */
#ea-publier .nl-grid{margin-top:0!important;gap:32px!important}
#ea-publier .nl-list li:last-child{border-bottom:0}
#ea-publier #cpt-mail-empty{display:block}
#ea-publier #cpt-mail-note{margin-top:10px}
#ea-publier .nl-add{border-top:1px solid var(--filet)}
/* Listes vides des comptes et des envois : même cadre pointillé */
#ea-publier .group:has(> #cpt-list > .nl-empty),#ea-publier #nl-sent:not(:has(.r-title)){box-shadow:none!important;background:none;overflow:visible}
#ea-publier #cpt-list > .nl-empty,#ea-publier #nl-sent:not(:has(.r-title)) li{display:block;min-height:0;padding:18px 22px!important;border:1.5px dashed var(--filet-fort);border-radius:14px;background:#fff;color:var(--gris);font-size:16px;line-height:1.5}
#ea-publier #nl-sent:not(:has(.r-title)) .r-kind{font-size:16px}

/* Écrans étroits : repli simple, à vérifier après le choix (téléphones et tablettes non testés) */
@media (max-width:900px){#ea-publier .pub-sommaire ul,#ea-publier #pub-type{grid-template-columns:repeat(2,minmax(0,1fr))}#ea-publier #msg-list{grid-template-columns:minmax(0,1fr)}#member #ea-publier .pub-sec{padding:22px 20px 24px!important}}
`;
const script = `(function(){
  var panel = document.getElementById('ea-publier'); if (!panel) return;
  var admin = document.getElementById('admin'); if (!admin) return;
  var P = window.EA_PASTILLES || {};
  /* Titre de rubrique commun, avec la phrase déjà présente sur la page */
  if (window.EA_TITRE) window.EA_TITRE('ea-publier', 'bureau', 'Publier sur le site', 'Messages des adhérents, communiqués, veille réglementaire, actualités, comptes des adhérents et lettre d’information. Réservé aux membres du bureau habilités\\u202f; dans cette démonstration, tout adhérent connecté y accède.');
  if (admin.dataset.eaPublier) return; admin.dataset.eaPublier = '1';
  var intro = admin.querySelector(':scope > .ea-intro'); if (intro) intro.classList.add('pub-masque');

  /* Pastille au crayon (publications), dessinée comme les autres : rond blanc au marqueur sur le rond vert anis, traits de joie */
  var cadre = window.EA_CADRE || function(){ return ''; };
  var CRAYON = cadre('<g transform="rotate(40 42 40)"><path class="mnum-fill" d="M36.5 23 L36.5 19.5 Q36.5 16 40 16 L44 16 Q47.5 16 47.5 19.5 L47.5 23 Z" fill="#D6E4A6" stroke-width="2.6"/><path class="mnum-digit" pathLength="1" d="M36 23 L48 23 L48 50 L42 61 L36 50 Z" fill="#FFFFFF" stroke-width="3.4"/><path class="mnum-fill" d="M36 50 L48 50" stroke-width="2.2"/><path class="mnum-fill" d="M42 27 L42 46" stroke-width="2"/><path class="mnum-fill" d="M39.4 56.2 L42 61 L44.6 56.2 Z" fill="#2E3236" stroke-width="1.6"/></g>');
  var PAST = { messages: P.voix || '', publications: CRAYON, comptes: P.commission || '', lettre: P.lettre || '' };

  /* Chaque partie : un bloc, ouvert par sa pastille, son titre et sa phrase */
  function tete(sec, cle, h2){
    if (!sec || !h2) return;
    sec.classList.add('pub-sec', 'ea-carte-claire');
    var t = document.createElement('div'); t.className = 'pub-h';
    h2.parentNode.insertBefore(t, h2);
    t.insertAdjacentHTML('afterbegin', PAST[cle] || '');
    t.appendChild(h2);
    var p = t.nextElementSibling; if (p && p.tagName === 'P' && p.classList.contains('muted')) t.appendChild(p);
  }
  var msg = document.getElementById('messages-admin');
  tete(msg, 'messages', msg && msg.querySelector('h2'));
  /* Publications : la grille du formulaire et des aperçus prend un titre, et le type de publication passe au-dessus des deux colonnes */
  var grille = admin.querySelector('.admin-grid'), pubs = null;
  if (grille) {
    pubs = document.createElement('div'); pubs.id = 'pub-publications';
    grille.parentNode.insertBefore(pubs, grille);
    pubs.innerHTML = '<h2 class="h-block-l">Communiqués, veille réglementaire et actualités</h2>';
    pubs.appendChild(grille);
    tete(pubs, 'publications', pubs.querySelector('h2'));
    var type = document.getElementById('pub-type'); if (type) pubs.insertBefore(type, grille);
  }
  var cpt = document.getElementById('comptes-admin');
  tete(cpt, 'comptes', document.getElementById('cpt-title'));
  var nl = document.getElementById('lettre');
  tete(nl, 'lettre', nl && nl.querySelector('h2'));
  var vide = document.getElementById('cpt-mail-empty'); if (vide) vide.classList.add('pub-vide');

  /* Type de publication : le site refait les boutons à chaque choix ; on leur rend leur forme de pavé à chaque fois */
  var OU = { 'Communiqué': ['cp', 'Dans la salle de presse'], 'Veille': ['veille', 'Dans l’espace adhérent'], 'Actualité': ['actu', 'Dans les actualités'] };
  function paves(){
    var seg = document.getElementById('pub-type'); if (!seg) return;
    seg.querySelectorAll('button').forEach(function(b){
      if (b.querySelector('.pub-type-t')) return;
      var l = b.textContent.trim(), o = OU[l]; if (!o) return;
      b.dataset.pub = o[0];
      b.innerHTML = '<span class="pub-type-t ea-pave-n">' + b.innerHTML + '</span><span class="pub-type-d ea-pave-d" aria-hidden="true">' + o[1] + '</span>';
    });
  }
  paves();
  var seg = document.getElementById('pub-type');
  if (seg && !seg.__eaObs) { seg.__eaObs = new MutationObserver(paves); seg.__eaObs.observe(seg, { childList: true }); }

  /* Sommaire : quatre pavés qui mènent aux parties ; les nombres sont lus sur la page */
  var nombre = function(id){ var e = document.getElementById(id); var m = e && e.textContent.match(/\\d+/); return m ? +m[0] : 0; };
  var dire = function(n, un, plusieurs, aucun){ return n === 0 ? aucun : n + ' ' + (n > 1 ? plusieurs : un); };
  var PARTIES = [
    ['messages-admin', 'messages', 'Messages des adhérents', function(){ return dire(nombre('msg-count'), 'message', 'messages', 'Aucun message'); }],
    ['pub-publications', 'publications', 'Publications', function(){ return 'Communiqué, veille, actualité'; }],
    ['comptes-admin', 'comptes', 'Comptes des adhérents', function(){ return dire(nombre('cpt-count'), 'compte', 'comptes', 'Aucun compte'); }],
    ['lettre', 'lettre', 'Lettre d’information', function(){ return dire(nombre('nl-count'), 'abonné', 'abonnés', 'Aucun abonné'); }]
  ];
  var nav = document.createElement('nav'); nav.className = 'pub-sommaire'; nav.setAttribute('aria-label', 'Parties de « Publier sur le site »');
  nav.innerHTML = '<ul>' + PARTIES.map(function(x){ return '<li><a href="#espace" data-pub-cible="' + x[0] + '">' + (PAST[x[1]] || '') + '<span class="pub-s"><span class="pub-s-t ea-pave-n">' + x[2] + '</span><span class="pub-s-n ea-pave-d" data-pub-n="' + x[0] + '"></span></span></a></li>'; }).join('') + '</ul>';
  admin.insertBefore(nav, admin.firstChild);
  function compter(){ PARTIES.forEach(function(x){ var s = nav.querySelector('[data-pub-n="' + x[0] + '"]'); var t = x[3](); if (s && s.textContent !== t) s.textContent = t; }); }
  compter();
  ['msg-count', 'cpt-count', 'nl-count'].forEach(function(id){ var e = document.getElementById(id); if (e) new MutationObserver(compter).observe(e, { childList: true, characterData: true, subtree: true }); });
  nav.addEventListener('click', function(e){
    var a = e.target.closest('a[data-pub-cible]'); if (!a) return;
    e.preventDefault();
    var sec = document.getElementById(a.dataset.pubCible); if (!sec) return;
    sec.scrollIntoView({ block: 'start', behavior: 'auto' });
    var h = sec.querySelector('h2'); if (h) { if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
  });
})();`;
module.exports = { css, script };
