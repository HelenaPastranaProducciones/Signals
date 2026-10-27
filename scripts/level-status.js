// Shows how far each level is, from the progress checklist in its README.md:
//   npm run status
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LEVELS_DIR = new URL("../src/levels/", import.meta.url);
const STEP = /^- \[([ xX])\] (\d)\. ([^:]+):/;

/** The six steps of a level notebook: [{ number, name, done }]. */
export function readLevelProgress(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.match(STEP))
    .filter(Boolean)
    .map(([, mark, number, name]) => ({ number: Number(number), name: name.trim(), done: mark !== " " }));
}

/** First paragraph of the "Where we left off" section. */
export function readLeftOff(markdown) {
  const section = markdown.split(/^## Where we left off\s*$/m)[1] ?? "";
  return section.split(/^## /m)[0].trim().split(/\n\s*\n/)[0].replace(/\s+/g, " ");
}

export function levelStatuses() {
  return readdirSync(LEVELS_DIR)
    .filter((name) => /^\d\d-/.test(name))
    .sort()
    .map((folder) => {
      const markdown = readFileSync(new URL(`${folder}/README.md`, LEVELS_DIR), "utf8");
      const steps = readLevelProgress(markdown);
      const next = steps.find((step) => !step.done);
      return {
        folder,
        title: markdown.match(/^# (.+)$/m)?.[1] ?? folder,
        done: steps.filter((step) => step.done).length,
        next: next ? `${next.number}. ${next.name}` : "Finished",
        leftOff: readLeftOff(markdown),
      };
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const statuses = levelStatuses();
  const finished = statuses.filter((status) => status.done === 6).length;
  console.log(`Signals: ${finished} of ${statuses.length} levels finished\n`);
  for (const status of statuses) {
    const bar = "■".repeat(status.done) + "□".repeat(6 - status.done);
    console.log(`${status.title.padEnd(36)} ${bar}  next: ${status.next}`);
  }
  const started = statuses.filter((status) => status.done > 0 && status.done < 6);
  if (started.length) {
    console.log("\nWhere we left off:");
    for (const status of started) console.log(`- ${status.title}: ${status.leftOff}`);
  }
}
