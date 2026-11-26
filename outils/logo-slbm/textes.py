"""Textes de la présentation « Logo du SLBM » (six pistes, 26 novembre 2026) : une description.json par piste et presentation.json.
Écrits avec des espaces simples ; la typographie française est posée ici.
usage : python3 outils/logo-slbm/textes.py marque/logo-slbm-agence"""
import json, re, sys
D = sys.argv[1]
NN, NB = ' ', ' '

def typo(s):
    s = s.replace("'", '’')
    s = re.sub(r' ([;!?])', NN + r'\1', s)
    s = s.replace('« ', '«' + NN).replace(' »', NN + '»')
    s = re.sub(r' :', NB + ':', s)
    s = re.sub(r'(\d) (px|%)', r'\1' + NB + r'\2', s)
    return s

def T(o):
    if isinstance(o, str): return typo(o)
    if isinstance(o, list): return [T(x) for x in o]
    if isinstance(o, dict): return {k: (v if k in ('hex', 'key', 'fond_sombre', 'couleur_action') else T(v)) for k, v in o.items()}
    return o

GRIS = {'nom': 'gris cellule', 'hex': '#5E6266'}
ANIS = {'nom': 'vert anis', 'hex': '#A3BE3C'}
FONCE = {'nom': 'vert foncé', 'hex': '#5F7A2B'}
CLAIR = {'nom': 'vert clair', 'hex': '#D6E4A6'}
BLANC = {'nom': 'blanc', 'hex': '#FFFFFF'}
ENCRE = {'nom': 'encre', 'hex': '#2E3236'}
def pal(*paires): return [dict(c, role=r) for c, r in paires]

P = {}
P['entoure'] = dict(
 titre="Bien entouré",
 idee="Un rond vert anis, plein, entouré d'un seul geste gris tracé à la main, comme on entoure au stylo ce qui compte. Le geste ne se referme pas : sa fin passe au large de son départ.",
 seconde_lecture="Le rond vert n'est pas au centre : il se loge en bas à droite, contre le geste. Le gris est plus plein en haut à gauche, le vert est en bas à droite : c'est la diagonale de votre logo actuel, et le rond vert est le sien.",
 defense="Entourer, c'est protéger : le geste gris fait le tour de ce qu'il défend. Le trait est celui d'une main, plus plein d'un côté, plus fin de l'autre.",
 union="Le signe montre le collectif autour de chacun : dans le rond vert, le biologiste ; autour de lui, son syndicat. Il ne montre pas plusieurs formes qui se rejoignent.",
 sante="On peut voir dans le rond vert le patient, et dans le geste la profession qui veille sur lui. Rien dans le dessin ne l'impose.",
 couleurs="Deux couleurs dans le signe : le gris du logo pour le geste, le vert anis pour le rond. Le vert foncé reste dans le nom, sur la ligne « de Biologie Médicale ». Sur le vert du site, le geste passe en blanc et le rond reste vert anis. En une couleur, le rond est un peu plus petit, pour que le blanc entre le rond et le geste tienne en petit.",
 palette=pal((GRIS, "le geste qui entoure"), (ANIS, "le rond, ce qui est entouré"), (BLANC, "le geste sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, le rond vert se poserait, puis le geste gris se tracerait autour de lui d'un seul mouvement, comme le trait au marqueur sous les onglets du site.",
 a_verifier="Nos lecteurs y voient d'abord un œil ou une arobase ; le biologiste, une cellule et son noyau. En noir, à côté du sigle SLBM, une cible : « le missile et sa cible ». Tourné, un escargot. Le lecteur moqueur y trouve aussi une lecture grivoise, un sein vu de face. Plus faiblement, un serpent enroulé, gris sur vert anis, qui rappellerait celui du logo encore affiché sur slbc.fr. Dans le secteur, la FBM a aussi un anneau ouvert autour de son dessin : posés côte à côte, les deux signes ne nous paraissent pas se ressembler, mais c'est à faire confirmer par vos collaborateurs. En tout petit, le blanc entre le rond et le geste devient très fin.")

P['deux-ronds'] = dict(
 titre="Vos deux ronds",
 idee="Les deux ronds de votre logo, à la même place et aux mêmes couleurs. Le vert reste plein ; le gris devient un trait épais, ouvert en haut à gauche, aux deux bouts ronds. Là où il rejoint le rond vert, il se remplit de vert foncé.",
 seconde_lecture="C'est le principe des pastilles du site : un rond tracé, posé sur un rond vert anis décalé en bas à droite. Ici, le trait est plus épais et le rond vert dépasse davantage.",
 defense="Ce signe ne parle pas de défense. Il redit ce que dit votre logo actuel : deux forces et ce qu'elles ont en commun.",
 union="Seul, le rond gris n'est qu'un trait ; la zone commune est sa seule partie pleine. C'est notre façon de dire « l'union fait la force », comme sur votre logo.",
 sante="Deux ronds, deux cellules : la matière de la biologie médicale. La santé des Français n'y figure pas.",
 couleurs="Les trois couleurs du logo actuel, rangées de la même façon : le gris en haut à gauche, le vert anis en bas à droite, le vert foncé là où ils se rejoignent. Sur le vert du site : trait blanc, rond vert anis, zone commune vert clair, comme votre logo sur fond sombre. En une couleur, le rond tracé passe devant le rond plein : une fine ligne vide suit son bord et la zone commune reste pleine.",
 palette=pal((GRIS, "le rond tracé"), (ANIS, "le rond plein"), (FONCE, "la zone commune"), (BLANC, "le rond tracé sur le vert du site"), (CLAIR, "la zone commune sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les deux ronds se rapprocheraient comme aujourd'hui : le rond gris se tracerait d'un seul geste, puis la zone commune se remplirait de vert foncé.",
 a_verifier="Mastercard : nos trois lecteurs y pensent au premier regard. Cette piste reste la plus proche de votre logo et ne règle donc pas la remarque de vos collaborateurs. Le trait ouvert : les trois y voient un anneau cassé ou pas fini, fâcheux pour un syndicat qui parle d'union. En noir, une tétine, un hochet ou, pour le lecteur moqueur, une grenade et sa goupille. En tout petit (en-tête du site, onglet du navigateur), l'ouverture ne se voit plus et l'on revoit deux ronds. Le signe doit rester en diagonale, jamais redressé.")

P['accroche'] = dict(
 titre="Tenir ensemble",
 idee="Vos deux ronds, gris en haut à gauche et vert en bas à droite, s'ouvrent et s'accrochent l'un à l'autre : le bras de chacun passe par-dessus l'autre et se referme sur ce qu'ils ont en commun, en vert foncé.",
 seconde_lecture="C'est la plus géométrique des six : les ronds restent de vrais ronds, ce sont deux fentes blanches qui les font s'accrocher. Plusieurs de nos lecteurs y ont lu un S, celui de syndicat et de SLBM.",
 defense="Les deux ronds se referment sur ce qu'ils ont en commun et le gardent au milieu. La défense passe par ce geste, sans bouclier.",
 union="Deux formes qui se tiennent : aucune ne peut partir sans l'autre. C'est le sujet du signe.",
 sante="La santé n'est pas montrée. Au centre, on peut voir ce que la profession protège.",
 couleurs="Les trois couleurs du logo actuel, à la même place. Sur le vert du site : rond gris en blanc, rond vert en vert anis, zone commune en vert clair. En une couleur, deux traits fins cernent la zone commune ; pour toute impression sans couleur, prendre cette version et non une conversion en gris, où le gris et le vert foncé se confondent.",
 palette=pal((GRIS, "le rond du haut"), (ANIS, "le rond du bas"), (FONCE, "ce qu'ils ont en commun"), (BLANC, "le rond du haut sur le vert du site"), (CLAIR, "la zone commune sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les deux ronds se rapprocheraient comme aujourd'hui, puis chacun passerait un bras par-dessus l'autre : les deux fentes blanches s'ouvriraient et la zone commune apparaîtrait.",
 a_verifier="Le yin et le yang : nos trois lecteurs le voient d'abord, et il évoque pour eux les médecines douces plutôt que la science. Les trois citent aussi la même plaisanterie grivoise sur deux formes tête-bêche. En une couleur, chacune des deux virgules est un rond terminé par une pointe, donc proche d'une goutte. Au centre, une amande ou un œil. En tout petit, les fentes ne sont plus que deux encoches et l'on revoit presque le logo actuel : il faudra un dessin simplifié pour l'onglet du navigateur.")

P['aile'] = dict(
 titre="Sous son aile",
 idee="Une aile qui s'abaisse, faite de trois plumes aux trois couleurs du logo. La grande plume grise couvre la verte, qui couvre la petite vert anis. Une fine ligne blanche sépare chaque plume de sa voisine et s'élargit jusqu'aux pointes.",
 seconde_lecture="Les trois plumes partent de la même épaule arrondie et leurs pointes sortent l'une sous l'autre. Les couleurs gardent l'ordre de votre logo, de haut en bas : gris, vert foncé, vert anis.",
 defense="Prendre sous son aile, c'est protéger : quand on reconnaît l'aile, la défense est là.",
 union="Trois plumes de tailles inégales qui tiennent ensemble. L'union vient en second.",
 sante="Sous l'aile, on peut mettre la profession ou le patient ; le dessin ne le dit pas.",
 couleurs="Les trois couleurs du logo, une par plume. Sur le vert du site : la grande plume en blanc, celle du milieu en vert clair, la petite en vert anis. En une couleur, c'est le même dessin : les deux lignes vides séparent les plumes. En tout petit, nous prenons un dessin simplifié, aux lignes plus larges.",
 palette=pal((GRIS, "la grande plume, celle qui couvre"), (FONCE, "la plume du milieu"), (ANIS, "la petite plume"), (BLANC, "la grande plume sur le vert du site"), (CLAIR, "la plume du milieu sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les trois plumes se déploieraient l'une après l'autre : la petite, la verte, puis la grise, qui viendrait couvrir les deux autres.",
 a_verifier="Le biologiste et le lecteur moqueur y voient le plus beau dessin des six, mais « personne ne saura dire ce que c'est » : une aile, une feuille, le logo d'une marque de produits naturels ou d'une compagnie aérienne plutôt que celui d'un syndicat. En noir, les deux lignes vides découpent trois pointes : une patte griffue, un régime de bananes. En couleurs, plus faiblement, une moule. En tout petit, les lignes se bouchent : nous prenons le dessin simplifié. Les ressemblances avec des marques qui ont une aile ou une feuille ne sont pas vérifiées.")

P['confluence'] = dict(
 titre="La confluence",
 idee="Un long trait gris part de la gauche et se relève vers la droite d'un seul geste. Un trait vert anis, plus court, le rejoint par-dessous. Là où ils se recouvrent, le trait devient vert foncé, plus plein, puis il s'affine jusqu'à la pointe.",
 seconde_lecture="Ce sont les trois couleurs de votre logo et la même idée de zone commune : le vert foncé, là où le gris et le vert anis se recouvrent. Ici, la partie commune fait la moitié du signe.",
 defense="Ce signe ne parle pas de défense : il montre un élan, deux forces qui n'en font plus qu'une.",
 union="Deux traits en font un seul, plus large que chacun : c'est notre façon de dessiner « l'union fait la force ». Sans légende, nos trois lecteurs ne la lisent qu'un peu.",
 sante="La santé n'y figure pas. Les verts et la forme font plutôt penser à une feuille.",
 couleurs="Les trois couleurs du logo : le gris pour le trait long, le vert anis pour le trait court, le vert foncé là où ils se recouvrent. Sur le vert du site : le trait long en blanc, le trait court en vert anis, la partie commune en vert clair. En une couleur, une seule forme, sans ligne vide : la fourche suffit à montrer les deux traits. En tout petit, nous prenons un dessin simplifié, aux traits plus gras.",
 palette=pal((GRIS, "le trait long"), (ANIS, "le trait court, qui le rejoint"), (FONCE, "la partie commune"), (BLANC, "le trait long sur le vert du site"), (CLAIR, "la partie commune sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, le trait gris se tracerait de gauche à droite, le trait vert anis le rejoindrait par-dessous, puis la partie commune filerait jusqu'à la pointe.",
 a_verifier="C'est notre troisième dessin de cette idée, et nos trois lecteurs le classent encore dernier. Ils y voient d'abord la virgule d'une marque de sport (les trois citent Nike), un oiseau en vol ou une feuille. À côté du sigle SLBM, qui désigne aussi un missile, une trajectoire qui monte avec sa traînée : pour qui connaît ce sens, on ne voit plus qu'elle. Tourné, une lame courbe. C'est le signe le plus léger des six à côté du nom, et en tout petit il n'en reste qu'un accent sans le dessin simplifié. Nous le montrons pour son trait ; nous ne le recommandons pas.")

P['bouclier'] = dict(
 titre="Le bouclier, d'un seul trait",
 idee="Un bouclier tracé d'un seul geste de marqueur gris, tenu devant un grand rond vert anis. Le trait part fin en haut à gauche, s'épaissit en descendant, tourne à la pointe et revient par le haut : sa fin passe au-dessus de son départ. La part du rond qu'il couvre passe en vert foncé : c'est ce que le syndicat défend.",
 seconde_lecture="On retrouve votre logo : le gris en haut à gauche, le vert anis en bas à droite, le vert foncé là où ils se recouvrent. Le rond vert est resté, un peu plus grand ; c'est le rond gris qui est devenu bouclier.",
 defense="C'est le seul signe où nos trois lecteurs lisent « défendre » sans légende. La forme du bouclier reste classique.",
 union="L'union n'y figure pas, sinon par ce qu'il garde de votre logo : deux formes et leur zone commune.",
 sante="Le rond vert, derrière le bouclier, peut être la profession ou la santé des patients ; le dessin ne tranche pas.",
 couleurs="Les trois couleurs du logo actuel, à la même place. Sur le vert du site : trait blanc, rond vert anis, part couverte en vert clair, détachée du trait par une fine ligne. En une couleur, le bouclier, la part couverte et le reste du rond sont trois formes séparées par une fine ligne vide ; en tout petit, la part couverte est retirée pour que l'intérieur du bouclier reste vide.",
 palette=pal((GRIS, "le bouclier, d'un seul trait"), (ANIS, "le rond, derrière le bouclier"), (FONCE, "la part du rond que le bouclier couvre"), (BLANC, "le bouclier sur le vert du site"), (CLAIR, "la part couverte sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, le rond vert se poserait, puis le bouclier se tracerait devant lui d'un seul mouvement, du haut à gauche jusqu'à son retour par le haut, sans tourner ; la part couverte passerait alors en vert foncé.",
 a_verifier="Nos lecteurs y voient aussi le logo d'un antivirus, d'une mutuelle ou d'un assureur : c'est le signe le plus courant des six. Le trait ne se referme plus en haut à gauche : deux lecteurs y voient un slip vu de face ou une poche, et le lecteur moqueur, en noir, une lecture anatomique dans la part couverte. La part vert foncé fait aussi une feuille. Retourné, pointe en haut, le contour rappellerait une goutte ou une ogive : le signe ne doit jamais tourner. À côté du sigle SLBM, un bouclier fait penser au « bouclier antimissile ». En tout petit, le trait fin du haut disparaît et le dessin se brouille. En photocopie grise, le gris et le vert foncé se confondent : prendre la version en une couleur.")

OUI, PEU, NON = "oui", "un peu", "non"
PRES = dict(
 surtitre="Proposition de l'agence, après vos retours",
 etat_titre="Vos retours, et ce que nous en avons fait",
 etat=[
  "« Bof », puis « mon petit frère aurait pu les faire » : le premier jeu était fait au compas et à la règle. Les pistes 1, 4, 5 et 6 sont maintenant tracées à la main. Les pistes 2 et 3 gardent vos deux ronds, donc leur géométrie : nous les montrons parce que vous tenez au logo actuel.",
  "« On n'est pas dans les cravates » : chaque signe a été regardé à l'envers, tourné, en noir et en petit, puis montré sans légende à trois lecteurs. Ce qu'ils y ont vu, y compris ce qui prête à sourire, est écrit dans le tableau ci-dessous et sous chaque piste, à la ligne « À vérifier ».",
  "« Ça ressemble à Biogroup avec sa goutte » : aucun signe n'est une goutte. Deux s'en approchent : le bouclier (6) quand on le retourne, pointe en haut, et les deux virgules de la piste 3 en une couleur. C'est écrit sous ces pistes.",
 ],
 test_titre="Ce que trois lecteurs y ont vu, sans légende",
 test_intro="Nous avons montré les six signes à trois lecteurs sans leur dire ce qu'ils représentent : un passant, un biologiste membre d'un bureau syndical et un collègue moqueur, chargé de trouver la lecture qui fait rire. Ce sont des assistants automatiques de l'agence, pas des personnes : leur regard ne remplace pas celui de vos collaborateurs. Un premier test nous a fait redessiner les pistes 4, 5 et 6 ; ce tableau donne le second, fait sur les six dessins de cette page.",
 test=[
  dict(key='entoure', voit="Un œil, ou une bille verte prise dans un trait gris qui s'enroule ; une arobase. Le biologiste y voit une cellule et son noyau.", gene="Faible à moyenne : une cible à côté du sigle, « le missile et sa cible » ; un escargot.", defense=PEU, union=NON, sante=PEU, rang="1er pour deux lecteurs, 2e pour le troisième"),
  dict(key='deux-ronds', voit="Deux ronds qui se chevauchent : « Mastercard en vert et gris », pour les trois. Puis un anneau cassé.", gene="Moyenne : un anneau qui ne se ferme pas, pour un syndicat qui parle d'union ; une tétine ; en noir, une grenade et sa goupille.", defense=NON, union=PEU, sante=NON, rang="3e, 4e et 5e"),
  dict(key='accroche', voit="Un yin et yang gris et vert : deux virgules qui s'emboîtent. Le biologiste y lit presque un S.", gene="Moyenne : le yin et le yang, qui fait médecine douce ; une plaisanterie grivoise sur deux formes tête-bêche, citée par les trois.", defense=NON, union=OUI, sante=PEU, rang="1er pour le moqueur, 3e et 4e pour les deux autres"),
  dict(key='aile', voit="Une aile repliée ou une feuille : « une marque de produits naturels, ou une compagnie aérienne ». Le plus beau dessin des six pour deux lecteurs.", gene="Faible à moyenne : en noir, une patte griffue ou un régime de bananes ; en couleurs, une moule.", defense=PEU, union=PEU, sante=PEU, rang="3e pour le moqueur, 5e pour les deux autres"),
  dict(key='confluence', voit="La virgule d'une marque de sport, pour les trois ; un oiseau en vol ; une feuille sur deux tiges.", gene="Moyenne à forte : à côté du sigle SLBM, la trajectoire d'un missile qui monte avec sa traînée.", defense=NON, union=PEU, sante=NON, rang="dernier pour les trois"),
  dict(key='bouclier', voit="Un bouclier tracé au feutre devant un rond vert : compris tout de suite.", gene="Faible à moyenne : le logo d'un antivirus ou d'une mutuelle ; un slip ou une poche ; le « bouclier antimissile ».", defense=OUI, union=NON, sante=NON, rang="2e pour deux lecteurs, 4e pour le moqueur"),
 ],
 test_note="Les colonnes « défense », « union » et « santé » résument la réponse des trois lecteurs à la question posée en fin de test : ce signe vous évoque-t-il l'idée de défendre, celle de s'unir, la santé ? Leurs réponses concordent presque partout. Aucun signe ne dit à la fois la défense et l'union : il faudra choisir ce que le logo dit d'abord.",
 fin_titre="Ce que nous avons écarté, et ce qui n'est pas vérifié",
 fin=[
  "Écartés après un premier tri : le microscope (déjà présent dans les logos d'autres organisations de biologistes), la loupe (le bouton « rechercher »), le stéthoscope (l'outil du médecin), les lettres dessinées et toutes les gouttes.",
  "Écartés en cours de route, pour la piste 5 : un premier dessin à trois branches, où nos lecteurs voyaient un missile à côté du sigle, puis une coche tracée au pinceau, où ils voyaient la virgule de Nike et le « validé » des logiciels.",
  "La santé des Français : aucun signe ne la montre. Nos lecteurs la devinent un peu dans les pistes 1, 3 et 4, pas dans les autres. Elle reste portée par la devise du syndicat, « Défendre la biologie, défendre les patients ».",
  "Les logos actuels de Biogroup, Cerballiance, Unilabs et Synlab : nous n'avons pas pu les ouvrir depuis notre poste de travail. La comparaison reste à faire avant de choisir.",
  "Mastercard, Nike et les autres marques citées par nos lecteurs : comparaisons faites de mémoire, sans les logos officiels sous les yeux.",
  "Les relectures et les tests de lecture sont faits par des assistants automatiques, pas par des personnes.",
  "Aucune recherche de marques déposées n'a été faite.",
  "Les animations décrites sous chaque piste sont des intentions : aucune n'est réalisée.",
 ],
 suite=[
  "Avant de choisir : poser les six signes à côté des logos de Biogroup, Cerballiance, Unilabs, Synlab et de la FBM, et les montrer à vos collaborateurs sans leur dire ce que l'on cherche.",
  "Vous choisissez une piste, ou deux à pousser plus loin, et vous nous dites ce qu'il faut changer. Si vous voulez un signe qui dise à la fois la défense et l'union, dites-le-nous : aucune des six ne le fait, il faudrait en dessiner une septième.",
  "Nous affinons la piste retenue, puis nous l'essayons sur le site complet : en-tête, pied de page, animations des pages.",
  "Avant toute adoption : faire vérifier par un spécialiste des marques qu'aucun logo déposé ne lui ressemble, puis validation par le bureau.",
 ],
 note="Les six pistes gardent les couleurs de la charte. Toutes sont montrées en tout petit, en une couleur et sur le vert du site ; ce qui ne tient pas à cette taille est écrit sous chaque piste.",
 recommandation="Notre préférence va à la piste 1, « Bien entouré » : première pour deux de nos trois lecteurs, deuxième pour le troisième. Elle garde votre rond vert, aucun des trois n'y a vu Mastercard, et le biologiste y lit une cellule et son noyau. Sa limite : elle dit « protégé » plus qu'« unis ». Il reste à la poser à côté du logo de la FBM. Ensuite, tout dépend de ce que le bureau veut dire d'abord. La défense : la piste 6, le bouclier, deuxième pour deux lecteurs et la seule où les trois lisent « défendre » sans légende ; c'est aussi le signe le plus courant. L'union : la piste 3, « Tenir ensemble », la seule où les trois lisent « s'unir », si son air de yin et yang ne vous gêne pas. La piste 2 reste la plus proche de votre logo, mais nos lecteurs y voient encore Mastercard. La piste 4 est un beau dessin, que l'on prend pour le logo d'une marque de produits naturels. Nous ne recommandons pas la piste 5. Rien ne change sur le site : il garde ses deux ronds tant que le bureau n'a pas décidé.")

for c, d in P.items():
    d = dict(key=c, **d, fond_sombre='#657B3D', couleur_action='#5F7A2B')
    json.dump(T(d), open(f'{D}/{c}/description.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(T(PRES), open(f'{D}/presentation.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', list(P))
