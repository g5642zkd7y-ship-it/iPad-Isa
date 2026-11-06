(() => {
  'use strict';

  /* ---------- Outils ---------- */
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const smooth = () => (reduceMotion ? 'auto' : 'smooth');
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const fmt = (iso, opts) => { try { return new Intl.DateTimeFormat('fr-FR', opts).format(new Date(iso + 'T12:00:00')); } catch (e) { return iso; } };
  const longDate = (iso) => fmt(iso, { day: 'numeric', month: 'long', year: 'numeric' });
  const shortDate = (iso) => fmt(iso, { day: 'numeric', month: 'short', year: 'numeric' });
  const pad = (n) => String(n).padStart(2, '0');
  const todayISO = () => { const d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  const isHttp = (u) => /^https?:\/\//i.test(String(u || ''));

  const sv = (w, body) => '<svg width="' + w + '" height="' + w + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + '</svg>';
  const ICON = {
    lock: sv(16, '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'),
    lockS: sv(13, '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>')
  };

  /* ---------- Contenu (repris du site actuel et des sources officielles) ---------- */
  const SRC = { jo: 'Journal officiel', parl: 'Parlement', hors: 'Hors JO' };
  const IMPACT = { fort: 'Impact fort', suivre: 'À suivre', faible: 'Impact faible' };

  const DATA = {
    veille: [
      { id: 'v0', src: 'hors', where: 'Assurance maladie', date: '2026-11-02', when: '2 novembre 2026',
        title: 'Protocole 2027-2029 : l’Assurance maladie et les syndicats représentatifs de biologistes signent',
        teaser: 'Tous les syndicats représentatifs de biologistes médicaux le signent, dont le SLBC.',
        resume: 'L’Assurance maladie et l’ensemble des syndicats représentatifs de biologistes médicaux, dont le SLBC, ont signé le 2 novembre 2026 un nouveau protocole d’accord pour la période 2027-2029. Il prend le relais de l’accord du 20 décembre 2024, qui gèle la nomenclature jusqu’en décembre 2026.',
        impact: 'fort',
        facts: [['Signature', '2 novembre 2026'], ['Période couverte', '2027 à 2029'], ['Signataires', 'Assurance maladie, UNOCAM et syndicats représentatifs de biologistes médicaux, dont le SLBC']],
        url: 'https://toute-la.veille-acteurs-sante.fr/246686/lassurance-maladie-et-lensemble-des-syndicats-representatifs-de-biologistes-medicaux-signent-un-nouveau-protocole-daccord-pour-la-periode-2027-2029/', linkLabel: 'Lire le communiqué, relayé par La Veille Acteurs de Santé' },
      { id: 'v1', src: 'jo', where: 'Journal officiel', date: '2026-10-30', when: 'JO du 30 octobre 2026',
        title: 'Décret n° 2026-1009 du 28 octobre 2026 sur la transmission obligatoire de données à l’autorité sanitaire',
        teaser: 'Hors système d’information, le responsable du laboratoire crée le numéro de signalement lorsque le diagnostic repose sur un examen biologique.',
        resume: 'Le décret précise qui pseudonymise les données transmises lors des signalements de maladies à déclaration obligatoire. Pour les signalements effectués hors du système d’information, la création du numéro de signalement revient au responsable du laboratoire de biologie médicale lorsque le diagnostic repose sur un examen biologique.',
        impact: 'fort',
        facts: [['Publication', 'JO n° 0254 du 30 octobre 2026, texte n° 34'], ['Articles modifiés', 'R. 1413-58-1 et R. 3113-2 du code de la santé publique'], ['Entrée en vigueur', 'Le lendemain de la publication']],
        url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000055029947', linkLabel: 'Lire le décret sur Légifrance' },
      { id: 'v2', src: 'parl', where: 'Sénat', date: '2026-11-02', when: '2 novembre 2026',
        title: 'PLFSS 2027 : le projet de loi est transmis au Sénat',
        teaser: 'Considéré comme rejeté par l’Assemblée nationale, le texte part en commission des affaires sociales du Sénat.',
        resume: 'Le projet de loi de financement de la sécurité sociale pour 2027, considéré comme rejeté par l’Assemblée nationale, a été transmis au Sénat et renvoyé à sa commission des affaires sociales. La veille suit les articles et les amendements qui concernent les laboratoires.',
        impact: 'suivre',
        facts: [['Texte', 'n° 138 (2026-2027)'], ['Étape', 'Renvoi à la commission des affaires sociales']],
        url: 'https://www.senat.fr/leg/pjl26-138.html', linkLabel: 'Voir le texte sur senat.fr' },
      { id: 'v3', src: 'parl', where: 'Assemblée nationale', date: '2026-06-23', when: 'Suivie depuis le 23 juin 2026',
        title: 'Proposition de loi n° 2956 contre les excès de la financiarisation en santé',
        teaser: 'Déposée le 23 juin 2026 et renvoyée à la commission des affaires sociales.',
        resume: 'La proposition de loi portant mesures visant à lutter contre les excès de la financiarisation en santé a été déposée à l’Assemblée nationale le 23 juin 2026 et renvoyée à la commission des affaires sociales. Le SLBC suit chaque étape de son examen.',
        impact: 'suivre',
        facts: [['Dépôt', '23 juin 2026'], ['Commission', 'Affaires sociales']],
        url: 'https://www.assemblee-nationale.fr/dyn/17/textes/l17b2956_proposition-loi', linkLabel: 'Voir le texte sur assemblee-nationale.fr' },
      { id: 'v4', src: 'jo', where: 'Journal officiel', date: '2026-10-22', when: 'Arrêté du 22 octobre 2026',
        title: 'Biosimilaires substituables par le pharmacien d’officine : la liste est modifiée',
        teaser: 'Concerne la substitution en officine. Pas d’effet direct sur les laboratoires.',
        resume: 'L’arrêté modifie la liste des groupes biologiques similaires que le pharmacien d’officine peut substituer, ainsi que les conditions de substitution. Il n’a pas d’effet direct sur l’activité des laboratoires de biologie médicale.',
        impact: 'faible',
        facts: [['Texte', 'Arrêté du 22 octobre 2026 modifiant l’arrêté du 17 septembre 2026']],
        url: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000055018337', linkLabel: 'Lire l’arrêté sur Légifrance' }
    ],
    /* Salle de presse : seulement les communiqués de 2026 (décision d’Isabelle Eimer du 6 novembre 2026).
       Les communiqués de 2024, 2019 et 2014 ont été retirés. Le communiqué sur la signature du protocole
       2027-2029 et le commentaire publié par Nicolas sur LinkedIn sont attendus. */
    presse: [],
    actus: [
      { id: 'a1', date: '2026-09-07', cat: 'Santé publique', title: 'Stratégie nationale de santé sexuelle 2026-2030 : le texte intégral du ministère', excerpt: 'Sur les 22 actions du plan, deux touchent les laboratoires, dont le déploiement de la biologie délocalisée.', url: 'https://www.slbc.fr/strategie-nationale-de-sante-sexuelle-2026-2030-le-texte-integral-du-ministere/' },
      { id: 'a2', date: '2026-09-07', cat: 'Santé publique', title: 'Feuille de route 2026-2030 de la stratégie nationale de santé sexuelle', excerpt: 'La feuille de route prévoit le déploiement de la biologie médicale délocalisée.', url: 'https://www.slbc.fr/feuille-de-route-2026-2030-de-la-strategie-nationale-de-sante-sexuelle/' },
      { id: 'a3', date: '2026-08-31', cat: 'Exercice', title: 'Rapport Beaudeux-Bouvier : biologistes médicaux et assistance médicale à la procréation', excerpt: 'Une mission ministérielle propose de reconnaître et de rémunérer les consultations des biologistes médicaux en assistance médicale à la procréation.', url: 'https://www.slbc.fr/rapport-beaudeux-bouvier-biologistes-medicaux-et-assistance-medicale-a-la-procreation/' },
      { id: 'a4', date: '2026-08-31', cat: 'Vie du syndicat', title: 'Décès du Docteur Jean-François Perotto', excerpt: '', url: 'https://www.slbc.fr/deces-du-docteur-jean-francois-perotto/' },
      { id: 'a5', date: '2026-07-01', cat: 'Social', title: 'Négociations salariales : recommandation patronale et grille 2026', excerpt: 'Les organisations patronales, dont le SLBC, ont émis une recommandation le 15 décembre 2025.', url: 'https://www.slbc.fr/negociations-salariales-recommandation-patronale-et-grille-2026/' },
      { id: 'a6', date: '2026-06-09', cat: 'Appels à projets', title: 'Appel à candidatures PNMR4 pour les tests fonctionnels', excerpt: 'La DGOS a lancé le 9 juin 2026 un appel à candidatures dans le cadre du 4e plan national maladies rares.', url: 'https://www.slbc.fr/appel-a-candidatures-pnmr4-pour-les-tests-fonctionnels/' },
      { id: 'a7', date: '2026-05-04', cat: 'Social', title: 'Grève nationale historique des salariés des laboratoires', excerpt: '', url: 'https://www.slbc.fr/actualites/' },
      { id: 'a8', date: '2026-04-16', cat: 'Nomenclature', title: 'Innovation diagnostique : déploiement du RIHN 2.0', excerpt: '', url: 'https://www.slbc.fr/actualites/' },
      { id: 'a9', date: '2026-02-05', cat: 'Vie du syndicat', title: 'Une ambition commune : valoriser notre expertise médicale', excerpt: '', url: 'https://www.slbc.fr/actualites/' },
      { id: 'a10', date: '2026-02-04', cat: 'Nomenclature', title: 'Radiation de la vitesse de sédimentation (VS) de la NABM', excerpt: '', url: 'https://www.slbc.fr/actualites/' }
    ]
  };

  /* Bureau communiqué par Isabelle Eimer le 5 novembre 2026. */
  const BUREAU = [
    ['Président', 'Thierry Bouchet'], ['Vice-président', 'Antoine Crinquette'], ['Vice-président', 'Pascal Melin'],
    ['Vice-présidente', 'Isabelle Eimer'], ['Secrétaire général', 'Nicolas Roquigny'],
    ['Membre du bureau', 'Éric Flatin'], ['Membre du bureau', 'Alexandre Guiard']
  ];
  const PROTOCOLE = ['Thierry Bouchet', 'Antoine Crinquette', 'Isabelle Eimer', 'Pascal Melin', 'Nicolas Roquigny'];
  /* Page LinkedIn du SLBC (adresse fournie par Isabelle Eimer le 5 novembre 2026).
     Si elle est vidée, les liens LinkedIn signalent qu’elle reste à compléter. */
  const LINKEDIN_URL = 'https://www.linkedin.com/company/slbc-syndicat-des-laboratoires-de-biologie-clinique/';
  /* Adresse de contact unique du SLBC : contact général, contact presse et demandes d’adhésion
     (décisions d’Isabelle Eimer du 6 novembre 2026). Le SLBC n’affiche pas de téléphone.
     Provisoire : contact@slbc.fr, en attendant l’adresse définitive.
     Si elle est vidée, la maquette affiche « adresse à compléter ». */
  const CONTACT_EMAIL = 'contact@slbc.fr';
  /* Missions rédigées avec Isabelle Eimer le 5 novembre 2026, à valider par le bureau.
     Elles remplacent les anciennes « missions » et « priorités ». */
  const MISSIONS = [
    { t: 'Représenter et défendre les biologistes', d: 'Porter la voix des biologistes médicaux auprès des pouvoirs publics et de l’Assurance maladie, et défendre leurs conditions d’exercice.' },
    { t: 'Défendre une biologie de qualité, accessible à tous', d: 'Une biologie de proximité sur tout le territoire, pertinente et exigeante, au service des patients.' },
    { t: 'Faire reconnaître le biologiste comme acteur de santé', d: 'Un médecin ou un pharmacien spécialiste, au cœur du parcours de soins, dont le métier mérite d’être connu.' },
    { t: 'Préparer l’avenir du métier', d: 'Attirer et former les jeunes biologistes, accompagner l’innovation diagnostique et faire vivre la fierté de la profession.' }
  ];
  /* Représentants communiqués par Isabelle Eimer le 5 novembre 2026 ; les autres sièges sont à désigner. */
  const INSTANCES = [
    { n: 'Commission de hiérarchisation des actes de biologie', r: 'Inscription et cotation des actes', reps: ['Thierry Bouchet', 'Éric Flatin', 'Vincent Vieillefond'],
      sub: [['Groupe AMP', []], ['Groupe biochimie', []], ['Groupe cytogénétique', []], ['Groupe hématologie', []]] },
    { n: 'Commission conventionnelle paritaire nationale', r: 'Convention avec l’Assurance maladie', reps: ['Thierry Bouchet', 'Nicolas Roquigny', 'Éric Flatin'] },
    { n: 'Commission nationale de biologie médicale', r: 'Conditions d’exercice de la profession', reps: [] },
    { n: 'Cofrac', r: 'Commission technique d’accréditation', reps: [] },
    { n: 'Ministère chargé de la santé', r: 'Relations avec la tutelle', reps: ['Thierry Bouchet', 'Nicolas Roquigny'] },
    { n: 'Commission sociale paritaire', r: 'Dialogue social de la branche', reps: ['Thierry Bouchet'] },
    { n: 'Commission biologie européenne', r: 'Représentation de la profession en Europe', reps: [] },
    { n: 'Agence de la biomédecine', r: 'AMP, génétique, prélèvement et greffe', reps: [] },
    { n: 'Santé publique France', r: 'Surveillance sanitaire, ex-InVS', reps: [] },
    { n: 'Société française de biologie clinique', r: 'Société savante', reps: [] },
    { n: 'Bio Qualité', r: 'Conseil d’administration', reps: [] },
    { n: 'Centre national des professions de santé', r: 'Interprofession libérale', reps: [] },
    { n: 'Agence nationale du DPC', r: 'Développement professionnel continu', reps: [] },
    { n: 'Klesia', r: 'Prévoyance de la branche', reps: [] }
  ];
  const CA = [
    ['Auvergne-Rhône-Alpes et Bourgogne-Franche-Comté', ['Nicolas Roquigny', 'Éric Flatin', 'François Targe', 'Benoît Dumont', 'Marc Thome', 'Fabienne Moulinier']],
    ['Grand Est', ['Isabelle Eimer', 'Jovana Moularde', 'Carole Granello']],
    ['Hauts-de-France', ['Nicolas Chatelain', 'Antoine Crinquette']],
    ['Île-de-France et outre-mer', ['Thierry Bouchet', 'Pascal Melin', 'Hala Sarmini', 'Alexandre Guiard', 'Ahmed Aboubacar', 'Sophie Beria']],
    ['Nouvelle-Aquitaine', ['Jean-Philippe Brochet']],
    ['Ouest', ['Laurent Perrot']],
    ['Provence-Alpes-Côte d’Azur, Languedoc et Corse', ['Guillaume Armana', 'Sylvain Chambourlier', 'Laurent Kbaier']]
  ];
  const URPS = [
    ['Auvergne-Rhône-Alpes', ['Jacques Pojer', 'Valérie Chepeaux']], ['Bourgogne-Franche-Comté', []],
    ['Bretagne', ['Eric Gueheneux']], ['Centre-Val de Loire', ['François Thomas']], ['Corse', ['Gérard Pesquie']],
    ['Grand Est', ['Christian Laeng', 'Michel Pax']], ['Hauts-de-France', ['Nicolas Chatelain', 'Daniel Gadeyne']],
    ['Île-de-France', ['Hala Sarmini', 'Thierry Bouchet']], ['Normandie', ['Paul Bracquemart']],
    ['Nouvelle-Aquitaine', ['Jean-Philippe Brochet']], ['Occitanie', ['Olivier Attali', 'Arnaud Longuet']],
    ['Pays de la Loire', ['François Maillet']], ['Provence-Alpes-Côte d’Azur', ['Jean-Pierre Fayon', 'Frédéric Charrier']],
    ['Guadeloupe', ['Frédéric Leroy']], ['Guyane', []], ['Martinique', ['Gérard Cherchel']],
    ['La Réunion', ['Paul Emile Gin']], ['Mayotte', ['Ahmed Aboubacar']]
  ];
  const COMPTES = [
    { y: '2023', d: 'Bilan et rapport du commissaire aux comptes' },
    { y: '2022', d: 'États financiers et rapport du commissaire aux comptes' },
    { y: '2021', d: 'Bilan et rapport du commissaire aux comptes' }
  ];
  const NABM = [
    { t: 'Arrêté du 25 janvier 2024' }, { t: 'Arrêté du 5 janvier 2024' },
    { t: 'Décision de l’UNCAM du 7 mars 2023' }, { t: 'Arrêté du 26 janvier 2023' },
    { t: 'Aides à la prescription', s: 'Thyroïde, vitamine D, groupe sanguin (RAI)' }
  ];
  const TEXTES = [
    { theme: 'Branche et rémunération', short: 'Branche', items: ['Rapport de branche des laboratoires de biologie médicale 2021', 'Grille de salaires au 1er mai 2022'] },
    { theme: 'Exercice et réforme de la biologie', short: 'Exercice', items: ['Loi n° 2013-442 portant réforme de la biologie médicale', 'Loi n° 2016-41 de modernisation de notre système de santé', 'Décret n° 2021-293 sur les laboratoires de biologie médicale de référence', 'Arrêté du 8 mars 2021 sur l’accréditation des examens de biologie médicale'] },
    { theme: 'Crise sanitaire', short: 'Covid-19', items: ['Lois, décrets et arrêtés relatifs à la covid-19, de 2020 à 2022'] },
    { theme: 'Guide de référence', short: 'Guide', items: ['« Références juridiques : biologie médicale », DGOS et CNAM, novembre 2018'] }
  ];
  const PARTNERS = [
    { n: 'Cofrac', d: 'Comité français d’accréditation', url: 'https://www.cofrac.fr' },
    { n: 'HAS', d: 'Haute Autorité de santé', url: 'https://www.has-sante.fr' },
    { n: 'Santé publique France', d: 'Agence nationale de santé publique', url: 'https://www.santepubliquefrance.fr' },
    { n: 'INCa', d: 'Institut national du cancer', url: 'https://www.e-cancer.fr' },
    { n: 'SFBC', d: 'Société française de biologie clinique', url: 'https://www.sfbc-asso.fr' },
    { n: 'SFM', d: 'Société française de microbiologie', url: 'https://www.sfm-microbiologie.org' },
    { n: 'CNPS', d: 'Centre national des professions de santé', url: 'https://www.cnps.fr' },
    { n: 'Klesia', d: 'Prévoyance', url: 'https://www.klesia.fr' }
  ];
  const BENEFITS = [
    { t: 'La veille complète, chaque lundi', d: 'Le Journal officiel, l’Assemblée nationale et le Sénat, analysés pour votre laboratoire.' },
    { t: 'Les groupes de travail', d: 'Faire évoluer la nomenclature avec vos pairs et renforcer vos compétences.' },
    { t: 'Une voix dans les instances', d: 'Nomenclature, convention avec l’Assurance maladie, accréditation, Europe.' }
  ];
  const TRACKERS = [
    { title: 'PLFSS 2027', steps: [
      { n: 'Assemblée nationale', w: 'Texte considéré comme rejeté', done: true },
      { n: 'Transmission au Sénat', w: '2 novembre 2026', done: true },
      { n: 'Commission des affaires sociales du Sénat', w: 'Saisie', done: true },
      { n: 'Séance publique au Sénat', w: 'À venir' },
      { n: 'Suite de la navette parlementaire', w: 'À venir' } ] },
    { title: 'PPL n° 2956, financiarisation en santé', steps: [
      { n: 'Dépôt à l’Assemblée nationale', w: '23 juin 2026', done: true },
      { n: 'Commission des affaires sociales', w: 'Saisie', done: true },
      { n: 'Examen en commission', w: 'À venir' },
      { n: 'Séance publique', w: 'À venir' } ] }
  ];

  /* ---------- Publications de démonstration (mémorisées dans ce navigateur uniquement) ---------- */
  const STORE_KEY = 'slbc-maquette-publications';
  const loadDemo = () => { try { const raw = localStorage.getItem(STORE_KEY); const list = raw ? JSON.parse(raw) : []; return Array.isArray(list) ? list : []; } catch (e) { return []; } };
  const saveDemo = (list) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* stockage indisponible : la démonstration reste en mémoire */ } };
  const SUB_KEY = 'slbc-maquette-abonnes';
  const SENT_KEY = 'slbc-maquette-envois';
  const loadList = (key) => { try { const raw = localStorage.getItem(key); const list = raw ? JSON.parse(raw) : []; return Array.isArray(list) ? list : []; } catch (e) { return []; } };
  const saveList = (key, list) => { try { localStorage.setItem(key, JSON.stringify(list)); } catch (e) { /* stockage indisponible : la démonstration reste en mémoire */ } };
  let subscribers = loadList(SUB_KEY).filter((x) => typeof x === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x));
  let sentLog = loadList(SENT_KEY).filter((x) => x && typeof x.subject === 'string' && typeof x.date === 'string' && typeof x.n === 'number');
  let demoPosts = loadDemo().filter((p) => p && DATA[p.kind] && p.item && typeof p.item.title === 'string' && typeof p.item.date === 'string');
  demoPosts.forEach((p) => { if (p.item.url && !isHttp(p.item.url)) p.item.url = null; });
  demoPosts.slice().reverse().forEach((p) => { if (!DATA[p.kind].some((x) => x.id === p.item.id)) DATA[p.kind].unshift(p.item); });

  /* ---------- Gabarits ---------- */
  const vcard = (v) =>
    '<a class="vcard" href="#veille" data-section="vi-' + esc(v.id) + '">' +
      '<span class="src"><span class="dot dot-' + esc(v.src) + '" aria-hidden="true"></span>' + esc(v.where || SRC[v.src]) + '</span>' +
      '<h3>' + esc(v.title) + '</h3>' +
      '<p>' + esc(v.teaser || v.resume) + '</p>' +
      '<span class="vmeta"><span>' + esc(v.when) + '</span><span class="impact impact-' + esc(v.impact) + '">' + esc(IMPACT[v.impact]) + '</span></span>' +
    '</a>';

  const vitem = (v) => {
    const facts = (v.facts || []).map((f) => '<dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>').join('');
    return '<details class="vitem" id="vi-' + esc(v.id) + '"><summary>' +
        '<span class="v-sum"><span class="v-top">' +
          '<span class="src src-light"><span class="dot dot-' + esc(v.src) + '" aria-hidden="true"></span>' + esc(v.where || SRC[v.src]) + '</span>' +
          '<span>' + esc(v.when) + '</span>' +
          '<span class="impact impact-' + esc(v.impact) + '">' + esc(IMPACT[v.impact]) + '</span>' +
          (v.members ? '<span class="tag-members">' + ICON.lockS + 'Adhérents</span>' : '') +
        '</span><span class="v-title">' + esc(v.title) + '</span></span>' +
        '<span class="v-plus" aria-hidden="true"></span>' +
      '</summary><div class="v-body">' +
        '<p>' + esc(v.resume) + '</p>' +
        (facts ? '<dl class="v-facts">' + facts + '</dl>' : '') +
        '<div class="link-row">' +
          (v.url && isHttp(v.url) ? '<a class="more" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.linkLabel || 'Texte officiel') + '</a>' : '') +
          '<span class="members-only">' + ICON.lock + 'Analyse détaillée réservée aux adhérents</span>' +
        '</div></div></details>';
  };

  const pitem = (p) =>
    '<article class="pitem" id="cp-' + esc(p.id) + '">' +
      '<p class="p-meta"><span class="p-date">' + esc(p.dateLabel || longDate(p.date)) + '</span><span>' + esc(p.with) + '</span>' +
        (p.members ? '<span class="tag-members">' + ICON.lockS + 'Adhérents</span>' : '') + '</p>' +
      '<h2 class="p-title">' + esc(p.title) + '</h2>' +
      (p.chapo ? '<p class="p-chapo">' + esc(p.chapo) + '</p>' : '') +
      (p.url && isHttp(p.url) ? '<a class="more" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.linkLabel || 'Lire le communiqué') + '</a>'
                              : '<span class="muted" style="font-size:15px">Publié depuis l’espace adhérent (démonstration).</span>') +
    '</article>';

  const arow = (a) =>
    '<li><a class="row-link" href="#actualites" data-section="ac-' + esc(a.id) + '">' +
      '<time class="row-date" datetime="' + esc(a.date) + '">' + esc(shortDate(a.date)) + '</time>' +
      '<span class="row-title">' + esc(a.title) + '</span>' +
      '<span class="row-cat">' + esc(a.cat) + '</span>' +
    '</a></li>';

  const anews = (a) =>
    '<li class="news-item" id="ac-' + esc(a.id) + '">' +
      '<p class="news-meta"><time datetime="' + esc(a.date) + '">' + esc(longDate(a.date)) + '</time><span>' + esc(a.cat) + '</span>' +
        (a.members ? '<span class="tag-members">' + ICON.lockS + 'Adhérents</span>' : '') + '</p>' +
      '<h2 class="news-title">' + esc(a.title) + '</h2>' +
      (a.excerpt ? '<p class="news-excerpt">' + esc(a.excerpt) + '</p>' : '') +
      (a.url && isHttp(a.url) ? '<a class="more" href="' + esc(a.url) + '" target="_blank" rel="noopener">Lire sur slbc.fr</a>' : '') +
    '</li>';

  const namesOr = (names, empty) => (names.length ? esc(names.join(', ')) : '<span class="pending">' + esc(empty) + '</span>');

  /* ---------- Commande segmentée ---------- */
  function seg(el, options, current, onPick) {
    el.innerHTML = options.map((o) => '<button type="button" aria-pressed="' + (o === current ? 'true' : 'false') + '">' + esc(o) + '</button>').join('');
    $$('button', el).forEach((b, i) => b.addEventListener('click', () => {
      onPick(options[i]);
      const pressed = el.querySelector('[aria-pressed="true"]');
      if (pressed) pressed.focus();
    }));
  }

  /* ---------- Rendu du contenu fixe ---------- */
  function renderStatic() {
    $('#home-missions').innerHTML = MISSIONS.map((m) => '<li><span class="tile-item">' + esc(m.t) + '</span></li>').join('');
    $('#home-instances').innerHTML = INSTANCES.map((i) => '<li><span class="nw-name">' + esc(i.n) + '</span><span class="nw-role">' + esc(i.r) + '</span></li>').join('');
    $('#home-benefits').innerHTML = BENEFITS.map((b) => '<li><span>' + esc(b.t) + '</span></li>').join('');
    $('#benefits-grid').innerHTML = BENEFITS.map((b) => '<div class="benefit"><h2>' + esc(b.t) + '</h2><p>' + esc(b.d) + '</p></div>').join('');
    $('#missions-list').innerHTML = MISSIONS.map((m) => '<div class="charter-item"><h3 class="h-block">' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p></div>').join('');
    $('#bureau-list').innerHTML = BUREAU.map((b) => '<li class="person"><span class="person-role">' + esc(b[0]) + '</span><span class="person-name">' + esc(b[1]) + '</span></li>').join('');
    $('#protocole-list').textContent = PROTOCOLE.join(', ');
    $('#ca-list').innerHTML = CA.map((r) => '<details class="region"><summary><span>' + esc(r[0]) + '</span><span class="count">' + r[1].length + ' administrateur' + (r[1].length > 1 ? 's' : '') + '</span></summary><p>' + esc(r[1].join(', ')) + '</p></details>').join('');
    $('#inst-list').innerHTML = INSTANCES.map((i) => {
      const sub = i.sub ? '<div class="inst-sub">' + i.sub.map((g) => '<div><strong>' + esc(g[0]) + '</strong>' + namesOr(g[1], 'Représentant à désigner') + '</div>').join('') + '</div>' : '';
      return '<div class="inst-row"><div><p class="inst-name">' + esc(i.n) + '</p><p class="inst-role">' + esc(i.r) + '</p></div><p class="inst-reps">' + namesOr(i.reps, 'Représentant à désigner') + '</p>' + sub + '</div>';
    }).join('');
    $('#urps-list').innerHTML = URPS.map((u) => '<div class="urps-item"><p class="urps-region">' + esc(u[0]) + '</p><p class="urps-names">' + namesOr(u[1], 'Représentant à désigner') + '</p></div>').join('');
    $('#comptes-list').innerHTML = '<li><a class="row-link" href="https://www.slbc.fr/le-syndicat/les-statuts-du-slbc/" target="_blank" rel="noopener"><span class="row-date">Statuts</span><span class="row-title">Les statuts du SLBC</span><span class="row-cat">slbc.fr</span></a></li>' +
      COMPTES.map((c) => '<li><a class="row-link" href="https://www.slbc.fr/bilan-et-etat-financier/" target="_blank" rel="noopener"><span class="row-date">Exercice ' + esc(c.y) + '</span><span class="row-title">' + esc(c.d) + '</span><span class="row-cat">slbc.fr</span></a></li>').join('');
    $('#trackers').innerHTML = TRACKERS.map((t) => '<p class="track-title">' + esc(t.title) + '</p><ol class="track">' + t.steps.map((s) => '<li class="' + (s.done ? 'done' : '') + '"><span class="step-name">' + esc(s.n) + '</span><span class="step-when">' + esc(s.w) + '</span></li>').join('') + '</ol>').join('');
    $('#foot-partners').innerHTML = PARTNERS.slice(0, 5).map((p) => '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.n) + '</a></li>').join('');
    renderDocs('');
  }

  function renderDocs(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    const ok = (s) => !terms.length || terms.every((t) => norm(s).includes(t));
    const nabm = NABM.filter((d) => ok(d.t + ' ' + (d.s || '') + ' nabm nomenclature'));
    $('#doc-nabm-list').innerHTML = nabm.map((d) => '<li><a class="row-link" href="https://www.slbc.fr/documentation/chab/" target="_blank" rel="noopener"><span class="row-date">NABM</span><span class="row-title">' + esc(d.t) + (d.s ? '<span class="row-sub">' + esc(d.s) + '</span>' : '') + '</span><span class="row-cat">slbc.fr</span></a></li>').join('');
    $('#doc-nabm').hidden = !nabm.length;
    let html = '';
    let count = 0;
    TEXTES.forEach((g) => {
      const items = g.items.filter((t) => ok(t + ' ' + g.theme));
      if (!items.length) return;
      count += items.length;
      html += '<p class="doc-theme">' + esc(g.theme) + '</p><ul class="rows">' + items.map((t) => '<li><a class="row-link" href="https://www.slbc.fr/documentation/professionnel/" target="_blank" rel="noopener"><span class="row-date">' + esc(g.short) + '</span><span class="row-title">' + esc(t) + '</span><span class="row-cat">slbc.fr</span></a></li>').join('') + '</ul>';
    });
    $('#doc-textes-list').innerHTML = html;
    $('#doc-textes').hidden = !count;
    const parts = PARTNERS.filter((p) => ok(p.n + ' ' + p.d + ' partenaire'));
    $('#partners-list').innerHTML = parts.map((p) => '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener"><strong>' + esc(p.n) + '</strong><span>' + esc(p.d) + '</span></a></li>').join('');
    $('#doc-partenaires').hidden = !parts.length;
    $('#doc-empty').hidden = Boolean(nabm.length || count || parts.length);
  }

  /* ---------- Rendu du contenu publié ---------- */
  const state = { homeCat: 'Toutes', actuCat: 'Toutes', presseYear: 'Toutes', veilleSrc: 'Tout' };
  const CAT_ORDER = ['Toutes', 'Nomenclature', 'Social', 'Santé publique', 'Exercice', 'Vie du syndicat', 'Appels à projets'];
  const cats = () => { const present = new Set(DATA.actus.map((a) => a.cat)); return CAT_ORDER.filter((c) => c === 'Toutes' || present.has(c)); };
  const byDate = (a, b) => b.date.localeCompare(a.date);

  function renderShelf() { $('#home-shelf').innerHTML = DATA.veille.map(vcard).join(''); updateShelf(); }
  function renderHomeActus() {
    seg($('#home-actu-seg'), cats(), state.homeCat, (c) => { state.homeCat = c; renderHomeActus(); });
    $('#home-actus').innerHTML = DATA.actus.slice().sort(byDate).filter((a) => state.homeCat === 'Toutes' || a.cat === state.homeCat).slice(0, 5).map(arow).join('');
  }
  function renderActus() {
    seg($('#actu-seg'), cats(), state.actuCat, (c) => { state.actuCat = c; renderActus(); });
    $('#actu-list').innerHTML = DATA.actus.slice().sort(byDate).filter((a) => state.actuCat === 'Toutes' || a.cat === state.actuCat).map(anews).join('');
  }
  function renderVeille() {
    const map = { 'Journal officiel': 'jo', 'Parlement': 'parl', 'Hors JO': 'hors' };
    seg($('#veille-seg'), ['Tout', 'Journal officiel', 'Parlement', 'Hors JO'], state.veilleSrc, (s) => { state.veilleSrc = s; renderVeille(); });
    const list = DATA.veille.filter((v) => state.veilleSrc === 'Tout' || v.src === map[state.veilleSrc]);
    $('#veille-list').innerHTML = list.length ? list.map(vitem).join('') : '<p class="empty">Aucun élément « ' + esc(state.veilleSrc) + ' » dans cette synthèse.</p>';
  }
  function renderPresse() {
    const years = ['Toutes'].concat(Array.from(new Set(DATA.presse.map((p) => p.year))).sort((a, b) => b.localeCompare(a)));
    seg($('#presse-seg'), years, state.presseYear, (y) => { state.presseYear = y; renderPresse(); });
    $('#presse-seg').hidden = years.length <= 2;
    const items = DATA.presse.slice().sort(byDate).filter((p) => state.presseYear === 'Toutes' || p.year === state.presseYear);
    $('#presse-list').innerHTML = items.length ? items.map(pitem).join('')
      : '<p class="empty">Aucun communiqué pour l’instant. Le communiqué sur la signature du protocole 2027-2029 sera publié ici.</p>';
  }
  function renderRecent() {
    const all = []
      .concat(DATA.presse.map((x) => ({ k: 'Communiqué', d: x.date, l: x.dateLabel, t: x.title, demo: x.demo })))
      .concat(DATA.veille.map((x) => ({ k: 'Veille', d: x.date, l: null, t: x.title, demo: x.demo })))
      .concat(DATA.actus.map((x) => ({ k: 'Actualité', d: x.date, l: null, t: x.title, demo: x.demo })))
      .sort((a, b) => b.d.localeCompare(a.d)).slice(0, 5);
    $('#recent').innerHTML = all.map((r) => '<li><span class="r-kind">' + esc(r.k) + ', ' + esc(r.l || shortDate(r.d)) + (r.demo ? ', démonstration' : '') + '</span><span class="r-title">' + esc(r.t) + '</span></li>').join('');
    $('#reset-demo').hidden = !demoPosts.length && !sentLog.length;
  }
  function renderDynamic() { renderShelf(); renderHomeActus(); renderActus(); renderVeille(); renderPresse(); renderRecent(); INDEX = buildIndex(); }

  /* ---------- Étagère de la veille ---------- */
  const shelf = $('#home-shelf');
  const shelfBtns = $$('[data-shelf]');
  function updateShelf() {
    if (!shelf || shelfBtns.length < 2) return;
    const max = shelf.scrollWidth - shelf.clientWidth;
    shelfBtns[0].disabled = shelf.scrollLeft <= 4;
    shelfBtns[1].disabled = max <= 4 || shelf.scrollLeft >= max - 4;
  }
  shelfBtns.forEach((b) => b.addEventListener('click', () => {
    const card = shelf.querySelector('.vcard');
    const step = card ? card.getBoundingClientRect().width + 16 : 320;
    shelf.scrollBy({ left: step * Number(b.dataset.shelf), behavior: smooth() });
  }));
  shelf.addEventListener('scroll', updateShelf, { passive: true });
  window.addEventListener('resize', updateShelf);

  /* ---------- Navigation entre les vues ---------- */
  const VIEWS = ['accueil', 'syndicat', 'veille', 'presse', 'actualites', 'documentation', 'adherer', 'espace', 'mentions'];
  let current = null;
  let pendingSection = null;

  function goSection(id) {
    let t = document.getElementById(id);
    if (!t || t.offsetParent === null) {
      state.veilleSrc = 'Tout'; state.actuCat = 'Toutes'; state.presseYear = 'Toutes';
      renderVeille(); renderActus(); renderPresse();
      t = document.getElementById(id);
    }
    if (!t) return;
    if (t.tagName === 'DETAILS') t.open = true;
    t.scrollIntoView({ behavior: smooth(), block: 'start' });
  }

  function route() {
    let v = (location.hash || '').slice(1) || 'accueil';
    if (VIEWS.indexOf(v) < 0) v = 'accueil';
    const changed = v !== current;
    $$('.view').forEach((el) => {
      const on = el.dataset.view === v;
      el.hidden = !on;
      if (on && changed && current !== null) { el.classList.remove('entering'); void el.offsetWidth; el.classList.add('entering'); }
    });
    $$('[data-nav]').forEach((a) => { if (a.dataset.nav === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    current = v;
    closeMenu();
    if (v === 'accueil') requestAnimationFrame(updateShelf);
    if (pendingSection) {
      const id = pendingSection;
      pendingSection = null;
      requestAnimationFrame(() => goSection(id));
    } else if (changed) {
      window.scrollTo(0, 0);
    }
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const sec = a.dataset.section || null;
    if (a.id === 'toast-link') $('#toast').hidden = true;
    closeSearch(true);
    closeMenu();
    const here = location.hash || '#accueil';
    if (href === here) {
      e.preventDefault();
      if (sec) goSection(sec); else window.scrollTo({ top: 0, behavior: smooth() });
    } else {
      pendingSection = sec;
    }
  });
  window.addEventListener('hashchange', route);

  /* ---------- Menu mobile ---------- */
  const menuBtn = $('#menu-btn');
  const mmenu = $('#mmenu');
  function openMenu() { mmenu.hidden = false; menuBtn.setAttribute('aria-expanded', 'true'); menuBtn.setAttribute('aria-label', 'Fermer le menu'); document.documentElement.style.overflow = 'hidden'; }
  function closeMenu() { if (mmenu.hidden) return; mmenu.hidden = true; menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.setAttribute('aria-label', 'Ouvrir le menu'); document.documentElement.style.overflow = ''; }
  menuBtn.addEventListener('click', () => (mmenu.hidden ? openMenu() : closeMenu()));

  /* ---------- Recherche ---------- */
  let INDEX = [];
  function buildIndex() {
    const idx = [];
    const page = (title, sub, href, section) => idx.push({ type: 'Page', title, sub, href, section, text: '' });
    page('Le syndicat', 'Missions, bureau, représentants', '#syndicat');
    page('Ce que nous défendons', 'Fierté du métier, souveraineté du diagnostic, science', '#accueil', 'piliers');
    page('Bureau exécutif', 'Président, vice-présidents, secrétaire général, membres', '#syndicat', 'bureau');
    page('Conseil d’administration', 'Les administrateurs par région', '#syndicat', 'conseil');
    page('Nos représentants', 'Nomenclature, convention, accréditation, Europe', '#syndicat', 'representants');
    page('Les URPS', 'La représentation des biologistes en région', '#syndicat', 'urps');
    page('Statuts et comptes', 'Les statuts du SLBC, comptes 2021 à 2023', '#syndicat', 'comptes');
    page('Veille réglementaire', 'Journal officiel, Assemblée nationale, Sénat', '#veille');
    idx.push({ type: 'Page', title: 'Lettre d’information', sub: 'La veille et les nouvelles publications par e-mail', href: '#veille', section: 'abonnement', text: 'newsletter abonnement abonner s’abonner s\'abonner désinscription e-mail' });
    idx.push({ type: 'Page', title: 'Salle de presse', sub: 'Les communiqués du SLBC', href: '#presse', section: null, text: 'contact presse journaliste kit presse logo' });
    idx.push({ type: 'Page', title: 'Contacter le SLBC', sub: 'Adresse e-mail et adresse postale', href: '#mentions', section: 'mentions-legales', text: 'contact contacter nous contacter écrire e-mail courriel adresse téléphone' });
    page('Actualités', 'L’information du syndicat', '#actualites');
    page('Nomenclature des actes (NABM)', 'Arrêtés et décisions de l’UNCAM', '#documentation', 'doc-nabm');
    page('Textes réglementaires', 'Lois, décrets et arrêtés', '#documentation', 'doc-textes');
    page('Adhérer au SLBC', 'Demande d’adhésion en ligne', '#adherer');
    page('Espace adhérent', 'Publier, envoyer la lettre d’information', '#espace');
    idx.push({ type: 'Page', title: 'Mentions légales', sub: 'Éditeur, directeur de la publication, hébergeur', href: '#mentions', section: null, text: 'informations légales éditeur hébergeur droit de réponse' });
    idx.push({ type: 'Page', title: 'Données personnelles', sub: 'Usages, durées de conservation, vos droits', href: '#mentions', section: 'donnees', text: 'RGPD confidentialité vie privée CNIL droits' });
    idx.push({ type: 'Page', title: 'Cookies', sub: 'Aucun cookie de mesure d’audience ni de publicité', href: '#mentions', section: 'cookies', text: 'traceurs bandeau' });
    DATA.veille.forEach((v) => idx.push({ type: 'Veille', title: v.title, sub: v.when, href: '#veille', section: 'vi-' + v.id, text: v.resume }));
    DATA.presse.forEach((p) => idx.push({ type: 'Communiqué', title: p.title, sub: p.dateLabel || longDate(p.date), href: '#presse', section: 'cp-' + p.id, text: p.chapo + ' ' + p.with }));
    DATA.actus.forEach((a) => idx.push({ type: 'Actualité', title: a.title, sub: longDate(a.date), href: '#actualites', section: 'ac-' + a.id, text: a.excerpt + ' ' + a.cat }));
    BUREAU.forEach((b) => idx.push({ type: 'Bureau', title: b[1], sub: b[0], href: '#syndicat', section: 'bureau', text: '' }));
    INSTANCES.forEach((i) => idx.push({ type: 'Instance', title: i.n, sub: i.r, href: '#syndicat', section: 'representants', text: i.reps.join(' ') }));
    NABM.forEach((d) => idx.push({ type: 'Document', title: d.t, sub: 'Nomenclature des actes', href: '#documentation', section: 'doc-nabm', text: d.s || '' }));
    TEXTES.forEach((g) => g.items.forEach((t) => idx.push({ type: 'Document', title: t, sub: g.theme, href: '#documentation', section: 'doc-textes', text: '' })));
    return idx;
  }
  const srItem = (it) =>
    '<li><a class="sr-link" href="' + esc(it.href) + '"' + (it.section ? ' data-section="' + esc(it.section) + '"' : '') + '>' +
      '<span class="sr-type">' + esc(it.type) + '</span>' +
      '<span class="sr-main"><span class="sr-name">' + esc(it.title) + '</span>' + (it.sub ? '<span class="sr-sub">' + esc(it.sub) + '</span>' : '') + '</span>' +
    '</a></li>';
  function renderSearch(q) {
    const box = $('#search-results');
    const terms = norm(q).split(/\s+/).filter(Boolean);
    if (!terms.length) {
      const quick = ['Veille réglementaire', 'Adhérer au SLBC', 'Nomenclature des actes (NABM)', 'Bureau exécutif', 'Salle de presse'].map((t) => INDEX.find((i) => i.title === t)).filter(Boolean);
      box.innerHTML = '<p class="sr-title">Liens rapides</p><ul class="sr-list">' + quick.map(srItem).join('') + '</ul>';
      return;
    }
    const scored = [];
    INDEX.forEach((it) => {
      const hay = norm([it.title, it.sub, it.text, it.type].join(' '));
      if (!terms.every((t) => hay.includes(t))) return;
      const tn = norm(it.title);
      const score = terms.reduce((s, t) => s + (tn.includes(t) ? 2 : 0), 0) + (tn.startsWith(terms[0]) ? 1 : 0);
      scored.push([score, it]);
    });
    scored.sort((a, b) => b[0] - a[0]);
    box.innerHTML = scored.length
      ? '<p class="sr-title">' + scored.length + ' résultat' + (scored.length > 1 ? 's' : '') + '</p><ul class="sr-list">' + scored.slice(0, 12).map((x) => srItem(x[1])).join('') + '</ul>'
      : '<p class="sr-empty">Aucun résultat pour « ' + esc(q) + ' ». Essayez « nomenclature », « PLFSS » ou « bureau ».</p>';
  }
  const sPanel = $('#search-panel');
  const sScrim = $('#search-scrim');
  const sInput = $('#search-input');
  const sOpen = $('#search-open');
  function openSearch() {
    closeMenu();
    sPanel.hidden = false; sScrim.hidden = false;
    sOpen.setAttribute('aria-expanded', 'true');
    sInput.value = '';
    renderSearch('');
    document.documentElement.style.overflow = 'hidden';
    setTimeout(() => sInput.focus(), 30);
  }
  function closeSearch(silent) {
    if (sPanel.hidden) return;
    sPanel.hidden = true; sScrim.hidden = true;
    sOpen.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    if (!silent) sOpen.focus({ preventScroll: true });
  }
  sOpen.addEventListener('click', openSearch);
  $('#search-close').addEventListener('click', () => closeSearch(false));
  sScrim.addEventListener('click', () => closeSearch(false));
  sInput.addEventListener('input', () => renderSearch(sInput.value));
  sInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const first = $('#search-results .sr-link'); if (first) { e.preventDefault(); first.click(); } } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!sPanel.hidden) closeSearch(false); else closeMenu(); } });

  /* ---------- Copier ---------- */
  function selectText(el) { if (!el) return; const r = document.createRange(); r.selectNodeContents(el); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const done = () => { b.textContent = 'Copié'; setTimeout(() => { b.textContent = 'Copier'; }, 1800); };
    const fallback = () => selectText(b.previousElementSibling);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.dataset.copy).then(done).catch(fallback);
      else fallback();
    } catch (err) { fallback(); }
  });

  /* ---------- Abonnement ---------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  $('#abonnement').addEventListener('submit', (e) => {
    e.preventDefault();
    const em = $('#sub-email'); const er = $('#sub-error'); const ok = $('#sub-ok'); const consent = $('#sub-consent');
    const fail = (msg, el) => { er.textContent = msg; er.hidden = false; ok.hidden = true; el.setAttribute('aria-invalid', 'true'); el.focus(); };
    em.removeAttribute('aria-invalid'); consent.removeAttribute('aria-invalid');
    const addr = em.value.trim().toLowerCase();
    if (!EMAIL_RE.test(addr)) { fail('Saisissez une adresse e-mail valide, par exemple nom@laboratoire.fr.', em); return; }
    if (!consent.checked) { fail('Cochez la case pour confirmer votre inscription.', consent); return; }
    er.hidden = true;
    if (subscribers.includes(addr)) { ok.textContent = 'Cette adresse est déjà inscrite.'; ok.hidden = false; return; }
    subscribers.push(addr);
    saveList(SUB_KEY, subscribers);
    renderNewsletter();
    updatePreview();
    ok.textContent = 'Inscription enregistrée pour la démonstration.';
    ok.hidden = false;
    em.value = ''; consent.checked = false;
  });

  /* ---------- Documentation ---------- */
  $('#doc-q').addEventListener('input', (e) => renderDocs(e.target.value));

  /* ---------- Demande d’adhésion ---------- */
  const jf = $('#join-form');
  let jStep = 1;
  function jShow(n) {
    jStep = n;
    $$('[data-panel]', jf).forEach((p) => { p.hidden = Number(p.dataset.panel) !== n; });
    $$('.steps li', jf).forEach((li, i) => {
      li.classList.toggle('is-current', i + 1 === n);
      li.classList.toggle('is-done', i + 1 < n);
      if (i + 1 === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    $('#join-prev').hidden = n === 1;
    $('#join-next').textContent = n === 3 ? 'Envoyer ma demande' : 'Continuer';
    if (n === 3) {
      const civ = jf.querySelector('input[name="civ"]:checked');
      const rows = [
        ['Nom', ((civ ? civ.value : '') + ' ' + $('#j-prenom').value.trim() + ' ' + $('#j-nom').value.trim()).trim()],
        ['E-mail', $('#j-email').value.trim()],
        ['Téléphone', $('#j-tel').value.trim() || 'Non renseigné'],
        ['Laboratoire', $('#j-labo').value.trim()],
        ['Ville', $('#j-ville').value.trim()],
        ['Exercice', $('#j-statut').value]
      ];
      $('#j-recap').innerHTML = rows.map((r) => '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>').join('');
    }
  }
  function jValidate(n) {
    const panel = jf.querySelector('[data-panel="' + n + '"]');
    let ok = true;
    $$('.field-error', panel).forEach((x) => { x.hidden = true; x.textContent = ''; });
    $$('[aria-invalid]', panel).forEach((x) => x.removeAttribute('aria-invalid'));
    $$('[data-req]', panel).forEach((inp) => {
      let msg = '';
      if (inp.type === 'checkbox') { if (!inp.checked) msg = inp.dataset.req; }
      else if (!inp.value.trim()) msg = inp.dataset.req;
      else if (inp.type === 'email' && !EMAIL_RE.test(inp.value.trim())) msg = 'Saisissez une adresse e-mail valide, par exemple nom@laboratoire.fr.';
      if (msg) {
        ok = false;
        inp.setAttribute('aria-invalid', 'true');
        const err = document.getElementById(inp.id + '-err');
        if (err) { err.textContent = msg; err.hidden = false; }
      }
    });
    if (!ok) { const first = panel.querySelector('[aria-invalid="true"]'); if (first) first.focus(); }
    return ok;
  }
  jf.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!jValidate(jStep)) return;
    if (jStep < 3) {
      jShow(jStep + 1);
      const f = jf.querySelector('[data-panel="' + jStep + '"] .input');
      if (f) f.focus({ preventScroll: true });
      return;
    }
    $('#join-wrap').hidden = true;
    $('#join-done').hidden = false;
  });
  $('#join-prev').addEventListener('click', () => jShow(Math.max(1, jStep - 1)));
  $('#join-restart').addEventListener('click', () => { jf.reset(); $('#join-wrap').hidden = false; $('#join-done').hidden = true; jShow(1); });

  /* ---------- Espace adhérent : connexion ---------- */
  $('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const em = $('#login-email'); const er = $('#login-err');
    if (!em.value.trim()) { er.textContent = 'Saisissez votre e-mail.'; er.hidden = false; em.setAttribute('aria-invalid', 'true'); em.focus(); return; }
    er.hidden = true; em.removeAttribute('aria-invalid');
    $('#login').hidden = true; $('#admin').hidden = false;
    window.scrollTo(0, 0);
    $('#f-title').focus({ preventScroll: true });
  });
  $('#logout').addEventListener('click', () => { $('#admin').hidden = true; $('#login').hidden = false; window.scrollTo(0, 0); });

  /* ---------- Espace adhérent : publier ---------- */
  const PUB = {
    cp: { label: 'Communiqué', submit: 'Publier le communiqué', toast: 'Communiqué publié', href: '#presse', prefix: 'cp-', where: 'La publication apparaîtra en tête de la salle de presse.' },
    veille: { label: 'Veille', submit: 'Publier dans la veille', toast: 'Publié dans la veille', href: '#veille', prefix: 'vi-', where: 'La publication apparaîtra dans la veille réglementaire et dans le bandeau de la page d’accueil.' },
    actu: { label: 'Actualité', submit: 'Publier l’actualité', toast: 'Actualité publiée', href: '#actualites', prefix: 'ac-', where: 'La publication apparaîtra dans les actualités et sur la page d’accueil.' }
  };
  let pubType = 'cp';
  function renderPubType() {
    seg($('#pub-type'), ['Communiqué', 'Veille', 'Actualité'], PUB[pubType].label, (l) => {
      pubType = Object.keys(PUB).find((k) => PUB[k].label === l) || 'cp';
      renderPubType();
      updatePreview();
    });
    $('#g-veille').hidden = pubType !== 'veille';
    $('#g-actu').hidden = pubType !== 'actu';
    $('#pub-submit').textContent = PUB[pubType].submit;
  }
  function updatePreview() {
    const title = $('#f-title').value.trim();
    const resume = $('#f-resume').value.trim() || $('#f-body').value.trim().slice(0, 220);
    const date = $('#f-date').value || todayISO();
    let tags = '<span class="pv-type">' + esc(PUB[pubType].label) + '</span>';
    if (pubType === 'veille') {
      const imp = $('#f-impact').value;
      tags += '<span class="impact impact-' + esc(imp) + '">' + esc(IMPACT[imp]) + '</span>';
    }
    if (pubType === 'actu') tags += '<span class="impact impact-suivre">' + esc($('#f-cat').value) + '</span>';
    if ($('#f-members').checked) tags += '<span class="tag-members">' + ICON.lockS + 'Réservé aux adhérents</span>';
    const src = pubType === 'veille' ? '<span class="src src-light"><span class="dot dot-' + esc($('#f-src').value) + '" aria-hidden="true"></span>' + esc(SRC[$('#f-src').value]) + '</span>' : '';
    $('#preview').innerHTML = '<div class="pv-tags">' + tags + '</div>' + src +
      '<p class="pv-title' + (title ? '' : ' is-empty') + '">' + esc(title || 'Titre de la publication') + '</p>' +
      '<p class="pv-resume">' + esc(resume || 'Le résumé s’affichera ici. C’est aussi le texte repris sur la page d’accueil.') + '</p>' +
      '<p class="pv-date">' + esc(longDate(date)) + '</p>';
    const mail = $('#f-mail').checked;
    const n = subscribers.length;
    $('#preview-where').textContent = PUB[pubType].where + (mail ? (n ? (n === 1 ? ' L’abonné la recevra aussi par e-mail.' : ' ' + abonnes(n, true) + ' la recevront aussi par e-mail.') : ' Aucun abonné pour l’instant : aucun e-mail ne partira.') : '');
    $('#g-mail-subject').hidden = !mail;
    $('#mail-preview-wrap').hidden = !mail;
    if (mail) {
      const subject = $('#f-subject').value.trim() || title;
      $('#mp-meta').innerHTML = '<span><strong>De :</strong> SLBC</span><span><strong>À :</strong> ' + esc(n ? abonnes(n, false) + ' de la lettre d’information' : 'aucun abonné pour l’instant') + '</span>' +
        '<span><strong>Objet :</strong> ' + esc(subject || 'Objet de l’e-mail') + '</span>';
      $('#mp-body').innerHTML = '<p class="mp-type">' + esc(PUB[pubType].label) + (pubType === 'actu' ? ' · ' + esc($('#f-cat').value) : '') + '</p>' +
        '<p class="mp-title">' + esc(title || 'Titre de la publication') + '</p>' +
        '<p class="mp-text">' + esc(resume || 'Le résumé de la publication s’affichera ici.') + '</p>' +
        '<span class="mp-btn">Lire sur le site</span>' +
        ($('#f-members').checked ? '<p class="mp-note">Réservé aux adhérents : la lecture complète demande de se connecter.</p>' : '');
    }
  }
  const abonnes = (n, withArticle) => (withArticle ? 'Les ' : '') + n + ' abonné' + (n > 1 ? 's' : '');
  ['f-title', 'f-resume', 'f-body', 'f-date', 'f-members', 'f-mail', 'f-subject', 'f-src', 'f-impact', 'f-cat'].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('input', updatePreview);
    el.addEventListener('change', updatePreview);
  });

  let toastTimer = null;
  function showToast(msg, href, section) {
    $('#toast-msg').textContent = msg;
    const l = $('#toast-link');
    if (href) { l.hidden = false; l.setAttribute('href', href); if (section) l.dataset.section = section; else delete l.dataset.section; }
    else l.hidden = true;
    $('#toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 6000);
  }

  $('#pub-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#pub-error');
    const titleEl = $('#f-title');
    const title = titleEl.value.trim();
    const urlEl = $('#f-url');
    const urlVal = urlEl.value.trim();
    err.hidden = true; titleEl.removeAttribute('aria-invalid'); urlEl.removeAttribute('aria-invalid');
    if (!title) { err.textContent = 'Ajoutez un titre pour publier.'; err.hidden = false; titleEl.setAttribute('aria-invalid', 'true'); titleEl.focus(); return; }
    if (pubType === 'veille' && urlVal && !isHttp(urlVal)) { err.textContent = 'Le lien vers le texte officiel doit commencer par https://'; err.hidden = false; urlEl.setAttribute('aria-invalid', 'true'); urlEl.focus(); return; }
    const date = $('#f-date').value || todayISO();
    const resume = $('#f-resume').value.trim() || $('#f-body').value.trim().slice(0, 240);
    const members = $('#f-members').checked;
    const mail = $('#f-mail').checked;
    const id = 'd' + Date.now().toString(36);
    let kind;
    let item;
    if (pubType === 'cp') {
      kind = 'presse';
      item = { id, date, year: date.slice(0, 4), title, with: 'Communiqué du SLBC', chapo: resume, url: null, members, demo: true };
      state.presseYear = 'Toutes';
    } else if (pubType === 'veille') {
      const src = $('#f-src').value;
      kind = 'veille';
      item = { id, src, where: SRC[src], date, when: longDate(date), title, teaser: resume, resume: resume || 'Résumé à compléter.', impact: $('#f-impact').value, facts: [], url: urlVal || null, linkLabel: 'Lire le texte officiel', members, demo: true };
      state.veilleSrc = 'Tout';
    } else {
      kind = 'actus';
      item = { id, date, cat: $('#f-cat').value, title, excerpt: resume, url: null, members, demo: true };
      state.homeCat = 'Toutes'; state.actuCat = 'Toutes';
    }
    DATA[kind].unshift(item);
    demoPosts.unshift({ kind, item });
    saveDemo(demoPosts);
    renderDynamic();
    let note = '';
    if (mail && subscribers.length) {
      sentLog.unshift({ date: todayISO(), subject: $('#f-subject').value.trim() || title, n: subscribers.length, type: PUB[pubType].label });
      saveList(SENT_KEY, sentLog);
      renderNewsletter();
      note = ', envoi simulé à ' + abonnes(subscribers.length, false).toLowerCase();
    } else if (mail) {
      note = ', aucun abonné à qui l’envoyer';
    }
    showToast(PUB[pubType].toast + note, PUB[pubType].href, PUB[pubType].prefix + id);
    ['f-title', 'f-resume', 'f-body', 'f-url', 'f-file', 'f-subject'].forEach((fid) => { document.getElementById(fid).value = ''; });
    updatePreview();
  });
  $('#pub-draft').addEventListener('click', () => showToast('Brouillon enregistré. Il n’est pas visible sur le site.', null, null));
  $('#reset-demo').addEventListener('click', () => {
    ['veille', 'presse', 'actus'].forEach((k) => { DATA[k] = DATA[k].filter((x) => !x.demo); });
    demoPosts = [];
    saveDemo(demoPosts);
    sentLog = [];
    saveList(SENT_KEY, sentLog);
    renderNewsletter();
    renderDynamic();
    showToast('Publications et envois de démonstration effacés.', null, null);
  });

  /* ---------- Espace adhérent : lettre d'information ---------- */
  function renderNewsletter() {
    const n = subscribers.length;
    $('#nl-count').textContent = '(' + n + ')';
    $('#f-mail-count').textContent = n ? abonnes(n, false) : 'Aucun abonné pour l’instant';
    $('#nl-list').innerHTML = n
      ? subscribers.map((a) => '<li><span>' + esc(a) + '</span><button class="link-btn" type="button" data-remove="' + esc(a) + '" aria-label="Retirer ' + esc(a) + '">Retirer</button></li>').join('')
      : '<li class="nl-empty">Aucun abonné pour l’instant. Les adhérents s’inscrivent depuis la page Veille.</li>';
    $('#nl-sent').innerHTML = sentLog.length
      ? sentLog.slice(0, 8).map((s) => '<li><span class="r-kind">' + esc(s.type || 'Envoi') + ', ' + esc(shortDate(s.date)) + ', ' + esc(abonnes(s.n, false)) + '</span><span class="r-title">' + esc(s.subject) + '</span></li>').join('')
      : '<li><span class="r-kind">Aucun envoi pour l’instant.</span></li>';
  }
  $('#nl-list').addEventListener('click', (e) => {
    const b = e.target.closest('[data-remove]');
    if (!b) return;
    const pos = subscribers.indexOf(b.dataset.remove);
    subscribers = subscribers.filter((a) => a !== b.dataset.remove);
    saveList(SUB_KEY, subscribers);
    renderNewsletter();
    updatePreview();
    const btns = $$('#nl-list [data-remove]');
    (btns[Math.min(pos, btns.length - 1)] || $('#nl-add-email')).focus();
    showToast('Adresse retirée de la liste.', null, null);
  });
  $('#nl-add-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = $('#nl-add-email'); const er = $('#nl-add-err');
    const addr = inp.value.trim().toLowerCase();
    inp.removeAttribute('aria-invalid');
    if (!EMAIL_RE.test(addr)) { er.textContent = 'Saisissez une adresse e-mail valide, par exemple nom@laboratoire.fr.'; er.hidden = false; inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
    if (subscribers.includes(addr)) { er.textContent = 'Cette adresse est déjà dans la liste.'; er.hidden = false; inp.focus(); return; }
    er.hidden = true;
    subscribers.push(addr);
    saveList(SUB_KEY, subscribers);
    inp.value = '';
    renderNewsletter();
    updatePreview();
    showToast('Adresse ajoutée à la liste.', null, null);
  });

  /* ---------- Ouverture : les deux cellules se rejoignent ---------- */
  function heroIntro() {
    const grey = $('#hero-grey'); const green = $('#hero-green'); const overlap = $('#hero-overlap'); const clip = $('#hero-clip');
    if (!grey || !green || !overlap || !clip || reduceMotion) return;
    if (current !== 'accueil') return;
    /* Le nom et la devise n'apparaissent en fondu qu'à cette première ouverture (pas à chaque retour sur l'accueil). */
    const root = document.documentElement;
    root.classList.add('hero-intro');
    setTimeout(() => root.classList.remove('hero-intro'), 2400);
    const set = (a, b) => { grey.setAttribute('cx', a); clip.setAttribute('cx', a); green.setAttribute('cx', b); overlap.setAttribute('cx', b); };
    const from = [56, 144];
    const to = [84, 116];
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    set(from[0], from[1]);
    let start = null;
    const frame = (ts) => {
      if (start === null) start = ts + 250;
      const t = Math.min(1, Math.max(0, (ts - start) / 1500));
      const k = ease(t);
      set(from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k);
      if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  /* ---------- Lien LinkedIn ---------- */
  function setupLinkedin() {
    $$('[data-linkedin]').forEach((a) => {
      if (isHttp(LINKEDIN_URL)) { a.href = LINKEDIN_URL; a.target = '_blank'; a.rel = 'noopener'; return; }
      a.addEventListener('click', (e) => { e.preventDefault(); showToast('Adresse de la page LinkedIn du SLBC à compléter.', null, null); });
    });
  }

  /* ---------- Adresse du contact presse et des adhésions ---------- */
  function setupContact() {
    const okMail = EMAIL_RE.test(CONTACT_EMAIL);
    $$('[data-contact]').forEach((el) => {
      el.textContent = okMail ? CONTACT_EMAIL : 'adresse à compléter';
      el.classList.toggle('pending', !okMail);
      if (el.tagName === 'A') { if (okMail) el.href = 'mailto:' + CONTACT_EMAIL; else el.removeAttribute('href'); }
    });
    $$('[data-contact-copy]').forEach((b) => { b.dataset.copy = CONTACT_EMAIL; b.hidden = !okMail; });
  }

  /* ---------- Mouvement : ombre de l’en-tête, piliers et frise ---------- */
  function setupHeader() {
    const nav = $('.gnav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  /* Filet des piliers et frise du protocole : tracés quand ils arrivent à l'écran.
     Pas d'apparition en fondu des autres blocs (voir le bloc « Mouvement » de styles.css). */
  function setupMotion() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-motion');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('drawn');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    $$('.pillar, .timeline').forEach((el) => io.observe(el));
  }

  /* ---------- Démarrage ---------- */
  $('#f-date').value = todayISO();
  renderStatic();
  setupLinkedin();
  setupContact();
  renderDynamic();
  renderPubType();
  renderNewsletter();
  updatePreview();
  jShow(1);
  setupHeader();
  setupMotion();
  route();
  heroIntro();
})();
