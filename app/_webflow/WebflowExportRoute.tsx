import { readFileSync } from "fs"
import path from "path"
import { rewriteWebflowPaths, extractIx2Styles } from "../../lib/webflow/utils"
import { WebflowInit } from "./WebflowInit"

type WebflowRoute =
  | "/"
  | "/about"
  | "/services"
  | "/portfolio"
  | "/blog"
  | "/contact"
  | "/privacy"
  | "/terms-of-use"
  | "/ethics"

const routeToExportHtml: Record<WebflowRoute, string> = {
  "/": "index.html",
  "/about": "about.html",
  "/services": "services.html",
  "/portfolio": "portfolio.html",
  "/blog": "blog.html",
  "/contact": "contact.html",
  "/privacy": "privacy.html",
  "/terms-of-use": "terms-of-use.html",
  "/ethics": "ethics.html",
}

const PAGE_IDS: Record<WebflowRoute, string> = {
  "/": "67ea24be240797066a8475e9",
  "/about": "67ea24be240797066a8475f1",
  "/services": "67ea24be240797066a8475f8",
  "/portfolio": "67ea24be240797066a8475fd",
  "/blog": "67ea24be240797066a8475f2",
  "/contact": "67ea24be240797066a8475f3",
  "/privacy": "67ea24be240797066a84755c",
  "/terms-of-use": "67ea24be240797066a8475bb",
  "/ethics": "67ea24be240797066a8475cc",
}

const SITE_ID = "67ea24be240797066a84755c"

const cache = new Map<WebflowRoute, { body: string; ix2Styles: string }>()

function extractBodyInner(exportHtml: string) {
  const bodyMatch = exportHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  if (!bodyMatch) return ""
  let body = bodyMatch[1]
  // Remove jQuery and webflow.js script tags (loaded via next/script in layout)
  body = body.replace(
    /<script[^>]*src="https:\/\/d3e54v103j8qbb\.cloudfront\.net[^"]*"[^>]*><\/script>/g,
    ""
  )
  body = body.replace(
    /<script[^>]*src="js\/webflow\.js"[^>]*><\/script>/g,
    ""
  )
  // Fix page-wrapper: IX2 page-load animation doesn't replay reliably in SPA
  // context — WebflowInit handles the fade-in after Webflow reinitialises.
  body = body.replace(
    /(<div\s+)style="opacity:0"(\s+class="page-wrapper")/,
    '$1style="opacity:0;transition:opacity 0.4s ease"$2'
  )
  return body.trim()
}

function getPageData(route: WebflowRoute) {
  const cached = cache.get(route)
  if (cached) return cached

  const exportHtml = readFileSync(path.join(process.cwd(), routeToExportHtml[route]), "utf8")
  const ix2Styles  = extractIx2Styles(exportHtml)
  const body       = rewriteWebflowPaths(extractBodyInner(exportHtml))

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
