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

        // On mobile viewports, hide the nav menu when closed so it doesn't
        // bleed into the viewport (Webflow positions it at top:-Npx but
        // parent overflow:visible lets it show). On desktop the menu is always
        // visible — only apply this treatment when the hamburger button is
        // actually rendered (i.e. we're in a collapsed breakpoint).
        const navMenu = document.querySelector<HTMLElement>(".navbar-menu.w-nav-menu")
        const navBtn = document.querySelector<HTMLElement>(".w-nav-button")
        const isCollapsedViewport = navBtn
          ? getComputedStyle(navBtn).display !== "none"
          : false

        if (isCollapsedViewport && navMenu && !navMenu.classList.contains("w--open")) {
          navMenu.style.opacity = "0"
          navMenu.style.pointerEvents = "none"
        } else if (navMenu) {
          // Desktop: ensure any stale inline opacity is cleared
          navMenu.style.opacity = ""
          navMenu.style.pointerEvents = ""
        }

        // Re-show the menu when the hamburger is tapped on mobile
        if (navBtn) {
          navBtn.addEventListener("click", () => {
            if (navMenu) {
              navMenu.style.opacity = ""
              navMenu.style.pointerEvents = ""
            }
          }, { once: true })
        }

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

    return () => { cancelled = true }
  }, [pageId, siteId])

  return null
}
