import { WebflowShell } from "../_webflow/WebflowShell"
import { PortfolioContent } from "../_components/PortfolioContent"

export const metadata = {
  title: "Portfolio — MOSO | Brand, Web & Digital Work",
  description:
    "Explore selected work from MOSO across brand identity, website design, digital products, and growth systems — built for impact and built to last.",
  alternates: { canonical: "https://www.moso.marketing/portfolio" },
}

export default function Portfolio() {
  return (
    <WebflowShell sourceHtml="portfolio.html" pageId="67ea24be240797066a8475fd">
      <div className="div-block-4">
        <PortfolioContent />
      </div>
    </WebflowShell>
  )
}
