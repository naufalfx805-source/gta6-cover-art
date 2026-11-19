// Main UI Controller and Event Coordinator for Vice Cover Studio (GTA 6 Cover Art Maker)

import { drawCover } from './cover.js';
import { runShot } from './shots.js';
import { DEFAULT_STATE, ASPECT_RATIOS, LAYOUTS, COLOR_GRADES } from './constants.js';

// Application state
const state = {
  ...DEFAULT_STATE,
  panelPhotos: {},
  panelZoom: {},
  panelPanX: {},
  panelPanY: {}
};
let selectedPanelIndex = 0;

// DOM Elements
const canvas = document.getElementById('cover');
const titleInput = document.getElementById('title-input');
const subtitleInput = document.getElementById('subtitle-input');
const locationInput = document.getElementById('location-input');
const ratioSelect = document.getElementById('ratio-select');
const layoutSelect = document.getElementById('layout-select');
const gradeSelect = document.getElementById('grade-select');
const badgeSelect = document.getElementById('badge-select');
const masterFileInput = document.getElementById('master-photo');
const panelFileInput = document.getElementById('panel-photo');
const zoomSlider = document.getElementById('zoom-slider');
const vignetteSlider = document.getElementById('vignette-slider');
const borderSlider = document.getElementById('border-slider');
const exportBtn = document.getElementById('export-btn');
const demoBtn = document.getElementById('demo-btn');
const statusMsg = document.getElementById('status-msg');
const activePanelLabel = document.getElementById('active-panel-label');

/** Redraws canvas with current application state */
export function redraw() {
  const currentRatio = ASPECT_RATIOS[state.ratio] || ASPECT_RATIOS.square;
  if (canvas.width !== currentRatio.width || canvas.height !== currentRatio.height) {
    canvas.width = currentRatio.width;
    canvas.height = currentRatio.height;
  }
  drawCover(canvas, state);
}

/** Loads an image from a URL or object URL */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image from: ${url}`));
    img.src = url;
  });
}

// Event Listeners for Text Inputs
if (titleInput) {
  titleInput.addEventListener('input', (e) => {
    state.title = e.target.value.toUpperCase();
    redraw();
  });
}

if (subtitleInput) {
  subtitleInput.addEventListener('input', (e) => {
    state.subtitle = e.target.value.toUpperCase();
    redraw();
  });
}

if (locationInput) {
  locationInput.addEventListener('input', (e) => {
    state.location = e.target.value.toUpperCase();
    redraw();
  });
}

// Ratio & Layout Selectors
if (ratioSelect) {
  ratioSelect.addEventListener('change', (e) => {
    state.ratio = e.target.value;
    redraw();
  });
}

if (layoutSelect) {
  layoutSelect.addEventListener('change', (e) => {
    state.layoutId = e.target.value;
    updatePanelIndicator();
    redraw();
  });
}

if (gradeSelect) {
  gradeSelect.addEventListener('change', (e) => {
    state.colorGrade = e.target.value;
    redraw();
  });
}

if (badgeSelect) {
  badgeSelect.addEventListener('change', (e) => {
    state.badgeStyle = e.target.value;
    redraw();
  });
}

// Sliders
if (zoomSlider) {
  zoomSlider.addEventListener('input', (e) => {
    state.panelZoom[selectedPanelIndex] = parseFloat(e.target.value);
    redraw();
  });
}

if (vignetteSlider) {
  vignetteSlider.addEventListener('input', (e) => {
    state.vignetteStrength = parseFloat(e.target.value);
    redraw();
  });
}

if (borderSlider) {
  borderSlider.addEventListener('input', (e) => {
    state.borderWidth = parseInt(e.target.value, 10);
    redraw();
  });
}

// File Uploads
if (masterFileInput) {
  masterFileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const img = await loadImage(URL.createObjectURL(file));
      state.masterPhoto = img;
      if (statusMsg) statusMsg.textContent = `Loaded master photo: ${file.name}`;
      redraw();
    } catch (err) {
      if (statusMsg) statusMsg.textContent = 'Error loading image file';
    }
  });
}

if (panelFileInput) {
  panelFileInput.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      const img = await loadImage(URL.createObjectURL(file));
      state.panelPhotos[selectedPanelIndex] = img;
      if (statusMsg) statusMsg.textContent = `Assigned photo to panel #${selectedPanelIndex + 1}`;
      redraw();
    } catch (err) {
      if (statusMsg) statusMsg.textContent = 'Error loading panel image';
    }
  });
}

/** Updates panel indicator and resets controls for the selected panel */
function updatePanelIndicator() {
  const currentLayout = LAYOUTS[state.layoutId] || LAYOUTS.five_panel;
  if (selectedPanelIndex >= currentLayout.panels.length) {
    selectedPanelIndex = 0;
  }
  const currentPanel = currentLayout.panels[selectedPanelIndex];
  if (activePanelLabel && currentPanel) {
    activePanelLabel.textContent = `Selected: Panel #${selectedPanelIndex + 1} (${currentPanel.tag})`;
  }
  if (zoomSlider) {
    zoomSlider.value = state.panelZoom[selectedPanelIndex] || 1.0;
  }
}

// Canvas Click to Select Panel for Targeted Customization
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = ((e.clientX - rect.left) / rect.width);
  const clickY = ((e.clientY - rect.top) / rect.height);

  const currentLayout = LAYOUTS[state.layoutId] || LAYOUTS.five_panel;
  for (let i = 0; i < currentLayout.panels.length; i++) {
    const p = currentLayout.panels[i];
    if (clickX >= p.x && clickX <= (p.x + p.w) && clickY >= p.y && clickY <= (p.y + p.h)) {
      selectedPanelIndex = i;
      updatePanelIndicator();
      break;
    }
  }
});

// Demo Photos Loader
if (demoBtn) {
  demoBtn.addEventListener('click', async () => {
    try {
      if (statusMsg) statusMsg.textContent = 'Loading Vice City sample photos...';
      const [boulevard, pier] = await Promise.all([
        loadImage('samples/boulevard.jpg'),
        loadImage('samples/pier.jpg')
      ]);
      state.masterPhoto = boulevard;
      state.panelPhotos = {
        0: boulevard,
        1: pier,
        2: boulevard,
        3: pier,
        4: boulevard,
        5: pier,
        6: boulevard,
        7: pier
      };
      if (statusMsg) statusMsg.textContent = 'Demo photos applied across all panels!';
      redraw();
    } catch (err) {
      if (statusMsg) statusMsg.textContent = 'Demo photos not found in samples/';
    }
  });
}

// Export PNG Function
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const filename = `gta6-cover-${state.ratio}-${canvas.width}x${canvas.height}.png`;
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      if (statusMsg) statusMsg.textContent = `Exported ${filename} successfully!`;
    }, 'image/png');
  });
}

// Initial Boot & Shot Handling
const urlParams = new URLSearchParams(window.location.search);
const shot = urlParams.get('shot');

if (shot) {
  runShot(shot, urlParams, state, redraw);
} else {
  // Pre-load demo samples for rich out-of-the-box visual presentation
  Promise.all([
    loadImage('samples/boulevard.jpg'),
    loadImage('samples/pier.jpg')
  ]).then(([boulevard, pier]) => {
    state.masterPhoto = boulevard;
    state.panelPhotos = {
      0: boulevard,
      1: pier,
      2: boulevard,
      3: pier,
      4: boulevard,
      5: pier,
      6: boulevard,
      7: pier
    };
    redraw();
  }).catch(() => {
    redraw();
  });
}
