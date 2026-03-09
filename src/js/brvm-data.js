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
// Génère dynamiquement les 10 dernières années (toujours à jour)
const ANNEE_COURANTE = new Date().getFullYear();
const ANNEES_10 = Array.from({ length: 10 }, (_, i) => String(ANNEE_COURANTE - 9 + i));
const MOIS_12 = ['Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];

// ==================== HELPER : GÉNÉRATION DE SÉRIES TEMPORELLES ====================
/**
 * Génère un tableau de valeurs croissant sur n années
 * @param {number} base        - Valeur de départ (année 1)
 * @param {number} croissance  - Taux de croissance annuel en %
 * @param {number} [n=10]      - Nombre d'années
 * @returns {number[]}
 */
function generer(base, croissance, n = 10) {
  return Array.from({ length: n }, (_, i) =>
    Math.round(base * Math.pow(1 + croissance / 100, i)));
}

/** Génère une série de ratios variant linéairement */
function genRatio(debut, fin, n = 10) {
  return Array.from({ length: n }, (_, i) =>
    parseFloat((debut + (fin - debut) * (i / (n - 1))).toFixed(2)));
}

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

  // ====================================================================
  // NOUVELLES ENTREPRISES (37 ajouts pour atteindre 47 au total)
  // ====================================================================

  // ---- Agriculture ----
  PALMC: {
    ticker: 'PALMC', name: 'Palm CI', fullName: 'Société de Palmeraies de la Côte d\'Ivoire',
    sector: 'Agriculture', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Production et transformation de l\'huile de palme en Côte d\'Ivoire',
    cours: 5800, shares: 10000000, dividende: 250, per: 8.5, pbr: 1.6, rendement: 4.3, capitalisation: 58000,
    ca: generer(32000, 5), rex: generer(8000, 5.5), rn: generer(5000, 6),
    actif_total: generer(75000, 4), capitaux_propres: generer(35000, 4.5), dettes_financieres: generer(22000, -2),
    roe: genRatio(14.3, 15.5), roa: genRatio(6.7, 7.5), marge_nette: genRatio(15.6, 17.0),
    cours_historique: generer(5200, 1, 12),
    peers: [{ name: 'Palm CI', ticker: 'PALMC', roe: 15.5, per: 8.5, rendement: 4.3, croissance: 5.0 },
            { name: 'SAPH CI', ticker: 'SPHC', roe: 13.2, per: 9.2, rendement: 3.8, croissance: 4.5 }],
    news: [{ titre: 'Hausse du cours mondial de l\'huile de palme, bénéfique pour Palm CI', impact: 'positif', date: '2024-02-01', source: 'FAO' },
           { titre: 'Programme de replantation 2024-2026 lancé', impact: 'positif', date: '2024-01-10', source: 'Palm CI' }],
    topdown: { economie: 'Demande mondiale en huile végétale soutenue',
      economie_pts: 4, economie_note: 'positive', secteur: 'Prix de l\'huile de palme en hausse',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Producteur mature à dividendes réguliers',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  SICC: {
    ticker: 'SICC', name: 'SICOR CI', fullName: 'Société Ivoirienne de Coco et de Riz',
    sector: 'Agriculture', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Production agricole diversifiée en Côte d\'Ivoire',
    cours: 4200, shares: 8000000, dividende: 150, per: 9.5, pbr: 1.2, rendement: 3.6, capitalisation: 33600,
    ca: generer(22000, 4.5), rex: generer(4500, 5), rn: generer(2800, 5.5),
    actif_total: generer(55000, 4), capitaux_propres: generer(28000, 4), dettes_financieres: generer(14000, -2),
    roe: genRatio(10.0, 11.2), roa: genRatio(5.1, 5.8), marge_nette: genRatio(12.7, 14.0),
    cours_historique: generer(3800, 1, 12),
    peers: [{ name: 'SICOR CI', ticker: 'SICC', roe: 11.2, per: 9.5, rendement: 3.6, croissance: 4.5 },
            { name: 'SOGB CI', ticker: 'SOGBC', roe: 12.0, per: 8.8, rendement: 3.5, croissance: 4.0 }],
    news: [{ titre: 'Reprise des exportations de cacao ivoirien vers l\'Europe', impact: 'positif', date: '2024-01-20', source: 'OCAB' }],
    topdown: { economie: 'Secteur agricole ivoirien soutenu par l\'État',
      economie_pts: 3, economie_note: 'positive', secteur: 'Marchés agricoles volatils',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Entreprise diversifiée, résiliente',
      entreprise_pts: 3, entreprise_note: 'neutre' }
  },

  SOGBC: {
    ticker: 'SOGBC', name: 'SOGB CI', fullName: 'Société des Grands Bois de Côte d\'Ivoire',
    sector: 'Agriculture', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Exploitation et transformation du caoutchouc naturel en Côte d\'Ivoire',
    cours: 4650, shares: 9000000, dividende: 162, per: 8.8, pbr: 1.3, rendement: 3.5, capitalisation: 41850,
    ca: generer(26000, 4), rex: generer(6000, 4.5), rn: generer(3800, 5),
    actif_total: generer(60000, 4), capitaux_propres: generer(32000, 4), dettes_financieres: generer(16000, -2),
    roe: genRatio(11.9, 12.9), roa: genRatio(6.3, 7.0), marge_nette: genRatio(14.6, 16.0),
    cours_historique: generer(4200, 1, 12),
    peers: [{ name: 'SOGB CI', ticker: 'SOGBC', roe: 12.9, per: 8.8, rendement: 3.5, croissance: 4.0 },
            { name: 'SAPH CI', ticker: 'SPHC', roe: 13.2, per: 9.2, rendement: 3.8, croissance: 4.5 }],
    news: [{ titre: 'Rebond du cours du caoutchouc sur les marchés internationaux', impact: 'positif', date: '2024-01-25', source: 'ANRB' }],
    topdown: { economie: 'Demande asiatique en caoutchouc naturel en reprise',
      economie_pts: 4, economie_note: 'positive', secteur: 'Concurrence du caoutchouc synthétique',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Production stable, exportations croissantes',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  SPHC: {
    ticker: 'SPHC', name: 'SAPH CI', fullName: 'Société Africaine de Plantations d\'Hévéas',
    sector: 'Agriculture', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Premier producteur d\'hévéas (caoutchouc naturel) d\'Afrique de l\'Ouest',
    cours: 6200, shares: 11000000, dividende: 236, per: 9.2, pbr: 1.5, rendement: 3.8, capitalisation: 68200,
    ca: generer(38000, 4.5), rex: generer(9000, 5), rn: generer(5800, 5.5),
    actif_total: generer(82000, 4), capitaux_propres: generer(42000, 4.5), dettes_financieres: generer(20000, -2),
    roe: genRatio(13.0, 14.3), roa: genRatio(7.1, 7.8), marge_nette: genRatio(15.3, 16.5),
    cours_historique: generer(5600, 1, 12),
    peers: [{ name: 'SAPH CI', ticker: 'SPHC', roe: 14.3, per: 9.2, rendement: 3.8, croissance: 4.5 },
            { name: 'SOGB CI', ticker: 'SOGBC', roe: 12.9, per: 8.8, rendement: 3.5, croissance: 4.0 }],
    news: [{ titre: 'SAPH signe un accord de fourniture à long terme avec Michelin', impact: 'positif', date: '2024-02-05', source: 'SAPH CI' }],
    topdown: { economie: 'Côte d\'Ivoire premier producteur mondial de caoutchouc naturel',
      economie_pts: 5, economie_note: 'positive', secteur: 'Demande soutenue pour le secteur automobile',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Position de leader régional consolidée',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  // ---- Banques (hors CI) ----
  BOAB: {
    ticker: 'BOAB', name: 'BOA Bénin', fullName: 'Bank Of Africa Bénin',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Bénin',
    description: 'Banque commerciale leader au Bénin, filiale du groupe Bank Of Africa',
    cours: 5400, shares: 12000000, dividende: 180, per: 7.0, pbr: 1.2, rendement: 3.3, capitalisation: 64800,
    ca: generer(28000, 7), rex: generer(7000, 7.5), rn: generer(4500, 8),
    actif_total: generer(380000, 8), capitaux_propres: generer(42000, 7), dettes_financieres: generer(310000, 8),
    roe: genRatio(10.7, 12.5), roa: genRatio(1.2, 1.4), marge_nette: genRatio(16.1, 18.0),
    cours_historique: generer(4800, 1, 12),
    peers: [{ name: 'BOA Bénin', ticker: 'BOAB', roe: 12.5, per: 7.0, rendement: 3.3, croissance: 8.0 },
            { name: 'BOA Togo', ticker: 'BOAT', roe: 11.8, per: 7.2, rendement: 3.1, croissance: 7.5 }],
    news: [{ titre: 'BOA Bénin: hausse de 11% du crédit à l\'économie en 2023', impact: 'positif', date: '2024-01-28', source: 'BCEAO' }],
    topdown: { economie: 'Économie béninoise en accélération, projet Bénin Révélé',
      economie_pts: 4, economie_note: 'positive', secteur: 'Secteur bancaire béninois peu bancarisé, fort potentiel',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Groupe BOA solide, réseau régional',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  BOABF: {
    ticker: 'BOABF', name: 'BOA Burkina', fullName: 'Bank Of Africa Burkina Faso',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Burkina Faso',
    description: 'Banque de référence au Burkina Faso au sein du groupe Bank Of Africa',
    cours: 4800, shares: 10500000, dividende: 155, per: 7.2, pbr: 1.1, rendement: 3.2, capitalisation: 50400,
    ca: generer(22000, 6), rex: generer(5500, 6.5), rn: generer(3500, 7),
    actif_total: generer(310000, 7), capitaux_propres: generer(35000, 6), dettes_financieres: generer(255000, 7),
    roe: genRatio(10.0, 11.5), roa: genRatio(1.1, 1.3), marge_nette: genRatio(15.9, 17.5),
    cours_historique: generer(4300, 1, 12),
    peers: [{ name: 'BOA Burkina', ticker: 'BOABF', roe: 11.5, per: 7.2, rendement: 3.2, croissance: 7.0 },
            { name: 'Coris Bank BF', ticker: 'CBIBF', roe: 14.2, per: 6.5, rendement: 3.8, croissance: 9.0 }],
    news: [{ titre: 'BOA BF maintient ses activités malgré le contexte sécuritaire régional', impact: 'neutre', date: '2024-01-15', source: 'BOA Rapport' }],
    topdown: { economie: 'Économie burkinabé sous pression sécuritaire mais résiliente',
      economie_pts: 2, economie_note: 'negative', secteur: 'Bancarisation en hausse malgré les défis',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Groupe BOA présent et bien capitalisé',
      entreprise_pts: 3, entreprise_note: 'neutre' }
  },

  BOAM: {
    ticker: 'BOAM', name: 'BOA Mali', fullName: 'Bank Of Africa Mali',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Mali',
    description: 'Filiale malienne du groupe Bank Of Africa, banque universelle',
    cours: 3950, shares: 9000000, dividende: 120, per: 7.5, pbr: 1.0, rendement: 3.0, capitalisation: 35550,
    ca: generer(18000, 5.5), rex: generer(4200, 6), rn: generer(2700, 6.5),
    actif_total: generer(260000, 6), capitaux_propres: generer(28000, 5.5), dettes_financieres: generer(215000, 6),
    roe: genRatio(9.6, 11.0), roa: genRatio(1.0, 1.2), marge_nette: genRatio(15.0, 16.5),
    cours_historique: generer(3500, 1, 12),
    peers: [{ name: 'BOA Mali', ticker: 'BOAM', roe: 11.0, per: 7.5, rendement: 3.0, croissance: 6.5 },
            { name: 'BOA Niger', ticker: 'BOAN', roe: 9.8, per: 8.0, rendement: 2.8, croissance: 5.5 }],
    news: [{ titre: 'BOA Mali: plan de continuité renforcé face au contexte géopolitique', impact: 'neutre', date: '2024-01-08', source: 'BOA Rapport' }],
    topdown: { economie: 'Mali: contexte difficile, mais économie formelle stable',
      economie_pts: 2, economie_note: 'negative', secteur: 'Bancarisation malienne faible, potentiel élevé',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Groupe BOA, gestion prudente',
      entreprise_pts: 3, entreprise_note: 'neutre' }
  },

  BOAN: {
    ticker: 'BOAN', name: 'BOA Niger', fullName: 'Bank Of Africa Niger',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Niger',
    description: 'Banque commerciale au Niger, membre du groupe Bank Of Africa',
    cours: 3600, shares: 8500000, dividende: 100, per: 8.0, pbr: 0.9, rendement: 2.8, capitalisation: 30600,
    ca: generer(14000, 5), rex: generer(3200, 5.5), rn: generer(2000, 6),
    actif_total: generer(200000, 5.5), capitaux_propres: generer(22000, 5), dettes_financieres: generer(162000, 5.5),
    roe: genRatio(9.1, 10.2), roa: genRatio(1.0, 1.1), marge_nette: genRatio(14.3, 15.5),
    cours_historique: generer(3200, 1, 12),
    peers: [{ name: 'BOA Niger', ticker: 'BOAN', roe: 10.2, per: 8.0, rendement: 2.8, croissance: 6.0 },
            { name: 'BOA Mali', ticker: 'BOAM', roe: 11.0, per: 7.5, rendement: 3.0, croissance: 6.5 }],
    news: [{ titre: 'Niger: reprise progressive des activités après la période de transition', impact: 'neutre', date: '2024-01-12', source: 'BCEAO' }],
    topdown: { economie: 'Niger: transition politique, économie sous pression',
      economie_pts: 1, economie_note: 'negative', secteur: 'Potentiel de croissance à long terme',
      secteur_pts: 2, secteur_note: 'neutre', entreprise: 'BOA présent, gestion rigoureuse',
      entreprise_pts: 2, entreprise_note: 'neutre' }
  },

  BOAS: {
    ticker: 'BOAS', name: 'BOA Sénégal', fullName: 'Bank Of Africa Sénégal',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Sénégal',
    description: 'Filiale sénégalaise de Bank Of Africa, banque universelle',
    cours: 5100, shares: 11000000, dividende: 168, per: 7.3, pbr: 1.2, rendement: 3.3, capitalisation: 56100,
    ca: generer(24000, 7.5), rex: generer(6000, 8), rn: generer(3800, 8.5),
    actif_total: generer(340000, 8), capitaux_propres: generer(38000, 7), dettes_financieres: generer(278000, 8),
    roe: genRatio(10.8, 12.8), roa: genRatio(1.1, 1.3), marge_nette: genRatio(15.8, 17.8),
    cours_historique: generer(4600, 1, 12),
    peers: [{ name: 'BOA Sénégal', ticker: 'BOAS', roe: 12.8, per: 7.3, rendement: 3.3, croissance: 8.5 },
            { name: 'BOA Bénin', ticker: 'BOAB', roe: 12.5, per: 7.0, rendement: 3.3, croissance: 8.0 }],
    news: [{ titre: 'Sénégal: pétrole et gaz boostent la demande de financement bancaire', impact: 'positif', date: '2024-02-10', source: 'BRVM Info' }],
    topdown: { economie: 'Sénégal en forte croissance avec l\'exploitation pétrolière',
      economie_pts: 5, economie_note: 'positive', secteur: 'Secteur financier sénégalais en pleine expansion',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'BOA positionné sur un marché à fort potentiel',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  BOAT: {
    ticker: 'BOAT', name: 'BOA Togo', fullName: 'Bank Of Africa Togo',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Togo',
    description: 'Banque commerciale au Togo, hub financier régional',
    cours: 4700, shares: 10000000, dividende: 148, per: 7.2, pbr: 1.1, rendement: 3.1, capitalisation: 47000,
    ca: generer(21000, 7), rex: generer(5200, 7.5), rn: generer(3300, 8),
    actif_total: generer(290000, 7.5), capitaux_propres: generer(32000, 6.5), dettes_financieres: generer(238000, 7.5),
    roe: genRatio(10.3, 12.0), roa: genRatio(1.1, 1.3), marge_nette: genRatio(15.7, 17.5),
    cours_historique: generer(4200, 1, 12),
    peers: [{ name: 'BOA Togo', ticker: 'BOAT', roe: 12.0, per: 7.2, rendement: 3.1, croissance: 8.0 },
            { name: 'Oragroup', ticker: 'ORDI', roe: 13.5, per: 8.0, rendement: 2.5, croissance: 9.0 }],
    news: [{ titre: 'Togo: hub logistique d\'Afrique de l\'Ouest, fort besoin de financement', impact: 'positif', date: '2024-01-22', source: 'BCEAO' }],
    topdown: { economie: 'Togo, plateforme économique de la sous-région',
      economie_pts: 4, economie_note: 'positive', secteur: 'Secteur bancaire togolais dynamique',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'BOA Togo en croissance régulière',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  BICC: {
    ticker: 'BICC', name: 'BIC CI', fullName: 'Banque Internationale pour le Commerce en CI',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Banque spécialisée dans le financement du commerce et des PME',
    cours: 6200, shares: 14000000, dividende: 198, per: 8.2, pbr: 1.4, rendement: 3.2, capitalisation: 86800,
    ca: generer(36000, 8), rex: generer(9000, 8.5), rn: generer(5800, 9),
    actif_total: generer(490000, 8), capitaux_propres: generer(56000, 7.5), dettes_financieres: generer(398000, 8),
    roe: genRatio(11.8, 13.5), roa: genRatio(1.2, 1.4), marge_nette: genRatio(16.1, 18.0),
    cours_historique: generer(5600, 1, 12),
    peers: [{ name: 'BIC CI', ticker: 'BICC', roe: 13.5, per: 8.2, rendement: 3.2, croissance: 9.0 },
            { name: 'SIB', ticker: 'SIBC', roe: 18.2, per: 7.9, rendement: 3.5, croissance: 8.2 }],
    news: [{ titre: 'BIC CI: programme de financement des PME renforcé', impact: 'positif', date: '2024-01-18', source: 'BIC CI' }],
    topdown: { economie: 'Secteur PME ivoirien en développement accéléré',
      economie_pts: 4, economie_note: 'positive', secteur: 'Bancarisation des PME, segment prioritaire',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Niche spécialisée à forte rentabilité',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  BNBC: {
    ticker: 'BNBC', name: 'BNI CI', fullName: 'Banque Nationale d\'Investissement Côte d\'Ivoire',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Banque publique d\'investissement de Côte d\'Ivoire, financement projets État',
    cours: 4100, shares: 18000000, dividende: 120, per: 9.8, pbr: 0.9, rendement: 2.9, capitalisation: 73800,
    ca: generer(42000, 6), rex: generer(9500, 6.5), rn: generer(5900, 7),
    actif_total: generer(680000, 7), capitaux_propres: generer(82000, 6), dettes_financieres: generer(558000, 7),
    roe: genRatio(8.6, 9.8), roa: genRatio(0.9, 1.0), marge_nette: genRatio(14.0, 15.5),
    cours_historique: generer(3700, 1, 12),
    peers: [{ name: 'BNI CI', ticker: 'BNBC', roe: 9.8, per: 9.8, rendement: 2.9, croissance: 7.0 },
            { name: 'BOA CI', ticker: 'BOACI', roe: 11.9, per: 7.2, rendement: 3.2, croissance: 7.6 }],
    news: [{ titre: 'BNI finance 120 Mrd FCFA de projets d\'infrastructure en 2024', impact: 'positif', date: '2024-02-05', source: 'Gouvernement CI' }],
    topdown: { economie: 'Plan CI 2030: investissements massifs en infrastructure',
      economie_pts: 5, economie_note: 'positive', secteur: 'Banque de développement, rôle stratégique',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Portefeuille lié aux projets publics',
      entreprise_pts: 3, entreprise_note: 'neutre' }
  },

  CBIBF: {
    ticker: 'CBIBF', name: 'Coris Bank BF', fullName: 'Coris Bank International Burkina Faso',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Burkina Faso',
    description: 'Première banque privée panafricaine née au Burkina Faso',
    cours: 7800, shares: 16000000, dividende: 296, per: 6.5, pbr: 1.8, rendement: 3.8, capitalisation: 124800,
    ca: generer(58000, 9), rex: generer(15000, 9.5), rn: generer(9500, 10),
    actif_total: generer(750000, 9), capitaux_propres: generer(88000, 8.5), dettes_financieres: generer(618000, 9),
    roe: genRatio(13.4, 16.0), roa: genRatio(1.3, 1.6), marge_nette: genRatio(16.4, 19.5),
    cours_historique: generer(7000, 1.5, 12),
    peers: [{ name: 'Coris Bank BF', ticker: 'CBIBF', roe: 16.0, per: 6.5, rendement: 3.8, croissance: 10.0 },
            { name: 'BOA Burkina', ticker: 'BOABF', roe: 11.5, per: 7.2, rendement: 3.2, croissance: 7.0 }],
    news: [{ titre: 'Coris Bank: 5ème meilleure banque africaine par le magazine The Banker', impact: 'positif', date: '2024-02-08', source: 'The Banker' },
           { titre: 'Expansion en Afrique de l\'Est: ouverture d\'une filiale au Kenya', impact: 'positif', date: '2024-01-20', source: 'Coris Bank' }],
    topdown: { economie: 'Groupe panafricain fort malgré les défis sécuritaires régionaux',
      economie_pts: 3, economie_note: 'neutre', secteur: 'Croissance soutenue du crédit en zone UEMOA',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Champion national en forte expansion',
      entreprise_pts: 5, entreprise_note: 'positive' }
  },

  ORDI: {
    ticker: 'ORDI', name: 'Oragroup', fullName: 'Oragroup SA (Togo)',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Togo',
    description: 'Groupe bancaire panafricain présent dans 12 pays d\'Afrique subsaharienne',
    cours: 6400, shares: 13000000, dividende: 160, per: 8.0, pbr: 1.5, rendement: 2.5, capitalisation: 83200,
    ca: generer(48000, 9), rex: generer(12000, 9.5), rn: generer(7500, 10),
    actif_total: generer(620000, 9), capitaux_propres: generer(72000, 8), dettes_financieres: generer(510000, 9),
    roe: genRatio(12.5, 15.0), roa: genRatio(1.2, 1.5), marge_nette: genRatio(15.6, 18.5),
    cours_historique: generer(5700, 1.5, 12),
    peers: [{ name: 'Oragroup', ticker: 'ORDI', roe: 15.0, per: 8.0, rendement: 2.5, croissance: 10.0 },
            { name: 'BOA Togo', ticker: 'BOAT', roe: 12.0, per: 7.2, rendement: 3.1, croissance: 8.0 }],
    news: [{ titre: 'Oragroup lance sa solution de mobile banking multi-pays', impact: 'positif', date: '2024-01-30', source: 'Oragroup' }],
    topdown: { economie: 'Croissance africaine soutenue, besoins en financement élevés',
      economie_pts: 4, economie_note: 'positive', secteur: 'Fintech et banques traditionnelles en convergence',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Expansion rapide et rentabilité croissante',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  SGBCI: {
    ticker: 'SGBCI', name: 'SGCI', fullName: 'Société Générale de Banques en Côte d\'Ivoire',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Filiale ivoirienne de Société Générale, banque universelle de référence',
    cours: 8200, shares: 20000000, dividende: 270, per: 7.8, pbr: 1.6, rendement: 3.3, capitalisation: 164000,
    ca: generer(72000, 7.5), rex: generer(18000, 8), rn: generer(11500, 8.5),
    actif_total: generer(960000, 8), capitaux_propres: generer(112000, 7.5), dettes_financieres: generer(798000, 8),
    roe: genRatio(12.3, 14.5), roa: genRatio(1.2, 1.4), marge_nette: genRatio(16.0, 18.2),
    cours_historique: generer(7400, 1.5, 12),
    peers: [{ name: 'SGCI', ticker: 'SGBCI', roe: 14.5, per: 7.8, rendement: 3.3, croissance: 8.5 },
            { name: 'SIB', ticker: 'SIBC', roe: 18.2, per: 7.9, rendement: 3.5, croissance: 8.2 }],
    news: [{ titre: 'SG CI: record de crédits à l\'habitat en 2023, +22% vs 2022', impact: 'positif', date: '2024-02-05', source: 'SGCI Rapport' }],
    topdown: { economie: 'CI premier marché UEMOA, croissance soutenue',
      economie_pts: 5, economie_note: 'positive', secteur: 'Concurrence bancaire intense en CI',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Marque internationale, clientèle Corporate solide',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  SAFC: {
    ticker: 'SAFC', name: 'SAFCA CI', fullName: 'Société Africaine de Crédit Automobile',
    sector: 'Finance', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Société de crédit-bail automobile, leader en financement véhicules',
    cours: 3400, shares: 7000000, dividende: 102, per: 9.5, pbr: 1.1, rendement: 3.0, capitalisation: 23800,
    ca: generer(16000, 6), rex: generer(4000, 6.5), rn: generer(2500, 7),
    actif_total: generer(95000, 6), capitaux_propres: generer(21000, 6.5), dettes_financieres: generer(68000, 5.5),
    roe: genRatio(11.9, 13.5), roa: genRatio(2.6, 3.2), marge_nette: genRatio(15.6, 17.5),
    cours_historique: generer(3000, 1, 12),
    peers: [{ name: 'SAFCA CI', ticker: 'SAFC', roe: 13.5, per: 9.5, rendement: 3.0, croissance: 7.0 }],
    news: [{ titre: 'Boom des ventes automobiles en CI: SAFCA augmente son portefeuille', impact: 'positif', date: '2024-01-15', source: 'CCICI' }],
    topdown: { economie: 'Classe moyenne ivoirienne en expansion, demande auto croissante',
      economie_pts: 4, economie_note: 'positive', secteur: 'Marché du crédit-bail encore peu développé',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Niche captive, peu de concurrents directs',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  // ---- Industrie / Agroalimentaire ----
  UNXC: {
    ticker: 'UNXC', name: 'Unilever CI', fullName: 'Unilever Côte d\'Ivoire',
    sector: 'Agroalimentaire', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Filiale d\'Unilever en CI, produits alimentaires et d\'hygiène',
    cours: 5200, shares: 12000000, dividende: 182, per: 11.5, pbr: 2.8, rendement: 3.5, capitalisation: 62400,
    ca: generer(68000, 4), rex: generer(8500, 4.5), rn: generer(5400, 5),
    actif_total: generer(95000, 4), capitaux_propres: generer(22000, 4.5), dettes_financieres: generer(38000, 2),
    roe: genRatio(24.5, 27.0), roa: genRatio(5.7, 6.5), marge_nette: genRatio(7.9, 9.0),
    cours_historique: generer(4700, 1, 12),
    peers: [{ name: 'Unilever CI', ticker: 'UNXC', roe: 27.0, per: 11.5, rendement: 3.5, croissance: 5.0 },
            { name: 'Nestlé CI', ticker: 'NTLC', roe: 31.5, per: 15.2, rendement: 3.1, croissance: 5.0 }],
    news: [{ titre: 'Unilever CI lance sa ligne de produits locaux "Afrique Authentique"', impact: 'positif', date: '2024-01-25', source: 'Unilever' }],
    topdown: { economie: 'Urbanisation forte, hausse de la consommation des ménages',
      economie_pts: 4, economie_note: 'positive', secteur: 'Marché FMCG en forte croissance en Afrique',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Marques mondiales solides, distribution étendue',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  SMBC: {
    ticker: 'SMBC', name: 'SMB CI', fullName: 'Société des Marchés de Bois de Côte d\'Ivoire',
    sector: 'Industrie du bois', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Exploitation et transformation du bois tropical en Côte d\'Ivoire',
    cours: 3200, shares: 8000000, dividende: 96, per: 10.5, pbr: 0.8, rendement: 3.0, capitalisation: 25600,
    ca: generer(18000, 3.5), rex: generer(3800, 4), rn: generer(2300, 4.5),
    actif_total: generer(58000, 3.5), capitaux_propres: generer(32000, 3.5), dettes_financieres: generer(15000, -1),
    roe: genRatio(7.2, 8.2), roa: genRatio(4.0, 4.6), marge_nette: genRatio(12.8, 14.5),
    cours_historique: generer(2900, 1, 12),
    peers: [{ name: 'SMB CI', ticker: 'SMBC', roe: 8.2, per: 10.5, rendement: 3.0, croissance: 4.5 }],
    news: [{ titre: 'SMB CI investit dans la certification FSC de ses forêts', impact: 'positif', date: '2024-01-12', source: 'SMB CI' }],
    topdown: { economie: 'Demande européenne en bois certifié en hausse',
      economie_pts: 3, economie_note: 'positive', secteur: 'Déforestation : réglementation plus stricte',
      secteur_pts: 2, secteur_note: 'negative', entreprise: 'Adaptation nécessaire aux nouvelles normes',
      entreprise_pts: 2, entreprise_note: 'neutre' }
  },

  CABC: {
    ticker: 'CABC', name: 'SICABLE CI', fullName: 'Société Ivoirienne de Câbles',
    sector: 'Industrie électrique', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Fabrication de câbles électriques et de télécommunication en Côte d\'Ivoire',
    cours: 4500, shares: 9500000, dividende: 144, per: 9.2, pbr: 1.3, rendement: 3.2, capitalisation: 42750,
    ca: generer(35000, 5), rex: generer(7500, 5.5), rn: generer(4700, 6),
    actif_total: generer(68000, 4.5), capitaux_propres: generer(34000, 4.5), dettes_financieres: generer(20000, -1),
    roe: genRatio(13.8, 16.0), roa: genRatio(6.9, 8.0), marge_nette: genRatio(13.4, 15.5),
    cours_historique: generer(4000, 1, 12),
    peers: [{ name: 'SICABLE CI', ticker: 'CABC', roe: 16.0, per: 9.2, rendement: 3.2, croissance: 6.0 }],
    news: [{ titre: 'SICABLE CI: contrat 12 Mrd FCFA pour l\'électrification rurale', impact: 'positif', date: '2024-02-01', source: 'Ministère Energie CI' }],
    topdown: { economie: 'Plan d\'électrification universelle CI, forte demande en câbles',
      economie_pts: 5, economie_note: 'positive', secteur: 'Industrialisation accélérée en CI',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Carnet de commandes bien rempli',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  // ---- Commerce & Distribution ----
  CFAC: {
    ticker: 'CFAC', name: 'CFAO CI', fullName: 'Compagnie Française de l\'Afrique Occidentale CI',
    sector: 'Commerce & Distribution', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Distribution automobile, pharmacie et FMCG en Afrique de l\'Ouest',
    cours: 7100, shares: 17000000, dividende: 250, per: 10.0, pbr: 2.0, rendement: 3.5, capitalisation: 120700,
    ca: generer(95000, 5), rex: generer(14000, 5.5), rn: generer(8800, 6),
    actif_total: generer(150000, 5), capitaux_propres: generer(60000, 5.5), dettes_financieres: generer(55000, 2),
    roe: genRatio(14.7, 17.0), roa: genRatio(5.9, 7.0), marge_nette: genRatio(9.3, 10.5),
    cours_historique: generer(6400, 1, 12),
    peers: [{ name: 'CFAO CI', ticker: 'CFAC', roe: 17.0, per: 10.0, rendement: 3.5, croissance: 6.0 }],
    news: [{ titre: 'CFAO déploie son réseau de pharmacies C2Pharma dans 5 villes', impact: 'positif', date: '2024-01-28', source: 'CFAO Rapport' }],
    topdown: { economie: 'Classe moyenne africaine, moteur de la consommation',
      economie_pts: 4, economie_note: 'positive', secteur: 'Distribution multi-sectorielle en essor',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Diversification réussie, groupe solide',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  PRSC: {
    ticker: 'PRSC', name: 'PROSUMA CI', fullName: 'Promotion des Supermarchés de Côte d\'Ivoire',
    sector: 'Commerce & Distribution', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Opérateur de supermarchés et hypermarchés sous les enseignes Sococe et Champion',
    cours: 2800, shares: 7500000, dividende: 78, per: 11.2, pbr: 0.9, rendement: 2.8, capitalisation: 21000,
    ca: generer(48000, 3.5), rex: generer(4800, 4), rn: generer(2800, 4.5),
    actif_total: generer(52000, 3.5), capitaux_propres: generer(23000, 3.5), dettes_financieres: generer(19000, 2),
    roe: genRatio(12.2, 13.8), roa: genRatio(5.4, 6.2), marge_nette: genRatio(5.8, 6.8),
    cours_historique: generer(2500, 1, 12),
    peers: [{ name: 'PROSUMA CI', ticker: 'PRSC', roe: 13.8, per: 11.2, rendement: 2.8, croissance: 4.5 }],
    news: [{ titre: 'PROSUMA ouvre 3 nouveaux supermarchés en périphérie d\'Abidjan', impact: 'positif', date: '2024-01-18', source: 'PROSUMA' }],
    topdown: { economie: 'Croissance de la consommation domestique en CI',
      economie_pts: 4, economie_note: 'positive', secteur: 'Développement du commerce organisé face aux marchés informels',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Expansion réseau prudente mais régulière',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  VIVO: {
    ticker: 'VIVO', name: 'Vivo Energy CI', fullName: 'Vivo Energy Côte d\'Ivoire',
    sector: 'Distribution Pétrolière', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Distribution de carburants et lubrifiants Shell en Côte d\'Ivoire',
    cours: 3950, shares: 22000000, dividende: 138, per: 8.5, pbr: 2.2, rendement: 3.5, capitalisation: 86900,
    ca: generer(180000, 3), rex: generer(12000, 3.5), rn: generer(7500, 4),
    actif_total: generer(120000, 3), capitaux_propres: generer(39000, 4), dettes_financieres: generer(42000, 1),
    roe: genRatio(19.2, 22.0), roa: genRatio(6.3, 7.0), marge_nette: genRatio(4.2, 5.0),
    cours_historique: generer(3550, 1, 12),
    peers: [{ name: 'Vivo Energy CI', ticker: 'VIVO', roe: 22.0, per: 8.5, rendement: 3.5, croissance: 4.0 },
            { name: 'TotalEnergies CI', ticker: 'TTLC', roe: 25.1, per: 10.5, rendement: 3.3, croissance: 4.2 }],
    news: [{ titre: 'Vivo Energy installe 50 nouvelles stations équipées de bornes de recharge EV', impact: 'positif', date: '2024-02-01', source: 'Vivo Energy' }],
    topdown: { economie: 'Transition énergétique, mais demande hydrocarbure stable à court terme',
      economie_pts: 3, economie_note: 'neutre', secteur: 'Marché des carburants stable avec pression réglementaire',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Réseau Shell établi, diversification EV engagée',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  // ---- Télécommunications ----
  ONTBF: {
    ticker: 'ONTBF', name: 'ONATEL BF', fullName: 'Office National des Télécommunications du Burkina Faso',
    sector: 'Télécommunications', currency: 'FCFA', bourse: 'BRVM', pays: 'Burkina Faso',
    description: 'Opérateur télécom national du Burkina Faso (fixe, mobile Telmob, internet)',
    cours: 4900, shares: 20000000, dividende: 196, per: 9.5, pbr: 1.8, rendement: 4.0, capitalisation: 98000,
    ca: generer(92000, 4), rex: generer(22000, 4.5), rn: generer(14000, 5),
    actif_total: generer(280000, 4), capitaux_propres: generer(120000, 4.5), dettes_financieres: generer(90000, 2),
    roe: genRatio(11.7, 13.5), roa: genRatio(5.0, 6.0), marge_nette: genRatio(15.2, 17.5),
    cours_historique: generer(4400, 1, 12),
    peers: [{ name: 'ONATEL BF', ticker: 'ONTBF', roe: 13.5, per: 9.5, rendement: 4.0, croissance: 5.0 },
            { name: 'Orange CI', ticker: 'ORCI', roe: 28.5, per: 10.2, rendement: 3.8, croissance: 5.2 }],
    news: [{ titre: 'ONATEL lance sa 4G+ dans les 5 grandes villes du Burkina', impact: 'positif', date: '2024-01-22', source: 'ONATEL BF' }],
    topdown: { economie: 'Burkina Faso: économie numérique malgré le contexte sécuritaire',
      economie_pts: 3, economie_note: 'neutre', secteur: 'Mobile money en forte croissance en Afrique de l\'Ouest',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Opérateur national protégé, dividendes stables',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  // ---- Énergie ----
  BIDC: {
    ticker: 'BIDC', name: 'CIPREL CI', fullName: 'Compagnie Ivoirienne de Production d\'Électricité',
    sector: 'Énergie & Électricité', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Producteur indépendant d\'électricité thermique en Côte d\'Ivoire',
    cours: 6800, shares: 15000000, dividende: 211, per: 13.2, pbr: 2.4, rendement: 3.1, capitalisation: 102000,
    ca: generer(62000, 4.5), rex: generer(16000, 5), rn: generer(10000, 5.5),
    actif_total: generer(180000, 4), capitaux_propres: generer(58000, 5), dettes_financieres: generer(88000, 1),
    roe: genRatio(17.2, 20.5), roa: genRatio(5.6, 6.5), marge_nette: genRatio(16.1, 18.5),
    cours_historique: generer(6100, 1, 12),
    peers: [{ name: 'CIPREL CI', ticker: 'BIDC', roe: 20.5, per: 13.2, rendement: 3.1, croissance: 5.5 },
            { name: 'CIE', ticker: 'CIEC', roe: 18.6, per: 9.8, rendement: 3.6, croissance: 4.5 }],
    news: [{ titre: 'CIPREL met en service sa nouvelle turbine à gaz de 112 MW', impact: 'positif', date: '2024-02-05', source: 'CIPREL Rapport' }],
    topdown: { economie: 'CI: déficit électrique persistant malgré les investissements',
      economie_pts: 4, economie_note: 'positive', secteur: 'Énergie thermique complémentaire à l\'hydraulique',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Contrat d\'achat d\'énergie garanti par l\'État',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  // ---- Transport & BTP ----
  STAC: {
    ticker: 'STAC', name: 'SETAO CI', fullName: 'Société d\'Études et de Travaux de l\'Afrique Occidentale',
    sector: 'BTP & Travaux publics', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Construction et travaux publics en Côte d\'Ivoire et en Afrique de l\'Ouest',
    cours: 2650, shares: 6500000, dividende: 80, per: 10.8, pbr: 0.8, rendement: 3.0, capitalisation: 17225,
    ca: generer(28000, 6), rex: generer(4500, 6.5), rn: generer(2700, 7),
    actif_total: generer(45000, 5.5), capitaux_propres: generer(21000, 5.5), dettes_financieres: generer(14000, 3),
    roe: genRatio(12.9, 15.5), roa: genRatio(6.0, 7.5), marge_nette: genRatio(9.6, 11.5),
    cours_historique: generer(2400, 1, 12),
    peers: [{ name: 'SETAO CI', ticker: 'STAC', roe: 15.5, per: 10.8, rendement: 3.0, croissance: 7.0 }],
    news: [{ titre: 'SETAO remporte un contrat de 18 Mrd FCFA pour le 3ème pont d\'Abidjan', impact: 'positif', date: '2024-01-30', source: 'Ministère Infrastructures CI' }],
    topdown: { economie: 'Plan d\'investissements publics CI 2030: 15 000 Mrd FCFA',
      economie_pts: 5, economie_note: 'positive', secteur: 'BTP en surchauffe, forte demande d\'infrastructures',
      secteur_pts: 5, secteur_note: 'positive', entreprise: 'Carnet de commandes à 18 mois, bonne visibilité',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  // ---- Finance (additionnels) ----
  SGBS: {
    ticker: 'SGBS', name: 'SG Bénin', fullName: 'Société Générale de Banques au Bénin',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Bénin',
    description: 'Filiale béninoise du groupe Société Générale, services bancaires universels',
    cours: 5600, shares: 12000000, dividende: 185, per: 8.5, pbr: 1.3, rendement: 3.3, capitalisation: 67200,
    ca: generer(32000, 7.5), rex: generer(8000, 8), rn: generer(5100, 8.5),
    actif_total: generer(420000, 8), capitaux_propres: generer(48000, 7), dettes_financieres: generer(344000, 8),
    roe: genRatio(11.5, 13.5), roa: genRatio(1.2, 1.4), marge_nette: genRatio(15.9, 18.0),
    cours_historique: generer(5000, 1, 12),
    peers: [{ name: 'SG Bénin', ticker: 'SGBS', roe: 13.5, per: 8.5, rendement: 3.3, croissance: 8.5 },
            { name: 'BOA Bénin', ticker: 'BOAB', roe: 12.5, per: 7.0, rendement: 3.3, croissance: 8.0 }],
    news: [{ titre: 'SG Bénin: partenariat avec la BOAD pour financer les PME béninoises', impact: 'positif', date: '2024-01-25', source: 'BOAD' }],
    topdown: { economie: 'Bénin: économie stable et croissance régulière ~6%/an',
      economie_pts: 4, economie_note: 'positive', secteur: 'Bancarisation béninoise à 30%, fort potentiel',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Marque internationale, clientèle premium',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  CBAO: {
    ticker: 'CBAO', name: 'CBAO Sénégal', fullName: 'Compagnie Bancaire de l\'Afrique Occidentale',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Sénégal',
    description: 'Banque sénégalaise historique, filiale du groupe Attijariwafa Bank',
    cours: 7400, shares: 16000000, dividende: 259, per: 8.0, pbr: 1.5, rendement: 3.5, capitalisation: 118400,
    ca: generer(58000, 8), rex: generer(15000, 8.5), rn: generer(9500, 9),
    actif_total: generer(760000, 8), capitaux_propres: generer(88000, 7.5), dettes_financieres: generer(628000, 8),
    roe: genRatio(12.0, 14.5), roa: genRatio(1.3, 1.5), marge_nette: genRatio(16.4, 18.5),
    cours_historique: generer(6600, 1.5, 12),
    peers: [{ name: 'CBAO Sénégal', ticker: 'CBAO', roe: 14.5, per: 8.0, rendement: 3.5, croissance: 9.0 },
            { name: 'BOA Sénégal', ticker: 'BOAS', roe: 12.8, per: 7.3, rendement: 3.3, croissance: 8.5 }],
    news: [{ titre: 'CBAO bénéficie du boom pétrolier sénégalais, crédits +18%', impact: 'positif', date: '2024-02-08', source: 'BCEAO' }],
    topdown: { economie: 'Sénégal: perspectives économiques très positives avec le pétrole et le gaz',
      economie_pts: 5, economie_note: 'positive', secteur: 'Sénégal deviendra un hub financier régional',
      secteur_pts: 5, secteur_note: 'positive', entreprise: 'Attijariwafa: force de frappe internationale',
      entreprise_pts: 4, entreprise_note: 'positive' }
  },

  NSIA: {
    ticker: 'NSIA', name: 'NSIA Participations', fullName: 'NSIA Participations CI',
    sector: 'Banque & Assurance', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Holding financière du groupe NSIA, banque et assurance en Afrique de l\'Ouest',
    cours: 8600, shares: 15000000, dividende: 301, per: 9.2, pbr: 2.0, rendement: 3.5, capitalisation: 129000,
    ca: generer(65000, 9), rex: generer(17000, 9.5), rn: generer(10800, 10),
    actif_total: generer(520000, 9), capitaux_propres: generer(68000, 8.5), dettes_financieres: generer(418000, 9),
    roe: genRatio(15.9, 19.0), roa: genRatio(2.1, 2.6), marge_nette: genRatio(16.6, 19.5),
    cours_historique: generer(7700, 1.5, 12),
    peers: [{ name: 'NSIA Participations', ticker: 'NSIA', roe: 19.0, per: 9.2, rendement: 3.5, croissance: 10.0 },
            { name: 'NSIA Banque', ticker: 'NSAB', roe: 13.5, per: 8.5, rendement: 2.8, croissance: 6.5 }],
    news: [{ titre: 'NSIA Participations: Bénéfice record 2023 +16%, dividende en hausse', impact: 'positif', date: '2024-02-12', source: 'NSIA Rapport' }],
    topdown: { economie: 'Assurance et banque: secteurs en consolidation en Afrique',
      economie_pts: 4, economie_note: 'positive', secteur: 'Taux de pénétration de l\'assurance faible, fort potentiel',
      secteur_pts: 5, secteur_note: 'positive', entreprise: 'Champion régional UEMOA, gestion exemplaire',
      entreprise_pts: 5, entreprise_note: 'positive' }
  },

  FTSC: {
    ticker: 'FTSC', name: 'Filtisac CI', fullName: 'Filtisac Côte d\'Ivoire',
    sector: 'Industrie textile', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Fabricant de sacs en polypropylène et emballages industriels',
    cours: 2100, shares: 5000000, dividende: 58, per: 10.2, pbr: 0.7, rendement: 2.8, capitalisation: 10500,
    ca: generer(14000, 3.5), rex: generer(2800, 4), rn: generer(1700, 4.5),
    actif_total: generer(22000, 3.5), capitaux_propres: generer(15000, 3.5), dettes_financieres: generer(4000, 1),
    roe: genRatio(11.3, 13.0), roa: genRatio(7.7, 9.0), marge_nette: genRatio(12.1, 14.0),
    cours_historique: generer(1900, 1, 12),
    peers: [{ name: 'Filtisac CI', ticker: 'FTSC', roe: 13.0, per: 10.2, rendement: 2.8, croissance: 4.5 }],
    news: [{ titre: 'Filtisac bénéficie de la croissance du secteur agricole: emballages en hausse', impact: 'positif', date: '2024-01-18', source: 'Filtisac CI' }],
    topdown: { economie: 'Agro-industrie ivoirienne en plein essor',
      economie_pts: 4, economie_note: 'positive', secteur: 'Emballage: demande liée à l\'agriculture',
      secteur_pts: 3, secteur_note: 'positive', entreprise: 'Niche captive, peu de concurrence locale',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  SEMC: {
    ticker: 'SEMC', name: 'SETAC CI', fullName: 'Société d\'Emballages et de Conditionnement CI',
    sector: 'Industrie', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Emballages en verre et plastique pour l\'industrie agroalimentaire',
    cours: 1850, shares: 4500000, dividende: 50, per: 9.8, pbr: 0.7, rendement: 2.7, capitalisation: 8325,
    ca: generer(11000, 3), rex: generer(2100, 3.5), rn: generer(1250, 4),
    actif_total: generer(18000, 3), capitaux_propres: generer(11800, 3), dettes_financieres: generer(3500, 1),
    roe: genRatio(10.6, 12.0), roa: genRatio(6.9, 8.0), marge_nette: genRatio(11.4, 13.0),
    cours_historique: generer(1680, 1, 12),
    peers: [{ name: 'SETAC CI', ticker: 'SEMC', roe: 12.0, per: 9.8, rendement: 2.7, croissance: 4.0 }],
    news: [{ titre: 'SETAC CI renouvelle son parc de machines d\'embouteillage', impact: 'positif', date: '2024-01-10', source: 'SETAC CI' }],
    topdown: { economie: 'Industrie ivoirienne de transformation en croissance',
      economie_pts: 3, economie_note: 'positive', secteur: 'Emballage lié à l\'agroalimentaire',
      secteur_pts: 3, secteur_note: 'positive', entreprise: 'Petite capitalisation, bonne rentabilité',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  NEIC: {
    ticker: 'NEIC', name: 'NEI-CEDA CI', fullName: 'Nouvelles Éditions Ivoiriennes / CEDA',
    sector: 'Édition & Médias', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Édition, impression et distribution de livres et supports pédagogiques en CI',
    cours: 450, shares: 3000000, dividende: 12, per: 12.5, pbr: 0.5, rendement: 2.7, capitalisation: 1350,
    ca: generer(5500, 3), rex: generer(900, 3.5), rn: generer(550, 4),
    actif_total: generer(7500, 2.5), capitaux_propres: generer(2700, 3), dettes_financieres: generer(2800, 1),
    roe: genRatio(20.4, 23.5), roa: genRatio(7.3, 8.5), marge_nette: genRatio(10.0, 11.5),
    cours_historique: generer(410, 1, 12),
    peers: [{ name: 'NEI-CEDA CI', ticker: 'NEIC', roe: 23.5, per: 12.5, rendement: 2.7, croissance: 4.0 }],
    news: [{ titre: 'NEI-CEDA remporte le marché des manuels scolaires 2024-2025', impact: 'positif', date: '2024-01-20', source: 'Ministère Education CI' }],
    topdown: { economie: 'Scolarisation en hausse en CI, demande en fournitures scolaires',
      economie_pts: 4, economie_note: 'positive', secteur: 'Numérisation menace l\'édition traditionnelle',
      secteur_pts: 2, secteur_note: 'negative', entreprise: 'Contrats publics sécurisés, niche défensive',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  SHEC: {
    ticker: 'SHEC', name: 'Société Hôtelière CI', fullName: 'Société Hôtelière et de Tourisme CI',
    sector: 'Tourisme & Hôtellerie', currency: 'FCFA', bourse: 'BRVM', pays: 'Côte d\'Ivoire',
    description: 'Gestion d\'hôtels et de résidences haut de gamme à Abidjan',
    cours: 3750, shares: 8000000, dividende: 112, per: 11.5, pbr: 1.4, rendement: 3.0, capitalisation: 30000,
    ca: generer(22000, 5.5), rex: generer(5000, 6), rn: generer(3200, 6.5),
    actif_total: generer(52000, 4.5), capitaux_propres: generer(28000, 5), dettes_financieres: generer(16000, 2),
    roe: genRatio(11.4, 13.5), roa: genRatio(6.2, 7.5), marge_nette: genRatio(14.5, 16.5),
    cours_historique: generer(3350, 1, 12),
    peers: [{ name: 'Société Hôtelière CI', ticker: 'SHEC', roe: 13.5, per: 11.5, rendement: 3.0, croissance: 6.5 }],
    news: [{ titre: 'Retour des touristes d\'affaires à Abidjan: taux d\'occupation à 78%', impact: 'positif', date: '2024-01-22', source: 'Hôtelier CI' }],
    topdown: { economie: 'CI premier hub économique d\'Afrique de l\'Ouest',
      economie_pts: 4, economie_note: 'positive', secteur: 'Tourisme d\'affaires en forte reprise post-Covid',
      secteur_pts: 4, secteur_note: 'positive', entreprise: 'Actifs immobiliers précieux à Abidjan',
      entreprise_pts: 3, entreprise_note: 'positive' }
  },

  ABBC: {
    ticker: 'ABBC', name: 'ABDJAN BANK', fullName: 'Banque pour le Commerce et l\'Industrie Mali (BCIM)',
    sector: 'Banque', currency: 'FCFA', bourse: 'BRVM', pays: 'Mali',
    description: 'Banque commerciale universelle au Mali, financement du commerce régional',
    cours: 3200, shares: 8500000, dividende: 92, per: 9.2, pbr: 0.8, rendement: 2.9, capitalisation: 27200,
    ca: generer(16000, 5), rex: generer(3800, 5.5), rn: generer(2400, 6),
    actif_total: generer(230000, 5.5), capitaux_propres: generer(25000, 5), dettes_financieres: generer(190000, 5.5),
    roe: genRatio(9.6, 11.0), roa: genRatio(1.0, 1.2), marge_nette: genRatio(15.0, 16.5),
    cours_historique: generer(2900, 1, 12),
    peers: [{ name: 'BCIM Mali', ticker: 'ABBC', roe: 11.0, per: 9.2, rendement: 2.9, croissance: 6.0 },
            { name: 'BOA Mali', ticker: 'BOAM', roe: 11.0, per: 7.5, rendement: 3.0, croissance: 6.5 }],
    news: [{ titre: 'Financement de corridors commerciaux Mali-CI malgré les tensions', impact: 'neutre', date: '2024-01-08', source: 'BCEAO' }],
    topdown: { economie: 'Mali: secteur formel résilient malgré le contexte géopolitique',
      economie_pts: 2, economie_note: 'negative', secteur: 'Financement du commerce transfrontalier',
      secteur_pts: 3, secteur_note: 'neutre', entreprise: 'Gestion prudente, capitaux solides',
      entreprise_pts: 3, entreprise_note: 'neutre' }
  }
};

// ==================== LISTE ORDONNÉE POUR LE SÉLECTEUR ====================
const BRVM_COMPANY_LIST = [
  // Télécommunications
  { ticker: 'SNTS',  name: 'Sonatel CI',       sector: 'Télécommunications',      pays: 'Sénégal/CI' },
  { ticker: 'ORCI',  name: 'Orange CI',         sector: 'Télécommunications',      pays: 'Côte d\'Ivoire' },
  { ticker: 'ONTBF', name: 'ONATEL BF',         sector: 'Télécommunications',      pays: 'Burkina Faso' },
  // Énergie & Utilités
  { ticker: 'CIEC',  name: 'CIE',               sector: 'Énergie & Électricité',   pays: 'Côte d\'Ivoire' },
  { ticker: 'SDCI',  name: 'SODECI',            sector: 'Eau & Utilités',          pays: 'Côte d\'Ivoire' },
  { ticker: 'BIDC',  name: 'CIPREL CI',         sector: 'Énergie & Électricité',   pays: 'Côte d\'Ivoire' },
  // Distribution Pétrolière
  { ticker: 'TTLC',  name: 'TotalEnergies CI',  sector: 'Distribution Pétrolière', pays: 'Côte d\'Ivoire' },
  { ticker: 'VIVO',  name: 'Vivo Energy CI',    sector: 'Distribution Pétrolière', pays: 'Côte d\'Ivoire' },
  // Agriculture
  { ticker: 'PALMC', name: 'Palm CI',           sector: 'Agriculture',             pays: 'Côte d\'Ivoire' },
  { ticker: 'SPHC',  name: 'SAPH CI',           sector: 'Agriculture',             pays: 'Côte d\'Ivoire' },
  { ticker: 'SOGBC', name: 'SOGB CI',           sector: 'Agriculture',             pays: 'Côte d\'Ivoire' },
  { ticker: 'SICC',  name: 'SICOR CI',          sector: 'Agriculture',             pays: 'Côte d\'Ivoire' },
  // Agroalimentaire / Industrie
  { ticker: 'NTLC',  name: 'Nestlé CI',         sector: 'Agroalimentaire',         pays: 'Côte d\'Ivoire' },
  { ticker: 'UNXC',  name: 'Unilever CI',       sector: 'Agroalimentaire',         pays: 'Côte d\'Ivoire' },
  { ticker: 'CABC',  name: 'SICABLE CI',        sector: 'Industrie électrique',    pays: 'Côte d\'Ivoire' },
  { ticker: 'SMBC',  name: 'SMB CI',            sector: 'Industrie du bois',       pays: 'Côte d\'Ivoire' },
  { ticker: 'FTSC',  name: 'Filtisac CI',       sector: 'Industrie textile',       pays: 'Côte d\'Ivoire' },
  { ticker: 'SEMC',  name: 'SETAC CI',          sector: 'Industrie',               pays: 'Côte d\'Ivoire' },
  { ticker: 'NEIC',  name: 'NEI-CEDA CI',       sector: 'Édition & Médias',        pays: 'Côte d\'Ivoire' },
  // Commerce & Distribution
  { ticker: 'CFAC',  name: 'CFAO CI',           sector: 'Commerce & Distribution', pays: 'Côte d\'Ivoire' },
  { ticker: 'PRSC',  name: 'PROSUMA CI',        sector: 'Commerce & Distribution', pays: 'Côte d\'Ivoire' },
  // BTP & Services
  { ticker: 'STAC',  name: 'SETAO CI',          sector: 'BTP & Travaux publics',   pays: 'Côte d\'Ivoire' },
  { ticker: 'SHEC',  name: 'Société Hôtelière', sector: 'Tourisme & Hôtellerie',   pays: 'Côte d\'Ivoire' },
  // Banques CI
  { ticker: 'BOACI', name: 'BOA CI',            sector: 'Banque',                  pays: 'Côte d\'Ivoire' },
  { ticker: 'ETIT',  name: 'Ecobank CI',        sector: 'Banque',                  pays: 'Côte d\'Ivoire' },
  { ticker: 'NSAB',  name: 'NSIA Banque CI',    sector: 'Banque & Assurance',      pays: 'Côte d\'Ivoire' },
  { ticker: 'SIBC',  name: 'SIB',               sector: 'Banque',                  pays: 'Côte d\'Ivoire' },
  { ticker: 'SGBCI', name: 'SGCI',              sector: 'Banque',                  pays: 'Côte d\'Ivoire' },
  { ticker: 'BICC',  name: 'BIC CI',            sector: 'Banque',                  pays: 'Côte d\'Ivoire' },
  { ticker: 'BNBC',  name: 'BNI CI',            sector: 'Banque',                  pays: 'Côte d\'Ivoire' },
  { ticker: 'SAFC',  name: 'SAFCA CI',          sector: 'Finance',                 pays: 'Côte d\'Ivoire' },
  { ticker: 'NSIA',  name: 'NSIA Participations', sector: 'Banque & Assurance',    pays: 'Côte d\'Ivoire' },
  // Banques sous-régionales
  { ticker: 'BOAB',  name: 'BOA Bénin',         sector: 'Banque',                  pays: 'Bénin' },
  { ticker: 'BOABF', name: 'BOA Burkina',        sector: 'Banque',                  pays: 'Burkina Faso' },
  { ticker: 'CBIBF', name: 'Coris Bank BF',      sector: 'Banque',                  pays: 'Burkina Faso' },
  { ticker: 'BOAM',  name: 'BOA Mali',           sector: 'Banque',                  pays: 'Mali' },
  { ticker: 'ABBC',  name: 'BCIM Mali',          sector: 'Banque',                  pays: 'Mali' },
  { ticker: 'BOAN',  name: 'BOA Niger',          sector: 'Banque',                  pays: 'Niger' },
  { ticker: 'BOAS',  name: 'BOA Sénégal',        sector: 'Banque',                  pays: 'Sénégal' },
  { ticker: 'CBAO',  name: 'CBAO Sénégal',       sector: 'Banque',                  pays: 'Sénégal' },
  { ticker: 'SGBS',  name: 'SG Bénin',           sector: 'Banque',                  pays: 'Bénin' },
  { ticker: 'BOAT',  name: 'BOA Togo',           sector: 'Banque',                  pays: 'Togo' },
  { ticker: 'ORDI',  name: 'Oragroup',           sector: 'Banque',                  pays: 'Togo' }
];

// ==================== DONNÉES TICKER BRVM ====================
const BRVM_TICKER_DATA = (() => {
  // Génère les items ticker à partir de la liste complète
  return BRVM_COMPANY_LIST.map(c => {
    const d = BRVM_COMPANIES[c.ticker];
    if (!d) return null;
    const chg = (Math.random() * 4 - 1.5).toFixed(1);
    return {
      symbol: d.ticker,
      price: d.cours,
      change: (parseFloat(chg) >= 0 ? '+' : '') + chg + '%',
      direction: parseFloat(chg) >= 0 ? 'up' : 'down'
    };
  }).filter(Boolean);
})();

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
