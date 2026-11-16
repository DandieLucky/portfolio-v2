/**
 * Prefix URL hasil build untuk GitHub project Pages tanpa mengubah aset/konten.
 * Local: npm run build. Pages: SITE_BASE=/portfolio-v2 npm run build.
 * Aman dijalankan ulang: prefix yang sudah ada tidak ditambahkan dua kali.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

export function normalizeBase(value = '') {
  if (!value || value === '/') return '';
  const base = '/' + value.replace(/^\/+|\/+$/g, '');
  if (!/^\/[a-zA-Z0-9/_-]+$/.test(base) || base.includes('//')) {
    throw new Error('SITE_BASE harus berupa path, misalnya /portfolio-v2.');
  }
  return base;
}

export function prefixPath(url, base) {
  if (!base || !url.startsWith('/') || url.startsWith('//')) return url;
  if (url === base || url.startsWith(base + '/') || url.startsWith(base + '?') || url.startsWith(base + '#')) return url;
  return base + url;
}

export function rewriteOutput(source, extension, base, site = 'https://dandielucky.github.io') {
  if (!base) return source;
  const origin = site.replace(/\/$/, '');
  // Canonical, OG, hreflang, JSON-LD, sitemap dan robots memakai domain sama.
  const escapedOrigin = origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let out = source.replace(new RegExp(escapedOrigin + '(?=[/\\s"\'<>]|$)([^\\s"\'<>]*)', 'g'), (full, rest) => {
    return origin + prefixPath(rest || '/', base);
  });

  if (extension === '.html') {
    out = out.replace(/(\b(?:href|src|poster|action|data-preview|data-src|data-image|content)\s*=\s*["'])(\/(?!\/)[^"']*)(["'])/gi,
      (_, before, url, after) => before + prefixPath(url, base) + after);
    out = out.replace(/(\bsrcset\s*=\s*["'])([^"']*)(["'])/gi, (_, before, value, after) => {
      const fixed = value.replace(/(^|,\s*)(\/(?!\/)[^,\s]+)/g, (match, space, url) => space + prefixPath(url, base));
      return before + fixed + after;
    });
  }
  if (extension === '.html' || extension === '.css') {
    out = out.replace(/(url\(\s*["']?)(\/(?!\/)[^\s)'"\\]*)(["']?\s*\))/g,
      (_, before, url, after) => before + prefixPath(url, base) + after);
  }
  if (extension === '.js' || extension === '.html') {
    // Only asset URL literals: do not alter route logic, regex, protocol URLs,
    // or ClientRouter's own root-path comparisons in compiled JavaScript.
    out = out.replace(/(["'`])(\/(?:assets|_astro)\/[^"'`\\\s]*)(["'`])/g,
      (_, before, url, after) => before + prefixPath(url, base) + after);
  }
  return out;
}

export function applySiteBase(directory = 'dist', base = normalizeBase(process.env.SITE_BASE)) {
  let count = 0;
  const extensions = new Set(['.html', '.css', '.js', '.xml', '.txt', '.webmanifest']);
  function walk(dir) {
    for (const name of readdirSync(dir)) {
      const file = join(dir, name);
      if (statSync(file).isDirectory()) walk(file);
      else if (extensions.has(extname(name))) {
        const source = readFileSync(file, 'utf8');
        const output = rewriteOutput(source, extname(name), base);
        if (source !== output) {
          writeFileSync(file, output);
          count += 1;
        }
      }
    }
  }
  if (base) walk(directory);
  console.log(`URL build: ${base || '/'} — ${count} berkas diperbarui.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) applySiteBase();
