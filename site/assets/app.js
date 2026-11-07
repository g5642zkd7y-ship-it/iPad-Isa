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
  const isDoc = (u) => /^documents\/[\w.-]+\.pdf$/i.test(String(u || ''));
  /* Documents lisibles dans la page. Mode images : chaque page du PDF est une image (site/documents/<nom>/page-01.jpg…).
     Mode PDF (registre PDFS plus bas) : le PDF lui-même, dessiné par pdf.js.
     Dans claude.ai, la maquette est affichée dans un cadre qui bloque l’ouverture directe d’un PDF :
     on lit donc les pages dans une liseuse, et « Enregistrer le PDF » passe par la fonction de
     téléchargement de claude.ai (capacité downloads). Ailleurs, un simple lien de téléchargement. */
  const DOCS = {
    'documents/protocole-biologie-2027-2029.pdf': { title: 'Protocole d’accord 2027-2029, texte signé', pages: 13, w: 1240, h: 1754,
      img: (n) => 'documents/protocole-biologie-2027-2029/page-' + String(n).padStart(2, '0') + '.jpg', file: 'protocole-biologie-2027-2029.pdf' },
    /* Observatoire de la biologie médicale, édition 2026 (étude Roland Berger, mai 2026), envoyé par Isabelle Eimer le 6 novembre 2026 ;
       la source n'est pas affichée sur le site (demande d'Isabelle Eimer). */
    'documents/observatoire-biologie-2026-court.pdf': { title: 'Observatoire de la biologie médicale 2026, version courte', pages: 53, w: 1600, h: 900,
      img: (n) => 'documents/observatoire-biologie-2026-court/page-' + String(n).padStart(2, '0') + '.jpg', file: 'observatoire-biologie-2026-court.pdf' },
    'documents/observatoire-biologie-2026-complet.pdf': { title: 'Observatoire de la biologie médicale 2026, rapport complet', pages: 89, w: 1600, h: 900,
      img: (n) => 'documents/observatoire-biologie-2026-complet/page-' + String(n).padStart(2, '0') + '.jpg', file: 'observatoire-biologie-2026-complet.pdf' }
  };

  /* PDF lus avec pdf.js (liseuse, mode PDF) : chemin → [titre, pages, largeur et hauteur de la première page en points].
     Documents recopiés de l'ancien site slbc.fr le 6 novembre 2026 (actualités, statuts, comptes, textes réglementaires). */
  const PDFS = {
    'documents/textes/42-loi-2013-442-portant-reforme-de-la-biologie-medicale-ratifia.pdf': ['Loi n° 2013-442 portant réforme de la biologie médicale, ratifiant l’ordonnance de 2010', 16, 595, 842],
    'documents/textes/41-loi-2016-41-modernisation-de-notre-systeme-de-sante.pdf': ['Loi n° 2016-41 modernisation de notre système de santé', 206, 595, 842],
    'documents/textes/54-decret-2016-46-relatif-a-la-biologie-medicale.pdf': ['Décret n° 2016-46 relatif à la biologie médicale', 16, 595, 842],
    'documents/textes/56-decret-2016-44-societes-exploitant-un-lbm-prive-et-societes.pdf': ['Décret n° 2016-44 sociétés exploitant un LBM privé et sociétés à participation financière de professions libérales de biologie médicale', 11, 595, 842],
    'documents/textes/52-decret-n-2016-839-relatif-aux-conditions-et-modalites-dexerc.pdf': ['Décret n° 2016-839 relatif aux conditions et modalités d’exercice des biologistes médicaux et portant création de la Commission nationale de biologie médicale', 6, 595, 842],
    'documents/textes/57-decret-2015-1152-relatif-aux-conditions-et-modalites-dexerci.pdf': ['Décret n° 2015-1152 relatif aux conditions et modalités d’exercice des biologistes médicaux et portant création de la CNBM', 6, 595, 842],
    'documents/textes/21-decret-no-2021-293-fixant-les-missions-et-les-modalites-de-d.pdf': ['Décret n° 2021-293 fixant les missions et les modalités de désignation des laboratoires de biologie médicale de référence', 1, 595, 842],
    'documents/textes/07-arrete-du-18-janvier-2022-laboratoires-de-reference.pdf': ['Arrêté du 18 janvier 2022 : laboratoires de référence', 2, 595, 842],
    'documents/textes/65-arrete-fixant-la-composition-de-la-commission-nationale-de-b.pdf': ['Arrêté du 22 février 2016 fixant la composition de la Commission nationale de biologie médicale', 2, 595, 842],
    'documents/textes/48-decret-no-2017-414-relatif-aux-sanctions-administratives-app.pdf': ['Décret n° 2017-414 relatif aux sanctions administratives applicables en matière de biologie médicale', 2, 595, 842],
    'documents/textes/46-decret-no-2017-1520-relatif-a-la-reconnaissance-des-qualific.pdf': ['Décret n° 2017-1520 relatif à la reconnaissance des qualifications professionnelles dans le domaine de la santé', 15, 595, 842],
    'documents/textes/60-decret-2014-606-relatif-aux-conditions-de-remplacement-des-b.pdf': ['Décret n° 2014-606 relatif aux conditions de remplacement des biologistes médicaux par des internes en médecine et en pharmacie', 2, 595, 842],
    'documents/textes/59-decret-2015-150-fixant-les-criteres-de-competence-des-pratic.pdf': ['Décret n° 2015-150 fixant les critères de compétence des praticiens exerçant au sein de structures autorisées pour pratiquer des activités d’AMP', 3, 595, 842],
    'documents/textes/61-decret-2011-2119-transmissions-biologiques-entre-laboratoire.pdf': ['Décret n° 2011-2119 transmissions biologiques entre laboratoires de biologie médicale', 3, 595, 842],
    'documents/textes/62-decret-2011-1268-fixant-les-regles-dactivite-dun-labm-et-le.pdf': ['Décret n° 2011-1268 fixant les règles d’activité d’un LABM et le % max. d’échantillons biologiques pouvant être transmis entre LABM', 2, 595, 842],
    'documents/textes/66-arrete-du-30-decembre-2014-relatif-a-lattestation-de-formati.pdf': ['Arrêté du 30 décembre 2014 relatif à l’attestation de formation aux gestes et soins d’urgence', 12, 595, 842],
    'documents/textes/19-arrete-du-8-mars-2021-fixant-les-examens-representatifs-et-l.pdf': ['Arrêté du 8 mars 2021 fixant les examens représentatifs et les compétences associées pour l’accréditation des lignes de portée des examens de biologie médicale', 7, 595, 842],
    'documents/textes/49-decret-no-2016-1430-relatif-aux-modalites-daccreditation-des.pdf': ['Décret n° 2016-1430 relatif aux modalités d’accréditation des laboratoires de biologie médicale', 1, 595, 842],
    'documents/textes/55-decret-2016-45-modalites-specifiques-procedure-d-accreditati.pdf': ['Décret n° 2016-45 : modalités spécifiques de la procédure d’accréditation des LBM en Guadeloupe, Guyane, Martinique', 2, 595, 842],
    'documents/textes/58-decret-2015-205-relatif-aux-modalites-de-depot-des-demandes.pdf': ['Décret n° 2015-205 relatif aux modalités de dépôt des demandes d’accréditation des LABM : étape 2016', 1, 595, 842],
    'documents/textes/68-arrete-du-17-octobre-2012-definissant-les-conditions-justifi.pdf': ['Arrêté du 17 octobre 2012 définissant les conditions justificatives de l’entrée effective d’un laboratoire de biologie médicale dans une démarche d’accréditation', 4, 595, 842],
    'documents/textes/40-nabm-baisses-au-6-avril-2018.pdf': ['Baisses de la NABM au 6 avril 2018 (décision de l’UNCAM du 12 mars 2018)', 4, 595, 842],
    'documents/textes/45-decision-du-24-mai-2017-de-lunion-nationale-des-caisses-dass.pdf': ['Décision du 24 mai 2017 de l’Union nationale des caisses d’assurance maladie relative à la liste des actes et prestations pris en charge par l’assurance maladie', 3, 595, 842],
    'documents/textes/44-instruction-n-dgos-pf4-dss-1a-2018-101-du-16-avril-2018-rela.pdf': ['Instruction n° DGOS/PF4/DSS/1A/2018/101 du 16 avril 2018 relative aux actes de biologie médicale et d’anatomopathologie hors nomenclatures', 9, 595, 842],
    'documents/textes/69-instruction-dgos-2015-258-relative-aux-modalites-didentifica.pdf': ['Instruction DGOS 2015-258 relative aux modalités d’identification, de recueil des actes de biologie médicale et d’anatomocytopathologie hors nomenclature éligibles au financement au titre de la MERRI G03', 25, 595, 842],
    'documents/textes/43-arrete-du-15-mai-2018-fixant-les-conditions-de-realisation-d.pdf': ['Arrêté du 15 mai 2018 fixant les conditions de réalisation des examens de biologie médicale d’immuno-hématologie érythrocytaire', 7, 595, 842],
    'documents/textes/47-decret-no-2017-808-relatif-a-lintroduction-dans-la-liste-des.pdf': ['Décret n° 2017-808 relatif à l’introduction dans la liste des examens de diagnostic prénatal des examens de génétique portant sur l’ADN foetal libre circulant dans le sang maternel', 2, 595, 842],
    'documents/textes/53-decret-no-2016-545-relatif-a-levaluation-et-au-controle-de-q.pdf': ['Décret n° 2016-545 relatif à l’évaluation et au contrôle de qualité des examens de diagnostic prénatal', 2, 595, 842],
    'documents/textes/35-arrete-10-oct-2019-relatif-a-la-rougeole.pdf': ['Arrêté du 16 octobre 2019 relatif à la rougeole', 2, 595, 842],
    'documents/textes/36-arrete-du-4-octobre-2019-relatif-aux-avk.pdf': ['Arrêté du 4 octobre 2019 relatif aux AVK', 45, 595, 842],
    'documents/textes/37-arrete-du-26-juin-2019-depistage-hepatite-c-en-officine.pdf': ['Arrêté du 26 juin 2019 : dépistage de l’hépatite C en officine', 17, 595, 842],
    'documents/textes/34-arrete-du-30-janvier-2020-fixant-les-tests-de-diagnostic-rap.pdf': ['Arrêté du 30 janvier 2020 fixant les tests de diagnostic rapide pouvant être réalisés par les pharmaciens', 1, 595, 842],
    'documents/textes/67-arrete-du-11-juin-2013-determinant-la-liste-des-tests-recuei.pdf': ['Arrêté du 11 juin 2013 déterminant la liste des tests, recueils et traitements de signaux biologiques qui ne constituent pas un examen de biologie médicale, les catégories de personnes pouvant les réaliser et les conditions de réalisation de certains de ces tests, recueils et traitements de signaux biologiques', 7, 595, 842],
    'documents/textes/09-loi-no-2021-1754-du-23-decembre-2021-de-financement-de-la-se.pdf': ['Loi n° 2021-1754 du 23 décembre 2021 de financement de la sécurité sociale pour 2022', 68, 595, 842],
    'documents/textes/23-loi-no-2020-1576-du-14-decembre-2020-de-financement-de-la-se.pdf': ['Loi n° 2020-1576 du 14 décembre 2020 de financement de la sécurité sociale pour 2021', 65, 595, 842],
    'documents/textes/39-loi-2018-493-du-20-juin-2018-relative-a-la-protection-des-do.pdf': ['Loi n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles', 218, 595, 842],
    'documents/textes/51-decret-n-2016-942-relatif-a-lorganisation-du-dpc-des-profess.pdf': ['Décret n° 2016-942 relatif à l’organisation du DPC des professionnels de santé', 10, 595, 842],
    'documents/textes/50-decret-no-2016-1024-relatif-aux-territoires-de-democratie-sa.pdf': ['Décret n° 2016-1024 relatif aux territoires de démocratie sanitaire aux zones des schémas régionaux de santé et aux conseils territoriaux de santé', 4, 595, 842],
    'documents/textes/63-decret-2010-585-relatif-aux-unions-regionales-de-professionn.pdf': ['Décret n° 2010-585 relatif aux unions régionales de professionnels de santé', 14, 595, 842],
    'documents/textes/64-decret-2010-514-relatif-au-projet-regional-de-sante.pdf': ['Décret n° 2010-514 relatif au projet régional de santé', 3, 595, 842],
    'documents/textes/01-labm-rapport-de-branche-2021.pdf': ['Rapport de branche 2021 des laboratoires de biologie médicale extra-hospitaliers (données 2020)', 97, 850, 595],
    'documents/textes/02-2022-grille-salaires-au-1er-mai.pdf': ['Grille des salaires minima au 1er mai 2022 (accord du 27 avril 2022)', 4, 595, 842],
    'documents/textes/03-arrete-du-15-mars-sur-le-criblage.pdf': ['Arrêté du 15 mars 2022 sur le criblage', 1, 595, 842],
    'documents/textes/05-decret-du-12-mars-mesures-generales-necessaires-a-la-gestion.pdf': ['Décret n° 2022-352 du 12 mars 2022 : mesures générales nécessaires à la gestion de la sortie de crise sanitaire', 4, 595, 842],
    'documents/textes/06-arrete-du-1er-fevrier-modifiant-la-liste-des-actes-et-presta.pdf': ['Arrêté du 1er février 2022 modifiant la liste des actes et prestations mentionnée à l’article L. 162-1-7 du code de la sécurité sociale et l’arrêté du 12 décembre 2020 portant modification des conditions de remboursement de l’acte de détection du génome du SARS-CoV-2 par amplification génique', 1, 595, 842],
    'documents/textes/08-arrete-du-27-decembre-2021-modifiant-larrete-du-1er-juin-202.pdf': ['Arrêté du 27 décembre 2021 modifiant l’arrêté du 1er juin 2021 prescrivant les mesures générales nécessaires à la gestion de la sortie de crise sanitaire', 1, 595, 842],
    'documents/textes/10-loi-no-2021-1465-du-10-novembre-2021-portant-diverses-dispos.pdf': ['Loi n° 2021-1465 du 10 novembre 2021 portant diverses dispositions de vigilance sanitaire', 7, 595, 842],
    'documents/textes/11-arrete-du-9-octobre-2021-prescrivant-les-mesures-necessaires.pdf': ['Arrêté du 9 octobre 2021 prescrivant les mesures nécessaires à la sortie de crise sanitaire', 2, 595, 842],
    'documents/textes/12-arrete-du-17-juillet-portant-modification-des-conditions-de.pdf': ['Arrêté du 17 juillet 2021 portant modification des conditions de remboursement de l’acte de détection du génome du SARS-CoV-2 par amplification génique', 2, 595, 842],
    'documents/textes/13-decret-no-2021-930-du-13-juillet-2021-modifiant-le-decret-no.pdf': ['Décret n° 2021-930 du 13 juillet 2021 modifiant le décret n° 2020-551 du 12 mai 2020 relatif aux systèmes d’information mentionnés à l’article 11 de la loi n° 2020-546 du 11 mai 2020 prorogeant l’état d’urgence sanitaire et complétant ses dispositions et le décret n° 2020-1690 du 25 décembre 2020 autorisant la création d’un traitement de données à caractère personnel relatif aux vaccinations contre la covid-19', 3, 595, 842],
    'documents/textes/14-arrete-du-7-juillet-2021-modifiant-larrete-du-1er-juin-2021.pdf': ['Arrêté du 7 juillet 2021 modifiant l’arrêté du 1er juin 2021 prescrivant les mesures générales nécessaires à la gestion de la sortie de crise sanitaire', 4, 595, 842],
    'documents/textes/15-arrete-du-6-juillet-2021-modifiant-larrete-du-1er-juin-2021.pdf': ['Arrêté du 6 juillet 2021 modifiant l’arrêté du 1er juin 2021 prescrivant les mesures générales nécessaires à la gestion de la sortie de crise sanitaire', 1, 595, 842],
    'documents/textes/17-arrete-du-10-avril-2021-prescrivant-les-mesures-dorganisatio.pdf': ['Arrêté du 10 avril 2021 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', 4, 595, 842],
    'documents/textes/18-arrete-du-23-mars-2021-prescrivant-les-mesures-necessaires-p.pdf': ['Arrêté du 23 mars 2021 prescrivant les mesures nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', 2, 595, 842],
    'documents/textes/20-loi-no-2021-160-du-15-fevrier-2021-prorogeant-letat-durgence.pdf': ['Loi n° 2021-160 du 15 février 2021 prorogeant l’état d’urgence sanitaire', 2, 595, 842],
    'documents/textes/22-arrete-du-23-janvier-2021-modifiant-larrete-du-10-juillet-20.pdf': ['Arrêté du 23 janvier 2021 modifiant l’arrêté du 10 juillet 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', 2, 595, 842],
    'documents/textes/24-arrete-du-10-aout-2020-modifiant-larrete-du-10-juillet-2020.pdf': ['Arrêté du 10 août 2020 modifiant l’arrêté du 10 juillet 2020 prescrivant les mesures générales nécessaires pour faire face à l’épidémie de covid-19 dans les territoires sortis de l’état d’urgence sanitaire et dans ceux où il a été prorogé', 2, 595, 842],
    'documents/textes/26-arrete-du-25-juin-2020-completant-larrete-du-23-mars-2020-pr.pdf': ['Arrêté du 25 juin 2020 complétant l’arrêté du 23 mars 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', 1, 595, 842],
    'documents/textes/27-arrete-du-27-mai-2020-portant-modification-de-la-liste-des-a.pdf': ['Arrêté du 27 mai 2020 portant modification de la liste des actes et prestations mentionnée à l’article L. 162-1-7 du code de la sécurité sociale (diagnostic biologique de l’infection par le SARS-CoV-2)', 3, 595, 842],
    'documents/textes/28-decret-no-2020-637-modifiant-le-decret-n-2020-73-portant-ado.pdf': ['Décret n° 2020-637 modifiant le décret n° 2020-73 portant adoption de conditions adaptées pour le bénéfice des prestations en espèces pour les personnes exposées au coronavirus', 2, 595, 842],
    'documents/textes/29-decret-n-2020-434-relatif-a-ladaptation-temporaire-des-delai.pdf': ['Décret n° 2020-434 relatif à l’adaptation temporaire des délais et modalités de versement de l’indemnité complémentaire prévue à l’article L. 1226-1 du code du travail', 2, 595, 842],
    'documents/textes/30-arrete-du-20-mai-2020-completant-larrete-du-23-mars-2020-pre.pdf': ['Arrêté du 20 mai 2020 complétant l’arrêté du 23 mars 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', 2, 595, 842],
    'documents/textes/31-arrete-du-5-avril-2020-completant-larrete-du-23-mars-2020-pr.pdf': ['Arrêté du 5 avril 2020 complétant l’arrêté du 23 mars 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire.', 2, 595, 842],
    'documents/textes/32-decret-n-2020-293-prescrivant-les-mesures-generales-necessai.pdf': ['Décret n° 2020-293 prescrivant les mesures générales nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', 6, 595, 842],
    'documents/textes/33-arrete-du-16-mars-2020-completant-larrete-du-14-mars-2020-po.pdf': ['Arrêté du 16 mars 2020 complétant l’arrêté du 14 mars 2020 portant diverses mesures relatives à la lutte contre la propagation du virus covid-19', 2, 595, 842],
    'documents/textes/38-dgos-et-cnam-references-juridiques-en-biologie-medicale-mise.pdf': ['Références juridiques en biologie médicale, DGOS et CNAM, mise à jour de novembre 2018', 222, 595, 842],
    'documents/actualites/2026-09-07-strategie-sante-sexuelle-texte-integral.pdf': ['Stratégie nationale de santé sexuelle 2026-2030 : le texte intégral du ministère', 2, 595, 842],
    'documents/actualites/feuille-de-route-sante-sexuelle-2026-2030.pdf': ['Feuille de route 2026-2030 de la stratégie nationale de santé sexuelle (ministère de la Santé)', 72, 595, 839],
    'documents/actualites/2026-09-07-feuille-de-route-sante-sexuelle.pdf': ['Feuille de route 2026-2030 de la stratégie nationale de santé sexuelle', 1, 595, 842],
    'documents/actualites/depeche-apmnews-2026-09-07-feuille-de-route-sante-sexuelle.pdf': ['Dépêche APMnews du 7 septembre 2026', 2, 595, 842],
    'documents/actualites/2026-08-31-rapport-beaudeux-bouvier.pdf': ['Rapport Beaudeux-Bouvier : biologistes médicaux et assistance médicale à la procréation', 1, 595, 842],
    'documents/actualites/rapport-mission-biologistes-amp-beaudeux-bouvier.pdf': ['Rapport de la mission Beaudeux-Bouvier : biologistes médicaux et AMP', 19, 595, 842],
    'documents/actualites/2026-08-31-deces-jean-francois-perotto.pdf': ['Décès du Docteur Jean-François Perotto', 1, 595, 842],
    'documents/actualites/2026-07-01-negociations-salariales-grille-2026.pdf': ['Négociations salariales : recommandation patronale et grille 2026', 1, 595, 842],
    'documents/actualites/2026-06-09-appel-candidatures-pnmr4.pdf': ['Appel à candidatures PNMR4 pour les tests fonctionnels', 1, 595, 842],
    'documents/actualites/2026-05-04-greve-nationale-salaries-laboratoires.pdf': ['Grève nationale historique des salariés des laboratoires', 1, 595, 842],
    'documents/actualites/2026-04-16-deploiement-rihn-2-0.pdf': ['Innovation diagnostique : déploiement du RIHN 2.0', 1, 595, 842],
    'documents/actualites/programme-campagne-slbc-2026.pdf': ['Programme de campagne du SLBC : « Une ambition commune : valoriser notre expertise médicale »', 2, 597, 843],
    'documents/actualites/2026-02-04-radiation-vs-nabm.pdf': ['Radiation de la vitesse de sédimentation (VS) de la NABM', 1, 595, 842],
    'documents/syndicat/statuts-slbc.pdf': ['Statuts du SLBC', 4, 595, 842],
    'documents/comptes/comptes-2023-rapport-cac.pdf': ['Comptes 2023 : bilan et rapport du commissaire aux comptes', 17, 595, 842],
    'documents/comptes/comptes-2022-etats-financiers.pdf': ['Comptes 2022 : états financiers', 17, 596, 843],
    'documents/comptes/comptes-2022-rapport-cac.pdf': ['Comptes 2022 : rapport du commissaire aux comptes', 18, 595, 841],
    'documents/comptes/comptes-2020-rapport-cac.pdf': ['Comptes 2020 : rapport du commissaire aux comptes', 14, 595, 842]
  };
  PDFS['documents/etude-roland-berger-2025.pdf'] = ['Étude du secteur des laboratoires de biologie médicale libérale français, rapport 2025 (Roland Berger)', 59, 960, 540];
  Object.keys(PDFS).forEach((u) => { const [title, pages, w, h] = PDFS[u]; DOCS[u] = { title, pages, w, h, pdf: true, file: u.split('/').pop() }; });
  const nPages = (u) => DOCS[u].pages + ' page' + (DOCS[u].pages > 1 ? 's' : '');

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
        facts: [['Signature', '2 novembre 2026'], ['Période couverte', '2027 à 2029'], ['Signataires', 'UNCAM, UNOCAM, Les Biologistes Médicaux (Biomed), SDBIO, SLBC et SNMB']],
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
    presse: [
      /* Communiqué de presse du SLBC du 4 novembre 2026 (image envoyée par Isabelle Eimer le 6 novembre 2026),
         repris mot pour mot. Le protocole signé est joint en PDF (site/documents/protocole-biologie-2027-2029.pdf). */
      { id: 'p4', date: '2026-11-04', year: '2026',
        title: 'Protocole d’accord pour la biologie médicale 2027-2029',
        subtitle: 'Le SLBC signe et alerte sur la pression tarifaire',
        with: 'Communiqué du SLBC',
        chapo: 'Le Syndicat des Laboratoires de Biologie Clinique (SLBC) a signé le 2 novembre 2026, avec l’Assurance Maladie et les autres syndicats représentatifs, le protocole d’accord pour les années 2027-2029. Il reconnaît l’intérêt des dispositions relatives à la prévention et à l’innovation, mais alerte sur une trajectoire qui maintient la pression sur les tarifs des examens. Il a signé pour conserver sa place dans les instances de suivi et sa capacité d’intervention dans les discussions sur l’avenir de la profession.',
        quote: { text: '« Nous signons pour défendre les laboratoires dans les discussions à venir. Notre signature n’efface pas notre désaccord sur l’équilibre économique de cet accord. »', by: 'Thierry Bouchet, président du SLBC' },
        body: [
          { h: 'Une enveloppe de dépenses autorisées qui laisse les tarifs sous pression', ps: [
            'Face à une croissance des besoins en examens liée au vieillissement de la population et à l’augmentation des maladies chroniques, l’accord limite la croissance de l’enveloppe des actes courants à 1,1 % chaque année. La dernière estimation de la CNAM fait état d’une croissance des volumes de 4,1 % en 2026. À tarifs et à structure d’activité constants, la hausse annuelle de l’enveloppe permettrait de financer une progression des volumes de 1,1 %. Le SLBC anticipe une baisse tarifaire d’au moins 2 %, pouvant atteindre 2,5 % selon les hypothèses d’activité retenues.',
            'En métropole, la lettre clé B est passée de 0,27 € à 0,26 € le 1er février 2023, puis à 0,25 € le 15 janvier 2024. Une nouvelle baisse d’un centime au 1er janvier 2027 la ramènerait à 0,24 €, soit un recul cumulé de 11,1 % en moins de quatre ans, auquel s’ajoutent des diminutions de cotations des actes représentant plus de 19 % de baisses tarifaires totales, dans un contexte de hausse des charges des laboratoires.',
            'Le partage du risque reste très déséquilibré. Le mécanisme de régulation prévoit un premier ajustement tarifaire couvrant 100 % de l’écart prévisionnel dès le mois de janvier, puis une prise en charge par la profession de 80 % du dépassement en juillet, contre 20 % pour l’Assurance Maladie.',
            'Les dépenses de biologie délocalisée sont intégrées à l’enveloppe courante. Un suivi spécifique est prévu, mais sans seuil chiffré déclenchant une renégociation de leur financement. Le SLBC a alerté la CNAM sur le risque de dépassement lié à ces dépenses. Il sera vigilant sur leur évolution et sur l’efficacité du suivi prévu par le protocole.',
            'Pour le SLBC, cette trajectoire fragilisera l’équilibre économique des laboratoires et leur capacité à maintenir l’accès des patients aux examens sur tout le territoire.'
          ] },
          { h: 'Des missions de prévention dont les moyens restent à sécuriser', ps: [
            'Le protocole prévoit une enveloppe non limitative de 100 millions d’euros sur trois ans, dédiée aux actes nouveaux, et une enveloppe spécifique pour les missions de santé publique. Un soutien aux activités d’assistance médicale à la procréation est également prévu. Le SLBC en reconnaît l’intérêt. La vaccination et la remise de kits de dépistage du cancer colorectal figurent parmi les perspectives mises en avant, de même que le suivi du diabète et le dépistage de la maladie rénale chronique.',
            'Ces perspectives ne valent pas mise en œuvre immédiate. Elles dépendent encore, selon les mesures, de textes législatifs ou réglementaires et de négociations conventionnelles. Le SLBC sera vigilant sur le financement intégral des nouvelles missions en dehors de l’enveloppe courante. Pour les futurs actes de santé publique, la part des dépenses affectée à l’enveloppe spécifique reste à négocier.'
          ] }
        ],
        url: 'documents/protocole-biologie-2027-2029.pdf', linkLabel: 'Lire le protocole signé (13 pages)' }
    ],
    actus: [
      { id: 'a1', date: '2026-09-07', cat: 'Santé publique', title: 'Stratégie nationale de santé sexuelle 2026-2030 : le texte intégral du ministère', excerpt: 'Sur les 22 actions du plan, deux touchent les laboratoires, dont le déploiement de la biologie délocalisée.', doc: 'documents/actualites/2026-09-07-strategie-sante-sexuelle-texte-integral.pdf', att: { url: 'documents/actualites/feuille-de-route-sante-sexuelle-2026-2030.pdf', label: 'La feuille de route' } },
      { id: 'a2', date: '2026-09-07', cat: 'Santé publique', title: 'Feuille de route 2026-2030 de la stratégie nationale de santé sexuelle', excerpt: 'La feuille de route prévoit le déploiement de la biologie médicale délocalisée.', doc: 'documents/actualites/2026-09-07-feuille-de-route-sante-sexuelle.pdf', att: { url: 'documents/actualites/depeche-apmnews-2026-09-07-feuille-de-route-sante-sexuelle.pdf', label: 'La dépêche APMnews' } },
      { id: 'a3', date: '2026-08-31', cat: 'Exercice', title: 'Rapport Beaudeux-Bouvier : biologistes médicaux et assistance médicale à la procréation', excerpt: 'Une mission ministérielle propose de reconnaître et de rémunérer les consultations des biologistes médicaux en assistance médicale à la procréation.', doc: 'documents/actualites/2026-08-31-rapport-beaudeux-bouvier.pdf', att: { url: 'documents/actualites/rapport-mission-biologistes-amp-beaudeux-bouvier.pdf', label: 'Le rapport' } },
      { id: 'a4', date: '2026-08-31', cat: 'Vie du syndicat', title: 'Décès du Docteur Jean-François Perotto', excerpt: '', doc: 'documents/actualites/2026-08-31-deces-jean-francois-perotto.pdf' },
      { id: 'a5', date: '2026-07-01', cat: 'Social', title: 'Négociations salariales : recommandation patronale et grille 2026', excerpt: 'Les organisations patronales, dont le SLBC, ont émis une recommandation le 15 décembre 2025.', doc: 'documents/actualites/2026-07-01-negociations-salariales-grille-2026.pdf' },
      { id: 'a6', date: '2026-06-09', cat: 'Appels à projets', title: 'Appel à candidatures PNMR4 pour les tests fonctionnels', excerpt: 'La DGOS a lancé le 9 juin 2026 un appel à candidatures dans le cadre du 4e plan national maladies rares.', doc: 'documents/actualites/2026-06-09-appel-candidatures-pnmr4.pdf' },
      { id: 'a7', date: '2026-05-04', cat: 'Social', title: 'Grève nationale historique des salariés des laboratoires', excerpt: '', doc: 'documents/actualites/2026-05-04-greve-nationale-salaries-laboratoires.pdf' },
      { id: 'a8', date: '2026-04-16', cat: 'Nomenclature', title: 'Innovation diagnostique : déploiement du RIHN 2.0', excerpt: '', doc: 'documents/actualites/2026-04-16-deploiement-rihn-2-0.pdf' },
      { id: 'a9', date: '2026-02-05', cat: 'Vie du syndicat', title: 'Une ambition commune : valoriser notre expertise médicale', excerpt: '', doc: 'documents/actualites/programme-campagne-slbc-2026.pdf', docLabel: 'Lire le programme de campagne' },
      { id: 'a10', date: '2026-02-04', cat: 'Nomenclature', title: 'Radiation de la vitesse de sédimentation (VS) de la NABM', excerpt: '', doc: 'documents/actualites/2026-02-04-radiation-vs-nabm.pdf' }
    ]
  };

  /* Bureau communiqué par Isabelle Eimer le 5 novembre 2026. */
  const BUREAU = [
    ['Président', 'Thierry Bouchet'], ['Vice-président', 'Antoine Crinquette'], ['Vice-président', 'Pascal Melin'],
    ['Vice-présidente', 'Isabelle Eimer'], ['Secrétaire général', 'Nicolas Roquigny'],
    ['Membre du bureau', 'Éric Flatin'], ['Membre du bureau', 'Alexandre Guiard']
  ];
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
  /* Représentants communiqués par Isabelle Eimer les 5 et 6 novembre 2026 ; les autres sièges sont à désigner.
     a : sigle, affiché entre parenthèses après le nom ; r : descriptif, sous le nom ; reps : représentants nommés ;
     todo : sièges restant à pourvoir (texte affiché après les noms) ; groups : [libellé, noms, todo] quand l’instance a plusieurs collèges.
     Le 6 novembre 2026, Isabelle Eimer a demandé de ne garder que les instances qu’elle a données (Agence de la biomédecine,
     Santé publique France, SFBC, Bio Qualité, CNPS, Agence nationale du DPC, Klesia et Commission sociale paritaire retirés).
     Les descriptifs, retirés un moment le même jour, ont été rétablis à sa demande. */
  const INSTANCES = [
    { n: 'Commission de hiérarchisation des actes de biologie', a: 'CHAB', r: 'Inscription et cotation des actes', reps: ['Thierry Bouchet', 'Éric Flatin', 'Vincent Vieillefond'] },
    { n: 'Commission conventionnelle paritaire nationale', a: 'CPPNI', r: 'Dialogue social de la branche', reps: ['Antoine Crinquette', 'Éric Flatin'] },
    { n: 'Commission nationale permanente de biologie médicale', a: 'CNPBM', r: 'Conditions d’exercice de la profession', reps: [],
      groups: [['Bureau', ['Thierry Bouchet'], 'un représentant à désigner'], ['Assemblée générale', ['Harla Sarmini'], 'deux représentants à désigner']] },
    { n: 'Comité de suivi du protocole', r: 'Protocole 2027-2029 avec l’Assurance maladie', reps: ['Thierry Bouchet', 'Isabelle Eimer', 'Nicolas Roquigny', 'Éric Flatin'] },
    { n: 'Commission paritaire nationale des structures pluriprofessionnelles', a: 'CPNMSP', r: 'Accord conventionnel interprofessionnel de 2017', reps: ['Thierry Bouchet'], todo: 'un représentant à désigner' },
    { n: 'Commission paritaire régionale des structures pluriprofessionnelles', a: 'CPRMSP', r: 'Accord conventionnel interprofessionnel de 2017, en région', reps: [], todo: 'un titulaire et un suppléant à désigner' },
    { n: 'Cofrac', r: 'Commission technique d’accréditation', reps: [] },
    { n: 'Ministère chargé de la santé', r: 'Relations avec la tutelle', reps: ['Thierry Bouchet', 'Nicolas Roquigny'] },
    { n: 'Commission biologie européenne', r: 'Représentation de la profession en Europe', reps: ['Jean-Philippe Brochet'] }
  ];
  const CA = [
    ['Auvergne-Rhône-Alpes et Bourgogne-Franche-Comté', ['Nicolas Roquigny', 'Éric Flatin', 'François Targe', 'Benoît Dumont', 'Marc Thome', 'Fabienne Moulinier']],
    ['Grand Est', ['Isabelle Eimer', 'Jovana Moularde', 'Carole Granello']],
    ['Hauts-de-France', ['Nicolas Chatelain', 'Antoine Crinquette']],
    ['Île-de-France et outre-mer', ['Thierry Bouchet', 'Pascal Melin', 'Harla Sarmini', 'Alexandre Guiard', 'Ahmed Aboubacar', 'Sophie Beria']],
    ['Nouvelle-Aquitaine', ['Jean-Philippe Brochet']],
    ['Ouest', ['Laurent Perrot']],
    ['Provence-Alpes-Côte d’Azur, Languedoc et Corse', ['Guillaume Armana', 'Sylvain Chambourlier', 'Laurent Kbaier']]
  ];
  const URPS = [
    ['Auvergne-Rhône-Alpes', ['Jacques Pojer', 'Valérie Chepeaux']], ['Bourgogne-Franche-Comté', []],
    ['Bretagne', ['Eric Gueheneux']], ['Centre-Val de Loire', ['François Thomas']], ['Corse', ['Gérard Pesquie']],
    ['Grand Est', ['Christian Laeng', 'Michel Pax']], ['Hauts-de-France', ['Nicolas Chatelain', 'Daniel Gadeyne']],
    ['Île-de-France', ['Harla Sarmini', 'Thierry Bouchet']], ['Normandie', ['Paul Bracquemart']],
    ['Nouvelle-Aquitaine', ['Jean-Philippe Brochet']], ['Occitanie', ['Olivier Attali', 'Arnaud Longuet']],
    ['Pays de la Loire', ['François Maillet']], ['Provence-Alpes-Côte d’Azur', ['Jean-Pierre Fayon', 'Frédéric Charrier']],
    ['Guadeloupe', ['Frédéric Leroy']], ['Guyane', []], ['Martinique', ['Gérard Cherchel']],
    ['La Réunion', ['Paul Emile Gin']], ['Mayotte', ['Ahmed Aboubacar']]
  ];
  /* Statuts et comptes, recopiés de l'ancien site (6 novembre 2026). Le document présenté comme « Bilan 2021 » sur l'ancien site
     porte sur l'exercice clos le 31 décembre 2020 : affiché ici sous 2020 (point 25 de docs/sources-et-verifications.md). */
  const STATUTS = 'documents/syndicat/statuts-slbc.pdf';
  const COMPTES = [
    { y: '2023', d: 'Bilan et rapport du commissaire aux comptes', url: 'documents/comptes/comptes-2023-rapport-cac.pdf' },
    { y: '2022', d: 'États financiers', url: 'documents/comptes/comptes-2022-etats-financiers.pdf' },
    { y: '2022', d: 'Rapport du commissaire aux comptes', url: 'documents/comptes/comptes-2022-rapport-cac.pdf' },
    { y: '2020', d: 'Rapport du commissaire aux comptes', url: 'documents/comptes/comptes-2020-rapport-cac.pdf' }
  ];
  /* Études et rapports (Documentation), classés par source (demande d'Isabelle Eimer du 6 novembre 2026).
     d : date affichée ; url : page officielle (lien externe) ou document lu dans la liseuse (doc: true) ; src : site d'origine. */
  const ETUDES = [
    { g: 'Assurance maladie', items: [
      { d: 'Juillet 2026', t: 'Charges et produits pour 2027 : les propositions de l’Assurance maladie', s: 'Rapport annuel de propositions, présenté le 2 juillet 2026', url: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees/2026-rapport-propositions-pour-2027-charges-produits', src: 'ameli.fr' },
      { d: 'Juin 2025', t: 'Charges et produits pour 2026 : les propositions de l’Assurance maladie', s: 'Rapport annuel de propositions, présenté le 24 juin 2025', url: 'https://www.assurance-maladie.ameli.fr/etudes-et-donnees/2025-rapport-propositions-pour-2026-charges-produits', src: 'ameli.fr' }
    ] },
    { g: 'Inspections générales (IGAS, IGF)', items: [
      { d: 'Juillet 2025', t: 'Pertinence et efficience des dépenses de biologie médicale', s: 'Rapport IGAS-IGF, publié le 15 juillet 2025', url: 'https://igas.gouv.fr/pertinence-et-efficience-des-depenses-de-biologie-medicale', src: 'igas.gouv.fr' },
      { d: 'Juillet 2025', t: 'Causes et effets de la financiarisation du système de santé', s: 'Rapport IGAS-IGF, publié le 9 juillet 2025 ; il couvre tout le système de santé, dont la biologie médicale', url: 'https://www.igas.gouv.fr/causes-et-effets-de-la-financiarisation-du-systeme-de-sante', src: 'igas.gouv.fr' }
    ] },
    { g: 'Études du secteur', items: [
      { d: 'Mai 2026', t: 'Observatoire de la biologie médicale, édition 2026 : version courte', s: 'Étude du secteur des laboratoires de biologie médicale libérale français, Roland Berger', url: 'documents/observatoire-biologie-2026-court.pdf', doc: true },
      { d: 'Mai 2026', t: 'Observatoire de la biologie médicale, édition 2026 : rapport complet', s: 'Même étude, version longue', url: 'documents/observatoire-biologie-2026-complet.pdf', doc: true },
      /* Rapport 2025 (troisième étude Roland Berger, novembre 2025) : PDF envoyé par Isabelle Eimer le 7 novembre 2026, lu dans la liseuse.
         Le document de travail du 31 juillet 2025 envoyé le même jour n'est pas publié (version préliminaire). Point 27. */
      { d: 'Novembre 2025', t: 'Étude du secteur des laboratoires de biologie médicale libérale français, rapport 2025', s: 'Roland Berger', url: 'documents/etude-roland-berger-2025.pdf', doc: true }
    ] }
  ];
  /* Nomenclature : liens repris de l'ancienne page CHAB de slbc.fr (Légifrance, Journal officiel hébergé par la FHF).
     Les aides à la prescription n'avaient pas de document sur l'ancien site : à fournir. */
  const NABM = [
    { t: 'Arrêté du 25 janvier 2024', href: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049040708', src: 'Légifrance' },
    { t: 'Arrêté du 5 janvier 2024', s: 'Journal officiel du 10 janvier 2024', href: 'https://www.fhf.fr/sites/default/files/2024-01/joe_20240110_0007_0010.pdf', src: 'fhf.fr' },
    { t: 'Décision de l’UNCAM du 7 mars 2023', href: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047388021', src: 'Légifrance' },
    { t: 'Arrêté du 26 janvier 2023', href: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000047074801', src: 'Légifrance' },
    { t: 'Aides à la prescription', s: 'Thyroïde, vitamine D, groupe sanguin (RAI)' }
  ];
  /* Textes réglementaires : documents de l’ancienne page « Documentation professionnelle » de slbc.fr, recopiés dans documents/textes/
     (6 novembre 2026, demande d’Isabelle Eimer). url : PDF lu dans la liseuse ; href : texte sur Légifrance (fichier absent ou erroné sur
     l’ancien site) ; ni l’un ni l’autre : document introuvable. Voir le point 25 de docs/sources-et-verifications.md. */
  const TEXTES = [
    { theme: 'Exercice et organisation de la biologie médicale', items: [
      { t: 'Loi n° 2013-442 portant réforme de la biologie médicale, ratifiant l’ordonnance de 2010', y: '2013', url: 'documents/textes/42-loi-2013-442-portant-reforme-de-la-biologie-medicale-ratifia.pdf' },
      { t: 'Loi n° 2016-41 modernisation de notre système de santé', y: '2016', url: 'documents/textes/41-loi-2016-41-modernisation-de-notre-systeme-de-sante.pdf' },
      { t: 'Décret n° 2016-46 relatif à la biologie médicale', y: '2016', url: 'documents/textes/54-decret-2016-46-relatif-a-la-biologie-medicale.pdf' },
      { t: 'Décret n° 2016-44 sociétés exploitant un LBM privé et sociétés à participation financière de professions libérales de biologie médicale', y: '2016', url: 'documents/textes/56-decret-2016-44-societes-exploitant-un-lbm-prive-et-societes.pdf' },
      { t: 'Décret n° 2016-839 relatif aux conditions et modalités d’exercice des biologistes médicaux et portant création de la Commission nationale de biologie médicale', y: '2016', url: 'documents/textes/52-decret-n-2016-839-relatif-aux-conditions-et-modalites-dexerc.pdf' },
      { t: 'Décret n° 2015-1152 relatif aux conditions et modalités d’exercice des biologistes médicaux et portant création de la CNBM', y: '2015', url: 'documents/textes/57-decret-2015-1152-relatif-aux-conditions-et-modalites-dexerci.pdf' },
      { t: 'Décret n° 2021-293 fixant les missions et les modalités de désignation des laboratoires de biologie médicale de référence', y: '2021', url: 'documents/textes/21-decret-no-2021-293-fixant-les-missions-et-les-modalites-de-d.pdf' },
      { t: 'Arrêté du 18 janvier 2022 : laboratoires de référence', y: '2022', url: 'documents/textes/07-arrete-du-18-janvier-2022-laboratoires-de-reference.pdf' },
      { t: 'Arrêté du 22 février 2016 fixant la composition de la Commission nationale de biologie médicale', y: '2016', url: 'documents/textes/65-arrete-fixant-la-composition-de-la-commission-nationale-de-b.pdf' },
      { t: 'Décret n° 2017-414 relatif aux sanctions administratives applicables en matière de biologie médicale', y: '2017', url: 'documents/textes/48-decret-no-2017-414-relatif-aux-sanctions-administratives-app.pdf' },
      { t: 'Décret n° 2017-1520 relatif à la reconnaissance des qualifications professionnelles dans le domaine de la santé', y: '2017', url: 'documents/textes/46-decret-no-2017-1520-relatif-a-la-reconnaissance-des-qualific.pdf' },
      { t: 'Décret n° 2014-606 relatif aux conditions de remplacement des biologistes médicaux par des internes en médecine et en pharmacie', y: '2014', url: 'documents/textes/60-decret-2014-606-relatif-aux-conditions-de-remplacement-des-b.pdf' },
      { t: 'Décret n° 2015-150 fixant les critères de compétence des praticiens exerçant au sein de structures autorisées pour pratiquer des activités d’AMP', y: '2015', url: 'documents/textes/59-decret-2015-150-fixant-les-criteres-de-competence-des-pratic.pdf' },
      { t: 'Décret n° 2011-2119 transmissions biologiques entre laboratoires de biologie médicale', y: '2011', url: 'documents/textes/61-decret-2011-2119-transmissions-biologiques-entre-laboratoire.pdf' },
      { t: 'Décret n° 2011-1268 fixant les règles d’activité d’un LABM et le % max. d’échantillons biologiques pouvant être transmis entre LABM', y: '2011', url: 'documents/textes/62-decret-2011-1268-fixant-les-regles-dactivite-dun-labm-et-le.pdf' },
      { t: 'Arrêté du 30 décembre 2014 relatif à l’attestation de formation aux gestes et soins d’urgence', y: '2014', url: 'documents/textes/66-arrete-du-30-decembre-2014-relatif-a-lattestation-de-formati.pdf' }
    ] },
    { theme: 'Accréditation', items: [
      { t: 'Arrêté du 8 mars 2021 fixant les examens représentatifs et les compétences associées pour l’accréditation des lignes de portée des examens de biologie médicale', y: '2021', url: 'documents/textes/19-arrete-du-8-mars-2021-fixant-les-examens-representatifs-et-l.pdf' },
      { t: 'Décret n° 2016-1430 relatif aux modalités d’accréditation des laboratoires de biologie médicale', y: '2016', url: 'documents/textes/49-decret-no-2016-1430-relatif-aux-modalites-daccreditation-des.pdf' },
      { t: 'Décret n° 2016-45 : modalités spécifiques de la procédure d’accréditation des LBM en Guadeloupe, Guyane, Martinique', y: '2016', url: 'documents/textes/55-decret-2016-45-modalites-specifiques-procedure-d-accreditati.pdf' },
      { t: 'Décret n° 2015-205 relatif aux modalités de dépôt des demandes d’accréditation des LABM : étape 2016', y: '2015', url: 'documents/textes/58-decret-2015-205-relatif-aux-modalites-de-depot-des-demandes.pdf' },
      { t: 'Arrêté du 17 octobre 2012 définissant les conditions justificatives de l’entrée effective d’un laboratoire de biologie médicale dans une démarche d’accréditation', y: '2012', url: 'documents/textes/68-arrete-du-17-octobre-2012-definissant-les-conditions-justifi.pdf' }
    ] },
    { theme: 'Nomenclature et prise en charge', items: [
      { t: 'Baisses de la NABM au 6 avril 2018 (décision de l’UNCAM du 12 mars 2018)', y: '2018', url: 'documents/textes/40-nabm-baisses-au-6-avril-2018.pdf' },
      { t: 'Décision du 24 mai 2017 de l’Union nationale des caisses d’assurance maladie relative à la liste des actes et prestations pris en charge par l’assurance maladie', y: '2017', url: 'documents/textes/45-decision-du-24-mai-2017-de-lunion-nationale-des-caisses-dass.pdf' },
      { t: 'Instruction n° DGOS/PF4/DSS/1A/2018/101 du 16 avril 2018 relative aux actes de biologie médicale et d’anatomopathologie hors nomenclatures', y: '2018', url: 'documents/textes/44-instruction-n-dgos-pf4-dss-1a-2018-101-du-16-avril-2018-rela.pdf' },
      { t: 'Instruction DGOS 2015-258 relative aux modalités d’identification, de recueil des actes de biologie médicale et d’anatomocytopathologie hors nomenclature éligibles au financement au titre de la MERRI G03', y: '2015', url: 'documents/textes/69-instruction-dgos-2015-258-relative-aux-modalites-didentifica.pdf' }
    ] },
    { theme: 'Examens et dépistage', items: [
      { t: 'Arrêté du 15 mai 2018 fixant les conditions de réalisation des examens de biologie médicale d’immuno-hématologie érythrocytaire', y: '2018', url: 'documents/textes/43-arrete-du-15-mai-2018-fixant-les-conditions-de-realisation-d.pdf' },
      { t: 'Décret n° 2017-808 relatif à l’introduction dans la liste des examens de diagnostic prénatal des examens de génétique portant sur l’ADN foetal libre circulant dans le sang maternel', y: '2017', url: 'documents/textes/47-decret-no-2017-808-relatif-a-lintroduction-dans-la-liste-des.pdf' },
      { t: 'Décret n° 2016-545 relatif à l’évaluation et au contrôle de qualité des examens de diagnostic prénatal', y: '2016', url: 'documents/textes/53-decret-no-2016-545-relatif-a-levaluation-et-au-controle-de-q.pdf' },
      { t: 'Arrêté du 16 octobre 2019 relatif à la rougeole', y: '2019', url: 'documents/textes/35-arrete-10-oct-2019-relatif-a-la-rougeole.pdf' },
      { t: 'Arrêté du 4 octobre 2019 relatif aux AVK', y: '2019', url: 'documents/textes/36-arrete-du-4-octobre-2019-relatif-aux-avk.pdf' },
      { t: 'Arrêté du 26 juin 2019 : dépistage de l’hépatite C en officine', y: '2019', url: 'documents/textes/37-arrete-du-26-juin-2019-depistage-hepatite-c-en-officine.pdf' },
      { t: 'Arrêté du 30 janvier 2020 fixant les tests de diagnostic rapide pouvant être réalisés par les pharmaciens', y: '2020', url: 'documents/textes/34-arrete-du-30-janvier-2020-fixant-les-tests-de-diagnostic-rap.pdf' },
      { t: 'Arrêté du 11 juin 2013 déterminant la liste des tests, recueils et traitements de signaux biologiques qui ne constituent pas un examen de biologie médicale, les catégories de personnes pouvant les réaliser et les conditions de réalisation de certains de ces tests, recueils et traitements de signaux biologiques', y: '2013', url: 'documents/textes/67-arrete-du-11-juin-2013-determinant-la-liste-des-tests-recuei.pdf' }
    ] },
    { theme: 'Lois de financement de la sécurité sociale', items: [
      { t: 'Loi n° 2021-1754 du 23 décembre 2021 de financement de la sécurité sociale pour 2022', y: '2021', url: 'documents/textes/09-loi-no-2021-1754-du-23-decembre-2021-de-financement-de-la-se.pdf' },
      { t: 'Loi n° 2020-1576 du 14 décembre 2020 de financement de la sécurité sociale pour 2021', y: '2020', url: 'documents/textes/23-loi-no-2020-1576-du-14-decembre-2020-de-financement-de-la-se.pdf' }
    ] },
    { theme: 'Système de santé', items: [
      { t: 'Loi n° 2018-493 du 20 juin 2018 relative à la protection des données personnelles', y: '2018', url: 'documents/textes/39-loi-2018-493-du-20-juin-2018-relative-a-la-protection-des-do.pdf' },
      { t: 'Décret n° 2016-942 relatif à l’organisation du DPC des professionnels de santé', y: '2016', url: 'documents/textes/51-decret-n-2016-942-relatif-a-lorganisation-du-dpc-des-profess.pdf' },
      { t: 'Décret n° 2016-1024 relatif aux territoires de démocratie sanitaire aux zones des schémas régionaux de santé et aux conseils territoriaux de santé', y: '2016', url: 'documents/textes/50-decret-no-2016-1024-relatif-aux-territoires-de-democratie-sa.pdf' },
      { t: 'Décret n° 2010-585 relatif aux unions régionales de professionnels de santé', y: '2010', url: 'documents/textes/63-decret-2010-585-relatif-aux-unions-regionales-de-professionn.pdf' },
      { t: 'Décret n° 2010-514 relatif au projet régional de santé', y: '2010', url: 'documents/textes/64-decret-2010-514-relatif-au-projet-regional-de-sante.pdf' }
    ] },
    { theme: 'Branche et rémunération', items: [
      { t: 'Rapport de branche 2021 des laboratoires de biologie médicale extra-hospitaliers (données 2020)', y: '2021', url: 'documents/textes/01-labm-rapport-de-branche-2021.pdf' },
      { t: 'Grille des salaires minima au 1er mai 2022 (accord du 27 avril 2022)', y: '2022', url: 'documents/textes/02-2022-grille-salaires-au-1er-mai.pdf' }
    ] },
    { theme: 'Crise sanitaire (covid-19)', items: [
      { t: 'Arrêté du 15 mars 2022 sur le criblage', y: '2022', url: 'documents/textes/03-arrete-du-15-mars-sur-le-criblage.pdf' },
      { t: 'DGS-Urgent du 14 mars 2022 : évolution de la lutte contre la covid-19', y: '2022' },
      { t: 'Décret n° 2022-352 du 12 mars 2022 : mesures générales nécessaires à la gestion de la sortie de crise sanitaire', y: '2022', url: 'documents/textes/05-decret-du-12-mars-mesures-generales-necessaires-a-la-gestion.pdf' },
      { t: 'Arrêté du 1er février 2022 modifiant la liste des actes et prestations mentionnée à l’article L. 162-1-7 du code de la sécurité sociale et l’arrêté du 12 décembre 2020 portant modification des conditions de remboursement de l’acte de détection du génome du SARS-CoV-2 par amplification génique', y: '2022', url: 'documents/textes/06-arrete-du-1er-fevrier-modifiant-la-liste-des-actes-et-presta.pdf' },
      { t: 'Arrêté du 27 décembre 2021 modifiant l’arrêté du 1er juin 2021 prescrivant les mesures générales nécessaires à la gestion de la sortie de crise sanitaire', y: '2021', url: 'documents/textes/08-arrete-du-27-decembre-2021-modifiant-larrete-du-1er-juin-202.pdf' },
      { t: 'Loi n° 2021-1465 du 10 novembre 2021 portant diverses dispositions de vigilance sanitaire', y: '2021', url: 'documents/textes/10-loi-no-2021-1465-du-10-novembre-2021-portant-diverses-dispos.pdf' },
      { t: 'Arrêté du 9 octobre 2021 prescrivant les mesures nécessaires à la sortie de crise sanitaire', y: '2021', url: 'documents/textes/11-arrete-du-9-octobre-2021-prescrivant-les-mesures-necessaires.pdf' },
      { t: 'Arrêté du 17 juillet 2021 portant modification des conditions de remboursement de l’acte de détection du génome du SARS-CoV-2 par amplification génique', y: '2021', url: 'documents/textes/12-arrete-du-17-juillet-portant-modification-des-conditions-de.pdf' },
      { t: 'Décret n° 2021-930 du 13 juillet 2021 modifiant le décret n° 2020-551 du 12 mai 2020 relatif aux systèmes d’information mentionnés à l’article 11 de la loi n° 2020-546 du 11 mai 2020 prorogeant l’état d’urgence sanitaire et complétant ses dispositions et le décret n° 2020-1690 du 25 décembre 2020 autorisant la création d’un traitement de données à caractère personnel relatif aux vaccinations contre la covid-19', y: '2021', url: 'documents/textes/13-decret-no-2021-930-du-13-juillet-2021-modifiant-le-decret-no.pdf' },
      { t: 'Arrêté du 7 juillet 2021 modifiant l’arrêté du 1er juin 2021 prescrivant les mesures générales nécessaires à la gestion de la sortie de crise sanitaire', y: '2021', url: 'documents/textes/14-arrete-du-7-juillet-2021-modifiant-larrete-du-1er-juin-2021.pdf' },
      { t: 'Arrêté du 6 juillet 2021 modifiant l’arrêté du 1er juin 2021 prescrivant les mesures générales nécessaires à la gestion de la sortie de crise sanitaire', y: '2021', url: 'documents/textes/15-arrete-du-6-juillet-2021-modifiant-larrete-du-1er-juin-2021.pdf' },
      { t: 'Arrêté du 29 mai 2021 portant modification de la liste des actes et prestations mentionnée à l’article L. 162-1-7 du code de la sécurité sociale et portant modification de l’arrêté du 12 décembre 2020 portant modification des conditions de remboursement de l’acte de détection du génome du SARS-CoV-2 par amplification génique', y: '2021', href: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043558149' },
      { t: 'Arrêté du 10 avril 2021 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', y: '2021', url: 'documents/textes/17-arrete-du-10-avril-2021-prescrivant-les-mesures-dorganisatio.pdf' },
      { t: 'Arrêté du 23 mars 2021 prescrivant les mesures nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', y: '2021', url: 'documents/textes/18-arrete-du-23-mars-2021-prescrivant-les-mesures-necessaires-p.pdf' },
      { t: 'Loi n° 2021-160 du 15 février 2021 prorogeant l’état d’urgence sanitaire', y: '2021', url: 'documents/textes/20-loi-no-2021-160-du-15-fevrier-2021-prorogeant-letat-durgence.pdf' },
      { t: 'Arrêté du 23 janvier 2021 modifiant l’arrêté du 10 juillet 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', y: '2021', url: 'documents/textes/22-arrete-du-23-janvier-2021-modifiant-larrete-du-10-juillet-20.pdf' },
      { t: 'Arrêté du 10 août 2020 modifiant l’arrêté du 10 juillet 2020 prescrivant les mesures générales nécessaires pour faire face à l’épidémie de covid-19 dans les territoires sortis de l’état d’urgence sanitaire et dans ceux où il a été prorogé', y: '2020', url: 'documents/textes/24-arrete-du-10-aout-2020-modifiant-larrete-du-10-juillet-2020.pdf' },
      { t: 'Arrêté du 10 juillet 2020 prescrivant les mesures générales nécessaires pour faire face à l’épidémie de covid-19 dans les territoires sortis de l’état d’urgence sanitaire et dans ceux où il a été prorogé', y: '2020', href: 'https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000042106233' },
      { t: 'Arrêté du 25 juin 2020 complétant l’arrêté du 23 mars 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', y: '2020', url: 'documents/textes/26-arrete-du-25-juin-2020-completant-larrete-du-23-mars-2020-pr.pdf' },
      { t: 'Arrêté du 27 mai 2020 portant modification de la liste des actes et prestations mentionnée à l’article L. 162-1-7 du code de la sécurité sociale (diagnostic biologique de l’infection par le SARS-CoV-2)', y: '2020', url: 'documents/textes/27-arrete-du-27-mai-2020-portant-modification-de-la-liste-des-a.pdf' },
      { t: 'Décret n° 2020-637 modifiant le décret n° 2020-73 portant adoption de conditions adaptées pour le bénéfice des prestations en espèces pour les personnes exposées au coronavirus', y: '2020', url: 'documents/textes/28-decret-no-2020-637-modifiant-le-decret-n-2020-73-portant-ado.pdf' },
      { t: 'Décret n° 2020-434 relatif à l’adaptation temporaire des délais et modalités de versement de l’indemnité complémentaire prévue à l’article L. 1226-1 du code du travail', y: '2020', url: 'documents/textes/29-decret-n-2020-434-relatif-a-ladaptation-temporaire-des-delai.pdf' },
      { t: 'Arrêté du 20 mai 2020 complétant l’arrêté du 23 mars 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', y: '2020', url: 'documents/textes/30-arrete-du-20-mai-2020-completant-larrete-du-23-mars-2020-pre.pdf' },
      { t: 'Arrêté du 5 avril 2020 complétant l’arrêté du 23 mars 2020 prescrivant les mesures d’organisation et de fonctionnement du système de santé nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire.', y: '2020', url: 'documents/textes/31-arrete-du-5-avril-2020-completant-larrete-du-23-mars-2020-pr.pdf' },
      { t: 'Décret n° 2020-293 prescrivant les mesures générales nécessaires pour faire face à l’épidémie de covid-19 dans le cadre de l’état d’urgence sanitaire', y: '2020', url: 'documents/textes/32-decret-n-2020-293-prescrivant-les-mesures-generales-necessai.pdf' },
      { t: 'Arrêté du 16 mars 2020 complétant l’arrêté du 14 mars 2020 portant diverses mesures relatives à la lutte contre la propagation du virus covid-19', y: '2020', url: 'documents/textes/33-arrete-du-16-mars-2020-completant-larrete-du-14-mars-2020-po.pdf' }
    ] },
    { theme: 'Guide de référence', items: [
      { t: 'Références juridiques en biologie médicale, DGOS et CNAM, mise à jour de novembre 2018', y: '2018', url: 'documents/textes/38-dgos-et-cnam-references-juridiques-en-biologie-medicale-mise.pdf' }
    ] }
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
    { t: 'La veille réglementaire, chaque lundi', d: 'Le Journal officiel, l’Assemblée nationale et le Sénat, analysés pour votre laboratoire.' },
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
    '<a class="vcard" href="#espace" data-section="vi-' + esc(v.id) + '">' +
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
        '</span><span class="v-title">' + esc(v.title) + '</span></span>' +
        '<span class="v-plus" aria-hidden="true"></span>' +
      '</summary><div class="v-body">' +
        '<p>' + esc(v.resume) + '</p>' +
        (facts ? '<dl class="v-facts">' + facts + '</dl>' : '') +
        '<div class="link-row">' +
          (v.url && isHttp(v.url) ? '<a class="more" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.linkLabel || 'Texte officiel') + '</a>' : '') +
        '</div></div></details>';
  };

  const pitem = (p) =>
    '<article class="pitem" id="cp-' + esc(p.id) + '">' +
      '<p class="p-meta"><span class="p-date">' + esc(p.dateLabel || longDate(p.date)) + '</span><span>' + esc(p.with) + '</span>' +
        (p.members ? '<span class="tag-members">' + ICON.lockS + 'Adhérents</span>' : '') + '</p>' +
      '<h2 class="p-title">' + esc(p.title) + (p.subtitle ? '<span class="p-subtitle">' + esc(p.subtitle) + '</span>' : '') + '</h2>' +
      (p.chapo ? '<p class="p-chapo">' + esc(p.chapo) + '</p>' : '') +
      (p.quote ? '<figure class="p-quote"><blockquote><p>' + esc(p.quote.text) + '</p></blockquote><figcaption>' + esc(p.quote.by) + '</figcaption></figure>' : '') +
      (p.body && p.body.length ? '<details class="p-full"><summary>Lire le communiqué en entier</summary>' +
        p.body.map((sec) => (sec.h ? '<h3>' + esc(sec.h) + '</h3>' : '') + sec.ps.map((x) => '<p>' + esc(x) + '</p>').join('')).join('') + '</details>' : '') +
      (p.points && p.points.length ? '<h3 class="p-points-title">' + esc(p.pointsTitle || 'Points clés') + '</h3><dl class="p-points">' +
        p.points.map((x) => '<div><dt>' + esc(x[0]) + '</dt><dd>' + esc(x[1]) + '</dd></div>').join('') + '</dl>' : '') +
      (p.url && DOCS[p.url] ? '<a class="more" href="' + esc(p.url) + '" data-doc="' + esc(p.url) + '">' + esc(p.linkLabel || 'Lire le document') + '</a>'
      : p.url && (isHttp(p.url) || isDoc(p.url)) ? '<a class="more" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.linkLabel || 'Lire le communiqué') + '</a>'
                              : '<span class="muted" style="font-size:15px">Publié depuis l’espace adhérent (démonstration).</span>') +
    '</article>';

  const arow = (a) =>
    '<li><a class="row-link" href="#actualites" data-section="ac-' + esc(a.id) + '">' +
      '<time class="row-date" datetime="' + esc(a.date) + '">' + esc(shortDate(a.date)) + '</time>' +
      '<span class="row-title">' + esc(a.title) + '</span>' +
      '<span class="row-cat">' + esc(a.cat) + '</span>' +
    '</a></li>';

  /* Liens d'une actualité : l'article et sa pièce jointe s'ouvrent dans la liseuse ; une publication de démonstration
     peut renvoyer vers une page extérieure. */
  const docLink = (u, label, n) => '<a class="more" href="' + esc(u) + '" data-doc="' + esc(u) + '">' + esc(label) + (n ? ' (' + nPages(u) + ')' : '') + '</a>';
  const actuLinks = (a) => {
    const l = [];
    if (a.doc && DOCS[a.doc]) l.push(docLink(a.doc, a.docLabel || 'Lire l’article', !!a.docLabel));
    if (a.att && DOCS[a.att.url]) l.push(docLink(a.att.url, a.att.label, true));
    if (!l.length && a.url && isHttp(a.url)) l.push('<a class="more" href="' + esc(a.url) + '" target="_blank" rel="noopener">Lire la suite</a>');
    return l.length ? '<p class="news-links">' + l.join('') + '</p>' : '';
  };
  const anews = (a) =>
    '<li class="news-item" id="ac-' + esc(a.id) + '">' +
      '<p class="news-meta"><time datetime="' + esc(a.date) + '">' + esc(longDate(a.date)) + '</time><span>' + esc(a.cat) + '</span>' +
        (a.members ? '<span class="tag-members">' + ICON.lockS + 'Adhérents</span>' : '') + '</p>' +
      '<h2 class="news-title">' + esc(a.title) + '</h2>' +
      (a.excerpt ? '<p class="news-excerpt">' + esc(a.excerpt) + '</p>' : '') +
      actuLinks(a) +
    '</li>';

  const namesOr = (names, empty) => (names.length ? esc(names.join(', ')) : '<span class="pending">' + esc(empty) + '</span>');
  /* Représentants d’une instance : « Thierry Bouchet et un représentant à désigner », ou « Représentant à désigner » s’il n’y a personne. */
  const repsLine = (names, todo) => {
    if (!todo) return namesOr(names, 'Représentant à désigner');
    if (!names.length) return '<span class="pending">' + esc(todo.charAt(0).toUpperCase() + todo.slice(1)) + '</span>';
    return esc(names.join(', ')) + ' et <span class="pending">' + esc(todo) + '</span>';
  };

  /* ---------- Commande segmentée ---------- */
  function seg(el, options, current, onPick) {
    el.innerHTML = options.map((o) => '<button type="button" aria-pressed="' + (o === current ? 'true' : 'false') + '">' + esc(o) + '</button>').join('');
    $$('button', el).forEach((b, i) => b.addEventListener('click', () => {
      onPick(options[i]);
      const pressed = el.querySelector('[aria-pressed="true"]');
      if (pressed) pressed.focus();
    }));
  }

  /* ---------- Le syndicat : mise en page éditoriale (7 novembre 2026, demandes d'Isabelle Eimer) ----------
     Un syndicat travaille en collectif : personne n'est classé. Le bureau est présenté par ordre alphabétique, chaque fiche
     identique (nom, fonction, région) ; les noms du conseil et des instances sont aussi par ordre alphabétique.
     On montre ce que le syndicat a, pas ce qui lui manque : pas de nombre de régions, et les sièges à pourvoir ne sont pas
     affichés (ils restent dans les tableaux : champs todo, groupes vides, régions URPS sans nom) ; une instance sans
     représentant nommé garde sa fiche, en fin de liste. Les chiffres affichés sont calculés à partir des tableaux. */
  const OUTREMER = ['Guadeloupe', 'Guyane', 'Martinique', 'La Réunion', 'Mayotte'];
  const EN_LETTRES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze'];
  const kfigs = (list) => list.map((f) => '<li class="kfig"><span class="kfig-n">' + f[0] + '</span> <span class="kfig-l">' + esc(f[1]) + '</span></li>').join('');
  const caRegionOf = (name) => { const r = CA.find((x) => x[1].includes(name)); return r ? r[0] : ''; };
  /* Ordre alphabétique du nom de famille (dernier mot), puis du prénom */
  const surname = (n) => n.split(' ').slice(-1)[0];
  const byName = (a, b) => surname(a).localeCompare(surname(b), 'fr') || a.localeCompare(b, 'fr');
  /* Titre d'une instance : son sigle en grand, ou son nom s'il est court (Cofrac) */
  const instHead = (i) => i.a || (i.n.length < 10 ? i.n : '');
  const instNames = (i) => (i.groups ? i.groups.flatMap((g) => g[1]) : i.reps);
  const repsList = (names) => (names.length ? '<ul class="reps">' + names.slice().sort(byName).map((n) => '<li>' + esc(n) + '</li>').join('') + '</ul>' : '');

  function renderSyndicat() {
    /* Bureau : par ordre alphabétique, fiches identiques */
    const n = BUREAU.length;
    $('#bureau-count').textContent = EN_LETTRES[n] || String(n);
    $('#bureau-list').innerHTML = BUREAU.slice().sort((a, b) => byName(a[1], b[1])).map((b) => {
      const region = caRegionOf(b[1]);
      return '<li class="person"><h3 class="person-name">' + esc(b[1]) + '</h3><p class="person-role">' + esc(b[0]) + '</p>' +
        (region ? '<p class="pm-region"><span class="pm-l">Région</span> ' + esc(region) + '</p>' : '') + '</li>';
    }).join('');

    /* Conseil : le nombre d'administrateurs, puis une fiche par région (bandeau de couleur), noms par ordre alphabétique */
    const total = CA.reduce((s, r) => s + r[1].length, 0);
    $('#ca-figs').innerHTML = kfigs([[total, total > 1 ? 'administrateurs' : 'administrateur']]);
    $('#ca-list').innerHTML = CA.map((r, k) =>
      '<li class="ca-region s' + (k % 2) + '"><h3 class="ca-name">' + esc(r[0]) + '</h3>' +
        '<ul class="ca-people">' + r[1].slice().sort(byName).map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul></li>').join('');

    /* Représentants : une fiche par instance, sous son sigle, avec ses représentants nommés ; ancre inst-<numéro dans INSTANCES> */
    $('#inst-figs').innerHTML = kfigs([[INSTANCES.length, 'instances']]);
    const order = INSTANCES.map((i, k) => ({ i, k })).sort((a, b) => (instNames(b.i).length ? 1 : 0) - (instNames(a.i).length ? 1 : 0));
    $('#inst-list').innerHTML = order.map(({ i, k }, pos) => {
      const head = instHead(i);
      const groups = (i.groups || []).filter((g) => g[1].length);
      return '<li class="inst s' + (pos % 2) + '" id="inst-' + k + '"><h3 class="inst-head">' +
          (head ? '<span class="inst-sig">' + esc(head) + '</span>' + (i.a ? '<span class="inst-full">' + esc(i.n) + '</span>' : '') : '<span class="inst-sig inst-sig-long">' + esc(i.n) + '</span>') +
        '</h3><p class="inst-role">' + esc(i.r || '') + '</p><div class="inst-reps">' +
        (i.groups ? groups.map((g) => '<p class="inst-group">' + esc(g[0]) + '</p>' + repsList(g[1])).join('') : repsList(i.reps)) +
      '</div></li>';
    }).join('');

    /* URPS : le nombre de représentants, puis la métropole et l'outre-mer (régions où siège au moins un représentant) */
    const reps = URPS.reduce((s, u) => s + u[1].length, 0);
    $('#urps-figs').innerHTML = kfigs([[reps, 'représentants dans les URPS']]);
    const group = (title, list) => (list.length ? '<div class="urps-group"><h3 class="urps-gname">' + esc(title) + '</h3>' +
      '<ul class="urps-cols">' + list.map((u) => '<li class="urps-item"><h4 class="urps-region">' + esc(u[0]) + '</h4>' +
        '<ul class="urps-names">' + u[1].slice().sort(byName).map((p) => '<li>' + esc(p) + '</li>').join('') + '</ul></li>').join('') + '</ul></div>' : '');
    const filled = URPS.filter((u) => u[1].length);
    $('#urps-list').innerHTML = group('Métropole', filled.filter((u) => !OUTREMER.includes(u[0]))) + group('Outre-mer', filled.filter((u) => OUTREMER.includes(u[0])));
  }

  /* Numéros des missions, dessinés comme les mascottes (7 novembre 2026, demande d'Isabelle Eimer) : chiffre au marqueur
     noir dans un rond blanc, posé sur le rond vert anis du logo, petits traits de joie, ombre au sol. Couleurs en attributs.
     À l'arrivée à l'écran, le rond se trace, le rond vert apparaît, puis le chiffre s'écrit (setupMotion) ; au défilement,
     la pastille bouge comme une mascotte (groupe .perso, setupScrollLife). */
  const MISSION_DIGITS = {
    1: ['M34 31 Q40 28 45 22 L45 57', 'M36 57.5 L54 57.5'],
    2: ['M31 32 Q31 21.5 42.5 21.5 Q53.5 21.5 53 31.5 Q52.5 40 32 57.5 L55 57'],
    3: ['M31.5 27 Q39 20 48 22.5 Q55 26 51 33.5 Q47.5 38.5 40 38.5 Q53 38.5 54.5 47 Q55 58 42 58.5 Q34.5 59 30.5 54'],
    4: ['M48 58 L48 21.5 L29.5 46 L56.5 46']
  };
  const missionBadge = (n) => '<svg class="mnum" viewBox="0 0 86 92" aria-hidden="true" focusable="false" fill="none" stroke="#2E3236" stroke-linecap="round" stroke-linejoin="round">' +
    '<ellipse cx="44" cy="86" rx="23" ry="3.2" fill="#E6E9DF" stroke="none"/>' +
    '<g class="perso"><circle class="mnum-anis" cx="50" cy="47" r="29" fill="#A3BE3C" stroke="none"/>' +
    '<path class="mnum-head" pathLength="1" d="M42 11 C59.5 10.5 71 23.5 71 40 C71 57.5 58.5 69.5 42 69.5 C25 69.5 13 57 13 40 C13 23.5 25.5 11.8 39.5 11.2" fill="#FFFFFF" stroke-width="2.8"/>' +
    (MISSION_DIGITS[n] || []).map((d) => '<path class="mnum-digit" pathLength="1" d="' + d + '" stroke-width="5"/>').join('') +
    '<g class="mnum-eclats" stroke-width="2.6"><path d="M67 13 L72.5 7.5"/><path d="M71.5 21.5 L79 19.5"/><path d="M60.5 8 L62 2"/></g></g></svg>';

  /* ---------- Rendu du contenu fixe ---------- */
  function renderStatic() {
    $('#home-benefits').innerHTML = BENEFITS.map((b) => '<li><span>' + esc(b.t) + '</span></li>').join('');
    $('#benefits-grid').innerHTML = BENEFITS.map((b) => '<div class="benefit"><h2>' + esc(b.t) + '</h2><p>' + esc(b.d) + '</p></div>').join('');
    /* Piliers de « Ce que nous défendons » (accueil) : mêmes numéros dessinés et même animation que les missions */
    $$('#piliers .pillar').forEach((el, k) => { if (!el.querySelector('.mnum')) el.insertAdjacentHTML('afterbegin', missionBadge(k + 1)); });
    $('#missions-list').innerHTML = MISSIONS.map((m, k) => '<div class="charter-item">' + missionBadge(k + 1) + '<div class="charter-text"><h3 class="h-block"><span class="sr-only">Mission ' + (k + 1) + '\u00a0: </span>' + esc(m.t) + '</h3><p>' + esc(m.d) + '</p></div></div>').join('');
    renderSyndicat();
    $('#comptes-list').innerHTML = docRow({ t: 'Les statuts du SLBC', s: 'Paris, le 16 novembre 2013', url: STATUTS }, 'Statuts') +
      COMPTES.map((c) => docRow({ t: c.d, url: c.url }, 'Exercice ' + c.y)).join('');
    $('#trackers').innerHTML = TRACKERS.map((t) => '<p class="track-title">' + esc(t.title) + '</p><ol class="track">' + t.steps.map((s) => '<li class="' + (s.done ? 'done' : '') + '"><span class="step-name">' + esc(s.n) + '</span><span class="step-when">' + esc(s.w) + '</span></li>').join('') + '</ol>').join('');
    $('#foot-partners').innerHTML = PARTNERS.slice(0, 5).map((p) => '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(p.n) + '</a></li>').join('');
    renderDocs('');
  }

  const docRow = (d, date, cat) => {
    const inner = '<span class="row-date">' + esc(date) + '</span><span class="row-title">' + esc(d.t) + (d.s ? '<span class="row-sub">' + esc(d.s) + '</span>' : '') + '</span>';
    if (d.url && DOCS[d.url]) return '<li><a class="row-link" href="' + esc(d.url) + '" data-doc="' + esc(d.url) + '">' + inner + '<span class="row-cat">' + esc(cat || nPages(d.url)) + '</span></a></li>';
    if (d.href) return '<li><a class="row-link" href="' + esc(d.href) + '" target="_blank" rel="noopener">' + inner + '<span class="row-cat">' + esc(d.src || 'Légifrance') + '</span></a></li>';
    return '<li><div class="row-link is-missing">' + inner + '<span class="row-cat">Document à fournir</span></div></li>';
  };
  function renderDocs(q) {
    const terms = norm(q).split(/\s+/).filter(Boolean);
    const ok = (s) => !terms.length || terms.every((t) => norm(s).includes(t));
    let etudes = 0;
    $('#doc-etudes-list').innerHTML = ETUDES.map((grp) => {
      const items = grp.items.filter((d) => ok(d.t + ' ' + d.s + ' ' + grp.g + ' ' + (d.src || '') + ' étude rapport'));
      etudes += items.length;
      if (!items.length) return '';
      return '<p class="doc-theme">' + esc(grp.g) + '</p><ul class="rows">' + items.map((d) => '<li><a class="row-link" href="' + esc(d.url) + '"' +
        (d.doc ? ' data-doc="' + esc(d.url) + '"' : ' target="_blank" rel="noopener"') + '><span class="row-date">' + esc(d.d) + '</span><span class="row-title">' +
        esc(d.t) + '<span class="row-sub">' + esc(d.s) + '</span></span><span class="row-cat">' + (d.doc ? DOCS[d.url].pages + ' pages' : esc(d.src)) + '</span></a></li>').join('') + '</ul>';
    }).join('');
    $('#doc-etudes').hidden = !etudes;
    const nabm = NABM.filter((d) => ok(d.t + ' ' + (d.s || '') + ' nabm nomenclature'));
    $('#doc-nabm-list').innerHTML = nabm.map((d) => docRow(d, 'NABM')).join('');
    $('#doc-nabm').hidden = !nabm.length;
    let html = '';
    let count = 0;
    /* Un groupe dépliable par thème ; une recherche ouvre les groupes qui ont des résultats. */
    TEXTES.forEach((g, gi) => {
      const items = g.items.filter((d) => ok(d.t + ' ' + g.theme + ' ' + d.y)).sort((a, b) => b.y.localeCompare(a.y));
      if (!items.length) return;
      count += items.length;
      html += '<details class="region doc-group" id="doc-t' + gi + '"' + (terms.length ? ' open' : '') + '><summary><span>' + esc(g.theme) + '</span><span class="count">' + items.length + ' texte' + (items.length > 1 ? 's' : '') + '</span></summary><ul class="rows">' +
        items.map((d) => docRow(d, d.y)).join('') + '</ul></details>';
    });
    $('#doc-textes-list').innerHTML = html;
    $('#doc-textes').hidden = !count;
    const parts = PARTNERS.filter((p) => ok(p.n + ' ' + p.d + ' partenaire'));
    $('#partners-list').innerHTML = parts.map((p) => '<li><a href="' + esc(p.url) + '" target="_blank" rel="noopener"><strong>' + esc(p.n) + '</strong><span>' + esc(p.d) + '</span></a></li>').join('');
    $('#doc-partenaires').hidden = !parts.length;
    $('#doc-empty').hidden = Boolean(etudes || nabm.length || count || parts.length);
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
      : '<p class="empty">Aucun communiqué pour l’instant.</p>';
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
  /* Accueil : le communiqué le plus récent, juste sous la devise (demande d'Isabelle Eimer du 6 novembre 2026).
     Un nouveau communiqué le remplace de lui-même ; ceux réservés aux adhérents n'y figurent pas. */
  function renderHomeCp() {
    const p = DATA.presse.filter((x) => !x.members).sort(byDate)[0];
    const sec = $('#home-cp');
    if (!p) { sec.hidden = true; return; }
    sec.hidden = false;
    const doc = p.url && DOCS[p.url];
    $('#home-cp-in').innerHTML =
      '<div class="hcp-main">' +
        '<p class="hcp-kicker">Flash Info</p>' +
        '<p class="p-meta"><span class="p-date">' + esc(p.dateLabel || longDate(p.date)) + '</span><span>' + esc(p.with) + '</span></p>' +
        '<h2 class="hcp-title" id="h-home-cp">' + esc(p.title) + (p.subtitle ? '<span class="p-subtitle">' + esc(p.subtitle) + '</span>' : '') + '</h2>' +
        (p.chapo ? '<p class="hcp-chapo">' + esc(p.chapo) + '</p>' : '') +
        '<div class="link-row"><a class="more" href="#presse" data-section="cp-' + esc(p.id) + '">Lire le communiqué</a>' +
          (doc ? '<a class="more" href="' + esc(p.url) + '" data-doc="' + esc(p.url) + '">' + esc(p.linkLabel || 'Lire le document') + '</a>' : '') +
        '</div>' +
      '</div>' +
      /* Colonne de droite : trois mascottes qui lisent le journal (demande d'Isabelle Eimer du 6 novembre 2026), puis la citation */
      '<div class="hcp-side">' + $('#tpl-lecteurs').innerHTML +
        (p.quote ? '<figure class="p-quote hcp-quote"><blockquote><p>' + esc(p.quote.text) + '</p></blockquote><figcaption>' + esc(p.quote.by) + '</figcaption></figure>' : '') +
      '</div>';
  }
  function renderDynamic() { renderShelf(); renderHomeCp(); renderHomeActus(); renderActus(); renderVeille(); renderPresse(); renderRecent(); INDEX = buildIndex(); }

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
    if (!t) {
      state.veilleSrc = 'Tout'; state.actuCat = 'Toutes'; state.presseYear = 'Toutes';
      renderVeille(); renderActus(); renderPresse();
      if ($('#doc-q')) { $('#doc-q').value = ''; renderDocs(''); }
      t = document.getElementById(id);
    }
    if (!t) return;
    if (t.closest('#member')) {
      if (!member) { wantPanel = panelOf(t); window.scrollTo(0, 0); return; }
      showPanel(panelOf(t));
      /* Une rubrique entière : en haut de page, comme après la connexion. */
      if (t.classList.contains('ea-panel')) { window.scrollTo(0, 0); $('#ea-tabs button[aria-pressed="true"]').focus({ preventScroll: true }); return; }
    }
    if (t.offsetParent === null) {
      state.veilleSrc = 'Tout'; state.actuCat = 'Toutes'; state.presseYear = 'Toutes';
      renderVeille(); renderActus(); renderPresse();
      t = document.getElementById(id);
    }
    if (!t) return;
    if (t.tagName === 'DETAILS') t.open = true;
    else if (t.classList.contains('pitem')) { const full = t.querySelector('.p-full'); if (full) full.open = true; }
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
    const first = current === null;
    current = v;
    closeMenu();
    if (changed || first) playSignature(v);
    if (v === 'accueil') requestAnimationFrame(updateShelf);
    if (pendingSection) {
      const id = pendingSection;
      pendingSection = null;
      requestAnimationFrame(() => goSection(id));
    } else if (changed) {
      window.scrollTo(0, 0);
    }
    requestAnimationFrame(kickLife);
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
    page('Statuts et comptes', 'Les statuts du SLBC, comptes des exercices 2020, 2022 et 2023', '#syndicat', 'comptes');
    page('Veille réglementaire', 'Réservée aux adhérents : Journal officiel, Assemblée nationale, Sénat', '#veille');
    idx.push({ type: 'Page', title: 'Lettre d’information', sub: 'La veille et les nouvelles publications par e-mail', href: '#espace', section: 'ea-lettre', text: 'newsletter abonnement abonner s’abonner s\'abonner désinscription e-mail' });
    idx.push({ type: 'Page', title: 'Écrire au bureau', sub: 'Participer à une commission, une suggestion, une question', href: '#espace', section: 'ea-ecrire', text: 'commission participer suggestion idée question contact message adhérent' });
    idx.push({ type: 'Page', title: 'Salle de presse', sub: 'Les communiqués du SLBC', href: '#presse', section: null, text: 'contact presse journaliste kit presse logo' });
    idx.push({ type: 'Page', title: 'Contacter le SLBC', sub: 'Adresse e-mail et adresse postale', href: '#mentions', section: 'mentions-legales', text: 'contact contacter nous contacter écrire e-mail courriel adresse téléphone' });
    page('Actualités', 'L’information du syndicat', '#actualites');
    page('Nomenclature des actes (NABM)', 'Arrêtés et décisions de l’UNCAM', '#documentation', 'doc-nabm');
    page('Textes réglementaires', 'Lois, décrets et arrêtés', '#documentation', 'doc-textes');
    page('Adhérer au SLBC', 'Demande d’adhésion en ligne', '#adherer');
    page('Espace adhérent', 'Veille réglementaire, lettre d’information, publications', '#espace');
    idx.push({ type: 'Page', title: 'Mentions légales', sub: 'Éditeur, directeur de la publication, hébergeur', href: '#mentions', section: null, text: 'informations légales éditeur hébergeur droit de réponse' });
    idx.push({ type: 'Page', title: 'Données personnelles', sub: 'Usages, durées de conservation, vos droits', href: '#mentions', section: 'donnees', text: 'RGPD confidentialité vie privée CNIL droits' });
    idx.push({ type: 'Page', title: 'Cookies', sub: 'Aucun cookie de mesure d’audience ni de publicité', href: '#mentions', section: 'cookies', text: 'traceurs bandeau' });
    if (member) DATA.veille.forEach((v) => idx.push({ type: 'Veille', title: v.title, sub: v.when, href: '#espace', section: 'vi-' + v.id, text: v.resume }));
    DATA.presse.forEach((p) => idx.push({ type: 'Communiqué', title: p.title + (p.subtitle ? ' : ' + p.subtitle : ''), sub: p.dateLabel || longDate(p.date), href: '#presse', section: 'cp-' + p.id, text: p.chapo + ' ' + p.with + ' ' + (p.quote ? p.quote.text : '') + ' ' + (p.body || []).map((sec) => sec.h + ' ' + sec.ps.join(' ')).join(' ') + ' ' + (p.points || []).map((x) => x.join(' ')).join(' ') }));
    DATA.actus.forEach((a) => idx.push({ type: 'Actualité', title: a.title, sub: longDate(a.date), href: '#actualites', section: 'ac-' + a.id, text: a.excerpt + ' ' + a.cat }));
    BUREAU.forEach((b) => idx.push({ type: 'Bureau', title: b[1], sub: b[0], href: '#syndicat', section: 'bureau', text: '' }));
    INSTANCES.forEach((i) => {
      const names = i.reps.concat(...(i.groups || []).map((g) => g[1]));
      idx.push({ type: 'Instance', title: i.n + (i.a ? ' (' + i.a + ')' : ''), sub: i.r, href: '#syndicat', section: 'inst-' + INSTANCES.indexOf(i), text: names.join(' ') });
    });
    NABM.forEach((d) => idx.push({ type: 'Document', title: d.t, sub: 'Nomenclature des actes', href: '#documentation', section: 'doc-nabm', text: d.s || '' }));
    TEXTES.forEach((g, gi) => g.items.forEach((d) => idx.push({ type: 'Document', title: d.t, sub: g.theme, href: '#documentation', section: 'doc-t' + gi, text: d.y })));
    ETUDES.forEach((grp) => grp.items.forEach((d) => idx.push({ type: 'Document', title: d.t, sub: grp.g + ', ' + d.d, href: '#documentation', section: 'doc-etudes', text: d.s + ' ' + (d.src || '') + ' étude rapport' })));
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
      : '<p class="sr-empty">Aucun résultat pour « ' + esc(q) + ' ». Essayez « nomenclature », « protocole » ou « bureau ».</p>';
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
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!$('#reader').hidden) closeReader(); else if (!sPanel.hidden) closeSearch(false); else closeMenu(); } });

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
    setMember(em.value.trim());
    showPanel(wantPanel || 'veille', wantSujet); wantPanel = null; wantSujet = null;
    $('#login-intent').hidden = true;
    window.scrollTo(0, 0);
    playSignature('espace');
    $('#ea-tabs button[aria-pressed="true"]').focus({ preventScroll: true });
  });
  $('#logout').addEventListener('click', () => { setMember(null); showPanel('veille'); window.scrollTo(0, 0); $('#login-email').focus({ preventScroll: true }); });

  /* ---------- Espace adhérent : publier ---------- */
  const PUB = {
    cp: { label: 'Communiqué', submit: 'Publier le communiqué', toast: 'Communiqué publié', href: '#presse', prefix: 'cp-', where: 'La publication apparaîtra en tête de la salle de presse et, si elle n’est pas réservée aux adhérents, sous la devise de la page d’accueil.' },
    veille: { label: 'Veille', submit: 'Publier dans la veille', toast: 'Publié dans la veille', href: '#espace', prefix: 'vi-', where: 'La publication apparaîtra dans la veille réglementaire de l’espace adhérent et, pour les adhérents connectés, dans le bandeau de la page d’accueil.' },
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
    /* La veille est toujours réservée aux adhérents : l'interrupteur ne concerne que communiqués et actualités. */
    $('#f-members').closest('.g-row').hidden = pubType === 'veille';
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
    if (pubType === 'veille' || $('#f-members').checked) tags += '<span class="tag-members">' + ICON.lockS + 'Réservé aux adhérents</span>';
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
        (pubType === 'veille' || $('#f-members').checked ? '<p class="mp-note">Réservé aux adhérents : la lecture complète demande de se connecter.</p>' : '');
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
      : '<li class="nl-empty">Aucun abonné pour l’instant.</li>';
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

  /* ---------- Signature : les deux ronds se rejoignent à l'ouverture de chaque page ----------
     Demande d'Isabelle Eimer du 6 novembre 2026. Sur l'accueil, ce sont les grands ronds sous le menu ;
     sur les autres pages, une petite signature au-dessus du titre (couleurs du logo pour fond sombre
     sur la Veille, comme marque/symbole-fond-sombre.svg). Couleurs écrites en attributs fill. */
  function sigSVG(id, dark) {
    const c = dark ? ['#FFFFFF', '#A3BE3C', '#D6E4A6'] : ['#5E6266', '#A3BE3C', '#5F7A2B'];
    return '<svg class="sig-mark" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' +
      '<defs><clipPath id="clip-sig-' + id + '"><circle data-c="clip" cx="44" cy="44" r="36"/></clipPath></defs>' +
      '<circle data-c="grey" cx="44" cy="44" r="36" fill="' + c[0] + '"/>' +
      '<circle data-c="green" cx="76" cy="76" r="36" fill="' + c[1] + '"/>' +
      '<circle data-c="overlap" cx="76" cy="76" r="36" fill="' + c[2] + '" clip-path="url(#clip-sig-' + id + ')"/></svg>';
  }
  function setupSignatures() {
    $$('.view').forEach((v) => {
      const hero = v.querySelector('.page-hero .page-name') || v.querySelector('.page-hero .container');
      if (hero) hero.insertAdjacentHTML('afterbegin', sigSVG(v.dataset.view, /bg-encre|bg-vert(\s|$)/.test(v.querySelector('.page-hero').className)));
    });
  }
  const JOIN = { hero: { from: [56, 144], to: [84, 116], dur: 1500, delay: 250 }, sig: { from: [18, 102], to: [44, 76], dur: 1100, delay: 120 } };
  function joinCircles(svg, k, extra) {
    if (!svg) return;
    const q = (n) => svg.querySelector('[data-c="' + n + '"]');
    const grey = q('grey'); const green = q('green'); const overlap = q('overlap'); const clip = q('clip');
    if (!grey || !green || !overlap || !clip) return;
    const set = (a, b) => { grey.setAttribute('cx', a); clip.setAttribute('cx', a); green.setAttribute('cx', b); overlap.setAttribute('cx', b); };
    const { from, to, dur, delay } = JOIN[k];
    if (svg._join) cancelAnimationFrame(svg._join);
    if (reduceMotion) { set(to[0], to[1]); return; }
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    set(from[0], from[1]);
    let start = null;
    const frame = (ts) => {
      if (start === null) start = ts + delay + (extra || 0);
      const t = Math.min(1, Math.max(0, (ts - start) / dur));
      const e = ease(t);
      set(from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e);
      svg._join = t < 1 ? requestAnimationFrame(frame) : null;
    };
    svg._join = requestAnimationFrame(frame);
  }
  function playSignature(v) {
    const view = document.querySelector('.view[data-view="' + v + '"]');
    if (!view) return;
    if (v === 'accueil') joinCircles(view.querySelector('.hero-mark'), 'hero');
    else joinCircles(Array.from(view.querySelectorAll('.sig-mark')).find((s) => s.getClientRects().length), 'sig');
    if (v === 'espace') shakeHands(view.querySelector('.mascotte-accueil'), 350);
  }
  /* Espace adhérent (7 novembre 2026, demande d'Isabelle Eimer) : les deux biologistes se serrent la main, trois secousses
     qui s'amortissent, pendant que celui de gauche fait un signe de bienvenue ; à l'ouverture de la page et à la connexion,
     puis plus rien ne bouge. Chaque bras pivote autour de son épaule (106, 117 dans le dessin ; le bras de droite est dessiné
     en miroir, le même angle le fait descendre du même côté) et les mains serrées suivent la même hauteur. */
  function shakeHands(svg, delay) {
    if (!svg || reduceMotion) return;
    const arms = svg.querySelectorAll('.bras-poignee'); const clasp = svg.querySelector('.poignee'); const wave = svg.querySelector('.bras-salut');
    if (!arms.length || !clasp) return;
    const set = (a, w) => {
      arms.forEach((g) => g.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' 106 117)'));
      clasp.setAttribute('transform', 'translate(0 ' + (33 * Math.sin(a * Math.PI / 180)).toFixed(2) + ')');
      if (wave) wave.setAttribute('transform', 'rotate(' + w.toFixed(2) + ' 80 116)');
    };
    if (svg._shake) cancelAnimationFrame(svg._shake);
    clearTimeout(svg._shakeWait);
    const T = 1400; let t0 = 0;
    const frame = (now) => {
      if (!t0) t0 = now;
      const t = Math.min(1, (now - t0) / T);
      const damp = 1 - t * t;
      set(7 * Math.sin(t * Math.PI * 6) * damp, 9 * Math.sin(t * Math.PI * 4) * damp);
      svg._shake = t < 1 ? requestAnimationFrame(frame) : null;
    };
    svg._shakeWait = setTimeout(() => { svg._shake = requestAnimationFrame(frame); }, delay || 0);
  }

  /* ---------- Ouverture : les deux cellules se rejoignent ---------- */
  function heroIntro() {
    if (reduceMotion || current !== 'accueil') return;
    /* Le nom et la devise n'apparaissent en fondu qu'à cette première ouverture (pas à chaque retour sur l'accueil). */
    const root = document.documentElement;
    root.classList.add('hero-intro');
    setTimeout(() => root.classList.remove('hero-intro'), 2400);
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
  /* ---------- Filets animés (séparateurs) ----------
     Les deux ronds du logo entre deux traits vert anis. Un emplacement vide <div class="sep-sig"> reçoit ici son dessin ;
     setupMotion() les anime à leur arrivée à l'écran (les ronds se rejoignent, puis les traits se déploient). */
  function setupSeparators() {
    $$('.sep-sig').forEach((s, i) => {
      if (s.querySelector('.sep-mark')) return;
      s.innerHTML = '<span class="sep-line sep-l"></span>' +
        '<svg class="sep-mark" viewBox="0 0 120 120" focusable="false"><defs><clipPath id="clip-sep-' + i + '"><circle data-c="clip" cx="44" cy="44" r="36"/></clipPath></defs>' +
        '<circle data-c="grey" cx="44" cy="44" r="36" fill="#5E6266"/><circle data-c="green" cx="76" cy="76" r="36" fill="#A3BE3C"/>' +
        '<circle data-c="overlap" cx="76" cy="76" r="36" fill="#5F7A2B" clip-path="url(#clip-sep-' + i + ')"/></svg>' +
        '<span class="sep-line sep-r"></span>';
    });
  }
  function setupMotion() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-motion');
    /* Séparateur sous la devise : les deux ronds se rejoignent, puis le trait se déploie de part et d'autre.
       Juste après l'ouverture de la page, il attend la fin de l'animation des grands ronds. */
    const seps = $$('.sep-sig');
    seps.forEach((s) => {
      const mark = s.querySelector('.sep-mark');
      if (!mark) return;
      const q = (n) => mark.querySelector('[data-c="' + n + '"]');
      const f = JOIN.sig.from;
      ['grey', 'clip'].forEach((n) => q(n).setAttribute('cx', f[0]));
      ['green', 'overlap'].forEach((n) => q(n).setAttribute('cx', f[1]));
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        if (en.target.classList.contains('sep-sig')) {
          /* le premier filet de l'accueil attend la fin de l'animation des grands ronds */
          const extra = en.target === seps[0] && performance.now() < 1800 ? 1400 : 0;
          joinCircles(en.target.querySelector('.sep-mark'), 'sig', extra);
          setTimeout(() => en.target.classList.add('drawn'), 700 + extra);
          return;
        }
        en.target.classList.add('drawn');
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    $$('.pillar, .timeline, .sep-sig, .mnum').forEach((el) => io.observe(el));
  }

  /* ---------- Le site bouge avec le visiteur (demande d'Isabelle Eimer du 6 novembre 2026) ----------
     Quand on fait défiler la page, sur téléphone comme sur ordinateur :
     - les mascottes réagissent à la vitesse, comme montées sur ressort, puis reviennent en place ;
       les drapeaux flottent, les ondes du porte-voix s'allongent, la bulle se soulève ;
     - les engrenages de la Documentation tournent avec la page ;
     - les blocs (piliers, missions, bureau, URPS, avantages, cartes de veille) se posent à mesure qu'ils entrent
       dans l'écran, colonne après colonne, et redescendent si l'on remonte ;
     - le sous-menu de la page (Le syndicat, Informations légales) suit la lecture.
     Rien ne bouge à l'arrêt : la boucle s'arrête dès que la page et les ressorts sont immobiles.
     Animations réduites demandées par le visiteur : seul le sous-menu suit la lecture. */
  let lifeKick = null;
  function kickLife() { if (lifeKick) lifeKick(); }
  function setupScrollLife() {
    const live = !reduceMotion;
    if (live) document.documentElement.classList.add('js-life');
    const DRIFT = '.pillar, .charter-item, .person, .ca-region, .inst, .urps-item, .benefit, .vcard';
    const springs = new WeakMap();
    let lastY = window.scrollY; let lastT = performance.now(); let vel = 0; let raf = 0;
    const shown = (el) => el.getClientRects().length > 0;

    function actors() { return $$('.view:not([hidden]) svg.mascotte, .view:not([hidden]) .perso'); }

    function columns(el) {
      const sibs = Array.from(el.parentElement.children).filter((x) => x.matches(DRIFT));
      const lefts = Array.from(new Set(sibs.map((x) => x.offsetLeft))).sort((a, b) => a - b);
      return lefts.indexOf(el.offsetLeft);
    }
    function drift() {
      const vh = window.innerHeight;
      $$(DRIFT).forEach((el) => {
        if (!shown(el)) return;
        const r = el.getBoundingClientRect();
        const top = r.top - (el._off || 0);
        if (top > vh + 120 || r.bottom < -120) return;
        const p = Math.max(0, Math.min(1, (vh - top) / (vh * 0.42)));
        const ease = 1 - Math.pow(1 - p, 3);
        const col = el.closest('.shelf') ? 0 : Math.max(0, columns(el));
        const off = (1 - ease) * (26 + col * 14);
        el._off = off > 0.4 ? off : 0;
        el.style.transform = el._off ? 'translate3d(0,' + el._off.toFixed(1) + 'px,0)' : '';
      });
    }
    let spied = null;
    function spy() {
      const nav = $('.view:not([hidden]) .lnav');
      if (!nav) return;
      const links = $$('a[data-section]', nav);
      const line = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64) + 80 + window.innerHeight * 0.2;
      let cur = null;
      links.forEach((a) => { const sec = document.getElementById(a.dataset.section); if (sec && shown(sec) && sec.getBoundingClientRect().top <= line) cur = a; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && links.length) cur = links[links.length - 1];
      if (cur === spied) return;
      spied = cur;
      links.forEach((a) => { if (a === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      if (cur) { const box = cur.parentElement; const x = cur.offsetLeft - 12; if (x < box.scrollLeft || cur.offsetLeft + cur.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollLeft = x; }
    }
    function frame(t) {
      const y = window.scrollY;
      const dt = Math.min(0.05, Math.max(0.004, (t - lastT) / 1000));
      let inst = (y - lastY) / dt;
      if (Math.abs(y - lastY) > window.innerHeight) { inst = 0; vel = 0; } /* changement de page ou saut : pas d'élan */
      vel += (inst - vel) * Math.min(1, dt * 14);
      lastY = y; lastT = t;
      let moving = Math.abs(vel) > 6;
      if (live) {
        const target = Math.max(-1, Math.min(1, vel / 1600));
        actors().forEach((el, i) => {
          let s = springs.get(el);
          if (!s) { s = { x: 0, v: 0, k: 70 + (i % 3) * 24, d: 6.5 + (i % 2) * 2 }; springs.set(el, s); }
          const a = -s.k * (s.x - target) - s.d * s.v;
          s.v += a * dt; s.x += s.v * dt;
          if (Math.abs(s.x) > 0.003 || Math.abs(s.v) > 0.01) moving = true; else { s.x = 0; s.v = 0; }
          const x = Math.max(-1.2, Math.min(1.2, s.x));
          el.style.setProperty('--sway', x.toFixed(3));
          el.style.setProperty('--swayabs', Math.min(1, Math.abs(x)).toFixed(3));
          el.style.setProperty('--turn', (y * 0.6).toFixed(1));
        });
        drift();
      }
      spy();
      if (moving) raf = requestAnimationFrame(frame); else { raf = 0; vel = 0; }
    }
    lifeKick = () => { if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); } };
    window.addEventListener('scroll', lifeKick, { passive: true });
    window.addEventListener('resize', lifeKick);
  }

  /* ---------- Liseuse de documents ---------- */
  let downloadsApi = null;
  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('downloads').then((d) => { downloadsApi = d; if (readerDoc) setSaveUi(); }).catch(() => {});
  }
  let readerDoc = null; let readerReturn = null; let readerIO = null; let saving = false;
  /* Mode PDF : pdf.js est chargé à la première ouverture, sans « worker » séparé (le cadre protégé de claude.ai peut les
     bloquer) ; chaque page est dessinée quand elle approche de l'écran, puis effacée quand elle s'en éloigne (mémoire des tablettes). */
  const PDFJS = 'assets/pdfjs/';
  let pdfjsReady = null; let readerPdf = null; let readerTask = null; let drawIO = null;
  const loadScript = (src) => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error(src)); document.head.appendChild(s); });
  const loadPdfjs = () => pdfjsReady || (pdfjsReady = loadScript(PDFJS + 'pdf.worker.min.js').then(() => loadScript(PDFJS + 'pdf.min.js')).then(() => {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(PDFJS + 'pdf.worker.min.js', document.baseURI).href;
    return window.pdfjsLib;
  }).catch((err) => { pdfjsReady = null; throw err; }));
  const freePage = (fig) => { const cv = fig.querySelector('canvas'); if (cv) { cv.width = 0; cv.height = 0; } fig.classList.remove('is-drawn'); fig._drawn = false; };
  function drawPage(fig) {
    fig._want = true;
    if (fig._busy || fig._drawn || !readerPdf) return;
    const pdf = readerPdf; fig._busy = true;
    pdf.getPage(+fig.dataset.n).then((pg) => {
      if (pdf !== readerPdf || !fig._want) return null;
      const base = pg.getViewport({ scale: 1 });
      fig.style.aspectRatio = base.width + ' / ' + base.height;
      const px = Math.min((fig.clientWidth || 880) * Math.min(window.devicePixelRatio || 1, 2), 1800);
      const vp = pg.getViewport({ scale: px / base.width });
      const cv = fig.querySelector('canvas');
      cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
      fig._task = pg.render({ canvasContext: cv.getContext('2d'), viewport: vp });
      return fig._task.promise.then(() => { fig._drawn = true; fig.classList.add('is-drawn'); });
    }).catch(() => { freePage(fig); }).then(() => { fig._busy = false; fig._task = null; if (!fig._want) freePage(fig); });
  }
  function hidePage(fig) { fig._want = false; if (fig._task) fig._task.cancel(); else if (!fig._busy) freePage(fig); }
  function openPdf(url, d, pages) {
    pages.innerHTML = Array.from({ length: d.pages }, (_, i) =>
      '<figure class="reader-page is-pdf" data-n="' + (i + 1) + '" style="aspect-ratio:' + d.w + ' / ' + d.h + '" role="img" aria-label="Page ' + (i + 1) + ' sur ' + d.pages + '"><canvas></canvas></figure>').join('');
    $('#reader-count').textContent = 'Ouverture du document…';
    const mine = url;
    loadPdfjs().then((lib) => {
      if (readerDoc !== mine) return null;
      readerTask = lib.getDocument({ url: new URL(url, document.baseURI).href, isEvalSupported: false });
      return readerTask.promise;
    }).then((pdf) => {
      if (!pdf) return;
      if (readerDoc !== mine) { pdf.destroy(); return; }
      readerPdf = pdf;
      $('#reader-count').textContent = d.pages + ' pages';
      if ('IntersectionObserver' in window) {
        drawIO = new IntersectionObserver((entries) => entries.forEach((en) => (en.isIntersecting ? drawPage(en.target) : hidePage(en.target))),
          { root: pages, rootMargin: '120% 0px', threshold: 0 });
        $$('.reader-page', pages).forEach((f) => drawIO.observe(f));
      } else $$('.reader-page', pages).slice(0, 20).forEach(drawPage);
    }).catch(() => {
      if (readerDoc !== mine) return;
      $('#reader-count').textContent = '';
      pages.innerHTML = '<p class="reader-error">Ce document ne peut pas s’afficher ici.' + ($('#reader-save').hidden && $('#reader-link').hidden ? '' : ' Vous pouvez l’enregistrer avec le bouton « Enregistrer le PDF ».') + '</p>';
    });
  }
  /* « Enregistrer le PDF » : par claude.ai si sa fonction de téléchargement répond ; sinon un lien
     ordinaire, seulement hors d'un cadre (un cadre protégé bloquerait ce lien sans rien dire). */
  function setSaveUi() {
    const framed = window.top !== window.self;
    $('#reader-save').hidden = !downloadsApi;
    $('#reader-link').hidden = !!downloadsApi || framed;
  }
  function openReader(url, opener) {
    const d = DOCS[url];
    if (!d) return;
    readerDoc = url; readerReturn = opener || document.activeElement;
    $('#reader-title').textContent = d.title;
    $('#reader-count').textContent = d.pages + ' pages';
    const pages = $('#reader-pages');
    const link = $('#reader-link');
    link.setAttribute('href', url); link.setAttribute('download', d.file);
    setSaveUi();
    if (d.pdf) openPdf(url, d, pages);
    else pages.innerHTML = Array.from({ length: d.pages }, (_, i) =>
      '<figure class="reader-page" data-n="' + (i + 1) + '"><img src="' + esc(d.img(i + 1)) + '" width="' + d.w + '" height="' + d.h + '" alt="Page ' + (i + 1) + ' sur ' + d.pages + '"' + (i > 1 ? ' loading="lazy"' : '') + '></figure>').join('');
    pages.scrollTop = 0;
    $('#reader').hidden = false;
    document.documentElement.style.overflow = 'hidden';
    if (readerIO) readerIO.disconnect();
    if ('IntersectionObserver' in window) {
      readerIO = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) $('#reader-count').textContent = 'Page ' + en.target.dataset.n + ' sur ' + d.pages; });
      }, { root: pages, rootMargin: '-45% 0px -45% 0px', threshold: 0 });
      $$('.reader-page', pages).forEach((f) => readerIO.observe(f));
    }
    /* Focus sur les pages : Espace, flèches et Page suivante font défiler ; Échap ferme. */
    $('#reader-pages').focus({ preventScroll: true });
  }
  function closeReader() {
    if ($('#reader').hidden) return;
    $('#reader').hidden = true;
    document.documentElement.style.overflow = '';
    if (readerIO) { readerIO.disconnect(); readerIO = null; }
    if (drawIO) { drawIO.disconnect(); drawIO = null; }
    if (readerTask) { readerTask.destroy(); readerTask = null; }
    readerPdf = null;
    $('#reader-pages').innerHTML = '';
    if (readerReturn && typeof readerReturn.focus === 'function') readerReturn.focus();
    readerDoc = null; readerReturn = null;
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-doc]');
    if (!a || !DOCS[a.dataset.doc]) return;
    e.preventDefault();
    openReader(a.dataset.doc, a);
  });
  $('#reader-close').addEventListener('click', closeReader);
  /* Changer de page (lien, bouton Précédent du navigateur) referme la liseuse. */
  window.addEventListener('hashchange', closeReader);
  /* Le focus reste dans la liseuse tant qu'elle est ouverte. */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || $('#reader').hidden) return;
    const f = $$('#reader button:not([hidden]), #reader a:not([hidden]), #reader-pages').filter((x) => !x.hidden);
    if (!f.length) return;
    const first = f[0]; const last = f[f.length - 1];
    if (!$('#reader').contains(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  $('#reader-save').addEventListener('click', async () => {
    const d = DOCS[readerDoc]; const btn = $('#reader-save');
    if (!d || !downloadsApi || saving) return;
    saving = true; btn.setAttribute('aria-busy', 'true');
    try {
      const res = await fetch(readerDoc);
      if (!res.ok) throw { code: 'fetch' };
      await downloadsApi.save({ filename: d.file, data: await res.blob() });
    } catch (err) {
      const code = err && err.code;
      if (code === 'declined') { /* le visiteur a refusé : rien à signaler */ }
      else if (code === 'rate_limited') showToast('Un enregistrement est déjà en cours. Réessayez dans un instant.', null, null);
      else { showToast('L’enregistrement du PDF n’est pas possible ici. Le document reste lisible dans cette page.', null, null); $('#reader-close').focus(); btn.hidden = true; }
    }
    saving = false; btn.removeAttribute('aria-busy');
  });

  /* ---------- Espace adhérent : session de démonstration et rubriques ----------
     La veille réglementaire est réservée aux adhérents (demande d'Isabelle Eimer du 6 novembre 2026).
     Démonstration : la connexion accepte tout identifiant et reste valable jusqu'à la fermeture de l'onglet. */
  const SESSION_KEY = 'slbc-maquette-session';
  let member = null; let wantPanel = null;
  try { member = sessionStorage.getItem(SESSION_KEY) || null; } catch (e) { member = null; }
  const PANELS = [['veille', 'Veille réglementaire'], ['ecrire', 'Écrire au bureau'], ['lettre', 'Lettre d’information'], ['publier', 'Publier']];
  const panelOf = (el) => { const p = el.closest('.ea-panel'); return p ? p.id.replace('ea-', '') : 'veille'; };
  /* Ce à quoi les adhérents ont accès (7 novembre 2026, demande d'Isabelle Eimer). Les mêmes « portes » présentent l'espace
     avant la connexion (liens : après la connexion, on arrive sur la bonne rubrique) et servent de menu une fois connecté.
     Les portes 2 et 3 ouvrent « Écrire au bureau » avec l'objet déjà choisi. */
  const ACCES = [
    { t: 'La veille réglementaire', d: 'Chaque lundi, le Journal officiel, l’Assemblée nationale et le Sénat, analysés pour votre laboratoire.', panel: 'veille', cta: 'Lire la veille réglementaire' },
    { t: 'Partager votre expérience dans une commission', d: 'Vous voulez partager votre expérience dans une commission ? Dites-le nous.', panel: 'ecrire', sujet: 'commission', cta: 'Proposer ma participation' },
    { t: 'Une suggestion, une idée, une question', d: 'Vous avez une suggestion à faire, une idée, une question ? Contactez-nous.', panel: 'ecrire', sujet: 'suggestion', cta: 'Écrire au bureau' },
    { t: 'La lettre d’information', d: 'La veille et les nouvelles publications du SLBC, par e‑mail.', panel: 'lettre', cta: 'M’inscrire' }
  ];
  const PORTE_BUREAU = { t: 'Publier sur le site', d: 'Outils du bureau : communiqués, veille, actualités, messages des adhérents. Démonstration ouverte à tout adhérent connecté.', panel: 'publier' };
  const SUJETS = { commission: 'Partager mon expérience dans une commission', suggestion: 'Une suggestion ou une idée', question: 'Une question' };
  let wantSujet = null; let curSujet = 'commission'; let curPanel = 'veille';
  const porteInner = (a) => '<span class="porte-t">' + esc(a.t) + '</span><span class="porte-d">' + esc(a.d) + '</span>' + (a.cta ? '<span class="porte-cta more">' + esc(a.cta) + '</span>' : '');
  const porteOn = (a) => a.panel === curPanel && (curPanel !== 'ecrire' || (a.sujet === 'commission') === (curSujet === 'commission'));
  function renderPortes() {
    $('#ea-tabs').innerHTML = '<ul class="portes">' + ACCES.map((a, k) => '<li><button type="button" class="porte s' + (k % 2) + '" data-porte="' + k + '" aria-pressed="' + porteOn(a) + '">' + porteInner(a) + '</button></li>').join('') + '</ul>' +
      '<button type="button" class="porte porte-bureau" data-porte="bureau" aria-pressed="' + (curPanel === 'publier') + '">' + porteInner(PORTE_BUREAU) + '</button>';
  }
  function setSujet(s) {
    curSujet = SUJETS[s] ? s : 'commission';
    $$('#ecrire-form input[name="ecrire-sujet"]').forEach((r) => { r.checked = r.value === curSujet; });
    $('#ecrire-inst-wrap').hidden = curSujet !== 'commission';
  }
  function showPanel(name, sujet) {
    if (!PANELS.some((p) => p[0] === name)) name = 'veille';
    curPanel = name;
    if (name === 'ecrire' && sujet) setSujet(sujet);
    renderPortes();
    PANELS.forEach((p) => { $('#ea-' + p[0]).hidden = p[0] !== name; });
    if (name === 'ecrire' && member) {
      if (!$('#ecrire-email').value) $('#ecrire-email').value = member;
      renderMesMessages();
    }
    if (name === 'lettre' && member) {
      if (!$('#sub-email').value) $('#sub-email').value = member;
      const inscrit = subscribers.includes(member.toLowerCase());
      if (inscrit) { $('#sub-ok').textContent = 'Votre adresse ' + member + ' reçoit déjà la lettre d’information.'; $('#sub-ok').hidden = false; }
    }
  }
  function applyMember() {
    const on = !!member;
    document.documentElement.classList.toggle('is-member', on);
    $('#login').hidden = on; $('#member').hidden = !on;
    $('#member-who').textContent = on ? member : '';
    $$('[data-guest]').forEach((el) => { el.hidden = on; });
    $$('[data-member]').forEach((el) => { el.hidden = !on; });
    if (on) requestAnimationFrame(updateShelf);
    INDEX = buildIndex();
  }
  function setMember(email) {
    member = email || null;
    try { if (member) sessionStorage.setItem(SESSION_KEY, member); else sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* stockage indisponible */ }
    applyMember();
  }

  /* ---------- Espace adhérent : portes et « Écrire au bureau » (7 novembre 2026, demande d'Isabelle Eimer) ---------- */
  /* Avant la connexion : chaque porte mène à la carte de connexion, puis, une fois connecté, à la bonne rubrique. */
  $('#acces-invite').innerHTML = ACCES.map((a, k) => '<li><a class="porte s' + (k % 2) + '" href="#espace" data-porte="' + k + '">' + porteInner(a) + '</a></li>').join('');
  $('#acces-invite').addEventListener('click', (e) => {
    const l = e.target.closest('[data-porte]');
    if (!l) return;
    e.preventDefault();
    const a = ACCES[+l.dataset.porte];
    if (member) { showPanel(a.panel, a.sujet); return; }
    wantPanel = a.panel; wantSujet = a.sujet || null;
    $('#login-intent').textContent = 'Après la connexion, vous arriverez sur « ' + a.t + ' ».';
    $('#login-intent').hidden = false;
    $('#login-form').scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    $('#login-email').focus({ preventScroll: true });
  });
  /* Une fois connecté : les portes servent de menu ; sur un petit écran, la rubrique choisie remonte sous les portes. */
  $('#ea-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-porte]');
    if (!b) return;
    const a = b.dataset.porte === 'bureau' ? PORTE_BUREAU : ACCES[+b.dataset.porte];
    showPanel(a.panel, a.sujet);
    const on = $('#ea-tabs [aria-pressed="true"]'); if (on) on.focus({ preventScroll: true });
    const top = $('#ea-' + a.panel).getBoundingClientRect().top;
    if (top > window.innerHeight * 0.6) window.scrollTo({ top: window.scrollY + top - 96, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  /* Formulaire : objet, commission (liste des instances du site), nom, e-mail, message. Démonstration : le message est gardé
     dans ce navigateur (clé slbc-maquette-messages) et s'affiche côté bureau, rubrique « Publier ». Aucun e-mail n'est envoyé. */
  const MSG_KEY = 'slbc-maquette-messages';
  let messages = loadList(MSG_KEY).filter((m) => m && typeof m.msg === 'string' && typeof m.date === 'string' && typeof m.email === 'string');
  $('#ecrire-inst').innerHTML = '<option value="">Je ne sais pas encore</option>' + INSTANCES.map((i) => { const l = i.n + (i.a ? ' (' + i.a + ')' : ''); return '<option value="' + esc(l) + '">' + esc(l) + '</option>'; }).join('');
  setSujet('commission');
  $$('#ecrire-form input[name="ecrire-sujet"]').forEach((r) => r.addEventListener('change', () => { setSujet(r.value); renderPortes(); }));
  const msgItem = (m, bureau) => '<li class="msg"><p class="msg-meta"><span class="msg-sujet">' + esc(SUJETS[m.sujet] || 'Message') + '</span><time datetime="' + esc(m.date) + '">' + esc(longDate(m.date.slice(0, 10))) + '</time></p>' +
    (m.inst ? '<p class="msg-inst">' + esc(m.inst) + '</p>' : '') +
    (bureau ? '<p class="msg-from">' + esc(m.nom) + ', <a href="mailto:' + esc(m.email) + '?subject=' + encodeURIComponent('Votre message au SLBC') + '">' + esc(m.email) + '</a></p>' : '') +
    '<p class="msg-text">' + esc(m.msg) + '</p></li>';
  function renderMessages() {
    $('#msg-count').textContent = '(' + messages.length + ')';
    $('#msg-list').innerHTML = messages.length ? messages.map((m) => msgItem(m, true)).join('') : '<li class="nl-empty">Aucun message pour l’instant.</li>';
    $('#msg-clear').hidden = !messages.length;
  }
  function renderMesMessages() {
    const mine = member ? messages.filter((m) => m.email.toLowerCase() === member.toLowerCase()) : [];
    $('#ecrire-mes-messages').innerHTML = mine.length ? mine.map((m) => msgItem(m, false)).join('') : '<li class="nl-empty">Aucun message envoyé pour l’instant.</li>';
  }
  $('#ecrire-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = [['ecrire-nom', (v) => (v ? '' : 'Indiquez votre nom.')],
      ['ecrire-email', (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Indiquez une adresse e-mail valide.')],
      ['ecrire-msg', (v) => (v ? '' : 'Écrivez votre message.')]];
    let first = null;
    fields.forEach(([id, check]) => {
      const el = $('#' + id); const err = $('#' + id + '-err'); const msg = check(el.value.trim());
      err.textContent = msg; err.hidden = !msg;
      if (msg) { el.setAttribute('aria-invalid', 'true'); if (!first) first = el; } else el.removeAttribute('aria-invalid');
    });
    if (first) { first.focus(); return; }
    messages.unshift({ date: new Date().toISOString(), sujet: curSujet, inst: curSujet === 'commission' ? $('#ecrire-inst').value : '',
      nom: $('#ecrire-nom').value.trim(), email: $('#ecrire-email').value.trim(), msg: $('#ecrire-msg').value.trim() });
    saveList(MSG_KEY, messages);
    renderMessages(); renderMesMessages();
    $('#ecrire-msg').value = '';
    $('#ecrire-ok').textContent = 'Merci, votre message est transmis au bureau.';
    $('#ecrire-ok').hidden = false; $('#ecrire-ok').focus();
  });
  $('#msg-clear').addEventListener('click', () => {
    messages = []; saveList(MSG_KEY, messages); renderMessages(); renderMesMessages();
    showToast('Messages de démonstration effacés.', null, null);
  });
  renderMessages();

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
  setupSeparators();
  setupMotion();
  setupScrollLife();
  setupSignatures();
  showPanel('veille');
  applyMember();
  route();
  heroIntro();
})();
