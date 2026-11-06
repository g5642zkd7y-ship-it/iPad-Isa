# Contexte du projet — SLBC

Note de travail rédigée le 4 novembre 2026 à partir des artefacts existants sur claude.ai. À relire avant toute nouvelle demande.

## Qui, quoi

- **Utilisatrice** : Isabelle Eimer, vice-présidente du **SLBC** (Syndicat des Laboratoires de Biologie Clinique), administratrice Grand Est, membre du groupe de travail « Protocole ».
- **SLBC** : syndicat de biologistes médicaux libéraux, 6 place de la Madeleine, 75008 Paris, contact@slbc.fr, site actuel slbc.fr.
- **Bureau** (communiqué par Isabelle Eimer le 5 novembre 2026) : Thierry Bouchet (président) ; Antoine Crinquette, Pascal Melin, Isabelle Eimer (vice-présidents) ; Nicolas Roquigny (secrétaire général) ; Éric Flatin et Alexandre Guiard (membres du bureau). Contact presse : Laurent Kbaier (indiqué par Isabelle Eimer le 5 novembre 2026) ; son nom n’est pas affiché sur le site (demande du 6 novembre 2026), seule l’adresse de contact l’est.
- **Autres syndicats** : SDBIO, SNMB, Les Biologistes Médicaux (ex-SDB/SJBM), regroupés pour partie dans la FBM.

## Chantiers en cours (artefacts)

| Chantier | Artefact | État |
| --- | --- | --- |
| Charte graphique (DESIGN.md) | https://claude.ai/artifact/EhTqyWrkSQibEFKKZiydUK | Version de travail, à valider par le bureau |
| Nouveau logo, présentation au bureau | https://claude.ai/artifact/KCR59a2h3UqryejFXh9NNE (Slides) | Logo validé en Nunito (selon `CLAUDE.md`) ; la présentation montrait 4 polices |
| Pistes de logo (16 pistes) | https://claude.ai/artifact/5XjHgFR5MJBjyEWxmWh8LC (Design) | Exploration, dépassée par la présentation |
| Proposition de site (4 écrans) | https://claude.ai/artifact/NLN7nFYk5djBY7UqLBVL7o (Design) | Accueil, Salle de presse, Veille, Admin « Publier » |
| Maquette complète du site | https://claude.ai/artifact/Vse2Nq8YweogmxHKpnrjRR (page HTML) | La plus aboutie : 8 vues, recherche, formulaire d'adhésion, espace de publication. Source dans `site/` |
| Observations sur le projet de protocole CNAM du 16/10 | https://claude.ai/artifact/WCHaJs2YcuY3YaMeyu8YvT (Doc) | Note du 20/10/2026, 9 demandes |
| Réponse au « Pacte pour l'avenir de la biologie médicale » | https://claude.ai/artifact/71MuKdutY8w7tCvZaVPXaR (Doc) | Courrier signé N. Roquigny, 22/10/2026 |

## Identité visuelle (résumé de DESIGN.md)

- Symbole : rond gris `#5E6266` (44,44 r36) + rond vert anis `#A3BE3C` (76,76 r36), zone commune vert foncé `#5F7A2B`. Fond sombre : gris → blanc, zone commune → `#D6E4A6`.
- Couleurs : vert anis `#A3BE3C` (jamais pour du texte), vert foncé `#5F7A2B`, vert clair `#D6E4A6`, gris cellule `#5E6266`, gris texte `#3F4347`, fond sombre `#2E3236`, fond clair `#F7F8F4`.
- Polices : Nunito pour le logo (validé) ; Figtree pour les textes du site (à valider, la charte indique encore Nunito).
- Points ouverts : police des textes, valeur exacte du vert (fichier source de l'ancien logo), CMJN/Pantone.
- Charte complète : `marque/CHARTE.md`.

## Le site : principe

- Veille réglementaire chaque lundi : JO lu numéro par numéro + Assemblée + Sénat + CNAM/HAS. Réservée aux adhérents (espace adhérent) depuis le 6 novembre 2026. Chaque synthèse publie un « contrôle de couverture » (numéros du JO lus).
- Classement de chaque texte : source (Journal officiel / Parlement / Hors JO) et impact (fort / à suivre / faible).
- Espace d'administration pour publier communiqués, veille et actualités.

## Dossiers réglementaires et législatifs

### Protocole biologie 2027-2029 (Assurance maladie)

- Protocole précédent : accord du 20 décembre 2024 (SNMB, SDBIO, SLBC), gel de la nomenclature jusqu'en décembre 2026, tenu à −1 M€ près sur 2024-2026.
- Projet CNAM du 16/10/2026 : base 2026 estimée à 3 980 M€ (±10 M€), enveloppe +1 % en 2027 puis +0,8 %, IST sans ordonnance dans les actes courants, régulation 100 % en janvier puis 80 % en août, biologie délocalisée dans l'enveloppe, annexe 1 (mécanisme) vide, clause de survie jusqu'en 2031.
- Conditions de signature posées dans la note du 20/10 : (1) base = dépense réelle 2026 sans plafond ; (2) IST hors des actes courants ; (3) annexe 1 rédigée avec symétrie automatique.
- **Le SLBC a signé le protocole 2027-2029** (confirmé par Isabelle Eimer le 4 novembre 2026).
- **Texte signé** (PDF fourni par Isabelle Eimer le 6 novembre 2026, `site/documents/protocole-biologie-2027-2029.pdf`) : « Protocole d'accord sur la maîtrise des dépenses sur le champ de la biologie médicale pour la période 2027-2029 », fait à Paris le 2 novembre 2026. Signataires : UNCAM (Thomas Fatome), Les Biologistes Médicaux (Biomed, Lionel Barrand), SDBIO (Thomas Hottier), SLBC (Thierry Bouchet), SNMB (Jean-Claude Azoulay), UNOCAM (Eric Chenut).
- Contenu du texte signé : base de 3 990 M€ (ajustable de ±20 M€ au vu des comptes 2026), +1,1 % par an, enveloppes de 4 034 M€ (2027), 4 078 M€ (2028) et 4 123 M€ (2029), soit 12 235 M€ (art. 1) ; comité de suivi paritaire en novembre (dès 2026) et en juin (art. 2) ; régulation par ajustement à 100 % puis 80 % de l'écart (art. 3) ; actes nouveaux hors enveloppe, objectif non limitatif de 100 M€ d'ici 2029 (art. 4) ; maîtrise médicalisée 30 M€ en 2027 puis 10 M€ en 2028 et 2029, plan d'action d'ici le 1er janvier 2027 (art. 5) ; clause de choc exogène (art. 6) ; enveloppe santé publique (art. 7, annexe 1) ; biologie délocalisée (art. 8) ; prescription des infirmières (art. 9) ; suivi économique et de l'accès aux laboratoires (art. 10 et 11) ; critères environnementaux (art. 12) ; urgences et AMP, base relevée de 5 M€ après vote de la CHAB (art. 13, annexe 2) ; avenant conventionnel à négocier avant le 30 avril 2027 (art. 14).

### PLFSS 2027

- Rejeté par l'Assemblée nationale le 23 octobre 2026 (rejet de la partie recettes), transmis au Sénat le 2 novembre (texte n° 138, 2026-2027).
- Sénat : discussion générale à partir du 9 novembre, vote solennel annoncé le 18 novembre (à confirmer) ; délai constitutionnel le 26 novembre, puis CMP.
- Articles signalés pour les laboratoires : art. 27 (stocks de vaccins et vaccination en laboratoire), art. 32 (encadrement de la facturation en tiers payant). Pas de baisse tarifaire de biologie dans le texte.

### Propositions de loi « financiarisation »

- PPL n° 2956 (déposée le 23 juin 2026), indiquée sur la maquette comme portant sur la financiarisation : intitulé à vérifier.
- PPL n° 3076 : accès territorial aux soins, indépendance des professionnels, effets de la financiarisation, touche la biologie médicale. À ajouter au suivi.

### Mission Habert et rapport IGAS-IGF

- Rapport IGAS-IGF « Pertinence et efficience des dépenses de biologie médicale » (mai 2025, publié en juillet 2025) : 650 M€ d'économies, dont environ 430 M€ via la rentabilité ; 20 recommandations (plafond de sous-traitance, zones, contrôle ARS, règle « n biologistes, n sites »).
- Mission Habert (Laurent Habert, IGAS), « Pacte pour l'avenir de la biologie médicale » lancé en mai 2026. Arbitrages annoncés : sous-traitance de 15 à 20 % (art. L. 6211-19 CSP), territoires revus par les ARS. Le SLBC conteste la séquence « signer d'abord, contreparties ensuite ».

### Textes du Journal officiel déjà repérés

- Décret n° 2026-1009 du 28 octobre 2026 (JO du 30/10, texte n° 34) : numéro de signalement pseudonymisé créé par le responsable du laboratoire, art. R. 1413-58-1 et R. 3113-2 CSP. Impact fort.
- Arrêté du 22 octobre 2026 : biosimilaires substituables en officine. Impact faible.
- Arrêté du 4 février 2026 : biologie délocalisée.

### Textes de fond

- Ordonnance n° 2010-49 et loi n° 2013-442 (réforme de la biologie médicale), loi n° 2016-41, décret n° 2021-293 (laboratoires de référence), arrêté du 8 mars 2021 (accréditation).

## À mettre à jour dans la maquette

1. ~~Bloc « Protocole 2027-2030 »~~ : fait le 4 novembre 2026 dans le dépôt et sur la maquette publiée (protocole 2027-2029 signé, entrée en tête de la veille).
2. Suivi du PLFSS 2027 : ajouter le rejet du 23 octobre, la séance au Sénat du 9 novembre et l'échéance du 26 novembre (en attente d'accord).
3. Veille : vérifier l'intitulé de la PPL n° 2956 et ajouter la PPL n° 3076 (en attente d'accord).
4. ~~Charte~~ : logo passé en Nunito le 4 novembre 2026, dans le dépôt et sur la charte publiée. Reste ouvert : Figtree ou Nunito pour les textes du site (titres et texte courant).

## Limites de l'environnement

- Le réseau de la session bloque legifrance.gouv.fr, senat.fr, assemblee-nationale.fr et les sites de presse spécialisée. La recherche web fonctionne, mais l'ouverture des pages échoue. Pour vérifier sur les sources primaires, il faut ajouter ces domaines dans les paramètres réseau de l'environnement.
