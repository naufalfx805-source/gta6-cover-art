# gta6-cover-art

[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/naufalfx805-source/gta6-cover-art/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/naufalfx805-source/gta6-cover-art/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

A standalone offline web application that transforms user photos and custom captions into iconic GTA 6 multi-panel cover art featuring Vice City duotone color grading, authentic comic collage layouts, extruded 3D typography, and custom parody rating emblems.

## Quick Start

```sh
node serve.ts
```

Then open `http://localhost:8080` in your desktop web browser.

For automated testing or building the submission dossier:
```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Features

- **Multi-Panel Comic Layouts**:
  - `Vice Iconic (5 Panels)`: Asymmetrical collage with skyline, hero lead, action, and ocean panels.
  - `Leonida Grid (6 Panels)`: Dynamic 6-scene comic mosaic.
  - `Action Triptych (3 Panels)`: Three vertical action slashes.
  - `Grand Montage (8 Panels)`: Comprehensive classic GTA comic montage.
  - `Single Hero Poster (1 Panel)`: Clean full-bleed cinematic hero framing.
- **Vice City Color Grading Pipelines**:
  - `Vice Sunset`: Warm golden orange to electric magenta gradient overlay with comic shadow tone burns.
  - `Neon Heat`: Cyan and hot pink duotone styling.
  - `Golden Hour Florida`: Sunny amber and tropical tangerine glow.
  - `Synthwave 80s`: Deep retro purple and electric indigo palette.
  - `Gritty Crime Noir`: High-contrast desaturated noir shadows.
  - `Clean Original`: Natural photo reproduction with subtle contrast enhancement.
- **Iconic GTA Typography & Emblems**:
  - Multi-pass isometric extruded 3D drop shadows with thick outer strokes.
  - Sunset gold gradient fills and secondary story subtitle pill banners.
  - Top location and year stamp (`VICE CITY • 2026`).
  - Luminous Roman numeral `VI` backdrop watermark.
  - Corner emblems including `Parental Advisory Explicit Artwork`, `Special Agent Edition`, and `Vice City Star`.
- **Targeted Interactive Editing**:
  - Click any panel directly on the canvas to select and customize its individual photo.
  - Per-panel zoom and pan adjustments.
  - Global sliders for atmospheric vignette depth and comic divider border width.
- **Standard Export Ratios**:
  - Square 1:1 (`1080 x 1080`) — Social media & official box art.
  - Portrait 4:5 (`1080 x 1350`) — Vertical poster.
  - Landscape 16:9 (`1920 x 1080`) — Desktop wallpaper & banner.
- **100% Offline & Private**:
  - Zero external npm runtime dependencies or CDNs.
  - Fully client-side HTML5 Canvas 2D rendering.

---
Built for the [make.fun](https://make.fun/r/bnyprxqp) coding bounty.
