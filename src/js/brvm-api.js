/**
 * =============================================================
 *  Fichier    : brvm-api.js
 *  Projet     : Market Analyser
 *  Description: Client API BRVM — intégration EODHD (primaire),
 *               Sikafinance (secondaire), fallback vers données mock
 *               Gestion du cache, rate limiting et indicateur de source
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: api-config.js, api-cache.js, brvm-data.js
 * =============================================================
 */

'use strict';

// ==================== CLASSE BRVM API CLIENT ====================

/**
 * Client API BRVM
 * Stratégie : EODHD → Sikafinance → Données mock
 */
class BRVMApiClient {
  constructor() {
    // Source de données active ('live' ou 'mock')
    this.sourceActuelle = 'mock';

    // Référence aux caches partagés
    this.cacheQuotes = window.ApiCache.cacheQuotes;
    this.cacheHistorique = window.ApiCache.cacheHistorique;

    // Référence à la configuration
    this.config = window.ApiConfig.API_CONFIG;
    this.tickerMap = window.ApiConfig.BRVM_TICKER_MAP;
  }

  // ==================== GESTION DU RATE LIMITING ====================

  /**
   * Vérifie et incrémente le compteur d'appels API quotidien EODHD
   * Réinitialise le compteur si on est passé à un nouveau jour
   *
   * @returns {boolean} True si on peut encore appeler l'API aujourd'hui
   */
  _peutAppelerEODHD() {
    const cfg = this.config.eodhd.rateLimit;
    const today = new Date().toDateString();

    // Réinitialisation quotidienne
    const derniereDate = localStorage.getItem(cfg.dateKey);
    if (derniereDate !== today) {
      localStorage.setItem(cfg.storageKey, '0');
      localStorage.setItem(cfg.dateKey, today);
    }

    const nbAppels = parseInt(localStorage.getItem(cfg.storageKey) || '0', 10);
    return nbAppels < cfg.dailyMax;
  }

  /**
   * Incrémente le compteur d'appels API EODHD
   */
  _incrementerCompteurEODHD() {
    const cfg = this.config.eodhd.rateLimit;
    const nbAppels = parseInt(localStorage.getItem(cfg.storageKey) || '0', 10);
    localStorage.setItem(cfg.storageKey, String(nbAppels + 1));
    this._mettreAJourAffichageCompteur();
  }

  /**
   * Retourne le nombre d'appels EODHD effectués aujourd'hui
   *
   * @returns {number} Nombre d'appels du jour
   */
  _nbAppelsAujourdhui() {
    const cfg = this.config.eodhd.rateLimit;
    const today = new Date().toDateString();
    const derniereDate = localStorage.getItem(cfg.dateKey);

    if (derniereDate !== today) return 0;
    return parseInt(localStorage.getItem(cfg.storageKey) || '0', 10);
  }

  /**
   * Met à jour l'affichage du compteur d'appels dans le panneau paramètres
   */
  _mettreAJourAffichageCompteur() {
    const el = document.getElementById('apiCallCount');
    if (el) el.textContent = this._nbAppelsAujourdhui();
  }

  // ==================== COTATION TEMPS RÉEL ====================

  /**
   * Récupère la cotation temps réel d'un ticker
   * Stratégie : cache → EODHD → Sikafinance → données mock
   *
   * @param {string} ticker - Code BRVM interne (ex: 'SNTS')
   * @returns {Promise<Object>} Cotation avec { ticker, close, open, high, low, volume, change_p, date }
   *
   * Erreurs possibles :
   *   - Retourne les données mock si les deux API échouent
   */
  async getQuote(ticker) {
    const cleCahce = `cotation_${ticker}`;

    // Vérification du cache
    const doneesEnCache = this.cacheQuotes.get(cleCahce);
    if (doneesEnCache) {
      console.info(`[BRVM API] Cotation ${ticker} servie depuis le cache`);
      return doneesEnCache;
    }

    // Tentative EODHD
    try {
      const cotation = await this._getQuoteEODHD(ticker);
      if (cotation) {
        this.cacheQuotes.set(cleCahce, cotation);
        this.sourceActuelle = 'live';
        return cotation;
      }
    } catch (err) {
      console.warn(`[BRVM API] Erreur EODHD pour ${ticker} :`, err.message);
    }

    // Tentative Sikafinance
    try {
      const cotationSika = await this._getQuoteSikafinance(ticker);
      if (cotationSika) {
        this.cacheQuotes.set(cleCahce, cotationSika);
        this.sourceActuelle = 'live';
        return cotationSika;
      }
    } catch (err) {
      console.warn(`[BRVM API] Erreur Sikafinance pour ${ticker} :`, err.message);
    }

    // Fallback données mock
    console.info(`[BRVM API] Utilisation des données simulées pour ${ticker}`);
    this.sourceActuelle = 'mock';
    return this._getQuoteMock(ticker);
  }

  // ==================== DONNÉES HISTORIQUES ====================

  /**
   * Récupère l'historique de cours sur N années
   * Stratégie : cache → EODHD → données mock
   *
   * @param {string} ticker - Code BRVM interne (ex: 'SNTS')
   * @param {number} years  - Nombre d'années d'historique (défaut : 10)
   * @returns {Promise<Object>} { dates[], close[], open[], high[], low[], volume[] }
   *
   * Erreurs possibles :
   *   - Retourne l'historique mock si l'API échoue
   */
  async getHistorical(ticker, years = 10) {
    const cleCahce = `historique_${ticker}_${years}ans`;

    // Vérification du cache (TTL 24h)
    const doneesEnCache = this.cacheHistorique.get(cleCahce);
    if (doneesEnCache) {
      console.info(`[BRVM API] Historique ${ticker} servi depuis le cache`);
      return doneesEnCache;
    }

    // Tentative EODHD
    try {
      const historique = await this._getHistoriqueEODHD(ticker, years);
      if (historique && historique.dates.length > 0) {
        // TTL 24h pour les données historiques
        this.cacheHistorique.set(cleCahce, historique, window.ApiCache.TTL_HISTORIQUE_MINUTES);
        return historique;
      }
    } catch (err) {
      console.warn(`[BRVM API] Erreur EODHD historique pour ${ticker} :`, err.message);
    }

    // Fallback données mock
    console.info(`[BRVM API] Historique simulé utilisé pour ${ticker}`);
    return this._getHistoriqueMock(ticker);
  }

  // ==================== TOUTES LES COTATIONS ====================

  /**
   * Récupère les cotations de toutes les entreprises BRVM suivies
   *
   * @returns {Promise<Array>} Tableau de cotations pour chaque entreprise
   */
  async getAllQuotes() {
    const tickers = Object.keys(this.tickerMap);
    const promesses = tickers.map(async ticker => {
      try {
        return await this.getQuote(ticker);
      } catch {
        return this._getQuoteMock(ticker);
      }
    });

    return Promise.all(promesses);
  }

  // ==================== DONNÉES D'INDEX ====================

  /**
   * Récupère les données historiques d'un indice BRVM
   *
   * @param {string} index - Code de l'indice (défaut : 'BRVMC' pour BRVM Composite)
   * @returns {Promise<Object>} Historique de l'indice
   */
  async getIndexData(index = 'BRVMC') {
    const cleCahce = `index_${index}`;

    const doneesEnCache = this.cacheHistorique.get(cleCahce);
    if (doneesEnCache) return doneesEnCache;

    // L'indice BRVM n'est pas disponible en mode démo EODHD
    // Retourne des données simulées
    return this._getIndexMock(index);
  }

  // ==================== RÉSUMÉ DU MARCHÉ ====================

  /**
   * Retourne un résumé global du marché BRVM
   *
   * @returns {Promise<Object>} { composite, brvm10, totalVolume, totalCap, advancers, decliners }
   */
  async getMarketSummary() {
    try {
      const toutesLesCotations = await this.getAllQuotes();

      let totalVolume = 0;
      let totalCap = 0;
      let advancers = 0;
      let decliners = 0;

      toutesLesCotations.forEach(cotation => {
        totalVolume += cotation.volume || 0;
        // Calcul de la capitalisation si disponible
        const donneesMock = BRVMData.BRVM_COMPANIES[cotation.ticker];
        if (donneesMock) {
          totalCap += donneesMock.capitalisation || 0;
        }
        if ((cotation.change_p || 0) > 0) advancers++;
        if ((cotation.change_p || 0) < 0) decliners++;
      });

      return {
        composite: { label: 'BRVM Composite', valeur: '—' },
        brvm10: { label: 'BRVM 10', valeur: '—' },
        totalVolume,
        totalCap,
        advancers,
        decliners,
        source: this.sourceActuelle,
      };
    } catch (err) {
      console.warn('[BRVM API] Erreur résumé marché :', err.message);
      return this._getMarketSummaryMock();
    }
  }

  // ==================== MÉTHODES EODHD (PRIVÉES) ====================

  /**
   * Appelle l'API EODHD pour récupérer une cotation temps réel
   *
   * @param {string} ticker - Code BRVM interne (ex: 'SNTS')
   * @returns {Promise<Object|null>} Cotation normalisée ou null
   *
   * Erreurs possibles :
   *   - Lève une erreur si le quota journalier est dépassé
   *   - Lève une erreur si la réponse HTTP n'est pas 200
   */
  async _getQuoteEODHD(ticker) {
    // Vérification du quota quotidien
    if (!this._peutAppelerEODHD()) {
      const msg = `Quota EODHD atteint (${this.config.eodhd.rateLimit.dailyMax} appels/jour). Données simulées utilisées.`;
      console.warn(`[BRVM API] ${msg}`);
      this._afficherAlerteQuota(msg);
      throw new Error('Quota EODHD dépassé');
    }

    const tickerEODHD = this.tickerMap[ticker];
    if (!tickerEODHD) {
      throw new Error(`Ticker EODHD inconnu pour : ${ticker}`);
    }

    const url = this.config.eodhd.endpoints.realtime(tickerEODHD);

    const reponse = await fetch(url, { signal: AbortSignal.timeout(8000) });
    this._incrementerCompteurEODHD();

    if (!reponse.ok) {
      throw new Error(`EODHD HTTP ${reponse.status} pour ${tickerEODHD}`);
    }

    const json = await reponse.json();

    // Validation de la réponse
    if (!json || json.code === 'NA' || json.close === undefined) {
      throw new Error(`Données EODHD invalides pour ${tickerEODHD}`);
    }

    // Normalisation de la réponse
    return {
      ticker,
      close: parseFloat(json.close) || 0,
      open: parseFloat(json.open) || 0,
      high: parseFloat(json.high) || 0,
      low: parseFloat(json.low) || 0,
      volume: parseInt(json.volume, 10) || 0,
      previousClose: parseFloat(json.previousClose) || 0,
      change: parseFloat(json.change) || 0,
      change_p: parseFloat(json.change_p) || 0,
      date: json.timestamp ? new Date(json.timestamp * 1000).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      source: 'eodhd',
    };
  }

  /**
   * Appelle l'API EODHD pour récupérer l'historique de cours
   *
   * @param {string} ticker - Code BRVM interne (ex: 'SNTS')
   * @param {number} years  - Nombre d'années d'historique
   * @returns {Promise<Object>} Historique normalisé
   *
   * Erreurs possibles :
   *   - Lève une erreur si le quota est dépassé ou la réponse invalide
   */
  async _getHistoriqueEODHD(ticker, years) {
    if (!this._peutAppelerEODHD()) {
      throw new Error('Quota EODHD dépassé');
    }

    const tickerEODHD = this.tickerMap[ticker];
    if (!tickerEODHD) {
      throw new Error(`Ticker EODHD inconnu pour : ${ticker}`);
    }

    // Calcul des dates (de aujourd'hui - N années à aujourd'hui)
    const dateFin = new Date();
    const dateDebut = new Date();
    dateDebut.setFullYear(dateDebut.getFullYear() - years);

    const formatDate = d => d.toISOString().split('T')[0];
    const url = this.config.eodhd.endpoints.historical(
      tickerEODHD,
      formatDate(dateDebut),
      formatDate(dateFin)
    );

    const reponse = await fetch(url, { signal: AbortSignal.timeout(10000) });
    this._incrementerCompteurEODHD();

    if (!reponse.ok) {
      throw new Error(`EODHD historique HTTP ${reponse.status} pour ${tickerEODHD}`);
    }

    const json = await reponse.json();

    if (!Array.isArray(json) || json.length === 0) {
      throw new Error(`Historique EODHD vide pour ${tickerEODHD}`);
    }

    // Normalisation — transformation en tableau de séries
    return {
      ticker,
      dates: json.map(j => j.date),
      close: json.map(j => parseFloat(j.adjusted_close) || parseFloat(j.close) || 0),
      open: json.map(j => parseFloat(j.open) || 0),
      high: json.map(j => parseFloat(j.high) || 0),
      low: json.map(j => parseFloat(j.low) || 0),
      volume: json.map(j => parseInt(j.volume, 10) || 0),
      source: 'eodhd',
    };
  }

  // ==================== MÉTHODES SIKAFINANCE (PRIVÉES) ====================

  /**
   * Tente de récupérer une cotation via Sikafinance
   * Note : Les restrictions CORS peuvent bloquer cet appel depuis le navigateur
   *
   * @param {string} ticker - Code BRVM interne (ex: 'SNTS')
   * @returns {Promise<Object|null>} Cotation normalisée ou null si CORS bloque
   *
   * Erreurs possibles :
   *   - Lève une erreur silencieuse en cas de blocage CORS (fallback vers mock)
   */
  async _getQuoteSikafinance(ticker) {
    const url = this.config.sikafinance.endpoints.marketPage(1);

    // Tentative avec timeout court (CORS souvent bloqué)
    const reponse = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: { 'Accept': 'application/json' },
    });

    if (!reponse.ok) {
      throw new Error(`Sikafinance HTTP ${reponse.status}`);
    }

    const json = await reponse.json();

    // Recherche du ticker dans la réponse
    const cotations = Array.isArray(json) ? json : (json.data || json.results || []);
    const item = cotations.find(c =>
      (c.symbol || c.code || c.ticker || '').toUpperCase() === ticker.toUpperCase()
    );

    if (!item) return null;

    return {
      ticker,
      close: parseFloat(item.close || item.last || item.prix || 0),
      open: parseFloat(item.open || item.ouverture || 0),
      high: parseFloat(item.high || item.haut || 0),
      low: parseFloat(item.low || item.bas || 0),
      volume: parseInt(item.volume || 0, 10),
      change_p: parseFloat(item.change_p || item.variation || 0),
      change: parseFloat(item.change || 0),
      date: new Date().toISOString().split('T')[0],
      source: 'sikafinance',
    };
  }

  // ==================== MÉTHODES MOCK / FALLBACK (PRIVÉES) ====================

  /**
   * Retourne les données de cotation mock pour un ticker
   *
   * @param {string} ticker - Code BRVM interne (ex: 'SNTS')
   * @returns {Object} Cotation simulée depuis brvm-data.js
   */
  _getQuoteMock(ticker) {
    const entreprise = BRVMData.BRVM_COMPANIES[ticker];
    if (!entreprise) {
      return {
        ticker,
        close: 0, open: 0, high: 0, low: 0,
        volume: 0, change_p: 0, change: 0,
        date: new Date().toISOString().split('T')[0],
        source: 'mock',
      };
    }

    const historique = entreprise.cours_historique;
    const dernierCours = historique[historique.length - 1];
    const avantDernierCours = historique[historique.length - 2] || dernierCours;
    const changement = dernierCours - avantDernierCours;
    const changePct = avantDernierCours > 0 ? (changement / avantDernierCours) * 100 : 0;

    return {
      ticker,
      close: dernierCours,
      open: avantDernierCours,
      high: Math.max(dernierCours, avantDernierCours),
      low: Math.min(dernierCours, avantDernierCours),
      volume: 0,
      change: changement,
      change_p: Math.round(changePct * 100) / 100,
      previousClose: avantDernierCours,
      date: new Date().toISOString().split('T')[0],
      source: 'mock',
    };
  }

  /**
   * Retourne les données historiques mock pour un ticker
   *
   * @param {string} ticker - Code BRVM interne
   * @returns {Object} Historique simulé depuis brvm-data.js
   */
  _getHistoriqueMock(ticker) {
    const entreprise = BRVMData.BRVM_COMPANIES[ticker];
    if (!entreprise) {
      return { ticker, dates: [], close: [], open: [], high: [], low: [], volume: [], source: 'mock' };
    }

    return {
      ticker,
      dates: BRVMData.MOIS_12,
      close: entreprise.cours_historique,
      open: entreprise.cours_historique.map(c => c * 0.998),
      high: entreprise.cours_historique.map(c => c * 1.005),
      low: entreprise.cours_historique.map(c => c * 0.993),
      volume: entreprise.cours_historique.map(() => 0),
      source: 'mock',
    };
  }

  /**
   * Retourne des données d'index simulées
   *
   * @param {string} index - Code de l'indice
   * @returns {Object} Données d'index simulées
   */
  _getIndexMock(index) {
    return {
      index,
      dates: BRVMData.ANNEES_10,
      valeurs: [180, 192, 205, 218, 231, 245, 228, 259, 278, 295],
      source: 'mock',
    };
  }

  /**
   * Retourne un résumé de marché simulé
   *
   * @returns {Object} Résumé du marché BRVM (données mock)
   */
  _getMarketSummaryMock() {
    return {
      composite: { label: 'BRVM Composite', valeur: '295.4' },
      brvm10: { label: 'BRVM 10', valeur: '310.2' },
      totalVolume: 0,
      totalCap: Object.values(BRVMData.BRVM_COMPANIES).reduce((s, e) => s + (e.capitalisation || 0), 0),
      advancers: 6,
      decliners: 3,
      source: 'mock',
    };
  }

  // ==================== INTERFACE UTILISATEUR ====================

  /**
   * Affiche une alerte de dépassement de quota dans l'interface
   *
   * @param {string} message - Message à afficher
   */
  _afficherAlerteQuota(message) {
    const el = document.getElementById('apiTestResult');
    if (el) {
      el.className = 'api-test-result error';
      el.textContent = `Limite atteinte : ${message}`;
      el.style.display = 'block';
    }
  }
}

// ==================== FONCTIONS GLOBALES DU PANNEAU PARAMÈTRES ====================

/**
 * Sauvegarde la clé API EODHD saisie par l'utilisateur
 */
function saveApiKey() {
  const input = document.getElementById('eodhdTokenInput');
  if (!input) return;

  const token = input.value.trim();
  if (!token) {
    afficherResultatTest('Veuillez saisir une clé API valide.', 'error');
    return;
  }

  localStorage.setItem('eodhd_token', token);
  // Le getter API_CONFIG.eodhd.token lit toujours depuis localStorage — pas besoin de mise à jour manuelle

  afficherResultatTest('Clé API sauvegardée. Cliquez sur "Tester" pour valider.', 'success');
}

/**
 * Teste la connexion à l'API EODHD avec la clé enregistrée
 */
async function testApiConnection() {
  afficherResultatTest('Test en cours...', '');

  try {
    const token = localStorage.getItem('eodhd_token') || 'demo';
    // Utilisation du proxy CORS — EODHD bloque les fetch() directs depuis le navigateur
    const urlBrute = `https://eodhd.com/api/real-time/SNTS.BRVM?api_token=${token}&fmt=json`;
    const url = window.ApiConfig.proxify(urlBrute);
    const reponse = await fetch(url, { signal: AbortSignal.timeout(12000) });

    if (!reponse.ok) {
      afficherResultatTest(`Erreur HTTP ${reponse.status} — Clé invalide ou service indisponible.`, 'error');
      return;
    }

    const json = await reponse.json();
    if (json && json.close !== undefined) {
      const coursFormate = Math.round(json.close).toLocaleString('fr-FR');
      afficherResultatTest(`✓ Connexion réussie ! Cours Sonatel CI : ${coursFormate} FCFA`, 'success');
    } else if (json && json.code === 'NA') {
      afficherResultatTest('Ticker non disponible sur le plan gratuit. Données simulées utilisées.', 'error');
    } else {
      afficherResultatTest('Réponse reçue mais données incomplètes. Vérifiez votre clé.', 'error');
    }
  } catch (err) {
    afficherResultatTest(`Échec de la connexion : ${err.message}`, 'error');
  }
}

/**
 * Vide le cache API et met à jour l'affichage
 */
function clearApiCache() {
  window.ApiCache.cacheQuotes.clear();
  window.ApiCache.cacheHistorique.clear();

  const elCache = document.getElementById('cacheStatus');
  if (elCache) elCache.textContent = 'Vide';

  afficherResultatTest('Cache vidé avec succès.', 'success');
}

/**
 * Affiche le résultat d'un test dans le panneau paramètres
 *
 * @param {string} message - Message à afficher
 * @param {string} type    - Type : 'success', 'error', ou '' (neutre)
 */
function afficherResultatTest(message, type) {
  const el = document.getElementById('apiTestResult');
  if (!el) return;

  el.className = `api-test-result${type ? ' ' + type : ''}`;
  el.textContent = message;
  el.style.display = 'block';
}

/**
 * Bascule l'affichage du panneau de configuration API
 */
function toggleApiSettings() {
  const panneau = document.getElementById('apiSettingsPanel');
  if (!panneau) return;

  panneau.classList.toggle('visible');

  // Mise à jour des stats à l'ouverture
  if (panneau.classList.contains('visible')) {
    const elCount = document.getElementById('apiCallCount');
    if (elCount) elCount.textContent = brvmApi ? brvmApi._nbAppelsAujourdhui() : 0;

    const elCache = document.getElementById('cacheStatus');
    if (elCache) {
      const stats = window.ApiCache.cacheQuotes.stats();
      elCache.textContent = stats.valides > 0
        ? `${stats.valides} entrée(s) — ${stats.tailleTotaleKo} Ko`
        : 'Vide';
    }

    // Pré-remplissage de la clé API
    const input = document.getElementById('eodhdTokenInput');
    if (input) {
      const tokenEnregistre = localStorage.getItem('eodhd_token') || '';
      if (tokenEnregistre && tokenEnregistre !== 'demo') {
        input.value = tokenEnregistre;
      }
    }
  }
}

/**
 * Affiche ou masque l'indicateur de source des données dans le header
 *
 * @param {string} source - 'live' ou 'mock'
 */
function showDataSourceIndicator(source) {
  const indicateur = document.getElementById('dataSourceIndicator');
  if (!indicateur) return;

  const dot = indicateur.querySelector('.dot');
  const label = indicateur.querySelector('.label');

  if (source === 'live') {
    if (dot) {
      dot.className = 'dot live';
    }
    if (label) label.textContent = 'Données temps réel';
    indicateur.title = 'Les données proviennent de l\'API EODHD ou Sikafinance';
  } else {
    if (dot) {
      dot.className = 'dot mock';
    }
    if (label) label.textContent = 'Données simulées';
    indicateur.title = 'Les données API sont indisponibles — données de démonstration affichées';
  }
}

// ==================== INSTANCE GLOBALE ====================

/**
 * Instance partagée du client API BRVM
 * Disponible globalement après l'initialisation du DOM
 */
let brvmApi = null;

document.addEventListener('DOMContentLoaded', function() {
  brvmApi = new BRVMApiClient();

  // Mise à jour initiale du compteur d'appels
  const elCount = document.getElementById('apiCallCount');
  if (elCount) elCount.textContent = brvmApi._nbAppelsAujourdhui();
});

// ==================== EXPORTS GLOBAUX ====================
if (typeof window !== 'undefined') {
  window.BRVMApiClient = BRVMApiClient;
  window.saveApiKey = saveApiKey;
  window.testApiConnection = testApiConnection;
  window.clearApiCache = clearApiCache;
  window.toggleApiSettings = toggleApiSettings;
  window.showDataSourceIndicator = showDataSourceIndicator;
}
