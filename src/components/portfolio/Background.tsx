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

        // Orbs wander on their own…
        gsap.utils.toArray<HTMLElement>(".orb").forEach((orb) => {
          gsap.to(orb, {
            xPercent: "random(-40, 40)",
            yPercent: "random(-40, 40)",
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
        {/* Soft glows drawn with radial gradients: same look as a heavy blur filter, but
            they composite as plain textures instead of re-running the blur every frame. */}
        <div className="orb absolute left-[0%] top-[0%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.22),transparent_65%)] will-change-transform" />
        <div className="orb absolute right-[-10%] top-[25%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgb(147_51_234/0.22),transparent_65%)] will-change-transform" />
        <div className="orb absolute bottom-[-25%] left-[20%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgb(219_39_119/0.12),transparent_65%)] will-change-transform" />
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
