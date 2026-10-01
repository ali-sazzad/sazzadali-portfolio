"use client"

import { forwardRef, useEffect, useState, type ReactNode } from "react"

const HANDLES = [
  "-left-[5px] -top-[5px]",
  "left-1/2 -ml-[4.5px] -top-[5px]",
  "-right-[5px] -top-[5px]",
  "-right-[5px] top-1/2 -mt-[4.5px]",
  "-left-[5px] top-1/2 -mt-[4.5px]",
  "-left-[5px] -bottom-[5px]",
  "left-1/2 -ml-[4.5px] -bottom-[5px]",
]

/** Measures an element's rendered size (rounded px) and keeps it current on resize. */
export function useMeasure(el: HTMLElement | null) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const b = entry.borderBoxSize?.[0]
      setSize({
        w: Math.round(b ? b.inlineSize : el.offsetWidth),
        h: Math.round(b ? b.blockSize : el.offsetHeight),
      })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [el])
  return size
}

/**
 * The design-tool selection: an accent outline with square handles around its child and
 * a W × H readout of the child's real rendered size. The bottom-right handle is passed
 * in (`corner`) so a parent can make it interactive.
 */
export const SelectionBox = forwardRef<
  HTMLDivElement,
  { children: ReactNode; size: { w: number; h: number }; corner?: ReactNode; className?: string }
>(function SelectionBox({ children, size, corner, className = "" }, ref) {
  return (
    <div ref={ref} className={`sel relative inline-block ${className}`}>
      {children}
      <span className="sel-edge sel-top pointer-events-none absolute -inset-x-2 -top-2 h-[1.5px] origin-left bg-select" />
      <span className="sel-edge sel-bottom pointer-events-none absolute -inset-x-2 -bottom-2 h-[1.5px] origin-right bg-select" />
      <span className="sel-edge sel-left pointer-events-none absolute -inset-y-2 -left-2 w-[1.5px] origin-bottom bg-select" />
      <span className="sel-edge sel-right pointer-events-none absolute -inset-y-2 -right-2 w-[1.5px] origin-top bg-select" />
      <span className="pointer-events-none absolute -inset-2">
        {HANDLES.map((pos) => (
          <span key={pos} className={`sel-handle handle ${pos}`} />
        ))}
      </span>
      {corner}
      {/* Outer span centres (Tailwind translate); inner span is free for GSAP to animate. */}
      <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2" aria-hidden="true">
        <span className="sel-size block whitespace-nowrap rounded-[3px] bg-select px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-on-select">
          {size.w} × {size.h}
        </span>
      </span>
    </div>
  )
})
