/* Page builders — every portfolio page is A4 landscape (1122 × 793 px).
   Pages are generated from the live case-study data (api/_data/cases.js):
   cover / contents / end follow the desktop on vivienevers.de, each case starts
   with its real hero, deep-dive sections are paginated to A4. */
window.PFPages = (() => {
'use strict';
const PW = 1122, PH = 793;
const PROFILE = {
  name: 'Vivien Evers', role: 'Brand &amp; Graphic Designer', city: 'Hamburg',
  blurb: 'I keep brands recognisable, from the poster on the wall to the story on your phone. Early in this chapter, hungry for what’s next.',
  email: 'hi@vivienevers.de', linkedin: 'linkedin.com/in/vivien-evers', web: 'vivienevers.de',
  photo: '/images/about/itsme.jpg'
};
const THEMES = {
  jco:            { sky:'#009FE3', ink:'#036ba0', navy:'#183A68', umbra:'#A76D57', beige:'#B99D6B' },
  mi4l:           { sky:'#C01D2A', ink:'#8E0F22', navy:'#1A0508', umbra:'#3A4BE0', beige:'#F4C1C7' },
  'studio-liebe': { sky:'#F98D20', ink:'#B8560A', navy:'#2B1A14', umbra:'#6F7F9A', beige:'#FBB13B' },
  nrg:            { sky:'#3B4CC0', ink:'#2A3796', navy:'#12131F', umbra:'#3A4BE0', beige:'#F4C1C7' },
  ebru:           { sky:'#5A8A6E', ink:'#2B4435', navy:'#1F3327', umbra:'#B86A47', beige:'#E6C9B3' }
};
const THEME_DEFAULT = { sky:'#2E7DD1', ink:'#1d5aa0', navy:'#0f2a4a', umbra:'#7c5cff', beige:'#9fc5f0' };
const theme = id => THEMES[id] || THEME_DEFAULT;
const tvars = t => `--sky:${t.sky};--sky-ink:${t.ink};--navy:${t.navy};--umbra:${t.umbra};--beige:${t.beige}`;
const ci = c => THEMES[c.id] ? c.id : 'default';
const num = i => String(i).padStart(2, '0');
const abs = p => p && (/^(https?:|\/|data:)/.test(p) ? p : '/' + p);
const plain = h => { const d = document.createElement('div'); d.innerHTML = (h || '').replace(/<\/(p|div|li|h[1-6])>/gi, '$& '); return d.textContent.replace(/\s+/g, ' ').trim(); };
const period = c => ((c.facts || []).find(f => /^time/i.test(f[0])) || [])[1] || '';
const STATUS = { current:'Current', progress:'In progress' };   // other cases: no status pill, period only
/* case markup uses site-relative paths (work/…, images/…) */
const fixPaths = h => h.replace(/(["'(])((?:work|images|assets|fonts)\/)/g, '$1/$2');
const chipLabel = (c, kind) => `${PROFILE.name} · ${kind}`;
const foot = (left, right) => `<div class="p-foot"><span>${left}</span><span>${right}</span></div>`;
const frame = (cls, style, inner) => `<div class="frame page ${cls}" style="${style || ''}">${inner}</div>`;

/* ═══ desktop-style pages ═══ */
const DOCK = ['launchpad', 'finder', 'about', 'contact', '|', 'figma', 'photoshop', 'illustrator', 'indesign', 'capcut', '|', 'claude', 'chatgpt', 'meta'];
const dock = () => `<div class="dock">${DOCK.map(i => i === '|' ? '<u></u>' : `<img src="/images/icons/${i}.png" alt="">`).join('')}</div>`;
const clouds = '<i class="cl" style="left:60px;top:120px;width:520px;height:150px"></i><i class="cl" style="left:640px;top:360px;width:560px;height:170px"></i><i class="cl" style="left:-80px;top:500px;width:420px;height:130px"></i><i class="cl" style="left:700px;top:50px;width:380px;height:110px"></i>';
const menubar = right => `<div class="menubar"><b>${PROFILE.name}</b><span>Case Studies</span><span>Contact</span><span>Help</span><i></i><em>${right}</em></div>`;

function pageCover(version) {
  return frame('p-desk p-cover', '', `<div class="sky"></div>${clouds}${menubar('Portfolio ' + new Date().getFullYear() + ' · ' + (version === 'deep' ? 'Deep Dive' : 'Short'))}
    <div class="badge" data-a>
      <div class="strap"><span>VIVIENEVERS.DE</span></div>
      <div class="card"><i class="clip"></i>
        <div class="hi">Hi, I’m</div>
        <div class="nm">${PROFILE.name}</div>
        <div class="rl">${PROFILE.role}</div>
        <div class="bl">${PROFILE.blurb}</div>
        <div class="otw"><i></i>Available · In-house</div>
        <div class="ph"><img src="${PROFILE.photo}" alt=""></div>
      </div>
    </div>
    <div class="welcome" data-a style="--d:1"><small>Welcome to my</small><h1>Portfolio.</h1>
      <p><span>${version === 'deep' ? 'Deep Dive · the full case studies' : 'Short version · selected work'}</span></p></div>
    ${dock()}`);
}
function pageContents(rows, total, label) {
  const html = rows.map(r => `<div class="row" style="--c:${r.color}"><img src="${abs(r.logo || '/images/icons/folder.yellow.png')}" alt="">
      <div class="rt"><b>${r.title}</b><small>${r.kicker}</small></div><em>${r.meta || ''}</em><span>p. ${r.page}</span></div>`).join('');
  return frame('p-desk p-contents', '', `<div class="sky"></div>${clouds}${menubar('Contents')}
    <div class="win"><div class="wt"><i class="r"></i><i class="y"></i><i class="g"></i><span>Case Studies</span></div>
      <div class="wb"><div class="wh">${label} · ${total} pages</div>${html}</div></div>${dock()}`);
}
function pageEnd(version) {
  const info = [['Email', PROFILE.email, `mailto:${PROFILE.email}`], ['Phone', '+49 176 48555562', 'tel:+4917648555562'], ['LinkedIn', PROFILE.linkedin, `https://${PROFILE.linkedin}`], ['Web', PROFILE.web, `https://${PROFILE.web}`]]
    .map(([k, v, h]) => `<a href="${h}"><small>${k}</small><b>${v}</b></a>`).join('');
  return frame('p-desk p-end', '', `<div class="sky"></div>${clouds}${menubar('Thank you')}
    <div class="ph" data-a><img src="/images/about/coffeandme.jpg" alt=""></div>
    <div class="bubble" data-a style="--d:1">Coffee chat?</div>
    <h1 data-a style="--d:1">Let’s talk.</h1>
    <div class="end-info" data-a style="--d:2">${info}</div>
    <p class="end-avail" data-a style="--d:3"><i></i>Open to in-house roles in Hamburg or remote.</p>
    ${version === 'deep' ? '<p class="end-note" data-a style="--d:3">Thank you for taking the time.</p>' : ''}
    <div class="end-egg">You made it to the last page. The Konami code doesn’t work in a PDF, but my phone number does.</div>${dock()}`);
}

/* ═══ case pages ═══ */
const surface = (inner, extra = '') => `<div class="p-surface ${extra}">${inner}</div>`;

/* hero of a hand-built case = the real hero from the website */
function customParts(c) {
  const tpl = document.createElement('template');
  tpl.innerHTML = fixPaths(c.customHTML);
  const frag = tpl.content;
  if (!document.querySelector(`[data-pf-assets="${c.id}"]`)) {
    const holder = document.createElement('div'); holder.dataset.pfAssets = c.id; holder.hidden = true;
    frag.querySelectorAll('style, link').forEach(n => holder.appendChild(n));
    document.head.appendChild(holder);
  }
  /* nothing to click on paper: drop the sound hint from the reel labels */
  frag.querySelectorAll('.t-label em').forEach(e => { if (/click for sound/i.test(e.textContent)) e.remove(); });
  frag.querySelectorAll('.car-btn').forEach(e => e.remove());
  const jx = frag.querySelector('.jx');
  return { frag, jx, surface: jx.querySelector('.surface'), deepIn: jx.querySelector('.deep-in') };
}
const openTag = el => { const s = el.cloneNode(false).outerHTML; return s.slice(0, s.lastIndexOf('</')); };

function heroCustom(c, i, n) {
  const p = customParts(c);
  const hero = p.surface.querySelector('.hero-split').outerHTML;
  return frame('p-case p-hero', tvars(theme(c.id)), `${surface(`${openTag(p.jx)}${openTag(p.surface)}${hero}</div></div>`, 'is-hero')}${foot(`${PROFILE.name} · Portfolio`, `${num(i + 1)} / ${num(n)} · ${c.nav || c.title}`)}`);
}

/* hero for cases without hand-built markup: same grammar (collage + facts column) */
function heroGeneric(c, i, n) {
  const t = theme(c.id), dec = c.decisions || [];
  const tiles = [
    `<div class="g-tile big"><small>The challenge</small><p>${c.challenge ? c.challenge.pull : c.lede}</p></div>`,
    ...dec.slice(0, 3).map((d, k) => `<div class="g-tile ${k === 1 ? 'sky' : ''}"><b>${num(k + 1)}</b><small>${d.tag}</small><p>${d.title}</p></div>`)
  ].slice(0, 4);
  const facts = (c.facts || []).slice(0, 4).map(([l, v]) => `<div><div class="fc-fact-l">${l}</div><div class="fc-fact-v">${v}</div></div>`).join('');
  return frame('p-case p-hero', tvars(t), `${surface(`<div class="g-hero"><div class="g-bento">${tiles.join('')}</div>
    <div class="g-facts">${STATUS[c.status] ? `<span class="fc-status">${STATUS[c.status]}</span>` : ''}<div class="fc-kicker">${c.kicker}</div>
    <div class="fc-title">${c.title}</div><div class="fc-lede">${c.lede}</div>
    <div class="g-tags">${(c.tags || []).map(x => `<i>${x}</i>`).join('')}</div><div class="fc-facts">${facts}</div></div></div>`, 'is-hero')}${foot(`${PROFILE.name} · Portfolio`, `${num(i + 1)} / ${num(n)} · ${c.nav || c.title}`)}`);
}

/* ═══ detail pages: airy, one idea per page ═══ */
const hdr = (c, section, k) => `<div class="d-head"><span>${c.nav || c.title}</span><span>${section}</span></div><div class="d-mark ci">${num(k)}</div>`;

const pullSize = t => t.length > 120 ? 28 : t.length > 90 ? 33 : t.length > 60 ? 38 : 42;
function pageChallenge(c, i, n, full) {
  const t = theme(c.id);
  const body = c.challenge ? c.challenge.body : `<p>${plain(c.lede)}</p>`;
  const steps = (c.approach || []).slice(0, 4).map((a, k) => `<li><b class="ci">${num(k + 1)}</b><span>${plain(a)}</span></li>`).join('');
  return frame(`p-case p-detail ci-${ci(c)}`, tvars(t), `${surface(`${hdr(c, 'The challenge &amp; approach', 1)}
    <div class="d-ch"><div class="d-l"><div class="d-label">The challenge</div>
      <div class="d-pull ci" style="font-size:${pullSize(c.challenge ? c.challenge.pull : c.title)}px">${c.challenge ? c.challenge.pull : c.title}</div><div class="d-body">${body}</div></div>
      ${steps ? `<div class="d-r"><div class="d-label">Approach</div><ol class="d-steps">${steps}</ol></div>` : ''}</div>`, 'is-detail')}${foot(`${PROFILE.name} · Portfolio`, `${num(i + 1)} / ${num(n)} · ${c.nav || c.title}`)}`);
}
function pageDecisions(c, i, n) {
  const t = theme(c.id), dec = (c.decisions || []).slice(0, 4);
  return frame(`p-case p-detail ci-${ci(c)}`, tvars(t), `${surface(`${hdr(c, 'Key decisions', 2)}
    <div class="d-dc"><div class="d-label">Key decisions</div><h2 class="d-h2 ci">What I chose, and why.</h2>
      <div class="d-cards n${dec.length}">${dec.map((d, k) => `<div class="d-card"><i class="nb ci">${num(k + 1)}</i><small>${d.tag}</small><div class="ci">${d.title}</div><p>${plain(d.why)}</p></div>`).join('')}</div></div>`, 'is-detail')}${foot(`${PROFILE.name} · Portfolio`, `${num(i + 1)} / ${num(n)} · ${c.nav || c.title}`)}`);
}
/* ═══ deep dive pages: same grammar as the short version (airy detail pages), continued ═══ */
const pfoot = (c, i, n) => foot(`${PROFILE.name} · Portfolio`, `${num(i + 1)} / ${num(n)} · ${c.nav || c.title}`);
const detail = (c, i, n, section, k, inner, cls = 'd-ch') =>
  frame(`p-case p-detail ci-${ci(c)}`, tvars(theme(c.id)), `${surface(`${hdr(c, section, k)}<div class="${cls}">${inner}</div>`, 'is-detail')}${pfoot(c, i, n)}`);
const imgs = list => (list || []).filter(m => typeof m === 'string' || m.type === 'img').map(m => typeof m === 'string' ? { src: m } : m);

function pageFamily(c, i, n) {
  const cards = [
    ['Music is for Lovers', 'The curator', 'work/mi4l/media/mi4l-profile.jpg', '#C01D2A'],
    ['Studio Liebe', 'Disco and house, warm and intimate', 'work/studio-liebe/studioliebe-profile.jpg', '#2B1A14'],
    ['NRG', 'Tech house, harder and louder', 'work/nrg/nrg-profile.jpg', '#12131F']
  ].map(([t, d, src, bg]) => `<div class="fam-c" style="background:${bg}"><img src="${abs(src)}" alt=""><div><b>${t}</b>${d}</div></div>`).join('');
  return detail(c, i, n, 'The family', 3, `<div class="d-label">The family</div>
    <h2 class="d-h2 ci">A house of brands, not a branded house.</h2><p class="d-lede">What connects them is taste, not a template.</p>
    <div class="fam-lv3"><div><small>The curator</small><b>Music is for Lovers</b>Curates the music, the nights and the attitude.</div><i>→</i>
      <div><small>The series</small><b>Studio Liebe · NRG</b>Each has its own music world and its own identity.</div><i>→</i>
      <div><small>The night</small><b>Every single event</b>Its own world and theme, sometimes clearly part of the series, sometimes deliberately not.</div></div>
    <div class="fam-cs">${cards}</div>`, 'd-dc');
}
function pageHighlight(c, i, n, k) {
  const h = c.highlight, pics = imgs(h.images).slice(0, 4);
  return detail(c, i, n, h.title, k, `<div class="d-l"><div class="d-label">${h.eyebrow}</div>
      <div class="d-pull ci" style="font-size:${h.title.length > 30 ? 32 : 40}px${c.id === 'studio-liebe' ? ';text-transform:uppercase' : ''}">${h.title}</div><div class="d-body">${h.body}</div></div>
    <div class="d-r"><div class="d-hl n${pics.length}">${pics.map(m => `<img src="${abs(m.src)}" alt="">`).join('')}</div></div>`);
}
function pagesWork(c, i, n, k0) {
  const list = imgs(c.media), out = [];
  for (let k = 0; k < list.length; k += 5) {
    const part = list.slice(k, k + 5);
    out.push(detail(c, i, n, 'The work', k0 + out.length, `<div class="d-label">The work</div><h2 class="d-h2 ci">A closer look.</h2>
      <div class="d-wg" style="--n:${part.length}">${part.map(m => `<figure><img src="${abs(m.src)}" alt=""><figcaption>${m.cap || ''}</figcaption></figure>`).join('')}</div>`, 'd-dc'));
  }
  return out;
}
function pageOutcome(c, i, n, k) {
  const o = c.outcome, refl = c.reflection && plain(typeof c.reflection === 'string' ? c.reflection : (c.reflection.body || ''));
  const stats = c.stats ? `<div class="d-stats">${c.stats.map(([v, l]) => `<div><b class="ci">${v}</b><span>${l}</span></div>`).join('')}</div>` : '';
  const pts = o ? o.points.map(([t, h, x]) => `<div class="d-card"><small>${t}</small><div class="ci" style="font-size:19px;margin:6px 0 6px;max-width:none">${h}</div><p>${plain(x)}</p></div>`).join('') : '';
  const left = `<div class="d-l"><div class="d-label">Outcome</div>
      ${o ? `<div class="d-pull ci" style="font-size:30px">${plain(o.lede)}</div>` : ''}${stats}
      ${c.meaning ? `<div class="d-mean"><small>What this means for you</small><p>${plain(c.meaning)}</p></div>` : ''}</div>`;
  const right = (pts || refl) ? `<div class="d-r">${pts ? `<div class="d-pts">${pts}</div>` : ''}${refl ? `<div class="d-refl"><small>Reflection</small>${refl}</div>` : ''}</div>` : '';
  return detail(c, i, n, 'Outcome', k, left + right);
}

/* ═══ short version: 13 pages ═══ */
const win = (title, cls, inner) => `<div class="win ${cls}"><div class="wt"><i class="r"></i><i class="y"></i><i class="g"></i><span>${title}</span></div><div class="wb">${inner}</div></div>`;

function pageAbout() {
  const rows = [['Certified', 'Media Designer Digital &amp; Print, 2026'], ['Before', '7 years in retail &amp; fashion'], ['Where', 'Hamburg']]
    .map(([k, v]) => `<div class="gi-r"><span>${k}</span><b>${v}</b></div>`).join('');
  const tags = ['Brand', 'Campaigns', 'Print', 'Social', 'Detail-obsessed'].map((t, k) => `<i style="--k:${k}">${t}</i>`).join('');
  return frame('p-desk p-about', '', `<div class="sky"></div>${clouds}${menubar('About')}
    ${win('Vivien Evers Info', 'gi', `<div class="gi-h"><img src="${PROFILE.photo}" alt=""><div><b>Vivien Evers</b><small>Brand &amp; Graphic Designer · Hamburg</small></div></div>
      <div class="gi-s">General</div>${rows}
      <div class="gi-s">Tags</div><div class="gi-tags">${tags}</div>
      <div class="gi-s">Comments</div><p class="gi-c">I spent seven years in retail watching what a brand does to people in a store. Then I learned how to make one. Freelance clients, an event label, brands built from scratch, all while I was still in training. This is just the beginning.</p>`)}
    ${dock()}`);
}
function pageWhat(pg) {
  const items = [
    ['Consistency across every channel.', 'One identity, many formats, no drift.', `JCO Hamburg, p. ${pg.jco}`],
    ['Range, and knowing when to use it.', 'Some briefs need the brand to stay exactly itself. Others need a new world by Friday.', `Music is for Lovers, p. ${pg.mi4l}`],
    ['From idea to the wall.', 'Concept, design, shooting, editing, print production. I stay in the loop until it’s out in the world.', `NRG, p. ${pg.nrg}`]
  ].map(([h, t, r], k) => `<div class="wd-i"><b>${k + 1}</b><div><h3>${h}</h3><p>${t}</p><em>${r}</em></div></div>`).join('');
  return frame('p-desk p-what', '', `<div class="sky"></div>${clouds}${menubar('What I do')}
    ${win('What I do for your brand', 'wd', `<h2>Three things I bring to your brand.</h2>${items}`)}${dock()}`);
}
function pageStory(c, i, n, mark) {
  const t = theme(c.id), st = c.story, d = st.decisions;
  return frame(`p-case p-detail p-story ci-${ci(c)}`, tvars(t), `${surface(`<div class="d-head"><span>${(c.nav || c.title).toUpperCase().replace('MI4L', 'MUSIC IS FOR LOVERS')}</span>${mark ? `<span class="fam-mark">${mark}</span>` : ''}<span>The story</span></div>
    <div class="st-g"><div class="st-l"><div class="d-label">${st.label}</div>
        <div class="d-pull ci st-h">${st.headline}</div><div class="d-body st-b">${st.body}</div>
        <div class="d-mean st-mean"><small>What this means for you</small><p>${plain(st.meaning || c.meaning)}</p></div></div>
      <div class="st-r"><div class="d-label">Key decisions</div>
        ${d.map(([h, x], k) => `<div class="st-d"><b class="ci">${num(k + 1)}</b><div><h4 class="ci">${h}</h4><p>${x}</p></div></div>`).join('')}
        <div class="st-o"><small>Outcome</small>${st.outcome}</div></div></div>`, 'is-detail')}${pfoot(c, i, n)}`);
}
/* JCO title page: name on top, left-aligned; the work in one row along the bottom */
/* bento page of a hand-built case (the website hero), optional chapter marker + per-case tweaks */
function pageBento(c, i, n, { mark, tweak, cls = '' } = {}) {
  const p = customParts(c), hero = p.surface.querySelector('.hero-split');
  if (tweak) tweak(hero);
  return frame(`p-case p-hero ${cls}`, tvars(theme(c.id)), `${surface(`<div class="d-head"><span>${(c.nav || c.title).toUpperCase().replace('MI4L', 'MUSIC IS FOR LOVERS')}</span>${mark ? `<span class="fam-mark">${mark}</span>` : ''}<span>The work</span></div>${openTag(p.jx)}${openTag(p.surface)}${hero.outerHTML}</div></div>`, 'is-hero')}${pfoot(c, i, n)}`);
}
const MI_LEVELS = [['The curator', 'Music is for Lovers. Curates the music, the nights and the attitude.'], ['The series', 'Studio Liebe and NRG. Each with its own music world and its own identity.'], ['The night', 'Every single event. Its own theme, sometimes clearly part of the series, sometimes deliberately not.']];
function tweakMi4l(hero) {
  hero.querySelector('.fc-lede').textContent = 'A house music label that curates its own nights. A house of brands, not a branded house: what connects them is taste, not a template.';
  const ul = document.createElement('div'); ul.className = 'mi-levels';
  ul.innerHTML = MI_LEVELS.map(([k, v]) => `<div><small>${k}</small><span>${v}</span></div>`).join('');
  hero.querySelector('.fc-lede').after(ul);
}
function tweakNrg(hero) {
  /* the Motion tile shows a brighter photo from the Supermarket Run material (the Campaign tile keeps its reel).
     TODO(vivi): confirm this photo (lineup tube in daylight) is the one you want in the Motion tile */
  const mo = [...hero.querySelectorAll('.tile')].find(t => /Motion/.test(t.textContent));
  const v = mo && mo.querySelector('video');
  if (v) { const img = document.createElement('img'); img.src = '/work/basteln/web/nrg-chips.jpg'; img.alt = ''; img.className = v.className; img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 35%'; v.replaceWith(img); mo.querySelectorAll('.play-badge').forEach(x => x.remove()); const lb = mo.querySelector('.t-label b'); if (lb) lb.textContent = 'Packaging'; }
  /* Merch tile: the lighter photo as background, the four lighters on top */
  const me = hero.querySelector('.t-lighters');
  if (me) me.style.cssText += `;background:linear-gradient(rgba(18,19,31,.25),rgba(18,19,31,.25)),url(${abs('work/basteln/web/nrg-lighter-flame.jpg')}) 50% 100%/100% auto no-repeat #12131F`; me.classList.add('nrg-merch');
}
function tweakEbru(hero) {
  /* the website demo is a live iframe on the website; in the export it shows the top of the page */
  const f = hero.querySelector('iframe'); if (f) { f.setAttribute('scrolling', 'no'); f.setAttribute('src', f.getAttribute('src') + '?static'); const l = hero.querySelector('.t-site .t-label'); if (l) l.remove(); }
}
/* JCO: the Sub-brand label sits a little higher so it doesn't cover the lettering of the Ami Technu artwork */
function tweakJco(hero) {
  const l = [...hero.querySelectorAll('.t-label')].find(x => /Sub-brand/.test(x.textContent));
  if (l) l.style.bottom = '30px';
}
const pageJcoTitle = (c, i, n) => pageBento(c, i, n, { cls: 'p-jco1' });

function pageHL(c, i, n) {
  const h = c.highlight, t = theme(c.id), pics = imgs(h.images).slice(0, 3);
  return frame(`p-case p-hl ci-${ci(c)}`, tvars(t), `<div class="hl-wrap">
    <div class="hl-pics n${pics.length}">${pics.map(m => `<img src="${abs(m.src)}" alt="">`).join('')}</div>
    <div class="hl-txt"><div class="hl-eb">${h.eyebrow}</div><h2 class="ci hl-t" style="font-size:${h.title.length > 24 ? 38 : 46}px${c.id === 'studio-liebe' ? ';text-transform:uppercase' : ''}">${h.title}</h2>
      <div class="hl-facts">${h.facts.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
      <p class="hl-story">${h.short}</p>
      <div class="hl-mean"><small>What this means for you</small><p>${plain(c.meaning)}</p></div></div></div>${pfoot(c, i, n)}`);
}
function pageEbru(c, i, n) {
  const items = [['The logo system', 'Stacked lockup, horizontal lockup for the car, symbol on its own. Dark green, sage and terracotta, Cormorant Garamond and Montserrat.'],
    ['The website', 'One page, mobile-first, warm instead of clinical. One scroll in the order the questions actually arrive.'],
    ['The car', 'The horizontal lockup travels on the vehicle graphics, so the brand arrives before she does.']]
    .map(([h, x], k) => `<li><b class="ci">${num(k + 1)}</b><span><strong>${h}.</strong> ${x}</span></li>`).join('');
  return detail(c, i, n, 'Brand from zero', 1, `<div class="d-l"><div class="d-label">Brand identity · web · freelance</div>
      <div class="d-pull ci" style="font-size:36px">${c.title}</div><div class="d-body">${c.lede}</div>
      <div class="d-mean" style="margin-top:26px"><small>What this means for you</small><p>${plain(c.meaning)}</p></div></div>
    <div class="d-r"><div class="d-label">Three parts</div><ol class="d-steps">${items}</ol></div>`);
}
function pageAlso(i, n) {
  const c = { id: 'also', title: 'Basteln', nav: 'Basteln' };
  const ph = [['work/basteln/web/mi4l-coasters.jpg', 'Mini vinyl coasters', 'Music is for Lovers'], ['work/basteln/web/sl-vinyl-turntable-ccw.jpg', 'Custom vinyl for Vol. 3', 'Studio Liebe'],
    ['work/basteln/web/sl-slots.jpg', 'Slot machine keychains', 'Studio Liebe'], ['work/basteln/web/nrg-batteries.jpg', 'Print campaign for promo shoot', 'NRG'],
    ['work/basteln/web/nrg-chips.jpg', 'Packaging with event infos', 'NRG'], ['work/basteln/web/sl-magazine-front.jpg', 'Magazine with event infos', 'Studio Liebe']]
    .map(([src, t, b]) => `<figure><img src="${abs(src)}" alt=""><figcaption><b>${t}</b><span>${b}</span></figcaption></figure>`).join('');
  const tile = (img, label, title, text) => `<div class="al-t">${img ? `<img src="${abs(img)}" alt="">` : ''}<div><small>${label}</small><h3 class="ci">${title}</h3><p>${text}</p></div></div>`;
  return detail(c, i, n, 'Basteln', 1, `<div class="al-l"><div class="d-label">Handmade for friends &amp; brands</div><h2 class="d-h2 ci" style="margin-bottom:6px">Basteln.</h2>
      <p class="al-sub">German for making things by hand.</p><p class="al-intro">Stickers I plotted, sleeves I printed, products I relabelled. Small objects that carry a brand home.</p><div class="al-ph">${ph}</div></div>
    <div class="al-r">${tile('', 'Dashboard · This portfolio', 'Built for myself', 'When a tool is missing, I build it, with AI as my co-pilot.')}
      ${tile('work/trax/media/trax-profile.svg', 'In progress', 'Now building: trax', 'A new house music series, built from scratch: identity, website, merchandise.')}</div>`, 'd-dc al-wrap');
}

/* ═══ assemble ═══ */
async function build(cases, version) {
  if (version === 'short') return buildShort(cases);
  const pages = [{ label: 'Cover', html: pageCover(version) }, { label: 'Contents', html: '' }];
  const starts = [];
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i], n = cases.length + 1, nm = c.nav || c.title;
    starts.push(pages.length);
    pages.push({ label: c.title, html: c.id === 'jco' ? pageJcoTitle(c, i, n) : c.customHTML ? heroCustom(c, i, n) : heroGeneric(c, i, n), c });
    pages.push({ label: nm + ' · Challenge', html: pageChallenge(c, i, n, true), c });
    if (c.decisions) pages.push({ label: nm + ' · Key decisions', html: pageDecisions(c, i, n), c });
    let k = 3;
    if (c.id === 'mi4l') pages.push({ label: nm + ' · The family', html: pageFamily(c, i, n), c }), k++;
    if (c.highlight) pages.push({ label: nm + ' · ' + c.highlight.title, html: pageHighlight(c, i, n, k++), c });
    pagesWork(c, i, n, k).forEach(h => { pages.push({ label: nm + ' · The work', html: h, c }); k++; });
    if (c.outcome || c.stats || c.meaning) pages.push({ label: nm + ' · Outcome', html: pageOutcome(c, i, n, k), c });
  }
  const basteln = pages.length;
  pages.push({ label: 'Basteln', html: pageAlso(cases.length, cases.length + 1) });
  pages.push({ label: 'Contact', html: pageEnd(version) });
  pages[1].html = pageContents(cases.map((c, i) => ({ title: c.title, kicker: c.kicker, logo: c.logo && !/\.svg$/.test(c.logo) ? c.logo : '', color: theme(c.id).sky, meta: STATUS[c.status] || period(c), page: starts[i] + 1 })).concat([{ title: 'Basteln', kicker: 'Handmade · Built for myself · trax', logo: '', color: '#2E7DD1', meta: '', page: basteln + 1 }]), pages.length, `${cases.length} case studies`);
  pages.forEach((p, k) => { p.i = k; p.kind = 'page'; });
  return pages;
}
function buildShort(cases) {
  const C = id => cases.find(c => c.id === id), N = 15;
  const pg = { jco: 5, mi4l: 7, sl: 9, nrg: 11, ebru: 13, also: 14 };
  const jco = C('jco'), mi = C('mi4l'), sl = C('studio-liebe'), nrg = C('nrg'), eb = C('ebru');
  const pages = [
    { label: 'Cover', html: pageCover('short') },
    { label: 'About', html: pageAbout() },
    { label: 'What I do for your brand', html: pageWhat(pg) },
    { label: 'Contents', html: '' },
    { label: 'JCO Hamburg', html: pageBento(jco, 4, N, { tweak: tweakJco, cls: 'p-jco1' }), c: jco },
    { label: 'JCO · Story', html: pageStory(jco, 5, N), c: jco },
    { label: 'Music is for Lovers', html: pageBento(mi, 6, N, { mark: 'MI4L Family · 1/3', tweak: tweakMi4l, cls: 'p-mi4l1' }), c: mi },
    { label: 'Music is for Lovers · Story', html: pageStory(mi, 7, N, 'MI4L Family · 1/3'), c: mi },
    { label: 'Studio Liebe', html: pageBento(sl, 8, N, { mark: 'MI4L Family · 2/3' }), c: sl },
    { label: 'Studio Liebe · Story', html: pageStory(sl, 9, N, 'MI4L Family · 2/3'), c: sl },
    { label: 'NRG', html: pageBento(nrg, 10, N, { mark: 'MI4L Family · 3/3', tweak: tweakNrg }), c: nrg },
    { label: 'NRG · Story', html: pageStory(nrg, 11, N, 'MI4L Family · 3/3'), c: nrg },
    { label: 'Physiotherapie mit Herz', html: pageBento(eb, 12, N, { tweak: tweakEbru, cls: 'p-ebru1' }), c: eb },
    { label: 'Basteln', html: pageAlso(13, N) },
    { label: 'Contact', html: pageEnd('short') }
  ];
  const row = (c, page, meta) => ({ title: c.title, kicker: c.id === 'studio-liebe' ? 'Brand Application · Curated by Music is for Lovers' : c.kicker, logo: c.id === 'ebru' ? 'work/mobilephysiomitherz/ebru-signet-icon.svg' : c.logo && !/\.svg$/.test(c.logo) ? c.logo : '', color: theme(c.id).sky, meta: meta || STATUS[c.status] || period(c), page });
  pages[3].html = pageContents([row(jco, pg.jco), row(mi, pg.mi4l, '2022–2026'), row(sl, pg.sl, '2023–2026'), row(nrg, pg.nrg), row(eb, pg.ebru),
    { title: 'Basteln', kicker: 'Handmade · Built for myself · trax', logo: '', color: '#2E7DD1', meta: '', page: pg.also }], N, '5 case studies');
  pages.forEach((p, k) => { p.i = k; p.kind = 'page'; });
  return pages;
}
return { build, PW, PH };
})();
