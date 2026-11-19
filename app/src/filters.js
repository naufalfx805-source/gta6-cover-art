// Image processing, color grading pipelines, and atmospheric filters for GTA 6 cover art

/**
 * Applies high-fidelity color grading, duotone gradient overlays, and shadow tone mapping to a canvas context.
 */
export function applyColorGrade(ctx, width, height, gradeConfig) {
  if (!gradeConfig) return;

  ctx.save();
  // 1. Dual Gradient Overlay (Vice Sunset / Neon Duotone)
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, gradeConfig.topColor);
  grad.addColorStop(1, gradeConfig.bottomColor);
  ctx.fillStyle = grad;
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillRect(0, 0, width, height);

  // 2. Comic shadow burn for rich ink depth
  const shadowGrad = ctx.createLinearGradient(0, height * 0.40, 0, height);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(1, 'rgba(35, 6, 32, 0.48)');
  ctx.fillStyle = shadowGrad;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

/**
 * Renders atmospheric radial vignette to focus attention toward the center and frame the collage.
 */
export function applyVignette(ctx, width, height, strength = 0.45) {
  if (strength <= 0) return;
  ctx.save();
  const radius = Math.max(width, height) * 0.72;
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, radius * 0.38,
    width / 2, height / 2, radius
  );
  vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignette.addColorStop(0.65, `rgba(12, 6, 18, ${strength * 0.40})`);
  vignette.addColorStop(1, `rgba(6, 2, 10, ${strength})`);

  ctx.fillStyle = vignette;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/**
 * Draws subtle comic halftone film grain across the canvas for authentic printed box-art texture.
 */
export function applyFilmGrain(ctx, width, height) {
  ctx.save();
  const step = 4;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.032)';
  for (let x = 0; x < width; x += step * 3) {
    for (let y = (x % (step * 5)); y < height; y += step * 4) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.038)';
  for (let x = step; x < width; x += step * 3) {
    for (let y = step + (x % (step * 3)); y < height; y += step * 4) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.restore();
}

/**
 * Draws the iconic Roman numeral "VI" watermark in Vice City neon pink/cyan.
 */
export function drawWatermarkVI(ctx, width, height) {
  ctx.save();
  const fontSize = Math.round(Math.min(width, height) * 0.42);
  ctx.font = `900 ${fontSize}px 'Arial Black', Impact, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const x = width / 2;
  const y = height * 0.48;

  // Multi-stop neon gradient
  const viGrad = ctx.createLinearGradient(x - fontSize * 0.5, y - fontSize * 0.5, x + fontSize * 0.5, y + fontSize * 0.5);
  viGrad.addColorStop(0, 'rgba(255, 42, 133, 0.28)');
  viGrad.addColorStop(0.5, 'rgba(155, 89, 182, 0.24)');
  viGrad.addColorStop(1, 'rgba(0, 229, 255, 0.26)');

  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = viGrad;
  ctx.fillText('VI', x, y);

  // Subtle luminous stroke
  ctx.lineWidth = Math.max(2, Math.round(fontSize * 0.02));
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.strokeText('VI', x, y);

  ctx.restore();
}
