// constants.js — layout presets, color-grade definitions, default app state
// Vice Cover Studio | make.fun gta6-cover-art-01

// ---------------------------------------------------------------------------
// Panel layout presets
// Each layout is an array of cells; each cell is { x, y, w, h } in 0-1 space
// (fractions of the canvas). The renderer scales to any output resolution.
// ---------------------------------------------------------------------------

export const LAYOUTS = {
  /** Hero layout: large main panel left + 4 stacked panels right */
  'five-panel': {
    label: '5-Panel Hero',
    cells: [
      { x: 0,     y: 0,    w: 0.62,  h: 1    },   // main hero
      { x: 0.62,  y: 0,    w: 0.38,  h: 0.26 },   // top-right 1
      { x: 0.62,  y: 0.26, w: 0.38,  h: 0.26 },   // top-right 2
      { x: 0.62,  y: 0.52, w: 0.38,  h: 0.26 },   // top-right 3
      { x: 0.62,  y: 0.78, w: 0.38,  h: 0.22 },   // bottom-right
    ],
  },

  /** Classic film triptych: three equal vertical panels */
  'triptych': {
    label: 'Triptych',
    cells: [
      { x: 0,     y: 0, w: 0.333, h: 1 },
      { x: 0.333, y: 0, w: 0.334, h: 1 },
      { x: 0.667, y: 0, w: 0.333, h: 1 },
    ],
  },

  /** Two-panel horizontal split with thin divider gap */
  'split': {
    label: '2-Panel Split',
    cells: [
      { x: 0,     y: 0, w: 0.495, h: 1 },
      { x: 0.505, y: 0, w: 0.495, h: 1 },
    ],
  },

  /** Full-bleed single photo */
  'solo': {
    label: 'Solo',
    cells: [
      { x: 0, y: 0, w: 1, h: 1 },
    ],
  },
};

// ---------------------------------------------------------------------------
// Color grade presets
// Applied as: gradient overlay + brightness/saturation/contrast adjustments
// ---------------------------------------------------------------------------

export const COLOR_GRADES = {
  'vice-sunset': {
    label: 'Vice City Sunset',
    gradientTop:    '#c0188c',
    gradientBottom: '#ff7a00',
    gradientAlpha:  0.42,
    brightness:     1.08,
    saturation:     1.35,
    contrast:       1.12,
    vignette:       0.52,
    grain:          0.04,
  },
  'neon-night': {
    label: 'Neon Night',
    gradientTop:    '#1a0066',
    gradientBottom: '#00ffe4',
    gradientAlpha:  0.50,
    brightness:     0.92,
    saturation:     1.60,
    contrast:       1.20,
    vignette:       0.70,
    grain:          0.06,
  },
  'golden-hour': {
    label: 'Golden Hour',
    gradientTop:    '#ff9f00',
    gradientBottom: '#ff4500',
    gradientAlpha:  0.38,
    brightness:     1.12,
    saturation:     1.20,
    contrast:       1.08,
    vignette:       0.40,
    grain:          0.03,
  },
  'noir': {
    label: 'Noir',
    gradientTop:    '#1a1a2e',
    gradientBottom: '#16213e',
    gradientAlpha:  0.55,
    brightness:     0.88,
    saturation:     0.20,
    contrast:       1.35,
    vignette:       0.75,
    grain:          0.08,
  },
};

// ---------------------------------------------------------------------------
// Export sizes (pixels)
// ---------------------------------------------------------------------------

export const EXPORT_SIZES = {
  'square':    { w: 1080, h: 1080,  label: '1080 × 1080  (Square)'   },
  'portrait':  { w: 1080, h: 1350,  label: '1080 × 1350  (Portrait)' },
  'landscape': { w: 1920, h: 1080,  label: '1920 × 1080  (Landscape)'},
};

// ---------------------------------------------------------------------------
// Default application state
// ---------------------------------------------------------------------------

export const DEFAULT_STATE = {
  layout:     'five-panel',
  grade:      'vice-sunset',
  caption:    'Vice City Dreams',
  exportSize: 'square',
  photos:     [null, null, null, null, null],
  panZoom: [
    { ox: 0, oy: 0, scale: 1.1 },
    { ox: 0, oy: 0, scale: 1.1 },
    { ox: 0, oy: 0, scale: 1.1 },
    { ox: 0, oy: 0, scale: 1.1 },
    { ox: 0, oy: 0, scale: 1.1 },
  ],
};
