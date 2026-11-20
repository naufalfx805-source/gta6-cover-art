// Vice Cover Studio - Screenshot Mode Controller
// Handles ?shot= URL parameters for automated evaluation capture

import { SAMPLES, EXPORT_SIZES } from './constants.js';
import { renderCover } from './cover.js';

export async function handleShotsMode(app) {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return false;

  const photo = params.get('photo') || 'pier';
  const caption = params.get('caption') || 'VICE CITY DREAMS';

  // Preload sample images first
  await app.preloadSamples();
  app.bindEvents();

  // Configure state based on shot profile
  if (shot === 'cover') {
    app.state.layout = 'five-panel';
    app.state.grade = 'vice-sunset';
    app.state.caption = caption.replace(/\+/g, ' ');
    app.state.subtitle = 'A VICE CITY TALE';
    app.state.exportSize = 'square';
    app.state.sampleId = photo;
  } else if (shot === 'editor') {
    app.state.layout = 'five-panel';
    app.state.grade = 'neon-night';
    app.state.caption = caption.replace(/\+/g, ' ');
    app.state.subtitle = 'VICE DISTRICT 06';
    app.state.exportSize = 'landscape';
    app.state.sampleId = photo;
  } else if (shot === 'cover-neon') {
    app.state.layout = 'five-panel';
    app.state.grade = 'neon-night';
    app.state.caption = caption.replace(/\+/g, ' ');
    app.state.subtitle = 'VICE DISTRICT 06';
    app.state.exportSize = 'portrait';
    app.state.sampleId = photo;
  } else if (shot === 'cover-golden') {
    app.state.layout = 'classic-six';
    app.state.grade = 'golden-hour';
    app.state.caption = caption.replace(/\+/g, ' ');
    app.state.subtitle = 'THE FINAL SCORE';
    app.state.exportSize = 'landscape';
    app.state.sampleId = photo;
  }

  // Update UI form elements to reflect state
  syncUiState(app);

  // Resize canvas according to export size
  const spec = EXPORT_SIZES[app.state.exportSize] || EXPORT_SIZES.square;
  app.canvas.width = spec.w;
  app.canvas.height = spec.h;

  app.updateImageSlots();
  app.render();

  // Signal completion to Playwright / automated scraper
  document.documentElement.dataset.shotReady = '1';
  return true;
}

function syncUiState(app) {
  // Sync caption / subtitle inputs
  const capInput = document.getElementById('caption-input');
  if (capInput) capInput.value = app.state.caption;

  const subInput = document.getElementById('subtitle-input');
  if (subInput) subInput.value = app.state.subtitle;

  // Sync active buttons
  document.querySelectorAll('[data-layout]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.layout === app.state.layout);
  });

  document.querySelectorAll('[data-grade]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.grade === app.state.grade);
  });

  document.querySelectorAll('[data-sample]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sample === app.state.sampleId);
  });

  const sizeSelect = document.getElementById('export-size-select');
  if (sizeSelect) sizeSelect.value = app.state.exportSize;
}
