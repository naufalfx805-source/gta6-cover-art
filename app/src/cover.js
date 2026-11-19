// cover.js — multi-panel canvas renderer for Vice Cover Studio
// Renders GTA-style cover art: lays out photo panels, applies color grades,
// draws diagonal separators, then renders the bold caption with glow/shadow.

import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES } from './constants.js';
import { applyGradientOverlay, applyVignette, applyFilmGrain, buildCssFilter } from './filters.js';

// Gap between panels in pixels (at 1080px reference width)
const PANEL_GAP_PX   = 6;
// Diagonal slant for panel dividers (fraction of panel width)
const DIAGONAL_SLANT = 0.045;
// Bottom caption zone height (fraction of canvas height)
const CAPTION_ZONE_H = 0.18;

// ---------------------------------------------------------------------------
// Main render function
// ---------------------------------------------------------------------------

/**
 * Render the full cover art onto a canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {object} state  full app state from main.js
 * @param {HTMLImageElement[]} imgEls  loaded Image elements, indexed by photo slot
 */
export function renderCover(canvas, state, imgEls) {
  const layout    = LAYOUTS[state.layout]   ?? LAYOUTS['five-panel'];
  const grade     = COLOR_GRADES[state.grade] ?? COLOR_GRADES['vice-sunset'];
  const { cells } = layout;
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');

  // Fill background (shows through gaps)
  ctx.fillStyle = '#0a0008';
  ctx.fillRect(0, 0, W, H);

  // Draw each panel cell
  cells.forEach((cell, idx) => {
    // Map 0-1 fractional coords to actual pixels
    const px = Math.floor(cell.x * W);
    const py = Math.floor(cell.y * H);
    const pw = Math.ceil(cell.w  * W);
    const ph = Math.ceil(cell.h  * H);

    // Draw inner gap
    const gapX = idx === 0 ? 0 : PANEL_GAP_PX;
    const gapY = 0;
    const ix = px + gapX;
    const iy = py + gapY;
    const iw = pw - gapX;
    const ih = ph - gapY;

    // Clip to panel
    ctx.save();
    ctx.beginPath();
    // Slight diagonal cut on the right edge of each panel
    ctx.moveTo(ix, iy);
    ctx.lineTo(ix + iw - (iw * DIAGONAL_SLANT), iy);
    ctx.lineTo(ix + iw, iy + ih);
    ctx.lineTo(ix + (iw * DIAGONAL_SLANT * 0.5), iy + ih);
    ctx.closePath();
    ctx.clip();

    // Draw photo or dark placeholder
    const img = getPhotoForCell(imgEls, state, idx);
    if (img) {
      // Apply CSS filter for brightness/saturation/contrast
      ctx.filter = buildCssFilter(grade);
      drawPhotoFill(ctx, img, ix, iy, iw, ih, state.panZoom[idx] ?? { ox: 0, oy: 0, scale: 1.1 });
      ctx.filter = 'none';
    } else {
      // Placeholder gradient
      drawPlaceholder(ctx, ix, iy, iw, ih, grade, idx);
    }

    ctx.restore();
  });

  // Apply full-canvas color-grade overlays (after all panels drawn)
  applyGradientOverlay(ctx, W, H, grade);
  applyVignette(ctx, W, H, grade.vignette ?? 0.5);
  applyFilmGrain(ctx, W, H, grade.grain ?? 0.04);

  // Draw a subtle bottom bar to anchor the caption zone
  const barH = Math.floor(H * CAPTION_ZONE_H);
  const barGrad = ctx.createLinearGradient(0, H - barH, 0, H);
  barGrad.addColorStop(0, 'rgba(0,0,0,0)');
  barGrad.addColorStop(1, 'rgba(0,0,0,0.70)');
  ctx.save();
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, H - barH, W, barH);
  ctx.restore();

  // Draw panel border lines for style
  drawPanelBorders(ctx, cells, W, H);

  // Render caption
  if (state.caption && state.caption.trim()) {
    renderCaption(ctx, state.caption, W, H, grade);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Choose which loaded image to draw in a cell. */
function getPhotoForCell(imgEls, state, cellIdx) {
  if (!imgEls || imgEls.length === 0) return null;
  // Use per-cell assignment if set, else round-robin
  const assigned = state.photos && state.photos[cellIdx];
  if (assigned != null && imgEls[assigned]) return imgEls[assigned];
  if (imgEls[0]) return imgEls[0];
  return null;
}

/** Draw an image filling a rectangle, cover-fit with pan/zoom. */
function drawPhotoFill(ctx, img, x, y, w, h, pz) {
  const scale = pz.scale ?? 1;
  const imgAR = img.naturalWidth / img.naturalHeight;
  const boxAR = w / h;

  let dw, dh;
  if (imgAR > boxAR) {
    // image wider — fit by height
    dh = h * scale;
    dw = dh * imgAR;
  } else {
    // image taller — fit by width
    dw = w * scale;
    dh = dw / imgAR;
  }

  // pan offset: ox/oy are -1..1 fraction of the overflow
  const ox = (pz.ox ?? 0) * (dw - w) * 0.5;
  const oy = (pz.oy ?? 0) * (dh - h) * 0.5;
  const dx = x + (w - dw) / 2 - ox;
  const dy = y + (h - dh) / 2 - oy;

  ctx.drawImage(img, dx, dy, dw, dh);
}

/** Dark placeholder with gradient and cell number. */
function drawPlaceholder(ctx, x, y, w, h, grade, idx) {
  const grad = ctx.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, '#1a0030');
  grad.addColorStop(1, '#0a000f');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Show "drop photo" hint
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.font = `bold ${Math.max(12, Math.floor(w * 0.12))}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff88cc';
  ctx.fillText(`Photo ${idx + 1}`, x + w / 2, y + h / 2);
  ctx.restore();
}

/** Draw thin angled border lines between panels for a cinematic look. */
function drawPanelBorders(ctx, cells, W, H) {
  ctx.save();
  cells.forEach((cell, idx) => {
    if (idx === 0) return; // no left border on main panel
    const px = Math.floor(cell.x * W);
    const py = Math.floor(cell.y * H);
    const ph = Math.ceil(cell.h * H);

    ctx.beginPath();
    ctx.moveTo(px + PANEL_GAP_PX * 0.5, py);
    ctx.lineTo(px + PANEL_GAP_PX * 0.5, py + ph);
    ctx.strokeStyle = 'rgba(255,180,255,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Caption renderer — bold 3D-shadow text with glow
// ---------------------------------------------------------------------------

/**
 * Draw the caption text across the bottom of the cover.
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} W  canvas width
 * @param {number} H  canvas height
 * @param {object} grade  current color grade (drives glow color)
 */
export function renderCaption(ctx, text, W, H, grade) {
  const upper = text.toUpperCase();
  const fontSize = Math.floor(W * 0.095);
  const fontFace = '"Arial Black", "Impact", Arial, sans-serif';
  const baseY = H * 0.88;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px ${fontFace}`;

  // --- outer glow pass ---
  ctx.save();
  ctx.shadowColor   = grade.gradientTop ?? '#ff00aa';
  ctx.shadowBlur    = fontSize * 0.5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle     = 'rgba(255,255,255,0.0)';
  for (let g = 0; g < 3; g++) ctx.fillText(upper, W / 2, baseY);
  ctx.restore();

  // --- drop shadow layers (3D depth illusion) ---
  const shadowColor = 'rgba(0,0,0,0.75)';
  for (let d = 6; d >= 1; d--) {
    ctx.save();
    ctx.fillStyle = shadowColor;
    ctx.fillText(upper, W / 2 + d * 1.5, baseY + d * 1.5);
    ctx.restore();
  }

  // --- stroke outline ---
  ctx.save();
  ctx.strokeStyle = 'rgba(0,0,0,0.90)';
  ctx.lineWidth   = fontSize * 0.045;
  ctx.lineJoin    = 'round';
  ctx.strokeText(upper, W / 2, baseY);
  ctx.restore();

  // --- main fill: white-to-cream gradient ---
  const fillGrad = ctx.createLinearGradient(0, baseY - fontSize * 0.6, 0, baseY + fontSize * 0.6);
  fillGrad.addColorStop(0, '#ffffff');
  fillGrad.addColorStop(0.5, '#ffe8f0');
  fillGrad.addColorStop(1, '#ffccdd');
  ctx.fillStyle = fillGrad;
  ctx.fillText(upper, W / 2, baseY);

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Export helper: render at target resolution and return blob URL
// ---------------------------------------------------------------------------

/**
 * Render cover at a given export size and return a data URL.
 * @param {object} state
 * @param {HTMLImageElement[]} imgEls
 * @param {string} sizeKey  key of EXPORT_SIZES
 * @returns {string}  data URL (PNG)
 */
export function exportCoverDataUrl(state, imgEls, sizeKey) {
  const size = EXPORT_SIZES[sizeKey] ?? EXPORT_SIZES['square'];
  const offscreen = document.createElement('canvas');
  offscreen.width  = size.w;
  offscreen.height = size.h;
  renderCover(offscreen, state, imgEls);
  return offscreen.toDataURL('image/png');
}
