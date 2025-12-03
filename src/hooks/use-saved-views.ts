"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface SavedView {
  id: string
  name: string
  description?: string | null
  filters: any
  sortBy?: string | null
  groupBy?: string | null
  viewType: string
  workspaceId: string
  creatorId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface SavedViewsResponse {
  savedViews: SavedView[]
}

export function useSavedViews(workspaceId: string) {
  return useQuery<SavedViewsResponse>({
    queryKey: ["saved-views", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspaces/${workspaceId}/saved-views`)
      if (!response.ok) {
        throw new Error("Failed to fetch saved views")
      }
      return response.json()
    },
    enabled: !!workspaceId,
  })
}

export function useCreateSavedView(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<SavedView>) => {
      const response = await fetch(`/api/workspaces/${workspaceId}/saved-views`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create saved view")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-views", workspaceId] })
    },
  })
}

export function useDeleteSavedView(workspaceId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (viewId: string) => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/saved-views?viewId=${viewId}`,
        {
          method: "DELETE",
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete saved view")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-views", workspaceId] })
    },
  })
}

