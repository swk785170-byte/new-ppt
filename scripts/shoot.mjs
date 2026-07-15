// Headless screenshots of deck.html for QA verification.
import puppeteer from "puppeteer";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = "file://" + join(__dirname, "..", "deck.html");
const OUT = join(__dirname, "..", "qa");

const browser = await puppeteer.launch({
  headless: "new",
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1 });
await page.goto(FILE, { waitUntil: "networkidle0" });

// slide index -> label
const shots = { 3: "html-04-build", 4: "html-05-launch", 5: "html-06-impact", 7: "html-08-judging" };

for (const [idx, name] of Object.entries(shots)) {
  // navigate: go(n) is in scope via keyboard; use dots
  await page.evaluate((i) => {
    // reset then jump so .active re-triggers CSS animations
    document.querySelectorAll(".slide").forEach((s) => s.classList.remove("active"));
    return new Promise((r) => setTimeout(r, 30));
  }, +idx);
  await page.evaluate((i) => window.go ? window.go(i) : document.querySelectorAll("#dots .d")[i].click(), +idx);
  await new Promise((r) => setTimeout(r, 3200)); // let flight + ripple play
  await page.screenshot({ path: join(OUT, name + ".png") });
  console.log("shot", name);
}
await browser.close();
console.log("done");
