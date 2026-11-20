// Vice Cover Studio — Canvas Filters and Post-Processing Effects
import { COLOR_GRADES } from './constants.js';

/**
 * Converts a hex color string to rgba string with custom alpha.
 */
export function hexToRgba(hex, alpha = 1.0) {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Returns the CSS filter string corresponding to a grade key or object.
 */
export function buildCssFilter(gradeKeyOrObj) {
  const grade = typeof gradeKeyOrObj === 'string'
    ? COLOR_GRADES[gradeKeyOrObj]
    : gradeKeyOrObj;
  return grade?.cssFilter ?? 'contrast(1.15) saturate(1.35) brightness(1.02)';
}

/**
 * Applies a cinematic Vice City gradient wash over the target canvas area.
 */
export function applyGradientOverlay(ctx, w, h, gradeKeyOrObj) {
  const grade = typeof gradeKeyOrObj === 'string'
    ? COLOR_GRADES[gradeKeyOrObj]
    : gradeKeyOrObj;
  if (!grade || !grade.gradientStops) return;

  ctx.save();
  ctx.globalCompositeOperation = 'overlay';

  const grad = ctx.createLinearGradient(0, 0, w, h);
  for (const stop of grade.gradientStops) {
    grad.addColorStop(stop.offset, stop.color);
  }

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Applies a subtle dark radial vignette to frame the cover art.
 */
export function applyVignette(ctx, w, h, strength = 0.6) {
  ctx.save();
  const cx = w / 2;
  const cy = h / 2;
  const innerRadius = Math.min(w, h) * 0.35;
  const outerRadius = Math.max(w, h) * 0.75;

  const vignette = ctx.createRadialGradient(cx, cy, innerRadius, cx, cy, outerRadius);
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(1, `rgba(0, 0, 0, ${Math.min(1.0, Math.max(0, strength))})`);

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Applies procedural film grain for gritty retro Miami print aesthetic.
 */
export function applyFilmGrain(ctx, w, h, amount = 0.08) {
  if (amount <= 0) return;
  ctx.save();
  
  // Use a small 128x128 noise pattern to keep performance snappy
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 128;
  patternCanvas.height = 128;
  const pctx = patternCanvas.getContext('2d');
  if (!pctx) {
    ctx.restore();
    return;
  }

  const imgData = pctx.createImageData(128, 128);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const val = (Math.random() * 255) | 0;
    data[i] = val;
    data[i + 1] = val;
    data[i + 2] = val;
    data[i + 3] = (Math.random() * amount * 255) | 0;
  }
  pctx.putImageData(imgData, 0, 0);

  const pattern = ctx.createPattern(patternCanvas, 'repeat');
  if (pattern) {
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}
