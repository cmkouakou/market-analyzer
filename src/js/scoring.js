/**
 * =============================================================
 *  Fichier    : scoring.js
 *  Projet     : Market Analyser
 *  Description: Moteur de notation 3P (Portrait/Performance, Perspectives, Prix)
 *               Implémentation pure JavaScript sans dépendances externes
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: (aucune)
 * =============================================================
 */

'use strict';

// ==================== CONSTANTES DE SCORING ====================
const SCORING_CONFIG = {
  PORTRAIT: {
    MAX: 40,
    CA_CAGR: {
      EXCELLENT: { MIN: 8, POINTS: 15 },
      BON: { MIN: 3, MAX: 8, POINTS: 10 },
      FAIBLE: { MIN: 0, MAX: 3, POINTS: 5 },
      NEGATIF: { POINTS: 0 }
    },
    REX_GROWTH: {
      REGULIER: 12.5,
      IRREGULIER: 6,
      DECLIN: 0
    },
    RN_GROWTH: {
      REGULIER: 12.5,
      IRREGULIER: 6,
      DECLIN: 0
    }
  },
  PERSPECTIVES: {
    MAX: 30,
    BOTTOM_UP: {
      MAX: 15,
      POSITIF: 3,
      NEUTRE: 1,
      NEGATIF: -2
    },
    TOP_DOWN: {
      MAX: 15,
      ECONOMIE: { MAX: 5 },
      SECTEUR: { MAX: 5 },
      ENTREPRISE: { MAX: 5 }
    }
  },
  PRIX: {
    MAX: 30,
    PER: {
      EXCELLENT: { MAX: 10, POINTS: 10 },
      BON: { MIN: 10, MAX: 15, POINTS: 8 },
      ACCEPTABLE: { MIN: 15, MAX: 22, POINTS: 5 },
      CHER: { POINTS: 0 }
    },
    PBR: {
      EXCELLENT: { MAX: 1, POINTS: 10 },
      BON: { MIN: 1, MAX: 2, POINTS: 8 },
      ACCEPTABLE: { MIN: 2, MAX: 3, POINTS: 5 },
      CHER: { POINTS: 0 }
    },
    GRAHAM_BONUS: 5,
    GRAHAM_THRESHOLD: 22.5,
    RENDEMENT: {
      EXCELLENT: { MIN: 3.5, POINTS: 10 },
      BON: { MIN: 2, MAX: 3.5, POINTS: 6 },
      FAIBLE: { POINTS: 2 }
    }
  },
  RECOMMANDATION: {
    ACHETER: { MIN: 70 },
    SURVEILLER: { MIN: 40 },
    EVITER: { MIN: 0 }
  }
};

// ==================== FONCTIONS UTILITAIRES ====================

/**
 * Calcule le CAGR (Taux de Croissance Annuel Composé)
 *
 * @param {number} valeurInitiale - Valeur de départ
 * @param {number} valeurFinale   - Valeur d'arrivée
 * @param {number} nbAnnees       - Nombre d'années
 * @returns {number} CAGR en pourcentage
 */
function calculerCAGR(valeurInitiale, valeurFinale, nbAnnees) {
  if (!valeurInitiale || valeurInitiale <= 0 || nbAnnees <= 0) return 0;
  return ((Math.pow(valeurFinale / valeurInitiale, 1 / nbAnnees) - 1) * 100);
}

/**
 * Évalue la régularité d'une croissance sur une série de données
 * Retourne 'regulier', 'irregulier', ou 'declin'
 *
 * @param {number[]} series - Tableau de valeurs chronologiques
 * @returns {string} Qualité de la croissance
 */
function evaluerRegulariteCroissance(series) {
  if (!series || series.length < 2) return 'irregulier';

  let hausses = 0;
  let baisses = 0;

  for (let i = 1; i < series.length; i++) {
    if (series[i] > series[i - 1]) {
      hausses++;
    } else if (series[i] < series[i - 1]) {
      baisses++;
    }
  }

  const total = series.length - 1;
  const tauxHausse = hausses / total;

  // Déclin si plus de 50% de baisses
  if (baisses > total * 0.5) return 'declin';
  // Régulier si plus de 75% de hausses
  if (tauxHausse >= 0.75) return 'regulier';
  return 'irregulier';
}

/**
 * Calcule le rendement du dividende
 *
 * @param {number} dividende  - Dividende par action
 * @param {number} coursActuel - Prix actuel de l'action
 * @returns {number} Rendement en pourcentage
 */
function calculerRendement(dividende, coursActuel) {
  if (!coursActuel || coursActuel <= 0) return 0;
  return (dividende / coursActuel) * 100;
}

// ==================== MOTEUR DE NOTATION ====================

/**
 * Calcule le score Portrait / Performance (max 40 pts)
 *
 * @param {Object} donnees - Données de l'entreprise
 * @returns {Object} Score et détail par sous-catégorie
 *
 * Exemple:
 *   const score = calculerScorePortrait({ ca: [...], rex: [...], rn: [...] });
 */
function calculerScorePortrait(donnees) {
  const { ca, rex, rn } = donnees;
  const detail = {};

  // --- Score CA (CAGR sur 10 ans) ---
  const cagr_ca = calculerCAGR(ca[0], ca[ca.length - 1], ca.length - 1);
  detail.cagr_ca = cagr_ca;

  let pts_ca = 0;
  const cfgCA = SCORING_CONFIG.PORTRAIT.CA_CAGR;
  if (cagr_ca >= cfgCA.EXCELLENT.MIN) {
    pts_ca = cfgCA.EXCELLENT.POINTS;
  } else if (cagr_ca >= cfgCA.BON.MIN) {
    pts_ca = cfgCA.BON.POINTS;
  } else if (cagr_ca >= cfgCA.FAIBLE.MIN) {
    pts_ca = cfgCA.FAIBLE.POINTS;
  } else {
    pts_ca = cfgCA.NEGATIF.POINTS;
  }

  // --- Score REX (régularité de croissance) ---
  const qualite_rex = evaluerRegulariteCroissance(rex);
  detail.qualite_rex = qualite_rex;
  const cfgREX = SCORING_CONFIG.PORTRAIT.REX_GROWTH;
  const pts_rex = cfgREX[qualite_rex.toUpperCase()] ?? cfgREX.IRREGULIER;

  // --- Score RN (régularité de croissance) ---
  const qualite_rn = evaluerRegulariteCroissance(rn);
  detail.qualite_rn = qualite_rn;
  const cfgRN = SCORING_CONFIG.PORTRAIT.RN_GROWTH;
  const pts_rn = cfgRN[qualite_rn.toUpperCase()] ?? cfgRN.IRREGULIER;

  const total = Math.min(pts_ca + pts_rex + pts_rn, SCORING_CONFIG.PORTRAIT.MAX);

  return {
    total,
    max: SCORING_CONFIG.PORTRAIT.MAX,
    detail: {
      pts_ca,
      pts_rex,
      pts_rn,
      cagr_ca: Math.round(cagr_ca * 100) / 100,
      qualite_rex,
      qualite_rn
    }
  };
}

/**
 * Calcule le score Perspectives (max 30 pts)
 *
 * @param {Object} perspectives - Données des perspectives (news + topdown)
 * @returns {Object} Score et détail
 *
 * Exemple:
 *   const score = calculerScorePerspectives({ news: [...], topdown: {...} });
 */
function calculerScorePerspectives(perspectives) {
  const { news, topdown } = perspectives;
  const cfg = SCORING_CONFIG.PERSPECTIVES;

  // --- Bottom-Up (actualités) ---
  let pts_bottom_up = 0;
  const cfgBU = cfg.BOTTOM_UP;

  if (news && news.length > 0) {
    news.forEach(item => {
      if (item.impact === 'positif') pts_bottom_up += cfgBU.POSITIF;
      else if (item.impact === 'neutre') pts_bottom_up += cfgBU.NEUTRE;
      else if (item.impact === 'negatif') pts_bottom_up += cfgBU.NEGATIF;
    });
    pts_bottom_up = Math.max(0, Math.min(pts_bottom_up, cfgBU.MAX));
  }

  // --- Top-Down (macro/sectoriel) ---
  let pts_top_down = 0;
  const cfgTD = cfg.TOP_DOWN;

  if (topdown) {
    pts_top_down += Math.min(topdown.economie_pts || 0, cfgTD.ECONOMIE.MAX);
    pts_top_down += Math.min(topdown.secteur_pts || 0, cfgTD.SECTEUR.MAX);
    pts_top_down += Math.min(topdown.entreprise_pts || 0, cfgTD.ENTREPRISE.MAX);
    pts_top_down = Math.min(pts_top_down, cfgTD.MAX);
  }

  const total = Math.min(pts_bottom_up + pts_top_down, cfg.MAX);

  return {
    total,
    max: cfg.MAX,
    detail: {
      pts_bottom_up,
      pts_top_down,
      nb_news: news ? news.length : 0
    }
  };
}

/**
 * Calcule le score Prix / Valorisation (max 30 pts)
 *
 * @param {Object} prix - Données de valorisation boursière
 * @returns {Object} Score et détail
 *
 * Exemple:
 *   const score = calculerScorePrix({ per: 12, pbr: 1.8, rendement: 3.2 });
 */
function calculerScorePrix(prix) {
  const { per, pbr, rendement } = prix;
  const cfg = SCORING_CONFIG.PRIX;

  // --- Score PER ---
  let pts_per = 0;
  if (per !== null && per !== undefined) {
    if (per < cfg.PER.EXCELLENT.MAX) {
      pts_per = cfg.PER.EXCELLENT.POINTS;
    } else if (per < cfg.PER.BON.MAX) {
      pts_per = cfg.PER.BON.POINTS;
    } else if (per < cfg.PER.ACCEPTABLE.MAX) {
      pts_per = cfg.PER.ACCEPTABLE.POINTS;
    } else {
      pts_per = cfg.PER.CHER.POINTS;
    }
  }

  // --- Score PBR ---
  let pts_pbr = 0;
  if (pbr !== null && pbr !== undefined) {
    if (pbr < cfg.PBR.EXCELLENT.MAX) {
      pts_pbr = cfg.PBR.EXCELLENT.POINTS;
    } else if (pbr < cfg.PBR.BON.MAX) {
      pts_pbr = cfg.PBR.BON.POINTS;
    } else if (pbr < cfg.PBR.ACCEPTABLE.MAX) {
      pts_pbr = cfg.PBR.ACCEPTABLE.POINTS;
    } else {
      pts_pbr = cfg.PBR.CHER.POINTS;
    }
  }

  // --- Bonus règle de Graham (PER × PBR < 22.5) ---
  let bonus_graham = 0;
  const graham_val = per * pbr;
  const graham_pass = graham_val < cfg.GRAHAM_THRESHOLD;
  if (graham_pass) {
    bonus_graham = cfg.GRAHAM_BONUS;
  }

  // --- Score Rendement ---
  let pts_rendement = 0;
  const cfgRend = cfg.RENDEMENT;
  if (rendement !== null && rendement !== undefined) {
    if (rendement >= cfgRend.EXCELLENT.MIN) {
      pts_rendement = cfgRend.EXCELLENT.POINTS;
    } else if (rendement >= cfgRend.BON.MIN) {
      pts_rendement = cfgRend.BON.POINTS;
    } else {
      pts_rendement = cfgRend.FAIBLE.POINTS;
    }
  }

  const total = Math.min(pts_per + pts_pbr + bonus_graham + pts_rendement, cfg.MAX);

  return {
    total,
    max: cfg.MAX,
    detail: {
      pts_per,
      pts_pbr,
      bonus_graham,
      pts_rendement,
      graham_val: Math.round(graham_val * 100) / 100,
      graham_pass,
      per,
      pbr,
      rendement: Math.round(rendement * 100) / 100
    }
  };
}

/**
 * Calcule le score global 3P et la recommandation d'investissement
 *
 * @param {Object} entreprise - Données complètes de l'entreprise
 * @returns {Object} Score global, détail par pilier, recommandation et justification
 *
 * Exemple:
 *   const resultat = calculerScore3P(donneesEntreprise);
 *   // { score: 76, recommandation: 'Acheter', portrait: {...}, ... }
 */
function calculerScore3P(entreprise) {
  const {
    ca, rex, rn,
    news, topdown,
    per, pbr, dividende, cours
  } = entreprise;

  // Calcul du rendement si nécessaire
  const rendement = entreprise.rendement ?? calculerRendement(dividende, cours);

  // Calcul des trois piliers
  const portrait = calculerScorePortrait({ ca, rex, rn });
  const perspectives = calculerScorePerspectives({ news, topdown });
  const prixScore = calculerScorePrix({ per, pbr, rendement });

  // Score global
  const scoreTotal = portrait.total + perspectives.total + prixScore.total;

  // Recommandation
  const cfg = SCORING_CONFIG.RECOMMANDATION;
  let recommandation, recommandationClass;
  if (scoreTotal >= cfg.ACHETER.MIN) {
    recommandation = 'Acheter';
    recommandationClass = 'acheter';
  } else if (scoreTotal >= cfg.SURVEILLER.MIN) {
    recommandation = 'Surveiller';
    recommandationClass = 'surveiller';
  } else {
    recommandation = 'Éviter';
    recommandationClass = 'eviter';
  }

  // Génération de la justification textuelle
  const justification = genererJustification(
    entreprise,
    scoreTotal,
    portrait,
    perspectives,
    prixScore,
    recommandation
  );

  return {
    score: scoreTotal,
    recommandation,
    recommandationClass,
    portrait,
    perspectives,
    prix: prixScore,
    rendement,
    justification
  };
}

/**
 * Génère une justification textuelle du score en français
 *
 * @param {Object} entreprise    - Données de l'entreprise
 * @param {number} score         - Score global
 * @param {Object} portrait      - Score Portrait/Performance
 * @param {Object} perspectives  - Score Perspectives
 * @param {Object} prixScore     - Score Prix/Valorisation
 * @param {string} recommandation - Recommandation
 * @returns {string} Texte de justification
 */
function genererJustification(entreprise, score, portrait, perspectives, prixScore, recommandation) {
  const { name } = entreprise;
  const cagr = portrait.detail.cagr_ca.toFixed(1);
  const qualiteRex = portrait.detail.qualite_rex === 'regulier' ? 'régulière' :
    portrait.detail.qualite_rex === 'irregulier' ? 'irrégulière' : 'en déclin';

  const lines = [];

  // Performance
  if (portrait.detail.cagr_ca >= 8) {
    lines.push(`${name} affiche une excellente croissance du chiffre d'affaires (CAGR ${cagr}% sur 10 ans).`);
  } else if (portrait.detail.cagr_ca >= 3) {
    lines.push(`${name} présente une croissance modérée du chiffre d'affaires (CAGR ${cagr}% sur 10 ans).`);
  } else {
    lines.push(`La croissance du chiffre d'affaires de ${name} est faible (CAGR ${cagr}% sur 10 ans).`);
  }

  lines.push(`La rentabilité opérationnelle montre une évolution ${qualiteRex}.`);

  // Valorisation
  if (prixScore.detail.graham_pass) {
    lines.push(`La valorisation est attractive : PER×PBR = ${prixScore.detail.graham_val} < 22.5 (règle de Graham respectée, bonus +5 pts).`);
  } else {
    lines.push(`La valorisation est élevée : PER×PBR = ${prixScore.detail.graham_val} > 22.5 (règle de Graham non respectée).`);
  }

  if (prixScore.detail.rendement >= 3.5) {
    lines.push(`Le rendement du dividende est généreux (${prixScore.detail.rendement.toFixed(1)}%), favorable aux investisseurs de revenu.`);
  } else if (prixScore.detail.rendement >= 2) {
    lines.push(`Le rendement du dividende est correct (${prixScore.detail.rendement.toFixed(1)}%).`);
  }

  // Perspectives
  if (perspectives.detail.pts_top_down >= 12) {
    lines.push(`Les perspectives macro-économiques et sectorielles sont favorables.`);
  } else if (perspectives.detail.pts_top_down <= 6) {
    lines.push(`Les perspectives macro-économiques et sectorielles présentent des incertitudes.`);
  }

  lines.push(`Score global : ${score}/100 → Recommandation : ${recommandation}.`);

  return lines.join(' ');
}

/**
 * Formate un score avec sa couleur CSS pour l'affichage
 *
 * @param {number} score - Score entre 0 et 100
 * @returns {Object} Couleur CSS et classe correspondante
 */
function getScoreStyle(score) {
  if (score >= 70) return { color: '#2ecc71', class: 'success' };
  if (score >= 40) return { color: '#f39c12', class: 'warning' };
  return { color: '#e74c3c', class: 'danger' };
}

/**
 * Calcule les pourcentages de chaque pilier pour l'affichage des barres
 *
 * @param {Object} resultat - Résultat de calculerScore3P()
 * @returns {Object} Pourcentages pour chaque pilier
 */
function calculerPourcentagesPiliers(resultat) {
  return {
    portrait: Math.round((resultat.portrait.total / resultat.portrait.max) * 100),
    perspectives: Math.round((resultat.perspectives.total / resultat.perspectives.max) * 100),
    prix: Math.round((resultat.prix.total / resultat.prix.max) * 100)
  };
}

// ==================== EXPORTS ====================
// Compatibilité navigateur (pas de modules ES6 requis)
if (typeof window !== 'undefined') {
  window.Scoring = {
    calculerScore3P,
    calculerScorePortrait,
    calculerScorePerspectives,
    calculerScorePrix,
    calculerCAGR,
    getScoreStyle,
    calculerPourcentagesPiliers,
    evaluerRegulariteCroissance,
    calculerRendement,
    SCORING_CONFIG
  };
}
