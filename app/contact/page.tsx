import type { Metadata } from "next"
import { WebflowExportRoute } from "../_webflow/WebflowExportRoute"
import { ContactFormOverride } from "../../components/ContactFormOverride"

export const metadata: Metadata = {
  title: "Contact MOSO | Start Your Project — Brand, Web & Growth",
  description:
    "Ready to build something meaningful? Contact MOSO to discuss your brand, website, digital product, or growth strategy. We respond within one business day.",
  alternates: { canonical: "https://www.moso.marketing/contact" },
}

export default function Contact() {
  return (
    <>
      <WebflowExportRoute route="/contact" />
      {/* Intercepts the Webflow form and sends via Resend */}
      <ContactFormOverride />
    </>
  )
}
