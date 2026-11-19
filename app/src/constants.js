// Layout definitions, filter presets, and design constants for GTA 6 Cover Art Maker

export const ASPECT_RATIOS = {
  square: { width: 1080, height: 1080, label: 'Square 1:1 (Post)' },
  portrait: { width: 1080, height: 1350, label: 'Portrait 4:5 (Vertical)' },
  landscape: { width: 1920, height: 1080, label: 'Landscape 16:9 (Banner)' }
};

export const LAYOUTS = {
  five_panel: {
    id: 'five_panel',
    name: 'Vice Iconic (5 Panels)',
    // Normalized coordinates [x, y, w, h] as fraction of total dimensions
    panels: [
      { id: 0, x: 0, y: 0, w: 0.38, h: 0.38, defaultPhoto: 'boulevard', tag: 'Sky / Skyline' },
      { id: 1, x: 0.38, y: 0, w: 0.62, h: 0.30, defaultPhoto: 'pier', tag: 'Ocean Sunset' },
      { id: 2, x: 0.38, y: 0.30, w: 0.62, h: 0.44, defaultPhoto: 'boulevard', tag: 'Main Hero' },
      { id: 3, x: 0, y: 0.38, w: 0.38, h: 0.36, defaultPhoto: 'pier', tag: 'Street Action' },
      { id: 4, x: 0, y: 0.74, w: 1.0, h: 0.26, defaultPhoto: 'pier', tag: 'Vice Strip' }
    ]
  },
  six_grid: {
    id: 'six_grid',
    name: 'Leonida Grid (6 Panels)',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.50, h: 0.33, defaultPhoto: 'boulevard', tag: 'Top Left' },
      { id: 1, x: 0.50, y: 0, w: 0.50, h: 0.33, defaultPhoto: 'pier', tag: 'Top Right' },
      { id: 2, x: 0, y: 0.33, w: 0.42, h: 0.34, defaultPhoto: 'pier', tag: 'Mid Left' },
      { id: 3, x: 0.42, y: 0.33, w: 0.58, h: 0.34, defaultPhoto: 'boulevard', tag: 'Mid Right' },
      { id: 4, x: 0, y: 0.67, w: 0.60, h: 0.33, defaultPhoto: 'boulevard', tag: 'Bottom Left' },
      { id: 5, x: 0.60, y: 0.67, w: 0.40, h: 0.33, defaultPhoto: 'pier', tag: 'Bottom Right' }
    ]
  },
  triple_slash: {
    id: 'triple_slash',
    name: 'Action Triptych (3 Panels)',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.333, h: 1.0, defaultPhoto: 'pier', tag: 'Left Action' },
      { id: 1, x: 0.333, y: 0, w: 0.334, h: 1.0, defaultPhoto: 'boulevard', tag: 'Center Lead' },
      { id: 2, x: 0.667, y: 0, w: 0.333, h: 1.0, defaultPhoto: 'pier', tag: 'Right Scene' }
    ]
  },
  solo_poster: {
    id: 'solo_poster',
    name: 'Single Poster (1 Panel)',
    panels: [
      { id: 0, x: 0, y: 0, w: 1.0, h: 1.0, defaultPhoto: 'pier', tag: 'Full Frame' }
    ]
  }
};

export const COLOR_GRADES = {
  sunset_vice: {
    name: 'Vice Sunset (Golden/Magenta)',
    topColor: 'rgba(255, 115, 30, 0.32)',
    bottomColor: 'rgba(180, 15, 130, 0.52)',
    contrast: 1.15,
    saturation: 1.30,
    vignette: 0.45
  },
  neon_heat: {
    name: 'Neon Nights (Cyan/Hot Pink)',
    topColor: 'rgba(0, 230, 255, 0.30)',
    bottomColor: 'rgba(255, 20, 140, 0.50)',
    contrast: 1.25,
    saturation: 1.40,
    vignette: 0.55
  },
  miami_golden: {
    name: 'Golden Hour Florida',
    topColor: 'rgba(255, 185, 40, 0.28)',
    bottomColor: 'rgba(240, 90, 40, 0.40)',
    contrast: 1.10,
    saturation: 1.25,
    vignette: 0.35
  },
  crime_noir: {
    name: 'Gritty Noir (High Contrast)',
    topColor: 'rgba(20, 20, 25, 0.35)',
    bottomColor: 'rgba(5, 5, 10, 0.65)',
    contrast: 1.45,
    saturation: 0.35,
    vignette: 0.65
  },
  pure_clean: {
    name: 'Clean Original (No Tint)',
    topColor: 'rgba(0, 0, 0, 0)',
    bottomColor: 'rgba(0, 0, 0, 0.25)',
    contrast: 1.05,
    saturation: 1.10,
    vignette: 0.20
  }
};

export const DEFAULT_STATE = {
  ratio: 'square',
  layoutId: 'five_panel',
  colorGrade: 'sunset_vice',
  borderWidth: 7,
  borderColor: '#0a0812',
  title: 'VICE HEIST',
  subtitle: 'A LEONIDA CRIME STORY',
  location: 'VICE CITY • 2026',
  badgeStyle: 'parental', // 'parental', 'edition', 'none'
  vignetteStrength: 0.4,
  contrastBoost: 1.15,
  saturationBoost: 1.25,
  grain: true
};
