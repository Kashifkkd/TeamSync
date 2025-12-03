"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  FolderKanban, 
  CheckSquare, 
  Target, 
  Users, 
  TrendingUp,
  Calendar,
  Plus,
  Activity,
  Clock,
  AlertCircle,
  BarChart3,
  Settings,
  Edit3,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { getInitials, formatRelativeTime, getStatusColor } from "@/lib/utils"
import { ROLE } from "@/lib/constants"
import { useProject } from "@/hooks/use-project"
import { useWorkspace } from "@/hooks/use-workspace"
import { Skeleton } from "@/components/ui/skeleton"
import { redirect } from "next/navigation"

interface ProjectPageClientProps {
  slug: string
  projectId: string
}

export function ProjectPageClient({ slug, projectId }: ProjectPageClientProps) {
  const { data: workspaceData, isLoading: isLoadingWorkspace } = useWorkspace(slug)
  const workspace = workspaceData?.workspace

  const { data: projectData, isLoading: isLoadingProject } = useProject(slug, projectId)
  const project = projectData?.project

  if (isLoadingWorkspace || isLoadingProject) {
    return (
      <div className="h-full overflow-auto scrollbar-thin">
        <div className="p-4 space-y-6 animate-pulse">
          {/* Project header skeleton */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          
          {/* Quick actions skeleton */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-28" />
            </div>
          </div>
          
          {/* Progress card skeleton */}
          <Skeleton className="h-32 rounded-lg" />
          
          {/* Cards grid skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!workspace || !project) {
    redirect(`/workspace/${slug}/projects`)
  }

  const isAdmin = workspace.userRole === ROLE.OWNER || workspace.userRole === ROLE.ADMIN

  // Calculate project statistics
  const tasks = project.tasks || []
  const completedTasks = tasks.filter((t) => t.status === "done").length
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length
  const todoTasks = tasks.filter((t) => t.status === "todo").length
  const blockedTasks = tasks.filter((t) => t.status === "blocked").length
  const completionRate = project._count.tasks > 0 ? Math.round((completedTasks / project._count.tasks) * 100) : 0

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <div className="p-4 space-y-4">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href={`/workspace/${slug}`}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: project.color }}
            >
              {project.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
              <p className="text-sm text-muted-foreground">{project.description || "No description provided"}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
              {project.key}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                project.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : project.status === "on_hold"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }`}
            >
              {project.status.replace("_", " ").toUpperCase()}
            </span>
          </div>
        </div>

        {/* Statistics Cards - 2 Rows (4 cards per row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{project._count.tasks}</p>
                </div>
                <CheckSquare className="h-5 w-5 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground">{completedTasks}</p>
                </div>
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-3xl font-bold text-foreground">{inProgressTasks}</p>
                </div>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completion</p>
                  <p className="text-3xl font-bold text-foreground">{completionRate}%</p>
                </div>
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blocked</p>
                  <p className="text-3xl font-bold text-foreground">{blockedTasks}</p>
                </div>
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Todo</p>
                  <p className="text-3xl font-bold text-foreground">{todoTasks}</p>
                </div>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Milestones</p>
                  <p className="text-3xl font-bold text-foreground">{project._count.milestones}</p>
                </div>
                <Target className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team</p>
                  <p className="text-3xl font-bold text-foreground">{project._count.members}</p>
                </div>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="flex items-center space-x-2">
            <Link href={`/workspace/${slug}/tasks?projectId=${projectId}`}>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </Link>
            <Link href={`/workspace/${slug}/milestones?projectId=${projectId}`}>
              <Button variant="outline" size="sm">
                <Target className="h-4 w-4 mr-2" />
                New Milestone
              </Button>
            </Link>
            {isAdmin && (
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            )}
          </div>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Project Progress</span>
              </div>
              <span className="text-sm text-muted-foreground">{completionRate}% Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <Progress value={completionRate} className="h-3" />
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{completedTasks}</div>
                  <div className="text-xs text-muted-foreground">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{inProgressTasks}</div>
                  <div className="text-xs text-muted-foreground">In Progress</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-orange-600">{todoTasks}</div>
                  <div className="text-xs text-muted-foreground">Todo</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{blockedTasks}</div>
                  <div className="text-xs text-muted-foreground">Blocked</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Tasks and Team Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Tasks */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>Recent Tasks</span>
                </div>
                <Link href={`/workspace/${slug}/tasks?projectId=${projectId}`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckSquare className="mx-auto h-6 w-6 text-gray-400" />
                    <h3 className="mt-1 text-xs font-medium text-gray-900">No tasks yet</h3>
                    <p className="text-xs text-gray-500">Create your first task to get started.</p>
                  </div>
                ) : (
                  tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            task.status === "done"
                              ? "bg-green-500"
                              : task.status === "in_progress"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-900 truncate">{task.title}</p>
                          {task.assignee && (
                            <p className="text-xs text-gray-500">{task.assignee.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Badge variant="secondary" className={`text-xs ${getStatusColor(task.status)}`}>
                          {task.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Team Members</span>
                </div>
                <Link href={`/workspace/${slug}/team`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {(project.members || []).map((member) => (
                  <div key={member.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.user?.image || ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user?.name || member.user?.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-gray-900 truncate">{member.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{member.role}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Milestones */}
        {project.milestones && project.milestones.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Upcoming Milestones</span>
                </div>
                <Link href={`/workspace/${slug}/milestones?project=${projectId}`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {project.milestones.slice(0, 5).map((milestone) => (
                  <div key={milestone.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.color }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-900 truncate">{milestone.name}</p>
                        <p className="text-xs text-gray-500">
                          {milestone.endDate ? formatRelativeTime(milestone.endDate) : "No due date"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {milestone.endDate ? new Date(milestone.endDate).toLocaleDateString() : "No date"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Project Details */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <div className="flex items-center space-x-2">
                <FolderKanban className="h-4 w-4" />
                <span>Project Details</span>
              </div>
              {isAdmin && (
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Created by:</span>
                <p className="font-medium">{project.creator.name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Created:</span>
                <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Last updated:</span>
                <p className="font-medium">{new Date(project.updatedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium capitalize">{project.status.replace("_", " ")}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

