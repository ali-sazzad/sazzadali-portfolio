"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import { projects, type Project } from "@/data/portfolio"
import { asset } from "@/lib/utils"
import { SectionHeader } from "./SectionHeader"

// Asymmetric 12-column rhythm (desktop): wide/narrow pairs with staggered offsets.
const LAYOUT = [
  "md:col-span-8",
  "md:col-span-4 md:mt-24",
  "md:col-span-5",
  "md:col-span-7 md:mt-16",
  "md:col-span-6",
  "md:col-span-6 md:mt-20",
  "md:col-span-4",
  "md:col-span-8 md:mt-20",
]

const shipped = projects.filter((p) => !p.comingSoon).length

export function Projects() {
  return (
    <section id="projects" className="relative px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Selected work"
          aside={<>{shipped} projects: client sites, experiments and small tools. Open one for the case study.</>}
        />

        <div className="grid gap-x-6 gap-y-14 md:grid-cols-12">
          {projects.map((project, i) => (
            <div key={project.slug} className={LAYOUT[i % LAYOUT.length]}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { slug, title, image, tags, link, github, comingSoon, caseStudy } = project

  if (comingSoon) {
    return (
      <div className="grid min-h-[220px] place-items-center rounded-[24px] border-2 border-dashed border-ink/25 p-8 text-center">
        <p className="font-display text-2xl font-semibold tracking-tight text-muted">Next project in progress</p>
      </div>
    )
  }

  const meta = [caseStudy?.type, caseStudy?.year].filter(Boolean).join(", ")

  return (
    <article className="group">
      <Link
        href={`/work/${slug}`}
        data-cursor="Open"
        aria-label={`${title} case study`}
        className="relative block aspect-[16/10] overflow-hidden rounded-[24px] bg-artboard focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-select"
      >
        <Image
          src={asset(image!)}
          alt=""
          fill
          sizes="(min-width: 768px) 66vw, 100vw"
          className="object-cover object-top grayscale-[30%] transition duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
        />
        <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-[#f4f1ea] text-[#0b1220] opacity-0 transition duration-500 group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
        </span>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4 border-t-2 border-ink pt-4">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight">
            <Link href={`/work/${slug}`} className="hover:text-select">
              {title}
            </Link>
          </h3>
          {meta && <p className="mt-1 text-sm text-muted">{meta}</p>}
          <p className="mt-2 text-sm">{tags.join(", ")}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} source on GitHub`}
              className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-canvas"
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
              className="grid h-10 w-10 place-items-center rounded-full ring-1 ring-ink/20 transition-colors hover:bg-ink hover:text-canvas"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
