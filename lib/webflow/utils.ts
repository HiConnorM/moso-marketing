// ─── Shared Webflow HTML utilities ────────────────────────────────────────────
// Used by WebflowExportRoute and WebflowShell to process exported Webflow HTML.

/**
 * Rewrite asset paths and internal hrefs in exported Webflow HTML so they work
 * under the Next.js router (relative → absolute, .html hrefs → clean routes).
 */
export function rewriteWebflowPaths(html: string): string {
  let out = html
  // Asset paths
  out = out.replaceAll('src="images/', 'src="/images/')
  out = out.replaceAll('href="images/', 'href="/images/')
  out = out.replaceAll("url('images/", "url('/images/")
  out = out.replaceAll('url("images/', 'url("/images/')
  // Webflow JS (loaded via Next.js Script instead)
  out = out.replaceAll('src="js/webflow.js"', 'src="/js/webflow.js"')
  // Internal page hrefs
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

/**
 * Extract Webflow IX2 initial-state <style> blocks from an exported HTML
 * document's <head>. These contain per-element opacity/transform start states
 * keyed by data-w-id and must be injected before the page renders.
 */
export function extractIx2Styles(exportHtml: string): string {
  const headMatch = exportHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)
  const headInner = headMatch?.[1] ?? ''
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
  const styles: string[] = []
  let match
  while ((match = styleRegex.exec(headInner)) !== null) {
    if (match[1].includes('data-w-id')) {
      styles.push(match[1])
    }
  }
  return styles.join('\n')
}
