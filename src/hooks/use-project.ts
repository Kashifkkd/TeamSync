"use client"

import { useQuery } from "@tanstack/react-query"

export interface Project {
  id: string
  name: string
  key: string
  description?: string | null
  status: string
  priority: string
  visibility: string
  color: string
  icon?: string | null
  startDate?: string | null
  endDate?: string | null
  progress: number
  createdAt: string
  updatedAt: string
  workspaceId: string
  creatorId: string
  creator: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
  _count: {
    tasks: number
    milestones: number
    members: number
  }
  tasks?: Array<{
    id: string
    status: string
    title: string
    number: number
    priority: string
    assignee?: {
      id: string
      name?: string | null
      image?: string | null
    } | null
  }>
  members?: Array<{
    id: string
    role: string
    user?: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    } | null
  }>
  milestones?: Array<{
    id: string
    name: string
    endDate?: string | null
  }>
}

interface ProjectResponse {
  project: Project
}

export function useProject(workspaceSlug: string, projectId: string) {
  return useQuery<ProjectResponse>({
    queryKey: ["project", workspaceSlug, projectId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/projects/${projectId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch project")
      }
      return response.json()
    },
    enabled: !!workspaceSlug && !!projectId,
    staleTime: 30000, // 30 seconds
  })
}

