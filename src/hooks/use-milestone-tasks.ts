import { useQuery } from "@tanstack/react-query"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  createdAt: string
  updatedAt: string
  assignee?: {
    id: string
    name: string
    email: string
    image: string | null
  } | null
  creator?: {
    id: string
    name: string
    email: string
    image: string | null
  } | null
  project?: {
    id: string
    name: string
    key: string
    color: string
  } | null
  milestone?: {
    id: string
    name: string
  } | null
  comments: Array<{
    id: string
  }>
  attachments: Array<{
    id: string
  }>
  subtasks: Array<{
    id: string
    completed: boolean
  }>
}

interface MilestoneTasksResponse {
  tasks: Task[]
}

export function useMilestoneTasks(workspaceId: string, milestoneId: string) {
  return useQuery<MilestoneTasksResponse>({
    queryKey: ['milestone-tasks', workspaceId, milestoneId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/milestones/${milestoneId}/tasks`)
      if (!response.ok) {
        throw new Error('Failed to fetch milestone tasks')
      }
      return response.json()
    },
    enabled: !!workspaceId && !!milestoneId,
  })
}
