import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// interface WorkspaceMemberWithUser {
//   id: string
//   role: Role
//   joinedAt: string
//   user: {
//     id: string
//     name: string | null
//     email: string
//     image: string | null
//   } | null
// }

interface UseWorkspaceMembersProps {
  workspaceId: string
}

export function useWorkspaceMembers({ workspaceId }: UseWorkspaceMembersProps) {
  const queryClient = useQueryClient()

  // Fetch members - workspaceId can be either ID or slug
  const {
    data: members = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workspace-members', workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`)
      if (!response.ok) throw new Error('Failed to fetch members')
      
      const data = await response.json()
      return data.members || []
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists
  })

  // Invite member mutation
  const inviteMemberMutation = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to invite member')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
    },
    onError: (error) => {
      console.error('Error inviting member:', error)
      throw error
    }
  })

  // Update member role mutation
  const updateMemberRoleMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update member role')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
    },
    onError: (error) => {
      console.error('Error updating member role:', error)
      throw error
    }
  })

  // Remove member mutation
  const removeMemberMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove member')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-members', workspaceId] })
    },
    onError: (error) => {
      console.error('Error removing member:', error)
      throw error
    }
  })

  // Helper functions
  const handleInviteMember = async (email: string, role: string) => {
    return inviteMemberMutation.mutateAsync({ email, role })
  }

  const handleUpdateMemberRole = async (memberId: string, role: string) => {
    return updateMemberRoleMutation.mutateAsync({ memberId, role })
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return
    return removeMemberMutation.mutateAsync(memberId)
  }

  const refreshMembers = async () => {
    await refetch()
  }

  return {
    members,
    isLoading,
    error,
    refreshMembers,
    handleInviteMember,
    handleUpdateMemberRole,
    handleRemoveMember,
    inviteMemberMutation,
    updateMemberRoleMutation,
    removeMemberMutation,
  }
}