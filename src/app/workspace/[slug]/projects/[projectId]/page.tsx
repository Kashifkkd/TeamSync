"use client"

import { use } from "react"
import { ProjectPageClient } from "./page-client"

interface ProjectPageProps {
  params: Promise<{ slug: string; projectId: string }>
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug, projectId } = use(params)
  
  return <ProjectPageClient slug={slug} projectId={projectId} />
}
