import type { ReactNode } from "react"

/**
 * A design-tool comment: the author's pin (round, one square corner pointing at the spot
 * it's attached to) and the message bubble beside it.
 */
export function CommentPin({
  initials = "SA",
  author = "Sazzad Ali",
  children,
  className = "",
}: {
  initials?: string
  author?: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure className={`comment flex items-start gap-2.5 ${className}`}>
      <span
        className="comment-pin grid h-9 w-9 shrink-0 place-items-center rounded-full rounded-bl-[3px] bg-note text-sm font-semibold text-[#1c1d20] shadow-md"
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="comment-bubble rounded-lg rounded-tl-[3px] bg-artboard px-3.5 py-2.5 text-sm shadow-lg ring-1 ring-rule">
        <figcaption className="mb-0.5 font-semibold">{author}</figcaption>
        <div className="leading-relaxed text-muted">{children}</div>
      </div>
    </figure>
  )
}
