import { useQuery } from "@tanstack/react-query"

interface MilestoneDetail {
  id: string
  name: string
  description: string | null
  status: string
  startDate: string | null
  endDate: string | null
  progress: number
  priority: string
  projectId: string | null
  project?: {
    id: string
    name: string
    color: string
  }
  tasks: Array<{
    id: string
    status: string
    dueDate: string | null
  }>
  assignees: Array<{
    user: {
      id: string
      name: string
      email: string
      image: string | null
    }
  }>
  createdAt: string
  updatedAt: string
}

interface MilestoneDetailResponse {
  milestone: MilestoneDetail
}

export function useMilestoneDetail(workspaceId: string, milestoneId: string) {
  return useQuery<MilestoneDetailResponse>({
    queryKey: ['milestone-detail', workspaceId, milestoneId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/milestones/${milestoneId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch milestone detail')
      }
      return response.json()
    },
    enabled: !!workspaceId && !!milestoneId,
  })
}
