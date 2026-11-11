// Proposition « Pages réservées aux adhérents » (11 novembre 2026) : rubrique « Écrire au bureau » (#ea-ecrire).
// Ajoutée après la partie commune (base.js). Le site n'est pas modifié : mêmes champs, mêmes identifiants, même fonctionnement.
// - titre de rubrique commun (pastille au porte-voix, titre, la phrase déjà présente sur la page, filet vert clair de la porte) ;
// - l'objet en trois pavés à choisir (les vrais boutons radio restent, invisibles mais actifs au clavier et pour les lecteurs d'écran),
//   chacun avec sa pastille : deux biologistes (commission), l'ampoule (suggestion), un point d'interrogation écrit au marqueur comme
//   les chiffres des missions (question) ; le pavé choisi passe en vert clair, la couleur de la porte (le trait au marqueur reste
//   réservé aux portes, qui servent de menu) ;
// - le formulaire dans une carte blanche calme, champs sur deux colonnes (à gauche commission, nom, e-mail ; à droite le message) ;
// - « Vos messages » dans une carte fond clair sous le formulaire, avec un état vide net.
const css = `
/* Titre commun : l'ancien titre et sa phrase, repris par le titre de rubrique, ne se répètent pas */
#ea-ecrire .ecr-masque{display:none!important}
/* Une colonne : le formulaire, puis vos messages */
#ea-ecrire .ecrire{display:flex!important;flex-direction:column;align-items:stretch!important;gap:20px}
/* Carte du formulaire : blanche, filet fin, sans ombre */
#ea-ecrire .ecrire-form{gap:24px!important}
/* Objet : trois pavés */
#ea-ecrire .ecrire-sujets{gap:0!important}
#ea-ecrire .ecrire-sujets legend{margin-bottom:12px;font-size:16px;font-weight:700}
#ea-ecrire .ecr-paves{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
#ea-ecrire .ecr-pave{position:relative;display:flex!important;align-items:center;gap:12px;min-height:76px;margin:0!important;padding:12px 18px 12px 12px!important;border:1px solid var(--filet);border-radius:var(--ea-r-pave);background:var(--fond);color:var(--encre);cursor:pointer;transition:background-color .2s,border-color .2s}
#ea-ecrire .ecr-pave input{position:absolute;inset:0;z-index:1;width:100%!important;height:100%!important;margin:0!important;opacity:0;cursor:pointer}
#ea-ecrire .ecr-pave .ea-pastille{flex:none;width:52px;height:auto;margin:-4px 0 -4px -2px}
#ea-ecrire .ecr-pave-t{display:block;text-wrap:balance}
@media (hover:hover){#ea-ecrire .ecr-pave:not(:has(input:checked)):hover{background:#fff;border-color:var(--vert)}}
#ea-ecrire .ecr-pave:has(input:checked){background:var(--vert-clair);border-color:var(--vert);box-shadow:inset 0 0 0 1px var(--vert)}
#ea-ecrire .ecr-pave:has(input:focus-visible){outline:3px solid var(--vert);outline-offset:3px}
@media (forced-colors:active){#ea-ecrire .ecr-pave:has(input:checked){border:3px solid Highlight}}
/* Champs : à gauche commission, nom, e-mail ; à droite le message, à la même hauteur */
#ea-ecrire .ecr-champs{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:20px 28px;align-items:stretch}
#ea-ecrire .ecr-gauche{display:flex;flex-direction:column;gap:18px;min-width:0}
#ea-ecrire .ecr-droite{display:flex;flex-direction:column;min-width:0}
#ea-ecrire .ecr-droite .field{flex:1}
#ea-ecrire .ecr-droite textarea.input{flex:1;min-height:168px}
/* Pied du formulaire : le bouton, et à côté les deux mentions ; la confirmation dessous */
#ea-ecrire .ecr-pied{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:28px;row-gap:6px;align-items:center;padding-top:22px;border-top:1px solid var(--filet)}
#ea-ecrire .ecr-pied > button[type="submit"]{grid-column:1;grid-row:1 / span 2;align-self:center;padding-inline:30px}
#ea-ecrire .ecr-pied > .form-note{grid-column:2}
#ea-ecrire .ecr-pied > #ecrire-ok{grid-column:1 / -1;grid-row:3;margin-top:10px;padding:14px 18px;border-radius:var(--ea-r-pave);background:var(--fond);border-left:4px solid var(--anis)}
/* Vos messages : carte fond clair sous le formulaire */
#ea-ecrire .ecrire-side{gap:16px!important}
#ea-ecrire #ecrire-mes-messages{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;border-top:0}
#ea-ecrire #ecrire-mes-messages .msg{gap:6px;padding:16px 20px 18px;border:1px solid var(--filet-fort);border-radius:var(--ea-r-pave);background:#fff}
#ea-ecrire #ecrire-mes-messages .msg-sujet{display:inline-block;padding:2px 10px;border-radius:999px;background:var(--vert-clair);color:var(--encre);font-size:14px}
#ea-ecrire #ecrire-mes-messages .msg-meta{align-items:center}
/* État vide : un cadre en pointillés, net, sans dessin */
#ea-ecrire #ecrire-mes-messages .nl-empty{grid-column:1 / -1;padding:18px 22px;border:1.5px dashed var(--filet-fort);border-radius:var(--ea-r-pave);background:#fff;color:var(--gris);font-size:16px;line-height:1.5}
/* Écrans étroits : repli simple, à vérifier après le choix (téléphones et tablettes non testés) */
@media (max-width:900px){#ea-ecrire .ecr-paves,#ea-ecrire .ecr-champs,#ea-ecrire #ecrire-mes-messages{grid-template-columns:minmax(0,1fr)}#ea-ecrire .ecr-pied{grid-template-columns:minmax(0,1fr)}#ea-ecrire .ecr-pied > button[type="submit"],#ea-ecrire .ecr-pied > .form-note{grid-column:1;grid-row:auto;justify-self:start}#ea-ecrire .ecr-pied > #ecrire-ok{grid-row:auto}#member #ea-ecrire .ecrire-form,#member #ea-ecrire .ecrire-side{padding:22px 20px!important}}
`;
const script = `(function(){
  var panel = document.getElementById('ea-ecrire'); if (!panel) return;
  var form = document.getElementById('ecrire-form'); if (!form) return;
  /* Titre de rubrique commun, avec la phrase déjà présente sur la page */
  if (window.EA_TITRE) window.EA_TITRE('ea-ecrire', 'voix', 'Écrire au bureau', 'Partager votre expérience dans une commission, faire une suggestion, poser une question\\u00a0: écrivez au bureau du SLBC.');
  if (form.dataset.eaEcrire) return; form.dataset.eaEcrire = '1';
  var h = form.querySelector(':scope > h2'); if (h) { h.classList.add('ecr-masque'); var p = h.nextElementSibling; if (p && p.tagName === 'P') p.classList.add('ecr-masque'); }
  /* Cartes et sous-titre communs aux rubriques */
  form.classList.add('ea-carte-blanche');
  var side = panel.querySelector('.ecrire-side'); if (side) { side.classList.add('ea-carte-claire'); var hs = side.querySelector('h3'); if (hs) hs.classList.add('ea-sous-titre'); }
  /* Pastilles des trois objets : celles du site (deux biologistes, ampoule) et un point d'interrogation écrit au marqueur */
  var P = window.EA_PASTILLES || {};
  var cadre = window.EA_CADRE || function(){ return ''; };
  var QUESTION = cadre('<path class="mnum-digit" pathLength="1" d="M33.5 30 Q34 21 42.5 21 Q51 21 51 29.5 Q51 35 45.5 38 Q42 40 42 46.5" stroke-width="4.6"/><circle class="mnum-fill" cx="42" cy="55.5" r="3.3" fill="#2E3236" stroke="none"/>');
  var PAST = { commission: P.commission || '', suggestion: P.suggestion || '', question: QUESTION };
  var fs = form.querySelector('.ecrire-sujets');
  if (fs) {
    var grille = document.createElement('div'); grille.className = 'ecr-paves';
    fs.querySelectorAll('label.check-line').forEach(function(l){
      var r = l.querySelector('input[name="ecrire-sujet"]'); var t = l.querySelector('span');
      l.classList.add('ecr-pave');
      if (r) r.insertAdjacentHTML('afterend', PAST[r.value] || '');
      if (t) t.classList.add('ecr-pave-t', 'ea-pave-n');
      grille.appendChild(l);
    });
    fs.appendChild(grille);
  }
  /* Champs sur deux colonnes : commission, nom et e-mail à gauche ; le message à droite */
  var inst = document.getElementById('ecrire-inst-wrap');
  var nom = document.getElementById('ecrire-nom'), mail = document.getElementById('ecrire-email'), msg = document.getElementById('ecrire-msg');
  if (inst && nom && mail && msg) {
    var champs = document.createElement('div'); champs.className = 'ecr-champs';
    var g = document.createElement('div'); g.className = 'ecr-gauche';
    var d = document.createElement('div'); d.className = 'ecr-droite';
    inst.parentNode.insertBefore(champs, inst);
    g.appendChild(inst); g.appendChild(nom.closest('.field')); g.appendChild(mail.closest('.field'));
    d.appendChild(msg.closest('.field'));
    champs.appendChild(g); champs.appendChild(d);
  }
  /* Pied : bouton d'envoi, confirmation, mentions */
  var btn = form.querySelector('button[type="submit"]');
  if (btn) {
    var pied = document.createElement('div'); pied.className = 'ecr-pied';
    btn.parentNode.insertBefore(pied, btn);
    pied.appendChild(btn);
    var ok = document.getElementById('ecrire-ok'); if (ok) pied.appendChild(ok);
    form.querySelectorAll(':scope > .form-note').forEach(function(n){ pied.appendChild(n); });
  }
  /* Liste vide tant que le site ne l'a pas remplie (même texte que le site) */
  var liste = document.getElementById('ecrire-mes-messages');
  if (liste && !liste.children.length) liste.innerHTML = '<li class="nl-empty">Aucun message envoyé pour l’instant.</li>';
})();`;
module.exports = { css, script };
