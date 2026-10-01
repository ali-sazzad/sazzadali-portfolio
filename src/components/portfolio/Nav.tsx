"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother, scrollToTarget, MOTION_OK } from "@/lib/gsap"
import { EMAIL, navItems, socials } from "@/data/portfolio"
import { Logo } from "./Logo"
import { Magnetic } from "./Magnetic"
import { RollText } from "./RollText"
import { ThemeToggle } from "./ThemeToggle"


/** Live Sydney time; rendered client-side only to avoid a hydration mismatch. */
function SydneyTime() {
  const [time, setTime] = useState<string | null>(null)
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Sydney",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 15_000)
    return () => clearInterval(id)
  }, [])
  return <span className="tabular-nums">{time ?? "--:--"}</span>
}

export function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const pill = useRef<HTMLSpanElement>(null)
  const menuTl = useRef<gsap.core.Timeline>(null)
  const [active, setActive] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  const { contextSafe } = useGSAP(
    () => {
      // Scroll progress bar.
      gsap.to(".nav-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      })

      // Condense into a glass bar once the page has scrolled.
      ScrollTrigger.create({ start: 40, end: "max", toggleClass: { targets: ".site-nav", className: "is-scrolled" } })

      // Hide on scroll down, reveal on scroll up.
      const showNav = gsap
        .from(".site-nav", { yPercent: -110, paused: true, duration: 0.45, ease: "power3.out" })
        .progress(1)
      ScrollTrigger.create({
        start: "top top-=160",
        end: "max",
        onUpdate: (self) => (self.direction === -1 ? showNav.play() : showNav.reverse()),
      })

      // Mobile menu: burger morphs to ✕, panel wipes in, content staggers up.
      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
        .to(".burger-top", { y: 3.5, rotate: 45, duration: 0.5 }, 0)
        .to(".burger-bot", { y: -3.5, rotate: -45, duration: 0.5 }, 0)
        .set(".mobile-menu", { display: "flex" }, 0)
        .fromTo(
          ".mobile-menu",
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 },
          0,
        )
        .from(".mobile-link", { yPercent: 120, stagger: 0.07, duration: 0.9, ease: "expo.out" }, 0.45)
        .from(".mobile-meta", { y: 20, autoAlpha: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" }, 0.7)
    },
    { scope: root },
  )

  // Sliding indicator: follows the hovered tab, rests on the active section.
  const moveTo = contextSafe((el: HTMLElement | null) => {
    if (!pill.current) return
    if (!el) {
      gsap.to(pill.current, { autoAlpha: 0, scale: 0.7, duration: 0.35, ease: "power3.out" })
      return
    }
    gsap.to(pill.current, {
      x: el.offsetLeft,
      width: el.offsetWidth,
      autoAlpha: 1,
      scale: 1,
      duration: 0.6,
      ease: "expo.out",
    })
  })
  const activeTab = () => root.current?.querySelector<HTMLElement>(`[data-nav="${active}"]`) ?? null

  useGSAP(() => moveTo(activeTab()), { scope: root, dependencies: [active] })

  // Intro once the preloader lifts.
  useGSAP(
    () => {
      if (!ready) return
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from(".nav-shell", { y: -24, autoAlpha: 0, scale: 0.9, duration: 1, ease: "expo.out", delay: 0.5 })
        gsap.from(".nav-tab", { yPercent: 120, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: "expo.out", delay: 0.7 })
        gsap.from(".nav-side", { autoAlpha: 0, x: 20, stagger: 0.1, duration: 0.8, delay: 0.9 })
      })

      // Track the section under the middle of the viewport.
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
    ScrollSmoother.get()?.paused(open)
    if (open) menuTl.current?.timeScale(1).play()
    else menuTl.current?.timeScale(1.5).reverse()
  }

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (menuOpen) toggleMenu(false)
    scrollToTarget(id)
  }

  return (
    <div ref={root}>
      <header className="site-nav group/nav fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-500">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 transition-[padding] duration-500 group-[.is-scrolled]/nav:py-3 md:px-8">
          <Logo ready={ready} onClick={(e) => go(e, "#top")} />

          {/* Desktop: floating pill with a sliding, colour-inverting indicator. */}
          <nav aria-label="Main" className="hidden md:block">
            <ul
              className="nav-shell relative isolate flex items-center rounded-full border border-rule bg-artboard/80 p-1 backdrop-blur-xl"
              onPointerLeave={() => moveTo(activeTab())}
            >
              <span
                ref={pill}
                className="invisible absolute left-0 top-1 bottom-1 w-0 rounded-full bg-white"
                aria-hidden="true"
              />
              {navItems.map((item) => (
                <li key={item} className="overflow-hidden">
                  <a
                    href={`#${item.toLowerCase()}`}
                    data-nav={item}
                    aria-current={active === item ? "true" : undefined}
                    onClick={(e) => go(e, `#${item.toLowerCase()}`)}
                    onPointerEnter={(e) => moveTo(e.currentTarget)}
                    onFocus={(e) => moveTo(e.currentTarget)}
                    onBlur={() => moveTo(activeTab())}
                    className="nav-tab relative flex items-start gap-1 rounded-full px-4 py-2 text-sm font-medium text-[#fff] mix-blend-difference lg:px-5"
                  >
                    <RollText text={item} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <span className="nav-side hidden items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 lg:flex">
              Sydney <SydneyTime />
            </span>
            <ThemeToggle className="nav-side relative z-10" />
            <div className="nav-side hidden md:block">
              <Magnetic strength={0.3}>
                <a
                  href="#contact"
                  onClick={(e) => go(e, "#contact")}
                  className="group flex items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-semibold text-black transition-colors hover:bg-select hover:text-[#fff]"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <RollText text="Let's talk" />
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-black text-white transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </a>
              </Magnetic>
            </div>

            {/* Mobile burger. */}
            <button
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md md:hidden"
              onClick={() => toggleMenu(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <span className="burger-top absolute left-[calc(50%-10px)] top-[calc(50%-4.5px)] h-0.5 w-5 rounded-full bg-white" />
              <span className="burger-bot absolute left-[calc(50%-10px)] top-[calc(50%+2.5px)] h-0.5 w-5 rounded-full bg-white" />
            </button>
          </div>
        </div>

        <div className="nav-progress absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-select" />
      </header>

      {/* Mobile full-screen menu. */}
      <div
        id="mobile-menu"
        className="mobile-menu fixed inset-0 z-40 hidden h-[100dvh] flex-col justify-between bg-canvas bg-grid px-6 pb-10 pt-28 md:hidden"
      >
        <p className="mobile-meta font-mono text-xs uppercase tracking-[0.3em] text-gray-500">Menu</p>

        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item} className="overflow-hidden border-b border-white/10 pb-2">
              <a
                href={`#${item.toLowerCase()}`}
                onClick={(e) => go(e, `#${item.toLowerCase()}`)}
                className={`mobile-link flex items-baseline justify-between text-5xl font-bold tracking-tight ${
                  active === item ? "text-white" : "text-white/70"
                }`}
              >
                <RollText text={item} hoverClassName="text-select" />
              </a>
            </li>
          ))}
        </ul>

        <div className="space-y-6">
          <a href={socials.email} className="mobile-meta block text-lg text-gray-300 underline-offset-4 hover:underline">
            {EMAIL}
          </a>
          <div className="mobile-meta flex items-center justify-between">
            <div className="flex gap-3">
              {[
                { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
                { href: socials.github, label: "GitHub", Icon: Github },
                { href: socials.email, label: "Email", Icon: Mail },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/15"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-gray-500">
              Sydney <SydneyTime />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
