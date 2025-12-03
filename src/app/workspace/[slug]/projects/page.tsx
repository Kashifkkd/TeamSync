import { requireAuth, getWorkspaceBySlug } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { ProjectsPageClient } from "./page-client"

interface ProjectsPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const user = await requireAuth()
  const { slug } = await params

  if (!user.id) {
    redirect("/auth/signin")
  }

  const workspace = await getWorkspaceBySlug(slug, user.id)

  if (!workspace) {
    redirect("/dashboard")
  }

  return <ProjectsPageClient slug={slug} />
}