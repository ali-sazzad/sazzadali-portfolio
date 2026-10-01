"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Diamond, ExternalLink, Frame, Github } from "lucide-react"
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { projects, type Project } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { ArtboardHeading } from "./Artboard"

type MapFrame = { left: number; width: number }

export function Projects() {
  const root = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const mode = useRef<"pan" | "swipe" | null>(null)
  const [map, setMap] = useState<{ frames: MapFrame[]; view: number }>({ frames: [], view: 0 })
  // On touch layouts the frame at the centre of the canvas is the selected one.
  const [selected, setSelected] = useState(-1)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const track = root.current!.querySelector<HTMLElement>(".projects-track")!
      const viewport = root.current!.querySelector<HTMLElement>(".minimap-view")!
      const mapWidth = () => root.current!.querySelector<HTMLElement>(".minimap")!.clientWidth

      // Phones and tablets: the frames are a canvas you swipe across (native scroll-snap).
      // The minimap follows the swipe, and the centred frame shows as selected.
      mm.add("(max-width: 1023px)", () => {
        mode.current = "swipe"
        const cards = () => [...track.querySelectorAll<HTMLElement>(".project-card")]

        const sync = () => {
          gsap.set(viewport, { x: (track.scrollLeft / track.scrollWidth) * mapWidth() })
          const centre = track.scrollLeft + track.clientWidth / 2
          let best = 0
          cards().forEach((c, i) => {
            const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centre)
            const bd = Math.abs(cards()[best].offsetLeft + cards()[best].offsetWidth / 2 - centre)
            if (d < bd) best = i
          })
          setSelected(best)
        }
        const measure = () => {
          const total = track.scrollWidth
          setMap({
            frames: cards().map((c) => ({ left: c.offsetLeft / total, width: c.offsetWidth / total })),
            view: track.clientWidth / total,
          })
          requestAnimationFrame(sync)
        }

        let raf = 0
        const onScroll = () => {
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(sync)
        }
        measure()
        track.addEventListener("scroll", onScroll, { passive: true })
        const ro = new ResizeObserver(measure)
        ro.observe(track)
        return () => {
          mode.current = null
          setSelected(-1)
          track.removeEventListener("scroll", onScroll)
          ro.disconnect()
          cancelAnimationFrame(raf)
        }
      })

      // Desktop: pin and pan the canvas sideways across the frames, like panning in a design tool.
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        mode.current = "pan"
        gsap.set(".projects-viewport", { overflow: "visible" })
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

        // Minimap geometry: each frame and the visible window, as fractions of the track.
        const measureMap = () => {
          const total = track.scrollWidth
          const frames = [...track.querySelectorAll<HTMLElement>(".project-card")].map((c) => ({
            left: c.offsetLeft / total,
            width: c.offsetWidth / total,
          }))
          setMap({ frames, view: window.innerWidth / total })
        }

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".projects-pin",
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onRefresh: (self) => {
              st.current = self
              measureMap()
            },
            onUpdate: (self) => {
              const w = mapWidth()
              gsap.set(viewport, { x: self.progress * w * (1 - window.innerWidth / track.scrollWidth) })
            },
          },
        })
      })
    },
    { scope: root },
  )

  /** Minimap click: bring that frame into view (pan the pinned canvas, or swipe the track). */
  const jumpTo = (index: number, frame: MapFrame, view: number) => {
    if (mode.current === "swipe") {
      const track = root.current!.querySelector<HTMLElement>(".projects-track")!
      const card = track.querySelectorAll<HTMLElement>(".project-card")[index]
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      track.scrollTo({
        left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
        behavior: reduce ? "auto" : "smooth",
      })
      return
    }
    const s = st.current
    if (!s) return
    const progress = Math.min(1, Math.max(0, (frame.left - 0.04) / Math.max(1e-6, 1 - view)))
    scrollToTarget(s.start + progress * (s.end - s.start))
  }

  return (
    <section ref={root} id="projects" className="relative py-16 md:py-24 lg:overflow-x-clip">
      <div className="mx-auto w-full max-w-[calc(72rem+5rem)] px-4 md:px-10">
        <ArtboardHeading title="Selected work">
          Client sites, experiments and small tools. Open a frame for the case study.
        </ArtboardHeading>
      </div>

      <div className="projects-pin lg:py-10">
        <div className="projects-viewport lg:overflow-x-auto">
          <div
            className="projects-track relative flex snap-x snap-mandatory gap-5 overflow-x-auto px-[9vw] pb-6 pt-2 [scrollbar-width:none] md:gap-8 [&::-webkit-scrollbar]:hidden lg:w-max lg:snap-none lg:gap-16 lg:overflow-visible lg:px-0 lg:pb-0 lg:pl-[max(2.5rem,calc((100vw-72rem)/2))] lg:pr-16"
            aria-label="Projects"
          >
            {projects.map((project, i) => (
              <ProjectFrame key={project.title} project={project} selected={selected === i} />
            ))}
          </div>
        </div>

        {/* Minimap: where you are across the frames; tap or click a frame to jump to it. */}
        <div
          className={`mx-auto mt-6 w-full max-w-6xl items-center justify-center gap-4 px-4 lg:mt-10 lg:justify-end lg:px-0 ${
            map.frames.length ? "flex" : "hidden"
          }`}
        >
          <p className="text-xs text-muted lg:hidden">Swipe to pan</p>
          <div className="minimap relative h-10 w-56 bg-artboard ring-1 ring-rule" aria-label="Work minimap">
            {map.frames.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jumpTo(i, f, map.view)}
                aria-label={`Go to ${projects[i].title}`}
                className="absolute inset-y-2 bg-ink/15 transition-colors hover:bg-select/60 focus-visible:outline-2 focus-visible:outline-select"
                style={{ left: `${f.left * 100}%`, width: `${f.width * 100}%` }}
              />
            ))}
            <span
              className="minimap-view pointer-events-none absolute inset-y-0 left-0 ring-[1.5px] ring-select"
              style={{ width: `${map.view * 100}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectFrame({ project, selected }: { project: Project; selected: boolean }) {
  const { slug, title, description, image, tags, link, github, comingSoon, caseStudy } = project
  return (
    <article
      className="project-card group w-[82vw] max-w-[440px] shrink-0 snap-center transition-opacity duration-300 max-lg:opacity-50 max-lg:data-[selected]:opacity-100 md:w-[56vw] lg:w-[430px] lg:max-w-none xl:w-[470px]"
      data-selected={selected || undefined}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
          <Frame className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
          {caseStudy ? (
            <Link href={`/work/${slug}`} className="truncate hover:text-select">
              {title}
            </Link>
          ) : (
            <span className="truncate">{title}</span>
          )}
        </h3>
        <div className="flex shrink-0 items-center gap-1 text-muted">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} source on GitHub`}
              className="grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <Github className="h-4 w-4" />
            </a>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} live site`}
              className="grid h-8 w-8 place-items-center rounded-md transition-colors hover:bg-ink/10 hover:text-ink"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {comingSoon ? (
        <div className="grid aspect-[16/10] place-items-center border-[1.5px] border-dashed border-rule text-sm text-muted">
          Next project in progress
        </div>
      ) : (
        <Link
          href={`/work/${slug}`}
          data-cursor="Open"
          aria-label={`${title} case study`}
          className="relative block aspect-[16/10] bg-artboard ring-1 ring-rule transition-shadow group-hover:ring-[1.5px] group-hover:ring-select group-data-[selected]:ring-[1.5px] group-data-[selected]:ring-select"
        >
          <span className="absolute inset-0 overflow-hidden">
            <Image
              src={asset(image!)}
              alt=""
              fill
              sizes="(min-width: 1280px) 470px, (min-width: 1024px) 430px, (min-width: 768px) 50vw, 100vw"
              className="object-cover object-top"
            />
          </span>
          {/* Selection handles appear on hover, as when a frame is selected. */}
          {["-left-[5px] -top-[5px]", "-right-[5px] -top-[5px]", "-left-[5px] -bottom-[5px]", "-right-[5px] -bottom-[5px]"].map(
            (pos) => (
              <span key={pos} className={`handle ${pos} opacity-0 transition-opacity group-hover:opacity-100 group-data-[selected]:opacity-100`} aria-hidden="true" />
            ),
          )}
        </Link>
      )}

      <p className="mt-4 line-clamp-3 text-muted">{description}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Built with">
        {tags.map((tag) => (
          <li key={tag} className="flex items-center gap-1 rounded-[4px] bg-ink/[0.06] px-2 py-1 text-xs">
            <Diamond className="h-3 w-3 text-select" aria-hidden="true" />
            {tag}
          </li>
        ))}
      </ul>
    </article>
  )
}
