// Builds the site for GitHub Pages into _site/ (`npm run build`).
// There is no bundling: the browser loads the ES modules as they are. The
// code goes into a folder named after the version (e.g. _site/v-1a2b3c4d/),
// so after every publish browsers fetch the new files instead of old cached
// ones. index.html points to that folder and carries the version in a
// <meta name="signals-version"> tag (scripts/wait-for-deploy.js looks for it).
import { cpSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = `${root}_site`;

export function currentVersion() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 8);
  try {
    return execFileSync("git", ["rev-parse", "--short=8", "HEAD"], { cwd: root }).toString().trim();
  } catch {
    return Date.now().toString(36);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const version = currentVersion();
  const folder = `v-${version}`;
  rmSync(out, { recursive: true, force: true });
  for (const entry of ["src", "assets"]) cpSync(`${root}${entry}`, `${out}/${folder}/${entry}`, { recursive: true });

  const html = readFileSync(`${root}index.html`, "utf8")
    .replace(/(href|src)="(src|assets)\//g, `$1="${folder}/$2/`)
    .replace("<title>", `<meta name="signals-version" content="${version}">\n  <title>`);
  writeFileSync(`${out}/index.html`, html);
  console.log(`Built version ${version} into _site/`);
}
