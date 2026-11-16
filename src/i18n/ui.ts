export const languages = ['id', 'en'] as const;
export type Lang = (typeof languages)[number];

export const langLabel: Record<Lang, string> = { id: 'ID', en: 'EN' };

/** prefix for a language: id stays at root, en lives under /en */
export function base(lang: Lang): string {
  return lang === 'id' ? '' : '/en';
}

/** build an internal href for a language */
export function href(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base(lang)}${clean === '/' ? '/' : clean}`.replace(/\/$/, '') || '/';
}

/** switch the current pathname to the other language */
export function otherLangPath(pathname: string, to: Lang): string {
  const stripped = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return to === 'id' ? stripped : `/en${stripped === '/' ? '' : stripped}` || '/en';
}

type Copy = {
  meta: { locale: string; dir: 'ltr' };
  nav: { work: string; gallery: string; about: string; lab: string; contact: string; menu: string };
  ui: {
    skip: string;
    langSwitch: string;
    back: string;
    top: string;
    copyEmail: string;
    copied: string;
    theme: string;
    themeDark: string;
    themeLight: string;
    cv: string;
    seeAll: string;
    seeCase: string;
    scroll: string;
    available: string;
    builtWith: string;
  };
  home: {
    title: string;
    description: string;
    heroLines: string[];
    heroLede: string;
    meta: { label: string; value: string }[];
    workEyebrow: string;
    workTitle: string;
    workLede: string;
    approachEyebrow: string;
    approachTitle: string;
    approachSteps: { n: string; title: string; body: string }[];
    aboutEyebrow: string;
    aboutTitle: string;
    aboutBody: string[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaBody: string;
  };
  work: { title: string; description: string; eyebrow: string; lede: string; all: string; empty: string };
  casePage: { role: string; year: string; client: string; scope: string; contents: string; next: string };
  about: {
    title: string;
    description: string;
    eyebrow: string;
    headline: string;
    paragraphs: string[];
    timelineTitle: string;
    skillsTitle: string;
    portraitSlot: string;
  };
  lab: { title: string; description: string; eyebrow: string; lede: string; status: string; stack: string };
  photos: {
    title: string;
    description: string;
    eyebrow: string;
    headline: string;
    lede: string;
    note: string;
  };
  contact: {
    title: string;
    description: string;
    eyebrow: string;
    headline: string;
    body: string;
    email: string;
    whatsapp: string;
    linkedin: string;
    instagram: string;
  };
  notFound: { title: string; headline: string; body: string; back: string };
};

export const ui: Record<Lang, Copy> = {
  id: {
    meta: { locale: 'id_ID', dir: 'ltr' },
    nav: { work: 'Karya', gallery: 'Fotografi', about: 'Tentang', lab: 'Lab', contact: 'Kontak', menu: 'Menu' },
    ui: {
      skip: 'Lompat ke konten',
      langSwitch: 'Ganti bahasa',
      back: 'Kembali ke karya',
      top: 'Ke atas',
      copyEmail: 'Salin email',
      copied: 'Email tersalin',
      theme: 'Ganti tema',
      themeDark: 'Tema gelap',
      themeLight: 'Tema terang',
      cv: 'Unduh CV (PDF)',
      seeAll: 'Lihat semua karya',
      seeCase: 'Lihat proyek',
      scroll: 'Gulir',
      available: 'Terbuka untuk magang · Januari 2027',
      builtWith: 'Dibangun sendiri dengan Astro, tanpa template',
    },
    home: {
      title: 'Dandie Lucky Maulana — Desainer Grafis & Konten Media Sosial',
      description:
        'Portofolio Dandie Lucky Maulana: desain grafis, konten media sosial, video editing, motion graphics, dan fotografi. Mahasiswa D4 Teknologi Rekayasa Multimedia, Polimedia Jakarta.',
      heroLines: ['Visual yang', 'membuat orang', 'berhenti *scrolling*.'],
      heroLede:
        'Saya Dandie, desainer grafis dan spesialis konten media sosial di Jakarta. Merangkai desain, video, dan fotografi agar brand punya karakter yang konsisten.',
      meta: [
        { label: 'Basis', value: 'Jakarta Selatan, ID' },
        { label: 'Fokus', value: 'Desain Grafis · Konten Sosial' },
        { label: 'Studi', value: 'D4 TRM, Polimedia Jakarta' },
        { label: 'Magang', value: 'Januari 2027' },
      ],
      workEyebrow: 'Karya terpilih',
      workTitle: 'Dari ide, menjadi karya.',
      workLede:
        'Pilihan proyek desain, konten, motion, dan fotografi. Buka tiap karya untuk melihat brief, peran saya, dan proses di baliknya.',
      approachEyebrow: 'Cara kerja',
      approachTitle: 'Tiga hal yang selalu saya jaga.',
      approachSteps: [
        {
          n: '01',
          title: 'Konsisten, bukan asal ramai',
          body: 'Satu sistem visual — warna, huruf, jarak — dipakai ulang di setiap unggahan, supaya brand dikenali bahkan tanpa melihat logo.',
        },
        {
          n: '02',
          title: 'Desain yang punya alasan',
          body: 'Setiap keputusan visual bisa saya jelaskan: kenapa huruf ini, kenapa warna itu, informasi apa yang harus terbaca lebih dulu.',
        },
        {
          n: '03',
          title: 'Selesai, bukan hanya dimulai',
          body: 'Bekerja dengan tenggat acara dan kebutuhan harian bisnis. Rapi di file, tepat di jadwal.',
        },
      ],
      aboutEyebrow: 'Tentang',
      aboutTitle: 'Desainer yang juga bisa membangun alatnya sendiri.',
      aboutBody: [
        'Saya mahasiswa semester 5 D4 Teknologi Rekayasa Multimedia di Politeknik Negeri Media Kreatif Jakarta. Sejak Mei 2025 saya memegang seluruh konten media sosial sebuah bisnis grosir snack — dari brief, desain, caption, sampai jadwal tayang.',
        'Di sisi lain saya mengerjakan motion graphics, fotografi acara, dan merancang antarmuka aplikasi internal untuk instansi. Kombinasi ini membuat saya terbiasa bekerja dengan orang non-desainer: mendengar kebutuhan, menerjemahkannya jadi brief, lalu mengeksekusi.',
      ],
      ctaEyebrow: 'Kontak',
      ctaTitle: 'Punya brief? Mari *bikin sesuatu*.',
      ctaBody:
        'Saya menerima magang mulai Januari 2027 serta proyek desain, konten, dan foto. Balasan tercepat lewat email atau WhatsApp.',
    },
    work: {
      title: 'Karya — Dandie Lucky Maulana',
      description: 'Kumpulan proyek desain grafis, konten media sosial, video editing, motion graphics, dan fotografi.',
      eyebrow: 'Indeks karya',
      lede: 'Semua proyek, urut dari yang paling relevan. Gunakan filter untuk melihat per bidang.',
      all: 'Semua',
      empty: 'Belum ada proyek di kategori ini.',
    },
    casePage: {
      role: 'Peran',
      year: 'Tahun',
      client: 'Klien',
      scope: 'Cakupan',
      contents: 'Isi halaman',
      next: 'Proyek berikutnya',
    },
    about: {
      title: 'Tentang — Dandie Lucky Maulana',
      description: 'Latar belakang, cara kerja, dan pengalaman Dandie Lucky Maulana, desainer grafis dan spesialis konten media sosial.',
      eyebrow: 'Tentang',
      headline: 'Desainer grafis dan spesialis konten media sosial di Jakarta.',
      paragraphs: [
        'Saya Dandie Lucky Maulana, mahasiswa semester 5 D4 Teknologi Rekayasa Multimedia, Politeknik Negeri Media Kreatif (Polimedia) Jakarta, dengan IPK 3.86/4.00.',
        'Ketertarikan saya bukan hanya membuat gambar yang bagus, tapi membuat visual yang bekerja: konten yang menjaga konsistensi brand, poster yang informasinya terbaca, antarmuka yang tidak membuat orang berpikir dua kali.',
        'Saya terbiasa memegang satu proyek dari awal sampai tayang — mulai dari menerima brief, menentukan arah visual, memproduksi aset, sampai mengevaluasi hasil. Untuk mempercepat kerja, saya memakai AI agent sebagai alat bantu riset dan drafting, bukan sebagai pengganti keputusan desain.',
      ],
      timelineTitle: 'Perjalanan',
      skillsTitle: 'Keahlian & alat',
      portraitSlot: 'Slot foto — ganti public/assets/about/portrait.jpg',
    },
    photos: {
      title: 'Fotografi & Dokumentasi — Dandie Lucky Maulana',
      description: 'Fotografi acara dan dokumentasi: Posh by Her, kegiatan BNSP, potret, dan arsip foto.',
      eyebrow: 'Fotografi',
      headline: 'Arsip foto',
      lede: 'Hasil pemotretan dan dokumentasi dalam satu tempat: acara Posh by Her, kegiatan BNSP, potret, serta arsip foto. Jelajahi tiap album untuk melihat seluruh foto yang tersedia.',
      note: 'Klik foto untuk melihat ukuran penuh.',
    },
    lab: {
      title: 'Lab — eksperimen & alat kecil',
      description: 'Eksperimen di luar brief: alat kecil yang saya bangun sendiri, termasuk workflow AI agent untuk produksi desain.',
      eyebrow: 'Lab',
      lede: 'Tempat saya menguji hal-hal yang tidak diminta klien tapi membuat kerja jadi lebih cepat.',
      status: 'Status',
      stack: 'Alat',
    },
    contact: {
      title: 'Kontak — Dandie Lucky Maulana',
      description: 'Hubungi Dandie Lucky Maulana untuk magang, proyek desain, konten media sosial, atau fotografi.',
      eyebrow: 'Kontak',
      headline: 'Mari bikin sesuatu.',
      body: 'Terbuka untuk magang mulai Januari 2027, serta proyek desain grafis, konten media sosial, motion graphics, dan fotografi. Balasan tercepat lewat email atau WhatsApp.',
      email: 'Email',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
    },
    notFound: {
      title: 'Halaman tidak ditemukan',
      headline: 'Halaman ini belum dibuat.',
      body: 'Mungkin tautannya salah, atau proyeknya sudah dipindahkan. Coba lihat daftar karya.',
      back: 'Ke beranda',
    },
  },

  en: {
    meta: { locale: 'en_US', dir: 'ltr' },
    nav: { work: 'Work', gallery: 'Photography', about: 'About', lab: 'Lab', contact: 'Contact', menu: 'Menu' },
    ui: {
      skip: 'Skip to content',
      langSwitch: 'Switch language',
      back: 'Back to work',
      top: 'Back to top',
      copyEmail: 'Copy email',
      copied: 'Email copied',
      theme: 'Toggle theme',
      themeDark: 'Dark theme',
      themeLight: 'Light theme',
      cv: 'Download CV (PDF)',
      seeAll: 'See all work',
      seeCase: 'View project',
      scroll: 'Scroll',
      available: 'Open to internships · January 2027',
      builtWith: 'Hand-built with Astro, no template',
    },
    home: {
      title: 'Dandie Lucky Maulana — Graphic Designer & Social Media Content',
      description:
        'Portfolio of Dandie Lucky Maulana: graphic design, social media content, video editing, motion graphics, and photography. Multimedia Engineering student at Polimedia Jakarta.',
      heroLines: ['Visuals that', 'make people', 'stop *scrolling*.'],
      heroLede:
        'I am Dandie, a graphic designer and social media specialist in Jakarta. I bring design, video, and photography together to give brands a consistent character.',
      meta: [
        { label: 'Base', value: 'South Jakarta, ID' },
        { label: 'Focus', value: 'Graphic Design · Social Content' },
        { label: 'Study', value: 'Applied Multimedia, Polimedia' },
        { label: 'Internship', value: 'January 2027' },
      ],
      workEyebrow: 'Selected work',
      workTitle: 'From an idea to something real.',
      workLede: 'Selected projects in design, content, motion, and photography. Open a project to explore the brief, my role, and the process behind it.',
      approachEyebrow: 'How I work',
      approachTitle: 'Three things I always protect.',
      approachSteps: [
        {
          n: '01',
          title: 'Consistent, not just loud',
          body: 'One visual system — colour, type, spacing — reused across every post, so the brand is recognisable even without the logo.',
        },
        {
          n: '02',
          title: 'Design with a reason',
          body: 'Every visual decision can be explained: why this typeface, why that colour, what the viewer must read first.',
        },
        {
          n: '03',
          title: 'Finished, not just started',
          body: 'I work against event deadlines and daily business needs. Clean files, on schedule.',
        },
      ],
      aboutEyebrow: 'About',
      aboutTitle: 'A designer who can also build the tools.',
      aboutBody: [
        'I am a fifth-semester Applied Multimedia Engineering student at Politeknik Negeri Media Kreatif Jakarta. Since May 2025 I have owned the entire social media content of a snack wholesale business — from brief, design and captions to the publishing schedule.',
        'On the other side I have produced motion graphics, event photography, and designed the interface of an internal application for a government institution. That mix means I am used to working with non-designers: listening to a need, turning it into a brief, then executing.',
      ],
      ctaEyebrow: 'Contact',
      ctaTitle: 'Got a brief? Let us *make something*.',
      ctaBody:
        'I am available for an internship from January 2027, and for design, content and photography projects. Fastest replies by email or WhatsApp.',
    },
    work: {
      title: 'Work — Dandie Lucky Maulana',
      description: 'Selected projects in graphic design, social media content, video editing, motion graphics, and photography.',
      eyebrow: 'Work index',
      lede: 'Every project, ordered by relevance. Use the filters to view by discipline.',
      all: 'All',
      empty: 'No projects in this category yet.',
    },
    casePage: {
      role: 'Role',
      year: 'Year',
      client: 'Client',
      scope: 'Scope',
      contents: 'On this page',
      next: 'Next project',
    },
    about: {
      title: 'About — Dandie Lucky Maulana',
      description: 'Background, working style and experience of Dandie Lucky Maulana, graphic designer and social media content specialist.',
      eyebrow: 'About',
      headline: 'Graphic designer and social media content specialist in Jakarta.',
      paragraphs: [
        'I am Dandie Lucky Maulana, a fifth-semester Applied Multimedia Engineering student at Politeknik Negeri Media Kreatif (Polimedia) Jakarta, GPA 3.86/4.00.',
        'My interest is not only in making good-looking images, but in making visuals that work: content that keeps a brand consistent, posters whose information reads clearly, interfaces that do not make people think twice.',
        'I am used to owning a project from beginning to publish — taking the brief, setting the visual direction, producing the assets, then reviewing the result. To work faster I use an AI agent as a research and drafting assistant, never as a replacement for design decisions.',
      ],
      timelineTitle: 'Path',
      skillsTitle: 'Skills & tools',
      portraitSlot: 'Image slot — replace public/assets/about/portrait.jpg',
    },
    photos: {
      title: 'Photography & Documentation — Dandie Lucky Maulana',
      description: 'Event photography and documentation: Posh by Her, BNSP activities, portraits, and the photo archive.',
      eyebrow: 'Photography',
      headline: 'Photo archive',
      lede: 'Photography and documentation in one place: Posh by Her events, BNSP activities, portraits, and the photo archive. Explore each album to see all available photographs.',
      note: 'Click a photo to open it full size.',
    },
    lab: {
      title: 'Lab — experiments & small tools',
      description: 'Experiments beyond the brief: small tools I built myself, including AI-agent workflows for design production.',
      eyebrow: 'Lab',
      lede: 'Where I test things no client asked for but that make the work faster.',
      status: 'Status',
      stack: 'Built with',
    },
    contact: {
      title: 'Contact — Dandie Lucky Maulana',
      description: 'Get in touch with Dandie Lucky Maulana for internships, design, social media content or photography.',
      eyebrow: 'Contact',
      headline: 'Let us make something.',
      body: 'Available for an internship from January 2027, and for graphic design, social media content, motion graphics and photography projects. Fastest replies by email or WhatsApp.',
      email: 'Email',
      whatsapp: 'WhatsApp',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
    },
    notFound: {
      title: 'Page not found',
      headline: 'This page does not exist yet.',
      body: 'The link may be wrong, or the project moved. Try the work index.',
      back: 'Back home',
    },
  },
};

export const site = {
  name: 'Dandie Lucky Maulana',
  shortName: 'Dandie',
  email: 'dndymlna@gmail.com',
  phone: '0858-1007-7490',
  whatsapp: 'https://wa.me/6285810077490',
  linkedin: 'https://www.linkedin.com/in/dandie-lucky-maulana-b736b3246/',
  instagram: '', // isi setelah akun IG portfolio dibuat
  cv: '/assets/cv/Dandie-Lucky-Maulana_CV.pdf',
};
