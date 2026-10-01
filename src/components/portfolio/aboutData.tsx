import type { ReactNode } from "react"
import { Code2, PenTool, Rocket } from "lucide-react"

/** Shared About content: used by the desktop scene (About.tsx) and the mobile stories. */

export const pillars = [
  { Icon: PenTool, title: "Design", text: "Intuitive interfaces and design systems with a strong eye for detail." },
  { Icon: Code2, title: "Develop", text: "Full-stack web apps with React, Next.js and Node — clean, typed and fast." },
  { Icon: Rocket, title: "Deliver", text: "Scalable, accessible products shipped with care and clear communication." },
]

export const strengths = ["AI integration", "UI/UX design", "Project management"]
export const stack = [
  { slug: "react", name: "React" },
  { slug: "nextjs", name: "Next.js", invert: true },
  { slug: "nodejs", name: "Node.js" },
  { slug: "typescript", name: "TypeScript" },
]

// Editor colours are fixed (code editors stay dark in both themes).
const K = ({ children }: { children: ReactNode }) => <span className="text-[#34d399]">{children}</span>
const V = ({ children }: { children: ReactNode }) => <span className="text-[#5eead4]">{children}</span>
const P = ({ children }: { children: ReactNode }) => <span className="text-[#6b7280]">{children}</span>
const S = ({ children }: { children: ReactNode }) => <span className="text-[#f9a8d4]">{children}</span>
const key = (k: string) => <span className="text-[#7dd3fc]">{k}</span>

/** One line of code per piece of the profile card it renders. */
export const LINES: ReactNode[] = [
  <>
    <K>const</K> <V>sazzad</V> <P>=</P> <P>{"{"}</P>
  </>,
  <>
    {"  "}
    {key("role")}
    <P>:</P> <S>&quot;Software Engineer &amp; Web Developer&quot;</S>
    <P>,</P>
  </>,
  <>
    {"  "}
    {key("based")}
    <P>:</P> <S>&quot;Sydney, Australia&quot;</S>
    <P>,</P>
  </>,
  <>
    {"  "}
    {key("strengths")}
    <P>: [</P>
    <S>&quot;AI&quot;</S>
    <P>, </P>
    <S>&quot;UI/UX&quot;</S>
    <P>, </P>
    <S>&quot;PM&quot;</S>
    <P>],</P>
  </>,
  <>
    {"  "}
    {key("stack")}
    <P>: [</P>
    <S>&quot;React&quot;</S>
    <P>, </P>
    <S>&quot;Next.js&quot;</S>
    <P>, </P>
    <S>&quot;Node&quot;</S>
    <P>, </P>
    <S>&quot;TS&quot;</S>
    <P>],</P>
  </>,
  <>
    {"  "}
    {key("motto")}
    <P>:</P> <S>&quot;One line of code at a time&quot;</S>
    <P>,</P>
  </>,
  <>
    <P>{"}"}</P>
  </>,
]
