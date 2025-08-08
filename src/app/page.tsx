"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Github, Linkedin, Mail, ChevronDown, Download, Menu, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import Image from 'next/image';
import Link from "next/link";
import Tilt from 'react-parallax-tilt';

const skillClusters = [
  {
    title: "Frontend",
    color: "from-green-0 to-blue-800",
    items: ["React", "Next.js", "Tailwind", "Framer Motion", "TypeScript"],
  },
  {
    title: "Backend",
    color: "from-red-800 to-teal-0",
    items: ["Node.js", "Express", "Firebase", "Supabase"],
  },
  {
    title: "Dev Tools",
    color: "from-orange-0 to-yellow-800",
    items: ["Git", "VS Code", "Vercel", "Figma", "Android Studio"],
  },
  {
    title: "App Development",
    color: "from-green-800 to-red-0",
    items: ["Kotlin with Compose", "Java",]
  },
  {
    title: "Soft Skills",
    color: "from-purple-0 to-pink-900",
    items: ["Problem Solving", "Collaboration", "Adaptability", "Creativity", "Fast Learner"],
  },
];

const iconNames = [
  'html5', 'css3', 'javascript', 'typescript', 'react',
  'nextjs', 'nodejs', 'python', 'java', 'php', 'kotlin',
  'go', 'rust', 'swift', 'csharp', 'ruby', 'scala', 'dart',
  'mongodb', 'postgresql', 'mysql', 'graphql',
];

const FloatingLogos = () => {
  const [positions, setPositions] = useState<
    { left: number; top: number; delay: number; duration: number; scale: number }[]
  >([]);

  useEffect(() => {
    const randomPositions = iconNames.map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 15 + Math.random() * 10,
      scale: 0.5 + Math.random(),
    }));
    setPositions(randomPositions);
  }, []);

  if (positions.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {iconNames.map((name, i) => {
        const { left, top, delay, duration, scale } = positions[i];

        return (
          <motion.div
            key={name}
            className="absolute opacity-30"
            initial={{ y: '110vh', scale }}
            animate={{ y: '-20vh', scale: scale + 0.5 }}
            transition={{
              duration,
              repeat: Infinity,
              ease: 'linear',
              delay,
            }}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <Image
              src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${name}/${name}-original.svg`}
              alt={name}
              width={40}
              height={40}
              className="filter grayscale-0 hover:grayscale-0 transition duration-300"
            />
          </motion.div>
        );
      })}
    </div>
  );
};


export default function SazzadPortfolio() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [scrollY, setScrollY] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [typewriterText, setTypewriterText] = useState("")
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // mobile nav clickable handle
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setMobileMenuOpen(false);
    }
  };

  if (mobileMenuOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [mobileMenuOpen]);


  const typewriterStrings = ["Web Developer", "UI Designer", "Programmer", "AI Enthusiast"]

  useEffect(() => {
    setIsVisible(true)

    // Typewriter effect
    let currentStringIndex = 0
    let currentCharIndex = 0
    let isDeleting = false

    const typewriterInterval = setInterval(
      () => {
        const currentString = typewriterStrings[currentStringIndex]

        if (!isDeleting) {
          setTypewriterText(currentString.substring(0, currentCharIndex + 1))
          currentCharIndex++

          if (currentCharIndex === currentString.length) {
            setTimeout(() => {
              isDeleting = true
            }, 900)
          }
        } else {
          setTypewriterText(currentString.substring(0, currentCharIndex - 1))
          currentCharIndex--

          if (currentCharIndex === 0) {
            isDeleting = false
            currentStringIndex = (currentStringIndex + 1) % typewriterStrings.length
          }
        }
      },
      isDeleting ? 50 : 100,
    )

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      setShowBackToTop(currentScrollY > 500)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(typewriterInterval)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  const projects = [
    {
      title: "Hotel Hera Lodge Website",
      description:
        "A beautifully designed and user-friendly website for Hotel Hera Lodge, offering a seamless browsing experience for guests. From designing logo to banner to website.",
      image: "/hhl.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "Vite", "Tailwind CSS", "TypeScript", "UI/UX Design"],
      link: "https://www.hotelheralodge.com",
      github: "#",
    },
    {
      title: "Personal Portfolio",
      description:
        "A modern and dynamic portfolio showcasing my skills, projects, and expertise in software development and web design. Built for performance, creativity, and seamless user experience.",
      image: "/personal-portfolio.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "GSAP Animation"],
      link: "https://sazzadali-portfolio.vercel.app/",
      github: "https://github.com/ali-sazzad/sazzadali-portfolio",
    },
    {
      title: "Brainwave with React on Vite",
      description:
        "A sleek, front-end high-performance single web app built with React on Vite, engineered for speed and seamless user experience.",
      image: "/brainwave-reactvite.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "Vite", "Tailwind CSS", "TypeScript"],
      link: "https://brainwave-reactvite.vercel.app/",
      github: "https://github.com/ali-sazzad/brainwave-reactvite",
    },
    {
      title: "Modern UI GPT-3 Frontend Website",
      description:
        "A responsive frontend inspired by GPT-3, designed with modern UI/UX principles. Built for performance, aesthetics, and seamless interaction.",
      image: "/desktop-1.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "Next.js", "Tailwind CSS", "GSAP Animation"],
      link: "https://modern-ui-ux-gpt3-frontend-website.vercel.app/",
      github: "https://github.com/ali-sazzad/modern_ui-ux_gpt3_frontend_website",
    },
    {
      title: "To-do List Web App",
      description:
        "A simple yet efficient To-Do List web app built with HTML, CSS, and JavaScript. Stay organized with an intuitive and responsive design.",
      image: "/to-do-list.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "JavaScript"],
      link: "https://simple-to-do-list-web-app-gamma.vercel.app/",
      github: "https://github.com/ali-sazzad/simple-to-do-list-web-app",
    },
    {
      title: "Bupa Email Template Design",
      description:
        "The basic HTML and CSS code for the Bupa email template used in emails for desktop. The template is designed to provide users with information about tapping with iPhone or Apple Watch for Bupa services.",
      image: "/bupa-email-template1.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "Email Template"],
      link: "https://bupa-email-template1.vercel.app/",
      github: "https://github.com/ali-sazzad/bupa-email-template1",
    },
    {
      title: "Basic Snake Game",
      description:
        "Welcome to the Basic Snake Game! 🎮🐍 \n\nThis project is a simple implementation of the classic Snake game using HTML, CSS, and JavaScript. The game allows players to control a snake that moves around the screen, eating food to grow longer. However, if the snake collides with itself or the boundaries of the game area, it's a game over displaying the highest score!",
      image: "/basic-snake-game.png?height=300&width=500",
      tags: ["HTML5", "CSS3", "JavaScript", "Game", "Fun"],
      link: "https://basic-snake-game-two.vercel.app/",
      github: "https://github.com/ali-sazzad/basic-snake-game",
    },
    {
    title: "Coming Soon",
    description: "An exciting new project in development. Stay tuned!",
    image: null, // render a skeleton when no image is provided
    tags: ["In Progress"],
    comingSoon: true,
    },
  ]

  // const techSkills = [
  //   { name: "HTML5", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" 
  //   },
  //   { name: "CSS3", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" 
  //   },
  //   {
  //     name: "JavaScript",
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  //   },
  //   {
  //     name: "TypeScript",
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  //   },
  //   { name: "React", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" 

  //   },
  //   { name: "Next.js", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg" 

  //   },
  //   {
  //     name: "Tailwind CSS",
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  //   },
  //   { name: "Python", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" 
  //   },
  //   { name: "PHP", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" 
  //   },
  //   { name: "Java", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg" 
  //   },
  //   { name: "Kotlin", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kotlin/kotlin-original.svg" 
  //   },
  //   { name: "MySQL", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" 
  //   },
  //   {
  //     name: "PostgreSQL",
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  //   },
  //   { name: "MongoDB", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" 

  //   },
  //   { name: "Figma", 
  //     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" 

  //   },
  // ]

  // const softSkills = [
  //   "Cognitive Thinking",
  //   "Creative Thinker",
  //   "Collaborative",
  //   "Communicative",
  //   "Leadership",
  //   "Problem Solver",
  //   "Time Management",
  //   "Adaptability",
  //   "Professionalism",
  //   "Decision Maker",
  // ]

  // const experience = [
  //   {
  //     title: "Web Developer / IT Support",
  //     company: "eSafety Supplies",
  //     type: "Internship | Hybrid",
  //     period: "Jan 2023 - Apr 2023",
  //     skills: [
  //       "WordPress Plugin Management",
  //       "Create Variations and Swatches",
  //       "Website's SEO and SEM",
  //       "Website Performance Optimization",
  //       "Products Upload",
  //       "Products Availability",
  //     ],
  //   },
  //   // {
  //   //   title: "Customer Service Representative",
  //   //   company: "HERTZ",
  //   //   type: "Part Time | On-Site",
  //   //   period: "Sep 2023 - August 2024",
  //   //   skills: [
  //   //     "Customer Service",
  //   //     "Customer Relationship Management",
  //   //     "Vehicle Return Inspection",
  //   //     "Data Analysis",
  //   //     "Data Management",
  //   //     "Time Management",
  //   //   ],
  //   // },
  // ]

  return (
    <>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Animated Background */}  

        {/* Animated Floating Logos */}
        <div className="fixed inset-0 z-0">
          <FloatingLogos />
        </div>
        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-8 bg-black/80 backdrop-blur-md border-b border-blue-800/50"
        >
          <Link href="#top" className="scroll-smooth">
            <motion.div
              className="cursor-pointer text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            
            >
              <TextHoverEffect text="Sazzad Ali" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="cursor-pointer hidden md:flex space-x-6">
            {["About", "Skills", "Projects", "Contact"].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="hover:text-blue-400 transition-colors duration-300"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="cursor-pointer md:hidden p-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-gray-800/50 p-6 md:hidden"
          >
          <div className="flex flex-col space-y-4">
            {["About", "Skills", "Projects", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="cursor-pointer hover:text-blue-300 transition-colors duration-300 text-center py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item}
            </a>
            ))}
          </div>
          </motion.div>
          )}

        </motion.nav>

        {/* Hero Section */}
        <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">
                Hi, I&apos;m{" "}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Sazzad
                </span>
              </h1>
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-blue-400 mb-4 h-12">
                {typewriterText}
                <span className="animate-pulse">|</span>
              </div>
              <h2 className="text-xl md:text-2xl text-gray-300 mb-4">from Sydney, Australia</h2>
              <p className="text-lg md:text-xl text-gray-400 italic">&quot;One Line of Code at a Time&quot;</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                size="lg"
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                Let&apos;s Talk
              </Button>
              <a
                href="/Sazzad-ALI_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="cursor-pointer border-blue-500 text-white hover:bg-blue-800 hover:text-blue-100 hover:text-xl bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                    Preview CV
                </Button>
              </a>

            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex justify-center space-x-6"
            >
              <motion.a
                href="https://www.linkedin.com/in/sazzadali/"
                target="_blank"
                className="p-3 rounded-full border border-gray-700 hover:border-blue-400 hover:bg-blue-400/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                rel="noreferrer"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="https://github.com/ali-sazzad"
                target="_blank"
                className="p-3 rounded-full border border-gray-700 hover:border-purple-400 hover:bg-purple-400/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                rel="noreferrer"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="mailto:find.sazzadali@gmail.com"
                className="p-3 rounded-full border border-gray-700 hover:border-pink-400 hover:bg-pink-400/10 transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-6 h-6" />
              </motion.a>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <ChevronDown className="w-8 h-8 text-gray-400" />
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="tracking-widest scroll-mt-24 relative z-10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                About{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Me</span>
              </h2>
              <p className=" text-lg md:text-xl text-gray-100  text-shadow-gray-50 leading-loose">
                <span className="py-2"> Software Engineer and Web Developer with a passion for building elegant, high-performance digital experiences. With a strong foundation in software engineering, AI integration, UI/UX design, and project management, I bring both creativity and precision to every project.</span><br /><br />
                
                <span className="mt-8">Whether it’s crafting full-stack web applications, designing intuitive user interfaces, or delivering scalable software solutions — I thrive in environments where design meets functionality. I stay at the forefront of modern tech stacks and development trends to ensure every product I touch is fast, accessible, and future-ready.</span>
              </p>
            </motion.div>
          </div>
        </section>    

        {/* Projects Section */}
        <section id="projects" className="scroll-mt-24 relative z-10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                My{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                A collection of projects that showcase my skills and passion for creating exceptional digital experiences
              </p>
            </motion.div>

            <div className="cursor-pointer grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: project.comingSoon ? 0 : -10 }}
                className="group"
              >
              <Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 overflow-hidden h-full">
                <div className="relative overflow-hidden group">
              {!project.comingSoon ? (
            <>
              <Image
                width={500}
                height={300}
                src={project.image!}
                alt={project.title}
                className="cursor-pointer w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
              />

                {/* Top-right Icons */}
                <div className="absolute top-2 right-2 flex space-x-2 z-10">
                  {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black/70 hover:bg-black/90 transition"
                    aria-label="View on GitHub"
                  >
                    <Github className="w-4 h-4 text-white" />
                  </a>
                  )}
                  {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black/70 hover:bg-black/90 transition"
                    aria-label="Visit Website"
                  >
                    <ExternalLink className="w-4 h-4 text-white" />
                  </a>
                  )}
                </div>
            </>
            ) : (
              <div className="h-48 bg-gray-800 animate-pulse" />
            )}

            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
                project.comingSoon ? "" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </div>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                    <p className="text-gray-300 mb-4 flex-1">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-300 border-blue-500/30"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            </div>
          </div>
        </section>
        
        {/* Skills Section */}
        <section id="skills" className="scroll-mt-24 relative z-10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                My{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Skills Galaxy
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                A dynamic blend of technical and interpersonal abilities — orbiting around innovation, precision, and creativity.
              </p>
            </motion.div>

            <div className="cursor-pointer grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillClusters.map((cluster, i) => (
                <Tilt key={i} tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05} transitionSpeed={1500}>
                  <motion.div
                    className={`rounded-xl border border-blue-500 p-6 shadow-lg bg-gradient-to-br ${cluster.color} text-white backdrop-blur-sm`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.9, delay: i * 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-4xl font-semibold mb-4">{cluster.title}</h3>
                    <ul className="space-y-2">
                      {cluster.items.map((item, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-lg">
                          <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-ping"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>


        {/* Experience Section */}
        {/* <section id="experience" className="scroll-mt-24 relative z-10 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                My{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Experience
                </span>
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {experience.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 p-6 h-full">
                    <h3 className="text-2xl font-bold mb-2 text-white">{exp.title}</h3>
                    <h4 className="text-xl font-bold mb-2 text-blue-400">{exp.company}</h4>
                    <p className="text-gray-300 mb-2">{exp.type}</p>
                    <p className="text-gray-400 mb-6">{exp.period}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Contact Section */}
        <section id="contact" className="scroll-mt-24 relative z-10 py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-6xl font-bold mb-10">
                Let&apos;s{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Connect
                </span>
              </h2>
              <p className="tracking-widest text-lg md:text-xl text-gray-100  text-shadow-gray-50 leading-loose">
                If you&apos;re looking for someone who can <span className="text-white font-medium">design</span>, <span className="text-white font-medium">develop</span>, and <span className="text-white font-medium">deliver.</span>
              
                {/* <ul className=" list-disc list-inside space-y-2 pl-2">
                      <li><span className="text-white">Full-Stack Development</span> (React, Next.js, Node.js)
                      </li>
                      <li><span className="text-white">AI-powered Website / App Integration</span>
                      </li>
                      <li><span className="text-white">UI/UX Design Systems</span>
                      </li>
                      <li><span className="text-white">App Development</span>
                      </li>
                    </ul> */}

                <span> I&apos;m always open to collaborating on 
                  <span className="text-white font-bold ml-1.5">innovative projects</span> that push boundaries and make an impact.
                </span><br /><br />
                <span className="text-lg ml-1.5 mt-12">
                    I am ready to bring your ideas to life? Let&apos;s discuss your next project and create something amazing together by mailing me below with project details.
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  className="mt-15 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                  asChild
                >
                  <a href="mailto:find.sazzadali@gmail.com">
                    <Mail className="w-4 h-4 mr-2" />
                    find.sazzadali@gmail.com
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-800 py-8 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">© 2024 Sazzad ALI. All rights reserved.</div>
            <div className="flex space-x-6">
              <a
                href="https://www.linkedin.com/in/sazzadali/"
                target="_blank"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                rel="noreferrer"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/ali-sazzad"
                target="_blank"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
                rel="noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:find.sazzadali@gmail.com"
                className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </footer>

        {/* Back to Top Button */}
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: showBackToTop ? 1 : 0,
            scale: showBackToTop ? 1 : 0,
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-6 h-6 rotate-180" />
        </motion.button>
      </div>
    </>
  )
}