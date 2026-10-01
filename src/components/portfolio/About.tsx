"use client"

import { useEffect, useRef, useState } from "react"
import { Code2, PenTool, Rocket } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"
import { Artboard, ArtboardHeading } from "./Artboard"

const pillars = [
  { Icon: PenTool, title: "Design", text: "Intuitive interfaces and design systems with a strong eye for detail." },
  { Icon: Code2, title: "Develop", text: "Full-stack web apps with React, Next.js and Node — clean, typed and fast." },
  { Icon: Rocket, title: "Deliver", text: "Scalable, accessible products shipped with care and clear communication." },
]

// Inspector rows: every value comes from the bio above it.
const properties = [
  ["Name", "Sazzad Ali"],
  ["Based in", "Sydney, Australia"],
  ["Role", "Software engineer and web developer"],
  ["Strengths", "AI integration, UI/UX design, project management"],
  ["Stack", "React, Next.js, Node.js, TypeScript"],
]

/** Redlines between auto-layout children, labelled with the row's real computed gap. */
function useGapRedlines(row: HTMLElement | null) {
  const [marks, setMarks] = useState<{ left: number; width: number }[]>([])
  const [gap, setGap] = useState(0)
  useEffect(() => {
    if (!row) return
    const measure = () => {
      const kids = [...row.children].filter((c) => c.classList.contains("pillar")) as HTMLElement[]
      const r = row.getBoundingClientRect()
      const next: { left: number; width: number }[] = []
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i].getBoundingClientRect()
        const b = kids[i + 1].getBoundingClientRect()
        if (Math.abs(a.top - b.top) > 4) return setMarks([]) // stacked (mobile): no row gaps
        next.push({ left: a.right - r.left, width: b.left - a.right })
      }
      setMarks(next)
      setGap(Math.round(parseFloat(getComputedStyle(row).columnGap) || 0))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(row)
    return () => ro.disconnect()
  }, [row])
  return { marks, gap }
}

export function About() {
  const root = useRef<HTMLElement>(null)
  const [row, setRow] = useState<HTMLDivElement | null>(null)
  const { marks, gap } = useGapRedlines(row)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Words darken one by one as the bio scrolls through the viewport.
        SplitText.create(".about-copy", {
          type: "words",
          autoSplit: true,
          onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.2 },
              {
                opacity: 1,
                stagger: 0.1,
                ease: "none",
                scrollTrigger: { trigger: ".about-copy", start: "top 75%", end: "bottom 50%", scrub: true },
              },
            ),
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative px-4 py-16 md:px-10 md:py-24">
      <Artboard name="About">
        <div className="grid gap-12 px-6 py-14 md:px-16 md:py-20 lg:grid-cols-[1fr_17rem] lg:gap-16">
          <div>
            <ArtboardHeading title="I design and build for the web." />
            <div className="about-copy max-w-[62ch] space-y-6 text-lg leading-relaxed md:text-xl">
              <p>
                Software engineer and web developer with a passion for building elegant, high-performance digital
                experiences. With a strong foundation in software engineering, AI integration, UI/UX design and project
                management, I bring both creativity and precision to every project.
              </p>
              <p>
                Whether it&apos;s crafting full-stack web applications, designing intuitive interfaces or delivering
                scalable software, I thrive where design meets functionality, and make sure everything I touch is fast,
                accessible and future-ready.
              </p>
            </div>
          </div>

          {/* Inspector panel, as in a design tool's right sidebar. */}
          <aside aria-label="Profile details" className="self-start text-sm lg:border-l lg:border-rule lg:pl-8">
            <h3 className="mb-4 font-semibold">Properties</h3>
            <dl className="divide-y divide-rule">
              {properties.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[6rem_1fr] gap-3 py-2.5">
                  <dt className="text-muted">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          {/* Auto-layout row: the three ways I work, with the real gap measured between them. */}
          <div ref={setRow} className="relative grid gap-6 md:grid-cols-3 lg:col-span-2">
            {pillars.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="pillar group relative p-6 ring-1 ring-rule transition-shadow hover:ring-[1.5px] hover:ring-select"
              >
                <Icon className="mb-5 h-6 w-6 text-select" aria-hidden="true" />
                <h3 className="mb-2 font-display text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="text-muted">{text}</p>
              </div>
            ))}
            {marks.map((m, i) => (
              <span
                key={i}
                className="pointer-events-none absolute top-1/2 h-px bg-redline"
                style={{ left: m.left, width: m.width }}
                aria-hidden="true"
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-[3px] bg-redline px-1 py-0.5 text-[11px] font-medium tabular-nums text-[#fff]">
                  {gap}
                </span>
              </span>
            ))}
          </div>
        </div>
      </Artboard>
    </section>
  )
}
