import { useQuery } from "@tanstack/react-query"

interface Milestone {
  id: string
  name: string
  status: "active" | "upcoming" | "completed" | "paused"
  project?: {
    name: string
    color: string
  }
}

interface MilestonesResponse {
  milestones: Milestone[]
}

export function useMilestones(workspaceSlug: string, options?: { enabled?: boolean }) {
  return useQuery<MilestonesResponse>({
    queryKey: ["milestones", workspaceSlug],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/milestones`)
      if (!response.ok) {
        throw new Error("Failed to fetch milestones")
      }
      return response.json()
    },
    enabled: !!workspaceSlug && (options?.enabled !== false),
  })
}
