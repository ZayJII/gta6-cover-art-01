/**
 * NEON FOLIO — Cover rendering engine
 * Multi-panel GTA-style cover art with custom lettering, colour grades, and photo crops
 */

// ============================================================
// Layout presets: each defines panels as { x, y, w, h } in 0..1 normalized coordinates
// Hero panel is always first (index 0), roughly 2/3 of the frame
// ============================================================
export const LAYOUTS = {
  'hero-left': [
    { x: 0.015, y: 0.015, w: 0.64, h: 0.97 },           // Hero left
    { x: 0.67, y: 0.015, w: 0.315, h: 0.315 },         // Top right
    { x: 0.67, y: 0.345, w: 0.315, h: 0.315 },         // Mid right
    { x: 0.67, y: 0.675, w: 0.315, h: 0.315 }          // Bottom right
  ],
  'hero-right': [
    { x: 0.345, y: 0.015, w: 0.64, h: 0.97 },          // Hero right
    { x: 0.015, y: 0.015, w: 0.315, h: 0.315 },        // Top left
    { x: 0.015, y: 0.345, w: 0.315, h: 0.315 },        // Mid left
    { x: 0.015, y: 0.675, w: 0.315, h: 0.315 }         // Bottom left
  ],
  'hero-top': [
    { x: 0.015, y: 0.015, w: 0.97, h: 0.64 },          // Hero top
    { x: 0.015, y: 0.67, w: 0.315, h: 0.315 },         // Bottom left
    { x: 0.345, y: 0.67, w: 0.315, h: 0.315 },         // Bottom mid
    { x: 0.675, y: 0.67, w: 0.315, h: 0.315 }          // Bottom right
  ],
  'hero-bottom': [
    { x: 0.015, y: 0.345, w: 0.97, h: 0.64 },          // Hero bottom
    { x: 0.015, y: 0.015, w: 0.315, h: 0.315 },        // Top left
    { x: 0.345, y: 0.015, w: 0.315, h: 0.315 },        // Top mid
    { x: 0.675, y: 0.015, w: 0.315, h: 0.315 }         // Top right
  ]
};

// ============================================================
// Colour grade definitions — each grade is a set of parameters for the shader-like effect
// ============================================================
export const GRADES = {
  'vice-sunset': {
    name: 'Vice Sunset',
    // Gradient stops for the colour grade overlay (applied as a soft-light / overlay blend)
    gradient: [
      { stop: 0.00, color: [0x3B, 0x0A, 0x5C, 0.00] },   // Deep purple transparent
      { stop: 0.25, color: [0x7B, 0x2C, 0xBF, 0.15] },   // Campaign violet
      { stop: 0.50, color: [0xFF, 0x2D, 0x95, 0.25] },   // Magenta glow
      { stop: 0.75, color: [0xFF, 0x4F, 0xA3, 0.30] },   // Hot pink
      { stop: 1.00, color: [0xFF, 0x6B, 0x2B, 0.40] }    // Sunset orange
    ],
    // Shadow tint (added to dark areas)
    shadowTint: [0x0A, 0x10, 0x20, 0.5],
    // Highlight boost (added to bright areas)
    highlightBoost: [0xFF, 0xE0, 0x8A, 0.15],
    // Chromatic aberration strength
    chroma: 0.004,
    // Grain opacity
    grain: 0.08,
    // Bloom threshold and strength
    bloom: { threshold: 0.75, strength: 0.35 },
    // Rule/border color
    ruleColor: '#F5E6C8',
    // Caption colors
    captionFill: '#F5E6C8',
    captionStroke: '#0A1020',
    captionShadow: 'rgba(10, 16, 32, 0.9)'
  },
  'neon-night': {
    name: 'Neon Night',
    gradient: [
      { stop: 0.00, color: [0x0B, 0x1D, 0x4A, 0.00] },
      { stop: 0.25, color: [0x00, 0xE5, 0xFF, 0.15] },
      { stop: 0.50, color: [0xFF, 0x2D, 0x95, 0.25] },
      { stop: 0.75, color: [0xFF, 0x2D, 0x95, 0.30] },
      { stop: 1.00, color: [0xFF, 0xE0, 0x8A, 0.35] }
    ],
    shadowTint: [0x0A, 0x10, 0x20, 0.6],
    highlightBoost: [0x00, 0xE5, 0xFF, 0.2],
    chroma: 0.006,
    grain: 0.10,
    bloom: { threshold: 0.70, strength: 0.45 },
    ruleColor: '#00E5FF',
    captionFill: '#00E5FF',
    captionStroke: '#0B1D4A',
    captionShadow: 'rgba(11, 29, 74, 0.95)'
  },
  'palm-gold': {
    name: 'Palm Gold',
    gradient: [
      { stop: 0.00, color: [0x1A, 0x3A, 0x4A, 0.00] },
      { stop: 0.25, color: [0x40, 0xE0, 0xD0, 0.15] },
      { stop: 0.50, color: [0xF4, 0xA2, 0x61, 0.25] },
      { stop: 0.75, color: [0xFF, 0x7A, 0x62, 0.30] },
      { stop: 1.00, color: [0xFF, 0xE0, 0x8A, 0.40] }
    ],
    shadowTint: [0x1A, 0x3A, 0x4A, 0.5],
    highlightBoost: [0xFF, 0xE0, 0x8A, 0.25],
    chroma: 0.003,
    grain: 0.06,
    bloom: { threshold: 0.80, strength: 0.25 },
    ruleColor: '#FFE08A',
    captionFill: '#FFE08A',
    captionStroke: '#1A3A4A',
    captionShadow: 'rgba(26, 58, 74, 0.9)'
  }
};

// ============================================================
// Export sizes
// ============================================================
export const EXPORT_SIZES = {
  '1080x1080': { width: 1080, height: 1080 },
  '1080x1350': { width: 1080, height: 1350 },
  '1920x1080': { width: 1920, height: 1080 }
};

// ============================================================
// Custom lettering — draws stacked condensed capitals with effects
// ============================================================
const LETTER_WIDTH_RATIO = 0.52;   // Condensed
const LETTER_SPACING_RATIO = -0.02; // Tight tracking
const LINE_HEIGHT_RATIO = 1.05;    // Tight leading

/**
 * Draws the caption as custom stacked lettering on the canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} text - Caption text (already uppercase)
 * @param {number} x - Left X position (left edge of caption area)
 * @param {number} y - Baseline Y position (bottom of text block including shadow)
 * @param {number} maxWidth - Maximum width for the text block
 * @param {number} maxHeight - Maximum height for the text block
 * @param {object} style - Caption style from grade
 * @returns {object} { width, height, lines: [{text, x, y, width}] }
 */
export function drawCaption(ctx, text, x, y, maxWidth, maxHeight, style) {
  if (!text.trim()) return { width: 0, height: 0, lines: [] };

  const words = text.trim().split(/\s+/);

  // Calculate font size that fits - start with a reasonable estimate
  let fontSize = Math.min(maxWidth * 0.11, maxHeight * 0.4);
  const minFontSize = 16;

  ctx.textBaseline = 'alphabetic';

  // Binary search for best font size
  let low = minFontSize, high = fontSize * 2;
  let bestSize = minFontSize;
  let bestLines = [];

  for (let iter = 0; iter < 25; iter++) {
    const mid = (low + high) / 2;
    ctx.font = `700 ${mid}px 'Bungee', cursive`;

    // Wrap words into lines - greedy algorithm
    const testLines = [];
    let testLine = '';
    for (const word of words) {
      const test = testLine ? testLine + ' ' + word : word;
      const metrics = ctx.measureText(test);
      const lineWidth = metrics.width * (1 + LETTER_SPACING_RATIO);
      if (lineWidth > maxWidth && testLine) {
        testLines.push(testLine);
        testLine = word;
      } else {
        testLine = test;
      }
    }
    if (testLine) testLines.push(testLine);

    const lineHeight = mid * LINE_HEIGHT_RATIO;
    const shadowOffset = mid * 0.06;
    // Full height from top of first line to bottom of last line's shadow
    // = (n-1) * lineHeight + fontSize * 0.86 (baseline + shadow for last line)
    // Top of first line ≈ startY (baseline - ascent ≈ baseline - 0.8*fontSize)
    // Last line baseline = startY + (n-1)*lineHeight + mid*0.8
    // Last line shadow bottom = last line baseline + shadowOffset
    // = startY + (n-1)*lineHeight + mid*0.86
    // Full height = y - startY = (n-1)*lineHeight + mid*0.86
    const fullHeight = (testLines.length - 1) * lineHeight + mid * 0.86;

    if (fullHeight <= maxHeight && testLines.every(l => ctx.measureText(l).width * (1 + LETTER_SPACING_RATIO) <= maxWidth)) {
      bestSize = mid;
      bestLines = testLines;
      low = mid;
    } else {
      high = mid;
    }
  }

  // Use best size
  ctx.font = `700 ${bestSize}px 'Bungee', cursive`;
  const lineHeight = bestSize * LINE_HEIGHT_RATIO;
  const shadowOffset = bestSize * 0.06;
  // Full height from top of first line to bottom of last line's shadow
  const fullHeight = (bestLines.length - 1) * lineHeight + bestSize * 0.86;
  // Position startY so the bottom of the last line's shadow sits exactly at y
  // Last line baseline = startY + (n-1)*lineHeight + bestSize*0.8
  // Last line shadow bottom = last line baseline + shadowOffset
  // = startY + (n-1)*lineHeight + bestSize*0.86
  // We want this = y, so:
  const startY = y - (bestLines.length - 1) * lineHeight - bestSize * 0.86;

  // Draw each line with custom effects
  const renderedLines = [];
  for (let i = 0; i < bestLines.length; i++) {
    const lineText = bestLines[i];
    const metrics = ctx.measureText(lineText);
    const lineWidth = metrics.width * (1 + LETTER_SPACING_RATIO);
    const lineX = x + (maxWidth - lineWidth) / 2; // Center horizontally
    const lineY = startY + i * lineHeight + bestSize * 0.8;

    renderedLines.push({ text: lineText, x: lineX, y: lineY, width: lineWidth });

    // Draw with letter-by-letter for tight tracking
    let charX = lineX;
    for (const char of lineText) {
      const charMetrics = ctx.measureText(char);
      const charW = charMetrics.width;

      // Hard offset shadow (bottom-right)
      ctx.fillStyle = style.captionShadow;
      ctx.fillText(char, charX + bestSize * 0.06, lineY + bestSize * 0.06);

      // Stroke (outline)
      ctx.strokeStyle = style.captionStroke;
      ctx.lineWidth = bestSize * 0.08;
      ctx.lineJoin = 'round';
      ctx.strokeText(char, charX, lineY);

      // Fill (main color)
      ctx.fillStyle = style.captionFill;
      ctx.fillText(char, charX, lineY);

      // Inner highlight (cream edge on top-left of letters)
      ctx.fillStyle = 'rgba(245, 230, 200, 0.4)';
      ctx.fillText(char, charX - bestSize * 0.02, lineY - bestSize * 0.02);

      charX += charW * (1 + LETTER_SPACING_RATIO);
    }
  }

  return {
    width: maxWidth,
    height: fullHeight,
    lines: renderedLines
  };
}

// ============================================================
// Colour grade application — applies a cinematic look to an image
// ============================================================
function applyGrade(ctx, w, h, grade) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const { gradient, shadowTint, highlightBoost, chroma, grain, bloom } = grade;

  // Build gradient lookup table
  const gradTable = new Uint8ClampedArray(256 * 4);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r = 0, g = 0, b = 0, a = 0;
    for (let j = 0; j < gradient.length - 1; j++) {
      const s0 = gradient[j], s1 = gradient[j + 1];
      if (t >= s0.stop && t <= s1.stop) {
        const localT = (t - s0.stop) / (s1.stop - s0.stop);
        r = s0.color[0] + (s1.color[0] - s0.color[0]) * localT;
        g = s0.color[1] + (s1.color[1] - s0.color[1]) * localT;
        b = s0.color[2] + (s1.color[2] - s0.color[2]) * localT;
        a = s0.color[3] + (s1.color[3] - s0.color[3]) * localT;
        break;
      }
    }
    gradTable[i * 4] = r;
    gradTable[i * 4 + 1] = g;
    gradTable[i * 4 + 2] = b;
    gradTable[i * 4 + 3] = a * 255;
  }

  // Apply grade per pixel
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];

      // Luminance
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const lumNorm = lum / 255;

      // Gradient mapping based on luminance
      const gt = gradTable[Math.floor(lumNorm * 255) * 4];
      const gr = gradTable[Math.floor(lumNorm * 255) * 4];
      const gg = gradTable[Math.floor(lumNorm * 255) * 4 + 1];
      const gb = gradTable[Math.floor(lumNorm * 255) * 4 + 2];
      const ga = gradTable[Math.floor(lumNorm * 255) * 4 + 3] / 255;

      // Soft light blend approximation
      let nr = r, ng = g, nb = b;
      if (lumNorm < 0.5) {
        nr = r + (gr - r) * ga * 2 * lumNorm;
        ng = g + (gg - g) * ga * 2 * lumNorm;
        nb = b + (gb - b) * ga * 2 * lumNorm;
      } else {
        nr = r + (gr - r) * ga * 2 * (1 - lumNorm);
        ng = g + (gg - g) * ga * 2 * (1 - lumNorm);
        nb = b + (gb - b) * ga * 2 * (1 - lumNorm);
      }

      // Shadow tint
      if (lumNorm < 0.3) {
        const f = (0.3 - lumNorm) / 0.3 * shadowTint[3];
        nr = nr * (1 - f) + shadowTint[0] * f;
        ng = ng * (1 - f) + shadowTint[1] * f;
        nb = nb * (1 - f) + shadowTint[2] * f;
      }

      // Highlight boost
      if (lumNorm > 0.7) {
        const f = (lumNorm - 0.7) / 0.3 * highlightBoost[3];
        nr = nr * (1 - f) + highlightBoost[0] * f;
        ng = ng * (1 - f) + highlightBoost[1] * f;
        nb = nb * (1 - f) + highlightBoost[2] * f;
      }

      // Clamp
      data[idx] = Math.min(255, Math.max(0, nr));
      data[idx + 1] = Math.min(255, Math.max(0, ng));
      data[idx + 2] = Math.min(255, Math.max(0, nb));
    }
  }

  // Chromatic aberration (simple offset)
  if (chroma > 0) {
    const offset = Math.max(1, Math.round(w * chroma));
    const temp = new Uint8ClampedArray(data);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        // Red channel shifted right
        if (x + offset < w) {
          const srcIdx = (y * w + x + offset) * 4;
          data[idx] = temp[srcIdx];
        }
        // Blue channel shifted left
        if (x - offset >= 0) {
          const srcIdx = (y * w + x - offset) * 4;
          data[idx + 2] = temp[srcIdx + 2];
        }
      }
    }
  }

  // Grain
  if (grain > 0) {
    for (let i = 0; i < data.length; i += 4) {
      const g = (Math.random() - 0.5) * 255 * grain;
      data[i] = Math.min(255, Math.max(0, data[i] + g));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + g));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + g));
    }
  }

  // Simple bloom (brighten highlights further)
  if (bloom.strength > 0) {
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      if (lum / 255 > bloom.threshold) {
        const boost = (lum / 255 - bloom.threshold) / (1 - bloom.threshold) * bloom.strength;
        data[i] = Math.min(255, data[i] * (1 + boost));
        data[i + 1] = Math.min(255, data[i + 1] * (1 + boost));
        data[i + 2] = Math.min(255, data[i + 2] * (1 + boost));
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// ============================================================
// Draw a single panel with photo crop, grade, and rule border
// ============================================================
function drawPanel(ctx, panel, photo, crop, grade, isHero, ruleColor) {
  const { x, y, w, h } = panel;
  const px = Math.floor(x * ctx.canvas.width);
  const py = Math.floor(y * ctx.canvas.height);
  const pw = Math.floor(w * ctx.canvas.width);
  const ph = Math.floor(h * ctx.canvas.height);

  ctx.save();
  ctx.beginPath();
  ctx.rect(px, py, pw, ph);
  ctx.clip();

  if (photo) {
    // Calculate source rectangle from crop
    const cropW = photo.naturalWidth * crop.scale;
    const cropH = photo.naturalHeight * crop.scale;
    const sx = Math.max(0, Math.min(photo.naturalWidth - cropW, photo.naturalWidth * crop.x - cropW / 2));
    const sy = Math.max(0, Math.min(photo.naturalHeight - cropH, photo.naturalHeight * crop.y - cropH / 2));

    ctx.drawImage(photo, sx, sy, cropW, cropH, px, py, pw, ph);
  } else {
    // Placeholder
    ctx.fillStyle = '#1a1d28';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = grade.ruleColor;
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No photo', px + pw / 2, py + ph / 2);
  }

  ctx.restore();

  // Apply grade to this panel region
  // We need to apply grade only to the panel area
  const panelCtx = ctx.canvas.getContext('2d');
  // Save panel region, apply grade, restore
  const panelImg = panelCtx.getImageData(px, py, pw, ph);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = pw;
  tempCanvas.height = ph;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(panelImg, 0, 0);
  applyGrade(tempCtx, pw, ph, grade);
  panelCtx.drawImage(tempCanvas, px, py);

  // Draw rule border
  ctx.strokeStyle = ruleColor;
  ctx.lineWidth = Math.max(2, Math.round(ctx.canvas.width * 0.003));
  ctx.strokeRect(px + ctx.lineWidth / 2, py + ctx.lineWidth / 2, pw - ctx.lineWidth, ph - ctx.lineWidth);
}

// ============================================================
// Main drawCover function — renders the complete cover
// ============================================================
export function drawCover(canvas, photos, panelPhotos, crops, layoutName, gradeName, caption, exportSize, panelCrops) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = exportSize ? EXPORT_SIZES[exportSize] : { width: canvas.width, height: canvas.height };

  // Resize canvas for export
  const isExport = exportSize !== undefined;
  if (isExport) {
    canvas.width = w;
    canvas.height = h;
  }

  const layout = LAYOUTS[layoutName] || LAYOUTS['hero-left'];
  const grade = GRADES[gradeName] || GRADES['vice-sunset'];

  // Clear
  ctx.fillStyle = '#0A1020';
  ctx.fillRect(0, 0, w, h);

  // Draw each panel
  layout.forEach((panel, i) => {
    const photoIndex = panelPhotos[i] ?? 0;
    const photo = photos[photoIndex];
    // Use per-panel crop if provided, otherwise fall back to per-photo crop
    const crop = (panelCrops && panelCrops[i]) ? panelCrops[i] : (crops[photoIndex] || { x: 0.5, y: 0.5, scale: 1 });
    const isHero = i === 0;

    drawPanel(ctx, panel, photo, crop, grade, isHero, grade.ruleColor);
  });

  // Draw caption on hero panel
  const heroPanel = layout[0];
  const captionX = heroPanel.x * w;
  // Inset from bottom edge of hero panel with comfortable padding so caption sits fully inside
  const bottomInset = Math.max(16, Math.round(h * 0.025)); // ~2.5% of height, min 16px
  const captionY = (heroPanel.y + heroPanel.h) * h - bottomInset; // Baseline inset from bottom edge
  const captionW = heroPanel.w * w * 0.92; // 92% of panel width, margins on sides
  const captionH = heroPanel.h * h * 0.4; // Caption uses up to 40% of hero panel height

  if (caption.trim()) {
    drawCaption(ctx, caption.trim().toUpperCase(), captionX, captionY, captionW, captionH, grade);
  }

  // Draw wordmark (NEON FOLIO) in bottom-right corner
  drawWordmark(ctx, w, h, grade);

  // Reset canvas size if it was an export
  if (isExport) {
    // Canvas stays at export size; caller should handle restore if needed
  }
}

/**
 * Draws the app wordmark in the corner
 */
function drawWordmark(ctx, w, h, grade) {
  const text = 'NEON FOLIO';
  const fontSize = Math.max(14, Math.round(w * 0.018));
  ctx.font = `700 ${fontSize}px 'Bungee', cursive`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  const padding = fontSize * 0.5;
  const x = w - padding - 20;
  const y = h - padding - 16;

  // Shadow
  ctx.fillStyle = 'rgba(10, 16, 32, 0.8)';
  ctx.fillText(text, x + 2, y + 2);

  // Stroke
  ctx.strokeStyle = grade.captionStroke;
  ctx.lineWidth = fontSize * 0.06;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);

  // Fill with gradient
  const grad = ctx.createLinearGradient(x - tw, y, x, y);
  grad.addColorStop(0, grade.captionFill);
  grad.addColorStop(0.5, grade.ruleColor);
  grad.addColorStop(1, grade.captionFill);
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
}

/**
 * Loads an image from a URL
 */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
    img.crossOrigin = 'anonymous';
  });
}

/**
 * Creates a default crop for a photo (centered, fill)
 */
export function createDefaultCrop(photo, panelAspect) {
  const photoAspect = photo.naturalWidth / photo.naturalHeight;
  let scale, x = 0.5, y = 0.5;

  if (photoAspect > panelAspect) {
    // Photo is wider - fit height, crop sides
    scale = panelAspect / photoAspect;
  } else {
    // Photo is taller - fit width, crop top/bottom
    scale = 1 / photoAspect * panelAspect;
  }
  scale = Math.min(1, Math.max(0.1, scale)); // Clamp

  return { x, y, scale };
}