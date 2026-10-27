// Minimal static server for local development: `npm start` (PORT=8000 by default).
// ES modules don't load from file://, so open the game through this server.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = fileURLToPath(new URL("..", import.meta.url));
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
};

/**
 * Serves the files of `folder` (relative to the repo) on `port`; port 0 picks a free one.
 * @returns {Promise<import("node:http").Server>}
 */
export function startServer(folder = ".", port = 8000) {
  const root = resolve(REPO, folder);
  const server = createServer(async (request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, "http://localhost").pathname));
    let file = join(root, path);
    if (!file.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) file = join(file, "index.html");
      const body = await readFile(file);
      response.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream", "Cache-Control": "no-store" });
      response.end(body);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    }
  });
  return new Promise((done) => server.listen(port, () => done(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = await startServer(process.argv[2], Number(process.env.PORT) || 8000);
  console.log(`Signals running at http://localhost:${server.address().port}`);
}
