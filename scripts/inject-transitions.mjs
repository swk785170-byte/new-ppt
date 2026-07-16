// ============================================================================
//  inject-transitions.mjs
//  Post-processes the pptxgenjs output to add SLIDE TRANSITIONS that pptxgenjs
//  cannot emit natively:
//    • Slides 4/5/6 (BUILD → LAUNCH → IMPACT) get a MORPH transition so the
//      shared silhouette + glider positions animate as one continuous motion.
//    • Every other slide gets a smooth FADE.
//  Done by unzipping the .pptx, splicing a <p:transition> into each slide's
//  XML at the correct CT_Slide position (after cSld / clrMapOvr, before timing),
//  then re-zipping. Morph is wrapped in mc:AlternateContent so older viewers
//  fall back to a fade.
// ============================================================================
import JSZip from "jszip";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "Operation-Skyline-Rescue-Glider.pptx");

// 1-based slide numbers that should MORPH (the holographic hero sequence).
const MORPH_SLIDES = new Set([4, 5, 6]);
const MORPH_DUR = 1200; // ms
const FADE_DUR = 550;   // ms

// --- transition XML builders ------------------------------------------------
function fadeXml(dur) {
  return (
    `<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" ` +
    `spd="slow" p14:dur="${dur}"><p:fade/></p:transition>`
  );
}

// Morph lives in the 2015/09 extension namespace (p159). Wrapped in
// AlternateContent so viewers without morph support render the fade fallback.
function morphXml(dur) {
  return (
    `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006">` +
      `<mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159">` +
        `<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" ` +
        `spd="slow" p14:dur="${dur}">` +
          `<p159:morph option="byObject"/>` +
        `</p:transition>` +
      `</mc:Choice>` +
      `<mc:Fallback>` +
        `<p:transition xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" ` +
        `spd="slow" p14:dur="${dur}"><p:fade/></p:transition>` +
      `</mc:Fallback>` +
    `</mc:AlternateContent>`
  );
}

// Splice the transition XML at the correct spot: right after </p:clrMapOvr>
// or a self-closing <p:clrMapOvr/>, else right after </p:cSld>.
function splice(xml, transition) {
  // strip any pre-existing transition so re-runs are idempotent
  xml = xml
    .replace(/<p:transition[\s\S]*?<\/p:transition>/g, "")
    .replace(/<mc:AlternateContent[\s\S]*?<\/mc:AlternateContent>/g, "");

  if (/<\/p:clrMapOvr>/.test(xml)) {
    return xml.replace(/<\/p:clrMapOvr>/, `</p:clrMapOvr>${transition}`);
  }
  const selfClose = /<p:clrMapOvr\b[^>]*\/>/;
  if (selfClose.test(xml)) {
    return xml.replace(selfClose, (m) => `${m}${transition}`);
  }
  return xml.replace(/<\/p:cSld>/, `</p:cSld>${transition}`);
}

// --- run --------------------------------------------------------------------
const buf = await readFile(FILE);
const zip = await JSZip.loadAsync(buf);

const slideFiles = Object.keys(zip.files)
  .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
  .sort((a, b) => {
    const na = +a.match(/slide(\d+)\.xml/)[1];
    const nb = +b.match(/slide(\d+)\.xml/)[1];
    return na - nb;
  });

const report = [];
for (const name of slideFiles) {
  const n = +name.match(/slide(\d+)\.xml/)[1];
  let xml = await zip.file(name).async("string");
  const isMorph = MORPH_SLIDES.has(n);
  const transition = isMorph ? morphXml(MORPH_DUR) : fadeXml(FADE_DUR);
  const out = splice(xml, transition);
  if (out === xml) {
    throw new Error(`Failed to splice transition into ${name} — no insertion point found`);
  }
  zip.file(name, out);
  report.push(`  slide ${String(n).padStart(2, "0")}: ${isMorph ? "MORPH (byObject)" : "fade"}`);
}

const outBuf = await zip.generateAsync({
  type: "nodebuffer",
  compression: "DEFLATE",
  compressionOptions: { level: 6 },
});
await writeFile(FILE, outBuf);

console.log(`Injected transitions into ${slideFiles.length} slides:`);
console.log(report.join("\n"));
console.log("Saved", FILE);
