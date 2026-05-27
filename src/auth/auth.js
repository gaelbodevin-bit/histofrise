// ============================================================
//  AUTHENTIFICATION FIREBASE — HistoFrise
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "../config/firebase-config.js";

// ── Initialisation ────────────────────────────────────────
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();

// ── Auth ──────────────────────────────────────────────────
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await ensureUserProfile(user);
    return user;
  } catch (error) {
    console.error("Erreur connexion Google:", error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur déconnexion:", error);
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

// ── Profil utilisateur ────────────────────────────────────
async function ensureUserProfile(user) {
  const ref = doc(db, "scores", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName || "Anonyme",
      photoURL: user.photoURL || "",
      totalPoints: 0,
      gamesPlayed: 0,
      bestScore: 0,
      createdAt: new Date().toISOString()
    });
  }
}

// ── Scores ────────────────────────────────────────────────
export async function saveScore(userId, sessionPoints, displayName, photoURL) {
  try {
    const ref = doc(db, "scores", userId);
    const snap = await getDoc(ref);
    const current = snap.exists() ? snap.data() : {};

    await updateDoc(ref, {
      totalPoints: increment(sessionPoints),
      gamesPlayed: increment(1),
      bestScore: Math.max(current.bestScore || 0, sessionPoints),
      displayName: displayName || "Anonyme",
      photoURL: photoURL || "",
      lastPlayed: new Date().toISOString()
    });
  } catch (error) {
    console.error("Erreur sauvegarde score:", error);
  }
}

export async function getLeaderboard(top = 20) {
  try {
    const q = query(
      collection(db, "scores"),
      orderBy("totalPoints", "desc"),
      limit(top)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d, i) => ({ rank: i + 1, ...d.data() }));
  } catch (error) {
    console.error("Erreur classement:", error);
    return [];
  }
}

export async function getUserScore(userId) {
  try {
    const ref = doc(db, "scores", userId);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Erreur récupération score:", error);
    return null;
  }
}
