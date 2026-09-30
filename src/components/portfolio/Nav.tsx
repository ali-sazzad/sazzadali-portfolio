"use client"

import { useRef, useState } from "react"
import { Menu, X } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, scrollToTarget } from "@/lib/gsap"
import { navItems } from "@/data/portfolio"
import { Logo } from "./Logo"

export function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const menuTl = useRef<gsap.core.Timeline>(null)
  const [active, setActive] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useGSAP(
    () => {
      // Scroll progress bar.
      gsap.to(".nav-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      })

      // Hide on scroll down, reveal on scroll up.
      const showNav = gsap
        .from(".site-nav", { yPercent: -110, paused: true, duration: 0.4, ease: "power2.out" })
        .progress(1)
      ScrollTrigger.create({
        start: "top top-=120",
        end: "max",
        onUpdate: (self) => (self.direction === -1 ? showNav.play() : showNav.reverse()),
      })

      // Full-screen mobile menu: circular clip-path reveal + staggered links.
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .set(".mobile-menu", { display: "flex" })
        .fromTo(
          ".mobile-menu",
          { clipPath: "circle(0% at 100% 0%)" },
          { clipPath: "circle(150% at 100% 0%)", duration: 0.9 },
        )
        .from(".mobile-link", { yPercent: 120, stagger: 0.06, duration: 0.7, ease: "expo.out" }, "-=0.4")
    },
    { scope: root },
  )

  // Intro: drop the bar in once the preloader lifts.
  useGSAP(
    () => {
      if (!ready) return
      gsap.from(".nav-item", { y: -30, autoAlpha: 0, stagger: 0.08, duration: 0.8, delay: 0.6 })

      // Highlight whichever section sits under the middle of the viewport.
      const sections = navItems.map((item) => [item, document.getElementById(item.toLowerCase())!] as const)
      const track = () => {
        const mid = window.innerHeight / 2
        const hit = sections.find(([, el]) => {
          const r = el.getBoundingClientRect()
          return r.top <= mid && r.bottom > mid
        })
        setActive(hit ? hit[0] : "")
      }
      ScrollTrigger.create({ start: 0, end: "max", onUpdate: track, onRefresh: track })
    },
    { scope: root, dependencies: [ready] },
  )

  const toggleMenu = (open: boolean) => {
    setMenuOpen(open)
    if (open) menuTl.current?.timeScale(1).play()
    else menuTl.current?.timeScale(1.6).reverse()
  }

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    toggleMenu(false)
    scrollToTarget(id)
  }

  return (
    <div ref={root}>
    <nav
      className="site-nav fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-8">
        <Logo ready={ready} onClick={(e) => go(e, "#top")} />

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item} className="nav-item">
              <a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => go(e, `#${item.toLowerCase()}`)}
                className={`nav-link relative py-1 text-sm uppercase tracking-[0.2em] transition-colors ${
                  active === item ? "text-white" : "text-gray-400 hover:text-white"
                }`}
                data-active={active === item}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="nav-item relative z-10 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20 md:hidden"
          onClick={() => toggleMenu(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="nav-progress absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
    </nav>

      <div className="mobile-menu fixed inset-0 z-40 hidden h-[100dvh] flex-col items-center justify-center gap-6 bg-neutral-950 md:hidden">
        {navItems.map((item) => (
          <div key={item} className="overflow-hidden pb-2">
            <a
              href={`#${item.toLowerCase()}`}
              onClick={(e) => go(e, `#${item.toLowerCase()}`)}
              className="mobile-link block text-5xl font-bold tracking-tight"
            >
              {item}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
