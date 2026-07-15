// ============================================================================
//  Build the PowerPoint deck  —  "Operation Skyline: Rescue Glider Challenge"
//  pptxgenjs, LAYOUT_WIDE (13.333 x 7.5"). Holographic rescue-mission theme.
//  Hero sequence (Build/Launch/Impact) keeps morph-matched object positions;
//  Morph transitions are injected afterwards by inject-transitions.mjs.
// ============================================================================
import pptxgen from "pptxgenjs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  C, F, G, EVENT, MISSION, OBJECTIVE, SEQUENCE, RULES, JUDGING, TIMELINE, CLOSING, NAV,
} from "./theme.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const A = (name) => join(__dirname, "..", "assets", name);
const OUT = join(__dirname, "..", "Operation-Skyline-Rescue-Glider.pptx");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";
pres.author = "Kiro";
pres.company = EVENT.host;
pres.title = EVENT.title + " — " + EVENT.subtitle;

const W = G.W, H = G.H, M = G.margin, CW = G.cw;

// ---------- shared helpers --------------------------------------------------
function bg(slide, img) {
  slide.background = { path: A(img) };
}

// techy monospace kicker label
function kicker(slide, text, x = M, y = 0.62, color = C.holo) {
  slide.addText(text, {
    x, y, w: CW, h: 0.34, align: "left", valign: "middle",
    fontFace: F.mono, fontSize: 12.5, color, charSpacing: 3, bold: true,
  });
}

// big display title
function title(slide, text, opts = {}) {
  slide.addText(text, {
    x: opts.x ?? M, y: opts.y ?? 1.02, w: opts.w ?? CW, h: opts.h ?? 1.1,
    align: opts.align ?? "left", valign: "top",
    fontFace: F.display, fontSize: opts.fontSize ?? 40, color: opts.color ?? C.text,
    bold: true, charSpacing: opts.charSpacing ?? 0.5,
  });
}

// footer strip: index / total, nav label, program tag + emblem
function footer(slide, idx) {
  const y = 7.02;
  slide.addImage({ path: A("emblem.png"), x: M, y: y - 0.02, w: 0.34, h: 0.34, transparency: 15 });
  slide.addText(
    [
      { text: String(idx + 1).padStart(2, "0"), options: { color: C.holo, bold: true } },
      { text: " / 10   ", options: { color: C.textFaint } },
      { text: NAV[idx], options: { color: C.textDim } },
    ],
    { x: M + 0.44, y, w: 5, h: 0.32, fontFace: F.mono, fontSize: 10.5, align: "left", valign: "middle", charSpacing: 2 }
  );
  slide.addText(EVENT.title + "  //  " + EVENT.subtitle, {
    x: W - M - 6.5, y, w: 6.5, h: 0.32, fontFace: F.mono, fontSize: 10.5,
    color: C.textFaint, align: "right", valign: "middle", charSpacing: 1.5,
  });
}

// thin holo divider tick (small, NOT an under-title accent line)
function hudTick(slide, x, y, w = 0.5) {
  slide.addShape(pres.ShapeType.line, { x, y, w, h: 0, line: { color: C.holo, width: 2 } });
}

// ============================================================================
// 1 — COVER
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-cover.png");
  s.addImage({ path: A("emblem.png"), x: W / 2 - 0.85, y: 0.9, w: 1.7, h: 1.7 });
  s.addText(EVENT.program, {
    x: 0, y: 2.72, w: W, h: 0.34, align: "center", valign: "middle",
    fontFace: F.mono, fontSize: 13, color: C.holo, charSpacing: 5, bold: true,
  });
  s.addText(EVENT.title, {
    x: 0, y: 3.06, w: W, h: 1.35, align: "center", valign: "middle",
    fontFace: F.display, fontSize: 66, color: C.text, bold: true, charSpacing: 2,
  });
  s.addText(EVENT.subtitle, {
    x: 0, y: 4.4, w: W, h: 0.7, align: "center", valign: "middle",
    fontFace: F.head, fontSize: 27, color: C.holoLt, bold: true,
  });
  s.addText(EVENT.tagline, {
    x: 0, y: 5.15, w: W, h: 0.45, align: "center", valign: "middle",
    fontFace: F.body, fontSize: 15, color: C.textDim, italic: true,
  });
  s.addText(
    [
      { text: EVENT.date, options: { color: C.text, bold: true } },
      { text: "   ·   ", options: { color: C.holo } },
      { text: EVENT.venue, options: { color: C.textDim } },
    ],
    { x: 0, y: 6.05, w: W, h: 0.34, align: "center", valign: "middle", fontFace: F.mono, fontSize: 12.5, charSpacing: 1 }
  );
  s.addText(EVENT.edition, {
    x: W - M - 4, y: 0.5, w: 4, h: 0.3, align: "right", valign: "middle",
    fontFace: F.mono, fontSize: 10.5, color: C.textFaint, charSpacing: 2,
  });
  s.addText(EVENT.host.toUpperCase(), {
    x: M, y: 0.5, w: 5, h: 0.3, align: "left", valign: "middle",
    fontFace: F.mono, fontSize: 10.5, color: C.textFaint, charSpacing: 2,
  });
}

// ============================================================================
// 2 — MISSION BRIEFING
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-content.png");
  kicker(s, MISSION.code, M, 0.62, C.danger);
  title(s, "Disaster Strikes Again.", { y: 1.0, fontSize: 44, w: 9.8 });

  // alert chip
  s.addShape(pres.ShapeType.roundRect, {
    x: M, y: 2.05, w: 2.55, h: 0.42, rectRadius: 0.06,
    fill: { color: C.bg2 }, line: { color: C.danger, width: 1 },
  });
  s.addText("● MISSION BRIEFING", {
    x: M, y: 2.05, w: 2.55, h: 0.42, align: "center", valign: "middle",
    fontFace: F.mono, fontSize: 11, color: C.danger, bold: true, charSpacing: 1,
  });

  // narrative lines
  const startY = 2.75, lineH = 0.72;
  MISSION.lines.forEach((ln, i) => {
    // marker tick centered on each line slot so spacing reads evenly even when a line wraps
    s.addShape(pres.ShapeType.rect, { x: M, y: startY + i * lineH + (lineH / 2 - 0.16), w: 0.09, h: 0.32, fill: { color: C.holo } });
    s.addText(ln, {
      x: M + 0.32, y: startY + i * lineH, w: 8.3, h: lineH, align: "left", valign: "middle",
      fontFace: F.body, fontSize: i === 0 ? 18 : 15.5, color: i === 0 ? C.holoLt : C.textDim,
      bold: i === 0, lineSpacingMultiple: 1.0,
    });
  });

  // punch line
  s.addText(MISSION.punch, {
    x: M, y: startY + MISSION.lines.length * lineH + 0.2, w: 8.0, h: 0.9,
    align: "left", valign: "top", fontFace: F.head, fontSize: 18, color: C.text, bold: true,
    lineSpacingMultiple: 1.05,
  });

  // faint target motif on the right
  s.addImage({ path: A("target.png"), x: 9.55, y: 1.7, w: 3.6, h: 3.6, transparency: 40 });
  s.addImage({ path: A("glider.png"), x: 9.5, y: 3.15, w: 1.9, h: 1.15, rotate: 22, transparency: 15 });

  footer(s, 1);
}

// ============================================================================
// 3 — EVENT OVERVIEW / OBJECTIVE
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-content.png");
  kicker(s, OBJECTIVE.kicker);
  title(s, OBJECTIVE.title, { y: 1.0, fontSize: 38, w: 11 });
  s.addText(OBJECTIVE.lead, {
    x: M, y: 1.92, w: 10.4, h: 0.72, align: "left", valign: "top",
    fontFace: F.body, fontSize: 16, color: C.textDim, lineSpacingMultiple: 1.05,
  });

  // 4 numbered HUD cards in a row
  const n = OBJECTIVE.cards.length;
  const gap = 0.32;
  const cardW = (CW - gap * (n - 1)) / n;
  const cardY = 3.0, cardH = 3.35;
  OBJECTIVE.cards.forEach((c, i) => {
    const x = M + i * (cardW + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: cardY, w: cardW, h: cardH, rectRadius: 0.08,
      fill: { color: C.bg1, transparency: 15 }, line: { color: C.grid, width: 1.25 },
    });
    // top accent bar
    s.addShape(pres.ShapeType.rect, { x: x + 0.28, y: cardY + 0.3, w: 0.55, h: 0.06, fill: { color: C.holo } });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.24, y: cardY + 0.42, w: cardW - 0.48, h: 0.95, align: "left", valign: "top",
      fontFace: F.display, fontSize: 46, color: C.holo, bold: true,
    });
    s.addText(c.h, {
      x: x + 0.28, y: cardY + 1.42, w: cardW - 0.5, h: 0.7, align: "left", valign: "top",
      fontFace: F.head, fontSize: 16.5, color: C.text, bold: true, lineSpacingMultiple: 0.98,
    });
    s.addText(c.p, {
      x: x + 0.28, y: cardY + 2.12, w: cardW - 0.5, h: 1.1, align: "left", valign: "top",
      fontFace: F.body, fontSize: 12.5, color: C.textDim, lineSpacingMultiple: 1.02,
    });
  });

  footer(s, 2);
}

// ============================================================================
// 4/5/6 — HOLOGRAPHIC SEQUENCE (shared bg-hero, morph-matched objects)
// ============================================================================
// Shared figure box (kept ~matched A/B so morph reads as continuous motion)
const FIG = { x: 3.95, y: 1.12, w: 4.55, h: 4.75 }; // 900x940 aspect

function seqShell(seq) {
  const s = pres.addSlide();
  bg(s, "bg-hero.png");
  // kicker + sequence marker
  s.addText(seq.seq, {
    x: M, y: 0.58, w: 6, h: 0.34, align: "left", valign: "middle",
    fontFace: F.mono, fontSize: 12.5, color: C.holo, charSpacing: 4, bold: true,
  });
  s.addText(seq.kicker, {
    x: M, y: 0.98, w: 8, h: 0.42, align: "left", valign: "middle",
    fontFace: F.head, fontSize: 15, color: C.textDim, charSpacing: 2, bold: true,
  });
  return s;
}

function seqCaption(s, seq) {
  s.addText(seq.title, {
    x: M, y: 5.55, w: 7.5, h: 0.95, align: "left", valign: "middle",
    fontFace: F.display, fontSize: 52, color: C.text, bold: true, charSpacing: 3,
  });
  s.addText(seq.line, {
    x: W - M - 5.6, y: 5.72, w: 5.6, h: 1.0, align: "right", valign: "middle",
    fontFace: F.body, fontSize: 14.5, color: C.textDim, italic: true, lineSpacingMultiple: 1.05,
  });
}

// Slide 4 — BUILD
{
  const seq = SEQUENCE[0];
  const s = seqShell(seq);
  s.addImage({ path: A("fig-build.png"), ...FIG }); // blueprint baked in
  // glider taking shape in the hands (chest height), level — raised so it clears
  // the baked-in "AIRFRAME" blueprint label below it
  s.addImage({ path: A("glider.png"), x: 5.5, y: 3.1, w: 1.5, h: 0.911, rotate: 0 });
  seqCaption(s, seq);
  footer(s, 3);
}

// Slide 5 — LAUNCH
{
  const seq = SEQUENCE[1];
  const s = seqShell(seq);
  // trajectory arc (release -> zone) faint, behind glider
  s.addImage({ path: A("trajectory.png"), x: 4.6, y: 1.3, w: 8.2, h: 4.612, transparency: 25 });
  s.addImage({ path: A("fig-launch.png"), ...FIG }); // same box -> morph continuity
  // glider cocked in the throwing hand (upper-left of figure), angled up
  s.addImage({ path: A("glider.png"), x: 4.65, y: 1.42, w: 1.55, h: 0.941, rotate: 328 });
  seqCaption(s, seq);
  footer(s, 4);
}

// Slide 6 — IMPACT / TARGET
{
  const seq = SEQUENCE[2];
  const s = seqShell(seq);
  s.addImage({ path: A("trajectory.png"), x: 4.6, y: 1.3, w: 8.2, h: 4.612, transparency: 30 });
  // target on the right, lit up on hit
  s.addImage({ path: A("target-hit.png"), x: 8.7, y: 1.6, w: 4.25, h: 4.25 });
  // figure -> follow-through, smaller & left (camera pans): morph from launch
  s.addImage({ path: A("fig-follow.png"), x: 0.55, y: 2.35, w: 3.35, h: 3.5 });
  // glider striking the bullseye, nose down-right
  s.addImage({ path: A("glider.png"), x: 10.05, y: 3.0, w: 1.55, h: 0.941, rotate: 24 });
  seqCaption(s, seq);
  footer(s, 5);
}

// ============================================================================
// 7 — RULES & CONSTRAINTS
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-content.png");
  kicker(s, RULES.kicker);
  title(s, RULES.title, { y: 1.0, fontSize: 38 });

  const n = RULES.groups.length;
  const gap = 0.4;
  const colW = (CW - gap * (n - 1)) / n;
  const colY = 2.3, colH = 4.15;
  RULES.groups.forEach((g, i) => {
    const x = M + i * (colW + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x, y: colY, w: colW, h: colH, rectRadius: 0.08,
      fill: { color: C.bg1, transparency: 20 }, line: { color: C.grid, width: 1.25 },
    });
    s.addText(String(i + 1).padStart(2, "0"), {
      x: x + 0.3, y: colY + 0.28, w: 1.2, h: 0.5, align: "left", valign: "middle",
      fontFace: F.mono, fontSize: 16, color: C.holo, bold: true, charSpacing: 1,
    });
    s.addText(g.h, {
      x: x + 0.3, y: colY + 0.72, w: colW - 0.6, h: 0.5, align: "left", valign: "middle",
      fontFace: F.head, fontSize: 18, color: C.holoLt, bold: true,
    });
    const items = g.items.map((it) => ({
      text: it,
      options: { bullet: { code: "25AA", indent: 14 }, color: C.textDim, fontSize: 13.5, paraSpaceAfter: 9, breakLine: true },
    }));
    s.addText(items, {
      x: x + 0.32, y: colY + 1.35, w: colW - 0.6, h: colH - 1.6, align: "left", valign: "top",
      fontFace: F.body, color: C.textDim, lineSpacingMultiple: 1.02,
    });
  });

  footer(s, 6);
}

// ============================================================================
// 8 — JUDGING CRITERIA (score bars)
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-content.png");
  kicker(s, JUDGING.kicker);
  title(s, JUDGING.title, { y: 1.0, fontSize: 38 });

  const rowY = 2.5, rowH = 0.98, barX = 5.9, barW = 5.1, barH = 0.34;
  JUDGING.criteria.forEach((c, i) => {
    const y = rowY + i * rowH;
    // percentage (big)
    s.addText(c.pct, {
      x: M, y: y - 0.05, w: 1.5, h: 0.7, align: "left", valign: "middle",
      fontFace: F.display, fontSize: 34, color: C.holo, bold: true,
    });
    // heading + desc
    s.addText(c.h, {
      x: M + 1.55, y: y - 0.06, w: 3.2, h: 0.42, align: "left", valign: "middle",
      fontFace: F.head, fontSize: 17, color: C.text, bold: true,
    });
    s.addText(c.p, {
      x: M + 1.55, y: y + 0.3, w: barX - (M + 1.55) - 0.25, h: 0.5, align: "left", valign: "top",
      fontFace: F.body, fontSize: 12, color: C.textFaint, lineSpacingMultiple: 1.0,
    });
    // bar track + fill
    const pct = parseInt(c.pct, 10) / 100;
    s.addShape(pres.ShapeType.roundRect, { x: barX, y: y + 0.02, w: barW, h: barH, rectRadius: 0.04, fill: { color: C.bg2 }, line: { color: C.grid, width: 1 } });
    s.addShape(pres.ShapeType.roundRect, { x: barX, y: y + 0.02, w: barW * pct, h: barH, rectRadius: 0.04, fill: { color: C.holo } });
  });

  footer(s, 7);
}

// ============================================================================
// 9 — TIMELINE / SCHEDULE
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-content.png");
  kicker(s, TIMELINE.kicker);
  title(s, TIMELINE.title, { y: 1.0, fontSize: 38 });

  const startY = 2.35, rowH = 0.72, spineX = M + 1.6;
  // spine
  s.addShape(pres.ShapeType.line, {
    x: spineX, y: startY + 0.16, w: 0, h: (TIMELINE.stops.length - 1) * rowH + 0.05,
    line: { color: C.grid, width: 1.5 },
  });
  TIMELINE.stops.forEach((t, i) => {
    const y = startY + i * rowH;
    // time chip (left)
    s.addText(t.t, {
      x: M, y, w: 1.35, h: 0.42, align: "left", valign: "middle",
      fontFace: F.mono, fontSize: 16, color: C.holo, bold: true, charSpacing: 1,
    });
    // node dot on spine
    s.addShape(pres.ShapeType.ellipse, { x: spineX - 0.09, y: y + 0.07, w: 0.18, h: 0.18, fill: { color: C.holo }, line: { color: C.bg0, width: 1.5 } });
    // heading + desc
    s.addText(
      [
        { text: t.h + "   ", options: { color: C.text, bold: true, fontSize: 16 } },
        { text: t.p, options: { color: C.textDim, fontSize: 13 } },
      ],
      { x: spineX + 0.35, y, w: W - (spineX + 0.35) - M, h: 0.5, align: "left", valign: "middle", fontFace: F.body, lineSpacingMultiple: 1.0 }
    );
  });

  footer(s, 8);
}

// ============================================================================
// 10 — CLOSING / DEPLOY
// ============================================================================
{
  const s = pres.addSlide();
  bg(s, "bg-closing.png");
  s.addImage({ path: A("emblem.png"), x: W / 2 - 0.8, y: 1.05, w: 1.6, h: 1.6 });
  s.addText(CLOSING.kicker, {
    x: 0, y: 2.78, w: W, h: 0.34, align: "center", valign: "middle",
    fontFace: F.mono, fontSize: 13, color: C.holo, charSpacing: 6, bold: true,
  });
  s.addText(CLOSING.title, {
    x: 0, y: 3.12, w: W, h: 1.15, align: "center", valign: "middle",
    fontFace: F.display, fontSize: 50, color: C.text, bold: true, charSpacing: 1,
  });
  s.addText(CLOSING.line, {
    x: 0, y: 4.35, w: W, h: 0.5, align: "center", valign: "middle",
    fontFace: F.body, fontSize: 17, color: C.textDim, italic: true,
  });
  s.addText(CLOSING.cta, {
    x: 0, y: 5.05, w: W, h: 0.55, align: "center", valign: "middle",
    fontFace: F.head, fontSize: 22, color: C.holoLt, bold: true, charSpacing: 3,
  });
  s.addText(CLOSING.sign, {
    x: 0, y: 6.35, w: W, h: 0.34, align: "center", valign: "middle",
    fontFace: F.mono, fontSize: 11.5, color: C.textFaint, charSpacing: 2,
  });
}

await pres.writeFile({ fileName: OUT });
console.log("Wrote", OUT);
