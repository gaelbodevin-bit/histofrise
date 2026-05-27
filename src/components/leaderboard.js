// ============================================================
//  CLASSEMENT — HistoFrise
// ============================================================
import { getLeaderboard, getUserScore } from "../auth/auth.js";
import { formatYear } from "../game/scoring.js";

export async function renderLeaderboard(container, currentUser) {
  container.innerHTML = `
    <div class="lb-loading">
      <div class="spinner"></div>
      <p>Chargement du classement…</p>
    </div>
  `;

  try {
    const scores = await getLeaderboard(20);
    let userRank = null;
    let userScore = null;

    if (currentUser) {
      userScore = await getUserScore(currentUser.uid);
      const idx = scores.findIndex(s => s.uid === currentUser.uid);
      userRank = idx >= 0 ? idx + 1 : null;
    }

    const medals = ["🥇", "🥈", "🥉"];

    const rows = scores.map((s, i) => {
      const isMe = currentUser && s.uid === currentUser.uid;
      const medal = i < 3 ? medals[i] : `#${i + 1}`;
      const avatar = s.photoURL
        ? `<img src="${s.photoURL}" class="lb-avatar" alt="">`
        : `<div class="lb-avatar-placeholder">${(s.displayName || "?")[0].toUpperCase()}</div>`;

      return `
        <div class="lb-row ${isMe ? "lb-row-me" : ""}">
          <span class="lb-rank">${medal}</span>
          ${avatar}
          <span class="lb-name">${escapeHtml(s.displayName || "Anonyme")}${isMe ? " <span class='lb-me-tag'>toi</span>" : ""}</span>
          <span class="lb-points">${(s.totalPoints || 0).toLocaleString("fr-FR")} pts</span>
          <span class="lb-games">${s.gamesPlayed || 0} parties</span>
        </div>
      `;
    }).join("");

    let myStatsHtml = "";
    if (currentUser && userScore) {
      myStatsHtml = `
        <div class="lb-mystats">
          <h3>📊 Tes statistiques</h3>
          <div class="lb-stats-grid">
            <div class="stat-card">
              <span class="stat-value">${(userScore.totalPoints || 0).toLocaleString("fr-FR")}</span>
              <span class="stat-label">Points totaux</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">${userScore.gamesPlayed || 0}</span>
              <span class="stat-label">Parties jouées</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">${(userScore.bestScore || 0).toLocaleString("fr-FR")}</span>
              <span class="stat-label">Meilleur score</span>
            </div>
            <div class="stat-card">
              <span class="stat-value">${userRank ? `#${userRank}` : "N/A"}</span>
              <span class="stat-label">Classement</span>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      ${myStatsHtml}
      <div class="lb-table">
        <div class="lb-header">
          <span>Rang</span>
          <span></span>
          <span>Joueur</span>
          <span>Points</span>
          <span>Parties</span>
        </div>
        ${rows || `<div class="lb-empty">Sois le premier à jouer ! 🚀</div>`}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="lb-error">
        <p>⚠️ Impossible de charger le classement.</p>
        <p>Vérifie ta connexion Firebase.</p>
      </div>
    `;
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
