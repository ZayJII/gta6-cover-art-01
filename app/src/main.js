/**
 * NEON FOLIO — Main application
 * Wires the UI: photo loading, panel assignment, cropping, caption, layout, grade, export
 */

import { drawCover, loadImage, createDefaultCrop, LAYOUTS, GRADES, EXPORT_SIZES } from './cover.js';
import { runShot } from './shots.js';

// Global hook for shot crops
window.__applyShotCrops = (crops) => {
  // This will be set after photos are loaded
  window.__pendingShotCrops = crops;
};

const canvas = document.getElementById('cover');
const captionInput = document.getElementById('caption-input');
const photoInput = document.getElementById('photo-input');
const photoThumbnails = document.getElementById('photo-thumbnails');
const layoutPresets = document.getElementById('layout-presets');
const gradePresets = document.getElementById('grade-presets');
const sizePresets = document.getElementById('size-presets');
const exportBtn = document.getElementById('export-btn');
const statusEl = document.getElementById('status');
const photoHint = document.getElementById('photo-hint');

// State
let photos = [];              // Loaded Image objects
let panelPhotos = [0, 0, 0, 0]; // Which photo index goes to each panel
let crops = [];               // Crop state per photo: { x, y, scale }
let selectedPanel = 0;        // Currently selected panel index
let selectedPhotoIndex = 0;   // Currently selected photo thumbnail
let currentLayout = 'hero-left';
let currentGrade = 'vice-sunset';
let currentSize = '1080x1080';
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let cropStart = { x: 0, y: 0 };

// Initialize canvas size
function resizeCanvas() {
  const size = EXPORT_SIZES[currentSize];
  canvas.width = size.width;
  canvas.height = size.height;
  redraw();
}

// Redraw the cover
function redraw(panelCrops) {
  drawCover(canvas, photos, panelPhotos, crops, currentLayout, currentGrade, captionInput.value, currentSize, panelCrops);
  updateThumbnailActiveStates();
}

// Update photo thumbnails display
function updateThumbnails() {
  photoThumbnails.innerHTML = '';
  photos.forEach((photo, idx) => {
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb' + (idx === selectedPhotoIndex ? ' active' : '');
    thumb.dataset.index = idx;
    thumb.innerHTML = `
      <img src="${photo.src}" alt="Photo ${idx + 1}">
      <button class="remove" type="button" aria-label="Remove photo" data-index="${idx}">&times;</button>
    `;
    thumb.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove')) return;
      selectPhoto(idx);
    });
    thumb.querySelector('.remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removePhoto(idx);
    });
    photoThumbnails.appendChild(thumb);
  });
  updateThumbnailActiveStates();
}

// Update which thumbnails show as assigned to selected panel
function updateThumbnailActiveStates() {
  document.querySelectorAll('.photo-thumb').forEach((thumb, idx) => {
    const isAssigned = panelPhotos[selectedPanel] === idx;
    thumb.classList.toggle('assigned', isAssigned);
    thumb.title = isAssigned ? `Assigned to panel ${selectedPanel + 1} — click to unassign` : `Click to assign to panel ${selectedPanel + 1}`;
  });
}

// Select a photo thumbnail
function selectPhoto(idx) {
  selectedPhotoIndex = idx;
  // Assign this photo to the selected panel
  panelPhotos[selectedPanel] = idx;
  // Ensure crop exists
  if (!crops[idx]) {
    const panelAspect = getPanelAspect(selectedPanel);
    crops[idx] = createDefaultCrop(photos[idx], panelAspect);
  }
  updateThumbnails();
  redraw();
}

// Remove a photo
function removePhoto(idx) {
  photos.splice(idx, 1);
  crops.splice(idx, 1);
  // Update panel assignments
  panelPhotos = panelPhotos.map(p => p > idx ? p - 1 : (p === idx ? 0 : p));
  selectedPhotoIndex = Math.max(0, Math.min(selectedPhotoIndex, photos.length - 1));
  if (photos.length === 0) {
    selectedPanel = 0;
  }
  updateThumbnails();
  redraw();
}

// Get panel aspect ratio for crop calculations
function getPanelAspect(panelIdx) {
  const layout = LAYOUTS[currentLayout];
  const panel = layout[panelIdx];
  return panel.w / panel.h;
}

// Handle photo input
photoInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    if (photos.length >= 10) break; // Limit
    try {
      const img = await loadImage(URL.createObjectURL(file));
      photos.push(img);
      const panelAspect = getPanelAspect(0);
      crops.push(createDefaultCrop(img, panelAspect));
    } catch (err) {
      console.error('Failed to load image:', err);
    }
  }
  photoInput.value = '';
  if (photos.length > 0 && selectedPhotoIndex === 0) {
    selectPhoto(0);
  }
  updateThumbnails();
  updatePhotoHint();
  redraw();
});

// Update photo hint visibility
function updatePhotoHint() {
  photoHint.style.display = photos.length === 0 ? 'block' : 'none';
}

// Layout preset buttons
layoutPresets.addEventListener('click', (e) => {
  const btn = e.target.closest('.layout-btn');
  if (!btn) return;
  currentLayout = btn.dataset.layout;
  document.querySelectorAll('.layout-btn').forEach(b => b.classList.toggle('active', b === btn));
  // Reset panel assignments when layout changes
  panelPhotos = [0, 0, 0, 0].map((_, i) => Math.min(i, photos.length - 1));
  selectedPanel = 0;
  updateThumbnails();
  redraw();
});

// Grade preset buttons
gradePresets.addEventListener('click', (e) => {
  const btn = e.target.closest('.grade-btn');
  if (!btn) return;
  currentGrade = btn.dataset.grade;
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.toggle('active', b === btn));
  redraw();
});

// Size preset buttons
sizePresets.addEventListener('click', (e) => {
  const btn = e.target.closest('.size-btn');
  if (!btn) return;
  currentSize = btn.dataset.size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b === btn));
  resizeCanvas();
});

// Caption input
captionInput.addEventListener('input', () => {
  redraw();
});

// Canvas interaction — panel selection and crop drag/zoom
function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function getPanelAtPoint(x, y) {
  const layout = LAYOUTS[currentLayout];
  for (let i = 0; i < layout.length; i++) {
    const panel = layout[i];
    const px = panel.x * canvas.width;
    const py = panel.y * canvas.height;
    const pw = panel.w * canvas.width;
    const ph = panel.h * canvas.height;
    if (x >= px && x <= px + pw && y >= py && y <= py + ph) {
      return i;
    }
  }
  return null;
}

canvas.addEventListener('mousedown', (e) => {
  const coords = getCanvasCoords(e);
  const panelIdx = getPanelAtPoint(coords.x, coords.y);
  if (panelIdx !== null) {
    selectedPanel = panelIdx;
    updateThumbnails();
    // Check if click is on the selected panel's photo (for drag)
    if (photos.length > 0) {
      isDragging = true;
      dragStart = coords;
      const photoIdx = panelPhotos[selectedPanel];
      cropStart = { ...crops[photoIdx] };
      canvas.style.cursor = 'grabbing';
    }
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDragging || photos.length === 0) return;
  const coords = getCanvasCoords(e);
  const photoIdx = panelPhotos[selectedPanel];
  const crop = crops[photoIdx];
  const panel = LAYOUTS[currentLayout][selectedPanel];
  const panelW = panel.w * canvas.width;
  const panelH = panel.h * canvas.height;
  const photo = photos[photoIdx];

  // Pan: drag moves the crop window
  const dx = (coords.x - dragStart.x) / panelW;
  const dy = (coords.y - dragStart.y) / panelH;

  crop.x = Math.max(0, Math.min(1, cropStart.x - dx / crop.scale));
  crop.y = Math.max(0, Math.min(1, cropStart.y - dy / crop.scale));

  redraw();
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = '';
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  canvas.style.cursor = '';
});

// Wheel to zoom
canvas.addEventListener('wheel', (e) => {
  if (photos.length === 0) return;
  const coords = getCanvasCoords(e);
  const panelIdx = getPanelAtPoint(coords.x, coords.y);
  if (panelIdx === null) return;

  e.preventDefault();
  const photoIdx = panelPhotos[panelIdx];
  const crop = crops[photoIdx];
  const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
  const newScale = Math.max(0.15, Math.min(3, crop.scale * zoomFactor));

  // Zoom toward/away from mouse position
  const panel = LAYOUTS[currentLayout][panelIdx];
  const panelW = panel.w * canvas.width;
  const panelH = panel.h * canvas.height;
  const mouseRelX = (coords.x - panel.x * canvas.width) / panelW;
  const mouseRelY = (coords.y - panel.y * canvas.height) / panelH;

  // Adjust crop position to zoom toward cursor
  const scaleRatio = newScale / crop.scale;
  crop.x = Math.max(0, Math.min(1, crop.x + (mouseRelX - crop.x) * (1 - 1 / scaleRatio)));
  crop.y = Math.max(0, Math.min(1, crop.y + (mouseRelY - crop.y) * (1 - 1 / scaleRatio)));
  crop.scale = newScale;

  redraw();
}, { passive: false });

// Double-click panel to select it (for touch)
canvas.addEventListener('dblclick', (e) => {
  const coords = getCanvasCoords(e);
  const panelIdx = getPanelAtPoint(coords.x, coords.y);
  if (panelIdx !== null) {
    selectedPanel = panelIdx;
    updateThumbnails();
    redraw();
  }
});

// Export button
exportBtn.addEventListener('click', () => {
  if (photos.length === 0) {
    statusEl.textContent = 'Add a photo first';
    return;
  }

  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting...';

  // Draw at export size on offscreen canvas
  const size = EXPORT_SIZES[currentSize];
  const offscreen = document.createElement('canvas');
  offscreen.width = size.width;
  offscreen.height = size.height;
  const offCtx = offscreen.getContext('2d');

  // Use drawCover with export size
  drawCover(offscreen, photos, panelPhotos, crops, currentLayout, currentGrade, captionInput.value, currentSize);

  offscreen.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `neon-folio-${currentSize}-${timestamp}.png`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = `Saved ${a.download} (${size.width} × ${size.height})`;
    exportBtn.disabled = false;
    exportBtn.textContent = 'Export PNG';
  }, 'image/png');
});

// Shot mode for screenshots
const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), async (sample, text, layout, grade, size) => {
    // Load sample photo
    const img = await loadImage(sample);
    photos = [img];
    const panelAspect = getPanelAspect(0);
    crops = [createDefaultCrop(img, panelAspect)];
    panelPhotos = [0, 0, 0, 0];
    captionInput.value = text;
    currentLayout = layout || 'hero-left';
    currentGrade = grade || 'vice-sunset';
    currentSize = size || '1080x1080';
    document.querySelectorAll('.layout-btn').forEach(b => b.classList.toggle('active', b.dataset.layout === currentLayout));
    document.querySelectorAll('.grade-btn').forEach(b => b.classList.toggle('active', b.dataset.grade === currentGrade));
    document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === currentSize));
    selectedPanel = 0;
    selectedPhotoIndex = 0;
    resizeCanvas();
    updateThumbnails();

    // Apply distinct crops per panel for cover shots
    let panelCrops = null;
    if (window.__pendingShotCrops) {
      const shotCrops = window.__pendingShotCrops;
      // Map shot crop keys to panel indices based on layout
      const cropMap = {};
      if (currentLayout === 'hero-left' || currentLayout === 'hero-right') {
        cropMap.hero = 0;
        cropMap.topRight = 1;
        cropMap.midRight = 2;
        cropMap.bottomRight = 3;
      } else if (currentLayout === 'hero-top') {
        cropMap.hero = 0;
        cropMap.bottomLeft = 1;
        cropMap.bottomMid = 2;
        cropMap.bottomRight = 3;
      } else if (currentLayout === 'hero-bottom') {
        cropMap.hero = 0;
        cropMap.topLeft = 1;
        cropMap.topMid = 2;
        cropMap.topRight = 3;
      }
      panelCrops = [null, null, null, null];
      for (const [key, panelIdx] of Object.entries(cropMap)) {
        if (shotCrops[key]) {
          panelCrops[panelIdx] = shotCrops[key];
        }
      }
      // Fill any missing with default
      for (let i = 0; i < 4; i++) {
        if (!panelCrops[i]) {
          panelCrops[i] = { x: 0.5, y: 0.5, scale: 1 };
        }
      }
    }
    redraw(panelCrops);
  });
} else {
  // Try to load sample photos on startup
  loadImage('samples/pier.jpg').then(img => {
    photos.push(img);
    crops.push(createDefaultCrop(img, getPanelAspect(0)));
    loadImage('samples/boulevard.jpg').then(img2 => {
      photos.push(img2);
      crops.push(createDefaultCrop(img2, getPanelAspect(0)));
      selectPhoto(0);
      updateThumbnails();
      updatePhotoHint();
      redraw();
    });
  }).catch(() => {
    updatePhotoHint();
    redraw();
  });
}

// Initial setup
resizeCanvas();
updatePhotoHint();