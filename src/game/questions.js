// ============================================================
//  BANQUE DE QUESTIONS — HistoFrise
//  Toutes les dates sont en années (négatif = avant J.-C.)
//  Pour les événements < -1000, on utilise des valeurs en Ma/Ga
//  converties en années : -13_800_000_000 = Big Bang
// ============================================================

export const QUESTIONS = [

  // ── NIVEAU FACILE ────────────────────────────────────────
  {
    id: "ww2_end",
    difficulty: "easy",
    question: "Fin de la Seconde Guerre mondiale",
    hint: "Capitulation de l'Allemagne nazie",
    year: 1945,
    era: "modern",
    category: "guerre"
  },
  {
    id: "moon_landing",
    difficulty: "easy",
    question: "Premier homme sur la Lune",
    hint: "Mission Apollo 11 — Neil Armstrong",
    year: 1969,
    era: "modern",
    category: "science"
  },
  {
    id: "french_revolution",
    difficulty: "easy",
    question: "Révolution Française",
    hint: "Prise de la Bastille",
    year: 1789,
    era: "modern",
    category: "politique"
  },
  {
    id: "ww1_start",
    difficulty: "easy",
    question: "Début de la Première Guerre mondiale",
    hint: "Assassinat de François-Ferdinand",
    year: 1914,
    era: "modern",
    category: "guerre"
  },
  {
    id: "napoleon_waterloo",
    difficulty: "easy",
    question: "Bataille de Waterloo",
    hint: "Défaite de Napoléon Bonaparte",
    year: 1815,
    era: "modern",
    category: "guerre"
  },
  {
    id: "berlin_wall_fall",
    difficulty: "easy",
    question: "Chute du Mur de Berlin",
    hint: "Réunification allemande en vue",
    year: 1989,
    era: "modern",
    category: "politique"
  },
  {
    id: "internet_creation",
    difficulty: "easy",
    question: "Création d'Internet (ARPANET)",
    hint: "Réseau militaire américain",
    year: 1969,
    era: "modern",
    category: "science"
  },

  // ── NIVEAU MOYEN ─────────────────────────────────────────
  {
    id: "columbus",
    difficulty: "medium",
    question: "Christophe Colomb découvre l'Amérique",
    hint: "Navires : Niña, Pinta, Santa María",
    year: 1492,
    era: "medieval",
    category: "exploration"
  },
  {
    id: "gutenberg",
    difficulty: "medium",
    question: "Invention de l'imprimerie par Gutenberg",
    hint: "Révolution de la diffusion du savoir",
    year: 1450,
    era: "medieval",
    category: "science"
  },
  {
    id: "rome_fall",
    difficulty: "medium",
    question: "Chute de l'Empire Romain d'Occident",
    hint: "Fin de l'Antiquité, début du Moyen Âge",
    year: 476,
    era: "antiquity",
    category: "politique"
  },
  {
    id: "charlemagne",
    difficulty: "medium",
    question: "Couronnement de Charlemagne",
    hint: "Nuit de Noël, an 800",
    year: 800,
    era: "medieval",
    category: "politique"
  },
  {
    id: "magna_carta",
    difficulty: "medium",
    question: "Signature de la Magna Carta",
    hint: "Premier texte limitant le pouvoir royal en Angleterre",
    year: 1215,
    era: "medieval",
    category: "politique"
  },
  {
    id: "black_plague",
    difficulty: "medium",
    question: "Grande Peste Noire en Europe",
    hint: "Un tiers de la population européenne décimée",
    year: 1347,
    era: "medieval",
    category: "catastrophe"
  },
  {
    id: "jesus_birth",
    difficulty: "medium",
    question: "Naissance de Jésus-Christ",
    hint: "Point zéro de notre calendrier",
    year: -4,
    era: "antiquity",
    category: "religion"
  },
  {
    id: "roman_empire_start",
    difficulty: "medium",
    question: "Fondation de l'Empire Romain",
    hint: "Auguste devient premier empereur",
    year: -27,
    era: "antiquity",
    category: "politique"
  },
  {
    id: "alexander_great",
    difficulty: "medium",
    question: "Conquêtes d'Alexandre le Grand (début)",
    hint: "Il part à la conquête de l'Asie",
    year: -334,
    era: "antiquity",
    category: "guerre"
  },

  // ── NIVEAU DIFFICILE ─────────────────────────────────────
  {
    id: "mahomet",
    difficulty: "hard",
    question: "Naissance de Mahomet",
    hint: "Fondateur de l'Islam, né à La Mecque",
    year: 570,
    era: "antiquity",
    category: "religion"
  },
  {
    id: "pyramids",
    difficulty: "hard",
    question: "Construction de la Grande Pyramide de Gizeh",
    hint: "Règne du pharaon Khéops",
    year: -2560,
    era: "ancient",
    category: "civilisation"
  },
  {
    id: "first_olympics",
    difficulty: "hard",
    question: "Premiers Jeux Olympiques antiques",
    hint: "En Grèce antique, à Olympie",
    year: -776,
    era: "antiquity",
    category: "sport"
  },
  {
    id: "socrates_death",
    difficulty: "hard",
    question: "Mort de Socrate",
    hint: "Condamné à boire la ciguë à Athènes",
    year: -399,
    era: "antiquity",
    category: "philosophie"
  },
  {
    id: "writing_invention",
    difficulty: "hard",
    question: "Invention de l'écriture cunéiforme",
    hint: "Mésopotamie, Sumériens",
    year: -3400,
    era: "ancient",
    category: "civilisation"
  },
  {
    id: "babylon_code",
    difficulty: "hard",
    question: "Code de Hammurabi",
    hint: "Un des premiers codes de lois de l'humanité",
    year: -1754,
    era: "ancient",
    category: "civilisation"
  },
  {
    id: "homo_sapiens",
    difficulty: "expert",
    question: "Apparition de l'Homo Sapiens",
    hint: "Premiers humains anatomiquement modernes",
    year: -300000,
    era: "prehistoric",
    category: "evolution"
  },
  {
    id: "agriculture_invention",
    difficulty: "expert",
    question: "Invention de l'agriculture",
    hint: "Révolution néolithique, Croissant Fertile",
    year: -10000,
    era: "prehistoric",
    category: "civilisation"
  },
  {
    id: "dinosaurs_extinction",
    difficulty: "expert",
    question: "Extinction des dinosaures",
    hint: "Météorite de Chicxulub, fin du Crétacé",
    year: -66_000_000,
    era: "prehistoric",
    category: "nature"
  },
  {
    id: "first_life",
    difficulty: "expert",
    question: "Apparition des premières formes de vie",
    hint: "Bactéries primitives dans les océans",
    year: -3_800_000_000,
    era: "cosmological",
    category: "nature"
  },
  {
    id: "earth_formation",
    difficulty: "expert",
    question: "Formation de la Terre",
    hint: "Notre planète se solidifie",
    year: -4_540_000_000,
    era: "cosmological",
    category: "nature"
  },
  {
    id: "big_bang",
    difficulty: "expert",
    question: "Le Big Bang",
    hint: "Naissance de l'Univers",
    year: -13_800_000_000,
    era: "cosmological",
    category: "nature"
  }
];

// ── REPÈRES VISUELS sur la frise ──────────────────────────
export const TIMELINE_MARKERS = [
  { year: -13_800_000_000, label: "Big Bang", icon: "💥", color: "#ff6b35" },
  { year: -4_540_000_000,  label: "Terre formée", icon: "🌍", color: "#4ecdc4" },
  { year: -3_800_000_000,  label: "Première vie", icon: "🦠", color: "#45b7d1" },
  { year: -540_000_000,    label: "Explosion cambrienne", icon: "🐚", color: "#96ceb4" },
  { year: -230_000_000,    label: "Ère des dinosaures", icon: "🦕", color: "#88d8b0" },
  { year: -66_000_000,     label: "Extinction dinosaures", icon: "☄️", color: "#ff9f43" },
  { year: -300_000,        label: "Homo Sapiens", icon: "🧑", color: "#ffeaa7" },
  { year: -10_000,         label: "Agriculture", icon: "🌾", color: "#a8e6cf" },
  { year: -3400,           label: "Écriture", icon: "✍️", color: "#dcd3f5" },
  { year: -2560,           label: "Pyramides", icon: "🏺", color: "#f7dc6f" },
  { year: -776,            label: "JO antiques", icon: "🏟️", color: "#aed6f1" },
  { year: -27,             label: "Empire Romain", icon: "🏛️", color: "#e74c3c" },
  { year: -4,              label: "Jésus", icon: "✝️", color: "#f0e6d3" },
  { year: 476,             label: "Chute Rome", icon: "⚔️", color: "#d98880" },
  { year: 570,             label: "Mahomet", icon: "☪️", color: "#a9cce3" },
  { year: 800,             label: "Charlemagne", icon: "👑", color: "#f9e79f" },
  { year: 1347,            label: "Peste Noire", icon: "💀", color: "#7f8c8d" },
  { year: 1450,            label: "Imprimerie", icon: "📖", color: "#82e0aa" },
  { year: 1492,            label: "Amérique", icon: "⛵", color: "#5dade2" },
  { year: 1789,            label: "Révolution FR", icon: "🗽", color: "#2980b9" },
  { year: 1914,            label: "WW1", icon: "💣", color: "#922b21" },
  { year: 1939,            label: "WW2", icon: "🔫", color: "#7b241c" },
  { year: 1969,            label: "Lune", icon: "🌕", color: "#aab7b8" },
  { year: 1989,            label: "Mur Berlin", icon: "🧱", color: "#f0b27a" },
  { year: 2024,            label: "Aujourd'hui", icon: "📱", color: "#52be80" },
];

// ── Ères de la frise ──────────────────────────────────────
export const ERAS = [
  { id: "cosmological", label: "Cosmologique", start: -13_800_000_000, end: -4_000_000_000, color: "#1a0a2e" },
  { id: "geological",   label: "Géologique",   start: -4_000_000_000,  end: -540_000_000,   color: "#0d2b4e" },
  { id: "prehistoric",  label: "Préhistoire",   start: -540_000_000,    end: -3000,           color: "#1e4d2b" },
  { id: "ancient",      label: "Antiquité",     start: -3000,           end: 500,             color: "#4a2c00" },
  { id: "medieval",     label: "Moyen Âge",     start: 500,             end: 1492,            color: "#3b1f4e" },
  { id: "modern",       label: "Époque Moderne",start: 1492,            end: 2024,            color: "#1a3a1a" },
];
