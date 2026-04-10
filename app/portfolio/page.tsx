import { WebflowShell } from "../_webflow/WebflowShell"
import { PortfolioContent } from "../_components/PortfolioContent"

export const metadata = {
  title: "Portfolio | MOSO — Selected Work",
  description:
    "Explore selected MOSO work across branding, UI/UX, Webflow/Framer, custom apps, and marketing systems—built for performance and longevity.",
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
