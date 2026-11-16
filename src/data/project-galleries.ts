import type { Lang } from '../i18n/ui';

// Keep uploaded paths intact, including spaces and alternate design versions.
const galleries = {
  nexa: {
    directory: 'nexa logo branding',
    items: [
      ['Logo_Nexa.png', 'Presentasi identitas visual Nexa', 'Nexa visual identity presentation'],
      ['logo 1.png', 'Ikon Nexa', 'Nexa icon'],
      ['logo 2.png', 'Logo Nexa dengan nama perusahaan', 'Nexa logo with company name'],
      ['logo 3.png', 'Variasi logo untuk latar gelap', 'Logo variation for dark backgrounds'],
      ['logo 4.png', 'Variasi logo Nexa pada latar terang', 'Nexa logo variation on a light background'],
    ],
  },
  snackpedia: {
    directory: 'Branding Snackpedia',
    items: [
      ['1.png', 'Teaser peluncuran, panel 1', 'Launch teaser, panel 1'],
      ['2.png', 'Teaser peluncuran, panel 2', 'Launch teaser, panel 2'],
      ['3.png', 'Teaser peluncuran, panel 3', 'Launch teaser, panel 3'],
      ['4.png', 'Desain promosi kemasan produk', 'Product packaging promotion'],
      ['5.png', 'Desain rangkaian produk Snackpedia', 'Snackpedia product range design'],
      ['6.png', 'Desain promosi produk', 'Product promotion design'],
      ['7.png', 'Panduan pemesanan melalui Shopee', 'Shopee ordering guide'],
      ['8.png', 'Informasi kanal pemesanan, versi awal', 'Ordering channels, initial version'],
      ['8 benerrr.png', 'Informasi kanal pemesanan, versi revisi', 'Ordering channels, revised version'],
      ['9.png', 'Panduan pemesanan melalui TikTok Shop', 'TikTok Shop ordering guide'],
      ['Final Artboard 1.1.png', 'Susunan keseluruhan feed Snackpedia', 'Snackpedia feed overview'],
    ],
  },
  'matahari-grosir': {
    directory: 'matahari-grosir',
    items: [
      ['Artboard 1.png', 'Keripik ubi mix sambal balado', 'Mixed sweet potato chips, sambal balado'],
      ['Artboard 1 copy.png', 'Keripik singkong keripik setan', 'Cassava chips, keripik setan'],
      ['Artboard 1 copy 2.png', 'Keripik singkong rumput laut', 'Seaweed cassava chips'],
      ['Artboard 1 copy 3.png', 'Keripik singkong jagung manis', 'Sweet corn cassava chips'],
      ['Artboard 1 copy 4.png', 'Keripik talas barbeque', 'Barbeque taro chips'],
      ['Artboard 1 copy 5.png', 'Keripik singkong sambal rujak', 'Sambal rujak cassava chips'],
      ['Artboard 1 copy 6.png', 'Keripik singkong seblak tumis', 'Seblak tumis cassava chips'],
      ['Artboard 1 copy 7.png', 'Keripik talas sambal balado', 'Sambal balado taro chips'],
      ['Artboard 1 copy 8.png', 'Keripik talas keripik setan', 'Taro chips, keripik setan'],
      ['Artboard 1 copy 9.png', 'Variasi desain keripik singkong seblak tumis', 'Seblak tumis cassava chips, design variation'],
      ['Artboard 2.png', 'Keripik singkong rasa keju', 'Cheese cassava chips'],
      ['Artboard 2 copy.png', 'Keripik singkong jagung pedas', 'Spicy corn cassava chips'],
      ['KERIPIK SINGKONG (1 KG).png', 'Katalog keripik singkong, kemasan 1 kg', 'Cassava chips catalog, 1 kg packs'],
      ['KERIPIK UBI MIX (1 KG).png', 'Katalog keripik ubi mix, kemasan 1 kg', 'Mixed sweet potato chips catalog, 1 kg packs'],
      ['KERIPIK UBI MIX (250 GRAM).png', 'Katalog keripik ubi mix, kemasan 250 gram', 'Mixed sweet potato chips catalog, 250 g packs'],
    ],
  },
} as const;

export function getProjectGallery(slug: keyof typeof galleries, lang: Lang) {
  const gallery = galleries[slug];
  return gallery.items.map(([filename, id, en]) => ({
    src: `/assets/work/${gallery.directory}/${filename}`,
    alt: lang === 'id' ? id : en,
    caption: lang === 'id' ? id : en,
    background: slug === 'nexa' && filename === 'logo 3.png' ? '#0a2a6b' : undefined,
  }));
}
