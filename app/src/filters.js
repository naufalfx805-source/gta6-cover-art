// filters.js — canvas visual effects for Vice Cover Studio
// Applies color-grade overlays, vignette darkening, and film-grain noise.
// All functions operate on an existing CanvasRenderingContext2D and are
// called after the photo is drawn into each panel cell.

/**
 * Apply a full-canvas gradient color-grade overlay.
 * Uses 'multiply' composite mode for a cinematic film-look colour wash.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w  canvas width
 * @param {number} h  canvas height
 * @param {object} grade  COLOR_GRADES entry from constants.js
 */
export function applyGradientOverlay(ctx, w, h, grade) {
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, hexToRgba(grade.gradientTop,    grade.gradientAlpha));
  grad.addColorStop(1, hexToRgba(grade.gradientBottom, grade.gradientAlpha));
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Apply a vignette (dark border fade) to the full canvas.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {number} strength  0 = none, 1 = very heavy
 */
export function applyVignette(ctx, w, h, strength) {
  if (!strength) return;
  const cx = w / 2;
  const cy = h / 2;
  const r  = Math.sqrt(cx * cx + cy * cy);
  const grad = ctx.createRadialGradient(cx, cy, r * 0.35, cx, cy, r);
  grad.addColorStop(0, `rgba(0,0,0,0)`);
  grad.addColorStop(1, `rgba(0,0,0,${(strength * 0.9).toFixed(2)})`);
  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Scatter fine film grain over the canvas using a seeded random pattern.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {number} amount  0 = none, 0.1 = heavy
 */
export function applyFilmGrain(ctx, w, h, amount) {
  if (!amount) return;
  // Work on a small tile and repeat — fast but still random-looking
  const tileSize = 256;
  const offscreen = new OffscreenCanvas(tileSize, tileSize);
  const octx = offscreen.getContext('2d');
  const img = octx.createImageData(tileSize, tileSize);
  const data = img.data;
  // Simple LCG for reproducible grain each frame (seed = Date.now truncated)
  let seed = 0x12345678;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
  for (let i = 0; i < data.length; i += 4) {
    const v = ((rand() - 0.5) * 255 * amount * 3) | 0;
    data[i] = data[i + 1] = data[i + 2] = 128 + v;
    data[i + 3] = 28; // very transparent
  }
  octx.putImageData(img, 0, 0);
  const pattern = ctx.createPattern(offscreen, 'repeat');
  ctx.save();
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Adjust brightness, saturation and contrast of a region using CSS filter.
 * Note: CSS filter applies to subsequent draw calls; call before drawing photo.
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} grade
 */
export function buildCssFilter(grade) {
  const b = (grade.brightness ?? 1).toFixed(2);
  const s = (grade.saturation ?? 1).toFixed(2);
  const c = (grade.contrast   ?? 1).toFixed(2);
  return `brightness(${b}) saturate(${s}) contrast(${c})`;
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

/**
 * Convert a 6-digit hex colour + alpha to an rgba() string.
 * @param {string} hex   e.g. '#ff7a00'
 * @param {number} alpha 0-1
 * @returns {string}
 */
export function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
}
