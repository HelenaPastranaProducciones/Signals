// Opens a level in a real browser, reports errors and saves a screenshot:
//   npm run check -- 7            level 7 (desktop size)
//   npm run check -- 7 --mobile   level 7 at phone size
//   npm run check -- map          the level map (also: title, lobby)
//   npm run check -- 7 --wait 3   let the level run 3 seconds before the screenshot
// Screenshots go to screenshots/ (not saved in git). Needs Playwright, which
// is available in Claude's cloud environment; elsewhere: npx playwright install chromium.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.js";

const args = process.argv.slice(2);
const target = args.find((arg) => !arg.startsWith("--")) ?? "map";
const mobile = args.includes("--mobile");
const waitIndex = args.indexOf("--wait");
const waitSeconds = waitIndex >= 0 ? Number(args[waitIndex + 1]) : 1.5;

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)("playwright"));
} catch {
  console.error("Playwright is not available here, so the browser check can't run.");
  process.exit(2);
}

const server = await startServer(".", 0);
const base = `http://localhost:${server.address().port}/`;
const address = /^\d+$/.test(target) ? `${base}?level=${target}` : target === "title" ? base : `${base}?test`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: mobile ? { width: 400, height: 800 } : { width: 1280, height: 800 } });
const problems = [];
page.on("pageerror", (error) => problems.push(`Page error: ${error.message}`));
page.on("console", (message) => message.type() === "error" && problems.push(`Console error: ${message.text()}`));
page.on("response", (response) => response.status() >= 400 && problems.push(`Missing file (${response.status()}): ${response.url()}`));

await page.goto(address);
if (target === "map" || target === "lobby") {
  // Title → 7-second intro → map.
  await page.keyboard.press("Enter");
  await page.waitForSelector(".level-grid", { timeout: 10000 });
}
if (target === "lobby") await page.click(".lobby-button", { force: true });
await page.waitForTimeout(waitSeconds * 1000);

const folder = fileURLToPath(new URL("../screenshots/", import.meta.url));
mkdirSync(folder, { recursive: true });
const file = `${folder}${/^\d+$/.test(target) ? `level-${target.padStart(2, "0")}` : target}${mobile ? "-mobile" : ""}.png`;
await page.screenshot({ path: file });
await browser.close();
server.close();

console.log(`Opened ${address}`);
console.log(`Screenshot: ${file}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("No errors.");
