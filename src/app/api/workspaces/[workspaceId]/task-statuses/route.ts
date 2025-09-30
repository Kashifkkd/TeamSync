import { NextRequest, NextResponse } from "next/server"
import { TaskStatusService, CreateTaskStatusInput } from "@/lib/services/task-statuses"
import { requireAuth } from "@/lib/auth-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: { workspaceId: string } }
) {
  try {
    const user = await requireAuth()
    const { workspaceId } = params

    const taskStatuses = await TaskStatusService.getTaskStatuses(workspaceId)

    return NextResponse.json({ taskStatuses })
  } catch (error) {
    console.error("Error fetching task statuses:", error)
    return NextResponse.json(
      { error: "Failed to fetch task statuses" },
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

    const input: CreateTaskStatusInput = {
      ...body,
      workspaceId
    }

    const taskStatus = await TaskStatusService.createTaskStatus(input)

    return NextResponse.json({ taskStatus }, { status: 201 })
  } catch (error) {
    console.error("Error creating task status:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create task status" },
      { status: 400 }
    )
  }
}
