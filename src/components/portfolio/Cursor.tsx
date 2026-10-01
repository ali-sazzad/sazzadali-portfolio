"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/gsap"

/**
 * Follower cursor built on gsap.quickTo. Grows over interactive elements and shows a
 * label over anything with a `data-cursor="Label"` attribute. Fine pointers only.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, autoAlpha: 1 })

      const dotX = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" })
      const dotY = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" })
      const ringX = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" })
      const ringY = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" })

      const move = (e: PointerEvent) => {
        dotX(e.clientX)
        dotY(e.clientY)
        ringX(e.clientX)
        ringY(e.clientY)
      }

      const over = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor]")
        const text = target?.dataset.cursor ?? ""
        label.current!.textContent = text
        // Theme colours read live, so the cursor follows dark/light switches.
        const css = getComputedStyle(document.documentElement)
        const fg = css.getPropertyValue("--fg-rgb").trim().split(/\s+/).join(",")
        const select = css.getPropertyValue("--select").trim()
        gsap.to(ring.current, {
          width: target ? (text ? 96 : 64) : 40,
          height: target ? (text ? 96 : 64) : 40,
          backgroundColor: text ? select : `rgba(${fg},0)`,
          borderColor: target ? select : `rgba(${fg},0.5)`,
          duration: 0.35,
        })
        gsap.to(label.current, { autoAlpha: text ? 1 : 0, duration: 0.2 })
        gsap.to(dot.current, { scale: target ? 0 : 1, duration: 0.2 })
      }

      window.addEventListener("pointermove", move)
      window.addEventListener("pointerover", over)
      return () => {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerover", over)
      }
    })
  })

  return (
    <>
      <div
        ref={ring}
        className="invisible fixed left-0 top-0 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-white/50 pointer-events-none"
        aria-hidden="true"
      >
        <span ref={label} className="invisible text-xs font-semibold uppercase tracking-widest text-on-select" />
      </div>
      <div
        ref={dot}
        className="invisible fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-[#fff] pointer-events-none mix-blend-difference"
        aria-hidden="true"
      />
    </>
  )
}
