# Vice Cover Studio — GTA 6 Cover Art Creator

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/naufalfx805-source/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/naufalfx805-source/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

**Vice Cover Studio** is an authentic Grand Theft Auto VI box art generator and interactive creative studio. It transforms any user photo or built-in sample into a high-octane, multi-panel comic book style video game cover complete with heavy extruded typography, silhouette art overlays, procedural color grading, and authentic retail billing blocks.

---

## Key Features

- **Iconic Multi-Panel Layouts**:
  - `Five Panel`: Classic hero panel on the left with 4 dynamic stacked comic panels on the right.
  - `Classic Six`: Iconic 2x3 box art grid seen on legendary GTA titles.
  - `Triptych`: Dramatic three vertical panel slice with diagonal comic cuts.
  - `Split View`: Dual-character tension split.
  - `Solo Hero`: Clean full-bleed cinematic hero view with stylized borders.
- **GTA Art Aesthetic**:
  - Thick 8px-10px solid black comic borders with clean diagonal panel separations.
  - Procedural vector silhouettes: swaying Miami palm trees, police surveillance helicopters in the sky panel.
  - Two-tier 3D extruded typography: cream-to-gold gradient with multi-pass drop shadow, neon outer glow, and wide-tracked subtitles.
  - Authentic retail billing block: ESRB "M - Mature 17+" rating badge, Dolby Atmos sound badge, authentic product barcode, and studio copyright line.
- **Cinematic Color Grading**:
  - `Vice Sunset`: Hot magenta (#c0188c) to amber orange (#ff7a00) high-contrast punch.
  - `Neon Night`: Electric cyan (#00ffe4) to deep midnight indigo (#1a0066).
  - `Golden Hour`: Warm sun-bleached gold (#ffb700) to crimson flare (#e63946).
  - `Vice Noir`: High-contrast graphic novel monochrome ink.
- **Pro Studio Adjustments**:
  - Real-time sliders for vignette darkening, analog film grain, and contrast boost.
  - Interactive pan, zoom, and fit controls for custom photo uploads.
  - Studio keyboard shortcuts: `Ctrl+Enter` to export, `[` and `]` to cycle sample backdrops, `1-5` to toggle comic layouts instantly.
- **Multi-Format Export**:
  - Square `1080x1080` (Instagram / Album art / Box front)
  - Portrait `1024x1280` (Social feed / Poster)
  - Landscape `1280x720` (Wallpaper / Showcase cover)

---

## GTA Cover Art Design Principles & Pro Tips

1. **High Contrast Comic Panels**:
   Authentic GTA box art uses bold, solid black borders (8-10px) to divide contrasting storytelling moments. Keep hero characters on the left or center and environmental action shots in complementary panes.
2. **Two-Tier Title Hierarchy**:
   The primary title uses heavy block typography with a rich warm cream-to-gold front face gradient, black outlines, and multi-layered extruded drop shadows. Subtitles should be tracked wide with clean uppercase lettering.
3. **Atmospheric Silhouette Overlays**:
   Vector palm fronds and surveillance helicopters placed against bright sunset gradients evoke the classic Miami Vice aesthetic.
4. **Authentic Retail Billing**:
   Every genuine retail cover features an ESRB "M - Mature" rating badge on the bottom-left and studio audio specifications + barcodes on the bottom-right.

---

## Quick Start

Serve the studio locally with Node 22+ (zero external dependencies):

```bash
node serve.ts
```

Then navigate to `http://localhost:8080` in any modern web browser.

### Generate Dossier & Package

Outside the make.fun grader container:

```bash
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Verify that `out/dossier.json` and screenshot assets are generated.
