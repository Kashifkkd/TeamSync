"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Plus,
  FolderKanban,
  Calendar,
  MoreVertical,
  Archive,
  Settings,
  Target
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials, formatDate, getStatusColor, calculateProgress } from "@/lib/utils"
import { useProjectsClient } from "@/hooks/use-projects-client"
import { Skeleton } from "@/components/ui/skeleton"

interface ProjectsPageClientProps {
  slug: string
}

export function ProjectsPageClient({ slug }: ProjectsPageClientProps) {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') || 'all'
  
  const { data: projectsData, isLoading } = useProjectsClient({
    workspaceSlug: slug,
    status
  })

  const projects = projectsData || []

  if (isLoading) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Stats skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
          
          {/* Projects grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Filter projects based on status
  const filteredProjects = status === 'all' 
    ? projects 
    : projects.filter(p => p.status === status)

  const activeProjects = projects.filter(p => p.status === "active")
  const archivedProjects = projects.filter(p => p.status === "archived")
  const onHoldProjects = projects.filter(p => p.status === "on_hold")

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {status === 'all' ? 'All Projects' : 
               status === 'active' ? 'Active Projects' :
               status === 'archived' ? 'Archived Projects' :
               status === 'on_hold' ? 'On Hold Projects' : 'Projects'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {status === 'all' 
                ? `Manage all ${projects.length} projects in your workspace`
                : `View ${filteredProjects.length} ${status} projects`
              }
            </p>
          </div>
          <Link href={`/workspace/${slug}/projects/new`}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                </div>
                <FolderKanban className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600">{activeProjects.length}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">On Hold</p>
                  <p className="text-2xl font-bold text-yellow-600">{onHoldProjects.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Archived</p>
                  <p className="text-2xl font-bold text-muted-foreground">{archivedProjects.length}</p>
                </div>
                <Archive className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {status === 'all' ? 'No projects yet' : `No ${status} projects`}
              </h3>
              <p className="text-gray-600 mb-6">
                {status === 'all' 
                  ? 'Get started by creating your first project'
                  : `No projects with ${status} status found`
                }
              </p>
              <Link href={`/workspace/${slug}/projects/new`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Show all projects if status is 'all', otherwise show filtered */}
            {status === 'all' ? (
              <>
                {/* Active Projects */}
                {activeProjects.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Active Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} workspaceSlug={slug} />
                      ))}
                    </div>
                  </div>
                )}

                {/* On Hold Projects */}
                {onHoldProjects.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">On Hold</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {onHoldProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} workspaceSlug={slug} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Archived Projects */}
                {archivedProjects.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Archived</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {archivedProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} workspaceSlug={slug} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} workspaceSlug={slug} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface Project {
  id: string
  name: string
  key: string
  description?: string
  status: string
  priority: string
  visibility: string
  color: string
  startDate?: string
  endDate?: string
  createdAt: string
  updatedAt: string
  workspaceId: string
  creatorId: string
  tasks?: Array<{ status: string }>
  members?: Array<{ user: { name?: string; email?: string; image?: string } }>
  _count: {
    tasks: number
    milestones: number
    members?: number
  }
}

function ProjectCard({ project, workspaceSlug }: {
  project: Project
  workspaceSlug: string
}) {
  const completedTasks = project.tasks?.filter(task => task.status === "done").length || 0
  const totalTasks = project._count.tasks
  const progress = calculateProgress(completedTasks, totalTasks)
  const statusColor = getStatusColor(project.status)

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-foreground truncate">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {project.key}
              </CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/workspace/${workspaceSlug}/projects/${project.id}`}>
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/workspace/${workspaceSlug}/projects/${project.id}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {project.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {project.description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{project._count?.tasks || 0}</p>
            <p className="text-xs text-muted-foreground">Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-foreground">{project._count?.milestones || 0}</p>
            <p className="text-xs text-muted-foreground">Milestones</p>
          </div>
        </div>
        
        {/* Status and Members */}
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary" 
            className="text-xs"
            style={{ 
              backgroundColor: `${statusColor}20`, 
              color: statusColor,
              borderColor: `${statusColor}40`
            }}
          >
            {project.status.replace('_', ' ').toUpperCase()}
          </Badge>
          
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-2">
              {project.members?.slice(0, 3).map((member, index: number) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={member.user?.image} alt={member.user?.name} />
                  <AvatarFallback className="text-xs">
                    {getInitials(member.user?.name || member.user?.email || "")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {(project._count?.members || 0) > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{(project._count?.members || 0) - 3}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Dates */}
        {(project.startDate || project.endDate) && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              {project.startDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Start: {formatDate(project.startDate)}</span>
                </div>
              )}
              {project.endDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>End: {formatDate(project.endDate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
