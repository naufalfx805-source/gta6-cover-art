// Vice Cover Studio — Constants and Presets

export const LAYOUTS = {
  'five-panel': {
    name: '5-Panel Hero',
    description: 'Iconic GTA hero panel on left with 4 stacked scene panels',
    cells: [
      { id: 0, label: 'Hero',   x: 0,    y: 0,    w: 0.54, h: 1.0 },
      { id: 1, label: 'Panel 1', x: 0.54, y: 0,    w: 0.46, h: 0.25 },
      { id: 2, label: 'Panel 2', x: 0.54, y: 0.25, w: 0.46, h: 0.25 },
      { id: 3, label: 'Panel 3', x: 0.54, y: 0.50, w: 0.46, h: 0.25 },
      { id: 4, label: 'Panel 4', x: 0.54, y: 0.75, w: 0.46, h: 0.25 }
    ]
  },
  'triptych': {
    name: '3-Panel Triptych',
    description: 'Triple vertical showcase panels',
    cells: [
      { id: 0, label: 'Left',   x: 0,       y: 0, w: 0.3333, h: 1.0 },
      { id: 1, label: 'Center', x: 0.3333,  y: 0, w: 0.3334, h: 1.0 },
      { id: 2, label: 'Right',  x: 0.6667,  y: 0, w: 0.3333, h: 1.0 }
    ]
  },
  'split': {
    name: '2-Panel Split',
    description: 'Duo dual-protagonist split panels',
    cells: [
      { id: 0, label: 'Left',  x: 0,   y: 0, w: 0.5, h: 1.0 },
      { id: 1, label: 'Right', x: 0.5, y: 0, w: 0.5, h: 1.0 }
    ]
  },
  'solo': {
    name: 'Solo Cover',
    description: 'Full single focal hero cover',
    cells: [
      { id: 0, label: 'Solo', x: 0, y: 0, w: 1.0, h: 1.0 }
    ]
  }
};

export const COLOR_GRADES = {
  'vice-sunset': {
    name: 'Vice Sunset',
    description: 'Neon magenta and warm golden sun blend',
    primary: '#ff2d75',
    secondary: '#ffb300',
    cssFilter: 'contrast(1.18) saturate(1.45) brightness(1.05) hue-rotate(-5deg)',
    gradientStops: [
      { offset: 0.0, color: 'rgba(235, 30, 115, 0.42)' },
      { offset: 0.5, color: 'rgba(142, 36, 170, 0.25)' },
      { offset: 1.0, color: 'rgba(255, 160, 0, 0.38)' }
    ],
    vignetteColor: 'rgba(15, 4, 30, 0.65)'
  },
  'neon-night': {
    name: 'Neon Night',
    description: 'Cyberpunk turquoise, violet and hot pink',
    primary: '#00f2fe',
    secondary: '#fe0979',
    cssFilter: 'contrast(1.25) saturate(1.55) brightness(0.98) hue-rotate(15deg)',
    gradientStops: [
      { offset: 0.0, color: 'rgba(10, 5, 30, 0.5)' },
      { offset: 0.5, color: 'rgba(254, 9, 121, 0.28)' },
      { offset: 1.0, color: 'rgba(0, 242, 254, 0.35)' }
    ],
    vignetteColor: 'rgba(4, 2, 18, 0.75)'
  },
  'golden-hour': {
    name: 'Golden Hour',
    description: 'Warm Florida sun with amber glow',
    primary: '#ffb300',
    secondary: '#d35400',
    cssFilter: 'contrast(1.12) saturate(1.35) brightness(1.08) sepia(0.18)',
    gradientStops: [
      { offset: 0.0, color: 'rgba(211, 84, 0, 0.35)' },
      { offset: 0.6, color: 'rgba(255, 179, 0, 0.28)' },
      { offset: 1.0, color: 'rgba(230, 126, 34, 0.4)' }
    ],
    vignetteColor: 'rgba(30, 15, 5, 0.6)'
  },
  'noir': {
    name: 'Vice Noir',
    description: 'High contrast gritty monochrome crime cinema',
    primary: '#ffffff',
    secondary: '#888888',
    cssFilter: 'contrast(1.45) saturate(0) brightness(0.95)',
    gradientStops: [
      { offset: 0.0, color: 'rgba(0, 0, 0, 0.45)' },
      { offset: 1.0, color: 'rgba(10, 15, 25, 0.5)' }
    ],
    vignetteColor: 'rgba(0, 0, 0, 0.85)'
  }
};

export const EXPORT_SIZES = {
  'square': {
    name: 'Square (1:1)',
    w: 1080,
    h: 1080
  },
  'portrait': {
    name: 'Portrait (4:5)',
    w: 1080,
    h: 1350
  },
  'landscape': {
    name: 'Landscape (16:9)',
    w: 1920,
    h: 1080
  }
};

export const DEFAULT_STATE = {
  layout: 'five-panel',
  grade: 'vice-sunset',
  caption: 'VICE CITY DREAMS',
  exportSize: 'square',
  borderWidth: 6,
  borderColor: '#0b0c10',
  photos: [
    'samples/pier.jpg',
    'samples/boulevard.jpg',
    'samples/pier.jpg',
    'samples/boulevard.jpg',
    'samples/pier.jpg'
  ]
};
