import { useQuery } from "@tanstack/react-query"

interface Project {
  id: string
  name: string
  key: string
  color: string
  status: string
  _count: {
    tasks: number
  }
  tasks: Array<{
    status: string
  }>
}

interface ProjectsResponse {
  projects: Project[]
}

export function useProjects(workspaceSlug: string, options?: { enabled?: boolean }) {
  return useQuery<ProjectsResponse>({
    queryKey: ["projects", workspaceSlug],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/projects`)
      if (!response.ok) {
        throw new Error("Failed to fetch projects")
      }
      return response.json()
    },
    enabled: !!workspaceSlug && (options?.enabled !== false),
    staleTime: 30000, // 30 seconds
  })
}
