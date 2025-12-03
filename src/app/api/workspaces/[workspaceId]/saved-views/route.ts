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

    const savedViews = await db.savedView.findMany({
      where: {
        workspaceId,
        OR: [
          { creatorId: user.id! },
          { isPublic: true }
        ]
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({ savedViews })
  } catch (error) {
    console.error("Error fetching saved views:", error)
    return NextResponse.json(
      { error: "Failed to fetch saved views" },
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

    const { name, description, filters, sortBy, groupBy, viewType, isPublic } = body

    if (!name || !filters) {
      return NextResponse.json(
        { error: "Name and filters are required" },
        { status: 400 }
      )
    }

    const savedView = await db.savedView.create({
      data: {
        name,
        description,
        filters,
        sortBy,
        groupBy,
        viewType: viewType || "kanban",
        isPublic: isPublic || false,
        workspaceId,
        creatorId: user.id!
      }
    })

    return NextResponse.json({ savedView }, { status: 201 })
  } catch (error) {
    console.error("Error creating saved view:", error)
    return NextResponse.json(
      { error: "Failed to create saved view" },
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
    const viewId = searchParams.get("viewId")

    if (!viewId) {
      return NextResponse.json(
        { error: "View ID is required" },
        { status: 400 }
      )
    }

    // Ensure user owns the view
    const view = await db.savedView.findFirst({
      where: {
        id: viewId,
        creatorId: user.id!
      }
    })

    if (!view) {
      return NextResponse.json(
        { error: "View not found or access denied" },
        { status: 404 }
      )
    }

    await db.savedView.delete({
      where: { id: viewId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting saved view:", error)
    return NextResponse.json(
      { error: "Failed to delete saved view" },
      { status: 500 }
    )
  }
}

