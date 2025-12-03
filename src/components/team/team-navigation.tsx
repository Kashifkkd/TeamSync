"use client"

import { useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, Settings } from "lucide-react"
import { ROLE } from "@/lib/constants"

interface TeamNavigationProps {
  workspaceId: string
  workspaceSlug: string
  currentUserRole: string
}

export function TeamNavigation({ workspaceId, workspaceSlug, currentUserRole }: TeamNavigationProps) {
  const queryClient = useQueryClient()

  const canManage = currentUserRole === ROLE.OWNER || currentUserRole === ROLE.ADMIN

  const prefetchInvitations = () => {
    queryClient.prefetchQuery({
      queryKey: ['invitations', workspaceId],
      queryFn: async () => {
        const response = await fetch(`/api/workspaces/${workspaceId}/invitations`)
        if (!response.ok) throw new Error('Failed to fetch invitations')
        const data = await response.json()
        return data.invitations || []
      },
      staleTime: 5 * 60 * 1000,
    })
  }

  const prefetchRoles = () => {
    queryClient.prefetchQuery({
      queryKey: ['workspace-roles', workspaceId],
      queryFn: async () => {
        const response = await fetch(`/api/workspaces/${workspaceId}/roles`)
        if (!response.ok) throw new Error('Failed to fetch roles')
        const data = await response.json()
        return data.roles || []
      },
      staleTime: 5 * 60 * 1000,
    })
  }

  if (!canManage) return null

  return (
    <div className="flex items-center space-x-2">
      <Link href={`/workspace/${workspaceSlug}/team/invitations`}>
        <Button 
          variant="outline" 
          size="sm"
          onMouseEnter={prefetchInvitations}
        >
          <Mail className="h-4 w-4 mr-2" />
          View Invitations
        </Button>
      </Link>
      <Link href={`/workspace/${workspaceSlug}/team/roles`}>
        <Button 
          variant="outline" 
          size="sm"
          onMouseEnter={prefetchRoles}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage Roles
        </Button>
      </Link>
    </div>
  )
}
