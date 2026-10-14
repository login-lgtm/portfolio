/* Portfolio viewer — renders the live case-study data as Figma-style frames.
   ?v=short|deep   which version      ?print=1   static layout for PDF export */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const PRINT = params.get('print') === '1';
let version = params.get('v') === 'deep' ? 'deep' : 'short';
/* The Deep Dive is still being polished: visitors see a "coming soon" card instead of the pages.
   Localhost always opens it, so it can keep being worked on locally. */
const DEV = /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && params.get('soon') !== '1';   /* ?soon=1 previews the visitor view on localhost */
const deepLocked = v => v === 'deep' && !DEV && !PRINT;
if (deepLocked('deep')) { const t = document.querySelector('.exp[data-v="deep"] .exp-t'); if (t) t.textContent = 'Soon'; }
function showSoon(on) {
  document.body.classList.toggle('deep-soon', on);
  $('#soon').setAttribute('aria-hidden', on ? 'false' : 'true');
  $$('.seg-btn').forEach(b => b.setAttribute('aria-selected', b.dataset.v === version));
  $$('.pg').forEach(b => b.classList.toggle('on', b.dataset.v === version));
  $('#file-name').textContent = 'Portfolio · ' + (version === 'deep' ? 'Deep Dive' : 'Short');
}
const cache = {};
let frames = [];
let zoom = 1;
let selected = 0;

/* ── data ── */
async function load(v) {
  if (cache[v]) return cache[v];
  const r = await fetch('/api/portfolio-data?v=' + v);
  if (!r.ok) throw new Error('data ' + r.status);
  return (cache[v] = (await r.json()).cases);
}
const { PW, PH } = PFPages;
const wrap = f => `<div class="fr-wrap" data-i="${f.i}" id="fr-${f.i}"><div class="fr-label"><i>${f.i + 1}</i>${f.label}</div>${f.html}</div>`;

async function render() {
  frames = await PFPages.build(cache[version], version);
  $('#stage').innerHTML = frames.map(wrap).join('');
  $$('.fr-wrap').forEach(el => frames[+el.dataset.i].el = el);
  $('#layers').innerHTML = frames.map(f => `<button class="ly" data-i="${f.i}"><svg viewBox="0 0 16 16"><path d="M2.5 4h11v8h-11z"/></svg><span>${f.label}</span></button>`).join('');
  $$('.ly').forEach(b => b.onclick = () => goTo(+b.dataset.i));
  $$('.seg-btn').forEach(b => b.setAttribute('aria-selected', b.dataset.v === version));
  $$('.pg').forEach(b => b.classList.toggle('on', b.dataset.v === version));
  $('#file-name').textContent = 'Portfolio · ' + (version === 'deep' ? 'Deep Dive' : 'Short');
  $('#btn-dl-label').textContent = 'Download PDF';
  document.title = `Vivien Evers · Portfolio (${version === 'deep' ? 'Deep Dive' : 'Short'})`;
  paintSky();
  observe(); select(selected = 0);
}

/* ── interaction ── */
let io;
function observe() {
  if (io) io.disconnect();
  io = new IntersectionObserver(es => es.forEach(e => {
    const pg = e.target.querySelector('.page');
    if (e.isIntersecting && pg) pg.classList.add('in');
    if (pg) $$('video', pg).forEach(v => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); });
  }), { root: $('#canvas'), threshold: .2 });
  $$('.fr-wrap').forEach(el => io.observe(el));
}
function select(i) {
  selected = i;
  $$('.fr-wrap').forEach(el => el.classList.toggle('sel', +el.dataset.i === i));
  $$('.ly').forEach(el => el.classList.toggle('on', +el.dataset.i === i));
  const f = frames[i], c = f && f.c, rp = $('#rp-sel');
  if (!f) return;
  const w = PW, h = PH;
  rp.innerHTML = `<div class="rp-sel-h">${f.label}</div><div class="rp-sel-t">Frame · ${w} × ${h}</div>`
    + (c ? `<div class="rp-h" style="padding-top:10px">Case facts</div>${(c.facts || []).map(([l, v]) => `<div class="rp-row"><b>${l}</b><span>${v}</span></div>`).join('')}<div class="rp-tags">${(c.tags || []).map(t => `<i>${t}</i>`).join('')}</div>` : '');
}
function goTo(i) {
  const f = frames[i]; if (!f) return;
  const cv = $('#canvas');
  cv.scrollTo({ top: f.el.offsetTop * zoom - 56, behavior: 'smooth' });
  select(i);
  if (innerWidth <= 820) $('#lp').classList.remove('open');
}
let spyT;
$('#canvas').addEventListener('scroll', () => {
  clearTimeout(spyT); spyT = setTimeout(() => {
    const cv = $('#canvas'), mid = cv.scrollTop + cv.clientHeight * .4;
    let best = 0;
    frames.forEach(f => { if (f.el.offsetTop * zoom <= mid) best = f.i; });
    if (best !== selected) select(best);
    $('#hint').classList.add('gone');
  }, 60);
}, { passive: true });

function setZoom(z, cx, cy) {
  const cv = $('#canvas'); z = Math.max(.15, Math.min(2, z));
  const rect = cv.getBoundingClientRect(); cx = cx ?? rect.width / 2; cy = cy ?? rect.height / 2;
  const px = (cv.scrollLeft + cx) / zoom, py = (cv.scrollTop + cy) / zoom;
  zoom = z; $('#stage').style.zoom = z;
  cv.style.scrollBehavior = 'auto';
  cv.scrollLeft = px * z - cx; cv.scrollTop = py * z - cy;
  cv.style.scrollBehavior = '';
  $('#z-val').textContent = Math.round(z * 100) + '%';
}
function fit() {
  const cv = $('#canvas'), pad = innerWidth <= 820 ? 32 : 160;
  const widest = PW;
  zoom = 1; $('#stage').style.zoom = 1;
  setZoom(Math.min(1, (cv.clientWidth - pad) / widest));
  cv.scrollLeft = 0;
}
$('#canvas').addEventListener('wheel', e => {
  if (!(e.ctrlKey || e.metaKey)) return;
  e.preventDefault();
  const r = $('#canvas').getBoundingClientRect();
  setZoom(zoom * Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top);
}, { passive: false });
$('#z-in').onclick = () => setZoom(zoom * 1.2);
$('#z-out').onclick = () => setZoom(zoom / 1.2);
$('#z-val').onclick = fit;
$('#btn-sidebar').onclick = () => $('#lp').classList.toggle('open');
$('#canvas').addEventListener('click', e => { const w = e.target.closest('.fr-wrap'); if (w) select(+w.dataset.i); });

/* pan: space + drag, or middle mouse */
let space = false, pan = null;
addEventListener('keydown', e => {
  if (e.code === 'Space' && !/input|textarea/i.test(e.target.tagName) && !$('#present').classList.contains('open')) { space = true; $('#canvas').classList.add('pan-ready'); if (e.target === document.body || e.target === $('#canvas')) e.preventDefault(); }
  if ((e.key === 'p' || e.key === 'P') && !e.metaKey && !e.ctrlKey) present(true);
  if (e.key === '0' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); fit(); }
  if ((e.key === '=' || e.key === '+') && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setZoom(zoom * 1.2); }
  if (e.key === '-' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setZoom(zoom / 1.2); }
});
addEventListener('keyup', e => { if (e.code === 'Space') { space = false; $('#canvas').classList.remove('pan-ready'); } });
$('#canvas').addEventListener('pointerdown', e => {
  if (!(space || e.button === 1)) return;
  e.preventDefault(); const cv = $('#canvas');
  pan = { x: e.clientX, y: e.clientY, l: cv.scrollLeft, t: cv.scrollTop }; cv.classList.add('panning'); cv.setPointerCapture(e.pointerId);
});
$('#canvas').addEventListener('pointermove', e => { if (!pan) return; const cv = $('#canvas'); cv.scrollLeft = pan.l - (e.clientX - pan.x); cv.scrollTop = pan.t - (e.clientY - pan.y); });
$('#canvas').addEventListener('pointerup', () => { pan = null; $('#canvas').classList.remove('panning'); });

let rzT; addEventListener('resize', () => { if (PRINT) return; clearTimeout(rzT); rzT = setTimeout(fit, 150); });

/* version switch */
async function switchTo(v) {
  if (v === version && frames.length && !document.body.classList.contains('deep-soon')) return;
  version = v; history.replaceState(null, '', '?v=' + v);
  if (deepLocked(v)) { showSoon(true); return; }
  showSoon(false);
  document.body.classList.add('loading');
  await load(v); await render(); fit(); document.body.classList.remove('loading');
  $('#canvas').scrollTo({ top: 0, behavior: 'auto' });
}
$$('.seg-btn, .pg').forEach(b => b.onclick = () => switchTo(b.dataset.v));

/* present */
let pi = 0;
function present(open) {
  const el = $('#present'); if (open === false) { el.classList.remove('open'); document.body.classList.remove('is-present'); $('#pr-stage').innerHTML = ''; if (document.fullscreenElement) document.exitFullscreen(); return; }
  const slides = frames; if (!slides.length || document.body.classList.contains('deep-soon')) return;
  pi = Math.max(0, selected); el.classList.add('open'); document.body.classList.add('is-present');
  if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
  showSlide(0);
}
function showSlide(d) {
  const slides = frames;
  pi = Math.max(0, Math.min(slides.length - 1, pi + d));
  const st = $('#pr-stage'); st.innerHTML = slides[pi].html;
  paintSky(st);
  const s = st.querySelector('.page'); requestAnimationFrame(() => s.classList.add('in'));
  $$('video', st).forEach(v => v.play().catch(() => {}));
  $('#pr-count').textContent = `${pi + 1} / ${slides.length}`;
  fitPresent();
}
function fitPresent() { const k = Math.min(innerWidth / PW, innerHeight / PH); $('#pr-stage').style.transform = `translate(-50%,-50%) scale(${k})`; }
addEventListener('resize', fitPresent);
$('#btn-present').onclick = () => present(true);
$('#pr-prev').onclick = () => showSlide(-1); $('#pr-next').onclick = () => showSlide(1); $('#pr-close').onclick = () => present(false);
addEventListener('keydown', e => {
  if (!$('#present').classList.contains('open')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); showSlide(1); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); showSlide(-1); }
  if (e.key === 'Escape') present(false);
});
document.addEventListener('fullscreenchange', () => { if (!document.fullscreenElement && $('#present').classList.contains('open')) present(false); });

/* PDF download */
function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('show'), 3200); }
async function download(v) {
  if (deepLocked(v)) { toast('The Deep Dive is still in the works and will be here soon'); return; }
  const btns = $$('#btn-dl, .exp'); btns.forEach(b => b.classList.add('busy'));
  $('#btn-dl-label').textContent = 'Preparing PDF…';
  if (v !== 'short') toast('Preparing your PDF. This takes a few seconds');
  try {
    /* Short: ready-made file from the CDN (instant); the live export is only the fallback */
    let r = v === 'short' ? await fetch('/portfolio/Vivien-Evers_Portfolio_Short_2026.pdf').catch(() => null) : null;
    if (!r || !r.ok) r = await fetch('/api/portfolio-pdf?v=' + v, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const blob = await r.blob(), a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Vivien-Evers_Portfolio_${v === 'deep' ? 'DeepDive' : 'Short'}_2026.pdf`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Downloaded ✓');
  } catch (err) { toast('PDF could not be created. Please try again'); }
  btns.forEach(b => b.classList.remove('busy')); $('#btn-dl-label').textContent = 'Download PDF';
}
$('#btn-dl').onclick = () => download(version);
$$('.exp').forEach(b => b.onclick = () => download(b.dataset.v));

/* ── sky: pre-rendered images, one per hour of the day (Hamburg time). Every device and the PDF
   export load the very same file, so the desktop background never differs between devices.
   ?h=14.5 overrides the hour for testing. ── */
const SKY_LIGHT = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
function skyHour() {
  const q = parseFloat(params.get('h'));
  if (!isNaN(q)) return Math.floor(q) % 24;
  return +new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Europe/Berlin' }).format(new Date());
}
const SKY_H = skyHour(), SKY_URL = `/portfolio/sky/${SKY_H}.jpg`;
function paintSky(root = document) {
  $$('.p-desk', root).forEach(pg => {
    const el = $('.sky', pg); if (!el) return;
    el.style.background = `url(${SKY_URL}) center/cover`;
    $$('.cl', pg).forEach(x => x.remove());
    pg.classList.toggle('sky-light', SKY_LIGHT.includes(SKY_H));
  });
}

/* ── print mode: make everything static, then signal the exporter ── */
async function preparePrint() {
  document.body.classList.add('print'); document.documentElement.classList.add('print-root');
  $$('.page').forEach(s => s.classList.add('in'));
  $$('img[loading=lazy]').forEach(i => i.loading = 'eager');
  $$('.jx-collage-box').forEach(b => b.style.transform = '');
  /* scroll-triggered animations -> their final state */
  $$('.chat .msg, .chat .chat-delivered').forEach(m => m.classList.add('show'));
  $$('.chat .typing').forEach(t => t.remove());
  /* horizontal scrollers (carousels, work strip) must not widen the page: Chrome would shrink it */
  $$('.p-deep *').forEach(e => { const o = getComputedStyle(e).overflowX; if ((o === 'auto' || o === 'scroll') && !e.matches('.work-strip')) { e.style.overflow = 'clip'; e.scrollLeft = 0; } });
  await document.fonts.ready;
  /* the sky is rasterised: PDF readers like macOS Preview mishandle layered alpha gradients */
  paintSky();
  await new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = SKY_URL; });
  /* videos -> still images (first good frame) */
  const stillOf = v => new Promise(res => {
    const t0 = performance.now(), src = v.getAttribute('src');
    const done = () => { (window.__vlog = window.__vlog || []).push(Math.round(performance.now() - t0) + 'ms ' + (v.isConnected ? 'KEPT ' : 'ok ') + src); res(); }, fail = setTimeout(() => { v.style.visibility = 'hidden'; done(); }, 30000);
    v.muted = true; v.preload = 'auto'; v.removeAttribute('autoplay'); v.pause();
    const snap = () => {
      try {
        const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
        c.getContext('2d').drawImage(v, 0, 0);
        const img = new Image(); img.src = c.toDataURL('image/jpeg', .86);
        /* the still must behave exactly like the video did (CSS targets `video`, not `img`) */
        const cs = getComputedStyle(v);
        img.className = v.className;
        ['position', 'top', 'left', 'right', 'bottom', 'width', 'height', 'objectFit', 'objectPosition', 'borderRadius', 'display', 'zIndex', 'transform', 'flex', 'margin', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'aspectRatio']
          .forEach(k => { img.style[k] = cs[k]; });
        img.style.objectFit = cs.objectFit || 'cover';
        v.replaceWith(img);
      } catch (e) { v.style.visibility = 'hidden'; }
      clearTimeout(fail); done();
    };
    let snapped = false; const snapOnce = () => { if (snapped) return; snapped = true; snap(); };
    /* some files never fire `seeked` (already at that time / odd index) — fall back to whatever frame is ready */
    const seek = () => {
      v.addEventListener('seeked', snapOnce, { once: true });
      const target = Math.min(.8, (v.duration || 1) / 2);
      if (Math.abs(v.currentTime - target) < .05) v.currentTime = target + .1; else v.currentTime = target;
      setTimeout(() => { if (v.readyState >= 2) snapOnce(); }, 1500);
    };
    if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true });
    v.addEventListener('loadeddata', () => setTimeout(() => { if (v.readyState >= 2) snapOnce(); }, 2500), { once: true });
    v.load();
  });
  await Promise.all($$('video').map(stillOf));
  /* keep the PDF small: photos are displayed at ~200px but ship at 1000px+. Downscale every raster image
     to about 2.4x its on-page size (≈230 dpi on A4) and re-encode it (JPEG, PNG only where it has transparency). */
  await Promise.all($$('.page img').map(img => new Promise(res => {
    try {
      const src = img.currentSrc || img.src;
      if (!src || /\.svg(\?|$)/i.test(src) || /^data:image\/svg/.test(src)) return res();
      const go = () => {
        const r = img.getBoundingClientRect(), nw = img.naturalWidth, nh = img.naturalHeight;
        if (!r.width || !r.height || !nw || !nh) return res();
        const k = Math.max(r.width * 2.4 / nw, r.height * 2.4 / nh);
        let kk = k;
        /* already small: keep the size, but still re-encode medium photos (Chrome writes EXIF-rotated JPEGs into the PDF losslessly, ~800 KB each) */
        if (kk >= .8) { kk = 1; if (nw * nh < 250000) return res(); }
        const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(nw * kk)); c.height = Math.max(1, Math.round(nh * kk));
        const x = c.getContext('2d'); x.drawImage(img, 0, 0, c.width, c.height);
        let alpha = false;
        if (/\.png(\?|$)/i.test(src) || /^data:image\/png/.test(src)) {
          const d = x.getImageData(0, 0, c.width, c.height).data;
          for (let i = 3; i < d.length; i += 4) if (d[i] < 250) { alpha = true; break; }
        }
        const url = alpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', .82);
        img.removeAttribute('srcset'); img.src = url;
        img.decode().then(res, res);
      };
      if (img.complete) go(); else img.addEventListener('load', go, { once: true });
    } catch (e) { res(); }
  })));
  await Promise.all($$('img').map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  /* embedded website demos (iframes): wait until their page, fonts and images are really there */
  await Promise.all($$('iframe').map(async f => {
    const wait = (el, ev) => new Promise(r => { el.addEventListener(ev, r, { once: true }); setTimeout(r, 12000); });
    let d; try { d = f.contentDocument; } catch (e) { return; }
    if (!d || d.readyState !== 'complete') { await wait(f, 'load'); try { d = f.contentDocument; } catch (e) { return; } }
    if (!d) return;
    await Promise.all([...d.images].map(i => { i.loading = 'eager'; return i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 12000); }); }));
    try { await Promise.race([d.fonts.ready, new Promise(r => setTimeout(r, 6000))]); } catch (e) {}
  }));
  await new Promise(r => setTimeout(r, 150));
  window.__pdfReady = true;
}

$('#soon-back').onclick = () => switchTo('short');

/* cloud hint */
$('#cloud-btn').onclick = () => $('#cloud-card').classList.toggle('open');
$('#cloud-x').onclick = () => $('#cloud-card').classList.remove('open');
addEventListener('keydown', e => { if (e.key === 'Escape') $('#cloud-card').classList.remove('open'); });

/* ── boot ── */
(async () => {
  try {
    if (deepLocked(version)) { await load('short'); showSoon(true); document.body.classList.remove('loading'); return; }
    await load(version); await render();
    document.body.classList.remove('loading');
    if (PRINT) await preparePrint(); else { await document.fonts.ready; requestAnimationFrame(() => requestAnimationFrame(fit)); setTimeout(() => $('#hint').classList.add('gone'), 7000); }
  } catch (e) {
    document.body.classList.remove('loading');
    $('#stage').innerHTML = '<p style="color:#fff;padding:40px">Could not load the portfolio. Please reload.</p>';
    if (PRINT) window.__pdfReady = true;
  }
})();
})();
