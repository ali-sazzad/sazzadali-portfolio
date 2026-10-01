"use client"

import { useRef } from "react"
import { Code2, PenTool, Rocket } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"
import { SectionHeader } from "./SectionHeader"

const pillars = [
  { Icon: PenTool, title: "Design", text: "Intuitive interfaces and design systems with a strong eye for detail." },
  { Icon: Code2, title: "Develop", text: "Full-stack web apps with React, Next.js and Node — clean, typed and fast." },
  { Icon: Rocket, title: "Deliver", text: "Scalable, accessible products shipped with care and clear communication." },
]

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // The statement darkens word by word as it scrolls through the viewport.
        SplitText.create(".about-statement", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.25 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: ".about-statement", start: "top 80%", end: "bottom 55%", scrub: true },
              },
            ),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader title="About" />

        <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <p className="about-statement text-balance font-display text-3xl font-semibold leading-[1.1] tracking-[-0.025em] md:text-5xl">
            Software engineer and web developer with a passion for building elegant, high-performance digital
            experiences.
          </p>
          <div className="space-y-5 self-end text-lg leading-relaxed text-muted">
            <p>
              With a strong foundation in software engineering, AI integration, UI/UX design and project management,
              I bring both creativity and precision to every project.
            </p>
            <p>
              I thrive where design meets functionality, and make sure everything I touch is fast, accessible and
              future-ready.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {pillars.map(({ Icon, title, text }) => (
            <div key={title} className="rounded-[24px] bg-artboard p-7">
              <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-select/15 text-select">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight">{title}</h3>
              <p className="text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
