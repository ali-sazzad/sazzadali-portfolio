"use client"

import { useRef } from "react"
import { ArrowUp, Github, Linkedin, Mail } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { EMAIL, socials } from "@/data/portfolio"
import { Magnetic } from "./Magnetic"

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const title = SplitText.create(".contact-title", { type: "chars", mask: "chars" })

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } })
          .from(title.chars, {
            yPercent: 120,
            rotate: 10,
            stagger: { each: 0.035, from: "center" },
            duration: 1.1,
            ease: "expo.out",
          })
          .from(".contact-underline", { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.5)
          .from(".contact-copy > *", { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1 }, 0.4)
          .from(".contact-cta", { scale: 0.6, autoAlpha: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" }, 0.8)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-purple-400">04 — Get in touch</p>
        <div className="relative mb-12 inline-block">
          <h2 className="contact-title text-5xl font-bold tracking-tight md:text-8xl">Let&apos;s Connect</h2>
          <svg
            className="absolute -bottom-4 left-0 w-full"
            viewBox="0 0 400 20"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="underline-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <path
              className="contact-underline"
              d="M2 14 C 60 4, 120 18, 200 10 S 340 4, 398 12"
              stroke="url(#underline-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="contact-copy space-y-6 text-lg leading-relaxed text-gray-300 md:text-xl">
          <p>
            Looking for someone who can <span className="font-semibold text-white">design</span>,{" "}
            <span className="font-semibold text-white">develop</span> and{" "}
            <span className="font-semibold text-white">deliver</span>? I&apos;m always open to collaborating on{" "}
            <span className="font-semibold text-white">innovative projects</span> that push boundaries and make an
            impact.
          </p>
          <p className="text-gray-400">
            Ready to bring your ideas to life? Drop me a line with your project details and let&apos;s build something
            amazing together.
          </p>
        </div>

        <div className="contact-cta mt-14">
          <Magnetic strength={0.4}>
            <a
              href={socials.email}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-5 text-lg font-semibold shadow-xl shadow-purple-500/25 transition-shadow hover:shadow-purple-500/50 md:px-10"
            >
              <Mail className="h-5 w-5" />
              {EMAIL}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Sazzad Ali. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-400 transition-colors hover:text-blue-400">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-gray-400 transition-colors hover:text-purple-400">
            <Github className="h-5 w-5" />
          </a>
          <a href={socials.email} aria-label="Email" className="text-gray-400 transition-colors hover:text-pink-400">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const show = gsap
      .timeline({ paused: true })
      .fromTo(ref.current, { autoAlpha: 0, scale: 0, rotate: -180 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" })

    ScrollTrigger.create({
      start: 600,
      end: "max",
      onEnter: () => show.play(),
      onLeaveBack: () => show.reverse(),
    })
  })

  return (
    <button
      ref={ref}
      onClick={() => scrollToTarget(0)}
      className="invisible fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg"
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  )
}
