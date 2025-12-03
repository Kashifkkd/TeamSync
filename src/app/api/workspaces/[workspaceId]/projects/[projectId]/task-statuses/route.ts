import { NextRequest, NextResponse } from "next/server"
import { TaskStatusService, CreateTaskStatusInput } from "@/lib/services/task-statuses"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; projectId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId: workspaceSlugOrId, projectId } = params
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
      return NextResponse.json({ taskStatuses: [], total: 0, page, limit, totalPages: 0 })
    }

    // Verify project exists and belongs to workspace
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspace.id
      }
    })

    if (!project) {
      return NextResponse.json({ taskStatuses: [], total: 0, page, limit, totalPages: 0 })
    }

    // Get task statuses for this project
    let taskStatuses = await TaskStatusService.getTaskStatuses(workspace.id, projectId)
    
    // If no statuses exist, create default ones for this project
    if (taskStatuses.length === 0) {
      await TaskStatusService.createDefaultStatuses(workspace.id, projectId)
      taskStatuses = await TaskStatusService.getTaskStatuses(workspace.id, projectId)
    }

    const total = taskStatuses.length
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ taskStatuses, total, page, limit, totalPages })
  } catch (error) {
    console.error("Error fetching project task statuses:", error)
    return NextResponse.json(
      { error: "Failed to fetch project task statuses" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; projectId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId: workspaceSlugOrId, projectId } = params

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
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Verify project exists and belongs to workspace
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspace.id
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const body = await request.json()
    const { name, color, bgColor, textColor, badgeColor, order } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Status name is required" },
        { status: 400 }
      )
    }

    const taskStatus = await TaskStatusService.createTaskStatus({
      name: name.trim(),
      color,
      bgColor,
      textColor,
      badgeColor,
      order,
      workspaceId: workspace.id,
      projectId
    })

    return NextResponse.json({
      success: true,
      taskStatus,
    })
  } catch (error) {
    console.error("Error creating project task status:", error)
    return NextResponse.json(
      { error: "Failed to create project task status" },
      { status: 500 }
    )
  }
}
