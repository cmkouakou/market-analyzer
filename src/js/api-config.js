/**
 * =============================================================
 *  Fichier    : api-config.js
 *  Projet     : Market Analyser
 *  Description: Configuration des clés et endpoints API
 *               EODHD (primaire) et Sikafinance (secondaire)
 *               Proxy CORS : corsproxy.io (contourne la restriction
 *               CORS d'EODHD qui bloque les appels fetch() navigateur)
 *  Auteur     : Claude Marcel
 *  Version    : 1.1
 *  Date       : 2026-03-08
 *  Dépendances: (aucune)
 * =============================================================
 */

'use strict';

// ==================== PROXY CORS ====================

/**
 * EODHD ne retourne pas les headers Access-Control-Allow-Origin,
 * ce qui bloque tout appel fetch() depuis le navigateur.
 * Solution : faire transiter les requêtes par corsproxy.io (gratuit).
 *
 * Format : https://corsproxy.io/?{URL_ENCODÉE}
 *
 * Alternatives si corsproxy.io est indisponible :
 *   - https://api.allorigins.win/get?url={URL_ENCODÉE}  (retourne { contents: "..." })
 *   - https://cors.sh/{URL_DIRECTE}                     (nécessite une clé)
 */
const CORS_PROXY = 'https://corsproxy.io/?';

/**
 * Encapsule une URL EODHD dans le proxy CORS
 * @param {string} url - URL EODHD originale
 * @returns {string} URL proxifiée
 */
function proxify(url) {
  return CORS_PROXY + encodeURIComponent(url);
}

// ==================== CONFIGURATION API ====================

const API_CONFIG = {
  eodhd: {
    baseUrl: 'https://eodhd.com/api',
    get token() { return localStorage.getItem('eodhd_token') || 'demo'; },
    exchange: 'BRVM',

    // Endpoints EODHD — tous proxifiés via corsproxy.io
    endpoints: {
      /**
       * Données temps réel pour un ticker (proxifié)
       * @param {string} ticker - Ticker au format SNTS.BRVM
       * @returns {string} URL proxifiée
       */
      realtime: (ticker) =>
        proxify(`https://eodhd.com/api/real-time/${ticker}?api_token=${API_CONFIG.eodhd.token}&fmt=json`),

      /**
       * Historique EOD (End of Day) pour un ticker (proxifié)
       * @param {string} ticker - Ticker au format SNTS.BRVM
       * @param {string} from   - Date de début (YYYY-MM-DD)
       * @param {string} to     - Date de fin (YYYY-MM-DD)
       * @returns {string} URL proxifiée
       */
      historical: (ticker, from, to) =>
        proxify(`https://eodhd.com/api/eod/${ticker}?api_token=${API_CONFIG.eodhd.token}&fmt=json&period=d&from=${from}&to=${to}`),

      /**
       * Données fondamentales pour un ticker (proxifié)
       * @param {string} ticker - Ticker au format SNTS.BRVM
       * @returns {string} URL proxifiée
       */
      fundamentals: (ticker) =>
        proxify(`https://eodhd.com/api/fundamentals/${ticker}?api_token=${API_CONFIG.eodhd.token}&fmt=json`),

      /**
       * Liste de tous les symboles disponibles sur la BRVM (proxifié)
       * @returns {string} URL proxifiée
       */
      exchangeList: () =>
        proxify(`https://eodhd.com/api/exchange-symbol-list/BRVM?api_token=${API_CONFIG.eodhd.token}&fmt=json`),
    },

    // Limites d'utilisation (plan gratuit)
    rateLimit: {
      dailyMax: 20,
      storageKey: 'eodhd_daily_calls',
      dateKey: 'eodhd_last_reset_date',
    }
  },

  sikafinance: {
    baseUrl: 'https://www.sikafinance.com',

    // Endpoints Sikafinance
    endpoints: {
      /**
       * Page de marché paginée
       * @param {number} page - Numéro de page (défaut : 1)
       * @returns {string} URL complète
       */
      marketPage: (page = 1) =>
        `https://www.sikafinance.com/marches/cotationsindices?handler=Marketpage&placecode=CI&pagenb=${page}`,

      /**
       * Téléchargement des données historiques d'un ticker
       * @param {string} ticker - Symbole de l'action
       * @returns {string} URL complète
       */
      download: (ticker) =>
        `https://www.sikafinance.com/marches/download/${ticker}`,
    }
  }
};

// ==================== MAPPING DES TICKERS BRVM ====================

/**
 * Correspondance entre les tickers internes et le format EODHD
 * Format EODHD : CODE.BRVM
 */
const BRVM_TICKER_MAP = {
  'SNTS':  'SNTS.BRVM',  // Sonatel CI
  'SDCI':  'SDCI.BRVM',  // SODECI
  'CIEC':  'CIEI.BRVM',  // CIE (Compagnie Ivoirienne d'Électricité)
  'BOACI': 'BOAC.BRVM',  // BOA CI
  'ETIT':  'ETIT.BRVM',  // Ecobank CI
  'ORCI':  'ORAC.BRVM',  // Orange CI
  'TTLC':  'TTLC.BRVM',  // Total CI
  'NSAB':  'NSBC.BRVM',  // NSIA Banque
  'NTLC':  'NTLC.BRVM',  // Nestlé CI
  'SIBC':  'SIBC.BRVM',  // SIB
};

// ==================== EXPORTS ====================
if (typeof window !== 'undefined') {
  window.ApiConfig = {
    API_CONFIG,
    BRVM_TICKER_MAP,
    proxify,
  };
}
