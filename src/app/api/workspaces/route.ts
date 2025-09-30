import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createWorkspaceSchema } from "@/lib/validations"
import { ROLE, MEMBER_STATUS } from "@/lib/constants"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const workspaces = await db.workspace.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          where: {
            userId: session.user.id,
          },
        },
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const workspacesWithRole = workspaces.map((workspace) => ({
      ...workspace,
      role: workspace.members[0]?.role || ROLE.MEMBER,
      memberCount: workspace._count.members,
      projectCount: workspace._count.projects,
    }))

    return NextResponse.json({ 
      workspaces: workspacesWithRole,
      total: workspacesWithRole.length,
      count: workspacesWithRole.length 
    })
  } catch (error) {
    console.error("Get workspaces error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedFields = createWorkspaceSchema.safeParse(body)

    if (!validatedFields.success) {
      return NextResponse.json(
        { error: "Invalid fields", details: validatedFields.error.format() },
        { status: 400 }
      )
    }

    const { name, slug, description } = validatedFields.data

    // Check if slug already exists
    const existingWorkspace = await db.workspace.findUnique({
      where: { slug },
    })

    if (existingWorkspace) {
      return NextResponse.json(
        { error: "Workspace URL already exists" },
        { status: 400 }
      )
    }

    // Create workspace with creator as owner
    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        description,
        creatorId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: ROLE.OWNER,
            status: MEMBER_STATUS.ACTIVE,
          }
        }
      },
    })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    console.error("Create workspace error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
