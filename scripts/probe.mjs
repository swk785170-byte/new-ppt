import sharp from "sharp";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200" viewBox="0 0 400 200">
  <defs>
    <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="rg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#0a2a44"/>
      <stop offset="100%" stop-color="#05070f"/>
    </radialGradient>
  </defs>
  <rect width="400" height="200" fill="url(#rg)"/>
  <g filter="url(#glow)">
    <circle cx="140" cy="100" r="34" fill="none" stroke="#34e7e7" stroke-width="6"/>
    <line x1="200" y1="60" x2="320" y2="140" stroke="#34e7e7" stroke-width="8" stroke-linecap="round"/>
  </g>
</svg>`;

const buf = await sharp(Buffer.from(svg), { density: 300 }).png().toBuffer();
await sharp(buf).toFile("/projects/sandbox/new-ppt/scripts/probe.png");
const stats = await sharp(buf).stats();
console.log("channels mean:", stats.channels.map(c => c.mean.toFixed(1)).join(", "));
console.log("done");
