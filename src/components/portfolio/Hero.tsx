"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Github, Linkedin, Mail, MousePointer2 } from "lucide-react"
import { gsap, useGSAP, SplitText, Draggable, ScrollTrigger, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { roles, socials } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { Artboard } from "./Artboard"
import { CommentPin } from "./CommentPin"
import { SelectionBox, useMeasure } from "./SelectionBox"

const socialLinks = [
  { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: socials.github, label: "GitHub", Icon: Github },
  { href: socials.email, label: "Email", Icon: Mail },
]

const MIN_SCALE = 0.55
const clampScale = (s: number, max: number) => Math.min(Math.max(s, MIN_SCALE), max)

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const sel = useRef<HTMLDivElement>(null)
  const corner = useRef<HTMLButtonElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)
  const [nameEl, setNameEl] = useState<HTMLHeadingElement | null>(null)
  const size = useMeasure(nameEl)
  const [redline, setRedline] = useState({ x: 0, y: 0 })

  // Redline from the artboard's left edge to the selection outline — a real measurement.
  useEffect(() => {
    if (!nameEl || !body.current) return
    const measure = () => {
      const b = body.current!.getBoundingClientRect()
      const n = nameEl.getBoundingClientRect()
      setRedline({ x: Math.round(n.left - b.left - 8), y: Math.round(n.top - b.top + n.height / 2) })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(nameEl)
    ro.observe(body.current)
    return () => ro.disconnect()
  }, [nameEl])

  /** Largest scale at which the name still fits its column on one line (read live from the DOM). */
  const maxScale = () => {
    const current = Number(getComputedStyle(nameEl!).getPropertyValue("--name-scale")) || 1
    const column = sel.current!.parentElement!.getBoundingClientRect().width
    const avail = column - 24 // selection outline + corner handle
    return Math.max(MIN_SCALE, current * (avail / nameEl!.offsetWidth))
  }
  const setScale = (s: number) => nameEl?.style.setProperty("--name-scale", String(s))
  // Resizing changes the page height, so re-measure scroll positions once it settles.
  const refreshTimer = useRef<number | undefined>(undefined)
  const refreshLater = () => {
    clearTimeout(refreshTimer.current)
    refreshTimer.current = window.setTimeout(() => ScrollTrigger.refresh(), 300)
  }

  useGSAP(
    () => {
      if (!nameEl) return
      gsap.set(".hero-content", { autoAlpha: 1 })

      // Drag the corner handle to resize the name (a proxy keeps the handle glued to the box).
      const proxy = document.createElement("div")
      let start = { x: 0, s: 1, w: 1, max: 2 }
      const [drag] = Draggable.create(proxy, {
        trigger: corner.current,
        type: "x,y",
        onPress(this: Draggable) {
          const s = Number(getComputedStyle(nameEl).getPropertyValue("--name-scale")) || 1
          start = { x: this.pointerX, s, w: nameEl.offsetWidth, max: maxScale() }
          sel.current!.classList.add("is-resizing")
        },
        onDrag(this: Draggable) {
          setScale(clampScale(start.s * ((start.w + (this.pointerX - start.x)) / start.w), start.max))
        },
        onRelease() {
          sel.current!.classList.remove("is-resizing")
          refreshLater()
        },
      })

      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const name = SplitText.create(".hero-name", { type: "chars", mask: "chars" })

        const tl = (intro.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .from(".hero-hello", { autoAlpha: 0, y: 12, duration: 0.8 })
          .from(name.chars, { yPercent: 110, stagger: 0.035, duration: 1.1 }, "<0.1")
          // The selection draws itself around the name…
          .from(".sel-top, .sel-bottom", { scaleX: 0, duration: 0.7, ease: "power3.inOut" }, "-=0.5")
          .from(".sel-left, .sel-right", { scaleY: 0, duration: 0.7, ease: "power3.inOut" }, "<")
          .from(".sel-handle, .sel-corner-dot", { scale: 0, stagger: 0.03, duration: 0.4, ease: "back.out(3)" }, "-=0.3")
          .from(".sel-size", { autoAlpha: 0, y: -6, duration: 0.4 }, "<0.1")
          // …then the redline measures its distance from the artboard edge.
          .from(".redline-line", { scaleX: 0, duration: 0.6, ease: "power3.inOut" }, "-=0.2")
          .from(".redline-label", { autoAlpha: 0, scale: 0.6, duration: 0.4, ease: "back.out(2)" }, "-=0.2")
          .from(".hero-line", { autoAlpha: 0, y: 16, stagger: 0.08, duration: 0.8 }, "-=0.5")
          .from(".hero-comment .comment-pin", { scale: 0, y: -20, duration: 0.6, ease: "back.out(2.5)" }, "-=0.6")
          .from(".hero-comment .comment-bubble", { autoAlpha: 0, x: -10, duration: 0.5 }, "-=0.3"))

        // A ghost cursor shows the name can be resized: it grabs the handle and tugs once.
        tl.set(".ghost-cursor", { autoAlpha: 1 }, "+=0.2")
          .fromTo(".ghost-cursor", { x: 60, y: 70 }, { x: 0, y: 0, duration: 0.8, ease: "power3.inOut" })
          .to(".ghost-cursor", { scale: 0.85, duration: 0.12 })
          .to(nameEl, { "--name-scale": 1.07, duration: 0.5, ease: "power2.inOut" })
          .to(".ghost-cursor", { x: "+=22", y: "+=10", duration: 0.5, ease: "power2.inOut" }, "<")
          .to(nameEl, { "--name-scale": 1, duration: 0.6, ease: "power2.inOut" })
          .to(".ghost-cursor", { x: "-=22", y: "-=10", duration: 0.6, ease: "power2.inOut" }, "<")
          .to(".ghost-cursor", { scale: 1, autoAlpha: 0, duration: 0.3 })

        // Rotating role, decoded with ScrambleText.
        const roleTl = gsap.timeline({ paused: true, repeat: -1 })
        tl.call(() => roleTl.play(), undefined, 2.2)
        roles.forEach((role) => {
          roleTl
            .to(".hero-role-text", {
              duration: 1.1,
              scrambleText: { text: role, chars: "lowerCase", speed: 0.5, revealDelay: 0.2 },
              ease: "none",
            })
            .to({}, { duration: 2 })
        })
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-role-text", { textContent: roles[0] })
      })

      return () => {
        drag.kill()
      }
    },
    { scope: root, dependencies: [nameEl] },
  )

  useGSAP(
    () => {
      if (ready) intro.current?.play()
    },
    { dependencies: [ready, nameEl] },
  )

  const onCornerKey = (e: React.KeyboardEvent) => {
    if (!nameEl) return
    const s = Number(getComputedStyle(nameEl).getPropertyValue("--name-scale")) || 1
    const step = { ArrowUp: 0.05, ArrowRight: 0.05, ArrowDown: -0.05, ArrowLeft: -0.05 }[e.key]
    if (step) {
      e.preventDefault()
      setScale(clampScale(s + step, maxScale()))
      refreshLater()
    } else if (e.key === "Home") {
      e.preventDefault()
      setScale(1)
      refreshLater()
    }
  }

  const reset = () => {
    if (!nameEl) return
    gsap.to(nameEl, { "--name-scale": 1, duration: 0.6, ease: "power3.inOut", onComplete: refreshLater })
  }

  return (
    <section ref={root} id="top" className="relative flex min-h-[100svh] items-center px-4 pb-16 pt-28 md:px-10">
      <Artboard name="Portfolio" className="hero-content invisible">
        <div ref={body} className="relative grid gap-12 px-6 pb-16 pt-14 md:grid-cols-[1fr_auto] md:px-16 md:pb-20 md:pt-20">
          {/* Redline: distance from the artboard edge to the selected layer. */}
          {redline.x > 0 && (
            <div className="pointer-events-none absolute left-0 hidden h-px md:block" style={{ top: redline.y, width: redline.x }} aria-hidden="true">
              <span className="redline-line absolute inset-0 origin-left bg-redline" />
              <span className="absolute -top-1 left-0 h-[9px] w-px bg-redline" />
              <span className="absolute -top-1 right-0 h-[9px] w-px bg-redline" />
              <span className="redline-label absolute -top-6 left-1/2 -ml-4 w-8 rounded-[3px] bg-redline py-0.5 text-center text-[11px] font-medium tabular-nums text-[#fff]">
                {redline.x}
              </span>
            </div>
          )}

          <div className="@container min-w-0">
            <p className="hero-hello mb-3 text-lg text-muted md:text-xl">Hi, I&apos;m</p>

            <SelectionBox
              ref={sel}
              size={size}
              className="group/sel mb-14"
              corner={
                <button
                  ref={corner}
                  type="button"
                  onKeyDown={onCornerKey}
                  onDoubleClick={reset}
                  data-cursor="Drag"
                  aria-label="Resize the name: drag, or use arrow keys. Home or double-click resets."
                  className="sel-corner absolute -bottom-[22px] -right-[22px] z-10 grid h-7 w-7 cursor-nwse-resize touch-none place-items-center rounded-sm focus-visible:outline-2 focus-visible:outline-select"
                >
                  <span className="sel-corner-dot handle static block" />
                </button>
              }
            >
              <h1
                ref={setNameEl}
                onDoubleClick={reset}
                className="hero-name whitespace-nowrap font-display font-bold leading-[0.9] tracking-[-0.04em] [font-size:calc(var(--name-scale,1)*clamp(3rem,30cqi,13rem))] md:[font-size:calc(var(--name-scale,1)*clamp(3rem,25cqi,13rem))] [&>div]:align-top"
                style={{ fontVariationSettings: '"wdth" 80', "--name-scale": 1 } as React.CSSProperties}
              >
                Sazzad Ali
              </h1>
              <MousePointer2
                className="ghost-cursor invisible pointer-events-none absolute -bottom-6 -right-6 h-6 w-6 fill-ink stroke-canvas"
                aria-hidden="true"
              />
            </SelectionBox>

            <p className="hero-line max-w-xl text-xl leading-snug md:text-2xl" aria-live="polite">
              <span className="hero-role-text font-medium">{roles[0]}</span>{" "}
              <span className="text-muted">based in Sydney, Australia.</span>
            </p>

            <div className="hero-line mt-10 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollToTarget("#contact")}
                className="rounded-md bg-select px-5 py-3 font-medium text-[#fff] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select"
              >
                Get in touch
              </button>
              <a
                href={asset("/Sazzad-ALI_CV.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-5 py-3 font-medium ring-1 ring-rule transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-select"
              >
                <Download className="h-4 w-4" />
                Preview CV
              </a>
              <span className="mx-1 hidden h-6 w-px bg-rule sm:block" aria-hidden="true" />
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-select"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <CommentPin className="hero-comment hero-line max-w-[260px] self-start md:mt-2">
            One line of code at a time.
          </CommentPin>
        </div>
      </Artboard>
    </section>
  )
}
