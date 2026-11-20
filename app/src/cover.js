// Vice Cover Studio - Multi-panel Cover Engine & Renderer

import { LAYOUTS, COLOR_GRADES, EXPORT_SIZES, DEFAULT_STATE } from './constants.js';
import { applyGradientOverlay, applyVignette, applyFilmGrain, buildCssFilter } from './filters.js';

/**
 * Renders the entire GTA-style cover onto a canvas
 */
export function renderCover(canvas, state = DEFAULT_STATE, imgEls = {}) {
  const sizeConfig = EXPORT_SIZES[state.exportSize] || EXPORT_SIZES.square;
  const W = sizeConfig.width;
  const H = sizeConfig.height;

  if (canvas.width !== W || canvas.height !== H) {
    canvas.width = W;
    canvas.height = H;
  }

  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Base background
  ctx.fillStyle = '#0a0a0f';
  ctx.fillRect(0, 0, W, H);

  const layout = LAYOUTS[state.layout] || LAYOUTS['five-panel'];
  const gradeKey = state.grade || 'vice-sunset';
  const grade = COLOR_GRADES[gradeKey] || COLOR_GRADES['vice-sunset'];
  const borderWidth = state.borderWidth ?? 6;
  const borderColor = state.borderColor ?? '#0a0a0f';

  // 1. Render each layout panel
  for (const panel of layout.panels) {
    const px = Math.round(panel.x * W);
    const py = Math.round(panel.y * H);
    const pw = Math.round(panel.w * W);
    const ph = Math.round(panel.h * H);

    ctx.save();
    ctx.beginPath();
    ctx.rect(px, py, pw, ph);
    ctx.clip();

    const img = imgEls[panel.id] || imgEls[0];
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.filter = buildCssFilter(gradeKey);

      // Object-cover calculation with Pan/Zoom
      const pz = state.panZoom?.[panel.id] || { zoom: 1, panX: 0, panY: 0 };
      const zoom = Math.max(0.5, pz.zoom || 1);
      const panX = pz.panX || 0;
      const panY = pz.panY || 0;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const panelAspect = pw / ph;

      let drawW, drawH;
      if (imgAspect > panelAspect) {
        drawH = ph * zoom;
        drawW = drawH * imgAspect;
      } else {
        drawW = pw * zoom;
        drawH = drawW / imgAspect;
      }

      const dx = px + (pw - drawW) / 2 + (panX * pw);
      const dy = py + (ph - drawH) / 2 + (panY * ph);

      ctx.drawImage(img, dx, dy, drawW, drawH);
      ctx.restore();
    } else {
      // Fallback placeholder pattern
      ctx.fillStyle = '#1c1b24';
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.font = 'bold 20px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`[ ${panel.name} ]`, px + pw / 2, py + ph / 2);
    }

    // Panel gradient color grade
    ctx.save();
    ctx.translate(px, py);
    applyGradientOverlay(ctx, pw, ph, grade);
    ctx.restore();

    ctx.restore();

    // Panel border
    if (borderWidth > 0) {
      ctx.save();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.strokeRect(px, py, pw, ph);
      ctx.restore();
    }
  }

  // 2. Global cinematic vignette and 35mm grain
  applyVignette(ctx, W, H, state.vignetteAmount ?? grade.vignette);
  applyFilmGrain(ctx, W, H, state.grainAmount ?? grade.grain);

  // 3. Canvas outer border
  if (borderWidth > 0) {
    ctx.save();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth * 2;
    ctx.strokeRect(0, 0, W, H);
    ctx.restore();
  }

  // 4. Dark gradient backdrop for title anchor readability
  ctx.save();
  const titleBackdrop = ctx.createLinearGradient(0, H * 0.70, 0, H);
  titleBackdrop.addColorStop(0, 'rgba(5, 5, 10, 0)');
  titleBackdrop.addColorStop(0.5, 'rgba(5, 5, 10, 0.45)');
  titleBackdrop.addColorStop(1, 'rgba(5, 5, 10, 0.85)');
  ctx.fillStyle = titleBackdrop;
  ctx.fillRect(0, H * 0.70, W, H * 0.30);
  ctx.restore();

  // 5. Render Vice City caption & typography
  renderCaption(ctx, state.caption, W, H, grade, state.subcaption);
}

/**
 * Renders iconic GTA 3D typography with neon glow and layered extrusion
 */
export function renderCaption(ctx, text, W, H, grade, subtext = '') {
  if (!text || text.trim() === '') return;

  const title = text.toUpperCase().trim();
  const sub = (subtext || '').toUpperCase().trim();

  ctx.save();

  // Dynamic font sizing based on canvas width and text length
  const baseFontSize = Math.min(Math.round(W * 0.088), Math.round((W * 0.9) / (title.length * 0.48)));
  const fontSize = Math.max(36, baseFontSize);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${fontSize}px "Impact", "Arial Black", "Montserrat", sans-serif`;

  const centerX = W / 2;
  const centerY = H * 0.88;

  // Layered 3D extrusion shadow (depth offset)
  const depth = Math.round(fontSize * 0.12);
  ctx.fillStyle = '#05050a';
  for (let d = depth; d > 0; d--) {
    ctx.fillText(title, centerX + d * 0.8, centerY + d * 1.0);
  }

  // Neon outer glow pass
  ctx.save();
  ctx.shadowColor = grade.primary || '#ff007f';
  ctx.shadowBlur = Math.round(fontSize * 0.35);
  ctx.strokeStyle = '#05050a';
  ctx.lineWidth = Math.round(fontSize * 0.14);
  ctx.strokeText(title, centerX, centerY);
  ctx.restore();

  // Crisp black outline
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.round(fontSize * 0.09);
  ctx.strokeText(title, centerX, centerY);

  // Text fill with vertical Vice neon gradient
  const textGrad = ctx.createLinearGradient(0, centerY - fontSize * 0.5, 0, centerY + fontSize * 0.5);
  textGrad.addColorStop(0, '#ffffff');
  textGrad.addColorStop(0.45, '#fff0f8');
  textGrad.addColorStop(0.55, grade.primary || '#ff007f');
  textGrad.addColorStop(1, grade.secondary || '#00f0ff');

  ctx.fillStyle = textGrad;
  ctx.fillText(title, centerX, centerY);

  // Optional subtitle banner (e.g. "COMING SOON" or "VICE CITY")
  if (sub) {
    const subFontSize = Math.max(14, Math.round(fontSize * 0.28));
    ctx.font = `800 ${subFontSize}px "Impact", "Arial Black", sans-serif`;
    ctx.letterSpacing = '6px';
    const subY = centerY + fontSize * 0.58;

    // Subtitle badge
    const subMetrics = ctx.measureText(sub);
    const padX = subFontSize * 1.2;
    const padY = subFontSize * 0.35;
    const badgeW = subMetrics.width + padX * 2;
    const badgeH = subFontSize + padY * 2;

    ctx.fillStyle = 'rgba(5, 5, 10, 0.85)';
    ctx.fillRect(centerX - badgeW / 2, subY - badgeH / 2, badgeW, badgeH);

    ctx.strokeStyle = grade.primary || '#ff007f';
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - badgeW / 2, subY - badgeH / 2, badgeW, badgeH);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(sub, centerX, subY + 1);
  }

  ctx.restore();
}

/**
 * Exports current cover to data URL PNG at specified size
 */
export function exportCoverDataUrl(state, imgEls, sizeKey = 'square') {
  const target = EXPORT_SIZES[sizeKey] || EXPORT_SIZES.square;
  const offCanvas = document.createElement('canvas');
  offCanvas.width = target.width;
  offCanvas.height = target.height;

  renderCover(offCanvas, { ...state, exportSize: sizeKey }, imgEls);
  return offCanvas.toDataURL('image/png');
}
