/**
 * Centralized permissions and constants for the entire project
 * This file defines all permissions, roles, and related constants
 */

// ============================================================================
// PERMISSION CATEGORIES
// ============================================================================

export const PERMISSION_CATEGORIES = {
  WORKSPACE: 'workspace',
  BILLING: 'billing', 
  MEMBERS: 'members',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  ROLES: 'roles',
  INVITATIONS: 'invitations',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings',
  MILESTONES: 'milestones',
  COMMENTS: 'comments',
  ATTACHMENTS: 'attachments'
} as const

// ============================================================================
// PERMISSION ACTIONS
// ============================================================================

export const PERMISSION_ACTIONS = {
  // General actions
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  MANAGE: 'manage',
  
  // Specific actions
  INVITE: 'invite',
  REMOVE: 'remove',
  ASSIGN: 'assign',
  UNASSIGN: 'unassign',
  ARCHIVE: 'archive',
  RESTORE: 'restore',
  EXPORT: 'export',
  IMPORT: 'import',
  DUPLICATE: 'duplicate',
  
  // Billing specific
  PAY: 'pay',
  CANCEL: 'cancel',
  UPGRADE: 'upgrade',
  DOWNGRADE: 'downgrade',
  
  // Member specific
  PROMOTE: 'promote',
  DEMOTE: 'demote',
  SUSPEND: 'suspend',
  ACTIVATE: 'activate'
} as const

// ============================================================================
// PERMISSION DEFINITIONS
// ============================================================================

export const PERMISSIONS = {
  // Workspace permissions
  [`${PERMISSION_CATEGORIES.WORKSPACE}:${PERMISSION_ACTIONS.VIEW}`]: 'View workspace information',
  [`${PERMISSION_CATEGORIES.WORKSPACE}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit workspace settings',
  [`${PERMISSION_CATEGORIES.WORKSPACE}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full workspace management',
  [`${PERMISSION_CATEGORIES.WORKSPACE}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete workspace',
  
  // Billing permissions
  [`${PERMISSION_CATEGORIES.BILLING}:${PERMISSION_ACTIONS.VIEW}`]: 'View billing information',
  [`${PERMISSION_CATEGORIES.BILLING}:${PERMISSION_ACTIONS.MANAGE}`]: 'Manage billing and subscriptions',
  [`${PERMISSION_CATEGORIES.BILLING}:${PERMISSION_ACTIONS.PAY}`]: 'Make payments',
  [`${PERMISSION_CATEGORIES.BILLING}:${PERMISSION_ACTIONS.CANCEL}`]: 'Cancel subscriptions',
  
  // Member permissions
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.VIEW}`]: 'View team members',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.INVITE}`]: 'Invite new members',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.REMOVE}`]: 'Remove members',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Manage member roles and permissions',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.PROMOTE}`]: 'Promote members',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.DEMOTE}`]: 'Demote members',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.SUSPEND}`]: 'Suspend members',
  [`${PERMISSION_CATEGORIES.MEMBERS}:${PERMISSION_ACTIONS.ACTIVATE}`]: 'Activate members',
  
  // Project permissions
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.VIEW}`]: 'View projects',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.CREATE}`]: 'Create new projects',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit project details',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete projects',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full project management',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.ARCHIVE}`]: 'Archive projects',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.RESTORE}`]: 'Restore archived projects',
  [`${PERMISSION_CATEGORIES.PROJECTS}:${PERMISSION_ACTIONS.DUPLICATE}`]: 'Duplicate projects',
  
  // Task permissions
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.VIEW}`]: 'View tasks',
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.CREATE}`]: 'Create new tasks',
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit task details',
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete tasks',
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full task management',
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.ASSIGN}`]: 'Assign tasks to members',
  [`${PERMISSION_CATEGORIES.TASKS}:${PERMISSION_ACTIONS.UNASSIGN}`]: 'Unassign tasks',
  
  // Role permissions
  [`${PERMISSION_CATEGORIES.ROLES}:${PERMISSION_ACTIONS.VIEW}`]: 'View roles and permissions',
  [`${PERMISSION_CATEGORIES.ROLES}:${PERMISSION_ACTIONS.CREATE}`]: 'Create custom roles',
  [`${PERMISSION_CATEGORIES.ROLES}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit role permissions',
  [`${PERMISSION_CATEGORIES.ROLES}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete custom roles',
  [`${PERMISSION_CATEGORIES.ROLES}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full role management',
  
  // Invitation permissions
  [`${PERMISSION_CATEGORIES.INVITATIONS}:${PERMISSION_ACTIONS.VIEW}`]: 'View invitations',
  [`${PERMISSION_CATEGORIES.INVITATIONS}:${PERMISSION_ACTIONS.CREATE}`]: 'Send invitations',
  [`${PERMISSION_CATEGORIES.INVITATIONS}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit invitations',
  [`${PERMISSION_CATEGORIES.INVITATIONS}:${PERMISSION_ACTIONS.DELETE}`]: 'Cancel invitations',
  [`${PERMISSION_CATEGORIES.INVITATIONS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full invitation management',
  
  // Analytics permissions
  [`${PERMISSION_CATEGORIES.ANALYTICS}:${PERMISSION_ACTIONS.VIEW}`]: 'View analytics and reports',
  [`${PERMISSION_CATEGORIES.ANALYTICS}:${PERMISSION_ACTIONS.EXPORT}`]: 'Export analytics data',
  
  // Settings permissions
  [`${PERMISSION_CATEGORIES.SETTINGS}:${PERMISSION_ACTIONS.VIEW}`]: 'View workspace settings',
  [`${PERMISSION_CATEGORIES.SETTINGS}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit workspace settings',
  [`${PERMISSION_CATEGORIES.SETTINGS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full settings management',
  
  // Milestone permissions
  [`${PERMISSION_CATEGORIES.MILESTONES}:${PERMISSION_ACTIONS.VIEW}`]: 'View milestones',
  [`${PERMISSION_CATEGORIES.MILESTONES}:${PERMISSION_ACTIONS.CREATE}`]: 'Create milestones',
  [`${PERMISSION_CATEGORIES.MILESTONES}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit milestones',
  [`${PERMISSION_CATEGORIES.MILESTONES}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete milestones',
  [`${PERMISSION_CATEGORIES.MILESTONES}:${PERMISSION_ACTIONS.MANAGE}`]: 'Full milestone management',
  
  // Comment permissions
  [`${PERMISSION_CATEGORIES.COMMENTS}:${PERMISSION_ACTIONS.VIEW}`]: 'View comments',
  [`${PERMISSION_CATEGORIES.COMMENTS}:${PERMISSION_ACTIONS.CREATE}`]: 'Add comments',
  [`${PERMISSION_CATEGORIES.COMMENTS}:${PERMISSION_ACTIONS.EDIT}`]: 'Edit comments',
  [`${PERMISSION_CATEGORIES.COMMENTS}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete comments',
  [`${PERMISSION_CATEGORIES.COMMENTS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Manage all comments',
  
  // Attachment permissions
  [`${PERMISSION_CATEGORIES.ATTACHMENTS}:${PERMISSION_ACTIONS.VIEW}`]: 'View attachments',
  [`${PERMISSION_CATEGORIES.ATTACHMENTS}:${PERMISSION_ACTIONS.CREATE}`]: 'Upload attachments',
  [`${PERMISSION_CATEGORIES.ATTACHMENTS}:${PERMISSION_ACTIONS.DELETE}`]: 'Delete attachments',
  [`${PERMISSION_CATEGORIES.ATTACHMENTS}:${PERMISSION_ACTIONS.MANAGE}`]: 'Manage all attachments'
} as const

// ============================================================================
// PERMISSION DESCRIPTIONS
// ============================================================================

export const PERMISSION_DESCRIPTIONS = {
  // Workspace
  'workspace:view': 'View basic workspace information and settings',
  'workspace:edit': 'Edit workspace name, description, and basic settings',
  'workspace:manage': 'Full control over workspace settings and configuration',
  'workspace:delete': 'Delete the entire workspace and all its data',
  
  // Billing
  'billing:view': 'View billing information, invoices, and payment history',
  'billing:manage': 'Manage billing settings, payment methods, and subscriptions',
  'billing:pay': 'Make payments and update payment methods',
  'billing:cancel': 'Cancel subscriptions and manage billing lifecycle',
  
  // Members
  'members:view': 'View team member list and basic information',
  'members:invite': 'Send invitations to new team members',
  'members:remove': 'Remove members from the workspace',
  'members:manage': 'Manage member roles, permissions, and status',
  'members:promote': 'Promote members to higher roles',
  'members:demote': 'Demote members to lower roles',
  'members:suspend': 'Suspend member accounts',
  'members:activate': 'Reactivate suspended member accounts',
  
  // Projects
  'projects:view': 'View all projects in the workspace',
  'projects:create': 'Create new projects',
  'projects:edit': 'Edit project details, settings, and configuration',
  'projects:delete': 'Delete projects permanently',
  'projects:manage': 'Full control over project management',
  'projects:archive': 'Archive completed or inactive projects',
  'projects:restore': 'Restore archived projects',
  'projects:duplicate': 'Duplicate existing projects',
  
  // Tasks
  'tasks:view': 'View tasks and their details',
  'tasks:create': 'Create new tasks',
  'tasks:edit': 'Edit task details, status, and assignments',
  'tasks:delete': 'Delete tasks',
  'tasks:manage': 'Full control over task management',
  'tasks:assign': 'Assign tasks to team members',
  'tasks:unassign': 'Remove task assignments',
  
  // Roles
  'roles:view': 'View available roles and their permissions',
  'roles:create': 'Create custom roles with specific permissions',
  'roles:edit': 'Edit role permissions and settings',
  'roles:delete': 'Delete custom roles',
  'roles:manage': 'Full control over role management',
  
  // Invitations
  'invitations:view': 'View pending and sent invitations',
  'invitations:create': 'Send new invitations to team members',
  'invitations:edit': 'Edit invitation details and roles',
  'invitations:delete': 'Cancel pending invitations',
  'invitations:manage': 'Full control over invitation management',
  
  // Analytics
  'analytics:view': 'View workspace analytics and reports',
  'analytics:export': 'Export analytics data and reports',
  
  // Settings
  'settings:view': 'View workspace settings and configuration',
  'settings:edit': 'Edit workspace settings and preferences',
  'settings:manage': 'Full control over workspace settings',
  
  // Milestones
  'milestones:view': 'View project milestones and progress',
  'milestones:create': 'Create new milestones',
  'milestones:edit': 'Edit milestone details and dates',
  'milestones:delete': 'Delete milestones',
  'milestones:manage': 'Full control over milestone management',
  
  // Comments
  'comments:view': 'View comments on tasks and projects',
  'comments:create': 'Add comments to tasks and projects',
  'comments:edit': 'Edit own comments',
  'comments:delete': 'Delete own comments',
  'comments:manage': 'Manage all comments (edit/delete any comment)',
  
  // Attachments
  'attachments:view': 'View file attachments',
  'attachments:create': 'Upload file attachments',
  'attachments:delete': 'Delete file attachments',
  'attachments:manage': 'Manage all file attachments'
} as const

// ============================================================================
// ROLE CONSTANTS
// ============================================================================

export const ROLE = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const

export const ROLE_LABELS = {
  [ROLE.OWNER]: 'Owner',
  [ROLE.ADMIN]: 'Admin',
  [ROLE.MEMBER]: 'Member',
  [ROLE.VIEWER]: 'Viewer',
} as const

// ============================================================================
// SYSTEM ROLE DEFINITIONS
// ============================================================================

export const SYSTEM_ROLES = {
  OWNER: {
    id: 'owner',
    name: 'Owner',
    description: 'Full access to workspace, billing, and all features',
    isSystem: true,
    color: '#8b5cf6',
    permissions: [
      // Workspace
      'workspace:view',
      'workspace:edit', 
      'workspace:manage',
      'workspace:delete',
      
      // Billing
      'billing:view',
      'billing:manage',
      'billing:pay',
      'billing:cancel',
      
      // Members
      'members:view',
      'members:invite',
      'members:remove',
      'members:manage',
      'members:promote',
      'members:demote',
      'members:suspend',
      'members:activate',
      
      // Projects
      'projects:view',
      'projects:create',
      'projects:edit',
      'projects:delete',
      'projects:manage',
      'projects:archive',
      'projects:restore',
      'projects:duplicate',
      
      // Tasks
      'tasks:view',
      'tasks:create',
      'tasks:edit',
      'tasks:delete',
      'tasks:manage',
      'tasks:assign',
      'tasks:unassign',
      
      // Roles
      'roles:view',
      'roles:create',
      'roles:edit',
      'roles:delete',
      'roles:manage',
      
      // Invitations
      'invitations:view',
      'invitations:create',
      'invitations:edit',
      'invitations:delete',
      'invitations:manage',
      
      // Analytics
      'analytics:view',
      'analytics:export',
      
      // Settings
      'settings:view',
      'settings:edit',
      'settings:manage',
      
      // Milestones
      'milestones:view',
      'milestones:create',
      'milestones:edit',
      'milestones:delete',
      'milestones:manage',
      
      // Comments
      'comments:view',
      'comments:create',
      'comments:edit',
      'comments:delete',
      'comments:manage',
      
      // Attachments
      'attachments:view',
      'attachments:create',
      'attachments:delete',
      'attachments:manage'
    ]
  },
  
  ADMIN: {
    id: 'admin',
    name: 'Admin',
    description: 'Manage projects, team members, and workspace settings',
    isSystem: true,
    color: '#3b82f6',
    permissions: [
      // Workspace
      'workspace:view',
      'workspace:edit',
      
      // Members
      'members:view',
      'members:invite',
      'members:remove',
      'members:manage',
      'members:promote',
      'members:demote',
      
      // Projects
      'projects:view',
      'projects:create',
      'projects:edit',
      'projects:delete',
      'projects:manage',
      'projects:archive',
      'projects:restore',
      'projects:duplicate',
      
      // Tasks
      'tasks:view',
      'tasks:create',
      'tasks:edit',
      'tasks:delete',
      'tasks:manage',
      'tasks:assign',
      'tasks:unassign',
      
      // Roles
      'roles:view',
      
      // Invitations
      'invitations:view',
      'invitations:create',
      'invitations:edit',
      'invitations:delete',
      'invitations:manage',
      
      // Analytics
      'analytics:view',
      'analytics:export',
      
      // Settings
      'settings:view',
      'settings:edit',
      
      // Milestones
      'milestones:view',
      'milestones:create',
      'milestones:edit',
      'milestones:delete',
      'milestones:manage',
      
      // Comments
      'comments:view',
      'comments:create',
      'comments:edit',
      'comments:delete',
      'comments:manage',
      
      // Attachments
      'attachments:view',
      'attachments:create',
      'attachments:delete',
      'attachments:manage'
    ]
  },
  
  MEMBER: {
    id: 'member',
    name: 'Member',
    description: 'Create and manage projects and tasks',
    isSystem: true,
    color: '#10b981',
    permissions: [
      // Workspace
      'workspace:view',
      
      // Projects
      'projects:view',
      'projects:create',
      'projects:edit',
      
      // Tasks
      'tasks:view',
      'tasks:create',
      'tasks:edit',
      'tasks:assign',
      'tasks:unassign',
      
      // Invitations
      'invitations:view',
      
      // Analytics
      'analytics:view',
      
      // Settings
      'settings:view',
      
      // Milestones
      'milestones:view',
      'milestones:create',
      'milestones:edit',
      
      // Comments
      'comments:view',
      'comments:create',
      'comments:edit',
      'comments:delete',
      
      // Attachments
      'attachments:view',
      'attachments:create',
      'attachments:delete'
    ]
  },
  
  VIEWER: {
    id: 'viewer',
    name: 'Viewer',
    description: 'View-only access to projects and tasks',
    isSystem: true,
    color: '#6b7280',
    permissions: [
      // Workspace
      'workspace:view',
      
      // Projects
      'projects:view',
      
      // Tasks
      'tasks:view',
      
      // Invitations
      'invitations:view',
      
      // Analytics
      'analytics:view',
      
      // Settings
      'settings:view',
      
      // Milestones
      'milestones:view',
      
      // Comments
      'comments:view',
      'comments:create',
      
      // Attachments
      'attachments:view'
    ]
  }
} as const

// ============================================================================
// PERMISSION UTILITIES
// ============================================================================

export type Permission = keyof typeof PERMISSIONS
export type PermissionCategory = keyof typeof PERMISSION_CATEGORIES
export type PermissionAction = keyof typeof PERMISSION_ACTIONS
export type SystemRole = keyof typeof SYSTEM_ROLES

/**
 * Check if a user has a specific permission
 */
export function hasPermission(userPermissions: string[], permission: string): boolean {
  return userPermissions.includes(permission)
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(userPermissions: string[], permissions: string[]): boolean {
  return permissions.some(permission => userPermissions.includes(permission))
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(userPermissions: string[], permissions: string[]): boolean {
  return permissions.every(permission => userPermissions.includes(permission))
}

/**
 * Get permissions for a system role
 */
export function getSystemRolePermissions(roleId: SystemRole): readonly string[] {
  return SYSTEM_ROLES[roleId].permissions
}

/**
 * Get all permissions grouped by category
 */
export function getPermissionsByCategory(): Record<PermissionCategory, Permission[]> {
  const grouped: Record<string, Permission[]> = {}
  
  Object.keys(PERMISSION_CATEGORIES).forEach(category => {
    grouped[category] = Object.keys(PERMISSIONS).filter(permission => 
      permission.startsWith(`${category.toLowerCase()}:`)
    ) as Permission[]
  })
  
  return grouped as Record<PermissionCategory, Permission[]>
}

/**
 * Get permission description
 */
export function getPermissionDescription(permission: string): string {
  return (PERMISSION_DESCRIPTIONS as Record<string, string>)[permission] || 'No description available'
}

/**
 * Validate if a permission string is valid
 */
export function isValidPermission(permission: string): boolean {
  return permission in PERMISSIONS
}

/**
 * Get all system roles
 */
export function getAllSystemRoles() {
  return Object.values(SYSTEM_ROLES)
}

/**
 * Get system role by ID
 */
export function getSystemRoleById(roleId: string) {
  return Object.values(SYSTEM_ROLES).find(role => role.id === roleId)
}

/**
 * Check if a role is a system role
 */
export function isSystemRole(roleId: string): boolean {
  return Object.values(SYSTEM_ROLES).some(role => role.id === roleId)
}
