"use client"

import { useState } from "react"
import { gsap, useGSAP, ScrollSmoother, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { Preloader } from "./Preloader"
import { Cursor } from "./Cursor"
import { Background } from "./Background"
import { Nav } from "./Nav"
import { Hero } from "./Hero"
import { About } from "./About"
import { Projects } from "./Projects"
import { Skills } from "./Skills"
import { BackToTop, Contact, Footer } from "./Contact"

/**
 * Creates ScrollSmoother. It is rendered before every other component, so its layout
 * effect runs first and all later ScrollTriggers (including pins) see the smoothed scroller.
 */
function SmoothScroller({ ready }: { ready: boolean }) {
  useGSAP(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.scrollTo(0, 0)

    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const smoother = ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: 1.2,
        effects: true,
        smoothTouch: 0.1,
      })
      smoother.paused(true)
      return () => smoother.kill()
    })
  })

  useGSAP(
    () => {
      // Positions were already measured on `load` (before the preloader started), so a
      // refresh here would only cause a hitch right as the curtain lifts.
      if (!ready) return
      ScrollSmoother.get()?.paused(false)
      // Arriving with a hash (e.g. "All work" from a case study): go to that section.
      const hash = window.location.hash
      if (hash && document.querySelector(hash)) requestAnimationFrame(() => scrollToTarget(hash))
    },
    { dependencies: [ready] },
  )

  return null
}

export function Portfolio() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <SmoothScroller ready={ready} />
      <Preloader onReveal={() => setReady(true)} />
      <Cursor />
      <Background />
      <Nav ready={ready} />
      <BackToTop />

      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">
          <main>
            <Hero ready={ready} />
            <About />
            <Projects />
            <Skills />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
