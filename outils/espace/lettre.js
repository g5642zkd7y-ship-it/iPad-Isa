// Proposition « Pages réservées aux adhérents » (11 novembre 2026) : rubrique « Lettre d'information » (#ea-lettre).
// Ajoutée après la partie commune (base.js). Le site n'est pas modifié : mêmes champs, mêmes identifiants, même fonctionnement.
// - titre de rubrique commun (pastille au journal, titre, la phrase de la porte « La lettre d'information », filet vert foncé) ;
// - à gauche, l'inscription dans une carte vert foncé, la couleur de la porte : le rythme des envois en deux lignes à filets
//   (repris de la phrase déjà présente : « La veille chaque lundi, et les nouvelles publications du SLBC dès leur mise en ligne »),
//   puis l'e-mail, l'accord, le bouton et la mention ;
// - à droite, « Exemple d'envoi » : l'e-mail tel que le reçoivent les abonnés, sur le modèle de l'aperçu de « Publier sur le site »
//   (même en-tête au logo, même pied), rempli avec le dernier communiqué public déjà affiché sur l'accueil (rien d'inventé) ;
//   « À : » suit l'adresse saisie dans le formulaire.
const css = `
/* Deux colonnes : l'inscription, puis l'exemple d'envoi */
#ea-lettre .ea-lettre{max-width:none!important;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.08fr);gap:28px;align-items:stretch}
/* Carte d'inscription en vert foncé, comme la porte (textes, erreurs et focus en blanc : règles .side-dark du site) */
#ea-lettre #abonnement{gap:20px!important;padding:var(--ea-pad-carte)!important;background:var(--vert)!important;border-radius:var(--r-card)}
#ea-lettre #abonnement .h-block{color:#fff}
#ea-lettre .lt-masque{display:none!important}
/* Rythme des envois : deux lignes à filets fins */
#ea-lettre .lt-rythme{display:grid;grid-template-columns:auto minmax(0,1fr);margin:0 0 6px;border-top:1px solid rgba(255,255,255,.4)}
#ea-lettre .lt-rythme dt,#ea-lettre .lt-rythme dd{margin:0;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.4);font-size:16px;line-height:1.4}
#ea-lettre .lt-rythme dt{padding-right:22px;font-weight:800;white-space:nowrap}
#ea-lettre .lt-rythme dd{color:#fff}
#ea-lettre #abonnement .input{border-color:#fff}
#ea-lettre #abonnement .check-line input{accent-color:#fff}
#ea-lettre #abonnement .check-line{font-size:15.5px}
#ea-lettre #abonnement > button[type="submit"]{align-self:flex-start;min-width:200px;padding-inline:32px;margin-top:2px}
#ea-lettre #abonnement .form-note{margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.4)}
#ea-lettre #sub-ok{padding:12px 16px;border-radius:var(--ea-r-pave);background:rgba(46,50,54,.2);border-left:4px solid var(--anis)}
/* Exemple d'envoi : l'e-mail sur fond clair, sans ombre */
#ea-lettre .lt-exemple{margin:0}
#ea-lettre .lt-exemple-t{display:flex;flex-wrap:wrap;align-items:baseline;column-gap:10px;margin:0 0 16px;font-size:21px;line-height:1.25;font-weight:800;letter-spacing:-.01em;color:var(--encre)}
#ea-lettre .lt-exemple-t span{font-size:15px;font-weight:400;color:var(--gris)}
#ea-lettre .lt-exemple .lt-de-a{display:flex;flex-wrap:wrap;column-gap:22px}
#ea-lettre .lt-exemple .mp-head{padding-top:16px}
#ea-lettre .lt-exemple .mail-preview{border-radius:var(--ea-r-pave)!important;box-shadow:0 0 0 1px var(--filet-fort)!important}
#ea-lettre .lt-exemple .mp-text{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}
/* Écrans étroits : repli simple, à vérifier après le choix (téléphones et tablettes non testés) */
@media (max-width:900px){#ea-lettre .ea-lettre{grid-template-columns:minmax(0,1fr)}#member #ea-lettre #abonnement,#member #ea-lettre .lt-exemple{padding:24px 20px!important}#ea-lettre .lt-rythme{grid-template-columns:minmax(0,1fr)}#ea-lettre .lt-rythme dt{padding-bottom:0;border-bottom:0}#ea-lettre .lt-rythme dd{padding-top:2px}}
`;
const script = `(function(){
  var panel = document.getElementById('ea-lettre'); if (!panel) return;
  var form = document.getElementById('abonnement'); if (!form) return;
  /* Titre de rubrique commun, avec la phrase de la porte « La lettre d'information » */
  if (window.EA_TITRE) window.EA_TITRE('ea-lettre', 'lettre', 'La lettre d’information', 'La veille et les nouvelles publications du SLBC, par e-mail.');
  if (form.dataset.eaLettre) return; form.dataset.eaLettre = '1';
  /* Sous le titre de rubrique (h2), le titre du formulaire devient un sous-titre (h3), même texte */
  var h = form.querySelector(':scope > h2');
  if (h) { var h3 = document.createElement('h3'); h3.className = h.className + ' ea-sous-titre h-block-blanc'; h3.textContent = h.textContent; h.replaceWith(h3); h = h3; }
  /* La phrase du formulaire, mise en deux lignes : chaque lundi, la veille ; dès leur mise en ligne, les nouvelles publications */
  var p = h && h.nextElementSibling;
  if (p && p.tagName === 'P') {
    p.classList.add('lt-masque');
    p.insertAdjacentHTML('afterend', '<dl class="lt-rythme"><dt>Chaque lundi</dt><dd>La veille réglementaire</dd><dt>Dès leur mise en ligne</dt><dd>Les nouvelles publications du SLBC</dd></dl>');
  }
  /* Exemple d'envoi : modèle de l'aperçu de « Publier sur le site » (en-tête au logo et pied repris tels quels),
     rempli avec le dernier communiqué public, celui de l'accueil */
  var cp = document.getElementById('home-cp-in');
  var tEl = cp && cp.querySelector('.hcp-title');
  var titre = ''; if (tEl) { var tc = tEl.cloneNode(true); tc.querySelectorAll('.p-subtitle').forEach(function(x){ x.remove(); }); titre = tc.textContent.replace(/\\s+/g, ' ').trim(); }
  var chapo = cp && cp.querySelector('.hcp-chapo') ? cp.querySelector('.hcp-chapo').textContent.trim() : '';
  var date = cp && cp.querySelector('.p-date') ? cp.querySelector('.p-date').textContent.trim() : '';
  var modele = document.getElementById('mail-preview');
  if (!titre || !modele) return;
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var tete = modele.querySelector('.mp-head').cloneNode(true);
  tete.querySelectorAll('[id]').forEach(function(x){ x.id = x.id + '-lettre'; });
  tete.querySelectorAll('[clip-path]').forEach(function(x){ x.setAttribute('clip-path', x.getAttribute('clip-path').replace(')', '-lettre)')); });
  var pied = modele.querySelector('.mp-foot').cloneNode(true);
  var fig = document.createElement('figure'); fig.className = 'lt-exemple ea-carte-claire';
  fig.innerHTML = '<figcaption class="lt-exemple-t">Exemple d’envoi<span>avec le dernier communiqué' + (date ? ', du ' + esc(date) : '') + '</span></figcaption>' +
    '<div class="mail-preview"><div class="mp-meta"><span class="lt-de-a"><span><strong>De\\u00a0:</strong> SLBC</span><span><strong>À\\u00a0:</strong> <span class="lt-a"></span></span></span><span><strong>Objet\\u00a0:</strong> ' + esc(titre) + '</span></div>' +
    tete.outerHTML +
    '<div class="mp-body"><p class="mp-type">Communiqué</p><p class="mp-title">' + esc(titre) + '</p>' + (chapo ? '<p class="mp-text">' + esc(chapo) + '</p>' : '') + '<span class="mp-btn">Lire sur le site</span></div>' +
    pied.outerHTML + '</div>';
  form.parentNode.appendChild(fig);
  /* « À : » suit l'adresse saisie (à défaut, celle de la connexion) */
  var champ = document.getElementById('sub-email'), qui = document.getElementById('member-who'), a = fig.querySelector('.lt-a');
  var majA = function(){ a.textContent = (champ && champ.value.trim()) || (qui && qui.textContent.trim()) || 'votre adresse e-mail'; };
  majA();
  if (champ) { champ.addEventListener('input', majA); champ.addEventListener('change', majA); }
  form.addEventListener('submit', function(){ setTimeout(majA, 0); });
  if (qui) new MutationObserver(majA).observe(qui, { childList: true, characterData: true, subtree: true });
  new MutationObserver(majA).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
})();`;
module.exports = { css, script };
