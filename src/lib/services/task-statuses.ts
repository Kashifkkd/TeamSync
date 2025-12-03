import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export interface CreateTaskStatusInput {
  name: string
  color?: string
  bgColor?: string
  textColor?: string
  badgeColor?: string
  order?: number
  isDefault?: boolean
  workspaceId: string
  projectId?: string
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
  projectId?: string
  createdAt: Date
  updatedAt: Date
}

export class TaskStatusService {
  static async createTaskStatus(input: CreateTaskStatusInput): Promise<TaskStatus> {
    // Check if status with same name already exists in project (or workspace if no project)
    const existingStatus = await db.taskStatus.findFirst({
      where: {
        workspaceId: input.workspaceId,
        ...(input.projectId ? { projectId: input.projectId } : { projectId: null }),
        name: input.name
      }
    })

    if (existingStatus) {
      const scope = input.projectId ? "project" : "workspace"
      throw new Error(`Task status with this name already exists in ${scope}`)
    }

    // Get the next order number for this project
    const lastStatus = await db.taskStatus.findFirst({
      where: { 
        workspaceId: input.workspaceId,
        ...(input.projectId ? { projectId: input.projectId } : { projectId: null })
      },
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
        workspaceId: input.workspaceId,
        ...(input.projectId ? { projectId: input.projectId } : { projectId: null })
      }
    })

    return taskStatus
  }

  static async getTaskStatuses(workspaceId: string, projectId?: string, options?: { skip?: number; take?: number }): Promise<TaskStatus[]> {
    const taskStatuses = await db.taskStatus.findMany({
      where: { 
        workspaceId,
        ...(projectId ? { projectId } : { projectId: null })
      },
      orderBy: { order: 'asc' },
      ...(options?.skip !== undefined && { skip: options.skip }),
      ...(options?.take !== undefined && { take: options.take })
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

  static async createDefaultStatuses(workspaceId: string, projectId?: string, tx?: Prisma.TransactionClient): Promise<void> {
    console.log(`Creating default task statuses for workspace ${workspaceId}, project ${projectId}`)
    
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
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        badgeColor: "bg-blue-200",
        order: 1,
        isDefault: true
      },
      {
        name: "DONE",
        color: "bg-green-500",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        badgeColor: "bg-green-200",
        order: 2,
        isDefault: true
      }
    ]

    const dbClient = tx || db

    // Check if default statuses already exist for this project
    const existingStatuses = await dbClient.taskStatus.findMany({
      where: { 
        workspaceId,
        ...(projectId ? { projectId } : { projectId: null }),
        isDefault: true
      }
    })

    console.log(`Found ${existingStatuses.length} existing default statuses`)

    if (existingStatuses.length === 0) {
      console.log(`Creating ${defaultStatuses.length} default statuses`)
      const result = await dbClient.taskStatus.createMany({
        data: defaultStatuses.map(status => ({
          ...status,
          workspaceId,
          ...(projectId ? { projectId } : { projectId: null })
        }))
      })
      console.log(`Created ${result.count} default statuses`)
    } else {
      console.log('Default statuses already exist, skipping creation')
    }
  }
}
