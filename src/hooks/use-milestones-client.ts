"use client"

import { useQuery } from "@tanstack/react-query"

interface Milestone {
  id: string
  name: string
  description: string | null
  status: string
  startDate: string | null
  endDate: string | null
  progress: number
  priority: string
  project: {
    id: string
    name: string
  }
  tasks: Array<{
    id: string
    status: string
    dueDate: string | null
  }>
  assignees: Array<{
    user: {
      name: string | null
      image: string | null
    }
  }>
}

interface UseMilestonesClientProps {
  workspaceSlug: string
  enabled?: boolean
}

export function useMilestonesClient({ 
  workspaceSlug, 
  enabled = true 
}: UseMilestonesClientProps) {
  return useQuery({
    queryKey: ["milestones-client", workspaceSlug],
    queryFn: async (): Promise<Milestone[]> => {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/milestones`)
      if (!response.ok) {
        throw new Error("Failed to fetch milestones")
      }
      const data = await response.json()
      return data.milestones || []
    },
    enabled: enabled && !!workspaceSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  })
}
