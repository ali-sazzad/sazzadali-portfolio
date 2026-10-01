"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Download, MapPin, Pause, Play } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, Observer, scrollToTarget } from "@/lib/gsap"
import { deviconUrl } from "@/data/portfolio"
import { CvLink } from "./CvLink"
import { SydneyTime } from "./Nav"
import { LINES, pillars, stack, strengths } from "./aboutData"

const STORIES = [
  { label: "about.ts", duration: 6.5 },
  { label: "Profile", duration: 4.5 },
  { label: "Toolkit", duration: 4.5 },
  { label: "My story", duration: 6.5 },
  { label: "How I work", duration: 5.5 },
  { label: "Motto", duration: 6 },
]

/**
 * About, phone edition: a stories deck. Segmented bars auto-advance; swipe or tap the sides to
 * move, press and hold to pause. Each story has its own GSAP entrance, and the deck pauses
 * whenever it's off-screen. The deck keeps a fixed dark palette in both themes, as stories do.
 */
export function AboutStories() {
  const root = useRef<HTMLDivElement>(null)
  const deck = useRef<HTMLDivElement>(null)
  const api = useRef<{ go: (d: 1 | -1) => void; toggle: () => void } | null>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(true)

  useGSAP(
    () => {
      const el = deck.current!
      const slides = gsap.utils.toArray<HTMLElement>(".story", el)
      const fills = gsap.utils.toArray<HTMLElement>(".seg-fill", el)
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const n = slides.length

      let index = 0
      let timer: gsap.core.Tween | null = null
      let entrance: gsap.core.Timeline | null = null
      let inView = false
      let userPaused = reduce // no autoplay with reduced motion
      let holding = false
      let started = false
      let swipedAt = 0
      if (reduce) setPlaying(false)

      // Text splits are prepared once; entrances replay them on every visit.
      const storyWords = SplitText.create(".st-words", { type: "words" }).words
      const mottoChars = SplitText.create(".st-motto", { type: "words,chars", mask: "chars" }).chars // words keep letters together when wrapping

      const q = (i: number, sel: string) => slides[i].querySelectorAll<HTMLElement>(sel)
      const ENTER: ((i: number) => gsap.core.Timeline)[] = [
        // about.ts: type each line (stepped clip = one character per step), then compile.
        (i) => {
          const t = gsap.timeline()
          t.set(q(i, ".st-compiled"), { autoAlpha: 0 })
            .set(q(i, ".st-compiling"), { autoAlpha: 1 })
            .set(q(i, ".st-dot"), { backgroundColor: "#febc2e" })
            .set(q(i, ".st-line"), { clipPath: "inset(0% 100% 0% 0%)" })
          q(i, ".st-line").forEach((line) => {
            const chars = Math.max(1, (line.textContent ?? "").length)
            t.to(line, { clipPath: "inset(0% 0% 0% 0%)", ease: `steps(${chars})`, duration: chars * 0.016 })
          })
          return t
            .to(q(i, ".st-compiling"), { autoAlpha: 0, duration: 0.15 })
            .to(q(i, ".st-compiled"), { autoAlpha: 1, duration: 0.15 }, "<")
            .to(q(i, ".st-dot"), { backgroundColor: "#34d399", duration: 0.15 }, "<")
            .fromTo(q(i, ".st-hint"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 })
        },
        // Profile: avatar pops, details rise in.
        (i) =>
          gsap
            .timeline()
            .fromTo(q(i, ".st-avatar"), { scale: 0.4, rotate: -20 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2)" })
            .fromTo(q(i, ".st-item"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" }, "<0.15"),
        // Toolkit: chips pop, logos tumble in.
        (i) =>
          gsap
            .timeline()
            .fromTo(q(i, ".st-chip"), { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, stagger: 0.08, duration: 0.45, ease: "back.out(2.5)" })
            .fromTo(
              q(i, ".st-logo"),
              { y: 40, rotate: -30, autoAlpha: 0 },
              { y: 0, rotate: 0, autoAlpha: 1, stagger: 0.08, duration: 0.6, ease: "back.out(1.8)" },
              "-=0.15",
            ),
        // My story: words light up in reading order.
        () =>
          gsap
            .timeline()
            .fromTo(storyWords, { opacity: 0.15 }, { opacity: 1, stagger: 0.07, duration: 0.25, ease: "none" }),
        // How I work: the line draws down, each step arrives as it's reached.
        (i) =>
          gsap
            .timeline()
            .fromTo(q(i, ".st-path"), { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.8, ease: "power1.inOut" })
            .fromTo(
              q(i, ".st-step"),
              { x: -24, autoAlpha: 0 },
              { x: 0, autoAlpha: 1, stagger: 0.55, duration: 0.5, ease: "power3.out" },
              0.1,
            ),
        // Motto: letters rise out of their masks, then the actions.
        (i) =>
          gsap
            .timeline()
            .fromTo(mottoChars, { yPercent: 110 }, { yPercent: 0, stagger: 0.025, duration: 0.8, ease: "expo.out" })
            .fromTo(q(i, ".st-cta"), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.5 }, "-=0.3"),
      ]

      const canPlay = () => inView && !userPaused && !holding
      const resume = () => {
        if (canPlay()) timer?.resume()
      }
      const enter = (i: number) => {
        entrance?.kill()
        entrance = reduce ? null : ENTER[i](i)
      }

      const show = (next: number, dir: 1 | -1) => {
        const prev = index
        index = (next + n) % n
        fills.forEach((f, k) => gsap.set(f, { scaleX: k < index ? 1 : 0 }))
        slides.forEach((s, k) => {
          s.inert = k !== index
          s.setAttribute("aria-hidden", String(k !== index))
        })

        if (reduce || prev === index) {
          gsap.set(slides, { autoAlpha: 0 })
          gsap.set(slides[index], { autoAlpha: 1, xPercent: 0, rotateY: 0 })
        } else {
          gsap.to(slides[prev], {
            xPercent: -32 * dir,
            rotateY: 40 * dir,
            autoAlpha: 0,
            duration: 0.45,
            ease: "power2.in",
            overwrite: true,
          })
          gsap.fromTo(
            slides[index],
            { xPercent: 32 * dir, rotateY: -40 * dir, autoAlpha: 0 },
            { xPercent: 0, rotateY: 0, autoAlpha: 1, duration: 0.6, delay: 0.1, ease: "power3.out", overwrite: true },
          )
        }

        setCurrent(index)
        if (started) enter(index)

        timer?.kill()
        timer = gsap.to(fills[index], {
          scaleX: 1,
          duration: STORIES[index].duration,
          ease: "none",
          paused: true,
          onComplete: () => show(index + 1, 1),
        })
        if (reduce) gsap.set(fills[index], { scaleX: 1 })
        else resume()
      }

      const go = (d: 1 | -1) => show(index + d, d)
      api.current = {
        go,
        toggle: () => {
          userPaused = !userPaused
          setPlaying(!userPaused)
          if (userPaused) timer?.pause()
          else resume()
        },
      }

      show(0, 1)

      // Only run while on screen; the first time it appears, play the opening story.
      ScrollTrigger.create({
        trigger: el,
        start: "top 75%",
        end: "bottom 25%",
        onToggle: (self) => {
          inView = self.isActive
          if (inView) {
            if (!started) {
              started = true
              enter(index)
            }
            resume()
          } else timer?.pause()
        },
      })

      // Drag: the story follows the finger, then commits on release if dragged far enough (or
      // flicked fast), otherwise springs back. Direction comes from the real geometry
      // (start vs current position). Horizontal drags only, so page scrolling still works.
      // Press and hold pauses.
      const dragX = (self: Observer) => (self.x ?? 0) - (self.startX ?? 0)
      const obs = Observer.create({
        target: el,
        type: "touch,pointer",
        dragMinimum: 6,
        lockAxis: true,
        onDrag: (self) => {
          if (self.axis !== "x" || reduce) return
          gsap.set(slides[index], { x: dragX(self) * 0.4, rotateY: dragX(self) * 0.04 })
        },
        onDragEnd: (self) => {
          if (self.axis !== "x") return
          const dx = dragX(self)
          swipedAt = Date.now()
          if (Math.abs(dx) > 60 || (Math.abs(dx) > 20 && Math.abs(self.velocityX) > 600)) {
            gsap.set(slides[index], { x: 0 })
            go(dx < 0 ? 1 : -1)
          } else if (!reduce) {
            gsap.to(slides[index], { x: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1, 0.6)" })
          }
        },
        onPress: () => {
          holding = true
          timer?.pause()
        },
        onRelease: () => {
          holding = false
          resume()
        },
      })

      // Tap the left third to go back, anywhere else to go forward. A click whose pointer
      // travelled is a swipe, not a tap (the click can arrive before Observer reports the swipe).
      let down = { x: 0, y: 0 }
      const onDown = (e: PointerEvent) => {
        down = { x: e.clientX, y: e.clientY }
      }
      const onClick = (e: MouseEvent) => {
        if (Date.now() - swipedAt < 400) return
        if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) return
        if ((e.target as HTMLElement).closest("a, button")) return
        const r = el.getBoundingClientRect()
        go(e.clientX < r.left + r.width / 3 ? -1 : 1)
      }
      el.addEventListener("pointerdown", onDown)
      el.addEventListener("click", onClick)

      return () => {
        el.removeEventListener("pointerdown", onDown)
        el.removeEventListener("click", onClick)
        obs.kill()
        timer?.kill()
        entrance?.kill()
      }
    },
    { scope: root },
  )

  return (
    <div ref={root} className="-mx-4 sm:mx-0 lg:hidden">
      <div
        ref={deck}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="About me, in stories"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") api.current?.go(1)
          if (e.key === "ArrowLeft") api.current?.go(-1)
        }}
        className="relative mx-auto h-[min(680px,calc(100svh-17rem))] min-h-[420px] w-full sm:max-w-xl md:max-w-2xl touch-pan-y select-none overflow-hidden rounded-[28px] border border-[#ffffff1a] bg-[#0b0b12] text-[#f8fafc] shadow-2xl shadow-purple-500/20 [perspective:1200px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a78bfa]"
      >
        {/* Header: progress segments, who, which story, pause. */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-[#0b0b12cc] to-transparent px-4 pb-6 pt-3">
          <div className="flex gap-1" aria-hidden="true">
            {STORIES.map((s) => (
              <span key={s.label} className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#ffffff40]">
                <span className="seg-fill block h-full origin-left scale-x-0 rounded-full bg-[#ffffff]" />
              </span>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#3b82f6] via-[#a855f7] to-[#ec4899] text-xs font-bold text-[#fff]">
              SA
            </span>
            <span className="text-sm font-semibold">Sazzad Ali</span>
            <span className="text-sm text-[#ffffffb3]" aria-live="polite">
              {STORIES[current].label}
            </span>
            <button
              type="button"
              onClick={() => api.current?.toggle()}
              aria-label={playing ? "Pause stories" : "Play stories"}
              className="pointer-events-auto ml-auto grid h-9 w-9 place-items-center rounded-full bg-[#ffffff1a] transition-colors hover:bg-[#ffffff33]"
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* 1. about.ts */}
        <section className="story isolate absolute inset-0 flex flex-col px-4 pb-20 pt-24 [@media(max-height:700px)]:pb-16 [@media(max-height:700px)]:pt-20" aria-label={`1 of ${STORIES.length}: about.ts`}>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#3b82f633,transparent_60%)]" />
          <div className="overflow-hidden rounded-2xl border border-[#ffffff14] bg-[#0d1117] shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-[#ffffff14] bg-[#161b22] px-3 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="ml-2 font-mono text-[11px] text-[#8b949e]">about.ts</span>
              <span className="relative ml-auto flex items-center gap-1.5 font-mono text-[11px] text-[#8b949e]">
                <span className="st-dot h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="st-compiling">Compiling…</span>
                <span className="st-compiled invisible absolute right-0 text-[#34d399]">Compiled</span>
              </span>
            </div>
            <pre className="p-3.5 font-mono text-[11px] leading-6 text-[#e5e7eb] [@media(max-height:700px)]:leading-5 sm:text-[13px] md:p-5 md:text-[15px] md:leading-8" aria-hidden="true">
              <code>
                {LINES.map((line, i) => (
                  <span key={i} className="st-line block whitespace-pre-wrap break-words pl-6 [text-indent:-1.5rem]">
                    <span className="mr-2 inline-block w-4 select-none text-right text-[#484f58]">{i + 1}</span>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>
          <p className="st-hint mt-auto text-center text-sm text-[#ffffffb3] [@media(max-height:700px)]:hidden">
            One line of code at a time. Swipe to see what it renders →
          </p>
        </section>

        {/* 2. Profile */}
        <section className="story isolate absolute inset-0 flex flex-col justify-center px-5 pb-20 pt-24 [@media(max-height:700px)]:pb-16 [@media(max-height:700px)]:pt-20" aria-label={`2 of ${STORIES.length}: Profile`}>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,#3b82f659,transparent_55%),radial-gradient(circle_at_80%_80%,#a855f74d,transparent_50%)]" />
          <span className="st-avatar grid h-28 w-28 [@media(max-height:700px)]:h-20 [@media(max-height:700px)]:w-20 place-items-center rounded-[2rem] bg-gradient-to-br from-[#3b82f6] via-[#a855f7] to-[#ec4899] text-4xl font-bold text-[#fff] shadow-2xl shadow-[#a855f766]">
            SA
          </span>
          <h3 className="st-item mt-8 text-5xl [@media(max-height:700px)]:mt-5 font-bold tracking-tight">Sazzad Ali</h3>
          <p className="st-item mt-3 bg-gradient-to-r from-[#60a5fa] to-[#c084fc] bg-clip-text text-xl font-semibold text-transparent">
            Software Engineer &amp; Web Developer
          </p>
          <p className="st-item mt-4 flex items-center gap-2 text-lg text-[#e2e8f0]">
            <MapPin className="h-5 w-5 text-[#f472b6]" aria-hidden="true" />
            Sydney, Australia
          </p>
          <p className="st-item mt-2 font-mono text-sm text-[#94a3b8]">
            Local time <SydneyTime />
          </p>
        </section>

        {/* 3. Toolkit */}
        <section className="story isolate absolute inset-0 flex flex-col justify-center px-5 pb-20 pt-24 [@media(max-height:700px)]:pb-16 [@media(max-height:700px)]:pt-20" aria-label={`3 of ${STORIES.length}: Toolkit`}>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_20%,#a855f759,transparent_55%)]" />
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#c4b5fd]">Strengths</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {strengths.map((s) => (
              <li key={s} className="st-chip rounded-full border border-[#c084fc66] bg-[#a855f726] px-4 py-2 text-base font-medium [@media(max-height:700px)]:py-1.5 [@media(max-height:700px)]:text-sm">
                {s}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-[#93c5fd] [@media(max-height:700px)]:mt-6">Daily stack</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 [@media(max-height:700px)]:gap-2">
            {stack.map(({ slug, name, invert }) => (
              <li key={slug} className="st-logo flex items-center gap-3 rounded-2xl border border-[#ffffff1a] bg-[#ffffff0d] p-3 [@media(max-height:700px)]:p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={deviconUrl(slug)} alt="" width={32} height={32} className={invert ? "invert" : ""} />
                <span className="font-medium">{name}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. My story */}
        <section className="story isolate absolute inset-0 flex flex-col justify-center px-5 pb-20 pt-24 [@media(max-height:700px)]:pb-16 [@media(max-height:700px)]:pt-20" aria-label={`4 of ${STORIES.length}: My story`}>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_80%,#ec48994d,transparent_55%)]" />
          <p className="st-words text-[1.6rem] font-semibold leading-snug tracking-tight [@media(max-height:700px)]:text-[1.3rem]">
            Software engineer and web developer with a passion for building elegant, high-performance digital
            experiences. AI integration, UI/UX design and project management: creativity and precision in every
            project.
          </p>
        </section>

        {/* 5. How I work */}
        <section className="story isolate absolute inset-0 flex flex-col justify-center px-5 pb-20 pt-24 [@media(max-height:700px)]:pb-16 [@media(max-height:700px)]:pt-20" aria-label={`5 of ${STORIES.length}: How I work`}>
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_30%,#3b82f64d,transparent_55%)]" />
          <div className="relative">
            <svg
              className="pointer-events-none absolute bottom-6 left-[19px] top-6 h-[calc(100%-3rem)] w-1"
              viewBox="0 0 4 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                {/* userSpaceOnUse: a straight vertical path has a zero-width bounding box, so a bounding-box gradient would not render. */}
                <linearGradient id="st-grad" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="100">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              <path className="st-path" d="M2 0 V100" stroke="url(#st-grad)" strokeWidth="3" />
            </svg>
            <ol className="space-y-7 [@media(max-height:700px)]:space-y-4">
              {pillars.map(({ Icon, title, text }) => (
                <li key={title} className="st-step relative flex gap-4">
                  <span className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#a855f7]">
                    <Icon className="h-5 w-5 text-[#fff]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight [@media(max-height:700px)]:text-xl">{title}</h3>
                    <p className="mt-1 text-[#cbd5e1] [@media(max-height:700px)]:text-sm">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. Motto */}
        <section className="story isolate absolute inset-0 flex flex-col justify-end bg-gradient-to-br from-[#2563eb] via-[#7c3aed] to-[#db2777] px-6 pb-24 pt-24 [@media(max-height:700px)]:pb-20 [@media(max-height:700px)]:pt-20" aria-label={`6 of ${STORIES.length}: Motto`}>
          <p className="st-motto text-[3.4rem] font-bold leading-[0.95] tracking-[-0.03em] text-[#fff] [&_div]:align-top">
            One line of code at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 [@media(max-height:700px)]:mt-6">
            <button
              type="button"
              onClick={() => scrollToTarget("#contact")}
              className="st-cta rounded-full bg-[#fff] px-6 py-3 font-semibold text-[#111827]"
            >
              Let&apos;s talk
            </button>
            <CvLink className="st-cta flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-[#fff] ring-2 ring-[#ffffffa6]">
              <Download className="h-4 w-4" aria-hidden="true" />
              Preview CV
            </CvLink>
          </div>
        </section>

        {/* Footer: explicit controls (also the accessible way to navigate). */}
        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-4 pb-4">
          <button
            type="button"
            onClick={() => api.current?.go(-1)}
            aria-label="Previous story"
            className="grid h-11 w-11 place-items-center rounded-full bg-[#ffffff1a] transition-colors hover:bg-[#ffffff33]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="font-mono text-sm text-[#ffffffb3]">
            {current + 1} / {STORIES.length}
          </span>
          <button
            type="button"
            onClick={() => api.current?.go(1)}
            aria-label="Next story"
            className="grid h-11 w-11 place-items-center rounded-full bg-[#ffffff1a] transition-colors hover:bg-[#ffffff33]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="mx-auto mt-4 max-w-md px-4 text-center text-sm text-gray-500 sm:px-0">
        Swipe or tap the sides to move between stories. Press and hold to pause.
      </p>
    </div>
  )
}
