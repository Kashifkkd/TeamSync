import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

// GET /api/workspaces/[workspaceId]/milestones/[milestoneId]/tasks - Get all tasks for a milestone
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; milestoneId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, milestoneId } = params

    // Verify user has access to workspace
    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: user.id
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Verify milestone exists and belongs to workspace
    const milestone = await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspaceId
      }
    })

    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    const tasks = await db.task.findMany({
      where: {
        milestoneId: milestoneId
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
        comments: {
          select: {
            id: true
          }
        },
        attachments: {
          select: {
            id: true
          }
        },
        subtasks: {
          select: {
            id: true,
            completed: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching milestone tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch milestone tasks" },
      { status: 500 }
    )
  }
}

// POST /api/workspaces/[workspaceId]/milestones/[milestoneId]/tasks - Create a new task for a milestone
export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; milestoneId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, milestoneId } = params
    const body = await request.json()

    const { 
      name, 
      description, 
      dueDate, 
      priority, 
      status, 
      assigneeId,
      tags 
    } = body

    // Verify user has access to workspace
    const workspace = await db.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: user.id
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Verify milestone exists and belongs to workspace
    const milestone = await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspaceId
      }
    })

    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    const task = await db.task.create({
      data: {
        name,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || "medium",
        status: status || "todo",
        milestoneId: milestoneId,
        assigneeId: assigneeId,
        creatorId: user.id,
        tags: tags || []
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
        comments: {
          select: {
            id: true
          }
        },
        attachments: {
          select: {
            id: true
          }
        },
        subtasks: {
          select: {
            id: true,
            completed: true
          }
        }
      }
    })

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Error creating milestone task:", error)
    return NextResponse.json(
      { error: "Failed to create milestone task" },
      { status: 500 }
    )
  }
}
