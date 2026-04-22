import type { Metadata } from "next"
import { WebflowExportRoute } from "../_webflow/WebflowExportRoute"

export const metadata: Metadata = {
  title: "Ethics & Sustainability — MOSO | Our Commitments",
  description:
    "MOSO's commitments to ethical marketing, sustainable design, responsible AI use, and building a more human-centered creative industry. Design Your Future — responsibly.",
  alternates: { canonical: "https://www.moso.marketing/ethics" },
}

export default function Ethics() {
  return <WebflowExportRoute route="/ethics" />
}
