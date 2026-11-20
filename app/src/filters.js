// Vice Cover Studio - Image Filters & Post-processing

import { COLOR_GRADES } from './constants.js';

/**
 * Converts a hex color string to rgba format
 */
export function hexToRgba(hex, alpha = 1) {
  let cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  const num = parseInt(cleaned, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns CSS filter string for a given grade key
 */
export function buildCssFilter(gradeKey) {
  const grade = typeof gradeKey === 'string' ? COLOR_GRADES[gradeKey] : gradeKey;
  return grade?.cssFilter || 'none';
}

/**
 * Applies a cinematic colored gradient overlay matching the Vice City color grade
 */
export function applyGradientOverlay(ctx, w, h, gradeKey) {
  const grade = typeof gradeKey === 'string' ? COLOR_GRADES[gradeKey] : gradeKey;
  if (!grade || !grade.stops) return;

  ctx.save();
  // Angled diagonal gradient across panel (top-left to bottom-right)
  const grad = ctx.createLinearGradient(0, 0, w, h);
  for (const stop of grade.stops) {
    grad.addColorStop(stop.offset, stop.color);
  }

  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Applies radial vignette around the outer edges
 */
export function applyVignette(ctx, w, h, strength = 0.45) {
  if (strength <= 0) return;

  ctx.save();
  const cx = w / 2;
  const cy = h / 2;
  const radius = Math.sqrt(cx * cx + cy * cy);

  const radial = ctx.createRadialGradient(cx, cy, radius * 0.35, cx, cy, radius);
  radial.addColorStop(0, 'rgba(0, 0, 0, 0)');
  radial.addColorStop(0.7, `rgba(0, 0, 0, ${strength * 0.4})`);
  radial.addColorStop(1, `rgba(0, 0, 0, ${Math.min(1, strength * 1.1)})`);

  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// Cached grain pattern for maximum performance
let grainCanvasCache = null;

function getGrainPattern(ctx) {
  if (grainCanvasCache) {
    return ctx.createPattern(grainCanvasCache, 'repeat');
  }

  const pSize = 128;
  const pCanvas = document.createElement('canvas');
  pCanvas.width = pSize;
  pCanvas.height = pSize;
  const pCtx = pCanvas.getContext('2d');
  const imgData = pCtx.createImageData(pSize, pSize);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const val = Math.floor(Math.random() * 255);
    data[i] = val;     // R
    data[i + 1] = val; // G
    data[i + 2] = val; // B
    data[i + 3] = 40;  // subtle noise opacity
  }
  pCtx.putImageData(imgData, 0, 0);
  grainCanvasCache = pCanvas;
  return ctx.createPattern(pCanvas, 'repeat');
}

/**
 * Applies subtle retro 35mm film grain
 */
export function applyFilmGrain(ctx, w, h, amount = 0.12) {
  if (amount <= 0) return;

  try {
    ctx.save();
    const pattern = getGrainPattern(ctx);
    if (pattern) {
      ctx.globalAlpha = amount;
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  } catch (err) {
    console.warn('Film grain skipped:', err);
  }
}
