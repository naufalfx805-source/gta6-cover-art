// Layout definitions, color grading presets, and design constants for Vice Cover Studio (GTA 6 Cover Art Maker)

export const ASPECT_RATIOS = {
  square: { width: 1080, height: 1080, label: 'Square 1:1 (Post / Box Art)' },
  portrait: { width: 1080, height: 1350, label: 'Portrait 4:5 (Poster)' },
  landscape: { width: 1920, height: 1080, label: 'Landscape 16:9 (Banner)' }
};

export const LAYOUTS = {
  five_panel: {
    id: 'five_panel',
    name: 'Vice Iconic (5 Panels)',
    // Normalized coordinates [x, y, w, h] as fraction of total dimensions
    panels: [
      { id: 0, x: 0, y: 0, w: 0.38, h: 0.38, defaultPhoto: 'boulevard', tag: 'Skyline Aerial' },
      { id: 1, x: 0.38, y: 0, w: 0.62, h: 0.30, defaultPhoto: 'pier', tag: 'Ocean Sunset' },
      { id: 2, x: 0.38, y: 0.30, w: 0.62, h: 0.44, defaultPhoto: 'boulevard', tag: 'Main Hero Lead' },
      { id: 3, x: 0, y: 0.38, w: 0.38, h: 0.36, defaultPhoto: 'pier', tag: 'Street Action' },
      { id: 4, x: 0, y: 0.74, w: 1.0, h: 0.26, defaultPhoto: 'boulevard', tag: 'Vice Strip Cruising' }
    ]
  },
  six_grid: {
    id: 'six_grid',
    name: 'Leonida Grid (6 Panels)',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.50, h: 0.33, defaultPhoto: 'boulevard', tag: 'Top Left Horizon' },
      { id: 1, x: 0.50, y: 0, w: 0.50, h: 0.33, defaultPhoto: 'pier', tag: 'Top Right Marina' },
      { id: 2, x: 0, y: 0.33, w: 0.42, h: 0.34, defaultPhoto: 'pier', tag: 'Mid Left Chopper' },
      { id: 3, x: 0.42, y: 0.33, w: 0.58, h: 0.34, defaultPhoto: 'boulevard', tag: 'Mid Right Hero' },
      { id: 4, x: 0, y: 0.67, w: 0.60, h: 0.33, defaultPhoto: 'boulevard', tag: 'Bottom Left Getaway' },
      { id: 5, x: 0.60, y: 0.67, w: 0.40, h: 0.33, defaultPhoto: 'pier', tag: 'Bottom Right Palms' }
    ]
  },
  triple_slash: {
    id: 'triple_slash',
    name: 'Action Triptych (3 Panels)',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.333, h: 1.0, defaultPhoto: 'pier', tag: 'Left Scene' },
      { id: 1, x: 0.333, y: 0, w: 0.334, h: 1.0, defaultPhoto: 'boulevard', tag: 'Center Protagonist' },
      { id: 2, x: 0.667, y: 0, w: 0.333, h: 1.0, defaultPhoto: 'pier', tag: 'Right Ocean' }
    ]
  },
  eight_panel: {
    id: 'eight_panel',
    name: 'Grand Montage (8 Panels)',
    panels: [
      { id: 0, x: 0, y: 0, w: 0.32, h: 0.28, defaultPhoto: 'boulevard', tag: 'Sky Chopper' },
      { id: 1, x: 0.32, y: 0, w: 0.36, h: 0.28, defaultPhoto: 'pier', tag: 'Ocean Horizon' },
      { id: 2, x: 0.68, y: 0, w: 0.32, h: 0.28, defaultPhoto: 'boulevard', tag: 'Speedboat' },
      { id: 3, x: 0, y: 0.28, w: 0.45, h: 0.44, defaultPhoto: 'pier', tag: 'Duo Protagonists' },
      { id: 4, x: 0.45, y: 0.28, w: 0.55, h: 0.44, defaultPhoto: 'boulevard', tag: 'Vice City Skyline' },
      { id: 5, x: 0, y: 0.72, w: 0.33, h: 0.28, defaultPhoto: 'boulevard', tag: 'Supercar Drifting' },
      { id: 6, x: 0.33, y: 0.72, w: 0.34, h: 0.28, defaultPhoto: 'pier', tag: 'Neon Club' },
      { id: 7, x: 0.67, y: 0.72, w: 0.33, h: 0.28, defaultPhoto: 'boulevard', tag: 'Bayside Strip' }
    ]
  },
  solo_poster: {
    id: 'solo_poster',
    name: 'Single Hero Poster (1 Panel)',
    panels: [
      { id: 0, x: 0, y: 0, w: 1.0, h: 1.0, defaultPhoto: 'pier', tag: 'Full Cinematic Frame' }
    ]
  }
};

export const COLOR_GRADES = {
  sunset_vice: {
    name: 'Vice Sunset (Golden/Magenta)',
    topColor: 'rgba(255, 115, 30, 0.34)',
    bottomColor: 'rgba(180, 15, 130, 0.52)',
    contrast: 1.18,
    saturation: 1.32,
    vignette: 0.45
  },
  neon_heat: {
    name: 'Neon Heat (Cyan/Hot Pink)',
    topColor: 'rgba(0, 230, 255, 0.32)',
    bottomColor: 'rgba(255, 20, 140, 0.50)',
    contrast: 1.25,
    saturation: 1.40,
    vignette: 0.55
  },
  miami_golden: {
    name: 'Golden Hour Florida',
    topColor: 'rgba(255, 185, 40, 0.28)',
    bottomColor: 'rgba(240, 90, 40, 0.42)',
    contrast: 1.12,
    saturation: 1.25,
    vignette: 0.35
  },
  synthwave_80s: {
    name: 'Synthwave 80s (Purple/Indigo)',
    topColor: 'rgba(142, 45, 226, 0.35)',
    bottomColor: 'rgba(74, 0, 224, 0.55)',
    contrast: 1.22,
    saturation: 1.35,
    vignette: 0.50
  },
  crime_noir: {
    name: 'Gritty Noir (High Contrast)',
    topColor: 'rgba(20, 20, 25, 0.35)',
    bottomColor: 'rgba(5, 5, 10, 0.65)',
    contrast: 1.45,
    saturation: 0.30,
    vignette: 0.65
  },
  pure_clean: {
    name: 'Clean Original (No Tint)',
    topColor: 'rgba(0, 0, 0, 0)',
    bottomColor: 'rgba(0, 0, 0, 0.20)',
    contrast: 1.05,
    saturation: 1.10,
    vignette: 0.20
  }
};

export const DEFAULT_STATE = {
  ratio: 'square',
  layoutId: 'five_panel',
  colorGrade: 'sunset_vice',
  borderWidth: 8,
  borderColor: '#0a0812',
  title: 'VICE HEIST',
  subtitle: 'A LEONIDA CRIME STORY',
  location: 'VICE CITY • 2026',
  badgeStyle: 'parental', // 'parental', 'edition', 'star', 'none'
  showWatermarkVI: true,
  vignetteStrength: 0.45,
  contrastBoost: 1.18,
  saturationBoost: 1.30,
  grain: true
};
