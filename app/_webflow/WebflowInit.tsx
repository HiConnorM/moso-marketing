"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Webflow?: {
      destroy: () => void
      ready: () => void
      require: (module: string) => {
        init: () => void
        destroy: () => void
      }
    }
  }
}

export function WebflowInit({
  pageId,
  siteId,
}: {
  pageId: string
  siteId: string
}) {
  useEffect(() => {
    // Set Webflow data attributes on <html> so webflow.js can find them
    document.documentElement.setAttribute("data-wf-page", pageId)
    document.documentElement.setAttribute("data-wf-site", siteId)

    // Add Webflow mod classes
    const docEl = document.documentElement
    if (!docEl.className.includes("w-mod-js")) {
      docEl.className += " w-mod-js"
    }
    if ("ontouchstart" in window || (window as any).DocumentTouch) {
      if (!docEl.className.includes("w-mod-touch")) {
        docEl.className += " w-mod-touch"
      }
    }

    let cancelled = false
    let attempts = 0
    const maxAttempts = 30 // poll up to 3 seconds

    // ── Tablet hamburger handler ────────────────────────────────────────────
    // The HTML nav uses data-collapse="tiny", so Webflow.js only handles
    // hamburger clicks at ≤479px. For 480–991px (tablet / landscape phone)
    // Webflow thinks it's in "desktop mode" and ignores hamburger taps, so
    // we wire up our own toggle. We use AbortController so the listener is
    // cleaned up on every page navigation, preventing duplicate handlers.
    const abortCtrl = new AbortController()

    const hamburger = document.querySelector<HTMLElement>(".w-nav-button")
    const navMenu   = document.querySelector<HTMLElement>(".w-nav-menu")

    if (hamburger && navMenu) {
      hamburger.addEventListener("click", (e) => {
        const vw = window.innerWidth
        if (vw <= 991) {
          // Take full control of the hamburger for all mobile/tablet widths.
          // stopImmediatePropagation prevents Webflow.js from running its own
          // handler (which uses data-nav-menu-open + overlay instead of
          // w--open, conflicting with our CSS). Our listener is registered
          // before Webflow.ready() fires, so it is always first in the queue.
          e.stopImmediatePropagation()
          const opening = !navMenu.classList.contains("w--open")
          navMenu.classList.toggle("w--open", opening)
          hamburger.classList.toggle("w--open", opening)
          document.body.classList.toggle("w-nav-open", opening)
        }
      }, { signal: abortCtrl.signal })
    }

    // Reveal the page and fire Webflow IX2 page-load animations.
    // We poll until window.Webflow is available because jQuery + webflow.js
    // load with strategy="afterInteractive" and may not be ready yet.
    const tryInit = () => {
      if (cancelled) return
      attempts++

      if (window.Webflow) {
        try {
          // Close any open mobile nav state before reinitializing
          document.querySelectorAll(".w--open").forEach(el => el.classList.remove("w--open"))
          document.querySelectorAll(".w-nav-overlay").forEach(el => el.remove())
          document.body.style.overflow = ""
          document.body.classList.remove("w-nav-open")

          window.Webflow.destroy()
          window.Webflow.ready()
          const ix2 = window.Webflow.require("ix2")
          if (ix2) {
            // destroy first to reset any previously-run page-load animation state,
            // then re-init so page-load triggers fire fresh every navigation
            ix2.destroy()
            ix2.init()
          }
        } catch (e) {
          // IX2 may not be available on all pages
        }

        // Reveal page — IX2 will have already started the entrance animations
        const pw = document.querySelector<HTMLElement>(".page-wrapper")
        if (pw) pw.style.opacity = "1"

      } else if (attempts < maxAttempts) {
        // Webflow not ready yet — keep polling every 100 ms
        setTimeout(tryInit, 100)
      } else {
        // Timeout: just reveal the page without animations
        const pw = document.querySelector<HTMLElement>(".page-wrapper")
        if (pw) pw.style.opacity = "1"
      }
    }

    // Short initial delay so the DOM has been painted before we touch Webflow
    setTimeout(tryInit, 80)

    return () => {
      cancelled = true
      abortCtrl.abort() // removes the tablet hamburger listener cleanly
    }
  }, [pageId, siteId])

  return null
}
