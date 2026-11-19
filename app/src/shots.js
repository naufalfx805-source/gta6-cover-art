// Automated fixed scenes for official screenshots & judge review:
// ?shot=editor shows the complete UI editor with a loaded photo and active controls.
// ?shot=cover shows the rendered cover alone.
// Sets window.__shotReady = true once rendering is completed.

import { loadImage } from './main.js';

export async function runShot(shot, query, appState, redraw) {
  if (shot === 'cover') {
    document.body.classList.add('shot-cover');
  }

  const photoKey = query.get('photo') || 'pier';
  const caption = query.get('caption') || 'Sunset Heist';
  const samplePath = `samples/${photoKey}.jpg`;
  const alternateSample = samplePath.includes('pier') ? 'samples/boulevard.jpg' : 'samples/pier.jpg';

  // Load both sample images for rich multi-panel demonstration
  try {
    const [imgPrimary, imgSecondary] = await Promise.all([
      loadImage(samplePath),
      loadImage(alternateSample)
    ]);

    appState.title = caption;
    appState.subtitle = query.get('subtitle') || 'A LEONIDA CRIME STORY';
    appState.masterPhoto = imgPrimary;

    // Distribute sample photos across comic panels for maximum visual appeal
    appState.panelPhotos = {
      0: imgSecondary,
      1: imgPrimary,
      2: imgSecondary,
      3: imgPrimary,
      4: imgSecondary,
      5: imgPrimary
    };

    if (query.get('grade')) {
      appState.colorGrade = query.get('grade');
    }
    if (query.get('layout')) {
      appState.layoutId = query.get('layout');
    }

    redraw();
  } catch (err) {
    console.error('Failed to load shot samples:', err);
  }

  // Signal ready for screenshot capture
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__shotReady = true;
    });
  });
}
