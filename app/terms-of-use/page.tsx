import type { Metadata } from "next"
import { WebflowExportRoute } from "../_webflow/WebflowExportRoute"

export const metadata: Metadata = {
  title: "Terms of Service — MOSO | Design & Technology Studio",
  description:
    "MOSO's Terms of Service govern use of our website and services. Read our client agreements, intellectual property policies, and usage terms.",
  alternates: { canonical: "https://www.moso.marketing/terms-of-use" },
}

export default function TermsOfUse() {
  return <WebflowExportRoute route="/terms-of-use" />
}
