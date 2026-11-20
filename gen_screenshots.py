#!/usr/bin/env python3
import json
import os
import sys
import time
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

REPO_DIR = '/mnt/c/Users/naufa/gta6-cover-art'
APP_DIR = os.path.join(REPO_DIR, 'app')
SHOTS_FILE = os.path.join(REPO_DIR, 'shots.json')
SCREENSHOTS_DIR = os.path.join(REPO_DIR, 'screenshots')
PORT = 8765

class CustomHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=APP_DIR, **kwargs)

    def log_message(self, format, *args):
        pass  # Quiet logging

def start_server():
    server = HTTPServer(('127.0.0.1', PORT), CustomHandler)
    server.serve_forever()

def main():
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

    # Start local HTTP server in background thread
    t = threading.Thread(target=start_server, daemon=True)
    t.start()
    time.sleep(0.5)

    with open(SHOTS_FILE, 'r') as f:
        shots = json.load(f)

    print(f"[Screenshot Generator] Loaded {len(shots)} shots from {SHOTS_FILE}")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-web-security',
                '--allow-file-access-from-files',
                '--disable-gpu',
            ]
        )

        for shot in shots:
            name = shot['name']
            query = shot['query']
            w = shot['w']
            h = shot['h']
            out_path = os.path.join(SCREENSHOTS_DIR, name)

            url = f"http://127.0.0.1:{PORT}/index.html{query}"
            print(f"[Screenshot Generator] Capturing {name} ({w}x{h}) from {url}...")

            context = browser.new_context(viewport={'width': w, 'height': h}, device_scale_factor=1)
            page = context.new_page()

            page.goto(url, wait_until='networkidle')

            # Wait for shotReady signal
            try:
                page.wait_for_function(
                    "() => window.__shotReady === true || document.documentElement.dataset.shotReady === '1'",
                    timeout=5000
                )
            except Exception as e:
                print(f"[Screenshot Generator] Warning: wait_for_function timed out for {name}, continuing...")

            time.sleep(0.3)

            # Capture JPEG
            page.screenshot(path=out_path, type='jpeg', quality=85)
            file_size = os.path.getsize(out_path)
            print(f"[Screenshot Generator] Saved {name} ({file_size} bytes, {file_size / 1024:.1f} KiB)")

            context.close()

        browser.close()

    print("[Screenshot Generator] All screenshots successfully generated!")

if __name__ == '__main__':
    main()
