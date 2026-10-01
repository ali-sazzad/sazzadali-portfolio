# Design system — Sazzad Ali portfolio (redesign)

## Product context
- **Who**: Sazzad Ali — software engineer, web developer and UI designer based in Sydney, Australia. Motto: "One line of code at a time."
- **Audience**: recruiters, hiring managers and small-business clients, mostly skimming on desktop and phone.
- **Jobs to be done** (in priority order):
  1. In 5 seconds: understand who he is, what he does, and where (name, role, Sydney).
  2. See real work quickly: project screenshots, what each is, open the case study / live site / source.
  3. Check the toolkit (stack).
  4. Get in touch: email (primary), LinkedIn, GitHub, preview CV.
- **Pages**: `/` single-page portfolio (Hero, About, Work, Toolkit, Contact, Footer) and `/work/<slug>` case studies.

## What the redesign must fix (user feedback on the current version)
The current site reads as **vague**: too faint / low contrast, too empty / sparse, unclear hierarchy, not enough personality. Therefore:
- **Solid surfaces, strong contrast.** Body text ≥ 4.5:1, large text ≥ 3:1 (WCAG AA). No hairline-only, transparent containers for content. No muted-grey-on-grey.
- **Density with purpose.** No sections that are mostly empty. Every block carries real content (below). Generous but not vast spacing.
- **Obvious hierarchy.** One primary action per view ("Email me" / "Get in touch"), visually dominant. Section titles large and unmistakable. Project screenshots big.
- **Personality from real things**: his name as a bold typographic statement, Sydney (live local time, place), the motto, real project screenshots, real stack logos. No stock photos, no invented stats, testimonials or client logos.

## Real content inventory (use only this; do not invent)
- Name: Sazzad Ali. Roles (rotate/typed): Web Developer, UI Designer, Programmer, AI Enthusiast. Line: "from Sydney, Australia". Motto: "One line of code at a time."
- About: "Software engineer and web developer with a passion for building elegant, high-performance digital experiences. With a strong foundation in software engineering, AI integration, UI/UX design and project management, I bring both creativity and precision to every project." Pillars: Design (intuitive interfaces and design systems), Develop (full-stack web apps with React, Next.js and Node), Deliver (scalable, accessible products shipped with care).
- Projects (title — type — stack — year): Hotel Hera Lodge Website — client website (logo, banner and site for a Kathmandu hotel) — Vite, Tailwind CSS, TypeScript; Personal Portfolio — this site — Next.js, TypeScript, Tailwind CSS, GSAP — 2024; Brainwave with React on Vite — front-end project — React, Vite, JavaScript, CSS — 2024; Modern UI GPT-3 Frontend — learning project — React, CSS3, HTML5 — 2024; To-do List Web App — HTML5, CSS3, JavaScript — 2023; Bupa Email Template — HTML email (educational) — HTML5, CSS3 — 2024; Basic Snake Game — JavaScript game — 2024; plus one "Next project in progress" placeholder. Each project opens a case study; most also link to a live site and GitHub source.
- Toolkit groups: Frontend (React, Next.js, Tailwind, GSAP, TypeScript), Backend (Node.js, Express, Firebase, Supabase), Dev Tools (Git, VS Code, Vercel, Figma, Android Studio), App Development (Kotlin with Compose, Java), Soft Skills (Problem Solving, Collaboration, Adaptability, Creativity, Fast Learner).
- Contact: find.sazzadali@gmail.com, LinkedIn (linkedin.com/in/sazzadali), GitHub (github.com/ali-sazzad), CV (PDF). Copy: "Looking for someone who can design, develop and deliver? I'm always open to collaborating on projects that push boundaries and make an impact."
- Nav: About, Projects, Skills, Contact + theme toggle (dark/light) + primary CTA. Live "Sydney hh:mm" clock is welcome.

## Typography (fixed for both directions)
- Display: **Bricolage Grotesque** (variable; weights 600–800; can use condensed width `font-variation-settings: "wdth" 75–85` for big type). Tight tracking (−0.03 to −0.05em), leading 0.9–1.0 for display.
- Text/UI: **Geist** (400–600). Body 16–18px, line-height 1.5–1.6.
- No other typefaces. Monospace only if needed for tiny data (Geist Mono).

## Shape, spacing, motion (both directions)
- 8px spacing base. Container max ~1200px; page gutters 16px mobile / 40px desktop.
- Radii: choose ONE family per direction and apply consistently by hierarchy (large tiles > cards > chips).
- Motion: purposeful only — one strong page-load moment, hover/press feedback, scroll-driven reveals sparingly. Must work with reduced motion.
- Responsive: designs must work at 390px wide as well as desktop.
- Dark mode is the default; a light theme must also exist (tokens below give both).

## Candidate visual directions (each variation uses exactly ONE of these, never a mix)

### Direction A — "Harbour Bento" (dense, colourful, personal)
- Layout: hero and content as a **bento grid** of solid tiles of different sizes; tile size = importance. Hero tile (biggest): name + typed role + "from Sydney, Australia" + Email me / Preview CV. Smaller tiles: live Sydney time & location, motto, availability/contact, featured project screenshots, stack logos, socials. Work section = large screenshot tiles. Mobile: tiles stack in priority order.
- Palette (Sydney-inspired; solid fills, no gradients-as-decoration):
  - Dark: page `#0B1220` (harbour night), tile `#131C2E`, tile-alt `#1B2740`, text `#F4F1EA`, muted `#A9B2C3`, accent **jacaranda `#8B6CF0`**, accent-2 **sandstone `#E2B26A`**, accent-3 **harbour teal `#2BB3A6`**.
  - Light: page `#F4F1EA`, tile `#FFFFFF`, tile-alt `#EAE4D8`, text `#0B1220`, muted `#4A5568`, accents jacaranda `#6B4FD8`, sandstone `#B8862F`, teal `#138A80`.
  - Accents are used as **solid tile fills** for 2–3 key tiles (e.g. jacaranda CTA tile, sandstone motto tile) with dark/light text meeting AA.
- Radius: tiles 24px, cards 16px, chips/buttons 999px.

### Direction B — "High-contrast editorial" (bold typographic, Swiss)
- Layout: massive typographic hero — "SAZZAD ALI" at ~12vw with an **echo stack** (4 offset background copies fading in tone) — typed role and "from Sydney, Australia" beneath, one dominant CTA. Narrative About as a large statement with a 3-column pillar grid. Work as an **asymmetric 12-column showcase** of big screenshots (mixed 8/4/7/5 spans) with clear title / type / year rows. Toolkit as a tight logo grid. Dark, high-contrast footer with contact.
- Palette: near-monochrome + ONE vivid accent:
  - Light: page `#F2F2F2`, surface `#FFFFFF`, text `#111111`, secondary `#4D4D4D`, rules `#111111` at 12%, echo greys `#BFBFBF → #D9D9D9`, accent **signal blue `#2F5BFF`**.
  - Dark: page `#0E0E0E`, surface `#171717`, text `#F2F2F2`, secondary `#B3B3B3`, echo greys `#3A3A3A → #262626`, accent `#5B7CFF`.
- Radius: mostly sharp (2–4px) with deliberate exceptions (a pill image, a circular image) for rhythm. Borders ≤1px.
