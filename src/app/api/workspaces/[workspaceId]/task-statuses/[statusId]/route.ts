import { NextRequest, NextResponse } from "next/server"
import { TaskStatusService, UpdateTaskStatusInput } from "@/lib/services/task-statuses"
import { requireAuth } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string; statusId: string } }
) {
  try {
    const user = await requireAuth()
    const { statusId } = params

    const taskStatus = await TaskStatusService.getTaskStatusById(statusId)

    if (!taskStatus) {
      return NextResponse.json(
        { error: "Task status not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ taskStatus })
  } catch (error) {
    console.error("Error fetching task status:", error)
    return NextResponse.json(
      { error: "Failed to fetch task status" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { workspaceId: string; statusId: string } }
) {
  try {
    const user = await requireAuth()
    const { statusId } = params
    const body = await request.json()

    const input: UpdateTaskStatusInput = body

    const taskStatus = await TaskStatusService.updateTaskStatus(statusId, input)

    return NextResponse.json({ taskStatus })
  } catch (error) {
    console.error("Error updating task status:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update task status" },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { workspaceId: string; statusId: string } }
) {
  try {
    const user = await requireAuth()
    const { statusId } = params

    await TaskStatusService.deleteTaskStatus(statusId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task status:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete task status" },
      { status: 400 }
    )
  }
}
