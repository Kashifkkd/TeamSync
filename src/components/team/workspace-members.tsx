"use client"

import { useState } from "react"
import { useWorkspaceMembers } from "@/hooks/use-workspace-members"
import { ROLE, ROLE_LABELS } from "@/lib/constants"
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
  MoreVertical, 
  UserPlus, 
  Crown, 
  Shield, 
  User, 
  Eye,
  Trash2
} from "lucide-react"
import { Skeleton } from "../ui/skeleton"

interface WorkspaceMemberWithUser {
  id: string
  role: string
  joinedAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  } | null
}

interface WorkspaceMembersProps {
  workspaceId: string
  currentUserRole: string
}

export function WorkspaceMembers({ workspaceId, currentUserRole }: WorkspaceMembersProps) {
  const {
    members,
    isLoading: loading,
    handleInviteMember,
    handleUpdateMemberRole,
    handleRemoveMember,
    inviteMemberMutation,
  } = useWorkspaceMembers({ workspaceId })
  
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<string>(ROLE.MEMBER)
  const [emailError, setEmailError] = useState("")
  const [inviteSuccess, setInviteSuccess] = useState("")

  const canInvite = currentUserRole === ROLE.OWNER || currentUserRole === ROLE.ADMIN
  const canManage = currentUserRole === ROLE.OWNER || currentUserRole === ROLE.ADMIN


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address")
      return false
    }
    setEmailError("")
    return true
  }

  const handleInvite = async () => {
    if (!inviteEmail || !inviteRole) return
    
    if (!validateEmail(inviteEmail)) return

    try {
      setEmailError("")
      setInviteSuccess("")
      
      await handleInviteMember(inviteEmail, inviteRole)
      setInviteSuccess(`Invitation sent successfully to ${inviteEmail}`)
      setInviteEmail("")
      setInviteRole(ROLE.MEMBER)
      
      // Close dialog after a short delay
      setTimeout(() => {
        setInviteDialogOpen(false)
        setInviteSuccess("")
      }, 2000)
    } catch (error) {
      console.error('Error inviting member:', error)
      setEmailError(error instanceof Error ? error.message : 'Failed to send invitation')
    }
  }

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await handleUpdateMemberRole(memberId, newRole)
    } catch (error) {
      console.error('Error updating role:', error)
      // TODO: Show toast notification
    }
  }

  const handleRemoveMemberClick = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await handleRemoveMember(memberId)
    } catch (error) {
      console.error('Error removing member:', error)
      // TODO: Show toast notification
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case ROLE.OWNER: return <Crown className="h-4 w-4" />
      case ROLE.ADMIN: return <Shield className="h-4 w-4" />
      case ROLE.MEMBER: return <User className="h-4 w-4" />
      case ROLE.VIEWER: return <Eye className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case ROLE.OWNER: return 'bg-purple-100 text-purple-800'
      case ROLE.ADMIN: return 'bg-blue-100 text-blue-800'
      case ROLE.MEMBER: return 'bg-green-100 text-green-800'
      case ROLE.VIEWER: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }


  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
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
    )
  }

  return (
    <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Members ({(members as WorkspaceMemberWithUser[]).length})</CardTitle>
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
                  <DialogTitle>Invite Team Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to join this workspace.
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
                      onChange={(e) => {
                        setInviteEmail(e.target.value)
                        if (emailError) setEmailError("")
                      }}
                      className={emailError ? "border-red-500" : ""}
                    />
                    {emailError && (
                      <p className="text-sm text-red-500 mt-1">{emailError}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={(value) => setInviteRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(ROLE_LABELS).map(([roleId, roleName]) => (
                          <SelectItem key={roleId} value={roleId}>
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(roleId)}
                              <span>{roleName}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 p-3 bg-muted/50 rounded-md">
                      <p className="text-sm text-muted-foreground">
                        {inviteRole === ROLE.OWNER && 'Full access to workspace and billing'}
                        {inviteRole === ROLE.ADMIN && 'Manage projects and team members'}
                        {inviteRole === ROLE.MEMBER && 'Create and manage projects'}
                        {inviteRole === ROLE.VIEWER && 'View-only access to projects'}
                      </p>
                    </div>
                  </div>
                  {inviteSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-800">{inviteSuccess}</p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleInvite} disabled={inviteMemberMutation.isPending || !inviteEmail}>
                    {inviteMemberMutation.isPending ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(members as WorkspaceMemberWithUser[]).map((member: WorkspaceMemberWithUser) => (
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
                  <span>{ROLE_LABELS[member.role as keyof typeof ROLE_LABELS]}</span>
                </Badge>
                {canManage && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, ROLE.ADMIN)}>
                        <Shield className="h-4 w-4 mr-2" />
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, ROLE.MEMBER)}>
                        <User className="h-4 w-4 mr-2" />
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRoleChange(member.id, ROLE.VIEWER)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Make Viewer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleRemoveMemberClick(member.id)}
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
          {(members as WorkspaceMemberWithUser[]).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No team members yet. Invite your first team member to get started.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
