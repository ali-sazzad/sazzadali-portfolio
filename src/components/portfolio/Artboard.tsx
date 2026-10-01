import type { ReactNode } from "react"
import { Frame } from "lucide-react"

/**
 * A section drawn as an artboard on the canvas: its frame name sits above the top-left
 * corner (as in a design tool), the surface is flat with a hairline edge.
 */
export function Artboard({
  name,
  children,
  className = "",
  bodyClassName = "",
  aside,
}: {
  name: string
  children: ReactNode
  className?: string
  bodyClassName?: string
  /** Optional content aligned right in the frame-name row. */
  aside?: ReactNode
}) {
  return (
    <div className={`artboard mx-auto w-full max-w-6xl ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-4 text-xs text-muted">
        <p className="flex items-center gap-1.5">
          <Frame className="h-3.5 w-3.5" aria-hidden="true" />
          {name}
        </p>
        {aside}
      </div>
      <div className={`artboard-body relative ring-1 ring-rule ${bodyClassName}`}>{children}</div>
    </div>
  )
}

/** Section heading inside an artboard: display face, one colour, no ornament. */
export function ArtboardHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-10 max-w-2xl md:mb-14">
      <h2 className="section-title text-balance font-display text-4xl font-semibold leading-[1.02] tracking-[-0.03em] md:text-6xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-pretty text-lg leading-relaxed text-muted md:text-xl">{children}</p>}
    </div>
  )
}
