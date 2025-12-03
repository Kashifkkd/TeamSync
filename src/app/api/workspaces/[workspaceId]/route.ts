import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId: workspaceSlugOrId } = params

    // Try to find workspace by ID first, then by slug
    let workspace = await db.workspace.findUnique({
      where: { id: workspaceSlugOrId }
    })
    
    if (!workspace) {
      workspace = await db.workspace.findUnique({
        where: { slug: workspaceSlugOrId }
      })
    }
    
    // If workspace not found, return null workspace
    if (!workspace) {
      return NextResponse.json({ workspace: null })
    }

    // Get user's role in workspace
    const member = await db.workspaceMember.findFirst({
      where: {
        workspaceId: workspace.id,
        userId: user.id
      }
    })

    const workspaceWithRole = {
      ...workspace,
      userRole: member?.role || null
    }

    return NextResponse.json({ workspace: workspaceWithRole })
  } catch (error) {
    console.error("Error fetching workspace:", error)
    return NextResponse.json(
      { error: "Failed to fetch workspace" },
      { status: 500 }
    )
  }
}
