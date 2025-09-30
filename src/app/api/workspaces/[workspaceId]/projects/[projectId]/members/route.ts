import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { TeamService } from "@/lib/services/team-service"

// GET /api/workspaces/[workspaceId]/projects/[projectId]/members - Get all project members
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; projectId: string } }
) {
  try {
    const user = await requireAuth()
    const { projectId } = params

    // Get user's role in project
    const userRole = await TeamService.getUserProjectRole(projectId, user.id)
    if (!userRole) {
      return NextResponse.json({ error: "Not a member of this project" }, { status: 403 })
    }

    const members = await TeamService.getProjectMembers(projectId)
    
    return NextResponse.json({ members })
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json(
      { error: "Failed to fetch project members" },
      { status: 500 }
    )
  }
}

// POST /api/workspaces/[workspaceId]/projects/[projectId]/members - Invite a new member
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; projectId: string } }
) {
  try {
    const user = await requireAuth()
    const { projectId } = params
    const body = await request.json()

    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Get user's role in project
    const userRole = await TeamService.getUserProjectRole(projectId, user.id)
    if (!userRole) {
      return NextResponse.json({ error: "Not a member of this project" }, { status: 403 })
    }

    const invite = await TeamService.inviteProjectMember(
      projectId,
      user.id,
      userRole,
      { email, role }
    )

    // TODO: Send email invitation
    console.log(`Invitation sent to ${email} for project ${projectId}`)

    return NextResponse.json({ invite }, { status: 201 })
  } catch (error) {
    console.error("Error inviting project member:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    )
  }
}
