"use client"

import { useRouter } from "next/navigation"
import { ModernNavbar } from "./modern-navbar"

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

  const handleWorkspaceChange = (workspaceId: string) => {
    console.log('handleWorkspaceChange triggered:', workspaceId)
    console.log('Available workspaces:', workspaces)
    const workspace = workspaces.find(ws => ws.id === workspaceId)
    console.log('Found workspace:', workspace)
    if (workspace) {
      console.log('Navigating to:', `/workspace/${workspace.slug}`)
      router.push(`/workspace/${workspace.slug}`)
    }
  }

  const handleProjectChange = (projectId: string) => {
    console.log('handleProjectChange triggered:', projectId)
    console.log('Available projects:', projects)
    
    // Handle "All Projects" option for admin/owner users
    if (projectId === 'all-projects') {
      console.log('Navigating to admin dashboard')
      router.push('/admin')
      return
    }
    
    const project = projects.find(p => p.id === projectId)
    console.log('Found project:', project)
    if (project) {
      console.log('Navigating to:', `/workspace/${currentWorkspace.slug}/projects/${project.id}`)
      router.push(`/workspace/${currentWorkspace.slug}/projects/${project.id}`)
    }
  }

  return (
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
  )
}
