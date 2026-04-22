import type { Metadata } from "next"
import { WebflowExportRoute } from "../_webflow/WebflowExportRoute"

export const metadata: Metadata = {
  title: "Privacy Policy — MOSO | Design & Technology Studio",
  description:
    "MOSO's Privacy Policy explains how we collect, use, and protect your personal information. We are committed to transparency, data minimization, and your privacy rights.",
  alternates: { canonical: "https://www.moso.marketing/privacy" },
}

export default function Privacy() {
  return <WebflowExportRoute route="/privacy" />
}
