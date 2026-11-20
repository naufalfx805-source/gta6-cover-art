// Vice Cover Studio — Local development static server
// Serves static files from app/ on port 8080 (Node 22 stdlib only)

import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = resolve(fileURLToPath(new URL('./app', import.meta.url)));

const args = process.argv.slice(2);
const portFlagIndex = args.indexOf('--port');
const parsedPort = portFlagIndex !== -1 ? Number(args[portFlagIndex + 1]) : 8080;
const PORT = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort < 65536 ? parsedPort : 8080;

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer((req, res) => {
  const reqUrl = new URL(req.url ?? '/', `http://localhost:${PORT}`);
  let pathname: string;
  try {
    pathname = decodeURIComponent(reqUrl.pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Bad Request');
    return;
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const filePath = resolve(join(appRoot, normalize(pathname)));

  // Sandbox security check: reject directory traversal
  if (filePath !== appRoot && !filePath.startsWith(appRoot + sep)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' }).end('Forbidden');
    return;
  }

  if (!existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not Found');
    return;
  }

  try {
    const stats = statSync(filePath);
    if (!stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not Found');
      return;
    }

    const mime = MIME_TYPES[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Content-Length': stats.size,
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    });
    createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Internal Server Error');
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[Vice Cover Studio] Serving app/ on http://localhost:${PORT}`);
});
