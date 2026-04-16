"use client"

import { useEffect } from "react"

/**
 * Attaches a submit handler to the Webflow contact form rendered via
 * dangerouslySetInnerHTML, sending the submission to /api/contact (Resend).
 * Renders nothing — purely side-effect driven.
 */
export function ContactFormOverride() {
  useEffect(() => {
    const form = document.getElementById("wf-form-Contact-Form") as HTMLFormElement | null
    if (!form) return

    const handleSubmit = async (e: Event) => {
      e.preventDefault()
      e.stopPropagation()

      const wForm = form.closest(".w-form")
      const successEl = wForm?.querySelector<HTMLElement>(".w-form-done")
      const errorEl = wForm?.querySelector<HTMLElement>(".w-form-fail")
      const submitBtn = form.querySelector<HTMLInputElement>('input[type="submit"]')

      // Reset state
      if (successEl) successEl.style.display = "none"
      if (errorEl) errorEl.style.display = "none"
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.value = "Sending…"
      }

      try {
        const data = new FormData(form)
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            email: data.get("email"),
            message: data.get("Message"),
          }),
        })

        if (res.ok) {
          form.style.display = "none"
          if (successEl) {
            successEl.style.display = "block"
            successEl.innerHTML = "<div>Thank you! We'll be in touch soon.</div>"
          }
        } else {
          throw new Error("Failed to send")
        }
      } catch {
        if (errorEl) {
          errorEl.style.display = "block"
          errorEl.innerHTML = "<div>Oops! Something went wrong. Please email us directly at info@moso.marketing</div>"
        }
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.value = "Send Message"
        }
      }
    }

    form.addEventListener("submit", handleSubmit)
    return () => form.removeEventListener("submit", handleSubmit)
  }, [])

  return null
}
