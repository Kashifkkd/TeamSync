import { redirect } from "next/navigation"
import { requireAuth, getWorkspaceBySlug, getUserWorkspaces } from "@/lib/auth-utils"
import { db } from "@/lib/db"
import { HoverSidebar } from "@/components/layout/hover-sidebar"
import { ModernNavbar } from "@/components/layout/modern-navbar"

interface WorkspaceLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function WorkspaceLayout({
  children,
  params,
}: WorkspaceLayoutProps) {
  const user = await requireAuth()
  const { slug } = await params
  
  const [workspace, userWorkspaces] = await Promise.all([
    getWorkspaceBySlug(slug, user.id!),
    getUserWorkspaces(user.id!)
  ])
  
  if (!workspace) {
    redirect("/dashboard")
  }

  // Get workspace projects for sidebar
  const projects = await db.project.findMany({
    where: {
      workspaceId: workspace.id,
    },
    select: {
      id: true,
      name: true,
      key: true,
      color: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Navbar - Full Width */}
      <ModernNavbar 
        title="TeamSync"
        workspaces={userWorkspaces as any}
        projects={projects}
        currentWorkspace={{
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          image: workspace.image || undefined,
        }}
        currentProject={projects[0] ? {
          id: projects[0].id,
          name: projects[0].name,
          key: projects[0].key,
          color: projects[0].color,
        } : undefined}
        userRole={workspace.userRole}
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
            id: user.id!,
            name: user.name || undefined,
            email: user.email || undefined,
            image: user.image || undefined,
          }}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
