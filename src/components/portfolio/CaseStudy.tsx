"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Diamond, ExternalLink, Github } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"
import { caseStudies, type Project } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { Artboard } from "./Artboard"
import { Background } from "./Background"
import { CommentPin } from "./CommentPin"
import { Cursor } from "./Cursor"
import { Logo } from "./Logo"
import { SelectionBox, useMeasure } from "./SelectionBox"
import { ThemeToggle } from "./ThemeToggle"

export function CaseStudy({ project }: { project: Project }) {
  const root = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const [shot, setShot] = useState<HTMLDivElement | null>(null)
  const size = useMeasure(shot)
  const cs = project.caseStudy!
  const [w, h] = project.imageSize ?? [1600, 1000]

  const i = caseStudies.findIndex((p) => p.slug === project.slug)
  const prev = caseStudies[(i - 1 + caseStudies.length) % caseStudies.length]
  const next = caseStudies[(i + 1) % caseStudies.length]

  // One entrance: the title rises in and the screenshot's selection draws around it.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const title = SplitText.create(".cs-title", { type: "words,chars", mask: "chars" })
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(title.chars, { yPercent: 110, stagger: 0.02, duration: 1 })
          .from(".cs-fade", { autoAlpha: 0, y: 14, stagger: 0.06, duration: 0.7 }, "-=0.7")
          .from(".sel-top, .sel-bottom", { scaleX: 0, duration: 0.7, ease: "power3.inOut" }, "-=0.4")
          .from(".sel-left, .sel-right", { scaleY: 0, duration: 0.7, ease: "power3.inOut" }, "<")
          .from(".sel-handle", { scale: 0, stagger: 0.03, duration: 0.35, ease: "back.out(3)" }, "-=0.25")
          .from(".sel-size", { autoAlpha: 0, y: -6, duration: 0.35 }, "<0.1")
      })
    },
    { scope: root, dependencies: [project.slug], revertOnUpdate: true },
  )

  return (
    <div ref={root}>
      <Cursor />
      <Background />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 md:px-8">
          <Logo
            ready
            href={asset("/")}
            label="Sazzad Ali, home"
            onClick={(e) => {
              e.preventDefault()
              router.push("/")
            }}
          />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/#projects"
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-canvas transition-colors hover:bg-select hover:text-[#fff]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All work
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 space-y-16 px-4 pb-24 pt-28 md:space-y-20 md:px-10 md:pt-32">
        {/* Title artboard with the project's properties. */}
        <Artboard
          name={project.title}
          aside={
            <nav aria-label="Breadcrumb" className="hidden sm:block">
              <Link href="/#projects" className="hover:text-ink">
                Work
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-ink">{project.title}</span>
            </nav>
          }
        >
          <div className="grid gap-12 px-6 py-14 md:px-16 md:py-20 lg:grid-cols-[1fr_17rem] lg:gap-16">
            <div>
              <h1 className="cs-title text-balance font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-7xl [&_div]:align-top">
                {project.title}
              </h1>
              <p className="cs-fade mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-muted md:text-xl">
                {project.description}
              </p>
              <div className="cs-fade mt-8 flex flex-wrap gap-3">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md bg-select px-5 py-3 font-medium text-[#fff] transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Open live site
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-md px-5 py-3 font-medium ring-1 ring-rule transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-select"
                  >
                    <Github className="h-4 w-4" aria-hidden="true" />
                    View source
                  </a>
                )}
              </div>
            </div>

            <aside aria-label="Project details" className="cs-fade self-start text-sm lg:border-l lg:border-rule lg:pl-8">
              <h2 className="mb-4 font-semibold">Properties</h2>
              <dl className="divide-y divide-rule">
                {[
                  ["Type", cs.type],
                  ["Role", cs.role],
                  ...(cs.year ? [["Year", cs.year]] : []),
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[4.5rem_1fr] gap-3 py-2.5">
                    <dt className="text-muted">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[4.5rem_1fr] gap-3 py-2.5">
                  <dt className="text-muted">Stack</dt>
                  <dd>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tags.map((t) => (
                        <li key={t} className="flex items-center gap-1 rounded-[4px] bg-ink/[0.06] px-2 py-1 text-xs">
                          <Diamond className="h-3 w-3 text-select" aria-hidden="true" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </Artboard>

        {/* The screenshot as a selected frame; the readout is its real rendered size. */}
        {project.image && (
          <section aria-label="Screenshot" className="mx-auto w-full max-w-6xl">
            <div className="mx-auto pb-10" style={{ maxWidth: w }}>
              <SelectionBox size={size} className="block w-full">
                <div ref={setShot} className="relative bg-artboard ring-1 ring-rule">
                  <Image
                    src={asset(project.image)}
                    alt={`${project.title} screenshot`}
                    width={w}
                    height={h}
                    priority
                    sizes={`(min-width: 1200px) ${Math.min(w, 1152)}px, 100vw`}
                    className="block h-auto w-full"
                  />
                </div>
              </SelectionBox>
            </div>
          </section>
        )}

        <Artboard name="Overview">
          <div className="grid gap-12 px-6 py-14 md:px-16 md:py-20 lg:grid-cols-[1fr_20rem] lg:gap-16">
            <div className="max-w-[62ch] space-y-5 text-lg leading-relaxed md:text-xl">
              {cs.overview.map((p) => (
                <p key={p} className="text-pretty">
                  {p}
                </p>
              ))}
            </div>

            {/* What I built, listed like a layers panel. */}
            <div className="self-start">
              <h2 className="mb-3 text-sm font-semibold">What I built</h2>
              <ul className="divide-y divide-rule text-sm ring-1 ring-rule">
                {cs.built.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 px-3 py-2.5">
                    <Diamond className="mt-0.5 h-3.5 w-3.5 shrink-0 text-select" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {cs.note && <CommentPin className="mt-8">{cs.note}</CommentPin>}
            </div>
          </div>
        </Artboard>

        {/* Previous / next case studies. */}
        <nav aria-label="More projects" className="mx-auto grid w-full max-w-6xl gap-6 sm:grid-cols-2">
          {[
            { p: prev, dir: "Previous" as const },
            { p: next, dir: "Next" as const },
          ].map(({ p, dir }) => (
            <Link
              key={dir}
              href={`/work/${p.slug}`}
              data-cursor="Open"
              className={`group block ${dir === "Next" ? "sm:text-right" : ""}`}
            >
              <span className={`mb-2 flex items-center gap-1.5 text-xs text-muted ${dir === "Next" ? "sm:justify-end" : ""}`}>
                {dir === "Previous" && <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />}
                {dir} project
                {dir === "Next" && <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />}
              </span>
              <span className="relative block aspect-[16/9] overflow-hidden bg-artboard ring-1 ring-rule transition-shadow group-hover:ring-[1.5px] group-hover:ring-select">
                {p.image && (
                  <Image src={asset(p.image)} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                )}
              </span>
              <span className="mt-3 block font-display text-2xl font-semibold tracking-tight">{p.title}</span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  )
}
