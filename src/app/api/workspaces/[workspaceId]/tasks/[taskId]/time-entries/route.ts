import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params

    const timeEntries = await db.timeEntry.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ timeEntries })
  } catch (error) {
    console.error("Error fetching time entries:", error)
    return NextResponse.json(
      { error: "Failed to fetch time entries" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params
    const body = await request.json()
    const { description, duration, startTime, endTime, date } = body

    if (!duration || duration <= 0) {
      return NextResponse.json(
        { error: "Duration must be greater than 0" },
        { status: 400 }
      )
    }

    const timeEntry = await db.timeEntry.create({
      data: {
        description,
        duration,
        startTime: startTime ? new Date(startTime) : null,
        endTime: endTime ? new Date(endTime) : null,
        date: date ? new Date(date) : new Date(),
        taskId,
        userId: user.id!
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Update task timeSpent
    await db.task.update({
      where: { id: taskId },
      data: {
        timeSpent: {
          increment: duration
        }
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: "LOG_TIME",
        entity: "TASK",
        entityId: taskId,
        userId: user.id!,
        changes: {
          duration
        }
      }
    })

    return NextResponse.json({ timeEntry }, { status: 201 })
  } catch (error) {
    console.error("Error creating time entry:", error)
    return NextResponse.json(
      { error: "Failed to create time entry" },
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
    const { taskId } = params
    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get("entryId")

    if (!entryId) {
      return NextResponse.json(
        { error: "Entry ID is required" },
        { status: 400 }
      )
    }

    const timeEntry = await db.timeEntry.findUnique({
      where: { id: entryId }
    })

    if (!timeEntry || timeEntry.taskId !== taskId) {
      return NextResponse.json(
        { error: "Time entry not found" },
        { status: 404 }
      )
    }

    await db.timeEntry.delete({
      where: { id: entryId }
    })

    // Update task timeSpent
    await db.task.update({
      where: { id: taskId },
      data: {
        timeSpent: {
          decrement: timeEntry.duration
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting time entry:", error)
    return NextResponse.json(
      { error: "Failed to delete time entry" },
      { status: 500 }
    )
  }
}

