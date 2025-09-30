import { requireAuth, getWorkspaceBySlug } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Plus, 
  FolderKanban, 
  Users, 
  Calendar,
  MoreVertical,
  Archive,
  Settings
} from "lucide-react"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getInitials, formatDate, getStatusColor, calculateProgress } from "@/lib/utils"

interface ProjectsPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const user = await requireAuth()
  const { slug } = await params
  
  const workspace = await getWorkspaceBySlug(slug, user.id)
  
  if (!workspace) {
    redirect("/dashboard")
  }

  // Get all projects in workspace
  const projects = await db.project.findMany({
    where: { workspaceId: workspace.id },
    include: {
      creator: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      members: {
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
        take: 5, // Limit to first 5 members for display
      },
      tasks: {
        select: {
          status: true,
        },
      },
      _count: {
        select: {
          tasks: true,
          milestones: true,
          members: true,
        },
      },
    },
    orderBy: [
      { status: "asc" }, // Active projects first
      { updatedAt: "desc" },
    ],
  })

  const activeProjects = projects.filter(p => p.status === "active")
  const archivedProjects = projects.filter(p => p.status === "archived")
  const onHoldProjects = projects.filter(p => p.status === "on_hold")

  return (
    <div className="h-full overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">
              Manage and organize your team's projects
            </p>
          </div>
          <Link href={`/workspace/${slug}/projects/new`}>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Hold</CardTitle>
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onHoldProjects.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Archived</CardTitle>
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{archivedProjects.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FolderKanban className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Get started by creating your first project. Projects help you organize tasks, track progress, and collaborate with your team.
              </p>
              <Link href={`/workspace/${slug}/projects/new`}>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Active Projects */}
            {activeProjects.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Active Projects</h2>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">On Hold</h2>
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
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Archived</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {archivedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} workspaceSlug={slug} />
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

function ProjectCard({ project, workspaceSlug }: { 
  project: any
  workspaceSlug: string 
}) {
  const completedTasks = project.tasks.filter((task: any) => task.status === "done").length
  const totalTasks = project._count.tasks
  const progress = calculateProgress(completedTasks, totalTasks)

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div 
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: project.color }}
            />
            <div className="min-w-0 flex-1">
              <Link href={`/workspace/${workspaceSlug}/projects/${project.id}`}>
                <CardTitle className="text-lg hover:text-blue-600 transition-colors truncate">
                  {project.name}
                </CardTitle>
              </Link>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {project.key}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${getStatusColor(project.status)}`}
                >
                  {project.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Project Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                {project.status === "archived" ? "Unarchive" : "Archive"} Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {project.description && (
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        {totalTasks > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {completedTasks} of {totalTasks} tasks completed
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FolderKanban className="h-3 w-3" />
              <span>{project._count.tasks}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{project._count.members}</span>
            </div>
          </div>
          
          {project.endDate && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(project.endDate)}</span>
            </div>
          )}
        </div>

        {/* Team Members */}
        {project.members.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Team</span>
            <div className="flex -space-x-2">
              {project.members.slice(0, 4).map((member: any) => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={member.user.image || ""} />
                  <AvatarFallback className="text-xs">
                    {getInitials(member.user.name || member.user.email || "")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project._count.members > 4 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{project._count.members - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
