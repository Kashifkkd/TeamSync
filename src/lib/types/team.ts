// Team Management Types and Constants

export type WorkspaceRole = 'owner' | 'admin' | 'member' | 'viewer'
export type ProjectRole = 'admin' | 'member' | 'viewer'

export type MemberStatus = 'active' | 'pending' | 'suspended'
export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked'

// Permission definitions
export interface Permission {
  id: string
  name: string
  description: string
  category: 'workspace' | 'project' | 'task' | 'milestone'
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[] // Permission IDs
  level: number // Higher number = more permissions
}

// Workspace permissions
export const WORKSPACE_PERMISSIONS = {
  // Workspace management
  WORKSPACE_VIEW: 'workspace:view',
  WORKSPACE_EDIT: 'workspace:edit',
  WORKSPACE_DELETE: 'workspace:delete',
  WORKSPACE_SETTINGS: 'workspace:settings',
  
  // Member management
  MEMBERS_VIEW: 'members:view',
  MEMBERS_INVITE: 'members:invite',
  MEMBERS_REMOVE: 'members:remove',
  MEMBERS_EDIT_ROLES: 'members:edit_roles',
  
  // Project management
  PROJECTS_CREATE: 'projects:create',
  PROJECTS_VIEW_ALL: 'projects:view_all',
  PROJECTS_EDIT_ALL: 'projects:edit_all',
  PROJECTS_DELETE_ALL: 'projects:delete_all',
  
  // Billing and settings
  BILLING_VIEW: 'billing:view',
  BILLING_MANAGE: 'billing:manage',
} as const

// Project permissions
export const PROJECT_PERMISSIONS = {
  // Project management
  PROJECT_VIEW: 'project:view',
  PROJECT_EDIT: 'project:edit',
  PROJECT_DELETE: 'project:delete',
  PROJECT_SETTINGS: 'project:settings',
  
  // Member management
  MEMBERS_VIEW: 'members:view',
  MEMBERS_INVITE: 'members:invite',
  MEMBERS_REMOVE: 'members:remove',
  MEMBERS_EDIT_ROLES: 'members:edit_roles',
  
  // Task management
  TASKS_VIEW: 'tasks:view',
  TASKS_CREATE: 'tasks:create',
  TASKS_EDIT: 'tasks:edit',
  TASKS_DELETE: 'tasks:delete',
  TASKS_ASSIGN: 'tasks:assign',
  
  // Milestone management
  MILESTONES_VIEW: 'milestones:view',
  MILESTONES_CREATE: 'milestones:create',
  MILESTONES_EDIT: 'milestones:edit',
  MILESTONES_DELETE: 'milestones:delete',
} as const

// Role definitions
export const WORKSPACE_ROLES: Record<WorkspaceRole, Role> = {
  owner: {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to workspace and all projects',
    level: 4,
    permissions: Object.values(WORKSPACE_PERMISSIONS),
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Manage workspace and projects, invite members',
    level: 3,
    permissions: [
      WORKSPACE_PERMISSIONS.WORKSPACE_VIEW,
      WORKSPACE_PERMISSIONS.WORKSPACE_EDIT,
      WORKSPACE_PERMISSIONS.WORKSPACE_SETTINGS,
      WORKSPACE_PERMISSIONS.MEMBERS_VIEW,
      WORKSPACE_PERMISSIONS.MEMBERS_INVITE,
      WORKSPACE_PERMISSIONS.MEMBERS_REMOVE,
      WORKSPACE_PERMISSIONS.MEMBERS_EDIT_ROLES,
      WORKSPACE_PERMISSIONS.PROJECTS_CREATE,
      WORKSPACE_PERMISSIONS.PROJECTS_VIEW_ALL,
      WORKSPACE_PERMISSIONS.PROJECTS_EDIT_ALL,
      WORKSPACE_PERMISSIONS.BILLING_VIEW,
    ],
  },
  member: {
    id: 'member',
    name: 'Member',
    description: 'Access to assigned projects and tasks',
    level: 2,
    permissions: [
      WORKSPACE_PERMISSIONS.WORKSPACE_VIEW,
      WORKSPACE_PERMISSIONS.MEMBERS_VIEW,
      WORKSPACE_PERMISSIONS.PROJECTS_VIEW_ALL,
    ],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to workspace',
    level: 1,
    permissions: [
      WORKSPACE_PERMISSIONS.WORKSPACE_VIEW,
      WORKSPACE_PERMISSIONS.PROJECTS_VIEW_ALL,
    ],
  },
}

export const PROJECT_ROLES: Record<ProjectRole, Role> = {
  admin: {
    id: 'admin',
    name: 'Admin',
    description: 'Full access to project',
    level: 3,
    permissions: Object.values(PROJECT_PERMISSIONS),
  },
  member: {
    id: 'member',
    name: 'Member',
    description: 'Can create and edit tasks, view all content',
    level: 2,
    permissions: [
      PROJECT_PERMISSIONS.PROJECT_VIEW,
      PROJECT_PERMISSIONS.MEMBERS_VIEW,
      PROJECT_PERMISSIONS.TASKS_VIEW,
      PROJECT_PERMISSIONS.TASKS_CREATE,
      PROJECT_PERMISSIONS.TASKS_EDIT,
      PROJECT_PERMISSIONS.TASKS_ASSIGN,
      PROJECT_PERMISSIONS.MILESTONES_VIEW,
      PROJECT_PERMISSIONS.MILESTONES_CREATE,
      PROJECT_PERMISSIONS.MILESTONES_EDIT,
    ],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to project',
    level: 1,
    permissions: [
      PROJECT_PERMISSIONS.PROJECT_VIEW,
      PROJECT_PERMISSIONS.MEMBERS_VIEW,
      PROJECT_PERMISSIONS.TASKS_VIEW,
      PROJECT_PERMISSIONS.MILESTONES_VIEW,
    ],
  },
}

// Type definitions for API responses
export interface WorkspaceMemberWithUser {
  id: string
  role: WorkspaceRole
  status: MemberStatus
  joinedAt: Date
  invitedAt?: Date
  invitedBy?: string
  user?: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  inviter?: {
    id: string
    name: string | null
    email: string
  }
}

export interface ProjectMemberWithUser {
  id: string
  role: ProjectRole
  status: MemberStatus
  joinedAt: Date
  invitedAt?: Date
  invitedBy?: string
  user?: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  inviter?: {
    id: string
    name: string | null
    email: string
  }
}

export interface WorkspaceInviteWithDetails {
  id: string
  email: string
  role: WorkspaceRole
  status: InviteStatus
  token: string
  expiresAt: Date
  invitedAt: Date
  acceptedAt?: Date
  inviter: {
    id: string
    name: string | null
    email: string
  }
}

export interface ProjectInviteWithDetails {
  id: string
  email: string
  role: ProjectRole
  status: InviteStatus
  token: string
  expiresAt: Date
  invitedAt: Date
  acceptedAt?: Date
  inviter: {
    id: string
    name: string | null
    email: string
  }
}

// Invite request types
export interface InviteWorkspaceMemberRequest {
  email: string
  role: WorkspaceRole
}

export interface InviteProjectMemberRequest {
  email: string
  role: ProjectRole
}

// Permission checking utilities
export function hasWorkspacePermission(
  userRole: WorkspaceRole,
  permission: string
): boolean {
  const role = WORKSPACE_ROLES[userRole]
  return role.permissions.includes(permission)
}

export function hasProjectPermission(
  userRole: ProjectRole,
  permission: string
): boolean {
  const role = PROJECT_ROLES[userRole]
  return role.permissions.includes(permission)
}

export function canCreateProject(userRole: WorkspaceRole): boolean {
  return hasWorkspacePermission(userRole, WORKSPACE_PERMISSIONS.PROJECTS_CREATE)
}

export function canInviteMembers(userRole: WorkspaceRole): boolean {
  return hasWorkspacePermission(userRole, WORKSPACE_PERMISSIONS.MEMBERS_INVITE)
}

export function canManageMembers(userRole: WorkspaceRole): boolean {
  return hasWorkspacePermission(userRole, WORKSPACE_PERMISSIONS.MEMBERS_EDIT_ROLES)
}
