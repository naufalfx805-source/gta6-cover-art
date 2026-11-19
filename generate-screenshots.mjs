// generate-screenshots.mjs — take cover art screenshots with Playwright
// Starts the dev server, opens the app in headless Chrome, renders each shot.
// Usage: node generate-screenshots.mjs

import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, existsSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 8191;
const BASE = `http://localhost:${PORT}`;

const SHOTS = [
  { name: '1-cover.jpg',        query: '?shot=cover&photo=pier&caption=Vice+City+Dreams',       w: 1080, h: 1080 },
  { name: '2-editor.jpg',       query: '?shot=editor&photo=boulevard&caption=Neon+Nights',      w: 1280, h: 720  },
  { name: '3-cover-neon.jpg',   query: '?shot=cover-neon&photo=pier&caption=Neon+Nights',       w: 1080, h: 1080 },
  { name: '4-cover-golden.jpg', query: '?shot=cover-golden&photo=boulevard&caption=Golden+Heist', w: 1280, h: 720 },
];

async function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // Start dev server
  console.log(`[screenshots] starting dev server on port ${PORT}…`);
  const server = spawn('node', [join(here, 'serve.ts'), String(PORT)], {
    cwd: here,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  server.stdout.on('data', d => process.stdout.write('[server] ' + d));
  server.stderr.on('data', d => process.stderr.write('[server] ' + d));

  await wait(1500); // give server time to bind

  mkdirSync(join(here, 'screenshots'), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  console.log('[screenshots] browser launched');

  for (const shot of SHOTS) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: shot.w, height: shot.h });
    const url = BASE + '/' + shot.query;
    console.log(`[screenshots] rendering ${shot.name} at ${shot.w}x${shot.h}…`);
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for shot-ready signal from app
    await page.waitForFunction(
      () => document.documentElement.dataset.shotReady === '1',
      { timeout: 8000 }
    ).catch(() => console.warn('  shot-ready timeout — capturing anyway'));

    await wait(600);

    const outPath = join(here, 'screenshots', shot.name);
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 92 });
    console.log(`[screenshots] saved → screenshots/${shot.name}`);
    await page.close();
  }

  await browser.close();
  server.kill();
  console.log('[screenshots] done — 4 screenshots saved');
}

main().catch(err => { console.error(err); process.exit(1); });
