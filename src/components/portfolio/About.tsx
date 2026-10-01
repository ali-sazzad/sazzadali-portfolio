"use client"

import { useRef } from "react"
import { MapPin } from "lucide-react"
import { gsap, useGSAP, SplitText, MOTION_OK } from "@/lib/gsap"
import { deviconUrl } from "@/data/portfolio"
import { SectionHeading } from "./SectionHeading"
import { AboutStories } from "./AboutStories"
import { LINES, pillars, stack, strengths } from "./aboutData"


export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Desktop only: phones get the Stories format (AboutStories) instead.
      mm.add(
        `(min-width: 1024px) and ${MOTION_OK}`,
        () => {
          const lines = gsap.utils.toArray<HTMLElement>(".code-line")

          // ── Scene: each line types out (stepped clip = one character per step), then the
          //    part of the card it describes renders. Pinned and scroll-scrubbed.
          gsap.set(lines, { clipPath: "inset(0% 100% 0% 0%)" })
          gsap.set(".card-step", { autoAlpha: 0, y: 18 })
          gsap.set(".profile-card", { autoAlpha: 0.35, scale: 0.96 })

          const scene = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: ".about-scene", start: "center center", end: "+=1500", pin: true, scrub: 0.6, anticipatePin: 1 },
          })

          lines.forEach((line, i) => {
            const chars = Math.max(1, (line.textContent ?? "").length)
            scene.to(line, { clipPath: "inset(0% 0% 0% 0%)", ease: `steps(${chars})`, duration: chars * 0.028 })
            if (i === 0) scene.to(".profile-card", { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.1")
            scene.to(`.card-step-${i}`, { autoAlpha: 1, y: 0, duration: 0.45 }, "<0.15")
            if (i === 3) scene.from(".strength-chip", { scale: 0.6, stagger: 0.08, duration: 0.35, ease: "back.out(2)" }, "<")
            if (i === 4)
              scene.from(".stack-logo", { y: 24, rotate: -20, stagger: 0.07, duration: 0.4, ease: "back.out(2)" }, "<")
          })

          // The closing brace "compiles" the card.
          scene
            .to(".status-compiling", { autoAlpha: 0, duration: 0.2 })
            .to(".status-compiled", { autoAlpha: 1, duration: 0.2 }, "<")
            .to(".status-dot", { backgroundColor: "#34d399", duration: 0.2 }, "<")
            .fromTo(
              ".profile-glow",
              { autoAlpha: 0, scale: 0.8 },
              { autoAlpha: 1, scale: 1, duration: 0.6, ease: "power2.out" },
              "<",
            )
            .from(".motto-underline", { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "<")

          // ── Bio: words light up as the paragraph scrolls through the viewport.
          SplitText.create(".about-copy", {
            type: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.fromTo(
                self.words,
                { opacity: 0.12 },
                {
                  opacity: 1,
                  stagger: 0.1,
                  ease: "none",
                  scrollTrigger: { trigger: ".about-copy", start: "top 78%", end: "bottom 50%", scrub: true },
                },
              ),
          })

          // ── Process: the path draws across Design → Develop → Deliver; each step lights up
          //    as the line reaches it.
          const process = gsap.timeline({
            scrollTrigger: { trigger: ".process", start: "top 75%", end: "bottom 60%", scrub: 0.8 },
          })
          process.from(".process-path", { drawSVG: "0%", ease: "none", duration: 1 }, 0)
          gsap.utils.toArray<HTMLElement>(".pillar").forEach((card, i) => {
            const at = i / (pillars.length - 1)
            process
              .from(card.querySelector(".pillar-node"), { scale: 0, duration: 0.12, ease: "back.out(3)" }, at * 0.92)
              .from(card.querySelector(".pillar-body"), { y: 40, autoAlpha: 0, duration: 0.2 }, at * 0.92)
          })
        },
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} id="about" className="relative px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="01 — Who I am" lead="About" accent="Me" />

        {/* Phones and tablets: About as swipeable stories. */}
        <AboutStories />

        {/* Desktop: the pinned code-to-card scene, bio and process. */}
        <div className="about-desktop hidden lg:block">
        {/* Scene: the code on the left renders the card on the right, one line at a time. */}
        <div className="about-scene grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            className="code-card overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl shadow-purple-500/10"
            aria-hidden="true"
          >
            <div className="flex items-center gap-2 border-b border-[#ffffff14] bg-[#161b22] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 font-mono text-xs text-[#8b949e]">about.ts</span>
              <span className="relative ml-auto flex items-center gap-2 font-mono text-xs text-[#8b949e]">
                <span className="status-dot h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="status-compiling">Compiling…</span>
                <span className="status-compiled invisible absolute right-0 text-[#34d399]">Compiled</span>
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-7 text-[#e5e7eb] sm:text-[13px] md:p-6 md:text-[15px]">
              <code>
                {LINES.map((line, i) => (
                  <span key={i} className="code-line block whitespace-pre-wrap break-words pl-8 [text-indent:-2rem] sm:whitespace-pre sm:pl-0 sm:[text-indent:0]">
                    <span className="mr-4 inline-block w-4 select-none text-right text-[#484f58]">{i + 1}</span>
                    {line}
                  </span>
                ))}
              </code>
            </pre>
          </div>

          {/* The rendered output. */}
          <div className="relative">
            <div
              className="profile-glow pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-pink-500/30 blur-2xl"
              aria-hidden="true"
            />
            <article className="profile-card relative rounded-3xl border border-white/10 bg-neutral-900/90 p-7 md:p-8">
              <div className="card-step card-step-0 flex items-center gap-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-xl font-bold text-[#fff]">
                  SA
                </span>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Sazzad Ali</h3>
                  <p className="text-sm text-gray-400">Designs and builds for the web</p>
                </div>
              </div>

              <p className="card-step card-step-1 mt-6 text-lg font-semibold">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Software Engineer &amp; Web Developer
                </span>
              </p>

              <p className="card-step card-step-2 mt-2 flex items-center gap-2 text-gray-300">
                <MapPin className="h-4 w-4 text-pink-400" aria-hidden="true" />
                Sydney, Australia
              </p>

              <ul className="card-step card-step-3 mt-6 flex flex-wrap gap-2" aria-label="Strengths">
                {strengths.map((s) => (
                  <li
                    key={s}
                    className="strength-chip rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300"
                  >
                    {s}
                  </li>
                ))}
              </ul>

              <ul className="card-step card-step-4 mt-6 flex gap-3" aria-label="Stack">
                {stack.map(({ slug, name, invert }) => (
                  <li
                    key={slug}
                    title={name}
                    className="stack-logo grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={deviconUrl(slug)} alt={name} width={26} height={26} className={invert ? "dark:invert" : ""} />
                  </li>
                ))}
              </ul>

              <blockquote className="card-step card-step-5 relative mt-7 inline-block text-lg italic text-gray-200">
                &ldquo;One line of code at a time.&rdquo;
                <span className="motto-underline absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
              </blockquote>
              <span className="card-step card-step-6 sr-only">End of profile</span>
            </article>
          </div>
        </div>

        {/* Bio. */}
        <div className="about-copy mx-auto mt-16 max-w-4xl space-y-8 text-center text-xl leading-relaxed text-gray-100 md:text-3xl md:leading-snug">
          <p>
            Software Engineer and Web Developer with a passion for building elegant, high-performance digital
            experiences. With a strong foundation in software engineering, AI integration, UI/UX design and project
            management, I bring both creativity and precision to every project.
          </p>
          <p>
            Whether it&apos;s crafting full-stack web applications, designing intuitive interfaces or delivering
            scalable software — I thrive where design meets functionality, and make sure everything I touch is fast,
            accessible and future-ready.
          </p>
        </div>

        {/* Process: a path drawn through Design → Develop → Deliver. */}
        <div className="process relative mt-16">
          <svg
            className="pointer-events-none absolute inset-x-0 top-0 hidden h-20 w-full lg:block"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="process-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#a3e635" />
              </linearGradient>
            </defs>
            <path
              className="process-path"
              d="M200 40 C 330 -5, 470 85, 600 40 S 870 -5, 1000 40"
              stroke="url(#process-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>

          <ol className="grid gap-6 lg:grid-cols-3">
            {pillars.map(({ Icon, title, text }, i) => (
              <li key={title} className="pillar relative lg:pt-24">
                <span
                  className="pillar-node absolute left-[calc(50%-10px)] top-[30px] hidden h-5 w-5 rounded-full border-4 border-black bg-gradient-to-br from-blue-400 to-pink-400 ring-2 ring-purple-400/60 lg:block"
                  aria-hidden="true"
                />
                <div className="pillar-body group h-full rounded-2xl border border-white/10 bg-neutral-900/60 p-8 transition-colors hover:border-purple-400/40">
                  <div className="mb-6 flex items-center justify-between">
                    <Icon className="h-8 w-8 text-purple-400 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" />
                    <span className="font-mono text-sm text-gray-500">0{i + 1}</span>
                  </div>
                  <h3 className="mb-3 text-2xl font-semibold">{title}</h3>
                  <p className="text-gray-400">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        </div>
      </div>
    </section>
  )
}
