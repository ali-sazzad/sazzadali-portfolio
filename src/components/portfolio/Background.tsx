"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { deviconUrl, techIcons } from "@/data/portfolio"

const INVERT = new Set(["nextjs", "express", "vercel"])
const FLOATERS = techIcons.slice(0, 18)

/**
 * Fixed background: the canvas dot grid, with tech logos rising endlessly across it
 * (randomised GSAP loops). Artboards sit above, so logos show in the canvas gaps.
 */
export function Background() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Rising logos — endless loops. fromTo pins the start below the viewport on every
        // repeat, each lap picks a new column/spin, and each loop starts at a random point
        // so the screen is populated from the first frame instead of waiting for delays.
        gsap.utils.toArray<HTMLElement>(".floater").forEach((el) => {
          const newLane = () =>
            gsap.set(el, { left: `${gsap.utils.random(0, 95)}%`, scale: gsap.utils.random(0.6, 1.3) })
          newLane()
          const rise = gsap.fromTo(
            el,
            { y: () => window.innerHeight + 80 },
            {
              y: -120,
              rotation: "random(-180, 180)",
              duration: gsap.utils.random(18, 32),
              ease: "none",
              repeat: -1,
              repeatRefresh: true,
              onRepeat: newLane,
            },
          )
          rise.time(gsap.utils.random(0, rise.duration()))
          gsap.to(el, {
            x: "random(-60, 60)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          })
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* The canvas: a 24px dot grid (the spacing unit everything snaps to). */}
      <div className="bg-dots absolute inset-0" />
      {FLOATERS.map(({ slug, name, variant }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slug}
          src={deviconUrl(slug, variant)}
          alt=""
          title={name}
          width={36}
          height={36}
          loading="lazy"
          className={`floater absolute top-0 opacity-25 ${INVERT.has(slug) ? "dark:invert" : ""}`}
          style={{ transform: "translateY(110vh)" }}
        />
      ))}
    </div>
  )
}
