/**
 * =============================================================
 *  Fichier    : intl-app.js
 *  Projet     : Market Analyser
 *  Description: Logique principale du module International
 *               Gestion des marchés NYSE/NASDAQ/Euronext, scoring 3P international
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: scoring.js, charts.js, intl-data.js, Chart.js 4.x
 * =============================================================
 */

'use strict';

// ==================== VARIABLES GLOBALES ====================
let entrepriseActiveIntl = 'AAPL'; // Entreprise sélectionnée par défaut
let donneesActuellesIntl = null;   // Cache des données de l'entreprise courante
let scoreActuelIntl = null;        // Cache du score calculé

// ==================== INITIALISATION ====================

/**
 * Point d'entrée principal — lancé au chargement du DOM
 */
document.addEventListener('DOMContentLoaded', function() {
  initialiserInterfaceIntl();
  remplirSélecteurEntreprisesIntl();
  remplirTickerIntl();
  chargerEntrepriseIntl(entrepriseActiveIntl);
  initialiserSidebarIntl();
  initialiserSimulateurIntl();
  initialiserAccordeonsIntl();
});

/**
 * Initialise les éléments communs de l'interface internationale
 */
function initialiserInterfaceIntl() {
  const btnMenu = document.getElementById('btnMenuMobile');
  const overlay = document.getElementById('sidebarOverlay');
  const sidebar = document.getElementById('sidebar');

  if (btnMenu) {
    btnMenu.addEventListener('click', function() {
      sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('visible');
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
 * Remplit le sélecteur d'entreprises avec la liste internationale
 */
function remplirSélecteurEntreprisesIntl() {
  const select = document.getElementById('selectEntreprise');
  if (!select) return;

  IntlData.INTL_COMPANY_LIST.forEach(({ ticker, name, bourse, currency }) => {
    const option = document.createElement('option');
    option.value = ticker;
    option.textContent = `${name} (${ticker}) — ${bourse}`;
    select.appendChild(option);
  });

  select.addEventListener('change', function() {
    chargerEntrepriseIntl(this.value);
  });
}

/**
 * Remplit la barre de ticker des marchés internationaux
 */
function remplirTickerIntl() {
  const tickerInner = document.getElementById('tickerInner');
  if (!tickerInner) return;

  const items = [...IntlData.INTL_TICKER_DATA, ...IntlData.INTL_TICKER_DATA];
  tickerInner.innerHTML = items.map(item => `
    <span class="ticker-item">
      <span class="ticker-symbol">${item.symbol}</span>
      <span class="ticker-price">${item.price}</span>
      <span class="ticker-change ${item.direction}">${item.change}</span>
    </span>
  `).join('');
}

// ==================== CHARGEMENT D'UNE ENTREPRISE ====================

/**
 * Charge et affiche toutes les données d'une entreprise internationale
 *
 * @param {string} ticker - Code boursier de l'entreprise
 */
function chargerEntrepriseIntl(ticker) {
  const donnees = IntlData.INTL_COMPANIES[ticker];
  if (!donnees) return;

  entrepriseActiveIntl = ticker;
  donneesActuellesIntl = donnees;

  // Calcul du score 3P
  scoreActuelIntl = Scoring.calculerScore3P({
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
  mettreAJourEnteteIntl(donnees, scoreActuelIntl);
  mettreAJourKPIIntl(donnees);
  mettreAJourGraphiquesPerformanceIntl(donnees);
  mettreAJourActifsIntl(donnees);
  mettreAJourFinancementIntl(donnees);
  mettreAJourSectoriellIntl(donnees);
  mettreAJourPrixActionIntl(donnees, scoreActuelIntl);
  mettreAJourBottomUpIntl(donnees);
  mettreAJourTopDownIntl(donnees);
  mettreAJourSimulateurIntl();
  mettreAJourScoreIntl(scoreActuelIntl);
}

// ==================== EN-TÊTE ====================

/**
 * Met à jour l'en-tête du module international
 *
 * @param {Object} donnees - Données de l'entreprise
 * @param {Object} score   - Résultat du scoring 3P
 */
function mettreAJourEnteteIntl(donnees, score) {
  const symbole = donnees.currency === 'EUR' ? '€' : '$';

  mettreAJourElementIntl('headerCours', `${symbole}${donnees.cours.toLocaleString('en-US', { minimumFractionDigits: 1 })}`);
  mettreAJourElementIntl('headerSecteur', donnees.sector);
  mettreAJourElementIntl('headerBourse', donnees.bourse);
  mettreAJourElementIntl('headerDevise', donnees.currency);

  // Badge de bourse
  const elBourse = document.getElementById('headerBourseTag');
  if (elBourse) {
    const classesBourse = { NASDAQ: 'nasdaq', NYSE: 'nyse', Euronext: 'euronext', LSE: 'lse' };
    elBourse.className = 'exchange-badge ' + (classesBourse[donnees.bourse] || 'nasdaq');
    elBourse.textContent = donnees.bourse;
  }

  // Secteur tag
  const elSector = document.getElementById('headerSectorTag');
  if (elSector) {
    elSector.className = 'sector-tag ' + (donnees.sectorClass || '');
    elSector.textContent = donnees.sector;
  }

  // Score ring
  mettreAJourScoreRingIntl('headerScoreRing', 'headerScoreValue', score.score, score.recommandationClass);
}

/**
 * Met à jour un score ring pour le thème International
 *
 * @param {string} ringId  - ID du conteneur ring
 * @param {string} valueId - ID de la valeur
 * @param {number} score   - Score (0-100)
 * @param {string} classe  - Classe CSS de la recommandation
 */
function mettreAJourScoreRingIntl(ringId, valueId, score, classe) {
  const ring = document.getElementById(ringId);
  const valEl = document.getElementById(valueId);

  if (ring) {
    ring.style.setProperty('--score', score);
    const couleurs = { acheter: '#39d353', surveiller: '#f0883e', eviter: '#f85149' };
    ring.style.background = `conic-gradient(${couleurs[classe] || '#58a6ff'} calc(${score} * 3.6deg), #30363d 0)`;
  }

  if (valEl) valEl.textContent = score;
}

// ==================== KPI ====================

/**
 * Met à jour les cartes KPI du module international
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourKPIIntl(donnees) {
  const { ca, rex, rn } = donnees;
  const n = ca.length;
  const symbole = donnees.currency === 'EUR' ? '€' : '$';

  // CAGR CA
  const cagrCA = Scoring.calculerCAGR(ca[0], ca[n - 1], n - 1);
  mettreAJourCarteKPIIntl('kpiCA', 'kpiCAcagr', 'kpiCAtend',
    `${symbole}${ca[n - 1].toFixed(1)} Md`, cagrCA);

  // CAGR REX
  const cagrREX = Scoring.calculerCAGR(Math.max(rex[0], 0.1), Math.max(rex[n - 1], 0.1), n - 1);
  mettreAJourCarteKPIIntl('kpiREX', 'kpiREXcagr', 'kpiREXtend',
    `${symbole}${rex[n - 1].toFixed(1)} Md`, cagrREX);

  // CAGR RN
  const cagrRN = Scoring.calculerCAGR(Math.max(rn[0], 0.1), Math.max(rn[n - 1], 0.1), n - 1);
  mettreAJourCarteKPIIntl('kpiRN', 'kpiRNcagr', 'kpiRNtend',
    `${symbole}${rn[n - 1].toFixed(1)} Md`, cagrRN);
}

/**
 * Met à jour une carte KPI internationale
 *
 * @param {string} valueId - ID de la valeur
 * @param {string} cagrId  - ID du CAGR
 * @param {string} tendId  - ID de l'icône tendance
 * @param {string} valeur  - Valeur formatée
 * @param {number} cagr    - CAGR en %
 */
function mettreAJourCarteKPIIntl(valueId, cagrId, tendId, valeur, cagr) {
  mettreAJourElementIntl(valueId, valeur);

  const elCagr = document.getElementById(cagrId);
  if (elCagr) {
    elCagr.textContent = `CAGR ${cagr.toFixed(1)}%`;
    elCagr.className = 'kpi-cagr ' + (cagr >= 0 ? 'positive' : 'negative');
  }

  const elTend = document.getElementById(tendId);
  if (elTend) {
    if (cagr >= 5) { elTend.textContent = '↑'; elTend.className = 'kpi-trend up'; }
    else if (cagr >= 0) { elTend.textContent = '→'; elTend.className = 'kpi-trend neutral'; }
    else { elTend.textContent = '↓'; elTend.className = 'kpi-trend down'; }
  }
}

// ==================== GRAPHIQUES DE PERFORMANCE ====================

/**
 * Affiche les graphiques de performance pour le module international
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourGraphiquesPerformanceIntl(donnees) {
  const couleurs = Charts.obtenirCouleurs();
  const labels = IntlData.ANNEES_10_INTL;
  const symbole = donnees.currency === 'EUR' ? '€' : '$';

  const formater = v => {
    if (Math.abs(v) >= 1000) return symbole + (v / 1000).toFixed(1) + 'T';
    return symbole + v.toFixed(1) + ' Md';
  };

  Charts.creerGraphiqueLigne('chartCA', labels, donnees.ca,
    'Chiffre d\'affaires', couleurs.principal, formater);

  Charts.creerGraphiqueLigne('chartREX', labels, donnees.rex,
    'Résultat d\'exploitation', couleurs.secondaire, formater);

  Charts.creerGraphiqueLigne('chartRN', labels, donnees.rn,
    'Résultat net', couleurs.tertiaire, formater);
}

// ==================== ACTIFS ====================

/**
 * Met à jour la section Analyse des actifs internationale
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourActifsIntl(donnees) {
  const labels = IntlData.ANNEES_10_INTL;
  const couleurs = Charts.obtenirCouleurs();
  const symbole = donnees.currency === 'EUR' ? '€' : '$';

  Charts.creerGraphiqueMultiCourbes('chartActifs', labels,
    [
      { donnees: donnees.actif_total, titre: 'Actif total', couleur: couleurs.principal },
      { donnees: donnees.capitaux_propres, titre: 'Capitaux propres', couleur: couleurs.secondaire },
      { donnees: donnees.dettes_financieres, titre: 'Dettes financières', couleur: couleurs.tertiaire }
    ],
    v => symbole + v.toFixed(0) + ' Md'
  );

  const n = donnees.actif_total.length - 1;
  mettreAJourElementIntl('actifTotal', `${symbole}${donnees.actif_total[n].toFixed(1)} Md`);
  mettreAJourElementIntl('capitauxPropres', `${symbole}${donnees.capitaux_propres[n].toFixed(1)} Md`);
  mettreAJourElementIntl('dettesFinancieres', `${symbole}${donnees.dettes_financieres[n].toFixed(1)} Md`);

  const ratio = (donnees.dettes_financieres[n] / Math.max(donnees.capitaux_propres[n], 0.1)).toFixed(2);
  mettreAJourElementIntl('ratioEndettement', ratio + 'x');
}

// ==================== FINANCEMENT ====================

/**
 * Met à jour la section Analyse du financement internationale
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourFinancementIntl(donnees) {
  const labels = IntlData.ANNEES_10_INTL;
  const n = donnees.ca.length - 1;

  Charts.creerGraphiqueLigne('chartMargeNette', labels, donnees.marge_nette,
    'Marge nette (%)', Charts.obtenirCouleurs().principal,
    v => v.toFixed(1) + '%'
  );

  mettreAJourElementIntl('margeNetteCourante', donnees.marge_nette[n].toFixed(1) + '%');

  const capPropMax = Math.max(donnees.capitaux_propres[n], 0.1);
  const detteMax = donnees.dettes_financieres[n];
  const gearing = (detteMax / (capPropMax + detteMax) * 100).toFixed(1);
  mettreAJourElementIntl('gearing', gearing + '%');
}

// ==================== SECTEUR ====================

/**
 * Met à jour la section Positionnement sectoriel internationale
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourSectoriellIntl(donnees) {
  const n = donnees.roe.length - 1;

  mettreAJourElementIntl('roeActuel', donnees.roe[n].toFixed(1) + '%');
  mettreAJourElementIntl('roaActuel', donnees.roa[n].toFixed(1) + '%');
  mettreAJourElementIntl('rendementActuel',
    donnees.rendement > 0 ? donnees.rendement.toFixed(2) + '%' : '—');

  Charts.creerGraphiqueLigne('chartROE', IntlData.ANNEES_10_INTL, donnees.roe,
    'ROE (%)', Charts.obtenirCouleurs().principal, v => v.toFixed(1) + '%');

  // Tableau des pairs
  const tbody = document.getElementById('tablePairsBody');
  if (tbody && donnees.peers) {
    tbody.innerHTML = donnees.peers.map(pair => {
      const estActuel = pair.ticker === donnees.ticker;
      return `
        <tr class="${estActuel ? 'peer-highlight-intl' : ''}">
          <td class="text-primary ${estActuel ? 'font-bold' : ''}">${pair.name}</td>
          <td class="text-right font-mono">${pair.ticker}</td>
          <td class="text-right">${pair.roe.toFixed(1)}%</td>
          <td class="text-right">${pair.per.toFixed(1)}x</td>
          <td class="text-right">${pair.rendement > 0 ? pair.rendement.toFixed(1) + '%' : '—'}</td>
          ${estActuel ? '<td class="text-right"><span class="badge badge-info">Vous</span></td>' : '<td></td>'}
        </tr>
      `;
    }).join('');
  }

  // Graphique comparatif
  if (donnees.peers) {
    const noms = donnees.peers.map(p => p.name);
    const roes = donnees.peers.map(p => p.roe);
    const indexActuel = donnees.peers.findIndex(p => p.ticker === donnees.ticker);
    Charts.creerGraphiqueHorizontal('chartComparaisonROE', noms, roes, 'ROE (%)', indexActuel);
  }
}

// ==================== PRIX DE L'ACTION ====================

/**
 * Met à jour la section prix de l'action internationale
 *
 * @param {Object} donnees - Données de l'entreprise
 * @param {Object} score   - Score calculé
 */
function mettreAJourPrixActionIntl(donnees, score) {
  const symbole = donnees.currency === 'EUR' ? '€' : '$';

  mettreAJourElementIntl('prixCourant', `${symbole}${donnees.cours.toFixed(2)}`);
  mettreAJourElementIntl('dividendeActuel',
    donnees.dividende > 0 ? `${symbole}${donnees.dividende.toFixed(2)}` : '—');
  mettreAJourElementIntl('rendementAffiche',
    donnees.rendement > 0 ? donnees.rendement.toFixed(2) + '%' : '—');
  mettreAJourElementIntl('perAffiche', donnees.per.toFixed(1) + 'x');
  mettreAJourElementIntl('pbrAffiche', donnees.pbr.toFixed(1) + 'x');
  mettreAJourElementIntl('capitalisationAffiche', `${symbole}${donnees.capitalisation} Md`);

  // Graphique cours historique
  Charts.creerGraphiqueLigne('chartCours', IntlData.MOIS_12_INTL,
    donnees.cours_historique, 'Cours',
    Charts.obtenirCouleurs().principal,
    v => `${symbole}${v.toFixed(2)}`
  );

  // Jauges valorisation
  Charts.creerJauge('gaugePER', donnees.per, 0, 60, 'PER',
    { vert: 15, orange: 30, rouge: 60 });
  Charts.creerJauge('gaugePBR', donnees.pbr, 0, 15, 'PBR',
    { vert: 1, orange: 5, rouge: 15 });

  mettreAJourElementIntl('scorePER', score.prix.detail.pts_per + ' pts');
  mettreAJourElementIntl('scorePBR', score.prix.detail.pts_pbr + ' pts');

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

// ==================== ACTUALITÉS (BOTTOM-UP) ====================

/**
 * Affiche les actualités de l'entreprise internationale
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourBottomUpIntl(donnees) {
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

  mettreAJourElementIntl('scoreBottomUp', scoreActuelIntl.perspectives.detail.pts_bottom_up + ' / 15 pts');
}

// ==================== TOP-DOWN ====================

/**
 * Met à jour les indicateurs macro/sectoriels
 *
 * @param {Object} donnees - Données de l'entreprise
 */
function mettreAJourTopDownIntl(donnees) {
  const { topdown } = donnees;
  if (!topdown) return;

  mettreAJourCarteTopDownIntl('tdEconomiePts', 'tdEconomieTxt',
    topdown.economie, topdown.economie_pts, topdown.economie_note, 5);

  mettreAJourCarteTopDownIntl('tdSecteurPts', 'tdSecteurTxt',
    topdown.secteur, topdown.secteur_pts, topdown.secteur_note, 5);

  mettreAJourCarteTopDownIntl('tdEntreprisePts', 'tdEntrepriseTxt',
    topdown.entreprise, topdown.entreprise_pts, topdown.entreprise_note, 5);

  mettreAJourElementIntl('scoreTopDown', scoreActuelIntl.perspectives.detail.pts_top_down + ' / 15 pts');
}

/**
 * Met à jour une carte d'indicateur Top-Down
 *
 * @param {string} ptsId  - ID de l'élément score
 * @param {string} txtId  - ID du texte
 * @param {string} texte  - Texte descriptif
 * @param {number} pts    - Points attribués
 * @param {string} note   - Note qualitative
 * @param {number} ptsMax - Points maximum
 */
function mettreAJourCarteTopDownIntl(ptsId, txtId, texte, pts, note, ptsMax) {
  const elPts = document.getElementById(ptsId);
  const elTxt = document.getElementById(txtId);

  if (elPts) {
    const couleur = note === 'positive' ? '#58a6ff' : note === 'negative' ? '#f85149' : '#f0883e';
    elPts.textContent = `${pts}/${ptsMax} pts`;
    elPts.style.color = couleur;
  }

  if (elTxt) elTxt.textContent = texte;
}

// ==================== SIMULATEUR ====================

/**
 * Initialise les événements du simulateur d'investissement
 */
function initialiserSimulateurIntl() {
  const inputs = ['simMontant', 'simHorizon', 'simProfil'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculerSimulationIntl);
  });
}

/**
 * Calcule et affiche la simulation d'investissement internationale
 */
function calculerSimulationIntl() {
  if (!donneesActuellesIntl) return;

  const montant = parseFloat(document.getElementById('simMontant')?.value) || 10000;
  const horizon = parseInt(document.getElementById('simHorizon')?.value) || 5;
  const profil = document.getElementById('simProfil')?.value || 'equilibre';
  const symbole = donneesActuellesIntl.currency === 'EUR' ? '€' : '$';

  const tauxCroissance = { prudent: 0.03, equilibre: 0.06, dynamique: 0.09 };
  const taux = tauxCroissance[profil] || 0.06;

  const valeurFinale = montant * Math.pow(1 + taux, horizon);

  const rendementDiv = (donneesActuellesIntl.rendement || 0) / 100;
  let dividendesCumules = 0;
  let valeurCourante = montant;
  for (let i = 0; i < horizon; i++) {
    dividendesCumules += valeurCourante * rendementDiv;
    valeurCourante *= (1 + taux);
  }

  const rendementTotal = ((valeurFinale - montant + dividendesCumules) / montant * 100).toFixed(1);

  mettreAJourElementIntl('simValeurFinale',
    `${symbole}${valeurFinale.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
  mettreAJourElementIntl('simDividendesCumules',
    dividendesCumules > 0
      ? `${symbole}${dividendesCumules.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
      : '—');
  mettreAJourElementIntl('simRendementTotal', `+${rendementTotal}%`);
  mettreAJourElementIntl('simValeurPlusDividende',
    `${symbole}${(valeurFinale + dividendesCumules).toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
}

/**
 * Déclenche la simulation avec les données de l'entreprise courante
 */
function mettreAJourSimulateurIntl() {
  calculerSimulationIntl();
}

// ==================== SCORE ====================

/**
 * Met à jour la section Score global internationale
 *
 * @param {Object} score - Résultat du scoring 3P
 */
function mettreAJourScoreIntl(score) {
  // Score ring principal
  const ringLarge = document.getElementById('scoreRingLarge');
  if (ringLarge) {
    ringLarge.style.setProperty('--score', score.score);
    const couleurs = { acheter: '#39d353', surveiller: '#f0883e', eviter: '#f85149' };
    const couleur = couleurs[score.recommandationClass] || '#58a6ff';
    ringLarge.style.background = `conic-gradient(${couleur} calc(${score.score} * 3.6deg), #30363d 0)`;
    ringLarge.style.animation = 'none';
    ringLarge.offsetHeight;
    ringLarge.style.animation = 'scoreRevealLarge 1s ease-out';
  }

  mettreAJourElementIntl('scoreNumber', score.score);

  const elReco = document.getElementById('scoreReco');
  if (elReco) {
    elReco.textContent = score.recommandation;
    elReco.className = 'score-reco ' + score.recommandationClass;
  }

  mettreAJourBarreScoreIntl('barPortrait', 'valPortrait', score.portrait.total, score.portrait.max);
  mettreAJourBarreScoreIntl('barPerspectives', 'valPerspectives', score.perspectives.total, score.perspectives.max);
  mettreAJourBarreScoreIntl('barPrix', 'valPrix', score.prix.total, score.prix.max);

  const elJust = document.getElementById('scoreJustification');
  if (elJust) elJust.textContent = score.justification;

  mettreAJourScoreRingIntl('headerScoreRing', 'headerScoreValue', score.score, score.recommandationClass);
}

/**
 * Met à jour une barre de score pilier
 *
 * @param {string} barId - ID de la barre
 * @param {string} valId - ID du texte valeur
 * @param {number} pts   - Points obtenus
 * @param {number} max   - Points maximum
 */
function mettreAJourBarreScoreIntl(barId, valId, pts, max) {
  const bar = document.getElementById(barId);
  const val = document.getElementById(valId);

  if (bar) bar.style.width = Math.round((pts / max) * 100) + '%';
  if (val) val.textContent = `${Math.round(pts)}/${max} pts`;
}

// ==================== SIDEBAR ====================

/**
 * Initialise la barre latérale internationale
 */
function initialiserSidebarIntl() {
  const toggleBtn = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      if (mainContent) mainContent.classList.toggle('sidebar-collapsed');
    });
  }

  const navItems = document.querySelectorAll('.nav-item[data-section]');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      navItems.forEach(n => n.classList.remove('active'));
      this.classList.add('active');

      const sectionId = this.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!section.classList.contains('open')) section.classList.add('open');
      }
    });
  });
}

// ==================== ACCORDÉONS ====================

/**
 * Initialise les accordéons du module international
 */
function initialiserAccordeonsIntl() {
  const premiereSection = document.querySelector('.accordion-section');
  if (premiereSection) premiereSection.classList.add('open');
}

/**
 * Bascule l'état d'un accordéon (exposé globalement)
 *
 * @param {HTMLElement} header - En-tête cliqué
 */
function toggleSectionIntl(header) {
  const section = header.closest('.accordion-section');
  if (section) section.classList.toggle('open');
}

// ==================== UTILITAIRES ====================

/**
 * Met à jour le contenu textuel d'un élément DOM
 *
 * @param {string} id     - ID de l'élément
 * @param {string} valeur - Nouvelle valeur
 */
function mettreAJourElementIntl(id, valeur) {
  const el = document.getElementById(id);
  if (el) el.textContent = valeur;
}

// ==================== EXPORTS GLOBAUX ====================
window.toggleSection = toggleSectionIntl;
window.chargerEntreprise = chargerEntrepriseIntl;
