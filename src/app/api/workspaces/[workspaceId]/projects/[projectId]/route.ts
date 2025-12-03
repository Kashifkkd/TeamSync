import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; projectId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId: workspaceSlugOrId, projectId } = params

    // Try to find workspace by ID first, then by slug
    let workspace = await db.workspace.findUnique({
      where: { id: workspaceSlugOrId }
    })
    
    if (!workspace) {
      workspace = await db.workspace.findUnique({
        where: { slug: workspaceSlugOrId }
      })
    }
    
    // If workspace not found, return null project
    if (!workspace) {
      return NextResponse.json({ project: null })
    }

    const project = await db.project.findFirst({
      where: {
        id: projectId,
        workspaceId: workspace.id
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
        tasks: {
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
          },
          orderBy: { createdAt: "desc" },
          take: 20, // Limit to recent tasks
        },
        milestones: {
          orderBy: { endDate: "asc" },
          take: 10, // Limit milestones
        },
        _count: {
          select: {
            tasks: true,
            milestones: true,
            members: true,
          },
        },
      },
    })

    // Return null if project not found instead of error
    return NextResponse.json({ project: project || null })
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    )
  }
}

