import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { caseStudies } from "@/data/portfolio"
import { CaseStudy } from "@/components/portfolio/CaseStudy"

type Props = { params: Promise<{ slug: string }> }

// Pre-render every case study (also required for the GitHub Pages static export).
export function generateStaticParams() {
  return caseStudies.map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = caseStudies.find((p) => p.slug === slug)
  if (!project) return {}
  return {
    title: `${project.title} case study | Sazzad Ali`,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title} case study`,
      description: project.description,
      images: project.image ? [{ url: project.image, alt: project.title }] : undefined,
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const project = caseStudies.find((p) => p.slug === slug)
  if (!project) notFound()
  return <CaseStudy project={project} />
}
