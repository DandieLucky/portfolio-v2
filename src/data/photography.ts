import fs from 'node:fs';
import path from 'node:path';
import type { Lang } from '../i18n/ui';

export type Photo = { src: string; alt: string; caption: string };
export type PhotoAlbum = { id: string; title: string; description: string; items: Photo[]; project?: string };

// These folders contain photographs. Covers are presentation copies, so the
// archive links to the original gallery file instead of repeating each cover.
function photoFiles(directory: string): string[] {
  const root = path.join(process.cwd(), 'public', 'assets', directory);
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((file) => file.isFile() && /\.(jpe?g|png|webp|avif)$/i.test(file.name) && !/^cover\./i.test(file.name))
    .map((file) => `/assets/${directory}/${file.name}`)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}

export function getPoshPhotos(lang: Lang): Photo[] {
  return photoFiles('work/posh-by-her').map((src, i) => ({
    src,
    alt: lang === 'id' ? `Fotografi acara Posh by Her — foto ${i + 1}` : `Posh by Her event photography — photograph ${i + 1}`,
    caption: `Posh by Her / ${String(i + 1).padStart(2, '0')}`,
  }));
}

export function getPhotographyAlbums(lang: Lang): PhotoAlbum[] {
  const id = lang === 'id';
  return [
    {
      id: 'posh-by-her', title: 'Posh by Her',
      description: id ? 'Potret tamu, interaksi, dan suasana acara.' : 'Guest portraits, interactions, and the atmosphere of the event.',
      project: '/work/posh-by-her', items: getPoshPhotos(lang),
    },
    {
      id: 'dokumentasi-bnsp', title: id ? 'Dokumentasi kegiatan BNSP' : 'BNSP event documentation',
      description: id ? 'Dokumentasi kegiatan pelatihan dan asesmen, termasuk kolase foto kegiatan.' : 'Training and assessment documentation, including event photo collages.',
      project: '/work/bnsp',
      // kegiatan-01 is an information poster, so it stays on the project page.
      items: [
        { src: '/assets/work/bnsp/kegiatan-04.jpg', alt: id ? 'Kolase foto peserta dan kegiatan sertifikasi' : 'Photo collage of participants and certification activities', caption: id ? 'Kolase dokumentasi kegiatan' : 'Event documentation collage' },
        { src: '/assets/work/bnsp/kegiatan-02.jpg', alt: id ? 'Dokumentasi di lokasi pelatihan vokasi' : 'Documentation at the vocational training venue', caption: id ? 'Dokumentasi pelatihan' : 'Training documentation' },
        { src: '/assets/work/bnsp/kegiatan-03.jpg', alt: id ? 'Potret di lokasi kegiatan pelatihan' : 'Portrait at the training venue', caption: id ? 'Potret di lokasi kegiatan' : 'Portrait at the venue' },
        { src: '/assets/work/bnsp/kegiatan-05.jpg', alt: id ? 'Potret di area luar gedung' : 'Portrait outside the building', caption: id ? 'Dokumentasi lapangan' : 'Field documentation' },
      ],
    },
    {
      id: 'arsip-foto', title: id ? 'Arsip foto & dokumentasi' : 'Photo archive & documentation',
      description: id ? 'Pertunjukan, olahraga, potret, dan momen di luar proyek klien.' : 'Performances, sports, portraits, and moments outside client projects.',
      items: photoFiles('gallery').map((src, i) => ({ src,
        alt: id ? `Arsip fotografi dan dokumentasi — foto ${i + 1}` : `Photography and documentation archive — photograph ${i + 1}`,
        caption: `${id ? 'Catatan visual' : 'Visual notes'} / ${String(i + 1).padStart(2, '0')}`,
      })),
    },
    {
      id: 'potret-profil', title: id ? 'Potret profil' : 'Profile portrait',
      description: id ? 'Potret Dandie Lucky Maulana.' : 'A portrait of Dandie Lucky Maulana.',
      items: [{ src: '/assets/about/portrait.jpg', alt: 'Dandie Lucky Maulana', caption: id ? 'Potret profil' : 'Profile portrait' }],
    },
  ].filter((album) => album.items.length > 0);
}
