import { useQuery } from "@tanstack/react-query"

interface TaskStatus {
  id: string
  name: string
  color: string
  bgColor: string
  textColor: string
  badgeColor: string
  order: number
  isDefault: boolean
  workspaceId: string
  createdAt: Date
  updatedAt: Date
}

interface TaskStatusesResponse {
  taskStatuses: TaskStatus[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export function useTaskStatuses(workspaceId: string, projectId?: string) {
  return useQuery<TaskStatusesResponse>({
    queryKey: ["task-statuses", workspaceId, projectId],
    queryFn: async () => {
      const url = projectId 
        ? `/api/workspaces/${workspaceId}/projects/${projectId}/task-statuses`
        : `/api/workspaces/${workspaceId}/task-statuses`
        
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error("Failed to fetch task statuses")
      }
      
      return response.json()
    },
    enabled: !!workspaceId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}
