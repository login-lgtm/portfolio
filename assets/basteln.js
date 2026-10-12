/* Basteln: pinboard folder window ("CEO of Basteln"). Built lazily the first time the window opens.
   Media lives in work/basteln/web/. Styles are in assets/basteln.css, all scoped to #win-basteln. */
(function () {
  var A = 'work/basteln/web/';
  var BW = 2160, BH = 1700;
  var CASE_IDS = { mi4l: 'mi4l', sl: 'studio-liebe', nrg: 'nrg' };
  var $ = function (s) { return document.querySelector(s); };
  var mq = window.matchMedia('(max-width: 768px)');

  function photo(src, cap, w, h, pos) {
    return '<div class="polaroid" style="width:' + (w + 20) + 'px"><div class="tape"></div><div class="ph" style="height:' + h + 'px"><img src="' + A + src + '" alt="" draggable="false" style="object-position:' + (pos || '50% 50%') + '"></div><div class="cap">' + cap + '</div></div>';
  }
  function loop(src, poster, w, h, cap) {
    return '<div class="polaroid" style="width:' + (w + 20) + 'px"><div class="tape"></div><div class="ph" style="height:' + h + 'px"><video src="' + A + src + '" poster="' + A + poster + '" autoplay loop muted playsinline style="pointer-events:none"></video></div><div class="cap">' + cap + '</div></div>';
  }
  function phone(src, poster, cap) {
    return '<div class="phone"><span class="isl"></span><span class="home"></span><div class="scr"><video src="' + A + src + '" poster="' + A + poster + '" autoplay loop muted playsinline></video></div></div>' + (cap ? '<div class="phone-cap">' + cap + '</div>' : '');
  }
  function img(src) { return '<img src="' + A + src + '" alt="" draggable="false">'; }
  function vid(src, poster) { return '<video src="' + A + src + '" poster="' + A + poster + '" controls loop autoplay muted playsinline></video>'; }
  function note(cls, w, text, small) { return '<div class="note ' + cls + '" style="--w:' + w + 'px"><div class="pin"></div>' + text + '<small>' + small + '</small></div>'; }

  var lighters = ['leonds', 'margo', 'murphy', 'tana'].map(function (n, i) { return '<img src="' + A + 'nrg-lighter-' + n + '.png" alt="" draggable="false" style="--i:' + i + '">'; }).join('');

  /* ---------- data ---------- */
  var zones = [
    { id: 'mi4l', label: 'Music is for Lovers', sub: 'event series', x: 40, y: 330, w: 600, h: 850, c: 'var(--bst-mi4l)' },
    { id: 'sl',   label: 'Studio Liebe', sub: 'part of Music is for Lovers', x: 680, y: 330, w: 600, h: 1300, c: 'var(--bst-sl)' },
    { id: 'nrg',  label: 'NRG', sub: 'Uebel & Gefährlich', x: 1320, y: 330, w: 780, h: 1240, c: 'var(--bst-nrg)' },
    { id: 'more', label: 'More to come', sub: 'already on the workbench', x: 1320, y: 50, w: 780, h: 230, c: 'var(--bst-more)', empty: true }
  ];
  var filters = [
    { id: 'all',  label: 'All', show: ['mi4l', 'sl', 'nrg', 'more'] },
    { id: 'mi4l', label: 'Music is for Lovers', c: 'var(--bst-mi4l)', show: ['mi4l', 'sl'] },
    { id: 'sl',   label: 'Studio Liebe', c: 'var(--bst-sl)', show: ['sl'], sub: true },
    { id: 'nrg',  label: 'NRG', c: 'var(--bst-nrg)', show: ['nrg'] }
  ];
  var bn = { mi4l: ['Music is for Lovers', 'var(--bst-mi4l)'], sl: ['Studio Liebe', 'var(--bst-sl)'], nrg: ['NRG', 'var(--bst-nrg)'] };

  var objs = [
    /* NRG */
    { id: 'lighters', zone: 'nrg', x: 50, y: 80, r: -2, crafted: true, brands: ['nrg'], tags: ['For artists'],
      title: 'Lighters with the artists\' names', stage: img('nrg-lighter-leonds.png'),
      text: 'For the artists at Uebel & Gefährlich, together with a beer with a label I designed: artist care and appreciation. One lighter per artist, with their name on it.',
            html: '<div class="lighters">' + lighters + '</div>' },
    { id: 'drinks', zone: 'nrg', x: 345, y: 695, r: 3, crafted: true, brands: ['nrg'], tags: ['For artists', 'For brands'],
      title: 'Beer and energy drink', stage: img('nrg-drinks.jpg'),
      text: 'A beer with a label I designed, handed to the artists together with their lighter, and an energy drink can. Both carry the event date: 28/03/2025, 23:59.',
            html: photo('nrg-drinks.jpg', 'from the shelf', 230, 330, '50% 55%') },
    { id: 'date-note', zone: 'nrg', x: 630, y: 110, r: 5, plain: true, html: note('', 120, '28.03.2025', 'Uebel &amp; Gefährlich, Turmzimmer') },
    { id: 'reel', zone: 'nrg', x: 90, y: 465, r: -3, brands: ['nrg'], tags: ['For brands'],
      title: 'The supermarket reel', stage: phone('nrg-reel.mp4', 'nrg-reel-poster.jpg', ''),
      text: 'For the Uebel & Gefährlich promo I redesigned and relabelled products so the event details sit on them. The promo was posted in three reels, this one filmed in a supermarket.',
            html: phone('nrg-reel.mp4', 'nrg-reel-poster.jpg', 'the supermarket reel') },
    { id: 'chips', zone: 'nrg', x: 490, y: 450, r: -3, crafted: true, brands: ['nrg'], tags: ['For brands'],
      title: 'Packaging with event infos', stage: img('nrg-chips.jpg'),
      text: 'One of the products I redesigned for the promo: a tube of chips with the lineup on it, "Serving hot acts", A to Z.',
            html: photo('nrg-chips.jpg', 'serving hot acts', 230, 330, '50% 40%') },
    { id: 'flame', zone: 'nrg', x: 390, y: 45, r: 4, brands: ['nrg'], tags: ['For the crew'],
      title: 'Mini lighters for the helpers', stage: img('nrg-lighter-flame.jpg'),
      text: 'Everyone who helped with the NRG event got a small lighter like this one.',
            html: photo('nrg-lighter-flame.jpg', 'for the helpers', 190, 290, '50% 50%') },
    { id: 'batteries', zone: 'nrg', x: 50, y: 950, r: -2, crafted: true, brands: ['nrg'], tags: ['For brands'],
      title: 'Print campaign for promo shoot', stage: img('nrg-batteries.jpg'),
      text: 'Another product with the event details on it: a pack of AA batteries with the date 28/03/2025.',
            html: photo('nrg-batteries.jpg', 'AA, 28/03/2025', 340, 226, '55% 50%') },
    { id: 'nrg-note', zone: 'nrg', x: 210, y: 315, r: 3, plain: true, html: note('violet', 230, 'one lighter<br>per artist', 'lineup A to Z') },

    /* Music is for Lovers */
    { id: 'coasters', zone: 'mi4l', x: 35, y: 70, r: -3, crafted: true, brands: ['mi4l', 'sl'], tags: ['For the crew'],
      title: 'Mini vinyl coasters', stage: img('mi4l-coasters.jpg'),
      text: 'A gift for the crew, not made for one specific event. Each mini vinyl has a sleeve made from an event flyer. I had all the files and built the sleeves in Illustrator. I gave away several stacks of them.',
            html: photo('mi4l-coasters.jpg', 'event designs on vinyl', 250, 335, '50% 55%') },
    { id: 'sleeve', zone: 'mi4l', x: 100, y: 505, r: 4, brands: ['mi4l', 'sl'], tags: ['For the crew'],
      title: 'One sleeve, one record', stage: img('mi4l-sleeve.jpg'),
      text: 'The label on the mini record is a sticker I plotted, matching the sleeve made from the flyer.',
            html: photo('mi4l-sleeve.jpg', 'matching label', 200, 265, '40% 40%') },
    { id: 'plotter', zone: 'mi4l', x: 340, y: 125, r: -3, crafted: true, brands: ['mi4l', 'sl'], tags: ['For the crew'],
      title: 'Plotting the stickers', stage: vid('mi4l-plotter.mp4', 'mi4l-plotter-poster.jpg'),
      text: 'I plotted the stickers for the mini vinyls at my training company.',
            html: loop('mi4l-plotter.mp4', 'mi4l-plotter-poster.jpg', 180, 320, 'cutting stickers') },

    /* Studio Liebe */
    { id: 'vinyl', zone: 'sl', x: 70, y: 60, r: -3, crafted: true, brands: ['sl'], tags: ['For brands'],
      title: 'Custom vinyl for Vol. 3', stage: img('sl-vinyl-turntable.jpg'),
      text: 'Promo for the event together with Faze on 08.02.25: a vinyl record with its own sleeve. We used it in the promo reel. I plotted the stickers and printed the sleeve. It went down really well.',
            html: photo('sl-vinyl-turntable.jpg', 'on the turntable', 190, 232, '55% 55%') },
    { id: 'vinyl-closeup', zone: 'sl', x: 335, y: 90, r: 4, brands: ['sl'], tags: ['For brands'],
      title: 'The Vol. 3 cover, close up', stage: img('sl-vinyl-closeup.jpg'),
      text: 'Close-up of the sleeve: the blue Vol. 3 artwork and lettering.',
            html: photo('sl-vinyl-closeup.jpg', 'Vol. 3 cover', 160, 240, '40% 25%') },
    { id: 'slots', zone: 'sl', x: 25, y: 435, r: 3, crafted: true, brands: ['sl'], tags: ['For the crew'],
      title: 'Slot machine keychains', stage: img('sl-slots.jpg'),
      text: 'Mini slot machine keychains with the Studio Liebe artwork. Together with the mini vinyls from Music is for Lovers, they were my gift for the crew.',
            html: photo('sl-slots.jpg', 'Studio Liebe slots', 210, 280, '50% 45%') },
    { id: 'slots2', zone: 'sl', x: 305, y: 455, r: -2, brands: ['sl'], tags: ['For the crew'],
      title: 'Keychains on the covers', stage: img('sl-slots-covers.jpg'),
      text: 'The keychains on a stack of record sleeves, with the orange Studio Liebe cover on top.',
            html: photo('sl-slots-covers.jpg', 'on the covers', 190, 253, '50% 70%') },
    { id: 'mag-front', zone: 'sl', x: 100, y: 830, r: -3, crafted: true, brands: ['sl'], tags: ['For brands'],
      title: 'Can\'t Stop Studio Liebe magazine', stage: img('sl-magazine-front.jpg'),
      text: 'For the Can\'t Stop Studio Liebe promo in August 2025 at Haus 73. I designed the front and back cover, printed them and glued them on. The event details are on the magazine. The reel for it is on Instagram, and I still have the magazine at home.',
            html: photo('sl-magazine-front.jpg', 'magazine No. 4', 170, 262, '50% 40%') },
    { id: 'mag-video', zone: 'sl', x: 280, y: 820, r: 4, brands: ['sl'], tags: ['For brands'],
      title: 'The magazine reel', stage: phone('sl-magazine.mp4', 'sl-magazine-poster.jpg', ''),
      text: 'The promo reel for Can\'t Stop Studio Liebe, August 2025 at Haus 73. You can also find it on Instagram.',
            html: phone('sl-magazine.mp4', 'sl-magazine-poster.jpg', 'flipping through') },
    /* more to come */
    { id: 'more-note', zone: 'more', x: 270, y: 55, r: -3, plain: true, html: note('', 240, 'more to come', 'new pieces are already on the workbench') }
  ];


  var API = null, playTimer = null;

  function playAll(root) {
    (root || document).querySelectorAll('video[autoplay]').forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); });
  }

  function bstInit() {
    var vp = $('#bst-vp'), board = $('#bst-board'), drawer = $('#bst-drawer');
  /* ---------- render ---------- */
  var zEls = {}, oEls = {};
  function pieces(id) { return objs.filter(function (o) { return o.zone === id && o.crafted; }).length; }
  zones.forEach(function (z) {
    var el = document.createElement('section');
    el.className = 'zone' + (z.empty ? ' empty' : '');
    el.style.cssText = 'left:' + z.x + 'px;top:' + z.y + 'px;width:' + z.w + 'px;height:' + z.h + 'px;--zc:' + z.c;
    var n = pieces(z.id);
    el.innerHTML = '<div class="zlabel">' + z.label + (z.sub ? ' <small>' + z.sub + '</small>' : '') + '</div><div class="zcount">' + (n ? n + (n === 1 ? ' piece' : ' pieces') : 'soon') + '</div>';
    board.appendChild(el); zEls[z.id] = el;
  });
  objs.forEach(function (o) {
    var el = document.createElement('div');
    el.className = 'obj'; el.dataset.id = o.id;
    el.style.setProperty('--x', o.x + 'px'); el.style.setProperty('--y', o.y + 'px'); el.style.setProperty('--r', o.r + 'deg');
    if (!o.plain) { el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', o.title); }
    el.innerHTML = o.html;
    zEls[o.zone].appendChild(el); oEls[o.id] = el;
  });

  var head = document.createElement('div');
  head.className = 'free head-free'; head.style.cssText = 'position:absolute;left:40px;top:40px;width:460px;';
  head.innerHTML =
    '<div class="note" style="--w:460px;padding:30px 28px 28px;transform:rotate(-2deg);filter:drop-shadow(0 10px 12px rgba(30,40,60,.28))"><div class="tape"></div>' +
    '<div style="font-size:26px;font-weight:800;line-height:1.1;letter-spacing:-.01em">CEO of Basteln</div>' +
    '<div style="font:500 11px/1.6 var(--mono);margin-top:14px;opacity:.75">Roughly: CEO of Crafting.<br>A title my friends gave me.</div>' +
    '</div>';
  board.appendChild(head);
  var cnt = document.createElement('div');
  cnt.className = 'free'; cnt.style.cssText = 'position:absolute;left:560px;top:60px;width:600px;font:500 12px/1.75 var(--mono);color:var(--text-mid)';
  cnt.innerHTML = '<div style="font-weight:700;font-size:20px;line-height:1.25;color:var(--text);margin-bottom:10px">I love making things by hand.</div>Gifts for friends, little extras for artists, whole worlds for events. Whenever there is an occasion, I am probably cutting, gluing or printing something for it.<br><br>For me it is a way of saying thank you and welcome. A drink on a mini vinyl, a lighter with your name on it: people remember what they can hold. That is where a brand, or a night, gets its details.';
  board.appendChild(cnt);

  var chips = $('#bst-chips');
  filters.forEach(function (f) {
    var b = document.createElement('button');
    b.className = 'chip' + (f.id === 'all' ? ' active' : ''); b.dataset.f = f.id;
    if (f.c) b.style.setProperty('--c', f.c);
    b.innerHTML = (f.c ? '<i></i>' : '') + f.label;
    b.onclick = function () { setFilter(f.id, true); };
    chips.appendChild(b);
  });

  function setFilter(id, focus) {
    var f = filters.filter(function (x) { return x.id === id; })[0];
    chips.querySelectorAll('.chip').forEach(function (c) { c.classList.toggle('active', c.dataset.f === id); });
    zones.forEach(function (z) { zEls[z.id].classList.toggle('dim', f.show.indexOf(z.id) < 0); });
    if (!focus) return;
    if (mq.matches) { if (id !== 'all') zEls[f.show[0]].scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    id === 'all' ? fit() : focusZones(f.show);
  }

  /* ---------- pan & zoom ---------- */
  var S = { x: 0, y: 0, k: 1 };
  function apply(anim) {
    board.style.transition = anim ? 'transform .55s cubic-bezier(.2,.8,.2,1)' : 'none';
    board.style.transform = 'translate(' + S.x + 'px,' + S.y + 'px) scale(' + S.k + ')';
  }
  /* default view: the content fills the width, leaving about 3.5 dots of the grid pattern on each side */
  var CX0 = 40, CX1 = 2100, CY0 = 40, DOT = 22, SIDE = DOT * 3.5;
  function fit() {
    var r = { width: vp.clientWidth, height: vp.clientHeight }; if (!r.width) return;
    var k = (r.width - 2 * SIDE) / (CX1 - CX0);
    S = { k: k, x: SIDE - CX0 * k, y: SIDE - CY0 * k }; apply(true);
  }
  function focusBox(x, y, w, h) {
    var r = { width: vp.clientWidth, height: vp.clientHeight };
    var k = Math.min(r.width / (w + 160), r.height / (h + 120), 1.15);
    S = { k: k, x: r.width / 2 - (x + w / 2) * k, y: r.height / 2 - (y + h / 2) * k }; apply(true);
  }
  function focusZones(ids) {
    var zs = zones.filter(function (z) { return ids.indexOf(z.id) >= 0; });
    var x0 = Math.min.apply(0, zs.map(function (z) { return z.x; })), y0 = Math.min.apply(0, zs.map(function (z) { return z.y; }));
    var x1 = Math.max.apply(0, zs.map(function (z) { return z.x + z.w; })), y1 = Math.max.apply(0, zs.map(function (z) { return z.y + z.h; }));
    focusBox(x0, y0, x1 - x0, y1 - y0);
  }
  function zoomBy(f, cx, cy) {
    var r = vp.getBoundingClientRect(); cx = cx == null ? r.width / 2 : cx; cy = cy == null ? r.height / 2 : cy;
    var nk = Math.max(.2, Math.min(2, S.k * f)), q = nk / S.k;
    S.x = cx - (cx - S.x) * q; S.y = cy - (cy - S.y) * q; S.k = nk; apply(false);
  }
  $('#bst-zi').onclick = function () { zoomBy(1.25); }; $('#bst-zo').onclick = function () { zoomBy(.8); };
  $('#bst-fit').onclick = function () { setFilter('all', true); };
  vp.addEventListener('wheel', function (e) {
    if (mq.matches) return; e.preventDefault();
    var r = vp.getBoundingClientRect();
    if (e.ctrlKey || e.metaKey) zoomBy(Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top);
    else { S.x -= e.deltaX; S.y -= e.deltaY; apply(false); }
  }, { passive: false });

  var pan = null, drag = null, zTop = 10;
  vp.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.drawer') || mq.matches) return;
    var o = e.target.closest('.obj');
    if (o) { drag = { el: o, sx: e.clientX, sy: e.clientY, ox: o.offsetLeft, oy: o.offsetTop, moved: false }; o.setPointerCapture(e.pointerId); }
    else { pan = { sx: e.clientX, sy: e.clientY, x: S.x, y: S.y }; vp.classList.add('panning'); vp.setPointerCapture(e.pointerId); }
  });
  vp.addEventListener('pointermove', function (e) {
    if (drag) {
      var dx = (e.clientX - drag.sx) / S.k, dy = (e.clientY - drag.sy) / S.k;
      if (!drag.moved && Math.hypot(dx, dy) * S.k > 4) { drag.moved = true; drag.el.classList.add('drag'); drag.el.style.zIndex = ++zTop; }
      if (drag.moved) { drag.el.style.setProperty('--x', drag.ox + dx + 'px'); drag.el.style.setProperty('--y', drag.oy + dy + 'px'); }
    } else if (pan) { S.x = pan.x + e.clientX - pan.sx; S.y = pan.y + e.clientY - pan.sy; apply(false); }
  });
  function end() {
    if (drag) { drag.el.classList.remove('drag'); if (!drag.moved) openObj(drag.el.dataset.id); else saveLayout(); drag = null; }
    if (pan) { if (Math.hypot(S.x - pan.x, S.y - pan.y) < 3) closeDrawer(); pan = null; vp.classList.remove('panning'); }
  }
  vp.addEventListener('pointerup', end); vp.addEventListener('pointercancel', end);
  board.addEventListener('click', function (e) { if (!mq.matches) return; var o = e.target.closest('.obj'); if (o) openObj(o.dataset.id); });
  board.addEventListener('keydown', function (e) { if (e.key !== 'Enter' && e.key !== ' ') return; var o = e.target.closest('.obj'); if (o) { e.preventDefault(); openObj(o.dataset.id); } });

  /* ---------- drawer ---------- */
  function openObj(id) {
    var o = objs.filter(function (x) { return x.id === id; })[0];
    if (!o || o.plain) return;
    Object.keys(oEls).forEach(function (k) { oEls[k].classList.remove('sel'); }); oEls[id].classList.add('sel');
    var bt = o.brands.map(function (b) { return '<span class="tg b" style="--c:' + bn[b][1] + '">' + bn[b][0] + '</span>'; }).join('');
    var tt = o.tags.map(function (t) { return '<span class="tg">' + t + '</span>'; }).join('');
    drawer.innerHTML = '<button class="x" aria-label="Close details">✕</button><div class="stage">' + o.stage + '</div><div class="tags">' + bt + '</div><h3>' + o.title + '</h3><p>' + o.text + '</p><div class="tags">' + tt + '</div><div class="draft">Draft text.</div><button class="btn">See the ' + bn[o.brands[0]][0] + ' case study →</button>';
    drawer.querySelector('.x').onclick = closeDrawer;
    drawer.querySelector('.btn').onclick = function () { if (window.bstGoCase) window.bstGoCase(CASE_IDS[o.brands[0]]); };
    drawer.classList.add('open');
  }
  function closeDrawer() { drawer.classList.remove('open'); Object.keys(oEls).forEach(function (k) { oEls[k].classList.remove('sel'); }); }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });


    API = { fit: fit, focusZones: focusZones, setFilter: setFilter, closeDrawer: closeDrawer };
  }

  /* Desktop: called by openWindow('basteln'). zone: optional zone id to zoom to (from a case study). */
  window.bstOnOpen = function (zone) {
    if (!API) bstInit();
    var back = $('#bst-back');
    back.hidden = !zone;
    API.closeDrawer();
    API.setFilter(zone || 'all', false);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (zone) API.focusZones([zone]); else API.fit();
      playAll($('#win-basteln'));
    }); });
    if (!playTimer) playTimer = setInterval(function () {
      var w = $('#win-basteln');
      if (w && w.style.display === 'flex') playAll(w);
    }, 2000);
  };
  window.addEventListener('resize', function () {
    var w = $('#win-basteln');
    if (API && !mq.matches && w && w.style.display === 'flex') API.fit();
  });

  /* Mobile: the same pieces as a vertical list for the bottom sheet. */
  window.bstMobileHTML = function () {
    var h = '<div class="bst-m"><div class="bst-m-head"><div class="bst-m-title">CEO of Basteln</div><p>Roughly: CEO of Crafting.<br>A title my friends gave me.</p><p>I love making things by hand. Gifts for friends, little extras for artists, whole worlds for events. Whenever there is an occasion, I am probably cutting, gluing or printing something for it.</p></div>';
    zones.filter(function (z) { return !z.empty; }).forEach(function (z) {
      h += '<section class="bst-m-zone" style="--zc:' + z.c + '"><div class="bst-m-label">' + z.label + (z.sub ? ' <small>' + z.sub + '</small>' : '') + '</div>';
      objs.filter(function (o) { return o.zone === z.id && !o.plain; }).forEach(function (o) {
        h += '<article class="bst-m-card"><div class="bst-m-media">' + o.html + '</div><h3>' + o.title + '</h3><p>' + o.text + '</p></article>';
      });
      h += '</section>';
    });
    return h + '<div class="bst-m-more">More to come <small>new pieces are already on the workbench</small></div></div>';
  };
})();
