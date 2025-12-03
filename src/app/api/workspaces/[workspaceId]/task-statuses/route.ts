import { NextRequest, NextResponse } from "next/server"
import { TaskStatusService, CreateTaskStatusInput } from "@/lib/services/task-statuses"
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
      return NextResponse.json({ taskStatuses: [], total: 0, page, limit, totalPages: 0 })
    }

    // Get task statuses
    let taskStatuses = await TaskStatusService.getTaskStatuses(workspace.id)
    
    // If no statuses exist, create default ones (only happens once per workspace)
    if (taskStatuses.length === 0) {
      await TaskStatusService.createDefaultStatuses(workspace.id)
      taskStatuses = await TaskStatusService.getTaskStatuses(workspace.id)
    }

    const total = taskStatuses.length
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({ taskStatuses, total, page, limit, totalPages })
  } catch (error) {
    console.error("Error fetching task statuses:", error)
    return NextResponse.json(
      { error: "Failed to fetch task statuses" },
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

    const input: CreateTaskStatusInput = {
      ...body,
      workspaceId: workspace.id
    }

    const taskStatus = await TaskStatusService.createTaskStatus(input)

    return NextResponse.json({ taskStatus }, { status: 201 })
  } catch (error) {
    console.error("Error creating task status:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create task status" },
      { status: 400 }
    )
  }
}
