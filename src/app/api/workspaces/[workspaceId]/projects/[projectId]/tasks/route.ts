import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createTaskSchema, taskFilterSchema } from "@/lib/validations"
import { getProjectAccess } from "@/lib/auth-utils"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId, projectId } = await context.params
    const { searchParams } = new URL(req.url)

    // Check project access
    const access = await getProjectAccess(projectId, session.user.id)
    if (!access?.hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Parse query parameters
    const filters = taskFilterSchema.parse({
      status: searchParams.get("status")?.split(",") || undefined,
      priority: searchParams.get("priority")?.split(",") || undefined,
      assigneeId: searchParams.get("assigneeId")?.split(",") || undefined,
      milestoneId: searchParams.get("milestoneId") || undefined,
      labelIds: searchParams.get("labelIds")?.split(",") || undefined,
      type: searchParams.get("type")?.split(",") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: searchParams.get("sortBy") as any || "updated",
      sortOrder: searchParams.get("sortOrder") as any || "desc",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "50"),
    })

    // Build where clause
    const where: any = {
      projectId,
    }

    if (filters.status?.length) {
      where.status = { in: filters.status }
    }

    if (filters.priority?.length) {
      where.priority = { in: filters.priority }
    }

    if (filters.assigneeId?.length) {
      where.assigneeId = { in: filters.assigneeId }
    }

    if (filters.milestoneId) {
      where.milestoneId = filters.milestoneId
    }

    if (filters.type?.length) {
      where.type = { in: filters.type }
    }

    if (filters.labelIds?.length) {
      where.labels = {
        some: {
          labelId: { in: filters.labelIds }
        }
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ]
    }

    // Handle due date filters
    if (filters.dueDate) {
      const now = new Date()
      switch (filters.dueDate) {
        case "overdue":
          where.dueDate = { lt: now }
          where.status = { not: "done" }
          break
        case "today":
          const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
          where.dueDate = { gte: startOfDay, lt: endOfDay }
          break
        case "this_week":
          const startOfWeek = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000)
          const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000)
          where.dueDate = { gte: startOfWeek, lt: endOfWeek }
          break
        case "this_month":
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          where.dueDate = { gte: startOfMonth, lt: endOfMonth }
          break
      }
    }

    // Build order by
    const orderBy: any = {}
    switch (filters.sortBy) {
      case "created":
        orderBy.createdAt = filters.sortOrder
        break
      case "updated":
        orderBy.updatedAt = filters.sortOrder
        break
      case "priority":
        // Custom priority ordering: critical > high > medium > low
        orderBy.priority = filters.sortOrder
        break
      case "dueDate":
        orderBy.dueDate = filters.sortOrder
        break
      case "title":
        orderBy.title = filters.sortOrder
        break
      default:
        orderBy.updatedAt = "desc"
    }

    const tasks = await db.task.findMany({
      where,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
            color: true,
          },
        },
        milestone: {
          select: {
            id: true,
            name: true,
          },
        },
        labels: {
          include: {
            label: true,
          },
        },
        parent: {
          select: {
            id: true,
            title: true,
            number: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            number: true,
            status: true,
          },
        },
        _count: {
          select: {
            comments: true,
            timeEntries: true,
          },
        },
      },
      orderBy,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    })

    // Get total count for pagination
    const totalCount = await db.task.count({ where })

    const response = {
      tasks,
      pagination: {
        page: filters.page,
        limit: filters.limit,
        total: totalCount,
        pages: Math.ceil(totalCount / filters.limit),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string; projectId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId, projectId } = await context.params

    // Check project access
    const access = await getProjectAccess(projectId, session.user.id)
    if (!access?.hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body = await req.json()
    const validatedFields = createTaskSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.format() },
        { status: 400 }
      )
    }

    const data = validatedFields.data

    // Get the next task number for this project
    const lastTask = await db.task.findFirst({
      where: { projectId },
      orderBy: { number: "desc" },
      select: { number: true },
    })

    const nextNumber = (lastTask?.number || 0) + 1

    // Create task
    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || "todo",
        priority: data.priority || "medium",
        type: data.type || "task",
        number: nextNumber,
        storyPoints: data.storyPoints,
        originalEstimate: data.originalEstimate,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        startDate: data.startDate ? new Date(data.startDate) : null,
        projectId,
        creatorId: session.user.id,
        assigneeId: data.assigneeId,
        milestoneId: data.milestoneId,
        parentId: data.parentId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
            color: true,
          },
        },
        milestone: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    // Add labels if provided
    if (data.labelIds?.length) {
      await db.taskLabel.createMany({
        data: data.labelIds.map(labelId => ({
          taskId: task.id,
          labelId,
        })),
      })
    }

    // Log activity
    await db.activityLog.create({
      data: {
        action: "created",
        entity: "task",
        entityId: task.id,
        userId: session.user.id,
        changes: {
          title: task.title,
          status: task.status,
          priority: task.priority,
        },
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
