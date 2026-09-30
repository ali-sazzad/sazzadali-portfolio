"use client"

import { useRef } from "react"
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"
import { deviconUrl, techIcons } from "@/data/portfolio"

const INVERT = new Set(["nextjs", "express", "vercel"])
const FLOATERS = techIcons.slice(0, 18)

/**
 * Fixed background: drifting gradient orbs that react to the pointer, a subtle grid and
 * tech logos rising endlessly with randomised GSAP tweens.
 */
export function Background() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        // Rising logos — each gets its own randomised loop.
        gsap.utils.toArray<HTMLElement>(".floater").forEach((el) => {
          gsap.set(el, {
            left: `${gsap.utils.random(0, 95)}%`,
            y: window.innerHeight + 80,
            scale: gsap.utils.random(0.6, 1.3),
          })
          gsap.to(el, {
            y: -120,
            rotation: gsap.utils.random(-90, 90),
            duration: gsap.utils.random(18, 32),
            ease: "none",
            repeat: -1,
            delay: gsap.utils.random(0, 20),
            repeatRefresh: true,
          })
          gsap.to(el, {
            x: "random(-60, 60)",
            duration: "random(3, 6)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          })
        })

        // Orbs wander on their own…
        gsap.utils.toArray<HTMLElement>(".orb").forEach((orb) => {
          gsap.to(orb, {
            xPercent: "random(-40, 40)",
            yPercent: "random(-40, 40)",
            scale: "random(0.8, 1.3)",
            duration: "random(8, 14)",
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          })
        })

        // …and lean towards the pointer.
        const layer = root.current!.querySelector(".orb-layer")
        const toX = gsap.quickTo(layer, "x", { duration: 2, ease: "power2" })
        const toY = gsap.quickTo(layer, "y", { duration: 2, ease: "power2" })
        const onMove = (e: PointerEvent) => {
          toX((e.clientX / window.innerWidth - 0.5) * 80)
          toY((e.clientY / window.innerHeight - 0.5) * 80)
        }
        window.addEventListener("pointermove", onMove)
        return () => window.removeEventListener("pointermove", onMove)
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="orb-layer absolute inset-0">
        <div className="orb absolute left-[10%] top-[15%] h-[40vmax] w-[40vmax] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="orb absolute right-[5%] top-[40%] h-[35vmax] w-[35vmax] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="orb absolute bottom-[-10%] left-[30%] h-[30vmax] w-[30vmax] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>
      <div className="bg-grid absolute inset-0 opacity-[0.07]" />
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
          className={`floater absolute top-0 opacity-20 ${INVERT.has(slug) ? "invert" : ""}`}
          style={{ transform: "translateY(110vh)" }}
        />
      ))}
    </div>
  )
}
