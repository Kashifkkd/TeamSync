import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { TeamService } from "@/lib/services/team-service"

// POST /api/invites/accept - Accept an invitation
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { token, type } = body

    if (!token || !type) {
      return NextResponse.json(
        { error: "Token and type are required" },
        { status: 400 }
      )
    }

    if (type === 'workspace') {
      await TeamService.acceptWorkspaceInvite(token, user.id)
    } else if (type === 'project') {
      await TeamService.acceptProjectInvite(token, user.id)
    } else {
      return NextResponse.json(
        { error: "Invalid invitation type" },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error accepting invitation:", error)
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: "Failed to accept invitation" },
      { status: 500 }
    )
  }
}
