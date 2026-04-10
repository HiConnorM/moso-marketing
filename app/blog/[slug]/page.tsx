import { notFound } from "next/navigation"
import { posts, getPostBySlug } from "../../_data/posts"
import { WebflowShell } from "../../_webflow/WebflowShell"
import { BlogPostDetail } from "../../_components/BlogPostDetail"

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug)
    if (!post) return { title: "Post Not Found" }
    return {
      title: `${post.title} | MOSO Blog`,
      description: post.excerpt,
    }
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  return (
    <WebflowShell sourceHtml="blog.html" pageId="67ea24be240797066a8475f2">
      <BlogPostDetail post={post} />
    </WebflowShell>
  )
}
