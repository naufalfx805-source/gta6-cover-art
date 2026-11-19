#!/usr/bin/env python3
"""Generate screenshots for Vice Cover Studio using Python Playwright + file:// protocol."""
import asyncio
import os
import json
from pathlib import Path
from playwright.async_api import async_playwright

HERE = Path(__file__).parent
APP_URL = f"file://{HERE}/app/index.html"
SHOTS_DIR = HERE / "screenshots"

SHOTS = [
    {"name": "1-cover.jpg",        "photo": "pier",      "caption": "Vice City Dreams",  "grade": "vice-sunset",  "layout": "five-panel", "w": 1080, "h": 1080},
    {"name": "2-editor.jpg",       "photo": "boulevard", "caption": "Neon Nights",        "grade": "vice-sunset",  "layout": "five-panel", "w": 1280, "h": 720},
    {"name": "3-cover-neon.jpg",   "photo": "pier",      "caption": "Neon Nights",        "grade": "neon-night",   "layout": "triptych",   "w": 1080, "h": 1080},
    {"name": "4-cover-golden.jpg", "photo": "boulevard", "caption": "Golden Heist",       "grade": "golden-hour",  "layout": "split",      "w": 1280, "h": 720},
]

RENDER_JS = """
async (shot) => {
  const { LAYOUTS, COLOR_GRADES, EXPORT_SIZES } = await import('./src/constants.js');
  const { renderCover } = await import('./src/cover.js');

  const canvas = document.getElementById('preview-canvas');
  canvas.width  = shot.w;
  canvas.height = shot.h;

  // Load sample photo
  const img = new Image();
  await new Promise((res, rej) => {
    img.onload  = res;
    img.onerror = res; // continue even if image fails
    img.src = `./samples/${shot.photo}.jpg`;
  });

  const state = {
    layout:     shot.layout,
    grade:      shot.grade,
    caption:    shot.caption,
    exportSize: 'square',
    photos:     [null, null, null, null, null],
    panZoom:    [{ox:0,oy:0,scale:1.1},{ox:0,oy:0,scale:1.1},{ox:0,oy:0,scale:1.1},{ox:0,oy:0,scale:1.1},{ox:0,oy:0,scale:1.1}],
  };

  renderCover(canvas, state, img.complete && img.naturalWidth ? [img] : []);
  document.documentElement.dataset.shotReady = '1';
  return 'ok';
}
"""

async def main():
    SHOTS_DIR.mkdir(exist_ok=True)

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(
            headless=True,
            args=["--no-sandbox", "--disable-web-security", "--allow-file-access-from-files"]
        )
        print("[screenshots] browser launched")

        for shot in SHOTS:
            page = await browser.new_page()
            await page.set_viewport_size({"width": shot["w"], "height": shot["h"]})
            print(f"[screenshots] rendering {shot['name']} at {shot['w']}x{shot['h']}...")

            await page.goto(APP_URL, wait_until="domcontentloaded")
            await asyncio.sleep(0.5)

            # Programmatically render via JS
            result = await page.evaluate(RENDER_JS, shot)
            await asyncio.sleep(0.3)

            # Capture just the canvas element
            canvas_el = await page.query_selector("#preview-canvas")
            if canvas_el:
                out_path = str(SHOTS_DIR / shot["name"])
                await canvas_el.screenshot(path=out_path, type="jpeg", quality=93)
                print(f"[screenshots] saved → screenshots/{shot['name']}")
            else:
                print(f"  [warn] canvas not found for {shot['name']}")

            await page.close()

        await browser.close()
    print("[screenshots] done — 4 screenshots saved")

if __name__ == "__main__":
    asyncio.run(main())
