import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

// GET /api/workspaces/[workspaceId]/milestones - Get all milestones for a workspace
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = await params
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('project')

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

    const [milestones, total] = await Promise.all([
      db.milestone.findMany({
        where: {
          workspaceId: workspace.id,
          ...(projectId && { projectId: projectId })
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true
            }
          },
          tasks: {
            select: {
              id: true,
              status: true,
              dueDate: true
            }
          },
          assignees: {
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
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      }),
      db.milestone.count({
        where: {
          workspaceId: workspace.id,
          ...(projectId && { projectId: projectId })
        }
      })
    ])

    return NextResponse.json({ 
      milestones,
      total,
      count: milestones.length 
    })
  } catch (error) {
    console.error("Error fetching milestones:", error)
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    )
  }
}

// POST /api/workspaces/[workspaceId]/milestones - Create a new milestone
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = await params
    const body = await request.json()

    const { name, description, startDate, endDate, priority, assigneeIds, projectId } = body

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

    const milestone = await db.milestone.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        priority: priority || "medium",
        status: "upcoming",
        workspaceId: workspace.id,
        projectId: projectId || null,
        creatorId: user.id!,
        assignees: {
          create: assigneeIds?.map((userId: string) => ({
            userId,
            role: "ASSIGNEE"
          })) || []
        }
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            dueDate: true
          }
        },
        assignees: {
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
        }
      }
    })

    return NextResponse.json({ milestone }, { status: 201 })
  } catch (error) {
    console.error("Error creating milestone:", error)
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    )
  }
}
