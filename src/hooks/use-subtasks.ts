"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Task } from "./use-tasks"

interface SubtasksResponse {
  subtasks: Task[]
  total: number
}


interface UseSubtasksOptions {
  workspaceId: string
  parentTaskId: string
  enabled?: boolean
}

// Hook to fetch subtasks for a parent task
export function useSubtasks(options: UseSubtasksOptions) {
  const { workspaceId, parentTaskId, enabled = true } = options

  return useQuery<SubtasksResponse>({
    queryKey: ["subtasks", workspaceId, parentTaskId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks?parentId=${parentTaskId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch subtasks")
      }
      return response.json()
    },
    enabled: !!workspaceId && !!parentTaskId && enabled,
    staleTime: 30000, // Consider data fresh for 30 seconds
  })
}

// Hook to create a subtask
export function useCreateSubtask(workspaceId: string, parentTaskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      title: string
      description?: string
      priority?: string
      assigneeId?: string
      dueDate?: string
      startDate?: string
    }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          parentId: parentTaskId,
          type: "subtask"
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create subtask")
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, parentTaskId] })
    },
  })
}

// Hook to update a subtask
export function useUpdateSubtask(workspaceId: string, subtaskId: string, parentTaskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Task>) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${subtaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update subtask")
      }

      return response.json()
    },
    onMutate: async (newSubtask) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })
      await queryClient.cancelQueries({ queryKey: ["task", workspaceId, subtaskId] })

      // Snapshot the previous value
      const previousSubtasks = queryClient.getQueryData(["subtasks", workspaceId, parentTaskId])
      const previousSubtask = queryClient.getQueryData(["task", workspaceId, subtaskId])

      // Optimistically update to the new value
      queryClient.setQueryData(["subtasks", workspaceId, parentTaskId], (old: SubtasksResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          subtasks: old.subtasks.map((subtask: Task) =>
            subtask.id === subtaskId ? { ...subtask, ...newSubtask } : subtask
          )
        }
      })

      queryClient.setQueryData(["task", workspaceId, subtaskId], (old: { task: Task } | undefined) => {
        if (!old) return old
        return {
          ...old,
          task: { ...old.task, ...newSubtask }
        }
      })

      return { previousSubtasks, previousSubtask }
    },
    onError: (err, newSubtask, context) => {
      // Rollback on error
      if (context?.previousSubtasks) {
        queryClient.setQueryData(["subtasks", workspaceId, parentTaskId], context.previousSubtasks)
      }
      if (context?.previousSubtask) {
        queryClient.setQueryData(["task", workspaceId, subtaskId], context.previousSubtask)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, subtaskId] })
    },
  })
}

// Hook to delete a subtask
export function useDeleteSubtask(workspaceId: string, parentTaskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subtaskId: string) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${subtaskId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete subtask")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] })
      queryClient.invalidateQueries({ queryKey: ["task", workspaceId, parentTaskId] })
    },
  })
}

// Hook to reorder subtasks
export function useReorderSubtasks(workspaceId: string, parentTaskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subtaskIds: string[]) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskIds: subtaskIds }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to reorder subtasks")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })
    },
  })
}

// Hook to toggle subtask completion
export function useToggleSubtaskCompletion(workspaceId: string, parentTaskId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ subtaskId, completed }: { subtaskId: string; completed: boolean }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tasks/${subtaskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: completed ? "completed" : "todo"
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to toggle subtask completion")
      }

      return response.json()
    },
    onMutate: async ({ subtaskId, completed }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })

      // Snapshot the previous value
      const previousSubtasks = queryClient.getQueryData(["subtasks", workspaceId, parentTaskId])

      // Optimistically update to the new value
      queryClient.setQueryData(["subtasks", workspaceId, parentTaskId], (old: SubtasksResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          subtasks: old.subtasks.map((subtask: Task) =>
            subtask.id === subtaskId ? { ...subtask, status: completed ? "completed" : "todo" } : subtask
          )
        }
      })

      return { previousSubtasks }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSubtasks) {
        queryClient.setQueryData(["subtasks", workspaceId, parentTaskId], context.previousSubtasks)
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["subtasks", workspaceId, parentTaskId] })
    },
  })
}
