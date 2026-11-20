// Vice Cover Studio — Competition Entrypoint & Packager
// Hand-in script for make.fun gta6-cover-art-01 competition
// Node 22 stdlib only
// Build timestamp: 2026-11-20T17:15:00Z

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

console.log('========================================================');
console.log(' VICE COVER STUDIO — GRAND THEFT AUTO VI ART MAKER');
console.log(' make.fun Bounty Submission Packager');
console.log('========================================================');
console.log('[Vice Cover Studio] Packaging entry for grader evaluation...');
console.log(`[Vice Cover Studio] Source directory: ${here}`);
console.log(`[Vice Cover Studio] Output target: ${out}`);

// Ensure destination directories exist
mkdirSync(out, { recursive: true });

// Copy app/ directory containing static offline web app
const appSource = join(here, 'app');
const appDest = join(out, 'app');
if (existsSync(appSource)) {
  mkdirSync(appDest, { recursive: true });
  cpSync(appSource, appDest, { recursive: true });
  const appFiles = readdirSync(appDest, { recursive: true });
  console.log(`[Vice Cover Studio] Copied ${appFiles.length} files from app/ to destination.`);
} else {
  console.error('[Vice Cover Studio] Warning: app/ directory not found!');
}

// Copy screenshots/ directory
const shotsSource = join(here, 'screenshots');
const shotsDest = join(out, 'screenshots');
mkdirSync(shotsDest, { recursive: true });

if (existsSync(shotsSource)) {
  cpSync(shotsSource, shotsDest, { recursive: true });
  const shotFiles = readdirSync(shotsDest).filter(f => !f.startsWith('.'));
  console.log(`[Vice Cover Studio] Copied ${shotFiles.length} screenshots: ${shotFiles.join(', ')}`);
} else {
  console.warn('[Vice Cover Studio] Notice: screenshots/ directory not found, created empty folder.');
}

// Write the grader dossier using make.fun vendor tool
const dossierPath = join(out, 'dossier.json');
const dossierData = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});

writeFileSync(dossierPath, dossierData);
console.log(`[Vice Cover Studio] Dossier written successfully to ${dossierPath}`);
console.log(`[Vice Cover Studio] Dossier size: ${Buffer.byteLength(dossierData, 'utf8')} bytes`);
