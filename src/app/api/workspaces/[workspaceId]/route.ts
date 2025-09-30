import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

// GET /api/workspaces/[workspaceId] - Get workspace by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = params

    // Try to find workspace by slug first, then by ID
    const workspace = await db.workspace.findFirst({
      where: {
        OR: [
          { slug: workspaceId },
          { id: workspaceId }
        ],
        members: {
          some: {
            userId: user.id
          }
        }
      },
      include: {
        members: {
          where: { userId: user.id },
          select: {
            role: true,
            status: true
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    return NextResponse.json(workspace)
  } catch (error) {
    console.error("Error fetching workspace:", error)
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 }
    )
  }
}
