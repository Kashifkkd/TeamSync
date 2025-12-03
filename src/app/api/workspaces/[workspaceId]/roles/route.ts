import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { ROLE, getAllSystemRoles } from "@/lib/permissions"

// GET /api/workspaces/[workspaceId]/roles - Get all workspace roles
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = await params

    // Verify user has access to workspace
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
          select: { role: true }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const userRole = workspace.members[0]?.role
    if (!userRole || (userRole !== ROLE.OWNER && userRole !== ROLE.ADMIN)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Get all workspace members to count roles
    const members = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      select: { role: true }
    })

    // Create system-generated roles with member counts
    const roleCounts = members.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Get system roles with member counts
    const systemRoles = getAllSystemRoles().map(role => ({
      ...role,
      memberCount: roleCounts[role.id] || 0
    }))

    return NextResponse.json({ 
      roles: systemRoles,
      total: systemRoles.length,
      count: systemRoles.length 
    })
  } catch (error) {
    console.error("Error fetching workspace roles:", error)
    return NextResponse.json(
      { error: "Failed to fetch workspace roles" },
      { status: 500 }
    )
  }
}

// POST /api/workspaces/[workspaceId]/roles - Create a new custom role
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = await params
    const body = await request.json()

    const { name, description } = body

    if (!name || !description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      )
    }

    // Verify user has admin access to workspace
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
          select: { role: true }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const userRole = workspace.members[0]?.role
    if (!userRole || (userRole !== ROLE.OWNER && userRole !== ROLE.ADMIN)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // For now, we'll just return a success message since we're using system roles
    // In the future, you could implement custom role creation here
    return NextResponse.json({ 
      error: "Custom roles not yet implemented. Using system roles only." 
    }, { status: 501 })

  } catch (error) {
    console.error("Error creating workspace role:", error)
    return NextResponse.json(
      { error: "Failed to create workspace role" },
      { status: 500 }
    )
  }
}
