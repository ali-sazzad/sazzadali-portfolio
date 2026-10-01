export const EMAIL = "find.sazzadali@gmail.com"

export const socials = {
  linkedin: "https://www.linkedin.com/in/sazzadali/",
  github: "https://github.com/ali-sazzad",
  email: `mailto:${EMAIL}`,
}

export const navItems = ["About", "Projects", "Skills", "Contact"] as const

export const roles = ["Web Developer", "UI Designer", "Programmer", "AI Enthusiast"]

export type Project = {
  title: string
  description: string
  image?: string
  tags: string[]
  link?: string
  github?: string
  comingSoon?: boolean
}

export const projects: Project[] = [
  {
    title: "Hotel Hera Lodge Website",
    description:
      "A beautifully designed, user-friendly website for Hotel Hera Lodge — from logo and banner design through to the finished site.",
    image: "/hhl.png",
    tags: ["Vite", "Tailwind CSS", "TypeScript", "UI/UX Design"],
    link: "https://www.hotelheralodge.com",
  },
  {
    title: "Personal Portfolio",
    description:
      "This site. A cinematic, GSAP-driven portfolio built with Next.js — smooth scrolling, split-text reveals, pinned horizontal scroll and more.",
    image: "/personal-portfolio.png",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "GSAP"],
    link: "https://sazzadali-portfolio.vercel.app/",
    github: "https://github.com/ali-sazzad/sazzadali-portfolio",
  },
  {
    title: "Brainwave with React on Vite",
    description:
      "A sleek, high-performance single-page web app built with React on Vite, engineered for speed and a seamless user experience.",
    image: "/brainwave-reactvite.png",
    tags: ["React", "Vite", "Tailwind CSS", "TypeScript"],
    link: "https://brainwave-reactvite.vercel.app/",
    github: "https://github.com/ali-sazzad/brainwave-reactvite",
  },
  {
    title: "Modern UI GPT-3 Frontend",
    description:
      "A responsive frontend inspired by GPT-3, designed with modern UI/UX principles for performance, aesthetics and seamless interaction.",
    image: "/desktop-1.png",
    tags: ["Next.js", "Tailwind CSS", "GSAP"],
    link: "https://modern-ui-ux-gpt3-frontend-website.vercel.app/",
    github: "https://github.com/ali-sazzad/modern_ui-ux_gpt3_frontend_website",
  },
  {
    title: "To-do List Web App",
    description:
      "A simple yet efficient to-do list built with HTML, CSS and JavaScript. Stay organised with an intuitive, responsive design.",
    image: "/to-do-list.png",
    tags: ["HTML5", "CSS3", "JavaScript"],
    link: "https://simple-to-do-list-web-app-gamma.vercel.app/",
    github: "https://github.com/ali-sazzad/simple-to-do-list-web-app",
  },
  {
    title: "Bupa Email Template",
    description:
      "A desktop HTML/CSS email template for Bupa, informing members about tapping with iPhone or Apple Watch for Bupa services.",
    image: "/bupa-email-template1.png",
    tags: ["HTML5", "CSS3", "Email Template"],
    link: "https://bupa-email-template1.vercel.app/",
    github: "https://github.com/ali-sazzad/bupa-email-template1",
  },
  {
    title: "Basic Snake Game",
    description:
      "The classic Snake game in HTML, CSS and JavaScript — eat, grow, and don't hit the walls or yourself. Tracks your high score.",
    image: "/basic-snake-game.png",
    tags: ["JavaScript", "Game", "Fun"],
    link: "https://basic-snake-game-two.vercel.app/",
    github: "https://github.com/ali-sazzad/basic-snake-game",
  },
  {
    title: "Coming Soon",
    description: "An exciting new project in development. Stay tuned!",
    tags: ["In Progress"],
    comingSoon: true,
  },
]

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
