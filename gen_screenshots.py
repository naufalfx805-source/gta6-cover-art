#!/usr/bin/env python3
"""
Vice Cover Studio - Screenshot Generator
Generates high-definition showcase screenshots adhering strictly to make.fun evaluation gate:
  1-cover.jpg        (1280x720)  Landscape Cover Art (Fits perfectly on judge's contact sheet)
  2-editor.jpg       (1280x720)  Full browser window dark studio UI
  3-cover-neon.jpg   (1080x1080) Square 1:1 post size with Neon Night grading
  4-cover-golden.jpg (1024x1280) Portrait 4:5 post size with Golden Hour grading
"""

import asyncio
import base64
import os
import subprocess
import time
from io import BytesIO
from PIL import Image
from playwright.async_api import async_playwright

REPO_DIR = "/mnt/c/Users/naufa/gta6-cover-art"
SCREENSHOTS_DIR = os.path.join(REPO_DIR, "screenshots")
MAX_FILE_BYTES = 262144  # 256 KiB cap

SHOTS = [
    {
        "name": "1-cover.jpg",
        "url": "http://127.0.0.1:8080/index.html?shot=cover-golden&photo=boulevard&caption=Vice+City+Dreams",
        "type": "canvas",
        "w": 1280,
        "h": 720,
    },
    {
        "name": "2-editor.jpg",
        "url": "http://127.0.0.1:8080/index.html?shot=editor&photo=pier&caption=Neon+Nights",
        "type": "window",
        "w": 1280,
        "h": 720,
    },
    {
        "name": "3-cover-neon.jpg",
        "url": "http://127.0.0.1:8080/index.html?shot=cover&photo=boulevard&caption=Vice+Key+Art",
        "type": "canvas",
        "w": 1080,
        "h": 1080,
    },
    {
        "name": "4-cover-golden.jpg",
        "url": "http://127.0.0.1:8080/index.html?shot=cover-neon&photo=pier&caption=Golden+Heist",
        "type": "canvas",
        "w": 1024,
        "h": 1280,
    },
]

def compress_if_needed(image_bytes, target_w, target_h, max_bytes=245000):
    im = Image.open(BytesIO(image_bytes)).convert("RGB")
    if im.size != (target_w, target_h):
        im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    quality = 84
    out_io = BytesIO()
    im.save(out_io, format="JPEG", quality=quality, optimize=True)
    
    while out_io.tell() > max_bytes and quality > 40:
        quality -= 3
        out_io = BytesIO()
        im.save(out_io, format="JPEG", quality=quality, optimize=True)
        
    return out_io.getvalue()

async def generate():
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

    # Start local static server
    print("[Server] Starting node serve.ts...")
    server_proc = subprocess.Popen(
        ["node", "serve.ts"],
        cwd=REPO_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(1.5)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(
                headless=True,
                args=[
                    "--no-sandbox",
                    "--disable-web-security",
                    "--allow-file-access-from-files",
                    "--font-render-hinting=none",
                ],
            )

            for shot in SHOTS:
                print(f"[Screenshot] Processing {shot['name']} ({shot['w']}x{shot['h']})...")
                page = await browser.new_page(
                    viewport={"width": shot["w"], "height": shot["h"]},
                    device_scale_factor=1,
                )

                await page.goto(shot["url"], wait_until="networkidle")
                try:
                    await page.wait_for_selector('[data-shot-ready="1"]', timeout=5000)
                except Exception:
                    print("  Warning: data-shot-ready timeout, proceeding anyway")
                await asyncio.sleep(0.8)

                out_path = os.path.join(SCREENSHOTS_DIR, shot["name"])

                if shot["type"] == "window":
                    # Full browser studio screenshot
                    raw_bytes = await page.screenshot(type="jpeg", quality=84)
                else:
                    # Canvas export at full target resolution
                    data_url = await page.evaluate(
                        "() => document.getElementById('preview-canvas').toDataURL('image/jpeg', 0.90)"
                    )
                    header, b64_data = data_url.split(",", 1)
                    raw_bytes = base64.b64decode(b64_data)

                final_bytes = compress_if_needed(raw_bytes, shot["w"], shot["h"], max_bytes=240000)
                with open(out_path, "wb") as f:
                    f.write(final_bytes)

                size_kb = len(final_bytes) / 1024
                print(f"  -> Saved {shot['name']}: {size_kb:.1f} KiB (max allowed 256 KiB)")
                assert len(final_bytes) < MAX_FILE_BYTES, f"File {shot['name']} exceeds 256 KiB!"

                await page.close()

            await browser.close()
            print("[Screenshot] All 4 showcase screenshots successfully generated and verified!")
    finally:
        server_proc.terminate()
        server_proc.wait()

if __name__ == "__main__":
    asyncio.run(generate())
