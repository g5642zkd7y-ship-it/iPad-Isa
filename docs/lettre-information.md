# Lettre d’information du SLBC : ce que montre la maquette, ce qu’il faut mettre en place

Fiche de travail du 5 novembre 2026, à partager avec l’agence Kstudio. À valider par le bureau.

## Ce que montre la maquette

La maquette simule tout le circuit. Aucun e-mail n’est réellement envoyé : les adresses et l’historique des envois restent dans le navigateur de la personne qui teste (clés `slbc-maquette-abonnes` et `slbc-maquette-envois`).

1. **Inscription** (espace adhérent, rubrique « Lettre d’information » ; la veille est réservée aux adhérents depuis le 6 novembre 2026) : adresse e-mail et case de consentement obligatoire. Une adresse déjà inscrite est signalée.
2. **Publication** (espace adhérent, rubrique « Publier ») : l’interrupteur « Envoyer aux abonnés de la lettre d’information » indique le nombre d’abonnés. Un champ « Objet de l’e-mail » (repris du titre s’il reste vide) et un aperçu de l’e-mail apparaissent quand l’envoi est activé.
3. **Gestion** (espace adhérent, rubrique « Publier », bloc « Lettre d’information ») : liste des abonnés, ajout et retrait d’une adresse, historique des derniers envois.

## Ce qu’il faut pour le vrai site

| Besoin | Ce qu’il faut prévoir |
| --- | --- |
| Envoyer les e-mails | Un service d’envoi relié au site (extension d’e-mailing pour WordPress ou service externe). Choix à faire avec Kstudio. |
| Liste des abonnés | Stockée côté serveur, consultable par les membres habilités de l’espace adhérent. |
| Inscription | Double confirmation recommandée : un e-mail de confirmation à cliquer avant l’inscription définitive. |
| Désinscription | Un lien de désinscription dans chaque e-mail, qui fonctionne en un clic. |
| Consentement (RGPD) | Informer dès le formulaire : une phrase sous la case (qui envoie, dans quel but, comment se désinscrire) et un lien vers la politique de confidentialité. Garder, pour chaque inscription, la date, l’origine, le texte de la case acceptée et l’heure de la confirmation. |
| Expéditeur | Envoi depuis une adresse du domaine slbc.fr, authentifiée (SPF, DKIM, et DMARC recommandé) pour ne pas tomber en indésirables. Nom du SLBC et adresse postale en pied d’e-mail. |
| Suivi | Aucun pixel d’ouverture ni suivi des clics : à désactiver dans l’outil d’envoi (sinon, un consentement séparé est nécessaire ; voir `docs/obligations-legales.md`). |
| Modèle d’e-mail | Aux couleurs de la charte graphique : symbole du logo, titre, résumé, bouton « Lire sur le site ». |
| Contenu réservé | Pour une publication « réservée aux adhérents », l’e-mail renvoie vers le site, où la lecture demande une connexion. |

## Points à décider par le bureau

- Envoi à chaque publication, ou regroupement dans la lettre du lundi.
- Qui peut envoyer : tout membre habilité de l’espace adhérent, ou seulement le bureau.
- Liste réservée aux adhérents, ou ouverte à d’autres publics (presse, partenaires).
