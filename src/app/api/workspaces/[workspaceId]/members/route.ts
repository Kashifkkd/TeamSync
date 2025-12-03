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
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "100")

    // Try to find workspace by ID first, then by slug
    let workspace = await db.workspace.findUnique({
      where: { id: workspaceSlugOrId }
    })
    
    if (!workspace) {
      workspace = await db.workspace.findUnique({
        where: { slug: workspaceSlugOrId }
      })
    }
    
    // If workspace not found, return empty response
    if (!workspace) {
      return NextResponse.json({ members: [], total: 0, page, limit, totalPages: 0 })
    }

    // Get total count
    const total = await db.workspaceMember.count({
      where: { workspaceId: workspace.id }
    })

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const members = await db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
      skip,
      take: limit
    })

    return NextResponse.json({ members, total, page, limit, totalPages })
  } catch (error) {
    console.error("Error fetching workspace members:", error)
    return NextResponse.json(
      { error: "Failed to fetch workspace members" },
      { status: 500 }
    )
  }
}

export async function POST(
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
    
    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { email, role } = body

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email and role are required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const invitedUser = await db.user.findUnique({
      where: { email }
    })

    if (!invitedUser) {
      return NextResponse.json(
        { error: "User not found. They need to sign up first." },
        { status: 404 }
      )
    }

    // Check if already a member
    const existingMember = await db.workspaceMember.findFirst({
      where: {
        workspaceId: workspace.id,
        userId: invitedUser.id
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this workspace" },
        { status: 409 }
      )
    }

    const member = await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: invitedUser.id,
        role,
        status: "active",
        invitedBy: user.id!
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json({ member }, { status: 201 })
  } catch (error) {
    console.error("Error inviting member:", error)
    return NextResponse.json(
      { error: "Failed to invite member" },
      { status: 500 }
    )
  }
}
