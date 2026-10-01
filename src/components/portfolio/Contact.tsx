"use client"

import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react"
import { ArrowUp, CheckCircle2, ChevronDown, Github, Linkedin, Loader2, Mail, Send } from "lucide-react"
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
    <section ref={root} id="contact" className="relative px-6 py-10 md:py-14">
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
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#a3e635" />
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
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm leading-none text-gray-500">
            <span>Prefer email?</span>
            <a
              href={socials.email}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 py-2.5 leading-none text-gray-200 transition-colors hover:border-purple-400/60 hover:text-purple-400"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
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

const FIELD =
  "w-full rounded-xl border border-white/15 bg-neutral-950 px-4 text-base text-white outline-none transition-[border-color,box-shadow] placeholder:text-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/15"

/** A labelled text input; every field is required unless it says otherwise. */
function Field({ label, className, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-gray-200">
        {label} <span className="text-red-400" aria-hidden="true">*</span>
      </span>
      <input required className={cn(FIELD, "h-12")} {...props} />
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
      <div role="status" className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-neutral-900 p-10 shadow-2xl shadow-black/20">
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
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-6 text-left shadow-2xl shadow-black/20 md:p-10"
    >
      {/* gradient hairline across the top edge */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

      <div className="mb-8 border-b border-white/10 pb-6">
        <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Send me a message</h3>
        <p className="mt-2 text-base text-gray-400">
          Tell me a little about what you need and I&apos;ll get back to you by email.
        </p>
      </div>

      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" autoComplete="given-name" placeholder="Jane" />
        <Field label="Last name" name="lastName" autoComplete="family-name" placeholder="Smith" />
        <Field label="Email address" name="email" type="email" autoComplete="email" placeholder="jane@company.com" className="sm:col-span-2" />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-gray-200">
          What can I help with? <span className="text-red-400" aria-hidden="true">*</span>
        </span>
        <span className="relative block">
          <select
            name="enquiryType"
            required
            value={type ?? ""}
            onChange={(e) => setType((e.target.value || null) as typeof type)}
            className={cn(FIELD, "h-12 cursor-pointer appearance-none pr-11", !type && "text-gray-500")}
          >
            <option value="" disabled>
              Choose a topic…
            </option>
            {ENQUIRY_TYPES.map((option) => (
              <option key={option} value={option} className="bg-neutral-900 text-white">
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </label>

      <label className="mt-7 block">
        <span className="mb-2 flex items-baseline justify-between gap-4 text-sm font-medium text-gray-200">
          <span>
            Message {somethingElse && <span className="text-red-400" aria-hidden="true">*</span>}
          </span>
          <span className="text-xs font-normal text-gray-500">{somethingElse ? "Required" : "Optional"}</span>
        </span>
        <textarea
          name="notes"
          rows={5}
          required={somethingElse}
          placeholder={somethingElse ? "What can I help you with?" : "A few words about your project, timeline or budget…"}
          className={cn(FIELD, "resize-y py-3 leading-relaxed")}
        />
      </label>

      <div className="mt-8 flex flex-col-reverse gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          {status === "error" ? (
            <p role="alert" className="text-red-400">
              Something went wrong. Please try again or email me directly.
            </p>
          ) : (
            <p className="text-gray-500">Your details are only used to reply to you.</p>
          )}
        </div>
        <Magnetic strength={0.3}>
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3.5 text-base font-semibold text-[#fff] shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-purple-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {status === "sending" ? "Sending…" : "Send message"}
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
