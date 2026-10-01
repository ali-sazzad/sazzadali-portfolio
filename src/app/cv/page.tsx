import type { Metadata } from "next"
import { CvViewer } from "@/components/cv/CvViewer"

export const metadata: Metadata = {
  title: "CV | Sazzad Ali",
  description: "Preview the CV of Sazzad Ali, Sydney-based web developer and UI designer.",
}

export default function CvPage() {
  return <CvViewer />
}
