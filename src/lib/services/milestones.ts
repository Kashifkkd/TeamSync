import { db } from "@/lib/db"

export interface CreateMilestoneData {
  name: string
  description?: string
  startDate?: string
  endDate?: string
  priority?: "low" | "medium" | "high"
  assigneeIds?: string[]
}

export interface UpdateMilestoneData {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  priority?: "low" | "medium" | "high"
  status?: "upcoming" | "active" | "completed" | "paused"
  assigneeIds?: string[]
}

export interface CreateTaskData {
  name: string
  description?: string
  dueDate?: string
  priority?: "low" | "medium" | "high"
  status?: "todo" | "in_progress" | "completed" | "blocked"
  assigneeId?: string
  tags?: string[]
}

export class MilestonesService {
  // Get all milestones for a workspace
  static async getMilestones(workspaceId: string) {
    return await db.milestone.findMany({
      where: {
        workspaceId: workspaceId
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            dueDate: true
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }

  // Get a specific milestone
  static async getMilestone(workspaceId: string, milestoneId: string) {
    return await db.milestone.findFirst({
      where: {
        id: milestoneId,
        workspaceId: workspaceId
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })
  }

  // Create a new milestone
  static async createMilestone(workspaceId: string, creatorId: string, data: CreateMilestoneData) {
    const milestone = await db.milestone.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        priority: data.priority || "medium",
        status: "upcoming",
        workspaceId: workspaceId,
        creatorId: creatorId,
        assignees: {
          create: data.assigneeIds?.map((userId: string) => ({
            userId,
            role: "ASSIGNEE"
          })) || []
        }
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            dueDate: true
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    return milestone
  }

  // Update a milestone
  static async updateMilestone(workspaceId: string, milestoneId: string, data: UpdateMilestoneData) {
    // Update milestone data
    const milestone = await db.milestone.update({
      where: {
        id: milestoneId
      },
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        priority: data.priority,
        status: data.status
      },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    })

    // Update assignees if provided
    if (data.assigneeIds) {
      // Remove existing assignees
      await db.milestoneAssignee.deleteMany({
        where: {
          milestoneId: milestoneId
        }
      })

      // Add new assignees
      await db.milestoneAssignee.createMany({
        data: data.assigneeIds.map((userId: string) => ({
          milestoneId: milestoneId,
          userId: userId,
          role: "ASSIGNEE"
        }))
      })
    }

    return milestone
  }

  // Delete a milestone
  static async deleteMilestone(workspaceId: string, milestoneId: string) {
    return await db.milestone.delete({
      where: {
        id: milestoneId
      }
    })
  }

  // Get tasks for a milestone
  static async getMilestoneTasks(workspaceId: string, milestoneId: string) {
    return await db.task.findMany({
      where: {
        milestoneId: milestoneId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        comments: {
          select: {
            id: true
          }
        },
        attachments: {
          select: {
            id: true
          }
        },
        subtasks: {
          select: {
            id: true,
            completed: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })
  }

  // Create a task for a milestone
  static async createMilestoneTask(workspaceId: string, milestoneId: string, creatorId: string, data: CreateTaskData) {
    return await db.task.create({
      data: {
        name: data.name,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        priority: data.priority || "medium",
        status: data.status || "todo",
        milestoneId: milestoneId,
        assigneeId: data.assigneeId,
        creatorId: creatorId,
        tags: data.tags || []
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        comments: {
          select: {
            id: true
          }
        },
        attachments: {
          select: {
            id: true
          }
        },
        subtasks: {
          select: {
            id: true,
            completed: true
          }
        }
      }
    })
  }

  // Update milestone progress based on tasks
  static async updateMilestoneProgress(milestoneId: string) {
    const tasks = await db.task.findMany({
      where: {
        milestoneId: milestoneId
      },
      select: {
        status: true
      }
    })

    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === "completed").length
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return await db.milestone.update({
      where: {
        id: milestoneId
      },
      data: {
        progress: progress
      }
    })
  }
}
