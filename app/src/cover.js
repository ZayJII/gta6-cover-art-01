/**
 * NEON FOLIO — Cover rendering engine
 * Multi-panel GTA-style cover art with custom lettering, colour grades, and photo crops
 */

// ============================================================
// Layout presets: irregular tiled vignette grid (GTA VI official cover style)
// Coordinates are normalized 0..1 including outer frame
// ============================================================
export const LAYOUTS = {
  // Default 1080x1080: 6 photo panels + emblem (7 total), using all 6 sample photos once
  'mosaic-1080': [
    // Row 1: 3 equal panels across top
    { x: 0.029, y: 0.029, w: 0.300, h: 0.442 },   // P1 - left
    { x: 0.345, y: 0.029, w: 0.310, h: 0.442 },   // P2 - center
    { x: 0.671, y: 0.029, w: 0.300, h: 0.442 },   // P3 - right
    // EMBLEM - full width typographic plate (center)
    { x: 0.029, y: 0.485, w: 0.942, h: 0.180, isEmblem: true }, // P4 - emblem plate
    // Row 2: 3 equal panels across bottom
    { x: 0.029, y: 0.685, w: 0.300, h: 0.286 },   // P5 - bottom left
    { x: 0.345, y: 0.685, w: 0.310, h: 0.286 },   // P6 - bottom center
    { x: 0.671, y: 0.685, w: 0.300, h: 0.286 }    // P7 - bottom right
  ],
  // Default: irregular mosaic grid matching GTA VI box art (legacy 9-panel)
  'mosaic': [
    // Row 1
    { x: 0.029, y: 0.029, w: 0.249, h: 0.289 },   // P1 - action (small)
    { x: 0.294, y: 0.029, w: 0.412, h: 0.289 },   // P2 - hero (wider)
    { x: 0.722, y: 0.029, w: 0.249, h: 0.289 },   // P3 - action (small)
    // Row 2
    { x: 0.029, y: 0.334, w: 0.249, h: 0.334 },   // P4 - tall side portrait
    // EMBLEM - typographic plate (center, overlaps slightly)
    { x: 0.294, y: 0.300, w: 0.412, h: 0.420, isEmblem: true }, // P5 - emblem plate
    { x: 0.722, y: 0.334, w: 0.249, h: 0.334 },   // P6 - tall side portrait
    // Row 3
    { x: 0.029, y: 0.684, w: 0.331, h: 0.287 },   // P7 - wide vehicle
    { x: 0.376, y: 0.684, w: 0.248, h: 0.287 },   // P8 - center
    { x: 0.640, y: 0.684, w: 0.331, h: 0.287 }    // P9 - wide vehicle/wildlife
  ],
  // Adapted for 1080x1350 (portrait) - more vertical room for emblem/hero
  'mosaic-1350': [
    { x: 0.029, y: 0.029, w: 0.249, h: 0.300 },
    { x: 0.294, y: 0.029, w: 0.412, h: 0.300 },
    { x: 0.722, y: 0.029, w: 0.249, h: 0.300 },
    { x: 0.029, y: 0.349, w: 0.249, h: 0.350 },
    { x: 0.294, y: 0.300, w: 0.412, h: 0.440, isEmblem: true },
    { x: 0.722, y: 0.349, w: 0.249, h: 0.350 },
    { x: 0.029, y: 0.719, w: 0.331, h: 0.252 },
    { x: 0.376, y: 0.719, w: 0.248, h: 0.252 },
    { x: 0.640, y: 0.719, w: 0.331, h: 0.252 }
  ],
  // Adapted for 1920x1080 (landscape) - widen hero/emblem
  'mosaic-1920': [
    { x: 0.029, y: 0.029, w: 0.249, h: 0.289 },
    { x: 0.294, y: 0.029, w: 0.412, h: 0.289 },
    { x: 0.722, y: 0.029, w: 0.249, h: 0.289 },
    { x: 0.029, y: 0.334, w: 0.249, h: 0.334 },
    { x: 0.294, y: 0.300, w: 0.412, h: 0.420, isEmblem: true },
    { x: 0.722, y: 0.334, w: 0.249, h: 0.334 },
    { x: 0.029, y: 0.684, w: 0.331, h: 0.287 },
    { x: 0.376, y: 0.684, w: 0.248, h: 0.287 },
    { x: 0.640, y: 0.684, w: 0.331, h: 0.287 }
  ],
  // Legacy layouts kept as options
  'hero-left': [
    { x: 0.015, y: 0.015, w: 0.64, h: 0.97 },
    { x: 0.67, y: 0.015, w: 0.315, h: 0.315 },
    { x: 0.67, y: 0.345, w: 0.315, h: 0.315 },
    { x: 0.67, y: 0.675, w: 0.315, h: 0.315 }
  ],
  'hero-right': [
    { x: 0.345, y: 0.015, w: 0.64, h: 0.97 },
    { x: 0.015, y: 0.015, w: 0.315, h: 0.315 },
    { x: 0.015, y: 0.345, w: 0.315, h: 0.315 },
    { x: 0.015, y: 0.675, w: 0.315, h: 0.315 }
  ],
  'hero-top': [
    { x: 0.015, y: 0.015, w: 0.97, h: 0.64 },
    { x: 0.015, y: 0.67, w: 0.315, h: 0.315 },
    { x: 0.345, y: 0.67, w: 0.315, h: 0.315 },
    { x: 0.675, y: 0.67, w: 0.315, h: 0.315 }
  ],
  'hero-bottom': [
    { x: 0.015, y: 0.345, w: 0.97, h: 0.64 },
    { x: 0.015, y: 0.015, w: 0.315, h: 0.315 },
    { x: 0.345, y: 0.015, w: 0.315, h: 0.315 },
    { x: 0.675, y: 0.015, w: 0.315, h: 0.315 }
  ]
};

// ============================================================
// Colour grade definitions with full illustrated filter pipeline params
// ============================================================
export const GRADES = {
  'vice-sunset': {
    name: 'Vice Sunset',
    // Sky gradient stops (vertical, top to bottom)
    skyGradient: [
      { stop: 0.00, color: [0x65, 0x5D, 0xA6] },  // periwinkle
      { stop: 0.30, color: [0x9F, 0x75, 0xB7] },  // orchid
      { stop: 0.60, color: [0xDE, 0x92, 0xC1] },  // pink
      { stop: 1.00, color: [0xFE, 0xF7, 0xDB] }   // cream rim
    ],
    // Gradient map stops (luma → color) - DISABLED for cinematic default (use identity)
    gradientMap: [
      { stop: 0.00, color: [0x00, 0x00, 0x00] },
      { stop: 0.50, color: [0x80, 0x80, 0x80] },
      { stop: 1.00, color: [0xFF, 0xFF, 0xFF] }
    ],
    // Frame/gutter/ink colour
    frameColor: '#20002F',
    inkColor: '#20002F',
    deepInkColor: '#120026',
    // Posterize levels - DISABLED for cinematic default (set to 256 = no posterize)
    posterizeLevels: 256,
    // Edge ink strength - subtle for cinematic
    edgeInkStrength: 0.15,
    // Grain opacity - fine grain
    grainOpacity: 0.03,
    // Bloom - gentle glow on highlights
    bloom: { threshold: 0.85, strength: 0.15 },
    // Contrast/saturation - gentle S-curve, warm highlights
    contrast: 1.12,
    saturation: 1.08,
    // Caption colors
    captionFill: '#FFFFFF',
    captionStroke: '#20002F',
    captionShadow: '#20002F',
    // Wordmark
    wordmarkFill: '#FFFFFF',
    wordmarkStroke: '#20002F'
  },
  // Optional Comic/Poster preset with the old posterize+gradient-map+ink path
  'comic-poster': {
    name: 'Comic Poster',
    skyGradient: [
      { stop: 0.00, color: [0x65, 0x5D, 0xA6] },
      { stop: 0.30, color: [0x9F, 0x75, 0xB7] },
      { stop: 0.60, color: [0xDE, 0x92, 0xC1] },
      { stop: 1.00, color: [0xFE, 0xF7, 0xDB] }
    ],
    gradientMap: [
      { stop: 0.00, color: [0x20, 0x00, 0x2F] },
      { stop: 0.15, color: [0x34, 0x5F, 0xCF] },
      { stop: 0.35, color: [0x8B, 0x40, 0xBF] },
      { stop: 0.55, color: [0xE8, 0x52, 0xCF] },
      { stop: 0.75, color: [0xFF, 0x68, 0x7F] },
      { stop: 1.00, color: [0xFF, 0xB6, 0x45] }
    ],
    frameColor: '#20002F',
    inkColor: '#20002F',
    deepInkColor: '#120026',
    posterizeLevels: 14,
    edgeInkStrength: 0.45,
    grainOpacity: 0.06,
    bloom: { threshold: 0.78, strength: 0.25 },
    contrast: 1.20,
    saturation: 1.20,
    captionFill: '#FFFFFF',
    captionStroke: '#20002F',
    captionShadow: '#20002F',
    wordmarkFill: '#FFFFFF',
    wordmarkStroke: '#20002F'
  },
  'neon-night': {
    name: 'Neon Night',
    skyGradient: [
      { stop: 0.00, color: [0x0A, 0x10, 0x20] },
      { stop: 0.30, color: [0x3B, 0x0A, 0x5C] },
      { stop: 0.60, color: [0xFF, 0x2D, 0x95] },
      { stop: 1.00, color: [0x00, 0xE5, 0xFF] }
    ],
    gradientMap: [
      { stop: 0.00, color: [0x0A, 0x10, 0x20] },
      { stop: 0.20, color: [0x3B, 0x0A, 0x5C] },
      { stop: 0.45, color: [0xFF, 0x2D, 0x95] },
      { stop: 0.70, color: [0x00, 0xE5, 0xFF] },
      { stop: 1.00, color: [0xFF, 0xE0, 0x8A] }
    ],
    frameColor: '#20002F',
    inkColor: '#20002F',
    deepInkColor: '#120026',
    posterizeLevels: 6,
    edgeInkStrength: 1.2,
    grainOpacity: 0.08,
    bloom: { threshold: 0.70, strength: 0.40 },
    contrast: 1.50,
    saturation: 1.60,
    captionFill: '#FFFFFF',
    captionStroke: '#20002F',
    captionShadow: '#20002F',
    wordmarkFill: '#00E5FF',
    wordmarkStroke: '#20002F'
  },
  'palm-gold': {
    name: 'Palm Gold',
    skyGradient: [
      { stop: 0.00, color: [0x1A, 0x3A, 0x4A] },
      { stop: 0.30, color: [0x40, 0xE0, 0xD0] },
      { stop: 0.60, color: [0xF4, 0xA2, 0x61] },
      { stop: 1.00, color: [0xFF, 0xE0, 0x8A] }
    ],
    gradientMap: [
      { stop: 0.00, color: [0x1A, 0x3A, 0x4A] },
      { stop: 0.20, color: [0x40, 0xE0, 0xD0] },
      { stop: 0.45, color: [0xF4, 0xA2, 0x61] },
      { stop: 0.70, color: [0xFF, 0x7A, 0x62] },
      { stop: 1.00, color: [0xFF, 0xE0, 0x8A] }
    ],
    frameColor: '#20002F',
    inkColor: '#20002F',
    deepInkColor: '#120026',
    posterizeLevels: 8,
    edgeInkStrength: 0.8,
    grainOpacity: 0.05,
    bloom: { threshold: 0.80, strength: 0.20 },
    contrast: 1.25,
    saturation: 1.35,
    captionFill: '#FFFFFF',
    captionStroke: '#20002F',
    captionShadow: '#20002F',
    wordmarkFill: '#FFE08A',
    wordmarkStroke: '#20002F'
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
const LETTER_WIDTH_RATIO = 0.52;
const LETTER_SPACING_RATIO = -0.02;
const LINE_HEIGHT_RATIO = 0.92; // Tighter leading

/**
 * Draws the caption as custom stacked lettering on the canvas
 */
export function drawCaption(ctx, text, x, y, maxWidth, maxHeight, style) {
  if (!text.trim()) return { width: 0, height: 0, lines: [] };

  const words = text.trim().split(/\s+/);

  let fontSize = Math.min(maxWidth * 0.13, maxHeight * 0.5);
  const minFontSize = 18;

  ctx.textBaseline = 'alphabetic';

  // Binary search for best font size
  let low = minFontSize, high = fontSize * 2;
  let bestSize = minFontSize;
  let bestLines = [];

  for (let iter = 0; iter < 25; iter++) {
    const mid = (low + high) / 2;
    ctx.font = `700 ${mid}px 'Bungee', cursive`;

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
    const shadowOffset = mid * 0.07;
    const fullHeight = (testLines.length - 1) * lineHeight + mid * 0.93;

    if (fullHeight <= maxHeight && testLines.every(l => ctx.measureText(l).width * (1 + LETTER_SPACING_RATIO) <= maxWidth)) {
      bestSize = mid;
      bestLines = testLines;
      low = mid;
    } else {
      high = mid;
    }
  }

  ctx.font = `700 ${bestSize}px 'Bungee', cursive`;
  const lineHeight = bestSize * LINE_HEIGHT_RATIO;
  const shadowOffset = bestSize * 0.07;
  const fullHeight = (bestLines.length - 1) * lineHeight + bestSize * 0.93;
  const startY = y - (bestLines.length - 1) * lineHeight - bestSize * 0.93;

  const renderedLines = [];
  for (let i = 0; i < bestLines.length; i++) {
    const lineText = bestLines[i];
    const metrics = ctx.measureText(lineText);
    const lineWidth = metrics.width * (1 + LETTER_SPACING_RATIO);
    const lineX = x + (maxWidth - lineWidth) / 2;
    const lineY = startY + i * lineHeight + bestSize * 0.8;

    renderedLines.push({ text: lineText, x: lineX, y: lineY, width: lineWidth });

    // Draw with letter-by-letter for tight tracking
    let charX = lineX;
    for (const char of lineText) {
      const charMetrics = ctx.measureText(char);
      const charW = charMetrics.width;

      // Hard offset shadow (bottom-right)
      ctx.fillStyle = style.captionShadow;
      ctx.fillText(char, charX + bestSize * 0.07, lineY + bestSize * 0.07);

      // Stroke (thick outline)
      ctx.strokeStyle = style.captionStroke;
      ctx.lineWidth = bestSize * 0.10;
      ctx.lineJoin = 'round';
      ctx.strokeText(char, charX, lineY);

      // Fill (main color - pure white)
      ctx.fillStyle = style.captionFill;
      ctx.fillText(char, charX, lineY);

      // Inner highlight (cream hairline on top-left)
      ctx.fillStyle = '#F6F3EE';
      ctx.globalAlpha = 0.5;
      ctx.fillText(char, charX - bestSize * 0.02, lineY - bestSize * 0.02);
      ctx.globalAlpha = 1.0;

      charX += charW * (1 + LETTER_SPACING_RATIO);
    }
  }

  return { width: maxWidth, height: fullHeight, lines: renderedLines };
}

/**
 * Draws the NEON FOLIO wordmark
 */
export function drawWordmark(ctx, w, h, style) {
  const text = 'NEON FOLIO';
  const fontSize = Math.max(14, Math.round(w * 0.016));
  ctx.font = `700 ${fontSize}px 'Bungee', cursive`;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const metrics = ctx.measureText(text);
  const tw = metrics.width;
  // Increased padding/inset to prevent clipping at edges (especially 1920x1080)
  const padding = fontSize * 0.8;
  const margin = Math.max(20, Math.round(w * 0.015));
  const x = w - margin - padding;
  const y = h - margin - padding;

  // Shadow
  ctx.fillStyle = style.captionShadow;
  ctx.fillText(text, x + 2, y + 2);

  // Stroke
  ctx.strokeStyle = style.wordmarkStroke;
  ctx.lineWidth = fontSize * 0.07;
  ctx.lineJoin = 'round';
  ctx.strokeText(text, x, y);

  // Fill with gradient
  const grad = ctx.createLinearGradient(x - tw, y, x, y);
  grad.addColorStop(0, style.wordmarkFill);
  grad.addColorStop(0.5, style.captionStroke);
  grad.addColorStop(1, style.wordmarkFill);
  ctx.fillStyle = grad;
  ctx.fillText(text, x, y);
}

// ============================================================
// Illustrated filter pipeline
// ============================================================

/**
 * Converts RGB to HSV
 */
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, v };
}

/**
 * Converts HSV to RGB
 */
function hsvToRgb(h, s, v) {
  h = h / 360;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r, g, b;
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

/**
 * Checks if a pixel is skin-tone (hue 0-50°, moderate saturation)
 */
function isSkinTone(r, g, b) {
  const { h, s, v } = rgbToHsv(r, g, b);
  // Skin tones: hue ~0-50° (reds/oranges/yellows), moderate saturation (0.15-0.6), not too dark/bright
  return h <= 50 && s >= 0.15 && s <= 0.65 && v >= 0.2 && v <= 0.95;
}

/**
 * Applies S-curve contrast and saturation with skin protection
 */
function applyContrastSaturation(data, w, h, contrast, saturation, grade) {
  // S-curve contrast using smoothstep-like function
  // Maps 0-255 through S-curve for more natural filmic contrast
  function sCurve(x, contrast) {
    const normalized = x / 255;
    // Smoothstep S-curve: 3x^2 - 2x^3, then blend with linear based on contrast
    const curved = 3 * normalized * normalized - 2 * normalized * normalized * normalized;
    return Math.round(255 * (normalized + (curved - normalized) * (contrast - 1)));
  }

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    const skin = isSkinTone(r, g, b);

    // S-curve contrast
    if (!skin) {
      r = sCurve(r, contrast);
      g = sCurve(g, contrast);
      b = sCurve(b, contrast);
    } else {
      // Skin: gentle luminance-only contrast
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const newLum = sCurve(lum, 1 + (contrast - 1) * 0.3); // reduced contrast on skin
      const ratio = lum > 0 ? newLum / lum : 1;
      r = Math.min(255, Math.max(0, r * ratio));
      g = Math.min(255, Math.max(0, g * ratio));
      b = Math.min(255, Math.max(0, b * ratio));
    }

    // Saturation - reduce on skin
    const effectiveSaturation = skin ? 1 + (saturation - 1) * 0.3 : saturation;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = lum + effectiveSaturation * (r - lum);
    g = lum + effectiveSaturation * (g - lum);
    b = lum + effectiveSaturation * (b - lum);

    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }
}

/**
 * Detects sky region (upper portion with high luma, low texture, blue/cyan hue) and replaces with gradient
 * Only blends on genuine sky-like pixels — never skin, mid-ground, or water
 */
function applySkyGradient(ctx, w, h, grade) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const { skyGradient } = grade;

  // Analyze upper 40% for sky detection
  const skyHeight = Math.floor(h * 0.4);

  // First pass: build sky mask by analyzing texture and color
  const skyMask = new Uint8Array(w * skyHeight);
  for (let y = 0; y < skyHeight; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Sky detection: high luma, blue/cyan dominant, low saturation, not skin
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const { h: hue, s: sat, v: val } = rgbToHsv(r, g, b);

      // True sky: high value, blue/cyan hue (180-260°), low saturation, high luma
      // NOT skin (hue 0-50°), NOT vegetation (hue 80-150°), NOT warm surfaces
      const isBlueCyan = hue >= 180 && hue <= 260;
      const isLowSat = sat <= 0.4;
      const isBright = val >= 0.4 && luma >= 80;
      const notSkin = !isSkinTone(r, g, b);

      // Additional texture check: sky has low local variance
      // Sample 3x3 neighborhood for variance
      let localVar = 0;
      let samples = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const ny = y + ky, nx = x + kx;
          if (ny >= 0 && ny < skyHeight && nx >= 0 && nx < w) {
            const nIdx = (ny * w + nx) * 4;
            const nLuma = 0.2126 * data[nIdx] + 0.7152 * data[nIdx + 1] + 0.0722 * data[nIdx + 2];
            localVar += Math.abs(nLuma - luma);
            samples++;
          }
        }
      }
      localVar = samples > 0 ? localVar / samples : 0;
      const isSmooth = localVar < 25; // low texture variance

      skyMask[y * w + x] = (isBlueCyan && isLowSat && isBright && notSkin && isSmooth) ? 1 : 0;
    }
  }

  // Second pass: apply gradient only where skyMask is 1
  for (let y = 0; y < skyHeight; y++) {
    const t = y / skyHeight;

    // Find gradient stop
    let r = skyGradient[0].color[0], g = skyGradient[0].color[1], b = skyGradient[0].color[2];
    for (let j = 0; j < skyGradient.length - 1; j++) {
      const s0 = skyGradient[j], s1 = skyGradient[j + 1];
      if (t >= s0.stop && t <= s1.stop) {
        const localT = (t - s0.stop) / (s1.stop - s0.stop);
        r = s0.color[0] + (s1.color[0] - s0.color[0]) * localT;
        g = s0.color[1] + (s1.color[1] - s0.color[1]) * localT;
        b = s0.color[2] + (s1.color[2] - s0.color[2]) * localT;
        break;
      }
    }

    // Blend strength varies vertically (stronger at top)
    const blendStrength = 1.0 - (y / skyHeight) * 0.3; // 1.0 at top, 0.7 at skyHeight
    for (let x = 0; x < w; x++) {
      if (skyMask[y * w + x]) {
        const idx = (y * w + x) * 4;
        const origR = data[idx];
        const origG = data[idx + 1];
        const origB = data[idx + 2];
        data[idx] = origR * (1 - blendStrength) + r * blendStrength;
        data[idx + 1] = origG * (1 - blendStrength) + g * blendStrength;
        data[idx + 2] = origB * (1 - blendStrength) + b * blendStrength;
      }
      // NO else branch - non-sky pixels are left completely untouched
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Applies gradient map based on luminance
 */
function applyGradientMap(data, w, h, gradientMap) {
  // Build lookup table
  const lut = new Uint8ClampedArray(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let r = gradientMap[0].color[0], g = gradientMap[0].color[1], b = gradientMap[0].color[2];
    for (let j = 0; j < gradientMap.length - 1; j++) {
      const s0 = gradientMap[j], s1 = gradientMap[j + 1];
      if (t >= s0.stop && t <= s1.stop) {
        const localT = (t - s0.stop) / (s1.stop - s0.stop);
        r = s0.color[0] + (s1.color[0] - s0.color[0]) * localT;
        g = s0.color[1] + (s1.color[1] - s0.color[1]) * localT;
        b = s0.color[2] + (s1.color[2] - s0.color[2]) * localT;
        break;
      }
    }
    lut[i * 3] = r;
    lut[i * 3 + 1] = g;
    lut[i * 3 + 2] = b;
  }

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const lum = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const idx = lum * 3;

    // Blend original with mapped color (70% mapped, 30% original for painted look)
    data[i] = Math.round(data[i] * 0.3 + lut[idx] * 0.7);
    data[i + 1] = Math.round(data[i + 1] * 0.3 + lut[idx + 1] * 0.7);
    data[i + 2] = Math.round(data[i + 2] * 0.3 + lut[idx + 2] * 0.7);
  }
}

/**
 * Posterizes to N levels per channel
 */
function applyPosterize(data, levels) {
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }
}

/**
 * Applies edge ink (Sobel) in frame color
 */
function applyEdgeInk(ctx, w, h, inkColor, strength) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const temp = new Uint8ClampedArray(data);

  // Parse ink color
  const inkR = parseInt(inkColor.slice(1, 3), 16);
  const inkG = parseInt(inkColor.slice(3, 5), 16);
  const inkB = parseInt(inkColor.slice(5, 7), 16);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;

      // Sobel kernels
      let gx = 0, gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const nIdx = ((y + ky) * w + (x + kx)) * 4;
          const lum = 0.2126 * temp[nIdx] + 0.7152 * temp[nIdx + 1] + 0.0722 * temp[nIdx + 2];

          // Sobel X
          if (kx === -1) gx -= lum * (ky === 0 ? 2 : 1);
          else if (kx === 1) gx += lum * (ky === 0 ? 2 : 1);

          // Sobel Y
          if (ky === -1) gy -= lum * (kx === 0 ? 2 : 1);
          else if (ky === 1) gy += lum * (kx === 0 ? 2 : 1);
        }
      }

      const magnitude = Math.sqrt(gx * gx + gy * gy) / 255 * strength;

      // Raised threshold from 0.15 to 0.25 for softer edges; removed ×2 multiplier
      if (magnitude > 0.25) {
        const inkAlpha = Math.min(1, magnitude);
        data[idx] = data[idx] * (1 - inkAlpha) + inkR * inkAlpha;
        data[idx + 1] = data[idx + 1] * (1 - inkAlpha) + inkG * inkAlpha;
        data[idx + 2] = data[idx + 2] * (1 - inkAlpha) + inkB * inkAlpha;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Applies subtle grain
 */
function applyGrain(data, opacity) {
  for (let i = 0; i < data.length; i += 4) {
    const g = (Math.random() - 0.5) * 255 * opacity;
    data[i] = Math.min(255, Math.max(0, data[i] + g));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + g));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + g));
  }
}

/**
 * Applies split-tone: teal shadows, warm highlights (only on non-skin pixels)
 */
function applySplitTone(data, w, h, grade) {
  // Teal for shadows: ~180-190°, Warm for highlights: ~30-40°
  const shadowHue = 185; // teal
  const shadowSat = 0.35;
  const highlightHue = 35; // warm gold
  const highlightSat = 0.25;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Skip skin tones entirely
    if (isSkinTone(r, g, b)) continue;

    const { h: hue, s: sat, v: val } = rgbToHsv(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const lumNorm = lum / 255;

    // Split-tone only in shadows (low luminance) and highlights (high luminance)
    // Midtones left alone
    if (lumNorm < 0.35) {
      // Shadows: blend toward teal
      const strength = (0.35 - lumNorm) / 0.35 * 0.4; // max 40% blend in deep shadows
      const shadowRgb = hsvToRgb(shadowHue, shadowSat, val);
      data[i] = Math.round(r * (1 - strength) + shadowRgb.r * strength);
      data[i + 1] = Math.round(g * (1 - strength) + shadowRgb.g * strength);
      data[i + 2] = Math.round(b * (1 - strength) + shadowRgb.b * strength);
    } else if (lumNorm > 0.7) {
      // Highlights: blend toward warm gold
      const strength = (lumNorm - 0.7) / 0.3 * 0.25; // max 25% blend in bright highlights
      const highlightRgb = hsvToRgb(highlightHue, highlightSat, val);
      data[i] = Math.round(r * (1 - strength) + highlightRgb.r * strength);
      data[i + 1] = Math.round(g * (1 - strength) + highlightRgb.g * strength);
      data[i + 2] = Math.round(b * (1 - strength) + highlightRgb.b * strength);
    }
  }
}

/**
 * Applies soft vignette
 */
function applyVignette(data, w, h) {
  const cx = w / 2, cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normDist = dist / maxDist;
      // Smooth vignette: starts at 0.5, max 0.35 darkening at corners
      const vignette = Math.max(0, (normDist - 0.5) / 0.5) * 0.35;
      data[idx] = Math.round(data[idx] * (1 - vignette));
      data[idx + 1] = Math.round(data[idx + 1] * (1 - vignette));
      data[idx + 2] = Math.round(data[idx + 2] * (1 - vignette));
    }
  }
}

/**
 * Gently clips highlights to prevent blown whites
 */
function applyHighlightClipping(data, w, h) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (lum > 230) {
      // Soft rolloff above 230
      const excess = lum - 230;
      const rolloff = Math.min(1, excess / 25); // fully rolled off at 255
      const factor = 1 - rolloff * 0.5; // max 50% reduction
      data[i] = Math.round(r * factor);
      data[i + 1] = Math.round(g * factor);
      data[i + 2] = Math.round(b * factor);
    }
  }
}

/**
 * Applies bloom to highlights
 */
function applyBloom(data, w, h, bloom) {
  const { threshold, strength } = bloom;
  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    const lumNorm = lum / 255;
    if (lumNorm > threshold) {
      const boost = (lumNorm - threshold) / (1 - threshold) * strength;
      data[i] = Math.min(255, data[i] * (1 + boost));
      data[i + 1] = Math.min(255, data[i + 1] * (1 + boost));
      data[i + 2] = Math.min(255, data[i + 2] * (1 + boost));
    }
  }
}

/**
 * Full illustrated filter pipeline for a panel
 * Cinematic default (vice-sunset): skips gradient map and posterize, adds split-tone, vignette, highlight clipping
 * Comic/Poster preset: uses full pipeline with gradient map and posterize
 */
function applyIllustratedFilter(ctx, w, h, grade) {
  // 1. Contrast + saturation (gentle S-curve) with skin protection
  let imgData = ctx.getImageData(0, 0, w, h);
  applyContrastSaturation(imgData.data, w, h, grade.contrast, grade.saturation, grade);
  ctx.putImageData(imgData, 0, 0);

  // 2. Sky gradient replacement/tint (only on sky-like regions)
  applySkyGradient(ctx, w, h, grade);

  // 3. Gradient map - SKIP for cinematic (identity map means no change)
  // Check if gradientMap is identity (no-op)
  const isIdentityMap = grade.gradientMap.length === 3 &&
    grade.gradientMap[0].stop === 0.00 && grade.gradientMap[0].color[0] === 0 && grade.gradientMap[0].color[1] === 0 && grade.gradientMap[0].color[2] === 0 &&
    grade.gradientMap[1].stop === 0.50 && grade.gradientMap[1].color[0] === 128 && grade.gradientMap[1].color[1] === 128 && grade.gradientMap[1].color[2] === 128 &&
    grade.gradientMap[2].stop === 1.00 && grade.gradientMap[2].color[0] === 255 && grade.gradientMap[2].color[1] === 255 && grade.gradientMap[2].color[2] === 255;

  if (!isIdentityMap) {
    imgData = ctx.getImageData(0, 0, w, h);
    applyGradientMap(imgData.data, w, h, grade.gradientMap);
    ctx.putImageData(imgData, 0, 0);
  }

  // 4. Posterize - SKIP for cinematic (256 levels = no posterize)
  if (grade.posterizeLevels < 256) {
    imgData = ctx.getImageData(0, 0, w, h);
    applyPosterize(imgData.data, grade.posterizeLevels);
    ctx.putImageData(imgData, 0, 0);
  }

  // 5. Split-tone (cinematic only): teal shadows, warm highlights, skip skin
  if (isIdentityMap) { // cinematic grade
    imgData = ctx.getImageData(0, 0, w, h);
    applySplitTone(imgData.data, w, h, grade);
    ctx.putImageData(imgData, 0, 0);
  }

  // 6. Edge ink - subtle for cinematic
  applyEdgeInk(ctx, w, h, grade.inkColor, grade.edgeInkStrength);

  // 7. Grain - fine grain
  imgData = ctx.getImageData(0, 0, w, h);
  applyGrain(imgData.data, grade.grainOpacity);
  ctx.putImageData(imgData, 0, 0);

  // 8. Vignette (cinematic only)
  if (isIdentityMap) {
    imgData = ctx.getImageData(0, 0, w, h);
    applyVignette(imgData.data, w, h);
    ctx.putImageData(imgData, 0, 0);
  }

  // 9. Highlight clipping (cinematic only) - prevent blown whites
  if (isIdentityMap) {
    imgData = ctx.getImageData(0, 0, w, h);
    applyHighlightClipping(imgData.data, w, h);
    ctx.putImageData(imgData, 0, 0);
  }

  // 10. Bloom - gentle glow on highlights
  imgData = ctx.getImageData(0, 0, w, h);
  applyBloom(imgData.data, w, h, grade.bloom);
  ctx.putImageData(imgData, 0, 0);
}

// ============================================================
// Draw a single panel with photo crop, illustrated filter, and frame border
// ============================================================
function drawPanel(ctx, panel, photo, crop, grade, ruleColor, frameColor) {
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
    const cropW = photo.naturalWidth * crop.scale;
    const cropH = photo.naturalHeight * crop.scale;
    const sx = Math.max(0, Math.min(photo.naturalWidth - cropW, photo.naturalWidth * crop.x - cropW / 2));
    const sy = Math.max(0, Math.min(photo.naturalHeight - cropH, photo.naturalHeight * crop.y - cropH / 2));

    ctx.drawImage(photo, sx, sy, cropW, cropH, px, py, pw, ph);
  } else {
    ctx.fillStyle = '#1a1d28';
    ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = ruleColor;
    ctx.font = '14px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No photo', px + pw / 2, py + ph / 2);
  }

  ctx.restore();

  // Apply illustrated filter to this panel region
  const panelImg = ctx.getImageData(px, py, pw, ph);
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = pw;
  tempCanvas.height = ph;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.putImageData(panelImg, 0, 0);
  applyIllustratedFilter(tempCtx, pw, ph, grade);
  ctx.drawImage(tempCanvas, px, py);

  // Draw frame border
  ctx.strokeStyle = frameColor;
  const lineWidth = Math.max(2, Math.round(ctx.canvas.width * 0.0025));
  ctx.lineWidth = lineWidth;
  ctx.strokeRect(px + lineWidth / 2, py + lineWidth / 2, pw - lineWidth, ph - lineWidth);
}

// ============================================================
// Draw the outer frame
// ============================================================
function drawOuterFrame(ctx, w, h, frameColor) {
  const inset = Math.round(w * 0.029);
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = inset;
  ctx.strokeRect(inset / 2, inset / 2, w - inset, h - inset);
}

// ============================================================
// Draw emblem plate (typographic anchor behind title)
// Procedural sunset scene: sky gradient, sun disc, city skyline, palm silhouettes
// ============================================================
function drawEmblemPlate(ctx, panel, w, h, grade) {
  const { x, y, w: pw, h: ph } = panel;
  const px = Math.floor(x * w);
  const py = Math.floor(y * h);
  const panelW = Math.floor(pw * w);
  const panelH = Math.floor(ph * h);

  // 1. Sunset sky gradient (vertical, using grade sky colors)
  const skyGrad = ctx.createLinearGradient(px, py, px, py + panelH);
  grade.skyGradient.forEach(stop => {
    const [r, g, b] = stop.color;
    skyGrad.addColorStop(stop.stop, `rgb(${r},${g},${b})`);
  });
  ctx.fillStyle = skyGrad;
  ctx.fillRect(px, py, panelW, panelH);

  // 2. Sun disc - large circle in upper portion with glow
  const sunX = px + panelW * 0.5;
  const sunY = py + panelH * 0.35;
  const sunRadius = Math.max(30, Math.min(panelW, panelH) * 0.18);

  // Sun glow (outer)
  const glowGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius * 2.5);
  glowGrad.addColorStop(0, 'rgba(255, 200, 100, 0.6)');
  glowGrad.addColorStop(0.3, 'rgba(255, 150, 50, 0.3)');
  glowGrad.addColorStop(1, 'rgba(255, 100, 30, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Sun disc
  const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
  sunGrad.addColorStop(0, '#FFF8E0');
  sunGrad.addColorStop(0.5, '#FFD880');
  sunGrad.addColorStop(1, '#FFB040');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // 3. City skyline silhouette - procedural buildings along bottom
  const skylineY = py + panelH;
  const buildingCount = Math.max(8, Math.floor(panelW / 40));
  const baseHeight = panelH * 0.45;

  ctx.fillStyle = '#0A0D14'; // Deep silhouette color

  // Deterministic pseudo-random for building widths/heights
  let seed = 12345;
  function rand() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }

  let currentX = px;
  for (let i = 0; i < buildingCount; i++) {
    const buildingWidth = Math.max(20, Math.floor(panelW / buildingCount * (0.7 + rand() * 0.6)));
    const buildingHeight = Math.max(panelH * 0.15, baseHeight * (0.4 + rand() * 0.7));
    const buildingX = currentX;
    const buildingY = skylineY - buildingHeight;

    // Main building
    ctx.fillRect(buildingX, buildingY, buildingWidth, buildingHeight);

    // Random windows (dark rectangles)
    if (rand() > 0.5) {
      ctx.fillStyle = '#000000';
      const windowCount = Math.floor(buildingWidth / 15);
      for (let w = 0; w < windowCount; w++) {
        if (rand() > 0.7) {
          const wx = buildingX + 5 + w * 15;
          const wy = buildingY + 10 + rand() * (buildingHeight - 20);
          const ww = 4 + rand() * 8;
          const wh = 6 + rand() * 12;
          ctx.fillRect(wx, wy, ww, wh);
        }
      }
      ctx.fillStyle = '#0A0D14';
    }

    currentX += buildingWidth + Math.max(2, Math.floor(panelW * 0.005));
    if (currentX > px + panelW) break;
  }

  // 4. Palm silhouettes - left and right sides
  drawPalmSilhouette(ctx, px + panelW * 0.08, skylineY, panelH * 0.65, true);
  drawPalmSilhouette(ctx, px + panelW * 0.92, skylineY, panelH * 0.65, false);

  // 5. Optional thin palm footer at very bottom
  drawPalmFooter(ctx, px, py + panelH - panelH * 0.08, panelW, panelH * 0.08);

  // 6. White inner edge
  ctx.strokeStyle = '#F6F3EE';
  const innerLineWidth = Math.max(2, Math.round(w * 0.002));
  ctx.lineWidth = innerLineWidth;
  ctx.strokeRect(px + innerLineWidth / 2, py + innerLineWidth / 2, panelW - innerLineWidth, panelH - innerLineWidth);

  // 7. Dark outer outline
  ctx.strokeStyle = grade.deepInkColor;
  const outerLineWidth = Math.max(3, Math.round(w * 0.003));
  ctx.lineWidth = outerLineWidth;
  ctx.strokeRect(px + outerLineWidth / 2, py + outerLineWidth / 2, panelW - outerLineWidth, panelH - outerLineWidth);
}

// Helper: Draw a palm silhouette using bezier curves
function drawPalmSilhouette(ctx, baseX, baseY, height, leanRight) {
  ctx.fillStyle = '#0A0D14';
  ctx.beginPath();

  // Trunk (curved)
  const trunkWidth = Math.max(4, height * 0.02);
  const lean = leanRight ? height * 0.15 : -height * 0.15;

  ctx.moveTo(baseX - trunkWidth / 2, baseY);
  ctx.quadraticCurveTo(
    baseX + lean * 0.3, baseY - height * 0.3,
    baseX + lean * 0.5, baseY - height * 0.5
  );
  ctx.quadraticCurveTo(
    baseX + lean * 0.7, baseY - height * 0.7,
    baseX + lean, baseY - height
  );
  ctx.lineTo(baseX + lean + trunkWidth, baseY - height);
  ctx.quadraticCurveTo(
    baseX + lean * 0.7 + trunkWidth, baseY - height * 0.7,
    baseX + lean * 0.5 + trunkWidth, baseY - height * 0.5
  );
  ctx.quadraticCurveTo(
    baseX + lean * 0.3 + trunkWidth, baseY - height * 0.3,
    baseX + trunkWidth, baseY
  );
  ctx.closePath();
  ctx.fill();

  // Fronds (palm leaves) - 5-7 fronds fanning out
  const frondCount = 6;
  for (let f = 0; f < frondCount; f++) {
    const angle = (f / (frondCount - 1) - 0.5) * Math.PI * 0.8; // -72° to +72°
    const frondLength = height * (0.35 + Math.random() * 0.15);
    const frondWidth = height * 0.08;

    const tipX = baseX + lean + Math.sin(angle) * frondLength;
    const tipY = baseY - height - Math.cos(angle) * frondLength;
    const midX = baseX + lean + Math.sin(angle) * frondLength * 0.5;
    const midY = baseY - height - Math.cos(angle) * frondLength * 0.5;

    ctx.beginPath();
    ctx.moveTo(baseX + lean, baseY - height);
    ctx.quadraticCurveTo(midX + Math.cos(angle) * frondWidth, midY - Math.sin(angle) * frondWidth, tipX, tipY);
    ctx.quadraticCurveTo(midX - Math.cos(angle) * frondWidth, midY + Math.sin(angle) * frondWidth, baseX + lean, baseY - height);
    ctx.fill();
  }
}

// Helper: Draw thin palm footer along bottom edge
function drawPalmFooter(ctx, x, y, width, height) {
  ctx.fillStyle = 'rgba(10, 13, 20, 0.6)';
  const frondCount = Math.floor(width / 30);
  for (let i = 0; i < frondCount; i++) {
    const fx = x + (i + 0.5) * (width / frondCount);
    const fh = height * (0.5 + Math.random() * 0.5);
    ctx.beginPath();
    ctx.moveTo(fx, y + height);
    ctx.quadraticCurveTo(fx - 10, y + height - fh * 0.5, fx, y + height - fh);
    ctx.quadraticCurveTo(fx + 10, y + height - fh * 0.5, fx, y + height);
    ctx.fill();
  }
}

// ============================================================
// Main drawCover function — renders the complete cover
// ============================================================
export function drawCover(canvas, photos, panelPhotos, crops, layoutName, gradeName, caption, exportSize, panelCrops) {
  const ctx = canvas.getContext('2d');
  const { width: w, height: h } = exportSize ? EXPORT_SIZES[exportSize] : { width: canvas.width, height: canvas.height };

  const isExport = exportSize !== undefined;
  if (isExport) {
    canvas.width = w;
    canvas.height = h;
  }

  // Select layout based on export size for mosaic
  let layout = LAYOUTS[layoutName];
  if (layoutName === 'mosaic' && exportSize) {
    if (exportSize === '1080x1080') layout = LAYOUTS['mosaic-1080'];
    else if (exportSize === '1080x1350') layout = LAYOUTS['mosaic-1350'];
    else if (exportSize === '1920x1080') layout = LAYOUTS['mosaic-1920'];
  }
  if (!layout) layout = LAYOUTS['mosaic'];

  const grade = GRADES[gradeName] || GRADES['vice-sunset'];

  // Clear with deep background
  ctx.fillStyle = '#0A1020';
  ctx.fillRect(0, 0, w, h);

  // Draw each panel
  layout.forEach((panel, i) => {
    if (panel.isEmblem) return; // Handle emblem separately

    const photoIndex = panelPhotos[i] ?? 0;
    // Skip emblem hole (sentinel -1) - should not happen for non-emblem panels but guard anyway
    if (photoIndex < 0) return;
    const photo = photos[photoIndex];
    const crop = (panelCrops && panelCrops[i]) ? panelCrops[i] : (crops[photoIndex] || { x: 0.5, y: 0.5, scale: 1 });

    drawPanel(ctx, panel, photo, crop, grade, grade.frameColor, grade.frameColor);
  });

  // Draw emblem plate (behind caption)
  const emblemPanel = layout.find(p => p.isEmblem);
  if (emblemPanel) {
    drawEmblemPlate(ctx, emblemPanel, w, h, grade);
  }

  // Draw outer frame
  drawOuterFrame(ctx, w, h, grade.frameColor);

  // Draw caption centered on the emblem area (or full canvas center for legacy layouts)
  let captionX, captionY, captionW, captionH;

  if (emblemPanel) {
    const px = emblemPanel.x * w;
    const py = emblemPanel.y * h;
    const pw = emblemPanel.w * w;
    const ph = emblemPanel.h * h;
    captionX = px;
    captionY = py + ph - Math.round(h * 0.02); // Inset from bottom of emblem
    captionW = pw * 0.9;
    captionH = ph * 0.7;
  } else {
    // Legacy layout: caption on hero panel
    const heroPanel = layout[0];
    captionX = heroPanel.x * w;
    captionY = (heroPanel.y + heroPanel.h) * h - Math.round(h * 0.03);
    captionW = heroPanel.w * w * 0.9;
    captionH = heroPanel.h * h * 0.4;
  }

  if (caption.trim()) {
    drawCaption(ctx, caption.trim().toUpperCase(), captionX, captionY, captionW, captionH, grade);
  }

  // Draw wordmark
  drawWordmark(ctx, w, h, grade);

  if (isExport) {
    // Canvas stays at export size
  }
}

// ============================================================
// Load image helper
// ============================================================
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
    img.crossOrigin = 'anonymous';
  });
}

// ============================================================
// Create default crop for a photo
// ============================================================
export function createDefaultCrop(photo, panelAspect) {
  const photoAspect = photo.naturalWidth / photo.naturalHeight;
  let scale, x = 0.5, y = 0.5;

  if (photoAspect > panelAspect) {
    scale = panelAspect / photoAspect;
  } else {
    scale = 1 / photoAspect * panelAspect;
  }
  scale = Math.min(1, Math.max(0.15, scale));

  return { x, y, scale };
}