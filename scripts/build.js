// Copies the files the game needs into _site/ for GitHub Pages (`npm run build`).
// There is no bundling: the browser loads the ES modules as they are.
import { cpSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = `${root}_site`;
const SITE_FILES = ["index.html", "src", "assets"];

rmSync(out, { recursive: true, force: true });
for (const entry of SITE_FILES) cpSync(`${root}${entry}`, `${out}/${entry}`, { recursive: true });
console.log(`Built ${SITE_FILES.join(", ")} into _site/`);
