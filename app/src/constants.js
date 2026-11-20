// Vice Cover Studio - Constants and Configurations

export const LAYOUTS = {
  'five-panel': {
    label: '5-Panel Hero',
    description: 'Iconic GTA hero cover: 1 massive feature shot + 4 stacked scene panels',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.58, h: 1.0, name: 'Main Hero' },
      { id: 1, x: 0.58, y: 0, w: 0.42, h: 0.25, name: 'Top Right' },
      { id: 2, x: 0.58, y: 0.25, w: 0.42, h: 0.25, name: 'Upper Mid Right' },
      { id: 3, x: 0.58, y: 0.50, w: 0.42, h: 0.25, name: 'Lower Mid Right' },
      { id: 4, x: 0.58, y: 0.75, w: 0.42, h: 0.25, name: 'Bottom Right' }
    ]
  },
  'triptych': {
    label: '3-Panel Triptych',
    description: 'Triple vertical comic strip layout with balanced focus',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.3333, h: 1.0, name: 'Left Panel' },
      { id: 1, x: 0.3333, y: 0, w: 0.3334, h: 1.0, name: 'Center Panel' },
      { id: 2, x: 0.6667, y: 0, w: 0.3333, h: 1.0, name: 'Right Panel' }
    ]
  },
  'split': {
    label: '2-Panel Split',
    description: 'Duo dual-character confrontation split screen',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.5, h: 1.0, name: 'Left Side' },
      { id: 1, x: 0.5, y: 0, w: 0.5, h: 1.0, name: 'Right Side' }
    ]
  },
  'solo': {
    label: 'Solo Showcase',
    description: 'Single full-bleed dramatic cinematic cover',
    panels: [
      { id: 0, x: 0, y: 0, w: 1.0, h: 1.0, name: 'Full Cover' }
    ]
  }
};

export const COLOR_GRADES = {
  'vice-sunset': {
    label: 'Vice Sunset',
    primary: '#ff007f',
    secondary: '#00f0ff',
    accent: '#ffaa00',
    cssFilter: 'contrast(1.18) saturate(1.35) brightness(1.02)',
    vignette: 0.42,
    grain: 0.12,
    stops: [
      { offset: 0.0, color: 'rgba(255, 0, 127, 0.26)' },
      { offset: 0.55, color: 'rgba(255, 120, 0, 0.16)' },
      { offset: 1.0, color: 'rgba(0, 240, 255, 0.22)' }
    ]
  },
  'neon-night': {
    label: 'Neon Night',
    primary: '#00f0ff',
    secondary: '#b800ff',
    accent: '#ff007f',
    cssFilter: 'contrast(1.28) saturate(1.4) brightness(0.92)',
    vignette: 0.50,
    grain: 0.16,
    stops: [
      { offset: 0.0, color: 'rgba(0, 240, 255, 0.25)' },
      { offset: 0.5, color: 'rgba(184, 0, 255, 0.22)' },
      { offset: 1.0, color: 'rgba(10, 14, 38, 0.45)' }
    ]
  },
  'golden-hour': {
    label: 'Golden Hour',
    primary: '#ffaa00',
    secondary: '#ff3366',
    accent: '#ffe066',
    cssFilter: 'contrast(1.12) saturate(1.38) brightness(1.06) sepia(0.20)',
    vignette: 0.38,
    grain: 0.10,
    stops: [
      { offset: 0.0, color: 'rgba(255, 170, 0, 0.30)' },
      { offset: 0.65, color: 'rgba(255, 60, 100, 0.18)' },
      { offset: 1.0, color: 'rgba(60, 20, 10, 0.35)' }
    ]
  },
  'noir': {
    label: 'Vice Noir',
    primary: '#ffffff',
    secondary: '#ff0055',
    accent: '#999999',
    cssFilter: 'grayscale(1) contrast(1.45) brightness(0.95)',
    vignette: 0.62,
    grain: 0.20,
    stops: [
      { offset: 0.0, color: 'rgba(255, 0, 85, 0.18)' },
      { offset: 0.7, color: 'rgba(0, 0, 0, 0.25)' },
      { offset: 1.0, color: 'rgba(0, 0, 0, 0.60)' }
    ]
  }
};

export const EXPORT_SIZES = {
  'square': { label: 'Square (1080x1080)', width: 1080, height: 1080 },
  'portrait': { label: 'Portrait (1080x1350)', width: 1080, height: 1350 },
  'landscape': { label: 'Landscape (1920x1080)', width: 1920, height: 1080 }
};

export const DEFAULT_STATE = {
  layout: 'five-panel',
  grade: 'vice-sunset',
  caption: 'VICE CITY DREAMS',
  subcaption: 'COMING SOON',
  exportSize: 'square',
  photos: {
    0: 'samples/pier.jpg',
    1: 'samples/boulevard.jpg',
    2: 'samples/pier.jpg',
    3: 'samples/boulevard.jpg',
    4: 'samples/pier.jpg'
  },
  panZoom: {
    0: { zoom: 1, panX: 0, panY: 0 },
    1: { zoom: 1, panX: 0, panY: 0 },
    2: { zoom: 1, panX: 0, panY: 0 },
    3: { zoom: 1, panX: 0, panY: 0 },
    4: { zoom: 1, panX: 0, panY: 0 }
  },
  borderWidth: 6,
  borderColor: '#0a0a0f',
  grainAmount: 0.12,
  vignetteAmount: 0.42
};
