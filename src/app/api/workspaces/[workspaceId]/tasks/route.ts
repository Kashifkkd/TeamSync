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
      return NextResponse.json({ tasks: [], total: 0 })
    }
    
    const projectId = searchParams.get("projectId")
    const milestoneId = searchParams.get("milestoneId")
    const status = searchParams.get("status")
    const assigneeId = searchParams.get("assigneeId")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")

    const where: any = {
      project: {
        workspaceId: workspace.id
      }
    }

    if (projectId) where.projectId = projectId
    if (milestoneId) where.milestoneId = milestoneId
    if (status) where.status = status
    if (assigneeId) where.assigneeId = assigneeId
    if (priority) where.priority = priority
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    // Get total count for pagination
    const total = await db.task.count({ where })

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    const tasks = await db.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        milestone: {
          select: {
            id: true,
            name: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
            color: true
          }
        },
        labels: {
          include: {
            label: true
          }
        },
        taskStatus: true,
        _count: {
          select: {
            comments: true,
            timeEntries: true,
            children: true
          }
        }
      },
      orderBy: { position: "asc" },
      skip,
      take: limit
    })

    return NextResponse.json({ 
      tasks, 
      total,
      page,
      limit,
      totalPages
    })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
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

    const {
      title,
      description,
      status = "todo",
      priority = "medium",
      type = "task",
      assigneeId,
      projectId,
      milestoneId,
      startDate,
      dueDate,
      storyPoints,
      originalEstimate,
      parentId,
      statusId,
      labelIds = []
    } = body

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required" },
        { status: 400 }
      )
    }

    // Verify project belongs to workspace
    const project = await db.project.findFirst({
      where: { id: projectId, workspaceId: workspace.id }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found in workspace" },
        { status: 404 }
      )
    }

    // Get the next task number for the project
    const lastTask = await db.task.findFirst({
      where: { projectId },
      orderBy: { number: "desc" }
    })
    const nextNumber = lastTask ? lastTask.number + 1 : 1

    // Get the max position for ordering
    const lastPositionTask = await db.task.findFirst({
      where: { projectId, status },
      orderBy: { position: "desc" }
    })
    const nextPosition = lastPositionTask ? lastPositionTask.position + 1 : 0

    const task = await db.task.create({
      data: {
        title,
        description,
        status,
        priority,
        type,
        number: nextNumber,
        position: nextPosition,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        storyPoints,
        originalEstimate,
        remainingEstimate: originalEstimate,
        projectId,
        milestoneId,
        assigneeId,
        creatorId: user.id!,
        parentId,
        statusId,
        labels: labelIds.length > 0 ? {
          create: labelIds.map((labelId: string) => ({
            labelId
          }))
        } : undefined
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        milestone: {
          select: {
            id: true,
            name: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
            color: true
          }
        },
        labels: {
          include: {
            label: true
          }
        },
        taskStatus: true,
        _count: {
          select: {
            comments: true,
            timeEntries: true,
            children: true
          }
        }
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: "CREATE",
        entity: "TASK",
        entityId: task.id,
        userId: user.id!,
        changes: {
          title: task.title,
          status: task.status,
          priority: task.priority
        }
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { taskIds, updates } = body

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json(
        { error: "taskIds array is required" },
        { status: 400 }
      )
    }

    // Bulk update tasks
    await db.task.updateMany({
      where: { id: { in: taskIds } },
      data: updates
    })

    // Fetch updated tasks
    const tasks = await db.task.findMany({
      where: { id: { in: taskIds } },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
            color: true
          }
        },
        labels: {
          include: {
            label: true
          }
        },
        _count: {
          select: {
            comments: true,
            timeEntries: true,
            children: true
          }
        }
      }
    })

    // Log activity for bulk update
    await db.activityLog.create({
      data: {
        action: "BULK_UPDATE",
        entity: "TASK",
        entityId: taskIds.join(","),
        userId: user.id!,
        changes: updates
      }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error bulk updating tasks:", error)
    return NextResponse.json(
      { error: "Failed to bulk update tasks" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const taskIds = searchParams.get("ids")?.split(",") || []

    if (taskIds.length === 0) {
      return NextResponse.json(
        { error: "Task IDs are required" },
        { status: 400 }
      )
    }

    // Delete tasks
    await db.task.deleteMany({
      where: { id: { in: taskIds } }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: "BULK_DELETE",
        entity: "TASK",
        entityId: taskIds.join(","),
        userId: user.id!
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tasks:", error)
    return NextResponse.json(
      { error: "Failed to delete tasks" },
      { status: 500 }
    )
  }
}

