"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface Label {
  id: string
  name: string
  color: string
  description?: string | null
  workspaceId: string
  projectId?: string | null
  _count?: {
    tasks: number
  }
}

interface LabelsResponse {
  labels: Label[]
  total: number
  page?: number
  limit?: number
  totalPages?: number
}

interface LabelResponse {
  label: Label
}

export function useLabels(workspaceId: string, projectId?: string, options?: { page?: number; limit?: number }) {
  const params = new URLSearchParams()
  if (projectId) params.append("projectId", projectId)
  if (options?.page) params.append("page", options.page.toString())
  if (options?.limit) params.append("limit", options.limit.toString())

  return useQuery<LabelsResponse>({
    queryKey: ["labels", workspaceId, projectId, options?.page, options?.limit],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/labels?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch labels")
      }
      return response.json()
    },
    enabled: !!workspaceId,
  })
}

export function useCreateLabel(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      name: string
      color?: string
      description?: string
      projectId?: string
    }) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/labels`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create label")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labels", workspaceId] })
    },
  })
}

