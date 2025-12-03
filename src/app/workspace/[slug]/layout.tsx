"use client"

import { use } from "react"
import { WorkspaceLayoutClient } from "./layout-client"

interface WorkspaceLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const { slug } = use(params)
  
  return <WorkspaceLayoutClient slug={slug}>{children}</WorkspaceLayoutClient>
}
