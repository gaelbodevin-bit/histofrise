# 🎮 HistoFrise — Game Design Document

## Concept

HistoFrise est un jeu de géolocalisation temporelle. Plutôt que de placer des lieux sur une carte (à la GeoGuessr), le joueur place des **événements historiques dans le temps** sur une frise chronologique.

---

## Boucle de jeu (core loop)

```
┌─────────────────────────────────────────┐
│  Question affichée (+ indice)           │
│  Timer 30 secondes démarre             │
│         ↓                              │
│  Joueur explore la frise (zoom/pan)    │
│  Joueur clique pour placer sa réponse  │
│         ↓                              │
│  Joueur confirme OU temps écoulé       │
│         ↓                              │
│  Résultat affiché (points + écart)     │
│  Frise zoom sur les deux marqueurs     │
│         ↓                              │
│  Question suivante → (×8)              │
│         ↓                              │
│  Fin de partie → score sauvegardé      │
└─────────────────────────────────────────┘
```

---

## Frise chronologique

**Étendue totale** : −13 800 000 000 (Big Bang) à +2024

**Ères affichées** :
| Ère | Période |
|-----|---------|
| Cosmologique | −13,8 Ga → −4 Ga |
| Géologique | −4 Ga → −540 Ma |
| Préhistoire | −540 Ma → −3000 ans |
| Antiquité | −3000 → +500 |
| Moyen Âge | +500 → +1492 |
| Époque Moderne | +1492 → aujourd'hui |

**Interaction** :
- Souris : clic pour répondre, scroll pour zoomer, drag pour naviguer
- Mobile : tap, pincer/écarter, swipe

---

## Niveaux de difficulté

| Niveau | Exemple | Tolérance attendue |
|--------|---------|-------------------|
| Facile | WW2, Lune | Quelques années |
| Moyen | Révolution FR, Charlemagne | Décennies |
| Difficile | Pyramides, Big Bang | Siècles / Ma |
| Expert | Extinction dinosaures, Vie | Millions d'années |

**Ordre dans une partie** : 2 faciles → 3 moyens → 2 difficiles → 1 expert

---

## Calcul du score

Le score est calculé en fonction de **l'écart relatif** par rapport à l'échelle totale de la frise (13,8 milliards d'années).

| Écart relatif | Points de base | Qualification |
|---------------|---------------|---------------|
| < 0,0001% | 1 000 | Parfait |
| < 0,001% | 900 | Excellent |
| < 0,01% | 750 | Très bien |
| < 0,1% | 580 | Bien |
| < 1% | 400 | Pas mal |
| < 10% | 220 | Approximatif |
| < 100% | 80 | Loin |
| Autre | 10 | Raté |

**Bonus de temps** : jusqu'à +30% des points de base si réponse rapide.

**Score max théorique** : 1000 × 1,30 × 8 = **10 400 points**

---

## Classement

- Trié par **total de points** cumulés sur toutes les parties
- Stocké dans Firestore (`scores/{userId}`)
- Lecture publique, écriture uniquement par le propriétaire
- Affiche : rang, avatar, nom, total points, nombre de parties

---

## Multijoueur (v1)

- Room-based via Firestore
- Code de 6 caractères alphanumérique
- Max 4 joueurs par room
- Chaque joueur marque "Prêt" avant le lancement
- L'hôte lance la partie quand tous sont prêts
- Les scores individuels sont soumis en temps réel

---

## Monétisation

- **Google AdSense** : bandeau en haut (160×60 mobile, 728×90 desktop)
- Le jeu reste entièrement gratuit
- Pas de publicité intrusive pendant les 30 secondes de jeu

---

## Roadmap

### v1.0 (actuel)
- [x] Frise chronologique interactive (canvas)
- [x] 30 questions dans la banque
- [x] Timer 30s
- [x] Auth Google + Firebase
- [x] Classement mondial
- [x] Multijoueur (lobby)
- [x] PWA (mobile-ready)

### v1.1
- [ ] Sons / effets sonores
- [ ] Animations de confettis sur bonne réponse
- [ ] Catégories choisissables (science, guerre, art…)
- [ ] Mode entraînement (sans timer)

### v1.2
- [ ] Multijoueur synchronisé (même question en même temps)
- [ ] Tournois hebdomadaires
- [ ] Avatars personnalisés

### v2.0
- [ ] Éditeur de questions communautaires
- [ ] Mode "Défi du jour"
- [ ] Statistiques détaillées par catégorie
