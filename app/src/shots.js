// Vice Cover Studio — Automated Shot Capture Controller
import { COLOR_GRADES, LAYOUTS, EXPORT_SIZES, DEFAULT_STATE } from './constants.js';
import { renderCover } from './cover.js';
import { loadImage } from './main.js';

async function handleAutomatedShot() {
  const url = new URL(window.location.href);
  const shot = url.searchParams.get('shot');
  if (!shot) return;

  const photoParam = url.searchParams.get('photo') ?? 'pier';
  const captionParam = url.searchParams.get('caption') ?? 'Vice City Dreams';

  // Determine photo path
  const primaryPhoto = photoParam.endsWith('.jpg') ? `samples/${photoParam}` : `samples/${photoParam}.jpg`;
  const secondaryPhoto = primaryPhoto.includes('pier') ? 'samples/boulevard.jpg' : 'samples/pier.jpg';

  // Pre-load images
  const [img1, img2] = await Promise.all([
    loadImage(primaryPhoto).catch(() => null),
    loadImage(secondaryPhoto).catch(() => null)
  ]);
  const images = [img1, img2, img1, img2, img1].filter(Boolean);

  let state = {
    ...DEFAULT_STATE,
    caption: captionParam,
    photos: [primaryPhoto, secondaryPhoto]
  };

  if (shot === 'cover') {
    state.layout = 'five-panel';
    state.grade = 'vice-sunset';
    state.exportSize = 'square';
    document.body.classList.add('shot-pure-cover');
  } else if (shot === 'editor') {
    state.layout = 'five-panel';
    state.grade = 'neon-night';
    state.exportSize = 'landscape';
    // Keep editor UI visible for UI screenshot
    document.body.classList.add('shot-editor-view');
  } else if (shot === 'cover-neon') {
    state.layout = 'five-panel';
    state.grade = 'neon-night';
    state.exportSize = 'square';
    document.body.classList.add('shot-pure-cover');
  } else if (shot === 'cover-golden') {
    state.layout = 'triptych';
    state.grade = 'golden-hour';
    state.exportSize = 'landscape';
    document.body.classList.add('shot-pure-cover');
  }

  const canvas = document.getElementById('cover-canvas');
  if (canvas) {
    renderCover(canvas, state, images);
  }

  // Populate UI inputs if editor view
  const captionInput = document.getElementById('caption-input');
  if (captionInput) captionInput.value = state.caption;

  // Signal completion for headless playwright capture
  document.documentElement.dataset.shotReady = '1';
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleAutomatedShot);
  } else {
    handleAutomatedShot();
  }
}
