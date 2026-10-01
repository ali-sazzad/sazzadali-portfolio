"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Download, Github, Linkedin, Mail, MousePointer2 } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { projects, roles, socials } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { SydneyTime } from "./Nav"

const featured = projects.find((p) => p.slug === "hotel-hera-lodge")!

const connect = [
  { href: socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: socials.github, label: "GitHub", Icon: Github },
  { href: socials.email, label: "Email", Icon: Mail },
]

/**
 * Hero as a bento of solid tiles: the name tile leads (largest), with live Sydney time,
 * the motto, a featured project and quick links around it. Tile size = importance.
 */
export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  // Everything is prepared on mount while the preloader still covers the page; when the
  // curtain lifts, the intro only has to play.
  useGSAP(
    () => {
      gsap.set(".hero-grid", { autoAlpha: 1 })
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        const name = SplitText.create(".hero-name", { type: "chars", mask: "chars" })

        const tl = (intro.current = gsap
          .timeline({ paused: true, defaults: { ease: "expo.out" } })
          .from(".tile", { y: 28, autoAlpha: 0, scale: 0.97, stagger: 0.07, duration: 1 })
          .from(name.chars, { yPercent: 110, stagger: 0.035, duration: 1.1 }, 0.25)
          .from(".hero-line", { y: 14, autoAlpha: 0, stagger: 0.08, duration: 0.8 }, "-=0.7"))

        // Live text edit: a collaborator types each role, keyboard-selects it (highlight sweeps
        // back across the word) and types the next.
        const text = root.current!.querySelector<HTMLElement>(".hero-role-text")!
        const highlight = root.current!.querySelector<HTMLElement>(".role-highlight")!
        text.textContent = ""
        gsap.to(".role-caret", { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)" })

        let current: gsap.core.Timeline | null = null
        const edit = (i: number) => {
          const role = roles[i % roles.length]
          const t = (current = gsap.timeline({ onComplete: () => edit(i + 1) }))
          ;[...role].forEach((ch) => {
            t.call(
              () => {
                const s = document.createElement("span")
                s.className = "inline-block"
                s.textContent = ch === " " ? " " : ch
                text.appendChild(s)
                gsap.from(s, { yPercent: 35, opacity: 0, duration: 0.18, ease: "power2.out" })
              },
              undefined,
              `+=${gsap.utils.random(0.045, 0.13)}`,
            )
          })
          t.to(highlight, { width: () => text.offsetWidth, duration: 0.45, ease: "power2.inOut" }, "+=1.8")
            .to({}, { duration: 0.35 })
            .call(() => {
              text.textContent = ""
              gsap.set(highlight, { width: 0 })
            })
            .to({}, { duration: 0.15 })
        }
        tl.call(() => edit(0), undefined, 1.2)

        return () => current?.kill()
      })

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-role-text", { textContent: roles[0] })
        gsap.set(".role-caret, .role-collab", { autoAlpha: 0 })
      })
    },
    { scope: root },
  )

  useGSAP(
    () => {
      if (ready) intro.current?.play()
    },
    { dependencies: [ready] },
  )

  return (
    <section ref={root} id="top" className="relative px-4 pb-8 pt-24 md:px-10 md:pt-28">
      <div className="hero-grid invisible mx-auto grid max-w-6xl gap-4 lg:grid-cols-12">
        {/* Name tile — the lead. */}
        <div className="tile @container relative flex min-h-[460px] flex-col justify-between rounded-[24px] bg-artboard p-7 md:p-12 lg:col-span-8 lg:row-span-2">
          <div>
            <p className="hero-line mb-2 text-lg text-muted md:text-xl">Hi, I&apos;m</p>
            <h1
              className="hero-name whitespace-nowrap font-display font-bold leading-[0.9] tracking-[-0.04em] [font-size:clamp(3rem,27cqi,11rem)] [&>div]:align-top"
              style={{ fontVariationSettings: '"wdth" 82' }}
            >
              Sazzad Ali
            </h1>

            {/* The role is a live text layer: typed, selected and retyped by a collaborator cursor. */}
            <p className="hero-line mt-6 text-2xl font-medium leading-snug md:text-3xl">
              <span className="sr-only">Web developer, UI designer, programmer and AI enthusiast</span>
              <span className="inline-flex items-baseline" aria-hidden="true">
                <span className="relative inline-block min-h-[1.35em]">
                  <span className="role-highlight absolute inset-y-0 right-0 w-0 bg-select/35" />
                  <span className="hero-role-text relative">{roles[0]}</span>
                </span>
                <span className="relative inline-block">
                  <span className="role-caret ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.14em] bg-select" />
                  <span className="role-collab pointer-events-none absolute left-1 top-[85%] flex items-start">
                    <MousePointer2 className="h-4 w-4 fill-sand stroke-sand" />
                    <span className="mt-3 rounded-[4px] rounded-tl-none bg-sand px-1.5 py-0.5 text-[11px] font-semibold leading-none text-on-sand">
                      Sazzad
                    </span>
                  </span>
                </span>
              </span>
            </p>
            <p className="hero-line mt-6 text-xl text-muted md:text-2xl">from Sydney, Australia</p>
          </div>

          <div className="hero-line mt-10 flex flex-wrap items-center gap-3">
            <a
              href={socials.email}
              className="flex items-center gap-2 rounded-full bg-select px-6 py-3.5 font-semibold text-on-select transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email me
            </a>
            <a
              href={asset("/Sazzad-ALI_CV.pdf")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold ring-1 ring-ink/25 transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-select"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Preview CV
            </a>
          </div>
        </div>

        {/* Live Sydney time + availability. */}
        <div className="tile flex min-h-[180px] flex-col justify-between rounded-[24px] bg-artboard-alt p-7 lg:col-span-4">
          <p className="flex items-center gap-2 text-sm font-medium text-teal">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-teal" />
            </span>
            Open to collaborations
          </p>
          <div>
            <p className="text-sm text-muted">Local time in Sydney</p>
            <p className="font-display text-5xl font-semibold tracking-tight md:text-6xl">
              <SydneyTime />
            </p>
          </div>
        </div>

        {/* Motto. */}
        <div className="tile flex min-h-[200px] items-end rounded-[24px] bg-sand p-7 text-on-sand lg:col-span-4">
          <p className="font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em]">
            One line of code at a time.
          </p>
        </div>

        {/* Featured project. */}
        <Link
          href={`/work/${featured.slug}`}
          data-cursor="Open"
          className="tile group relative min-h-[280px] overflow-hidden rounded-[24px] bg-artboard lg:col-span-8"
        >
          <Image
            src={asset(featured.image!)}
            alt=""
            fill
            sizes="(min-width: 1024px) 760px, 100vw"
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-[#0b1220] from-15% via-[#0b1220]/80 via-45% to-[#0b1220]/10" />
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-[#f4f1ea]">
            <span>
              <span className="block text-sm font-medium text-[#e2b26a]">Featured project</span>
              <span className="mt-1 block font-display text-3xl font-semibold tracking-tight">{featured.title}</span>
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f4f1ea] text-[#0b1220] transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </span>
        </Link>

        {/* Quick links. */}
        <div className="tile flex flex-col justify-between gap-6 rounded-[24px] bg-artboard p-7 lg:col-span-4">
          <p className="font-display text-2xl font-semibold tracking-tight">Find me online</p>
          <div className="grid grid-cols-3 gap-3">
            {connect.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-artboard-alt text-sm font-medium transition-colors hover:bg-select hover:text-on-select focus-visible:outline-2 focus-visible:outline-select"
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => scrollToTarget("#about")}
        className="sr-only focus:not-sr-only focus:absolute focus:bottom-2 focus:left-1/2"
      >
        Skip to About
      </button>
    </section>
  )
}
