"use client"

import { useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { gsap, useGSAP } from "@/lib/gsap"
import { THEME_KEY, type Theme } from "@/lib/theme"

const THEME_COLOR: Record<Theme, string> = { dark: "#000000", light: "#fafafa" }

function applyTheme(next: Theme) {
  const root = document.documentElement
  if (next === "light") root.dataset.theme = "light"
  else delete root.dataset.theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next])
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    // Storage can be unavailable (private mode); the switch still works for this visit.
  }
}

/**
 * Sun/moon switch. The icons swap with a GSAP spin, and the new theme spreads out from
 * the button as a growing circle (View Transitions API, with an instant fallback).
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const btn = useRef<HTMLButtonElement>(null)
  const [theme, setTheme] = useState<Theme>("dark")
  const first = useRef(true)

  // Pick up whatever the head script applied.
  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark")
  }, [])

  useGSAP(
    () => {
      const light = theme === "light"
      const duration = first.current ? 0 : 0.6
      first.current = false
      gsap.to(".tt-sun", {
        rotate: light ? 0 : 90,
        scale: light ? 1 : 0,
        autoAlpha: light ? 1 : 0,
        duration,
        ease: "back.out(2)",
      })
      gsap.to(".tt-moon", {
        rotate: light ? -90 : 0,
        scale: light ? 0 : 1,
        autoAlpha: light ? 0 : 1,
        duration,
        ease: "back.out(2)",
      })
    },
    { scope: btn, dependencies: [theme] },
  )

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark"
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!document.startViewTransition || reduced) {
      applyTheme(next)
      setTheme(next)
      return
    }

    const r = btn.current!.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(() => applyTheme(next))
    setTheme(next)
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 750, easing: "cubic-bezier(0.7, 0, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      )
    })
  }

  return (
    <button
      ref={btn}
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      className={`relative grid h-10 w-10 place-items-center rounded-full border border-rule bg-artboard/80 backdrop-blur-md transition-colors hover:border-select ${className}`}
    >
      <Sun className="tt-sun invisible absolute h-[18px] w-[18px] text-amber-500" />
      <Moon className="tt-moon absolute h-[18px] w-[18px] text-ink" />
    </button>
  )
}
