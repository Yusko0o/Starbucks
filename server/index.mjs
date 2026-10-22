import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { handleApi } from "./api.mjs";
import { openDatabase } from "./database.mjs";
const db = openDatabase();
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const root = path.resolve("public");
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
};
const server = http.createServer(async (req, res) => {
  try {
    const origin =
      process.env.PUBLIC_ORIGIN ||
      `http://${req.headers.host || "localhost:" + port}`;
    const url = new URL(req.url, origin);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cloudassets.starbucks.com https://www.starbucks.ch; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
    );
    if (url.pathname.startsWith("/api/")) {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 16000) {
          res.writeHead(413);
          return res.end('{"error":"Requête trop volumineuse."}');
        }
        chunks.push(chunk);
      }
      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (value)
          headers.set(key, Array.isArray(value) ? value.join(";") : value);
      }
      headers.set("cf-connecting-ip", req.socket.remoteAddress || "local");
      const request = new Request(url, {
        method: req.method,
        headers,
        ...(!["GET", "HEAD"].includes(req.method)
          ? { body: Buffer.concat(chunks) }
          : {}),
      });
      const response = await handleApi(request, db);
      res.writeHead(response.status, Object.fromEntries(response.headers));
      return res.end(Buffer.from(await response.arrayBuffer()));
    }
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405);
      return res.end();
    }
    const filename = path.resolve(root, "." + decodeURIComponent(url.pathname));
    if (!filename.startsWith(root + path.sep) && filename !== root) {
      res.writeHead(403);
      return res.end();
    }
    let file = filename;
    try {
      if (!(await stat(file)).isFile()) file = path.join(root, "index.html");
    } catch {
      if (path.extname(file)) {
        res.writeHead(404);
        return res.end();
      }
      file = path.join(root, "index.html");
    }
    const content = await readFile(file);
    res.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    res.end(req.method === "HEAD" ? undefined : content);
  } catch (e) {
    console.error(e.message);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Service indisponible.");
  }
});
server.listen(port, host, () =>
  console.log(
    `Starbucks portfolio · Node.js + SQLite\nLocal: http://${host}:${port}`,
  ),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    }),
  );
