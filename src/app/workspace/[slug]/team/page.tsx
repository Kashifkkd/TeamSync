import { redirect } from "next/navigation"
import { requireAuth, getWorkspaceBySlug } from "@/lib/auth-utils"
import { WorkspaceMembers } from "@/components/team/workspace-members"
import { WorkspaceRole } from "@/lib/types/team"

interface TeamPageProps {
  params: Promise<{ slug: string }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const user = await requireAuth()
  const { slug } = await params
  
  const workspace = await getWorkspaceBySlug(slug, user.id!)
  
  if (!workspace) {
    redirect("/dashboard")
  }

  const userRole = workspace.userRole as WorkspaceRole

  if (!userRole) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground">
              You don&apos;t have permission to view team members.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground">
            Manage workspace members and their permissions.
          </p>
        </div>
        
        <WorkspaceMembers 
          workspaceId={workspace.id} 
          currentUserRole={userRole} 
        />
      </div>
    </div>
  )
}
