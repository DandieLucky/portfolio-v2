#!/usr/bin/env node
/**
 * Tulis ukuran asli setiap gambar ke src/data/asset-meta.json.
 *
 * Kenapa perlu: tanpa ukuran asli, browser menebak rasio gambar dari atribut
 * width/height yang ditulis tangan. Untuk foto vertikal tebakannya jauh, jadi
 * halaman "melompat" saat gambar selesai dimuat (CLS). Berkas ini membuat
 * setiap <img> menyebut ukuran yang benar, dan selalu ikut diperbarui saat build.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'public', 'assets');
const DEST = path.join(ROOT, 'src', 'data', 'asset-meta.json');
const EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);

const out = {};
let skipped = 0;

async function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (entry.name === '.DS_Store') continue;
    if (!EXT.has(path.extname(entry.name).toLowerCase())) {
      skipped += 1;
      continue;
    }
    try {
      const m = await sharp(full, { failOn: 'none' }).metadata();
      const rel = '/' + path.relative(path.join(ROOT, 'public'), full);
      // Browsers apply EXIF orientation before displaying the original photograph.
      out[rel] = m.orientation >= 5 && m.orientation <= 8
        ? [m.height, m.width]
        : [m.width, m.height];
    } catch {
      skipped += 1;
    }
  }
}

await walk(SRC);
fs.writeFileSync(DEST, JSON.stringify(out, null, 2) + '\n');
console.log(
  `asset-meta.json — ${Object.keys(out).length} gambar terukur` +
    (skipped ? `, ${skipped} dilewati (video/pdf)` : '')
);
