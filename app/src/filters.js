// Vice Cover Studio - Filters & Procedural Vector Art
// Canvas post-processing, color grading, silhouettes, and authentic box art badges

import { COLOR_GRADES } from './constants.js';

export function hexToRgba(hex, alpha = 1) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Applies a cinematic two-tone gradient map / wash over the target region
 */
export function applyGradientOverlay(ctx, x, y, w, h, gradeKey) {
  const grade = COLOR_GRADES[gradeKey] || COLOR_GRADES['vice-sunset'];
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();

  // Create dramatic diagonal linear gradient
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, hexToRgba(grade.primary, 0.38));
  grad.addColorStop(0.5, hexToRgba(grade.secondary, 0.28));
  grad.addColorStop(1, hexToRgba(grade.accent || grade.primary, 0.35));

  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);

  // Second pass with color-dodge in highlights
  const gradHighlight = ctx.createRadialGradient(
    x + w * 0.7, y + h * 0.3, w * 0.1,
    x + w * 0.7, y + h * 0.3, w * 0.8
  );
  gradHighlight.addColorStop(0, hexToRgba(grade.primary, 0.25));
  gradHighlight.addColorStop(1, 'rgba(0,0,0,0)');

  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = gradHighlight;
  ctx.fillRect(x, y, w, h);

  ctx.restore();
}

/**
 * Darkens edges with a radial vignette
 */
export function applyVignette(ctx, w, h, strength = 0.35) {
  if (strength <= 0) return;
  ctx.save();
  const radius = Math.max(w, h) * 0.75;
  const grad = ctx.createRadialGradient(w / 2, h / 2, radius * 0.35, w / 2, h / 2, radius);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(0.7, `rgba(0,0,0,${strength * 0.6})`);
  grad.addColorStop(1, `rgba(0,0,0,${strength * 1.3})`);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Generates subtle film grain across the canvas
 */
export function applyFilmGrain(ctx, w, h, amount = 0.12) {
  if (amount <= 0) return;
  ctx.save();
  // Fast noise via small offscreen pattern for performance
  const patternCanvas = document.createElement('canvas');
  const size = 128;
  patternCanvas.width = size;
  patternCanvas.height = size;
  const pctx = patternCanvas.getContext('2d');
  if (!pctx) {
    ctx.restore();
    return;
  }

  const imgData = pctx.createImageData(size, size);
  const buf = imgData.data;
  for (let i = 0; i < buf.length; i += 4) {
    const val = (Math.random() * 255) | 0;
    buf[i] = val;
    buf[i + 1] = val;
    buf[i + 2] = val;
    buf[i + 3] = (Math.random() * (amount * 255)) | 0;
  }
  pctx.putImageData(imgData, 0, 0);

  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/**
 * Draws iconic Miami silhouette palm trees
 */
export function drawPalmSilhouette(ctx, x, y, size, leanRight = true) {
  ctx.save();
  ctx.fillStyle = '#08080c';
  ctx.strokeStyle = '#08080c';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const trunkW = size * 0.08;
  const curve = leanRight ? size * 0.35 : -size * 0.35;

  // Trunk
  ctx.beginPath();
  ctx.moveTo(x - trunkW, y);
  ctx.quadraticCurveTo(x + curve * 0.5, y - size * 0.55, x + curve, y - size);
  ctx.quadraticCurveTo(x + curve * 0.5 + trunkW * 0.5, y - size * 0.55, x + trunkW, y);
  ctx.closePath();
  ctx.fill();

  // Top fronds origin
  const crownX = x + curve;
  const crownY = y - size;

  // Frond angles
  const angles = [
    -165, -140, -110, -75, -45, -15, 10,
    -155, -125, -90, -60, -30, 0
  ];

  for (const deg of angles) {
    const rad = (deg * Math.PI) / 180;
    const len = size * (0.45 + Math.random() * 0.25);
    const endX = crownX + Math.cos(rad) * len;
    const endY = crownY + Math.sin(rad) * len * 0.65 + len * 0.25;

    ctx.beginPath();
    ctx.moveTo(crownX, crownY);
    ctx.quadraticCurveTo(
      crownX + Math.cos(rad) * len * 0.6,
      crownY + Math.sin(rad) * len * 0.4 - 10,
      endX,
      endY
    );
    ctx.lineWidth = size * 0.04;
    ctx.stroke();

    // Leaf needles
    for (let t = 0.2; t < 0.95; t += 0.08) {
      const lx = crownX + (endX - crownX) * t;
      const ly = crownY + (endY - crownY) * t;
      const leafLen = size * 0.09 * (1 - t * 0.4);

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx - leafLen * 0.6, ly + leafLen);
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + leafLen * 0.6, ly + leafLen);
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draws iconic GTA police helicopter (Maverick) vector silhouette
 */
export function drawHelicopterSilhouette(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#08080c';
  ctx.strokeStyle = '#08080c';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  const s = size / 100;

  // Main fuselage / cockpit
  ctx.beginPath();
  ctx.moveTo(10 * s, 0 * s);
  ctx.bezierCurveTo(45 * s, -15 * s, 60 * s, 5 * s, 50 * s, 25 * s);
  ctx.bezierCurveTo(35 * s, 35 * s, 5 * s, 32 * s, -15 * s, 22 * s);
  ctx.bezierCurveTo(-35 * s, 18 * s, -55 * s, 12 * s, -80 * s, 10 * s); // Tail boom
  ctx.lineTo(-85 * s, 0 * s);
  ctx.lineTo(-65 * s, 5 * s);
  ctx.bezierCurveTo(-30 * s, 5 * s, -10 * s, -12 * s, 10 * s, 0 * s);
  ctx.closePath();
  ctx.fill();

  // Tail vertical fin & tail rotor
  ctx.beginPath();
  ctx.moveTo(-80 * s, 10 * s);
  ctx.lineTo(-92 * s, -14 * s);
  ctx.lineTo(-85 * s, -16 * s);
  ctx.lineTo(-76 * s, 8 * s);
  ctx.closePath();
  ctx.fill();

  // Tail rotor blade
  ctx.beginPath();
  ctx.moveTo(-90 * s, -22 * s);
  ctx.lineTo(-88 * s, -6 * s);
  ctx.lineWidth = 2.5 * s;
  ctx.stroke();

  // Rotor mast & hub
  ctx.fillRect(15 * s, -12 * s, 5 * s, 12 * s);

  // Main rotor blur / blade
  ctx.beginPath();
  ctx.ellipse(17 * s, -14 * s, 68 * s, 3 * s, -0.05, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(8, 8, 12, 0.85)';
  ctx.fill();

  // Landing skids
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  // Struts
  ctx.moveTo(5 * s, 28 * s);
  ctx.lineTo(-2 * s, 40 * s);
  ctx.moveTo(35 * s, 28 * s);
  ctx.lineTo(28 * s, 40 * s);
  // Horizontal skid
  ctx.moveTo(-15 * s, 40 * s);
  ctx.lineTo(48 * s, 40 * s);
  ctx.quadraticCurveTo(55 * s, 40 * s, 58 * s, 34 * s);
  ctx.stroke();

  // Spotlight cone (semi-transparent neon beam)
  const spotGrad = ctx.createLinearGradient(40 * s, 25 * s, 85 * s, 95 * s);
  spotGrad.addColorStop(0, 'rgba(0, 255, 228, 0.45)');
  spotGrad.addColorStop(1, 'rgba(0, 255, 228, 0.0)');
  ctx.beginPath();
  ctx.moveTo(42 * s, 26 * s);
  ctx.lineTo(130 * s, 110 * s);
  ctx.lineTo(70 * s, 120 * s);
  ctx.closePath();
  ctx.fillStyle = spotGrad;
  ctx.fill();

  ctx.restore();
}

/**
 * Draws official ESRB-style "M - MATURE 17+" rating badge
 */
export function drawRatingBadge(ctx, x, y, h) {
  ctx.save();
  const w = h * 0.72;

  // Black background box with white border
  ctx.fillStyle = '#0a0a0c';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(2, h * 0.035);
  ctx.strokeRect(x, y, w, h);

  // Big bold "M"
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${Math.round(h * 0.44)}px "Arial Black", Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('M', x + w / 2, y + h * 0.08);

  // Divider line
  ctx.beginPath();
  ctx.moveTo(x + w * 0.08, y + h * 0.58);
  ctx.lineTo(x + w * 0.92, y + h * 0.58);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(1.5, h * 0.025);
  ctx.stroke();

  // "MATURE 17+" text
  ctx.font = `800 ${Math.round(h * 0.12)}px "Arial Black", sans-serif`;
  ctx.fillText('MATURE 17+', x + w / 2, y + h * 0.63);

  // "ESRB" tiny subtext
  ctx.font = `600 ${Math.round(h * 0.09)}px sans-serif`;
  ctx.fillStyle = '#dddddd';
  ctx.fillText('ESRB', x + w / 2, y + h * 0.81);

  ctx.restore();
}

/**
 * Draws authentic bottom billing block: rating badge, Dolby audio logo, barcode, copyright
 */
export function drawBillingBlock(ctx, W, H) {
  ctx.save();
  const blockH = Math.round(H * 0.065);
  const y = H - blockH - Math.round(H * 0.015);

  // Subdued dark translucent backing for legibility
  ctx.fillStyle = 'rgba(5, 5, 8, 0.82)';
  ctx.fillRect(0, H - blockH - Math.round(H * 0.025), W, blockH + Math.round(H * 0.025));

  // Top accent divider
  ctx.strokeStyle = '#ff7a00';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, H - blockH - Math.round(H * 0.025));
  ctx.lineTo(W, H - blockH - Math.round(H * 0.025));
  ctx.stroke();

  // 1. ESRB Rating Badge on Left
  const badgeH = Math.round(blockH * 0.9);
  const badgeX = Math.round(W * 0.03);
  const badgeY = y + (blockH - badgeH) / 2;
  drawRatingBadge(ctx, badgeX, badgeY, badgeH);

  // Rating descriptor next to badge
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 ${Math.max(10, Math.round(W * 0.011))}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('VIOLENCE · STRONG LANGUAGE', badgeX + badgeH * 0.8 + 12, y + blockH * 0.35);
  ctx.fillStyle = '#aaaaaa';
  ctx.font = `500 ${Math.max(8, Math.round(W * 0.009))}px "Helvetica Neue", Arial, sans-serif`;
  ctx.fillText('IN-GAME PURCHASES / USERS INTERACT', badgeX + badgeH * 0.8 + 12, y + blockH * 0.68);

  // 2. Barcode on Right
  const barW = Math.round(W * 0.11);
  const barH = Math.round(blockH * 0.7);
  const barX = W - barW - Math.round(W * 0.03);
  const barY = y + (blockH - barH) / 2;

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = '#000000';
  // Draw procedural vertical barcode bars
  let bx = barX + 4;
  const barPattern = [2, 1, 3, 1, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 2, 1, 2, 3];
  let pIdx = 0;
  while (bx < barX + barW - 6) {
    const pw = barPattern[pIdx % barPattern.length];
    ctx.fillRect(bx, barY + 2, pw, barH - 4);
    bx += pw + ((pIdx % 3 === 0) ? 3 : 2);
    pIdx++;
  }

  // 3. Audio / Studio Badge Left of Barcode
  const dolbyX = barX - Math.round(W * 0.12);
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${Math.max(11, Math.round(W * 0.013))}px "Arial Black", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('DOLBY ATMOS', dolbyX, y + blockH * 0.38);

  ctx.font = `700 ${Math.max(9, Math.round(W * 0.009))}px sans-serif`;
  ctx.fillStyle = '#ff7a00';
  ctx.fillText('VICE CITY SOUNDS', dolbyX, y + blockH * 0.68);

  // 4. Center Copyright Line
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = `600 ${Math.max(8, Math.round(W * 0.0095))}px "Helvetica Neue", Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('PUBLISHED BY VICE STUDIOS · 2026 ROCKSTAR ENTERTAINMENT · ORIGINAL KEY ART', W * 0.5, y + blockH * 0.52);

  ctx.restore();
}
