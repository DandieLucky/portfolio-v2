/* =========================================================
   Interactions: header, reveal, hover preview, filters,
   lightbox, before/after slider, copy-to-clipboard, TOC
   Vanilla JS. Re-initialised on every Astro page navigation.
   ========================================================= */

const cleanups = [];

const reduceMotion = () =>
  document.documentElement.dataset.motion === 'off' ||
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Keep initialisation safe when Astro reuses a document during navigation.
function listen(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  cleanups.push(() => target.removeEventListener(event, handler, options));
}

/* ---------- persistent, accessible motion preference ---------- */
function initMotion() {
  const button = document.querySelector('[data-motion-toggle]');
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const en = document.documentElement.lang === 'en';
  let paused = false;
  try { paused = localStorage.getItem('dandie-motion') === 'off'; } catch { /* private browsing */ }

  const sync = () => {
    const off = paused || media.matches;
    document.documentElement.dataset.motion = off ? 'off' : 'on';
    if (!button) return;
    const label = media.matches
      ? (en ? 'Motion reduced by device settings' : 'Animasi dikurangi oleh pengaturan perangkat')
      : off
        ? (en ? 'Resume decorative motion' : 'Lanjutkan animasi dekoratif')
        : (en ? 'Pause decorative motion' : 'Jeda animasi dekoratif');
    button.setAttribute('aria-pressed', String(off));
    button.setAttribute('aria-label', label);
    button.title = label;
    button.disabled = media.matches;
    const symbol = button.querySelector('[data-motion-symbol]');
    if (symbol) symbol.textContent = off ? '▷' : 'Ⅱ';
  };
  const toggle = () => {
    paused = !paused;
    try { localStorage.setItem('dandie-motion', paused ? 'off' : 'on'); } catch { /* optional persistence */ }
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.style.removeProperty('--tilt-x');
      el.style.removeProperty('--tilt-y');
    });
    sync();
  };
  sync();
  button?.addEventListener('click', toggle);
  media.addEventListener('change', sync);
  cleanups.push(() => {
    button?.removeEventListener('click', toggle);
    media.removeEventListener('change', sync);
  });
}

/* ---------- restrained 3D tilt, only while the pointer moves ---------- */
function initTilt() {
  if (!finePointer()) return;
  document.querySelectorAll('[data-tilt]').forEach((surface) => {
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      surface.style.removeProperty('--tilt-x');
      surface.style.removeProperty('--tilt-y');
    };
    const move = (event) => {
      if (reduceMotion()) { reset(); return; }
      cancelAnimationFrame(frame);
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        const rect = surface.getBoundingClientRect();
        const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) - .5;
        const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)) - .5;
        surface.style.setProperty('--tilt-x', `${(-y * 6).toFixed(2)}deg`);
        surface.style.setProperty('--tilt-y', `${(x * 6).toFixed(2)}deg`);
        frame = 0;
      });
    };
    surface.addEventListener('pointermove', move, { passive: true });
    surface.addEventListener('pointerleave', reset);
    cleanups.push(() => {
      reset();
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', reset);
    });
  });
}

/* ---------- header + scroll progress ---------- */
function initHeader() {
  const header = document.querySelector('[data-header]');
  const bar = document.querySelector('.progress');
  if (!header) return;

  let last = window.scrollY;
  let ticking = false;
  let frame = 0;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);

    if (y > 260 && y > last && !header.contains(document.activeElement) &&
        !header.querySelector('[aria-expanded="true"]')) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');

    if (bar) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(y / max, 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    }

    last = y;
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      frame = requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
  cleanups.push(() => {
    window.removeEventListener('scroll', onScroll);
    cancelAnimationFrame(frame);
  });
}

/* ---------- mobile menu ---------- */
function initMenu() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (!toggle || !nav) return;

  listen(toggle, 'click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    if(open) nav.querySelector('a')?.focus();
  });

  const onKey = (e) => {
    if(e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));

  nav.querySelectorAll('a').forEach((a) =>
    listen(a, 'click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---------- reveal on scroll ---------- */
function initReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!items.length) return;
  document.documentElement.classList.add('reveal-enabled');

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  items.forEach((el) => io.observe(el));
  cleanups.push(() => io.disconnect());

  // apa pun yang sudah masuk viewport tampil langsung (deep link / restore scroll)
  requestAnimationFrame(() => {
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('is-in');
    });
  });

  // jaring pengaman: kalau observer gagal (browser aneh / scroll jump), jangan
  // sampai konten tetap tak terlihat
  const safety = window.setTimeout(() => {
    items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
    });
  }, 2500);
  cleanups.push(() => window.clearTimeout(safety));
}

/* ---------- hover preview following the cursor ---------- */
function initHoverPreview() {
  const preview = document.querySelector('[data-hover-preview]');
  const img = document.querySelector('[data-preview-img]');
  const label = document.querySelector('[data-preview-label]');
  const rows = Array.from(document.querySelectorAll('[data-preview]'));
  if (!preview || !img || !rows.length || !finePointer() || reduceMotion()) return;

  let tx = 0;
  let ty = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  let active = false;

  const loop = () => {
    cx += (tx - cx) * 0.14;
    cy += (ty - cy) * 0.14;
    preview.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${active ? 1 : 0.94})`;
    raf = requestAnimationFrame(loop);
  };

  const onMove = (e) => {
    tx = e.clientX;
    ty = e.clientY;
  };

  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => {
      const src = row.getAttribute('data-preview');
      if (!src) return;
      img.src = src;
      if (label) label.textContent = row.getAttribute('data-preview-label') || '';
      active = true;
      preview.classList.add('is-active');
      if (!raf) raf = requestAnimationFrame(loop);
    });

    row.addEventListener('mouseleave', () => {
      active = false;
      preview.classList.remove('is-active');
    });
  });

  window.addEventListener('mousemove', onMove, { passive: true });
  cleanups.push(() => {
    window.removeEventListener('mousemove', onMove);
    if (raf) cancelAnimationFrame(raf);
  });
}

/* ---------- work filters ---------- */
function initFilters() {
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const grid = document.querySelector('[data-card-grid]');
  if (!buttons.length || !grid) return;

  const cards = Array.from(grid.querySelectorAll('.card'));
  const empty = document.querySelector('[data-filter-empty]');

  buttons.forEach((btn) => {
    listen(btn, 'click', () => {
      const value = btn.getAttribute('data-filter');
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));

      let visible = 0;
      cards.forEach((card, i) => {
        const tags = (card.getAttribute('data-tags') || '').split(' ');
        const show = value === 'all' || tags.includes(value);
        card.classList.toggle('is-filtered-out', !show);
        if (show) {
          visible += 1;
          card.style.setProperty('--i', String(visible - 1));
          if (!reduceMotion()) {
            card.classList.remove('is-in');
            requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('is-in')));
          }
        }
      });

      if (empty) empty.hidden = visible > 0;

    });
  });
}

/* ---------- lightbox ---------- */
function initLightbox() {
  const box = document.querySelector('[data-lightbox]');
  const boxImg = document.querySelector('[data-lightbox-img]');
  const close = document.querySelector('[data-lightbox-close]');
  const links = Array.from(document.querySelectorAll('[data-lightbox-link]'));
  if (!box || !boxImg || !links.length) return;

  let opener = null;

  const open = (src, alt, el) => {
    boxImg.src = src;
    boxImg.alt = alt || '';
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    opener = el;
    close && close.focus();
  };

  const shut = () => {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    if (opener) opener.focus();
  };

  links.forEach((link) => {
    listen(link, 'click', (e) => {
      e.preventDefault();
      open(link.getAttribute('href'), link.getAttribute('aria-label'), link);
    });
  });

  close && listen(close, 'click', shut);
  listen(box, 'click', (e) => {
    if (e.target === box) shut();
  });

  const onKey = (e) => {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') shut();
    if (e.key === 'Tab') { e.preventDefault(); close?.focus(); }
  };
  document.addEventListener('keydown', onKey);
  cleanups.push(() => document.removeEventListener('keydown', onKey));
}

/* ---------- before / after slider ---------- */
function initBeforeAfter() {
  const sliders = Array.from(document.querySelectorAll('[data-ba]'));
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    let dragging = false;

    const setFromEvent = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      slider.style.setProperty('--pos', `${(ratio * 100).toFixed(2)}%`);
    };

    slider.addEventListener('pointerdown', (e) => {
      dragging = true;
      slider.setPointerCapture(e.pointerId);
      setFromEvent(e.clientX);
    });

    slider.addEventListener('pointermove', (e) => {
      if (dragging) setFromEvent(e.clientX);
    });

    const stop = (e) => {
      dragging = false;
      if (slider.hasPointerCapture?.(e.pointerId)) slider.releasePointerCapture(e.pointerId);
    };
    slider.addEventListener('pointerup', stop);
    slider.addEventListener('pointercancel', stop);

    // keyboard accessibility
    slider.addEventListener('keydown', (e) => {
      const current = parseFloat(getComputedStyle(slider).getPropertyValue('--pos')) || 50;
      if (e.key === 'ArrowLeft') slider.style.setProperty('--pos', `${Math.max(current - 4, 0)}%`);
      if (e.key === 'ArrowRight') slider.style.setProperty('--pos', `${Math.min(current + 4, 100)}%`);
    });
  });
}

/* ---------- copy to clipboard ---------- */
function initCopy() {
  const toast = document.querySelector('[data-toast]');
  const buttons = Array.from(document.querySelectorAll('[data-copy]'));
  if (!buttons.length) return;

  const flash = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    const timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
    cleanups.push(() => window.clearTimeout(timer));
  };

  buttons.forEach((btn) => {
    listen(btn, 'click', async () => {
      const value = btn.getAttribute('data-copy') || '';
      const original = btn.textContent;
      try {
        await navigator.clipboard.writeText(value);
        flash(toast?.dataset.copied || 'Copied');
      } catch {
        flash(value);
      }
      if (btn.classList.contains('filter')) {
        btn.textContent = '✓';
        window.setTimeout(() => (btn.textContent = original), 1400);
      }
    });
  });
}

/* ---------- case study table of contents ---------- */
function initToc() {
  const links = Array.from(document.querySelectorAll('[data-toc-link]'));
  const main = document.querySelector('[data-case-main]');
  if (!links.length || !main) return;

  const heads = Array.from(main.querySelectorAll('h2'));
  if (!heads.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle('is-active', l.getAttribute('data-toc-link') === entry.target.id)
        );
      });
    },
    { rootMargin: '-15% 0px -70% 0px' }
  );

  heads.forEach((h) => io.observe(h));
  cleanups.push(() => io.disconnect());
}

/* ---------- card hover video ---------- */
function initCardVideos() {
  if (!finePointer() || reduceMotion()) return;
  document.querySelectorAll('.card').forEach((card) => {
    const video = card.querySelector('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => {
      video.classList.add('is-playing');
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.classList.remove('is-playing');
      video.pause();
    });
  });
}

/* ---------- run ---------- */
function initAll() {
  while (cleanups.length) {
    const fn = cleanups.pop();
    try {
      fn();
    } catch {
      /* noop */
    }
  }
  document.body.style.overflow = '';
  initMotion();
  initHeader();
  initMenu();
  initReveal();
  initHoverPreview();
  initFilters();
  initLightbox();
  initBeforeAfter();
  initCopy();
  initToc();
  initCardVideos();
  initTilt();

  // keep the copied-toast message localised
  const toast = document.querySelector('[data-toast]');
  if (toast) {
    toast.dataset.copied =
      document.documentElement.lang === 'en' ? 'Email copied' : 'Email tersalin';
  }
}

document.addEventListener('astro:page-load', initAll);
if (!document.querySelector('[data-header]')) {
  // fallback for browsers without view transitions support
  document.addEventListener('DOMContentLoaded', initAll);
}
