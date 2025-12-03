"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Tag {
  id: string;
  name: string;
  color?: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTagData {
  name: string;
  color?: string;
  workspaceId: string;
}

interface UseTagsProps {
  workspaceId: string;
}

export function useTags({ workspaceId }: UseTagsProps) {
  return useQuery({
    queryKey: ["tags", workspaceId],
    queryFn: async (): Promise<Tag[]> => {
      const response = await fetch(`/api/workspaces/${workspaceId}/tags`);
      if (!response.ok) {
        throw new Error("Failed to fetch tags");
      }
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!workspaceId,
  });
}

export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagData): Promise<Tag> => {
      const response = await fetch(`/api/workspaces/${data.workspaceId}/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          color: data.color,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create tag");
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: (newTag, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["tags", variables.workspaceId],
      });
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      workspaceId,
      data,
    }: {
      tagId: string;
      workspaceId: string;
      data: Partial<CreateTagData>;
    }): Promise<Tag> => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/tags/${tagId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tag");
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: (updatedTag) => {
      queryClient.invalidateQueries({
        queryKey: ["tags", updatedTag.workspaceId],
      });
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tagId,
      workspaceId,
    }: {
      tagId: string;
      workspaceId: string;
    }): Promise<void> => {
      const response = await fetch(
        `/api/workspaces/${workspaceId}/tags/${tagId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tag");
      }
    },
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: ["tags", workspaceId],
      });
    },
  });
}
