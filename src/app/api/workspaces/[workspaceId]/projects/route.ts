import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createProjectSchema } from "@/lib/validations"
import { TeamService } from "@/lib/services/team-service"
import { ROLE, DEFAULT_COLORS, MEMBER_STATUS } from "@/lib/constants"

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId: workspaceSlug } = await context.params

    // Verify user has access to workspace (using slug)
    const workspace = await db.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where: { workspaceId: workspace.id },
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
      }),
      db.project.count({
        where: { workspaceId: workspace.id }
      })
    ])

    return NextResponse.json({ 
      projects,
      total,
      count: projects.length 
    })
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { workspaceId: workspaceSlug } = await context.params

    // Verify user has access to workspace (using slug)
    const workspace = await db.workspace.findFirst({
      where: {
        slug: workspaceSlug,
        members: {
          some: {
            userId: session.user.id
          }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
    }

    // Check if user can create projects (admin or owner required)
    const canCreate = await TeamService.canUserCreateProject(workspace.id, session.user.id)
    if (!canCreate) {
      return NextResponse.json({ 
        error: "Only admins and owners can create projects" 
      }, { status: 403 })
    }

    const body = await req.json()
    const validatedFields = createProjectSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.format() },
        { status: 400 }
      )
    }

    const { name, key, description, status, priority, visibility, color, startDate, endDate, teamMembers } = validatedFields.data

    // Check if project key already exists in workspace
    const existingProject = await db.project.findUnique({
      where: {
        workspaceId_key: {
          workspaceId: workspace.id,
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

    // Prepare team members data (creator as admin + selected members)
    const membersData = [
      {
        userId: session.user.id,
        role: ROLE.ADMIN,
        status: MEMBER_STATUS.ACTIVE,
      },
      ...(teamMembers || []).map(member => ({
        userId: member.userId,
        role: member.role,
        status: MEMBER_STATUS.ACTIVE,
      }))
    ]

    // Create project with creator as admin and selected team members
    const project = await db.project.create({
      data: {
        name,
        key,
        description,
        status,
        priority,
        visibility,
        color: color || DEFAULT_COLORS.PRIMARY,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        workspaceId: workspace.id,
        creatorId: session.user.id,
        members: {
          create: membersData
        }
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

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
