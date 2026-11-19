// shots.js — automated screenshot helper for Vice Cover Studio
// Reads URL query params set by shots.json and renders a specific shot
// for the makefun screenshot automation pipeline.
//
// Query params:
//   shot   = cover | cover-neon | cover-golden | editor
//   photo  = pier | boulevard (sample photo name)
//   caption = URL-encoded caption text

import { DEFAULT_STATE, COLOR_GRADES } from './constants.js';
import { renderCover } from './cover.js';

/**
 * Parse shot params from the current URL and auto-render if ?shot= is set.
 * Returns true if a shot was triggered, false otherwise.
 */
export function handleShotMode() {
  const params  = new URLSearchParams(location.search);
  const shotKey = params.get('shot');
  if (!shotKey) return false;

  const photoName = params.get('photo') ?? 'pier';
  const caption   = params.get('caption') ?? DEFAULT_STATE.caption;

  // Build state for the requested shot
  const state = structuredClone(DEFAULT_STATE);
  state.caption = caption;

  switch (shotKey) {
    case 'cover':
      state.layout = 'five-panel';
      state.grade  = 'vice-sunset';
      break;
    case 'cover-neon':
      state.layout = 'triptych';
      state.grade  = 'neon-night';
      break;
    case 'cover-golden':
      state.layout = 'split';
      state.grade  = 'golden-hour';
      break;
    case 'editor':
      // Editor shot: show UI at full size, with photo loaded
      state.layout = 'five-panel';
      state.grade  = 'vice-sunset';
      break;
    default:
      return false;
  }

  // Load the sample photo, then render
  const img = new Image();
  img.onload = () => {
    const canvas = document.getElementById('preview-canvas');
    renderCover(canvas, state, [img]);
    // Signal makefun screenshot capture is ready
    document.documentElement.dataset.shotReady = '1';
  };
  img.onerror = () => {
    // Render without photo (placeholder mode)
    const canvas = document.getElementById('preview-canvas');
    renderCover(canvas, state, []);
    document.documentElement.dataset.shotReady = '1';
  };
  img.src = `samples/${photoName}.jpg`;

  return true;
}
