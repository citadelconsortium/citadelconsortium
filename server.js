const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const publicDir = path.join(__dirname, "public");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requestedPath = decoded === "/" ? "/index.html" : decoded;
  const resolved = path.normalize(path.join(publicDir, requestedPath));

  if (!resolved.startsWith(publicDir)) {
    return path.join(publicDir, "index.html");
  }

  return resolved;
}

const server = http.createServer((request, response) => {
  const filePath = safePath(request.url || "/");

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(publicDir, "index.html"), (fallbackError, fallbackData) => {
        if (fallbackError) {
          response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          response.end("Site unavailable");
          return;
        }

        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(fallbackData);
      });
      return;
    }

    const ext = path.extname(filePath);
    response.writeHead(200, {
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });
    response.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Citadel Consortium site listening on port ${port}`);
});
