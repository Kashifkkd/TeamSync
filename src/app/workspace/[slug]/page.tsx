"use client"

import { use } from "react"
import { WorkspaceDashboardClient } from "./page-client"

interface WorkspaceDashboardProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function WorkspaceDashboard({ params }: WorkspaceDashboardProps) {
  const { slug } = use(params)
  
  return <WorkspaceDashboardClient slug={slug} />
}
