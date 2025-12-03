import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId, workspaceId } = params

    const task = await db.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspaceId
        }
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
            email: true,
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        children: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            position: "asc"
          }
        },
        parent: {
          select: {
            id: true,
            title: true,
            number: true
          }
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          }
        },
        taskStatus: true,
        customFields: {
          include: {
            field: true,
            updatedBy: {
              select: {
                id: true,
                name: true
              }
            }
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

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId, workspaceId } = params
    const body = await request.json()

    // Verify task belongs to workspace
    const existingTask = await db.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspaceId
        }
      }
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    const {
      title,
      description,
      status,
      priority,
      type,
      assigneeId,
      milestoneId,
      startDate,
      dueDate,
      storyPoints,
      originalEstimate,
      remainingEstimate,
      timeSpent,
      parentId,
      statusId,
      position,
      labelIds
    } = body

    // Handle label updates if provided
    let labelOperations = {}
    if (labelIds !== undefined) {
      labelOperations = {
        deleteMany: {},
        create: labelIds.map((labelId: string) => ({
          labelId
        }))
      }
    }

    const task = await db.task.update({
      where: { id: taskId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(type !== undefined && { type }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(milestoneId !== undefined && { milestoneId }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(storyPoints !== undefined && { storyPoints }),
        ...(originalEstimate !== undefined && { originalEstimate }),
        ...(remainingEstimate !== undefined && { remainingEstimate }),
        ...(timeSpent !== undefined && { timeSpent }),
        ...(parentId !== undefined && { parentId }),
        ...(statusId !== undefined && { statusId }),
        ...(position !== undefined && { position }),
        ...(labelIds !== undefined && { labels: labelOperations })
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
        action: "UPDATE",
        entity: "TASK",
        entityId: task.id,
        userId: user.id!,
        changes: body
      }
    })

    return NextResponse.json({ task })
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId, workspaceId } = params

    // Verify task belongs to workspace
    const task = await db.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspaceId
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    await db.task.delete({
      where: { id: taskId }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: "DELETE",
        entity: "TASK",
        entityId: taskId,
        userId: user.id!
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}

