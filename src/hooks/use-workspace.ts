"use client"

import { useQuery } from "@tanstack/react-query"

export interface Workspace {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  plan: string
  createdAt: string
  updatedAt: string
  userRole?: string
  _count?: {
    members: number
    projects: number
  }
}

interface WorkspaceResponse {
  workspace: Workspace
}

export function useWorkspace(slug: string) {
  return useQuery<WorkspaceResponse>({
    queryKey: ["workspace", slug],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${slug}`)
      if (!response.ok) {
        throw new Error("Failed to fetch workspace")
      }
      return response.json()
    },
    enabled: !!slug,
    staleTime: 60000, // 1 minute
  })
}

interface WorkspacesResponse {
  workspaces: Workspace[]
  total: number
  count: number
}

export function useWorkspaces() {
  return useQuery<WorkspacesResponse>({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await fetch("/api/workspaces")
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces")
      }
      return response.json()
    },
    staleTime: 60000,
  })
}

