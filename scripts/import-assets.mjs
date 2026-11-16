#!/usr/bin/env node
/**
 * Impor materi mentah dari ./Assets ke public/assets, siap tayang di web.
 *
 *   node scripts/import-assets.mjs            # proses semua
 *   node scripts/import-assets.mjs posh-by-her   # satu proyek saja
 *   node scripts/import-assets.mjs --dry      # hitung saja, tidak menulis
 *
 * Aturan yang dipakai konsisten:
 *  - Gambar diberi orientasi benar (EXIF), bukan dipercaya apa adanya.
 *  - Cover selalu 16:9 1600×900. Sumber vertikal tidak dipotong isinya —
 *    ditempel di atas salinan buramnya sendiri (blurred pad).
 *  - Isi galeri tidak dipotong; sisi panjang dibatasi 1600.
 *  - Tangkapan layar Instagram dipangkas bagian status bar + navigasi bawah.
 *  - PNG transparan diratakan ke warna kertas situs (#f8f6f1).
 *  - Video dipotong jadi highlight 25 detik, sisi panjang ≤1080, +poster.
 */
import sharp from 'sharp';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'Assets');
const OUT = path.join(ROOT, 'public', 'assets');
const FFMPEG =
  process.env.FFMPEG || '/Users/dandielucky/.hermes/tools/ffmpeg-9.0.1-darwin-arm64/ffmpeg';
const PAPER = '#f8f6f1';
const DRY = process.argv.includes('--dry');
const POSTERS_ONLY = process.argv.includes('--posters-only');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const log = [];
const say = (s) => {
  log.push(s);
  console.log(s);
};
const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB';

/* ─────────────────────────── peta proyek ─────────────────────────── */

/** image items: {file, name, alt, crop} · video items: {file, name, alt, start, dur} */
const PROJECTS = [
  {
    slug: 'matahari-grosir',
    folder: 'MATAHARI GROSIR',
    coverFrom: { video: 'Contoh Konten 2.mp4', start: 2 },
    images: [],
    videos: [
      { file: 'Contoh Konten.mp4', name: 'konten-01', alt: 'Contoh konten video Matahari Grosir', start: 1, dur: 22 },
      { file: 'Contoh Konten 2.mp4', name: 'konten-02', alt: 'Contoh konten video Matahari Grosir kedua', start: 2, dur: 25 },
      { file: 'Contoh Konten 3.mp4', name: 'konten-03', alt: 'Contoh konten video Matahari Grosir ketiga', start: 1, dur: 16 },
    ],
  },
  {
    slug: 'olimpiade-polimedia-2025',
    folder: 'Olimpiade Polimedia2025',
    coverFrom: { file: 'WhatsApp Image 2026-11-16 at 00.47.50 (2).jpeg', crop: 'ig' },
    images: [
      ['WhatsApp Image 2026-11-16 at 00.47.50 (2).jpeg', 'poster-01', 'Poster Olimpiade Polimedia 2025 — penutupan dan daftar sponsor'],
      ['WhatsApp Image 2026-11-16 at 00.47.48.jpeg', 'poster-02', 'Poster open recruitment kepanitiaan Olimpiade Polimedia 2025'],
      ['WhatsApp Image 2026-11-16 at 00.47.39.jpeg', 'poster-03', 'Poster susunan koordinator lapangan dan divisi'],
      ['WhatsApp Image 2026-11-16 at 00.47.49.jpeg', 'poster-04', 'Poster cabang lomba dan struktur kepanitiaan'],
      ['WhatsApp Image 2026-11-16 at 00.47.49 (1).jpeg', 'poster-05', 'Poster syarat dan ketentuan supporter'],
      ['WhatsApp Image 2026-11-16 at 00.47.48 (1).jpeg', 'poster-06', 'Poster hitung mundur menuju hari pelaksanaan'],
      ['WhatsApp Image 2026-11-16 at 00.47.49 (2).jpeg', 'poster-07', 'Poster hitung mundur hari ke-1 sampai ke-4'],
      ['WhatsApp Image 2026-11-16 at 00.47.50.jpeg', 'poster-08', 'Poster hitung mundur hari ke-5 sampai ke-8'],
      ['WhatsApp Image 2026-11-16 at 00.47.50 (1).jpeg', 'poster-09', 'Poster pengumuman juara dan penutupan'],
    ],
    videos: [],
  },
  {
    slug: 'pkkmb-polimedia-2026',
    folder: 'PKKMB Polimedia 2026',
    coverFrom: { file: '1.jpeg', crop: 'ig' },
    images: [
      ['1.jpeg', 'poster-01', 'Poster timeline dan jingle PKKMB Polimedia 2026'],
      ['2.jpeg', 'poster-02', 'Poster menu informasi PKKMB Polimedia 2026'],
      ['3.jpeg', 'poster-03', 'Poster hitung mundur hari pelaksanaan PKKMB'],
      ['4.jpeg', 'poster-04', 'Poster twibbon dan pengenalan maskot PKKMB'],
      ['5.jpeg', 'poster-05', 'Poster layanan kreator muda PKKMB Polimedia 2026'],
    ],
    videos: [],
  },
  {
    slug: 'pusinfomar',
    folder: 'TNI Pusinformar',
    coverFrom: { video: 'PUSINFOMAR.mp4', start: 6 },
    images: [],
    videos: [
      { file: 'PUSINFOMAR.mp4', name: 'rekam-01', alt: 'Rekaman proses editing video Pusinfomar TNI', start: 6, dur: 25 },
      { file: 'PUSINFOMAR 2.mp4', name: 'rekam-02', alt: 'Rekaman proses editing video Pusinfomar TNI — kedua', start: 12, dur: 25 },
    ],
  },
  {
    slug: 'darya-varia',
    folder: 'Darya Varia',
    coverFrom: { video: 'Full .mp4', start: 18 },
    images: [],
    videos: [
      { file: 'Full .mp4', name: 'hut50', alt: 'Video motion graphics HUT ke-50 Darya Varia', start: 14, dur: 28 },
    ],
  },
  {
    slug: 'posh-by-her',
    folder: 'Posh by her',
    coverFrom: { file: 'B0002889.JPG' },
    images: [
      ['B0002889.JPG', 'foto-01', 'Fotografi acara Posh by Her'],
      ['B0002850.JPG', 'foto-02', 'Fotografi acara Posh by Her'],
      ['B0003133.JPG', 'foto-03', 'Fotografi acara Posh by Her'],
      ['B0003203.JPG', 'foto-04', 'Fotografi acara Posh by Her'],
      ['B0003466.JPG', 'foto-05', 'Fotografi acara Posh by Her'],
      ['B0003468.JPG', 'foto-06', 'Fotografi acara Posh by Her'],
      ['B0003498.JPG', 'foto-07', 'Fotografi acara Posh by Her'],
    ],
    pair: true, // before/after dipilih otomatis dari dua foto paling mirip
    videos: [],
  },
  {
    slug: 'wilhelmina-cup-2024',
    folder: 'Wilhelmina Cup 2024',
    coverFrom: { file: 'SPARKLING OF RUN.png' },
    images: [
      ['logo-wilhemina-RESULT-NO-BG.png', 'logo', 'Logo Wilhelmina Cup'],
      ['Maskot-Bucup gaya 3.png', 'maskot-01', 'Maskot Bucup — gaya utama'],
      ['Maskot-Bucup gaya 2.png', 'maskot-02', 'Maskot Bucup — gaya alternatif'],
      ['Maskot-Bucup-[coloring]-RESULT-NOW.png', 'maskot-03', 'Maskot Bucup — versi garis untuk mewarnai'],
      ['SPARKLING OF RUN.png', 'poster-01', 'Poster Sparkling of Run'],
      ['Registration Closed.png', 'poster-02', 'Poster penutupan pendaftaran'],
      ['thanks for tenants feed.png', 'poster-03', 'Feed ucapan terima kasih untuk tenant'],
      ['TOTE BAG WILHELMINA DESIGN.png', 'tote-01', 'Desain tote bag Wilhelmina Cup'],
      ['mockup TOTE BAG WILHELMINA DESIGN (uk 30 cm x 40cm).png', 'tote-02', 'Mockup tote bag ukuran 30 × 40 cm'],
      ['JUARA 1.png', 'sertifikat', 'Sertifikat juara 1 Wilhelmina Cup'],
    ],
    videos: [],
  },
  {
    slug: 'si-paling-film',
    folder: 'Si Paling Film',
    coverFrom: { video: 'Contoh Film 2.mp4', start: 20 },
    images: [],
    videos: [
      { file: 'Contoh Film 2.mp4', name: 'film-01', alt: 'Cuplikan hasil penyuntingan video vertikal', start: 20, dur: 25 },
      { file: 'Contoh Film 3.mp4', name: 'film-02', alt: 'Cuplikan hasil penyuntingan video vertikal kedua', start: 25, dur: 25 },
      { file: 'Contoh Film 4.mp4', name: 'film-03', alt: 'Cuplikan hasil penyuntingan video vertikal ketiga', start: 20, dur: 25 },
      { file: 'Contoh Konten.mp4', name: 'film-04', alt: 'Cuplikan konten video vertikal', start: 20, dur: 25 },
    ],
  },
  {
    slug: 'bnsp',
    folder: 'BNSP',
    coverFrom: { file: 'batam.png' },
    images: [
      ['batam.png', 'kegiatan-01', 'Materi pelatihan dan uji kompetensi skema manajemen risiko, Batam'],
      ['WhatsApp Image 2026-11-16 at 00.54.13.jpeg', 'kegiatan-02', 'Foto dokumentasi di lokasi pelatihan vokasi'],
      ['WhatsApp Image 2026-11-16 at 00.54.13 (1).jpeg', 'kegiatan-03', 'Potret di lokasi kegiatan pelatihan'],
      ['WhatsApp Image 2026-11-16 at 00.52.18.jpeg', 'kegiatan-04', 'Kolase foto peserta dan kegiatan sertifikasi'],
      ['IMG_0214.jpg', 'kegiatan-05', 'Dokumentasi kegiatan pelatihan'],
    ],
    videos: [],
  },
];

/** galeri fotografi lepas — folder "Foto lain-lain" */
const GALLERY = {
  slug: 'fotografi',
  folder: 'Foto lain-lain',
  images: [
    ['05.png', 'foto-01', 'Foto arsip'],
    ['06.png', 'foto-02', 'Foto arsip'],
    ['08.png', 'foto-03', 'Foto arsip'],
    ['09.png', 'foto-04', 'Foto arsip'],
    ['10.png', 'foto-05', 'Foto arsip'],
    ['IMG_0546.JPG', 'foto-06', 'Foto arsip'],
    ['IMG_5985 (2).jpg', 'foto-07', 'Foto arsip'],
    ['IMG_9545.JPG', 'foto-08', 'Foto arsip'],
    ['IMG_9552.JPG', 'foto-09', 'Foto arsip'],
    ['IMG_9560.JPG', 'foto-10', 'Foto arsip'],
    ['IMG_9563.JPG', 'foto-11', 'Foto arsip'],
  ],
};

/* ─────────────────────────── util ─────────────────────────── */

function findFile(folder, name) {
  const dir = path.join(SRC, folder);
  if (!fs.existsSync(dir)) throw new Error(`folder tidak ada: ${dir}`);
  const norm = (s) =>
    s
      .replace(/[\u00a0\u2007\u202f]/g, ' ') // spasi tak-terputus dari macOS/Finder
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  const direct = path.join(dir, name);
  if (fs.existsSync(direct)) return direct;
  const hit = fs.readdirSync(dir).find((f) => norm(f) === norm(name));
  if (!hit) throw new Error(`file tidak ada: ${folder}/${name}`);
  return path.join(dir, hit);
}

function ensureDir(p) {
  if (!DRY) fs.mkdirSync(p, { recursive: true });
}

async function meta(file) {
  const m = await sharp(file, { failOn: 'none' }).rotate().metadata();
  return { w: m.width, h: m.height };
}

/** pangkas bilah status + navigasi Instagram dari tangkapan layar ponsel */
function igTrim(w, h) {
  const top = Math.round(h * 0.085);
  const bottom = Math.round(h * 0.075);
  return { left: 0, top, width: w, height: h - top - bottom };
}

/** cover 16:9 — sumber vertikal ditempel di atas salinan buramnya */
async function makeCover(file, dest, opts = {}) {
  let img = sharp(file, { failOn: 'none' }).rotate();
  const m = await img.metadata();
  let w = m.width;
  let h = m.height;
  if (opts.crop === 'ig') {
    const t = igTrim(w, h);
    img = img.extract(t);
    w = t.width;
    h = t.height;
  }
  const aspect = w / h;
  let buf;
  if (aspect < 1.2) {
    // vertikal / hampir persegi → blurred pad
    const bg = await sharp(file, { failOn: 'none' })
      .rotate()
      .resize(1600, 900, { fit: 'cover', position: 'attention' })
      .blur(34)
      .modulate({ brightness: 0.7, saturation: 0.85 })
      .toBuffer();
    const fg = await img
      .clone()
      .resize(1600, 900, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();
    buf = await sharp(bg)
      .composite([{ input: fg, gravity: 'center' }])
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
  } else {
    buf = await img
      .clone()
      .resize(1600, 900, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 84, mozjpeg: true })
      .toBuffer();
  }
  if (!DRY) fs.writeFileSync(dest, buf);
  return buf.length;
}

/** foto galeri — tidak dipotong, sisi panjang ≤1600 */
async function makePhoto(file, dest, opts = {}) {
  let img = sharp(file, { failOn: 'none' }).rotate();
  const m = await img.metadata();
  if (opts.crop === 'ig') img = img.extract(igTrim(m.width, m.height));
  const buf = await img
    .flatten({ background: PAPER })
    .resize(1600, 2000, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  if (!DRY) fs.writeFileSync(dest, buf);
  return buf.length;
}

function ffmpeg(args) {
  const r = spawnSync(FFMPEG, args, { encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error('ffmpeg gagal: ' + (r.stderr || '').slice(-500));
  return r.stderr || '';
}

/** poster dari frame video — rasio asli video, bukan dipaksa 16:9 */
async function videoPoster(video, start, dest) {
  const tmp = path.join(ROOT, '.cache-poster.jpg');
  ffmpeg(['-y', '-ss', String(start), '-i', video, '-frames:v', '1', '-q:v', '2', tmp]);
  const buf = await sharp(tmp, { failOn: 'none' })
    .rotate()
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  if (!DRY) fs.writeFileSync(dest, buf);
  fs.rmSync(tmp, { force: true });
  return buf.length;
}

/** highlight 25 detik, sisi panjang ≤1080 */
function videoHighlight(video, start, dur, dest) {
  if (POSTERS_ONLY && fs.existsSync(dest)) return fs.statSync(dest).size;
  ffmpeg([
    '-y',
    '-ss', String(start),
    '-t', String(dur),
    '-i', video,
    '-vf',
    "scale=w='if(gt(iw,ih),min(1080,iw),-2)':h='if(gt(iw,ih),-2,min(1080,ih))':flags=lanczos",
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-profile:v', 'high', '-level', '4.0',
    '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '64k', '-ac', '1',
    '-movflags', '+faststart',
    dest,
  ]);
  return fs.statSync(dest).size;
}

/** dHash 64-bit untuk mencari dua foto paling mirip */
async function dhash(file) {
  const { data } = await sharp(file, { failOn: 'none' })
    .rotate()
    .resize(9, 8, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let bits = '';
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 8; x++)
      bits += data[y * 9 + x] < data[y * 9 + x + 1] ? '1' : '0';
  return bits;
}
const hamming = (a, b) => [...a].reduce((n, c, i) => n + (c !== b[i]), 0);

/* ─────────────────────────── jalan ─────────────────────────── */

const manifest = {};
const report = [];

async function importProject(p) {
  const dest = path.join(OUT, 'work', p.slug);
  ensureDir(dest);
  let bytes = 0;
  const files = [];

  // cover
  if (p.coverFrom?.file) {
    const f = findFile(p.folder, p.coverFrom.file);
    const n = await makeCover(f, path.join(dest, 'cover.jpg'), { crop: p.coverFrom.crop });
    bytes += n;
    manifest[`/assets/work/${p.slug}/cover.jpg`] = false;
    files.push(['cover.jpg', n]);
  } else if (p.coverFrom?.video) {
    const f = findFile(p.folder, p.coverFrom.video);
    const n = await videoPoster(f, p.coverFrom.start ?? 2, path.join(dest, 'cover.jpg'));
    bytes += n;
    manifest[`/assets/work/${p.slug}/cover.jpg`] = false;
    files.push(['cover.jpg', n]);
  }

  // foto
  for (const [file, name, alt] of p.images) {
    const f = findFile(p.folder, file);
    const rel = name + '.jpg';
    const n = await makePhoto(f, path.join(dest, rel), { crop: /WhatsApp|^[0-9]\.jpe?g$/i.test(file) ? 'ig' : undefined });
    bytes += n;
    manifest[`/assets/work/${p.slug}/${rel}`] = false;
    files.push([rel, n]);
  }

  // before/after otomatis untuk proyek yang punya `pair`
  if (p.pair) {
    const hashes = [];
    for (const [file, name] of p.images) {
      hashes.push({ file, name, h: await dhash(findFile(p.folder, file)) });
    }
    let best = null;
    for (let i = 0; i < hashes.length; i++)
      for (let j = i + 1; j < hashes.length; j++) {
        const d = hamming(hashes[i].h, hashes[j].h);
        if (!best || d < best.d) best = { i, j, d };
      }
    if (best) {
      const a = hashes[best.i];
      const b = hashes[best.j];
      const n1 = await makePhoto(findFile(p.folder, a.file), path.join(dest, 'before.jpg'));
      const n2 = await makePhoto(findFile(p.folder, b.file), path.join(dest, 'after.jpg'));
      bytes += n1 + n2;
      manifest[`/assets/work/${p.slug}/before.jpg`] = false;
      manifest[`/assets/work/${p.slug}/after.jpg`] = false;
      files.push([`before.jpg ← ${a.file}`, n1], [`after.jpg ← ${b.file}`, n2]);
      say(`   pasangan sebelum/sesudah: ${a.file} ⇄ ${b.file}  (jarak hash ${best.d}/64)`);
    }
  }

  // video
  for (const v of p.videos) {
    const f = findFile(p.folder, v.file);
    const rel = v.name + '.mp4';
    const n = videoHighlight(f, v.start, v.dur, path.join(dest, rel));
    bytes += n;
    manifest[`/assets/work/${p.slug}/${rel}`] = false;
    files.push([rel, n]);
    const pn = await videoPoster(f, v.start, path.join(dest, v.name + '-poster.jpg'));
    bytes += pn;
    manifest[`/assets/work/${p.slug}/${v.name}-poster.jpg`] = false;
    files.push([v.name + '-poster.jpg', pn]);
  }

  report.push({ slug: p.slug, folder: p.folder, bytes, files });
  say(`\n■ ${p.slug}  (dari Assets/${p.folder})`);
  for (const [f, n] of files) say(`   ${mb(n).padStart(9)}  ${f}`);
  say(`   ${'—'.repeat(9)} ${' '.repeat(2)}total ${mb(bytes)}`);
}

async function importGallery() {
  const dest = path.join(OUT, 'gallery');
  ensureDir(dest);
  let bytes = 0;
  const files = [];
  for (const [file, name, alt] of GALLERY.images) {
    const f = findFile(GALLERY.folder, file);
    const rel = name + '.jpg';
    const n = await makePhoto(f, path.join(dest, rel));
    bytes += n;
    manifest[`/assets/gallery/${rel}`] = false;
    files.push([rel, n]);
  }
  report.push({ slug: 'galeri-fotografi', folder: GALLERY.folder, bytes, files });
  say(`\n■ galeri fotografi  (dari Assets/${GALLERY.folder})`);
  for (const [f, n] of files) say(`   ${mb(n).padStart(9)}  ${f}`);
  say(`   ${'—'.repeat(9)} ${' '.repeat(2)}total ${mb(bytes)}`);
}

const targets = ONLY.length ? PROJECTS.filter((p) => ONLY.includes(p.slug)) : PROJECTS;
const total = { bytes: 0, files: 0 };
for (const p of targets) await importProject(p);
if (!ONLY.length || ONLY.includes('fotografi')) await importGallery();

for (const r of report) {
  total.bytes += r.bytes;
  total.files += r.files.length;
}

// tulis manifest (hanya kalau bukan --dry)
if (!DRY) {
  const manPath = path.join(ROOT, 'src', 'data', 'assets.json');
  const existing = fs.existsSync(manPath) ? JSON.parse(fs.readFileSync(manPath, 'utf8')) : {};
  fs.writeFileSync(manPath, JSON.stringify({ ...existing, ...manifest }, null, 2) + '\n');
}

say(`\n═══ ringkasan: ${total.files} berkas · ${mb(total.bytes)} ═══`);
if (!DRY) say(`manifest: src/data/assets.json (+${Object.keys(manifest).length} entri)`);
if (DRY) say('(--dry: tidak ada berkas ditulis)');
