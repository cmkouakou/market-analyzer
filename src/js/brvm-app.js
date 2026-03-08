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
  // Cours actuel dans l'en-tête
  const elCours = document.getElementById('headerCours');
  if (elCours) {
    elCours.textContent = `${Number(donnees.cours).toLocaleString('fr-FR')} FCFA`;
  }

  // Secteur
  const elSecteur = document.getElementById('headerSecteur');
  if (elSecteur) elSecteur.textContent = donnees.sector;

  // Score ring dans l'en-tête
  mettreAJourScoreRing('headerScoreRing', 'headerScoreValue', score.score, score.recommandationClass);
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

  // KPI Chiffre d'affaires
  const cagrCA = Scoring.calculerCAGR(ca[0], ca[n - 1], n - 1);
  mettreAJourCarteKPI('kpiCA', 'kpiCAcagr', 'kpiCAtend',
    `${(ca[n - 1] / 1000).toFixed(1)} Mrd FCFA`, cagrCA, 'CA 2023'
  );

  // KPI Résultat d'exploitation
  const cagrREX = Scoring.calculerCAGR(rex[0], rex[n - 1], n - 1);
  mettreAJourCarteKPI('kpiREX', 'kpiREXcagr', 'kpiREXtend',
    `${(rex[n - 1] / 1000).toFixed(1)} Mrd FCFA`, cagrREX, 'REX 2023'
  );

  // KPI Résultat net
  const cagrRN = Scoring.calculerCAGR(rn[0], rn[n - 1], n - 1);
  mettreAJourCarteKPI('kpiRN', 'kpiRNcagr', 'kpiRNtend',
    `${(rn[n - 1] / 1000).toFixed(1)} Mrd FCFA`, cagrRN, 'RN 2023'
  );
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

  // Métriques de rentabilité
  mettreAJourElement('roeActuel', donnees.roe[n].toFixed(1) + '%');
  mettreAJourElement('roaActuel', donnees.roa[n].toFixed(1) + '%');
  mettreAJourElement('rendementActuel', donnees.rendement.toFixed(1) + '%');

  // Graphique ROE sur 10 ans
  Charts.creerGraphiqueLigne('chartROE', BRVMData.ANNEES_10, donnees.roe,
    'ROE (%)', Charts.obtenirCouleurs().principal, v => v.toFixed(1) + '%');

  // Tableau comparatif des pairs
  const tbody = document.getElementById('tablePairsBody');
  if (tbody && donnees.peers) {
    tbody.innerHTML = donnees.peers.map((pair, i) => {
      const estActuel = pair.ticker === donnees.ticker;
      return `
        <tr class="${estActuel ? 'peer-highlight' : ''}">
          <td class="text-primary ${estActuel ? 'font-bold' : ''}">${pair.name}</td>
          <td class="text-right">${pair.roe.toFixed(1)}%</td>
          <td class="text-right">${pair.per.toFixed(1)}x</td>
          <td class="text-right">${pair.rendement.toFixed(1)}%</td>
          <td class="text-right">${pair.croissance.toFixed(1)}%</td>
          ${estActuel ? '<td class="text-right"><span class="badge badge-success">Vous</span></td>' : '<td></td>'}
        </tr>
      `;
    }).join('');
  }

  // Graphique comparatif ROE pairs
  if (donnees.peers) {
    const noms = donnees.peers.map(p => p.name);
    const roes = donnees.peers.map(p => p.roe);
    const indexActuel = donnees.peers.findIndex(p => p.ticker === donnees.ticker);
    Charts.creerGraphiqueHorizontal('chartComparaisonROE', noms, roes,
      'ROE (%)', indexActuel);
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
  // Score ring principal
  const ringLarge = document.getElementById('scoreRingLarge');
  if (ringLarge) {
    ringLarge.style.setProperty('--score', score.score);
    const couleurs = { acheter: '#2ecc71', surveiller: '#f39c12', eviter: '#e74c3c' };
    const couleur = couleurs[score.recommandationClass] || '#2ecc71';
    ringLarge.style.background = `conic-gradient(${couleur} calc(${score.score} * 3.6deg), #1a3320 0)`;

    // Force l'animation
    ringLarge.style.animation = 'none';
    ringLarge.offsetHeight; // Force le reflow
    ringLarge.style.animation = 'scoreRevealLarge 1s ease-out';
  }

  // Valeur numérique
  mettreAJourElement('scoreNumber', score.score);

  // Badge de recommandation
  const elReco = document.getElementById('scoreReco');
  if (elReco) {
    elReco.textContent = score.recommandation;
    elReco.className = 'score-reco ' + score.recommandationClass;
  }

  // Barre par pilier
  const pcts = Scoring.calculerPourcentagesPiliers(score);

  mettreAJourBarreScore('barPortrait', 'valPortrait',
    score.portrait.total, score.portrait.max);
  mettreAJourBarreScore('barPerspectives', 'valPerspectives',
    score.perspectives.total, score.perspectives.max);
  mettreAJourBarreScore('barPrix', 'valPrix',
    score.prix.total, score.prix.max);

  // Justification
  const elJust = document.getElementById('scoreJustification');
  if (elJust) elJust.textContent = score.justification;

  // Mise à jour du badge de score dans l'en-tête aussi
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
  const val = document.getElementById(valId);

  if (bar) {
    const pct = Math.round((pts / max) * 100);
    bar.style.width = pct + '%';
  }

  if (val) val.textContent = `${Math.round(pts)}/${max} pts`;
}

// ==================== SIDEBAR ====================

/**
 * Initialise la barre latérale (toggle, navigation, accordéon)
 */
function initialiserSidebar() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
    });
  }

  // Navigation entre sections
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // Suppression de l'état actif précédent
      navItems.forEach(n => n.classList.remove('active'));
      this.classList.add('active');

      // Scroll vers la section cible
      const sectionId = this.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Ouverture de l'accordéon si nécessaire
        if (!section.classList.contains('open')) {
          section.classList.add('open');
        }
      }
    });
  });
}

// ==================== ACCORDÉONS ====================

/**
 * Initialise l'état des accordéons et leurs animations
 */
function initialiserAccordeons() {
  // La première section est ouverte par défaut
  const premiereSection = document.querySelector('.accordion-section');
  if (premiereSection) {
    premiereSection.classList.add('open');
  }
}

/**
 * Bascule l'état d'un accordéon
 *
 * @param {HTMLElement} header - En-tête de l'accordéon cliqué
 */
function toggleSection(header) {
  const section = header.closest('.accordion-section');
  if (!section) return;

  section.classList.toggle('open');
}

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

// ==================== EXPORTS GLOBAUX ====================
// Expose les fonctions nécessaires aux gestionnaires HTML inline
window.toggleSection = toggleSection;
window.chargerEntreprise = chargerEntreprise;
