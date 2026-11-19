// Image processing, color grading, and filter pipelines for GTA 6 style visuals

/** Applies high-quality color grading, duotone tints, and contrast to a 2D canvas context */
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

  // 2. Subtle Color Burn for rich comic shadows
  const shadowGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
  shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGrad.addColorStop(1, 'rgba(40, 5, 30, 0.45)');
  ctx.fillStyle = shadowGrad;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}

/** Renders dynamic atmospheric vignette to frame the cover poster */
export function applyVignette(ctx, width, height, strength = 0.45) {
  if (strength <= 0) return;
  ctx.save();
  const radius = Math.max(width, height) * 0.75;
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, radius * 0.4,
    width / 2, height / 2, radius
  );
  vignette.addColorStop(0, 'rgba(0,0,0,0)');
  vignette.addColorStop(0.7, `rgba(10,5,15,${strength * 0.4})`);
  vignette.addColorStop(1, `rgba(5,2,8,${strength})`);
  
  ctx.fillStyle = vignette;
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

/** Draws subtle comic film grain / print texture onto the canvas */
export function applyFilmGrain(ctx, width, height) {
  ctx.save();
  const step = 4;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
  for (let x = 0; x < width; x += step * 3) {
    for (let y = (x % (step * 5)); y < height; y += step * 4) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let x = step; x < width; x += step * 3) {
    for (let y = step + (x % (step * 3)); y < height; y += step * 4) {
      ctx.fillRect(x, y, 1, 1);
    }
  }
  ctx.restore();
}
