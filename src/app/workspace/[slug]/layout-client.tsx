"use client"

import { usePathname, redirect } from "next/navigation"
import { HoverSidebar } from "@/components/layout/hover-sidebar"
import { WorkspaceNavbar } from "@/components/layout/workspace-navbar"
import { useWorkspace, useWorkspaces } from "@/hooks/use-workspace"
import { useProjects } from "@/hooks/use-projects"
import { useSession } from "next-auth/react"
import { Skeleton } from "@/components/ui/skeleton"

interface WorkspaceLayoutClientProps {
  children: React.ReactNode
  slug: string
}

export function WorkspaceLayoutClient({
  children,
  slug,
}: WorkspaceLayoutClientProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  
  const { data: workspaceData, isLoading: isLoadingWorkspace } = useWorkspace(slug)
  const workspace = workspaceData?.workspace

  const { data: workspacesData } = useWorkspaces()
  const userWorkspaces = workspacesData?.workspaces || []

  const { data: projectsData } = useProjects(slug)
  const projects = projectsData?.projects || []

  // Extract project ID from URL if present
  const projectIdMatch = pathname.match(/\/projects\/([^\/]+)/)
  const currentProjectId = projectIdMatch ? projectIdMatch[1] : null
  const currentProject = currentProjectId
    ? projects.find((p) => p.id === currentProjectId)
    : undefined

  if (isLoadingWorkspace) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {/* Navbar skeleton */}
        <div className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
        </div>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar skeleton */}
          <div className="w-64 border-r bg-card p-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
          
          {/* Main content skeleton */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!workspace) {
    redirect("/dashboard")
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navbar - Full Width */}
      <WorkspaceNavbar
        workspaces={userWorkspaces.map((ws) => ({
          id: ws.id,
          name: ws.name,
          slug: ws.slug,
          image: ws.image || undefined,
        }))}
        projects={projects.map((p) => ({
          id: p.id,
          name: p.name,
          key: p.key,
          color: p.color,
          status: p.status,
        }))}
        currentWorkspace={{
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          image: workspace.image || undefined,
        }}
        currentProject={
          currentProject
            ? {
                id: currentProject.id,
                name: currentProject.name,
                key: currentProject.key,
                color: currentProject.color,
                status: currentProject.status,
              }
            : undefined
        }
        userRole={workspace.userRole || undefined}
      />

      {/* Content Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <HoverSidebar
          workspace={{
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
            image: workspace.image || undefined,
          }}
          user={{
            id: session?.user?.id || "",
            name: session?.user?.name || undefined,
            email: session?.user?.email || undefined,
            image: session?.user?.image || undefined,
          }}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

