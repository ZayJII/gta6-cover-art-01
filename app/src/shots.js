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
  'cover': { // Default cover (1080x1080) - hero-left layout
    hero: { x: 0.5, y: 0.45, scale: 0.85 },       // Face/upper body centered, slightly zoomed
    topRight: { x: 0.3, y: 0.3, scale: 0.5 },     // Tight crop on face/hands
    midRight: { x: 0.7, y: 0.6, scale: 0.6 },     // Sky/horizon or car detail
    bottomRight: { x: 0.5, y: 0.8, scale: 0.7 }   // Water/ground detail
  },
  'cover-1350': { // 1080x1350 portrait - hero-top layout
    hero: { x: 0.5, y: 0.4, scale: 0.9 },         // Full figure centered
    bottomLeft: { x: 0.2, y: 0.25, scale: 0.45 }, // Face closeup
    bottomMid: { x: 0.75, y: 0.6, scale: 0.55 },  // Car/vehicle detail
    bottomRight: { x: 0.5, y: 0.85, scale: 0.5 }  // Water/reflection
  },
  'cover-1920': { // 1920x1080 landscape - hero-left layout
    hero: { x: 0.5, y: 0.45, scale: 0.9 },        // Wide cinematic, duo or single centered
    topRight: { x: 0.35, y: 0.3, scale: 0.5 },    // Face/hands tight
    midRight: { x: 0.65, y: 0.55, scale: 0.55 },  // Car/sunset sky
    bottomRight: { x: 0.5, y: 0.8, scale: 0.6 }   // Water/ground
  }
};

export async function runShot(shot, query, load) {
  // Hide UI for cover shots
  if (shot.startsWith('cover')) {
    document.body.classList.add('shot-cover');
  }

  // Parse parameters
  const photo = query.get('photo') ?? 'pier';
  const caption = query.get('caption') ?? 'VICE AFTER DARK';
  const layout = query.get('layout') ?? 'hero-left';
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