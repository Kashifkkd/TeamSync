"use client"

import { useParams } from "next/navigation"
import { WorkspaceMembers } from "@/components/team/workspace-members"
import { TeamNavigation } from "@/components/team/team-navigation"
import { useWorkspace } from "@/hooks/use-workspace-data"

export default function TeamPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const { data: workspace, isLoading } = useWorkspace(slug)

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-64 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">Workspace Not Found</h1>
        <p className="text-muted-foreground">
          The workspace you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <p className="text-muted-foreground">
              Manage workspace members and their permissions.
            </p>
          </div>
          <TeamNavigation 
            workspaceId={workspace.id}
            workspaceSlug={slug}
            currentUserRole={workspace.userRole}
          />
        </div>
      </div>
      
      <WorkspaceMembers 
        workspaceId={workspace.id} 
        currentUserRole={workspace.userRole} 
      />
    </>
  )
}
