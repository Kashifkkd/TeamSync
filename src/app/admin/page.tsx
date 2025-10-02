import { redirect } from "next/navigation"
import { requireAuth } from "@/lib/auth-utils"
import { db } from "@/lib/db"

export default async function AdminDashboard() {
  const user = await requireAuth()

  if (!user.id) {
    redirect("/auth/signin")
  }

  // Check if user is admin/owner in any workspace
  const userWorkspaces = await db.workspaceMember.findMany({
    where: {
      userId: user.id,
      role: {
        in: ['owner', 'admin']
      }
    },
    include: {
      workspace: {
        include: {
          projects: {
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
          },
          _count: {
            select: {
              projects: true,
              members: true,
            },
          },
        },
      },
    },
  })

  // If user is not admin/owner in any workspace, redirect to dashboard
  if (userWorkspaces.length === 0) {
    redirect("/dashboard")
  }

  // Debug: Log the user workspaces and projects
  console.log('User workspaces:', userWorkspaces.length)
  console.log('User workspaces data:', JSON.stringify(userWorkspaces, null, 2))
  
  // Also check if user is creator of any workspaces
  const userCreatedWorkspaces = await db.workspace.findMany({
    where: {
      creatorId: user.id,
    },
    include: {
      projects: {
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
      },
      _count: {
        select: {
          projects: true,
          members: true,
        },
      },
    },
  })
  
  console.log('User created workspaces:', userCreatedWorkspaces.length)
  console.log('User created workspaces data:', JSON.stringify(userCreatedWorkspaces, null, 2))

  // Get all projects across all workspaces where user is admin/owner
  const allProjects = userWorkspaces.flatMap(ws => {
    console.log(`Workspace ${ws.workspace.name} has ${ws.workspace.projects.length} projects`)
    return ws.workspace.projects.map(project => ({
      ...project,
      workspace: {
        id: ws.workspace.id,
        name: ws.workspace.name,
        slug: ws.workspace.slug,
      },
    }))
  })

  console.log('Total projects found:', allProjects.length)

  // If no projects found through admin workspaces, try to get all projects the user has access to
  let allProjectsFinal = allProjects
  if (allProjects.length === 0) {
    console.log('No projects found through admin workspaces, trying alternative queries...')
    
    // First try user-created workspaces
    if (userCreatedWorkspaces.length > 0) {
      console.log('Found user-created workspaces, using those projects')
      allProjectsFinal = userCreatedWorkspaces.flatMap(ws => {
        console.log(`Created workspace ${ws.name} has ${ws.projects.length} projects`)
        return ws.projects.map(project => ({
          ...project,
          workspace: {
            id: ws.id,
            name: ws.name,
            slug: ws.slug,
          },
        }))
      })
    } else {
      // Get all workspaces the user is a member of (any role)
      const allUserWorkspaces = await db.workspaceMember.findMany({
        where: {
          userId: user.id,
        },
        include: {
          workspace: {
            include: {
              projects: {
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
              },
              _count: {
                select: {
                  projects: true,
                  members: true,
                },
              },
            },
          },
        },
      })

      console.log('All user workspaces:', allUserWorkspaces.length)
      
      allProjectsFinal = allUserWorkspaces.flatMap(ws => {
        console.log(`Workspace ${ws.workspace.name} has ${ws.workspace.projects.length} projects`)
        return ws.workspace.projects.map(project => ({
          ...project,
          workspace: {
            id: ws.workspace.id,
            name: ws.workspace.name,
            slug: ws.workspace.slug,
          },
        }))
      })
    }

    console.log('Total projects found (fallback):', allProjectsFinal.length)
  }

  // Get the first project for default overview (most recently updated)
  const defaultProject = allProjectsFinal.length > 0 ? allProjectsFinal[0] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all projects across your workspaces
          </p>
          {/* Debug info - remove in production */}
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Debug Info:</strong> Found {allProjectsFinal.length} projects across {userWorkspaces.length} workspaces
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{allProjectsFinal.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">P</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workspaces</p>
                <p className="text-2xl font-bold">{userWorkspaces.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <span className="text-purple-600 dark:text-purple-400 text-sm font-semibold">W</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">
                  {allProjectsFinal.reduce((sum, project) => sum + project._count.tasks, 0)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-sm font-semibold">T</span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">
                  {userWorkspaces.reduce((sum, ws) => sum + ws.workspace._count.members, 0)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <span className="text-orange-600 dark:text-orange-400 text-sm font-semibold">M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Default Project Overview or Projects Grid */}
        {defaultProject ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Project Overview</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Currently viewing:</span>
                <span className="text-sm font-medium">{defaultProject.name}</span>
                <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {defaultProject.workspace.name}
                </span>
              </div>
            </div>

            {/* Project Overview Card */}
            <div className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                    style={{ backgroundColor: defaultProject.color || '#6366f1' }}
                  >
                    {defaultProject.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{defaultProject.name}</h3>
                    <p className="text-muted-foreground">{defaultProject.description || 'No description provided'}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {defaultProject.workspace.name} • {defaultProject.key}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
                    {defaultProject.key}
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    defaultProject.status === 'active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : defaultProject.status === 'on_hold'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {defaultProject.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{defaultProject._count.tasks}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{defaultProject._count.milestones}</div>
                  <div className="text-sm text-muted-foreground">Milestones</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{defaultProject._count.members}</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round((defaultProject.tasks.filter((t: { status: string }) => t.status === 'done').length / Math.max(defaultProject._count.tasks, 1)) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Created by {defaultProject.creator.name}</span>
                  <span>•</span>
                  <span>{new Date(defaultProject.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={`/workspace/${defaultProject.workspace.slug}/projects/${defaultProject.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    View Full Project
                  </a>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
                    Quick Edit
                  </button>
                </div>
              </div>
            </div>

            {/* All Projects Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">All Projects ({allProjectsFinal.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allProjectsFinal.map((project) => (
                  <div key={project.id} className="bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold text-sm"
                          style={{ backgroundColor: project.color || '#6366f1' }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">{project.name}</h4>
                          <p className="text-xs text-muted-foreground">{project.workspace.name}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-muted px-2 py-1 rounded-full">
                        {project.key}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex space-x-3">
                        <span>{project._count.tasks} tasks</span>
                        <span>{project._count.members} members</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {project.creator.name?.charAt(0) || '?'}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {project.creator.name || 'Unknown'}
                        </span>
                      </div>
                      <a
                        href={`/workspace/${project.workspace.slug}/projects/${project.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Projects</h2>
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground">Create your first project to get started.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
