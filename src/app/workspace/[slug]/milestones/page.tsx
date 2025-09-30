"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Plus, 
  Calendar, 
  Target, 
  Users,
  MoreHorizontal,
  Play,
  Pause,
  Archive,
  BarChart3,
  ChevronLeft,
  FolderKanban
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { CreateMilestoneDialog } from "@/components/milestones/create-milestone-dialog"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"

interface Milestone {
  id: string
  name: string
  description: string
  status: "active" | "upcoming" | "completed" | "paused"
  startDate: string
  endDate: string
  progress: number
  tasks: { total: number; completed: number; inProgress: number }
  assignees: Array<{ name: string; initials: string; avatar: string | null }>
  priority: "high" | "medium" | "low"
}

// API integration for milestones

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  upcoming: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-200"
}

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-800"
}

export default function MilestonesPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const workspaceSlug = params.slug as string
  const projectId = searchParams.get('project')
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [projects, setProjects] = useState<Array<{ id: string; name: string; key: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`/api/workspaces/${workspaceSlug}/projects`)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      const data = await response.json()
      setProjects(data.projects || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
    }
  }, [workspaceSlug])

  // Fetch milestones from API
  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true)
      const url = projectId 
        ? `/api/workspaces/${workspaceSlug}/milestones?project=${projectId}`
        : `/api/workspaces/${workspaceSlug}/milestones`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch milestones')
      }
      const data = await response.json()

      // Transform API data to match our interface
      const transformedMilestones: Milestone[] = data.milestones.map((milestone: {
        id: string;
        name: string;
        description: string | null;
        status: string;
        startDate: string | null;
        endDate: string | null;
        progress: number;
        tasks: Array<{ id: string; status: string; dueDate: string | null }>;
        assignees: Array<{ user: { name: string | null; image: string | null } }>;
        priority: string;
      }) => ({
        id: milestone.id,
        name: milestone.name,
        description: milestone.description || '',
        status: milestone.status,
        startDate: milestone.startDate ? new Date(milestone.startDate).toISOString().split('T')[0] : '',
        endDate: milestone.endDate ? new Date(milestone.endDate).toISOString().split('T')[0] : '',
        progress: milestone.progress,
      tasks: {
          total: milestone.tasks.length,
          completed: milestone.tasks.filter((t) => t.status === 'completed').length,
          inProgress: milestone.tasks.filter((t) => t.status === 'in_progress').length
        },
        assignees: milestone.assignees.map((assignee) => ({
          name: assignee.user.name || 'Unknown',
          initials: (assignee.user.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase(),
          avatar: assignee.user.image
        })),
        priority: milestone.priority
      }))

      setMilestones(transformedMilestones)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [workspaceSlug, projectId])

  useEffect(() => {
    const fetchData = async () => {
      await fetchProjects()
      await fetchMilestones()
    }
    fetchData()
  }, [fetchProjects, fetchMilestones])

  const filteredMilestones = filterStatus === "all"
    ? milestones
    : milestones.filter(m => m.status === filterStatus)

  const MilestoneCard = ({ milestone }: { milestone: Milestone }) => (
    <Link href={`/milestones/${milestone.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {milestone.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {milestone.description}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2 mt-3">
            <Badge className={cn("text-xs", statusColors[milestone.status as keyof typeof statusColors])}>
              {milestone.status}
            </Badge>
            <Badge variant="outline" className={cn("text-xs", priorityColors[milestone.priority as keyof typeof priorityColors])}>
              {milestone.priority} priority
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Progress Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Progress</span>
              <span className="text-sm text-muted-foreground">{milestone.progress}%</span>
            </div>
            <Progress value={milestone.progress} className="h-2" />
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">{milestone.tasks.total}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{milestone.tasks.completed}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{milestone.tasks.inProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </div>
          </div>

          {/* Date Range */}
          <div className="flex items-center space-x-2 mb-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{milestone.startDate} - {milestone.endDate}</span>
          </div>

          {/* Assignees */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {milestone.assignees.slice(0, 3).map((assignee, index: number) => (
                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                    <AvatarImage src={assignee.avatar || undefined} alt={assignee.name} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {milestone.assignees.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border-2 border-background">
                    +{milestone.assignees.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {milestone.assignees.length} member{milestone.assignees.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center space-x-1">
              {milestone.status === "active" && (
                <Button variant="outline" size="sm" className="h-7">
                  <Pause className="h-3 w-3 mr-1" />
                  Pause
                </Button>
              )}
              {milestone.status === "upcoming" && (
                <Button size="sm" className="h-7">
                  <Play className="h-3 w-3 mr-1" />
                  Start
                </Button>
              )}
              {milestone.status === "completed" && (
                <Button variant="outline" size="sm" className="h-7">
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )

  if (loading) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-32" />
          </div>

          {/* Analytics Overview Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="card-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Milestones Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                  <div className="flex items-center space-x-2 mt-3">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                      <Skeleton className="h-2 w-full rounded-full" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {Array.from({ length: 3 }).map((_, j) => (
                        <div key={j} className="text-center space-y-1">
                          <Skeleton className="h-6 w-8 mx-auto" />
                          <Skeleton className="h-3 w-12 mx-auto" />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {Array.from({ length: 3 }).map((_, k) => (
                          <Skeleton key={k} className="h-6 w-6 rounded-full" />
                        ))}
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show create project UI if no projects exist
  if (!loading && projects.length === 0) {
    return (
      <div className="h-full overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Milestones</h1>
                <p className="text-xs text-muted-foreground">
                  Sprint and milestone planning
                </p>
              </div>
            </div>
          </div>

          {/* No Projects State */}
          <div className="flex items-center justify-center h-96">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Found</h3>
              <p className="text-muted-foreground mb-6">
                You need to create a project first before you can add milestones. 
                Projects help organize your work and track progress.
              </p>
              <CreateProjectDialog 
                workspaceId={workspaceSlug}
                onProjectCreated={() => {
                  fetchProjects()
                  fetchMilestones()
                }}
              >
                <Button className="h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </CreateProjectDialog>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          <div>
              <h1 className="text-lg font-semibold text-foreground">
                {projectId ? `Milestones` : `Milestones`}
              </h1>
              <p className="text-xs text-muted-foreground">
                {projectId 
                  ? `Milestones for ${projects.find(p => p.id === projectId)?.name || 'project'}`
                  : 'Sprint and milestone planning'
                }
              </p>
            </div>
          </div>
          <CreateMilestoneDialog 
            onMilestoneCreated={fetchMilestones}
            workspaceId={workspaceSlug}
            projects={projects}
          />
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Milestones</p>
                  <p className="text-2xl font-bold text-foreground">{milestones.length}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sprints</p>
                  <p className="text-2xl font-bold text-green-600">
                    {milestones.filter(m => m.status === 'active').length}
                  </p>
                </div>
                <Play className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {milestones.filter(m => m.status === 'completed').length}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {milestones.length > 0 ? Math.round(milestones.reduce((acc, m) => acc + m.progress, 0) / milestones.length) : 0}%
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Filter:</span>
              <div className="flex space-x-1">
                {["all", "active", "upcoming", "completed"].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className="capitalize"
                  >
                    {status}
              </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
              </Button>
          </div>
        </div>

        {/* Milestones Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMilestones.map((milestone) => (
              <MilestoneCard key={milestone.id} milestone={milestone} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMilestones.map((milestone) => (
              <Link key={milestone.id} href={`/milestones/${milestone.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{milestone.name}</h3>
                          <Badge className={cn("text-xs", statusColors[milestone.status as keyof typeof statusColors])}>
                            {milestone.status}
                          </Badge>
                          <Badge variant="outline" className={cn("text-xs", priorityColors[milestone.priority as keyof typeof priorityColors])}>
                            {milestone.priority}
                          </Badge>
              </div>
                        <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>

                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {milestone.startDate} - {milestone.endDate}
                </span>
              </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {milestone.tasks.completed}/{milestone.tasks.total} tasks
                            </span>
          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {milestone.assignees.length} members
                            </span>
              </div>
            </div>
        </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-foreground">{milestone.progress}%</div>
                          <Progress value={milestone.progress} className="w-24 h-2" />
                </div>

                        <div className="flex items-center space-x-2">
                          {milestone.status === "active" && (
                            <Button variant="outline" size="sm">
                              <Pause className="h-3 w-3 mr-1" />
                              Pause
                            </Button>
                          )}
                          {milestone.status === "upcoming" && (
                            <Button size="sm">
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          {milestone.status === "completed" && (
                            <Button variant="outline" size="sm">
                              <Archive className="h-3 w-3 mr-1" />
                              Archive
                            </Button>
              )}
            </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredMilestones.length === 0 && (
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No milestones found</h3>
            <p className="text-muted-foreground mb-4">
              {filterStatus === "all"
                ? "Create your first milestone to get started"
                : `No milestones with status "${filterStatus}"`
              }
            </p>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Milestone
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}