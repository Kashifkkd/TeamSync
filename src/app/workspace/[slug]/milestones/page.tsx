import { requireAuth, getWorkspaceBySlug } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  Target, 
  Calendar,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  MoreVertical
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials, formatDate, formatRelativeTime, getStatusColor, calculateProgress } from "@/lib/utils"

interface MilestonesPageProps {
  params: Promise<{ slug: string }>
}

export default async function MilestonesPage({ params }: MilestonesPageProps) {
  const user = await requireAuth()
  const { slug } = await params
  
  const workspace = await getWorkspaceBySlug(slug, user.id)
  
  if (!workspace) {
    redirect("/dashboard")
  }

  // Get all milestones in workspace
  const milestones = await db.milestone.findMany({
    where: {
      project: {
        workspaceId: workspace.id,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          key: true,
          color: true,
        },
      },
      assignees: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
      tasks: {
        select: {
          id: true,
          status: true,
          storyPoints: true,
        },
      },
      _count: {
        select: {
          tasks: true,
        },
      },
    },
    orderBy: [
      { status: "asc" }, // Active milestones first
      { endDate: "asc" }, // Then by due date
      { createdAt: "desc" },
    ],
  })

  const activeMilestones = milestones.filter(m => m.status === "active")
  const completedMilestones = milestones.filter(m => m.status === "completed")
  const plannedMilestones = milestones.filter(m => m.status === "planning")
  const cancelledMilestones = milestones.filter(m => m.status === "cancelled")

  // Calculate workspace milestone stats
  const totalTasks = milestones.reduce((sum, m) => sum + m._count.tasks, 0)
  const completedTasks = milestones.reduce((sum, m) => 
    sum + m.tasks.filter(t => t.status === "done").length, 0
  )
  const totalStoryPoints = milestones.reduce((sum, m) => 
    sum + m.tasks.reduce((taskSum, t) => taskSum + (t.storyPoints || 0), 0), 0
  )
  const completedStoryPoints = milestones.reduce((sum, m) => 
    sum + m.tasks.filter(t => t.status === "done").reduce((taskSum, t) => taskSum + (t.storyPoints || 0), 0), 0
  )

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
            <p className="text-gray-600">
              Track project milestones and sprint progress across your workspace
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Milestone
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Milestones</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{milestones.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeMilestones.length} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateProgress(completedTasks, totalTasks)}%</div>
              <p className="text-xs text-muted-foreground">
                {completedTasks} of {totalTasks} tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Story Points</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateProgress(completedStoryPoints, totalStoryPoints)}%</div>
              <p className="text-xs text-muted-foreground">
                {completedStoryPoints} of {totalStoryPoints} points
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {milestones.length > 0 ? Math.round((completedMilestones.length / milestones.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {completedMilestones.length} completed
              </p>
            </CardContent>
          </Card>
        </div>

        {milestones.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Target className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No milestones yet</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Milestones help you track important project goals and sprint progress. Create your first milestone to get started.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Milestone
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Milestones */}
            {activeMilestones.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Play className="mr-2 h-5 w-5 text-green-600" />
                  Active Milestones
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {activeMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div>
            )}

            {/* Planned Milestones */}
            {plannedMilestones.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-blue-600" />
                  Planned Milestones
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {plannedMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Milestones */}
            {completedMilestones.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Completed Milestones
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {completedMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div>
            )}

            {/* Cancelled Milestones */}
            {cancelledMilestones.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Pause className="mr-2 h-5 w-5 text-gray-600" />
                  Cancelled Milestones
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {cancelledMilestones.map((milestone) => (
                    <MilestoneCard key={milestone.id} milestone={milestone} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function MilestoneCard({ milestone }: { milestone: any }) {
  const completedTasks = milestone.tasks.filter((task: any) => task.status === "done").length
  const totalTasks = milestone._count.tasks
  const progress = calculateProgress(completedTasks, totalTasks)
  
  const completedStoryPoints = milestone.tasks
    .filter((task: any) => task.status === "done")
    .reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0)
  
  const totalStoryPoints = milestone.tasks
    .reduce((sum: number, task: any) => sum + (task.storyPoints || 0), 0)

  const isOverdue = milestone.endDate && new Date(milestone.endDate) < new Date() && milestone.status !== "completed"
  const daysLeft = milestone.endDate ? Math.ceil((new Date(milestone.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null

  const statusIcons = {
    planning: Clock,
    active: Play,
    completed: CheckCircle,
    cancelled: Pause,
  }

  const StatusIcon = statusIcons[milestone.status as keyof typeof statusIcons] || Clock

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: milestone.project.color }}
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">{milestone.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {milestone.project.key}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(milestone.status)}`}
                >
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {milestone.status.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {milestone.type}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Milestone</DropdownMenuItem>
              <DropdownMenuItem>View Tasks</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                {milestone.status === "active" ? "Complete" : "Activate"} Milestone
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {milestone.description && (
          <CardDescription className="line-clamp-2">
            {milestone.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
            <span>{completedTasks} of {totalTasks} tasks</span>
            {totalStoryPoints > 0 && (
              <span>{completedStoryPoints} of {totalStoryPoints} points</span>
            )}
          </div>
        </div>

        {/* Sprint Goal */}
        {milestone.sprintGoal && (
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Sprint Goal</div>
            <p className="text-sm text-gray-800 bg-blue-50 p-2 rounded border-l-4 border-blue-400">
              {milestone.sprintGoal}
            </p>
          </div>
        )}

        {/* Dates and Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="space-y-1">
            {milestone.startDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Started {formatDate(milestone.startDate)}</span>
              </div>
            )}
            {milestone.endDate && (
              <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : ''}`}>
                <Calendar className="h-3 w-3" />
                <span>
                  {milestone.status === "completed" ? "Completed" : "Due"} {formatDate(milestone.endDate)}
                </span>
                {isOverdue && <AlertCircle className="h-3 w-3" />}
              </div>
            )}
          </div>

          {daysLeft !== null && milestone.status !== "completed" && (
            <div className={`text-right ${isOverdue ? 'text-red-600' : daysLeft <= 3 ? 'text-yellow-600' : ''}`}>
              <div className="font-medium">
                {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
              </div>
            </div>
          )}
        </div>

        {/* Team */}
        {milestone.assignees.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Team</span>
            <div className="flex -space-x-2">
              {milestone.assignees.slice(0, 4).map((assignee: any) => (
                <Avatar key={assignee.id} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={assignee.user.image || ""} />
                  <AvatarFallback className="text-xs">
                    {getInitials(assignee.user.name || assignee.user.email || "")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {milestone.assignees.length > 4 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{milestone.assignees.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Capacity */}
        {milestone.capacity && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Capacity</span>
            <span className="font-medium">{milestone.capacity} points</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
