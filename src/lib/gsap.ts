"use client"

import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollSmoother } from "gsap/ScrollSmoother"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { SplitText } from "gsap/SplitText"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"

if (typeof window !== "undefined") {
  gsap.registerPlugin(
    useGSAP,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    DrawSVGPlugin,
  )
  gsap.defaults({ ease: "power3.out", duration: 1 })
}

/** Media query shared by every component so motion can be switched off in one place. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)"

/** Scroll to a section, going through ScrollSmoother when it is active. */
export function scrollToTarget(target: string | number) {
  const smoother = ScrollSmoother.get()
  if (smoother) {
    smoother.scrollTo(target, true, typeof target === "number" ? undefined : "top 80px")
    return
  }
  gsap.to(window, {
    duration: 1.2,
    ease: "power3.inOut",
    scrollTo: typeof target === "number" ? target : { y: target, offsetY: 80 },
  })
}

export { gsap, useGSAP, ScrollTrigger, ScrollSmoother, SplitText }
