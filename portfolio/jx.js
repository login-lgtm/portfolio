function jxRoot(el) { return el.closest('[data-jx-scroll], #case-scroll, .mob-sheet') || document.scrollingElement; }
function jxLightbox(src) {
  let lb = document.getElementById('jx-lightbox');
  if (!lb) {
    lb = document.createElement('div'); lb.id = 'jx-lightbox'; lb.className = 'jx-lightbox';
    lb.innerHTML = '<img alt="">'; lb.onclick = () => lb.classList.remove('open');
    document.body.appendChild(lb);
  }
  lb.querySelector('img').src = src; lb.classList.add('open');
}
function jxReel(el) {
  const v = el.querySelector('video'); if (!v) return;
  if (v.paused) { v.play(); el.classList.add('playing'); } else { v.pause(); el.classList.remove('playing'); }
}
function jxCarGo(btn, d) { const t = btn.parentElement.querySelector('.car-track'); t.scrollBy({ left: d * t.clientWidth, behavior: 'smooth' }); }
/* Bento tiles: carousel dots, reels that play muted on hover and with sound on click */
function jxTileDots(t) { const i = Math.round(t.scrollLeft / t.clientWidth); t.parentElement.querySelectorAll('.car-dots span').forEach((s, k) => s.classList.toggle('on', k === i)); }
function jxTileHover(el, on) {
  const v = el.querySelector('video'); if (!v || el.dataset.pinned) return;
  if (on) { v.play(); el.classList.add('playing'); } else { v.pause(); el.classList.remove('playing'); }
}
/* Work-strip reels loop muted; a click toggles their sound */
function jxWorkSound(fig) {
  const v = fig.querySelector('video'); if (!v) return;
  v.muted = !v.muted; fig.classList.toggle('sound', !v.muted);
  if (v.paused) v.play();
}
function jxTileReel(el) {
  const v = el.querySelector('video'); if (!v) return;
  if (el.dataset.pinned) { delete el.dataset.pinned; v.muted = true; v.pause(); el.classList.remove('playing'); }
  else { el.dataset.pinned = 1; v.muted = false; v.play(); el.classList.add('playing'); }
}
function jxCarDots(t) { const i = Math.round(t.scrollLeft / t.clientWidth); t.closest('.ig-post').querySelectorAll('.car-dots span').forEach((s, k) => s.classList.toggle('on', k === i)); }
/* Pin the record to the bottom-right of the case's scroll area. Window
   chrome can make CSS right/bottom resolve against the viewport, so
   compute from the scroller's own rect instead. */
function jxDock(surface) {
  const wrap = surface.querySelector('.vinyl-wrap'), root = jxRoot(surface);
  if (!wrap || !root.getBoundingClientRect) return;
  const place = () => {
    if (!surface.isConnected) { removeEventListener('resize', place); return; }
    /* position:fixed may resolve against the window element (backdrop-filter
       makes it the containing block), so measure where 0/0 lands first */
    wrap.style.setProperty('--dock-x', '0px'); wrap.style.setProperty('--dock-y', '0px');
    const o = wrap.getBoundingClientRect(), r = root.getBoundingClientRect();
    const ox = o.right - 150, oy = o.bottom - 118;   /* box origin (scaled from bottom-right) */
    wrap.style.setProperty('--dock-x', (r.right - 24 - 150 - ox) + 'px');
    wrap.style.setProperty('--dock-y', (r.bottom - 38 - 118 - oy) + 'px');

  };
  place(); addEventListener('resize', place);
}
function jxLike(svg, e) {
  e.stopPropagation();
  const post = svg.closest('.ig-post, .tile'), liked = svg.classList.toggle('liked');
  svg.classList.remove('pop'); void svg.getBoundingClientRect(); svg.classList.add('pop');
  if (!liked || !post) return;
  const pr = post.getBoundingClientRect(), sr = svg.getBoundingClientRect(), k = pr.width / post.offsetWidth || 1;
  for (let i = 0; i < 7; i++) {
    const h = document.createElement('span');
    h.className = 'fly-heart';
    h.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 5 6.5 5c2 0 3.5 1.2 4.5 2.8C12 6.2 13.5 5 15.5 5 19 5 21.5 8.5 19.5 12.5 17 16.65 12 21 12 21z"/></svg>';
    h.style.left = ((sr.left - pr.left) / k + 2) + 'px';
    h.style.top = ((sr.top - pr.top) / k - 4) + 'px';
    const dx = (Math.random() - .5) * 60, dy = -(50 + Math.random() * 70), s = .6 + Math.random() * .7, r = (Math.random() - .5) * 50;
    post.appendChild(h);
    h.animate([
      { transform: 'translate(0,0) scale(.3) rotate(0deg)', opacity: 0 },
      { transform: `translate(${dx * .3}px, ${dy * .3}px) scale(${s}) rotate(${r * .4}deg)`, opacity: 1, offset: .25 },
      { transform: `translate(${dx}px, ${dy}px) scale(${s * .8}) rotate(${r}deg)`, opacity: 0 }
    ], { duration: 900 + Math.random() * 600, delay: i * 55, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' }).onfinish = () => h.remove();
  }
}
function jxDive(el) {
  const surface = el.closest('.surface'); if (!surface) return;
  const opening = !surface.classList.contains('open');
  const wrap = surface.querySelector('.vinyl-wrap');
  const from = wrap && wrap.getBoundingClientRect();
  surface.classList.toggle('open', opening);
  const root = jxRoot(surface);
  if (opening) { jxDock(surface); jxPlayLoops(surface); }
  /* FLIP: glide the record between its spot and the docked corner */
  if (wrap && from && wrap.animate) {
    const to = wrap.getBoundingClientRect();
    const dx = from.right - to.right, dy = from.bottom - to.bottom, k = from.width / to.width;
    wrap.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${k})` }, { transform: 'none' }],
      { duration: 750, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
  const target = opening ? surface.querySelector('.deep') : surface;
  setTimeout(() => {
    const top = target.getBoundingClientRect().top - (root.getBoundingClientRect ? root.getBoundingClientRect().top : 0) + root.scrollTop;
    root.scrollTo({ top: opening ? top - 10 : 0, behavior: 'smooth' });
  }, opening ? 120 : 0);
}

/* Looping case videos carry data-autoloop instead of autoplay: inside the
   case window Chrome's autoplay heuristics wrongly treat them as off-screen
   and keep pausing them, so play/pause is driven by visibility here. */
function jxPlayLoops(root) {
  const vids = root.querySelectorAll('video[data-autoloop], video[autoplay]');
  const play = v => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
  if (!('IntersectionObserver' in window)) { vids.forEach(play); return; }
  /* play while on screen, pause when scrolled away */
  const io = root._jxIO || (root._jxIO = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) play(e.target); else e.target.pause();
  }), { threshold: .2 }));
  vids.forEach(v => io.observe(v));
}
function jxInit(scope) {
  const jx = scope && scope.querySelector('.jx'); if (!jx) return;
  jxPlayLoops(jx);
  const root = jxRoot(jx);
  /* Scale the fixed-size collage down on narrow containers */
  const box = jx.querySelector('.jx-collage-box'), col = jx.querySelector('.collage');
  const fit = () => {
    if (!box || !col) return;
    const w = col.clientWidth, s = Math.min(1, w / 650);
    box.style.transform = s < 1 ? `scale(${s})` : '';
    col.style.height = s < 1 ? (610 * s) + 'px' : '';
  };
  fit(); if (window.ResizeObserver && col) new ResizeObserver(fit).observe(col);
  /* Segmented nav: click-to-scroll + scrollspy inside the case scroller */
  const links = [...jx.querySelectorAll('.seg a')];
  const secs = [...jx.querySelectorAll('.deep-in > section[id]')];
  links.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const t = jx.querySelector(a.getAttribute('href')); if (!t) return;
    const rTop = root.getBoundingClientRect ? root.getBoundingClientRect().top : 0;
    root.scrollTo({ top: t.getBoundingClientRect().top - rTop + root.scrollTop - 70, behavior: 'smooth' });
  }));
  const spy = () => {
    if (!jx.isConnected) { root.removeEventListener('scroll', spy); return; }
    const rTop = root.getBoundingClientRect ? root.getBoundingClientRect().top : 0;
    const h = root.clientHeight;
    let cur = secs[0] && secs[0].id;
    secs.forEach(s => { if (s.getBoundingClientRect().top - rTop < h * .4) cur = s.id; });
    if (root.scrollTop + h >= root.scrollHeight - 4 && jx.querySelector('.surface.open')) cur = secs[secs.length - 1].id;
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
  };
  root.addEventListener('scroll', spy, { passive: true });
  /* iMessage takeaway: plays once when it scrolls into view */
  const chat = jx.querySelector('.chat'); if (!chat) return;
  const list = chat.querySelector('.chat-list');
  const q = list.querySelector('.msg.q'), typing = list.querySelector('.typing'),
        replies = [...list.querySelectorAll('.msg.r')], done = list.querySelector('.chat-delivered');
  const wait = ms => new Promise(r => setTimeout(r, ms));
  function show(el, hide) {
    const vis = [...list.children].filter(c => c !== el && c !== hide && c.offsetParent);
    const before = vis.map(c => c.getBoundingClientRect().top);
    if (hide) hide.classList.remove('show', 'pop');
    el.classList.add('show'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    vis.forEach((c, i) => {
      const dy = before[i] - c.getBoundingClientRect().top;
      if (dy) c.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.32,.72,0,1)' });
    });
  }
  let played = false;
  async function play() {
    if (played) return; played = true;
    show(q); await wait(450); show(done); await wait(800);
    for (const m of replies) {
      list.insertBefore(typing, m); show(typing);
      await wait(900 + Math.min(m.textContent.length * 8, 900));
      show(m, typing); await wait(500);
    }
  }
  /* start only once the reader has scrolled all the way to the bottom */
  const atBottom = () => {
    if (!jx.isConnected) { root.removeEventListener('scroll', atBottom); return; }
    if (!jx.querySelector('.surface.open')) return;
    if (root.scrollTop + root.clientHeight >= root.scrollHeight - 12) { root.removeEventListener('scroll', atBottom); play(); }
  };
  root.addEventListener('scroll', atBottom, { passive: true });
}
