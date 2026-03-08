/**
 * =============================================================
 *  Fichier    : intl-data.js
 *  Projet     : Market Analyser
 *  Description: Données simulées pour les 6 entreprises internationales
 *               Valeurs en milliards USD ou EUR selon l'entreprise
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: (aucune)
 * =============================================================
 */

'use strict';

// ==================== ÉTIQUETTES COMMUNES ====================
const ANNEES_10_INTL = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'];
const MOIS_12_INTL = ['Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc', 'Jan', 'Fév'];

// ==================== DONNÉES DES ENTREPRISES INTERNATIONALES ====================
const INTL_COMPANIES = {

  // ------------------------------------------------------------------
  // APPLE INC. — Technologie (NASDAQ)
  // ------------------------------------------------------------------
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    fullName: 'Apple Inc.',
    sector: 'Technologie',
    sectorClass: 'tech',
    currency: 'USD',
    bourse: 'NASDAQ',
    pays: 'États-Unis',
    description: 'Leader mondial de l\'électronique grand public, logiciels et services numériques',

    cours: 185.2,
    shares: 15500000000, // 15.5 milliards d'actions
    dividende: 0.96,
    per: 29.2,
    pbr: 45.8,
    rendement: 0.52,
    capitalisation: 2870,  // milliards USD
    roe_actuel: 147.9,

    // Compte de résultat sur 10 ans (milliards USD)
    ca:  [182.8, 233.7, 215.6, 229.2, 265.6, 260.2, 274.5, 365.8, 394.3, 383.3],
    rex: [ 52.5,  71.2,  60.0,  61.3,  70.9,  63.9,  66.3, 108.9, 119.4, 114.3],
    rn:  [ 39.5,  53.4,  45.7,  48.4,  59.5,  55.3,  57.4,  94.7, 100.0,  97.0],

    // Bilan simplifié (milliards USD)
    actif_total: [231.8, 290.5, 321.7, 375.3, 365.7, 338.5, 323.9, 351.0, 352.8, 352.6],
    capitaux_propres: [111.5, 119.4,  128.3,  134.0,  107.1,  90.5,  65.3,  63.1,  50.7,   62.1],
    dettes_financieres: [28.9, 53.4,  75.4,  97.2, 103.2, 108.0,  98.7,  109.1, 110.0, 111.1],

    // Ratios
    roe: [ 35.4,  44.7, 36.1, 36.1, 55.6, 61.1, 88.0, 150.1, 197.2, 147.9],
    roa: [ 17.0,  18.4, 14.2, 12.9, 16.3, 16.3, 17.7,  27.0,  28.3,  27.5],
    marge_nette: [21.6, 22.8, 21.2, 21.1, 22.4, 21.2, 20.9,  25.9,  25.3,  25.3],

    // Cours boursier sur 12 mois (USD)
    cours_historique: [168.2, 170.5, 172.8, 175.1, 178.4, 180.2, 182.5, 184.0, 183.5, 185.2, 186.0, 185.2],

    // Pairs sectoriels
    peers: [
      { name: 'Apple', ticker: 'AAPL', roe: 147.9, per: 29.2, rendement: 0.52, croissance: 8.5 },
      { name: 'Microsoft', ticker: 'MSFT', roe: 38.0, per: 34.5, rendement: 0.72, croissance: 13.2 },
      { name: 'Samsung', ticker: '005930', roe: 12.1, per: 14.8, rendement: 2.1, croissance: 3.8 },
      { name: 'Alphabet', ticker: 'GOOGL', roe: 25.3, per: 24.1, rendement: 0.0, croissance: 12.8 }
    ],

    // Actualités Bottom-Up
    news: [
      { titre: 'Apple annonce des résultats T4 au-dessus des attentes avec iPhone 15', impact: 'positif', date: '2024-02-01', source: 'Bloomberg' },
      { titre: 'Lancement de l\'Apple Vision Pro : nouvelle catégorie de produits', impact: 'positif', date: '2024-01-22', source: 'TechCrunch' },
      { titre: 'Apple Services dépasse 100 Md$ de revenus annuels pour la première fois', impact: 'positif', date: '2023-12-15', source: 'Wall Street Journal' },
      { titre: 'Tensions géopolitiques Chine-USA : risque sur la chaîne d\'approvisionnement', impact: 'negatif', date: '2023-11-30', source: 'Reuters' },
      { titre: 'Apple conforme à la directive DMA européenne, ouvre l\'App Store à la concurrence', impact: 'neutre', date: '2024-01-10', source: 'Financial Times' }
    ],

    // Top-Down
    topdown: {
      economie: 'Économie américaine résiliente, consommation des ménages soutenue',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Tech reste dominante mais sous pression réglementaire aux USA et en Europe',
      secteur_pts: 3,
      secteur_note: 'neutre',
      entreprise: 'Apple capte la croissance du premium et des services, pouvoir de marque exceptionnel',
      entreprise_pts: 5,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // MICROSOFT — Technologie (NASDAQ)
  // ------------------------------------------------------------------
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft',
    fullName: 'Microsoft Corporation',
    sector: 'Technologie',
    sectorClass: 'tech',
    currency: 'USD',
    bourse: 'NASDAQ',
    pays: 'États-Unis',
    description: 'Leader mondial des logiciels, cloud computing et IA (Azure, Office 365, LinkedIn)',

    cours: 408.5,
    shares: 7430000000, // 7.43 milliards d'actions
    dividende: 2.96,
    per: 34.5,
    pbr: 12.8,
    rendement: 0.72,
    capitalisation: 3040, // milliards USD

    ca:  [ 86.8,  93.6,  85.3,  96.6, 110.4, 125.8, 143.0, 168.1, 198.3, 211.9],
    rex: [ 18.2,  18.2,  13.8,  29.3,  35.1,  43.0,  52.9,  69.9,  83.4,  88.5],
    rn:  [ 12.2,  12.2,  16.8,  21.2,  16.6,  39.2,  44.3,  61.3,  72.7,  72.4],

    actif_total: [172.4, 176.2, 193.7, 241.1, 258.9, 286.6, 301.3, 333.8, 364.8, 411.9],
    capitaux_propres: [ 89.0,  80.1,  71.9,  87.7,  82.7, 102.3, 118.3, 141.9, 166.5, 206.2],
    dettes_financieres: [ 22.4,  30.0,  40.8,  76.2,  72.2,  66.7,  59.6,  50.1,  47.0,  44.1],

    roe: [13.7, 15.2, 23.4, 24.2, 20.1, 38.4, 37.4, 43.2, 43.7, 35.1],
    roa: [ 7.1,  6.9,  8.7,  8.8,  6.4, 13.7, 14.7, 18.4, 19.9, 17.6],
    marge_nette: [14.1, 13.0, 19.7, 21.9, 15.0, 31.2, 31.0, 36.5, 36.7, 34.2],

    cours_historique: [385.2, 388.5, 392.1, 395.8, 399.2, 402.5, 405.1, 406.8, 407.5, 408.0, 408.8, 408.5],

    peers: [
      { name: 'Microsoft', ticker: 'MSFT', roe: 35.1, per: 34.5, rendement: 0.72, croissance: 13.2 },
      { name: 'Apple', ticker: 'AAPL', roe: 147.9, per: 29.2, rendement: 0.52, croissance: 8.5 },
      { name: 'Alphabet', ticker: 'GOOGL', roe: 25.3, per: 24.1, rendement: 0.0, croissance: 12.8 },
      { name: 'Amazon', ticker: 'AMZN', roe: 16.2, per: 52.8, rendement: 0.0, croissance: 11.2 }
    ],

    news: [
      { titre: 'Azure Cloud croît de 28% au T2 2024, dépasse les prévisions analystes', impact: 'positif', date: '2024-01-30', source: 'Bloomberg' },
      { titre: 'Copilot AI intégré dans toute la suite Office 365, adoption massive', impact: 'positif', date: '2024-01-15', source: 'CNBC' },
      { titre: 'Acquisition d\'Activision Blizzard finalisée à 69 Md$', impact: 'positif', date: '2023-10-18', source: 'Financial Times' },
      { titre: 'Enquête antitrust européenne sur Microsoft Teams vs Slack', impact: 'negatif', date: '2023-11-22', source: 'EU Commission' },
      { titre: 'Dividende augmenté de 10%, rachat d\'actions de 60 Md$', impact: 'positif', date: '2023-09-19', source: 'Microsoft IR' }
    ],

    topdown: {
      economie: 'Investissements massifs en IA des entreprises, Microsoft en première ligne',
      economie_pts: 5,
      economie_note: 'positive',
      secteur: 'Cloud computing et IA : megatendance sur 10 ans, Microsoft superbien positionnée',
      secteur_pts: 5,
      secteur_note: 'positive',
      entreprise: 'Partenariat OpenAI exclusif, Azure #2 mondial, Office partout en entreprise',
      entreprise_pts: 5,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // LVMH — Luxe (Euronext Paris)
  // ------------------------------------------------------------------
  MC: {
    ticker: 'MC',
    name: 'LVMH',
    fullName: 'LVMH Moët Hennessy Louis Vuitton SE',
    sector: 'Luxe',
    sectorClass: 'luxury',
    currency: 'EUR',
    bourse: 'Euronext',
    pays: 'France',
    description: 'Premier groupe mondial de produits de luxe (Louis Vuitton, Dior, Hennessy, Sephora...)',

    cours: 742.5,
    shares: 504000000,
    dividende: 13.0,
    per: 19.8,
    pbr: 4.1,
    rendement: 1.75,
    capitalisation: 374, // milliards EUR

    ca:  [ 35.7,  37.6,  37.6,  42.6,  46.8,  53.7,  44.7,  64.2,  79.2,  86.2],
    rex: [  6.6,   7.3,   7.0,   8.5,   9.9,  11.5,   8.3,  17.1,  21.1,  22.8],
    rn:  [  4.1,   4.6,   3.9,   5.1,   6.4,   7.2,   4.7,  12.0,  14.1,  15.2],

    actif_total: [ 56.1,  61.1,  63.3,  77.5,  90.5, 108.2, 113.2, 131.3, 148.8, 162.1],
    capitaux_propres: [ 26.1,  27.4,  28.2,  29.1,  32.2,  36.1,  38.1,  48.1,  55.1,  60.8],
    dettes_financieres: [  6.2,   6.8,   7.4,  10.8,  16.8,  18.2,  18.6,  18.8,  22.1,  24.5],

    roe: [15.7, 16.8, 13.8, 17.5, 19.9, 19.9, 12.3, 25.0, 25.6, 25.0],
    roa: [ 7.3,  7.5,  6.2,  6.6,  7.1,  6.7,  4.2,  9.1,  9.5,  9.4],
    marge_nette: [11.5, 12.2, 10.4, 12.0, 13.7, 13.4, 10.5, 18.7, 17.8, 17.6],

    cours_historique: [685.5, 695.2, 702.8, 710.5, 718.2, 725.5, 730.1, 735.8, 738.2, 740.5, 742.0, 742.5],

    peers: [
      { name: 'LVMH', ticker: 'MC', roe: 25.0, per: 19.8, rendement: 1.75, croissance: 9.2 },
      { name: 'Hermès', ticker: 'RMS', roe: 35.2, per: 48.5, rendement: 0.65, croissance: 15.8 },
      { name: 'Kering', ticker: 'KER', roe: 18.5, per: 14.2, rendement: 4.2, croissance: 3.1 },
      { name: 'Richemont', ticker: 'CFR', roe: 20.1, per: 22.8, rendement: 1.4, croissance: 11.4 }
    ],

    news: [
      { titre: 'LVMH: revenus mode et maroquinerie en légère décélération au T4 2023', impact: 'neutre', date: '2024-01-25', source: 'Bloomberg' },
      { titre: 'L\'Asie du Pacifique redevient moteur de croissance: +12% en 2023', impact: 'positif', date: '2024-01-18', source: 'Reuters' },
      { titre: 'Acquisition de Moncler à l\'étude, valorisation 13 Md EUR', impact: 'positif', date: '2023-12-10', source: 'Les Échos' },
      { titre: 'Bernard Arnault cède 10M d\'actions LVMH dans le cadre de la planification successorale', impact: 'neutre', date: '2023-11-15', source: 'AMF Déclaration' },
      { titre: 'Ouverture d\'une mega-boutique Louis Vuitton à Shanghai', impact: 'positif', date: '2023-10-20', source: 'WWD' }
    ],

    topdown: {
      economie: 'Richesse mondiale en hausse, clientèle UHNWI (Ultra High Net Worth) en croissance',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'Luxe structurellement hors cycle, aspirationnel en Chine et Inde',
      secteur_pts: 4,
      secteur_note: 'positive',
      entreprise: 'Portefeuille de marques inégalé, pricing power exceptionnel, position de dominance',
      entreprise_pts: 5,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // TESLA — Automobile / Énergie (NASDAQ)
  // ------------------------------------------------------------------
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla',
    fullName: 'Tesla Inc.',
    sector: 'Automobile & Énergie',
    sectorClass: 'auto',
    currency: 'USD',
    bourse: 'NASDAQ',
    pays: 'États-Unis',
    description: 'Constructeur de véhicules électriques et solutions d\'énergie renouvelable',

    cours: 198.5,
    shares: 3170000000, // 3.17 milliards
    dividende: 0,
    per: 48.2,
    pbr: 11.5,
    rendement: 0,
    capitalisation: 629, // milliards USD

    ca:  [  3.2,   4.0,   7.0,  11.8,  21.5,  24.6,  31.5,  53.8,  81.5,  96.8],
    rex: [ -0.2,  -0.7,  -0.7,  -2.0,   0.4,   0.6,   1.99,  6.5,  13.7,   8.9],
    rn:  [ -0.3,  -0.9,  -0.7,  -1.9,   0.0,  -0.9,   0.7,   5.5,  12.6,   15.0],

    actif_total: [  8.1,  11.0,  22.7,  28.7,  34.3,  34.3,  52.1,  62.1,  82.3,  96.0],
    capitaux_propres: [  2.0,   2.7,   4.7,   4.2,   4.1,   6.6,  22.2,  30.2,  44.7,  62.6],
    dettes_financieres: [  2.8,   4.9,  10.7,  11.4,  11.5,  14.5,  10.8,   8.8,   3.4,   2.6],

    roe: [-15.0, -33.3, -14.9, -45.2, -0.0, -13.6, 3.2, 18.2, 28.2, 24.0],
    roa: [ -3.7,  -8.2,  -3.1,  -6.6, -0.0,  -2.6, 1.3,  8.9, 15.3, 15.6],
    marge_nette: [ -9.4, -22.5, -10.0, -16.1, -0.0, -3.7, 2.2, 10.2, 15.5, 15.5],

    cours_historique: [225.1, 218.5, 210.2, 205.8, 200.5, 195.2, 192.5, 194.8, 196.2, 198.0, 199.5, 198.5],

    peers: [
      { name: 'Tesla', ticker: 'TSLA', roe: 24.0, per: 48.2, rendement: 0.0, croissance: 46.9 },
      { name: 'BYD', ticker: 'BYDDY', roe: 18.5, per: 16.8, rendement: 0.8, croissance: 38.2 },
      { name: 'Stellantis', ticker: 'STLA', roe: 22.1, per: 4.2, rendement: 8.5, croissance: 15.4 },
      { name: 'Volkswagen', ticker: 'VOW3', roe: 9.5, per: 4.8, rendement: 6.2, croissance: 5.1 }
    ],

    news: [
      { titre: 'Tesla réduit ses prix en Europe et en Chine : pression sur les marges', impact: 'negatif', date: '2024-01-20', source: 'Reuters' },
      { titre: 'Tesla Energy (Megapack) atteint 14.7 GWh de déploiements en 2023', impact: 'positif', date: '2024-01-08', source: 'Tesla Report' },
      { titre: 'FSD v12 annoncé: conduite entièrement autonome basée sur l\'IA neurale', impact: 'positif', date: '2023-12-05', source: 'Electrek' },
      { titre: 'Perturbations en usine en Allemagne : grèves et manifestations', impact: 'negatif', date: '2024-01-15', source: 'DPA' },
      { titre: 'Cybertruck livré : 10 000 véhicules en attente, carnet plein', impact: 'positif', date: '2023-11-30', source: 'Tesla Blog' }
    ],

    topdown: {
      economie: 'Passage aux véhicules électriques soutenu par les politiques gouvernementales',
      economie_pts: 4,
      economie_note: 'positive',
      secteur: 'VE en forte croissance mais concurrence accrue (BYD, Rivian, Ford EV)',
      secteur_pts: 3,
      secteur_note: 'neutre',
      entreprise: 'Tesla pionnier mais marges sous pression, risque Musk (Twitter/xAI)',
      entreprise_pts: 3,
      entreprise_note: 'neutre'
    }
  },

  // ------------------------------------------------------------------
  // TOTALENERGIES — Énergie (Euronext Paris)
  // ------------------------------------------------------------------
  TTE: {
    ticker: 'TTE',
    name: 'TotalEnergies',
    fullName: 'TotalEnergies SE',
    sector: 'Énergie',
    sectorClass: 'energy',
    currency: 'EUR',
    bourse: 'Euronext',
    pays: 'France',
    description: 'Major pétrolier et gazier français en transition vers les énergies renouvelables',

    cours: 62.5,
    shares: 2400000000, // 2.4 milliards
    dividende: 3.22,
    per: 8.8,
    pbr: 1.2,
    rendement: 5.15,
    capitalisation: 150, // milliards EUR

    ca:  [211.2, 143.4, 127.9, 149.1, 184.1, 176.2, 119.7, 184.7, 263.3, 237.8],
    rex: [ 11.8,   4.3,   6.2,  12.3,  16.0,   9.4,   1.0,  19.2,  33.4,  23.8],
    rn:  [  4.2,   5.1,   6.2,   8.6,  11.4,  11.3,  -7.2,  16.0,  20.5,  21.4],

    actif_total: [230.0, 215.0, 218.0, 228.0, 240.0, 262.1, 272.6, 285.8, 307.0, 321.5],
    capitaux_propres: [ 93.0,  86.0,  88.0,  93.0,  99.0, 104.0,  96.5, 115.5, 132.0, 134.0],
    dettes_financieres: [ 42.5,  45.2,  42.3,  43.8,  44.2,  55.2,  57.5,  48.2,  40.5,  38.2],

    roe: [ 4.5,  5.9,  7.0,  9.2, 11.5, 10.9, -7.5, 13.8, 15.5, 16.0],
    roa: [ 1.8,  2.4,  2.8,  3.8,  4.8,  4.3, -2.6,  5.6,  6.7,  6.7],
    marge_nette: [ 2.0,  3.6,  4.8,  5.8,  6.2,  6.4, -6.0,  8.7,  7.8,  9.0],

    cours_historique: [58.2, 59.1, 59.8, 60.5, 61.0, 61.8, 62.1, 62.3, 62.5, 62.8, 62.6, 62.5],

    peers: [
      { name: 'TotalEnergies', ticker: 'TTE', roe: 16.0, per: 8.8, rendement: 5.15, croissance: 1.2 },
      { name: 'Shell', ticker: 'SHEL', roe: 13.5, per: 9.2, rendement: 4.2, croissance: 0.8 },
      { name: 'BP', ticker: 'BP', roe: 11.2, per: 9.8, rendement: 5.8, croissance: -1.2 },
      { name: 'Equinor', ticker: 'EQNR', roe: 29.5, per: 7.5, rendement: 9.5, croissance: 2.1 }
    ],

    news: [
      { titre: 'TotalEnergies rachète 2 Md€ d\'actions propres au T1 2024', impact: 'positif', date: '2024-02-08', source: 'Total IR' },
      { titre: 'Investissement de 5 Md$ dans les énergies renouvelables en 2024', impact: 'positif', date: '2024-01-18', source: 'Bloomberg' },
      { titre: 'Baisse du prix du Brent à 78 $/baril : pression sur les revenus', impact: 'negatif', date: '2024-01-10', source: 'IEA' },
      { titre: 'Découverte d\'un nouveau gisement en offshore Brésil (pré-sel)', impact: 'positif', date: '2023-12-20', source: 'Petrobras/Total' },
      { titre: 'Critiques ONG sur les émissions carbone de Total : procédure judiciaire', impact: 'negatif', date: '2023-11-28', source: 'Friends of Earth' }
    ],

    topdown: {
      economie: 'Demande mondiale en énergie stable, transition en cours mais pétrole encore roi',
      economie_pts: 3,
      economie_note: 'neutre',
      secteur: 'Secteur énergie sous pression de la transition mais flux de trésorerie solides',
      secteur_pts: 3,
      secteur_note: 'neutre',
      entreprise: 'TotalEnergies bien positionnée sur la transition, dividende attractif et sécurisé',
      entreprise_pts: 4,
      entreprise_note: 'positive'
    }
  },

  // ------------------------------------------------------------------
  // BNP PARIBAS — Banque (Euronext Paris)
  // ------------------------------------------------------------------
  BNP: {
    ticker: 'BNP',
    name: 'BNP Paribas',
    fullName: 'BNP Paribas S.A.',
    sector: 'Banque',
    sectorClass: 'banking',
    currency: 'EUR',
    bourse: 'Euronext',
    pays: 'France',
    description: 'Première banque de la zone euro, présente dans 65 pays, services financiers universels',

    cours: 62.8,
    shares: 1260000000, // 1.26 milliards
    dividende: 4.60,
    per: 7.2,
    pbr: 0.72,
    rendement: 7.3,
    capitalisation: 79, // milliards EUR

    ca:  [39.1, 42.4, 43.4, 43.2, 44.6, 44.6, 44.3, 46.2, 50.4, 48.8],
    rex: [ 7.9,  8.6,  8.8,  9.5, 10.0,  9.7,  7.1, 13.2, 15.9, 14.2],
    rn:  [ 6.7,  6.7,  7.7,  7.8,  7.5,  8.2,  7.1, 10.0, 10.2,  11.0],

    actif_total: [1994, 1994, 2076, 1951, 2041, 2165, 2488, 2638, 2675, 2588],
    capitaux_propres: [  95,   96,   99,  101,  105,  107,  112,  117,  122,  127],
    dettes_financieres: [430, 448, 465, 428, 452, 478, 520, 558, 545, 512],

    roe: [ 7.1,  7.0,  7.8,  7.7,  7.1,  7.7,  6.3,  8.5,  8.3,  8.7],
    roa: [ 0.34, 0.34, 0.37, 0.40, 0.37, 0.38, 0.29, 0.38, 0.38, 0.42],
    marge_nette: [17.1, 15.8, 17.7, 18.1, 16.8, 18.4, 16.0, 21.6, 20.2, 22.5],

    cours_historique: [57.2, 58.1, 59.0, 59.8, 60.5, 61.2, 61.8, 62.1, 62.4, 62.6, 62.8, 62.8],

    peers: [
      { name: 'BNP Paribas', ticker: 'BNP', roe: 8.7, per: 7.2, rendement: 7.3, croissance: 2.5 },
      { name: 'Société Générale', ticker: 'GLE', roe: 7.2, per: 6.8, rendement: 8.5, croissance: 1.8 },
      { name: 'Crédit Agricole', ticker: 'ACA', roe: 10.5, per: 8.1, rendement: 6.8, croissance: 3.2 },
      { name: 'Deutsche Bank', ticker: 'DBK', roe: 5.2, per: 7.5, rendement: 4.2, croissance: 3.5 }
    ],

    news: [
      { titre: 'BNP Paribas affiche un bénéfice net de 11 Md€ pour 2023, record', impact: 'positif', date: '2024-02-06', source: 'BNP IR' },
      { titre: 'Plan stratégique 2024: simplification de l\'organisation, 900 M€ d\'économies', impact: 'positif', date: '2024-01-28', source: 'Bloomberg' },
      { titre: 'Remontée des taux BCE bénéfique à la marge nette d\'intérêt', impact: 'positif', date: '2023-12-20', source: 'BCE' },
      { titre: 'Ralentissement économique en Allemagne: impact sur CIB de BNP', impact: 'negatif', date: '2023-11-15', source: 'Reuters' },
      { titre: 'Cession de Bank of the West USA (MUFG): 16 Md$ de capital libéré', impact: 'positif', date: '2023-10-05', source: 'BNP Communiqué' }
    ],

    topdown: {
      economie: 'Zone euro en légère récession mais BCE en cycle de baisse de taux en 2024',
      economie_pts: 3,
      economie_note: 'neutre',
      secteur: 'Banques européennes attractives: PBR bas, dividendes élevés, mais croissance limitée',
      secteur_pts: 3,
      secteur_note: 'neutre',
      entreprise: 'BNP leader européen, diversification géographique, excellente gestion des risques',
      entreprise_pts: 4,
      entreprise_note: 'positive'
    }
  }
};

// ==================== LISTE ORDONNÉE POUR LE SÉLECTEUR ====================
const INTL_COMPANY_LIST = [
  { ticker: 'AAPL', name: 'Apple Inc.',      sector: 'Technologie',         bourse: 'NASDAQ', currency: 'USD' },
  { ticker: 'MSFT', name: 'Microsoft',       sector: 'Technologie',         bourse: 'NASDAQ', currency: 'USD' },
  { ticker: 'MC',   name: 'LVMH',            sector: 'Luxe',                bourse: 'Euronext', currency: 'EUR' },
  { ticker: 'TSLA', name: 'Tesla',           sector: 'Automobile & Énergie', bourse: 'NASDAQ', currency: 'USD' },
  { ticker: 'TTE',  name: 'TotalEnergies',   sector: 'Énergie',             bourse: 'Euronext', currency: 'EUR' },
  { ticker: 'BNP',  name: 'BNP Paribas',    sector: 'Banque',              bourse: 'Euronext', currency: 'EUR' }
];

// ==================== DONNÉES TICKER INTERNATIONAL ====================
const INTL_TICKER_DATA = [
  { symbol: 'AAPL',  price: '$185.2',  change: '+0.8%', direction: 'up' },
  { symbol: 'MSFT',  price: '$408.5',  change: '+1.2%', direction: 'up' },
  { symbol: 'MC.PA', price: '€742.5',  change: '+0.4%', direction: 'up' },
  { symbol: 'TSLA',  price: '$198.5',  change: '-1.5%', direction: 'down' },
  { symbol: 'TTE.PA', price: '€62.5', change: '+0.3%', direction: 'up' },
  { symbol: 'BNP.PA', price: '€62.8', change: '+0.5%', direction: 'up' },
  { symbol: 'NVDA',  price: '$845.0',  change: '+3.2%', direction: 'up' },
  { symbol: 'AMZN',  price: '$178.2',  change: '+0.9%', direction: 'up' },
  { symbol: 'CAC 40', price: '7821',   change: '+0.6%', direction: 'up' },
  { symbol: 'S&P 500', price: '5021',  change: '+0.4%', direction: 'up' }
];

// ==================== EXPORTS ====================
if (typeof window !== 'undefined') {
  window.IntlData = {
    INTL_COMPANIES,
    INTL_COMPANY_LIST,
    INTL_TICKER_DATA,
    ANNEES_10_INTL,
    MOIS_12_INTL
  };
}
