"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

/** Pulls its child towards the pointer and springs back with an elastic ease on leave. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia()
      mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const el = ref.current!
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" })
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" })

        const move = contextSafe!((e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          xTo((e.clientX - (r.left + r.width / 2)) * strength)
          yTo((e.clientY - (r.top + r.height / 2)) * strength)
        })
        const leave = contextSafe!(() => {
          gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" })
        })

        el.addEventListener("pointermove", move)
        el.addEventListener("pointerleave", leave)
        return () => {
          el.removeEventListener("pointermove", move)
          el.removeEventListener("pointerleave", leave)
        }
      })
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="inline-block will-change-transform">
      {children}
    </div>
  )
}
