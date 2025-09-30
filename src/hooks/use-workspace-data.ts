import { useQuery } from "@tanstack/react-query"

interface WorkspaceData {
  id: string
  name: string
  slug: string
  image?: string
  userRole: string
}

export function useWorkspace(workspaceSlug: string) {
  return useQuery<WorkspaceData>({
    queryKey: ["workspace", workspaceSlug],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceSlug}`)
      if (!response.ok) {
        throw new Error("Failed to fetch workspace")
      }
      return response.json()
    },
    enabled: !!workspaceSlug,
  })
}
