import { WebflowShell } from "../_webflow/WebflowShell"
import { BlogContent } from "../_components/BlogContent"

export const metadata = {
  title: "Studio Notes — MOSO | Brand Strategy, Design & Growth Insights",
  description:
    "Practical insights on brand strategy, design, digital growth, and the systems that help businesses build a more intentional future. Less noise, more signal.",
  alternates: { canonical: "https://www.moso.marketing/blog" },
}

export default function Blog() {
  return (
    <WebflowShell sourceHtml="blog.html" pageId="67ea24be240797066a8475f2">
      <BlogContent />
    </WebflowShell>
  )
}
