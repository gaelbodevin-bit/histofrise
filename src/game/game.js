// ============================================================
//  LOGIQUE DE JEU PRINCIPALE — HistoFrise
// ============================================================
import { QUESTIONS } from "./questions.js";
import { calculateScore, formatYear, formatDifference } from "./scoring.js";
import { Timeline } from "./timeline.js";
import { saveScore } from "../auth/auth.js";

const TIMER_DURATION = 30;
const QUESTIONS_PER_GAME = 8;

export class Game {
  constructor(ui) {
    this.ui = ui; // Objet avec toutes les références DOM
    this.timeline = null;
    this.currentQuestion = null;
    this.timer = null;
    this.timeLeft = TIMER_DURATION;
    this.sessionScore = 0;
    this.questionsLeft = [];
    this.answersHistory = [];
    this.selectedYear = null;
    this.isAnswering = false;
    this.currentUser = null;
  }

  setUser(user) {
    this.currentUser = user;
  }

  // ── Démarrer une partie ──────────────────────────────────
  start() {
    // Mélanger et choisir les questions selon difficulté progressive
    const easy   = shuffle(QUESTIONS.filter(q => q.difficulty === "easy")).slice(0, 2);
    const medium = shuffle(QUESTIONS.filter(q => q.difficulty === "medium")).slice(0, 3);
    const hard   = shuffle(QUESTIONS.filter(q => q.difficulty === "hard")).slice(0, 2);
    const expert = shuffle(QUESTIONS.filter(q => q.difficulty === "expert")).slice(0, 1);
    this.questionsLeft = [...easy, ...medium, ...hard, ...expert];

    this.sessionScore = 0;
    this.answersHistory = [];

    // Init timeline
    if (!this.timeline) {
      this.timeline = new Timeline(this.ui.canvas, (year) => {
        this.onYearSelected(year);
      });
    } else {
      this.timeline.reset();
    }

    this.ui.showScreen("game");
    this.nextQuestion();
  }

  // ── Question suivante ────────────────────────────────────
  nextQuestion() {
    if (this.questionsLeft.length === 0) {
      this.endGame();
      return;
    }

    this.currentQuestion = this.questionsLeft.shift();
    this.selectedYear = null;
    this.isAnswering = true;
    this.timeLeft = TIMER_DURATION;
    this.timeline.reset();

    // UI
    const q = this.currentQuestion;
    this.ui.questionText.textContent = q.question;
    this.ui.questionHint.textContent = `💡 ${q.hint}`;
    this.ui.difficultyBadge.textContent = difficultyLabel(q.difficulty);
    this.ui.difficultyBadge.className = `badge badge-${q.difficulty}`;
    this.ui.categoryBadge.textContent = q.category;
    this.ui.questionNumber.textContent = `${QUESTIONS_PER_GAME - this.questionsLeft.length} / ${QUESTIONS_PER_GAME}`;
    this.ui.scoreDisplay.textContent = this.sessionScore.toLocaleString("fr-FR");
    this.ui.confirmBtn.disabled = true;
    this.ui.feedbackPanel.classList.add("hidden");
    this.ui.selectedYearDisplay.textContent = "Cliquez sur la frise pour placer votre réponse";

    // Timer
    this.startTimer();
  }

  // ── Timer ────────────────────────────────────────────────
  startTimer() {
    clearInterval(this.timer);
    this.updateTimerUI();

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerUI();
      if (this.timeLeft <= 0) {
        clearInterval(this.timer);
        if (this.isAnswering) {
          // Réponse forcée au centre de la vue
          const year = this.selectedYear ?? 0;
          this.submitAnswer(year, true);
        }
      }
    }, 1000);
  }

  updateTimerUI() {
    this.ui.timerDisplay.textContent = this.timeLeft;
    this.ui.timerBar.style.width = `${(this.timeLeft / TIMER_DURATION) * 100}%`;
    if (this.timeLeft <= 10) {
      this.ui.timerBar.style.background = "#ef4444";
      this.ui.timerDisplay.style.color = "#ef4444";
    } else if (this.timeLeft <= 20) {
      this.ui.timerBar.style.background = "#f59e0b";
      this.ui.timerDisplay.style.color = "#f59e0b";
    } else {
      this.ui.timerBar.style.background = "#10b981";
      this.ui.timerDisplay.style.color = "#10b981";
    }
  }

  // ── Sélection sur la frise ───────────────────────────────
  onYearSelected(year) {
    if (!this.isAnswering) return;
    this.selectedYear = year;
    this.ui.confirmBtn.disabled = false;
    this.ui.selectedYearDisplay.textContent = `📍 ${formatYear(year)}`;
  }

  // ── Confirmer la réponse ─────────────────────────────────
  confirm() {
    if (!this.isAnswering || this.selectedYear === null) return;
    clearInterval(this.timer);
    this.submitAnswer(this.selectedYear, false);
  }

  submitAnswer(guessYear, timedOut) {
    this.isAnswering = false;
    const q = this.currentQuestion;
    const result = calculateScore(guessYear, q.year, this.timeLeft);

    // Afficher le résultat sur la frise
    this.timeline.showResult(guessYear, q.year);

    // Accumuler
    this.sessionScore += result.points;
    this.answersHistory.push({ question: q, guessYear, result, timedOut });

    // Feedback UI
    this.showFeedback(q, guessYear, result, timedOut);
  }

  showFeedback(q, guessYear, result, timedOut) {
    const panel = this.ui.feedbackPanel;
    panel.classList.remove("hidden");

    this.ui.feedbackTitle.textContent = timedOut ? "⏰ Temps écoulé !" : result.label;
    this.ui.feedbackTitle.style.color = result.color;
    this.ui.feedbackPoints.textContent = `+${result.points} pts`;
    this.ui.feedbackPoints.style.color = result.color;
    this.ui.feedbackCorrect.textContent = `Bonne réponse : ${formatYear(q.year)}`;
    this.ui.feedbackGuess.textContent = `Ta réponse : ${formatYear(guessYear)}`;
    this.ui.feedbackDiff.textContent = `Écart : ${formatDifference(result.absoluteError)}`;
    this.ui.scoreDisplay.textContent = this.sessionScore.toLocaleString("fr-FR");

    // Bouton suivant
    const isLast = this.questionsLeft.length === 0;
    this.ui.nextBtn.textContent = isLast ? "Voir les résultats 🏆" : "Question suivante →";
  }

  next() {
    this.ui.feedbackPanel.classList.add("hidden");
    this.nextQuestion();
  }

  // ── Fin de partie ────────────────────────────────────────
  async endGame() {
    clearInterval(this.timer);

    // Sauvegarder si connecté
    if (this.currentUser) {
      await saveScore(
        this.currentUser.uid,
        this.sessionScore,
        this.currentUser.displayName,
        this.currentUser.photoURL
      );
    }

    this.ui.showEndScreen(this.sessionScore, this.answersHistory);
  }

  stop() {
    clearInterval(this.timer);
    this.isAnswering = false;
    this.timeline?.reset();
  }
}

// ── Helpers ──────────────────────────────────────────────
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function difficultyLabel(d) {
  return { easy: "Facile", medium: "Moyen", hard: "Difficile", expert: "Expert" }[d] || d;
}
