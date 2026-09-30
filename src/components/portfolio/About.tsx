"use client"

import { useRef } from "react"
import { Code2, PenTool, Rocket } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK } from "@/lib/gsap"
import { SectionHeading } from "./SectionHeading"

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
        // Words light up one by one as the paragraph scrolls through the viewport.
        SplitText.create(".about-copy", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: ".about-copy", start: "top 75%", end: "bottom 45%", scrub: true },
              },
            ),
        })

        gsap.set(".pillar", { y: 80, autoAlpha: 0, rotateX: -25 })
        ScrollTrigger.batch(".pillar", {
          start: "top 85%",
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, autoAlpha: 1, rotateX: 0, stagger: 0.15, duration: 1.1, ease: "expo.out" }),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading eyebrow="01 — Who I am" lead="About" accent="Me" />

        <div className="about-copy mx-auto max-w-4xl space-y-8 text-center text-xl leading-relaxed text-gray-100 md:text-3xl md:leading-snug">
          <p>
            Software Engineer and Web Developer with a passion for building elegant, high-performance digital
            experiences. With a strong foundation in software engineering, AI integration, UI/UX design and project
            management, I bring both creativity and precision to every project.
          </p>
          <p>
            Whether it&apos;s crafting full-stack web applications, designing intuitive interfaces or delivering
            scalable software — I thrive where design meets functionality, and make sure everything I touch is fast,
            accessible and future-ready.
          </p>
        </div>

        <div className="mt-24 grid gap-6 [perspective:1000px] md:grid-cols-3">
          {pillars.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="pillar group rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-colors hover:border-purple-400/40"
            >
              <Icon className="mb-6 h-8 w-8 text-purple-400 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
              <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
              <p className="text-gray-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
