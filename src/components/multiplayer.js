// ============================================================
//  MODE MULTIJOUEUR — HistoFrise (v1 — Room-based via Firestore)
// ============================================================
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "../auth/auth.js";

// ── Créer ou rejoindre une room ───────────────────────────
export async function createRoom(user) {
  const roomId = generateRoomCode();
  const ref = doc(db, "rooms", roomId);
  await setDoc(ref, {
    id: roomId,
    host: user.uid,
    hostName: user.displayName,
    players: {
      [user.uid]: {
        name: user.displayName,
        photo: user.photoURL || "",
        score: 0,
        ready: false
      }
    },
    status: "waiting", // waiting | playing | finished
    createdAt: serverTimestamp(),
    currentQuestion: 0,
    maxPlayers: 4
  });
  return roomId;
}

export async function joinRoom(roomId, user) {
  const ref = doc(db, "rooms", roomId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Room introuvable");
  const data = snap.data();
  if (data.status !== "waiting") throw new Error("Partie déjà en cours");
  if (Object.keys(data.players).length >= data.maxPlayers) throw new Error("Room complète");

  await updateDoc(ref, {
    [`players.${user.uid}`]: {
      name: user.displayName,
      photo: user.photoURL || "",
      score: 0,
      ready: false
    }
  });
  return data;
}

export function listenRoom(roomId, callback) {
  const ref = doc(db, "rooms", roomId);
  return onSnapshot(ref, snap => {
    if (snap.exists()) callback(snap.data());
  });
}

export async function setReady(roomId, userId, isReady) {
  const ref = doc(db, "rooms", roomId);
  await updateDoc(ref, {
    [`players.${userId}.ready`]: isReady
  });
}

export async function startMultiplayerGame(roomId) {
  const ref = doc(db, "rooms", roomId);
  await updateDoc(ref, { status: "playing", startedAt: serverTimestamp() });
}

export async function submitMultiplayerScore(roomId, userId, score) {
  const ref = doc(db, "rooms", roomId);
  await updateDoc(ref, {
    [`players.${userId}.score`]: score
  });
}

// ── Rendu de la salle d'attente ───────────────────────────
export function renderLobby(container, roomData, currentUserId, callbacks) {
  const players = Object.entries(roomData.players || {});
  const allReady = players.every(([, p]) => p.ready);
  const isHost = roomData.host === currentUserId;

  const playerCards = players.map(([uid, p]) => `
    <div class="lobby-player ${p.ready ? "ready" : ""}">
      ${p.photo ? `<img src="${p.photo}" class="lobby-avatar" alt="">` : `<div class="lobby-avatar-ph">${p.name[0]}</div>`}
      <span class="lobby-name">${p.name}</span>
      <span class="lobby-status">${p.ready ? "✅ Prêt" : "⏳ En attente"}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="lobby">
      <h2>🎮 Salle multijoueur</h2>
      <div class="lobby-code">
        Code de la room : <strong>${roomData.id}</strong>
        <button class="btn-copy" onclick="navigator.clipboard.writeText('${roomData.id}')">📋</button>
      </div>
      <div class="lobby-players">${playerCards}</div>
      <div class="lobby-actions">
        <button id="btn-ready" class="btn-primary">
          ${roomData.players[currentUserId]?.ready ? "❌ Pas prêt" : "✅ Je suis prêt !"}
        </button>
        ${isHost && allReady && players.length >= 2
          ? `<button id="btn-start" class="btn-primary btn-gold">🚀 Lancer la partie</button>`
          : ""}
      </div>
      ${players.length < 2 ? `<p class="lobby-hint">En attente d'au moins 1 autre joueur…</p>` : ""}
    </div>
  `;

  document.getElementById("btn-ready")?.addEventListener("click", () => {
    const isReady = roomData.players[currentUserId]?.ready;
    callbacks.onReady(!isReady);
  });

  document.getElementById("btn-start")?.addEventListener("click", () => {
    callbacks.onStart();
  });
}

// ── Helper ────────────────────────────────────────────────
function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}
