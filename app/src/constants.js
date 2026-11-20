// Vice Cover Studio - Constants & Configuration
// Core definitions for layouts, color presets, dimensions, and initial studio state

export const LAYOUTS = {
  'five-panel': {
    name: 'Five Panel (GTA Classic)',
    description: 'Iconic hero on the left with 4 stacked comic panels on the right',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.52, h: 1.0, role: 'hero' },
      { id: 1, x: 0.52, y: 0, w: 0.48, h: 0.28, role: 'sky-chopper' },
      { id: 2, x: 0.52, y: 0.28, w: 0.48, h: 0.24, role: 'action' },
      { id: 3, x: 0.52, y: 0.52, w: 0.48, h: 0.24, role: 'character' },
      { id: 4, x: 0.52, y: 0.76, w: 0.48, h: 0.24, role: 'palms-sunset' },
    ],
  },
  'classic-six': {
    name: 'Classic Six (Box Art)',
    description: 'Authentic 2x3 box art grid seen on legendary GTA titles',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.5, h: 0.333, role: 'chopper' },
      { id: 1, x: 0.5, y: 0, w: 0.5, h: 0.333, role: 'sky' },
      { id: 2, x: 0, y: 0.333, w: 0.5, h: 0.334, role: 'hero-face' },
      { id: 3, x: 0.5, y: 0.333, w: 0.5, h: 0.334, role: 'muscle-car' },
      { id: 4, x: 0, y: 0.667, w: 0.5, h: 0.333, role: 'neon-city' },
      { id: 5, x: 0.5, y: 0.667, w: 0.5, h: 0.333, role: 'sunset-palms' },
    ],
  },
  'triptych': {
    name: 'Triptych (Three Panels)',
    description: 'Dynamic three vertical slices with high visual tension',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.333, h: 1.0, role: 'left-flank' },
      { id: 1, x: 0.333, y: 0, w: 0.334, h: 1.0, role: 'center-hero' },
      { id: 2, x: 0.667, y: 0, w: 0.333, h: 1.0, role: 'right-flank' },
    ],
  },
  'split': {
    name: 'Split Duo',
    description: 'Two split vertical panels for dual protagonists',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.5, h: 1.0, role: 'left-duo' },
      { id: 1, x: 0.5, y: 0, w: 0.5, h: 1.0, role: 'right-duo' },
    ],
  },
  'solo': {
    name: 'Solo Hero (Full Bleed)',
    description: 'Single full-bleed cinematic hero portrait with styled borders',
    panels: [
      { id: 0, x: 0, y: 0, w: 1.0, h: 1.0, role: 'solo-hero' },
    ],
  },
};

export const COLOR_GRADES = {
  'vice-sunset': {
    name: 'Vice Sunset',
    primary: '#c0188c',
    secondary: '#ff7a00',
    accent: '#ffe600',
    gradient: 'linear-gradient(135deg, #c0188c, #ff7a00)',
    blendMode: 'overlay',
    contrast: 1.25,
    saturation: 1.45,
    brightness: 1.04,
  },
  'neon-night': {
    name: 'Neon Night',
    primary: '#00ffe4',
    secondary: '#1a0066',
    accent: '#ff0077',
    gradient: 'linear-gradient(135deg, #00ffe4, #1a0066)',
    blendMode: 'color-dodge',
    contrast: 1.35,
    saturation: 1.4,
    brightness: 0.96,
  },
  'golden-hour': {
    name: 'Golden Hour',
    primary: '#ffb700',
    secondary: '#e63946',
    accent: '#fff3b0',
    gradient: 'linear-gradient(135deg, #ffb700, #e63946)',
    blendMode: 'soft-light',
    contrast: 1.2,
    saturation: 1.35,
    brightness: 1.1,
  },
  'vice-noir': {
    name: 'Vice Noir',
    primary: '#111111',
    secondary: '#f0f0f0',
    accent: '#e63946',
    gradient: 'linear-gradient(135deg, #222222, #dddddd)',
    blendMode: 'luminosity',
    contrast: 1.5,
    saturation: 0.05,
    brightness: 1.0,
  },
};

export const EXPORT_SIZES = {
  square: {
    name: 'Square Cover',
    w: 1080,
    h: 1080,
    aspect: '1:1',
    label: '1080 × 1080',
  },
  portrait: {
    name: 'Portrait Poster',
    w: 1024,
    h: 1280,
    aspect: '4:5',
    label: '1024 × 1280',
  },
  landscape: {
    name: 'Widescreen Cover',
    w: 1280,
    h: 720,
    aspect: '16:9',
    label: '1280 × 720',
  },
};

export const SAMPLES = [
  { id: 'pier', name: 'Vice City Pier', src: 'samples/pier.jpg' },
  { id: 'boulevard', name: 'Ocean Boulevard', src: 'samples/boulevard.jpg' },
];

export const DEFAULT_STATE = {
  layout: 'five-panel',
  grade: 'vice-sunset',
  caption: 'VICE DREAMS',
  subtitle: 'A VICE CITY TALE',
  exportSize: 'square',
  vignette: 0.35,
  grain: 0.12,
  contrast: 1.2,
  sampleId: 'pier',
  photos: {
    0: 'samples/pier.jpg',
    1: 'samples/boulevard.jpg',
    2: 'samples/pier.jpg',
    3: 'samples/boulevard.jpg',
    4: 'samples/pier.jpg',
    5: 'samples/boulevard.jpg',
  },
  userPhotos: {},
};
