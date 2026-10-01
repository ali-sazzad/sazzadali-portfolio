"use client"

import { useRef, useState } from "react"
import { ArrowUp, Github, Linkedin, Mail, Send } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, scrollToTarget } from "@/lib/gsap"
import { EMAIL, socials } from "@/data/portfolio"
import { Artboard, ArtboardHeading } from "./Artboard"
import { CommentPin } from "./CommentPin"

const SUBJECT = "Project enquiry from your portfolio"

export function Contact() {
  const [message, setMessage] = useState("")
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(message)}`

  return (
    <section id="contact" className="relative px-4 py-16 md:px-10 md:py-24">
      <Artboard name="Contact">
        <div className="grid gap-12 px-6 py-14 md:px-16 md:py-20 lg:grid-cols-[1fr_26rem] lg:gap-16">
          <div>
            <ArtboardHeading title="Let's build something together.">
              Looking for someone who can design, develop and deliver? I&apos;m always open to collaborating on
              projects that push boundaries and make an impact.
            </ArtboardHeading>

            <ul className="space-y-1 text-lg">
              <li>
                <a
                  href={socials.email}
                  className="inline-flex items-center gap-3 underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-select"
                >
                  <Mail className="h-5 w-5 text-muted" aria-hidden="true" />
                  {EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-select"
                >
                  <Linkedin className="h-5 w-5 text-muted" aria-hidden="true" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 underline decoration-rule underline-offset-[6px] transition-colors hover:decoration-select"
                >
                  <Github className="h-5 w-5 text-muted" aria-hidden="true" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* A comment thread: my note, and a reply box that drafts an email to me. */}
          <div className="self-start">
            <CommentPin>
              Ready to bring your ideas to life? Tell me what you&apos;re building and I&apos;ll get back to you.
            </CommentPin>

            <form
              className="ml-[46px] mt-3 rounded-lg bg-artboard p-3 shadow-lg ring-1 ring-rule focus-within:ring-[1.5px] focus-within:ring-select"
              onSubmit={(e) => {
                e.preventDefault()
                window.location.href = mailto
              }}
            >
              <label htmlFor="reply" className="sr-only">
                Your message
              </label>
              <textarea
                id="reply"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Reply with your project details…"
                className="w-full resize-none bg-transparent text-sm leading-relaxed placeholder:text-muted focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-muted">Opens your email app</span>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="flex items-center gap-1.5 rounded-md bg-select px-3 py-1.5 text-sm font-medium text-[#fff] transition-opacity hover:brightness-110 disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  Send email
                </button>
              </div>
            </form>
          </div>
        </div>
      </Artboard>
    </section>
  )
}

/** Footer as the design tool's bottom status bar. */
export function Footer() {
  return (
    <footer className="relative border-t border-rule bg-artboard px-4 py-3 text-xs text-muted md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© {new Date().getFullYear()} Sazzad Ali</p>
        <p>Built with Next.js, Tailwind CSS and GSAP</p>
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
      className="invisible fixed bottom-6 right-6 z-40 grid h-11 w-11 place-items-center rounded-md bg-artboard text-ink shadow-lg ring-1 ring-rule transition-colors hover:ring-select focus-visible:outline-2 focus-visible:outline-select"
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
