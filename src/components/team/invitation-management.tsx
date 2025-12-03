"use client"

import { useWorkspaceInvitations } from "@/hooks/use-workspace-invitations"
import { INVITE_STATUS, INVITE_STATUS_LABELS, ROLE } from "@/lib/constants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Mail, 
  MoreVertical, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Copy,
  RefreshCw,
  Trash2,
  Crown,
  Shield,
  User,
  Eye
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
interface Invitation {
  id: string
  email: string
  role: string
  status: string
  invitedAt: string
  expiresAt: string
  acceptedAt?: string
  inviter: {
    id: string
    name: string
    email: string
  }
}

interface InvitationManagementProps {
  workspaceId: string
  currentUserRole: string
}

export function InvitationManagement({ workspaceId }: InvitationManagementProps) {
  const {
    invitations,
    isLoading: loading,
    refreshInvitations,
    handleResendInvitation,
    handleCancelInvitation,
    handleCopyInviteLink,
    resendInvitationMutation,
    cancelInvitationMutation,
  } = useWorkspaceInvitations({ workspaceId })



  const getRoleIcon = (role: string) => {
    switch (role) {
      case ROLE.OWNER: return <Crown className="h-4 w-4" />
      case ROLE.ADMIN: return <Shield className="h-4 w-4" />
      case ROLE.MEMBER: return <User className="h-4 w-4" />
      case ROLE.VIEWER: return <Eye className="h-4 w-4" />
      default: return <User className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case INVITE_STATUS.PENDING: return <Clock className="h-4 w-4" />
      case INVITE_STATUS.ACCEPTED: return <CheckCircle className="h-4 w-4" />
      case INVITE_STATUS.EXPIRED: return <XCircle className="h-4 w-4" />
      case INVITE_STATUS.REVOKED: return <XCircle className="h-4 w-4" />
      default: return <Mail className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case INVITE_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800'
      case INVITE_STATUS.ACCEPTED: return 'bg-green-100 text-green-800'
      case INVITE_STATUS.EXPIRED: return 'bg-gray-100 text-gray-800'
      case INVITE_STATUS.REVOKED: return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }


  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-20" />
        </div>

        {/* Invitations Table Skeleton */}
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
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pending Invitations</h2>
          <p className="text-sm text-muted-foreground">
            Manage invitations sent to join this workspace
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshInvitations}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Invitations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Invitations ({(invitations as Invitation[]).length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(invitations as Invitation[]).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No invitations found</p>
              <p className="text-sm">All invitations have been processed or none have been sent yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited By</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(invitations as Invitation[]).map((invitation: Invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(invitation.role)}
                        <span className="capitalize">{invitation.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(invitation.status)} flex items-center space-x-1 w-fit`}>
                        {getStatusIcon(invitation.status)}
                        <span className="ml-1">{INVITE_STATUS_LABELS[invitation.status as keyof typeof INVITE_STATUS_LABELS]}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{invitation.inviter.name}</p>
                        <p className="text-xs text-muted-foreground">{invitation.inviter.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(invitation.invitedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {isExpired(invitation.expiresAt) ? (
                        <span className="text-red-500">Expired</span>
                      ) : (
                        formatDate(invitation.expiresAt)
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {invitation.status === INVITE_STATUS.PENDING && !isExpired(invitation.expiresAt) && (
                            <>
                              <DropdownMenuItem onClick={() => handleCopyInviteLink(invitation.id)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Invite Link
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleResendInvitation(invitation.id)}
                                disabled={resendInvitationMutation.isPending}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {resendInvitationMutation.isPending ? 'Sending...' : 'Resend Invitation'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="text-destructive"
                            disabled={cancelInvitationMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {cancelInvitationMutation.isPending ? 'Canceling...' : 'Cancel Invitation'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
