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
    const projectId = searchParams.get("projectId")
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
      return NextResponse.json({ labels: [], total: 0, page, limit, totalPages: 0 })
    }

    const where: any = {
      workspaceId: workspace.id
    }

    if (projectId) {
      where.OR = [
        { projectId },
        { projectId: null }
      ]
    }

    // Get total count
    const total = await db.label.count({ where })

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const labels = await db.label.findMany({
      where,
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      },
      orderBy: { name: "asc" },
      skip,
      take: limit
    })

    return NextResponse.json({ labels, total, page, limit, totalPages })
  } catch (error) {
    console.error("Error fetching labels:", error)
    return NextResponse.json(
      { error: "Failed to fetch labels" },
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
    const { name, color, description, projectId } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Label name is required" },
        { status: 400 }
      )
    }

    // Check if label with same name exists in workspace
    const existing = await db.label.findFirst({
      where: {
        workspaceId: workspace.id,
        name: name.trim(),
        projectId: projectId || null
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: "Label with this name already exists" },
        { status: 409 }
      )
    }

    const label = await db.label.create({
      data: {
        name: name.trim(),
        color: color || "#3b82f6",
        description,
        workspaceId: workspace.id,
        projectId
      },
      include: {
        _count: {
          select: {
            tasks: true
          }
        }
      }
    })

    return NextResponse.json({ label }, { status: 201 })
  } catch (error) {
    console.error("Error creating label:", error)
    return NextResponse.json(
      { error: "Failed to create label" },
      { status: 500 }
    )
  }
}

