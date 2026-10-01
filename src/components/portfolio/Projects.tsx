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
  const [map, setMap] = useState<{ frames: MapFrame[]; view: number }>({ frames: [], view: 0 })

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const track = root.current!.querySelector<HTMLElement>(".projects-track")!

      // Desktop: pin and pan the canvas sideways across the frames, like panning in a design tool.
      mm.add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
        gsap.set(".projects-viewport", { overflow: "visible" })
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)
        const viewport = root.current!.querySelector<HTMLElement>(".minimap-view")!
        const mapWidth = () => root.current!.querySelector<HTMLElement>(".minimap")!.clientWidth

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

  /** Minimap click: scroll to the point where that frame is in view. */
  const jumpTo = (frame: MapFrame, view: number) => {
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
          <div className="projects-track grid gap-12 px-4 md:grid-cols-2 md:px-10 lg:flex lg:w-max lg:gap-16 lg:pl-[max(2.5rem,calc((100vw-72rem)/2))] lg:pr-16">
            {projects.map((project) => (
              <ProjectFrame key={project.title} project={project} />
            ))}
          </div>
        </div>

        {/* Minimap: where you are across the frames; click a frame to jump to it. */}
        <div className={`mx-auto mt-10 w-full max-w-6xl justify-end ${map.frames.length ? "hidden lg:flex" : "hidden"}`}>
          <div className="minimap relative h-10 w-56 bg-artboard ring-1 ring-rule" aria-label="Work minimap">
            {map.frames.map((f, i) => (
              <button
                key={i}
                type="button"
                onClick={() => jumpTo(f, map.view)}
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

function ProjectFrame({ project }: { project: Project }) {
  const { slug, title, description, image, tags, link, github, comingSoon, caseStudy } = project
  return (
    <article className="project-card group lg:w-[430px] lg:shrink-0 xl:w-[470px]">
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
          className="relative block aspect-[16/10] bg-artboard ring-1 ring-rule transition-shadow group-hover:ring-[1.5px] group-hover:ring-select"
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
              <span key={pos} className={`handle ${pos} opacity-0 transition-opacity group-hover:opacity-100`} aria-hidden="true" />
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
