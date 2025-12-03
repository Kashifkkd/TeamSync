import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { ROLE } from "@/lib/constants"

// GET /api/workspaces/[workspaceId]/invitations - Get all workspace invitations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = await params

    // Get user's role in workspace
    const workspaceMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
        status: 'active'
      }
    })

    if (!workspaceMember || (workspaceMember.role !== ROLE.OWNER && workspaceMember.role !== ROLE.ADMIN)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const invitations = await db.workspaceInvite.findMany({
      where: { workspaceId },
      include: {
        inviter: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: { invitedAt: 'desc' }
    })

    return NextResponse.json({ 
      invitations: invitations.map(invite => ({
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        invitedAt: invite.invitedAt,
        expiresAt: invite.expiresAt,
        acceptedAt: invite.acceptedAt,
        inviter: invite.inviter,
      })),
      total: invitations.length,
      count: invitations.length 
    })
  } catch (error) {
    console.error("Error fetching workspace invitations:", error)
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    )
  }
}
