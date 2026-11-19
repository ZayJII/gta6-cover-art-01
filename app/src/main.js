/**
 * NEON FOLIO — Main application
 * Wires the UI: photo loading, panel assignment, cropping, caption, layout, grade, export
 */

import { drawCover, loadImage, createDefaultCrop, LAYOUTS, GRADES, EXPORT_SIZES } from './cover.js';
import { runShot, SAMPLE_PHOTOS, COVER_PANEL_PHOTO_MAP } from './shots.js';

// Global hook for shot crops
window.__applyShotCrops = (crops) => {
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
const exportAllBtn = document.getElementById('export-all-btn');
const statusEl = document.getElementById('status');
const photoHint = document.getElementById('photo-hint');

// State
let photos = [];              // Loaded Image objects
let panelPhotos = [];         // Which photo index goes to each panel
let crops = [];               // Crop state per photo: { x, y, scale }
let selectedPanel = 0;        // Currently selected panel index
let selectedPhotoIndex = 0;   // Currently selected photo thumbnail
let currentLayout = 'mosaic';
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
  if (!layout || panelIdx >= layout.length) return 1;
  const panel = layout[panelIdx];
  if (panel.isEmblem) return 1;
  return panel.w / panel.h;
}

// Get number of non-emblem panels
function getPanelCount() {
  const layout = LAYOUTS[currentLayout];
  if (!layout) return 4;
  return layout.filter(p => !p.isEmblem).length;
}

// Handle photo input
photoInput.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    if (photos.length >= 10) break;
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
  if (photos.length > 0) {
    updateStep(2);
  }
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

  // Reset panel assignments when layout changes - use 9-slot map for mosaic layouts
  const layoutObj = LAYOUTS[currentLayout] || LAYOUTS['mosaic'];
  if (currentLayout.startsWith('mosaic')) {
    panelPhotos = COVER_PANEL_PHOTO_MAP.slice(0, layoutObj.length);
  } else {
    const panelCount = layoutObj.filter(p => !p.isEmblem).length;
    panelPhotos = Array.from({ length: panelCount }, (_, i) => Math.min(i, photos.length - 1));
  }
  selectedPanel = 0;
  updateThumbnails();
  redraw();

  // Update step indicator
  updateStep(2);
});

// Grade preset buttons
gradePresets.addEventListener('click', (e) => {
  const btn = e.target.closest('.grade-btn');
  if (!btn) return;
  currentGrade = btn.dataset.grade;
  document.querySelectorAll('.grade-btn').forEach(b => b.classList.toggle('active', b === btn));
  redraw();
  updateStep(2);
});

// Size preset buttons
sizePresets.addEventListener('click', (e) => {
  const btn = e.target.closest('.size-btn');
  if (!btn) return;
  currentSize = btn.dataset.size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b === btn));
  resizeCanvas();
  updateStep(3);
});

// Update step indicator
function updateStep(step) {
  document.querySelectorAll('.step').forEach((el, idx) => {
    el.classList.toggle('active', idx + 1 === step);
  });
}

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
  if (!layout) return null;
  for (let i = 0; i < layout.length; i++) {
    const panel = layout[i];
    if (panel.isEmblem) continue;
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
  const layout = LAYOUTS[currentLayout];
  const panel = layout[selectedPanel];
  if (!panel) return;
  const panelW = panel.w * canvas.width;
  const panelH = panel.h * canvas.height;
  const photo = photos[photoIdx];

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

  const layout = LAYOUTS[currentLayout];
  const panel = layout[panelIdx];
  if (!panel) return;
  const panelW = panel.w * canvas.width;
  const panelH = panel.h * canvas.height;
  const mouseRelX = (coords.x - panel.x * canvas.width) / panelW;
  const mouseRelY = (coords.y - panel.y * canvas.height) / panelH;

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

// Export single size
async function exportSize(sizeKey) {
  if (photos.length === 0) {
    statusEl.textContent = 'Add a photo first';
    return false;
  }

  const size = EXPORT_SIZES[sizeKey];
  const offscreen = document.createElement('canvas');
  offscreen.width = size.width;
  offscreen.height = size.height;

  drawCover(offscreen, photos, panelPhotos, crops, currentLayout, currentGrade, captionInput.value, sizeKey);

  return new Promise((resolve) => {
    offscreen.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      a.download = `neon-folio-${sizeKey}-${timestamp}.png`;
      a.click();
      URL.revokeObjectURL(url);
      statusEl.textContent = `Saved ${a.download} (${size.width} × ${size.height})`;
      resolve(true);
    }, 'image/png');
  });
}

exportBtn.addEventListener('click', async () => {
  exportBtn.disabled = true;
  exportBtn.textContent = 'Exporting...';
  await exportSize(currentSize);
  exportBtn.disabled = false;
  exportBtn.textContent = 'Export PNG';
});

// Export all 3 sizes
exportAllBtn.addEventListener('click', async () => {
  if (photos.length === 0) {
    statusEl.textContent = 'Add a photo first';
    return;
  }

  exportAllBtn.disabled = true;
  exportAllBtn.textContent = 'Exporting All...';

  const sizes = ['1080x1080', '1080x1350', '1920x1080'];
  for (const sizeKey of sizes) {
    await exportSize(sizeKey);
    // Small delay between exports
    await new Promise(r => setTimeout(r, 100));
  }

  exportAllBtn.disabled = false;
  exportAllBtn.textContent = 'Export All 3 Sizes';
  statusEl.textContent = 'Exported all 3 sizes!';
});

// Shot mode for screenshots
const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), async (sample, text, layout, grade, size) => {
    // Hide UI for cover shots
    if (shot.startsWith('cover')) {
      document.body.classList.add('shot-cover');
    }

    // Load ALL sample photos for cover shots (different photo per panel)
    // For editor shot, also load all samples and use the same panel map
    if (shot.startsWith('cover') || shot === 'editor') {
      // Load all 6 sample photos
      photos = await Promise.all(
        SAMPLE_PHOTOS.map(name => loadImage(`samples/${name}.jpg`))
      );

      // Assign photos to each panel using 9-slot map (matching layout indices 0-8)
      // Index 4 is emblem (-1 sentinel), so panelPhotos has 9 entries
      const layoutObj = LAYOUTS[currentLayout] || LAYOUTS['mosaic'];
      panelPhotos = COVER_PANEL_PHOTO_MAP.slice(0, layoutObj.length);

      // Create default crops for each photo
      const panelAspect = getPanelAspect(0);
      crops = photos.map(img => createDefaultCrop(img, panelAspect));
    } else {
      // Fallback: load single photo
      const img = await loadImage(sample);
      photos = [img];
      const panelCount = getPanelCount();
      panelPhotos = Array.from({ length: panelCount }, (_, i) => 0);
      const panelAspect = getPanelAspect(0);
      crops = [createDefaultCrop(img, panelAspect)];
    }

    captionInput.value = text;
    currentLayout = layout || 'mosaic';
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
      const cropMap = {};

      if (currentLayout.startsWith('mosaic')) {
        let panelNames, layoutIndices;
        if (currentLayout === 'mosaic-1080') {
          // 7 panels: indices 0,1,2 are top row; 3 is emblem; 4,5,6 are bottom row
          panelNames = ['p1', 'p2', 'p3', 'p5', 'p6', 'p7'];
          layoutIndices = [0, 1, 2, 4, 5, 6];
        } else {
          // Legacy 9-panel mosaic: emblem at index 4
          panelNames = ['p1', 'p2', 'p3', 'p4', 'p6', 'p7', 'p8', 'p9'];
          layoutIndices = [0, 1, 2, 3, 5, 6, 7, 8];
        }
        panelNames.forEach((name, idx) => {
          if (shotCrops[name]) cropMap[layoutIndices[idx]] = shotCrops[name];
        });
      } else if (currentLayout === 'hero-left' || currentLayout === 'hero-right') {
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

      const layoutObj = LAYOUTS[currentLayout] || LAYOUTS['mosaic'];
      const panelCount = layoutObj.length;
      panelCrops = new Array(panelCount);
      for (let i = 0; i < panelCount; i++) {
        panelCrops[i] = cropMap[i] || { x: 0.5, y: 0.5, scale: 1 };
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
      loadImage('samples/neon-boardwalk.jpg').then(img3 => {
        photos.push(img3);
        crops.push(createDefaultCrop(img3, getPanelAspect(0)));
        loadImage('samples/moto-wheelie.jpg').then(img4 => {
          photos.push(img4);
          crops.push(createDefaultCrop(img4, getPanelAspect(0)));
          loadImage('samples/supercar-deco.jpg').then(img5 => {
            photos.push(img5);
            crops.push(createDefaultCrop(img5, getPanelAspect(0)));
            loadImage('samples/marina-dusk.jpg').then(img6 => {
              photos.push(img6);
              crops.push(createDefaultCrop(img6, getPanelAspect(0)));

              // Auto-assign using 9-slot map (matching layout indices 0-8)
              const layoutObj = LAYOUTS[currentLayout] || LAYOUTS['mosaic'];
              panelPhotos = COVER_PANEL_PHOTO_MAP.slice(0, layoutObj.length);
              selectPhoto(0);
              updateThumbnails();
              updatePhotoHint();
              redraw();
            }).catch(() => {
              updatePhotoHint();
              redraw();
            });
          }).catch(() => {
            updatePhotoHint();
            redraw();
          });
        }).catch(() => {
          updatePhotoHint();
          redraw();
        });
      }).catch(() => {
        updatePhotoHint();
        redraw();
      });
    }).catch(() => {
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