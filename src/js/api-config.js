/**
 * =============================================================
 *  Fichier    : api-config.js
 *  Projet     : Market Analyser
 *  Description: Configuration des clés et endpoints API
 *               EODHD (primaire) et Sikafinance (secondaire)
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: (aucune)
 * =============================================================
 */

'use strict';

// ==================== CONFIGURATION API ====================

const API_CONFIG = {
  eodhd: {
    baseUrl: 'https://eodhd.com/api',
    token: localStorage.getItem('eodhd_token') || 'demo',
    exchange: 'BRVM',

    // Endpoints EODHD
    endpoints: {
      /**
       * Données temps réel pour un ticker
       * @param {string} ticker - Ticker au format SNTS.BRVM
       * @returns {string} URL complète
       */
      realtime: (ticker) =>
        `https://eodhd.com/api/real-time/${ticker}?api_token=${API_CONFIG.eodhd.token}&fmt=json`,

      /**
       * Historique EOD (End of Day) pour un ticker
       * @param {string} ticker - Ticker au format SNTS.BRVM
       * @param {string} from   - Date de début (YYYY-MM-DD)
       * @param {string} to     - Date de fin (YYYY-MM-DD)
       * @returns {string} URL complète
       */
      historical: (ticker, from, to) =>
        `https://eodhd.com/api/eod/${ticker}?api_token=${API_CONFIG.eodhd.token}&fmt=json&period=d&from=${from}&to=${to}`,

      /**
       * Données fondamentales pour un ticker
       * @param {string} ticker - Ticker au format SNTS.BRVM
       * @returns {string} URL complète
       */
      fundamentals: (ticker) =>
        `https://eodhd.com/api/fundamentals/${ticker}?api_token=${API_CONFIG.eodhd.token}&fmt=json`,

      /**
       * Liste de tous les symboles disponibles sur la BRVM
       * @returns {string} URL complète
       */
      exchangeList: () =>
        `https://eodhd.com/api/exchange-symbol-list/BRVM?api_token=${API_CONFIG.eodhd.token}&fmt=json`,
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
  };
}
