# SLBC — Charte graphique

Syndicat des Laboratoires de Biologie Clinique
Version de travail · novembre 2026 · à valider par le bureau

> **État de ce fichier** : copie de la charte publiée le 4 novembre 2026 (https://claude.ai/artifact/EhTqyWrkSQibEFKKZiydUK).
> Mise à jour du 4 novembre 2026 : le logo est validé en **Nunito** (§ 4.1).
> Point encore ouvert : la maquette du site utilise **Figtree** pour les textes, alors que le § 4.2 prévoit Nunito (voir § 10 et `CLAUDE.md`).

---

## 1. Principe

Le logo associe un **symbole** (deux cellules qui se rejoignent) et un **nom** en lettres pleines et arrondies.

- **Continuité** : il conserve les deux couleurs historiques du SLBC, le vert et le gris.
- **Sens** : la zone commune des deux ronds figure ce qui rassemble les laboratoires, les biologistes et la profession.
- **Lisibilité** : symbole sans détail fin, nom en capitales grasses, lisibles de loin comme en très petit.

---

## 2. Le logo

### 2.1 Les éléments

| Élément | Description |
| --- | --- |
| Symbole | Un rond gris (en haut à gauche) et un rond vert anis (en bas à droite) qui se chevauchent ; la zone commune est en vert foncé. |
| Nom | « SLBC » en capitales, en Nunito Black 900 (voir § 4). |
| Signature | « Syndicat des Laboratoires de Biologie Clinique ». Sur deux lignes en version horizontale (« de Biologie Clinique » en vert foncé), sur une ligne en version verticale. |

### 2.2 Les versions

| Version | Composition | Usages |
| --- | --- | --- |
| **Horizontale** (principale) | Symbole à gauche, nom et signature à droite, centrés verticalement sur le symbole | En-tête de courrier, site internet, signature e-mail, bannières |
| **Verticale** | Symbole au-dessus, nom puis signature centrés | Affiches, kakémonos, couvertures, formats carrés |
| **Symbole seul** | Les deux ronds, sans texte | Icône d’application, avatar de réseaux sociaux, favicon, filigrane |

Le symbole seul ne s’utilise que lorsque le nom SLBC figure déjà ailleurs sur le support, ou pour les très petits formats.

### 2.3 Construction du symbole

Le symbole se construit dans un carré de **120 × 120 unités** :

| Forme | Centre (x, y) | Rayon | Couleur sur fond clair | Couleur sur fond sombre |
| --- | --- | --- | --- | --- |
| Rond 1 | 44, 44 | 36 | Gris cellule `#5E6266` | Blanc `#FFFFFF` |
| Rond 2 | 76, 76 | 36 | Vert anis `#A3BE3C` | Vert anis `#A3BE3C` |
| Zone commune | intersection des deux ronds | — | Vert foncé `#5F7A2B` | Vert clair `#D6E4A6` |

Le rond vert est posé sur le rond gris ; la zone commune est le rond vert découpé par le rond gris.

Code SVG de référence, fond clair :

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label="SLBC">
  <defs><clipPath id="slbc-commun"><circle cx="44" cy="44" r="36"/></clipPath></defs>
  <circle cx="44" cy="44" r="36" fill="#5E6266"/>
  <circle cx="76" cy="76" r="36" fill="#A3BE3C"/>
  <circle cx="76" cy="76" r="36" fill="#5F7A2B" clip-path="url(#slbc-commun)"/>
</svg>
```

Fond sombre : remplacer `#5E6266` par `#FFFFFF` et `#5F7A2B` par `#D6E4A6`.

### 2.4 Proportions de la version horizontale

Pour un symbole de hauteur **H** :

- espace entre symbole et texte : **0,2 H** ;
- hauteur du nom « SLBC » (hauteur de capitale) : environ **0,6 H** ;
- signature : corps d’environ **0,19 H**, interligne 1,25 ;
- le bloc nom + signature est centré verticalement sur le symbole.

### 2.5 Zone de protection

Autour du logo, aucun texte, image ou bord de page ne doit entrer dans une marge égale à **la moitié du diamètre d’un rond** (soit 36 unités sur 120, environ 0,3 H).

### 2.6 Tailles minimales

| Version | Écran | Impression |
| --- | --- | --- |
| Horizontale | 160 px de large | 35 mm de large |
| Verticale | 100 px de large | 22 mm de large |
| Symbole seul | 16 px | 6 mm |

En dessous de ces tailles, la signature devient illisible : utiliser le symbole seul ou le nom seul.

---

## 3. Couleurs

### 3.1 Palette

| Nom | Hexadécimal | RVB | Rôle |
| --- | --- | --- | --- |
| **Vert anis** | `#A3BE3C` | 163 190 60 | Couleur signature : rond vert, accents graphiques, filets |
| **Vert foncé** | `#5F7A2B` | 95 122 43 | Zone commune du symbole, seconde ligne de signature, titres d’accent, liens |
| **Vert clair** | `#D6E4A6` | 214 228 166 | Zone commune sur fond sombre, fonds d’encadrés |
| **Gris cellule** | `#5E6266` | 94 98 102 | Rond gris, texte secondaire |
| **Gris texte** | `#3F4347` | 63 67 71 | Nom « SLBC », titres, texte courant |
| **Fond sombre** | `#2E3236` | 46 50 54 | Fonds foncés, bandeaux, version inversée |
| Fond clair | `#F7F8F4` | 247 248 244 | Fonds de pages et de diapositives |
| Blanc | `#FFFFFF` | 255 255 255 | Fond principal, éléments inversés |

**Impression** : les valeurs CMJN et Pantone restent à établir par l’imprimeur ou un graphiste, à partir d’une épreuve. Le vert anis a été estimé d’après le logo actuel ; s’il existe un fichier source de l’ancien logo, reprendre sa valeur exacte.

### 3.2 Contrastes et lisibilité

| Texte sur fond | Rapport de contraste | Usage du texte |
| --- | --- | --- |
| Gris texte `#3F4347` sur blanc | ≈ 10 : 1 | Tout texte |
| Vert foncé `#5F7A2B` sur blanc | ≈ 4,9 : 1 | Tout texte, y compris courant |
| Blanc sur fond sombre `#2E3236` | ≈ 13 : 1 | Tout texte |
| Blanc sur vert foncé `#5F7A2B` | ≈ 4,9 : 1 | Tout texte |
| Vert anis `#A3BE3C` sur blanc | ≈ 2,1 : 1 | **Jamais pour du texte** ; formes et filets uniquement |
| Vert clair `#D6E4A6` sur fond sombre | ≈ 9 : 1 | Tout texte |

### 3.3 Fonds autorisés

- **Fond blanc ou fond clair** : version couleur standard.
- **Fond sombre `#2E3236`** : version inversée (rond blanc, texte blanc, signature gris clair `#D3D6D9` et vert clair).
- **Fond vert foncé `#5F7A2B`** : version inversée, rond vert anis conservé.
- **Monochrome** (tampon, gravure, fax) : symbole et texte entièrement en gris texte, ou entièrement en blanc ; la zone commune est alors légèrement plus claire (60 % de la couleur) ou simplement fondue.
- **Photo** : uniquement sur une zone calme et unie de la photo, ou dans un cartouche blanc.

---

## 4. Typographie

### 4.1 Police du logo : Nunito

Le logo est validé en **Nunito**, police ronde et chaleureuse. Elle a été retenue parmi les quatre polices proposées (Nunito, Baloo 2, Lexend et Fredoka).

| Élément | Police | Graisse |
| --- | --- | --- |
| Nom « SLBC » | **Nunito** | Black 900 |
| Signature | **Nunito** | Bold 700 |

Nunito est disponible gratuitement sur Google Fonts, sous licence libre OFL, utilisable en usage commercial.

Prochaine étape : faire **vectoriser le logo** (lettres converties en tracés) pour livrer des fichiers qui s’affichent correctement sans que la police soit installée.

### 4.2 Polices des documents

| Usage | Police | Graisse | Remarque |
| --- | --- | --- | --- |
| Titres | **Nunito** (police du logo) | ExtraBold / Black | Renforce l’identité |
| Texte courant | **Nunito** | Regular 400, Bold 700 | Lisible à l’écran et à l’impression. La maquette du site utilise Figtree : point ouvert (§ 10) |
| Bureautique (Word, PowerPoint) si les polices ne sont pas installées | Arial | Regular, Bold | Police de repli universelle |

### 4.3 Échelle typographique

| Niveau | Imprimé | Écran / web | Diapositive (1920 × 1080) |
| --- | --- | --- | --- |
| Titre 1 | 24 pt | 40 px | 72 px |
| Titre 2 | 16 pt | 28 px | 56 px |
| Titre 3 | 12 pt | 20 px | 44 px |
| Texte courant | 10–11 pt | 16 px | 30 px |
| Légende, mentions | 8 pt | 13 px | 24 px |

Interligne du texte courant : 1,4 à 1,5. Mettre en valeur par la graisse ou la couleur (vert foncé), pas par un changement de taille.

---

## 5. Interdits

Ne pas :

- modifier les couleurs du symbole ou en inverser l’ordre (le gris est toujours en haut à gauche) ;
- déformer, étirer ou incliner le logo ;
- changer la police du nom ou de la signature ;
- ajouter une ombre, un contour, un dégradé ou un effet 3D ;
- écrire du texte en vert anis ;
- placer le logo couleur sur un fond chargé ou sur un vert proche ;
- réorganiser les éléments (signature au-dessus, symbole à droite, etc.) ;
- réduire en dessous des tailles minimales.

---

## 6. Éléments graphiques

- **Ronds** : les cercles du symbole peuvent être repris en grand, partiellement hors cadre, en vert clair ou gris très clair, comme motif de fond (couvertures, bannières).
- **Filets** : trait vert anis de 4 à 8 px en tête de bloc ou d’encadré.
- **Encadrés** : fond blanc ou vert clair, coins arrondis (rayon 16 à 24 px à l’écran, 3 à 4 mm à l’impression).
- **Pictogrammes** : style au trait, extrémités arrondies, en gris texte ou vert foncé.

---

## 7. Déclinaisons

| Support | Version du logo | Indications |
| --- | --- | --- |
| Papier à en-tête | Horizontale, en haut à gauche, 40 à 45 mm de large | Coordonnées en pied de page, Nunito 8 pt, gris cellule |
| Carte de visite | Horizontale au recto ; symbole seul possible au verso, sur fond vert foncé | 85 × 55 mm |
| Signature e-mail | Horizontale, 160 à 200 px de large, en PNG | Nom et fonction en Nunito ou Arial |
| Site internet | Horizontale dans l’en-tête ; symbole seul en favicon | Fond blanc ; bandeaux en fond sombre |
| Réseaux sociaux | Symbole seul en avatar (rond blanc ou vert clair autour) | Bannières : version horizontale sur fond clair ou sombre |
| Présentations | Couverture : version verticale ou horizontale ; pages intérieures : symbole seul en petit, en pied de page | Fond clair `#F7F8F4`, diapositive de conclusion en vert foncé |

---

## 8. Jetons de design (web)

```css
:root {
  /* Couleurs */
  --slbc-vert-anis:   #A3BE3C;
  --slbc-vert-fonce:  #5F7A2B;
  --slbc-vert-clair:  #D6E4A6;
  --slbc-gris-cellule:#5E6266;
  --slbc-gris-texte:  #3F4347;
  --slbc-fond-sombre: #2E3236;
  --slbc-fond-clair:  #F7F8F4;
  --slbc-blanc:       #FFFFFF;

  /* Typographie — Nunito, police du logo */
  --slbc-police-titres: "Nunito", Arial, sans-serif;
  --slbc-police-texte:  "Nunito", Arial, sans-serif;

  /* Formes */
  --slbc-rayon: 16px;
  --slbc-filet: 6px;
}
```

---

## 9. Fichiers à produire après validation

1. Logo vectorisé en Nunito (Black 900 pour le nom, Bold 700 pour la signature) : horizontal, vertical, symbole seul.
2. Pour chaque version : couleur, inversé (fond sombre), monochrome gris, monochrome blanc.
3. Formats : SVG et PDF vectoriel (impression, signalétique), PNG transparent en plusieurs tailles (web, bureautique).
4. Références CMJN et Pantone validées sur épreuve.
5. Modèles : papier à en-tête, carte de visite, présentation, signature e-mail.

---

## 10. Points ouverts

- [ ] Police des textes du site : Figtree (utilisée sur la maquette) ou Nunito (prévue au § 4.2)
- [ ] Validation du vert anis à partir du fichier source de l’ancien logo, s’il existe
- [ ] Références CMJN et Pantone
- [ ] Validation du bureau
