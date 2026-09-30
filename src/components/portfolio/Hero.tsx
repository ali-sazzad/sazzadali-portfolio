"use client"

import { useRef } from "react"
import { ChevronDown, Download, Github, Linkedin, Mail } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { roles, socials } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { Magnetic } from "./Magnetic"

const socialLinks = [
  { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin, hover: "hover:border-blue-400 hover:bg-blue-400/10" },
  { href: socials.github, label: "GitHub", Icon: Github, hover: "hover:border-purple-400 hover:bg-purple-400/10" },
  { href: socials.email, label: "Email", Icon: Mail, hover: "hover:border-pink-400 hover:bg-pink-400/10" },
]

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  // Everything — including the text splitting — is prepared on mount while the preloader
  // still covers the page. When the curtain lifts, the intro only has to play.
  useGSAP(
    () => {
      gsap.set(".hero-content", { autoAlpha: 1 })
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const greeting = SplitText.create(".hero-greeting", { type: "chars", mask: "chars" })
        const sub = SplitText.create(".hero-sub", { type: "words", mask: "words" })

        const tl = (intro.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .from(greeting.chars, { yPercent: 120, rotate: 8, stagger: 0.035, duration: 1.2 })
          .from(
            ".hero-name",
            // clearProps: a lingering clip-path breaks background-clip:text in Chromium.
            { clipPath: "inset(0% 100% 0% 0%)", duration: 1.4, ease: "expo.inOut", clearProps: "clipPath" },
            "-=0.9",
          )
          .from(".hero-role", { autoAlpha: 0, y: 20, duration: 0.8 }, "-=0.6")
          .from(sub.words, { yPercent: 100, stagger: 0.03, duration: 0.9 }, "-=0.6")
          .from(".hero-cta > *", { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9 }, "-=0.6")
          .from(".hero-social", { scale: 0, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "back.out(2)" }, "-=0.7")
          .from(".hero-scroll", { autoAlpha: 0, y: -20, duration: 0.8 }, "-=0.4"))

        // Rotating roles, decoded with ScrambleText; starts near the end of the intro.
        const roleTl = gsap.timeline({ paused: true, repeat: -1 })
        tl.call(() => roleTl.play(), undefined, tl.duration() - 1)
        roles.forEach((role) => {
          roleTl
            .to(".hero-role-text", {
              duration: 1.1,
              scrambleText: { text: role, chars: "upperAndLowerCase", speed: 0.5, revealDelay: 0.2 },
              ease: "none",
            })
            .to({}, { duration: 1.8 })
        })

        // Shimmer across the gradient name.
        gsap.to(".hero-name", {
          backgroundPosition: "200% center",
          duration: 6,
          ease: "none",
          repeat: -1,
        })

        gsap.to(".hero-scroll svg", { y: 10, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 })

        // Scroll-out: content lifts, fades and softens as the hero leaves.
        gsap.to(".hero-content", {
          yPercent: -25,
          autoAlpha: 0,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        gsap.to(".hero-marquee", {
          xPercent: -30,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 1 },
        })
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-role-text", { textContent: roles[0] })
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (ready) intro.current?.play()
    },
    { dependencies: [ready] },
  )

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-24"
    >
      <p
        className="hero-marquee pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[18vw] font-black uppercase leading-none text-transparent opacity-[0.06] [-webkit-text-stroke:1px_white]"
        aria-hidden="true"
      >
        Creative Developer · Creative Developer
      </p>

      <div className="hero-content invisible relative z-10 mx-auto max-w-5xl text-center">
        <h1 className="mb-6 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          <span className="hero-greeting inline-block">Hi, I&apos;m</span>{" "}
          <span className="hero-name inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-[length:200%_auto] bg-clip-text pb-2 text-transparent">
            Sazzad
          </span>
        </h1>

        <p className="hero-role mb-6 h-12 font-mono text-2xl font-bold text-blue-400 md:text-4xl" aria-live="polite">
          <span className="hero-role-text">{roles[0]}</span>
          <span className="ml-1 animate-pulse text-purple-400">_</span>
        </p>

        <p className="hero-sub mx-auto mb-3 max-w-xl text-lg text-gray-300 md:text-2xl">from Sydney, Australia</p>
        <p className="hero-sub mb-12 text-base italic text-gray-500 md:text-lg">&ldquo;One Line of Code at a Time&rdquo;</p>

        <div className="hero-cta mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic>
            <button
              onClick={() => scrollToTarget("#contact")}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/20 transition-shadow hover:shadow-purple-500/40"
            >
              Let&apos;s Talk
            </button>
          </Magnetic>
          <Magnetic>
            <a
              href={asset("/Sazzad-ALI_CV.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-blue-500/60 px-8 py-4 font-semibold transition-colors hover:bg-blue-500/10"
            >
              <Download className="h-4 w-4" />
              Preview CV
            </a>
          </Magnetic>
        </div>

        <div className="flex justify-center gap-5">
          {socialLinks.map(({ href, label, Icon, hover }) => (
            <Magnetic key={label} strength={0.5}>
              <a
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                className={`hero-social block rounded-full border border-gray-700 p-3 transition-colors ${hover}`}
              >
                <Icon className="h-6 w-6" />
              </a>
            </Magnetic>
          ))}
        </div>
      </div>

      <button
        onClick={() => scrollToTarget("#about")}
        className="hero-scroll absolute bottom-8 left-1/2 -ml-4 text-gray-400"
        aria-label="Scroll to About"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  )
}
