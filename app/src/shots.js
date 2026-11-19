/**
 * NEON FOLIO — Fixed scenes for screenshots
 * ?shot=cover shows the exported cover full-bleed
 * ?shot=editor shows the app with a photo loaded
 * ?shot=cover-1350 shows 1080x1350 cover
 * ?shot=cover-1920 shows 1920x1080 cover
 */

// Distinct crop presets for each panel to create varied vignettes
// Each crop: { x, y, scale } where x,y are 0..1 normalized center, scale is relative to panel
const SHOT_CROPS = {
  'cover': { // Default cover (1080x1080) - mosaic-1080 layout (7 panels: 6 photos + emblem at index 3)
    p1: { x: 0.5, y: 0.4, scale: 0.75 },     // index 0 - Top-left - moto wheelie (rider focused)
    p2: { x: 0.5, y: 0.45, scale: 0.85 },    // index 1 - Top-center - boulevard portrait (face visible)
    p3: { x: 0.5, y: 0.3, scale: 0.6 },      // index 2 - Top-right - supercar detail
    // index 3 is emblem (typographic plate) - skipped
    p5: { x: 0.5, y: 0.5, scale: 0.8 },      // index 4 - Bottom-left - pier bust (face visible)
    p6: { x: 0.5, y: 0.4, scale: 0.75 },     // index 5 - Bottom-center - neon boardwalk
    p7: { x: 0.5, y: 0.35, scale: 0.7 }      // index 6 - Bottom-right - marina dusk (boat/water)
  },
  'cover-1350': { // 1080x1350 portrait - mosaic-1350 layout
    p1: { x: 0.5, y: 0.35, scale: 0.8 },
    p2: { x: 0.5, y: 0.4, scale: 0.9 },
    p3: { x: 0.5, y: 0.3, scale: 0.65 },
    p4: { x: 0.5, y: 0.45, scale: 0.85 },
    p6: { x: 0.5, y: 0.4, scale: 0.8 },
    p7: { x: 0.5, y: 0.35, scale: 0.75 },
    p8: { x: 0.5, y: 0.3, scale: 0.6 },      // Marina boat - wide crop
    p9: { x: 0.5, y: 0.7, scale: 0.65 }      // Marina flamingos - low crop
  },
  'cover-1920': { // 1920x1080 landscape - mosaic-1920 layout - FIX: hero crop intact (top-center not cut off)
    p1: { x: 0.5, y: 0.4, scale: 0.75 },
    p2: { x: 0.5, y: 0.4, scale: 0.8 },      // FIX: higher y (0.4 not 0.45) to keep top-center visible
    p3: { x: 0.5, y: 0.3, scale: 0.6 },
    p4: { x: 0.5, y: 0.5, scale: 0.8 },
    p6: { x: 0.5, y: 0.4, scale: 0.75 },
    p7: { x: 0.5, y: 0.35, scale: 0.7 },
    p8: { x: 0.5, y: 0.3, scale: 0.6 },      // Marina boat - wide crop
    p9: { x: 0.5, y: 0.7, scale: 0.65 }      // Marina flamingos - low crop
  },
  // Legacy layouts
  'hero-left': {
    hero: { x: 0.5, y: 0.45, scale: 0.85 },
    topRight: { x: 0.3, y: 0.3, scale: 0.5 },
    midRight: { x: 0.7, y: 0.6, scale: 0.6 },
    bottomRight: { x: 0.5, y: 0.8, scale: 0.7 }
  },
  'hero-right': {
    hero: { x: 0.5, y: 0.45, scale: 0.85 },
    topLeft: { x: 0.3, y: 0.3, scale: 0.5 },
    midLeft: { x: 0.7, y: 0.6, scale: 0.6 },
    bottomLeft: { x: 0.5, y: 0.8, scale: 0.7 }
  },
  'hero-top': {
    hero: { x: 0.5, y: 0.4, scale: 0.9 },
    bottomLeft: { x: 0.2, y: 0.25, scale: 0.45 },
    bottomMid: { x: 0.75, y: 0.6, scale: 0.55 },
    bottomRight: { x: 0.5, y: 0.85, scale: 0.5 }
  },
  'hero-bottom': {
    hero: { x: 0.5, y: 0.5, scale: 0.9 },
    topLeft: { x: 0.2, y: 0.25, scale: 0.45 },
    topMid: { x: 0.75, y: 0.6, scale: 0.55 },
    topRight: { x: 0.5, y: 0.85, scale: 0.5 }
  }
};

// Sample photo filenames (without .jpg)
const SAMPLE_PHOTOS = ['pier', 'boulevard', 'neon-boardwalk', 'moto-wheelie', 'supercar-deco', 'marina-dusk'];

// Panel-to-photo mapping for cover shots — 7-slot map for mosaic-1080 (indices 0-6)
// Index 3 is the emblem (hole/ignored). All 6 photos appear exactly once, no duplicates.
// SAMPLE_PHOTOS: [0:pier, 1:boulevard, 2:neon-boardwalk, 3:moto-wheelie, 4:supercar-deco, 5:marina-dusk]
const COVER_PANEL_PHOTO_MAP = [
  3, // index 0 (p1): moto-wheelie - rider focused
  1, // index 1 (p2): boulevard - face visible
  4, // index 2 (p3): supercar-deco - detail crop
  -1, // index 3 (p4): EMBLEM HOLE (ignored)
  0, // index 4 (p5): pier - bust/face visible
  2, // index 5 (p6): neon-boardwalk - neon scene
  5  // index 6 (p7): marina-dusk - boat/water scene
];

export async function runShot(shot, query, load) {
  // Parse parameters
  const photo = query.get('photo') ?? 'pier';
  const caption = query.get('caption') ?? 'VICE AFTER DARK';
  const layout = query.get('layout') ?? 'mosaic';
  const grade = query.get('grade') ?? 'vice-sunset';
  const size = query.get('size') ?? '1080x1080';

  // Set up the shot
  await load(`samples/${photo}.jpg`, caption, layout, grade, size);

  // Apply distinct crops per panel for cover shots
  if (shot.startsWith('cover') && window.__applyShotCrops) {
    const crops = SHOT_CROPS[shot] || SHOT_CROPS['cover'];
    window.__applyShotCrops(crops);
  }

  // Wait for render
  requestAnimationFrame(() => requestAnimationFrame(() => {
    window.__shotReady = true;
  }));
}

// Export for main.js to use
export { SAMPLE_PHOTOS, COVER_PANEL_PHOTO_MAP };