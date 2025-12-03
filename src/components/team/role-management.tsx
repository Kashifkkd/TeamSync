"use client"

import { useState } from "react"
import { useWorkspaceRoles } from "@/hooks/use-workspace-roles"
import { ROLE, ROLE_LABELS } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  MoreVertical, 
  Crown, 
  Shield, 
  User, 
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import { WorkspaceRole } from "@/lib/types/team"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  memberCount: number
  isDefault: boolean
  isSystem: boolean
  color?: string
}

interface RoleManagementProps {
  workspaceId: string
  currentUserRole: WorkspaceRole
}

export function RoleManagement({ workspaceId }: RoleManagementProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  
  const {
    roles,
    isLoading,
    handleUpdateRole,
    handleDeleteRole,
    updateRoleMutation,
  } = useWorkspaceRoles({ workspaceId })

  // Default roles with permissions
  const defaultRoles: Role[] = [
    {
      id: ROLE.OWNER,
      name: ROLE_LABELS[ROLE.OWNER],
      description: 'Full access to workspace and billing',
      permissions: {
        canCreateProjects: true,
        canInviteMembers: true,
        canManageMembers: true,
        canManageSettings: true,
        canViewAnalytics: true,
        canManageBilling: true,
      },
      memberCount: 0,
      isDefault: true,
      isSystem: true,
    },
    {
      id: ROLE.ADMIN,
      name: ROLE_LABELS[ROLE.ADMIN],
      description: 'Manage projects and team members',
      permissions: {
        canCreateProjects: true,
        canInviteMembers: true,
        canManageMembers: true,
        canManageSettings: false,
        canViewAnalytics: true,
        canManageBilling: false,
      },
      memberCount: 0,
      isDefault: true,
      isSystem: true,
    },
    {
      id: ROLE.MEMBER,
      name: ROLE_LABELS[ROLE.MEMBER],
      description: 'Create and manage projects',
      permissions: {
        canCreateProjects: true,
        canInviteMembers: false,
        canManageMembers: false,
        canManageSettings: false,
        canViewAnalytics: false,
        canManageBilling: false,
      },
      memberCount: 0,
      isDefault: true,
      isSystem: true,
    },
    {
      id: ROLE.VIEWER,
      name: ROLE_LABELS[ROLE.VIEWER],
      description: 'View-only access to projects',
      permissions: {
        canCreateProjects: false,
        canInviteMembers: false,
        canManageMembers: false,
        canManageSettings: false,
        canViewAnalytics: false,
        canManageBilling: false,
      },
      memberCount: 0,
      isDefault: true,
      isSystem: true,
    },
  ]

  // Use roles from hook or fallback to default
  const currentRoles = (roles as Role[]).length > 0 ? (roles as Role[]) : defaultRoles

  const handleEditRole = (role: Role) => {
    if (role.isSystem) return // System roles cannot be edited
    setEditingRole({ ...role })
    setEditDialogOpen(true)
  }


  const handleSaveRole = async () => {
    if (!editingRole) return
    try {
      // Convert Role to WorkspaceRole format for the hook
      const workspaceRole = {
        name: editingRole.name,
        description: editingRole.description,
        permissions: Object.entries(editingRole.permissions)
          .filter(([, enabled]) => enabled)
          .map(([key]) => key),
        isSystem: editingRole.isSystem,
      }
      await handleUpdateRole(editingRole.id, workspaceRole)
      setEditDialogOpen(false)
      setEditingRole(null)
    } catch (error) {
      console.error('Error saving role:', error)
    }
  }

  const handleDeleteRoleClick = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role? This action cannot be undone.')) return
    try {
      await handleDeleteRole(roleId)
    } catch (error) {
      console.error('Error deleting role:', error)
    }
  }

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case ROLE.OWNER: return <Crown className="h-4 w-4" />
      case ROLE.ADMIN: return <Shield className="h-4 w-4" />
      case ROLE.MEMBER: return <User className="h-4 w-4" />
      case ROLE.VIEWER: return <Eye className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }


  const getPermissionsList = (permissions: string[]) => {
    const permissionMap: Record<string, string> = {
      'workspace:view': 'Workspace',
      'workspace:edit': 'Edit Workspace',
      'workspace:manage': 'Manage Workspace',
      'workspace:delete': 'Delete Workspace',
      'billing:view': 'Billing',
      'billing:manage': 'Manage Billing',
      'billing:pay': 'Payments',
      'billing:cancel': 'Cancel Subscriptions',
      'members:view': 'View Members',
      'members:invite': 'Invite Members',
      'members:remove': 'Remove Members',
      'members:manage': 'Manage Members',
      'members:promote': 'Promote Members',
      'members:demote': 'Demote Members',
      'members:suspend': 'Suspend Members',
      'members:activate': 'Activate Members',
      'projects:view': 'View Projects',
      'projects:create': 'Create Projects',
      'projects:edit': 'Edit Projects',
      'projects:delete': 'Delete Projects',
      'projects:manage': 'Manage Projects',
      'projects:archive': 'Archive Projects',
      'projects:restore': 'Restore Projects',
      'projects:duplicate': 'Duplicate Projects',
      'tasks:view': 'View Tasks',
      'tasks:create': 'Create Tasks',
      'tasks:edit': 'Edit Tasks',
      'tasks:delete': 'Delete Tasks',
      'tasks:manage': 'Manage Tasks',
      'tasks:assign': 'Assign Tasks',
      'tasks:unassign': 'Unassign Tasks',
      'roles:view': 'View Roles',
      'roles:create': 'Create Roles',
      'roles:edit': 'Edit Roles',
      'roles:delete': 'Delete Roles',
      'roles:manage': 'Manage Roles',
      'invitations:view': 'View Invitations',
      'invitations:create': 'Create Invitations',
      'invitations:edit': 'Edit Invitations',
      'invitations:delete': 'Delete Invitations',
      'invitations:manage': 'Manage Invitations',
      'analytics:view': 'View Analytics',
      'analytics:export': 'Export Analytics',
      'settings:view': 'View Settings',
      'settings:edit': 'Edit Settings',
      'settings:manage': 'Manage Settings',
      'milestones:view': 'View Milestones',
      'milestones:create': 'Create Milestones',
      'milestones:edit': 'Edit Milestones',
      'milestones:delete': 'Delete Milestones',
      'milestones:manage': 'Manage Milestones',
      'comments:view': 'View Comments',
      'comments:create': 'Create Comments',
      'comments:edit': 'Edit Comments',
      'comments:delete': 'Delete Comments',
      'comments:manage': 'Manage Comments',
      'attachments:view': 'View Attachments',
      'attachments:create': 'Create Attachments',
      'attachments:delete': 'Delete Attachments',
      'attachments:manage': 'Manage Attachments'
    }

    return permissions.map(permission => permissionMap[permission] || permission)
  }

  const renderPermissions = (permissions: string[]) => {
    const permissionsList = getPermissionsList(permissions)
    const maxVisible = 3
    const visiblePermissions = permissionsList.slice(0, maxVisible)
    const hiddenCount = permissionsList.length - maxVisible

    return (
      <div className="flex flex-wrap gap-1 items-center">
        {visiblePermissions.map((permission) => (
          <Badge key={permission} variant="outline" className="text-xs">
            {permission}
          </Badge>
        ))}
        {hiddenCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="text-xs cursor-help">
                  +{hiddenCount}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="font-medium">All Permissions:</p>
                  {permissionsList.map((permission) => (
                    <p key={permission} className="text-sm">• {permission}</p>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    )
  }


  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        {/* Roles Table Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground">
            Manage workspace roles and their permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Create a custom role with specific permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="roleName">Role Name</Label>
                <Input id="roleName" placeholder="e.g., Project Manager" />
              </div>
              <div>
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea id="roleDescription" placeholder="Describe this role's responsibilities" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace Roles ({currentRoles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRoles.map((role: Role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(role.id)}
                      <div className="font-medium">{role.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {role.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {role.isSystem ? (
                      <Badge variant="secondary" className="text-xs">
                        System
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        Custom
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {role.memberCount} member{role.memberCount !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderPermissions(role.permissions)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => handleEditRole(role)}
                          disabled={role.isSystem}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRoleClick(role.id)}
                          disabled={role.isSystem || role.memberCount > 0}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Modify the permissions for this role.
            </DialogDescription>
          </DialogHeader>
          
          {editingRole && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="editRoleName">Role Name</Label>
                  <Input 
                    id="editRoleName" 
                    value={editingRole.name}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="editRoleDescription">Description</Label>
                  <Textarea 
                    id="editRoleDescription" 
                    value={editingRole.description}
                    onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Permissions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canCreateProjects">Create Projects</Label>
                      <p className="text-xs text-muted-foreground">Create new projects</p>
                    </div>
                    <Switch
                      id="canCreateProjects"
                      checked={editingRole.permissions.canCreateProjects}
                      onCheckedChange={(checked) => 
                        setEditingRole({
                          ...editingRole,
                          permissions: { ...editingRole.permissions, canCreateProjects: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canInviteMembers">Invite Members</Label>
                      <p className="text-xs text-muted-foreground">Send invitations</p>
                    </div>
                    <Switch
                      id="canInviteMembers"
                      checked={editingRole.permissions.canInviteMembers}
                      onCheckedChange={(checked) => 
                        setEditingRole({
                          ...editingRole,
                          permissions: { ...editingRole.permissions, canInviteMembers: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canManageMembers">Manage Members</Label>
                      <p className="text-xs text-muted-foreground">Edit member roles</p>
                    </div>
                    <Switch
                      id="canManageMembers"
                      checked={editingRole.permissions.canManageMembers}
                      onCheckedChange={(checked) => 
                        setEditingRole({
                          ...editingRole,
                          permissions: { ...editingRole.permissions, canManageMembers: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canManageSettings">Manage Settings</Label>
                      <p className="text-xs text-muted-foreground">Workspace settings</p>
                    </div>
                    <Switch
                      id="canManageSettings"
                      checked={editingRole.permissions.canManageSettings}
                      onCheckedChange={(checked) => 
                        setEditingRole({
                          ...editingRole,
                          permissions: { ...editingRole.permissions, canManageSettings: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canViewAnalytics">View Analytics</Label>
                      <p className="text-xs text-muted-foreground">Access reports</p>
                    </div>
                    <Switch
                      id="canViewAnalytics"
                      checked={editingRole.permissions.canViewAnalytics}
                      onCheckedChange={(checked) => 
                        setEditingRole({
                          ...editingRole,
                          permissions: { ...editingRole.permissions, canViewAnalytics: checked }
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="canManageBilling">Manage Billing</Label>
                      <p className="text-xs text-muted-foreground">Billing & payments</p>
                    </div>
                    <Switch
                      id="canManageBilling"
                      checked={editingRole.permissions.canManageBilling}
                      onCheckedChange={(checked) => 
                        setEditingRole({
                          ...editingRole,
                          permissions: { ...editingRole.permissions, canManageBilling: checked }
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole} disabled={updateRoleMutation.isPending}>
              {updateRoleMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

