"use client"

import { useRef } from "react"
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap"
import { deviconUrl, skillClusters, techIcons } from "@/data/portfolio"
import { SectionHeading } from "./SectionHeading"

const INVERT = new Set(["nextjs", "express", "vercel"])
const half = Math.ceil(techIcons.length / 2)
const rows = [techIcons.slice(0, half), techIcons.slice(half)]

export function Skills() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        // Seamless marquees: each row holds two copies and moves by exactly one copy.
        const loops = gsap.utils.toArray<HTMLElement>(".marquee-row").map((row, i) => {
          const dir = i % 2 === 0 ? -1 : 1
          return gsap
            .fromTo(
              row,
              { xPercent: dir === -1 ? 0 : -50 },
              { xPercent: dir === -1 ? -50 : 0, duration: 40, ease: "none", repeat: -1 },
            )
            .totalTime(40 * 100) // head start, so reversing on upward scroll never hits time 0
        })

        // Scroll velocity boosts marquee speed, then eases back to cruising.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)
            loops.forEach((loop) => {
              gsap.to(loop, { timeScale: boost * self.direction, duration: 0.2, overwrite: true })
              gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.2, overwrite: false })
            })
          },
        })

        gsap.set(".skill-card", { y: 60, autoAlpha: 0, scale: 0.94 })
        ScrollTrigger.batch(".skill-card", {
          start: "top 88%",
          onEnter: (batch) =>
            gsap.to(batch, { y: 0, autoAlpha: 1, scale: 1, stagger: 0.12, duration: 1, ease: "expo.out" }),
        })
        gsap.from(".skill-item", {
          x: -16,
          autoAlpha: 0,
          stagger: 0.03,
          duration: 0.6,
          scrollTrigger: { trigger: ".skills-grid", start: "top 75%" },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="03 — Toolkit" lead="My" accent="Skills Galaxy">
          A dynamic blend of technical and interpersonal abilities — orbiting around innovation, precision and
          creativity.
        </SectionHeading>
      </div>

      <div className="mb-12 space-y-6 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="marquee-row flex w-max">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                {row.map(({ slug, name, variant }) => (
                  <li
                    key={slug}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-lg whitespace-nowrap"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={deviconUrl(slug, variant)}
                      alt=""
                      width={28}
                      height={28}
                      loading="lazy"
                      className={INVERT.has(slug) ? "dark:invert" : ""}
                    />
                    {name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        ))}
      </div>

      <div className="skills-grid mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2 lg:grid-cols-3">
        {skillClusters.map((cluster) => (
          <div
            key={cluster.title}
            className={`skill-card group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${cluster.accent} p-8 transition-colors hover:border-blue-400/50`}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-transform duration-700 group-hover:scale-[2.5]" />
            <h3 className="relative mb-6 text-3xl font-semibold">{cluster.title}</h3>
            <ul className="relative space-y-3">
              {cluster.items.map((item) => (
                <li key={item} className="skill-item flex items-center gap-3 text-lg text-gray-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
