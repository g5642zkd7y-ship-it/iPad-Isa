# CLAUDE.md : projet « Site SLBC »

Ce fichier donne à Claude Code le contexte du projet. Lis-le en entier avant toute modification.

## Le projet

Maquette de refonte du site du **SLBC (Syndicat des Laboratoires de Biologie Clinique)**, syndicat de biologistes médicaux libéraux, 6 place de la Madeleine, 75008 Paris, contact@slbc.fr. Site actuel : https://www.slbc.fr (WordPress, réalisé par l’agence Kstudio).

La maquette doit être présentée au bureau du SLBC. Toute la rédaction est en **français**. La porteuse du projet n’est pas développeuse : explique tes choix simplement, sans jargon, et montre le résultat plutôt que le code.

Objectifs exprimés pour le site :
- un rendu professionnel, inspiré des sites des grandes marques (Apple en particulier) et **pas « généré par IA »** ;
- pouvoir **publier des communiqués de presse et des informations de veille réglementaire** facilement ;
- garder les éléments indispensables du site actuel (bureau, conseil, représentants, URPS, comptes, NABM, documentation, adhésion). La charte du SLBC (valeurs) a été retirée du site le 5 novembre 2026 à la demande d’Isabelle Eimer : les missions la remplacent.

## État actuel

- `site/index.html` : page unique ; menu du haut avec un onglet « Accueil » (6 novembre 2026) ; navigation par ancre (`#accueil`, `#syndicat`, `#veille`, `#presse`, `#actualites`, `#documentation`, `#adherer`, `#espace`, `#mentions`).
- `site/assets/styles.css` : styles, avec les jetons de couleur et de typographie dans `:root`.
- `site/assets/app.js` : contenu (tableaux `DATA`, `BUREAU`, `INSTANCES`, `CA`, `URPS`, etc. en tête de fichier), rendu, routeur, recherche, formulaires.
- HTML, CSS et JavaScript simples, **sans outil de construction**. Pour prévisualiser : ouvrir `site/index.html` dans un navigateur, ou lancer `python3 -m http.server` dans `site/`.
- L’« Espace adhérent » est une **démonstration** : la connexion accepte n’importe quel identifiant, et les publications sont gardées uniquement dans le navigateur (`localStorage`, clé `slbc-maquette-publications`). Aucune donnée n’est envoyée.
- **Lettre d’information** (démonstration) : inscription avec consentement sur la page Veille, envoi optionnel aux abonnés à chaque publication (objet, aperçu de l’e-mail), rubrique « Lettre d’information » de l’espace adhérent (abonnés, derniers envois). Données gardées dans le navigateur (clés `slbc-maquette-abonnes`, `slbc-maquette-envois`) ; aucun e-mail n’est envoyé. Mise en place réelle : `docs/lettre-information.md`.
- **Informations légales** (`#mentions`, reliée au pied de page) : mentions légales, données personnelles, cookies. Textes proposés, à valider par le bureau et à faire relire par un juriste ; les éléments manquants sont marqués « à compléter ». Mentions courtes sous les formulaires d’adhésion et de lettre d’information ; civilité facultative. Synthèse des obligations, sources et liste de ce qui reste à fournir : `docs/obligations-legales.md`.
- Version publiée de la maquette (privée) : https://claude.ai/artifact/Vse2Nq8YweogmxHKpnrjRR
- `docs/contexte.md` : le syndicat, ses chantiers et l’état des dossiers législatifs (protocole, PLFSS), à jour au 4 novembre 2026.
- Salle de presse : seulement les communiqués de 2026 (décision d’Isabelle Eimer du 6 novembre 2026 ; ceux de 2024, 2019 et 2014 ont été retirés). Tant qu’elle est vide, elle annonce le communiqué sur la signature du protocole 2027-2029 ; le filtre par année n’apparaît que s’il y a plusieurs années.
- Documents publiés (PDF) : dossier `site/documents/`, liés par un chemin relatif (`documents/nom.pdf`) ; à joindre à la publication de la maquette. Premier document : le protocole 2027-2029 signé (entrée `p4` de la salle de presse, avec ses points clés, chacun renvoyant à un article du texte).
- Ajouter un communiqué : nouvelle entrée dans `DATA.presse` (`site/assets/app.js`) avec `id` unique (p4, p5… ; p1 à p3 ont servi aux communiqués retirés), `date` au format AAAA-MM-JJ (elle fixe l’ordre d’affichage), `year` (les 4 chiffres de la date, pour le filtre), `title`, `with`, `chapo`, `url` du PDF ou de la page (ou `documents/nom.pdf`), `linkLabel`, et facultativement `pointsTitle` et `points` (paires [intitulé, texte]) ; `dateLabel` facultatif si seule l’année est connue. Puis republier la maquette.
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
- Animations rares et porteuses de sens (demandes d’Isabelle Eimer du 6 novembre 2026 : « attractif mais professionnel », « pas IA like ») : ouverture de l’accueil (les deux ronds se rejoignent, puis le nom et la devise apparaissent), filet vert des trois piliers et frise du protocole qui se tracent, soulignement vert de l’onglet de la page en cours, légère ombre de l’en-tête au défilement. À ne pas ajouter, car typique des sites générés ou des modèles : apparition en fondu de chaque bloc au défilement, cascades, cartes qui se soulèvent au survol, halos, pulsations, mouvement continu. Réglages : bloc « Mouvement » de `styles.css`, `setupMotion()` de `app.js`. Respecter `prefers-reduced-motion` (sans la classe `js-motion`, tout s’affiche directement).
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


