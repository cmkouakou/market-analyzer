/**
 * =============================================================
 *  Fichier    : api-cache.js
 *  Projet     : Market Analyser
 *  Description: Cache en mémoire et localStorage pour les données API
 *               TTL configurable par type de données
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: (aucune)
 * =============================================================
 */

'use strict';

// ==================== CONSTANTES DU CACHE ====================

/** TTL par défaut en minutes pour les cotations temps réel */
const TTL_COTATIONS_MINUTES = 15;

/** TTL pour les données historiques (24 heures) */
const TTL_HISTORIQUE_MINUTES = 1440;

/** Préfixe des clés dans localStorage */
const CACHE_PREFIX = 'brvm_cache_';

// ==================== CLASSE APICACHE ====================

/**
 * Gestionnaire de cache API — in-memory + localStorage
 * Prend en charge l'expiration automatique (TTL)
 */
class ApiCache {
  /**
   * Crée une instance du cache
   *
   * @param {number} ttlMinutes - Durée de vie par défaut en minutes (défaut : 15)
   */
  constructor(ttlMinutes = TTL_COTATIONS_MINUTES) {
    // Cache en mémoire vive (plus rapide)
    this.memCache = {};

    // TTL par défaut
    this.defaultTtl = ttlMinutes;
  }

  /**
   * RECUPERER — Retourne une entrée du cache si elle n'a pas expiré
   *
   * @param {string} cle - Identifiant unique de l'entrée
   * @returns {*|null} Données mises en cache, ou null si absentes/expirées
   *
   * Exemple d'utilisation :
   *   const donnees = cache.get('cotation_SNTS');
   */
  get(cle) {
    const clePrefixee = CACHE_PREFIX + cle;

    // 1. Vérification du cache en mémoire (priorité)
    if (this.memCache[clePrefixee]) {
      const entree = this.memCache[clePrefixee];
      if (this._estValide(entree)) {
        return entree.data;
      }
      // Entrée expirée — supprimer
      delete this.memCache[clePrefixee];
    }

    // 2. Vérification dans localStorage
    try {
      const json = localStorage.getItem(clePrefixee);
      if (!json) return null;

      const entree = JSON.parse(json);
      if (this._estValide(entree)) {
        // Remettre en mémoire vive pour les prochains accès
        this.memCache[clePrefixee] = entree;
        return entree.data;
      }

      // Expirée — nettoyer le localStorage
      localStorage.removeItem(clePrefixee);
    } catch (err) {
      console.warn('[Cache] Erreur de lecture localStorage :', err.message);
    }

    return null;
  }

  /**
   * STOCKER — Enregistre une entrée dans le cache
   *
   * @param {string} cle          - Identifiant unique de l'entrée
   * @param {*}      donnees      - Données à mettre en cache
   * @param {number} [ttlMinutes] - TTL spécifique (override du TTL par défaut)
   *
   * Exemple d'utilisation :
   *   cache.set('cotation_SNTS', { prix: 19500 }, 15);
   *   cache.set('historique_SNTS', tableauDonnees, 1440); // 24h
   */
  set(cle, donnees, ttlMinutes = null) {
    const clePrefixee = CACHE_PREFIX + cle;
    const dureeMs = (ttlMinutes ?? this.defaultTtl) * 60 * 1000;

    const entree = {
      data: donnees,
      expireAt: Date.now() + dureeMs,
      createdAt: Date.now(),
    };

    // Mise en cache mémoire
    this.memCache[clePrefixee] = entree;

    // Persistance dans localStorage
    try {
      localStorage.setItem(clePrefixee, JSON.stringify(entree));
    } catch (err) {
      // localStorage peut être plein (quota dépassé)
      console.warn('[Cache] Impossible de persister dans localStorage :', err.message);
    }
  }

  /**
   * VIDER — Supprime toutes les entrées du cache
   *
   * @param {string} [prefixeFiltre] - Si fourni, ne vide que les clés commençant par ce préfixe
   *
   * Exemple d'utilisation :
   *   cache.clear();              // vide tout
   *   cache.clear('cotation_');   // vide seulement les cotations
   */
  clear(prefixeFiltre = null) {
    // Vider le cache mémoire
    if (prefixeFiltre) {
      const filtreFull = CACHE_PREFIX + prefixeFiltre;
      Object.keys(this.memCache).forEach(cle => {
        if (cle.startsWith(filtreFull)) {
          delete this.memCache[cle];
        }
      });
    } else {
      this.memCache = {};
    }

    // Vider le localStorage
    try {
      const clesASupprimer = [];
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        const filtreFull = CACHE_PREFIX + (prefixeFiltre || '');
        if (cle && cle.startsWith(filtreFull)) {
          clesASupprimer.push(cle);
        }
      }
      clesASupprimer.forEach(cle => localStorage.removeItem(cle));

      console.info(`[Cache] ${clesASupprimer.length} entrée(s) supprimée(s)`);
    } catch (err) {
      console.warn('[Cache] Erreur lors du vidage localStorage :', err.message);
    }
  }

  /**
   * STATISTIQUES — Retourne les infos sur le cache actuel
   *
   * @returns {Object} Nombre d'entrées valides et expirées
   */
  stats() {
    let valides = 0;
    let expirees = 0;
    let tailleTotale = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const cle = localStorage.key(i);
        if (!cle || !cle.startsWith(CACHE_PREFIX)) continue;

        const json = localStorage.getItem(cle);
        if (!json) continue;

        tailleTotale += json.length;

        try {
          const entree = JSON.parse(json);
          if (this._estValide(entree)) {
            valides++;
          } else {
            expirees++;
          }
        } catch {
          expirees++;
        }
      }
    } catch (err) {
      console.warn('[Cache] Erreur de lecture des stats :', err.message);
    }

    return {
      valides,
      expirees,
      tailleTotaleKo: Math.round(tailleTotale / 1024),
    };
  }

  // ==================== MÉTHODES PRIVÉES ====================

  /**
   * Vérifie si une entrée du cache est encore valide
   *
   * @param {Object} entree - Entrée du cache avec expireAt
   * @returns {boolean} True si l'entrée n'a pas expiré
   */
  _estValide(entree) {
    if (!entree || typeof entree.expireAt !== 'number') return false;
    return Date.now() < entree.expireAt;
  }
}

// ==================== INSTANCES PARTAGÉES ====================

/**
 * Cache pour les cotations temps réel (TTL 15 minutes)
 */
const cacheQuotes = new ApiCache(TTL_COTATIONS_MINUTES);

/**
 * Cache pour les données historiques (TTL 24 heures)
 */
const cacheHistorique = new ApiCache(TTL_HISTORIQUE_MINUTES);

// ==================== EXPORTS ====================
if (typeof window !== 'undefined') {
  window.ApiCache = {
    ApiCache,
    cacheQuotes,
    cacheHistorique,
    TTL_COTATIONS_MINUTES,
    TTL_HISTORIQUE_MINUTES,
  };
}
