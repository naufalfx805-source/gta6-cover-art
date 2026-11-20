// Vice Cover Studio - Automated Shots Renderer for Screenshots

/**
 * Handles automated scene setup based on URL query parameters
 * ?shot=cover|editor|cover-neon|cover-golden
 * ?photo=pier|boulevard
 * ?caption=Text
 */
export async function runShot(shot, query, appState, loadImage, render) {
  const photoName = query.get('photo') || 'pier';
  const caption = query.get('caption') || 'Vice City Dreams';
  const photoPath = `samples/${photoName}.jpg`;

  if (shot === 'cover' || shot === 'cover-neon' || shot === 'cover-golden') {
    document.body.classList.add('shot-cover');
  } else if (shot === 'editor') {
    document.body.classList.remove('shot-cover');
  }

  if (shot === 'cover-neon') {
    appState.grade = 'neon-night';
  } else if (shot === 'cover-golden') {
    appState.grade = 'golden-hour';
  } else {
    appState.grade = 'vice-sunset';
  }

  appState.caption = caption;

  // Preload photo across all layout slots
  const loads = [];
  for (let i = 0; i < 5; i++) {
    appState.photos[i] = photoPath;
    loads.push(loadImage(i, photoPath));
  }
  await Promise.all(loads);

  render();

  // Signal that shot is completely drawn and ready to capture
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.__shotReady = true;
      document.documentElement.dataset.shotReady = '1';
    });
  });
}
