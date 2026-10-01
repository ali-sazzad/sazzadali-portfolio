"use client"

import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react"
import { ArrowUp, CheckCircle2, Github, Linkedin, Loader2, Mail, Send } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { EMAIL, socials } from "@/data/portfolio"
import { cn } from "@/lib/utils"
import { Magnetic } from "./Magnetic"

export function Contact() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const title = SplitText.create(".contact-title", { type: "chars", mask: "chars" })

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } })
          .from(title.chars, {
            yPercent: 120,
            rotate: 10,
            stagger: { each: 0.035, from: "center" },
            duration: 1.1,
            ease: "expo.out",
          })
          .from(".contact-underline", { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.5)
          .from(".contact-copy > *", { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1 }, 0.4)
          .from(".contact-cta", { y: 50, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.7)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-purple-400">04 — Get in touch</p>
        <div className="relative mb-12 inline-block">
          <h2 className="contact-title text-5xl font-bold tracking-tight md:text-8xl">Let&apos;s Connect</h2>
          <svg
            className="absolute -bottom-4 left-0 w-full"
            viewBox="0 0 400 20"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="underline-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <path
              className="contact-underline"
              d="M2 14 C 60 4, 120 18, 200 10 S 340 4, 398 12"
              stroke="url(#underline-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="contact-copy space-y-6 text-lg leading-relaxed text-gray-300 md:text-xl">
          <p>
            Looking for someone who can <span className="font-semibold text-white">design</span>,{" "}
            <span className="font-semibold text-white">develop</span> and{" "}
            <span className="font-semibold text-white">deliver</span>? I&apos;m always open to collaborating on{" "}
            <span className="font-semibold text-white">innovative projects</span> that push boundaries and make an
            impact.
          </p>
          <p className="text-gray-400">
            Ready to bring your ideas to life? Drop me a line with your project details and let&apos;s build something
            amazing together.
          </p>
        </div>

        <div className="contact-cta mt-14">
          <EnquiryForm />
          <p className="mt-6 text-sm text-gray-500">
            Prefer email?{" "}
            <a href={socials.email} className="inline-flex items-center gap-1.5 text-gray-300 underline-offset-4 hover:text-purple-400 hover:underline">
              <Mail className="h-4 w-4" />
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

const ENQUIRY_TYPES = [
  "Website Design & Development",
  "UI/UX Design",
  "Collaboration on Projects",
  "Website Projects Implementation",
  "Help with Personal Portfolio",
  "Something else",
] as const

/**
 * Static-host friendly: posts straight to FormSubmit, which relays the enquiry to EMAIL.
 * (The very first submission triggers a one-time activation email to that inbox.)
 */
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`

type Status = "idle" | "sending" | "sent" | "error"

/** Inline input that sits inside the "letter" sentence, labelled for screen readers. */
function BlankInput({ label, className = "", ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="inline-block align-baseline">
      <span className="sr-only">{label}</span>
      <input
        required
        placeholder={label}
        className={cn(
          "mx-1 border-b-2 border-dashed border-white/25 bg-transparent px-1 pb-0.5 text-center font-semibold text-white outline-none transition-colors placeholder:font-normal placeholder:text-gray-500 focus:border-solid focus:border-purple-400",
          className,
        )}
        {...props}
      />
    </label>
  )
}

function EnquiryForm() {
  const [type, setType] = useState<(typeof ENQUIRY_TYPES)[number] | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const somethingElse = type === "Something else"

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return // bots fill hidden fields; humans don't

    setStatus("sending")
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "First Name": data.firstName,
          "Last Name": data.lastName,
          "Contact Email": data.email,
          "Enquiry Type": type,
          Notes: data.notes || "—",
          _subject: `Portfolio enquiry: ${type} — ${data.firstName} ${data.lastName}`,
          _replyto: data.email,
          _template: "table",
          _captcha: "false",
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || String(json.success) === "false") throw new Error(json.message)
      setStatus("sent")
      form.reset()
      setType(null)
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-purple-400" />
        <p className="text-2xl font-semibold">Message received.</p>
        <p className="mt-2 text-gray-400">Thanks for reaching out. I&apos;ll get back to you soon.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-purple-400 hover:text-pink-400">
          Send another →
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left backdrop-blur md:p-10"
    >
      {/* gradient hairline across the top edge */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
      <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.35em] text-gray-500">New message · to Sazzad</p>

      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <p className="text-xl leading-[2.4] text-gray-300 md:text-2xl md:leading-[2.2]">
        Hi Sazzad, I&apos;m
        <BlankInput label="First name" name="firstName" autoComplete="given-name" className="w-32 md:w-40" />
        <BlankInput label="Last name" name="lastName" autoComplete="family-name" className="w-32 md:w-40" />
        — you can reach me at
        <BlankInput label="you@email.com" name="email" type="email" autoComplete="email" className="w-full max-w-xs md:w-72" />
      </p>

      <fieldset className="mt-8">
        <legend className="mb-3 text-lg text-gray-300 md:text-xl">I&apos;d love to talk about…</legend>
        <div className="flex flex-wrap gap-2">
          {ENQUIRY_TYPES.map((option) => (
            <label key={option} className="cursor-pointer">
              <input
                type="radio"
                name="enquiryType"
                value={option}
                required
                checked={type === option}
                onChange={() => setType(option)}
                className="peer sr-only"
              />
              <span className="block rounded-full border border-white/15 px-4 py-2 text-sm text-gray-300 transition-all hover:border-purple-400/60 hover:text-white peer-checked:border-transparent peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-500 peer-checked:text-[#fff] peer-focus-visible:ring-2 peer-focus-visible:ring-purple-400">
                {option}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-8 block">
        <span className="mb-2 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.3em] text-gray-500">
          Notes {somethingElse ? <span className="text-pink-400">required: tell me what you need</span> : <span>optional</span>}
        </span>
        <textarea
          name="notes"
          rows={3}
          required={somethingElse}
          placeholder={somethingElse ? "What can I help you with?" : "A few words about your project, timeline or budget…"}
          className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-gray-500 focus:border-purple-400"
        />
      </label>

      <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <p aria-live="polite" className="text-sm text-pink-400">
          {status === "error" && "Something went wrong. Please try again or email me directly."}
        </p>
        <Magnetic strength={0.4}>
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-semibold text-[#fff] shadow-xl shadow-purple-500/25 transition-shadow hover:shadow-purple-500/50 disabled:opacity-60"
          >
            {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {status === "sending" ? "Sending…" : "Submit"}
          </button>
        </Magnetic>
      </div>
    </form>
  )
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} Sazzad Ali. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-gray-400 transition-colors hover:text-blue-400">
            <Linkedin className="h-5 w-5" />
          </a>
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-gray-400 transition-colors hover:text-purple-400">
            <Github className="h-5 w-5" />
          </a>
          <a href={socials.email} aria-label="Email" className="text-gray-400 transition-colors hover:text-pink-400">
            <Mail className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export function BackToTop() {
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const show = gsap
      .timeline({ paused: true })
      .fromTo(ref.current, { autoAlpha: 0, scale: 0, rotate: -180 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" })

    ScrollTrigger.create({
      start: 600,
      end: "max",
      onEnter: () => show.play(),
      onLeaveBack: () => show.reverse(),
    })
  })

  return (
    <button
      ref={ref}
      onClick={() => scrollToTarget(0)}
      className="invisible fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-[#fff] shadow-lg"
      aria-label="Back to top"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  )
}
