"use client"

import { useRef, useState } from "react"
import { Diamond } from "lucide-react"
import { gsap, useGSAP, Flip } from "@/lib/gsap"
import { deviconUrl, skillClusters, skillIcons } from "@/data/portfolio"
import { Artboard, ArtboardHeading } from "./Artboard"

const ALL = "All"
const tiles = skillClusters.flatMap((c) => c.items.map((name) => ({ name, group: c.title })))
const groups = [
  { title: ALL, count: tiles.length },
  ...skillClusters.map((c) => ({ title: c.title, count: c.items.length })),
]

/**
 * The toolkit as a design-system asset library: pick a group in the sidebar and the
 * components re-flow with GSAP Flip (leavers shrink out, the rest glide into place).
 */
export function Skills() {
  const root = useRef<HTMLElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const [active, setActive] = useState(ALL)

  const choose = (group: string) => {
    if (group === active) return
    flipState.current = Flip.getState(".tile")
    setActive(group)
  }

  // After React re-renders the filter, animate from the recorded layout to the new one.
  useGSAP(
    () => {
      const state = flipState.current
      if (!state) return
      flipState.current = null
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
      Flip.from(state, {
        duration: 0.55,
        ease: "power3.inOut",
        absolute: true,
        stagger: 0.015,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.4, delay: 0.15 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.3 }),
      })
    },
    { scope: root, dependencies: [active] },
  )

  return (
    <section ref={root} id="skills" className="relative px-4 py-16 md:px-10 md:py-24">
      <Artboard name="Toolkit">
        <div className="grid gap-10 px-6 py-14 md:px-16 md:py-20">
          <ArtboardHeading title="Tools I build with">
            Languages, frameworks and the habits that hold a project together. Filter by group.
          </ArtboardHeading>

          <div className="grid gap-8 lg:grid-cols-[13rem_1fr]">
            {/* Asset-library sidebar. */}
            <nav aria-label="Skill groups" className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible">
              {groups.map(({ title, count }) => (
                <button
                  key={title}
                  type="button"
                  onClick={() => choose(title)}
                  aria-pressed={active === title}
                  className={`flex shrink-0 items-center justify-between gap-4 rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-select ${
                    active === title ? "bg-select text-[#fff]" : "text-muted hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {title}
                  <span className={`tabular-nums ${active === title ? "text-[#fff]/80" : "text-muted"}`}>{count}</span>
                </button>
              ))}
            </nav>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4" aria-live="polite">
              {tiles.map(({ name, group }) => {
                const icon = skillIcons[name]
                const shown = active === ALL || active === group
                return (
                  <li
                    key={name}
                    data-flip-id={name}
                    className={`tile flex items-center gap-3 p-3.5 ring-1 ring-rule transition-shadow hover:ring-[1.5px] hover:ring-select ${
                      shown ? "" : "hidden"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-ink/[0.06]">
                      {icon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={deviconUrl(icon.slug)}
                          alt=""
                          width={22}
                          height={22}
                          loading="lazy"
                          className={icon.invert ? "dark:invert" : ""}
                        />
                      ) : (
                        <Diamond className="h-4 w-4 text-select" aria-hidden="true" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug">{name}</span>
                      <span className="block truncate text-xs text-muted">{group}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Artboard>
    </section>
  )
}
