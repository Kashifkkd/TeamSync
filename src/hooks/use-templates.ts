"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface TaskTemplate {
  id: string
  name: string
  description?: string | null
  title: string
  content?: string | null
  priority: string
  type: string
  labels?: any
  workspaceId: string
  creatorId: string
  createdAt: string
  updatedAt: string
}

interface TemplatesResponse {
  templates: TaskTemplate[]
}

export function useTemplates(workspaceId: string) {
  return useQuery<TemplatesResponse>({
    queryKey: ["templates", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/templates`)
      if (!response.ok) {
        throw new Error("Failed to fetch templates")
      }
      return response.json()
    },
    enabled: !!workspaceId,
  })
}

export function useCreateTemplate(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<TaskTemplate>) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create template")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] })
    },
  })
}

export function useDeleteTemplate(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (templateId: string) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/templates?templateId=${templateId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete template")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] })
    },
  })
}

