// Vice Cover Studio — local dev server
// Serves app/ at http://localhost:8080 so you can open it in Chrome without CORS issues.
// Usage: node serve.ts [port]

import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const root = join(here, 'app');
const port = parseInt(process.argv[2] ?? '8080', 10);

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.ico':  'image/x-icon',
};

function serve(req: IncomingMessage, res: ServerResponse) {
  // Strip query string
  const url = (req.url ?? '/').split('?')[0];
  const safePath = url === '/' ? '/index.html' : url;
  const filePath = join(root, safePath);

  // Basic path traversal guard
  if (!filePath.startsWith(root)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // Try index.html fallback
    const indexFallback = join(root, 'index.html');
    if (existsSync(indexFallback)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      createReadStream(indexFallback).pipe(res);
    } else {
      res.writeHead(404); res.end('Not found: ' + safePath);
    }
    return;
  }

  const ext = extname(filePath).toLowerCase();
  const ct = MIME[ext] ?? 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': ct,
    'Content-Length': statSync(filePath).size,
    'Cache-Control': 'no-cache',
  });
  createReadStream(filePath).pipe(res);
}

const server = createServer(serve);
server.listen(port, () => {
  console.log(`[vice-cover-studio] dev server → http://localhost:${port}`);
  console.log('[vice-cover-studio] open http://localhost:' + port + ' in Chrome');
  console.log('[vice-cover-studio] Ctrl+C to stop');
});
