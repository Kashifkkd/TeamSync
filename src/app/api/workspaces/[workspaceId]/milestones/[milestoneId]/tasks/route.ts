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

    console.log('Fetching milestone tasks:', { workspaceId, milestoneId, userId: user.id })

    // Verify user has access to workspace
    const workspace = await db.workspace.findFirst({
      where: {
        slug: workspaceId,
        members: {
          some: {
            userId: user.id
          }
        }
      }
    })

    if (!workspace) {
      console.log('Workspace not found:', { workspaceId, userId: user.id })
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    console.log('Workspace found:', { workspaceId: workspace.id, workspaceSlug: workspace.slug })

    // Verify milestone exists and belongs to workspace
    const milestone = await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspace.id
      }
    })

    console.log('Milestone query result:', { milestoneId, workspaceId: workspace.id, milestone: milestone?.id })

    if (!milestone) {
      console.log('Milestone not found:', { milestoneId, workspaceId: workspace.id })
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
        children: {
          select: {
            id: true,
            status: true
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
      assigneeId
    } = body

    // Verify user has access to workspace
    const workspace = await db.workspace.findFirst({
      where: {
        slug: workspaceId,
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
        workspaceId: workspace.id
      }
    })

    if (!milestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    const task = await db.task.create({
      data: {
        title: name,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority: priority || "medium",
        status: status || "todo",
        milestoneId: milestoneId,
        assigneeId: assigneeId,
        creatorId: user.id!,
        number: 1, // You might want to calculate this properly
        projectId: workspace.id // You might want to get this from the milestone
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
        children: {
          select: {
            id: true,
            status: true
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
