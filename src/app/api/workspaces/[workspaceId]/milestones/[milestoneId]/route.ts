import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

// GET /api/workspaces/[workspaceId]/milestones/[milestoneId] - Get a specific milestone
export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; milestoneId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, milestoneId } = params

    console.log('Fetching milestone detail:', { workspaceId, milestoneId, userId: user.id })

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

    const milestone = await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspace.id
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
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

    console.log('Milestone query result:', { milestoneId, workspaceId: workspace.id, milestone: milestone?.id })

    if (!milestone) {
      console.log('Milestone not found:', { milestoneId, workspaceId: workspace.id })
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    return NextResponse.json({ milestone })
  } catch (error) {
    console.error("Error fetching milestone:", error)
    return NextResponse.json(
      { error: "Failed to fetch milestone" },
      { status: 500 }
    )
  }
}

// PUT /api/workspaces/[workspaceId]/milestones/[milestoneId] - Update a milestone
export async function PUT(
  request: NextRequest,
  { params }: { params: { workspaceId: string; milestoneId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, milestoneId } = params
    const body = await request.json()

    const { name, description, startDate, endDate, priority, status, assigneeIds } = body

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

    // Check if milestone exists
    const existingMilestone = await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspaceId
      }
    })

    if (!existingMilestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    const milestone = await db.milestone.update({
      where: {
        id: milestoneId
      },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        priority,
        status
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
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

    // Update assignees if provided
    if (assigneeIds) {
      // Remove existing assignees
      await db.milestoneAssignee.deleteMany({
        where: {
          milestoneId: milestoneId
        }
      })

      // Add new assignees
      await db.milestoneAssignee.createMany({
        data: assigneeIds.map((userId: string) => ({
          milestoneId: milestoneId,
          userId: userId,
          role: "ASSIGNEE"
        }))
      })
    }

    return NextResponse.json({ milestone })
  } catch (error) {
    console.error("Error updating milestone:", error)
    return NextResponse.json(
      { error: "Failed to update milestone" },
      { status: 500 }
    )
  }
}

// DELETE /api/workspaces/[workspaceId]/milestones/[milestoneId] - Delete a milestone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; milestoneId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId, milestoneId } = params

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

    // Check if milestone exists
    const existingMilestone = await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspaceId
      }
    })

    if (!existingMilestone) {
      return NextResponse.json({ error: "Milestone not found" }, { status: 404 })
    }

    // Delete milestone (cascade will handle related records)
    await db.milestone.delete({
      where: {
        id: milestoneId
      }
    })

    return NextResponse.json({ message: "Milestone deleted successfully" })
  } catch (error) {
    console.error("Error deleting milestone:", error)
    return NextResponse.json(
      { error: "Failed to delete milestone" },
      { status: 500 }
    )
  }
}
