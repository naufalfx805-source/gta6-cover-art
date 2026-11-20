# Vice Cover Studio — Screenshot Generator
# Generates all required screenshots using headless Chromium

import json
import os
import sys
from playwright.sync_api import sync_playwright

REPO_DIR = '/mnt/c/Users/naufa/gta6-cover-art'
APP_HTML = f'file://{REPO_DIR}/app/index.html'
SHOTS_FILE = os.path.join(REPO_DIR, 'shots.json')
SHOTS_DIR = os.path.join(REPO_DIR, 'screenshots')

os.makedirs(SHOTS_DIR, exist_ok=True)

with open(SHOTS_FILE, 'r') as f:
    shots = json.load(f)

print(f'[Screenshot Gen] Generating {len(shots)} screenshots...')

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
        target_path = os.path.join(SHOTS_DIR, name)
        target_url = f'{APP_HTML}{query}'

        print(f'[Screenshot Gen] Capturing {name} ({w}x{h}) from {query}...')
        context = browser.new_context(
            viewport={'width': w, 'height': h},
            device_scale_factor=1
        )
        page = context.new_page()
        page.goto(target_url, wait_until='networkidle')

        try:
            page.wait_for_selector('html[data-shot-ready="1"]', timeout=8000)
        except Exception as e:
            print(f'[Screenshot Gen] Note: wait_for_selector timed out for {name}, sleeping 1.5s...')
            page.wait_for_timeout(1500)

        # Quality 82 keeps visual fidelity sharp while staying well below the 256 KiB limit
        page.screenshot(path=target_path, type='jpeg', quality=82)
        context.close()

        file_size = os.path.getsize(target_path)
        print(f'[Screenshot Gen] -> {name}: {file_size} bytes ({file_size / 1024:.1f} KiB)')

        if file_size > 262144:
            raise ValueError(f'Screenshot {name} exceeded 256 KiB gate limit! Size: {file_size} bytes')

    browser.close()

print('[Screenshot Gen] All screenshots generated and validated successfully!')
