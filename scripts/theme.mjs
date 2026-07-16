// ============================================================================
//  SHARED VISUAL SYSTEM  —  "Operation Skyline: Rescue Glider Challenge"
//  One holographic brand shared by the .pptx and the interactive HTML deck.
//  Edit values here (and mirror in deck.html :root) to re-skin both decks.
// ============================================================================

// ---- Palette (hex without leading # for pptxgenjs convenience) -------------
export const C = {
  bg0:      "04060E", // deepest void navy
  bg1:      "081120", // panel navy
  bg2:      "0E1B30", // raised panel
  grid:     "13314C", // faint schematic grid line
  holo:     "34E7E7", // PRIMARY holographic accent (cyan) — used everywhere
  holoLt:   "7DF7F2", // bright cyan highlight / core
  holoHot:  "D8FFFB", // near-white hot core
  electron: "3E86FF", // secondary electron-blue (schematic / data)
  amber:    "FFB020", // impact / success burst (Target payoff only)
  amberLt:  "FFD873", // amber highlight
  danger:   "FF5A5A", // hazard/alert accent (mission briefing only, sparingly)
  text:     "EAF7FF", // primary text (cyan-white)
  textDim:  "9BBFD3", // muted body text
  textFaint:"5E7C90", // captions / footer
  white:    "FFFFFF",
};

// ---- Typography ------------------------------------------------------------
// Reliable on Windows projection machines; degrades gracefully elsewhere.
export const F = {
  display: "Segoe UI Black",   // big titles (falls back to Segoe UI bold)
  head:    "Segoe UI Semibold",
  body:    "Segoe UI",
  mono:    "Consolas",         // HUD labels / kickers / data
};

// ---- Slide geometry (LAYOUT_WIDE 13.333 x 7.5 in) --------------------------
export const G = {
  W: 13.333,
  H: 7.5,
  margin: 0.62,
  get cw() { return this.W - this.margin * 2; }, // content width
};

// ---- Event content (PLACEHOLDERS — swap freely) ----------------------------
export const EVENT = {
  program:   "STEM ENGINEERING CHALLENGE SERIES",
  title:     "OPERATION SKYLINE",
  subtitle:  "The Rescue Glider Challenge",
  tagline:   "Salvage. Engineer. Deploy. Save the zone.",
  date:      "Saturday, 15 August 2026",
  venue:     "Innovation Hangar, Main Auditorium",
  host:      "presented by the Engineering Guild",
  edition:   "FIELD BRIEFING // v1.0",
};

export const MISSION = {
  kicker: "MISSION BRIEFING",
  code:   "OP-SKYLINE // PRIORITY: CRITICAL",
  // The verbatim narrative, chunked for dramatic on-screen delivery.
  lines: [
    "Disaster strikes again.",
    "While approaching the rescue zone, teams hit dangerous terrain and severe conditions that halt all ground movement.",
    "The rescue point lies beyond a mountain ridge — and time is running out.",
    "Using only salvaged aircraft materials and available resources, each team must design and build an emergency glider capable of carrying critical supplies across the obstacle.",
  ],
  punch: "The mission now depends on your engineering creativity, precision, and teamwork.",
};

export const OBJECTIVE = {
  kicker: "EVENT OVERVIEW",
  title:  "Your Objective, Rescue Engineers",
  lead:   "Build a flight-worthy glider from salvage that clears the ridge and delivers its payload to the rescue zone.",
  cards: [
    { icon: "build",  h: "Engineer the Airframe", p: "Design & assemble a glider from the salvaged materials on your bench." },
    { icon: "payload",h: "Secure the Payload",    p: "Carry the supply capsule — mass counts, but it must arrive intact." },
    { icon: "range",  h: "Clear the Ridge",       p: "Achieve the distance to cross the obstacle and reach the far side." },
    { icon: "target", h: "Hit the Zone",          p: "Land on-target. Accuracy over the rescue point wins the mission." },
  ],
};

// The 3-part holographic sequence (shared story beats)
export const SEQUENCE = [
  {
    id: "build",
    seq: "SEQUENCE 01 / 03",
    kicker: "ASSEMBLE THE GLIDER",
    title: "BUILD",
    line:  "Salvage becomes airframe. Hands, blueprints, and precision under pressure.",
    note:  "Holographic assembly — components lock into place.",
  },
  {
    id: "launch",
    seq: "SEQUENCE 02 / 03",
    kicker: "DEPLOY",
    title: "LAUNCH",
    line:  "Wind up. Read the air. One clean release sends the payload skyward.",
    note:  "The glider leaves the hand and enters the flight arc.",
  },
  {
    id: "target",
    seq: "SEQUENCE 03 / 03",
    kicker: "TARGET: RESCUE ZONE",
    title: "IMPACT",
    line:  "The arc holds true. Supplies strike the zone. Mission accomplished.",
    note:  "Contact — the rescue point lights up on impact.",
  },
];

export const RULES = {
  kicker: "RULES & CONSTRAINTS",
  title:  "Field Regulations",
  groups: [
    { h: "Salvage Only", items: ["Balsa, paper, card, tape & string from the supply crate", "No pre-built kits or powered components", "One roll of tape per team — spend it wisely"] },
    { h: "Build Window", items: ["45 minutes to design & construct", "10-minute strategy huddle before the clock", "Tools down when the siren sounds"] },
    { h: "Launch Rules", items: ["Hand-launch only, from behind the deploy line", "One practice throw, three scored attempts", "Glider must be intact after each flight"] },
  ],
};

export const JUDGING = {
  kicker: "JUDGING CRITERIA",
  title:  "How the Mission Is Scored",
  criteria: [
    { pct: "35%", h: "Distance",         p: "Clearing the ridge — measured from the deploy line to touchdown." },
    { pct: "30%", h: "Target Accuracy",  p: "Proximity of landing to the marked rescue zone." },
    { pct: "20%", h: "Design & Craft",   p: "Structural creativity, aerodynamics, and build quality." },
    { pct: "15%", h: "Teamwork",         p: "Coordination, safety, and clean execution under time." },
  ],
};

export const TIMELINE = {
  kicker: "MISSION TIMELINE",
  title:  "Schedule of Operations",
  stops: [
    { t: "09:00", h: "Check-in & Briefing", p: "Teams assemble. Mission parameters issued." },
    { t: "09:30", h: "Salvage Distribution", p: "Supply crates handed out. Inspect your materials." },
    { t: "09:45", h: "Build Window Opens",   p: "45 minutes on the clock. Engineer the airframe." },
    { t: "10:30", h: "Deploy & Fly",         p: "Hand-launch trials across the ridge." },
    { t: "11:30", h: "Judging & Scoring",    p: "Distance, accuracy, design, and teamwork tallied." },
    { t: "12:15", h: "Awards Ceremony",      p: "Rescue honors awarded. Mission debrief." },
  ],
};

export const CLOSING = {
  kicker: "DEPLOY",
  title:  "Good Luck, Rescue Engineers",
  line:   "The ridge is waiting. The zone is counting on you.",
  cta:    "Salvage. Engineer. Deploy.",
  sign:   EVENT.title + " // " + EVENT.subtitle,
};

// Slide numbering labels for footer
export const NAV = [
  "COVER","BRIEFING","OBJECTIVE","BUILD","LAUNCH","IMPACT","RULES","JUDGING","TIMELINE","DEPLOY",
];
