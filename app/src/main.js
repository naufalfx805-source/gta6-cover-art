// Vice Cover Studio — Main Application Controller
import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES, DEFAULT_STATE } from './constants.js';
import { renderCover, exportCoverDataUrl } from './cover.js';

let appState = { ...DEFAULT_STATE };
let loadedImages = [];

/**
 * Loads an image from a URL or data URL and returns an HTMLImageElement promise.
 */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Loads all initial default photos into memory.
 */
export async function loadDefaultPhotos() {
  const promises = appState.photos.map(src => loadImage(src).catch(e => {
    console.warn('Failed to load sample image:', src, e);
    return null;
  }));
  const results = await Promise.all(promises);
  loadedImages = results.filter(Boolean);
}

/**
 * Renders the canvas with current state.
 */
export function triggerRender() {
  const canvas = document.getElementById('cover-canvas');
  if (!canvas) return;
  renderCover(canvas, appState, loadedImages);
}

/**
 * Triggers a browser download of the generated cover as a PNG.
 */
export function downloadCover() {
  const dataUrl = exportCoverDataUrl(appState, loadedImages, appState.exportSize);
  const a = document.createElement('a');
  const filename = `vice-cover-${appState.layout}-${appState.grade}-${Date.now()}.png`;
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Binds UI inputs and controls to update application state.
 */
export function setupUI() {
  const captionInput = document.getElementById('caption-input');
  if (captionInput) {
    captionInput.value = appState.caption;
    captionInput.addEventListener('input', (e) => {
      appState.caption = e.target.value;
      triggerRender();
    });
  }

  // Layout buttons / selector
  const layoutContainer = document.getElementById('layout-selector');
  if (layoutContainer) {
    layoutContainer.innerHTML = '';
    Object.entries(LAYOUTS).forEach(([key, layout]) => {
      const btn = document.createElement('button');
      btn.className = `btn-choice ${appState.layout === key ? 'active' : ''}`;
      btn.textContent = layout.name;
      btn.onclick = () => {
        appState.layout = key;
        document.querySelectorAll('#layout-selector .btn-choice').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        triggerRender();
      };
      layoutContainer.appendChild(btn);
    });
  }

  // Grade buttons / selector
  const gradeContainer = document.getElementById('grade-selector');
  if (gradeContainer) {
    gradeContainer.innerHTML = '';
    Object.entries(COLOR_GRADES).forEach(([key, grade]) => {
      const btn = document.createElement('button');
      btn.className = `btn-choice ${appState.grade === key ? 'active' : ''}`;
      btn.textContent = grade.name;
      btn.onclick = () => {
        appState.grade = key;
        document.querySelectorAll('#grade-selector .btn-choice').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        triggerRender();
      };
      gradeContainer.appendChild(btn);
    });
  }

  // Export size selector
  const sizeSelect = document.getElementById('size-select');
  if (sizeSelect) {
    sizeSelect.innerHTML = '';
    Object.entries(EXPORT_SIZES).forEach(([key, size]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = `${size.name} (${size.w}x${size.h})`;
      if (key === appState.exportSize) opt.selected = true;
      sizeSelect.appendChild(opt);
    });
    sizeSelect.addEventListener('change', (e) => {
      appState.exportSize = e.target.value;
      triggerRender();
    });
  }

  // File upload input (FileReader for local machine photo loading)
  const fileInput = document.getElementById('photo-upload');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const readPromises = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => resolve(evt.target.result);
          reader.readAsDataURL(file);
        });
      });

      const dataUrls = await Promise.all(readPromises);
      const userImgs = await Promise.all(dataUrls.map(url => loadImage(url)));
      loadedImages = userImgs.concat(loadedImages);
      triggerRender();
    });
  }

  // Export button
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', downloadCover);
  }

  // Keyboard shortcut: Ctrl+Enter / Cmd+Enter to export cover PNG
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      downloadCover();
    }
  });
}

/**
 * Initializes the app.
 */
export async function init() {
  await loadDefaultPhotos();
  setupUI();
  triggerRender();
}

// Auto-run init if DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
