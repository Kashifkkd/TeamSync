import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = params

    const templates = await db.taskTemplate.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Error fetching templates:", error)
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = params
    const body = await request.json()

    const { name, description, title, content, priority, type, labels } = body

    if (!name || !title) {
      return NextResponse.json(
        { error: "Name and title are required" },
        { status: 400 }
      )
    }

    const template = await db.taskTemplate.create({
      data: {
        name,
        description,
        title,
        content,
        priority: priority || "medium",
        type: type || "task",
        labels: labels || null,
        workspaceId,
        creatorId: user.id!
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error("Error creating template:", error)
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get("templateId")

    if (!templateId) {
      return NextResponse.json(
        { error: "Template ID is required" },
        { status: 400 }
      )
    }

    await db.taskTemplate.delete({
      where: { id: templateId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting template:", error)
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    )
  }
}

