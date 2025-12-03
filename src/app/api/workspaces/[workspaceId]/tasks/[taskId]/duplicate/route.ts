import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId, workspaceId } = params

    // Fetch the original task
    const originalTask = await db.task.findFirst({
      where: {
        id: taskId,
        project: {
          workspaceId
        }
      },
      include: {
        labels: {
          include: {
            label: true
          }
        }
      }
    })

    if (!originalTask) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    // Get the next task number for the project
    const lastTask = await db.task.findFirst({
      where: { projectId: originalTask.projectId },
      orderBy: { number: "desc" }
    })
    const nextNumber = lastTask ? lastTask.number + 1 : 1

    // Get the max position for ordering
    const lastPositionTask = await db.task.findFirst({
      where: { projectId: originalTask.projectId, status: originalTask.status },
      orderBy: { position: "desc" }
    })
    const nextPosition = lastPositionTask ? lastPositionTask.position + 1 : 0

    // Create the duplicate task
    const duplicatedTask = await db.task.create({
      data: {
        title: `${originalTask.title} (Copy)`,
        description: originalTask.description,
        status: originalTask.status,
        priority: originalTask.priority,
        type: originalTask.type,
        number: nextNumber,
        position: nextPosition,
        storyPoints: originalTask.storyPoints,
        originalEstimate: originalTask.originalEstimate,
        remainingEstimate: originalTask.originalEstimate, // Reset to original
        projectId: originalTask.projectId,
        milestoneId: originalTask.milestoneId,
        assigneeId: originalTask.assigneeId,
        creatorId: user.id!,
        statusId: originalTask.statusId,
        labels: {
          create: originalTask.labels.map((tl) => ({
            labelId: tl.label.id
          }))
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
        action: "DUPLICATE",
        entity: "TASK",
        entityId: duplicatedTask.id,
        userId: user.id!,
        changes: {
          originalTaskId: taskId,
          title: duplicatedTask.title
        }
      }
    })

    return NextResponse.json({ task: duplicatedTask }, { status: 201 })
  } catch (error) {
    console.error("Error duplicating task:", error)
    return NextResponse.json(
      { error: "Failed to duplicate task" },
      { status: 500 }
    )
  }
}

