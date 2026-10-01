"use client"

import { useRef, useState } from "react"
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap"
import { deviconUrl, skillClusters, techIcons } from "@/data/portfolio"
import { SectionHeading } from "./SectionHeading"

const INVERT = new Set(["nextjs", "express", "vercel"])
const ALIAS: Record<string, string> = { "Kotlin with Compose": "kotlin" }

/** Devicon for a skill name, if there is one. */
function iconFor(name: string) {
  const slug = ALIAS[name] ?? techIcons.find((t) => t.name === name)?.slug
  const icon = techIcons.find((t) => t.slug === slug)
  return icon ? { src: deviconUrl(icon.slug, icon.variant), invert: INVERT.has(icon.slug) } : null
}

// Orbits, inner to outer. Radius is a fraction of the galaxy's width; `dir` alternates.
const ORBITS = [
  { title: "App Development", radius: 0.27, color: "#34d399", period: 38, dir: 1 },
  { title: "Backend", radius: 0.44, color: "#fb7185", period: 54, dir: -1 },
  { title: "Frontend", radius: 0.61, color: "#60a5fa", period: 70, dir: 1 },
  { title: "Dev Tools", radius: 0.78, color: "#fbbf24", period: 90, dir: -1 },
]
const SOFT = { title: "Soft Skills", color: "#c084fc" }
const GROUPS = skillClusters.map((c) => ({
  ...c,
  color: ORBITS.find((o) => o.title === c.title)?.color ?? SOFT.color,
}))
const softItems = skillClusters.find((c) => c.title === SOFT.title)?.items ?? []
const softText = `${softItems.join("  •  ")}  •  `

export function Skills() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const userPicked = useRef(false)

  const pick = (i: number) => {
    userPicked.current = true
    setActive(i)
  }

  // Galaxy motion: orbits, entrance, scroll-velocity boost, pointer tilt, auto-cycling.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const loops = gsap.utils.toArray<HTMLElement>(".orbit").map((ring) => {
          const period = Number(ring.dataset.period)
          const dir = Number(ring.dataset.dir)
          // The ring turns; each planet turns back the same amount so logos stay upright.
          return gsap
            .timeline({ repeat: -1, defaults: { ease: "none", duration: period } })
            .to(ring, { rotation: 360 * dir }, 0)
            .to(ring.querySelectorAll(".planet-face"), { rotation: -360 * dir }, 0)
        })
        loops.push(gsap.timeline({ repeat: -1 }).to(".soft-ring", { rotation: -360, duration: 120, ease: "none" }))

        // Entrance: rings expand out of the core, planets pop, the soft-skill ring fades in.
        gsap
          .timeline({ scrollTrigger: { trigger: ".galaxy", start: "top 75%" } })
          .from(".core", { scale: 0, duration: 0.8, ease: "back.out(2)" })
          .from(".orbit-track", { scale: 0, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: "expo.out" }, "-=0.4")
          .from(".planet-face", { scale: 0, stagger: 0.03, duration: 0.5, ease: "back.out(2.5)" }, "-=0.6")
          .from(".soft-ring", { autoAlpha: 0, scale: 0.9, duration: 0.8 }, "-=0.4")

        // Scrolling fast makes the galaxy spin faster, then it settles.
        ScrollTrigger.create({
          trigger: ".galaxy",
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5)
            loops.forEach((l) => {
              gsap.to(l, { timeScale: boost, duration: 0.2, overwrite: true })
              gsap.to(l, { timeScale: 1, duration: 1.4, delay: 0.2, overwrite: false })
            })
          },
        })

        // Cycle through groups while on screen, until the visitor picks one.
        let inView = false
        let cycle: gsap.core.Tween | null = null
        const next = () => {
          if (!inView || userPicked.current) return
          setActive((a) => (a + 1) % GROUPS.length)
          cycle = gsap.delayedCall(3.5, next)
        }
        ScrollTrigger.create({
          trigger: ".galaxy",
          start: "top 70%",
          end: "bottom 30%",
          onToggle: (self) => {
            inView = self.isActive
            cycle?.kill()
            if (inView) cycle = gsap.delayedCall(3.5, next)
          },
        })
        return () => cycle?.kill()
      })

      // 3D tilt towards the pointer (mouse/trackpad only).
      mm.add(`(pointer: fine) and ${MOTION_OK}`, () => {
        const stage = root.current!.querySelector<HTMLElement>(".galaxy")!
        const rx = gsap.quickTo(".galaxy-tilt", "rotationX", { duration: 0.8, ease: "power3" })
        const ry = gsap.quickTo(".galaxy-tilt", "rotationY", { duration: 0.8, ease: "power3" })
        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect()
          ry(((e.clientX - r.left) / r.width - 0.5) * 18)
          rx(-((e.clientY - r.top) / r.height - 0.5) * 18)
        }
        const leave = () => {
          rx(0)
          ry(0)
        }
        stage.addEventListener("pointermove", move)
        stage.addEventListener("pointerleave", leave)
        return () => {
          stage.removeEventListener("pointermove", move)
          stage.removeEventListener("pointerleave", leave)
        }
      })
    },
    { scope: root },
  )

  // Highlight the active group's orbit and bring its skills into the panel.
  useGSAP(
    () => {
      const title = GROUPS[active].title
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const d = reduce ? 0 : 0.5
      gsap.utils.toArray<HTMLElement>(".orbit-track").forEach((ring) => {
        const on = ring.dataset.title === title
        gsap.to(ring, { opacity: on ? 1 : 0.28, duration: d, overwrite: "auto" })
        gsap.to(ring.querySelectorAll(".planet-bubble"), {
          scale: on ? 1.18 : 1,
          duration: d,
          ease: "back.out(2)",
          overwrite: "auto",
        })
      })
      gsap.to(".soft-ring", { opacity: title === SOFT.title ? 1 : 0.35, duration: d, overwrite: "auto" })
      if (!reduce) {
        gsap.fromTo(".panel-item", { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.45 })
        gsap.fromTo(".panel-title", { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5 })
      }
    },
    { scope: root, dependencies: [active] },
  )

  const group = GROUPS[active]
  const pickOrbit = (title: string) => pick(GROUPS.findIndex((g) => g.title === title))

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow="03 — Toolkit" lead="My" accent="Skills Galaxy">
          A dynamic blend of technical and interpersonal abilities — orbiting around innovation, precision and
          creativity.
        </SectionHeading>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          {/* The galaxy. Decorative: the panel and the hidden list carry the same information. */}
          <div className="galaxy relative mx-auto aspect-square w-full max-w-[600px] [perspective:1200px]" aria-hidden="true">
            <div className="galaxy-tilt relative h-full w-full [transform-style:preserve-3d]">
              <div className="pointer-events-none absolute inset-[20%] rounded-full bg-[radial-gradient(circle,rgb(16_185_129/0.25),transparent_70%)]" />

              {/* Soft skills: a ring of text around the outside. */}
              <svg className="soft-ring absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <defs>
                  <path id="soft-path" d="M50,50 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text className="fill-[#c084fc] text-[3.1px] font-semibold uppercase tracking-[0.12em]">
                  <textPath href="#soft-path">{softText + softText}</textPath>
                </text>
              </svg>

              {ORBITS.map((o) => {
                const items = skillClusters.find((c) => c.title === o.title)?.items ?? []
                const size = `${o.radius * 100}%`
                return (
                  <div
                    key={o.title}
                    data-title={o.title}
                    className="orbit-track absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ width: size, height: size }}
                  >
                    <div
                      className="orbit absolute inset-0 rounded-full border border-dashed"
                      style={{ borderColor: `${o.color}66` }}
                      data-period={o.period}
                      data-dir={o.dir}
                    >
                      {items.map((name, k) => {
                        const angle = (k / items.length) * Math.PI * 2 + o.radius * 5
                        const icon = iconFor(name)
                        return (
                          <button
                            key={name}
                            type="button"
                            tabIndex={-1}
                            onClick={() => pickOrbit(o.title)}
                            className="absolute -translate-x-1/2 -translate-y-1/2"
                            style={{ left: `${50 + 50 * Math.cos(angle)}%`, top: `${50 + 50 * Math.sin(angle)}%` }}
                            title={name}
                          >
                            <span className="planet-face block">
                              <span
                                className="planet-bubble grid h-7 w-7 place-items-center rounded-full border bg-neutral-900 sm:h-10 sm:w-10 lg:h-11 lg:w-11"
                                style={{ borderColor: `${o.color}99`, boxShadow: `0 0 18px ${o.color}40` }}
                              >
                                {icon ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={icon.src}
                                    alt=""
                                    width={22}
                                    height={22}
                                    loading="lazy"
                                    className={`h-4 w-4 sm:h-6 sm:w-6 ${icon.invert ? "dark:invert" : ""}`}
                                  />
                                ) : (
                                  <span className="text-[9px] font-bold sm:text-xs" style={{ color: o.color }}>
                                    {name.slice(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* The core. */}
              <div className="core absolute left-1/2 top-1/2 grid aspect-square w-[16%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold text-[#fff] shadow-[0_0_60px_rgb(20_184_166/0.6)] sm:text-xl">
                <span className="absolute inset-0 animate-ping rounded-full bg-purple-500/30" />
                SA
              </div>
            </div>
          </div>

          {/* Panel: pick a group; its orbit lights up and its skills are listed. */}
          <div>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Skill groups">
              {GROUPS.map((g, i) => (
                <button
                  key={g.title}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => pick(i)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active === i ? "border-transparent bg-white text-black" : "border-white/15 text-gray-300 hover:border-white/40"
                  }`}
                >
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                  {g.title}
                </button>
              ))}
            </div>

            <div className="mt-8 min-h-[16rem]" role="tabpanel" aria-live="polite">
              <div className="overflow-hidden">
                <h3 className="panel-title text-4xl font-bold tracking-tight md:text-5xl" style={{ color: group.color }}>
                  {group.title}
                </h3>
              </div>
              <p className="mt-2 text-gray-400">
                {group.items.length} {group.title === SOFT.title ? "ways I work with people" : "tools in this orbit"}
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {group.items.map((name) => {
                  const icon = iconFor(name)
                  return (
                    <li
                      key={name}
                      className="panel-item flex items-center gap-3 rounded-2xl border border-white/10 bg-neutral-900/60 p-3 text-sm font-medium md:text-base"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5">
                        {icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={icon.src} alt="" width={22} height={22} className={icon.invert ? "dark:invert" : ""} />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: group.color }} />
                        )}
                      </span>
                      <span className="leading-snug">{name}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Full list for screen readers (the galaxy is decorative). */}
        <ul className="sr-only">
          {skillClusters.map((c) => (
            <li key={c.title}>
              {c.title}: {c.items.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
