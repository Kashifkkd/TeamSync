import { redirect } from "next/navigation"
import { requireAuth, getWorkspaceBySlug } from "@/lib/auth-utils"
import { db } from "@/lib/db"

interface ProjectPageProps {
  params: Promise<{ slug: string; projectId: string }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await requireAuth()
  const { slug, projectId } = await params

  if (!user.id) {
    redirect("/auth/signin")
  }

  const workspace = await getWorkspaceBySlug(slug, user.id)

  if (!workspace) {
    redirect("/dashboard")
  }

  // Get the specific project
  const project = await db.project.findUnique({
    where: { 
      id: projectId,
      workspaceId: workspace.id 
    },
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
      },
      tasks: {
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      milestones: {
        orderBy: { endDate: "asc" },
      },
      _count: {
        select: {
          tasks: true,
          milestones: true,
          members: true,
        },
      },
    },
  })

  if (!project) {
    redirect(`/workspace/${slug}/projects`)
  }

  // Determine if user is admin/owner
  const isAdmin = workspace.userRole === 'owner' || workspace.userRole === 'admin'

  return (
    <div className="h-full overflow-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Project Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="w-4 h-4 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              <p className="text-muted-foreground">{project.description}</p>
              {isAdmin && (
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Admin View - Full Access
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded">
              {project.key}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              project.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : project.status === 'on_hold'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
            }`}>
              {project.status.replace('_', ' ').toUpperCase()}
            </span>
            {isAdmin && (
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                ADMIN
              </span>
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-${isAdmin ? '6' : '4'} gap-4`}>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-foreground">{project._count.tasks}</div>
            <div className="text-sm text-muted-foreground">Total Tasks</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-foreground">{project._count.milestones}</div>
            <div className="text-sm text-muted-foreground">Milestones</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-foreground">{project._count.members}</div>
            <div className="text-sm text-muted-foreground">Team Members</div>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <div className="text-2xl font-bold text-foreground">
              {project.tasks.filter(t => t.status === 'done').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed Tasks</div>
          </div>
          
          {/* Admin-only stats */}
          {isAdmin && (
            <>
              <div className="bg-card p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((project.tasks.filter(t => t.status === 'done').length / Math.max(project._count.tasks, 1)) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="bg-card p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {project.tasks.filter(t => t.status === 'in_progress').length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
            </>
          )}
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Admin Controls</h2>
              <span className="text-xs bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                ADMIN ONLY
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Edit Project</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Modify project settings</div>
              </button>
              <button className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Manage Team</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Add/remove members</div>
              </button>
              <button className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Project Analytics</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">View detailed reports</div>
              </button>
            </div>
          </div>
        )}

        {/* Project Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Tasks</h2>
                {isAdmin && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    {project.tasks.length} total
                  </span>
                )}
              </div>
              {project.tasks.length > 0 ? (
                <div className="space-y-3">
                  {project.tasks.slice(0, isAdmin ? 8 : 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'done' ? 'bg-green-500' :
                          task.status === 'in_progress' ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`} />
                        <span className="text-sm font-medium">{task.title}</span>
                        {isAdmin && task.assignee && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                            {task.assignee.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground capitalize">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No tasks yet</p>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            {/* Team Members */}
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Team Members</h3>
                {isAdmin && (
                  <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    {project.members.length} members
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {member.user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.user?.name || 'Unknown User'}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        {isAdmin && member.user?.email && (
                          <p className="text-xs text-muted-foreground">{member.user.email}</p>
                        )}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded ${
                          member.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          member.role === 'member' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {member.role}
                        </span>
                        <button className="text-xs text-muted-foreground hover:text-foreground">
                          ⋯
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {isAdmin && (
                <div className="mt-4 pt-4 border-t">
                  <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                    + Add Team Member
                  </button>
                </div>
              )}
            </div>

            {/* Project Details */}
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Project Details</h3>
                {isAdmin && (
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Edit
                  </button>
                )}
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Created by:</span>
                  <p className="font-medium">{project.creator.name}</p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">{project.creator.email}</p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <p className="font-medium">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.createdAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                <div>
                  <span className="text-muted-foreground">Last updated:</span>
                  <p className="font-medium">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(project.updatedAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
                {isAdmin && (
                  <>
                    <div>
                      <span className="text-muted-foreground">Project ID:</span>
                      <p className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {project.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Workspace:</span>
                      <p className="font-medium">{workspace.name}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <p className="font-medium capitalize">{project.status.replace('_', ' ')}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Admin-only Analytics */}
            {isAdmin && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Project Analytics</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-600 dark:text-purple-400">Task Distribution:</span>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Done:</span>
                        <span className="font-medium">{project.tasks.filter(t => t.status === 'done').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>In Progress:</span>
                        <span className="font-medium">{project.tasks.filter(t => t.status === 'in_progress').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Todo:</span>
                        <span className="font-medium">{project.tasks.filter(t => t.status === 'todo').length}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <span className="text-purple-600 dark:text-purple-400">Team Activity:</span>
                    <div className="mt-1 space-y-1">
                      <div className="flex justify-between">
                        <span>Active Members:</span>
                        <span className="font-medium">{project.members.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Admins:</span>
                        <span className="font-medium">{project.members.filter(m => m.role === 'admin').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Regular Members:</span>
                        <span className="font-medium">{project.members.filter(m => m.role === 'member').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
