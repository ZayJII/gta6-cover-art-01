// NEON FOLIO — GTA 6 Cover Art entry
// Copies app/ and screenshots/ to /output and writes dossier.json via buildDossier.
// Validates: 3-4 screenshots (PNG/JPEG, long side ≤1280, short side ≥480, ≤256 KiB each), app/index.html present.
// Exits non-zero with clear message on failure. Two runs from /tmp into different folders must be byte-identical.

import { cpSync, existsSync, mkdirSync, writeFileSync, readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Validate screenshots (3-4 files, each PNG/JPEG, long side <=1280, short side >=480, <=256 KiB)
const screenshotsDir = join(here, 'screenshots');
const screenshotNames = existsSync(screenshotsDir) ? readdirSync(screenshotsDir) : [];
const validScreenshotNames = screenshotNames.filter(name => !name.startsWith('.'));

if (validScreenshotNames.length < 3 || validScreenshotNames.length > 4) {
  console.error(`FAIL: screenshots/ must contain 3-4 images, found ${validScreenshotNames.length}`);
  process.exit(1);
}

for (const name of validScreenshotNames) {
  const filePath = join(screenshotsDir, name);
  const stats = statSync(filePath);
  if (!stats.isFile()) continue;

  // Check file size <= 256 KiB
  if (stats.size > 262144) {
    console.error(`FAIL: ${name} is ${stats.size} bytes (> 256 KiB)`);
    process.exit(1);
  }

  // Check filename: letters, digits, . _ - only, 1-128 chars, not starting with . or -
  if (!/^[a-zA-Z0-9._-]{1,128}$/.test(name) || name.startsWith('.') || name.startsWith('-')) {
    console.error(`FAIL: ${name} has invalid filename (must be letters, digits, . _ -, not starting with . or -)`);
    process.exit(1);
  }

  // Check image dimensions (basic PNG/JPEG header check)
  const buffer = readFileSync(filePath);
  let width = 0, height = 0;

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    // PNG
    width = buffer.readUInt32BE(16);
    height = buffer.readUInt32BE(20);
  } else if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    // JPEG - parse SOF marker
    let i = 2;
    while (i < buffer.length - 1) {
      if (buffer[i] === 0xff && buffer[i + 1] >= 0xc0 && buffer[i + 1] <= 0xcf && buffer[i + 1] !== 0xc4 && buffer[i + 1] !== 0xc8 && buffer[i + 1] !== 0xcc) {
        height = buffer.readUInt16BE(i + 5);
        width = buffer.readUInt16BE(i + 7);
        break;
      }
      i += 2 + buffer.readUInt16BE(i + 2);
    }
  }

  if (width > 0 && height > 0) {
    const longSide = Math.max(width, height);
    const shortSide = Math.min(width, height);
    if (longSide > 1280) {
      console.error(`FAIL: ${name} long side ${longSide}px > 1280px`);
      process.exit(1);
    }
    if (shortSide < 480) {
      console.error(`FAIL: ${name} short side ${shortSide}px < 480px`);
      process.exit(1);
    }
  } else {
    console.error(`FAIL: ${name} could not determine dimensions (not valid PNG/JPEG)`);
    process.exit(1);
  }
}

// Check app/index.html exists
if (!existsSync(join(here, 'app', 'index.html'))) {
  console.error('FAIL: app/index.html not found');
  process.exit(1);
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in app/ or 48 MiB of app
// files, in all, or a path under app/ over 1000 bytes: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);
