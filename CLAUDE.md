# CLAUDE.md : projet « Site SLBC »

Ce fichier donne à Claude Code le contexte du projet. Lis-le en entier avant toute modification.

## Le projet

Maquette de refonte du site du **SLBC (Syndicat des Laboratoires de Biologie Clinique)**, syndicat de biologistes médicaux libéraux, 6 place de la Madeleine, 75008 Paris, contact@slbc.fr. Site actuel : https://www.slbc.fr (WordPress, réalisé par l’agence Kstudio).

La maquette doit être présentée au bureau du SLBC. Toute la rédaction est en **français**, y compris tous les messages adressés à la porteuse du projet (comptes rendus, questions, points d’étape) : elle l’a demandé plusieurs fois. La porteuse du projet n’est pas développeuse : explique tes choix simplement, sans jargon, et montre le résultat plutôt que le code.

Objectifs exprimés pour le site :
- un rendu professionnel, inspiré des sites des grandes marques (Apple en particulier) et **pas « généré par IA »** ;
- pouvoir **publier des communiqués de presse et des informations de veille réglementaire** facilement ;
- garder les éléments indispensables du site actuel (bureau, conseil, représentants, URPS, comptes, NABM, documentation, adhésion). La charte du SLBC (valeurs) a été retirée du site le 5 novembre 2026 à la demande d’Isabelle Eimer : les missions la remplacent.

## État actuel

- `site/index.html` : page unique ; menu du haut avec un onglet « Accueil » (6 novembre 2026) ; navigation par ancre (`#accueil`, `#syndicat`, `#veille`, `#presse`, `#actualites`, `#documentation`, `#adherer`, `#espace`, `#mentions`).
- `site/assets/styles.css` : styles, avec les jetons de couleur et de typographie dans `:root`.
- `site/assets/app.js` : contenu (tableaux `DATA`, `BUREAU`, `INSTANCES`, `CA`, `URPS`, etc. en tête de fichier), rendu, routeur, recherche, formulaires.
- HTML, CSS et JavaScript simples, **sans outil de construction**. Pour prévisualiser : ouvrir `site/index.html` dans un navigateur, ou lancer `python3 -m http.server` dans `site/`.
- L’« Espace adhérent » (refait le 6 novembre 2026 : « l’espace adhérent ne débouche sur rien », « la veille réglementaire doit être réservée à l’espace adhérent ») est une **démonstration** : la connexion accepte n’importe quel identifiant et reste valable jusqu’à la fermeture de l’onglet (`sessionStorage`, clé `slbc-maquette-session`). Une fois connecté, trois rubriques : **Veille réglementaire** (synthèse complète, textes suivis), **Lettre d’information** (inscription), **Publier** (outils du bureau : communiqués, veille, actualités, abonnés ; démonstration accessible à tout adhérent connecté). Les publications sont gardées uniquement dans le navigateur (`localStorage`, clé `slbc-maquette-publications`). Aucune donnée n’est envoyée.
- **Veille réservée aux adhérents** : la page publique `#veille` présente seulement le service (boutons « Se connecter » et « Adhérer ») ; le bandeau de l’accueil n’affiche les cartes de veille qu’aux adhérents connectés ; la recherche ne montre les textes de veille qu’aux adhérents connectés. Éléments marqués `data-guest` / `data-member` dans `index.html`, état géré par `applyMember()` dans `app.js`.
- **Lettre d’information** (démonstration) : inscription avec consentement dans l’espace adhérent (rubrique « Lettre d’information »), envoi optionnel aux abonnés à chaque publication (objet, aperçu de l’e-mail), liste des abonnés et derniers envois dans la rubrique « Publier ». Données gardées dans le navigateur (clés `slbc-maquette-abonnes`, `slbc-maquette-envois`) ; aucun e-mail n’est envoyé. Mise en place réelle : `docs/lettre-information.md`.
- **Informations légales** (`#mentions`, reliée au pied de page) : mentions légales, données personnelles, cookies. Textes proposés, à valider par le bureau et à faire relire par un juriste ; les éléments manquants sont marqués « à compléter ». Mentions courtes sous les formulaires d’adhésion et de lettre d’information ; civilité facultative. Synthèse des obligations, sources et liste de ce qui reste à fournir : `docs/obligations-legales.md`.
- Version publiée de la maquette (privée) : https://claude.ai/artifact/Vse2Nq8YweogmxHKpnrjRR
- `docs/contexte.md` : le syndicat, ses chantiers et l’état des dossiers législatifs (protocole, PLFSS), à jour au 4 novembre 2026.
- Accueil allégé (6 novembre 2026, demandes d’Isabelle Eimer) : il ne garde que la devise, le dernier communiqué, « Ce que nous défendons », le bandeau de la veille, les actualités et « Rejoindre le SLBC ». Retirés : la tuile « Négociations avec l’Assurance maladie / Protocole 2027-2029 » et sa frise (le communiqué est en haut de page), puis les sections « Nos missions », « Nos représentants » et « Documentation » (toujours accessibles par le menu et le pied de page).
- Page Le syndicat, « Nos représentants » : la Commission de hiérarchisation des actes de biologie n’affiche plus ses quatre groupes (AMP, biochimie, cytogénétique, hématologie), retirés le 6 novembre 2026 à la demande d’Isabelle Eimer ; seuls restent ses représentants. Le même jour, à sa demande : sigles entre parenthèses après le nom (champ `a` de `INSTANCES` : CHAB, CCPNI tel que dicté, à confirmer car les initiales donnent CCPN), « Commission nationale permanente de biologie médicale (CNPBM) » à la place de « Commission nationale de biologie médicale », nouvelle ligne « Comité de suivi du protocole » (nom de l’article 2 du protocole signé, représentant à désigner), puis les commissions paritaires nationale et régionale des structures pluriprofessionnelles (représentants à désigner).
- Accueil : juste sous la devise, le **dernier communiqué de presse** (demande d’Isabelle Eimer du 6 novembre 2026, en gardant le design initial) : date, titre, chapeau, citation, liens vers la salle de presse et vers le document joint. Section `#home-cp`, remplie par `renderHomeCp()` avec le communiqué public le plus récent de `DATA.presse` (ceux réservés aux adhérents n’y figurent pas).
- Salle de presse : seulement les communiqués de 2026 (décision d’Isabelle Eimer du 6 novembre 2026 ; ceux de 2024, 2019 et 2014 ont été retirés). Si elle est vide, elle affiche « Aucun communiqué pour l’instant. » ; le filtre par année n’apparaît que s’il y a plusieurs années.
- Documents publiés (PDF) : dossier `site/documents/`. Dans claude.ai, la maquette est affichée dans un cadre protégé qui bloque l’ouverture directe d’un PDF (constaté le 6 novembre 2026 : Isabelle Eimer ne pouvait pas ouvrir le protocole). Chaque document est donc lu dans une **liseuse** intégrée : ses pages sont converties en images (`pdftoppm -r 150 -jpeg`, fond blanchi, dans `site/documents/<nom>/page-01.jpg`…) et déclarées dans le registre `DOCS` de `app.js` (titre, nombre de pages, dimensions, nom du fichier). Un lien `data-doc` ouvre la liseuse. « Enregistrer le PDF » passe par la capacité `downloads` de claude.ai (à déclarer à la publication : `capabilities: {downloads: true}`) ; hors de tout cadre (site réel, aperçu local), un simple lien de téléchargement ; dans un cadre sans cette capacité, aucun bouton (il ne marcherait pas). À l’ouverture, le focus va sur les pages : Espace, flèches et Page suivante font défiler, Échap ferme. À la publication, joindre le PDF et toutes ses images (paramètre `files`). Premier document : le protocole 2027-2029 signé, joint au communiqué du SLBC du 4 novembre 2026 (entrée `p4` de la salle de presse : texte du communiqué repris mot pour mot, fautes de l’original corrigées à la demande d’Isabelle Eimer, citation de Thierry Bouchet, texte intégral dépliable).
- Ajouter un communiqué : nouvelle entrée dans `DATA.presse` (`site/assets/app.js`) avec `id` unique (p4, p5… ; p1 à p3 ont servi aux communiqués retirés), `date` au format AAAA-MM-JJ (elle fixe l’ordre d’affichage), `year` (les 4 chiffres de la date, pour le filtre), `title`, `with`, `chapo`, `url` du PDF ou de la page (ou `documents/nom.pdf`), `linkLabel`, et facultativement `subtitle`, `quote` ({ text, by }), `body` (intertitres `h` et paragraphes `ps`, affichés dans « Lire le communiqué en entier »), `pointsTitle` et `points` (paires [intitulé, texte]) ; `dateLabel` facultatif si seule l’année est connue. Puis republier la maquette.
- Adresse de contact unique : constante `CONTACT_EMAIL` en tête de `site/assets/app.js`. Décisions d’Isabelle Eimer du 6 novembre 2026 : une seule adresse pour le contact général, le contact presse et les demandes d’adhésion ; pas de téléphone affiché. Tous les éléments `data-contact` la reprennent (liens `mailto:` pour les balises `<a>`) : salle de presse, formulaire d’adhésion (étape 3, confirmation, mention sous le formulaire), informations légales, pied de page. Provisoirement `contact@slbc.fr` : remplacer par l’adresse définitive quand Isabelle Eimer la donne, puis republier. Si elle est vidée, la maquette affiche « adresse à compléter ». Ne pas écrire d’adresse de contact en dur dans `index.html`.
- Lien LinkedIn : constante `LINKEDIN_URL` en tête de `site/assets/app.js` (page https://www.linkedin.com/company/slbc-syndicat-des-laboratoires-de-biologie-clinique/), reliée au pied de page et au bloc « Contact presse ». Si elle est vidée, un clic affiche « Adresse de la page LinkedIn du SLBC à compléter. »

## Règles de marque (validées, ne pas modifier sans accord)

- **Logo validé** : deux ronds qui se chevauchent, le rond gris `#5E6266` en haut à gauche, le rond vert anis `#A3BE3C` en bas à droite, la zone commune en vert foncé `#5F7A2B`. Nom « SLBC » en **Nunito Black 900**, signature « Syndicat des Laboratoires / de Biologie Clinique » en Nunito Bold 700 (seconde ligne en vert foncé). Fichiers dans `marque/`.
- Dans le code, **écris les couleurs du logo directement en attributs `fill`** sur chaque cercle. Un symbole réutilisé avec `<use>` a déjà fait apparaître les ronds en noir.
- **Palette** : vert anis `#A3BE3C`, vert foncé `#5F7A2B`, vert clair `#D6E4A6`, gris cellule `#5E6266`, gris texte `#3F4347`, encre `#2E3236`, fond clair `#F7F8F4`, blanc. Le vert anis ne sert **jamais** pour du texte sur fond clair (contraste 2,1:1).
- **Polices** : Nunito pour le logo uniquement ; Figtree pour tous les textes du site. Point ouvert : la charte (`marque/CHARTE.md`) indique encore Nunito pour le texte courant ; à mettre à jour si Figtree est validée.
- Thème clair uniquement, choisi pour que le logo reste dans ses couleurs validées.

## Règles de contenu

- **Devise** : « Défendre la biologie, défendre les patients. » (grand titre de l’accueil, sous le logo, bannières). Dans les textes : « Défendre la biologie médicale, c’est défendre les patients. » Choisie avec Isabelle Eimer le 5 novembre 2026, à valider par le bureau.
- **Note de positionnement** du 10 septembre 2026 (document de travail, à valider par Thierry Bouchet et le bureau) : textes repris le 5 novembre 2026 avec Isabelle Eimer. Accueil « Ce que nous défendons » en trois piliers (la fierté d’un métier essentiel ; la souveraineté du diagnostic ; la science au cœur de la décision publique) ; introduction de la page Le syndicat (« Nous ne venons pas défendre un acquis, nous venons proposer un avenir. ») ; Adhérer (« Un métier essentiel mérite un syndicat à sa hauteur. ») ; Veille (« Une décision de santé se fonde sur des données, pas sur des opinions. »). Ne pas reprendre : « La pluralité des acteurs, l’unité des idées », la critique des fédérations, la signature « Oser réinventer le métier ». Le nom reste SLBC, Syndicat des Laboratoires de Biologie Clinique.
- **Experts** (avocate, service social, expert-comptable) : ils conseillent le syndicat, pas les adhérents. Ne pas les présenter comme un service aux adhérents (retirés du site le 5 novembre 2026 à la demande d’Isabelle Eimer).
- **Missions** : 4 missions (représenter et défendre ; une biologie de qualité accessible à tous ; le biologiste acteur de santé ; préparer l’avenir du métier), en une seule liste qui remplace les anciennes missions et priorités. Le thème de l’indépendance face à la financiarisation a été retiré à la demande d’Isabelle Eimer.

- **N’invente aucun fait** : chiffre, date, nom, texte de loi ou citation. Le contenu vient du site actuel ou de sources officielles (Légifrance, assemblee-nationale.fr, senat.fr). Ce qui manque reste un emplacement à compléter, signalé comme tel.
- Le Dr Jean-François Perotto est décédé (actualité du 31 août 2026). Il a été retiré des listes ; ses sièges apparaissent « à désigner ».
- Points à faire confirmer par le bureau : voir `docs/sources-et-verifications.md`.
- Ton : sobre, phrases courtes, voix active, sans majuscules décoratives.
- Pas de rendu « généré par IA » (rappel d’Isabelle Eimer du 6 novembre 2026) : pas de pictogrammes décoratifs ni de listes à coches, pas de titres-slogans (« Là où se décide… », « les instances qui comptent »), pas de formules chiffrées ou exagérées (« Trois étapes, deux minutes », « en temps réel »). Titres descriptifs, faits vérifiables.

## Conventions de conception

- Une idée par section ; alternance fond blanc, fond clair et sections sombres ; listes à filets fins plutôt que piles de cartes.
- Animations rares et porteuses de sens (demandes d’Isabelle Eimer du 6 novembre 2026 : « attractif mais professionnel », « pas IA like ») : **signature** — les deux ronds du logo se rapprochent à l’ouverture de chaque page (grands ronds de l’accueil, rejoués à chaque retour ; petite signature au-dessus du titre des autres pages, couleurs du logo pour fond sombre sur la Veille ; logo de la carte de connexion de l’espace adhérent ; fonction `joinCircles()` de `app.js`) ; à la première ouverture de l’accueil, le nom et la devise apparaissent ensuite ; séparateur sous la devise (les deux ronds se rejoignent puis un trait vert anis de 2 px se déploie), filet vert des trois piliers qui se trace, soulignement vert de l’onglet de la page en cours, légère ombre de l’en-tête au défilement. À ne pas ajouter, car typique des sites générés ou des modèles : apparition en fondu de chaque bloc au défilement, cascades, cartes qui se soulèvent au survol, halos, pulsations, mouvement continu. Réglages : bloc « Mouvement » de `styles.css`, `setupMotion()` de `app.js`. Respecter `prefers-reduced-motion` (sans la classe `js-motion`, tout s’affiche directement).
- En-tête (6 novembre 2026, demande d’Isabelle Eimer) : bandeau « Maquette de travail » en 15 px, logo 36 px et « SLBC » en 27 px, onglets en 18 px, sous-menus des pages en 17 px ; menu complet au-dessus de 1100 px de large, menu compact en dessous.
- Accessibilité : contraste d’au moins 4,5:1, focus clavier visible, vrais `<button>` et `<a href>`, libellés sur tous les champs.
- Le site doit fonctionner à la largeur d’un téléphone (390 px) sans défilement horizontal.

## Pistes pour la suite

1. Faire valider la police des textes, puis mettre à jour la charte.
2. Ajouter des pages de détail (article, communiqué, fiche de veille).
3. Préparer l’intégration réelle avec Kstudio (thème WordPress ou autre outil de gestion de contenu), avec de vrais comptes pour l’espace adhérent.
4. Brancher la veille réglementaire hebdomadaire (déjà produite chaque lundi par Claude) sur la rubrique Veille.

## Ressources liées (privées, compte claude.ai de la porteuse du projet)

- Charte graphique : https://claude.ai/artifact/EhTqyWrkSQibEFKKZiydUK
- Présentation du nouveau logo au bureau : https://claude.ai/artifact/KCR59a2h3UqryejFXh9NNE
- Planche des pistes de logo : https://claude.ai/artifact/5XjHgFR5MJBjyEWxmWh8LC
- Quatre pistes graphiques pour l’accueil (6 novembre 2026 ; palette et logo conservés : éditoriale, rigueur scientifique, couleur affirmée, les deux cercles), avec à gauche une capture de l’accueil de la maquette actuelle pour comparaison : https://claude.ai/artifact/PE61R8Fy1wYjHGFckEHqbq


