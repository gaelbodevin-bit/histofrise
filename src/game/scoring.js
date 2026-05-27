// ============================================================
//  SYSTÈME DE SCORE — HistoFrise
// ============================================================

/**
 * Calcule les points selon l'écart entre la réponse et la vraie date.
 * L'écart est exprimé en % de la plage temporelle de l'ère concernée.
 *
 * @param {number} guessYear    - Année devinée par le joueur
 * @param {number} correctYear  - Vraie année
 * @param {number} timeRemaining - Secondes restantes sur le timer (0-30)
 * @returns {{ points: number, accuracy: number, label: string, color: string }}
 */
export function calculateScore(guessYear, correctYear, timeRemaining) {
  const TOTAL_SPAN = 13_800_000_000; // Big Bang à aujourd'hui

  const absoluteError = Math.abs(guessYear - correctYear);
  const errorPercent = (absoluteError / TOTAL_SPAN) * 100;

  let basePoints;
  let label;
  let color;

  if (errorPercent < 0.000001) {       // < ~14 ans sur l'ensemble
    basePoints = 1000; label = "PARFAIT ! 🎯"; color = "#f1c40f";
  } else if (errorPercent < 0.00001) {
    basePoints = 900; label = "Excellent ! ⭐"; color = "#2ecc71";
  } else if (errorPercent < 0.0001) {
    basePoints = 750; label = "Très bien ! 👍"; color = "#27ae60";
  } else if (errorPercent < 0.001) {
    basePoints = 580; label = "Bien ! 🙂"; color = "#3498db";
  } else if (errorPercent < 0.01) {
    basePoints = 400; label = "Pas mal 😐"; color = "#9b59b6";
  } else if (errorPercent < 0.1) {
    basePoints = 220; label = "Approximatif 🤔"; color = "#e67e22";
  } else if (errorPercent < 1) {
    basePoints = 80; label = "Loin... 😅"; color = "#e74c3c";
  } else {
    basePoints = 10; label = "Raté 💀"; color = "#7f8c8d";
  }

  // Bonus temps : jusqu'à +30% si réponse rapide
  const timeBonus = Math.round(basePoints * 0.3 * (timeRemaining / 30));
  const totalPoints = basePoints + timeBonus;

  return {
    points: totalPoints,
    basePoints,
    timeBonus,
    accuracy: errorPercent,
    absoluteError,
    label,
    color
  };
}

/**
 * Formate une année pour l'affichage (gère les grandes valeurs)
 */
export function formatYear(year) {
  const abs = Math.abs(year);
  const suffix = year < 0 ? " av. J.-C." : (year > 0 ? " ap. J.-C." : "");

  if (abs >= 1_000_000_000) {
    return (abs / 1_000_000_000).toFixed(1) + " milliards d'années" + (year < 0 ? " (passé)" : "");
  }
  if (abs >= 1_000_000) {
    return (abs / 1_000_000).toFixed(1) + " millions d'années" + (year < 0 ? " (passé)" : "");
  }
  if (abs >= 10_000) {
    return abs.toLocaleString("fr-FR") + " ans" + (year < 0 ? " av. J.-C." : "");
  }
  return Math.abs(year).toLocaleString("fr-FR") + suffix;
}

/**
 * Formate la différence entre deux dates
 */
export function formatDifference(error) {
  if (error === 0) return "Exactement !"
  const abs = Math.abs(error);
  if (abs >= 1_000_000_000) return `± ${(abs / 1_000_000_000).toFixed(1)} milliard(s) d'années`;
  if (abs >= 1_000_000) return `± ${(abs / 1_000_000).toFixed(0)} million(s) d'années`;
  if (abs >= 10_000) return `± ${(abs / 1000).toFixed(0)} 000 ans`;
  if (abs >= 1000) return `± ${abs.toLocaleString("fr-FR")} ans`;
  if (abs >= 100) return `± ${abs} ans`;
  if (abs >= 10) return `± ${abs} ans`;
  return `± ${abs} an(s)`;
}
