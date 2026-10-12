"use client"

import { useEffect, useRef, useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import "pdfjs-dist/web/pdf_viewer.css"
import { asset } from "@/lib/utils"
import { CV_PATH } from "@/data/portfolio"

const CV_FILENAME = "Sazzad-ALI_CV.pdf"

type Status = "loading" | "ready" | "error"

/**
 * Desktop browsers show the PDF in their own viewer. Touch browsers can't preview PDFs
 * inline (iOS shows page one, Android downloads), so there the CV is drawn page by page
 * with pdf.js, with a selectable text layer and clickable links so it still behaves like a PDF.
 */
export function CvViewer() {
  const router = useRouter()
  const pagesRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>("loading")
  // null until we know whether the browser can show PDFs natively (touch devices can't).
  const [native, setNative] = useState<boolean | null>(null)
  const pdfUrl = asset(CV_PATH)

  useEffect(() => {
    setNative(!window.matchMedia("(pointer: coarse)").matches)
  }, [])

  useEffect(() => {
    if (native !== false) return
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
        const cssScale = width / page.getViewport({ scale: 1 }).width
        const cssViewport = page.getViewport({ scale: cssScale })
        const viewport = page.getViewport({ scale: cssScale * dpr })

        const wrap = document.createElement("div")
        wrap.className = "relative overflow-hidden rounded-lg bg-[#fff] shadow-2xl shadow-black/40"
        wrap.style.width = `${cssViewport.width}px`
        wrap.style.height = `${cssViewport.height}px`

        const canvas = document.createElement("canvas")
        canvas.width = Math.floor(viewport.width)
        canvas.height = Math.floor(viewport.height)
        canvas.className = "block h-full w-full"
        canvas.setAttribute("aria-hidden", "true")
        wrap.appendChild(canvas)

        const textDiv = document.createElement("div")
        textDiv.className = "textLayer"
        textDiv.style.setProperty("--total-scale-factor", String(cssScale))
        textDiv.style.setProperty("--scale-factor", String(cssScale))
        wrap.appendChild(textDiv)
        container.appendChild(wrap)

        await page.render({ canvas, viewport }).promise
        const text = new pdfjs.TextLayer({
          textContentSource: page.streamTextContent(),
          container: textDiv,
          viewport: cssViewport,
        })
        await text.render()

        // Clickable links (mailto, GitHub, live sites) on top of the text.
        for (const a of await page.getAnnotations()) {
          if (a.subtype !== "Link" || !a.url) continue
          const [x1, y1, x2, y2] = cssViewport.convertToViewportRectangle(a.rect)
          const link = document.createElement("a")
          link.href = a.url
          link.target = "_blank"
          link.rel = "noopener noreferrer"
          link.setAttribute("aria-label", a.url)
          Object.assign(link.style, {
            position: "absolute",
            left: `${Math.min(x1, x2)}px`,
            top: `${Math.min(y1, y2)}px`,
            width: `${Math.abs(x2 - x1)}px`,
            height: `${Math.abs(y2 - y1)}px`,
            zIndex: "2",
          })
          wrap.appendChild(link)
        }
        if (n === 1) setStatus("ready")
      }
    }

    render().catch(() => !cancelled && setStatus("error"))
    return () => {
      cancelled = true
      destroy?.()
    }
  }, [pdfUrl, native])

  // iOS Safari and in-app browsers ignore <a download> on a plain link, so fetch the
  // file and hand it over as a blob: the share sheet where available, else a blob link.
  async function downloadCv(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault()
    try {
      const res = await fetch(pdfUrl)
      if (!res.ok) throw new Error(String(res.status))
      const blob = new Blob([await res.blob()], { type: "application/pdf" })
      const file = new File([blob], CV_FILENAME, { type: "application/pdf" })
      const isTouch = window.matchMedia("(pointer: coarse)").matches
      if (isTouch && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "Sazzad Ali CV" })
        } catch (err) {
          if ((err as Error).name !== "AbortError") throw err
        }
        return
      }
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = CV_FILENAME
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 30_000)
    } catch {
      window.location.assign(pdfUrl)
    }
  }

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
            download={CV_FILENAME}
            onClick={downloadCv}
            aria-label="Download CV"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 text-sm font-semibold text-[#fff]"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </header>

      {native && (
        <iframe
          src={pdfUrl}
          title="Sazzad Ali CV"
          className="block h-[calc(100dvh-4rem)] w-full border-0 bg-[#fff]"
        />
      )}

      <div className={native !== false ? "hidden" : "mx-auto max-w-3xl px-4 py-6"}>
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
