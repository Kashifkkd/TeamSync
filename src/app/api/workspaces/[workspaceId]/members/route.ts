import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { TeamService } from "@/lib/services/team-service"
import { WorkspaceRole } from "@/lib/types/team"

// GET /api/workspaces/[workspaceId]/members - Get all workspace members
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = params

    // Get user's role in workspace
    const userRole = await TeamService.getUserWorkspaceRole(workspaceId, user.id)
    if (!userRole) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 })
    }

    const members = await TeamService.getWorkspaceMembers(workspaceId)
    
    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching workspace members:", error)
    return NextResponse.json(
      { error: "Failed to fetch workspace members" },
      { status: 500 }
    )
  }
}

// POST /api/workspaces/[workspaceId]/members - Invite a new member
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = params
    const body = await request.json()

    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Get user's role in workspace
    const userRole = await TeamService.getUserWorkspaceRole(workspaceId, user.id)
    if (!userRole) {
      return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 })
    }

    const invite = await TeamService.inviteWorkspaceMember(
      workspaceId,
      user.id,
      userRole,
      { email, role }
    )

    // TODO: Send email invitation
    console.log(`Invitation sent to ${email} for workspace ${workspaceId}`)

    return NextResponse.json({ invite }, { status: 201 })
  } catch (error) {
    console.error("Error inviting workspace member:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    )
  }
}
