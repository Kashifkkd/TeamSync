import { db } from "@/lib/db"

export interface CreateTaskStatusInput {
  name: string
  color?: string
  bgColor?: string
  textColor?: string
  badgeColor?: string
  order?: number
  isDefault?: boolean
  workspaceId: string
}

export interface UpdateTaskStatusInput {
  name?: string
  color?: string
  bgColor?: string
  textColor?: string
  badgeColor?: string
  order?: number
  isDefault?: boolean
}

export interface TaskStatus {
  id: string
  name: string
  color: string
  bgColor: string
  textColor: string
  badgeColor: string
  order: number
  isDefault: boolean
  workspaceId: string
  createdAt: Date
  updatedAt: Date
}

export class TaskStatusService {
  static async createTaskStatus(input: CreateTaskStatusInput): Promise<TaskStatus> {
    // Check if status with same name already exists in workspace
    const existingStatus = await db.taskStatus.findFirst({
      where: {
        workspaceId: input.workspaceId,
        name: input.name
      }
    })

    if (existingStatus) {
      throw new Error("Task status with this name already exists in workspace")
    }

    // Get the next order number
    const lastStatus = await db.taskStatus.findFirst({
      where: { workspaceId: input.workspaceId },
      orderBy: { order: 'desc' }
    })

    const order = lastStatus ? lastStatus.order + 1 : 0

    const taskStatus = await db.taskStatus.create({
      data: {
        name: input.name,
        color: input.color || "bg-gray-500",
        bgColor: input.bgColor || "bg-gray-100",
        textColor: input.textColor || "text-gray-800",
        badgeColor: input.badgeColor || "bg-gray-200",
        order: input.order ?? order,
        isDefault: input.isDefault || false,
        workspaceId: input.workspaceId
      }
    })

    return taskStatus
  }

  static async getTaskStatuses(workspaceId: string): Promise<TaskStatus[]> {
    const taskStatuses = await db.taskStatus.findMany({
      where: { workspaceId },
      orderBy: { order: 'asc' }
    })

    return taskStatuses
  }

  static async getTaskStatusById(id: string): Promise<TaskStatus | null> {
    const taskStatus = await db.taskStatus.findUnique({
      where: { id }
    })

    return taskStatus
  }

  static async updateTaskStatus(id: string, input: UpdateTaskStatusInput): Promise<TaskStatus> {
    const taskStatus = await db.taskStatus.update({
      where: { id },
      data: input
    })

    return taskStatus
  }

  static async deleteTaskStatus(id: string): Promise<void> {
    // Check if status is being used by any tasks
    const tasksUsingStatus = await db.task.count({
      where: { statusId: id }
    })

    if (tasksUsingStatus > 0) {
      throw new Error("Cannot delete task status that is being used by tasks")
    }

    await db.taskStatus.delete({
      where: { id }
    })
  }

  static async reorderTaskStatuses(workspaceId: string, statusIds: string[]): Promise<void> {
    const updates = statusIds.map((id, index) => 
      db.taskStatus.update({
        where: { id },
        data: { order: index }
      })
    )

    await db.$transaction(updates)
  }

  static async createDefaultStatuses(workspaceId: string): Promise<void> {
    const defaultStatuses = [
      {
        name: "TO DO",
        color: "bg-gray-500",
        bgColor: "bg-gray-100",
        textColor: "text-gray-800",
        badgeColor: "bg-gray-200",
        order: 0,
        isDefault: true
      },
      {
        name: "IN PROGRESS",
        color: "bg-blue-500",
        bgColor: "bg-blue-500",
        textColor: "text-white",
        badgeColor: "bg-blue-400",
        order: 1,
        isDefault: true
      },
      {
        name: "COMPLETE",
        color: "bg-green-500",
        bgColor: "bg-green-500",
        textColor: "text-white",
        badgeColor: "bg-green-400",
        order: 2,
        isDefault: true
      }
    ]

    await db.taskStatus.createMany({
      data: defaultStatuses.map(status => ({
        ...status,
        workspaceId
      }))
    })
  }
}
