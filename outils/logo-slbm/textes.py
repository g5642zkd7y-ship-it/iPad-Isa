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
 a_verifier="Nos lecteurs y voient aussi un œil, une arobase et, quand on le tourne, un escargot. En noir, à côté du sigle SLBM, une cible. Plus faiblement, un serpent enroulé, gris sur vert anis, qui rappellerait celui du logo encore affiché sur slbc.fr. Dans le secteur, la FBM a aussi un anneau ouvert autour de son dessin : posés côte à côte, les deux signes ne nous paraissent pas se ressembler, mais c'est à faire confirmer par vos collaborateurs. En tout petit, le blanc entre le rond et le geste devient très fin.")

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
 a_verifier="Mastercard : nos trois lecteurs y ont encore pensé au premier regard, en couleurs. Cette piste reste la plus proche de votre logo et ne règle donc pas la remarque de vos collaborateurs. Le trait ouvert : deux lecteurs y voient un anneau cassé, fâcheux pour un syndicat qui parle d'union ; en noir, une tétine ou une boule de Noël. En tout petit (en-tête du site, onglet du navigateur), l'ouverture ne se voit plus. Le signe doit rester en diagonale, jamais redressé.")

P['accroche'] = dict(
 titre="Tenir ensemble",
 idee="Vos deux ronds, gris en haut à gauche et vert en bas à droite, s'ouvrent et s'accrochent l'un à l'autre : le bras de chacun passe par-dessus l'autre et se referme sur ce qu'ils ont en commun, en vert foncé.",
 seconde_lecture="C'est la plus géométrique des six : les ronds restent de vrais ronds, ce sont deux fentes blanches qui les font s'accrocher. Nos trois lecteurs y ont lu un S, celui de syndicat et de SLBM.",
 defense="Les deux ronds se referment sur ce qu'ils ont en commun et le gardent au milieu. La défense passe par ce geste, sans bouclier.",
 union="Deux formes qui se tiennent : aucune ne peut partir sans l'autre. C'est le sujet du signe.",
 sante="La santé n'est pas montrée. Au centre, on peut voir ce que la profession protège.",
 couleurs="Les trois couleurs du logo actuel, à la même place. Sur le vert du site : rond gris en blanc, rond vert en vert anis, zone commune en vert clair. En une couleur, deux traits fins cernent la zone commune ; pour toute impression sans couleur, prendre cette version et non une conversion en gris, où le gris et le vert foncé se confondent.",
 palette=pal((GRIS, "le rond du haut"), (ANIS, "le rond du bas"), (FONCE, "ce qu'ils ont en commun"), (BLANC, "le rond du haut sur le vert du site"), (CLAIR, "la zone commune sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les deux ronds se rapprocheraient comme aujourd'hui, puis chacun passerait un bras par-dessus l'autre : les deux fentes blanches s'ouvriraient et la zone commune apparaîtrait.",
 a_verifier="Le yin et le yang : nos trois lecteurs l'ont vu, et deux d'entre eux notent qu'il évoque les médecines douces plutôt que la science. En une couleur, deux virgules tête-bêche, qui prêtent à une plaisanterie grivoise ; chacune est un rond terminé par une pointe. Au centre, une amande ou un œil. En tout petit, les fentes ne sont plus que deux encoches et l'on revoit presque le logo actuel : il faudra un dessin simplifié pour l'onglet du navigateur.")

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
 a_verifier="Dessin en cours de reprise. Nos lecteurs ne savent pas tous ce que c'est : une aile, une feuille, un casque de vélo, une moule ; sur le vert du site, l'un d'eux voit un taco. En couleurs, les plumes se touchent et l'aile se reconnaît moins bien qu'en une couleur : nous les séparons. La plume grise seule a la forme d'une faucille, lecture à écarter pour un syndicat ; elle ressort surtout en blanc sur le vert. En tout petit, les trois plumes se fondent en une tache. Deux lecteurs sur trois le trouvent le plus dessiné des six. Les ressemblances avec des marques qui ont une aile ne sont pas vérifiées.")

P['confluence'] = dict(
 titre="La confluence",
 idee="Deux traits aux bouts arrondis, un gris et un vert anis, partent chacun de leur côté et se rejoignent. Ils continuent en un seul trait vert foncé, bien plus épais que chacun des deux.",
 seconde_lecture="Ce sont les trois couleurs de votre logo et la même idée de zone commune : le vert foncé, là où le gris et le vert anis sont réunis. Ici, la partie commune est la plus forte des trois.",
 defense="Ce signe ne parle pas de défense : il montre deux forces qui n'en font plus qu'une.",
 union="Deux traits en font un seul, plus épais que chacun : c'est l'idée la plus proche de « l'union fait la force ».",
 sante="La santé n'y figure pas. Un biologiste y verra peut-être le Y par lequel on dessine les anticorps : à vous de nous le dire.",
 couleurs="Les trois couleurs du logo : le gris et le vert anis pour les deux traits, le vert foncé pour le trait commun. Sur le vert du site, le trait commun passe en blanc, comme le nom, et les deux traits en vert clair. En une couleur, de fines lignes vides séparent les trois traits : le signe est alors en trois morceaux.",
 palette=pal((GRIS, "le trait du haut"), (ANIS, "le trait du bas"), (FONCE, "le trait commun"), (BLANC, "le trait commun sur le vert du site"), (CLAIR, "les deux traits sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À définir avec le nouveau dessin.",
 a_verifier="Dessin à refaire. Nos trois lecteurs l'ont classé dernier. Ils y voient une hélice ou un Y couché, et surtout un engin à nez rond avec deux ailettes, pointé vers le nom : un missile, à côté d'un sigle qui en désigne déjà un. En noir et sur le vert, deux d'entre eux relèvent aussi une lecture grivoise. Nous gardons l'idée, deux traits qui n'en font qu'un, et nous préparons un autre dessin.")

P['bouclier'] = dict(
 titre="Le bouclier, d'un seul trait",
 idee="Un bouclier tracé d'un seul geste de marqueur gris, tenu devant un grand rond vert anis. Le trait part fin en haut à gauche, s'épaissit en descendant, tourne à la pointe et revient par le haut : sa fin passe au-dessus de son départ. La part du rond qu'il couvre passe en vert foncé : c'est ce que le syndicat défend.",
 seconde_lecture="On retrouve votre logo : le gris en haut à gauche, le vert anis en bas à droite, le vert foncé là où ils se recouvrent. Le rond vert est resté, un peu plus grand ; c'est le rond gris qui est devenu bouclier.",
 defense="C'est le seul signe dont nos trois lecteurs ont compris le sens au premier regard : « protection ». La forme du bouclier reste classique.",
 union="L'union n'y figure pas, sinon par ce qu'il garde de votre logo : deux formes et leur zone commune.",
 sante="Le rond vert, derrière le bouclier, peut être la profession ou la santé des patients ; le dessin ne tranche pas.",
 couleurs="Les trois couleurs du logo actuel, à la même place. Sur le vert du site : trait blanc, rond vert anis, part couverte en vert clair, détachée du trait par une fine ligne. En une couleur, le bouclier, la part couverte et le reste du rond sont trois formes séparées par une fine ligne vide ; en tout petit, la part couverte est retirée pour que l'intérieur du bouclier reste vide.",
 palette=pal((GRIS, "le bouclier, d'un seul trait"), (ANIS, "le rond, derrière le bouclier"), (FONCE, "la part du rond que le bouclier couvre"), (BLANC, "le bouclier sur le vert du site"), (CLAIR, "la part couverte sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, le rond vert se poserait, puis le bouclier se tracerait devant lui d'un seul mouvement, sans tourner ; la part couverte passerait alors en vert foncé.",
 a_verifier="Trait en cours de reprise. Nos lecteurs y voient aussi le logo d'un antivirus, d'une mutuelle ou d'un assureur ; la part vert foncé fait une feuille, donc un label « bio » ; tous y voient aussi un gland. Le raccord du haut, où le trait se referme, passe pour une maladresse, et le trait a la même épaisseur partout : nous le retraçons. Retourné, pointe en haut, le contour rappellerait une goutte ou une ogive : le signe ne doit jamais tourner. À côté du sigle SLBM, un bouclier peut aussi faire penser à la défense militaire. En photocopie grise, le gris et le vert foncé se confondent : prendre la version en une couleur.")

OUI, PART, NON = "oui", "en partie", "non"
PRES = dict(
 surtitre="Proposition de l'agence, après vos retours",
 etat_titre="Vos retours, et ce que nous en avons fait",
 etat=[
  "« Bof », puis « mon petit frère aurait pu les faire » : le premier jeu était fait au compas et à la règle. Les pistes 1, 4 et 6 sont maintenant tracées à la main. Les pistes 2 et 3 gardent vos deux ronds, donc leur géométrie : nous les montrons parce que vous tenez au logo actuel. La piste 5 est à refaire.",
  "« On n'est pas dans les cravates » : chaque signe a été regardé à l'envers, tourné, en noir et en petit, puis montré sans légende à trois lecteurs. Ce qu'ils y ont vu, y compris ce qui prête à sourire, est écrit dans le tableau ci-dessous et sous chaque piste, à la ligne « À vérifier ».",
  "« Ça ressemble à Biogroup avec sa goutte » : aucun signe n'est une goutte. Deux s'en approchent quand on les retourne ou qu'on les regarde en une couleur : le bouclier (6) et les deux virgules de la piste 3. C'est écrit sous ces pistes.",
 ],
 test_titre="Ce que trois lecteurs y ont vu, sans légende",
 test_intro="Nous avons montré les six signes à trois lecteurs sans leur dire ce qu'ils représentent : un passant, un biologiste membre d'un bureau syndical et un collègue moqueur, chargé de trouver la lecture qui fait rire. Ce sont des assistants automatiques de l'agence, pas des personnes : leur regard ne remplace pas celui de vos collaborateurs.",
 test=[
  dict(key='entoure', voit="Une boule verte entourée d'un coup de pinceau gris : « quelque chose de protégé ». Aussi un œil, une arobase.", gene="Faible : en noir, une cible à côté du sigle ; tourné, un escargot.", defense=OUI, union=PART, sante=NON, rang="1er pour les trois"),
  dict(key='deux-ronds', voit="Deux ronds qui se chevauchent : les trois pensent d'abord à Mastercard, puis à un anneau cassé.", gene="Moyenne : en noir, une tétine ou une boule de Noël ; un maillon cassé, pour un syndicat qui parle d'union.", defense=NON, union=OUI, sante=NON, rang="4e ou 5e"),
  dict(key='accroche', voit="Un S fait de deux croissants qui s'emboîtent ; deux mains qui s'accrochent ; un yin et yang.", gene="Moyenne : le yin et le yang ; en noir, deux virgules tête-bêche.", defense=PART, union=OUI, sante=NON, rang="2e pour les trois"),
  dict(key='aile', voit="Une aile ou une feuille ; aussitôt après, un casque de vélo. « C'est joli, mais je ne sais pas ce que c'est. »", gene="Moyenne : une moule, une mèche gominée ; sur le vert, un taco.", defense=PART, union=PART, sante=NON, rang="4e ou 5e"),
  dict(key='confluence', voit="Une hélice à trois pales, un Y couché, une flèche qui pointe à droite.", gene="Moyenne : un missile à côté du sigle SLBM ; en noir, une lecture grivoise.", defense=NON, union=OUI, sante=NON, rang="dernier pour les trois"),
  dict(key='bouclier', voit="Un bouclier tracé au feutre devant un rond vert : « protection », compris tout de suite.", gene="Faible à moyenne : le logo d'un antivirus ou d'une mutuelle ; un gland ; le « bouclier antimissile ».", defense=OUI, union=NON, sante=PART, rang="3e pour les trois"),
 ],
 test_note="Les colonnes « défense », « union » et « santé » sont notre avis, pas celui des lecteurs. Aucun des six signes ne montre la santé des Français.",
 fin_titre="Ce que nous avons écarté, et ce qui n'est pas vérifié",
 fin=[
  "Écartés après un premier tri : le microscope (déjà présent dans les logos d'autres organisations de biologistes), la loupe (le bouton « rechercher »), le stéthoscope (l'outil du médecin), les lettres dessinées et toutes les gouttes.",
  "La santé des Français : aucun signe ne la montre. Dans les pistes 1, 3, 4 et 6, on peut la voir dans ce que le signe entoure ou protège ; les pistes 2 et 5 ne la disent pas. Elle reste portée par la devise du syndicat, « Défendre la biologie, défendre les patients ».",
  "Les logos actuels de Biogroup, Cerballiance, Unilabs et Synlab : nous n'avons pas pu les ouvrir depuis notre poste de travail. La comparaison reste à faire avant de choisir.",
  "Mastercard : nous avons comparé de mémoire, sans le logo officiel sous les yeux.",
  "Les relectures et le test de lecture sont faits par des assistants automatiques, pas par des personnes.",
  "Aucune recherche de marques déposées n'a été faite.",
  "Les animations décrites sous chaque piste sont des intentions : aucune n'est réalisée.",
 ],
 suite=[
  "Avant de choisir : poser les six signes à côté des logos de Biogroup, Cerballiance, Unilabs, Synlab et de la FBM, et les montrer à vos collaborateurs sans leur dire ce que l'on cherche.",
  "Vous choisissez une piste, ou deux à pousser plus loin, et vous nous dites ce qu'il faut changer.",
  "Nous affinons la piste retenue, puis nous l'essayons sur le site complet : en-tête, pied de page, animations des pages.",
  "Avant toute adoption : faire vérifier par un spécialiste des marques qu'aucun logo déposé ne lui ressemble, puis validation par le bureau.",
 ],
 note="Les six pistes gardent les couleurs de la charte. Toutes sont montrées en tout petit, en une couleur et sur le vert du site ; ce qui ne tient pas à cette taille est écrit sous chaque piste.",
 recommandation="Notre préférence va à la piste 1, « Bien entouré » : c'est la mieux notée à la relecture et la première des trois lecteurs, qui y voient « quelque chose de protégé ». Elle garde votre rond vert, et aucun des trois n'a pensé à Mastercard. Il reste à la poser à côté du logo de la FBM. Vient ensuite la piste 3, « Tenir ensemble », deuxième pour les trois lecteurs, si son air de yin et yang ne vous gêne pas. Si le bureau veut que la défense se voie au premier regard : la piste 6, le bouclier, dont nous reprenons le trait. La piste 2 reste la plus proche de votre logo, mais nos lecteurs y voient encore Mastercard. Rien ne change sur le site : il garde ses deux ronds tant que le bureau n'a pas décidé.")

for c, d in P.items():
    d = dict(key=c, **d, fond_sombre='#657B3D', couleur_action='#5F7A2B')
    json.dump(T(d), open(f'{D}/{c}/description.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(T(PRES), open(f'{D}/presentation.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', list(P))
