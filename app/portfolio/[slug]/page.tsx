import { notFound } from "next/navigation"
import { projects, getProjectBySlug } from "../../_data/projects"
import { WebflowShell } from "../../_webflow/WebflowShell"
import { ProjectDetail } from "../../_components/ProjectDetail"

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // We need to handle the async params for Next.js 15
  return params.then(({ slug }) => {
    const project = getProjectBySlug(slug)
    if (!project) return { title: "Project Not Found" }
    return {
      title: `${project.title} | MOSO Portfolio`,
      description: project.description,
    }
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  return (
    <WebflowShell sourceHtml="portfolio.html" pageId="67ea24be240797066a8475fd">
      <ProjectDetail project={project} />
    </WebflowShell>
  )
}
