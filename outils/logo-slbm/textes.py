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
 defense="Entourer, c'est protéger : le geste gris fait le tour de ce qu'il défend. Ce n'est pas un mur : le trait est celui d'une main, plus plein d'un côté, plus fin de l'autre.",
 union="Le signe montre le collectif autour de chacun plutôt que plusieurs formes qui se rejoignent : dans le rond vert, on peut voir le biologiste ; autour de lui, son syndicat. L'union est dite par « être bien entouré ».",
 sante="On peut aussi lire le rond vert comme le patient, et le geste comme la profession qui veille sur lui. Le signe ne montre pas la santé directement : c'est une lecture, pas une image.",
 couleurs="Deux couleurs dans le signe : le gris du logo pour le geste, le vert anis pour le rond. Le vert foncé reste dans le nom, sur la ligne « de Biologie Médicale ». Sur le vert du site, le geste passe en blanc et le rond reste vert anis. En une couleur, le rond est un peu plus petit, pour que le blanc entre le rond et le geste tienne en petit.",
 palette=pal((GRIS, "le geste qui entoure"), (ANIS, "le rond, ce qui est entouré"), (BLANC, "le geste sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, le rond vert se pose, puis le geste gris se trace autour de lui d'un seul mouvement, comme le trait au marqueur sous les onglets du site.",
 a_verifier="On peut y voir un œil qui regarde en bas à droite, une spirale ou une planète sur son orbite. À 16 px, le blanc entre le rond et le geste devient très fin. Les ressemblances avec des marques qui ont un cercle tracé au pinceau ne sont pas vérifiées.")

P['deux-ronds'] = dict(
 titre="Vos deux ronds",
 idee="Les deux ronds de votre logo, à la même place et aux mêmes couleurs. Le vert reste plein ; le gris devient un anneau épais, tracé comme un O au marqueur. L'anneau ne se remplit, en vert foncé, que là où il rejoint l'autre rond.",
 seconde_lecture="C'est le dessin des pastilles du site : un rond tracé au marqueur, posé sur un rond vert anis décalé en bas à droite.",
 defense="Le signe ne dit pas la défense directement. Il dit ce que dit votre logo actuel : deux forces et ce qu'elles ont en commun.",
 union="Seul, le rond gris n'est qu'un trait ; il ne devient plein qu'en rejoignant l'autre. La zone commune est la partie la plus dense du signe : c'est « l'union fait la force » montré tel quel.",
 sante="Les deux ronds restent deux cellules, la matière de la biologie médicale. Le signe ne dit pas la santé des Français directement.",
 couleurs="Les trois couleurs du logo actuel, rangées de la même façon : le gris en haut à gauche, le vert anis en bas à droite, le vert foncé là où ils se rejoignent. Sur le vert du site : anneau blanc, rond vert anis, zone commune vert clair, comme votre logo sur fond sombre. En une couleur, une fine ligne vide détoure la zone commune.",
 palette=pal((GRIS, "l'anneau tracé au marqueur"), (ANIS, "le rond plein"), (FONCE, "la zone commune"), (BLANC, "l'anneau sur le vert du site"), (CLAIR, "la zone commune sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les deux ronds se rapprochent comme aujourd'hui : l'anneau gris se trace, puis la zone commune se remplit de vert foncé quand ils se rejoignent.",
 a_verifier="Mastercard : un anneau creux et un rond plein, en diagonale, s'en éloignent nettement ; de loin, la zone vert foncé reste celle de deux ronds qui se chevauchent. À montrer à vos collaborateurs. On peut aussi y voir une bague et sa pierre, une loupe sans manche, deux maillons. Le tracé à la main se voit peu : en petit, on lit un anneau régulier.")

P['accroche'] = dict(
 titre="Tenir ensemble",
 idee="Vos deux ronds, gris en haut à gauche et vert en bas à droite, s'ouvrent et s'accrochent l'un à l'autre : le bras de chacun passe par-dessus l'autre et se referme sur ce qu'ils ont en commun, en vert foncé.",
 seconde_lecture="C'est la piste la plus proche de votre logo, donc la plus géométrique des six : les ronds restent de vrais ronds, ce sont les deux fentes blanches qui les font s'accrocher.",
 defense="Les deux ronds se referment sur ce qu'ils ont en commun et le gardent au milieu, à l'abri. La défense est dite par ce geste, sans bouclier.",
 union="C'est le sujet du signe : deux formes qui se tiennent l'une l'autre, aucune ne peut partir sans l'autre. La zone commune est soudée aux deux.",
 sante="Le signe ne dit pas la santé directement. On peut lire, au centre, ce que la profession protège : c'est une lecture, pas une image.",
 couleurs="Les trois couleurs du logo actuel, à la même place. Sur le vert du site : rond gris en blanc, rond vert en vert anis, zone commune en vert clair. En une couleur, deux traits fins cernent la zone commune ; pour toute impression sans couleur, prendre cette version et non une conversion en gris, où le gris et le vert foncé se confondent.",
 palette=pal((GRIS, "le rond du haut"), (ANIS, "le rond du bas"), (FONCE, "ce qu'ils ont en commun"), (BLANC, "le rond du haut sur le vert du site"), (CLAIR, "la zone commune sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les deux ronds se rapprochent comme aujourd'hui, puis chacun passe un bras par-dessus l'autre : les deux fentes blanches s'ouvrent et la zone commune apparaît.",
 a_verifier="Deux virgules tête-bêche : il reste un air de yin et yang, surtout en une couleur. Au centre, on peut voir une amande ou le noyau d'un fruit. À 16 px, les fentes ne sont plus que deux encoches et l'on revoit presque le logo actuel : il faudra un dessin simplifié pour l'onglet du navigateur.")

P['aile'] = dict(
 titre="Sous son aile",
 idee="Une aile qui s'abaisse, faite de trois plumes aux trois couleurs du logo. La grande plume grise couvre la verte, qui couvre la petite vert anis.",
 seconde_lecture="Les trois plumes partent de la même épaule : une plume seule ne fait pas une aile. Les couleurs gardent l'ordre de votre logo, de haut en bas : gris, vert foncé, vert anis.",
 defense="Prendre sous son aile, c'est protéger. Avec le bouclier, c'est le signe le plus direct des six sur la défense, sans arme ni mur.",
 union="Une aile, ce sont plusieurs plumes qui tiennent ensemble : ici trois, de tailles inégales, serrées l'une contre l'autre. L'union est dite, mais en second.",
 sante="Sous l'aile, on peut mettre la profession ou le patient. Le signe ne montre pas la santé directement.",
 couleurs="Les trois couleurs du logo, une par plume. Le gris domine : la grande plume fait plus de la moitié du signe. Sur le vert du site : blanc, vert clair et vert anis ; la petite plume vert anis y ressort peu. En une couleur, une fine ligne vide sépare les trois plumes.",
 palette=pal((GRIS, "la grande plume, celle qui couvre"), (FONCE, "la plume du milieu"), (ANIS, "la petite plume"), (BLANC, "la grande plume sur le vert du site"), (CLAIR, "la plume du milieu sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les trois plumes se déploient l'une après l'autre depuis l'épaule : la petite, la verte, puis la grise, qui vient couvrir les deux autres.",
 a_verifier="Notre contrôle y voit d'abord trois griffes, à cause des pointes qui tombent, avant d'y voir une aile : le dessin est en cours de reprise. L'aile est un emblème très répandu : les ressemblances avec des marques existantes ne sont pas vérifiées.")

P['confluence'] = dict(
 titre="La confluence",
 idee="Deux traits de pinceau, un gris et un vert anis, partent chacun de leur côté et se rejoignent. Ils continuent en un seul trait vert foncé, bien plus épais que chacun des deux, tourné vers le nom.",
 seconde_lecture="Ce sont les trois couleurs de votre logo et la même idée de zone commune : le vert foncé, là où le gris et le vert anis sont réunis. Un biologiste peut aussi y reconnaître, couché, le Y par lequel on dessine les anticorps, qui défendent l'organisme ; nous ne l'avons pas dessiné comme un schéma : à vous de nous dire si cette lecture vous paraît juste.",
 defense="Le signe ne montre pas un bouclier : il montre une force qui avance. Pour un biologiste, le Y de l'anticorps y ajoute l'idée de défense.",
 union="C'est « l'union fait la force » dessiné tel quel : deux traits fins en font un seul, plus épais que chacun. C'est le signe le plus direct des six sur ce point.",
 sante="Le signe ne dit pas la santé directement, sauf par la lecture de l'anticorps, que seuls les professionnels feront.",
 couleurs="Les trois couleurs du logo : le gris et le vert anis pour les deux traits, le vert foncé pour le trait commun. Sur le vert du site, le trait commun passe en blanc, comme le nom, et les deux traits en vert clair et en vert anis ; en petit sur ce fond, on prend la version blanche. En une couleur, une fine ligne vide marque l'endroit où les deux traits se rejoignent.",
 palette=pal((GRIS, "le trait du haut"), (ANIS, "le trait du bas"), (FONCE, "le trait commun"), (BLANC, "le trait commun sur le vert du site"), (CLAIR, "le trait du haut sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, les deux traits se tracent en même temps, chacun de son côté, se rejoignent, puis le trait commun avance vers le nom.",
 a_verifier="On peut y voir un Y couché, une fourche ou un lance-pierre. Tourné d'un quart de tour, on peut y lire un col ouvert et une cravate : nous le présentons toujours couché, tourné vers le nom. Le logo actuel de Synlab, fait de traits, n'a pas pu être comparé : à regarder avant de choisir.")

P['bouclier'] = dict(
 titre="Le bouclier, d'un seul trait",
 idee="Un bouclier tracé d'un seul trait de marqueur gris, tenu devant un grand rond vert anis. La part du rond qu'il couvre passe en vert foncé : c'est ce que le syndicat défend.",
 seconde_lecture="On retrouve votre logo : le gris en haut à gauche, le vert anis en bas à droite, le vert foncé là où ils se recouvrent. Le rond vert est resté ; c'est le rond gris qui est devenu bouclier.",
 defense="C'est le signe le plus direct sur la défense : un bouclier, tenu devant ce qu'on protège. Le trait à la main l'éloigne de l'écusson officiel et de l'icône de sécurité.",
 union="Le signe ne dit pas l'union directement. Il en garde ce que dit votre logo actuel : deux formes et leur zone commune.",
 sante="Le rond vert, derrière le bouclier, peut être la profession ou la santé des patients : ce que le syndicat défend. Le signe ne le précise pas.",
 couleurs="Les trois couleurs du logo actuel, à la même place. Sur le vert du site : trait blanc, rond vert anis, part couverte en vert clair. En une couleur, le bouclier, la part couverte et le reste du rond sont trois formes séparées par une fine ligne vide ; en tout petit, la part couverte est retirée pour que le bouclier reste ouvert.",
 palette=pal((GRIS, "le bouclier, tracé au marqueur"), (ANIS, "le rond, derrière le bouclier"), (FONCE, "la part du rond que le bouclier couvre"), (BLANC, "le bouclier sur le vert du site"), (CLAIR, "la part couverte sur le vert du site"), (ENCRE, "le signe entier en une couleur")),
 animation="À l'ouverture des pages, le rond vert se pose, puis le bouclier se trace devant lui d'un seul mouvement ; la part couverte passe alors en vert foncé.",
 a_verifier="Cela reste un bouclier : on peut y voir l'icône « protection » d'un logiciel ou l'écusson d'un club. La part vert foncé a la forme d'une feuille. En photocopie grise, le gris et le vert foncé se confondent : prendre la version en une couleur. Les ressemblances avec des marques existantes ne sont pas vérifiées.")

PRES = dict(
 surtitre="Proposition de l'agence, après vos retours",
 etat_titre="Ce que vous nous avez dit, et ce que nous avons changé",
 etat=[
  "« Bof », puis « mon petit frère aurait pu les faire » : le premier jeu était fait au compas et à la règle. Nous sommes repartis du dessin : des traits tracés, pleins d'un côté et fins de l'autre, qu'on ne refait pas en deux minutes avec des ronds et des rectangles.",
  "« On n'est pas dans les cravates » : chaque signe a été regardé à l'envers, tourné, en noir et en flou, pour chercher ce qu'on pourrait y voir sans le vouloir. Ce que nous avons trouvé est écrit sous chaque piste, à la ligne « À vérifier ».",
  "« Ça ressemble à Biogroup avec sa goutte » : il n'y a plus aucune goutte, ni rien qui y ressemble.",
  "Vous trouvez le logo actuel « hyper pertinent » : trois pistes partent de vos deux ronds (1, 2 et 3), trois sont nouvelles (4, 5 et 6). Toutes gardent les couleurs de la charte.",
  "Écartés en cours de route, après un jury interne : le microscope (déjà présent dans les logos d'autres organisations de biologistes), la loupe (le bouton « rechercher »), le stéthoscope (l'outil du médecin) et les lettres dessinées.",
  "La santé des Français : aucun des six signes ne la montre directement, puisque les signes qui la montraient ont été écartés. Elle passe par ce que chaque signe entoure ou protège, et par la devise.",
  "Ce que nous n'avons pas pu faire : comparer les six signes aux logos actuels de Biogroup, Cerballiance, Unilabs et Synlab, dont les sites ne sont pas accessibles depuis notre atelier. C'est à faire d'un coup d'œil, par vous ou vos collaborateurs, avant de choisir.",
 ],
 note="Et comme le logo actuel : simple, fort, et qui signifie quelque chose. Les six pistes gardent les couleurs de la charte. Toutes ont été vérifiées en tout petit, en une couleur et sur le vert du site.",
 recommandation="Notre préférence va à la piste 1, « Bien entouré » : c'est le signe le plus dessiné, celui que notre jury interne a le mieux noté, et il dit à la fois la défense (entourer, c'est protéger) et le collectif autour de chacun, en gardant votre rond vert. Pour rester au plus près du logo actuel tout en répondant à la remarque sur Mastercard : la piste 2, « Vos deux ronds ». Si le bureau veut que la défense se voie au premier regard : la piste 6, le bouclier. Rien ne change sur le site : il garde ses deux ronds tant que le bureau n'a pas décidé.")

for c, d in P.items():
    d = dict(key=c, **d, fond_sombre='#657B3D', couleur_action='#5F7A2B')
    json.dump(T(d), open(f'{D}/{c}/description.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(T(PRES), open(f'{D}/presentation.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('ok', list(P))
