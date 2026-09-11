// Full case-study content — served only to authenticated requests via
// /api/cases.js. Never shipped to the client until the password is
// verified server-side.
module.exports = [
{
  id:'dashboard', group:'Product', icon:'grid', nav:'Dashboard',
  kicker:'Product Thinking · Self-Initiated',
  title:'Workflow Dashboard',
  lede:'A self-built tool that keeps applications, projects, documents and next steps in one place — designed around how I actually work, not how a tool wanted me to.',
  tags:['Product Thinking','Information Architecture','Workflow Design','Self-Initiated'],
  facts:[
    ['Role','Designer &amp; Builder — solo'],
    ['Timeframe','2026'],
    ['Type','Self-initiated product'],
    ['Stack','Next.js · built with Claude Code']
  ],
  challenge:{
    pull:'Applications, notes, documents and project information were spread across too many tools.',
    body:'<p>Every job application meant touching four different places: a note app for the research, a folder for the CV version, a calendar for the follow-up, a spreadsheet to remember what I had already sent. Nothing talked to each other, and the overview only existed in my head.</p><p>The obvious move was to adopt yet another tool. I tried that first — and kept bending my process to fit someone else\'s model of it. <strong>So I stopped adapting and started building.</strong></p>'
  },
  approach:[
    'Identified the recurring workflow problems — too many tools, no overview, constant context-switching',
    'Structured information into clear categories before writing a single line of code',
    'Built a working prototype fast — the goal was something real and usable, not perfect',
    'Improved the system through daily use — every change came from where it actually broke down'
  ],
  decisions:[
    { tag:'Structure', title:'Information architecture before interface',
      why:'I mapped the entities — projects, contacts, documents, next steps — and how they relate, <b>before</b> designing a single screen. It meant the first prototype already had the right shape instead of a pretty surface over a messy model.' },
    { tag:'Interaction', title:'Cards as overview, detail panel on demand',
      why:'The daily job is scanning, not reading. Cards carry just enough to decide what needs attention; the full record slides in only when you ask for it. <b>The overview never gets sacrificed to detail.</b>' },
    { tag:'Scope', title:'Built for one user — me — on purpose',
      why:'No settings, no roles, no edge cases for people who don\'t exist. Designing for a single real user let me make sharp, opinionated choices and ship something I use every day, rather than a generic tool nobody needs.' }
  ],
  demo:{ src:'work/dashboard/demo.html', url:'vivien.studio — dashboard', title:'Workflow Dashboard demo', cap:'A demo version of the Freelance space — showing how I track client projects and todos. Click any card to expand its task list.' },
  outcomeTodo:'<b>This is the section that will convince a hiring manager — and it is the one thing I can\'t write for you.</b> Tell me: How long did a single application take before, and after? How many applications does it hold now? What did you stop doing entirely once it existed? Even rough honest numbers ("about half the time", "40 applications tracked") are far stronger than no numbers.',
  reflection:'<p>Building it taught me the difference between designing a screen and designing a system. The screens were the easy part — the hard part was deciding what the thing should <strong>not</strong> do.</p><p>If I rebuilt it, I would start with the data model on paper even earlier. Two of my later reworks were only necessary because I had guessed at a relationship instead of writing it down first.</p>'
},
{
  id:'ebru', group:'Product', icon:'health', nav:'Ebru Physio',
  kicker:'Web Design · Brand · Freelance',
  title:'Physiotherapie mit Herz',
  lede:'A warm, mobile-first one-pager for a mobile physiotherapy practice in Hamburg — built so a first-time visitor can understand the service and get in touch without thinking.',
  tags:['Web Design','UX/UI','Local Business','Responsive Design'],
  facts:[
    ['Role','Design &amp; Build — solo'],
    ['Client','Mobile physiotherapy practice, Hamburg'],
    ['Timeframe','2026'],
    ['Type','Freelance']
  ],
  challenge:{
    pull:'A physiotherapist who comes to your home sells trust before she sells a service.',
    body:'<p>This is a practice without a waiting room. The therapist travels to the patient — often older, often in pain, often booking on a phone. The website is the entire first impression, and it has to do the job a reception desk normally does: explain the service, feel personal, and make contact effortless.</p><p>The brief was "simple and warm". The real challenge was that <strong>simple and warm still has to answer every question a nervous first-time patient has</strong> — what happens, who comes, what it costs, how to book.</p>'
  },
  approach:[
    'Clarified who actually visits the site — mostly older patients, mostly on mobile, mostly in discomfort',
    'Cut the structure down to a single scrollable page so nothing important hides behind navigation',
    'Designed for the thumb first, then scaled up to desktop rather than the other way around',
    'Kept contact reachable from anywhere on the page, not parked at the bottom'
  ],
  decisions:[
    { tag:'Structure', title:'One page, no navigation',
      why:'A multi-page site would have meant asking an anxious first-time visitor to guess where the answer lives. One scroll, in the order the questions actually arrive. <b>Nothing to get lost in.</b>' },
    { tag:'Tone', title:'Warm and personal over clinical',
      why:'This is a person coming into your home, not a clinic you visit. The language, imagery and spacing had to feel like <b>her</b>, not like a medical institution — that warmth is the actual product differentiator.' },
    { tag:'Priority', title:'Mobile-first, genuinely',
      why:'Not "responsive as an afterthought" — the mobile layout was designed first and the desktop version derived from it, because that is the order the traffic actually arrives in.' }
  ],
  outcomeTodo:'<b>I need your input here.</b> Did enquiries change after launch? Is the client happy — any quote you could use? Roughly how many visitors, and how many come from mobile? Even one sentence from the client is worth more than a paragraph I could write.',
  reflection:'<p>The hardest part was restraint. Every instinct as a designer says add a section, add a detail, add a flourish — and every one of those would have made the page harder for the person it was actually built for.</p>',
  mediaTodo:'<b>The visuals for this case are missing.</b> The old page embedded the live site from <code>ebru-aydin.vercel.app</code>, which now returns 404 — so this case currently has nothing to show. Send me screenshots (desktop + mobile, ideally full-page) and I\'ll build the visual section properly.'
},
{
  id:'mi4l', group:'Brand &amp; Culture', icon:'music', nav:'MI4L',
  kicker:'Brand Development · Co-Founded',
  title:'Music is for Lovers',
  lede:'More than an event series — a brand people wanted to belong to. Co-founded in 2022, built from nothing, and still running. Creative Lead since 2024.',
  tags:['Brand Development','Visual Systems','Event Design','Community Building'],
  facts:[
    ['Role','Co-Founder → Creative Lead'],
    ['Timeframe','Dec 2022 — today'],
    ['Scope','Identity, campaigns, on-site presence'],
    ['Context','Electronic music · Hamburg']
  ],
  challenge:{
    pull:'How do you grow a friends\' side-project into a brand with its own identity — and stay hands-on at every step?',
    body:'<p>There was no brief, no agency and no budget. What existed was a group of friends who wanted to throw a party, and a name. Everything else — the look, the voice, the reason anyone would come back a second time — had to be invented and then <strong>survive fifteen-plus real events across three years</strong> without turning into a different brand each time.</p>'
  },
  approach:[
    'Built from scratch — no brief, no agency, no budget. Defined the visual direction together with the founders',
    'Developed a visual system that works across poster, digital, merch and on-site — not just for one event',
    'Applied and refined the system across 15+ real events over three years',
    'Adapted the identity as the event grew — without losing what made it recognisable from the start'
  ],
  decisions:[
    { tag:'System', title:'A system, not a poster',
      why:'The first instinct is to design each event fresh. I built rules instead — type, colour logic, layout grid — so any of us could produce an on-brand asset at short notice. <b>Consistency is what turned a party into a brand people recognised.</b>' },
    { tag:'Range', title:'Designed for the worst-case surface first',
      why:'A poster on a wet Hamburg wall and a 1080×1920 story are very different problems. Designing for the hardest surface first meant the system degraded gracefully everywhere else.' },
    { tag:'Evolution', title:'Let it change — but slowly',
      why:'Three years is long enough that standing still looks stale. Each new format shifted the visual world a little, while keeping the core signals intact, so regulars never had to re-learn what MI4L looks like.' }
  ],
  stats:[['15+','Events'],['3','Formats'],['400','Guests at peak'],['2024','Creative Lead since']],
  outcomeTodo:'<b>The numbers above come from your old site — please confirm they\'re still accurate.</b> And the strongest thing you could add: what happened to attendance or follower count over the three years? A "from X to Y" is the single most convincing sentence you can put on this page.',
  reflection:'<p>MI4L is where I learned that brand work is not decoration — it is the reason someone chooses to come back. I also learned it hands-on and under time pressure, which is a different skill from designing in a calm studio.</p>',
  media:[
    { type:'img', src:'work/mi4l/media/carousel-1.jpg', cap:'Campaign visual' },
    { type:'img', src:'work/mi4l/media/feed-1.png', cap:'Social feed asset' },
    { type:'img', src:'work/mi4l/media/feed-2.png', cap:'Social feed asset' },
    { type:'img', src:'work/mi4l/media/carousel-3.jpg', cap:'Campaign visual' }
  ]
},
{
  id:'studio-liebe', group:'Brand &amp; Culture', icon:'ticket', nav:'Studio Liebe &amp; NRG',
  kicker:'Visual Development · Sub-Formats of MI4L',
  title:'Studio Liebe &amp; NRG',
  lede:'Two formats, two identities, one coherent brand world — developed, applied and scaled across campaigns, print production and live events.',
  tags:['System Design','Brand Application','Print Production','Campaign Assets'],
  facts:[
    ['Role','Creative Lead — visual communication'],
    ['Timeframe','2024 — today'],
    ['Scope','Two sub-formats of MI4L'],
    ['Output','Poster · digital · print · on-site']
  ],
  challenge:{
    pull:'How do you keep two very different event formats visually distinct — while making them feel like part of one coherent brand world?',
    body:'<p>Studio Liebe is disco and house: warm, intimate, a little nostalgic. NRG is tech house: harder, darker, more intense. They speak to different crowds on different nights — but both sit under MI4L, and if they drifted too far apart the parent brand would stop meaning anything.</p><p><strong>Too similar and the formats become interchangeable. Too different and the brand world falls apart.</strong> The whole project lives in that tension.</p>'
  },
  approach:[
    'Was part of both brands from the start, growing into the creative lead role for visual communication over 2024',
    'Defined what makes each format distinct: Studio Liebe warm and intimate, NRG dark and technical',
    'Designed consistently across poster, digital and print — keeping both identities visually separate',
    'Scaled print production from concept to delivery, coordinating format, deadline and output'
  ],
  decisions:[
    { tag:'System', title:'Shared skeleton, different skin',
      why:'Both formats use the same underlying grid, hierarchy and information order. Only the atmosphere changes — colour, texture, type weight. <b>That is what lets them feel related without looking alike.</b>' },
    { tag:'Contrast', title:'Named the difference before designing it',
      why:'"Warm and intimate" vs "dark and technical" was written down and agreed first. Having language for the distinction made every later design decision quick to settle, and kept the two from slowly converging.' },
    { tag:'Production', title:'Owned the print chain end to end',
      why:'Concept through to delivery — format, bleed, deadline, printer. Designing without owning production is where most identity systems quietly fall apart between file and wall.' }
  ],
  outcomeTodo:'<b>Worth adding:</b> how many events did each format run? Did the split into two identities actually help — more reach, clearer audiences, easier production? And you mentioned an OMR afterparty on the old site — that\'s a name worth putting on this page if it\'s accurate.',
  reflection:'<p>This project is where the MI4L system got its real stress test. A system that only works for one brand is a template; one that can carry two opposing moods and still hold together is actually a system.</p>',
  media:[
    { type:'img', src:'work/studio-liebe-nrg/media/studio-liebe/studioliebe-header.jpg', cap:'Studio Liebe — warm, intimate, disco &amp; house' },
    { type:'img', src:'work/studio-liebe-nrg/media/nrg/nrg-header.jpg', cap:'NRG — darker, harder, tech house' },
    { type:'img', src:'work/studio-liebe-nrg/media/studio-liebe/03-DanielDittus.com-20240214-R0039408-web.jpg', cap:'Studio Liebe at Pallas World · Photo by Daniel Dittus' },
    { type:'img', src:'work/studio-liebe-nrg/media/nrg/feed-2.png', cap:'NRG campaign asset' }
  ]
},
{
  id:'jco', group:'Brand &amp; Culture', icon:'spark', nav:'JCO Hamburg',
  kicker:'Brand Communication · Cultural Institution',
  title:'Jewish Chamber Orchestra Hamburg',
  lede:'Culture doesn\'t need to be simplified to be understood — it needs to be translated. Ongoing brand communication for a Hamburg cultural institution.',
  tags:['Brand Communication','Content Strategy','Audience Thinking','Cultural Work'],
  facts:[
    ['Role','Brand communication — freelance'],
    ['Timeframe','2025 — today'],
    ['Scope','Digital &amp; print, season-long'],
    ['Context','Hamburg · Elbphilharmonie &amp; more']
  ],
  challenge:{
    pull:'The challenge wasn\'t making classical music simpler — it was making it feel approachable without losing the depth that makes it meaningful.',
    body:'<p>Cultural institutions face a real tension: reach a younger audience, but don\'t hollow out what you are. Most attempts pick a side — either the communication stays formal and nobody new arrives, or it gets flattened into something that no longer represents the work.</p><p>I came into an <strong>existing identity with an established voice</strong>, so this was never a redesign. It was translation.</p>'
  },
  approach:[
    'Studied the brand before producing anything — existing identity, tone of voice, audience expectations',
    'Translated classical music content into accessible communication without losing depth or credibility',
    'Applied the identity consistently across digital and print touchpoints throughout the season',
    'Maintained ongoing brand communication as the season developed — adapting without drifting'
  ],
  decisions:[
    { tag:'Restraint', title:'Worked inside the existing identity',
      why:'The brief invited fresh energy; the right answer was not a new look. Evolving an institution\'s presence from within earns trust — <b>and a cultural brand\'s credibility is built over decades and lost in one season.</b>' },
    { tag:'Voice', title:'Changed the framing, not the substance',
      why:'Rather than simplifying the music, I changed what we lead with — the story, the people, the reason it matters. Same depth, different door in.' },
    { tag:'Audience', title:'Treated audiences as participants, not consumers',
      why:'More recently this has meant exploring how people take part in culture rather than just attend it. That reframing changes what content is even worth making.' }
  ],
  outcomeTodo:'<b>Needed here:</b> anything measurable from the collaboration — reach or engagement before/after, ticket or newsletter movement, audience age shift. If numbers aren\'t available, a sentence from the client about what changed would carry this section.',
  reflection:'<p>This is the project that taught me the most about working <strong>within</strong> constraints instead of around them. Not every brand problem is solved by redesigning something — sometimes the skill is knowing what to leave alone.</p>',
  media:[
    { type:'img', src:'work/jco/media/JCOHH-at-Elphi-2025-Photos-3-by-SLS.jpg', cap:'JCO Hamburg at the Elbphilharmonie, 2025' },
    { type:'img', src:'work/jco/media/carousel-1.png', cap:'Digital communication asset' },
    { type:'img', src:'work/jco/media/feed-1.png', cap:'Social content' },
    { type:'img', src:'work/jco/media/feed-3.png', cap:'Social content' }
  ]
},
{
  id:'portfolio', group:'Personal', icon:'monitor', nav:'This Portfolio',
  kicker:'Design + Code · Self-Initiated',
  title:'This Portfolio',
  lede:'You\'re looking at it. Designed and built as a desktop you can actually use — because the way I present my work should demonstrate how I work.',
  tags:['Design Systems','Frontend','AI Workflow','Self-Initiated'],
  facts:[
    ['Role','Design &amp; Build — solo'],
    ['Timeframe','2026'],
    ['Stack','Hand-written HTML/CSS/JS'],
    ['Process','AI-assisted, not AI-generated']
  ],
  challenge:{
    pull:'A portfolio that only lists work says nothing about how the person thinks.',
    body:'<p>Most portfolios are a grid of images with captions. They prove you can make things look good; they don\'t show judgement, structure, or what you do when a problem is unclear — and they flatten someone with a broad, hands-on skillset into a single job title.</p><p><strong>So the portfolio itself had to be the argument</strong> — a real interface with real interaction decisions behind it, built rather than templated.</p>'
  },
  approach:[
    'Chose a desktop metaphor so the work could be explored, not just scrolled past',
    'Built a single design system — themes, glass surfaces, typography — used consistently everywhere',
    'Wrote every case study to the same narrative structure so they can be compared fairly',
    'Used AI as a working partner for build speed, while keeping every design decision my own'
  ],
  decisions:[
    { tag:'Concept', title:'A desktop, not a scroll',
      why:'Windows, a dock and a file system let a visitor choose their own path — a recruiter with two minutes and a design lead with twenty get different experiences from the same page. <b>The structure does the tailoring.</b>' },
    { tag:'System', title:'Four themes from one token set',
      why:'Every colour resolves through CSS custom properties, so Light, Lila, Aurora and Dark are four value sets, not four stylesheets. It is a small proof that I build systems rather than one-offs.' },
    { tag:'Honesty', title:'Case studies in one shared structure',
      why:'Same spine for every project — context, challenge, approach, decisions, outcome. Harder to write, because the gaps become visible. That is the point.' }
  ],
  reflection:'<p>Building this made me rewrite my own case studies three times. Committing to a structure exposed which projects I could actually explain and which I had only ever shown pictures of — which turned out to be the most useful thing about it.</p>'
}
];
