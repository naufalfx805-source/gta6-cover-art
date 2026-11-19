// Vice Cover Studio — GTA 6-style cover art maker
// make.fun competition: gta6-cover-art-01
// Builds the entry: copies app/ and screenshots/ to /output, writes dossier.json
//
// Usage:
//   node serve.ts              — local dev server on http://localhost:8080
//   MAKEFUN_OUTPUT_DIR=out node main.ts — build output for submission
//
// The app is entirely static files under app/: app/index.html opens in
// desktop Chrome and works with zero network requests. Photos are read on
// the user's machine via FileReader and never uploaded anywhere.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// --- helpers ---

function countFiles(dir: string): number {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    n++;
    if (ent.isDirectory()) n += countFiles(join(dir, ent.name));
  }
  return n;
}

function totalBytes(dir: string): number {
  if (!existsSync(dir)) return 0;
  let b = 0;
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) b += totalBytes(p);
    else b += statSync(p).size;
  }
  return b;
}

// --- build ---

console.log('[vice-cover-studio] building entry…');
mkdirSync(out, { recursive: true });

// Copy app/
const appSrc = join(here, 'app');
const appOut = join(out, 'app');
cpSync(appSrc, appOut, { recursive: true });
const appFiles = countFiles(appOut);
const appMB = (totalBytes(appOut) / 1_048_576).toFixed(2);
console.log(`[vice-cover-studio] app/  ${appFiles} files, ${appMB} MiB`);

// Copy screenshots/
const shotsSrc = join(here, 'screenshots');
const shotsOut = join(out, 'screenshots');
mkdirSync(shotsOut, { recursive: true });
if (existsSync(shotsSrc)) {
  cpSync(shotsSrc, shotsOut, { recursive: true });
  const shots = readdirSync(shotsOut);
  console.log(`[vice-cover-studio] screenshots/ ${shots.length} file(s): ${shots.join(', ')}`);
} else {
  console.warn('[vice-cover-studio] WARNING: screenshots/ not found — gate will reject the entry');
}

// Write dossier.json
const dossierPath = join(out, 'dossier.json');
writeFileSync(
  dossierPath,
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);
const dossierKB = (statSync(dossierPath).size / 1024).toFixed(0);
console.log(`[vice-cover-studio] dossier.json written (${dossierKB} KB)`);
console.log('[vice-cover-studio] done — output at', relative(here, out) || out);
