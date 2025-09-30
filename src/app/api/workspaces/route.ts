import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { createWorkspaceSchema } from "@/lib/validations"

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
      role: workspace.members[0]?.role || "member",
      memberCount: workspace._count.members,
      projectCount: workspace._count.projects,
    }))

    return NextResponse.json(workspacesWithRole)
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

    // Create workspace
    const workspace = await db.workspace.create({
      data: {
        name,
        slug,
        description,
        creatorId: session.user.id,
      },
    })

    // Add creator as owner
    await db.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId: session.user.id,
        role: "owner",
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
