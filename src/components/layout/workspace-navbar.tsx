"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { ModernNavbar } from "./modern-navbar"
import { LoadingBar } from "@/components/ui/loading-bar"
import { Loader2 } from "lucide-react"

interface Workspace {
  id: string
  name: string
  slug: string
  image?: string
}

interface Project {
  id: string
  name: string
  key: string
  color: string
  status?: string
}

interface WorkspaceNavbarProps {
  workspaces: Workspace[]
  projects: Project[]
  currentWorkspace: Workspace
  currentProject?: Project
  userRole?: string
}

export function WorkspaceNavbar({
  workspaces,
  projects,
  currentWorkspace,
  currentProject,
  userRole
}: WorkspaceNavbarProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null)

  const handleWorkspaceChange = async (workspaceId: string) => {
    const workspace = workspaces.find(ws => ws.id === workspaceId)
    if (workspace) {
      // Start navigation immediately for instant feel
      router.push(`/workspace/${workspace.slug}`)
      setLoadingMessage(`Loading ${workspace.name}...`)
      
      // Prefetch data in background
      startTransition(async () => {
        try {
          await Promise.all([
            queryClient.prefetchQuery({
              queryKey: ["workspace", workspace.slug],
              queryFn: async () => {
                const response = await fetch(`/api/workspaces/${workspace.slug}`)
                return response.json()
              }
            }),
            queryClient.prefetchQuery({
              queryKey: ["projects", workspace.slug],
              queryFn: async () => {
                const response = await fetch(`/api/workspaces/${workspace.slug}/projects`)
                return response.json()
              }
            }),
            queryClient.prefetchQuery({
              queryKey: ["workspace-members", workspace.slug],
              queryFn: async () => {
                const response = await fetch(`/api/workspaces/${workspace.slug}/members`)
                return response.json()
              }
            })
          ])
        } finally {
          setTimeout(() => setLoadingMessage(null), 300) // Small delay for smooth transition
        }
      })
    }
  }

  const handleProjectChange = async (projectId: string) => {
    // Handle "All Projects" option for admin/owner users
    if (projectId === 'all-projects') {
      router.push(`/workspace/${currentWorkspace.slug}`)
      setLoadingMessage("Loading workspace...")
      startTransition(() => {
        setTimeout(() => setLoadingMessage(null), 300)
      })
      return
    }
    
    const project = projects.find(p => p.id === projectId)
    if (project) {
      // Start navigation immediately for instant feel
      router.push(`/workspace/${currentWorkspace.slug}/projects/${project.id}`)
      setLoadingMessage(`Loading ${project.name}...`)
      
      // Prefetch data in background
      startTransition(async () => {
        try {
          await Promise.all([
            queryClient.prefetchQuery({
              queryKey: ["project", currentWorkspace.slug, project.id],
              queryFn: async () => {
                const response = await fetch(`/api/workspaces/${currentWorkspace.slug}/projects/${project.id}`)
                return response.json()
              }
            }),
            queryClient.prefetchQuery({
              queryKey: ["tasks", currentWorkspace.slug],
              queryFn: async () => {
                const response = await fetch(`/api/workspaces/${currentWorkspace.slug}/tasks?projectId=${project.id}`)
                return response.json()
              }
            })
          ])
        } finally {
          setTimeout(() => setLoadingMessage(null), 300)
        }
      })
    }
  }

  return (
    <>
      {/* Top Loading Bar */}
      <LoadingBar isLoading={isPending || !!loadingMessage} />
      
      <ModernNavbar
        title="TeamSync"
        workspaces={workspaces}
        projects={projects}
        currentWorkspace={currentWorkspace}
        currentProject={currentProject}
        userRole={userRole}
        onWorkspaceChange={handleWorkspaceChange}
        onProjectChange={handleProjectChange}
      />
      
      {/* Subtle Loading Indicator - Top right corner */}
      {loadingMessage && (
        <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="bg-card border rounded-lg px-4 py-2 shadow-lg flex items-center space-x-3">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <p className="text-sm font-medium">{loadingMessage}</p>
          </div>
        </div>
      )}
    </>
  )
}
