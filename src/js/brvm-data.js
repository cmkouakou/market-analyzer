/**
 * =============================================================
 *  Fichier    : brvm-data.js
 *  Projet     : Market Analyser
 *  Description: Données simulées pour les 9 entreprises cotées à la BRVM
 *               Toutes les valeurs financières sont en millions de FCFA
 *               sauf indication contraire
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: (aucune)
 * =============================================================
 */

'use strict';

// ==================== ÉTIQUETTES COMMUNES ====================
const ANNEES_10 = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
const MOIS_12 = ['Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];

// ==================== DONNÉES DES ENTREPRISES BRVM ====================
const BRVM_COMPANIES = {

  // ------------------------------------------------------------------
  // SONATEL CI — Télécommunications
  // ------------------------------------------------------------------
  SNTS: {
    ticker: 'SNTS',
    name: 'Sonatel CI',
    fullName: 'Société Nationale des Télécommunications du Sénégal',
    sector: 'Télécommunications',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Sénégal/Côte d\'Ivoire',
    description: 'Leader des télécommunications en Afrique de l\'Ouest, présent dans 5 pays',

    // Données boursières (FCFA)
    cours: 19500,
    shares: 100000000,
    dividende: 800,
    per: 8.0,
    pbr: 4.2,
    rendement: 4.1,
    capitalisation: 1950000, // millions FCFA

    // Compte de résultat sur 10 ans (millions FCFA)
    ca:  [615000, 635000, 668000, 690000, 712000, 739000, 768000, 795000, 815000, 843000],
    rex: [210000, 225000, 238000, 248000, 262000, 271000, 280000, 295000, 308000, 318000],
    rn:  [155000, 165000, 178000, 188000, 198000, 208000, 218000, 228000, 237000, 245000],

    // Bilan simplifié (millions FCFA)
    actif_total: [1100000, 1150000, 1210000, 1280000, 1350000, 1390000, 1440000, 1520000, 1580000, 1640000],
    capitaux_propres: [420000, 445000, 468000, 495000, 520000, 540000, 558000, 578000, 595000, 612000],
    dettes_financieres: [280000, 270000, 265000, 258000, 245000, 240000, 235000, 228000, 220000, 215000],

    // Ratios
    roe: [36.9, 37.1, 38.0, 38.0, 38.1, 38.5, 39.1, 39.4, 39.8, 40.0],
    roa: [14.1, 14.3, 14.7, 14.7, 14.7, 15.0, 15.1, 15.0, 15.0, 14.9],
    marge_nette: [25.2, 26.0, 26.6, 27.2, 27.8, 28.1, 28.4, 28.7, 29.1, 29.1],

    // Cours boursier sur 12 mois (FCFA)
    cours_historique: [18200, 18500, 18800, 19000, 19200, 19350, 19100, 19400, 19600, 19750, 19800, 19500],

    // Pairs sectoriels
    peers: [
      { name: 'Sonatel CI', ticker: 'SNTS', roe: 40.0, per: 8.0, rendement: 4.1, croissance: 3.7 },
      { name: 'Orange CI', ticker: 'ORCI', roe: 28.5, per: 10.2, rendement: 3.8, croissance: 5.2 },
      { name: 'Ecobank CI', ticker: 'ETIT', roe: 15.2, per: 6.8, rendement: 2.5, croissance: 7.8 }
    ],

    // Actualités Bottom-Up
    news: [
      { titre: 'Sonatel annonce une hausse de 12% de son résultat net au T4 2023', impact: 'positif', date: '2024-02-15', source: 'Agence Ecofin' },
      { titre: 'Extension du réseau 5G prévue en Côte d\'Ivoire pour 2024', impact: 'positif', date: '2024-01-20', source: 'BRVM Info' },
      { titre: 'Augmentation des frais de régulation télécom en zone UEMOA', impact: 'negatif', date: '2024-01-08', source: 'ARTCI' },
      { titre: 'Partenariat stratégique avec Orange pour le très haut débit', impact: 'positif', date: '2023-12-10', source: 'Société Générale CI' },
      { titre: 'Légère pression sur les marges due à la concurrence tarifaire', impact: 'neutre', date: '2023-11-22', source: 'Rapport interne' }
    ],

    // Top-Down
    topdown: {
      economie: 'Croissance du PIB UEMOA à +5.8% en 2023, portée par la Côte d\'Ivoire et le Sénégal',
      economie_pts: 5,
      economie_note: 'positive',
      secteur: 'Boom du numérique en Afrique de l\'Ouest, pénétration mobile en hausse constante',
      secteur_pts: 5,
      secteur_note: 'positive',
      entreprise: 'Sonatel bien positionnée pour capter la croissance grâce à sa couverture nationale',
      entreprise_pts: 4,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // SODECI — Eau / Distribution
  // ------------------------------------------------------------------
  SDCI: {
    ticker: 'SDCI',
    name: 'SODECI',
    fullName: 'Société de Distribution d\'Eau de la Côte d\'Ivoire',
    sector: 'Eau & Utilités',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Distributeur d\'eau potable en Côte d\'Ivoire, contrat de concession État-CI',

    cours: 4950,
    shares: 29355000,
    dividende: 220,
    per: 11.5,
    pbr: 1.8,
    rendement: 4.4,
    capitalisation: 145207, // millions FCFA

    ca:  [78000, 82000, 87000, 91000, 96000, 101000, 107000, 112000, 118000, 124000],
    rex: [12500, 13200, 14100, 14800, 15600, 16200, 17100, 17900, 18700, 19600],
    rn:  [ 8200,  8800,  9400,  9900, 10500, 11100, 11800, 12400, 13000, 13600],

    actif_total: [95000, 100000, 106000, 112000, 118000, 124000, 131000, 138000, 145000, 152000],
    capitaux_propres: [52000, 54000, 56000, 58000, 61000, 64000, 67000, 70000, 73000, 77000],
    dettes_financieres: [18000, 17000, 17000, 16500, 16000, 15500, 15000, 14500, 14000, 13500],

    roe: [15.8, 16.3, 16.8, 17.1, 17.2, 17.3, 17.6, 17.7, 17.8, 17.7],
    roa: [ 8.6,  8.8,  8.9,  8.8,  8.9,  9.0,  9.0,  9.0,  9.0,  8.9],
    marge_nette: [10.5, 10.7, 10.8, 10.9, 10.9, 11.0, 11.0, 11.1, 11.0, 11.0],

    cours_historique: [4600, 4650, 4700, 4750, 4800, 4850, 4900, 4880, 4920, 4950, 4970, 4950],

    peers: [
      { name: 'SODECI', ticker: 'SDCI', roe: 17.7, per: 11.5, rendement: 4.4, croissance: 5.0 },
      { name: 'CIE', ticker: 'CIEC', roe: 22.1, per: 9.8, rendement: 3.6, croissance: 4.5 },
      { name: 'CIPREL', ticker: 'BIDC', roe: 13.5, per: 13.2, rendement: 3.1, croissance: 4.0 }
    ],

    news: [
      { titre: 'SODECI remporte le renouvellement de son contrat de concession pour 15 ans', impact: 'positif', date: '2024-01-30', source: 'Journal Officiel CI' },
      { titre: 'Plan d\'investissement de 45 Mrd FCFA pour l\'extension du réseau 2024-2026', impact: 'positif', date: '2023-12-15', source: 'SODECI Rapport' },
      { titre: 'Tarifs de l\'eau stables malgré l\'inflation des coûts opérationnels', impact: 'neutre', date: '2023-11-10', source: 'ONEP CI' }
    ],

    topdown: {
      economie: 'Urbanisation accélérée en Côte d\'Ivoire, besoin croissant en eau potable',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Secteur des utilités stable et défensif, peu sensible aux cycles économiques',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'Position monopolistique dans la distribution d\'eau, visibilité des flux garantie',
      entreprise_pts: 5,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // CIE — Énergie / Électricité
  // ------------------------------------------------------------------
  CIEC: {
    ticker: 'CIEC',
    name: 'CIE',
    fullName: 'Compagnie Ivoirienne d\'Électricité',
    sector: 'Énergie & Électricité',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Gestionnaire du réseau de distribution électrique en Côte d\'Ivoire',

    cours: 2750,
    shares: 75000000,
    dividende: 99,
    per: 9.8,
    pbr: 2.1,
    rendement: 3.6,
    capitalisation: 206250, // millions FCFA

    ca:  [155000, 162000, 171000, 179000, 188000, 197000, 207000, 218000, 229000, 241000],
    rex: [25000, 26800, 28500, 30100, 31800, 33500, 35400, 37400, 39500, 41700],
    rn:  [16000, 17200, 18500, 19500, 20700, 21900, 23200, 24600, 26100, 27600],

    actif_total: [220000, 230000, 242000, 255000, 268000, 282000, 297000, 313000, 330000, 348000],
    capitaux_propres: [88000, 93000, 98000, 104000, 110000, 117000, 124000, 132000, 140000, 148000],
    dettes_financieres: [65000, 62000, 60000, 58000, 55000, 53000, 51000, 49000, 47000, 44000],

    roe: [18.2, 18.5, 18.9, 18.8, 18.8, 18.7, 18.7, 18.6, 18.6, 18.6],
    roa: [ 7.3,  7.5,  7.6,  7.6,  7.7,  7.8,  7.8,  7.9,  7.9,  7.9],
    marge_nette: [10.3, 10.6, 10.8, 10.9, 11.0, 11.1, 11.2, 11.3, 11.4, 11.5],

    cours_historique: [2540, 2580, 2620, 2660, 2700, 2720, 2710, 2730, 2750, 2760, 2770, 2750],

    peers: [
      { name: 'CIE', ticker: 'CIEC', roe: 18.6, per: 9.8, rendement: 3.6, croissance: 4.5 },
      { name: 'SODECI', ticker: 'SDCI', roe: 17.7, per: 11.5, rendement: 4.4, croissance: 5.0 },
      { name: 'CIPREL', ticker: 'BIDC', roe: 13.5, per: 13.2, rendement: 3.1, croissance: 4.0 }
    ],

    news: [
      { titre: 'CIE investit 80 Mrd FCFA dans la modernisation du réseau électrique', impact: 'positif', date: '2024-02-01', source: 'Rapport Annuel CIE' },
      { titre: 'Hausse de la demande électrique de 7% au T4 2023 portée par l\'industrie', impact: 'positif', date: '2024-01-18', source: 'Ministère Énergie CI' },
      { titre: 'Tensions sur le barème tarifaire, négociations en cours avec l\'État', impact: 'negatif', date: '2023-12-05', source: 'Chambre Commerce Abidjan' }
    ],

    topdown: {
      economie: 'Croissance industrielle soutenue en Côte d\'Ivoire nécessite plus d\'énergie',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Transition énergétique en Afrique, développement des énergies renouvelables',
      secteur_pts: 3,
      secteur_note: 'neutre',
      entreprise: 'Contrat d\'État sécurisé, mais dépendance aux négociations tarifaires',
      entreprise_pts: 4,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // BOA CI — Banque
  // ------------------------------------------------------------------
  BOACI: {
    ticker: 'BOACI',
    name: 'BOA CI',
    fullName: 'Bank Of Africa Côte d\'Ivoire',
    sector: 'Banque',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Filiale ivoirienne du groupe Bank Of Africa, services bancaires universels',

    cours: 6800,
    shares: 18000000,
    dividende: 220,
    per: 7.2,
    pbr: 1.4,
    rendement: 3.2,
    capitalisation: 122400, // millions FCFA

    ca:  [45000, 48000, 52000, 56000, 60000, 65000, 70000, 75000, 81000, 87000],
    rex: [12000, 13000, 14200, 15400, 16700, 18100, 19600, 21200, 22900, 24800],
    rn:  [ 7500,  8100,  8800,  9500, 10300, 11200, 12100, 13100, 14100, 15200],

    actif_total: [680000, 720000, 768000, 820000, 876000, 936000, 1000000, 1070000, 1145000, 1225000],
    capitaux_propres: [72000, 76000, 80000, 85000, 91000, 97000, 104000, 111000, 119000, 128000],
    dettes_financieres: [580000, 614000, 655000, 699000, 745000, 797000, 853000, 912000, 975000, 1040000],

    roe: [10.4, 10.7, 11.0, 11.2, 11.3, 11.5, 11.6, 11.8, 11.8, 11.9],
    roa: [ 1.1,  1.1,  1.1,  1.2,  1.2,  1.2,  1.2,  1.2,  1.2,  1.2],
    marge_nette: [16.7, 16.9, 16.9, 17.0, 17.2, 17.2, 17.3, 17.5, 17.4, 17.5],

    cours_historique: [6200, 6300, 6400, 6500, 6550, 6600, 6650, 6700, 6750, 6800, 6820, 6800],

    peers: [
      { name: 'BOA CI', ticker: 'BOACI', roe: 11.9, per: 7.2, rendement: 3.2, croissance: 7.6 },
      { name: 'Ecobank CI', ticker: 'ETIT', roe: 15.2, per: 6.8, rendement: 2.5, croissance: 7.8 },
      { name: 'NSIA Banque', ticker: 'NSAB', roe: 13.5, per: 8.5, rendement: 2.8, croissance: 6.5 },
      { name: 'SIB', ticker: 'SIBC', roe: 18.2, per: 7.9, rendement: 3.5, croissance: 8.2 }
    ],

    news: [
      { titre: 'BOA CI affiche une croissance de ses crédits à l\'économie de +15% en 2023', impact: 'positif', date: '2024-02-10', source: 'BCEAO' },
      { titre: 'Renforcement des fonds propres via une augmentation de capital', impact: 'positif', date: '2024-01-25', source: 'BRVM Communiqué' },
      { titre: 'Hausse du taux directeur BCEAO : pression sur les marges bancaires', impact: 'negatif', date: '2023-12-20', source: 'BCEAO Communiqué' },
      { titre: 'Expansion du réseau d\'agences dans l\'intérieur du pays', impact: 'positif', date: '2023-11-30', source: 'Rapport BOA' }
    ],

    topdown: {
      economie: 'Croissance économique UEMOA robuste, besoin de financement élevé',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Secteur bancaire en expansion, taux de bancarisation en hausse constante',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'BOA bien implantée mais concurrence accrue des néobanques et MTN Money',
      entreprise_pts: 3,
      entreprise_note: 'neutre'
    }
  },

  // ------------------------------------------------------------------
  // ECOBANK CI — Banque
  // ------------------------------------------------------------------
  ETIT: {
    ticker: 'ETIT',
    name: 'Ecobank CI',
    fullName: 'Ecobank Côte d\'Ivoire (filiale de Ecobank Transnational)',
    sector: 'Banque',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Banque panafricaine leader, présente dans 33 pays africains',

    cours: 5400,
    shares: 24000000,
    dividende: 135,
    per: 6.8,
    pbr: 1.1,
    rendement: 2.5,
    capitalisation: 129600, // millions FCFA

    ca:  [58000, 62000, 67000, 72000, 78000, 84000, 91000, 98000, 106000, 114000],
    rex: [13000, 14100, 15400, 16700, 18200, 19800, 21500, 23400, 25400, 27600],
    rn:  [ 8000,  8700,  9500, 10300, 11200, 12200, 13200, 14400, 15600, 16900],

    actif_total: [820000, 870000, 928000, 990000, 1058000, 1130000, 1208000, 1292000, 1382000, 1478000],
    capitaux_propres: [82000, 87000, 93000, 100000, 107000, 115000, 124000, 133000, 143000, 154000],
    dettes_financieres: [700000, 742000, 793000, 847000, 905000, 967000, 1034000, 1106000, 1182000, 1264000],

    roe: [ 9.8, 10.0, 10.2, 10.3, 10.5, 10.6, 10.6, 10.8, 10.9, 11.0],
    roa: [ 1.0,  1.0,  1.0,  1.0,  1.1,  1.1,  1.1,  1.1,  1.1,  1.1],
    marge_nette: [13.8, 14.0, 14.2, 14.3, 14.4, 14.5, 14.5, 14.7, 14.7, 14.8],

    cours_historique: [4900, 5000, 5100, 5150, 5200, 5250, 5300, 5320, 5360, 5400, 5420, 5400],

    peers: [
      { name: 'Ecobank CI', ticker: 'ETIT', roe: 11.0, per: 6.8, rendement: 2.5, croissance: 7.8 },
      { name: 'BOA CI', ticker: 'BOACI', roe: 11.9, per: 7.2, rendement: 3.2, croissance: 7.6 },
      { name: 'NSIA Banque', ticker: 'NSAB', roe: 13.5, per: 8.5, rendement: 2.8, croissance: 6.5 },
      { name: 'SIB', ticker: 'SIBC', roe: 18.2, per: 7.9, rendement: 3.5, croissance: 8.2 }
    ],

    news: [
      { titre: 'Ecobank CI: bénéfice net en hausse de 8.3% grâce aux activités de marché', impact: 'positif', date: '2024-02-05', source: 'Ecobank Rapport' },
      { titre: 'Lancement d\'Ecobank Mobile 3.0 avec fonctions d\'épargne digitale', impact: 'positif', date: '2024-01-15', source: 'Fintech Africa' },
      { titre: 'Provisions pour créances douteuses en légère hausse au T3 2023', impact: 'negatif', date: '2023-11-15', source: 'BRVM Communiqué' }
    ],

    topdown: {
      economie: 'Dynamisme économique régional UEMOA favorable au secteur bancaire',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Transformation digitale du secteur, Mobile Money en forte croissance',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'Réseau panafricain unique, mais rentabilité sous pression dans certains marchés',
      entreprise_pts: 3,
      entreprise_note: 'neutre'
    }
  },

  // ------------------------------------------------------------------
  // ORANGE CI — Télécommunications
  // ------------------------------------------------------------------
  ORCI: {
    ticker: 'ORCI',
    name: 'Orange CI',
    fullName: 'Orange Côte d\'Ivoire S.A.',
    sector: 'Télécommunications',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Filiale d\'Orange en Côte d\'Ivoire, téléphonie mobile et internet',

    cours: 12800,
    shares: 45000000,
    dividende: 486,
    per: 10.2,
    pbr: 3.1,
    rendement: 3.8,
    capitalisation: 576000, // millions FCFA

    ca:  [312000, 330000, 352000, 375000, 400000, 428000, 460000, 495000, 532000, 573000],
    rex: [ 78000,  83000,  89000,  96000, 104000, 112000, 121000, 131000, 141000, 152000],
    rn:  [ 51000,  55000,  59000,  64000,  69000,  75000,  81000,  88000,  95000, 103000],

    actif_total: [480000, 508000, 540000, 576000, 614000, 655000, 700000, 748000, 799000, 854000],
    capitaux_propres: [168000, 178000, 190000, 204000, 219000, 236000, 254000, 274000, 295000, 318000],
    dettes_financieres: [92000, 88000, 85000, 82000, 78000, 75000, 72000, 68000, 65000, 62000],

    roe: [30.4, 30.9, 31.1, 31.4, 31.5, 31.8, 31.9, 32.1, 32.2, 32.4],
    roa: [10.6, 10.8, 10.9, 11.1, 11.2, 11.5, 11.6, 11.8, 11.9, 12.1],
    marge_nette: [16.3, 16.7, 16.8, 17.1, 17.3, 17.5, 17.6, 17.8, 17.9, 18.0],

    cours_historique: [11800, 12000, 12100, 12200, 12350, 12500, 12600, 12650, 12700, 12750, 12800, 12800],

    peers: [
      { name: 'Orange CI', ticker: 'ORCI', roe: 32.4, per: 10.2, rendement: 3.8, croissance: 5.2 },
      { name: 'Sonatel CI', ticker: 'SNTS', roe: 40.0, per: 8.0, rendement: 4.1, croissance: 3.7 },
      { name: 'Ecobank CI', ticker: 'ETIT', roe: 11.0, per: 6.8, rendement: 2.5, croissance: 7.8 }
    ],

    news: [
      { titre: 'Orange CI déploie la 4G+ dans 50 nouvelles villes ivoiriennes', impact: 'positif', date: '2024-02-12', source: 'ARTCI' },
      { titre: 'Orange Money atteint 8 millions d\'utilisateurs actifs en CI', impact: 'positif', date: '2024-01-22', source: 'Orange Rapport' },
      { titre: 'Hausse significative des investissements réseau : +18% vs 2022', impact: 'positif', date: '2023-12-08', source: 'Orange CI RA' },
      { titre: 'Concurrence renforcée de MTN CI sur les segments data et mobile money', impact: 'negatif', date: '2023-11-05', source: 'Marché Télécoms CI' }
    ],

    topdown: {
      economie: 'Croissance économique CI soutenue, urbanisation et classe moyenne en expansion',
      economie_pts: 5,
      economie_note: 'positive',
      secteur: 'Croissance des données mobiles et du mobile banking en Afrique de l\'Ouest',
      secteur_pts: 5,
      secteur_note: 'positive',
      entreprise: 'Orange CI positionée sur data et Mobile Money, double levier de croissance',
      entreprise_pts: 4,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // TOTAL CI — Distribution pétrolière
  // ------------------------------------------------------------------
  TTLC: {
    ticker: 'TTLC',
    name: 'Total CI',
    fullName: 'TotalEnergies Marketing Côte d\'Ivoire',
    sector: 'Distribution Pétrolière',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Filiale ivoirienne de TotalEnergies, distribution de carburants et lubrifiants',

    cours: 2180,
    shares: 47000000,
    dividende: 100,
    per: 12.4,
    pbr: 2.4,
    rendement: 4.6,
    capitalisation: 102460, // millions FCFA

    ca:  [485000, 498000, 512000, 534000, 558000, 579000, 542000, 610000, 672000, 695000],
    rex: [ 13000,  13600,  14200,  14900,  15700,  16500,  15800,  17300,  19100,  19800],
    rn:  [  7800,   8200,   8600,   9000,   9500,  10000,   9500,  10500,  11600,  12000],

    actif_total: [82000, 86000, 91000, 96000, 102000, 108000, 104000, 113000, 124000, 129000],
    capitaux_propres: [38000, 40000, 42000, 44000, 46000, 48000, 46000, 49000, 53000, 55000],
    dettes_financieres: [15000, 15000, 16000, 17000, 18000, 19000, 20000, 22000, 24000, 25000],

    roe: [20.5, 20.5, 20.5, 20.5, 20.7, 20.8, 20.7, 21.4, 21.9, 21.8],
    roa: [ 9.5,  9.5,  9.5,  9.4,  9.3,  9.3,  9.1,  9.3,  9.4,  9.3],
    marge_nette: [ 1.6,  1.6,  1.7,  1.7,  1.7,  1.7,  1.8,  1.7,  1.7,  1.7],

    cours_historique: [2010, 2040, 2060, 2090, 2110, 2130, 2140, 2150, 2160, 2170, 2180, 2180],

    peers: [
      { name: 'Total CI', ticker: 'TTLC', roe: 21.8, per: 12.4, rendement: 4.6, croissance: 2.1 },
      { name: 'VIVO Energy', ticker: 'VIVE', roe: 19.2, per: 11.8, rendement: 4.2, croissance: 2.8 },
      { name: 'Pétro Ivoire', ticker: 'PETR', roe: 15.5, per: 13.5, rendement: 3.8, croissance: 3.5 }
    ],

    news: [
      { titre: 'Total CI inaugure 12 nouvelles stations service en 2023', impact: 'positif', date: '2024-01-10', source: 'Total CI Rapport' },
      { titre: 'Volatilité des prix du pétrole Brent : impact sur les marges aval', impact: 'negatif', date: '2023-12-20', source: 'IEA Rapport' },
      { titre: 'Développement des bornes de recharge électrique dans les stations', impact: 'positif', date: '2023-11-15', source: 'TotalEnergies Afrique' },
      { titre: 'Hausse des taxes sur les carburants en CI annoncée pour 2024', impact: 'negatif', date: '2023-10-30', source: 'Ministère Finances CI' }
    ],

    topdown: {
      economie: 'Croissance de la mobilité et des transports en CI, demande soutenue',
      economie_pts: 3,
      economie_note: 'neutre',
      secteur: 'Transition énergétique en cours, pétrole toujours dominant en Afrique à CT',
      secteur_pts: 3,
      secteur_note: 'neutre',
      entreprise: 'Total CI bien positionnée mais marges faibles liées à la distribution',
      entreprise_pts: 3,
      entreprise_note: 'neutre'
    }
  },

  // ------------------------------------------------------------------
  // NSIA BANQUE — Banque / Assurance
  // ------------------------------------------------------------------
  NSAB: {
    ticker: 'NSAB',
    name: 'NSIA Banque',
    fullName: 'NSIA Banque Côte d\'Ivoire (Groupe NSIA)',
    sector: 'Banque & Assurance',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Banque ivoirienne du groupe NSIA, spécialisée en banque-assurance',

    cours: 7200,
    shares: 12000000,
    dividende: 202,
    per: 8.5,
    pbr: 1.6,
    rendement: 2.8,
    capitalisation: 86400, // millions FCFA

    ca:  [32000, 34500, 37200, 40200, 43400, 46900, 50700, 54700, 59100, 63800],
    rex: [ 7500,  8100,  8800,  9500, 10300, 11100, 12000, 13000, 14000, 15100],
    rn:  [ 4800,  5200,  5600,  6100,  6600,  7100,  7700,  8300,  9000,  9700],

    actif_total: [420000, 448000, 480000, 514000, 550000, 590000, 631000, 675000, 722000, 773000],
    capitaux_propres: [48000, 51000, 55000, 59000, 64000, 69000, 74000, 80000, 87000, 93000],
    dettes_financieres: [352000, 376000, 402000, 430000, 460000, 493000, 528000, 565000, 604000, 647000],

    roe: [10.0, 10.2, 10.2, 10.3, 10.3, 10.3, 10.4, 10.4, 10.3, 10.4],
    roa: [ 1.1,  1.2,  1.2,  1.2,  1.2,  1.2,  1.2,  1.2,  1.2,  1.3],
    marge_nette: [15.0, 15.1, 15.1, 15.2, 15.2, 15.1, 15.2, 15.2, 15.2, 15.2],

    cours_historique: [6600, 6700, 6750, 6800, 6850, 6900, 6950, 7000, 7050, 7100, 7150, 7200],

    peers: [
      { name: 'NSIA Banque', ticker: 'NSAB', roe: 10.4, per: 8.5, rendement: 2.8, croissance: 6.5 },
      { name: 'BOA CI', ticker: 'BOACI', roe: 11.9, per: 7.2, rendement: 3.2, croissance: 7.6 },
      { name: 'SIB', ticker: 'SIBC', roe: 18.2, per: 7.9, rendement: 3.5, croissance: 8.2 }
    ],

    news: [
      { titre: 'NSIA Banque lance une offre de crédit logement à taux bonifiés', impact: 'positif', date: '2024-02-08', source: 'NSIA Rapport' },
      { titre: 'Partenariat avec NSIA Assurances pour des produits banque-assurance innovants', impact: 'positif', date: '2024-01-12', source: 'Groupe NSIA' },
      { titre: 'Retard dans la mise en conformité BCEAO : amende de 150 M FCFA', impact: 'negatif', date: '2023-10-25', source: 'BCEAO Bulletin' }
    ],

    topdown: {
      economie: 'Besoin de financement croissant en CI notamment dans le BTP et PME',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Banque-assurance est un modèle en forte croissance en Afrique subsaharienne',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'Synergies groupe NSIA solides, mais part de marché encore limitée',
      entreprise_pts: 3,
      entreprise_note: 'neutre'
    }
  },

  // ------------------------------------------------------------------
  // NESTLÉ CI — Agroalimentaire
  // ------------------------------------------------------------------
  NTLC: {
    ticker: 'NTLC',
    name: 'Nestlé CI',
    fullName: 'Nestlé Côte d\'Ivoire S.A.',
    sector: 'Agroalimentaire',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Filiale de Nestlé International, production et commercialisation de produits alimentaires',

    cours: 8650,
    shares: 7500000,
    dividende: 415,
    per: 14.8,
    pbr: 5.8,
    rendement: 4.8,
    capitalisation: 64875, // millions FCFA

    ca:  [ 88000,  93000,  99000, 105000, 112000, 120000, 129000, 138000, 148000, 159000],
    rex: [ 12000,  12800,  13700,  14600,  15600,  16700,  17900,  19200,  20600,  22000],
    rn:  [  7800,   8300,   8900,   9500,  10200,  10900,  11700,  12600,  13500,  14500],

    actif_total: [ 52000,  55000,  58000,  62000,  66000,  70000,  75000,  80000,  85000,  91000],
    capitaux_propres: [  8500,   9000,   9500,  10100,  10800,  11500,  12300,  13100,  14000,  15000],
    dettes_financieres: [  6000,   6200,   6400,   6600,   6800,   7000,   7200,   7400,   7600,   7800],

    roe: [91.8, 92.2, 93.7, 94.1, 94.4, 94.8, 95.1, 96.2, 96.4, 96.7],
    roa: [15.0, 15.1, 15.3, 15.3, 15.5, 15.6, 15.6, 15.8, 15.9, 15.9],
    marge_nette: [ 8.9,  8.9,  9.0,  9.0,  9.1,  9.1,  9.1,  9.1,  9.1,  9.1],

    cours_historique: [7900, 8000, 8100, 8200, 8300, 8400, 8450, 8500, 8550, 8600, 8630, 8650],

    peers: [
      { name: 'Nestlé CI', ticker: 'NTLC', roe: 96.7, per: 14.8, rendement: 4.8, croissance: 6.8 },
      { name: 'UNILEVER CI', ticker: 'UNLC', roe: 55.2, per: 16.2, rendement: 4.1, croissance: 5.8 },
      { name: 'Palm CI', ticker: 'PALC', roe: 24.5, per: 7.8, rendement: 6.2, croissance: 4.2 }
    ],

    news: [
      { titre: 'Nestlé CI inaugure une nouvelle ligne de production de Maggi', impact: 'positif', date: '2024-02-20', source: 'Nestlé Rapport' },
      { titre: 'Hausse de 8% des ventes portée par les produits laitiers et nutritionnels', impact: 'positif', date: '2024-01-30', source: 'Nestlé CI RA' },
      { titre: 'Forte pression inflationniste sur les matières premières agricoles', impact: 'negatif', date: '2023-12-18', source: 'FAO Rapport' },
      { titre: 'Extension des programmes d\'approvisionnement local en cacao CI', impact: 'positif', date: '2023-11-20', source: 'CCC Côte d\'Ivoire' },
      { titre: 'Lancement d\'une gamme de produits à prix accessible pour les ménages modestes', impact: 'positif', date: '2023-10-15', source: 'Nestlé Afrique' }
    ],

    topdown: {
      economie: 'Croissance de la consommation des ménages ivoiriens et démographie favorable',
      economie_pts: 5,
      economie_note: 'positive',
      secteur: 'Agroalimentaire porté par l\'urbanisation et la montée de la classe moyenne',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'Marques fortes Nestlé et Maggi, pouvoir de tarification élevé',
      entreprise_pts: 5,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // SIB — Banque
  // ------------------------------------------------------------------
  SIBC: {
    ticker: 'SIBC',
    name: 'SIB',
    fullName: 'Société Ivoirienne de Banque',
    sector: 'Banque',
    currency: 'FCFA',
    bourse: 'BRVM',
    pays: 'Côte d\'Ivoire',
    description: 'Filiale d\'Attijariwafa Bank, 3ème banque commerciale de Côte d\'Ivoire',

    cours: 5650,
    shares: 20000000,
    dividende: 198,
    per: 7.9,
    pbr: 1.9,
    rendement: 3.5,
    capitalisation: 113000, // millions FCFA

    ca:  [42000, 45500, 49400, 53600, 58100, 63100, 68500, 74300, 80700, 87600],
    rex: [11000, 12000, 13100, 14200, 15500, 16900, 18400, 20100, 21900, 23900],
    rn:  [ 7000,  7600,  8300,  9100,  9900, 10800, 11800, 12900, 14000, 15300],

    actif_total: [550000, 588000, 629000, 673000, 720000, 770000, 824000, 882000, 944000, 1010000],
    capitaux_propres: [52000, 55000, 59000, 63000, 68000, 73000, 79000, 85000, 92000, 99000],
    dettes_financieres: [465000, 498000, 533000, 570000, 611000, 655000, 701000, 752000, 806000, 864000],

    roe: [13.5, 13.8, 14.1, 14.4, 14.6, 14.8, 14.9, 15.2, 15.2, 15.5],
    roa: [ 1.3,  1.3,  1.3,  1.4,  1.4,  1.4,  1.4,  1.5,  1.5,  1.5],
    marge_nette: [16.7, 16.7, 16.8, 17.0, 17.0, 17.1, 17.2, 17.4, 17.3, 17.5],

    cours_historique: [5150, 5220, 5280, 5340, 5400, 5450, 5500, 5530, 5570, 5610, 5640, 5650],

    peers: [
      { name: 'SIB', ticker: 'SIBC', roe: 15.5, per: 7.9, rendement: 3.5, croissance: 8.2 },
      { name: 'BOA CI', ticker: 'BOACI', roe: 11.9, per: 7.2, rendement: 3.2, croissance: 7.6 },
      { name: 'NSIA Banque', ticker: 'NSAB', roe: 10.4, per: 8.5, rendement: 2.8, croissance: 6.5 },
      { name: 'Ecobank CI', ticker: 'ETIT', roe: 11.0, per: 6.8, rendement: 2.5, croissance: 7.8 }
    ],

    news: [
      { titre: 'SIB réalise une augmentation de capital de 10 Mrd FCFA', impact: 'positif', date: '2024-02-14', source: 'SIB Rapport' },
      { titre: 'Nouveau siège social inauguré à Abidjan-Plateau', impact: 'neutre', date: '2024-01-05', source: 'SIB Communiqué' },
      { titre: 'Portefeuille PME en hausse de 22% grâce aux lignes Attijariwafa', impact: 'positif', date: '2023-12-28', source: 'BCEAO Statistiques' },
      { titre: 'SIB remporte le prix de la meilleure banque CI 2023 (Euromoney)', impact: 'positif', date: '2023-10-10', source: 'Euromoney Awards' }
    ],

    topdown: {
      economie: 'Économie ivoirienne dynamique, premier marché bancaire UEMOA',
      economie_pts: 5,
      economie_note: 'positive',
      secteur: 'Secteur bancaire ivoirien en consolidation et professionnalisation',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'Soutien du groupe Attijariwafa, expertise régionale et synergies Maroc-Afrique',
      entreprise_pts: 4,
      entreprise_note: 'positive'
    }
  }
};

// ==================== LISTE ORDONNÉE POUR LE SÉLECTEUR ====================
const BRVM_COMPANY_LIST = [
  { ticker: 'SNTS',  name: 'Sonatel CI',   sector: 'Télécommunications' },
  { ticker: 'SDCI',  name: 'SODECI',        sector: 'Eau & Utilités' },
  { ticker: 'CIEC',  name: 'CIE',           sector: 'Énergie' },
  { ticker: 'BOACI', name: 'BOA CI',        sector: 'Banque' },
  { ticker: 'ETIT',  name: 'Ecobank CI',    sector: 'Banque' },
  { ticker: 'ORCI',  name: 'Orange CI',     sector: 'Télécommunications' },
  { ticker: 'TTLC',  name: 'Total CI',      sector: 'Distribution Pétrolière' },
  { ticker: 'NSAB',  name: 'NSIA Banque',   sector: 'Banque & Assurance' },
  { ticker: 'NTLC',  name: 'Nestlé CI',     sector: 'Agroalimentaire' },
  { ticker: 'SIBC',  name: 'SIB',           sector: 'Banque' }
];

// ==================== DONNÉES TICKER BRVM ====================
const BRVM_TICKER_DATA = [
  { symbol: 'SNTS', price: 19500, change: '+1.4%', direction: 'up' },
  { symbol: 'ORCI', price: 12800, change: '+0.6%', direction: 'up' },
  { symbol: 'CIEC', price: 2750, change: '-0.4%', direction: 'down' },
  { symbol: 'SDCI', price: 4950, change: '+0.2%', direction: 'up' },
  { symbol: 'NTLC', price: 8650, change: '+0.9%', direction: 'up' },
  { symbol: 'SIBC', price: 5650, change: '+1.1%', direction: 'up' },
  { symbol: 'BOACI', price: 6800, change: '-0.3%', direction: 'down' },
  { symbol: 'ETIT', price: 5400, change: '+0.0%', direction: 'up' },
  { symbol: 'TTLC', price: 2180, change: '-0.9%', direction: 'down' },
  { symbol: 'NSAB', price: 7200, change: '+0.4%', direction: 'up' }
];

// ==================== EXPORTS ====================
if (typeof window !== 'undefined') {
  window.BRVMData = {
    BRVM_COMPANIES,
    BRVM_COMPANY_LIST,
    BRVM_TICKER_DATA,
    ANNEES_10,
    MOIS_12
  };
}
