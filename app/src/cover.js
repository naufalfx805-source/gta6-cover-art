// Vice Cover Studio — Canvas Cover Art Renderer
import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES } from './constants.js';
import { applyGradientOverlay, applyVignette, applyFilmGrain, buildCssFilter } from './filters.js';

/**
 * Draws an image into a bounding box using "cover" aspect ratio.
 */
function drawImageCover(ctx, img, x, y, w, h) {
  if (!img || !img.complete || img.naturalWidth === 0) {
    ctx.fillStyle = '#1e1b2e';
    ctx.fillRect(x, y, w, h);
    return;
  }

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;
  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    sh = img.naturalHeight;
    sw = sh * boxRatio;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    sw = img.naturalWidth;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/**
 * Renders iconic GTA Vice City typography for the main caption.
 */
export function renderCaption(ctx, text, W, H, gradeKey) {
  if (!text || !text.trim()) return;

  const grade = COLOR_GRADES[gradeKey] ?? COLOR_GRADES['vice-sunset'];
  const captionText = text.trim().toUpperCase();

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Responsive font size calculated based on canvas width
  const baseFontSize = Math.round(W * 0.082);
  ctx.font = `900 ${baseFontSize}px Impact, "Arial Black", "Trebuchet MS", sans-serif`;

  const cx = W / 2;
  const cy = H * 0.86;

  // 1. Draw heavy 3D extrusion shadow (layered offsets)
  const shadowSteps = 8;
  ctx.fillStyle = '#0a0518';
  for (let i = shadowSteps; i >= 1; i--) {
    ctx.fillText(captionText, cx + i * 2, cy + i * 2.5);
  }

  // 2. Thick dark outer stroke for comic book panel separation
  ctx.lineWidth = Math.max(8, Math.round(baseFontSize * 0.16));
  ctx.strokeStyle = '#05030a';
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;
  ctx.strokeText(captionText, cx, cy);

  // 3. Vibrant neon secondary stroke
  ctx.lineWidth = Math.max(3, Math.round(baseFontSize * 0.05));
  ctx.strokeStyle = grade.primary ?? '#ff2d75';
  ctx.strokeText(captionText, cx, cy);

  // 4. Gradient text fill (sunburst / neon glow)
  const textGrad = ctx.createLinearGradient(0, cy - baseFontSize * 0.5, 0, cy + baseFontSize * 0.5);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.4, '#fff9e6');
  textGrad.addColorStop(1, grade.secondary ?? '#ffb300');

  ctx.fillStyle = textGrad;
  ctx.fillText(captionText, cx, cy);

  ctx.restore();
}

/**
 * Main render function: paints multi-panel layout, color grades, and caption onto canvas.
 */
export function renderCover(canvas, state, imgEls = []) {
  const sizeConfig = EXPORT_SIZES[state.exportSize] ?? EXPORT_SIZES['square'];
  const W = sizeConfig.w;
  const H = sizeConfig.h;

  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Canvas background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);

  const layout = LAYOUTS[state.layout] ?? LAYOUTS['five-panel'];
  const gap = state.borderWidth ?? 6;
  const halfGap = gap / 2;

  // Render each panel cell
  layout.cells.forEach((cell, index) => {
    const px = Math.round(cell.x * W) + halfGap;
    const py = Math.round(cell.y * H) + halfGap;
    const pw = Math.round(cell.w * W) - gap;
    const ph = Math.round(cell.h * H) - gap;

    if (pw <= 0 || ph <= 0) return;

    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    // Apply color grade filter for image
    ctx.filter = buildCssFilter(state.grade);

    const img = imgEls[index % imgEls.length];
    if (img) {
      drawImageCover(ctx, img, px, py, pw, ph);
    } else {
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(px, py, pw, ph);
    }
    ctx.restore();

    // Cell border outline
    ctx.save();
    ctx.lineWidth = gap;
    ctx.strokeStyle = state.borderColor ?? '#0a0a0f';
    ctx.strokeRect(px - halfGap, py - halfGap, pw + gap, ph + gap);
    ctx.restore();
  });

  // Apply color grade wash, vignette, and film grain across the composition
  applyGradientOverlay(ctx, W, H, state.grade);
  applyVignette(ctx, W, H, 0.42);
  applyFilmGrain(ctx, W, H, 0.05);

  // Outer framing border
  const outerBorder = Math.max(10, Math.round(W * 0.012));
  ctx.save();
  ctx.lineWidth = outerBorder;
  ctx.strokeStyle = '#050508';
  ctx.strokeRect(outerBorder / 2, outerBorder / 2, W - outerBorder, H - outerBorder);
  ctx.restore();

  // Bottom caption zone anchor gradient (enhances typography legibility and dramatic depth)
  ctx.save();
  const captionZoneGrad = ctx.createLinearGradient(0, H * 0.65, 0, H);
  captionZoneGrad.addColorStop(0, 'rgba(5, 3, 10, 0)');
  captionZoneGrad.addColorStop(0.5, 'rgba(5, 3, 10, 0.45)');
  captionZoneGrad.addColorStop(1, 'rgba(5, 3, 10, 0.85)');
  ctx.fillStyle = captionZoneGrad;
  ctx.fillRect(0, H * 0.65, W, H * 0.35);
  ctx.restore();

  // Render GTA cover typography caption
  renderCaption(ctx, state.caption, W, H, state.grade);
}

/**
 * Exports high-resolution cover art as a PNG Data URL.
 */
export function exportCoverDataUrl(state, imgEls = [], sizeKey = 'square') {
  const sizeConfig = EXPORT_SIZES[sizeKey] ?? EXPORT_SIZES['square'];
  const offscreen = document.createElement('canvas');
  offscreen.width = sizeConfig.w;
  offscreen.height = sizeConfig.h;

  renderCover(offscreen, { ...state, exportSize: sizeKey }, imgEls);
  return offscreen.toDataURL('image/png');
}
