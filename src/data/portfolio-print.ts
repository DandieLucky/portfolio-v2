import { getProjectGallery } from './project-galleries';
import { getPhotographyAlbums, getPoshPhotos } from './photography';

/** Short display titles and selected portfolio plates. Full project copy comes from the website collection. */
export const printProjects: Record<string, { title: [string, string]; images?: string[]; layout?: string }> = {
  nexa: {
    title: ['Nexa', 'Solution Group.'],
    images: [2, 1, 3].map((i) => getProjectGallery('nexa', 'id')[i].src),
    layout: 'wide-first',
  },
  snackpedia: {
    title: ['Snack', 'pedia.'],
    images: [10, 4, 8, 9].map((i) => getProjectGallery('snackpedia', 'id')[i].src),
    layout: 'side-first',
  },
  'wilhelmina-cup-2024': {
    title: ['Wilhelmina', 'Cup.'],
    images: ['logo.jpg', 'maskot-01.jpg', 'tote-02.jpg', 'poster-01.jpg'].map((name) => `/assets/work/wilhelmina-cup-2024/${name}`),
    layout: 'wide-last',
  },
  'matahari-grosir': {
    title: ['Matahari', 'Grosir.'],
    images: [0, 2, 4, 10, 13, 14].map((i) => getProjectGallery('matahari-grosir', 'id')[i].src),
  },
  'pkkmb-polimedia-2026': {
    title: ['PKKMB', 'Polimedia.'],
    images: [1, 2, 4].map((i) => `/assets/work/pkkmb-polimedia-2026/poster-0${i}.jpg`),
  },
  'olimpiade-polimedia-2025': {
    title: ['Olimpiade', 'Polimedia.'],
    images: [4, 7, 9].map((i) => `/assets/work/olimpiade-polimedia-2025/poster-0${i}.jpg`),
  },
  'darya-varia': {
    title: ['Darya', 'Varia.'],
    images: ['/assets/work/darya-varia/hut50-poster.jpg'],
  },
  pusinfomar: {
    title: ['Pusinfomar', 'TNI.'],
    images: ['/assets/work/pusinfomar/cover.jpg', '/assets/work/pusinfomar/rekam-02-poster.jpg'],
  },
  'si-paling-film': {
    title: ['Si Paling', 'Film.'],
    layout: 'video-plates',
    images: ['/assets/work/si-paling-film/cover.jpg', ...[2, 3, 4].map((i) => `/assets/work/si-paling-film/film-0${i}-poster.jpg`)],
  },
  'posh-by-her': {
    title: ['Posh', 'by Her.'],
    images: ['foto-01.jpg', 'B0003104.JPG', 'foto-06.jpg'].flatMap((name) =>
      getPoshPhotos('id').filter(({ src }) => src.endsWith('/' + name)).map(({ src }) => src)),
  },
  bnsp: {
    title: ['Asesmen', 'BNSP.'],
    images: getPhotographyAlbums('id').find(({ id }) => id === 'dokumentasi-bnsp')?.items.map(({ src }) => src),
    layout: 'documentary',
  },
};
