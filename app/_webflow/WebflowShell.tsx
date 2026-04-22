import { readFileSync } from "fs"
import path from "path"
import { WebflowInit } from "./WebflowInit"

const SITE_ID = "67ea24be240797066a84755c"

// Cache extracted shells
const shellCache = new Map<string, { navbar: string; footer: string; ctaSection: string; ix2Styles: string }>()

function rewritePaths(html: string) {
  let out = html
  out = out.replaceAll('src="images/', 'src="/images/')
  out = out.replaceAll('href="images/', 'href="/images/')
  out = out.replaceAll("url('images/", "url('/images/")
  out = out.replaceAll('url("images/', 'url("/images/')
  out = out.replaceAll('href="index.html"', 'href="/"')
  out = out.replaceAll('href="about.html"', 'href="/about"')
  out = out.replaceAll('href="services.html"', 'href="/services"')
  out = out.replaceAll('href="portfolio.html"', 'href="/portfolio"')
  out = out.replaceAll('href="blog.html"', 'href="/blog"')
  out = out.replaceAll('href="contact.html"', 'href="/contact"')
  out = out.replaceAll('href="careers.html"', 'href="/careers"')
  out = out.replaceAll('href="newsletter.html"', 'href="/newsletter"')
  out = out.replaceAll('href="privacy.html"', 'href="/privacy"')
  out = out.replaceAll('href="terms-of-use.html"', 'href="/terms-of-use"')
  out = out.replaceAll('href="ethics.html"', 'href="/ethics"')
  return out
}

function extractShell(htmlFile: string) {
  const cached = shellCache.get(htmlFile)
  if (cached) return cached

  const filePath = path.join(process.cwd(), htmlFile)
  const html = readFileSync(filePath, "utf8")

  // Extract IX2 styles
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  const headInner = headMatch?.[1] ?? ""
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  const styles: string[] = []
  let match
  while ((match = styleRegex.exec(headInner)) !== null) {
    if (match[1].includes("data-w-id")) {
      styles.push(match[1])
    }
  }
  const ix2Styles = styles.join("\n")

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

  const fullNavbar = navbar

  const result = {
    navbar: rewritePaths(fullNavbar),
    footer: rewritePaths(footer),
    ctaSection: rewritePaths(ctaSection),
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
