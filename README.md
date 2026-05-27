# 🌍 HistoFrise — Le Jeu de la Frise Chronologique

**HistoFrise** est un jeu éducatif en ligne où tu dois situer des événements historiques sur une frise chronologique allant du Big Bang à aujourd'hui. Plus ta réponse est précise, plus tu gagnes de points !

---

## 🎮 Fonctionnalités

- 🕐 **Timer 30 secondes** par question
- 🔭 **Frise chronologique interactive** — du Big Bang (−13,8 Ga) à aujourd'hui, avec zoom
- 📍 **Repères visuels** : dinosaures, Jésus, guerres mondiales, etc.
- 📊 **Classement global** (Firestore) basé sur la précision des réponses
- 👤 **Connexion Google** via Firebase Auth
- 👥 **Mode Multijoueur** (bouton prêt — room-based)
- 📱 **Optimisé PC + Android + iOS** (PWA-ready)
- 💰 **Google AdSense** intégré (bandeau publicitaire)

---

## 🛠️ Stack technique

| Couche | Techno |
|--------|--------|
| Frontend | HTML5 / CSS3 / Vanilla JS (ES Modules) |
| Auth | Firebase Authentication (Google) |
| Base de données | Cloud Firestore |
| Hébergement | Firebase Hosting (recommandé) |
| Pub | Google AdSense |
| PWA | Service Worker + Manifest |

---

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-compte/histofrise.git
cd histofrise
```

### 2. Configurer Firebase

1. Créer un projet sur [Firebase Console](https://console.firebase.google.com/)
2. Activer **Authentication > Google**
3. Activer **Firestore Database**
4. Copier ta config Firebase dans `src/config/firebase-config.js`

```js
// src/config/firebase-config.js
export const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

### 3. Configurer AdSense

Dans `index.html`, remplacer `ca-pub-XXXXXXXXXX` par ton ID AdSense.

### 4. Déployer sur Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 📐 Structure du projet

```
histofrise/
├── index.html              # Point d'entrée
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── src/
│   ├── config/
│   │   └── firebase-config.js
│   ├── styles/
│   │   └── main.css
│   ├── game/
│   │   ├── timeline.js     # Rendu frise + zoom
│   │   ├── questions.js    # Banque de questions
│   │   ├── scoring.js      # Calcul des points
│   │   └── game.js         # Logique principale
│   ├── auth/
│   │   └── auth.js         # Firebase Auth
│   ├── components/
│   │   ├── leaderboard.js  # Classement
│   │   └── multiplayer.js  # Mode multijoueur
│   └── utils/
│       └── helpers.js
├── docs/
│   └── GAME_DESIGN.md
└── README.md
```

---

## 🎯 Système de points

| Précision | Points |
|-----------|--------|
| < 1% d'erreur | 1000 pts |
| < 5% d'erreur | 800 pts |
| < 10% d'erreur | 600 pts |
| < 20% d'erreur | 400 pts |
| < 40% d'erreur | 200 pts |
| > 40% d'erreur | 50 pts |

Le classement est trié par **total de points** accumulés sur toutes les parties.

---

## 🔒 Règles Firestore (firestore.rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scores/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /rooms/{roomId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📄 Licence

MIT — libre d'utilisation, modification et distribution.
