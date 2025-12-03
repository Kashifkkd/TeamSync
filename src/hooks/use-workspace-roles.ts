import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface WorkspaceRole {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  memberCount: number
}

interface UseWorkspaceRolesProps {
  workspaceId: string
}

export function useWorkspaceRoles({ workspaceId }: UseWorkspaceRolesProps) {
  const queryClient = useQueryClient()

  // Fetch roles
  const {
    data: roles = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['workspace-roles', workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/roles`)
      if (!response.ok) throw new Error('Failed to fetch roles')
      
      const data = await response.json()
      return data.roles || []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
    gcTime: 10 * 60 * 1000, // 10 minutes - cache persists longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch if data exists
  })

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async (role: Omit<WorkspaceRole, 'id' | 'memberCount'>) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create role')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-roles', workspaceId] })
    },
    onError: (error) => {
      console.error('Error creating role:', error)
      throw error
    }
  })

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, role }: { roleId: string; role: Partial<WorkspaceRole> }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/roles/${roleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(role),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update role')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-roles', workspaceId] })
    },
    onError: (error) => {
      console.error('Error updating role:', error)
      throw error
    }
  })

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/roles/${roleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete role')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace-roles', workspaceId] })
    },
    onError: (error) => {
      console.error('Error deleting role:', error)
      throw error
    }
  })

  // Helper functions
  const handleCreateRole = async (role: Omit<WorkspaceRole, 'id' | 'memberCount'>) => {
    return createRoleMutation.mutateAsync(role)
  }

  const handleUpdateRole = async (roleId: string, role: Partial<WorkspaceRole>) => {
    return updateRoleMutation.mutateAsync({ roleId, role })
  }

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return
    return deleteRoleMutation.mutateAsync(roleId)
  }

  const refreshRoles = async () => {
    await refetch()
  }

  return {
    roles,
    isLoading,
    error,
    refreshRoles,
    handleCreateRole,
    handleUpdateRole,
    handleDeleteRole,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
  }
}
