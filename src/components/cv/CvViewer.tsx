"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import { asset } from "@/lib/utils"
import { CV_PATH } from "@/data/portfolio"

type Status = "loading" | "ready" | "error"

/**
 * Mobile browsers can't preview PDFs inline (iOS shows page one, Android downloads),
 * so the CV is rendered page by page onto canvases with pdf.js.
 */
export function CvViewer() {
  const router = useRouter()
  const pagesRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>("loading")
  const pdfUrl = asset(CV_PATH)

  useEffect(() => {
    let cancelled = false
    let destroy: (() => void) | undefined

    async function render() {
      // Legacy build: still runs on older iOS Safari versions.
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs")
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        import.meta.url,
      ).toString()

      const task = pdfjs.getDocument(pdfUrl)
      destroy = () => void task.destroy()
      const pdf = await task.promise
      const container = pagesRef.current
      if (cancelled || !container) return

      const width = container.clientWidth
      const dpr = Math.min(window.devicePixelRatio || 1, 3)
      container.replaceChildren()

      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n)
        if (cancelled) return
        const viewport = page.getViewport({ scale: (width / page.getViewport({ scale: 1 }).width) * dpr })
        const canvas = document.createElement("canvas")
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.className = "block h-auto w-full rounded-lg bg-[#fff] shadow-2xl shadow-black/40"
        canvas.setAttribute("aria-label", `CV page ${n} of ${pdf.numPages}`)
        canvas.setAttribute("role", "img")
        container.appendChild(canvas)
        await page.render({ canvas, viewport }).promise
        if (n === 1) setStatus("ready")
      }
    }

    render().catch(() => !cancelled && setStatus("error"))
    return () => {
      cancelled = true
      destroy?.()
    }
  }, [pdfUrl])

  // Return to the portfolio if we came from it; otherwise (direct link) go home.
  function goBack() {
    const fromSite = document.referrer && new URL(document.referrer).origin === window.location.origin
    if (fromSite && window.history.length > 1) router.back()
    else router.push("/")
  }

  return (
    <main className="min-h-dvh bg-black text-white">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-60" />
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gray-400">Sazzad Ali · CV</p>
          <a
            href={pdfUrl}
            download="Sazzad-ALI_CV.pdf"
            aria-label="Download CV"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-[#fff]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6">
        {status === "loading" && (
          <p role="status" className="flex items-center justify-center gap-2 py-24 text-gray-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading CV…
          </p>
        )}
        {status === "error" && (
          <div role="alert" className="py-24 text-center text-gray-300">
            <p>Couldn&apos;t load the preview.</p>
            <a href={pdfUrl} className="mt-3 inline-block text-purple-400 underline underline-offset-4">
              Open the PDF instead
            </a>
          </div>
        )}
        <div ref={pagesRef} className="space-y-4" />
      </div>
    </main>
  )
}
