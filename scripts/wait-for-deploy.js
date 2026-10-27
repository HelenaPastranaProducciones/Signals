// After pushing to main, waits until the online game shows this version:
//   npm run wait-deploy
// Polls the site every 10 seconds for up to 8 minutes. Uses curl so it works
// through proxies.
import { execFileSync } from "node:child_process";
import { currentVersion } from "./build.js";

const SITE = "https://helenapastranaproducciones.github.io/Signals/";
const version = currentVersion();
const deadline = Date.now() + 8 * 60 * 1000;

console.log(`Waiting for version ${version} on ${SITE}`);
while (Date.now() < deadline) {
  let html = "";
  try {
    html = execFileSync("curl", ["-s", "-H", "Cache-Control: no-cache", `${SITE}?nocache=${Date.now()}`]).toString();
  } catch {
    // Network hiccup: try again on the next round.
  }
  if (html.includes(`content="${version}"`)) {
    console.log(`Live: ${SITE}`);
    process.exit(0);
  }
  await new Promise((resolve) => setTimeout(resolve, 10000));
}
console.log("Not live after 8 minutes. Check the Actions tab on GitHub for a failed deploy.");
process.exit(1);
