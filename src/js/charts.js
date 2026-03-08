/**
 * =============================================================
 *  Fichier    : charts.js
 *  Projet     : Market Analyser
 *  Description: Enveloppes Chart.js pour les graphiques de l'application
 *               LineChart (10 ans), BarChart, GaugeChart, SparklineChart
 *  Auteur     : Claude Marcel
 *  Version    : 1.0
 *  Date       : 2026-03-07
 *  Dépendances: Chart.js 4.x (CDN)
 * =============================================================
 */

'use strict';

// ==================== REGISTRE DES INSTANCES DE GRAPHIQUES ====================
// Stocke les instances Chart.js pour pouvoir les détruire avant recréation
const _chartInstances = {};

/**
 * Détruit une instance Chart.js existante par son ID de canvas
 *
 * @param {string} canvasId - ID du canvas HTML
 */
function detruireGraphique(canvasId) {
  if (_chartInstances[canvasId]) {
    _chartInstances[canvasId].destroy();
    delete _chartInstances[canvasId];
  }
}

/**
 * Détruit tous les graphiques enregistrés
 */
function detruireTousGraphiques() {
  Object.keys(_chartInstances).forEach(id => detruireGraphique(id));
}

// ==================== CONFIGURATION THÉMATIQUE ====================

/**
 * Retourne la configuration de couleurs selon le thème actif
 *
 * @returns {Object} Palette de couleurs du thème courant
 */
function obtenirCouleurs() {
  const estBRVM = document.body.classList.contains('theme-brvm');

  if (estBRVM) {
    return {
      principal: '#2ecc71',
      secondaire: '#f39c12',
      tertiaire: '#3498db',
      grille: 'rgba(46, 204, 113, 0.1)',
      texte: '#4a7c59',
      fond: 'transparent',
      tooltip: '#1a3320',
      tooltipTexte: '#e8f5e9',
      bordureTooltip: '#1a3a1e'
    };
  }

  return {
    principal: '#58a6ff',
    secondaire: '#bc8cff',
    tertiaire: '#39d353',
    grille: 'rgba(88, 166, 255, 0.1)',
    texte: '#484f58',
    fond: 'transparent',
    tooltip: '#21262d',
    tooltipTexte: '#e6edf3',
    bordureTooltip: '#30363d'
  };
}

/**
 * Options de base communes à tous les graphiques
 *
 * @param {Object} couleurs - Palette de couleurs
 * @returns {Object} Options Chart.js de base
 */
function optionsBase(couleurs) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: couleurs.tooltip,
        titleColor: couleurs.tooltipTexte,
        bodyColor: couleurs.texte,
        borderColor: couleurs.bordureTooltip,
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8
      }
    },
    scales: {
      x: {
        grid: {
          color: couleurs.grille,
          drawBorder: false
        },
        ticks: {
          color: couleurs.texte,
          font: { size: 11 }
        }
      },
      y: {
        grid: {
          color: couleurs.grille,
          drawBorder: false
        },
        ticks: {
          color: couleurs.texte,
          font: { size: 11 }
        },
        border: {
          dash: [4, 4]
        }
      }
    }
  };
}

// ==================== GRAPHIQUE LINÉAIRE (10 ANS) ====================

/**
 * Crée un graphique en courbe pour afficher l'évolution sur 10 ans
 *
 * @param {string} canvasId   - ID du canvas HTML
 * @param {string[]} labels   - Étiquettes de l'axe X (années)
 * @param {number[]} donnees  - Valeurs à afficher
 * @param {string} titre      - Titre de la courbe
 * @param {string} couleur    - Couleur de la courbe (optionnel)
 * @param {Function} formaterTooltip - Formateur personnalisé des tooltips
 * @returns {Chart} Instance Chart.js créée
 *
 * Exemple:
 *   creerGraphiqueLigne('chart-ca', ANNEES_10, donnees.ca, 'Chiffre d\'affaires');
 */
function creerGraphiqueLigne(canvasId, labels, donnees, titre, couleur, formaterTooltip) {
  detruireGraphique(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const couleurs = obtenirCouleurs();
  const couleurCourbe = couleur || couleurs.principal;

  // Création du dégradé de remplissage
  const ctx = canvas.getContext('2d');
  const degrade = ctx.createLinearGradient(0, 0, 0, 200);
  degrade.addColorStop(0, couleurCourbe + '30');
  degrade.addColorStop(1, couleurCourbe + '00');

  const options = optionsBase(couleurs);

  // Formateur de tooltip personnalisé si fourni
  if (formaterTooltip) {
    options.plugins.tooltip.callbacks = {
      label: function(context) {
        return ` ${titre}: ${formaterTooltip(context.parsed.y)}`;
      }
    };
  }

  const instance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: titre,
        data: donnees,
        borderColor: couleurCourbe,
        backgroundColor: degrade,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: couleurCourbe,
        pointBorderColor: couleurCourbe + '80',
        pointBorderWidth: 1
      }]
    },
    options
  });

  _chartInstances[canvasId] = instance;
  return instance;
}

// ==================== GRAPHIQUE MULTI-COURBES ====================

/**
 * Crée un graphique à plusieurs courbes (ex: CA + REX + RN)
 *
 * @param {string} canvasId     - ID du canvas HTML
 * @param {string[]} labels     - Étiquettes de l'axe X
 * @param {Object[]} series     - Tableau de séries { donnees, titre, couleur }
 * @param {Function} formaterY  - Formateur pour l'axe Y
 * @returns {Chart} Instance Chart.js créée
 */
function creerGraphiqueMultiCourbes(canvasId, labels, series, formaterY) {
  detruireGraphique(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const couleurs = obtenirCouleurs();
  const ctx = canvas.getContext('2d');

  const datasets = series.map(serie => {
    const degrade = ctx.createLinearGradient(0, 0, 0, 260);
    degrade.addColorStop(0, serie.couleur + '20');
    degrade.addColorStop(1, serie.couleur + '00');

    return {
      label: serie.titre,
      data: serie.donnees,
      borderColor: serie.couleur,
      backgroundColor: degrade,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: serie.couleur,
      pointBorderColor: 'transparent'
    };
  });

  const options = optionsBase(couleurs);
  options.plugins.legend.display = true;
  options.plugins.legend.position = 'bottom';
  options.plugins.legend.labels = {
    color: couleurs.texte,
    font: { size: 11 },
    boxWidth: 10,
    boxHeight: 10,
    padding: 16
  };

  if (formaterY) {
    options.scales.y.ticks.callback = formaterY;
    options.plugins.tooltip.callbacks = {
      label: function(context) {
        return ` ${context.dataset.label}: ${formaterY(context.parsed.y)}`;
      }
    };
  }

  const instance = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options
  });

  _chartInstances[canvasId] = instance;
  return instance;
}

// ==================== GRAPHIQUE EN BARRES ====================

/**
 * Crée un graphique en barres
 *
 * @param {string} canvasId        - ID du canvas HTML
 * @param {string[]} labels        - Étiquettes des barres
 * @param {number[]} donnees       - Valeurs
 * @param {string} titre           - Titre du dataset
 * @param {string} couleur         - Couleur des barres (optionnel)
 * @param {Function} formaterY     - Formateur pour l'axe Y
 * @returns {Chart} Instance Chart.js créée
 */
function creerGraphiqueBarres(canvasId, labels, donnees, titre, couleur, formaterY) {
  detruireGraphique(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const couleurs = obtenirCouleurs();
  const couleurBarres = couleur || couleurs.principal;

  const options = optionsBase(couleurs);

  if (formaterY) {
    options.scales.y.ticks.callback = formaterY;
    options.plugins.tooltip.callbacks = {
      label: function(context) {
        return ` ${titre}: ${formaterY(context.parsed.y)}`;
      }
    };
  }

  const instance = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: titre,
        data: donnees,
        backgroundColor: couleurBarres + '80',
        borderColor: couleurBarres,
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: couleurBarres + 'aa'
      }]
    },
    options
  });

  _chartInstances[canvasId] = instance;
  return instance;
}

// ==================== JAUGE (GAUGE) ====================

/**
 * Crée une jauge semi-circulaire pour afficher PER, PBR, etc.
 *
 * @param {string} canvasId  - ID du canvas HTML
 * @param {number} valeur    - Valeur actuelle
 * @param {number} min       - Valeur minimale
 * @param {number} max       - Valeur maximale
 * @param {string} label     - Label de la jauge
 * @param {Object} zones     - Zones colorées { rouge, orange, vert } (seuils max)
 * @returns {Chart} Instance Chart.js créée
 *
 * Exemple:
 *   creerJauge('gauge-per', 12, 0, 30, 'PER', { vert: 15, orange: 22, rouge: 30 });
 */
function creerJauge(canvasId, valeur, min, max, label, zones) {
  detruireGraphique(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const couleurs = obtenirCouleurs();

  // Calcul de la valeur normalisée entre 0 et 1
  const valeurNorm = Math.min(Math.max((valeur - min) / (max - min), 0), 1);

  // Couleur selon les zones
  let couleurValeur;
  if (zones) {
    const pct = valeur / max;
    if (valeur <= (zones.vert || max * 0.33)) {
      couleurValeur = '#2ecc71';
    } else if (valeur <= (zones.orange || max * 0.66)) {
      couleurValeur = '#f39c12';
    } else {
      couleurValeur = '#e74c3c';
    }
  } else {
    couleurValeur = couleurs.principal;
  }

  const instance = new Chart(canvas.getContext('2d'), {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [valeurNorm, 1 - valeurNorm],
        backgroundColor: [couleurValeur, couleurs.grille.replace('0.1', '0.15')],
        borderWidth: 0,
        circumference: 180,
        rotation: 270
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  // Affichage de la valeur au centre via plugin personnalisé
  const pluginTexte = {
    id: 'gaugeCenterText_' + canvasId,
    afterDraw(chart) {
      const { ctx, chartArea } = chart;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = chartArea.bottom - 10;

      ctx.save();
      ctx.textAlign = 'center';

      // Valeur principale
      ctx.font = 'bold 20px Segoe UI, Arial, sans-serif';
      ctx.fillStyle = couleurs.tooltipTexte;
      ctx.fillText(typeof valeur === 'number' ? valeur.toFixed(1) : valeur, centerX, centerY);

      ctx.restore();
    }
  };

  instance.config.plugins = [pluginTexte];
  instance.update();

  _chartInstances[canvasId] = instance;
  return instance;
}

// ==================== GRAPHIQUE SPARKLINE ====================

/**
 * Crée un petit graphique sparkline sans axes ni légendes
 *
 * @param {string} canvasId   - ID du canvas HTML
 * @param {number[]} donnees  - Valeurs
 * @param {string} couleur    - Couleur de la courbe
 * @returns {Chart} Instance Chart.js créée
 */
function creerSparkline(canvasId, donnees, couleur) {
  detruireGraphique(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const couleurs = obtenirCouleurs();
  const couleurCourbe = couleur || couleurs.principal;

  const instance = new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: {
      labels: donnees.map((_, i) => i),
      datasets: [{
        data: donnees,
        borderColor: couleurCourbe,
        backgroundColor: couleurCourbe + '15',
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      },
      animation: { duration: 800 }
    }
  });

  _chartInstances[canvasId] = instance;
  return instance;
}

// ==================== GRAPHIQUE EN BARRES HORIZONTALES ====================

/**
 * Crée un graphique comparatif horizontal (pour comparaison entre pairs)
 *
 * @param {string} canvasId    - ID du canvas HTML
 * @param {string[]} labels    - Noms des entreprises
 * @param {number[]} donnees   - Valeurs
 * @param {string} titre       - Titre du dataset
 * @param {number} indexActuel - Index de l'entreprise courante (mise en surbrillance)
 * @returns {Chart} Instance Chart.js créée
 */
function creerGraphiqueHorizontal(canvasId, labels, donnees, titre, indexActuel) {
  detruireGraphique(canvasId);

  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const couleurs = obtenirCouleurs();

  // Couleurs différenciées pour l'entreprise courante
  const bgColors = donnees.map((_, i) =>
    i === indexActuel ? couleurs.principal + 'cc' : couleurs.principal + '33'
  );
  const borderColors = donnees.map((_, i) =>
    i === indexActuel ? couleurs.principal : couleurs.principal + '55'
  );

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: couleurs.tooltip,
        titleColor: couleurs.tooltipTexte,
        bodyColor: couleurs.texte,
        borderColor: couleurs.bordureTooltip,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: couleurs.grille },
        ticks: { color: couleurs.texte, font: { size: 11 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: couleurs.texte, font: { size: 11 } }
      }
    }
  };

  const instance = new Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: titre,
        data: donnees,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options
  });

  _chartInstances[canvasId] = instance;
  return instance;
}

// ==================== FONCTIONS UTILITAIRES POUR LES FORMATEURS ====================

/**
 * Formate un nombre en milliards avec abréviation (ex: 1 234 000 → "1.2 Mrd")
 *
 * @param {number} valeur - Valeur en millions
 * @returns {string} Valeur formatée
 */
function formaterMilliards(valeur) {
  if (Math.abs(valeur) >= 1000) {
    return (valeur / 1000).toFixed(1) + ' Mrd';
  }
  return valeur.toFixed(0) + ' M';
}

/**
 * Formate un nombre en milliards pour l'international (ex: 391 → "391 Md$")
 *
 * @param {number} valeur - Valeur en milliards
 * @returns {string} Valeur formatée
 */
function formaterMiliardsIntl(valeur) {
  if (Math.abs(valeur) >= 1000) {
    return (valeur / 1000).toFixed(1) + ' T$';
  }
  return valeur.toFixed(1) + ' Md$';
}

/**
 * Formate en pourcentage
 *
 * @param {number} valeur - Valeur décimale
 * @returns {string} Pourcentage formaté
 */
function formaterPourcent(valeur) {
  return valeur.toFixed(1) + '%';
}

// ==================== EXPORTS ====================
if (typeof window !== 'undefined') {
  window.Charts = {
    creerGraphiqueLigne,
    creerGraphiqueMultiCourbes,
    creerGraphiqueBarres,
    creerJauge,
    creerSparkline,
    creerGraphiqueHorizontal,
    detruireGraphique,
    detruireTousGraphiques,
    formaterMilliards,
    formaterMiliardsIntl,
    formaterPourcent,
    obtenirCouleurs
  };
}
