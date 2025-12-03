"use client"

import { useQuery } from "@tanstack/react-query"

interface Project {
  id: string
  name: string
  key: string
  description?: string
  status: string
  priority: string
  visibility: string
  color: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  workspaceId: string
  creatorId: string
  _count: {
    tasks: number
    milestones: number
  }
}

interface UseProjectsClientProps {
  workspaceSlug: string
  status?: string
  enabled?: boolean
}

export function useProjectsClient({ 
  workspaceSlug, 
  status = "all", 
  enabled = true 
}: UseProjectsClientProps) {
  return useQuery({
    queryKey: ["projects-client", workspaceSlug, status],
    queryFn: async (): Promise<Project[]> => {
      const url = status === "all" 
        ? `/api/workspaces/${workspaceSlug}/projects`
        : `/api/workspaces/${workspaceSlug}/projects?status=${status}`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      const data = await response.json()
      return data.projects || []
    },
    enabled: enabled && !!workspaceSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
