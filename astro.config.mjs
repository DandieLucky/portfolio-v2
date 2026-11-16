import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Dev memakai URL root. scripts/apply-site-base.mjs menambahkan SITE_BASE
// sesudah build, termasuk untuk URL aset di MDX yang dipertahankan utuh.
export default defineConfig({
  site: 'https://dandielucky.github.io',
  devToolbar: { enabled: false },
  integrations: [mdx()],
  build: { inlineStylesheets: 'auto' },
  vite: {
    build: { assetsInlineLimit: 2048 },
    // Saat pratinjau dibuka lewat tunnel (trycloudflare/localtunnel), Host-nya bukan
    // localhost — tanpa daftar ini Vite menjawab 403 "Blocked request".
    server: { allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app'] },
    preview: { allowedHosts: ['.trycloudflare.com', '.loca.lt', '.ngrok-free.app'] },
  },
});
