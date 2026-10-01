import type { ReactNode } from "react"

/**
 * Section heading: a bold display title on a solid rule, with an optional aside (a short
 * description or a count) aligned right. No eyebrow labels or numbering.
 */
export function SectionHeader({ title, aside }: { title: string; aside?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-b-2 border-ink pb-5 md:mb-14 md:flex-row md:items-end md:justify-between">
      <h2 className="text-balance font-display text-5xl font-bold leading-[0.95] tracking-[-0.04em] md:text-7xl">
        {title}
      </h2>
      {aside && <div className="max-w-sm text-pretty text-muted md:text-right">{aside}</div>}
    </div>
  )
}
