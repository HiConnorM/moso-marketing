import { readFileSync } from "fs"
import path from "path"
import { WebflowInit } from "./WebflowInit"

type WebflowRoute =
  | "/"
  | "/about"
  | "/services"
  | "/portfolio"
  | "/blog"
  | "/contact"

const routeToExportHtml: Record<WebflowRoute, string> = {
  "/": "index.html",
  "/about": "about.html",
  "/services": "services.html",
  "/portfolio": "portfolio.html",
  "/blog": "blog.html",
  "/contact": "contact.html",
}

const PAGE_IDS: Record<WebflowRoute, string> = {
  "/": "67ea24be240797066a8475e9",
  "/about": "67ea24be240797066a8475f1",
  "/services": "67ea24be240797066a8475f8",
  "/portfolio": "67ea24be240797066a8475fd",
  "/blog": "67ea24be240797066a8475f2",
  "/contact": "67ea24be240797066a8475f3",
}

const SITE_ID = "67ea24be240797066a84755c"

const cache = new Map<WebflowRoute, { body: string; ix2Styles: string }>()

function rewriteWebflowPaths(html: string) {
  let out = html
  // Fix asset paths to absolute
  out = out.replaceAll('src="images/', 'src="/images/')
  out = out.replaceAll('href="images/', 'href="/images/')
  out = out.replaceAll("url('images/", "url('/images/")
  out = out.replaceAll('url("images/', 'url("/images/')
  out = out.replaceAll('src="js/webflow.js"', 'src="/js/webflow.js"')

  // Fix route links
  out = out.replaceAll('href="index.html"', 'href="/"')
  out = out.replaceAll('href="about.html"', 'href="/about"')
  out = out.replaceAll('href="services.html"', 'href="/services"')
  out = out.replaceAll('href="portfolio.html"', 'href="/portfolio"')
  out = out.replaceAll('href="blog.html"', 'href="/blog"')
  out = out.replaceAll('href="contact.html"', 'href="/contact"')
  out = out.replaceAll('href="contact.html"', 'href="/contact"')
  out = out.replaceAll('href="careers.html"', 'href="/careers"')
  out = out.replaceAll('href="newsletter.html"', 'href="/newsletter"')
  out = out.replaceAll('href="privacy.html"', 'href="/privacy"')
  out = out.replaceAll('href="terms-of-use.html"', 'href="/terms-of-use"')

  return out
}

function extractIx2Styles(exportHtml: string) {
  const headMatch = exportHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  const headInner = headMatch?.[1] ?? ""
  // Extract all <style> blocks from <head> that contain IX2 initial states
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  const styles: string[] = []
  let match
  while ((match = styleRegex.exec(headInner)) !== null) {
    // Only keep styles that reference data-w-id (IX2 initial states)
    if (match[1].includes("data-w-id")) {
      styles.push(match[1])
    }
  }
  return styles.join("\n")
}

function extractBodyInner(exportHtml: string) {
  const bodyMatch = exportHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (!bodyMatch) return ""
  let body = bodyMatch[1]
  // Remove the jQuery and webflow.js script tags (we load them via next/script)
  body = body.replace(
    /<script[^>]*src="https:\/\/d3e54v103j8qbb\.cloudfront\.net[^"]*"[^>]*><\/script>/g,
    ""
  )
  body = body.replace(
    /<script[^>]*src="js\/webflow\.js"[^>]*><\/script>/g,
    ""
  )
  // Fix page-wrapper: remove opacity:0 inline style (IX2 page-load animation
  // doesn't replay reliably in SPA context, we handle fade-in via WebflowInit)
  body = body.replace(
    /(<div\s+)style="opacity:0"(\s+class="page-wrapper")/,
    '$1style="opacity:0;transition:opacity 0.4s ease"$2'
  )
  return body.trim()
}

function getPageData(route: WebflowRoute) {
  const cached = cache.get(route)
  if (cached) return cached

  const exportFile = routeToExportHtml[route]
  const exportPath = path.join(process.cwd(), exportFile)
  const exportHtml = readFileSync(exportPath, "utf8")

  const ix2Styles = extractIx2Styles(exportHtml)
  const bodyInner = extractBodyInner(exportHtml)
  const body = rewriteWebflowPaths(bodyInner)

  const data = { body, ix2Styles }
  cache.set(route, data)
  return data
}

export function WebflowExportRoute({ route }: { route: WebflowRoute }) {
  const { body, ix2Styles } = getPageData(route)
  const pageId = PAGE_IDS[route]

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
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <WebflowInit pageId={pageId} siteId={SITE_ID} />
    </>
  )
}
