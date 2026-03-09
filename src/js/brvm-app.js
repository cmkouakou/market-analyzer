/**
 * =============================================================
 *  Fichier    : brvm-app.js
 *  Projet     : Market Analyser
 *  Description: Logique principale du module BRVM/UEMOA
 *               Gestion de l'état, des événements, des graphiques et du scoring
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Version    : 1.1
 *  Dépendances: scoring.js, charts.js, brvm-data.js, Chart.js 4.x,
 *               api-config.js, api-cache.js, brvm-api.js
 * =============================================================
 */

'use strict';

// ==================== VARIABLES GLOBALES ====================
let entrepriseActive = 'SNTS'; // Entreprise sélectionnée par défaut
let donneesActuelles = null;   // Cache des données de l'entreprise courante
let scoreActuel = null;        // Cache du score calculé
let chartModal = null;         // Instance Chart.js dans le modal élargi

// ==================== FORMATAGE DEVISE ====================

/**
 * Formate un montant en millions FCFA vers un affichage lisible
 * Ex : 843000 → "843 Mrd" | 1640000 → "1 640 Mrd"
 * Pas d'unité "FCFA" dans la valeur — le badge devise est dans le header
 *
 * @param {number} valeurMillions - Valeur en millions FCFA
 * @returns {string} Valeur formatée
 */
function formaterMrd(valeurMillions) {
  const mrd = valeurMillions / 1000;
  if (mrd >= 1000) {
    return (mrd / 1000).toFixed(2) + ' Bill.';
  }
  return mrd.toLocaleString('fr-FR', { maximumFractionDigits: 1 }) + ' Mrd';
}

/**
 * Retourne les deux années extrêmes de ANNEES_10 pour les labels KPI
 * @returns {string} ex: "2017 → 2026"
 */
function labelPeriode() {
  const a = BRVMData.ANNEES_10;
  return `${a[0]} → ${a[a.length - 1]}`;
}

// ==================== INITIALISATION ====================

/**
 * Point d'entrée principal — lancé au chargement du DOM
 * Affiche d'abord les données mock immédiatement, puis charge les données réelles en arrière-plan
 */
document.addEventListener('DOMContentLoaded', async function() {
  initialiserInterface();
  remplirSélecteurEntreprises();
  remplirTickerBRVM();

  // Phase 1 : affichage immédiat avec données mock (expérience fluide)
  chargerEntreprise(entrepriseActive);

  initialiserSidebar();
  initialiserSimulateur();
  initialiserAccordeons();

  // Phase 2 : chargement des données réelles en arrière-plan
  await chargerDonneesLive(entrepriseActive);

  // Mise à jour du ticker avec les cotations réelles
  await mettreAJourTickerLive();
});

/**
 * Initialise les éléments communs de l'interface
 */
function initialiserInterface() {
  // Gestion du bouton menu mobile
  const btnMenu = document.getElementById('btnMenuMobile');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  if (btnMenu) {
    btnMenu.addEventListener('click', function() {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('visible');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', function() {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('visible');
    });
  }
}

/**
 * Remplit le sélecteur d'entreprises avec les données BRVM
 */
function remplirSélecteurEntreprises() {
  const select = document.getElementById('selectEntreprise');
  if (!select) return;

  BRVMData.BRVM_COMPANY_LIST.forEach(({ ticker, name, sector }) => {
    const option = document.createElement('option');
    option.value = ticker;
    option.textContent = `${name} (${ticker})`;
    select.appendChild(option);
  });

  select.addEventListener('change', function() {
    chargerEntreprise(this.value);
  });
}

/**
 * Remplit la barre de ticker BRVM
 */
function remplirTickerBRVM() {
  const tickerInner = document.getElementById('tickerInner');
  if (!tickerInner) return;

  // Duplication pour l'animation en boucle continue
  const items = [...BRVMData.BRVM_TICKER_DATA, ...BRVMData.BRVM_TICKER_DATA];
  tickerInner.innerHTML = items.map(item => `
    <span class="ticker-item">
      <span class="ticker-symbol">${item.symbol}</span>
      <span class="ticker-price">${Number(item.price).toLocaleString('fr-FR')} FCFA</span>
      <span class="ticker-change ${item.direction}">${item.change}</span>
    </span>
  `).join('');
}

// ==================== CHARGEMENT D'UNE ENTREPRISE ====================

/**
 * Charge et affiche toutes les données d'une entreprise
 *
 * @param {string} ticker - Code BRVM de l'entreprise
 */
function chargerEntreprise(ticker) {
  const donnees = BRVMData.BRVM_COMPANIES[ticker];
  if (!donnees) return;

  entrepriseActive = ticker;
  donneesActuelles = donnees;

  // Calcul du score 3P
  scoreActuel = Scoring.calculerScore3P({
    ca: donnees.ca,
    rex: donnees.rex,
    rn: donnees.rn,
    news: donnees.news,
    topdown: donnees.topdown,
    per: donnees.per,
    pbr: donnees.pbr,
    dividende: donnees.dividende,
    cours: donnees.cours,
    rendement: donnees.rendement,
    name: donnees.name
  });

  // Mise à jour de l'interface
  mettreAJourEntete(donnees, scoreActuel);
  mettreAJourKPI(donnees);
  mettreAJourGraphiquesPerformance(donnees);
  mettreAJourActifs(donnees);
  mettreAJourFinancement(donnees);
  mettreAJourSectoriel(donnees);
  mettreAJourPrixAction(donnees, scoreActuel);
  mettreAJourBottomUp(donnees);
  mettreAJourTopDown(donnees);
  mettreAJourSimulateur();
  mettreAJourScore(scoreActuel);

  // Chargement des données live en arrière-plan (ne bloque pas l'UI)
  if (brvmApi) {
    chargerDonneesLive(ticker);
  }
}

// ==================== CHARGEMENT DES DONNÉES LIVE ====================

/**
 * Charge les données temps réel et enrichit l'affichage
 * Si l'API est indisponible, les données mock restent affichées
 *
 * @param {string} ticker - Code BRVM de l'entreprise
 */
async function chargerDonneesLive(ticker) {
  // Si l'API n'est pas encore initialisée, on attend
  if (!brvmApi) return;

  try {
    // Chargement parallèle de la cotation et de l'historique
    const [cotationLive, historiqueLive] = await Promise.all([
      brvmApi.getQuote(ticker),
      brvmApi.getHistorical(ticker, 10),
    ]);

    // Enrichissement des données mock avec les données live
    const donneesMock = BRVMData.BRVM_COMPANIES[ticker];
    if (!donneesMock) return;

    const donneesEnrichies = fusionnerAvecDonneesLive(donneesMock, cotationLive, historiqueLive);

    // Re-rendu uniquement si le ticker n'a pas changé entre-temps
    if (ticker === entrepriseActive) {
      entrepriseActive = ticker;
      donneesActuelles = donneesEnrichies;

      // Mise à jour des sections qui bénéficient des données live
      mettreAJourEntete(donneesEnrichies, scoreActuel);
      mettreAJourPrixAction(donneesEnrichies, scoreActuel);

      // Indicateur de source
      showDataSourceIndicator(cotationLive.source === 'mock' ? 'mock' : 'live');

      if (cotationLive.source !== 'mock') {
        console.info(`[App] Données live chargées pour ${ticker} — source : ${cotationLive.source}`);
      }
    }
  } catch (err) {
    console.warn('[App] Utilisation des données simulées :', err.message);
    showDataSourceIndicator('mock');
  }
}

/**
 * Fusionne les données live avec les données mock
 * Les données fondamentales (PER, PBR, etc.) viennent toujours du mock
 * Les données de prix et volume viennent de l'API si disponibles
 *
 * @param {Object} donneesMock      - Données simulées de référence
 * @param {Object} cotationLive     - Cotation temps réel depuis l'API
 * @param {Object} historiqueLive   - Historique de cours depuis l'API
 * @returns {Object} Données fusionnées prêtes pour l'affichage
 */
function fusionnerAvecDonneesLive(donneesMock, cotationLive, historiqueLive) {
  // Copie profonde pour ne pas modifier le mock
  const donneesFusionnees = Object.assign({}, donneesMock);

  // Mise à jour du cours actuel si disponible et valide
  if (cotationLive.source !== 'mock' && cotationLive.close > 0) {
    donneesFusionnees.cours = cotationLive.close;
    donneesFusionnees.cours_live = cotationLive;

    // Recalcul du rendement avec le cours live
    if (donneesMock.dividende && cotationLive.close > 0) {
      donneesFusionnees.rendement = (donneesMock.dividende / cotationLive.close) * 100;
    }
  }

  // Mise à jour de l'historique si assez de points de données
  if (
    historiqueLive.source !== 'mock' &&
    historiqueLive.close &&
    historiqueLive.close.length >= 12
  ) {
    // Utilisation des 12 derniers mois de l'historique live pour le graphique
    const nbPoints = 12;
    const closeRecents = historiqueLive.close.slice(-nbPoints);
    const datesRecentes = historiqueLive.dates.slice(-nbPoints).map(d => {
      // Formatage des dates en libellé court (ex: "Jan")
      try {
        return new Date(d).toLocaleDateString('fr-FR', { month: 'short' });
      } catch {
        return d;
      }
    });

    donneesFusionnees.cours_historique = closeRecents;
    donneesFusionnees.labels_historique = datesRecentes;
    donneesFusionnees.historique_source = 'live';
  }

  return donneesFusionnees;
}

/**
 * Met à jour la barre ticker avec les cotations live
 */
async function mettreAJourTickerLive() {
  if (!brvmApi) return;

  try {
    const toutesLesCotations = await brvmApi.getAllQuotes();

    const tickerInner = document.getElementById('tickerInner');
    if (!tickerInner) return;

    // Transformation en format ticker
    const items = toutesLesCotations.map(c => ({
      symbol: c.ticker,
      price: c.close || 0,
      change: `${c.change_p >= 0 ? '+' : ''}${(c.change_p || 0).toFixed(1)}%`,
      direction: (c.change_p || 0) >= 0 ? 'up' : 'down',
    }));

    // Duplication pour l'animation en boucle continue
    const itemsDuplication = [...items, ...items];
    tickerInner.innerHTML = itemsDuplication.map(item => `
      <span class="ticker-item">
        <span class="ticker-symbol">${item.symbol}</span>
        <span class="ticker-price">${Number(item.price).toLocaleString('fr-FR')} FCFA</span>
        <span class="ticker-change ${item.direction}">${item.change}</span>
      </span>
    `).join('');
  } catch (err) {
    console.warn('[App] Erreur mise à jour ticker live :', err.message);
    // Le ticker reste avec les données mock affichées initialement
  }
}

/**
 * Actualise toutes les données pour l'entreprise active
 * Appelé par le bouton "Actualiser" du header
 */
async function actualiserDonnees() {
  const btn = document.getElementById('btnActualiser');
  if (btn) btn.classList.add('spinning');

  // Vider le cache pour forcer un rechargement
  if (window.ApiCache) {
    window.ApiCache.cacheQuotes.clear(`cotation_${entrepriseActive}`);
  }

  await chargerDonneesLive(entrepriseActive);
  await mettreAJourTickerLive();

  if (btn) {
    setTimeout(() => btn.classList.remove('spinning'), 600);
  }
}

// ==================== EN-TÊTE ====================

/**
 * Met à jour l'en-tête : nom d'entreprise, badge de score, cours actuel
 *
 * @param {Object} donnees - Données de l'entreprise
 * @param {Object} score   - Résultat du scoring 3P
 */
function mettreAJourEntete(donnees, score) {
  // Nom et ticker de l'entreprise
  mettreAJourElement('companyName', donnees.name);
  mettreAJourElement('companyTicker', donnees.ticker);
  mettreAJourElement('companyMeta',
    `${donnees.sector} · ${donnees.pays} · ${Number(donnees.cours).toLocaleString('fr-FR')} FCFA`);

  // Nom de l'entreprise dans le CTA simulateur
  mettreAJourElement('simCompanyName', donnees.name);
  mettreAJourElement('simModalSubtitle', `${donnees.name} (${donnees.ticker})`);

  // Score ring dans l'en-tête
  mettreAJourScoreRing('headerScoreRing', 'headerScoreValue', score.score, score.recommandationClass);

  // Mise à jour du sélecteur
  const select = document.getElementById('selectEntreprise');
  if (select && select.value !== donnees.ticker) select.value = donnees.ticker;
}

/**
 * Met à jour un score ring CSS (en-tête ou section score)
 *
 * @param {string} ringId   - ID du conteneur ring
 * @param {string} valueId  - ID de l'élément valeur
 * @param {number} score    - Score (0-100)
 * @param {string} classe   - Classe CSS de la recommandation
 */
function mettreAJourScoreRing(ringId, valueId, score, classe) {
  const ring = document.getElementById(ringId);
  const valEl = document.getElementById(valueId);

  if (ring) {
    ring.style.setProperty('--score', score);

    // Couleur selon la recommandation
    const couleurs = { acheter: '#2ecc71', surveiller: '#f39c12', eviter: '#e74c3c' };
    ring.style.background = `conic-gradient(${couleurs[classe] || '#2ecc71'} calc(${score} * 3.6deg), #1a3320 0)`;
  }

  if (valEl) valEl.textContent = score;
}

// ==================== KPI ====================

/**
 * Met à jour les cartes KPI (CA, REX, RN)
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourKPI(donnees) {
  const { ca, rex, rn } = donnees;
  const n = ca.length;

  const anneeRecente = BRVMData.ANNEES_10[n - 1]; // année la plus récente dans les données

  // KPI Chiffre d'affaires
  const cagrCA = Scoring.calculerCAGR(ca[0], ca[n - 1], n - 1);
  mettreAJourCarteKPI('kpiCA', 'kpiCAcagr', 'kpiCAtend', formaterMrd(ca[n - 1]), cagrCA, anneeRecente);

  // KPI Résultat d'exploitation
  const cagrREX = Scoring.calculerCAGR(rex[0], rex[n - 1], n - 1);
  mettreAJourCarteKPI('kpiREX', 'kpiREXcagr', 'kpiREXtend', formaterMrd(rex[n - 1]), cagrREX, anneeRecente);

  // KPI Résultat net
  const cagrRN = Scoring.calculerCAGR(rn[0], rn[n - 1], n - 1);
  mettreAJourCarteKPI('kpiRN', 'kpiRNcagr', 'kpiRNtend', formaterMrd(rn[n - 1]), cagrRN, anneeRecente);
}

/**
 * Met à jour une carte KPI individuelle
 *
 * @param {string} valueId  - ID de la valeur
 * @param {string} cagrId   - ID du CAGR
 * @param {string} tendId   - ID de l'icône tendance
 * @param {string} valeur   - Valeur formatée
 * @param {number} cagr     - CAGR en %
 * @param {string} label    - Label descriptif
 */
function mettreAJourCarteKPI(valueId, cagrId, tendId, valeur, cagr, label) {
  const elVal = document.getElementById(valueId);
  const elCagr = document.getElementById(cagrId);
  const elTend = document.getElementById(tendId);

  if (elVal) elVal.textContent = valeur;

  if (elCagr) {
    elCagr.textContent = `CAGR ${cagr.toFixed(1)}%`;
    elCagr.className = 'kpi-cagr ' + (cagr >= 0 ? 'positive' : 'negative');
  }

  if (elTend) {
    if (cagr >= 5) { elTend.textContent = '↑'; elTend.className = 'kpi-trend up'; }
    else if (cagr >= 0) { elTend.textContent = '→'; elTend.className = 'kpi-trend neutral'; }
    else { elTend.textContent = '↓'; elTend.className = 'kpi-trend down'; }
  }

  // Mise à jour du label de période (dynamique, ex: "2017 → 2026")
  const periodId = valueId + 'Period'; // kpiCA → kpiCAPeriod
  mettreAJourElement(periodId, labelPeriode());
}

// ==================== GRAPHIQUES DE PERFORMANCE ====================

/**
 * Affiche les 3 graphiques linéaires (CA, REX, RN) sur 10 ans
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourGraphiquesPerformance(donnees) {
  const couleurs = Charts.obtenirCouleurs();
  const labels = BRVMData.ANNEES_10;

  const formaterFCFA = v => {
    if (v >= 1000000) return (v / 1000000).toFixed(1) + ' T FCFA';
    if (v >= 1000) return (v / 1000).toFixed(0) + ' Mrd';
    return v + ' M';
  };

  Charts.creerGraphiqueLigne('chartCA', labels, donnees.ca,
    'Chiffre d\'affaires', couleurs.principal, formaterFCFA);

  Charts.creerGraphiqueLigne('chartREX', labels, donnees.rex,
    'Résultat d\'exploitation', couleurs.secondaire, formaterFCFA);

  Charts.creerGraphiqueLigne('chartRN', labels, donnees.rn,
    'Résultat net', couleurs.tertiaire, formaterFCFA);
}

// ==================== ACTIFS ====================

/**
 * Met à jour la section Analyse des actifs
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourActifs(donnees) {
  const labels = BRVMData.ANNEES_10;
  const couleurs = Charts.obtenirCouleurs();

  // Graphique actif total
  Charts.creerGraphiqueMultiCourbes('chartActifs', labels,
    [
      { donnees: donnees.actif_total, titre: 'Actif total', couleur: couleurs.principal },
      { donnees: donnees.capitaux_propres, titre: 'Capitaux propres', couleur: couleurs.secondaire },
      { donnees: donnees.dettes_financieres, titre: 'Dettes financières', couleur: couleurs.tertiaire }
    ],
    v => (v / 1000).toFixed(0) + ' Mrd'
  );

  // Métriques de la dernière année
  const n = donnees.actif_total.length - 1;
  mettreAJourElement('actifTotal', `${(donnees.actif_total[n] / 1000).toFixed(0)} Mrd FCFA`);
  mettreAJourElement('capitauxPropres', `${(donnees.capitaux_propres[n] / 1000).toFixed(0)} Mrd FCFA`);
  mettreAJourElement('dettesFinancieres', `${(donnees.dettes_financieres[n] / 1000).toFixed(0)} Mrd FCFA`);

  // Ratio d'endettement
  const ratio = (donnees.dettes_financieres[n] / donnees.capitaux_propres[n]).toFixed(2);
  mettreAJourElement('ratioEndettement', ratio + 'x');
}

// ==================== FINANCEMENT ====================

/**
 * Met à jour la section Analyse du financement
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourFinancement(donnees) {
  const labels = BRVMData.ANNEES_10;
  const n = donnees.ca.length - 1;

  // Graphique de la marge nette
  Charts.creerGraphiqueLigne('chartMargeNette', labels, donnees.marge_nette,
    'Marge nette (%)', Charts.obtenirCouleurs().principal,
    v => v.toFixed(1) + '%'
  );

  // Métriques de financement
  const gearing = (donnees.dettes_financieres[n] /
    (donnees.capitaux_propres[n] + donnees.dettes_financieres[n]) * 100).toFixed(1);

  mettreAJourElement('margeNetteCourante', donnees.marge_nette[n].toFixed(1) + '%');
  mettreAJourElement('gearing', gearing + '%');
}

// ==================== SECTEUR ====================

/**
 * Met à jour la section Positionnement sectoriel
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourSectoriel(donnees) {
  const n = donnees.roe.length - 1;

  // Label secteur
  mettreAJourElement('sectorLabel', donnees.sector);

  // 4 ratios dans la grille
  mettreAJourElement('roeActuel', donnees.roe[n].toFixed(1) + '%');
  mettreAJourElement('rendementActuel', donnees.rendement.toFixed(1) + '%');
  mettreAJourElement('perActuel', donnees.per.toFixed(1) + 'x');
  mettreAJourElement('pbrActuel', donnees.pbr.toFixed(1) + 'x');

  // Pairs mini
  const peersMini = document.getElementById('peersMini');
  if (peersMini && donnees.peers) {
    peersMini.innerHTML = donnees.peers.map(p => {
      const estActuel = p.ticker === donnees.ticker;
      return `<div class="peer-mini-row ${estActuel ? 'current' : ''}">
        <span class="peer-mini-name">${p.name}</span>
        <span class="peer-mini-val">ROE ${p.roe.toFixed(1)}% · PER ${p.per.toFixed(1)}x</span>
      </div>`;
    }).join('');
  }
}

// ==================== PRIX DE L'ACTION ====================

/**
 * Met à jour la section Analyse du prix de l'action
 *
 * @param {Object} donnees - Données de l'entreprise
 * @param {Object} score   - Score calculé
 */
function mettreAJourPrixAction(donnees, score) {
  // En-tête du cours
  mettreAJourElement('prixCourant', Number(donnees.cours).toLocaleString('fr-FR'));
  mettreAJourElement('dividendeActuel', Number(donnees.dividende).toLocaleString('fr-FR') + ' FCFA');
  mettreAJourElement('rendementAffiche', donnees.rendement.toFixed(1) + '%');
  mettreAJourElement('perAffiche', donnees.per.toFixed(1) + 'x');
  mettreAJourElement('pbrAffiche', donnees.pbr.toFixed(1) + 'x');

  // Graphique cours historique
  Charts.creerGraphiqueLigne('chartCours', BRVMData.MOIS_12,
    donnees.cours_historique, 'Cours (FCFA)',
    Charts.obtenirCouleurs().principal,
    v => Number(v).toLocaleString('fr-FR') + ' FCFA'
  );

  // Jauges PER et PBR
  Charts.creerJauge('gaugePER', donnees.per, 0, 30, 'PER',
    { vert: 10, orange: 22, rouge: 30 });
  Charts.creerJauge('gaugePBR', donnees.pbr, 0, 5, 'PBR',
    { vert: 1, orange: 3, rouge: 5 });

  // Score PER
  mettreAJourElement('scorePER', score.prix.detail.pts_per + ' pts');
  mettreAJourElement('scorePBR', score.prix.detail.pts_pbr + ' pts');

  // Règle de Graham
  const grahamVal = score.prix.detail.graham_val;
  const grahamPass = score.prix.detail.graham_pass;
  const elGraham = document.getElementById('grahamRule');
  if (elGraham) {
    elGraham.className = 'graham-rule ' + (grahamPass ? 'pass' : 'fail');
    elGraham.innerHTML = `
      <div class="graham-icon">${grahamPass ? '✅' : '❌'}</div>
      <div class="graham-text">
        <div class="graham-formula">PER × PBR = ${donnees.per.toFixed(1)} × ${donnees.pbr.toFixed(1)} = ${grahamVal}</div>
        <div class="graham-result">Règle de Graham (seuil 22.5) : ${grahamPass ? 'respectée' : 'non respectée'}</div>
      </div>
      <div class="graham-bonus ${grahamPass ? 'pass' : 'fail'}">${grahamPass ? '+5 pts' : '0 pts'}</div>
    `;
  }
}

// ==================== BOTTOM-UP (ACTUALITÉS) ====================

/**
 * Affiche les actualités de l'entreprise avec impact
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourBottomUp(donnees) {
  const container = document.getElementById('newsFeed');
  if (!container) return;

  const icons = { positif: '📈', negatif: '📉', neutre: '📰' };
  const labels = { positif: 'Positif +3 pts', negatif: 'Négatif −2 pts', neutre: 'Neutre +1 pt' };

  container.innerHTML = donnees.news.map(item => `
    <div class="news-item">
      <div class="news-impact-badge ${item.impact}">
        ${icons[item.impact] || '📰'}
      </div>
      <div class="news-content">
        <div class="news-title">${item.titre}</div>
        <div class="news-meta">
          <span class="news-points ${item.impact}">${labels[item.impact]}</span>
          <span>·</span>
          <span>${item.date}</span>
          <span>·</span>
          <span>${item.source}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Score Bottom-Up
  mettreAJourElement('scoreBottomUp', scoreActuel.perspectives.detail.pts_bottom_up + ' / 15 pts');
}

// ==================== TOP-DOWN ====================

/**
 * Met à jour la section des perspectives macro/sectorielles
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourTopDown(donnees) {
  const { topdown } = donnees;
  if (!topdown) return;

  // Carte Économie
  mettreAJourCarteTopDown('tdEconomie', 'tdEconomiePts', 'tdEconomieTxt',
    '🌍', topdown.economie, topdown.economie_pts, topdown.economie_note, 5);

  // Carte Secteur
  mettreAJourCarteTopDown('tdSecteur', 'tdSecteurPts', 'tdSecteurTxt',
    '🏭', topdown.secteur, topdown.secteur_pts, topdown.secteur_note, 5);

  // Carte Entreprise
  mettreAJourCarteTopDown('tdEntreprise', 'tdEntreprisePts', 'tdEntrepriseTxt',
    '🏢', topdown.entreprise, topdown.entreprise_pts, topdown.entreprise_note, 5);

  // Score Top-Down
  mettreAJourElement('scoreTopDown', scoreActuel.perspectives.detail.pts_top_down + ' / 15 pts');
}

/**
 * Met à jour une carte d'indicateur Top-Down
 *
 * @param {string} cardId    - ID de la carte
 * @param {string} ptsId     - ID de l'élément score
 * @param {string} txtId     - ID du texte
 * @param {string} icon      - Emoji de l'icône
 * @param {string} texte     - Texte descriptif
 * @param {number} pts       - Points attribués
 * @param {string} note      - Note (positive/neutre/negative)
 * @param {number} ptsMax    - Points maximum
 */
function mettreAJourCarteTopDown(cardId, ptsId, txtId, icon, texte, pts, note, ptsMax) {
  const elPts = document.getElementById(ptsId);
  const elTxt = document.getElementById(txtId);

  if (elPts) {
    const couleur = note === 'positive' ? '#2ecc71' : note === 'negative' ? '#e74c3c' : '#f39c12';
    elPts.textContent = `${pts}/${ptsMax} pts`;
    elPts.style.color = couleur;
  }

  if (elTxt) elTxt.textContent = texte;
}

// ==================== SIMULATEUR D'INVESTISSEMENT ====================

/**
 * Initialise les événements du simulateur
 */
function initialiserSimulateur() {
  const inputs = ['simMontant', 'simHorizon', 'simProfil'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculerSimulation);
  });
}

/**
 * Lance le calcul de la simulation d'investissement
 */
function calculerSimulation() {
  if (!donneesActuelles) return;

  const montant = parseFloat(document.getElementById('simMontant')?.value) || 1000000;
  const horizon = parseInt(document.getElementById('simHorizon')?.value) || 5;
  const profil = document.getElementById('simProfil')?.value || 'equilibre';

  // Taux de croissance selon le profil
  const tauxCroissance = { prudent: 0.03, equilibre: 0.06, dynamique: 0.09 };
  const taux = tauxCroissance[profil] || 0.06;

  // Calcul de la valeur finale
  const valeurFinale = montant * Math.pow(1 + taux, horizon);

  // Calcul des dividendes cumulés
  const rendementDiv = (donneesActuelles.rendement || 0) / 100;
  let dividendesCumules = 0;
  let valeurCourante = montant;
  for (let i = 0; i < horizon; i++) {
    dividendesCumules += valeurCourante * rendementDiv;
    valeurCourante *= (1 + taux);
  }

  // Rendement total
  const rendementTotal = ((valeurFinale - montant + dividendesCumules) / montant * 100).toFixed(1);

  // Mise à jour de l'affichage
  mettreAJourElement('simValeurFinale',
    Number(Math.round(valeurFinale)).toLocaleString('fr-FR') + ' FCFA');
  mettreAJourElement('simDividendesCumules',
    Number(Math.round(dividendesCumules)).toLocaleString('fr-FR') + ' FCFA');
  mettreAJourElement('simRendementTotal', `+${rendementTotal}%`);
  mettreAJourElement('simValeurPlusDividende',
    Number(Math.round(valeurFinale + dividendesCumules)).toLocaleString('fr-FR') + ' FCFA');
}

/**
 * Met à jour les éléments du simulateur avec les données actuelles
 */
function mettreAJourSimulateur() {
  calculerSimulation();
}

// ==================== SCORE & RECOMMANDATION ====================

/**
 * Met à jour la section Score global
 *
 * @param {Object} score - Résultat de calculerScore3P()
 */
function mettreAJourScore(score) {
  // Piliers — valeurs texte
  mettreAJourElement('scorePortrait', `${Math.round(score.portrait.total)} / ${score.portrait.max}`);
  mettreAJourElement('scorePerspectives', `${Math.round(score.perspectives.total)} / ${score.perspectives.max}`);
  mettreAJourElement('scorePrix', `${Math.round(score.prix.total)} / ${score.prix.max}`);

  // Barres de progression
  mettreAJourBarreScore('barPortrait', null, score.portrait.total, score.portrait.max);
  mettreAJourBarreScore('barPerspectives', null, score.perspectives.total, score.perspectives.max);
  mettreAJourBarreScore('barPrix', null, score.prix.total, score.prix.max);

  // Recommandation
  const elReco = document.getElementById('scoreRecoDisplay');
  if (elReco) {
    elReco.textContent = score.recommandation;
    elReco.className = 'score-reco-display ' + score.recommandationClass;
  }

  // Score ring en-tête
  mettreAJourScoreRing('headerScoreRing', 'headerScoreValue', score.score, score.recommandationClass);
}

/**
 * Met à jour une barre de score pilier
 *
 * @param {string} barId  - ID de la barre de remplissage
 * @param {string} valId  - ID de l'élément valeur texte
 * @param {number} pts    - Points obtenus
 * @param {number} max    - Points maximum
 */
function mettreAJourBarreScore(barId, valId, pts, max) {
  const bar = document.getElementById(barId);
  if (bar) bar.style.width = Math.round((pts / max) * 100) + '%';
  if (valId) {
    const val = document.getElementById(valId);
    if (val) val.textContent = `${Math.round(pts)}/${max} pts`;
  }
}

// ==================== SIDEBAR ====================

/**
 * Navigue vers une vue SPA
 * @param {string} viewId - Identifiant de la vue (ex: 'entreprises')
 */
function naviguerVers(viewId) {
  // Masque toutes les vues
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

  // Affiche la vue cible
  const vueTarget = document.getElementById('view' + viewId.charAt(0).toUpperCase() + viewId.slice(1));
  if (vueTarget) vueTarget.classList.add('active');

  // Met à jour l'état actif du menu
  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.dataset.view === viewId);
  });

  // Remplissage des vues tabulaires au premier affichage
  if (viewId === 'secteurs' && !document.getElementById('secteursTbody').dataset.rempli) {
    remplirTableauSecteurs();
    document.getElementById('secteursTbody').dataset.rempli = '1';
  }
  if (viewId === 'comparaison' && !document.getElementById('comparaisonTbody').dataset.rempli) {
    remplirTableauComparaison();
    document.getElementById('comparaisonTbody').dataset.rempli = '1';
  }
  if (viewId === 'parametres') {
    mettreAJourStatsApi();
  }
}

/**
 * Initialise la barre latérale (navigation SPA par vues)
 */
function initialiserSidebar() {
  const navItems = document.querySelectorAll('.nav-item[data-view]');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      naviguerVers(this.dataset.view);

      // Sur mobile : ferme le menu
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        sidebar.classList.remove('mobile-open');
        overlay?.classList.remove('visible');
      }
    });
  });
}

// ==================== ACCORDÉONS ====================

/**
 * Bascule l'affichage d'une section dans la vue Entreprises
 * @param {string} sectionId - ID de la section à basculer
 * @param {HTMLElement} btn  - Bouton toggle cliqué
 */
function basculerSection(sectionId, btn) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const isHidden = section.classList.contains('hidden');
  section.classList.toggle('hidden', !isHidden);

  if (btn) {
    btn.classList.toggle('active', isHidden);
    const arrow = btn.querySelector('.stoggle-arrow');
    if (arrow) arrow.textContent = isHidden ? '▾' : '▸';
  }
}

// initialiserAccordeons est conservé pour compatibilité (no-op dans la nouvelle archi)
function initialiserAccordeons() {}

// ==================== UTILITAIRES ====================

/**
 * Met à jour le contenu textuel d'un élément DOM
 *
 * @param {string} id     - ID de l'élément
 * @param {string} valeur - Nouvelle valeur textuelle
 */
function mettreAJourElement(id, valeur) {
  const el = document.getElementById(id);
  if (el) el.textContent = valeur;
}

// ==================== MODAL GRAPHIQUE ÉLARGI ====================

/**
 * Ouvre le modal en répliquant les données du graphique mini
 *
 * @param {string} canvasId - ID du canvas source (ex: 'chartCA')
 * @param {string} titre    - Titre à afficher dans le modal
 * @param {string} [sousTitre] - Sous-titre optionnel (ex: 'Mrd FCFA')
 */
function agrandirGraphique(canvasId, titre, sousTitre) {
  const canvasSource = document.getElementById(canvasId);
  const sourceChart = canvasSource ? Chart.getChart(canvasSource) : null;
  if (!sourceChart) return;

  // Affichage du modal
  const modal = document.getElementById('chartModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Mise à jour du titre
  const elTitre = document.getElementById('chartModalTitle');
  const elSousTitre = document.getElementById('chartModalSubtitle');
  if (elTitre) elTitre.textContent = titre;
  if (elSousTitre) elSousTitre.textContent = sousTitre || '';

  // Destruction de l'éventuel chart précédent
  if (chartModal) { chartModal.destroy(); chartModal = null; }

  // Recréation du chart dans le modal avec les mêmes données
  const canvasModal = document.getElementById('chartModalCanvas');
  if (!canvasModal) return;

  // Clone profond de la config du chart source
  const config = JSON.parse(JSON.stringify({
    type: sourceChart.config.type,
    data: sourceChart.config.data,
    options: sourceChart.config.options
  }));

  // Options supplémentaires pour le modal (plus lisible)
  config.options.plugins = config.options.plugins || {};
  config.options.plugins.legend = { display: true };
  config.options.maintainAspectRatio = false;
  config.options.animation = { duration: 400 };

  chartModal = new Chart(canvasModal, config);
}

/**
 * Ferme le modal graphique
 */
function fermerModalGraphique() {
  const modal = document.getElementById('chartModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
  if (chartModal) { chartModal.destroy(); chartModal = null; }
}

// Fermeture avec la touche Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') fermerModalGraphique();
});

// ==================== SPARKLINES KPI ====================

/**
 * Dessine un sparkline minimaliste dans un canvas
 * @param {string} canvasId - ID du canvas
 * @param {number[]} donnees - Tableau de valeurs
 * @param {string} couleur  - Couleur de la ligne
 */
function dessinerSparkline(canvasId, donnees, couleur) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !donnees || donnees.length < 2) return;

  // Détruit un éventuel chart existant
  const chartExist = Chart.getChart(canvas);
  if (chartExist) chartExist.destroy();

  new Chart(canvas, {
    type: 'line',
    data: {
      labels: donnees.map(() => ''),
      datasets: [{ data: donnees, borderColor: couleur, borderWidth: 1.5,
        pointRadius: 0, fill: true,
        backgroundColor: couleur.replace(')', ', 0.1)').replace('rgb', 'rgba') }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      animation: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } }
    }
  });
}

// ==================== REMPLISSAGE DES VUES TABULAIRES ====================

/**
 * Remplit le tableau des secteurs et la liste complète des entreprises
 */
function remplirTableauSecteurs() {
  // Regroupement par secteur
  const secteursMap = {};
  BRVMData.BRVM_COMPANY_LIST.forEach(c => {
    if (!secteursMap[c.sector]) secteursMap[c.sector] = [];
    secteursMap[c.sector].push(c.name);
  });

  const tbody = document.getElementById('secteursTbody');
  if (tbody) {
    tbody.innerHTML = Object.entries(secteursMap).map(([sec, noms]) => `
      <tr>
        <td>${sec}</td>
        <td class="text-right">${noms.length}</td>
        <td>${noms.slice(0, 3).join(', ')}${noms.length > 3 ? '…' : ''}</td>
      </tr>
    `).join('');
  }

  // Liste complète toutes entreprises
  const tbodyAll = document.getElementById('allCompaniesTbody');
  if (tbodyAll) {
    tbodyAll.innerHTML = BRVMData.BRVM_COMPANY_LIST.map(c => {
      const d = BRVMData.BRVM_COMPANIES[c.ticker];
      const cours = d ? Number(d.cours).toLocaleString('fr-FR') : '—';
      return `<tr onclick="chargerEntreprise('${c.ticker}');naviguerVers('entreprises')" style="cursor:pointer">
        <td class="ticker-code">${c.ticker}</td>
        <td>${c.name}</td>
        <td>${c.sector}</td>
        <td>${c.country || c.pays || '—'}</td>
        <td class="text-right">${cours}</td>
      </tr>`;
    }).join('');
  }
}

/**
 * Remplit le tableau de comparaison des entreprises avec leurs ratios
 */
function remplirTableauComparaison() {
  const tbody = document.getElementById('comparaisonTbody');
  if (!tbody) return;

  tbody.innerHTML = BRVMData.BRVM_COMPANY_LIST.map(c => {
    const d = BRVMData.BRVM_COMPANIES[c.ticker];
    if (!d) return '';

    const score = Scoring.calculerScore3P({
      ca: d.ca, rex: d.rex, rn: d.rn, news: d.news, topdown: d.topdown,
      per: d.per, pbr: d.pbr, dividende: d.dividende, cours: d.cours,
      rendement: d.rendement, name: d.name
    });

    return `<tr onclick="chargerEntreprise('${d.ticker}');naviguerVers('entreprises')" style="cursor:pointer">
      <td class="ticker-code">${d.ticker}</td>
      <td>${d.name}</td>
      <td>${d.sector}</td>
      <td class="text-right">${Number(d.cours).toLocaleString('fr-FR')}</td>
      <td class="text-right">${d.per.toFixed(1)}x</td>
      <td class="text-right">${d.pbr.toFixed(1)}x</td>
      <td class="text-right">${d.rendement.toFixed(1)}%</td>
      <td class="text-right"><span class="score-badge-sm ${score.recommandationClass}">${score.score}</span></td>
    </tr>`;
  }).join('');
}

// ==================== API / PARAMÈTRES ====================

/**
 * Sauvegarde la clé API EODHD dans localStorage
 */
function saveApiKey() {
  const input = document.getElementById('eodhdTokenInput');
  if (!input || !input.value.trim()) return;
  localStorage.setItem('eodhd_token', input.value.trim());
  const res = document.getElementById('apiTestResult');
  if (res) {
    res.className = 'api-test-result success';
    res.textContent = '✅ Clé sauvegardée. Rechargez pour l\'activer.';
  }
}

/**
 * Teste la connexion à l'API EODHD
 */
async function testApiConnection() {
  const res = document.getElementById('apiTestResult');
  if (res) { res.className = 'api-test-result'; res.textContent = 'Test en cours…'; }

  try {
    const url = window.ApiConfig.API_CONFIG.eodhd.endpoints.realtime('SNTS.BRVM');
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (res) {
      res.className = 'api-test-result success';
      res.textContent = `✅ Connexion réussie ! SNTS = ${data.close || data.last || '?'} FCFA`;
    }
  } catch (err) {
    if (res) {
      res.className = 'api-test-result error';
      res.textContent = `❌ Échec de la connexion : ${err.message}`;
    }
  }
}

/**
 * Vide le cache API
 */
function clearApiCache() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('brvm_cache_') || k.startsWith('cotation_'));
  keys.forEach(k => localStorage.removeItem(k));
  mettreAJourStatsApi();
  const btn = document.querySelector('.btn-danger-action');
  if (btn) { btn.textContent = '✅ Cache vidé !'; setTimeout(() => { btn.textContent = 'Vider le cache'; }, 2000); }
}

/**
 * Met à jour les statistiques d'utilisation API dans la vue Paramètres
 */
function mettreAJourStatsApi() {
  const config = window.ApiConfig?.API_CONFIG?.eodhd?.rateLimit;
  if (!config) return;

  const calls = parseInt(localStorage.getItem(config.storageKey) || '0');
  const cacheKeys = Object.keys(localStorage).filter(k => k.startsWith('brvm_cache_')).length;

  mettreAJourElement('apiCallCount', `${calls} / ${config.dailyMax}`);
  mettreAJourElement('cacheStatus', `${cacheKeys} entrée${cacheKeys > 1 ? 's' : ''}`);

  // Pré-remplit le champ token
  const tokenInput = document.getElementById('eodhdTokenInput');
  if (tokenInput) tokenInput.value = localStorage.getItem('eodhd_token') || '';
}

/**
 * Affiche l'indicateur de source de données
 * @param {string} etat - 'live' | 'mock' | 'error'
 */
function showDataSourceIndicator(etat) {
  const dot = document.getElementById('dsDot');
  const label = document.getElementById('dsLabel');
  const map = {
    live:  { classe: 'live',  texte: 'Données temps réel' },
    mock:  { classe: 'mock',  texte: 'Données simulées' },
    error: { classe: 'error', texte: 'Erreur de connexion' }
  };
  const info = map[etat] || map.mock;
  if (dot)   { dot.className = `ds-dot ${info.classe}`; }
  if (label) { label.textContent = info.texte; }
}

// ==================== SIMULATEUR ====================

/**
 * Ouvre le modal du simulateur d'investissement
 */
function ouvrirSimulateur() {
  calculerSimulation();
  const modal = document.getElementById('simulateurModal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Ferme le modal du simulateur
 */
function fermerSimulateur() {
  const modal = document.getElementById('simulateurModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

// ==================== GRAPHIQUES DE PERFORMANCE (mis à jour) ====================
// Remplace mettreAJourGraphiquesPerformance pour ne créer que chartCA et chartRN
// (chartREX est supprimé dans la nouvelle vue)
function mettreAJourGraphiquesPerformance(donnees) {
  const couleurs = Charts.obtenirCouleurs();
  const labels = BRVMData.ANNEES_10;

  const fmt = v => {
    if (v >= 1000000) return (v / 1000000).toFixed(1) + ' T';
    if (v >= 1000) return (v / 1000).toFixed(0) + ' Mrd';
    return v + ' M';
  };

  Charts.creerGraphiqueLigne('chartCA', labels, donnees.ca,
    'Chiffre d\'affaires', couleurs.principal, fmt);

  Charts.creerGraphiqueLigne('chartRN', labels, donnees.rn,
    'Résultat net', couleurs.tertiaire, fmt);

  // Sparklines KPI
  dessinerSparkline('sparkCA',  donnees.ca,  '#2ecc71');
  dessinerSparkline('sparkREX', donnees.rex, '#f39c12');
  dessinerSparkline('sparkRN',  donnees.rn,  '#3498db');
}

// ==================== EXPORTS GLOBAUX ====================
// Expose les fonctions nécessaires aux gestionnaires HTML inline
window.naviguerVers = naviguerVers;
window.chargerEntreprise = chargerEntreprise;
window.basculerSection = basculerSection;
window.agrandirGraphique = agrandirGraphique;
window.fermerModalGraphique = fermerModalGraphique;
window.ouvrirSimulateur = ouvrirSimulateur;
window.fermerSimulateur = fermerSimulateur;
window.saveApiKey = saveApiKey;
window.testApiConnection = testApiConnection;
window.clearApiCache = clearApiCache;
window.actualiserDonnees = actualiserDonnees;
