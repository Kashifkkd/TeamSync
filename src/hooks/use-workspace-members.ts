import { useQuery } from "@tanstack/react-query"

interface WorkspaceMemberResponse {
  id: string
  role: string
  status: string
  joinedAt: string
  invitedAt: string | null
  invitedBy: string | null
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
  inviter: {
    id: string
    name: string
    email: string
  } | null
}

interface WorkspaceMembersResponse {
  members: WorkspaceMemberResponse[]
}

interface TransformedMember {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

export function useWorkspaceMembers(workspaceId: string) {
  return useQuery<TransformedMember[]>({
    queryKey: ["workspace-members", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`)
      if (!response.ok) {
        throw new Error("Failed to fetch workspace members")
      }
      const data: WorkspaceMembersResponse = await response.json()
      
      // Transform the nested user structure to flat structure
      return (data.members || []).map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        image: member.user.image,
        role: member.role
      }))
    },
    enabled: !!workspaceId,
  })
}
