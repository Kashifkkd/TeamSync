import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params

    const task = await db.task.findUnique({
      where: { id: taskId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
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
            name: true
          }
        },
        comments: {
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
            createdAt: 'asc'
          }
        },
        attachments: true,
        children: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params
    const body = await request.json()

    const {
      title,
      description,
      status,
      priority,
      assigneeId,
      startDate,
      dueDate,
      timeEstimate,
      tags,
      progress
    } = body

    const task = await db.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assigneeId !== undefined && { assigneeId }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(dueDate && { dueDate: new Date(dueDate) }),
        ...(timeEstimate !== undefined && { 
          timeEstimate,
          remainingEstimate: timeEstimate
        }),
        ...(tags && { tags }),
        ...(progress !== undefined && { progress })
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
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
            name: true
          }
        }
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
  { params }: { params: { taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params

    await db.task.delete({
      where: { id: taskId }
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
