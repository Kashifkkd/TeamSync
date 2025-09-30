"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  User, 
  Eye,
  Trash2
} from "lucide-react"
import { ProjectMemberWithUser, ProjectRole, PROJECT_ROLES } from "@/lib/types/team"

interface ProjectMembersProps {
  projectId: string
  currentUserRole: ProjectRole
}

export function ProjectMembers({ projectId, currentUserRole }: ProjectMembersProps) {
  const [members, setMembers] = useState<ProjectMemberWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<ProjectRole>("member")
  const [inviting, setInviting] = useState(false)

  const canInvite = currentUserRole === "admin"
  const canManage = currentUserRole === "admin"

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/workspaces/${projectId}/members`)
      if (!response.ok) throw new Error('Failed to fetch members')
      
      const data = await response.json()
      setMembers(data.members)
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInvite = async () => {
    if (!inviteEmail || !inviteRole) return

    try {
      setInviting(true)
      const response = await fetch(`/api/workspaces/${projectId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to send invitation')
      }

      setInviteEmail("")
      setInviteRole("member")
      setInviteDialogOpen(false)
      fetchMembers()
    } catch (error) {
      console.error('Error inviting member:', error)
      // TODO: Show toast notification
    } finally {
      setInviting(false)
    }
  }

  const handleRoleChange = async (memberId: string, newRole: ProjectRole) => {
    try {
      const response = await fetch(`/api/workspaces/${projectId}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update role')
      }

      fetchMembers()
    } catch (error) {
      console.error('Error updating role:', error)
      // TODO: Show toast notification
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      const response = await fetch(`/api/workspaces/${projectId}/members/${memberId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to remove member')
      }

      fetchMembers()
    } catch (error) {
      console.error('Error removing member:', error)
      // TODO: Show toast notification
    }
  }

  const getRoleIcon = (role: ProjectRole) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4" />
      case 'member': return <User className="h-4 w-4" />
      case 'viewer': return <Eye className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: ProjectRole) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'member': return 'bg-green-100 text-green-800'
      case 'viewer': return 'bg-gray-100 text-gray-800'
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [projectId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Members</CardTitle>
          {canInvite && (
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Invite Project Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join this project.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as ProjectRole)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PROJECT_ROLES).map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(role.id as ProjectRole)}
                              <span>{role.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
                    {inviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.user?.image || undefined} />
                  <AvatarFallback>
                    {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {member.user?.name || 'Pending Invitation'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {member.user?.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={`${getRoleColor(member.role)} flex items-center space-x-1`}>
                  {getRoleIcon(member.role)}
                  <span>{PROJECT_ROLES[member.role].name}</span>
                </Badge>
                {canManage && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                        <User className="h-4 w-4 mr-2" />
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'viewer')}>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No project members yet. Invite your first team member to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
