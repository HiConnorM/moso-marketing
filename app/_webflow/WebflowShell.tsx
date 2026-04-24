import { readFileSync } from "fs"
import path from "path"
import { rewriteWebflowPaths, extractIx2Styles } from "../../lib/webflow/utils"
import { WebflowInit } from "./WebflowInit"

const SITE_ID = "67ea24be240797066a84755c"

// Cache extracted shells per source HTML file
const shellCache = new Map<string, { navbar: string; footer: string; ctaSection: string; ix2Styles: string }>()

function extractShell(htmlFile: string) {
  const cached = shellCache.get(htmlFile)
  if (cached) return cached

  const html = readFileSync(path.join(process.cwd(), htmlFile), "utf8")

  const ix2Styles = extractIx2Styles(html)

  // Extract body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const body = bodyMatch?.[1] ?? ""

  // Extract navbar: everything from <nav class="navbar"> up to where content starts
  const navStart = body.indexOf('<nav class="navbar">')
  // Try primary boundary, fall back to section-top (used in blog.html)
  let contentIdx = body.indexOf('<div class="div-block-4">')
  if (contentIdx < 0) contentIdx = body.indexOf('<section class="section-top">')
  const navbar = navStart >= 0 && contentIdx > navStart
    ? body.slice(navStart, contentIdx).trim()
    : ""

  // Extract footer section
  const footerMatch = body.match(/<section class="footer">[\s\S]*?<\/section>/)
  const footer = footerMatch?.[0] ?? ""

  // Extract the CTA/contact section before footer (marquee + call-action)
  const ctaMatch = body.match(/<section class="section">\s*<div class="margin-bottom-large">[\s\S]*?<\/section>/)
  const ctaSection = ctaMatch?.[0] ?? ""

  const result = {
    navbar:     rewriteWebflowPaths(navbar),
    footer:     rewriteWebflowPaths(footer),
    ctaSection: rewriteWebflowPaths(ctaSection),
    ix2Styles,
  }
  shellCache.set(htmlFile, result)
  return result
}

interface WebflowShellProps {
  children: React.ReactNode
  sourceHtml?: string // Which HTML file to extract navbar/footer from
  pageId: string
  showCta?: boolean
}

export function WebflowShell({
  children,
  sourceHtml = "portfolio.html",
  pageId,
  showCta = true,
}: WebflowShellProps) {
  const { navbar, footer, ctaSection, ix2Styles } = extractShell(sourceHtml)

  return (
    <>
      {ix2Styles && (
        <style dangerouslySetInnerHTML={{ __html: ix2Styles }} />
      )}
      <div
        data-wf-page={pageId}
        data-wf-site={SITE_ID}
        style={{ display: "contents" }}
        suppressHydrationWarning
      >
        <div className="page-wrapper" style={{ opacity: 0, transition: "opacity 0.4s ease" }}>
          <div id="top" className="top" />
          <div
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: navbar }}
          />
          {children}
          {showCta && (
            <div
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: ctaSection }}
            />
          )}
          <div
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: footer }}
          />
        </div>
      </div>
      <WebflowInit pageId={pageId} siteId={SITE_ID} />
    </>
  )
}
