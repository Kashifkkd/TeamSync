import { requireAuth, getWorkspaceBySlug } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NoProjectsCTA } from "@/components/workspace/no-projects-cta"
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
} from "lucide-react"
import Link from "next/link"
import { getInitials, formatRelativeTime, getStatusColor } from "@/lib/utils"
import { DashboardCharts } from "@/components/charts/dashboard-charts"

interface WorkspaceDashboardProps {
  params: Promise<{ slug: string }>
}

export default async function WorkspaceDashboard({ params }: WorkspaceDashboardProps) {
  const user = await requireAuth()
  const { slug } = await params
  
  const workspace = await getWorkspaceBySlug(slug, user.id!)
  
  if (!workspace) {
    redirect("/dashboard")
  }

  // Get projects first
  const projects = await db.project.findMany({
      where: { workspaceId: workspace.id },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
        tasks: {
          select: {
            status: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 6,
  })

  // Only fetch milestones and tasks if there are projects
  const [recentTasks, upcomingMilestones, teamMembers] = await Promise.all([
    // Recent tasks (only if projects exist)
    projects.length > 0 ? db.task.findMany({
      where: {
        project: {
          workspaceId: workspace.id,
        },
      },
      include: {
        project: {
          select: {
            name: true,
            key: true,
            color: true,
          },
        },
        assignee: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 8,
    }) : [],

    // Upcoming milestones (only if projects exist)
    projects.length > 0 ? db.milestone.findMany({
      where: {
        project: {
          workspaceId: workspace.id,
        },
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        project: {
          select: {
            name: true,
            color: true,
          },
        },
      },
      orderBy: { endDate: "asc" },
      take: 5,
    }) : [],

    // Team members
    db.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { joinedAt: "asc" },
      take: 8,
    }),
  ])

  // Calculate statistics
  const totalTasks = projects.reduce((sum, project) => sum + project._count.tasks, 0)
  const completedTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.status === "done").length, 0
  )
  const inProgressTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.status === "in_progress").length, 0
  )
  const blockedTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.status === "blocked").length, 0
  )
  const overdueTasks = projects.reduce((sum, project) => 
    sum + project.tasks.filter(task => task.status !== "done").length, 0
  )

  //   const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const productivityScore = Math.round((completedTasks * 0.4 + inProgressTasks * 0.3 + (totalTasks - blockedTasks) * 0.3))
  // const efficiencyScore = Math.round((completedTasks / Math.max(inProgressTasks + completedTasks, 1)) * 100)
  // const revenue = Math.round(completedTasks * 150 + inProgressTasks * 75) // Mock revenue calculation
  // const comments = projects.reduce((sum, project) => sum + Math.floor(Math.random() * 20), 0) // Mock comments

  // Mock data for charts
  const taskTrendData = [
    { name: 'Mon', completed: 12, inProgress: 8, blocked: 2 },
    { name: 'Tue', completed: 19, inProgress: 6, blocked: 1 },
    { name: 'Wed', completed: 15, inProgress: 10, blocked: 3 },
    { name: 'Thu', completed: 22, inProgress: 7, blocked: 1 },
    { name: 'Fri', completed: 18, inProgress: 9, blocked: 2 },
    { name: 'Sat', completed: 8, inProgress: 4, blocked: 1 },
    { name: 'Sun', completed: 5, inProgress: 3, blocked: 0 },
  ]

  const statusDistribution = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks, color: '#2563eb' },
    { name: 'Blocked', value: blockedTasks, color: '#ef4444' },
    { name: 'Todo', value: totalTasks - completedTasks - inProgressTasks - blockedTasks, color: '#6b7280' },
  ]

  // Additional chart data
  const projectProgressData = projects.map(project => ({
    name: project.name.substring(0, 8) + '...',
    progress: Math.round((project.tasks.filter(t => t.status === "done").length / Math.max(project._count.tasks, 1)) * 100),
    tasks: project._count.tasks
  }))

  const weeklyActivityData = [
    { day: 'Mon', tasks: 15, comments: 8, meetings: 2 },
    { day: 'Tue', tasks: 22, comments: 12, meetings: 1 },
    { day: 'Wed', tasks: 18, comments: 6, meetings: 3 },
    { day: 'Thu', tasks: 25, comments: 15, meetings: 2 },
    { day: 'Fri', tasks: 20, comments: 10, meetings: 1 },
    { day: 'Sat', tasks: 8, comments: 3, meetings: 0 },
    { day: 'Sun', tasks: 5, comments: 2, meetings: 0 },
  ]

  const teamPerformanceData = teamMembers.map(member => ({
    name: member.user.name?.split(' ')[0] || 'User',
    tasks: Math.floor(Math.random() * 20) + 5,
    efficiency: Math.floor(Math.random() * 40) + 60
  }))

  return (
    <div className="h-full overflow-auto scrollbar-thin">
      <div className="p-4 space-y-4">
        {/* Welcome Section - Compact */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
            Welcome back to {workspace.name}
          </h1>
            <p className="text-sm text-muted-foreground">
              Here&apos;s what&apos;s happening with your team today
          </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* No Projects Call-to-Action */}
        {projects.length === 0 && (
          <NoProjectsCTA 
            workspaceId={workspace.id}
            canCreate={workspace.userRole === 'owner' || workspace.userRole === 'admin'}
          />
        )}

        {/* Statistics Cards - 2 Rows (4 cards per row) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Projects</p>
                  <p className="text-3xl font-bold text-foreground">{projects.length}</p>
                </div>
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tasks</p>
                  <p className="text-3xl font-bold text-foreground">{totalTasks}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-3xl font-bold text-foreground">{overdueTasks}</p>
                </div>
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Productivity</p>
                  <p className="text-3xl font-bold text-foreground">{productivityScore}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated hover:shadow-md transition-all duration-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team</p>
                  <p className="text-3xl font-bold text-foreground">{teamMembers.length}</p>
                </div>
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Milestones and Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Upcoming Milestones - Compact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span>Upcoming Milestones</span>
                </div>
                <Link href={`/workspace/${slug}/milestones`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {projects.length === 0 ? (
                  <div className="text-center py-4">
                    <Target className="mx-auto h-6 w-6 text-gray-400" />
                    <h3 className="mt-1 text-xs font-medium text-gray-900">No projects yet</h3>
                    <p className="text-xs text-gray-500">
                      Create a project first to add milestones and track progress.
                    </p>
                  </div>
                ) : upcomingMilestones.length === 0 ? (
                  <div className="text-center py-4">
                    <Target className="mx-auto h-6 w-6 text-gray-400" />
                    <h3 className="mt-1 text-xs font-medium text-gray-900">No upcoming milestones</h3>
                    <p className="text-xs text-gray-500">
                      Milestones help you track important project goals.
                    </p>
                  </div>
                ) : (
                  upcomingMilestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: milestone.project.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-900 truncate">
                            {milestone.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {milestone.project.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {milestone.endDate ? formatRelativeTime(milestone.endDate) : "No due date"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Projects - Compact */}
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Recent Projects
                <Link href={`/workspace/${slug}/projects`}>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-6 px-2">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {projects.length === 0 ? (
                  <div className="text-center py-4">
                    <FolderKanban className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <h3 className="text-xs font-medium text-foreground">No projects yet</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Get started by creating your first project.
                    </p>
                      <Link href={`/workspace/${slug}/projects/new`}>
                      <Button size="sm" className="btn-primary h-7">
                        <Plus className="mr-1 h-3 w-3" />
                          New Project
                        </Button>
                      </Link>
                  </div>
                ) : (
                  projects.map((project) => {
                    const completedCount = project.tasks.filter(t => t.status === "done").length
                    const totalCount = project._count.tasks
                    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

                    return (
                      <Link 
                        key={project.id} 
                        href={`/workspace/${slug}/projects/${project.id}`}
                        className="block"
                      >
                        <div className="card-interactive p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                style={{ backgroundColor: project.color }}
                              />
                              <div>
                                <p className="text-xs font-medium text-foreground truncate max-w-32">
                                  {project.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {totalCount} tasks • {progress}%
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="text-xs font-medium">
                              {project.key}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <DashboardCharts 
          data={{
            taskTrendData,
            statusDistribution,
            projectProgressData,
            weeklyActivityData,
            teamPerformanceData
          }}
        />

        {/* Team Members and Recent Tasks - 50/50 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Team Members - Compact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Team Members</span>
                </div>
                <Link href={`/workspace/${slug}/team`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between py-1">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.user.image || ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user.name || member.user.email || "")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {member.user.email}
                        </p>
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

          {/* Recent Tasks - Compact */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                Recent Tasks
                <Link href={`/workspace/${slug}/tasks`}>
                  <Button variant="ghost" size="sm" className="h-6 px-2">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {projects.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckSquare className="mx-auto h-6 w-6 text-gray-400" />
                    <h3 className="mt-1 text-xs font-medium text-gray-900">No projects yet</h3>
                    <p className="text-xs text-gray-500">
                      Create a project first to add tasks and track work.
                    </p>
                  </div>
                ) : recentTasks.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckSquare className="mx-auto h-6 w-6 text-gray-400" />
                    <h3 className="mt-1 text-xs font-medium text-gray-900">No tasks yet</h3>
                    <p className="text-xs text-gray-500">
                      Tasks will appear here once you create them in your projects.
                    </p>
                  </div>
                ) : (
                  recentTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-1">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div 
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: task.project.color }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-gray-900 truncate">
                            {task.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {task.project.name} • {task.project.key}-{task.number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStatusColor(task.status)}`}
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                        {task.assignee && (
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={task.assignee.image || ""} />
                            <AvatarFallback className="text-xs">
                              {getInitials(task.assignee.name || "")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
