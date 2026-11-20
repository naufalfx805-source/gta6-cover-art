// Vice Cover Studio - Main Application Controller

import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES, DEFAULT_STATE } from './constants.js';
import { renderCover, exportCoverDataUrl } from './cover.js';

export const appState = { ...DEFAULT_STATE };
export const imgEls = {};

/**
 * Loads an image src into an HTMLImageElement
 */
export function loadImage(id, src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgEls[id] = img;
      resolve(img);
    };
    img.onerror = () => {
      console.warn(`Failed to load image for slot ${id}: ${src}`);
      resolve(null);
    };
    img.src = src;
  });
}

/**
 * Re-renders the preview canvas with current state
 */
export function render() {
  const canvas = document.getElementById('cover-canvas');
  if (!canvas) return;
  renderCover(canvas, appState, imgEls);
}

/**
 * Preloads all initial sample photos
 */
export async function preloadPhotos() {
  const promises = [];
  for (const [id, src] of Object.entries(appState.photos)) {
    promises.push(loadImage(Number(id), src));
  }
  await Promise.all(promises);
}

/**
 * Initializes UI event bindings
 */
export function initUI() {
  // Layout selector buttons
  const layoutBtns = document.querySelectorAll('[data-layout]');
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      layoutBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.layout = btn.dataset.layout;
      render();
    });
  });

  // Color grade buttons
  const gradeBtns = document.querySelectorAll('[data-grade]');
  gradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gradeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.grade = btn.dataset.grade;
      render();
    });
  });

  // Export size selector
  const sizeSelect = document.getElementById('export-size-select');
  if (sizeSelect) {
    sizeSelect.value = appState.exportSize;
    sizeSelect.addEventListener('change', (e) => {
      appState.exportSize = e.target.value;
      render();
    });
  }

  // Caption input
  const captionInput = document.getElementById('caption-input');
  if (captionInput) {
    captionInput.value = appState.caption;
    captionInput.addEventListener('input', (e) => {
      appState.caption = e.target.value;
      render();
    });
  }

  // Subtitle input
  const subcaptionInput = document.getElementById('subcaption-input');
  if (subcaptionInput) {
    subcaptionInput.value = appState.subcaption || '';
    subcaptionInput.addEventListener('input', (e) => {
      appState.subcaption = e.target.value;
      render();
    });
  }

  // File uploader (custom user photos)
  const fileInput = document.getElementById('photo-upload-input');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const dataUrl = ev.target.result;
          appState.photos[index] = dataUrl;
          await loadImage(index, dataUrl);
          render();
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Preset sample photo buttons
  const samplePierBtn = document.getElementById('sample-pier-btn');
  if (samplePierBtn) {
    samplePierBtn.addEventListener('click', async () => {
      for (let i = 0; i < 5; i++) {
        appState.photos[i] = 'samples/pier.jpg';
        await loadImage(i, 'samples/pier.jpg');
      }
      render();
    });
  }

  const sampleBoulevardBtn = document.getElementById('sample-boulevard-btn');
  if (sampleBoulevardBtn) {
    sampleBoulevardBtn.addEventListener('click', async () => {
      for (let i = 0; i < 5; i++) {
        appState.photos[i] = 'samples/boulevard.jpg';
        await loadImage(i, 'samples/boulevard.jpg');
      }
      render();
    });
  }

  // Download export button
  const downloadBtn = document.getElementById('download-btn');
  const triggerExport = () => {
    if (!downloadBtn) return;
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Generating PNG...';

    try {
      const dataUrl = exportCoverDataUrl(appState, imgEls, appState.exportSize);
      const a = document.createElement('a');
      a.download = `vice-cover-${appState.grade}-${Date.now()}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. See console for details.');
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Export Poster (PNG)';
    }
  };

  if (downloadBtn) {
    downloadBtn.addEventListener('click', triggerExport);
  }

  // Ctrl+Enter / Cmd+Enter hotkey shortcut for instant export
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      triggerExport();
    }
  });
}

/**
 * Initializes the entire application
 */
export async function initApp() {
  await preloadPhotos();
  initUI();
  render();
  console.log('[Vice Cover Studio] Initialized successfully');
}
