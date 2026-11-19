# Vice Cover Studio

**GTA 6-style cover art maker** — turn any photo into a multi-panel Vice City poster and export it as a PNG.

[![make.fun](https://make.fun/badge/entry)](https://make.fun/bounty/gta6-cover-art-01)
[![make.fun leaderboard](https://make.fun/badge/leaderboard/gta6-cover-art-01)](https://make.fun/bounty/gta6-cover-art-01/leaderboard)
[![make.fun competition](https://make.fun/badge/competition/gta6-cover-art-01)](https://make.fun/bounty/gta6-cover-art-01)

---

## What it does

Vice Cover Studio is a fully offline web app that:

- **Loads your photo** directly from disk — nothing is uploaded anywhere
- **Applies GTA-style color grades**: Vice City Sunset, Neon Night, Golden Hour, Noir
- **Arranges panels**: 5-panel hero, 3-panel triptych, 2-panel split, solo
- **Renders bold styled captions** with layered shadow and glow effects
- **Exports PNG** at 1080×1080 (square), 1080×1350 (portrait), 1920×1080 (landscape)

## Quick start

```bash
node serve.ts          # dev server on http://localhost:8080
```

Then open **http://localhost:8080** in Chrome.

1. Click **Upload Photo** and pick any image
2. Choose a **panel layout** (5-panel, triptych, split, solo)
3. Pick a **color grade** from the sidebar
4. Type your **caption** in the text box
5. Click **Export PNG** and choose your output size

## Project layout

```
app/
  index.html          entry point
  style.css           dark studio UI
  src/
    constants.js      layout presets, color grade defs, default state
    filters.js        canvas effects: duotone, vignette, film grain, glow
    cover.js          multi-panel canvas renderer + 3D caption lettering
    main.js           event wiring, file upload, export
    shots.js          automated screenshot helper (used by makefun record)
  samples/            two CC0 sample photos (pier, boulevard)
screenshots/          4 export screenshots for the bounty
vendor/               vendored make.fun library (unchanged)
main.ts               entry-point: copies app/ + screenshots/ and writes dossier.json
serve.ts              local dev server
shots.json            screenshot automation config
```

## Tips for best results

- Use a **high-contrast photo** — faces or silhouettes against a bright sky work best
- Try **Vice City Sunset** grade with the **5-Panel Hero** layout for the classic GTA look
- Keep captions **short and punchy** — 2–3 words hit hardest at large sizes
- Export **Square (1080×1080)** for Instagram posts, **Portrait (1080×1350)** for Stories

## License

MIT — see [LICENSE](LICENSE)
