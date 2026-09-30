"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"

/** Section title whose characters rise out of a mask when scrolled into view. */
export function SectionHeading({
  eyebrow,
  lead,
  accent,
  children,
}: {
  eyebrow: string
  lead: string
  accent: string
  children?: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const scrollTrigger = { trigger: root.current, start: "top 80%" }
        SplitText.create(".heading-lead", {
          type: "chars",
          mask: "chars",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, { yPercent: 110, stagger: 0.03, duration: 1, ease: "expo.out", scrollTrigger }),
        })
        gsap.from(".heading-accent", {
          clipPath: "inset(0% 100% 0% 0%)",
          clearProps: "clipPath",
          duration: 1.2,
          ease: "expo.inOut",
          delay: 0.2,
          scrollTrigger,
        })
        gsap.from([".heading-eyebrow", ".heading-body"], {
          y: 24,
          autoAlpha: 0,
          stagger: 0.15,
          duration: 1,
          scrollTrigger,
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="mb-16 text-center">
      <p className="heading-eyebrow mb-4 font-mono text-xs uppercase tracking-[0.4em] text-purple-400">{eyebrow}</p>
      <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
        <span className="heading-lead inline-block">{lead}</span>{" "}
        <span className="heading-accent inline-block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text pb-1 text-transparent">
          {accent}
        </span>
      </h2>
      {children && <div className="heading-body mx-auto max-w-2xl text-lg text-gray-300 md:text-xl">{children}</div>}
    </div>
  )
}
