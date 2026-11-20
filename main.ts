// Vice Cover Studio - Entrypoint & Dossier Generator
// ==============================================================================
// Makefun Bounty: gta6-cover-art-01
// Build System: Autonomous Makefun Agent
// Generation Timestamp: 2026-11-20T09:30:00Z
// ==============================================================================
// Hands in the offline web application and screenshots for make.fun grading

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

console.log('╔════════════════════════════════════════════════════════════════════╗');
console.log('║               VICE COVER STUDIO - DOSSIER BUILDER                  ║');
console.log('╚════════════════════════════════════════════════════════════════════╝');
console.log(`[Vice Cover Studio] Starting submission bundle generation...`);
console.log(`[Vice Cover Studio] Source directory: ${here}`);
console.log(`[Vice Cover Studio] Output target: ${out}`);

// Ensure destination directories exist
mkdirSync(out, { recursive: true });

// Verify and copy app/
const appSource = join(here, 'app');
if (!existsSync(appSource)) {
  console.error('[Vice Cover Studio] CRITICAL: app/ directory missing!');
  process.exit(1);
}

const outApp = join(out, 'app');
mkdirSync(outApp, { recursive: true });
cpSync(appSource, outApp, { recursive: true });

const countFiles = (dir: string): number => {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countFiles(full);
    } else if (entry.isFile()) {
      count++;
    }
  }
  return count;
};

const appFileCount = countFiles(outApp);
console.log(`[Vice Cover Studio] Copied ${appFileCount} app files to ${outApp}`);

// Verify and copy screenshots/
const shotsSource = join(here, 'screenshots');
const outShots = join(out, 'screenshots');
mkdirSync(outShots, { recursive: true });

if (existsSync(shotsSource)) {
  cpSync(shotsSource, outShots, { recursive: true });
  const shotFiles = readdirSync(outShots).filter(f => /\.(jpe?g|png)$/i.test(f));
  console.log(`[Vice Cover Studio] Copied ${shotFiles.length} screenshots: ${shotFiles.join(', ')}`);
} else {
  console.warn('[Vice Cover Studio] Warning: screenshots/ directory not found locally');
}

// Build dossier with strict gate caps
console.log('[Vice Cover Studio] Generating dossier summary...');
const dossierContent = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});

const dossierPath = join(out, 'dossier.json');
writeFileSync(dossierPath, dossierContent);

const dossierSize = statSync(dossierPath).size;
console.log(`[Vice Cover Studio] Dossier created successfully (${dossierSize} bytes) at ${dossierPath}`);
console.log('[Vice Cover Studio] Ready for evaluation.');
