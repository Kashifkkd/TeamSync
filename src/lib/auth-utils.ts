import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { safeDbQuery } from "@/lib/db-utils"
import { redirect } from "next/navigation"
import { ROLE } from "@/lib/constants"

export async function getCurrentUser() {
  const session = await auth()
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/signin")
  }
  return user
}

export async function getUserWorkspaces(userId: string) {
  const workspaces = await safeDbQuery(() => db.workspace.findMany({
    where: {
      members: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      members: {
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          members: true,
          projects: true,
        },
      },
    },
  }), [])

  if (!workspaces) return []

  return workspaces.map((workspace) => ({
    ...workspace,
    role: workspace.members[0]?.role || ROLE.MEMBER,
    memberCount: workspace._count.members,
    projectCount: workspace._count.projects,
  }))
}

export async function getWorkspaceBySlug(slug: string, userId: string) {
  const workspace = await db.workspace.findUnique({
    where: { slug },
    include: {
      members: {
        where: { userId },
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
  })

  if (!workspace || workspace.members.length === 0) {
    return null
  }

  return {
    ...workspace,
    userRole: workspace.members[0].role,
  }
}

export async function hasWorkspaceAccess(workspaceId: string, userId: string, requiredRole?: string) {
  const member = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
  })

  if (!member) return false

  if (requiredRole) {
    const roleHierarchy: string[] = [ROLE.VIEWER, ROLE.MEMBER, ROLE.ADMIN, ROLE.OWNER]
    const userRoleIndex = roleHierarchy.indexOf(member.role)
    const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)
    
    return userRoleIndex >= requiredRoleIndex
  }

  return true
}

export async function requireWorkspaceAccess(workspaceId: string, userId: string, requiredRole?: string) {
  const hasAccess = await hasWorkspaceAccess(workspaceId, userId, requiredRole)
  if (!hasAccess) {
    redirect("/dashboard")
  }
}

export async function getProjectAccess(projectId: string, userId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      workspace: {
        include: {
          members: {
            where: { userId },
          },
        },
      },
      members: {
        where: { userId },
      },
    },
  })

  if (!project) return null

  const workspaceMember = project.workspace.members[0]
  const projectMember = project.members[0]

  return {
    hasAccess: !!workspaceMember,
    workspaceRole: workspaceMember?.role,
    projectRole: projectMember?.role,
    canEdit: workspaceMember?.role === ROLE.OWNER || workspaceMember?.role === ROLE.ADMIN || projectMember?.role === "lead",
  }
}
