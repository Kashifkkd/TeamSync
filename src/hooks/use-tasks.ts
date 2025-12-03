"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

export interface Task {
  id: string
  title: string
  description?: string | null
  status: string
  priority: string
  type: string
  number: number
  storyPoints?: number | null
  originalEstimate?: number | null
  remainingEstimate?: number | null
  timeSpent: number
  dueDate?: string | null
  startDate?: string | null
  position: number
  createdAt: string
  updatedAt: string
  projectId: string
  milestoneId?: string | null
  assigneeId?: string | null
  creatorId: string
  statusId?: string | null
  parentId?: string | null
  assignee?: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
  creator?: {
    id: string
    name?: string | null
    image?: string | null
  }
  milestone?: {
    id: string
    name: string
  } | null
  project: {
    id: string
    name: string
    key: string
    color: string
  }
  labels: Array<{
    label: {
      id: string
      name: string
      color: string
    }
  }>
  taskStatus?: {
    id: string
    name: string
    color: string
  } | null
  comments?: Array<{
    id: string
    content: string
    createdAt: string
    author: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }>
  children?: Array<{
    id: string
    title: string
    status: string
    number: number
    assignee?: {
      id: string
      name?: string | null
      image?: string | null
    } | null
  }>
  parent?: {
    id: string
    title: string
    number: number
  } | null
  timeEntries?: Array<{
    id: string
    description?: string | null
    duration: number
    date: string
    user: {
      id: string
      name?: string | null
      image?: string | null
    }
  }>
  _count: {
    comments: number
    timeEntries: number
    children: number
  }
}

interface TasksResponse {
  tasks: Task[]
  total: number
  page?: number
  limit?: number
  totalPages?: number
}

interface TaskResponse {
  task: Task
}

interface UseTasksOptions {
  workspaceId: string
  projectId?: string
  milestoneId?: string
  status?: string
  assigneeId?: string
  priority?: string
  search?: string
  page?: number
  limit?: number
  enabled?: boolean
}

export function useTasks(options: UseTasksOptions) {
  const { workspaceId, projectId, milestoneId, status, assigneeId, priority, search, page, limit, enabled = true } = options
  
  const params = new URLSearchParams()
  if (projectId) params.append("projectId", projectId)
  if (milestoneId) params.append("milestoneId", milestoneId)
  if (status) params.append("status", status)
  if (assigneeId) params.append("assigneeId", assigneeId)
  if (priority) params.append("priority", priority)
  if (search) params.append("search", search)
  if (page) params.append("page", page.toString())
  if (limit) params.append("limit", limit.toString())

  return useQuery<TasksResponse>({
    queryKey: ["tasks", workspaceId, projectId, milestoneId, status, assigneeId, priority, search, page, limit],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      return response.json()
    },
    enabled: !!workspaceId && enabled,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}

export function useTask(workspaceId: string, taskId?: string) {
  return useQuery<TaskResponse>({
    queryKey: ["task", workspaceId, taskId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch task")
      }
      return response.json()
    },
    enabled: !!workspaceId && !!taskId,
  })
}

export function useCreateTask(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Task> & { projectId: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create task")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useUpdateTask(workspaceId: string, taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update task")
      }

      return response.json()
    },
    onMutate: async (newTask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["task", workspaceId, taskId] })
      await queryClient.cancelQueries({ queryKey: ["tasks", workspaceId] })

      // Snapshot the previous value
      const previousTask = queryClient.getQueryData(["task", workspaceId, taskId])
      const previousTasks = queryClient.getQueryData(["tasks", workspaceId])

      // Optimistically update to the new value
      queryClient.setQueryData(["task", workspaceId, taskId], (old: any) => {
        if (!old) return old
        return {
          ...old,
          task: { ...old.task, ...newTask }
        }
      })

      return { previousTask, previousTasks }
    },
    onError: (err, newTask, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(["task", workspaceId, taskId], context.previousTask)
      }
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", workspaceId], context.previousTasks)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, taskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
    },
  })
}

export function useDeleteTask(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete task")
      }

      return response.json()
    },
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, taskId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useBulkUpdateTasks(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskIds, updates }: { taskIds: string[]; updates: Partial<Task> }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskIds, updates }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update tasks")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

export function useBulkDeleteTasks(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks?ids=${taskIds.join(",")}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete tasks")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

// Comments hooks
export function useTaskComments(workspaceId: string, taskId: string) {
  return useQuery({
    queryKey: ["task-comments", workspaceId, taskId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}/comments`)
      if (!response.ok) {
        throw new Error("Failed to fetch comments")
      }
      return response.json()
    },
    enabled: !!workspaceId && !!taskId,
  })
}

export function useCreateComment(workspaceId: string, taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { content: string; type?: string }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create comment")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-comments", workspaceId, taskId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, taskId] })
    },
  })
}

// Time tracking hooks
export function useTaskTimeEntries(workspaceId: string, taskId: string) {
  return useQuery({
    queryKey: ["task-time-entries", workspaceId, taskId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}/time-entries`)
      if (!response.ok) {
        throw new Error("Failed to fetch time entries")
      }
      return response.json()
    },
    enabled: !!workspaceId && !!taskId,
  })
}

export function useCreateTimeEntry(workspaceId: string, taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      description?: string
      duration: number
      startTime?: string
      endTime?: string
      date?: string
    }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${taskId}/time-entries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to log time")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-time-entries", workspaceId, taskId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, taskId] })
    },
  })
}

export function useDeleteTimeEntry(workspaceId: string, taskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (entryId: string) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/time-entries?entryId=${entryId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete time entry")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-time-entries", workspaceId, taskId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, taskId] })
    },
  })
}

// Task duplication
export function useDuplicateTask(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskId: string) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/tasks/${taskId}/duplicate`,
        {
          method: "POST",
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to duplicate task")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["projects"] })
    },
  })
}

