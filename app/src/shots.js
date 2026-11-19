/**
 * NEON FOLIO — Fixed scenes for screenshots
 * ?shot=cover shows the exported cover full-bleed
 * ?shot=editor shows the app with a photo loaded
 * ?shot=cover-1350 shows 1080x1350 cover
 * ?shot=cover-1920 shows 1920x1080 cover
 */

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

  // Wait for render
  requestAnimationFrame(() => requestAnimationFrame(() => {
    window.__shotReady = true;
  }));
}