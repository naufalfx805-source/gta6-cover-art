// Vice Cover Studio - Cover Art Renderer
// High-octane GTA VI cover composition: comic panels, vector silhouettes, 3D typography, billing block

import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES } from './constants.js';
import {
  applyGradientOverlay,
  applyVignette,
  applyFilmGrain,
  drawPalmSilhouette,
  drawHelicopterSilhouette,
  drawBillingBlock,
} from './filters.js';

/**
 * Draws image with "object-fit: cover" into target rect (rx, ry, rw, rh)
 */
function drawImageCover(ctx, img, rx, ry, rw, rh, panX = 0, panY = 0, zoom = 1.0) {
  if (!img || !img.width || !img.height) return;

  const imgAspect = img.width / img.height;
  const rectAspect = rw / rh;

  let sw, sh;
  if (imgAspect > rectAspect) {
    sh = img.height / zoom;
    sw = sh * rectAspect;
  } else {
    sw = img.width / zoom;
    sh = sw / rectAspect;
  }

  // Account for pan (-1 to 1)
  const maxPanX = Math.max(0, (img.width - sw) / 2);
  const maxPanY = Math.max(0, (img.height - sh) / 2);
  const sx = (img.width - sw) / 2 + panX * maxPanX;
  const sy = (img.height - sh) / 2 + panY * maxPanY;

  ctx.drawImage(img, sx, sy, sw, sh, rx, ry, rw, rh);
}

/**
 * Renders the iconic GTA VI Roman Numeral "VI" badge
 */
function drawViBadge(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  const text = 'VI';
  ctx.font = `900 ${Math.round(size)}px "Impact", "Arial Black", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Neon pink / cyan outer glow
  ctx.shadowColor = '#ff0077';
  ctx.shadowBlur = 18;
  ctx.lineWidth = size * 0.14;
  ctx.strokeStyle = '#050508';
  ctx.strokeText(text, 0, 0);

  // Secondary cyan glow with offset depth
  ctx.shadowColor = '#00ffe4';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.lineWidth = size * 0.08;
  ctx.strokeStyle = '#ff0077';
  ctx.strokeText(text, 0, 0);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Inner fill gradient
  const viGrad = ctx.createLinearGradient(0, 0, size * 0.8, size);
  viGrad.addColorStop(0, '#ffffff');
  viGrad.addColorStop(0.35, '#ff70a6');
  viGrad.addColorStop(0.7, '#ff007f');
  viGrad.addColorStop(1, '#7928ca');

  ctx.shadowBlur = 0;
  ctx.fillStyle = viGrad;
  ctx.fillText(text, 0, 0);

  // Specular highlight line
  ctx.lineWidth = size * 0.025;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.strokeText(text, 0, 0);

  ctx.restore();
}

/**
 * Renders heavy 3D extruded two-tier GTA title
 */
function drawTitleTypography(ctx, caption, subtitle, W, H) {
  if (!caption && !subtitle) return;
  ctx.save();

  const centerX = W * 0.5;
  const titleY = Math.round(H * 0.76);

  // 1. Main Title with 3D Extrusion
  if (caption) {
    const mainText = caption.toUpperCase();
    const fontSize = Math.min(Math.round(W * 0.092), Math.round(H * 0.095));
    ctx.font = `900 ${fontSize}px "Impact", "Arial Black", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const depth = Math.round(fontSize * 0.12);
    // Extrusion passes (dark purple / black shadow stack)
    for (let d = depth; d >= 1; d--) {
      ctx.fillStyle = d === depth ? 'rgba(0, 0, 0, 0.95)' : 'rgba(20, 8, 30, 0.9)';
      ctx.fillText(mainText, centerX + d * 1.2, titleY + d * 1.5);
    }

    // Heavy black outline
    ctx.lineWidth = Math.round(fontSize * 0.16);
    ctx.strokeStyle = '#020204';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 3;
    ctx.strokeText(mainText, centerX, titleY);

    // Neon glow stroke
    ctx.shadowColor = '#c0188c';
    ctx.shadowBlur = 16;
    ctx.lineWidth = Math.round(fontSize * 0.06);
    ctx.strokeStyle = '#ff7a00';
    ctx.strokeText(mainText, centerX, titleY);

    // Front face gradient: warm cream to rich gold/orange
    const faceGrad = ctx.createLinearGradient(0, titleY - fontSize * 0.5, 0, titleY + fontSize * 0.5);
    faceGrad.addColorStop(0, '#ffffff');
    faceGrad.addColorStop(0.18, '#fff9e6');
    faceGrad.addColorStop(0.5, '#ffd152');
    faceGrad.addColorStop(0.82, '#ff8c00');
    faceGrad.addColorStop(1, '#e03e00');

    ctx.shadowBlur = 0;
    ctx.fillStyle = faceGrad;
    ctx.fillText(mainText, centerX, titleY);

    // Dual-pass crisp inner specular highlight
    ctx.lineWidth = Math.max(1, Math.round(fontSize * 0.022));
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.strokeText(mainText, centerX, titleY);

    // Subtle inner golden bevel accent
    ctx.lineWidth = Math.max(1, Math.round(fontSize * 0.01));
    ctx.strokeStyle = 'rgba(255, 245, 180, 0.6)';
    ctx.strokeText(mainText, centerX - 0.5, titleY - 0.5);
  }

  // 2. Subtitle with wide letter tracking
  if (subtitle) {
    const subText = subtitle.toUpperCase();
    const subFontSize = Math.min(Math.round(W * 0.032), Math.round(H * 0.034));
    const subY = titleY + Math.round(H * 0.062);

    ctx.font = `800 ${subFontSize}px "Arial Black", "Helvetica Neue", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Letter spacing simulation
    const spaced = subText.split('').join('  ');

    // Dark pill container behind subtitle for maximum legibility
    const metrics = ctx.measureText(spaced);
    const pillW = metrics.width + subFontSize * 2.5;
    const pillH = subFontSize * 1.7;

    ctx.fillStyle = 'rgba(10, 8, 16, 0.88)';
    ctx.beginPath();
    ctx.roundRect(centerX - pillW / 2, subY - pillH / 2, pillW, pillH, pillH * 0.25);
    ctx.fill();

    ctx.strokeStyle = '#c0188c';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Subtitle text fill
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(spaced, centerX, subY);
  }

  ctx.restore();
}

/**
 * Main render function for canvas
 */
export function renderCover(canvas, state, imgEls = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  // Clear canvas
  ctx.fillStyle = '#060609';
  ctx.fillRect(0, 0, W, H);

  // Selected layout definition
  const layout = LAYOUTS[state.layout] || LAYOUTS['five-panel'];
  const borderWidth = Math.max(6, Math.round(Math.min(W, H) * 0.009)); // 8px-10px comic divider

  // Draw each panel
  layout.panels.forEach((p, idx) => {
    const px = Math.round(p.x * W);
    const py = Math.round(p.y * H);
    const pw = Math.round(p.w * W);
    const ph = Math.round(p.h * H);

    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    // Determine photo source for panel
    let img = imgEls[p.id] || imgEls[idx] || imgEls['hero'] || imgEls[0];

    if (img && img.complete && img.naturalWidth > 0) {
      // Photo exists
      const pz = (state.panZoom && state.panZoom[p.id]) || { x: 0, y: 0, zoom: 1.0 };
      drawImageCover(ctx, img, px, py, pw, ph, pz.x, pz.y, pz.zoom);
    } else {
      // Atmospheric fallback sunset background
      const bgGrad = ctx.createLinearGradient(px, py, px + pw, py + ph);
      bgGrad.addColorStop(0, '#c0188c');
      bgGrad.addColorStop(0.5, '#7928ca');
      bgGrad.addColorStop(1, '#ff7a00');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(px, py, pw, ph);
    }

    // Role-specific silhouettes and atmospheric overlays
    if (p.role === 'palms-sunset' || (state.layout === 'five-panel' && p.id === 4)) {
      // Palm tree silhouette in bottom right panel
      const palmSize = Math.round(ph * 0.78);
      drawPalmSilhouette(ctx, px + pw * 0.35, py + ph, palmSize, true);
      drawPalmSilhouette(ctx, px + pw * 0.72, py + ph, palmSize * 0.85, false);
    } else if (p.role === 'sky-chopper' || (state.layout === 'five-panel' && p.id === 1)) {
      // Police helicopter in top right sky panel
      const chopSize = Math.round(pw * 0.32);
      drawHelicopterSilhouette(ctx, px + pw * 0.52, py + ph * 0.38, chopSize);
    }

    // Panel-level color grading overlay
    applyGradientOverlay(ctx, px, py, pw, ph, state.grade);

    ctx.restore();

    // Solid black panel border
    ctx.strokeStyle = '#020204';
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(px, py, pw, ph);
  });

  // Global outer framing border
  ctx.strokeStyle = '#020204';
  ctx.lineWidth = borderWidth * 2;
  ctx.strokeRect(0, 0, W, H);

  // Global post-processing: Vignette and Film Grain
  applyVignette(ctx, W, H, state.vignette ?? 0.35);
  applyFilmGrain(ctx, W, H, state.grain ?? 0.12);

  // GTA VI Roman numeral badge in top-left
  const badgeSize = Math.max(48, Math.round(Math.min(W, H) * 0.085));
  drawViBadge(ctx, Math.round(W * 0.04), Math.round(H * 0.04), badgeSize);

  // Two-tier typography in lower center
  drawTitleTypography(ctx, state.caption, state.subtitle, W, H);

  // Authentic Billing Block at the bottom
  drawBillingBlock(ctx, W, H);
}

/**
 * Exports current cover art state to full resolution PNG data URL
 */
export function exportCoverDataUrl(state, imgEls, sizeKey = 'square') {
  const spec = EXPORT_SIZES[sizeKey] || EXPORT_SIZES.square;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = spec.w;
  offCanvas.height = spec.h;
  renderCover(offCanvas, state, imgEls);
  return offCanvas.toDataURL('image/png');
}
