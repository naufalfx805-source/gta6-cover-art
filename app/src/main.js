// main.js — event controller for Vice Cover Studio
// Wires up: photo upload, layout picker, grade picker, caption input,
// export button, and live preview canvas.

import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES, DEFAULT_STATE } from './constants.js';
import { renderCover, exportCoverDataUrl }                     from './cover.js';

// ---------------------------------------------------------------------------
// App state
// ---------------------------------------------------------------------------

const state = structuredClone(DEFAULT_STATE);

/** All loaded images as HTMLImageElement, in upload order. */
const loadedImgs = [];

// ---------------------------------------------------------------------------
// DOM references (populated by init)
// ---------------------------------------------------------------------------

let canvas, ctx, captionInput, exportSizeSelect, statusEl;

// ---------------------------------------------------------------------------
// Initialise
// ---------------------------------------------------------------------------

export function init() {
  canvas          = document.getElementById('preview-canvas');
  captionInput    = document.getElementById('caption-input');
  exportSizeSelect= document.getElementById('export-size');
  statusEl        = document.getElementById('status');

  buildLayoutPicker();
  buildGradePicker();
  buildExportSizeOptions();

  // Photo upload
  document.getElementById('upload-btn').addEventListener('click', () => {
    document.getElementById('file-input').click();
  });
  document.getElementById('file-input').addEventListener('change', onFileChange);

  // Sample photo buttons
  document.querySelectorAll('[data-sample]').forEach(btn => {
    btn.addEventListener('click', () => loadSamplePhoto(btn.dataset.sample));
  });

  // Caption
  captionInput.value = state.caption;
  captionInput.addEventListener('input', () => {
    state.caption = captionInput.value;
    scheduleRedraw();
  });
  captionInput.addEventListener('keydown', e => {
    // Ctrl+Enter → export immediately
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onExport();
  });

  // Export
  document.getElementById('export-btn').addEventListener('click', onExport);

  // Initial draw (placeholder)
  redraw();
}

// ---------------------------------------------------------------------------
// Layout picker
// ---------------------------------------------------------------------------

function buildLayoutPicker() {
  const container = document.getElementById('layout-picker');
  Object.entries(LAYOUTS).forEach(([key, layout]) => {
    const btn = document.createElement('button');
    btn.className   = 'picker-btn' + (key === state.layout ? ' active' : '');
    btn.textContent = layout.label;
    btn.dataset.layout = key;
    btn.addEventListener('click', () => {
      state.layout = key;
      container.querySelectorAll('.picker-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleRedraw();
    });
    container.appendChild(btn);
  });
}

// ---------------------------------------------------------------------------
// Grade picker
// ---------------------------------------------------------------------------

function buildGradePicker() {
  const container = document.getElementById('grade-picker');
  Object.entries(COLOR_GRADES).forEach(([key, grade]) => {
    const btn = document.createElement('button');
    btn.className = 'grade-btn' + (key === state.grade ? ' active' : '');
    btn.dataset.grade = key;

    // Colour swatch
    const swatch = document.createElement('span');
    swatch.className = 'grade-swatch';
    swatch.style.background = `linear-gradient(135deg, ${grade.gradientTop}, ${grade.gradientBottom})`;
    btn.appendChild(swatch);

    const label = document.createElement('span');
    label.textContent = grade.label;
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      state.grade = key;
      container.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      scheduleRedraw();
    });
    container.appendChild(btn);
  });
}

// ---------------------------------------------------------------------------
// Export size dropdown
// ---------------------------------------------------------------------------

function buildExportSizeOptions() {
  Object.entries(EXPORT_SIZES).forEach(([key, sz]) => {
    const opt = document.createElement('option');
    opt.value       = key;
    opt.textContent = sz.label;
    if (key === state.exportSize) opt.selected = true;
    exportSizeSelect.appendChild(opt);
  });
  exportSizeSelect.addEventListener('change', () => {
    state.exportSize = exportSizeSelect.value;
  });
}

// ---------------------------------------------------------------------------
// Photo loading
// ---------------------------------------------------------------------------

function onFileChange(e) {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  setStatus(`Loading ${files.length} photo(s)…`);
  let loaded = 0;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      loadImageFromDataUrl(ev.target.result, () => {
        loaded++;
        if (loaded === files.length) {
          setStatus(`${loadedImgs.length} photo(s) loaded`);
          scheduleRedraw();
        }
      });
    };
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl, cb) {
  const img = new Image();
  img.onload  = () => { loadedImgs.push(img); cb(); };
  img.onerror = () => { setStatus('Failed to load image'); cb(); };
  img.src = dataUrl;
}

function loadSamplePhoto(name) {
  setStatus(`Loading sample: ${name}…`);
  const img = new Image();
  img.onload  = () => { loadedImgs.push(img); setStatus('Sample loaded'); scheduleRedraw(); };
  img.onerror = () => { setStatus(`Sample "${name}" not found`); };
  img.src = `samples/${name}.jpg`;
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function onExport() {
  setStatus('Exporting…');
  try {
    const dataUrl = exportCoverDataUrl(state, loadedImgs, state.exportSize);
    const a = document.createElement('a');
    const sz = EXPORT_SIZES[state.exportSize];
    a.download = `vice-cover-${state.exportSize}-${Date.now()}.png`;
    a.href = dataUrl;
    a.click();
    setStatus(`Exported ${sz.w}×${sz.h} PNG`);
  } catch (err) {
    setStatus('Export failed: ' + err.message);
    console.error(err);
  }
}

// ---------------------------------------------------------------------------
// Render loop
// ---------------------------------------------------------------------------

let rafId = null;

function scheduleRedraw() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => { rafId = null; redraw(); });
}

function redraw() {
  const size = EXPORT_SIZES[state.exportSize] ?? EXPORT_SIZES['square'];
  // Keep preview canvas square-ish at 540 max
  const previewMax = 540;
  const ar = size.w / size.h;
  if (ar >= 1) {
    canvas.width  = previewMax;
    canvas.height = Math.round(previewMax / ar);
  } else {
    canvas.height = previewMax;
    canvas.width  = Math.round(previewMax * ar);
  }
  renderCover(canvas, state, loadedImgs);
}

// ---------------------------------------------------------------------------
// Status bar
// ---------------------------------------------------------------------------

function setStatus(msg) {
  if (statusEl) statusEl.textContent = msg;
}
