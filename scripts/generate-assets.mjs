// ============================================================================
//  Holographic asset generator  —  SVG -> PNG (via sharp / librsvg)
//  Produces the shared visual language for both the .pptx and HTML decks:
//  backgrounds, articulated holo-figures (build/launch/follow), glider,
//  target (idle + hit), blueprint panel, emblem.
// ============================================================================
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { C } from "./theme.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "assets");
mkdirSync(OUT, { recursive: true });

const hx = (h) => "#" + h;

// ---- shared defs (glow filters + helpers) ----------------------------------
function defs(extra = "") {
  return `
  <defs>
    <filter id="gS" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="gM" x="-140%" y="-140%" width="380%" height="380%">
      <feGaussianBlur stdDeviation="7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="gL" x="-160%" y="-160%" width="420%" height="420%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
    <filter id="gXL" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
    ${extra}
  </defs>`;
}

// scanline + grid pattern fragments (userSpaceOnUse, tuned per canvas)
function scanPattern(id, color = C.holo, op = 0.05, gap = 6) {
  return `<pattern id="${id}" width="6" height="${gap}" patternUnits="userSpaceOnUse">
    <rect width="6" height="1.4" y="0" fill="${hx(color)}" opacity="${op}"/></pattern>`;
}
function gridPattern(id, step = 96, color = C.holo, op = 0.05) {
  return `<pattern id="${id}" width="${step}" height="${step}" patternUnits="userSpaceOnUse">
    <path d="M ${step} 0 L 0 0 0 ${step}" fill="none" stroke="${hx(color)}" stroke-width="1.1" opacity="${op}"/></pattern>`;
}

// corner HUD brackets for a WxH canvas
function brackets(W, H, m = 54, len = 120, color = C.holo, op = 0.55) {
  const s = `stroke="${hx(color)}" stroke-width="3.5" fill="none" opacity="${op}" stroke-linecap="round"`;
  return `<g filter="url(#gS)">
    <path d="M${m},${m + len} L${m},${m} L${m + len},${m}" ${s}/>
    <path d="M${W - m},${m + len} L${W - m},${m} L${W - m - len},${m}" ${s}/>
    <path d="M${m},${H - m - len} L${m},${H - m} L${m + len},${H - m}" ${s}/>
    <path d="M${W - m},${H - m - len} L${W - m},${H - m} L${W - m - len},${H - m}" ${s}/>
  </g>`;
}

// rasterize an svg string to png
async function render(name, svg, w, h) {
  const full = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${svg}</svg>`;
  await sharp(Buffer.from(full), { density: 96 }).png({ compressionLevel: 9 }).toFile(join(OUT, name));
  console.log("  ✓", name, `${w}x${h}`);
}

// ============================================================================
//  ARTICULATED HOLO-FIGURE
// ============================================================================
// joints: {name:[x,y]}, bones: [[a,b,width?]], head:{c:[x,y], r}
function figure(joints, bones, head, opts = {}) {
  const color = opts.color || C.holo;
  const core = opts.core || C.holoHot;
  const bw = opts.bw || 26; // bone width
  const seg = (a, b, w, stroke) => {
    const [x1, y1] = joints[a], [x2, y2] = joints[b];
    return `<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  const bonesGlow = bones.map(([a, b, w]) => seg(a, b, (w || bw) + 6, hx(color))).join("");
  const bonesCore = bones.map(([a, b, w]) => seg(a, b, (w || bw) * 0.42, hx(core))).join("");
  const jointDots = Object.values(joints).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${bw * 0.32}" fill="${hx(core)}"/>`).join("");
  const [hx0, hy0] = head.c;
  const headGlow = `<circle cx="${hx0}" cy="${hy0}" r="${head.r}" fill="${hx(color)}" opacity="0.18"/>
    <circle cx="${hx0}" cy="${hy0}" r="${head.r}" fill="none" stroke="${hx(color)}" stroke-width="10"/>`;
  const headCore = `<circle cx="${hx0}" cy="${hy0}" r="${head.r}" fill="none" stroke="${hx(core)}" stroke-width="3.5"/>`;
  return `
    <g filter="url(#gM)" opacity="0.95">${headGlow}${bonesGlow}</g>
    <g>${bonesCore}${headCore}${jointDots}</g>`;
}

// blueprint schematic fragment (faint, behind the build figure)
function blueprint(cx, cy) {
  const c = hx(C.electron);
  const S = (op) => `stroke="${c}" stroke-width="2" fill="none" opacity="${op}"`;
  return `<g filter="url(#gS)" transform="translate(${cx},${cy})">
    <rect x="-230" y="-150" width="460" height="300" rx="10" ${S(0.5)} stroke-dasharray="8 7"/>
    <path d="M-230,-70 L230,-70 M-230,60 L230,60 M-120,-150 L-120,150 M120,-150 L120,150" ${S(0.22)}/>
    <path d="M-170,20 L-20,-40 L60,20 L-20,10 Z" ${S(0.6)}/>
    <path d="M-20,-40 L-20,10" ${S(0.6)}/>
    <circle cx="120" cy="-70" r="34" ${S(0.55)}/>
    <path d="M120,-104 L120,-36 M86,-70 L154,-70" ${S(0.45)}/>
    <text x="-224" y="132" fill="${c}" opacity="0.7" font-family="Consolas,monospace" font-size="20">AIRFRAME v3 &#183; 0.6m span</text>
  </g>`;
}

// ============================================================================
//  GLIDER  (nose points RIGHT; rotate in-deck for arc)
// ============================================================================
function gliderSVG() {
  const W = 560, H = 340;
  const body = `M500,170 L70,58 L182,170 L70,282 Z`;
  const keel = `M500,170 L182,170`;
  return { W, H, svg: `${defs()}
    <g filter="url(#gM)">
      <path d="${body}" fill="${hx(C.holo)}" opacity="0.16"/>
      <path d="${body}" fill="none" stroke="${hx(C.holo)}" stroke-width="9" stroke-linejoin="round"/>
      <path d="${keel}" stroke="${hx(C.holo)}" stroke-width="6"/>
    </g>
    <g>
      <path d="${body}" fill="none" stroke="${hx(C.holoHot)}" stroke-width="3" stroke-linejoin="round"/>
      <path d="${keel}" stroke="${hx(C.holoHot)}" stroke-width="2"/>
      <circle cx="500" cy="170" r="7" fill="${hx(C.holoHot)}"/>
    </g>` };
}

// ============================================================================
//  TARGET  (idle cyan  /  hit amber burst)
// ============================================================================
function targetSVG(hit) {
  const W = 760, H = 760, cx = 380, cy = 380;
  const rings = [340, 272, 206, 142, 82, 30];
  const base = hit ? C.amber : C.holo;
  const coreCol = hit ? C.amberLt : C.holoLt;
  let ringMarkup = "";
  rings.forEach((r, i) => {
    const op = 0.35 + 0.11 * i;
    ringMarkup += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${hx(base)}" stroke-width="${i === rings.length - 1 ? 0 : 6}" opacity="${op}"/>`;
  });
  // crosshair ticks
  const tick = (x1, y1, x2, y2) => `<path d="M${x1},${y1} L${x2},${y2}" stroke="${hx(base)}" stroke-width="5" opacity="0.6" stroke-linecap="round"/>`;
  const ticks = tick(cx, 8, cx, 60) + tick(cx, H - 8, cx, H - 60) + tick(8, cy, 60, cy) + tick(W - 8, cy, W - 60, cy);
  const bull = `<circle cx="${cx}" cy="${cy}" r="30" fill="${hx(coreCol)}"/>`;

  let burst = "";
  if (hit) {
    // shock ring + radial rays + hot core
    let rays = "";
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      const r0 = 40, r1 = k % 2 ? 190 : 150;
      const x1 = cx + Math.cos(a) * r0, y1 = cy + Math.sin(a) * r0;
      const x2 = cx + Math.cos(a) * r1, y2 = cy + Math.sin(a) * r1;
      rays += `<path d="M${x1},${y1} L${x2},${y2}" stroke="${hx(C.amberLt)}" stroke-width="6" stroke-linecap="round" opacity="0.85"/>`;
    }
    // spark dots
    let sparks = "";
    for (let k = 0; k < 22; k++) {
      const a = Math.random() * Math.PI * 2, rr = 70 + Math.random() * 220;
      sparks += `<circle cx="${cx + Math.cos(a) * rr}" cy="${cy + Math.sin(a) * rr}" r="${2 + Math.random() * 4}" fill="${hx(C.amberLt)}" opacity="${0.4 + Math.random() * 0.5}"/>`;
    }
    burst = `<g filter="url(#gM)">
        <circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="${hx(C.amber)}" stroke-width="10" opacity="0.7"/>
        <circle cx="${cx}" cy="${cy}" r="235" fill="none" stroke="${hx(C.amber)}" stroke-width="5" opacity="0.4"/>
        ${rays}
        <circle cx="${cx}" cy="${cy}" r="60" fill="${hx(C.amberLt)}" opacity="0.9"/>
        <circle cx="${cx}" cy="${cy}" r="30" fill="${hx(C.white)}"/>
      </g>
      <g filter="url(#gS)">${sparks}</g>`;
  }

  return { W, H, svg: `${defs()}
    <g filter="url(#gM)">${ringMarkup}${ticks}${hit ? "" : bull}</g>
    ${burst}` };
}

// ============================================================================
//  EMBLEM  (targeting reticle + glider) — brand mark
// ============================================================================
function emblemSVG() {
  const W = 440, H = 440, cx = 220, cy = 220;
  let ticks = "";
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2;
    const r0 = k % 6 === 0 ? 150 : 165, r1 = 178;
    ticks += `<path d="M${cx + Math.cos(a) * r0},${cy + Math.sin(a) * r0} L${cx + Math.cos(a) * r1},${cy + Math.sin(a) * r1}" stroke="${hx(C.holo)}" stroke-width="${k % 6 === 0 ? 5 : 2.5}" opacity="0.7" stroke-linecap="round"/>`;
  }
  const glider = `M300,150 L120,120 L172,175 L120,230 Z`;
  return { W, H, svg: `${defs()}
    <g filter="url(#gM)">
      <circle cx="${cx}" cy="${cy}" r="190" fill="none" stroke="${hx(C.holo)}" stroke-width="4" opacity="0.55"/>
      <circle cx="${cx}" cy="${cy}" r="140" fill="none" stroke="${hx(C.holo)}" stroke-width="2.5" opacity="0.4" stroke-dasharray="4 10"/>
      ${ticks}
      <path d="M${cx},30 L${cx},70 M${cx},${H - 30} L${cx},${H - 70} M30,${cy} L70,${cy} M${W - 30},${cy} L${W - 70},${cy}" stroke="${hx(C.holo)}" stroke-width="3" opacity="0.5" stroke-linecap="round"/>
      <path d="${glider}" fill="${hx(C.holo)}" opacity="0.18"/>
      <path d="${glider}" fill="none" stroke="${hx(C.holo)}" stroke-width="7" stroke-linejoin="round"/>
      <path d="M300,150 L172,175" stroke="${hx(C.holo)}" stroke-width="5"/>
    </g>
    <g>
      <path d="${glider}" fill="none" stroke="${hx(C.holoHot)}" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="300" cy="150" r="6" fill="${hx(C.holoHot)}"/>
    </g>` };
}

// ============================================================================
//  BACKGROUNDS  (2560 x 1440)
// ============================================================================
const BW = 2560, BH = 1440;

function holoFloor(cx, cy, op = 1) {
  let arcs = "";
  for (let i = 1; i <= 7; i++) {
    const rx = 180 + i * 150, ry = rx * 0.26;
    arcs += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${hx(C.holo)}" stroke-width="2.5" opacity="${(0.5 - i * 0.05) * op}"/>`;
  }
  let spokes = "";
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2;
    spokes += `<path d="M${cx},${cy} L${cx + Math.cos(a) * 1250},${cy + Math.sin(a) * 325}" stroke="${hx(C.holo)}" stroke-width="1.6" opacity="${0.10 * op}"/>`;
  }
  return `<g filter="url(#gS)">${spokes}${arcs}</g>`;
}

function bgCommonDefs() {
  return `
    <radialGradient id="vig" cx="50%" cy="42%" r="75%">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="72%" stop-color="#000000" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.72"/>
    </radialGradient>
    ${gridPattern("grid", 96, C.holo, 0.05)}
    ${scanPattern("scan", C.holo, 0.045, 6)}`;
}

async function bgHero() {
  const inner = `${defs(`
    ${bgCommonDefs()}
    <radialGradient id="bgH" cx="47%" cy="38%" r="95%">
      <stop offset="0%" stop-color="#0d2238"/>
      <stop offset="42%" stop-color="#081627"/>
      <stop offset="100%" stop-color="#04060e"/>
    </radialGradient>`)}
    <rect width="${BW}" height="${BH}" fill="url(#bgH)"/>
    <rect width="${BW}" height="${BH}" fill="url(#grid)"/>
    <g filter="url(#gXL)"><ellipse cx="1150" cy="720" rx="620" ry="560" fill="${hx(C.holo)}" opacity="0.10"/></g>
    ${holoFloor(1230, 1230, 1)}
    <rect width="${BW}" height="${BH}" fill="url(#scan)"/>
    <rect width="${BW}" height="${BH}" fill="url(#vig)"/>
    ${brackets(BW, BH)}`;
  await render("bg-hero.png", inner, BW, BH);
}

async function bgContent() {
  const inner = `${defs(`
    ${bgCommonDefs()}
    <radialGradient id="bgC" cx="30%" cy="30%" r="105%">
      <stop offset="0%" stop-color="#0b1b2d"/>
      <stop offset="48%" stop-color="#071322"/>
      <stop offset="100%" stop-color="#04060e"/>
    </radialGradient>`)}
    <rect width="${BW}" height="${BH}" fill="url(#bgC)"/>
    <rect width="${BW}" height="${BH}" fill="url(#grid)"/>
    <g filter="url(#gL)"><circle cx="2280" cy="240" r="360" fill="none" stroke="${hx(C.holo)}" stroke-width="3" opacity="0.14"/></g>
    <g filter="url(#gL)"><circle cx="2280" cy="240" r="250" fill="none" stroke="${hx(C.holo)}" stroke-width="2" opacity="0.10"/></g>
    <g filter="url(#gXL)"><ellipse cx="520" cy="560" rx="520" ry="520" fill="${hx(C.holo)}" opacity="0.06"/></g>
    <rect width="${BW}" height="${BH}" fill="url(#scan)"/>
    <rect width="${BW}" height="${BH}" fill="url(#vig)"/>
    ${brackets(BW, BH, 54, 96, C.holo, 0.4)}`;
  await render("bg-content.png", inner, BW, BH);
}

async function bgCover() {
  const inner = `${defs(`
    ${bgCommonDefs()}
    <radialGradient id="bgV" cx="50%" cy="46%" r="90%">
      <stop offset="0%" stop-color="#0e2740"/>
      <stop offset="40%" stop-color="#08182a"/>
      <stop offset="100%" stop-color="#03050c"/>
    </radialGradient>`)}
    <rect width="${BW}" height="${BH}" fill="url(#bgV)"/>
    <rect width="${BW}" height="${BH}" fill="url(#grid)"/>
    <g filter="url(#gXL)"><circle cx="1280" cy="640" r="520" fill="${hx(C.holo)}" opacity="0.13"/></g>
    <g filter="url(#gL)"><circle cx="1280" cy="640" r="470" fill="none" stroke="${hx(C.holo)}" stroke-width="3" opacity="0.18"/></g>
    ${holoFloor(1280, 1320, 1.1)}
    <rect width="${BW}" height="${BH}" fill="url(#scan)"/>
    <rect width="${BW}" height="${BH}" fill="url(#vig)"/>
    ${brackets(BW, BH)}`;
  await render("bg-cover.png", inner, BW, BH);
}

async function bgClosing() {
  const inner = `${defs(`
    ${bgCommonDefs()}
    <radialGradient id="bgE" cx="62%" cy="44%" r="95%">
      <stop offset="0%" stop-color="#0e2740"/>
      <stop offset="42%" stop-color="#081728"/>
      <stop offset="100%" stop-color="#03050c"/>
    </radialGradient>`)}
    <rect width="${BW}" height="${BH}" fill="url(#bgE)"/>
    <rect width="${BW}" height="${BH}" fill="url(#grid)"/>
    <g filter="url(#gXL)"><ellipse cx="1700" cy="700" rx="620" ry="600" fill="${hx(C.holo)}" opacity="0.10"/></g>
    <g filter="url(#gM)" opacity="0.5">
      <circle cx="1980" cy="620" r="300" fill="none" stroke="${hx(C.holo)}" stroke-width="4"/>
      <circle cx="1980" cy="620" r="210" fill="none" stroke="${hx(C.holo)}" stroke-width="3" opacity="0.6"/>
      <circle cx="1980" cy="620" r="120" fill="none" stroke="${hx(C.holo)}" stroke-width="3" opacity="0.4"/>
    </g>
    ${holoFloor(1280, 1300, 0.8)}
    <rect width="${BW}" height="${BH}" fill="url(#scan)"/>
    <rect width="${BW}" height="${BH}" fill="url(#vig)"/>
    ${brackets(BW, BH)}`;
  await render("bg-closing.png", inner, BW, BH);
}

// ---- trajectory dotted arc (transparent, for launch->target flight path) ---
function trajectorySVG() {
  const W = 1600, H = 900;
  // arc from upper-left (release point / throwing hand) sweeping down-right to the target
  const path = `M140,120 Q840,120 1250,500`;
  return { W, H, svg: `${defs()}
    <g filter="url(#gS)">
      <path d="${path}" fill="none" stroke="${hx(C.holo)}" stroke-width="5" opacity="0.85" stroke-linecap="round" stroke-dasharray="2 26"/>
      <path d="${path}" fill="none" stroke="${hx(C.holo)}" stroke-width="1.5" opacity="0.3"/>
    </g>` };
}

// ============================================================================
//  FIGURE POSE DEFINITIONS  (900 x 940 canvas, feet ~ y=880)
// ============================================================================
const FW = 900, FH = 940;

const poseBuild = {
  joints: {
    neck: [450, 250], hipC: [450, 520],
    shL: [388, 288], shR: [512, 288],
    elL: [356, 402], haL: [438, 560],
    elR: [544, 402], haR: [462, 560],
    hpL: [408, 520], hpR: [492, 520],
    knL: [356, 672], ftL: [346, 872],
    knR: [544, 672], ftR: [554, 872],
  },
  bones: [
    ["neck", "hipC", 30], ["neck", "shL"], ["neck", "shR"],
    ["shL", "elL"], ["elL", "haL"], ["shR", "elR"], ["elR", "haR"],
    ["hipC", "hpL"], ["hipC", "hpR"],
    ["hpL", "knL"], ["knL", "ftL"], ["hpR", "knR"], ["knR", "ftR"],
  ],
  head: { c: [450, 190], r: 56 },
};

const poseLaunch = {
  joints: {
    neck: [372, 262], hipC: [446, 540],
    sh: [400, 292],
    elBack: [332, 200], haBack: [268, 168],   // throwing arm cocked up-back
    elFwd: [512, 336], haFwd: [604, 300],       // lead arm forward
    knLead: [560, 690], ftLead: [640, 870],
    knBack: [356, 700], ftBack: [268, 876],
  },
  bones: [
    ["neck", "hipC", 30], ["neck", "sh"],
    ["sh", "elBack"], ["elBack", "haBack"],
    ["sh", "elFwd"], ["elFwd", "haFwd"],
    ["hipC", "knLead"], ["knLead", "ftLead"],
    ["hipC", "knBack"], ["knBack", "ftBack"],
  ],
  head: { c: [356, 200], r: 56 },
};

const poseFollow = {
  joints: {
    neck: [372, 268], hipC: [452, 540],
    sh: [402, 298],
    elFwd: [488, 246], haFwd: [576, 196],    // throwing arm follow-through fwd/up
    elBal: [330, 372], haBal: [286, 452],    // balance arm back-down
    knLead: [560, 686], ftLead: [636, 864],
    knBack: [360, 700], ftBack: [280, 878],
  },
  bones: [
    ["neck", "hipC", 30], ["neck", "sh"],
    ["sh", "elFwd"], ["elFwd", "haFwd"],
    ["sh", "elBal"], ["elBal", "haBal"],
    ["hipC", "knLead"], ["knLead", "ftLead"],
    ["hipC", "knBack"], ["knBack", "ftBack"],
  ],
  head: { c: [356, 208], r: 56 },
};

async function figureAsset(name, pose, withBlueprint) {
  const bp = withBlueprint ? blueprint(470, 470) : "";
  const inner = `${defs()}${bp}${figure(pose.joints, pose.bones, pose.head)}`;
  await render(name, inner, FW, FH);
}

// ============================================================================
//  RUN
// ============================================================================
console.log("Generating holographic assets ->", OUT);

if (!process.env.SKIP_BG) {
  await bgHero();
  await bgContent();
  await bgCover();
  await bgClosing();
}

await figureAsset("fig-build.png", poseBuild, true);
await figureAsset("fig-launch.png", poseLaunch, false);
await figureAsset("fig-follow.png", poseFollow, false);

{ const g = gliderSVG(); await render("glider.png", g.svg, g.W, g.H); }
{ const t = targetSVG(false); await render("target.png", t.svg, t.W, t.H); }
{ const t = targetSVG(true); await render("target-hit.png", t.svg, t.W, t.H); }
{ const e = emblemSVG(); await render("emblem.png", e.svg, e.W, e.H); }
{ const tr = trajectorySVG(); await render("trajectory.png", tr.svg, tr.W, tr.H); }

console.log("Done.");
