"use client"

import type { MouseEvent, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { asset } from "@/lib/utils"

/** Opens the in-site /cv viewer (Back and Download buttons on top) on every device. */
export function CvLink({ className, children }: { className?: string; children: ReactNode }) {
  const router = useRouter()

  function onClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks open the viewer in a new tab as usual.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    router.push("/cv")
  }

  return (
    <a href={asset("/cv/")} onClick={onClick} className={className}>
      {children}
    </a>
  )
}
