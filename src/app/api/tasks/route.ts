import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const milestoneId = searchParams.get("milestoneId")
    const projectId = searchParams.get("projectId")

    const where: any = {}
    if (milestoneId) where.milestoneId = milestoneId
    if (projectId) where.projectId = projectId

    const tasks = await db.task.findMany({
      where,
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const {
      title,
      description,
      status = "todo",
      priority = "medium",
      assigneeId,
      startDate,
      dueDate,
      timeEstimate,
      tags = [],
      progress = 0,
      milestoneId,
      projectId
    } = body

    // Get the next task number for the project
    const lastTask = await db.task.findFirst({
      where: { projectId },
      orderBy: { number: 'desc' }
    })
    const nextNumber = lastTask ? lastTask.number + 1 : 1

    const task = await db.task.create({
      data: {
        title,
        description,
        status,
        priority,
        number: nextNumber,
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        timeEstimate: timeEstimate || null,
        originalEstimate: timeEstimate || null,
        remainingEstimate: timeEstimate || null,
        progress,
        tags,
        projectId,
        milestoneId,
        assigneeId,
        creatorId: user.id
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

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
