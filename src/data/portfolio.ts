export const EMAIL = "find.sazzadali@gmail.com"

export const socials = {
  linkedin: "https://www.linkedin.com/in/sazzadali/",
  github: "https://github.com/ali-sazzad",
  email: `mailto:${EMAIL}`,
}

export const navItems = ["About", "Projects", "Skills", "Contact"] as const

export const roles = ["Web Developer", "UI Designer", "Programmer", "AI Enthusiast"]

/**
 * Case-study copy is sourced only from each project's own README, repository and
 * screenshot (or, for this site, the code itself) — no invented metrics or quotes.
 */
export type CaseStudy = {
  /** What kind of work it was. */
  type: string
  role: string
  /** Year the work started (from the repository's creation date where there is one). */
  year?: string
  overview: string[]
  built: string[]
  /** Context a reader should know, e.g. credits or asset disclaimers. */
  note?: string
}

export type Project = {
  slug: string
  title: string
  description: string
  image?: string
  /** Intrinsic pixel size of `image` (width, height). */
  imageSize?: [number, number]
  tags: string[]
  link?: string
  github?: string
  comingSoon?: boolean
  caseStudy?: CaseStudy
}

export const projects: Project[] = [
  {
    slug: "hotel-hera-lodge",
    title: "Hotel Hera Lodge Website",
    description:
      "A beautifully designed, user-friendly website for Hotel Hera Lodge — from logo and banner design through to the finished site.",
    image: "/hhl.png",
    imageSize: [1316, 916],
    tags: ["Vite", "Tailwind CSS", "TypeScript", "UI/UX Design"],
    link: "https://www.hotelheralodge.com",
    caseStudy: {
      type: "Client website",
      role: "Brand design, UI/UX design and front-end development",
      overview: [
        "Hotel Hera Lodge is a hotel in Kathmandu. The work covered the lodge's whole presence online, starting with its identity: I designed the logo and banner, then designed and built the website itself.",
        "The home page welcomes guests and sets out what the lodge offers: comfortable lodging, dining and travel assistance, with the building itself shown front and centre.",
      ],
      built: [
        "Logo and banner design for the lodge",
        "Site structure with Home, Rooms, Dining and Services sections",
        "A welcoming home page introducing the lodge, its hospitality and its services",
        "Front end built with Vite, Tailwind CSS and TypeScript",
      ],
    },
  },
  {
    slug: "personal-portfolio",
    title: "Personal Portfolio",
    description:
      "This site. A bento-style portfolio built with Next.js and GSAP: solid tiles, live Sydney time, a typed role and a case study for every project.",
    image: "/personal-portfolio.png",
    imageSize: [1440, 900],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    link: "https://sazzadali-portfolio.vercel.app/",
    github: "https://github.com/ali-sazzad/sazzadali-portfolio",
    caseStudy: {
      type: "Personal site",
      role: "Design and development",
      year: "2024",
      overview: [
        "My portfolio, redesigned for clarity: a bento hero of solid tiles, a Sydney-inspired palette (harbour navy, jacaranda, sandstone), big project screenshots and a case study for each project.",
        "It's built with Next.js and animated entirely with GSAP. The same code ships to Vercel as a full Next.js app and to GitHub Pages as a static export.",
      ],
      built: [
        "A bento hero: my name, a role typed by a collaborator cursor, live Sydney time and a featured project",
        "An asymmetric project showcase where every project opens its own case study",
        "WCAG AA colour contrast in both dark and light themes",
        "Dark and light themes with a circular reveal, saved per device with no flash on load",
        "Reduced-motion support throughout",
        "One codebase deploying to both Vercel and GitHub Pages",
      ],
    },
  },
  {
    slug: "brainwave",
    title: "Brainwave with React on Vite",
    description:
      "A sleek, high-performance single-page web app built with React on Vite, engineered for speed and a seamless user experience.",
    image: "/brainwave-reactvite.png",
    imageSize: [1898, 946],
    tags: ["React", "Vite", "JavaScript", "CSS"],
    link: "https://brainwave-reactvite.vercel.app/",
    github: "https://github.com/ali-sazzad/brainwave-reactvite",
    caseStudy: {
      type: "Front-end project",
      role: "Front-end development",
      year: "2024",
      overview: [
        "Brainwave is a responsive single-page application for an AI chat product, built with React and Vite.",
        "The focus was on solid front-end fundamentals: a clean component architecture, mobile-first layouts and a fast development build.",
      ],
      built: [
        "Responsive, mobile-first layout that works across devices",
        "Reusable React components, using props and component state",
        "A clean, modern UI with smooth interactivity",
        "Vite for a fast build and dev server",
      ],
    },
  },
  {
    slug: "gpt3-frontend",
    title: "Modern UI GPT-3 Frontend",
    description:
      "A responsive frontend inspired by GPT-3, designed with modern UI/UX principles for performance, aesthetics and seamless interaction.",
    image: "/desktop-1.png",
    imageSize: [1901, 942],
    tags: ["React", "CSS3", "HTML5"],
    link: "https://modern-ui-ux-gpt3-frontend-website.vercel.app/",
    github: "https://github.com/ali-sazzad/modern_ui-ux_gpt3_frontend_website",
    caseStudy: {
      type: "Learning project",
      role: "Front-end development",
      year: "2024",
      overview: [
        "A modern one-page website about GPT-3, built with React, HTML and CSS over the course of one week.",
        "The layout follows contemporary UI/UX principles, aiming for a clean, minimal and intuitive experience on both mobile and desktop.",
      ],
      built: [
        "Responsive design that adapts to mobile and desktop screens",
        "Reusable React components (navbar, articles) and page containers (header, footer)",
        "A clean, minimal visual style",
      ],
      note: "Built while following JavaScript Mastery's project tutorial.",
    },
  },
  {
    slug: "to-do-list",
    title: "To-do List Web App",
    description:
      "A simple yet efficient to-do list built with HTML, CSS and JavaScript. Stay organised with an intuitive, responsive design.",
    image: "/to-do-list.png",
    imageSize: [729, 722],
    tags: ["HTML5", "CSS3", "JavaScript"],
    link: "https://simple-to-do-list-web-app-gamma.vercel.app/",
    github: "https://github.com/ali-sazzad/simple-to-do-list-web-app",
    caseStudy: {
      type: "Personal project",
      role: "Design and development",
      year: "2023",
      overview: [
        "A minimal to-do list with a date display, written in plain HTML, CSS and JavaScript with no frameworks.",
        "It keeps to the essentials: add a task, mark it done, remove it.",
      ],
      built: [
        "Add tasks from an input field",
        "Click a task to mark it as completed",
        "Hover a task and remove it with ×",
        "Date display at the top of the list",
      ],
      note: "Planned next: editing tasks, drag-and-drop reordering and saving tasks locally.",
    },
  },
  {
    slug: "bupa-email-template",
    title: "Bupa Email Template",
    description:
      "A desktop HTML/CSS email template for Bupa, informing members about tapping with iPhone or Apple Watch for Bupa services.",
    image: "/bupa-email-template1.png",
    imageSize: [695, 923],
    tags: ["HTML5", "CSS3", "Email Template"],
    link: "https://bupa-email-template1.vercel.app/",
    github: "https://github.com/ali-sazzad/bupa-email-template1",
    caseStudy: {
      type: "Email template study",
      role: "HTML email development",
      year: "2024",
      overview: [
        "An HTML and CSS email template for desktop, telling members they can tap with iPhone or Apple Watch for Bupa services.",
        "Email clients support far less HTML and CSS than browsers, so the template is built to hold together in that constrained environment.",
      ],
      built: [
        "Desktop email layout in HTML and CSS",
        "Responsive for desktop and laptop screens",
        "Links to the relevant Bupa services and resources",
      ],
      note: "Bupa's logo, images and links are used for educational and demonstration purposes only; this is not a production Bupa campaign.",
    },
  },
  {
    slug: "snake-game",
    title: "Basic Snake Game",
    description:
      "The classic Snake game in HTML, CSS and JavaScript — eat, grow, and don't hit the walls or yourself. Tracks your high score.",
    image: "/basic-snake-game.png",
    imageSize: [616, 384],
    tags: ["JavaScript", "Game", "Fun"],
    link: "https://basic-snake-game-two.vercel.app/",
    github: "https://github.com/ali-sazzad/basic-snake-game",
    caseStudy: {
      type: "Game",
      role: "Development",
      year: "2024",
      overview: [
        "The classic Snake game, built with HTML, CSS and JavaScript.",
        "Steer with the arrow keys, eat the food to grow longer, and avoid the walls and your own tail. There's no time limit, just your score.",
      ],
      built: [
        "Arrow-key controls",
        "Growing snake with wall and self collision",
        "Score tracking",
        "Game-over screen with restart",
        "Responsive layout for different screen sizes",
      ],
    },
  },
  {
    slug: "coming-soon",
    title: "Coming Soon",
    description: "An exciting new project in development. Stay tuned!",
    tags: ["In Progress"],
    comingSoon: true,
  },
]

/** Projects that have a case-study page. */
export const caseStudies = projects.filter((p) => p.caseStudy)

export const skillClusters = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind", "GSAP", "TypeScript"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "Firebase", "Supabase"],
  },
  {
    title: "Dev Tools",
    items: ["Git", "VS Code", "Vercel", "Figma", "Android Studio"],
  },
  {
    title: "App Development",
    items: ["Kotlin with Compose", "Java"],
  },
  {
    title: "Soft Skills",
    items: ["Problem Solving", "Collaboration", "Adaptability", "Creativity", "Fast Learner"],
  },
]

/** Devicon slugs used by the floating background and the tech marquee. */
export const techIcons: { slug: string; name: string; variant?: string }[] = [
  { slug: "html5", name: "HTML5" },
  { slug: "css3", name: "CSS3" },
  { slug: "javascript", name: "JavaScript" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "react", name: "React" },
  { slug: "nextjs", name: "Next.js" },
  { slug: "tailwindcss", name: "Tailwind" },
  { slug: "nodejs", name: "Node.js" },
  { slug: "express", name: "Express" },
  { slug: "firebase", name: "Firebase" },
  { slug: "supabase", name: "Supabase" },
  { slug: "python", name: "Python" },
  { slug: "java", name: "Java" },
  { slug: "kotlin", name: "Kotlin" },
  { slug: "php", name: "PHP" },
  { slug: "mongodb", name: "MongoDB" },
  { slug: "postgresql", name: "PostgreSQL" },
  { slug: "mysql", name: "MySQL" },
  { slug: "graphql", name: "GraphQL", variant: "plain" },
  { slug: "figma", name: "Figma" },
  { slug: "git", name: "Git" },
  { slug: "vscode", name: "VS Code" },
  { slug: "androidstudio", name: "Android Studio" },
  { slug: "vercel", name: "Vercel" },
]

export const deviconUrl = (slug: string, variant = "original") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}/${slug}-${variant}.svg`

/** Devicon slug for each skill that has a logo; the rest render as a component glyph. */
export const skillIcons: Record<string, { slug: string; invert?: boolean }> = {
  React: { slug: "react" },
  "Next.js": { slug: "nextjs", invert: true },
  Tailwind: { slug: "tailwindcss" },
  TypeScript: { slug: "typescript" },
  "Node.js": { slug: "nodejs" },
  Express: { slug: "express", invert: true },
  Firebase: { slug: "firebase" },
  Supabase: { slug: "supabase" },
  Git: { slug: "git" },
  "VS Code": { slug: "vscode" },
  Vercel: { slug: "vercel", invert: true },
  Figma: { slug: "figma" },
  "Android Studio": { slug: "androidstudio" },
  "Kotlin with Compose": { slug: "jetpackcompose" },
  Java: { slug: "java" },
}
