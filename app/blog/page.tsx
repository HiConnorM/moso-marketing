import { WebflowShell } from "../_webflow/WebflowShell"
import { BlogContent } from "../_components/BlogContent"

export const metadata = {
  title: "Studio Notes | MOSO — Brand, UX, Product & Growth",
  description:
    "Practical insights on brand strategy, UI/UX craft, Webflow/Framer performance, product thinking, and ethical marketing—less noise, more signal.",
}

export default function Blog() {
  return (
    <WebflowShell sourceHtml="blog.html" pageId="67ea24be240797066a8475f2">
      <BlogContent />
    </WebflowShell>
  )
}
