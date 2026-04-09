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

    const initWebflow = () => {
      if (window.Webflow) {
        try {
          window.Webflow.destroy()
          window.Webflow.ready()
          const ix2 = window.Webflow.require("ix2")
          if (ix2) {
            ix2.init()
          }
        } catch (e) {
          // IX2 may not be available on all pages
        }
      }

      // Force page-wrapper visible (IX2 page-load opacity animation
      // doesn't reliably replay in SPA/Next.js context)
      const pw = document.querySelector<HTMLElement>(".page-wrapper")
      if (pw) {
        pw.style.opacity = "1"
      }
    }

    // Wait for DOM to be painted and scripts to load
    const timer = setTimeout(initWebflow, 150)
    return () => clearTimeout(timer)
  }, [pageId, siteId])

  return null
}
