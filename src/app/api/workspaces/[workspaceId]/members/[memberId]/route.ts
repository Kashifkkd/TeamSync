import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { TeamService } from "@/lib/services/team-service"

// PUT /api/workspaces/[workspaceId]/members/[memberId] - Update member role
export async function PUT(
  request: NextRequest,
  { params }: { params: { workspaceId: string; memberId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, memberId } = params
    const body = await request.json()

    const { role } = body

    if (!role) {
      return NextResponse.json(
        { error: "Role is required" },
        { status: 400 }
      )
    }

    // Get user's role in workspace
    const userRole = await TeamService.getUserWorkspaceRole(workspaceId, user.id)
    if (!userRole) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 })
    }

    await TeamService.updateWorkspaceMemberRole(workspaceId, memberId, role, userRole)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating member role:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Failed to update member role" },
      { status: 500 }
    )
  }
}

// DELETE /api/workspaces/[workspaceId]/members/[memberId] - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; memberId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, memberId } = params

    // Get user's role in workspace
    const userRole = await TeamService.getUserWorkspaceRole(workspaceId, user.id)
    if (!userRole) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 })
    }

    await TeamService.removeWorkspaceMember(workspaceId, memberId, userRole)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing member:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Failed to remove member" },
      { status: 500 }
    )
  }
}
