// ============================================================
//  MOTEUR DE FRISE CHRONOLOGIQUE — HistoFrise
//  Gère le rendu canvas + zoom + interaction tactile/souris
// ============================================================
import { TIMELINE_MARKERS, ERAS } from "./questions.js";
import { formatYear } from "./scoring.js";

const MIN_YEAR = -13_800_000_000;
const MAX_YEAR = 2024;
const TOTAL_SPAN = MAX_YEAR - MIN_YEAR;

export class Timeline {
  constructor(canvas, onYearSelected) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.onYearSelected = onYearSelected;

    // Viewport (années affichées)
    this.viewStart = MIN_YEAR;
    this.viewEnd = MAX_YEAR;

    // Interaction
    this.isDragging = false;
    this.lastX = 0;
    this.pinchDistance = 0;
    this.guessMarker = null;
    this.correctMarker = null;
    this.locked = false;

    this.resize();
    this.attachEvents();
    this.draw();
  }

  // ── Resize ──────────────────────────────────────────────
  resize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = (window.innerWidth < 600 ? 160 : 200) * dpr;
    this.canvas.style.width = rect.width + "px";
    this.canvas.style.height = (window.innerWidth < 600 ? 160 : 200) + "px";
    this.ctx.scale(dpr, dpr);
    this.W = rect.width;
    this.H = window.innerWidth < 600 ? 160 : 200;
    this.draw();
  }

  // ── Conversion année ↔ pixels ───────────────────────────
  yearToX(year) {
    const span = this.viewEnd - this.viewStart;
    return ((year - this.viewStart) / span) * this.W;
  }

  xToYear(x) {
    const span = this.viewEnd - this.viewStart;
    return this.viewStart + (x / this.W) * span;
  }

  // ── Dessin ──────────────────────────────────────────────
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.W, this.H);

    this.drawEras(ctx);
    this.drawAxis(ctx);
    this.drawTicks(ctx);
    this.drawMarkers(ctx);
    if (this.guessMarker !== null) this.drawGuessMarker(ctx);
    if (this.correctMarker !== null) this.drawCorrectMarker(ctx);
    this.drawZoomIndicator(ctx);
  }

  drawEras(ctx) {
    ERAS.forEach(era => {
      const x1 = this.yearToX(Math.max(era.start, this.viewStart));
      const x2 = this.yearToX(Math.min(era.end, this.viewEnd));
      if (x2 < 0 || x1 > this.W) return;
      ctx.fillStyle = era.color + "cc";
      ctx.fillRect(x1, 0, x2 - x1, this.H * 0.55);
    });
  }

  drawAxis(ctx) {
    const y = this.H * 0.6;
    ctx.strokeStyle = "#e8d5a3";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(this.W, y);
    ctx.stroke();
  }

  drawTicks(ctx) {
    const span = this.viewEnd - this.viewStart;
    const y = this.H * 0.6;
    ctx.fillStyle = "#c9b57a";
    ctx.font = `${window.innerWidth < 600 ? 8 : 10}px 'Courier New', monospace`;
    ctx.textAlign = "center";

    // Choisir un pas adapté au zoom
    const steps = this.getTickSteps(span);

    // Graduation majeure
    let t = Math.ceil(this.viewStart / steps.major) * steps.major;
    while (t <= this.viewEnd) {
      const x = this.yearToX(t);
      ctx.strokeStyle = "#c9b57a";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 12);
      ctx.lineTo(x, y + 12);
      ctx.stroke();
      ctx.fillStyle = "#e8d5a3";
      ctx.fillText(formatYearShort(t), x, y + 24);
      t += steps.major;
    }

    // Graduation mineure
    ctx.strokeStyle = "#6b5a3a";
    ctx.lineWidth = 0.5;
    t = Math.ceil(this.viewStart / steps.minor) * steps.minor;
    while (t <= this.viewEnd) {
      const x = this.yearToX(t);
      ctx.beginPath();
      ctx.moveTo(x, y - 6);
      ctx.lineTo(x, y + 6);
      ctx.stroke();
      t += steps.minor;
    }
  }

  getTickSteps(span) {
    if (span > 5_000_000_000)   return { major: 2_000_000_000, minor: 500_000_000 };
    if (span > 1_000_000_000)   return { major: 500_000_000,   minor: 100_000_000 };
    if (span > 100_000_000)     return { major: 50_000_000,    minor: 10_000_000 };
    if (span > 10_000_000)      return { major: 5_000_000,     minor: 1_000_000 };
    if (span > 1_000_000)       return { major: 500_000,       minor: 100_000 };
    if (span > 100_000)         return { major: 50_000,        minor: 10_000 };
    if (span > 10_000)          return { major: 5000,          minor: 1000 };
    if (span > 1000)            return { major: 500,           minor: 100 };
    if (span > 100)             return { major: 100,           minor: 25 };
    if (span > 20)              return { major: 10,            minor: 2 };
    return { major: 5, minor: 1 };
  }

  drawMarkers(ctx) {
    const y = this.H * 0.6;
    const span = this.viewEnd - this.viewStart;

    TIMELINE_MARKERS.forEach(m => {
      if (m.year < this.viewStart || m.year > this.viewEnd) return;
      const x = this.yearToX(m.year);

      // Ligne
      ctx.strokeStyle = m.color + "aa";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, y - 12);
      ctx.stroke();
      ctx.setLineDash([]);

      // Icône (uniquement si suffisamment d'espace)
      if (span < TOTAL_SPAN * 0.8 || true) {
        ctx.font = `${window.innerWidth < 600 ? 12 : 16}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(m.icon, x, y - 18);
      }
    });
  }

  drawGuessMarker(ctx) {
    const x = this.yearToX(this.guessMarker);
    const y = this.H * 0.6;
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.H);
    ctx.stroke();

    // Triangle
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 20);
    ctx.lineTo(x + 8, y - 20);
    ctx.lineTo(x, y - 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("TA RÉPONSE", x, y - 28);
  }

  drawCorrectMarker(ctx) {
    const x = this.yearToX(this.correctMarker);
    const y = this.H * 0.6;
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.H);
    ctx.stroke();

    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 20);
    ctx.lineTo(x + 8, y - 20);
    ctx.lineTo(x, y - 8);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("BONNE DATE", x, y - 28);
  }

  drawZoomIndicator(ctx) {
    const span = this.viewEnd - this.viewStart;
    const zoomLevel = Math.round(Math.log10(TOTAL_SPAN / span) * 10) / 10;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "10px monospace";
    ctx.textAlign = "right";
    ctx.fillText(`🔍 ×${Math.pow(10, zoomLevel).toFixed(0)}`, this.W - 8, 14);
  }

  // ── Zoom ────────────────────────────────────────────────
  zoom(factor, centerX) {
    const centerYear = this.xToYear(centerX);
    const span = this.viewEnd - this.viewStart;
    const newSpan = Math.max(2, Math.min(TOTAL_SPAN, span * factor));

    // Garder le centre
    const ratio = (centerYear - this.viewStart) / span;
    this.viewStart = centerYear - ratio * newSpan;
    this.viewEnd = this.viewStart + newSpan;

    // Bornes
    if (this.viewStart < MIN_YEAR) { this.viewStart = MIN_YEAR; this.viewEnd = this.viewStart + newSpan; }
    if (this.viewEnd > MAX_YEAR)   { this.viewEnd = MAX_YEAR; this.viewStart = this.viewEnd - newSpan; }

    this.draw();
  }

  pan(dx) {
    const span = this.viewEnd - this.viewStart;
    const delta = -(dx / this.W) * span;
    this.viewStart = Math.max(MIN_YEAR, Math.min(MAX_YEAR - span, this.viewStart + delta));
    this.viewEnd = this.viewStart + span;
    this.draw();
  }

  // ── Événements ──────────────────────────────────────────
  attachEvents() {
    const c = this.canvas;

    // Souris
    c.addEventListener("mousedown", e => {
      if (this.locked) return;
      this.isDragging = false;
      this.lastX = e.offsetX;
      this._mouseDownX = e.offsetX;
      c.addEventListener("mousemove", this._onMouseMove = e2 => {
        const dx = e2.offsetX - this.lastX;
        if (Math.abs(e2.offsetX - this._mouseDownX) > 5) this.isDragging = true;
        if (this.isDragging) this.pan(dx);
        this.lastX = e2.offsetX;
      });
    });
    c.addEventListener("mouseup", e => {
      c.removeEventListener("mousemove", this._onMouseMove);
      if (!this.isDragging && !this.locked) {
        this.handleClick(e.offsetX);
      }
    });
    c.addEventListener("mouseleave", () => {
      c.removeEventListener("mousemove", this._onMouseMove);
    });

    // Molette
    c.addEventListener("wheel", e => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 1.3 : 0.77;
      this.zoom(factor, e.offsetX);
    }, { passive: false });

    // Touch
    c.addEventListener("touchstart", e => {
      if (this.locked) return;
      e.preventDefault();
      if (e.touches.length === 1) {
        this.lastX = e.touches[0].clientX - c.getBoundingClientRect().left;
        this._touchStartX = this.lastX;
        this.isDragging = false;
      } else if (e.touches.length === 2) {
        this.pinchDistance = getPinchDistance(e);
      }
    }, { passive: false });

    c.addEventListener("touchmove", e => {
      if (this.locked) return;
      e.preventDefault();
      if (e.touches.length === 1) {
        const x = e.touches[0].clientX - c.getBoundingClientRect().left;
        const dx = x - this.lastX;
        if (Math.abs(x - this._touchStartX) > 8) this.isDragging = true;
        if (this.isDragging) this.pan(dx);
        this.lastX = x;
      } else if (e.touches.length === 2) {
        const newDist = getPinchDistance(e);
        const factor = this.pinchDistance / newDist;
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2
                   - c.getBoundingClientRect().left;
        this.zoom(factor, cx);
        this.pinchDistance = newDist;
      }
    }, { passive: false });

    c.addEventListener("touchend", e => {
      if (!this.isDragging && !this.locked && e.changedTouches.length === 1) {
        const x = e.changedTouches[0].clientX - c.getBoundingClientRect().left;
        this.handleClick(x);
      }
    });

    // Resize
    window.addEventListener("resize", () => this.resize());
  }

  handleClick(x) {
    const year = Math.round(this.xToYear(x));
    this.guessMarker = year;
    this.draw();
    if (this.onYearSelected) this.onYearSelected(year);
  }

  // ── API publique ────────────────────────────────────────
  showResult(guessYear, correctYear) {
    this.guessMarker = guessYear;
    this.correctMarker = correctYear;
    this.locked = true;

    // Zoomer pour voir les deux marqueurs
    const min = Math.min(guessYear, correctYear);
    const max = Math.max(guessYear, correctYear);
    const span = (max - min) * 3 || 200;
    const center = (min + max) / 2;
    this.viewStart = Math.max(MIN_YEAR, center - span);
    this.viewEnd = Math.min(MAX_YEAR, center + span);
    this.draw();
  }

  reset() {
    this.guessMarker = null;
    this.correctMarker = null;
    this.locked = false;
    this.viewStart = MIN_YEAR;
    this.viewEnd = MAX_YEAR;
    this.draw();
  }

  setGuessPreview(year) {
    if (this.locked) return;
    this.guessMarker = year;
    this.draw();
  }
}

// ── Helpers ──────────────────────────────────────────────
function getPinchDistance(e) {
  const dx = e.touches[0].clientX - e.touches[1].clientX;
  const dy = e.touches[0].clientY - e.touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function formatYearShort(year) {
  const abs = Math.abs(year);
  const sign = year < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return sign + (abs / 1_000_000_000).toFixed(1) + " Ga";
  if (abs >= 1_000_000)     return sign + (abs / 1_000_000).toFixed(0) + " Ma";
  if (abs >= 1_000)         return sign + (abs / 1_000).toFixed(0) + " ka";
  return sign + abs;
}
