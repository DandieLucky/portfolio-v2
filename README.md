# Dandie — Portfolio v2

Portofolio kreatif bertema light glassmorphism: kaca putih, aksen lavender/mint,
bevel halus, serta galeri desain, motion, video, dan fotografi. Dibangun dengan Astro.
Tersedia dalam bahasa Indonesia dan Inggris.

| | Versi 2 |
|---|---|
| Repositori | https://github.com/DandieLucky/portfolio-v2 |
| Website | https://dandielucky.github.io/portfolio-v2/ |
| Folder lokal yang disarankan | `~/Documents/portfolio-dandie-v2` |
| Pratinjau lokal | http://localhost:4321/ |

Versi ini memakai salinan 79 aset asli. Foto, video, gambar proyek, dan PDF CV
tetap berada di `public/assets/`; tidak ada aset lama yang dihapus atau ditimpa.
Repositori `dandielucky.github.io` dan website portofolio lama tetap terpisah.

## Tampilan & interaksi

- Panel kaca, navigasi mengambang, dan bingkai karya memakai CSS custom.
- Tilt 3D ringan pada hero dan kartu karya untuk pointer/mouse. Tidak aktif pada layar sentuh.
- Reveal saat scroll, elemen hero mengambang, dan transisi halaman Astro.
- Tombol jeda animasi di header menyimpan pilihan pengunjung di `localStorage`.
- `prefers-reduced-motion` otomatis mematikan motion dekoratif, termasuk tilt.
- Filter proyek, lightbox foto, salin email, video, unduh CV, dan navigasi dua bahasa tetap tersedia.
- Semua 79 file di `public/assets/` dipertahankan tanpa perubahan isi. Tidak ada dependensi produksi baru.
- Fotografi menggabungkan Posh by Her, dokumentasi BNSP, arsip foto, dan potret profil. Foto Posh by Her dibaca dari folder aset saat build dan dipakai bersama oleh halaman proyek dan Fotografi.
- Urutan di beranda, arsip, dan proyek berikutnya memakai nilai `order` konten yang sama.
- Pusinfomar adalah proyek editing video; proyek UI/UX instansi pemerintah di riwayat pengalaman merupakan entri terpisah.

## Mengambil desain baru ke folder v2 yang sudah dibuat

Buka Terminal lalu jalankan:

```bash
cd ~/Documents/portfolio-dandie-v2
pwd
git status --short
git remote -v
```

Pastikan `pwd` berakhir dengan `portfolio-dandie-v2`. Jika `git status --short`
menampilkan perubahan, simpan eksperimenmu terlebih dahulu sebelum mengambil
desain baru. Jangan menimpa atau menghapus perubahan yang masih dibutuhkan.

Untuk folder yang masih bersih dan hasil `git remote -v` kosong:

```bash
git remote add origin https://github.com/DandieLucky/portfolio-v2.git
git pull --ff-only origin main
npm ci
npm run dev
```

Buka http://localhost:4321/. Jika `git pull --ff-only` ditolak, berhenti dan
periksa riwayat/perubahan lokal terlebih dahulu; jangan memakai `git reset --hard`.
Jika `origin` sudah ada, periksa alamatnya; repo versi ini harus `portfolio-v2`.

## Mulai di komputer lain

```bash
git clone https://github.com/DandieLucky/portfolio-v2.git ~/Documents/portfolio-dandie-v2
cd ~/Documents/portfolio-dandie-v2
npm ci
npm run dev
```

## Mengedit dan menerbitkan

Edit file di folder v2. `npm run dev` memperbarui pratinjau lokal saat file disimpan.
Untuk menerbitkan perubahan ke website versi 2:

```bash
npm run publish "Perbarui desain portofolio v2"
```

Perintah itu memeriksa alamat `origin`, membangun situs, membuat commit, lalu
mengirimnya ke branch `main` repositori `portfolio-v2`. GitHub Actions otomatis
membangun dan menerbitkan situs. Publikasi ditolak jika koneksi repo masih kosong
atau menunjuk repo portofolio lama. Login GitHub/Git di komputer tetap diperlukan.

| Yang ingin diubah | Lokasi |
|---|---|
| Beranda | `src/views/Home.astro` |
| Warna, tipografi, komponen dasar | `src/styles/global.css` |
| Karya dan detail proyek | `src/views/WorkIndex.astro`, `src/views/CasePage.astro`, `src/styles/work.css` |
| Tentang, kontak, fotografi, lab | `src/views/`, `src/styles/secondary.css` |
| Isi proyek dua bahasa | `src/content/work/id/` dan `src/content/work/en/` |
| Teks UI dan kontak | `src/i18n/ui.ts` |
| Pengalaman dan keahlian | `src/data/timeline.ts` |
| Album fotografi dan foto Posh by Her | `src/data/photography.ts` |
| Foto dan video asli | `public/assets/` |
| CV | `public/assets/cv/Dandie-Lucky-Maulana_CV.pdf` |

Jangan menjalankan `npm run assets:placeholders` untuk mendesain ulang: skrip itu
membuat placeholder dan dapat menimpa media. Gunakan aset yang sudah tersedia.

## Build dan hosting

```bash
npm run build
npm run preview
```

Build lokal memakai URL root. GitHub Actions menjalankan build dengan
`SITE_BASE=/portfolio-v2`, kemudian `scripts/apply-site-base.mjs` menyesuaikan URL
hasil HTML, CSS, JavaScript, sitemap, robots, dan metadata agar media dan navigasi
berfungsi di alamat project Pages. Aset sumber tidak berubah.

```bash
SITE_BASE=/portfolio-v2 npm run build
```

Hosting GitHub Pages menggunakan **Settings → Pages → Source: GitHub Actions**.
Status publikasi tersedia di https://github.com/DandieLucky/portfolio-v2/actions.
`npm run deploy` merupakan alternatif Cloudflare Pages dan memakai nama proyek
terpisah `portfolio-dandie-v2` secara default.
