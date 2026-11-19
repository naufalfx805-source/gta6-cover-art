// Main GTA 6 Cover Art Canvas Renderer
// Renders authentic multi-panel comic collages, color grading, extruded 3D typography, and badges.

import { LAYOUTS, COLOR_GRADES, DEFAULT_STATE } from './constants.js';
import { applyColorGrade, applyVignette, applyFilmGrain, drawWatermarkVI } from './filters.js';

/**
 * Draws a complete GTA 6 style cover art.
 * Compatible with simple invocations (canvas, photo, caption) and advanced state objects.
 */
export function drawCover(canvas, photoOrState, captionText) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Unpack state or assemble default configuration
  let state;
  let singlePhoto = null;
  let panelPhotos = {};

  if (photoOrState && typeof photoOrState === 'object' && 'layoutId' in photoOrState) {
    state = { ...DEFAULT_STATE, ...photoOrState };
    panelPhotos = state.panelPhotos || {};
    singlePhoto = state.masterPhoto || null;
  } else {
    singlePhoto = photoOrState || null;
    state = {
      ...DEFAULT_STATE,
      title: captionText ? captionText.trim().toUpperCase() : 'VICE HEIST'
    };
  }

  const layout = LAYOUTS[state.layoutId] || LAYOUTS.five_panel;
  const gradeConfig = COLOR_GRADES[state.colorGrade] || COLOR_GRADES.sunset_vice;
  const borderWidth = state.borderWidth ?? 8;
  const borderColor = state.borderColor ?? '#0a0812';

  // 1. Base dark background
  ctx.fillStyle = '#080510';
  ctx.fillRect(0, 0, w, h);

  // 2. Render each comic panel
  layout.panels.forEach((p, idx) => {
    const px = Math.round(p.x * w);
    const py = Math.round(p.y * h);
    const pw = Math.round(p.w * w);
    const ph = Math.round(p.h * h);

    ctx.save();
    // Inner panel clipping (inset for border line joints)
    ctx.beginPath();
    ctx.rect(px + borderWidth / 2, py + borderWidth / 2, Math.max(1, pw - borderWidth), Math.max(1, ph - borderWidth));
    ctx.clip();

    // Select photo for this panel (panel-specific > single master > fallback)
    const img = panelPhotos[idx] || singlePhoto;

    if (img && img.naturalWidth) {
      const zoom = (state.panelZoom && state.panelZoom[idx]) ? state.panelZoom[idx] : 1.0;
      const panX = (state.panelPanX && state.panelPanX[idx]) ? state.panelPanX[idx] : 0;
      const panY = (state.panelPanY && state.panelPanY[idx]) ? state.panelPanY[idx] : 0;

      const scale = Math.max(pw / img.naturalWidth, ph / img.naturalHeight) * zoom;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = px + (pw - dw) / 2 + (panX * pw);
      const dy = py + (ph - dh) / 2 + (panY * ph);

      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      // Elegant procedural artwork for unassigned panels
      drawPlaceholderPanel(ctx, px, py, pw, ph, idx, p.tag);
    }

    // Panel-level color grading
    applyColorGrade(ctx, w, h, gradeConfig);
    ctx.restore();

    // Draw comic divider border around panel
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.strokeRect(px, py, pw, ph);
  });

  // Outer canvas bounding frame
  ctx.lineWidth = borderWidth * 2;
  ctx.strokeStyle = borderColor;
  ctx.strokeRect(0, 0, w, h);

  // 3. Iconic "VI" Watermark
  if (state.showWatermarkVI !== false) {
    drawWatermarkVI(ctx, w, h);
  }

  // 4. Global post-processing: atmospheric vignette & film texture
  applyVignette(ctx, w, h, state.vignetteStrength ?? 0.45);
  if (state.grain) {
    applyFilmGrain(ctx, w, h);
  }

  // 5. Header Banner / Location & Year Stamp
  drawHeaderBanner(ctx, w, h, state.location);

  // 6. Typography: Grand Title & Subtitle
  drawTitleTypography(ctx, w, h, state.title, state.subtitle);

  // 7. Corner Rating / Parody Emblem
  if (state.badgeStyle && state.badgeStyle !== 'none') {
    drawCornerBadge(ctx, w, h, state.badgeStyle);
  }
}

/** Draws stylish procedural artwork when an image isn't loaded */
function drawPlaceholderPanel(ctx, x, y, w, h, idx, label) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  if (idx % 3 === 0) {
    grad.addColorStop(0, '#ff5e3a');
    grad.addColorStop(1, '#660055');
  } else if (idx % 3 === 1) {
    grad.addColorStop(0, '#00d2ff');
    grad.addColorStop(1, '#1b004a');
  } else {
    grad.addColorStop(0, '#fc6767');
    grad.addColorStop(1, '#ec008c');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Stylized sun disc silhouette
  ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.45, Math.min(w, h) * 0.24, 0, Math.PI * 2);
  ctx.fill();

  // Panel label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = `700 ${Math.max(12, Math.round(w * 0.055))}px Impact, 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((label || `PANEL ${idx + 1}`).toUpperCase(), x + w / 2, y + h * 0.78);
}

/** Draws the top banner / location stamp */
function drawHeaderBanner(ctx, w, h, locationText) {
  if (!locationText) return;
  const text = locationText.trim().toUpperCase();
  const fontSize = Math.max(14, Math.round(h * 0.024));

  ctx.save();
  ctx.font = `bold ${fontSize}px Impact, 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const textWidth = ctx.measureText(text).width;
  const paddingX = fontSize * 1.5;
  const barY = Math.round(h * 0.04);
  const barH = fontSize * 1.8;

  // Background banner pill
  ctx.fillStyle = 'rgba(10, 5, 20, 0.90)';
  ctx.beginPath();
  ctx.roundRect((w - textWidth - paddingX * 2) / 2, barY, textWidth + paddingX * 2, barH, 4);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#f5b041';
  ctx.stroke();

  // Golden text
  ctx.fillStyle = '#ffde59';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 4;
  ctx.fillText(text, w / 2, barY + (barH - fontSize) / 2);
  ctx.restore();
}

/** Draws heavy bold 3D extruded title and subtitle */
function drawTitleTypography(ctx, w, h, titleText, subtitleText) {
  const title = (titleText || 'VICE HEIST').trim().toUpperCase();
  const subtitle = (subtitleText || '').trim().toUpperCase();

  ctx.save();
  let titleSize = Math.round(h * 0.125);
  ctx.font = `900 ${titleSize}px Impact, 'Arial Black', sans-serif`;

  // Scale down title font to fit comfortably within boundaries
  while (ctx.measureText(title).width > w * 0.88 && titleSize > 24) {
    titleSize -= 3;
    ctx.font = `900 ${titleSize}px Impact, 'Arial Black', sans-serif`;
  }

  const titleY = h - Math.round(h * 0.15);

  // 1. Extruded 3D Shadow (multi-pass down-right offset)
  const extrusionDepth = Math.max(4, Math.round(titleSize * 0.10));
  ctx.fillStyle = '#05020a';
  for (let i = extrusionDepth; i >= 1; i--) {
    ctx.fillText(title, w / 2 + i * 1.4, titleY + i * 1.4);
  }

  // 2. Thick Outer Outline Stroke
  ctx.lineWidth = Math.max(6, Math.round(titleSize * 0.12));
  ctx.strokeStyle = '#05020a';
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 2;
  ctx.textAlign = 'center';
  ctx.strokeText(title, w / 2, titleY);

  // 3. Inner Gradient Fill (Pure crisp white to sunset gold)
  const titleGrad = ctx.createLinearGradient(0, titleY - titleSize, 0, titleY);
  titleGrad.addColorStop(0, '#ffffff');
  titleGrad.addColorStop(0.55, '#ffffff');
  titleGrad.addColorStop(1, '#ffd085');
  ctx.fillStyle = titleGrad;
  ctx.fillText(title, w / 2, titleY);

  // 4. Secondary Subtitle Pill
  if (subtitle) {
    const subSize = Math.max(12, Math.round(titleSize * 0.28));
    ctx.font = `700 ${subSize}px Impact, 'Arial Black', sans-serif`;
    const subWidth = ctx.measureText(subtitle).width;
    const subY = titleY + subSize * 1.35;
    const pad = subSize * 0.8;

    // Dark pill container
    ctx.fillStyle = 'rgba(8, 4, 15, 0.92)';
    ctx.beginPath();
    ctx.roundRect((w - subWidth - pad * 2) / 2, subY - subSize * 0.85, subWidth + pad * 2, subSize * 1.5, 3);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#e74c3c';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.fillText(subtitle, w / 2, subY);
  }

  ctx.restore();
}

/** Draws an authentic parody sticker/badge in the bottom corner */
function drawCornerBadge(ctx, w, h, style) {
  ctx.save();
  const bw = Math.round(w * 0.18);
  const bh = Math.round(bw * 0.62);
  const bx = Math.round(w * 0.05);
  const by = Math.round(h * 0.88);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(bx, by, bw, bh);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#000000';
  ctx.strokeRect(bx, by, bw, bh);

  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  if (style === 'parental') {
    ctx.font = `900 ${Math.round(bh * 0.24)}px Arial, sans-serif`;
    ctx.fillText('PARENTAL', bx + bw / 2, by + bh * 0.10);
    ctx.font = `900 ${Math.round(bh * 0.28)}px Impact, sans-serif`;
    ctx.fillText('ADVISORY', bx + bw / 2, by + bh * 0.35);
    ctx.font = `700 ${Math.round(bh * 0.16)}px Arial, sans-serif`;
    ctx.fillText('EXPLICIT ARTWORK', bx + bw / 2, by + bh * 0.68);
  } else if (style === 'edition') {
    ctx.font = `900 ${Math.round(bh * 0.30)}px Impact, sans-serif`;
    ctx.fillText('SPECIAL EDITION', bx + bw / 2, by + bh * 0.20);
    ctx.font = `700 ${Math.round(bh * 0.20)}px Arial, sans-serif`;
    ctx.fillText('AI AGENT • 2026', bx + bw / 2, by + bh * 0.60);
  } else if (style === 'star') {
    ctx.font = `900 ${Math.round(bh * 0.32)}px Impact, sans-serif`;
    ctx.fillText('★ VICE CITY ★', bx + bw / 2, by + bh * 0.22);
    ctx.font = `700 ${Math.round(bh * 0.18)}px Arial, sans-serif`;
    ctx.fillText('OFFICIAL COVER', bx + bw / 2, by + bh * 0.62);
  }
  ctx.restore();
}
