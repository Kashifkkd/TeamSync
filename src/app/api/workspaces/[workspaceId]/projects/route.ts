import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createProjectSchema } from "@/lib/validations"
import { hasWorkspaceAccess } from "@/lib/auth-utils"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId } = await context.params

    // Check workspace access
    const hasAccess = await hasWorkspaceAccess(workspaceId, session.user.id)
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const projects = await db.project.findMany({
      where: { workspaceId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            milestones: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId } = await context.params

    // Check workspace access (admin or owner required)
    const hasAccess = await hasWorkspaceAccess(workspaceId, session.user.id, "admin")
    if (!hasAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body = await req.json()
    const validatedFields = createProjectSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.format() },
        { status: 400 }
      )
    }

    const { name, key, description, status, priority, visibility, color, startDate, endDate } = validatedFields.data

    // Check if project key already exists in workspace
    const existingProject = await db.project.findUnique({
      where: {
        workspaceId_key: {
          workspaceId,
          key,
        },
      },
    })

    if (existingProject) {
      return NextResponse.json(
        { error: "Project key already exists in this workspace" },
        { status: 400 }
      )
    }

    // Create project
    const project = await db.project.create({
      data: {
        name,
        key,
        description,
        status,
        priority,
        visibility,
        color: color || "#3b82f6",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        workspaceId,
        creatorId: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            tasks: true,
            milestones: true,
          },
        },
      },
    })

    // Add creator as project lead
    await db.projectMember.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        role: "lead",
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
