import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// interface Invitation {
//   id: string
//   email: string
//   role: string
//   status: InviteStatus
//   invitedAt: string
//   expiresAt: string
//   invitedBy: {
//     name: string
//     email: string
//   }
// }

interface UseWorkspaceInvitationsProps {
  workspaceId: string
}

export function useWorkspaceInvitations({ workspaceId }: UseWorkspaceInvitationsProps) {
  const queryClient = useQueryClient()

  // Fetch invitations
  const {
    data: invitations = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['invitations', workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/invitations`)
      if (!response.ok) throw new Error('Failed to fetch invitations')
      
      const data = await response.json()
      return data.invitations || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists
  })

  // Resend invitation mutation
  const resendInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/invitations/${invitationId}/resend`, {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to resend invitation')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] })
    },
    onError: (error) => {
      console.error('Error resending invitation:', error)
      throw error
    }
  })

  // Cancel invitation mutation
  const cancelInvitationMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/invitations/${invitationId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to cancel invitation')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations', workspaceId] })
    },
    onError: (error) => {
      console.error('Error canceling invitation:', error)
      throw error
    }
  })

  // Helper functions
  const handleResendInvitation = async (invitationId: string) => {
    return resendInvitationMutation.mutateAsync(invitationId)
  }

  const handleCancelInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to cancel this invitation?')) return
    return cancelInvitationMutation.mutateAsync(invitationId)
  }

  const handleCopyInviteLink = async (invitationId: string) => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/invitations/${invitationId}/link`)
      if (!response.ok) throw new Error('Failed to get invite link')
      
      const data = await response.json()
      await navigator.clipboard.writeText(data.link)
      // TODO: Show toast notification
    } catch (error) {
      console.error('Error copying invite link:', error)
      throw error
    }
  }

  const refreshInvitations = async () => {
    await refetch()
  }

  return {
    invitations,
    isLoading,
    error,
    refreshInvitations,
    handleResendInvitation,
    handleCancelInvitation,
    handleCopyInviteLink,
    resendInvitationMutation,
    cancelInvitationMutation,
  }
}
