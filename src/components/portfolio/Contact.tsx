"use client"

import { useRef } from "react"
import { ArrowUp, ArrowUpRight, Download, Github, Linkedin } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, scrollToTarget } from "@/lib/gsap"
import { EMAIL, socials } from "@/data/portfolio"
import { asset } from "@/lib/utils"

/** Contact: one solid jacaranda block; the email address itself is the primary action. */
export function Contact() {
  return (
    <section id="contact" className="relative px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-select p-8 text-on-select md:p-16">
        <h2 className="max-w-4xl text-balance font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-8xl">
          Let&apos;s build something together.
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed opacity-85 md:text-xl">
          Looking for someone who can design, develop and deliver? I&apos;m always open to collaborating on projects
          that push boundaries and make an impact.
        </p>

        <a
          href={socials.email}
          className="group mt-12 flex w-fit max-w-full flex-wrap items-center gap-4 break-all font-display text-2xl font-semibold tracking-tight underline decoration-2 underline-offset-[10px] sm:text-4xl md:text-6xl"
        >
          {EMAIL}
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-on-select text-select no-underline transition-transform duration-500 group-hover:rotate-45 md:h-16 md:w-16">
            <ArrowUpRight className="h-6 w-6 md:h-8 md:w-8" aria-hidden="true" />
          </span>
        </a>

        <div className="mt-12 flex flex-wrap gap-3">
          {[
            { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
            { href: socials.github, label: "GitHub", Icon: Github },
            { href: asset("/Sazzad-ALI_CV.pdf"), label: "Preview CV", Icon: Download },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-5 py-3 font-semibold ring-2 ring-on-select/40 transition-colors hover:bg-on-select hover:text-select focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-select"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="relative px-4 pb-10 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-rule pt-6 text-sm text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Sazzad Ali, Sydney</p>
        <p>One line of code at a time.</p>
      </div>
    </footer>
  )
}

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const show = gsap
      .timeline({ paused: true })
      .fromTo(ref.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out" })

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
      className="invisible fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-artboard text-ink shadow-lg ring-1 ring-rule transition-colors hover:bg-select hover:text-on-select focus-visible:outline-2 focus-visible:outline-select"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
