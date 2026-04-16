import type { Metadata } from "next"
import { WebflowExportRoute } from "../_webflow/WebflowExportRoute"
import { ContactFormOverride } from "../../components/ContactFormOverride"

export const metadata: Metadata = {
  title: "Contact — MOSO Creative Studio",
  description:
    "Have a project in mind? Contact MOSO for branding, UI/UX, Webflow/Framer builds, custom software, and ethical marketing.",
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
