import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params

    const comments = await db.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { workspaceId: string; taskId: string } }
) {
  try {
    const user = await requireAuth()
    const { taskId } = params
    const body = await request.json()
    const { content, type = "comment" } = body

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      )
    }

    const comment = await db.comment.create({
      data: {
        content: content.trim(),
        type,
        taskId,
        authorId: user.id!
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Log activity
    await db.activityLog.create({
      data: {
        action: "CREATE_COMMENT",
        entity: "TASK",
        entityId: taskId,
        userId: user.id!,
        changes: {
          content: content.substring(0, 100)
        }
      }
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

