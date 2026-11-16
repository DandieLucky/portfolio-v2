export type TimelineEntry = {
  year: string;
  role: { id: string; en: string };
  org: { id: string; en: string };
};

/** Isi `year` hanya yang benar-benar diketahui — jangan mengarang tanggal. */
export const timeline: TimelineEntry[] = [
  {
    year: 'Mei 2025 — sekarang',
    role: { id: 'Social Media Specialist & Desainer Konten', en: 'Social Media Specialist & Content Designer' },
    org: { id: 'Matahari Grosir', en: 'Matahari Grosir' },
  },
  {
    year: 'Jul 2025 — sekarang',
    role: { id: 'Desainer UI/UX, Aplikasi Internal', en: 'UI/UX Designer, Internal Application' },
    org: { id: 'Proyek aplikasi internal instansi pemerintah', en: 'Government internal application project' },
  },
  {
    year: '',
    role: { id: 'Editor Video', en: 'Video Editor' },
    org: { id: 'Pusinfomar TNI', en: 'Pusinfomar TNI' },
  },
  {
    year: 'Des 2025',
    role: { id: 'Motion Graphics Artist (Freelance)', en: 'Motion Graphics Artist (Freelance)' },
    org: { id: 'HUT ke-50 Darya Varia', en: 'Darya Varia 50th Anniversary' },
  },
  {
    year: '2026',
    role: { id: 'Desainer Konten Media Sosial', en: 'Social Media Content Designer' },
    org: { id: 'PKKMB Polimedia 2026', en: 'PKKMB Polimedia 2026' },
  },
  {
    year: '2025',
    role: { id: 'Desainer Konten Media Sosial', en: 'Social Media Content Designer' },
    org: { id: 'Olimpiade Polimedia 2025', en: 'Polimedia Olympiad 2025' },
  },
  {
    year: '2024',
    role: { id: 'Desainer Grafis (identitas acara)', en: 'Graphic Designer (event identity)' },
    org: { id: 'Wilhelmina Cup', en: 'Wilhelmina Cup' },
  },
  {
    year: 'Okt 2026',
    role: { id: 'Fotografer Acara (Freelance)', en: 'Event Photographer (Freelance)' },
    org: { id: 'Posh by Her', en: 'Posh by Her' },
  },
  {
    year: '',
    role: { id: 'Editor Video & Konten', en: 'Video Editor & Content' },
    org: { id: 'Si Paling Film', en: 'Si Paling Film' },
  },
  {
    year: 'Agu 2025',
    role: { id: 'Dokumentasi & Teknis Lapangan', en: 'Documentation & On-site Technical Support' },
    org: { id: 'Kegiatan asesmen BNSP (melalui vendor)', en: 'BNSP assessment activities (through a vendor)' },
  },
  {
    year: '2025–2026',
    role: { id: 'Staf Hubungan Masyarakat', en: 'Public Relations Staff' },
    org: { id: 'BEM Polimedia', en: 'BEM Polimedia (Student Executive Board)' },
  },
];

export const skills = [
  {
    title: { id: 'Desain Grafis & Visual', en: 'Graphic & Visual Design' },
    items: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Canva'],
  },
  {
    title: { id: 'UI/UX', en: 'UI/UX' },
    items: ['Wireframe', 'User flow', 'Prototipe interaktif / interactive prototype', 'Design system (Figma)'],
  },
  {
    title: { id: 'Video & Motion', en: 'Video & Motion' },
    items: ['Adobe After Effects', 'Adobe Premiere Pro', 'DaVinci Resolve', 'CapCut'],
  },
  {
    title: { id: 'Fotografi & Editing', en: 'Photography & Editing' },
    items: ['Adobe Lightroom', 'Event photography', 'Retouching'],
  },
  {
    title: { id: 'AI & Otomasi Kerja', en: 'AI & Work Automation' },
    items: ['AI agent workflow (Hermes Agent)', 'Prompt-based drafting', 'Aset & QC otomatis'],
  },
  {
    title: { id: 'Pemrograman (dasar)', en: 'Programming (basic)' },
    items: ['Flutter', 'PHP', 'SQL', 'Unity'],
  },
];
