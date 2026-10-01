"use client"

import type { MouseEvent, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { asset } from "@/lib/utils"
import { CV_PATH } from "@/data/portfolio"

/** Phones and tablets can't preview a PDF inline, so they get the in-site /cv viewer. */
const HANDHELD = "(max-width: 767px), (pointer: coarse)"

/** Opens the CV PDF in a new tab on desktop, and the /cv preview page on handheld devices. */
export function CvLink({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter()

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || !window.matchMedia(HANDHELD).matches) return
    e.preventDefault()
    router.push("/cv")
  }

  return (
    <a href={asset(CV_PATH)} target="_blank" rel="noopener noreferrer" onClick={onClick} className={className}>
      {children}
    </a>
  )
}
